// // 'use client'

// // import {
// //   Check,
// //   CheckCircle2,
// //   ChevronLeft,
// //   ChevronRight,
// //   CreditCard,
// //   Home,
// //   Lock,
// //   MessageCircle,
// //   Package,
// //   Phone,
// //   Plus,
// //   RotateCcw,
// //   Shield,
// //   ShoppingBag,
// //   Tag,
// //   Truck,
// // } from 'lucide-react'
// // import Link from 'next/link'
// // import { useEffect, useState } from 'react'
// // import { Switch } from '@/components/ui/switch'
// // import { MobileCheckout } from './_components/mobile-checkout'
// // import type { Address, CartItem } from './_components/types'

// // // ─── Mock Data ────────────────────────────────────────────────────────────────

// // const CART_ITEMS: CartItem[] = [
// //   { id: 1, name: 'Turbo Air TAO-2510N-N6 23" Super Undercounter Bottle Cooler, 3.0 cu. ft.', qty: 1, price: 2436.63, shipping: 195.0, deliveryDate: 'May 16, 2026' },
// //   { id: 2, name: 'Turbo Air TAO-3000N-N6 30" Super Undercounter Bottle Cooler, 5.1 cu. ft.', qty: 1, price: 2986.26, shipping: 0, deliveryDate: 'May 16, 2026' },
// //   { id: 3, name: 'Turbo Air TAO-3000N-N6 30" Super Undercounter Bottle Cooler, 5.1 cu. ft.', qty: 1, price: 2986.26, shipping: 0, deliveryDate: 'May 16, 2026' },
// //   { id: 4, name: 'Turbo Air TAO-3000N-N6 30" Super Undercounter Bottle Cooler, 5.1 cu. ft.', qty: 1, price: 2986.26, shipping: 0, deliveryDate: 'May 16, 2026' },
// //   { id: 5, name: 'Turbo Air TAO-3000N-N6 30" Super Undercounter Bottle Cooler, 5.1 cu. ft.', qty: 1, price: 2986.26, shipping: 0, deliveryDate: 'May 16, 2026' },
// // ]

// // const ADDRESSES: Address[] = [
// //   { id: 1, label: 'Home', line1: '0000 Los Angeles Memorial Lewis & Blvd', line2: 'California, United States' },
// //   { id: 2, label: 'Office', line1: 'Monterrey, Co, USA 9810, Billings', line2: 'Montana, United States' },
// //   { id: 3, label: 'Branch', line1: 'Apple Valley, Roanoke Creek Basement', line2: 'Santa Clara, CA 0001, United States' },
// //   { id: 4, label: 'Branch', line1: 'Apple Valley, Roanoke Creek Basement', line2: 'Santa Clara, CA 0001, United States' },
// //   { id: 5, label: 'Branch', line1: 'Apple Valley, Roanoke Creek Basement', line2: 'Santa Clara, CA 0001, United States' },
// //   { id: 6, label: 'Branch', line1: 'Apple Valley, Roanoke Creek Basement', line2: 'Santa Clara, CA 0001, United States' },
// //   { id: 7, label: 'Branch', line1: 'Apple Valley, Roanoke Creek Basement', line2: 'Santa Clara, CA 0001, United States' },
// //   { id: 8, label: 'Branch', line1: 'Apple Valley, Roanoke Creek Basement', line2: 'Santa Clara, CA 0001, United States' },
// // ]

// // // ─── Helpers ──────────────────────────────────────────────────────────────────

// // const formatCardNumber = (v: string) =>
// //   v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ')

// // const formatExpiry = (v: string) => {
// //   const d = v.replace(/\D/g, '').slice(0, 4)
// //   return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d
// // }

// // const usd = (n: number) =>
// //   n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

// // // ─── Page ─────────────────────────────────────────────────────────────────────

// // export default function CheckoutPage() {
// //   const [mobileStep, setMobileStep] = useState(1)

// //   // Address slider (desktop)
// //   const [aPage, setAPage] = useState(0)
// //   const [aPerView, setAPerView] = useState(3)
// //   const aTotal = Math.ceil(ADDRESSES.length / aPerView)

// //   useEffect(() => {
// //     const calc = () =>
// //       setAPerView(window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1)
// //     calc()
// //     window.addEventListener('resize', calc)
// //     return () => window.removeEventListener('resize', calc)
// //   }, [])

// //   const [selectedAddress, setSelectedAddress] = useState(1)
// //   const [payment, setPayment] = useState('card')
// //   const [coupon, setCoupon] = useState('')
// //   const [couponApplied, setCouponApplied] = useState(false)
// //   const [liftGate, setLiftGate] = useState(false)
// //   const [residential, setResidential] = useState(false)
// //   const [insideDelivery, setInsideDelivery] = useState(false)
// //   const [note, setNote] = useState('')

// //   const [cardNum, setCardNum] = useState('')
// //   const [cardName, setCardName] = useState('')
// //   const [cardExpiry, setCardExpiry] = useState('')
// //   const [cardCvv, setCardCvv] = useState('')
// //   const [cardFlipped, setCardFlipped] = useState(false)

// //   // Pricing
// //   const subtotal = CART_ITEMS.reduce((s, i) => s + i.price * i.qty, 0)
// //   const shippingTotal = CART_ITEMS.reduce((s, i) => s + i.shipping, 0)
// //   const liftFee = liftGate ? 150 : 0
// //   const resFee = residential ? 109 : 0
// //   const insideFee = insideDelivery ? 75 : 0
// //   const tax = (subtotal + shippingTotal + resFee) * 0.0825
// //   const couponDiscount = couponApplied ? subtotal * 0.1 : 0
// //   const checkDiscount = payment === 'check' ? (subtotal + shippingTotal) * 0.05 : 0
// //   const total = subtotal + shippingTotal + liftFee + resFee + insideFee + tax - couponDiscount - checkDiscount
// //   const totalSavings = couponDiscount + checkDiscount

// //   const deliveryOpts = [
// //     { label: 'Lift Gate Service', desc: 'Required if no loading dock at location', fee: 150, state: liftGate, toggle: () => setLiftGate(!liftGate) },
// //     { label: 'Residential Address', desc: 'Delivery to non-commercial site', fee: 109, state: residential, toggle: () => setResidential(!residential) },
// //     { label: 'Inside Delivery', desc: 'Carried inside the building', fee: 75, state: insideDelivery, toggle: () => setInsideDelivery(!insideDelivery) },
// //   ]

// //   return (
// //     <div className="min-h-screen">

// //       {/* Mobile — separate component file */}
// //       <MobileCheckout
// //         mobileStep={mobileStep}
// //         setMobileStep={setMobileStep}
// //         addresses={ADDRESSES}
// //         selectedAddress={selectedAddress}
// //         setSelectedAddress={setSelectedAddress}
// //         cartItems={CART_ITEMS}
// //         coupon={coupon}
// //         setCoupon={setCoupon}
// //         couponApplied={couponApplied}
// //         setCouponApplied={setCouponApplied}
// //         liftGate={liftGate}
// //         setLiftGate={setLiftGate}
// //         residential={residential}
// //         setResidential={setResidential}
// //         insideDelivery={insideDelivery}
// //         setInsideDelivery={setInsideDelivery}
// //         note={note}
// //         setNote={setNote}
// //         payment={payment}
// //         setPayment={setPayment}
// //         cardNum={cardNum}
// //         setCardNum={setCardNum}
// //         cardName={cardName}
// //         setCardName={setCardName}
// //         cardExpiry={cardExpiry}
// //         setCardExpiry={setCardExpiry}
// //         cardCvv={cardCvv}
// //         setCardCvv={setCardCvv}
// //         cardFlipped={cardFlipped}
// //         setCardFlipped={setCardFlipped}
// //         subtotal={subtotal}
// //         shippingTotal={shippingTotal}
// //         tax={tax}
// //         couponDiscount={couponDiscount}
// //         checkDiscount={checkDiscount}
// //         total={total}
// //         totalSavings={totalSavings}
// //       />

// //       {/* Desktop — 2-column layout */}
// //       <div className="hidden lg:block bg-[#f5f7f5]">
// //         <div className="bg-white border-b border-gray-100">
// //           <div className="global-container py-3 flex items-center gap-2 text-sm">
// //             <Link href="/cart" className="text-[#186737] hover:underline flex items-center gap-1">
// //               <ShoppingBag size={13} /> Cart
// //             </Link>
// //             <ChevronRight size={13} className="text-gray-300" />
// //             <span className="font-semibold text-gray-700">Checkout</span>
// //             <ChevronRight size={13} className="text-gray-300" />
// //             <span className="text-gray-400">Confirmation</span>
// //           </div>
// //         </div>

// //         <main className="global-container py-8 px-0">
// //           <div className="grid grid-cols-1 2xl:grid-cols-[75%_25%] xl:grid-cols-[75%_25%] lg:grid-cols-1 gap-6 items-start">

// //             {/* LEFT */}
// //             <div className="space-y-5">

// //               {/* Shipping Address */}
// //               <section className="bg-white rounded-[7px] p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100">
// //                 <div className="flex items-center justify-between mb-5">
// //                   <SectionTitle icon={<Home size={14} />} title="Shipping Address" />
// //                   <button type="button" className="text-[#186737] text-xs font-semibold flex items-center gap-1 hover:underline">
// //                     <Plus size={13} /> Add New
// //                   </button>
// //                 </div>
// //                 <div className="relative">
// //                   <div className="overflow-hidden">
// //                     <div
// //                       className="flex transition-transform duration-500 ease-in-out"
// //                       style={{
// //                         width: `${(ADDRESSES.length / aPerView) * 100}%`,
// //                         transform: `translateX(-${(aPage * aPerView * 100) / ADDRESSES.length}%)`,
// //                       }}
// //                     >
// //                       {ADDRESSES.map((addr) => {
// //                         const active = selectedAddress === addr.id
// //                         return (
// //                           <div key={addr.id} style={{ width: `${100 / ADDRESSES.length}%` }} className="px-1.5">
// //                             <button type="button" onClick={() => setSelectedAddress(addr.id)}
// //                               className={`w-full text-left p-4 rounded-[7px] border-2 transition-all duration-150 ${
// //                                 active ? 'border-[#186737] bg-green-50/60' : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
// //                               }`}
// //                             >
// //                               <div className="flex items-center justify-between mb-2">
// //                                 <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
// //                                   active ? 'bg-[#186737] text-white' : 'bg-gray-200 text-gray-500'
// //                                 }`}>{addr.label}</span>
// //                                 {active && (
// //                                   <span className="w-5 h-5 rounded-full bg-[#186737] flex items-center justify-center">
// //                                     <Check size={11} className="text-white" />
// //                                   </span>
// //                                 )}
// //                               </div>
// //                               <p className="text-sm font-medium text-gray-700 leading-snug">{addr.line1}</p>
// //                               <p className="text-xs text-gray-400 mt-0.5">{addr.line2}</p>
// //                             </button>
// //                           </div>
// //                         )
// //                       })}
// //                     </div>
// //                   </div>
// //                   {aTotal > 1 && (
// //                     <>
// //                       <button type="button" onClick={() => setAPage((p) => Math.max(0, p - 1))} disabled={aPage === 0}
// //                         className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:border-[#186737] disabled:opacity-30 transition-all"
// //                       >
// //                         <ChevronLeft size={16} className="text-gray-600" />
// //                       </button>
// //                       <button type="button" onClick={() => setAPage((p) => Math.min(aTotal - 1, p + 1))} disabled={aPage === aTotal - 1}
// //                         className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:border-[#186737] disabled:opacity-30 transition-all"
// //                       >
// //                         <ChevronRight size={16} className="text-gray-600" />
// //                       </button>
// //                     </>
// //                   )}
// //                 </div>
// //                 {aTotal > 1 && (
// //                   <div className="flex justify-center gap-1.5 mt-4">
// //                     {Array.from({ length: aTotal }).map((_, i) => (
// //                       <button key={i} type="button" onClick={() => setAPage(i)}
// //                         className={`rounded-full h-2 transition-all duration-300 ${
// //                           i === aPage ? 'w-6 bg-[#186737]' : 'w-2 bg-gray-300 hover:bg-gray-400'
// //                         }`}
// //                       />
// //                     ))}
// //                   </div>
// //                 )}
// //               </section>

