'use client'

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

// ─── Public API exposed to parent via ref ─────────────────────────────────────

export interface SquarePaymentHandle {
  /** Tokenizes the card. Returns token string or throws on failure. */
  tokenize(): Promise<string>
  /** Returns card details from the last successful tokenize call */
  getCardDetails(): { brand?: string; last4?: string; expMonth?: number; expYear?: number } | null
  /** True once the card form is mounted and ready */
  isReady: boolean
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  appId:      string
  locationId: string
  onReady?:   () => void
  onError?:   (msg: string) => void
}

type Status = 'idle' | 'loading' | 'ready' | 'error'

const MAX_RETRIES    = 3
const RETRY_DELAY_MS = 1500

// ─── Singleton script loader ──────────────────────────────────────────────────

let _scriptPromise: Promise<void> | null = null
let _loadedSrc: string | null = null

function getSquareSrc(): string {
  const src = process.env.NEXT_PUBLIC_SQUARE_CDN_LINK
  if (!src) throw new Error('NEXT_PUBLIC_SQUARE_CDN_LINK is not defined')
  return src
}

function resetSquareSingleton() {
  const src = _loadedSrc
  if (src) {
    const old = document.querySelector(`script[src="${src}"]`)
    old?.remove()
  }
  delete (window as any).Square
  _scriptPromise = null
  _loadedSrc = null
}

function loadSquareScript(): Promise<void> {
  const expectedSrc = getSquareSrc()

  if (_loadedSrc && _loadedSrc !== expectedSrc) {
    resetSquareSingleton()
  }

  if (_scriptPromise) return _scriptPromise

  _scriptPromise = new Promise((resolve, reject) => {
    // Already fully ready
    if ((window as any).Square && _loadedSrc === expectedSrc) {
      resolve(); return
    }
    // Script tag already in DOM (e.g. preloaded by layout) — don't add a second one
    const existing = document.querySelector(`script[src="${expectedSrc}"]`)
    if (existing) {
      _loadedSrc = expectedSrc
      resolve(); return
    }
    const s = document.createElement('script')
    s.src = expectedSrc
    s.onload  = () => { _loadedSrc = expectedSrc; resolve() }
    s.onerror = () => {
      _scriptPromise = null
      _loadedSrc = null
      reject(new Error('Square.js failed to load'))
    }
    document.head.appendChild(s)
  })
  return _scriptPromise
}

// Wait for window.Square to become available (script can load before SDK is ready)
function waitForSquareGlobal(timeoutMs = 5000): Promise<any> {
  return new Promise((resolve, reject) => {
    if ((window as any).Square) { resolve((window as any).Square); return }
    const interval = setInterval(() => {
      if ((window as any).Square) {
        clearInterval(interval)
        resolve((window as any).Square)
      }
    }, 100)
    setTimeout(() => {
      clearInterval(interval)
      reject(new Error('Square global not available after timeout'))
    }, timeoutMs)
  })
}

function delay(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms))
}

// ─── Component ────────────────────────────────────────────────────────────────

const SquarePayment = forwardRef<SquarePaymentHandle, Props>(function SquarePayment(
  { appId, locationId, onReady, onError },
  ref,
) {
  const rawId   = useId()
  const sqId    = `sq-card-${rawId.replace(/:/g, '')}`

  const [status, setStatus]   = useState<Status>('idle')
  const [errMsg, setErrMsg]   = useState('')
  const [attempt, setAttempt] = useState(0)

  const cardRef             = useRef<any>(null)
  const initingRef          = useRef(false)
  const destroyedRef        = useRef(false)
  const lastCardDetails     = useRef<{ brand?: string; last4?: string; expMonth?: number; expYear?: number } | null>(null)

  // ── Expose handle to parent ─────────────────────────────────────────────────
  useImperativeHandle(ref, () => ({
    isReady: status === 'ready',

    async tokenize(): Promise<string> {
      if (!cardRef.current) throw new Error('Square card not initialized')
      const result = await cardRef.current.tokenize()
      if (result.status === 'OK') {
        lastCardDetails.current = result.details?.card ?? null
        return result.token as string
      }
      throw new Error(result.errors?.[0]?.message ?? 'Card tokenization failed')
    },

    getCardDetails() {
      return lastCardDetails.current
    },
  }), [status])

  // ── Single attempt ──────────────────────────────────────────────────────────
  const tryOnce = useCallback(async (): Promise<void> => {
    if (cardRef.current) {
      try { await cardRef.current.destroy() } catch (_) {}
      cardRef.current = null
    }

    const container = document.getElementById(sqId)
    if (container) container.innerHTML = ''

    await loadSquareScript()

    const Square = await waitForSquareGlobal()
    if (!Square) throw new Error('Square.js not available after load')

    const payments = await Square.payments(appId, locationId)
    const card     = await payments.card()
    await card.attach(`#${sqId}`)

    cardRef.current = card
  }, [appId, locationId, sqId])

  // ── Initialize with auto-retry ──────────────────────────────────────────────
  const initialize = useCallback(async (manual = false) => {
    if (initingRef.current) return
    initingRef.current = true
    destroyedRef.current = false
    setStatus('loading')
    setErrMsg('')
    if (manual) setAttempt(0)

    let lastError: string = ''

    for (let i = 0; i < MAX_RETRIES; i++) {
      if (destroyedRef.current) break

      try {
        // On retry, reset the Square singleton so SDK re-initializes fresh
        if (i > 0) {
          resetSquareSingleton()
          await delay(RETRY_DELAY_MS * i)
        }

        if (destroyedRef.current) break

        setAttempt(i + 1)
        await tryOnce()

        if (destroyedRef.current) break

        setStatus('ready')
        onReady?.()
        initingRef.current = false
        return
      } catch (e: any) {
        lastError = e?.message ?? 'Payment form failed to initialize'
        if (i < MAX_RETRIES - 1) {
          // Brief pause shown to user before next retry
          await delay(300)
        }
      }
    }

    if (!destroyedRef.current) {
      setStatus('error')
      setErrMsg(lastError)
      onError?.(lastError)
    }
    initingRef.current = false
  }, [tryOnce, onReady, onError])

  useEffect(() => {
    initialize()
    return () => {
      destroyedRef.current = true
      if (cardRef.current) {
        try { cardRef.current.destroy() } catch (_) {}
        cardRef.current = null
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="mt-1 pb-4">

      {/* Square card iframe mounts here */}
      <div id={sqId} className="min-h-[54px]" />

      {/* Loading skeleton */}
      {status === 'loading' && (
        <div className="space-y-3" aria-hidden="true">
          <div className="mt-2 space-y-3 animate-pulse">
            <div className="h-12 rounded-md bg-gray-100" />
            <div className="grid grid-cols-2 gap-3">
              <div className="h-12 rounded-md bg-gray-100" />
              <div className="h-12 rounded-md bg-gray-100" />
            </div>
          </div>
          {attempt > 1 && (
            <p className="text-xs text-gray-400 text-center">
              Retrying… (attempt {attempt}/{MAX_RETRIES})
            </p>
          )}
        </div>
      )}

      {/* Error — only shown after all retries exhausted */}
      {status === 'error' && (
        <div className="mt-3 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3">
          <svg
            className="mt-0.5 h-4 w-4 shrink-0 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <p className="text-sm font-medium text-red-700">
              Payment form could not load
            </p>
            <p className="mt-0.5 text-xs text-red-500">{errMsg}</p>
            <button
              type="button"
              onClick={() => initialize(true)}
              className="mt-2 text-xs font-medium text-red-600 underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        </div>
      )}
    </div>
  )
})

export default SquarePayment
