'use client'

import { useRef, useState } from 'react'
import SquarePayment, { SquarePaymentHandle } from './square-payment'

// ─── Types ────────────────────────────────────────────────────────────────────

export type PaymentMethod = 'square'
// Aage add karna ho toh: | 'check' | 'net_terms'

export interface CheckoutPaymentHandle {
  /**
   * Call this from the "Confirm & Pay" button.
   * Returns Square token string, ya null if not ready.
   * Throws if tokenization fails.
   */
  getPaymentToken(): Promise<string | null>
  /** Returns card details stored after last successful tokenize */
  getCardDetails(): { brand?: string; last4?: string; expMonth?: number; expYear?: number } | null
  selectedMethod: PaymentMethod
}

interface Props {
  /** Square credentials */
  squareAppId:      string
  squareLocationId: string

  /** Expose internal handle to parent page */
  onHandleReady?: (handle: CheckoutPaymentHandle) => void
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CheckoutPayment({
  squareAppId,
  squareLocationId,
  onHandleReady,
}: Props) {
  const [selected, setSelected] = useState<PaymentMethod>('square')
  const [squareReady, setSquareReady] = useState(false)

  const squareRef = useRef<SquarePaymentHandle>(null)

  // ── Expose handle to parent via callback ────────────────────────────────────
  // We call onHandleReady once so parent keeps a stable ref
  const handleRef = useRef<CheckoutPaymentHandle>({
    selectedMethod: 'square',
    async getPaymentToken() {
      if (selected === 'square') {
        if (!squareRef.current) throw new Error('Square not initialized')
        return squareRef.current.tokenize()
      }
      return null
    },
    getCardDetails() {
      if (selected === 'square') return squareRef.current?.getCardDetails() ?? null
      return null
    },
  })

  // Sync selected into handle
  handleRef.current.selectedMethod = selected

  // Give parent access after first render
  const didNotify = useRef(false)
  if (!didNotify.current && onHandleReady) {
    didNotify.current = true
    // next tick so ref is stable
    Promise.resolve().then(() => onHandleReady(handleRef.current))
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    // <div className="mt-5 rounded-xl border-2 border-[#E2E8F0]">
    <div className="mt-5 rounded-xl border-2 border-[#E2E8F0]">

      {/* Header */}
      <div className="flex items-center justify-between rounded-t-xl bg-[#E2E8F0] px-6 py-3">
        <h2 className="text-lg font-semibold text-[#424242]">Payment Method</h2>
      </div>

      {/* ── Square (Credit / Debit Card) ────────────────────────────────────── */}
      <div className="px-6">
        <label
          htmlFor="pm-square"
          className="flex cursor-pointer items-start gap-3 border-b-2 border-[#E2E8F0] py-4"
        >
          <input
            id="pm-square"
            type="radio"
            name="paymentMethod"
            value="square"
            checked={selected === 'square'}
            onChange={() => setSelected('square')}
            className="mt-0.5 h-4 w-4 cursor-pointer accent-[#186737]"
          />
          <div className="flex-1">
            <span className="block text-base font-semibold text-[#212121]">
              Credit / Debit Card
            </span>
            <span className="mt-0.5 block text-sm text-gray-500">
              Secure payment via Square — Visa, Mastercard, Amex & more
            </span>
          </div>

          {/* Card brand icons */}
          <div className="flex shrink-0 items-center gap-1.5 self-center">
            <CardBadge label="VISA"   bg="bg-[#1a1f71]" color="text-white"   />
            <CardBadge label="MC"     bg="bg-[#eb001b]" color="text-white"   />
            <CardBadge label="AMEX"   bg="bg-[#007bc1]" color="text-white"   />
          </div>
        </label>

        {/* Square form — always mounted, shown only when selected */}
        <div className={selected === 'square' ? 'block' : 'hidden'}>
          <SquarePayment
            ref={squareRef}
            appId={squareAppId}
            locationId={squareLocationId}
            onReady={() => setSquareReady(true)}
            onError={() => setSquareReady(false)}
          />
        </div>
      </div>

      {/* ── Extend here for more methods ───────────────────────────────────── */}
      {/*
        <div className="px-6">
          <label htmlFor="pm-check" ...>Pay with Check</label>
          {selected === 'check' && <PayWithCheck ref={checkRef} />}
        </div>
      */}
    </div>
  )
}

// ─── Small helper ─────────────────────────────────────────────────────────────

function CardBadge({
  label, bg, color,
}: {
  label: string; bg: string; color: string
}) {
  return (
    <span
      className={`${bg} ${color} rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wide`}
    >
      {label}
    </span>
  )
}