// //               {/* Payment Method */}
// //               <section className="bg-white rounded-[7px] p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100">
// //                 <div className="mb-5">
// //                   <SectionTitle icon={<CreditCard size={14} />} title="Payment Method" />
// //                 </div>
// //                 <div className="flex flex-wrap gap-2 mb-6">
// //                   {[
// //                     { id: 'card', label: 'Card', sublabel: 'Visa / MC / Amex', emoji: '💳' },
// //                     { id: 'check', label: 'Check', sublabel: '5% discount', emoji: '📋' },
// //                   ].map((pm) => {
// //                     const active = payment === pm.id
// //                     return (
// //                       <button key={pm.id} type="button" onClick={() => setPayment(pm.id)}
// //                         className={`flex flex-col items-center justify-center gap-1 py-3 px-4 rounded-[7px] border-2 transition-all duration-150 min-w-22.5 ${
// //                           active ? 'border-[#186737] bg-green-50' : 'border-gray-200 bg-gray-50 hover:border-gray-300'
// //                         }`}
// //                       >
// //                         <span className="text-2xl leading-none">{pm.emoji}</span>
// //                         <span className={`text-[11px] font-bold ${active ? 'text-[#186737]' : 'text-gray-600'}`}>{pm.label}</span>
// //                         <span className="text-[9px] text-gray-400 leading-tight text-center">{pm.sublabel}</span>
// //                       </button>
// //                     )
// //                   })}
// //                 </div>
// //                 {payment === 'card' && (
// //                   <div className="grid grid-cols-1 md:grid-cols-[30%_30%] gap-6">

// //                     <div>
// //                       <CardInput label="Card Number" value={cardNum} onChange={(v) => setCardNum(formatCardNumber(v))} placeholder="0000 0000 0000 0000" mono />
// //                       <CardInput label="Name on Card" value={cardName} onChange={(v) => setCardName(v.toUpperCase())} placeholder="JOHN DOE" />
// //                       <div className="grid grid-cols-2 gap-3">
// //                         <CardInput label="Expiry" value={cardExpiry} onChange={(v) => setCardExpiry(formatExpiry(v))} placeholder="MM/YY" maxLength={5} mono />
// //                         <CardInput label="CVV" value={cardCvv} onChange={(v) => setCardCvv(v.replace(/\D/g, '').slice(0, 4))} placeholder="•••" maxLength={4} mono onFocus={() => setCardFlipped(true)} onBlur={() => setCardFlipped(false)} />
// //                       </div>
// //                     </div>
// //                       <div style={{ perspective: '200px' }} >
// //                       <div className="relative h-56 mt-2.5 w-full transition-transform duration-700"
// //                         style={{ transformStyle: 'preserve-3d', transform: cardFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
// //                       >
// //                         <div className="absolute inset-0 rounded-[7px] p-5 flex flex-col justify-between overflow-hidden select-none"
// //                           style={{ backfaceVisibility: 'hidden', background: 'linear-gradient(135deg,#186737 0%,#0f4d29 55%,#0a3a1e 100%)' }}
// //                         >
// //                           <div className="flex justify-between items-start">
// //                             <div className="w-10 h-7 rounded-md bg-yellow-300/80" />
// //                             <span className="text-white/50 text-xs font-semibold tracking-widest uppercase">Credit</span>
// //                           </div>
// //                           <div>
// //                             <p className="text-white font-mono text-lg tracking-[0.25em] mb-3 drop-shadow">{cardNum || '•••• •••• •••• ••••'}</p>
// //                             <div className="flex justify-between items-end">
// //                               <div>
// //                                 <p className="text-white/40 text-[9px] uppercase tracking-widest mb-0.5">Card Holder</p>
// //                                 <p className="text-white text-sm font-semibold truncate max-w-40 tracking-wide">{cardName || 'YOUR NAME'}</p>
// //                               </div>
// //                               <div className="text-right">
// //                                 <p className="text-white/40 text-[9px] uppercase tracking-widest mb-0.5">Expires</p>
// //                                 <p className="text-white text-sm font-semibold">{cardExpiry || 'MM/YY'}</p>
// //                               </div>
// //                             </div>
// //                           </div>
// //                         </div>
// //                         <div className="absolute inset-0 rounded-[7px] overflow-hidden select-none"
// //                           style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', background: 'linear-gradient(135deg,#0d4a26 0%,#186737 100%)' }}
// //                         >
// //                           <div className="w-full h-10 bg-black/40 mt-7" />
// //                           <div className="px-5 mt-4">
// //                             <div className="bg-white/10 rounded-lg h-9 flex items-center justify-end pr-4">
// //                               <p className="text-white font-mono text-sm tracking-[0.3em]">{cardCvv || '•••'}</p>
// //                             </div>
// //                             <p className="text-white/40 text-[10px] text-right mt-1 tracking-widest uppercase">CVV</p>
// //                           </div>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   </div>
// //                 )}
// //                 {payment === 'check' && (
// //                   <div className="bg-amber-50 border border-amber-200 rounded-[7px] p-4 text-sm">
// //                     <p className="font-semibold text-amber-800 mb-1">3% Discount Applied 🎉</p>
// //                     <p className="text-amber-700 text-xs leading-relaxed">
// //                       Upload a photo of your check after placing the order. No physical mailing required.
// //                     </p>
// //                   </div>
// //                 )}
// //               </section>

// //               {/* Order Note */}
// //               <section className="bg-white rounded-[7px] p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100">
// //                 <div className="mb-4 flex items-center gap-2">
// //                   <SectionTitle icon={<Package size={14} />} title="Order Note" />
// //                   <span className="text-gray-400 text-xs font-normal">(optional)</span>
// //                 </div>
// //                 <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3}
// //                   placeholder="Special instructions, delivery notes, or product requirements..."
// //                   className="w-full border border-gray-200 rounded-[7px] px-4 py-3 text-sm resize-none focus:outline-none focus:border-[#186737] focus:ring-2 focus:ring-green-100 transition-shadow"
// //                 />
// //               </section>
// //             </div>

// //             {/* RIGHT */}
// //             <div className="space-y-5 lg:sticky lg:top-6">

// //               {/* Order Summary */}
// //               <section className="bg-white rounded-[7px] h-80 overflow-y-auto shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100">
// //                 <div className="p-5 border-b border-gray-100 flex items-center justify-between">
// //                   <div className="flex items-center gap-2">
// //                     <ShoppingBag size={15} className="text-[#186737]" />
// //                     <h2 className="font-semibold text-gray-800 sub-heading-font-size">Order Summary</h2>
// //                   </div>
// //                   <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full font-medium">{CART_ITEMS.length} items</span>
// //                 </div>
// //                 <div className="divide-y divide-gray-50">
// //                   {CART_ITEMS.map((item) => (
// //                     <div key={item.id} className="flex gap-3 p-4">
// //                       <div className="w-14 h-14 rounded-[7px] bg-gray-100 flex items-center justify-center shrink-0">
// //                         <Package size={18} className="text-gray-300" />
// //                       </div>
// //                       <div className="flex-1 min-w-0">
// //                         <p className="text-xs font-medium text-gray-700 line-clamp-2 leading-snug">{item.name}</p>
// //                         <p className="text-[11px] text-gray-400 mt-0.5">Qty: {item.qty}</p>
// //                         <div className="flex items-baseline gap-1.5 mt-1">
// //                           <span className="text-sm font-bold text-gray-800">${usd(item.price)}</span>
// //                           {item.shipping > 0 && <span className="text-[11px] text-gray-400">+ ${usd(item.shipping)} ship</span>}
// //                         </div>
// //                         <div className="flex items-center gap-1 mt-1 text-[#186737]">
// //                           <Truck size={11} />
// //                           <span className="text-[11px]">Est. {item.deliveryDate}</span>
// //                         </div>
// //                       </div>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </section>

// //               {/* Coupon */}
// //               <section className="bg-white rounded-[7px] p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100">
// //                 <div className="mb-4">
// //                   <SectionTitle icon={<Tag size={14} />} title="Coupon Code" />
// //                 </div>
// //                 <div className="flex flex-wrap gap-2">
// //                   <input value={coupon} onChange={(e) => setCoupon(e.target.value.toUpperCase())} placeholder="e.g. HORECA10" disabled={couponApplied}
// //                     className="flex-1 border border-gray-200 rounded-[7px] px-4 py-3 text-sm focus:outline-none focus:border-[#186737] focus:ring-2 focus:ring-green-100 disabled:bg-gray-50 disabled:text-gray-400 transition-shadow"
// //                   />
// //                   {couponApplied ? (
// //                     <button type="button" onClick={() => { setCouponApplied(false); setCoupon('') }}
// //                       className="px-5 w-full py-3 rounded-[7px] border-2 border-red-200 text-red-500 text-sm font-semibold hover:bg-red-50 transition-colors">Remove</button>
// //                   ) : (
// //                     <button type="button" onClick={() => { if (coupon === 'HORECA10') setCouponApplied(true) }}
// //                       className="px-5 py-3 w-full rounded-[7px] bg-[#186737] text-white text-sm font-semibold transition-colors">Apply</button>
// //                   )}
// //                 </div>
// //                 {couponApplied && (
// //                   <p className="text-green-600 text-xs mt-2 flex items-center gap-1">
// //                     <Check size={12} /> HORECA10 applied — 10% off subtotal
// //                   </p>
// //                 )}
// //               </section>

