'use client'

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

// ─── Public API exposed to parent via ref ─────────────────────────────────────

export interface SquarePaymentHandle {
  /** Tokenizes the card. Returns token string or throws on failure. */
  tokenize(): Promise<string>
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

// ─── Singleton script loader ──────────────────────────────────────────────────

let _scriptPromise: Promise<void> | null = null

function loadSquareScript(): Promise<void> {
  if (_scriptPromise) return _scriptPromise
  _scriptPromise = new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && (window as any).Square) {
      resolve(); return
    }
    const s = document.createElement('script')
    s.src = 'https://web.squarecdn.com/v1/square.js'
    s.onload  = () => resolve()
    s.onerror = () => {
      _scriptPromise = null
      reject(new Error('Square.js failed to load'))
    }
    document.head.appendChild(s)
  })
  return _scriptPromise
}

// ─── Component ────────────────────────────────────────────────────────────────

const SquarePayment = forwardRef<SquarePaymentHandle, Props>(function SquarePayment(
  { appId, locationId, onReady, onError },
  ref,
) {
  const [status, setStatus] = useState<Status>('idle')
  const [errMsg, setErrMsg] = useState('')

  const cardRef    = useRef<any>(null)
  const initingRef = useRef(false)

  // ── Expose handle to parent ─────────────────────────────────────────────────
  useImperativeHandle(ref, () => ({
    isReady: status === 'ready',

    async tokenize(): Promise<string> {
      if (!cardRef.current) throw new Error('Square card not initialized')
      const result = await cardRef.current.tokenize()
      if (result.status === 'OK') return result.token as string
      throw new Error(result.errors?.[0]?.message ?? 'Card tokenization failed')
    },
  }), [status])

  // ── Initialize Square ───────────────────────────────────────────────────────
  const initialize = useCallback(async () => {
    if (initingRef.current) return
    initingRef.current = true
    setStatus('loading')
    setErrMsg('')

    try {
      // Tear down previous card if re-initializing
      if (cardRef.current) {
        try { await cardRef.current.destroy() } catch (_) {}
        cardRef.current = null
      }

      const container = document.getElementById('sq-card-container')
      if (container) container.innerHTML = ''

      await loadSquareScript()

      const Square = (window as any).Square
      if (!Square) throw new Error('Square.js not available after load')

      const payments = await Square.payments(appId, locationId)
      const card     = await payments.card()
      await card.attach('#sq-card-container')

      cardRef.current = card
      setStatus('ready')
      onReady?.()
    } catch (e: any) {
      const msg = e?.message ?? 'Payment form failed to initialize'
      setStatus('error')
      setErrMsg(msg)
      onError?.(msg)
    } finally {
      initingRef.current = false
    }
  }, [appId, locationId, onReady, onError])

  useEffect(() => {
    initialize()
    return () => {
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
      <div id="sq-card-container" className="min-h-[54px]" />

      {/* Loading skeleton */}
      {status === 'loading' && (
        <div className="mt-2 space-y-3 animate-pulse" aria-hidden="true">
          <div className="h-12 rounded-md bg-gray-100" />
          <div className="grid grid-cols-2 gap-3">
            <div className="h-12 rounded-md bg-gray-100" />
            <div className="h-12 rounded-md bg-gray-100" />
          </div>
        </div>
      )}

      {/* Error */}
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
              onClick={() => initialize()}
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