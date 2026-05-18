'use client'

import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Lock,
  Package,
  Plus,
  RotateCcw,
  Shield,
  Tag,
  Truck,
} from 'lucide-react'
import Link from 'next/link'
import { Switch } from '@/components/ui/switch'
import type { MobileCheckoutProps } from './types'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const usd = (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const formatCardNumber = (v: string) =>
  v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ')

const formatExpiry = (v: string) => {
  const d = v.replace(/\D/g, '').slice(0, 4)
  return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d
}

// ─── MobileCheckout (main) ────────────────────────────────────────────────────

export function MobileCheckout(props: MobileCheckoutProps) {
  const { mobileStep, setMobileStep } = props
  const activeAddr =
    props.addresses.find((a) => a.id === props.selectedAddress) ?? props.addresses[0]

  const stepTitle = ['', 'Shipping Address', 'Order Summary', 'Payments'][mobileStep]

  return (
    <div className="lg:hidden bg-[#f5f7f5] min-h-screen flex flex-col">

      {/* ── Sticky Header ───────────────────────────────────── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="flex items-center gap-3 px-4 py-3">
          {mobileStep > 1 ? (
            <button
              type="button"
              onClick={() => setMobileStep(mobileStep - 1)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-700" />
            </button>
          ) : (
            <Link
              href="/cart"
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-700" />
            </Link>
          )}
          <h1 className="flex-1 text-base font-bold text-gray-800">{stepTitle}</h1>
          {mobileStep === 3 && (
            <div className="flex items-center gap-1 text-[#186737] text-xs font-medium">
              <Lock size={12} /> 100% Secure
            </div>
          )}
        </div>
        <MobileStepper current={mobileStep} />
      </header>

      {/* ── Step Content ────────────────────────────────────── */}
      <div className="flex-1 pb-2">
        {mobileStep === 1 && (
          <StepAddress
            addresses={props.addresses}
            selectedAddress={props.selectedAddress}
            setSelectedAddress={props.setSelectedAddress}
          />
        )}
        {mobileStep === 2 && (
          <StepSummary
            activeAddr={activeAddr}
            cartItems={props.cartItems}
            coupon={props.coupon}
            setCoupon={props.setCoupon}
            couponApplied={props.couponApplied}
            setCouponApplied={props.setCouponApplied}
            liftGate={props.liftGate}
            setLiftGate={props.setLiftGate}
            residential={props.residential}
            setResidential={props.setResidential}
            insideDelivery={props.insideDelivery}
            setInsideDelivery={props.setInsideDelivery}
            note={props.note}
            setNote={props.setNote}
            subtotal={props.subtotal}
            shippingTotal={props.shippingTotal}
            tax={props.tax}
            couponDiscount={props.couponDiscount}
            total={props.total}
            totalSavings={props.totalSavings}
            onChangeAddress={() => setMobileStep(1)}
          />
        )}
        {mobileStep === 3 && (
          <StepPayment
            payment={props.payment}
            setPayment={props.setPayment}
            cardNum={props.cardNum}
            setCardNum={props.setCardNum}
            cardName={props.cardName}
            setCardName={props.setCardName}
            cardExpiry={props.cardExpiry}
            setCardExpiry={props.setCardExpiry}
            cardCvv={props.cardCvv}
            setCardCvv={props.setCardCvv}
            cardFlipped={props.cardFlipped}
            setCardFlipped={props.setCardFlipped}
            checkDiscount={props.checkDiscount}
            total={props.total}
          />
        )}
      </div>

      {/* ── Fixed Bottom Bar ─────────────────────────────────── */}
      <BottomBar
        step={mobileStep}
        setStep={setMobileStep}
        total={props.total}
        subtotal={props.subtotal + props.shippingTotal}
        itemCount={props.cartItems.length}
        payment={props.payment}
      />
    </div>
  )
}

// ─── MobileStepper ────────────────────────────────────────────────────────────

function MobileStepper({ current }: { current: number }) {
  const steps = ['Address', 'Order Summary', 'Payment']
  return (
    <div className="flex items-center justify-center px-4 pb-3 gap-0">
      {steps.map((label, i) => {
        const n = i + 1
        const done = current > n
        const active = current === n
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  done
                    ? 'bg-[#186737] text-white'
                    : active
                      ? 'bg-[#186737] text-white ring-4 ring-[#186737]/20'
                      : 'bg-gray-100 text-gray-400 border border-gray-200'
                }`}
              >
                {done ? <Check size={13} /> : n}
              </div>
              <span
                className={`text-[9px] font-medium whitespace-nowrap leading-none ${
                  active ? 'text-[#186737] font-bold' : done ? 'text-gray-500' : 'text-gray-400'
                }`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`h-0.5 w-10 mb-4 mx-1 transition-all ${done ? 'bg-[#186737]' : 'bg-gray-200'}`}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Step 1: Address ──────────────────────────────────────────────────────────

interface StepAddressProps {
  addresses: MobileCheckoutProps['addresses']
  selectedAddress: number
  setSelectedAddress: (id: number) => void
}

function StepAddress({ addresses, selectedAddress, setSelectedAddress }: StepAddressProps) {
  return (
    <div className="p-4 space-y-3">
      {addresses.map((addr) => {
        const active = selectedAddress === addr.id
        return (
          <button
            key={addr.id}
            type="button"
            onClick={() => setSelectedAddress(addr.id)}
            className={`w-full text-left p-4 rounded-xl border-2 bg-white transition-all duration-150 ${
              active ? 'border-[#186737] shadow-sm shadow-green-100' : 'border-gray-200'
            }`}
          >
            <div className="flex gap-3">
              <RadioDot active={active} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-800 text-sm">Customer</span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded ${
                      active ? 'bg-[#186737]/10 text-[#186737]' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {addr.label}
                  </span>
                </div>
                <p className="text-sm text-gray-600 leading-snug">{addr.line1}</p>
                <p className="text-xs text-gray-400 mt-0.5">{addr.line2}</p>
              </div>
            </div>
          </button>
        )
      })}
      <button
        type="button"
        className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-[#186737]/30 text-[#186737] text-sm font-semibold hover:bg-green-50 transition-colors"
      >
        <Plus size={16} /> Add New Address
      </button>
    </div>
  )
}

// ─── Step 2: Order Summary ────────────────────────────────────────────────────

interface StepSummaryProps {
  activeAddr: MobileCheckoutProps['addresses'][0]
  cartItems: MobileCheckoutProps['cartItems']
  coupon: string
  setCoupon: (v: string) => void
  couponApplied: boolean
  setCouponApplied: (v: boolean) => void
  liftGate: boolean
  setLiftGate: (v: boolean) => void
  residential: boolean
  setResidential: (v: boolean) => void
  insideDelivery: boolean
  setInsideDelivery: (v: boolean) => void
  note: string
  setNote: (v: string) => void
  subtotal: number
  shippingTotal: number
  tax: number
  couponDiscount: number
  total: number
  totalSavings: number
  onChangeAddress: () => void
}

function StepSummary(p: StepSummaryProps) {
  const deliveryOpts = [
    { label: 'Lift Gate Service', desc: 'Required if no loading dock', fee: 150, state: p.liftGate, toggle: () => p.setLiftGate(!p.liftGate) },
    { label: 'Residential Address', desc: 'Delivery to non-commercial site', fee: 109, state: p.residential, toggle: () => p.setResidential(!p.residential) },
    { label: 'Inside Delivery', desc: 'Carried inside the building', fee: 75, state: p.insideDelivery, toggle: () => p.setInsideDelivery(!p.insideDelivery) },
  ]

  return (
    <div>
      {/* Deliver to */}
      <div className="bg-white px-4 py-3 flex items-start justify-between">
        <div className="flex-1 min-w-0 mr-4">
          <p className="text-xs text-gray-500 mb-0.5">Deliver to:</p>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-gray-800">Customer</span>
            <span className="text-[10px] font-bold uppercase bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
              {p.activeAddr.label}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5 leading-snug">{p.activeAddr.line1}</p>
          <p className="text-xs text-gray-400">{p.activeAddr.line2}</p>
        </div>
        <button
          type="button"
          onClick={p.onChangeAddress}
          className="shrink-0 text-[#186737] text-xs font-bold border border-[#186737] px-3 py-1.5 rounded-lg"
        >
          Change
        </button>
      </div>

      {/* Items */}
      <div className="bg-white mt-2 divide-y divide-gray-50">
        {p.cartItems.map((item) => (
          <div key={item.id} className="p-4">
            <div className="flex gap-3">
              <div className="w-20 h-20 bg-gray-100 rounded-lg shrink-0 flex items-center justify-center">
                <Package size={28} className="text-gray-300" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700 line-clamp-2 leading-snug mb-1.5">{item.name}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-base font-bold text-gray-900">${usd(item.price)}</span>
                  {item.shipping > 0 && (
                    <span className="text-xs text-gray-400">+${usd(item.shipping)} ship</span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs border border-gray-200 text-gray-600 px-2 py-0.5 rounded">
                    Qty: {item.qty}
                  </span>
                  <div className="flex items-center gap-1 text-[#186737]">
                    <Truck size={11} />
                    <span className="text-xs">{item.deliveryDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Coupon */}
      <div className="bg-white mt-2 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Tag size={14} className="text-[#186737]" />
          <span className="text-sm font-semibold text-gray-800">Coupon Code</span>
        </div>
        <div className="flex gap-2">
          <input
            value={p.coupon}
            onChange={(e) => p.setCoupon(e.target.value.toUpperCase())}
            placeholder="e.g. HORECA10"
            disabled={p.couponApplied}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#186737] focus:ring-2 focus:ring-green-100 disabled:bg-gray-50 disabled:text-gray-400"
          />
          {p.couponApplied ? (
            <button
              type="button"
              onClick={() => { p.setCouponApplied(false); p.setCoupon('') }}
              className="px-4 py-2.5 rounded-lg border-2 border-red-200 text-red-500 text-sm font-semibold"
            >
              Remove
            </button>
          ) : (
            <button
              type="button"
              onClick={() => { if (p.coupon === 'HORECA10') p.setCouponApplied(true) }}
              className="px-4 py-2.5 rounded-lg bg-[#186737] text-white text-sm font-semibold"
            >
              Apply
            </button>
          )}
        </div>
        {p.couponApplied && (
          <p className="text-green-600 text-xs mt-2 flex items-center gap-1">
            <Check size={12} /> HORECA10 applied — 10% off subtotal
          </p>
        )}
      </div>

      {/* Delivery Options */}
      <div className="bg-white mt-2">
        <div className="flex items-center gap-2 px-4 pt-4 pb-2">
          <Truck size={14} className="text-[#186737]" />
          <span className="text-sm font-semibold text-gray-800">Delivery Options</span>
        </div>
        {deliveryOpts.map((opt) => (
          <div
            key={opt.label}
            className="flex items-center justify-between px-4 py-3 border-t border-gray-50"
          >
            <div className="flex-1 mr-3">
              <p className="text-sm font-medium text-gray-700">{opt.label}</p>
              <p className="text-xs text-gray-400">{opt.desc}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-gray-500 font-semibold">+${opt.fee}</span>
              <Switch
                checked={opt.state}
                onCheckedChange={opt.toggle}
                className="data-[state=checked]:bg-[#186737] data-[state=unchecked]:bg-gray-200"
              />
            </div>
          </div>
        ))}
        <div className="h-4" />
      </div>

      {/* Price Breakdown */}
      <div className="mx-3 mt-2 bg-white rounded-xl border border-gray-100 p-4">
        <div className="space-y-3 text-sm">
          <div className="flex justify-between text-gray-500">
            <span>MRP ({p.cartItems.length} items)</span>
            <span>${usd(p.subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Shipping & Handling</span>
            <span>${usd(p.shippingTotal)}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Tax (8.25%)</span>
            <span>${usd(p.tax)}</span>
          </div>
          {p.couponApplied && (
            <div className="flex justify-between text-[#186737]">
              <span>Coupon Discount</span>
              <span>-${usd(p.couponDiscount)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-gray-800 border-t border-gray-100 pt-3">
            <span>Total Amount</span>
            <span>${usd(p.total)}</span>
          </div>
        </div>
        {p.totalSavings > 0 && (
          <div className="mt-3 bg-green-50 rounded-lg p-3 flex items-center gap-2">
            <span className="text-base">🎉</span>
            <span className="text-[#186737] text-xs font-semibold">
              You&apos;ll save ${usd(p.totalSavings)} on this order!
            </span>
          </div>
        )}
      </div>

      {/* Order Note */}
      <div className="bg-white mt-2 p-4 mb-2">
        <div className="flex items-center gap-2 mb-3">
          <Package size={14} className="text-[#186737]" />
          <span className="text-sm font-semibold text-gray-800">
            Order Note{' '}
            <span className="text-gray-400 font-normal text-xs">(optional)</span>
          </span>
        </div>
        <textarea
          value={p.note}
          onChange={(e) => p.setNote(e.target.value)}
          rows={2}
          placeholder="Special instructions, delivery notes..."
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-[#186737] focus:ring-2 focus:ring-green-100"
        />
      </div>
    </div>
  )
}

// ─── Step 3: Payment ──────────────────────────────────────────────────────────

interface StepPaymentProps {
  payment: string
  setPayment: (v: string) => void
  cardNum: string
  setCardNum: (v: string) => void
  cardName: string
  setCardName: (v: string) => void
  cardExpiry: string
  setCardExpiry: (v: string) => void
  cardCvv: string
  setCardCvv: (v: string) => void
  cardFlipped: boolean
  setCardFlipped: (v: boolean) => void
  checkDiscount: number
  total: number
}

function StepPayment(p: StepPaymentProps) {
  return (
    <div>
      {/* Total bar */}
      <div className="bg-[#f0f7f3] px-4 py-3 flex items-center justify-between border-b border-green-100">
        <span className="text-[#186737] font-semibold text-sm">Total Amount</span>
        <span className="text-[#186737] text-xl font-bold">${usd(p.total)}</span>
      </div>

      {/* Payment accordion */}
      <div className="bg-white mt-2 divide-y divide-gray-100">

        {/* Card */}
        <div>
          <button
            type="button"
            onClick={() => p.setPayment(p.payment === 'card' ? '' : 'card')}
            className="w-full flex items-center gap-3 px-4 py-4"
          >
            <RadioDot active={p.payment === 'card'} />
            <CreditCard size={20} className={p.payment === 'card' ? 'text-[#186737]' : 'text-gray-400'} />
            <div className="flex-1 text-left">
              <span className="text-sm font-semibold text-gray-800">Credit / Debit / ATM Card</span>
              <p className="text-xs text-gray-400">Visa, Mastercard, Amex</p>
            </div>
            <ChevronRight
              size={16}
              className={`text-gray-300 transition-transform duration-200 ${p.payment === 'card' ? 'rotate-90' : ''}`}
            />
          </button>
          {p.payment === 'card' && (
            <div className="px-4 pb-5 space-y-3">
              <Card3D
                cardNum={p.cardNum}
                cardName={p.cardName}
                cardExpiry={p.cardExpiry}
                cardCvv={p.cardCvv}
                flipped={p.cardFlipped}
              />
              <CardInput
                label="Card Number"
                value={p.cardNum}
                onChange={(v) => p.setCardNum(formatCardNumber(v))}
                placeholder="0000 0000 0000 0000"
                mono
              />
              <CardInput
                label="Name on Card"
                value={p.cardName}
                onChange={(v) => p.setCardName(v.toUpperCase())}
                placeholder="JOHN DOE"
              />
              <div className="grid grid-cols-2 gap-3">
                <CardInput
                  label="Expiry"
                  value={p.cardExpiry}
                  onChange={(v) => p.setCardExpiry(formatExpiry(v))}
                  placeholder="MM/YY"
                  maxLength={5}
                  mono
                />
                <CardInput
                  label="CVV"
                  value={p.cardCvv}
                  onChange={(v) => p.setCardCvv(v.replace(/\D/g, '').slice(0, 4))}
                  placeholder="•••"
                  maxLength={4}
                  mono
                  onFocus={() => p.setCardFlipped(true)}
                  onBlur={() => p.setCardFlipped(false)}
                />
              </div>
              <button
                type="button"
                className="w-full bg-[#186737] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 text-sm shadow-md shadow-green-900/20"
              >
                <Lock size={14} /> Confirm & Pay — ${usd(p.total)} <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Check */}
        <div>
          <button
            type="button"
            onClick={() => p.setPayment(p.payment === 'check' ? '' : 'check')}
            className="w-full flex items-center gap-3 px-4 py-4"
          >
            <RadioDot active={p.payment === 'check'} />
            <span className="text-xl">📋</span>
            <div className="flex-1 text-left">
              <span className="text-sm font-semibold text-gray-800">Check Payment</span>
              <p className="text-xs text-[#186737] font-medium">5% discount applied</p>
            </div>
            <ChevronRight
              size={16}
              className={`text-gray-300 transition-transform duration-200 ${p.payment === 'check' ? 'rotate-90' : ''}`}
            />
          </button>
          {p.payment === 'check' && (
            <div className="px-4 pb-5">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm mb-4">
                <p className="font-semibold text-amber-800 mb-1">5% Discount Applied 🎉</p>
                <p className="text-amber-700 text-xs leading-relaxed">
                  Upload a photo of your check after placing the order. No physical mailing required.
                </p>
              </div>
              <button
                type="button"
                className="w-full bg-[#186737] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 text-sm shadow-md shadow-green-900/20"
              >
                <Lock size={14} /> Confirm & Pay — ${usd(p.total - p.checkDiscount)}{' '}
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Other methods */}
        {[
          { id: 'upi', icon: '📱', label: 'UPI', desc: 'Pay by any UPI app' },
          { id: 'netbanking', icon: '🏦', label: 'Net Banking', desc: 'All major banks supported' },
        ].map((pm) => (
          <div key={pm.id}>
            <button
              type="button"
              onClick={() => p.setPayment(pm.id)}
              className="w-full flex items-center gap-3 px-4 py-4"
            >
              <RadioDot active={p.payment === pm.id} />
              <span className="text-xl">{pm.icon}</span>
              <div className="flex-1 text-left">
                <span className="text-sm font-semibold text-gray-800">{pm.label}</span>
                <p className="text-xs text-gray-400">{pm.desc}</p>
              </div>
              <ChevronRight size={16} className="text-gray-300" />
            </button>
            {p.payment === pm.id && (
              <div className="px-4 pb-4">
                <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-4 text-center text-sm text-gray-500">
                  Coming soon — redirects to payment gateway.
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Trust badges */}
      <div className="mx-3 mt-3 bg-white rounded-xl border border-gray-100 p-4">
        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { Icon: Shield, label: 'Secure', desc: 'SSL encrypted' },
            { Icon: RotateCcw, label: 'Returns', desc: '30-day policy' },
            { Icon: CheckCircle2, label: 'Data Safe', desc: 'Never shared' },
          ].map(({ Icon, label, desc }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center">
                <Icon size={16} className="text-[#186737]" />
              </div>
              <p className="text-[10px] font-semibold text-gray-700">{label}</p>
              <p className="text-[9px] text-gray-400">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-[10px] text-gray-400 mt-4 px-6 leading-relaxed mb-6">
        By placing your order, you agree to our{' '}
        <Link href="/pages/return-policy" className="text-[#186737]">
          Terms & Return Policy
        </Link>
      </p>
    </div>
  )
}

// ─── Bottom Bar ───────────────────────────────────────────────────────────────

interface BottomBarProps {
  step: number
  setStep: (s: number) => void
  total: number
  subtotal: number
  itemCount: number
  payment: string
}

function BottomBar({ step, setStep, total, subtotal, itemCount, payment }: BottomBarProps) {
  return (
    <div className="fixeds bottom-0s left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 z-30 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
      {step === 1 && (
        <button
          type="button"
          onClick={() => setStep(2)}
          className="w-full bg-[#186737] active:scale-[0.98] text-white font-bold py-4 rounded-xl text-sm transition-all"
        >
          Continue to Order Summary
        </button>
      )}
      {step === 2 && (
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-xs text-gray-400">{itemCount} items</p>
            <p className="text-base font-bold text-gray-800">${usd(total)}</p>
          </div>
          <button
            type="button"
            onClick={() => setStep(3)}
            className="flex-1 bg-[#186737] active:scale-[0.98] text-white font-bold py-3.5 rounded-xl text-sm transition-all"
          >
            Continue to Payment
          </button>
        </div>
      )}
      {step === 3 && (
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="text-xs text-gray-400 line-through">${usd(subtotal)}</p>
            <p className="text-base font-bold text-gray-800">${usd(total)}</p>
          </div>
          {!['card', 'check'].includes(payment) && (
            <div className="flex-1 bg-gray-100 text-gray-400 font-bold py-3.5 rounded-xl text-sm text-center">
              Select Payment
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Shared UI ────────────────────────────────────────────────────────────────

function RadioDot({ active }: { active: boolean }) {
  return (
    <div
      className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${
        active ? 'border-[#186737]' : 'border-gray-300'
      }`}
    >
      {active && <div className="w-2.5 h-2.5 rounded-full bg-[#186737]" />}
    </div>
  )
}

function Card3D({
  cardNum, cardName, cardExpiry, cardCvv, flipped,
}: {
  cardNum: string; cardName: string; cardExpiry: string; cardCvv: string; flipped: boolean
}) {
  return (
    <div style={{ perspective: '1000px' }}>
      <div
        className="relative h-44 transition-transform duration-700"
        style={{ transformStyle: 'preserve-3d', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-xl p-5 flex flex-col justify-between overflow-hidden select-none"
          style={{
            backfaceVisibility: 'hidden',
            background: 'linear-gradient(135deg,#186737 0%,#0f4d29 55%,#0a3a1e 100%)',
          }}
        >
          <div className="flex justify-between items-start">
            <div className="w-10 h-7 rounded-md bg-yellow-300/80" />
            <span className="text-white/50 text-xs font-semibold tracking-widest uppercase">Credit</span>
          </div>
          <div>
            <p className="text-white font-mono text-lg tracking-[0.25em] mb-3">
              {cardNum || '•••• •••• •••• ••••'}
            </p>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-white/40 text-[9px] uppercase tracking-widest mb-0.5">Card Holder</p>
                <p className="text-white text-sm font-semibold truncate max-w-40">{cardName || 'YOUR NAME'}</p>
              </div>
              <div className="text-right">
                <p className="text-white/40 text-[9px] uppercase tracking-widest mb-0.5">Expires</p>
                <p className="text-white text-sm font-semibold">{cardExpiry || 'MM/YY'}</p>
              </div>
            </div>
          </div>
        </div>
        {/* Back */}
        <div
          className="absolute inset-0 rounded-xl overflow-hidden select-none"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: 'linear-gradient(135deg,#0d4a26 0%,#186737 100%)',
          }}
        >
          <div className="w-full h-10 bg-black/40 mt-7" />
          <div className="px-5 mt-4">
            <div className="bg-white/10 rounded-lg h-9 flex items-center justify-end pr-4">
              <p className="text-white font-mono text-sm tracking-[0.3em]">{cardCvv || '•••'}</p>
            </div>
            <p className="text-white/40 text-[10px] text-right mt-1 tracking-widest uppercase">CVV</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function CardInput({
  label, value, onChange, placeholder, maxLength, mono = false, onFocus, onBlur,
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string
  maxLength?: number; mono?: boolean; onFocus?: () => void; onBlur?: () => void
}) {
  return (
    <div>
      <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        onFocus={onFocus}
        onBlur={onBlur}
        className={`w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#186737] focus:ring-2 focus:ring-green-100 transition-shadow bg-gray-50/50 ${
          mono ? 'font-mono tracking-widest' : ''
        }`}
      />
    </div>
  )
}