// //               {/* Delivery Options */}
// //               <section className="bg-white rounded-[7px] p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100">
// //                 <div className="flex items-center gap-2 mb-4">
// //                   <Truck size={15} className="text-[#186737]" />
// //                   <h2 className="font-semibold text-gray-800 sub-heading-font-size">Delivery Options</h2>
// //                 </div>
// //                 <div className="space-y-2.5">
// //                   {deliveryOpts.map((opt) => (
// //                     <div key={opt.label} className="flex items-center justify-between p-3 rounded-[7px] border border-gray-100 hover:bg-gray-50 transition-colors">
// //                       <div className="flex-1 min-w-0 mr-3">
// //                         <p className="text-sm font-medium text-gray-700">{opt.label}</p>
// //                         <p className="text-[11px] text-gray-400 leading-snug">{opt.desc}</p>
// //                       </div>
// //                       <div className="flex items-center gap-3 shrink-0">
// //                         <span className="text-xs text-gray-500 font-semibold">+${opt.fee}</span>
// //                         <Switch checked={opt.state} onCheckedChange={opt.toggle}
// //                           className="data-[state=checked]:bg-[#186737] data-[state=unchecked]:bg-gray-200" />
// //                       </div>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </section>

// //               {/* Price Breakdown */}
// //               <section className="bg-white rounded-[7px] p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100">
// //                 <div className="space-y-2.5 text-sm">
// //                   <PriceLine label={`Subtotal (${CART_ITEMS.length} items)`} value={`$${usd(subtotal)}`} />
// //                   <PriceLine label="Shipping & Handling" value={`$${usd(shippingTotal)}`} />
// //                   {liftGate && <PriceLine label="Lift Gate Service" value={`$${usd(150)}`} />}
// //                   {residential && <PriceLine label="Residential Address" value={`$${usd(109)}`} />}
// //                   {insideDelivery && <PriceLine label="Inside Delivery" value={`$${usd(75)}`} />}
// //                   <PriceLine label="Tax (8.25%)" value={`$${usd(tax)}`} />
// //                   {couponApplied && <PriceLine label="Coupon (HORECA10)" value={`-$${usd(couponDiscount)}`} green />}
// //                   {payment === 'check' && <PriceLine label="Check Discount (5%)" value={`-$${usd(checkDiscount)}`} green />}
// //                   <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline">
// //                     <span className="font-bold text-gray-800">Total Amount</span>
// //                     <span className="text-xl font-bold text-[#186737]">${usd(total)}</span>
// //                   </div>
// //                 </div>
// //                 <button type="button"
// //                   className="mt-5 w-full bg-[#186737] active:scale-[0.98] text-white font-semibold py-4 rounded-[7px] transition-all duration-150 flex items-center justify-center gap-2 text-sm shadow-md shadow-green-900/20"
// //                 >
// //                   <Lock size={14} /> Confirm & Pay — ${usd(total)} <ChevronRight size={15} />
// //                 </button>
// //                 <p className="text-center text-[11px] text-gray-400 mt-3">
// //                   By placing your order, you agree to our{' '}
// //                   <Link href="/pages/return-policy" className="text-[#186737] hover:underline">Terms & Return Policy</Link>
// //                 </p>
// //               </section>

// //               {/* Trust Badges */}
// //               <section className="bg-white rounded-[7px] p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100">
// //                 <div className="grid grid-cols-3 gap-3 text-center">
// //                   {[
// //                     { Icon: Shield, label: 'Secure Payment', desc: 'SSL encrypted' },
// //                     { Icon: RotateCcw, label: 'Easy Returns', desc: '30-day policy' },
// //                     { Icon: CheckCircle2, label: 'Data Safe', desc: 'Never shared' },
// //                   ].map(({ Icon, label, desc }) => (
// //                     <div key={label} className="flex flex-col items-center gap-1.5">
// //                       <div className="w-9 h-9 rounded-[7px] bg-green-50 flex items-center justify-center">
// //                         <Icon size={16} className="text-[#186737]" />
// //                       </div>
// //                       <p className="text-[11px] font-semibold text-gray-700 leading-tight">{label}</p>
// //                       <p className="text-[10px] text-gray-400">{desc}</p>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </section>

// //               {/* Support */}
// //               <section className="bg-white rounded-[7px] p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100">
// //                 <p className="text-[11px] font-semibold text-gray-500 text-center mb-3 uppercase tracking-wide">Need Help?</p>
// //                 <div className="grid grid-cols-2 gap-2">
// //                   {[{ Icon: MessageCircle, label: 'Live Chat' }, { Icon: Phone, label: 'Call Us' }].map(({ Icon, label }) => (
// //                     <button key={label} type="button"
// //                       className="flex items-center justify-center gap-2 py-2.5 rounded-[7px] border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 hover:border-[#186737] transition-all"
// //                     >
// //                       <Icon size={14} className="text-[#186737]" /> {label}
// //                     </button>
// //                   ))}
// //                 </div>
// //               </section>
// //             </div>
// //           </div>
// //         </main>
// //       </div>
// //     </div>
// //   )
// // }

// // // ─── Desktop sub-components ───────────────────────────────────────────────────

// // function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
// //   return (
// //     <div className="flex items-center gap-2">
// //       <div className="w-7 h-7 rounded-full bg-[#186737] flex items-center justify-center text-white shrink-0">{icon}</div>
// //       <h2 className="font-semibold text-gray-800 sub-heading-font-size">{title}</h2>
// //     </div>
// //   )
// // }

// // function PriceLine({ label, value, green = false }: { label: string; value: string; green?: boolean }) {
// //   return (
// //     <div className={`flex justify-between ${green ? 'text-[#186737]' : 'text-gray-600'}`}>
// //       <span>{label}</span>
// //       <span className="font-medium">{value}</span>
// //     </div>
// //   )
// // }

// // function CardInput({
// //   label, value, onChange, placeholder, maxLength, mono = false, onFocus, onBlur,
// // }: {
// //   label: string; value: string; onChange: (v: string) => void; placeholder: string
// //   maxLength?: number; mono?: boolean; onFocus?: () => void; onBlur?: () => void
// // }) {
// //   return (
// //     <div className="mb-3">
// //       <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">{label}</label>
// //       <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} maxLength={maxLength} onFocus={onFocus} onBlur={onBlur}
// //         className={`w-full border border-gray-200 rounded-[7px] px-4 py-3 text-sm focus:outline-none focus:border-[#186737] focus:ring-2 focus:ring-green-100 transition-shadow bg-gray-50/50 ${mono ? 'font-mono tracking-widest' : ''}`}
// //       />
// //     </div>
// //   )
// // }

// // ─── NEW SHOPIFY-STYLE CHECKOUT ───────────────────────────────────────────────

// "use client";

// import { ChevronRight, Pencil, Tag, Truck } from "lucide-react";
// import Link from "next/link";
// import { useEffect, useRef, useState } from "react";
// import { useAppDispatch, useAppSelector } from "@/store/hooks";
// import {
//   fetchCart,
//   hydrateCart,
//   resetApiStatus,
// } from "@/store/slices/cart/cartSlice";
// import {
//   getDefaultAddressCache,
//   getLocationData,
// } from "@/utils/locationStorage";
// import Breadcrumb from "@/components/breadcum";
// import CheckoutPayment, { CheckoutPaymentHandle } from "./checkout-payment";

// const CART_SUMMARY_KEY = "hc_cart_summary";

// interface CartSummaryCache {
//   subTotal: number;
//   discountAmount: number;
//   totalShippingCharges: number;
//   taxRatePercentage: number;
//   isCouponApplied: boolean;
// }

// const usd = (n: number) =>
//   n.toLocaleString("en-US", {
//     minimumFractionDigits: 2,
//     maximumFractionDigits: 2,
//   });

// const resolveStr = (
//   v: { en?: string; ar?: string } | string | null | undefined,
// ): string => {
//   if (!v) return "";
//   if (typeof v === "string") return v;
//   return v.en ?? v.ar ?? "";
// };

// const getToken = (): string | null => {
//   if (typeof window === "undefined") return null;
//   try {
//     const t = localStorage.getItem("token");
//     return t ? t.trim().replace(/^["']|["']$/g, "") : null;
//   } catch {
//     return null;
//   }
// };

// export default function CheckoutPage() {
//   const dispatch = useAppDispatch();
//   const rawProducts = useAppSelector((s) => s.cart.rawProducts);
//   const guestItems = useAppSelector((s) => s.cart.items);
//   const apiStatus = useAppSelector((s) => s.cart.apiStatus);
//   const paymentHandleRef = useRef<CheckoutPaymentHandle | null>(null);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [cartSummary, setCartSummary] = useState<CartSummaryCache | null>(null);
//   const [email, setEmail] = useState("");
//   const [newsletter, setNewsletter] = useState(false);
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [company, setCompany] = useState("");
//   const [address, setAddress] = useState("");
//   const [apt, setApt] = useState("");
//   const [city, setCity] = useState("");
//   const [country, setCountry] = useState("United States");
//   const [stateName, setStateName] = useState("");
//   const [zip, setZip] = useState("");
//   const [phone, setPhone] = useState("");
//   const [code, setCode] = useState("");
//   const [codeApplied, setCodeApplied] = useState(false);
//   const [codeError, setCodeError] = useState(false);
//   const [discount, setDiscount] = useState(0);
//   const [liftGate, setLiftGate] = useState(false);
//   const [residential, setResidential] = useState(false);
//   const [insideDelivery, setInsideDelivery] = useState(false);

//   const fetchedRef = useRef(false);

//   useEffect(() => {
//     if (fetchedRef.current) return;
//     fetchedRef.current = true;

//     // Read saved cart summary for pricing
//     try {
//       const raw = localStorage.getItem(CART_SUMMARY_KEY);
//       if (raw) {
//         const saved: CartSummaryCache = JSON.parse(raw);
//         setCartSummary(saved);
//         if (saved.isCouponApplied) {
//           setCodeApplied(true);
//           setDiscount(saved.discountAmount);
//         }
//       }
//     } catch {
//       /* ignore */
//     }

//     // Pre-fill user info from localStorage
//     try {
//       const raw = localStorage.getItem("user");
//       if (raw) {
//         const user = JSON.parse(raw);
//         setEmail(user.email ?? "");
//         const code = user.country_code ?? "";
//         const mobile = user.mobile_number ?? "";
//         setPhone(code ? `${code}${mobile}` : mobile);
//         const parts = (user.name ?? "").trim().split(/\s+/);
//         setFirstName(parts[0] ?? "");
//         setLastName(parts.slice(1).join(" "));
//       }
//     } catch {
//       /* ignore */
//     }

//     // Pre-fill shipping address from localStorage
//     const addr = getDefaultAddressCache();
//     if (addr) {
//       setAddress(addr.address ?? "");
//       setApt(addr.address2 ?? "");
//       setCity(addr.related_city?.name ?? addr.city ?? "");
//       setStateName(addr.related_state?.name ?? addr.state ?? "");
//       setZip(addr.zip_code ?? "");
//       setCountry(addr.related_country?.name ?? addr.country ?? "United States");
//     }

