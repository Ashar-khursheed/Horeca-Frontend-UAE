'use client'

import {
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Home,
  Lock,
  MessageCircle,
  Package,
  Phone,
  Plus,
  RotateCcw,
  Shield,
  ShoppingBag,
  Tag,
  Truck,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { MobileCheckout } from './_components/mobile-checkout'
import type { Address, CartItem } from './_components/types'

// ─── Mock Data ────────────────────────────────────────────────────────────────

const CART_ITEMS: CartItem[] = [
  { id: 1, name: 'Turbo Air TAO-2510N-N6 23" Super Undercounter Bottle Cooler, 3.0 cu. ft.', qty: 1, price: 2436.63, shipping: 195.0, deliveryDate: 'May 16, 2026' },
  { id: 2, name: 'Turbo Air TAO-3000N-N6 30" Super Undercounter Bottle Cooler, 5.1 cu. ft.', qty: 1, price: 2986.26, shipping: 0, deliveryDate: 'May 16, 2026' },
  { id: 3, name: 'Turbo Air TAO-3000N-N6 30" Super Undercounter Bottle Cooler, 5.1 cu. ft.', qty: 1, price: 2986.26, shipping: 0, deliveryDate: 'May 16, 2026' },
  { id: 4, name: 'Turbo Air TAO-3000N-N6 30" Super Undercounter Bottle Cooler, 5.1 cu. ft.', qty: 1, price: 2986.26, shipping: 0, deliveryDate: 'May 16, 2026' },
  { id: 5, name: 'Turbo Air TAO-3000N-N6 30" Super Undercounter Bottle Cooler, 5.1 cu. ft.', qty: 1, price: 2986.26, shipping: 0, deliveryDate: 'May 16, 2026' },
]

const ADDRESSES: Address[] = [
  { id: 1, label: 'Home', line1: '0000 Los Angeles Memorial Lewis & Blvd', line2: 'California, United States' },
  { id: 2, label: 'Office', line1: 'Monterrey, Co, USA 9810, Billings', line2: 'Montana, United States' },
  { id: 3, label: 'Branch', line1: 'Apple Valley, Roanoke Creek Basement', line2: 'Santa Clara, CA 0001, United States' },
  { id: 4, label: 'Branch', line1: 'Apple Valley, Roanoke Creek Basement', line2: 'Santa Clara, CA 0001, United States' },
  { id: 5, label: 'Branch', line1: 'Apple Valley, Roanoke Creek Basement', line2: 'Santa Clara, CA 0001, United States' },
  { id: 6, label: 'Branch', line1: 'Apple Valley, Roanoke Creek Basement', line2: 'Santa Clara, CA 0001, United States' },
  { id: 7, label: 'Branch', line1: 'Apple Valley, Roanoke Creek Basement', line2: 'Santa Clara, CA 0001, United States' },
  { id: 8, label: 'Branch', line1: 'Apple Valley, Roanoke Creek Basement', line2: 'Santa Clara, CA 0001, United States' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatCardNumber = (v: string) =>
  v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ')

const formatExpiry = (v: string) => {
  const d = v.replace(/\D/g, '').slice(0, 4)
  return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d
}

const usd = (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const [mobileStep, setMobileStep] = useState(1)

  // Address slider (desktop)
  const [aPage, setAPage] = useState(0)
  const [aPerView, setAPerView] = useState(3)
  const aTotal = Math.ceil(ADDRESSES.length / aPerView)

  useEffect(() => {
    const calc = () =>
      setAPerView(window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1)
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])

  const [selectedAddress, setSelectedAddress] = useState(1)
  const [payment, setPayment] = useState('card')
  const [coupon, setCoupon] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)
  const [liftGate, setLiftGate] = useState(false)
  const [residential, setResidential] = useState(false)
  const [insideDelivery, setInsideDelivery] = useState(false)
  const [note, setNote] = useState('')

  const [cardNum, setCardNum] = useState('')
  const [cardName, setCardName] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [cardFlipped, setCardFlipped] = useState(false)

  // Pricing
  const subtotal = CART_ITEMS.reduce((s, i) => s + i.price * i.qty, 0)
  const shippingTotal = CART_ITEMS.reduce((s, i) => s + i.shipping, 0)
  const liftFee = liftGate ? 150 : 0
  const resFee = residential ? 109 : 0
  const insideFee = insideDelivery ? 75 : 0
  const tax = (subtotal + shippingTotal + resFee) * 0.0825
  const couponDiscount = couponApplied ? subtotal * 0.1 : 0
  const checkDiscount = payment === 'check' ? (subtotal + shippingTotal) * 0.05 : 0
  const total = subtotal + shippingTotal + liftFee + resFee + insideFee + tax - couponDiscount - checkDiscount
  const totalSavings = couponDiscount + checkDiscount

  const deliveryOpts = [
    { label: 'Lift Gate Service', desc: 'Required if no loading dock at location', fee: 150, state: liftGate, toggle: () => setLiftGate(!liftGate) },
    { label: 'Residential Address', desc: 'Delivery to non-commercial site', fee: 109, state: residential, toggle: () => setResidential(!residential) },
    { label: 'Inside Delivery', desc: 'Carried inside the building', fee: 75, state: insideDelivery, toggle: () => setInsideDelivery(!insideDelivery) },
  ]

  return (
    <div className="min-h-screen">

      {/* Mobile — separate component file */}
      <MobileCheckout
        mobileStep={mobileStep}
        setMobileStep={setMobileStep}
        addresses={ADDRESSES}
        selectedAddress={selectedAddress}
        setSelectedAddress={setSelectedAddress}
        cartItems={CART_ITEMS}
        coupon={coupon}
        setCoupon={setCoupon}
        couponApplied={couponApplied}
        setCouponApplied={setCouponApplied}
        liftGate={liftGate}
        setLiftGate={setLiftGate}
        residential={residential}
        setResidential={setResidential}
        insideDelivery={insideDelivery}
        setInsideDelivery={setInsideDelivery}
        note={note}
        setNote={setNote}
        payment={payment}
        setPayment={setPayment}
        cardNum={cardNum}
        setCardNum={setCardNum}
        cardName={cardName}
        setCardName={setCardName}
        cardExpiry={cardExpiry}
        setCardExpiry={setCardExpiry}
        cardCvv={cardCvv}
        setCardCvv={setCardCvv}
        cardFlipped={cardFlipped}
        setCardFlipped={setCardFlipped}
        subtotal={subtotal}
        shippingTotal={shippingTotal}
        tax={tax}
        couponDiscount={couponDiscount}
        checkDiscount={checkDiscount}
        total={total}
        totalSavings={totalSavings}
      />

      {/* Desktop — 2-column layout */}
      <div className="hidden lg:block bg-[#f5f7f5]">
        <div className="bg-white border-b border-gray-100">
          <div className="global-container py-3 flex items-center gap-2 text-sm">
            <Link href="/cart" className="text-[#186737] hover:underline flex items-center gap-1">
              <ShoppingBag size={13} /> Cart
            </Link>
            <ChevronRight size={13} className="text-gray-300" />
            <span className="font-semibold text-gray-700">Checkout</span>
            <ChevronRight size={13} className="text-gray-300" />
            <span className="text-gray-400">Confirmation</span>
          </div>
        </div>

        <main className="global-container py-8 px-0">
          <div className="grid grid-cols-1 2xl:grid-cols-[75%_25%] xl:grid-cols-[75%_25%] lg:grid-cols-1 gap-6 items-start">

            {/* LEFT */}
            <div className="space-y-5">

              {/* Shipping Address */}
              <section className="bg-white rounded-[7px] p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100">
                <div className="flex items-center justify-between mb-5">
                  <SectionTitle icon={<Home size={14} />} title="Shipping Address" />
                  <button type="button" className="text-[#186737] text-xs font-semibold flex items-center gap-1 hover:underline">
                    <Plus size={13} /> Add New
                  </button>
                </div>
                <div className="relative">
                  <div className="overflow-hidden">
                    <div
                      className="flex transition-transform duration-500 ease-in-out"
                      style={{
                        width: `${(ADDRESSES.length / aPerView) * 100}%`,
                        transform: `translateX(-${(aPage * aPerView * 100) / ADDRESSES.length}%)`,
                      }}
                    >
                      {ADDRESSES.map((addr) => {
                        const active = selectedAddress === addr.id
                        return (
                          <div key={addr.id} style={{ width: `${100 / ADDRESSES.length}%` }} className="px-1.5">
                            <button type="button" onClick={() => setSelectedAddress(addr.id)}
                              className={`w-full text-left p-4 rounded-[7px] border-2 transition-all duration-150 ${
                                active ? 'border-[#186737] bg-green-50/60' : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                                  active ? 'bg-[#186737] text-white' : 'bg-gray-200 text-gray-500'
                                }`}>{addr.label}</span>
                                {active && (
                                  <span className="w-5 h-5 rounded-full bg-[#186737] flex items-center justify-center">
                                    <Check size={11} className="text-white" />
                                  </span>
                                )}
                              </div>
                              <p className="text-sm font-medium text-gray-700 leading-snug">{addr.line1}</p>
                              <p className="text-xs text-gray-400 mt-0.5">{addr.line2}</p>
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  {aTotal > 1 && (
                    <>
                      <button type="button" onClick={() => setAPage((p) => Math.max(0, p - 1))} disabled={aPage === 0}
                        className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:border-[#186737] disabled:opacity-30 transition-all"
                      >
                        <ChevronLeft size={16} className="text-gray-600" />
                      </button>
                      <button type="button" onClick={() => setAPage((p) => Math.min(aTotal - 1, p + 1))} disabled={aPage === aTotal - 1}
                        className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:border-[#186737] disabled:opacity-30 transition-all"
                      >
                        <ChevronRight size={16} className="text-gray-600" />
                      </button>
                    </>
                  )}
                </div>
                {aTotal > 1 && (
                  <div className="flex justify-center gap-1.5 mt-4">
                    {Array.from({ length: aTotal }).map((_, i) => (
                      <button key={i} type="button" onClick={() => setAPage(i)}
                        className={`rounded-full h-2 transition-all duration-300 ${
                          i === aPage ? 'w-6 bg-[#186737]' : 'w-2 bg-gray-300 hover:bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </section>

              {/* Payment Method */}
              <section className="bg-white rounded-[7px] p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100">
                <div className="mb-5">
                  <SectionTitle icon={<CreditCard size={14} />} title="Payment Method" />
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {[
                    { id: 'card', label: 'Card', sublabel: 'Visa / MC / Amex', emoji: '💳' },
                    { id: 'check', label: 'Check', sublabel: '5% discount', emoji: '📋' },
                  ].map((pm) => {
                    const active = payment === pm.id
                    return (
                      <button key={pm.id} type="button" onClick={() => setPayment(pm.id)}
                        className={`flex flex-col items-center justify-center gap-1 py-3 px-4 rounded-[7px] border-2 transition-all duration-150 min-w-22.5 ${
                          active ? 'border-[#186737] bg-green-50' : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-2xl leading-none">{pm.emoji}</span>
                        <span className={`text-[11px] font-bold ${active ? 'text-[#186737]' : 'text-gray-600'}`}>{pm.label}</span>
                        <span className="text-[9px] text-gray-400 leading-tight text-center">{pm.sublabel}</span>
                      </button>
                    )
                  })}
                </div>
                {payment === 'card' && (
                  <div className="grid grid-cols-1 md:grid-cols-[30%_30%] gap-6">
                  
                    <div>
                      <CardInput label="Card Number" value={cardNum} onChange={(v) => setCardNum(formatCardNumber(v))} placeholder="0000 0000 0000 0000" mono />
                      <CardInput label="Name on Card" value={cardName} onChange={(v) => setCardName(v.toUpperCase())} placeholder="JOHN DOE" />
                      <div className="grid grid-cols-2 gap-3">
                        <CardInput label="Expiry" value={cardExpiry} onChange={(v) => setCardExpiry(formatExpiry(v))} placeholder="MM/YY" maxLength={5} mono />
                        <CardInput label="CVV" value={cardCvv} onChange={(v) => setCardCvv(v.replace(/\D/g, '').slice(0, 4))} placeholder="•••" maxLength={4} mono onFocus={() => setCardFlipped(true)} onBlur={() => setCardFlipped(false)} />
                      </div>
                    </div>
                      <div style={{ perspective: '200px' }} >
                      <div className="relative h-56 mt-2.5 w-full transition-transform duration-700"
                        style={{ transformStyle: 'preserve-3d', transform: cardFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                      >
                        <div className="absolute inset-0 rounded-[7px] p-5 flex flex-col justify-between overflow-hidden select-none"
                          style={{ backfaceVisibility: 'hidden', background: 'linear-gradient(135deg,#186737 0%,#0f4d29 55%,#0a3a1e 100%)' }}
                        >
                          <div className="flex justify-between items-start">
                            <div className="w-10 h-7 rounded-md bg-yellow-300/80" />
                            <span className="text-white/50 text-xs font-semibold tracking-widest uppercase">Credit</span>
                          </div>
                          <div>
                            <p className="text-white font-mono text-lg tracking-[0.25em] mb-3 drop-shadow">{cardNum || '•••• •••• •••• ••••'}</p>
                            <div className="flex justify-between items-end">
                              <div>
                                <p className="text-white/40 text-[9px] uppercase tracking-widest mb-0.5">Card Holder</p>
                                <p className="text-white text-sm font-semibold truncate max-w-40 tracking-wide">{cardName || 'YOUR NAME'}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-white/40 text-[9px] uppercase tracking-widest mb-0.5">Expires</p>
                                <p className="text-white text-sm font-semibold">{cardExpiry || 'MM/YY'}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="absolute inset-0 rounded-[7px] overflow-hidden select-none"
                          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', background: 'linear-gradient(135deg,#0d4a26 0%,#186737 100%)' }}
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
                  </div>
                )}
                {payment === 'check' && (
                  <div className="bg-amber-50 border border-amber-200 rounded-[7px] p-4 text-sm">
                    <p className="font-semibold text-amber-800 mb-1">5% Discount Applied 🎉</p>
                    <p className="text-amber-700 text-xs leading-relaxed">
                      Upload a photo of your check after placing the order. No physical mailing required.
                    </p>
                  </div>
                )}
              </section>

              {/* Order Note */}
              <section className="bg-white rounded-[7px] p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100">
                <div className="mb-4 flex items-center gap-2">
                  <SectionTitle icon={<Package size={14} />} title="Order Note" />
                  <span className="text-gray-400 text-xs font-normal">(optional)</span>
                </div>
                <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3}
                  placeholder="Special instructions, delivery notes, or product requirements..."
                  className="w-full border border-gray-200 rounded-[7px] px-4 py-3 text-sm resize-none focus:outline-none focus:border-[#186737] focus:ring-2 focus:ring-green-100 transition-shadow"
                />
              </section>
            </div>

            {/* RIGHT */}
            <div className="space-y-5 lg:sticky lg:top-6">

              {/* Order Summary */}
              <section className="bg-white rounded-[7px] h-80 overflow-y-auto shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag size={15} className="text-[#186737]" />
                    <h2 className="font-semibold text-gray-800 sub-heading-font-size">Order Summary</h2>
                  </div>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full font-medium">{CART_ITEMS.length} items</span>
                </div>
                <div className="divide-y divide-gray-50">
                  {CART_ITEMS.map((item) => (
                    <div key={item.id} className="flex gap-3 p-4">
                      <div className="w-14 h-14 rounded-[7px] bg-gray-100 flex items-center justify-center shrink-0">
                        <Package size={18} className="text-gray-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-700 line-clamp-2 leading-snug">{item.name}</p>
                        <p className="text-[11px] text-gray-400 mt-0.5">Qty: {item.qty}</p>
                        <div className="flex items-baseline gap-1.5 mt-1">
                          <span className="text-sm font-bold text-gray-800">${usd(item.price)}</span>
                          {item.shipping > 0 && <span className="text-[11px] text-gray-400">+ ${usd(item.shipping)} ship</span>}
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-[#186737]">
                          <Truck size={11} />
                          <span className="text-[11px]">Est. {item.deliveryDate}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Coupon */}
              <section className="bg-white rounded-[7px] p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100">
                <div className="mb-4">
                  <SectionTitle icon={<Tag size={14} />} title="Coupon Code" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <input value={coupon} onChange={(e) => setCoupon(e.target.value.toUpperCase())} placeholder="e.g. HORECA10" disabled={couponApplied}
                    className="flex-1 border border-gray-200 rounded-[7px] px-4 py-3 text-sm focus:outline-none focus:border-[#186737] focus:ring-2 focus:ring-green-100 disabled:bg-gray-50 disabled:text-gray-400 transition-shadow"
                  />
                  {couponApplied ? (
                    <button type="button" onClick={() => { setCouponApplied(false); setCoupon('') }}
                      className="px-5 w-full py-3 rounded-[7px] border-2 border-red-200 text-red-500 text-sm font-semibold hover:bg-red-50 transition-colors">Remove</button>
                  ) : (
                    <button type="button" onClick={() => { if (coupon === 'HORECA10') setCouponApplied(true) }}
                      className="px-5 py-3 w-full rounded-[7px] bg-[#186737] text-white text-sm font-semibold transition-colors">Apply</button>
                  )}
                </div>
                {couponApplied && (
                  <p className="text-green-600 text-xs mt-2 flex items-center gap-1">
                    <Check size={12} /> HORECA10 applied — 10% off subtotal
                  </p>
                )}
              </section>

              {/* Delivery Options */}
              <section className="bg-white rounded-[7px] p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <Truck size={15} className="text-[#186737]" />
                  <h2 className="font-semibold text-gray-800 sub-heading-font-size">Delivery Options</h2>
                </div>
                <div className="space-y-2.5">
                  {deliveryOpts.map((opt) => (
                    <div key={opt.label} className="flex items-center justify-between p-3 rounded-[7px] border border-gray-100 hover:bg-gray-50 transition-colors">
                      <div className="flex-1 min-w-0 mr-3">
                        <p className="text-sm font-medium text-gray-700">{opt.label}</p>
                        <p className="text-[11px] text-gray-400 leading-snug">{opt.desc}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs text-gray-500 font-semibold">+${opt.fee}</span>
                        <Switch checked={opt.state} onCheckedChange={opt.toggle}
                          className="data-[state=checked]:bg-[#186737] data-[state=unchecked]:bg-gray-200" />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Price Breakdown */}
              <section className="bg-white rounded-[7px] p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100">
                <div className="space-y-2.5 text-sm">
                  <PriceLine label={`Subtotal (${CART_ITEMS.length} items)`} value={`$${usd(subtotal)}`} />
                  <PriceLine label="Shipping & Handling" value={`$${usd(shippingTotal)}`} />
                  {liftGate && <PriceLine label="Lift Gate Service" value={`$${usd(150)}`} />}
                  {residential && <PriceLine label="Residential Address" value={`$${usd(109)}`} />}
                  {insideDelivery && <PriceLine label="Inside Delivery" value={`$${usd(75)}`} />}
                  <PriceLine label="Tax (8.25%)" value={`$${usd(tax)}`} />
                  {couponApplied && <PriceLine label="Coupon (HORECA10)" value={`-$${usd(couponDiscount)}`} green />}
                  {payment === 'check' && <PriceLine label="Check Discount (5%)" value={`-$${usd(checkDiscount)}`} green />}
                  <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline">
                    <span className="font-bold text-gray-800">Total Amount</span>
                    <span className="text-xl font-bold text-[#186737]">${usd(total)}</span>
                  </div>
                </div>
                <button type="button"
                  className="mt-5 w-full bg-[#186737] active:scale-[0.98] text-white font-semibold py-4 rounded-[7px] transition-all duration-150 flex items-center justify-center gap-2 text-sm shadow-md shadow-green-900/20"
                >
                  <Lock size={14} /> Confirm & Pay — ${usd(total)} <ChevronRight size={15} />
                </button>
                <p className="text-center text-[11px] text-gray-400 mt-3">
                  By placing your order, you agree to our{' '}
                  <Link href="/pages/return-policy" className="text-[#186737] hover:underline">Terms & Return Policy</Link>
                </p>
              </section>

              {/* Trust Badges */}
              <section className="bg-white rounded-[7px] p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100">
                <div className="grid grid-cols-3 gap-3 text-center">
                  {[
                    { Icon: Shield, label: 'Secure Payment', desc: 'SSL encrypted' },
                    { Icon: RotateCcw, label: 'Easy Returns', desc: '30-day policy' },
                    { Icon: CheckCircle2, label: 'Data Safe', desc: 'Never shared' },
                  ].map(({ Icon, label, desc }) => (
                    <div key={label} className="flex flex-col items-center gap-1.5">
                      <div className="w-9 h-9 rounded-[7px] bg-green-50 flex items-center justify-center">
                        <Icon size={16} className="text-[#186737]" />
                      </div>
                      <p className="text-[11px] font-semibold text-gray-700 leading-tight">{label}</p>
                      <p className="text-[10px] text-gray-400">{desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Support */}
              <section className="bg-white rounded-[7px] p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100">
                <p className="text-[11px] font-semibold text-gray-500 text-center mb-3 uppercase tracking-wide">Need Help?</p>
                <div className="grid grid-cols-2 gap-2">
                  {[{ Icon: MessageCircle, label: 'Live Chat' }, { Icon: Phone, label: 'Call Us' }].map(({ Icon, label }) => (
                    <button key={label} type="button"
                      className="flex items-center justify-center gap-2 py-2.5 rounded-[7px] border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 hover:border-[#186737] transition-all"
                    >
                      <Icon size={14} className="text-[#186737]" /> {label}
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

// ─── Desktop sub-components ───────────────────────────────────────────────────

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 rounded-full bg-[#186737] flex items-center justify-center text-white shrink-0">{icon}</div>
      <h2 className="font-semibold text-gray-800 sub-heading-font-size">{title}</h2>
    </div>
  )
}

function PriceLine({ label, value, green = false }: { label: string; value: string; green?: boolean }) {
  return (
    <div className={`flex justify-between ${green ? 'text-[#186737]' : 'text-gray-600'}`}>
      <span>{label}</span>
      <span className="font-medium">{value}</span>
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
    <div className="mb-3">
      <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} maxLength={maxLength} onFocus={onFocus} onBlur={onBlur}
        className={`w-full border border-gray-200 rounded-[7px] px-4 py-3 text-sm focus:outline-none focus:border-[#186737] focus:ring-2 focus:ring-green-100 transition-shadow bg-gray-50/50 ${mono ? 'font-mono tracking-widest' : ''}`}
      />
    </div>
  )
}