//     // Fetch cart from API (logged-in) or hydrate from localStorage (guest)
//     const token = getToken();
//     setIsLoggedIn(!!token);
//     const location = getLocationData();
//     if (token) {
//       dispatch(resetApiStatus());
//       dispatch(fetchCart(location?.country ?? ""));
//     } else {
//       dispatch(hydrateCart());
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const apiCartItems = rawProducts.map((cp: any) => ({
//     id: cp.id as number,
//     name: resolveStr(cp.product?.name),
//     image: cp.product?.images?.en?.[0] ?? cp.product?.images?.ar?.[0] ?? "",
//     qty: cp.quantity as number,
//     price: parseFloat(cp.unit_price ?? cp.product?.price ?? 0),
//     shipping: parseFloat(cp.shipping_charge ?? 0),
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     accessories: (cp.accessory_charges ?? []).reduce(
//       (s: number, a: any) => s + parseFloat(a.accessory_item_price ?? 0),
//       0,
//     ),
//   }));

//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const guestCartItems = guestItems.map((item: any) => ({
//     id: item.productId as number,
//     name: item.name ?? "",
//     image: item.image ?? "",
//     qty: item.quantity as number,
//     price: item.price ?? 0,
//     shipping: item.shippingCharge ?? 0,
//     accessories: (item.selectedAccessories ?? []).reduce(
//       (s: number, a: { price: number }) => s + a.price,
//       0,
//     ),
//   }));

//   const cartItems = isLoggedIn ? apiCartItems : guestCartItems;

//   // ── Pricing from saved cart summary (localStorage) ────────────────────────
//   const baseSubtotal = cartSummary?.subTotal ?? 0;
//   const baseShipping = cartSummary?.totalShippingCharges ?? 0;
//   const ratePercent = cartSummary?.taxRatePercentage ?? 0;
//   const taxRate = ratePercent / 100;

//   const taxable = baseSubtotal - discount;

//   // Service fees (added on checkout) — each taxed at same rate
//   const liftFee = liftGate ? 75 : 0;
//   const resFee = residential ? 199 : 0;
//   const insideFee = insideDelivery ? 249 : 0;

//   const taxOnBase = (taxable + baseShipping) * taxRate;
//   const taxOnFees = (liftFee + resFee + insideFee) * taxRate;
//   const totalTax = taxOnBase + taxOnFees;

//   const grandTotal =
//     taxable + baseShipping + liftFee + resFee + insideFee + totalTax;
//   const totalItems = cartItems.reduce((s, c) => s + c.qty, 0);

//   const isCartLoading =
//     isLoggedIn && (apiStatus === "idle" || apiStatus === "loading");

//   // ── Sync updated summary back to localStorage whenever fees / discount change ─
//   useEffect(() => {
//     if (!cartSummary) return;
//     try {
//       const additionalFees = liftFee + resFee + insideFee;
//       const updated = {
//         ...cartSummary,
//         discountAmount: discount,
//         discountedSubtotal: taxable,
//         finalDiscountedSubtotal: taxable,
//         liftGateFee: liftFee,
//         residentialFee: resFee,
//         insideDeliveryFee: insideFee,
//         additionalFees,
//         taxableAmount: taxable + baseShipping + additionalFees,
//         taxAmount: totalTax,
//         total: grandTotal,
//         isCouponApplied: codeApplied,
//       };
//       localStorage.setItem(CART_SUMMARY_KEY, JSON.stringify(updated));
//     } catch {
//       /* ignore */
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [
//     liftGate,
//     residential,
//     insideDelivery,
//     discount,
//     codeApplied,
//     grandTotal,
//   ]);

//   const handleApplyCode = () => {
//     if (code.toUpperCase() === "HORECA10") {
//       setDiscount(baseSubtotal * 0.1);
//       setCodeApplied(true);
//       setCodeError(false);
//     } else {
//       setCodeError(true);
//     }
//   };

//   const crumbs = [
//     { label: "Home", href: "/" },
//     { label: "Cart", href: "/cart" },
//     { label: "Checkout", href: null },
//   ];

//   return (
//     <>
//       <Breadcrumb crumbs={crumbs} />
//       <div className=" global-container bg-white">
//         {/* <div className="grid grid-cols-1 lg:grid-cols-[1fr_485px] max-w-7xl mx-auto "> */}
//         <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] max-w-7xl mx-auto ">
//           {/* ── LEFT ─────────────────────────────────────────────────────────── */}
//           <div className="px-6 md:px-12 xl:px-20 py-10 pt-0 border-r border-gray-100">
//             {/* Breadcrumb */}

//             {/* Express Checkout */}
//             {/* <div className="border border-gray-200 rounded-lg p-4 mb-6"> */}
//             <div className="">
//               {/* <p className="text-center text-xs text-gray-500 font-medium mb-3">Express checkout</p>
//             <div className="grid grid-cols-3 gap-2">
//               <button className="h-11 rounded-md bg-[#5a31f4] hover:opacity-90 transition-opacity flex items-center justify-center">
//                 <span className="text-white font-bold text-sm">shop<span className="font-black">pay</span></span>
//               </button>
//               <button className="h-11 rounded-md bg-[#ffc439] hover:opacity-90 transition-opacity flex items-center justify-center">
//                 <span className="text-[#003087] font-bold text-xs">P <span className="text-[#0070ba]">PayPal</span></span>
//               </button>
//               <button className="h-11 rounded-md bg-black hover:opacity-90 transition-opacity flex items-center justify-center gap-1">
//                 <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
//                   <path d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z"/>
//                 </svg>
//                 <span className="text-white font-semibold text-sm">Pay</span>
//               </button>
//             </div> */}

//               <CheckoutPayment
//                 squareAppId={process.env.NEXT_PUBLIC_SQUARE_APP_ID!}
//                 squareLocationId={process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID!}
//                 onHandleReady={(h) => {
//                   paymentHandleRef.current = h;
//                 }}
//               />
//             </div>

//             {/* Divider */}
//             <div className="flex items-center gap-3 mb-6">
//               {/* <div className="flex-1 h-px bg-gray-200" />
//               <span className="text-xs text-gray-400 font-medium">OR</span>
//               <div className="flex-1 h-px bg-gray-200" /> */}
//             </div>

//             {/* Contact */}
//             <div className="mb-7">
//               <div className="flex items-center justify-between mb-4">
//                 <div className="flex justify-between items-center w-full">
//                   <h2 className="text-base font-semibold text-gray-900">
//                     Contact information
//                   </h2>
//                   <Link
//                     href={"/dashboard/my-profile"}
//                     className="text-xs font-semibold text-green-700 cursor-pointer flex gap-1.5 items-center"
//                   >
//                     Edit Info <Pencil className="w-3" />
//                   </Link>
//                 </div>
//                 {/* <span className="text-xs text-gray-500">
//                   Already have an account?{" "}
//                   <Link
//                     href="/login"
//                     className="text-[#186737] hover:underline font-medium"
//                   >
//                     Log in
//                   </Link>
//                 </span> */}
//               </div>
//               <div className="space-y-3">
//                 <Field
//                   value={email}
//                   onChange={setEmail}
//                   type="email"
//                   placeholder="Email"
//                   disable={true}
//                 />
//                 <div className="grid grid-cols-2 gap-3">
//                   <Field
//                     value={`${firstName} ${lastName}`}
//                     onChange={setFirstName}
//                     placeholder="First name"
//                     disable={true}
//                   />
//                   <Field
//                     value={phone}
//                     onChange={setPhone}
//                     type="tel"
//                     placeholder="Phone"
//                     disable={true}
//                   />
//                 </div>
//                 {/* <label className="flex items-center gap-2.5 cursor-pointer">
//                   <input
//                     type="checkbox"
//                     checked={newsletter}
//                     onChange={(e) => setNewsletter(e.target.checked)}
//                     className="w-4 h-4 rounded border-gray-300 accent-[#186737]"
//                   />
//                   <span className="text-sm text-gray-600">
//                     Email me with news and offers
//                   </span>
//                 </label> */}
//               </div>
//             </div>

//             {/* Shipping Address */}
//             <div className="mb-8">
//               <h2 className="text-base font-semibold text-gray-900 mb-4">
//                 Shipping address
//               </h2>
//               <div className="space-y-3">
//                 <Field
//                   value={company}
//                   onChange={setCompany}
//                   placeholder="Company (optional)"
//                 />
//                 <Field
//                   value={address}
//                   onChange={setAddress}
//                   placeholder="Address"
//                 />
//                 <Field
//                   value={apt}
//                   onChange={setApt}
//                   placeholder="Apartment, suite, etc. (optional)"
//                 />
//                 <Field value={city} onChange={setCity} placeholder="Suburb" />
//                 <div className="grid grid-cols-3 gap-3">
//                   <SelectField
//                     value={country}
//                     onChange={setCountry}
//                     options={[
//                       "United States",
//                       "Canada",
//                       "United Kingdom",
//                       "Australia",
//                     ]}
//                     placeholder="Country/region"
//                   />
//                   <Field
//                     value={stateName}
//                     onChange={setStateName}
//                     placeholder="State/territory"
//                   />
//                   <Field value={zip} onChange={setZip} placeholder="Postcode" />
//                 </div>
//               </div>
//             </div>

//             {/*
//           <div className="flex flex-wrap gap-4 mt-8 text-xs text-[#186737]">
//             <Link href="/pages/return-policy"  className="hover:underline">Refund policy</Link>
//             <Link href="/pages/privacy-policy" className="hover:underline">Privacy policy</Link>
//             <Link href="/pages/terms"          className="hover:underline">Terms of service</Link>
//           </div> */}
//           </div>

//           {/* ── RIGHT — Order Summary ─────────────────────────────────────────── */}
//           <div className="bg-[#fafafa] border-l border-gray-100 px-6 md:px-10 py-10">
//             {/* Items */}
//             <div className="space-y-4 mb-6">
//               {isCartLoading ? (
//                 <div className="space-y-4 py-2">
//                   {[1, 2].map((i) => (
//                     <div
//                       key={i}
//                       className="flex items-start gap-3 animate-pulse"
//                     >
//                       <div className="w-16 h-16 rounded-md bg-gray-200 shrink-0" />
//                       <div className="flex-1 space-y-2 pt-1">
//                         <div className="h-3 bg-gray-200 rounded w-3/4" />
//                         <div className="h-3 bg-gray-200 rounded w-1/2" />
//                       </div>
//                       <div className="h-4 bg-gray-200 rounded w-14 shrink-0 mt-1" />
//                     </div>
//                   ))}
//                 </div>
//               ) : cartItems.length === 0 ? (
//                 <p className="text-sm text-gray-400 text-center py-8">
//                   Your cart is empty.
//                 </p>
//               ) : (
//                 cartItems.map((item) => (
//                   <div key={item.id} className="flex items-start gap-3">
//                     <div className="relative shrink-0">
//                       <div className="w-16 h-16 rounded-md border border-gray-200 bg-white overflow-hidden flex items-center justify-center">
//                         {item.image ? (
//                           <img
//                             src={item.image}
//                             alt={item.name}
//                             className="w-full h-full object-contain p-1"
//                           />
//                         ) : (
//                           <div className="w-full h-full bg-gray-100" />
//                         )}
//                       </div>
//                       <span className="absolute -top-2 -right-2 w-5 h-5 bg-gray-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
//                         {item.qty}
//                       </span>
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm text-gray-800 font-medium leading-snug line-clamp-2">
//                         {item.name}
//                       </p>
//                       {item.accessories > 0 && (
//                         <p className="text-[11px] text-gray-400 mt-0.5">
//                           +${usd(item.accessories)} accessories
//                         </p>
//                       )}
//                       {item.shipping > 0 && (
//                         <div className="flex items-center gap-1 mt-0.5 text-[11px] text-gray-400">
//                           <Truck size={10} /> ${usd(item.shipping)} shipping
//                         </div>
//                       )}
//                     </div>
//                     <span className="text-sm font-semibold text-gray-800 shrink-0">
//                       ${usd((item.price + item.accessories) * item.qty)}
//                     </span>
//                   </div>
//                 ))
//               )}
//             </div>

//             {/* Discount code */}
//             <div className="flex gap-2 mb-2">
//               <div className="relative flex-1">
//                 <Tag
//                   size={14}
//                   className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                 />
//                 <input
//                   type="text"
//                   value={code}
//                   onChange={(e) => {
//                     setCode(e.target.value.toUpperCase());
//                     setCodeError(false);
//                   }}
//                   placeholder="Gift card or discount code"
//                   disabled={codeApplied}
//                   className="w-full h-10 pl-9 pr-3 border border-gray-300 rounded-md text-sm outline-none focus:border-[#186737] focus:ring-1 focus:ring-[#186737]/20 bg-white disabled:bg-gray-50 disabled:text-gray-400"
//                 />
//               </div>
//               <button
//                 onClick={handleApplyCode}
//                 disabled={codeApplied || !code}
//                 className="h-10 px-4 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-gray-700 text-sm font-medium transition-colors"
//               >
//                 Apply
//               </button>
//             </div>
//             {codeError && (
//               <p className="text-[11px] text-red-500 mb-4">Invalid code.</p>
//             )}
//             {codeApplied && (
//               <p className="text-[11px] text-[#186737] mb-4">
//                 HORECA10 — 10% off applied
//               </p>
//             )}

//             <div className="h-px bg-gray-200 my-4" />

//             {/* Delivery Options */}
//             <div className="mb-8 border border-gray-200 rounded-lg overflow-hidden">
//               <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
//                 <h2 className="text-sm font-semibold text-gray-900">
//                   Lift Gate or Residential Address
//                 </h2>
//               </div>
//               <div className="divide-y divide-gray-100">
//                 {[
//                   {
//                     label: "Lift Gate Service",
//                     desc: "Required for deliveries without loading dock",
//                     fee: 75,
//                     state: liftGate,
//                     toggle: () => setLiftGate(!liftGate),
//                   },
//                   {
//                     label: "Residential Address",
//                     desc: "Delivery to home or residential location",
//                     fee: 199,
//                     state: residential,
//                     toggle: () => setResidential(!residential),
//                   },
//                   {
//                     label: "Inside Delivery Address",
//                     desc: "Delivery inside the building",
//                     fee: 249,
//                     state: insideDelivery,
//                     toggle: () => setInsideDelivery(!insideDelivery),
//                   },
//                 ].map(({ label, desc, fee, state, toggle }) => (
//                   <div
//                     key={label}
//                     className="flex items-center justify-between px-4 py-3.5"
//                   >
//                     <div>
//                       <p className="text-sm font-medium text-gray-800">
//                         {label}
//                       </p>
//                       <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
//                       {state && (
//                         <p className="text-xs text-[#186737] font-semibold mt-1">
//                           +${fee}.00 fee will be added
//                         </p>
//                       )}
//                     </div>
//                     <button
//                       type="button"
//                       onClick={toggle}
//                       className={`relative shrink-0 w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${state ? "bg-[#186737]" : "bg-gray-300"}`}
//                     >
//                       <span
//                         className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${state ? "translate-x-5" : "translate-x-0"}`}
//                       />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//             <div className="h-px bg-gray-200 my-4" />

//             {isCartLoading ? (
//               /* ── Price skeleton (matches cart item skeleton duration) ── */
//               <div className="space-y-3 animate-pulse mb-4">
//                 {[80, 64, 56, 48].map((w) => (
//                   <div key={w} className="flex justify-between items-center">
//                     <div
//                       className={`h-3 bg-gray-200 rounded`}
//                       style={{ width: `${w}%` }}
//                     />
//                     <div className="h-3 bg-gray-200 rounded w-16" />
//                   </div>
//                 ))}
//                 <div className="h-px bg-gray-200 my-3" />
//                 <div className="flex justify-between items-center pt-1">
//                   <div className="h-4 bg-gray-200 rounded w-28" />
//                   <div className="h-5 bg-gray-200 rounded w-24" />
//                 </div>
//               </div>
//             ) : (
//               <>
//                 {/* Price rows */}
//                 <div className="space-y-2 text-sm mb-4">
//                   <PriceRow
//                     label={`Subtotal (${totalItems} item${totalItems !== 1 ? "s" : ""})`}
//                     value={`$${usd(baseSubtotal)}`}
//                   />
//                   {codeApplied && (
//                     <PriceRow
//                       label="Discount (HORECA10)"
//                       value={`-$${usd(discount)}`}
//                       green
//                     />
//                   )}

//                   <PriceRow
//                     label={`Shipping & Handling${ratePercent > 0 ? ` (+${ratePercent}% tax)` : ""}`}
//                     value={`$${usd(baseShipping)}`}
//                   />

//                   {liftGate && (
//                     <PriceRow
//                       label={`Lift Gate Service${ratePercent > 0 ? ` (+${ratePercent}% tax)` : ""}`}
//                       value={`$${usd(liftFee)}`}
//                     />
//                   )}
//                   {residential && (
//                     <PriceRow
//                       label={`Residential Address${ratePercent > 0 ? ` (+${ratePercent}% tax)` : ""}`}
//                       value={`$${usd(resFee)}`}
//                     />
//                   )}
//                   {insideDelivery && (
//                     <PriceRow
//                       label={`Inside Delivery${ratePercent > 0 ? ` (+${ratePercent}% tax)` : ""}`}
//                       value={`$${usd(insideFee)}`}
//                     />
//                   )}

//                   {ratePercent > 0 && (
//                     <PriceRow
//                       label={`Tax (${ratePercent}%)`}
//                       value={`$${usd(totalTax)}`}
//                     />
//                   )}
//                 </div>

//                 <div className="h-px bg-gray-200 mb-4" />

//                 {/* Total */}
//                 <div className="flex items-center justify-between">
//                   <span className="font-bold text-gray-900 text-base">
//                     Total Amount
//                   </span>
//                   <span className="font-bold text-gray-900 text-xl">
//                     ${usd(grandTotal)}
//                   </span>
//                 </div>

//                 {/* Footer actions */}
//                 <div className="flex items-center justify-between pt-4 border-t border-gray-100 flex-wrap gap-4">
//                   <Link
//                     href="/cart"
//                     className="flex items-center gap-1 text-[#186737] text-sm hover:underline font-medium"
//                   >
//                     <ChevronRight size={14} className="rotate-180" /> Return to
//                     cart
//                   </Link>
//                   <button
//                     type="button"
//                     className="bg-[#186737] hover:bg-[#145c30] text-white font-semibold px-8 py-3 rounded-md text-sm transition-colors"
//                   >
//                     Place Order
//                   </button>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// // ─── Sub-components ───────────────────────────────────────────────────────────

// function Field({
//   value,
//   onChange,
//   type = "text",
//   placeholder,
//   disable,
// }: {
//   value: string;
//   onChange: (v: string) => void;
//   type?: string;
//   placeholder?: string;
//   disable?: boolean;
// }) {
//   return (
//     <input
//       type={type}
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       placeholder={placeholder}
//       disabled={disable}
//       className={`w-full h-12 px-3 border border-gray-300 rounded-md text-sm outline-none focus:border-[#186737] focus:ring-1 focus:ring-[#186737]/20 bg-white placeholder:text-gray-400 transition-all ${disable && "cursor-not-allowed"}`}
//     />
//   );
// }

// function SelectField({
//   value,
//   onChange,
//   options,
//   placeholder,
// }: {
//   value: string;
//   onChange: (v: string) => void;
//   options: string[];
//   placeholder?: string;
// }) {
//   return (
//     <div className="relative">
//       <select
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         className="w-full h-12 px-3 border border-gray-300 rounded-md text-sm outline-none focus:border-[#186737] focus:ring-1 focus:ring-[#186737]/20 bg-white text-gray-700 appearance-none cursor-pointer"
//       >
//         {placeholder && (
//           <option value="" disabled>
//             {placeholder}
//           </option>
//         )}
//         {options.map((o) => (
//           <option key={o} value={o}>
//             {o}
//           </option>
//         ))}
//       </select>
//       <ChevronRight
//         size={13}
//         className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none"
//       />
//     </div>
//   );
// }

// function PriceRow({
//   label,
//   value,
//   green = false,
//   muted = false,
// }: {
//   label: string;
//   value: string;
//   green?: boolean;
//   muted?: boolean;
// }) {
//   return (
//     <div className="flex justify-between items-center">
//       <span className="text-gray-600">{label}</span>
//       <span
//         className={`font-medium ${green ? "text-[#186737]" : muted ? "text-gray-400 italic text-xs" : "text-gray-800"}`}
//       >
//         {value}
//       </span>
//     </div>
//   );
// }

"use client";

import { apiUrls } from "@/apis/api-endpoint";
import { makeApiRequest } from "@/apis/axios-instance";
import Breadcrumb from "@/components/breadcum";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchCart,
  hydrateCart,
  resetApiStatus,
} from "@/store/slices/cart/cartSlice";
import {
  getDefaultAddressCache,
  getLocationData,
} from "@/utils/locationStorage";
import { getShippingCharge } from "@/utils/shipping";
import { AddressesTab } from "@/app/(dashboard-my-profile)/dashboard/my-profile/_components/AddressesTab";
import { fetchAddresses } from "@/store/slices/customer-address/customerAddressSlice";
import { fetchCounts } from "@/store/slices/customer-counts/customerCountsSlice";
import { ChevronRight, Pencil, Tag, Truck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import CheckoutPayment, { CheckoutPaymentHandle } from "./checkout-payment";

const CART_SUMMARY_KEY = "hc_cart_summary";

interface CartSummaryCache {
  subTotal: number;
  discountAmount: number;
  totalShippingCharges: number;
  taxRatePercentage: number;
  isCouponApplied: boolean;
}

const usd = (n: number) =>
  n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const resolveStr = (
  v: { en?: string; ar?: string } | string | null | undefined,
): string => {
  if (!v) return "";
  if (typeof v === "string") return v;
  return v.en ?? v.ar ?? "";
};

const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  try {
    const t = localStorage.getItem("token");
    return t ? t.trim().replace(/^["']|["']$/g, "") : null;
  } catch {
    return null;
  }
};

// ─── API base URL ─────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const rawProducts = useAppSelector((s) => s.cart.rawProducts);
  const guestItems = useAppSelector((s) => s.cart.items);
  const apiStatus = useAppSelector((s) => s.cart.apiStatus);
  const addresses = useAppSelector((s) => s.customerAddress.addresses);
  console.log("rawProducts", rawProducts);
  const paymentHandleRef = useRef<CheckoutPaymentHandle | null>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartSummary, setCartSummary] = useState<CartSummaryCache | null>(null);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [codeApplied, setCodeApplied] = useState(false);
  const [codeError, setCodeError] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [liftGate, setLiftGate] = useState(false);
  const [residential, setResidential] = useState(false);
  const [insideDelivery, setInsideDelivery] = useState(false);

  // ── Derived state ────────────────────────────────────────────────────────────
  const hasAddress =
    addresses.some((a) => a.is_default) || !!getDefaultAddressCache();

  // Mobile step (1 = Contact + Address, 2 = Cart + Payment)
  const [mobileStep, setMobileStep] = useState(1);

  // Place Order button loading
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Inline error message (card ya address)
  const [orderError, setOrderError] = useState<string | null>(null);

  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    // Read saved cart summary for pricing
    try {
      const raw = localStorage.getItem(CART_SUMMARY_KEY);
      if (raw) {
        const saved: CartSummaryCache = JSON.parse(raw);
        setCartSummary(saved);
        if (saved.isCouponApplied) {
          setCodeApplied(true);
          setDiscount(saved.discountAmount);
        }
      }
    } catch {
      /* ignore */
    }

    // Pre-fill user info from localStorage
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const user = JSON.parse(raw);
        setEmail(user.email ?? "");
        const code = user.country_code ?? "";
        const mobile = user.mobile_number ?? "";
        setPhone(code ? `${code}${mobile}` : mobile);
        const parts = (user.name ?? "").trim().split(/\s+/);
        setFirstName(parts[0] ?? "");
        setLastName(parts.slice(1).join(" "));
      }
    } catch {
      /* ignore */
    }

    // Fetch cart
    const token = getToken();
    setIsLoggedIn(!!token);
    const location = getLocationData();
    if (token) {
      dispatch(resetApiStatus());
      dispatch(fetchCart(location?.country ?? ""));
      dispatch(fetchAddresses());
    } else {
      dispatch(hydrateCart());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const apiCartItems = rawProducts.map((cp: any) => ({
    id: cp.id as number,
    name: resolveStr(cp.product?.name),
    image: cp.product?.images?.en?.[0] ?? cp.product?.images?.ar?.[0] ?? "",
    qty: cp.quantity as number,
    price: parseFloat(cp.unit_price ?? cp.product?.price ?? 0),
    shipping: parseFloat(cp.shipping_charge ?? 0),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    accessories: (cp.accessory_charges ?? []).reduce(
      (s: number, a: any) => s + parseFloat(a.accessory_item_price ?? 0),
      0,
    ),
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const guestCartItems = guestItems.map((item: any) => ({
    id: item.productId as number,
    name: item.name ?? "",
    image: item.image ?? "",
    qty: item.quantity as number,
    price: item.price ?? 0,
    shipping: item.shippingCharge ?? 0,
    accessories: (item.selectedAccessories ?? []).reduce(
      (s: number, a: { price: number }) => s + a.price,
      0,
    ),
  }));

  const cartItems = isLoggedIn ? apiCartItems : guestCartItems;

  const currencySymbol: string =
    (rawProducts[0] as any)?.product?.currency?.symbol ?? "$";

  // ── Pricing ───────────────────────────────────────────────────────────────
  const baseSubtotal = cartSummary?.subTotal ?? 0;
  const baseShipping = cartSummary?.totalShippingCharges ?? 0;
  const ratePercent = cartSummary?.taxRatePercentage ?? 0;
  const taxRate = ratePercent / 100;
  const taxable = baseSubtotal - discount;
  const liftFee = liftGate ? 75 : 0;
  const resFee = residential ? 199 : 0;
  const insideFee = insideDelivery ? 249 : 0;
  const taxOnBase = (taxable + baseShipping) * taxRate;
  const taxOnFees = (liftFee + resFee + insideFee) * taxRate;
  const totalTax = taxOnBase + taxOnFees;
  const grandTotal =
    taxable + baseShipping + liftFee + resFee + insideFee + totalTax;
  const totalItems = cartItems.reduce((s, c) => s + c.qty, 0);

  const isCartLoading =
    isLoggedIn && (apiStatus === "idle" || apiStatus === "loading");

  // ── Sync summary to localStorage ──────────────────────────────────────────
  useEffect(() => {
    if (!cartSummary) return;
    try {
      const additionalFees = liftFee + resFee + insideFee;
      const updated = {
        ...cartSummary,
        discountAmount: discount,
        discountedSubtotal: taxable,
        finalDiscountedSubtotal: taxable,
        liftGateFee: liftFee,
        residentialFee: resFee,
        insideDeliveryFee: insideFee,
        additionalFees,
        taxableAmount: taxable + baseShipping + additionalFees,
        taxAmount: totalTax,
        total: grandTotal,
        isCouponApplied: codeApplied,
      };
      localStorage.setItem(CART_SUMMARY_KEY, JSON.stringify(updated));
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    liftGate,
    residential,
    insideDelivery,
    discount,
    codeApplied,
    grandTotal,
  ]);

  const handleApplyCode = () => {
    if (code.toUpperCase() === "HORECA10") {
      setDiscount(baseSubtotal * 0.1);
      setCodeApplied(true);
      setCodeError(false);
    } else {
      setCodeError(true);
    }
  };

  // ── Place Order handler ───────────────────────────────────────────────────
  // const handlePlaceOrder = async () => {
  //   setOrderError(null)

  //   // STEP 1: Card filled check — Square tokenize se pata chalega
  //   // Pehle address check karte hain
  //   if (!hasAddress) {
  //     setOrderError('Please add a delivery address before placing your order.')
  //     // Address section pe scroll karo
  //     document.getElementById('shipping-address-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  //     return
  //   }

  //   // STEP 2: Tokenize karo — agar card empty hai Square khud error dega
  //   if (!paymentHandleRef.current) {
  //     setOrderError('Payment form is not ready. Please wait a moment and try again.')
  //     return
  //   }

  //   setIsPlacingOrder(true)

  //   try {
  //     // ── Tokenize (Square card details lo) ──────────────────────────────
  //     let token: any
  //     try {
  //       token = await paymentHandleRef.current.getPaymentToken()
  //     } catch (tokenErr: any) {
  //       // Square ne error diya — card fill nahi / galat details
  //       setOrderError(tokenErr?.message ?? 'Please fill in your card details correctly.')
  //       setIsPlacingOrder(false)
  //       return
  //     }

  //     if (!token) {
  //       setOrderError('Could not process card. Please try again.')
  //       setIsPlacingOrder(false)
  //       return
  //     }

  //     // ── Idempotency key generate karo (fresh, no localStorage) ─────────
  //     const idempotencyKey = crypto.randomUUID()

  //     // ── Payment API call ────────────────────────────────────────────────
  //     const localTotal = (() => {
  //       try { return JSON.parse(localStorage.getItem(CART_SUMMARY_KEY) ?? '{}') } catch { return {} }
  //     })()

  //     const amount = Number((localTotal?.total ?? grandTotal).toFixed(2))

  //     const authToken = getToken()
  //     const paymentRes = await makeApiRequest(apiUrls?.SQUARE_PAYMENT,{
  //       data:{
  //         source_id:       token,
  //         amount,
  //         idempotency_key: idempotencyKey,
  //       },
  //       method:"POST"
  //     }) as Response

  //     const paymentData = await paymentRes.json()

  //     if (!paymentRes.ok || !paymentData.success) {
  //       throw new Error(paymentData?.message ?? 'Payment failed. Please try again.')
  //     }

  //     // ── Payment success — aage ki 3 APIs baad mein add karenge ─────────
  //     console.log('✅ Payment successful:', paymentData)

  //     // TODO: placeOrder() → invoice() → paymentHistory() — agle step mein

  //   } catch (err: any) {
  //     console.error('❌ Place order error:', err)
  //     setOrderError(err?.message ?? 'Something went wrong. Please try again.')
  //   } finally {
  //     setIsPlacingOrder(false)
  //   }
  // }

  // ── handlePlaceOrder — complete flow ─────────────────────────────────────────
  // Sirf yeh function replace karo apne page.tsx mein
  // Baaki sab same rahega

  const handlePlaceOrder = async () => {
    setOrderError(null);

    // ── STEP 1: Address check ──────────────────────────────────────────────────
    if (!hasAddress) {
      setOrderError("Please add a delivery address before placing your order.");
      document
        .getElementById("shipping-address-section")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    // ── STEP 2: Payment handle ready check ────────────────────────────────────
    if (!paymentHandleRef.current) {
      setOrderError(
        "Payment form is not ready. Please wait a moment and try again.",
      );
      return;
    }

    setIsPlacingOrder(true);

    try {
      // ── STEP 3: Square tokenize ──────────────────────────────────────────────
      let token: any;
      try {
        token = await paymentHandleRef.current.getPaymentToken();
      } catch (tokenErr: any) {
        setOrderError(
          tokenErr?.message ?? "Please fill in your card details correctly.",
        );
        return;
      }

      if (!token) {
        setOrderError("Could not process card. Please try again.");
        return;
      }

      // ── STEP 4: Idempotency key (fresh, no localStorage) ────────────────────
      const idempotencyKey = crypto.randomUUID();

      // ── STEP 5: Cart summary se amount lo ───────────────────────────────────
      const localSummary = (() => {
        try {
          return JSON.parse(localStorage.getItem(CART_SUMMARY_KEY) ?? "{}");
        } catch {
          return {};
        }
      })();
      const amount = Number((localSummary?.total ?? grandTotal).toFixed(2));

      // ── STEP 6: Square payment API ───────────────────────────────────────────
      const paymentRes = (await makeApiRequest(apiUrls?.SQUARE_PAYMENT, {
        data: {
          source_id: token,
          amount,
          idempotency_key: idempotencyKey,
        },
        method: "POST",
      })) as any;

      if (!paymentRes?.success) {
        throw new Error(
          paymentRes?.message ?? "Payment failed. Please try again.",
        );
      }

      const squarePaymentId = paymentRes ?? null;
      console.log("✅ Square Payment done:", squarePaymentId);

      // ── STEP 7: defaultAddress localStorage se lo ────────────────────────────
      const defaultAddr = getDefaultAddressCache();
      const user = (() => {
        try {
          return JSON.parse(localStorage.getItem("user") ?? "{}");
        } catch {
          return {};
        }
      })();
      const couponId = localStorage.getItem("coupon_id") ?? "";
      const discountVal = localStorage.getItem("discount_value") ?? 0;
      const sessionId = localStorage.getItem("session_id") ?? "";
      const taxPercent = +(
        ((localSummary?.taxRatePercentage ?? 0) / 100) *
        100
      ).toFixed(2);

      // Products array — rawProducts se
      const location = getLocationData();
      const deliveryCharge = getShippingCharge(
        defaultAddr?.city ?? location?.city ?? "",
        defaultAddr?.state ?? location?.regionName ?? "",
        defaultAddr?.country ?? location?.countryCode ?? location?.country ?? "",
      );

      const products = rawProducts.map((cp: any) => {
        const quantity = Number(cp.quantity) || 1;
        const productShipping = Number(cp.product?.shippingCharge) || 0;
        const shippingCharge =
          productShipping > 0
            ? productShipping * quantity
            : (deliveryCharge ?? 0) * quantity;

        return {
          product_id: cp.product_id ?? cp.id,
          vendor_id: cp.vendor_product_supplier?.vendor_id,
          quantity,
          shipping_charge: shippingCharge,
          unit_price: parseFloat(cp.unit_price ?? cp.product?.price ?? 0),
          accessory_item_ids: (cp.accessories_options_details ?? []).map(
            (a: any) => a.item_id,
          ),
        };
      });

      // // ── STEP 8: Place Order API ──────────────────────────────────────────────
      // const orderRes = (await makeApiRequest(apiUrls?.PLACE_ORDER, {
      //   data: {
      //     customer_id: user?.id,
      //     customer_address_id: defaultAddr?.id,
      //     tax_percentage: taxPercent,
      //     ship_all_at_once: 1,
      //     is_lift_gate: liftGate ? 1 : 0,
      //     is_residential_address: residential ? 1 : 0,
      //     is_inside_delivery: insideDelivery ? 1 : 0,
      //     separate_deliveries: 0,
      //     products,
      //     utm_id: sessionId,
      //     coupon_id: couponId,
      //     discount: discountVal,
      //     is_reserved: 0,
      //     pay_with_cheque: 0,
      //     payment_mode: "Square",
      //     // square_payment_id:    squarePaymentId,
      //   },
      //   method: "POST",
      // })) as any;

      // if (!orderRes?.success) {
      //   throw new Error(
      //     orderRes?.message ??
      //       "Order could not be placed. Please contact support.",
      //   );
      // }

      // const orderData = orderRes?.data;
      // console.log("✅ Order placed:", orderData?.id, orderData?.order_number);
      // localStorage.removeItem(CART_SUMMARY_KEY);

      // ── STEP 8: Place Order API ──────────────────────────────────────────────
const orderRes = (await makeApiRequest(apiUrls?.PLACE_ORDER, {
  data: {
    customer_id: user?.id,
    customer_address_id: defaultAddr?.id,
    tax_percentage: taxPercent,
    ship_all_at_once: 1,
    is_lift_gate: liftGate ? 1 : 0,
    is_residential_address: residential ? 1 : 0,
    is_inside_delivery: insideDelivery ? 1 : 0,
    separate_deliveries: 0,
    products,
    utm_id: sessionId,
    coupon_id: couponId,
    discount: discountVal,
    is_reserved: 0,
    pay_with_cheque: 0,
    payment_mode: "Square",
  },
  method: "POST",
})) as any;

if (!orderRes?.success) {
  throw new Error(
    orderRes?.message ?? "Order could not be placed. Please contact support.",
  );
}

const orderId = orderRes?.data?.id;
console.log("✅ Order placed, ID:", orderId);
localStorage.removeItem(CART_SUMMARY_KEY);

// ── STEP 8.5: Full order details fetch (place order ke turant baad) ───────
let orderData: any = orderRes?.data; // fallback
try {
  const detailRes = (await makeApiRequest(
    apiUrls.ORDER_DETAIL(orderId),
    { method: "GET" },
  )) as any;
  if (detailRes?.success && detailRes?.data) {
    orderData = detailRes.data;
    console.log("✅ Order detail fetched:", orderData?.order_number);
  }
} catch (detailErr) {
  console.warn("⚠️ Order detail fetch failed (non-blocking):", detailErr);
}

      // ── STEP 9: Payment History API ─────────────────────────────────────────
      try {
        const paymentDate = orderData?.updated_at
          ? orderData.updated_at.split(/[T ]/)[0]
          : new Date().toISOString().split("T")[0];

        await makeApiRequest(apiUrls?.PAYMENT_HISTORY, {
          data: {
            order_id: orderData?.id,
            transaction_id: squarePaymentId?.payment?.id,
            payment_mode: "Credit Card",
            amount: orderData?.total_amount,
            status: "Completed",
            payment_date: paymentDate,
            notes: "",
            payment_details: JSON.stringify(paymentRes?.payment ?? {}),
            payment_method: "Square",
          },
          method: "POST",
        });
        console.log("✅ Payment history saved");
      } catch (historyErr) {
        // Payment history fail hone se order cancel nahi hoga
        console.warn("⚠️ Payment history failed (non-blocking):", historyErr);
      }

      // ── STEP 10: Screen Transaction API ─────────────────────────────────────
      try {
        const cardDetails = paymentHandleRef.current?.getCardDetails();
        const billingFirst = user?.name?.split(" ")?.[0] ?? firstName;
        const billingLast =
          user?.name?.split(" ")?.slice(1)?.join(" ") ?? lastName;
        const billingAddr = defaultAddr?.address ?? "";
        const billingCity =
          defaultAddr?.related_city?.name ?? defaultAddr?.city ?? "";
        const billingState =
          defaultAddr?.related_state?.name ?? defaultAddr?.state ?? "";
        const billingZip = defaultAddr?.zip_code ?? "";
        const countryNameToCode: Record<string, string> = {
          "united states": "US",
          canada: "CA",
          "united kingdom": "GB",
          australia: "AU",
          "united arab emirates": "AE",
          uae: "AE",
        };
        const rawCountry = (
          defaultAddr?.related_country?.name ??
          defaultAddr?.country ??
          ""
        )
          .toLowerCase()
          .trim();
        const billingCountry =
          countryNameToCode[rawCountry] ?? rawCountry.slice(0, 2).toUpperCase();
        const expMonth = String(cardDetails?.expMonth ?? "").padStart(2, "0");
        const expYear = String(cardDetails?.expYear ?? "").slice(-2);

        await makeApiRequest(apiUrls?.SCREEN_TRANSACTION, {
          data: {
            order_id: String(orderData?.id) ?? String(orderData?.id),
            amount,
            billing_first_name: billingFirst,
            billing_last_name: billingLast,
            billing_email: user?.email ?? email,
            billing_phone: user?.mobile_number ?? phone,
            billing_address: billingAddr,
            billing_city: billingCity,
            billing_state: billingState,
            billing_zip: billingZip,
            billing_country: billingCountry,
            shipping_first_name: billingFirst,
            shipping_last_name: billingLast,
            shipping_address: billingAddr,
            shipping_city: billingCity,
            shipping_state: billingState,
            shipping_zip: billingZip,
            shipping_country: billingCountry,
            card_bin: "",
            card_last4: cardDetails?.last4 ?? "",
            card_type: cardDetails?.brand ?? "",
            card_expiration: expMonth + expYear,
          },
          method: "POST",
        });
        console.log("✅ Screen transaction saved");
      } catch (screenErr) {
        console.warn("⚠️ Screen transaction failed (non-blocking):", screenErr);
      }

      // ── STEP 11: Full order details GET karo, save karo, redirect ──────────
      let fullOrder = orderData;
      try {
        const detailRes = (await makeApiRequest(
          apiUrls.ORDER_DETAIL(orderData?.id),
          { method: "GET" },
        )) as any;
        if (detailRes?.success && detailRes?.data) {
          fullOrder = detailRes.data;
        }
      } catch {
        // GET fail hone pe orderData hi use karo
      }
      localStorage.setItem("recentOrder", JSON.stringify(fullOrder));
      dispatch(fetchCounts() as any);
      router.push(`/payment-success?orderID=${orderData?.id}`);
    } catch (err: any) {
      console.error("❌ Place order error:", err);
      setOrderError(err?.message ?? "Something went wrong. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }

    
  };

  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Cart", href: "/cart" },
    { label: "Checkout", href: null },
  ];

  // ── Shared blocks (used in both mobile & desktop) ──────────────────────────
  const contactBlock = (
    <div className="mb-7">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-semibold text-gray-900">Contact information</h2>
        <Link
          href="/dashboard/my-profile"
          className="text-xs font-semibold text-green-700 flex gap-1.5 items-center"
        >
          Edit Info <Pencil className="w-3" />
        </Link>
      </div>
      <div className="space-y-3">
        <Field value={email} onChange={setEmail} type="email" placeholder="Email" disable />
        <div className="grid grid-cols-2 gap-3">
          <Field value={`${firstName} ${lastName}`} onChange={setFirstName} placeholder="Full name" disable />
          <Field value={phone} onChange={setPhone} type="tel" placeholder="Phone" disable />
        </div>
      </div>
    </div>
  );

  const addressBlock = (
    <div className="mb-8" id="shipping-address-section">
      <AddressesTab checkoutMode />
    </div>
  );
//     height: 364px;
//     overflow-x: auto;
//     padding: 12px;
// }
  const cartBlock = (
    <div className={`space-y-4 mb-6 p-3 ${cartItems.length > 4 ? "h-[350px] overflow-y-auto" : ""}`}>
      {isCartLoading ? (
        <div className="space-y-4 py-2">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-start gap-3 animate-pulse">
              <div className="w-16 h-16 rounded-md bg-gray-200 shrink-0" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-3 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
              <div className="h-4 bg-gray-200 rounded w-14 shrink-0 mt-1" />
            </div>
          ))}
        </div>
      ) : cartItems.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8">Your cart is empty.</p>
      ) : (
        cartItems.map((item) => (
          <div key={item.id} className="flex items-start gap-3">
            <div className="relative shrink-0">
              <div className="w-16 h-16 rounded-md border border-gray-200 bg-white overflow-hidden flex items-center justify-center">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                ) : (
                  <div className="w-full h-full bg-gray-100" />
                )}
              </div>
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-gray-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {item.qty}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-800 font-medium leading-snug line-clamp-2">{item.name}</p>
              {item.accessories > 0 && (
                <p className="text-[11px] text-gray-400 mt-0.5">+{currencySymbol}{usd(item.accessories)} accessories</p>
              )}
              {item.shipping > 0 && (
                <div className="flex items-center gap-1 mt-0.5 text-[11px] text-gray-400">
                  <Truck size={10} /> {currencySymbol}{usd(item.shipping)} shipping
                </div>
              )}
            </div>
            <span className="text-sm font-semibold text-gray-800 shrink-0">
              {currencySymbol}{usd((item.price + item.accessories) * item.qty)}
            </span>
          </div>
        ))
      )}
    </div>
  );

  const discountBlock = (
    <>
      <div className="flex gap-2 mb-2">
        <div className="relative flex-1">
          <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={code}
            onChange={(e) => { setCode(e.target.value.toUpperCase()); setCodeError(false); }}
            placeholder="Gift card or discount code"
            disabled={codeApplied}
            className="w-full h-10 pl-9 pr-3 border border-gray-300 rounded-md text-sm outline-none focus:border-[#186737] focus:ring-1 focus:ring-[#186737]/20 bg-white disabled:bg-gray-50 disabled:text-gray-400"
          />
        </div>
        <button
          onClick={handleApplyCode}
          disabled={codeApplied || !code}
          className="h-10 px-4 rounded-md bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-gray-700 text-sm font-medium transition-colors"
        >
          Apply
        </button>
      </div>
      {codeError && <p className="text-[11px] text-red-500 mb-4">Invalid code.</p>}
      {codeApplied && <p className="text-[11px] text-[#186737] mb-4">HORECA10 — 10% off applied</p>}
    </>
  );

  const activeFees = [
    { label: "Lift Gate Service",       desc: "Required for deliveries without loading dock", fee: 75,  active: liftGate },
    { label: "Residential Address",     desc: "Delivery to home or residential location",    fee: 199, active: residential },
    { label: "Inside Delivery Address", desc: "Delivery inside the building",                fee: 249, active: insideDelivery },
  ].filter((f) => f.active);

  const deliveryBlock = activeFees.length > 0 ? (
    <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-900">Additional Delivery Fees</h2>
      </div>
      <div className="divide-y divide-gray-100">
        {activeFees.map(({ label, desc, fee }) => (
          <div key={label} className="flex items-center justify-between px-4 py-3.5">
            <div>
              <p className="text-sm font-medium text-gray-800">{label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
            </div>
            <span className="text-sm font-semibold text-[#186737] shrink-0">+${fee}.00</span>
          </div>
        ))}
      </div>
    </div>
  ) : null;

  const pricingBlock = isCartLoading ? (
    <div className="space-y-3 animate-pulse mb-4">
      {[80, 64, 56, 48].map((w) => (
        <div key={w} className="flex justify-between items-center">
          <div className="h-3 bg-gray-200 rounded" style={{ width: `${w}%` }} />
          <div className="h-3 bg-gray-200 rounded w-16" />
        </div>
      ))}
      <div className="h-px bg-gray-200 my-3" />
      <div className="flex justify-between items-center pt-1">
        <div className="h-4 bg-gray-200 rounded w-28" />
        <div className="h-5 bg-gray-200 rounded w-24" />
      </div>
    </div>
  ) : (
    <>
      <div className="space-y-2 text-sm mb-4">
        <PriceRow label={`Subtotal (${totalItems} item${totalItems !== 1 ? "s" : ""})`} value={`${currencySymbol}${usd(baseSubtotal)}`} />
        {codeApplied && <PriceRow label="Discount (HORECA10)" value={`-${currencySymbol}${usd(discount)}`} green />}
        <PriceRow label={`Shipping & Handling${ratePercent > 0 ? ` ` : ""}`} value={`${currencySymbol}${usd(baseShipping)}`} />
        {liftGate    && <PriceRow label={`Lift Gate Service${ratePercent > 0 ? ` ` : ""}`}      value={`${currencySymbol}${usd(liftFee)}`} />}
        {residential && <PriceRow label={`Residential Address${ratePercent > 0 ? `` : ""}`}   value={`${currencySymbol}${usd(resFee)}`} />}
        {insideDelivery && <PriceRow label={`Inside Delivery${ratePercent > 0 ? ` ` : ""}`}    value={`${currencySymbol}${usd(insideFee)}`} />}
        {ratePercent > 0 && <PriceRow label={`Tax (${ratePercent}%)`} value={`${currencySymbol}${usd(totalTax)}`} />}
      </div>
      <div className="h-px bg-gray-200 mb-4" />
      <div className="flex items-center justify-between mb-4">
        <span className="font-bold text-gray-900 text-base">Total Amount</span>
        <span className="font-bold text-gray-900 text-xl">{currencySymbol}{usd(grandTotal)}</span>
      </div>
    </>
  );

  const placeOrderBtn = (
    <>
      {orderError && (
        <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3">
          <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-red-700">{orderError}</p>
        </div>
      )}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 flex-wrap gap-4">
        <Link href="/cart" className="flex items-center gap-1 text-[#186737] text-sm hover:underline font-medium">
          <ChevronRight size={14} className="rotate-180" /> Return to cart
        </Link>
        <button
          type="button"
          disabled={isPlacingOrder}
          className="flex items-center gap-2 bg-[#186737] hover:bg-[#145c30] disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold px-8 py-3 rounded-md text-sm transition-colors"
          onClick={handlePlaceOrder}
        >
          {isPlacingOrder ? (
            <>
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Processing...
            </>
          ) : (
            "Place Order"
          )}
        </button>
      </div>
    </>
  );

  return (
    <>
      <Breadcrumb crumbs={crumbs} />

      {/* ══════════════ MOBILE LAYOUT — step-based (hidden on lg+) ══════════════ */}
      <div className="lg:hidden min-h-screen bg-gray-50">

        {/* ── Step indicator bar ─────────────────────────────────────────────── */}
        <div className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-0 max-w-sm mx-auto">
            {/* Step 1 */}
            <button
              onClick={() => setMobileStep(1)}
              className="flex items-center gap-2 flex-1"
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${mobileStep >= 1 ? "bg-[#186737] text-white" : "bg-gray-200 text-gray-500"}`}>
                {mobileStep > 1 ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : "1"}
              </div>
              <span className={`text-xs font-semibold ${mobileStep === 1 ? "text-[#186737]" : "text-gray-400"}`}>
                Info &amp; Address
              </span>
            </button>

            {/* Connector */}
            <div className="flex-1 flex items-center px-1">
              <div className={`h-0.5 w-full transition-colors ${mobileStep > 1 ? "bg-[#186737]" : "bg-gray-200"}`} />
              <ChevronRight size={14} className={`shrink-0 -ml-1 ${mobileStep > 1 ? "text-[#186737]" : "text-gray-300"}`} />
            </div>

            {/* Step 2 */}
            <div className="flex items-center gap-2 flex-1 justify-end">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${mobileStep === 2 ? "bg-[#186737] text-white" : "bg-gray-200 text-gray-500"}`}>
                2
              </div>
              <span className={`text-xs font-semibold ${mobileStep === 2 ? "text-[#186737]" : "text-gray-400"}`}>
                Cart &amp; Payment
              </span>
            </div>
          </div>
        </div>

        {/* ── STEP 1: Contact + Address ─────────────────────────────────────── */}
        {mobileStep === 1 && (
          <div className="px-4 py-5 space-y-1 pb-28">
            {/* Contact card */}
            <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-4">
              {contactBlock}
            </div>

            {/* Address card */}
            <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-4">
              {addressBlock}
            </div>

            {/* Fixed bottom CTA */}
            <div className=" bg-white border-t border-gray-100 px-4 py-3 z-30 shadow-[0_-4px_12px_rgba(0,0,0,0.07)]">
              <button
                type="button"
                onClick={() => setMobileStep(2)}
                className="w-full flex items-center justify-center gap-2 bg-[#186737] hover:bg-[#145c30] active:scale-[0.98] text-white font-semibold py-3.5 rounded-[7px] text-sm transition-all"
              >
                Continue to Cart &amp; Payment
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Cart + Payment ────────────────────────────────────────── */}
        {mobileStep === 2 && (
          <div className="px-4 py-5 pb-36 space-y-4">

            {/* Cart items card */}
            <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-4">
              <h2 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#186737] text-white text-[10px] font-bold flex items-center justify-center">{totalItems}</span>
                Order Items
              </h2>
              {cartBlock}
              <div className="h-px bg-gray-100 my-4" />
              {discountBlock}
            </div>

            {/* Delivery options card */}
            <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
              {deliveryBlock}
            </div>

            {/* Payment form card */}
            <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-4">
              <h2 className="text-sm font-bold text-gray-800 mb-4">Payment Details</h2>
              <CheckoutPayment
                squareAppId={process.env.NEXT_PUBLIC_SQUARE_APP_ID!}
                squareLocationId={process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID!}
                onHandleReady={(h) => { paymentHandleRef.current = h; }}
              />
            </div>

            {/* Price summary card */}
            <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-4">
              {pricingBlock}
            </div>

            {/* Fixed bottom Place Order CTA */}
            <div className=" bg-white border-t border-gray-100 px-4 py-3 z-30 shadow-[0_-4px_12px_rgba(0,0,0,0.07)]">
              {orderError && (
                <div className="mb-2 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs text-red-700">{orderError}</p>
                </div>
              )}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileStep(1)}
                  className="flex items-center gap-1.5 px-4 py-3.5 rounded-[7px] border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors shrink-0"
                >
                  <ChevronRight size={15} className="rotate-180" />
                  Back
                </button>
                <button
                  type="button"
                  disabled={isPlacingOrder}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#186737] hover:bg-[#145c30] disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98] text-white font-semibold py-3.5 rounded-[7px] text-sm transition-all"
                >
                  {isPlacingOrder ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>Place Order · {currencySymbol}{usd(grandTotal)}</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ══════════════ DESKTOP LAYOUT — 2-column (hidden on mobile) ══════════════ */}
      <div className="hidden lg:block global-container bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] max-w-7xl mx-auto">
          {/* ── LEFT ──────────────────────────────────────────────────────── */}
          <div className="px-6 md:px-12 xl:px-20 py-10 pt-0 border-r border-gray-100">
            <CheckoutPayment
              squareAppId={process.env.NEXT_PUBLIC_SQUARE_APP_ID!}
              squareLocationId={process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID!}
              onHandleReady={(h) => { paymentHandleRef.current = h; }}
            />
            <div className="flex items-center gap-3 mb-6" />
            {contactBlock}
            {addressBlock}
          </div>

          {/* ── RIGHT — Order Summary ──────────────────────────────────────── */}
          <div className="bg-[#fafafa] border-l border-gray-100 px-6 md:px-10 py-10">
            {cartBlock}
            {discountBlock}
            <div className="h-px bg-gray-200 my-4" />
            {deliveryBlock}
            <div className="h-px bg-gray-200 my-4" />
            {pricingBlock}
            {placeOrderBtn}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Field({
  value,
  onChange,
  type = "text",
  placeholder,
  disable,
}: {
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  disable?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disable}
      className={`w-full h-12 px-3 border border-gray-300 rounded-md text-sm outline-none focus:border-[#186737] focus:ring-1 focus:ring-[#186737]/20 bg-white placeholder:text-gray-400 transition-all ${disable ? "cursor-not-allowed" : ""}`}
    />
  );
}


function PriceRow({
  label,
  value,
  green = false,
  muted = false,
}: {
  label: string;
  value: string;
  green?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-600">{label}</span>
      <span
        className={`font-medium ${green ? "text-[#186737]" : muted ? "text-gray-400 italic text-xs" : "text-gray-800"}`}
      >
        {value}
      </span>
    </div>
  );
}
