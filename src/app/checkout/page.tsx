// 'use client'

// import {
//   Check,
//   CheckCircle2,
//   ChevronLeft,
//   ChevronRight,
//   CreditCard,
//   Home,
//   Lock,
//   MessageCircle,
//   Package,
//   Phone,
//   Plus,
//   RotateCcw,
//   Shield,
//   ShoppingBag,
//   Tag,
//   Truck,
// } from 'lucide-react'
// import Link from 'next/link'
// import { useEffect, useState } from 'react'
// import { Switch } from '@/components/ui/switch'
// import { MobileCheckout } from './_components/mobile-checkout'
// import type { Address, CartItem } from './_components/types'

// // ─── Mock Data ────────────────────────────────────────────────────────────────

// const CART_ITEMS: CartItem[] = [
//   { id: 1, name: 'Turbo Air TAO-2510N-N6 23" Super Undercounter Bottle Cooler, 3.0 cu. ft.', qty: 1, price: 2436.63, shipping: 195.0, deliveryDate: 'May 16, 2026' },
//   { id: 2, name: 'Turbo Air TAO-3000N-N6 30" Super Undercounter Bottle Cooler, 5.1 cu. ft.', qty: 1, price: 2986.26, shipping: 0, deliveryDate: 'May 16, 2026' },
//   { id: 3, name: 'Turbo Air TAO-3000N-N6 30" Super Undercounter Bottle Cooler, 5.1 cu. ft.', qty: 1, price: 2986.26, shipping: 0, deliveryDate: 'May 16, 2026' },
//   { id: 4, name: 'Turbo Air TAO-3000N-N6 30" Super Undercounter Bottle Cooler, 5.1 cu. ft.', qty: 1, price: 2986.26, shipping: 0, deliveryDate: 'May 16, 2026' },
//   { id: 5, name: 'Turbo Air TAO-3000N-N6 30" Super Undercounter Bottle Cooler, 5.1 cu. ft.', qty: 1, price: 2986.26, shipping: 0, deliveryDate: 'May 16, 2026' },
// ]

// const ADDRESSES: Address[] = [
//   { id: 1, label: 'Home', line1: '0000 Los Angeles Memorial Lewis & Blvd', line2: 'California, United States' },
//   { id: 2, label: 'Office', line1: 'Monterrey, Co, USA 9810, Billings', line2: 'Montana, United States' },
//   { id: 3, label: 'Branch', line1: 'Apple Valley, Roanoke Creek Basement', line2: 'Santa Clara, CA 0001, United States' },
//   { id: 4, label: 'Branch', line1: 'Apple Valley, Roanoke Creek Basement', line2: 'Santa Clara, CA 0001, United States' },
//   { id: 5, label: 'Branch', line1: 'Apple Valley, Roanoke Creek Basement', line2: 'Santa Clara, CA 0001, United States' },
//   { id: 6, label: 'Branch', line1: 'Apple Valley, Roanoke Creek Basement', line2: 'Santa Clara, CA 0001, United States' },
//   { id: 7, label: 'Branch', line1: 'Apple Valley, Roanoke Creek Basement', line2: 'Santa Clara, CA 0001, United States' },
//   { id: 8, label: 'Branch', line1: 'Apple Valley, Roanoke Creek Basement', line2: 'Santa Clara, CA 0001, United States' },
// ]

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// const formatCardNumber = (v: string) =>
//   v.replace(/\D/g, '').slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ')

// const formatExpiry = (v: string) => {
//   const d = v.replace(/\D/g, '').slice(0, 4)
//   return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d
// }

// const usd = (n: number) =>
//   n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

// // ─── Page ─────────────────────────────────────────────────────────────────────

// export default function CheckoutPage() {
//   const [mobileStep, setMobileStep] = useState(1)

//   // Address slider (desktop)
//   const [aPage, setAPage] = useState(0)
//   const [aPerView, setAPerView] = useState(3)
//   const aTotal = Math.ceil(ADDRESSES.length / aPerView)

//   useEffect(() => {
//     const calc = () =>
//       setAPerView(window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1)
//     calc()
//     window.addEventListener('resize', calc)
//     return () => window.removeEventListener('resize', calc)
//   }, [])

//   const [selectedAddress, setSelectedAddress] = useState(1)
//   const [payment, setPayment] = useState('card')
//   const [coupon, setCoupon] = useState('')
//   const [couponApplied, setCouponApplied] = useState(false)
//   const [liftGate, setLiftGate] = useState(false)
//   const [residential, setResidential] = useState(false)
//   const [insideDelivery, setInsideDelivery] = useState(false)
//   const [note, setNote] = useState('')

//   const [cardNum, setCardNum] = useState('')
//   const [cardName, setCardName] = useState('')
//   const [cardExpiry, setCardExpiry] = useState('')
//   const [cardCvv, setCardCvv] = useState('')
//   const [cardFlipped, setCardFlipped] = useState(false)

//   // Pricing
//   const subtotal = CART_ITEMS.reduce((s, i) => s + i.price * i.qty, 0)
//   const shippingTotal = CART_ITEMS.reduce((s, i) => s + i.shipping, 0)
//   const liftFee = liftGate ? 150 : 0
//   const resFee = residential ? 109 : 0
//   const insideFee = insideDelivery ? 75 : 0
//   const tax = (subtotal + shippingTotal + resFee) * 0.0825
//   const couponDiscount = couponApplied ? subtotal * 0.1 : 0
//   const checkDiscount = payment === 'check' ? (subtotal + shippingTotal) * 0.05 : 0
//   const total = subtotal + shippingTotal + liftFee + resFee + insideFee + tax - couponDiscount - checkDiscount
//   const totalSavings = couponDiscount + checkDiscount

//   const deliveryOpts = [
//     { label: 'Lift Gate Service', desc: 'Required if no loading dock at location', fee: 150, state: liftGate, toggle: () => setLiftGate(!liftGate) },
//     { label: 'Residential Address', desc: 'Delivery to non-commercial site', fee: 109, state: residential, toggle: () => setResidential(!residential) },
//     { label: 'Inside Delivery', desc: 'Carried inside the building', fee: 75, state: insideDelivery, toggle: () => setInsideDelivery(!insideDelivery) },
//   ]

//   return (
//     <div className="min-h-screen">

//       {/* Mobile — separate component file */}
//       <MobileCheckout
//         mobileStep={mobileStep}
//         setMobileStep={setMobileStep}
//         addresses={ADDRESSES}
//         selectedAddress={selectedAddress}
//         setSelectedAddress={setSelectedAddress}
//         cartItems={CART_ITEMS}
//         coupon={coupon}
//         setCoupon={setCoupon}
//         couponApplied={couponApplied}
//         setCouponApplied={setCouponApplied}
//         liftGate={liftGate}
//         setLiftGate={setLiftGate}
//         residential={residential}
//         setResidential={setResidential}
//         insideDelivery={insideDelivery}
//         setInsideDelivery={setInsideDelivery}
//         note={note}
//         setNote={setNote}
//         payment={payment}
//         setPayment={setPayment}
//         cardNum={cardNum}
//         setCardNum={setCardNum}
//         cardName={cardName}
//         setCardName={setCardName}
//         cardExpiry={cardExpiry}
//         setCardExpiry={setCardExpiry}
//         cardCvv={cardCvv}
//         setCardCvv={setCardCvv}
//         cardFlipped={cardFlipped}
//         setCardFlipped={setCardFlipped}
//         subtotal={subtotal}
//         shippingTotal={shippingTotal}
//         tax={tax}
//         couponDiscount={couponDiscount}
//         checkDiscount={checkDiscount}
//         total={total}
//         totalSavings={totalSavings}
//       />

//       {/* Desktop — 2-column layout */}
//       <div className="hidden lg:block bg-[#f5f7f5]">
//         <div className="bg-white border-b border-gray-100">
//           <div className="global-container py-3 flex items-center gap-2 text-sm">
//             <Link href="/cart" className="text-[#186737] hover:underline flex items-center gap-1">
//               <ShoppingBag size={13} /> Cart
//             </Link>
//             <ChevronRight size={13} className="text-gray-300" />
//             <span className="font-semibold text-gray-700">Checkout</span>
//             <ChevronRight size={13} className="text-gray-300" />
//             <span className="text-gray-400">Confirmation</span>
//           </div>
//         </div>

//         <main className="global-container py-8 px-0">
//           <div className="grid grid-cols-1 2xl:grid-cols-[75%_25%] xl:grid-cols-[75%_25%] lg:grid-cols-1 gap-6 items-start">

//             {/* LEFT */}
//             <div className="space-y-5">

//               {/* Shipping Address */}
//               <section className="bg-white rounded-[7px] p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100">
//                 <div className="flex items-center justify-between mb-5">
//                   <SectionTitle icon={<Home size={14} />} title="Shipping Address" />
//                   <button type="button" className="text-[#186737] text-xs font-semibold flex items-center gap-1 hover:underline">
//                     <Plus size={13} /> Add New
//                   </button>
//                 </div>
//                 <div className="relative">
//                   <div className="overflow-hidden">
//                     <div
//                       className="flex transition-transform duration-500 ease-in-out"
//                       style={{
//                         width: `${(ADDRESSES.length / aPerView) * 100}%`,
//                         transform: `translateX(-${(aPage * aPerView * 100) / ADDRESSES.length}%)`,
//                       }}
//                     >
//                       {ADDRESSES.map((addr) => {
//                         const active = selectedAddress === addr.id
//                         return (
//                           <div key={addr.id} style={{ width: `${100 / ADDRESSES.length}%` }} className="px-1.5">
//                             <button type="button" onClick={() => setSelectedAddress(addr.id)}
//                               className={`w-full text-left p-4 rounded-[7px] border-2 transition-all duration-150 ${
//                                 active ? 'border-[#186737] bg-green-50/60' : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
//                               }`}
//                             >
//                               <div className="flex items-center justify-between mb-2">
//                                 <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
//                                   active ? 'bg-[#186737] text-white' : 'bg-gray-200 text-gray-500'
//                                 }`}>{addr.label}</span>
//                                 {active && (
//                                   <span className="w-5 h-5 rounded-full bg-[#186737] flex items-center justify-center">
//                                     <Check size={11} className="text-white" />
//                                   </span>
//                                 )}
//                               </div>
//                               <p className="text-sm font-medium text-gray-700 leading-snug">{addr.line1}</p>
//                               <p className="text-xs text-gray-400 mt-0.5">{addr.line2}</p>
//                             </button>
//                           </div>
//                         )
//                       })}
//                     </div>
//                   </div>
//                   {aTotal > 1 && (
//                     <>
//                       <button type="button" onClick={() => setAPage((p) => Math.max(0, p - 1))} disabled={aPage === 0}
//                         className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:border-[#186737] disabled:opacity-30 transition-all"
//                       >
//                         <ChevronLeft size={16} className="text-gray-600" />
//                       </button>
//                       <button type="button" onClick={() => setAPage((p) => Math.min(aTotal - 1, p + 1))} disabled={aPage === aTotal - 1}
//                         className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:border-[#186737] disabled:opacity-30 transition-all"
//                       >
//                         <ChevronRight size={16} className="text-gray-600" />
//                       </button>
//                     </>
//                   )}
//                 </div>
//                 {aTotal > 1 && (
//                   <div className="flex justify-center gap-1.5 mt-4">
//                     {Array.from({ length: aTotal }).map((_, i) => (
//                       <button key={i} type="button" onClick={() => setAPage(i)}
//                         className={`rounded-full h-2 transition-all duration-300 ${
//                           i === aPage ? 'w-6 bg-[#186737]' : 'w-2 bg-gray-300 hover:bg-gray-400'
//                         }`}
//                       />
//                     ))}
//                   </div>
//                 )}
//               </section>

//               {/* Payment Method */}
//               <section className="bg-white rounded-[7px] p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100">
//                 <div className="mb-5">
//                   <SectionTitle icon={<CreditCard size={14} />} title="Payment Method" />
//                 </div>
//                 <div className="flex flex-wrap gap-2 mb-6">
//                   {[
//                     { id: 'card', label: 'Card', sublabel: 'Visa / MC / Amex', emoji: '💳' },
//                     { id: 'check', label: 'Check', sublabel: '5% discount', emoji: '📋' },
//                   ].map((pm) => {
//                     const active = payment === pm.id
//                     return (
//                       <button key={pm.id} type="button" onClick={() => setPayment(pm.id)}
//                         className={`flex flex-col items-center justify-center gap-1 py-3 px-4 rounded-[7px] border-2 transition-all duration-150 min-w-22.5 ${
//                           active ? 'border-[#186737] bg-green-50' : 'border-gray-200 bg-gray-50 hover:border-gray-300'
//                         }`}
//                       >
//                         <span className="text-2xl leading-none">{pm.emoji}</span>
//                         <span className={`text-[11px] font-bold ${active ? 'text-[#186737]' : 'text-gray-600'}`}>{pm.label}</span>
//                         <span className="text-[9px] text-gray-400 leading-tight text-center">{pm.sublabel}</span>
//                       </button>
//                     )
//                   })}
//                 </div>
//                 {payment === 'card' && (
//                   <div className="grid grid-cols-1 md:grid-cols-[30%_30%] gap-6">
                  
//                     <div>
//                       <CardInput label="Card Number" value={cardNum} onChange={(v) => setCardNum(formatCardNumber(v))} placeholder="0000 0000 0000 0000" mono />
//                       <CardInput label="Name on Card" value={cardName} onChange={(v) => setCardName(v.toUpperCase())} placeholder="JOHN DOE" />
//                       <div className="grid grid-cols-2 gap-3">
//                         <CardInput label="Expiry" value={cardExpiry} onChange={(v) => setCardExpiry(formatExpiry(v))} placeholder="MM/YY" maxLength={5} mono />
//                         <CardInput label="CVV" value={cardCvv} onChange={(v) => setCardCvv(v.replace(/\D/g, '').slice(0, 4))} placeholder="•••" maxLength={4} mono onFocus={() => setCardFlipped(true)} onBlur={() => setCardFlipped(false)} />
//                       </div>
//                     </div>
//                       <div style={{ perspective: '200px' }} >
//                       <div className="relative h-56 mt-2.5 w-full transition-transform duration-700"
//                         style={{ transformStyle: 'preserve-3d', transform: cardFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
//                       >
//                         <div className="absolute inset-0 rounded-[7px] p-5 flex flex-col justify-between overflow-hidden select-none"
//                           style={{ backfaceVisibility: 'hidden', background: 'linear-gradient(135deg,#186737 0%,#0f4d29 55%,#0a3a1e 100%)' }}
//                         >
//                           <div className="flex justify-between items-start">
//                             <div className="w-10 h-7 rounded-md bg-yellow-300/80" />
//                             <span className="text-white/50 text-xs font-semibold tracking-widest uppercase">Credit</span>
//                           </div>
//                           <div>
//                             <p className="text-white font-mono text-lg tracking-[0.25em] mb-3 drop-shadow">{cardNum || '•••• •••• •••• ••••'}</p>
//                             <div className="flex justify-between items-end">
//                               <div>
//                                 <p className="text-white/40 text-[9px] uppercase tracking-widest mb-0.5">Card Holder</p>
//                                 <p className="text-white text-sm font-semibold truncate max-w-40 tracking-wide">{cardName || 'YOUR NAME'}</p>
//                               </div>
//                               <div className="text-right">
//                                 <p className="text-white/40 text-[9px] uppercase tracking-widest mb-0.5">Expires</p>
//                                 <p className="text-white text-sm font-semibold">{cardExpiry || 'MM/YY'}</p>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="absolute inset-0 rounded-[7px] overflow-hidden select-none"
//                           style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', background: 'linear-gradient(135deg,#0d4a26 0%,#186737 100%)' }}
//                         >
//                           <div className="w-full h-10 bg-black/40 mt-7" />
//                           <div className="px-5 mt-4">
//                             <div className="bg-white/10 rounded-lg h-9 flex items-center justify-end pr-4">
//                               <p className="text-white font-mono text-sm tracking-[0.3em]">{cardCvv || '•••'}</p>
//                             </div>
//                             <p className="text-white/40 text-[10px] text-right mt-1 tracking-widest uppercase">CVV</p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//                 {payment === 'check' && (
//                   <div className="bg-amber-50 border border-amber-200 rounded-[7px] p-4 text-sm">
//                     <p className="font-semibold text-amber-800 mb-1">3% Discount Applied 🎉</p>
//                     <p className="text-amber-700 text-xs leading-relaxed">
//                       Upload a photo of your check after placing the order. No physical mailing required.
//                     </p>
//                   </div>
//                 )}
//               </section>

//               {/* Order Note */}
//               <section className="bg-white rounded-[7px] p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100">
//                 <div className="mb-4 flex items-center gap-2">
//                   <SectionTitle icon={<Package size={14} />} title="Order Note" />
//                   <span className="text-gray-400 text-xs font-normal">(optional)</span>
//                 </div>
//                 <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3}
//                   placeholder="Special instructions, delivery notes, or product requirements..."
//                   className="w-full border border-gray-200 rounded-[7px] px-4 py-3 text-sm resize-none focus:outline-none focus:border-[#186737] focus:ring-2 focus:ring-green-100 transition-shadow"
//                 />
//               </section>
//             </div>

//             {/* RIGHT */}
//             <div className="space-y-5 lg:sticky lg:top-6">

//               {/* Order Summary */}
//               <section className="bg-white rounded-[7px] h-80 overflow-y-auto shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100">
//                 <div className="p-5 border-b border-gray-100 flex items-center justify-between">
//                   <div className="flex items-center gap-2">
//                     <ShoppingBag size={15} className="text-[#186737]" />
//                     <h2 className="font-semibold text-gray-800 sub-heading-font-size">Order Summary</h2>
//                   </div>
//                   <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full font-medium">{CART_ITEMS.length} items</span>
//                 </div>
//                 <div className="divide-y divide-gray-50">
//                   {CART_ITEMS.map((item) => (
//                     <div key={item.id} className="flex gap-3 p-4">
//                       <div className="w-14 h-14 rounded-[7px] bg-gray-100 flex items-center justify-center shrink-0">
//                         <Package size={18} className="text-gray-300" />
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <p className="text-xs font-medium text-gray-700 line-clamp-2 leading-snug">{item.name}</p>
//                         <p className="text-[11px] text-gray-400 mt-0.5">Qty: {item.qty}</p>
//                         <div className="flex items-baseline gap-1.5 mt-1">
//                           <span className="text-sm font-bold text-gray-800">${usd(item.price)}</span>
//                           {item.shipping > 0 && <span className="text-[11px] text-gray-400">+ ${usd(item.shipping)} ship</span>}
//                         </div>
//                         <div className="flex items-center gap-1 mt-1 text-[#186737]">
//                           <Truck size={11} />
//                           <span className="text-[11px]">Est. {item.deliveryDate}</span>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </section>

//               {/* Coupon */}
//               <section className="bg-white rounded-[7px] p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100">
//                 <div className="mb-4">
//                   <SectionTitle icon={<Tag size={14} />} title="Coupon Code" />
//                 </div>
//                 <div className="flex flex-wrap gap-2">
//                   <input value={coupon} onChange={(e) => setCoupon(e.target.value.toUpperCase())} placeholder="e.g. HORECA10" disabled={couponApplied}
//                     className="flex-1 border border-gray-200 rounded-[7px] px-4 py-3 text-sm focus:outline-none focus:border-[#186737] focus:ring-2 focus:ring-green-100 disabled:bg-gray-50 disabled:text-gray-400 transition-shadow"
//                   />
//                   {couponApplied ? (
//                     <button type="button" onClick={() => { setCouponApplied(false); setCoupon('') }}
//                       className="px-5 w-full py-3 rounded-[7px] border-2 border-red-200 text-red-500 text-sm font-semibold hover:bg-red-50 transition-colors">Remove</button>
//                   ) : (
//                     <button type="button" onClick={() => { if (coupon === 'HORECA10') setCouponApplied(true) }}
//                       className="px-5 py-3 w-full rounded-[7px] bg-[#186737] text-white text-sm font-semibold transition-colors">Apply</button>
//                   )}
//                 </div>
//                 {couponApplied && (
//                   <p className="text-green-600 text-xs mt-2 flex items-center gap-1">
//                     <Check size={12} /> HORECA10 applied — 10% off subtotal
//                   </p>
//                 )}
//               </section>

//               {/* Delivery Options */}
//               <section className="bg-white rounded-[7px] p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100">
//                 <div className="flex items-center gap-2 mb-4">
//                   <Truck size={15} className="text-[#186737]" />
//                   <h2 className="font-semibold text-gray-800 sub-heading-font-size">Delivery Options</h2>
//                 </div>
//                 <div className="space-y-2.5">
//                   {deliveryOpts.map((opt) => (
//                     <div key={opt.label} className="flex items-center justify-between p-3 rounded-[7px] border border-gray-100 hover:bg-gray-50 transition-colors">
//                       <div className="flex-1 min-w-0 mr-3">
//                         <p className="text-sm font-medium text-gray-700">{opt.label}</p>
//                         <p className="text-[11px] text-gray-400 leading-snug">{opt.desc}</p>
//                       </div>
//                       <div className="flex items-center gap-3 shrink-0">
//                         <span className="text-xs text-gray-500 font-semibold">+${opt.fee}</span>
//                         <Switch checked={opt.state} onCheckedChange={opt.toggle}
//                           className="data-[state=checked]:bg-[#186737] data-[state=unchecked]:bg-gray-200" />
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </section>

//               {/* Price Breakdown */}
//               <section className="bg-white rounded-[7px] p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100">
//                 <div className="space-y-2.5 text-sm">
//                   <PriceLine label={`Subtotal (${CART_ITEMS.length} items)`} value={`$${usd(subtotal)}`} />
//                   <PriceLine label="Shipping & Handling" value={`$${usd(shippingTotal)}`} />
//                   {liftGate && <PriceLine label="Lift Gate Service" value={`$${usd(150)}`} />}
//                   {residential && <PriceLine label="Residential Address" value={`$${usd(109)}`} />}
//                   {insideDelivery && <PriceLine label="Inside Delivery" value={`$${usd(75)}`} />}
//                   <PriceLine label="Tax (8.25%)" value={`$${usd(tax)}`} />
//                   {couponApplied && <PriceLine label="Coupon (HORECA10)" value={`-$${usd(couponDiscount)}`} green />}
//                   {payment === 'check' && <PriceLine label="Check Discount (5%)" value={`-$${usd(checkDiscount)}`} green />}
//                   <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline">
//                     <span className="font-bold text-gray-800">Total Amount</span>
//                     <span className="text-xl font-bold text-[#186737]">${usd(total)}</span>
//                   </div>
//                 </div>
//                 <button type="button"
//                   className="mt-5 w-full bg-[#186737] active:scale-[0.98] text-white font-semibold py-4 rounded-[7px] transition-all duration-150 flex items-center justify-center gap-2 text-sm shadow-md shadow-green-900/20"
//                 >
//                   <Lock size={14} /> Confirm & Pay — ${usd(total)} <ChevronRight size={15} />
//                 </button>
//                 <p className="text-center text-[11px] text-gray-400 mt-3">
//                   By placing your order, you agree to our{' '}
//                   <Link href="/pages/return-policy" className="text-[#186737] hover:underline">Terms & Return Policy</Link>
//                 </p>
//               </section>

//               {/* Trust Badges */}
//               <section className="bg-white rounded-[7px] p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100">
//                 <div className="grid grid-cols-3 gap-3 text-center">
//                   {[
//                     { Icon: Shield, label: 'Secure Payment', desc: 'SSL encrypted' },
//                     { Icon: RotateCcw, label: 'Easy Returns', desc: '30-day policy' },
//                     { Icon: CheckCircle2, label: 'Data Safe', desc: 'Never shared' },
//                   ].map(({ Icon, label, desc }) => (
//                     <div key={label} className="flex flex-col items-center gap-1.5">
//                       <div className="w-9 h-9 rounded-[7px] bg-green-50 flex items-center justify-center">
//                         <Icon size={16} className="text-[#186737]" />
//                       </div>
//                       <p className="text-[11px] font-semibold text-gray-700 leading-tight">{label}</p>
//                       <p className="text-[10px] text-gray-400">{desc}</p>
//                     </div>
//                   ))}
//                 </div>
//               </section>

//               {/* Support */}
//               <section className="bg-white rounded-[7px] p-4 shadow-[0_1px_4px_rgba(0,0,0,0.06)] border border-gray-100">
//                 <p className="text-[11px] font-semibold text-gray-500 text-center mb-3 uppercase tracking-wide">Need Help?</p>
//                 <div className="grid grid-cols-2 gap-2">
//                   {[{ Icon: MessageCircle, label: 'Live Chat' }, { Icon: Phone, label: 'Call Us' }].map(({ Icon, label }) => (
//                     <button key={label} type="button"
//                       className="flex items-center justify-center gap-2 py-2.5 rounded-[7px] border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 hover:border-[#186737] transition-all"
//                     >
//                       <Icon size={14} className="text-[#186737]" /> {label}
//                     </button>
//                   ))}
//                 </div>
//               </section>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   )
// }

// // ─── Desktop sub-components ───────────────────────────────────────────────────

// function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
//   return (
//     <div className="flex items-center gap-2">
//       <div className="w-7 h-7 rounded-full bg-[#186737] flex items-center justify-center text-white shrink-0">{icon}</div>
//       <h2 className="font-semibold text-gray-800 sub-heading-font-size">{title}</h2>
//     </div>
//   )
// }

// function PriceLine({ label, value, green = false }: { label: string; value: string; green?: boolean }) {
//   return (
//     <div className={`flex justify-between ${green ? 'text-[#186737]' : 'text-gray-600'}`}>
//       <span>{label}</span>
//       <span className="font-medium">{value}</span>
//     </div>
//   )
// }

// function CardInput({
//   label, value, onChange, placeholder, maxLength, mono = false, onFocus, onBlur,
// }: {
//   label: string; value: string; onChange: (v: string) => void; placeholder: string
//   maxLength?: number; mono?: boolean; onFocus?: () => void; onBlur?: () => void
// }) {
//   return (
//     <div className="mb-3">
//       <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">{label}</label>
//       <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} maxLength={maxLength} onFocus={onFocus} onBlur={onBlur}
//         className={`w-full border border-gray-200 rounded-[7px] px-4 py-3 text-sm focus:outline-none focus:border-[#186737] focus:ring-2 focus:ring-green-100 transition-shadow bg-gray-50/50 ${mono ? 'font-mono tracking-widest' : ''}`}
//       />
//     </div>
//   )
// }

// ─── NEW SHOPIFY-STYLE CHECKOUT ───────────────────────────────────────────────

'use client'

import { ChevronRight, Tag, Truck } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useAppSelector } from '@/store/hooks'
import { calculateTax } from '@/utils/taxCalculator'
import Breadcrumb from '@/components/breadcum'

const usd = (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const resolveStr = (v: { en?: string; ar?: string } | string | null | undefined): string => {
  if (!v) return ''
  if (typeof v === 'string') return v
  return v.en ?? v.ar ?? ''
}

export default function CheckoutPage() {
  const taxData     = useAppSelector((s) => s.tax.data)
  const rawProducts = useAppSelector((s) => s.cart.rawProducts)

  const [email, setEmail]           = useState('')
  const [newsletter, setNewsletter] = useState(false)
  const [firstName, setFirstName]   = useState('')
  const [lastName, setLastName]     = useState('')
  const [company, setCompany]       = useState('')
  const [address, setAddress]       = useState('')
  const [apt, setApt]               = useState('')
  const [city, setCity]             = useState('')
  const [country, setCountry]       = useState('United States')
  const [stateName, setStateName]   = useState('')
  const [zip, setZip]               = useState('')
  const [phone, setPhone]           = useState('')
  const [code, setCode]             = useState('')
  const [codeApplied, setCodeApplied] = useState(false)
  const [codeError, setCodeError]     = useState(false)
  const [discount, setDiscount]       = useState(0)
  const [liftGate, setLiftGate]             = useState(false)
  const [residential, setResidential]       = useState(false)
  const [insideDelivery, setInsideDelivery] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('hc_default_address')
      if (!raw) return
      const addr = JSON.parse(raw)
      setAddress(addr.address ?? '')
      setCity(addr.city ?? '')
      setStateName(addr.state ?? '')
      setZip(addr.zip_code ?? '')
      setCountry(addr.related_country?.name ?? 'United States')
    } catch { /* ignore */ }
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cartItems = rawProducts.map((cp: any) => ({
    id:          cp.id as number,
    name:        resolveStr(cp.product?.name),
    image:       cp.product?.images?.en?.[0] ?? cp.product?.images?.ar?.[0] ?? '',
    qty:         cp.quantity as number,
    price:       parseFloat(cp.unit_price ?? cp.product?.price ?? 0),
    shipping:    parseFloat(cp.shipping_charge ?? 0),
    accessories: (cp.accessory_charges ?? []).reduce(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (s: number, a: any) => s + parseFloat(a.accessory_item_price ?? 0), 0
    ),
  }))

  const subtotal      = cartItems.reduce((s, c) => s + (c.price + c.accessories) * c.qty, 0)
  const shippingTotal = cartItems.reduce((s, c) => s + c.shipping, 0)
  const liftFee       = liftGate      ? 75  : 0
  const resFee        = residential   ? 199 : 0
  const insideFee     = insideDelivery ? 249 : 0
  const taxable       = subtotal - discount
  const { totalTax, ratePercent } = calculateTax(taxable, shippingTotal, taxData)
  const grandTotal    = taxable + shippingTotal + liftFee + resFee + insideFee + totalTax
  const totalItems    = cartItems.reduce((s, c) => s + c.qty, 0)

  const handleApplyCode = () => {
    if (code.toUpperCase() === 'HORECA10') {
      setDiscount(subtotal * 0.1)
      setCodeApplied(true)
      setCodeError(false)
    } else {
      setCodeError(true)
    }
  }

  const crumbs = [
    { label: 'Home',     href: '/'     },
    { label: 'Cart',     href: '/cart' },
    { label: 'Checkout', href: null    },
  ]

  return (
 <>
 
          <Breadcrumb crumbs={crumbs} />
    <div className=" global-container bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] max-w-7xl mx-auto ">

        {/* ── LEFT ─────────────────────────────────────────────────────────── */}
        <div className="px-6 md:px-12 xl:px-20 py-10 pt-0 border-r border-gray-100">

          {/* Breadcrumb */}

          {/* Express Checkout */}
          <div className="border border-gray-200 rounded-lg p-4 mb-6">
            <p className="text-center text-xs text-gray-500 font-medium mb-3">Express checkout</p>
            <div className="grid grid-cols-3 gap-2">
              <button className="h-11 rounded-md bg-[#5a31f4] hover:opacity-90 transition-opacity flex items-center justify-center">
                <span className="text-white font-bold text-sm">shop<span className="font-black">pay</span></span>
              </button>
              <button className="h-11 rounded-md bg-[#ffc439] hover:opacity-90 transition-opacity flex items-center justify-center">
                <span className="text-[#003087] font-bold text-xs">P <span className="text-[#0070ba]">PayPal</span></span>
              </button>
              <button className="h-11 rounded-md bg-black hover:opacity-90 transition-opacity flex items-center justify-center gap-1">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
                  <path d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10 5.35 0 9.25-3.67 9.25-9.09 0-1.15-.15-1.81-.15-1.81z"/>
                </svg>
                <span className="text-white font-semibold text-sm">Pay</span>
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">OR</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Contact */}
          <div className="mb-7">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">Contact information</h2>
              <span className="text-xs text-gray-500">
                Already have an account?{' '}
                <Link href="/login" className="text-[#186737] hover:underline font-medium">Log in</Link>
              </span>
            </div>
            <div className="space-y-3">
              <Field value={email} onChange={setEmail} type="email" placeholder="Email" />
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newsletter}
                  onChange={(e) => setNewsletter(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 accent-[#186737]"
                />
                <span className="text-sm text-gray-600">Email me with news and offers</span>
              </label>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="mb-8">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Shipping address</h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Field value={firstName} onChange={setFirstName} placeholder="First name" />
                <Field value={lastName}  onChange={setLastName}  placeholder="Last name" />
              </div>
              <Field value={company} onChange={setCompany} placeholder="Company (optional)" />
              <Field value={address} onChange={setAddress} placeholder="Address" />
              <Field value={apt}     onChange={setApt}     placeholder="Apartment, suite, etc. (optional)" />
              <Field value={city}    onChange={setCity}    placeholder="Suburb" />
              <div className="grid grid-cols-3 gap-3">
                <SelectField
                  value={country}
                  onChange={setCountry}
                  options={['United States', 'Canada', 'United Kingdom', 'Australia']}
                  placeholder="Country/region"
                />
                <Field value={stateName} onChange={setStateName} placeholder="State/territory" />
                <Field value={zip}       onChange={setZip}       placeholder="Postcode" />
              </div>
              <Field value={phone} onChange={setPhone} type="tel" placeholder="Phone" />
            </div>
          </div>

          {/* Delivery Options */}
          <div className="mb-8 border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-900">Lift Gate or Residential Address</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {[
                { label: 'Lift Gate Service',        desc: 'Required for deliveries without loading dock', fee: 75,  state: liftGate,       toggle: () => setLiftGate(!liftGate) },
                { label: 'Residential Address',      desc: 'Delivery to home or residential location',    fee: 199, state: residential,     toggle: () => setResidential(!residential) },
                { label: 'Inside Delivery Address',  desc: 'Delivery inside the building',                fee: 249, state: insideDelivery,  toggle: () => setInsideDelivery(!insideDelivery) },
              ].map(({ label, desc, fee, state, toggle }) => (
                <div key={label} className="flex items-center justify-between px-4 py-3.5">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                    {state && (
                      <p className="text-xs text-[#186737] font-semibold mt-1">+${fee}.00 fee will be added</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={toggle}
                    className={`relative shrink-0 w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${state ? 'bg-[#186737]' : 'bg-gray-300'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${state ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 flex-wrap gap-4">
            <Link href="/cart" className="flex items-center gap-1 text-[#186737] text-sm hover:underline font-medium">
              <ChevronRight size={14} className="rotate-180" /> Return to cart
            </Link>
            <button
              type="button"
              className="bg-[#186737] hover:bg-[#145c30] text-white font-semibold px-8 py-3 rounded-md text-sm transition-colors"
            >
              Continue to shipping
            </button>
          </div>

          <div className="flex flex-wrap gap-4 mt-8 text-xs text-[#186737]">
            <Link href="/pages/return-policy"  className="hover:underline">Refund policy</Link>
            <Link href="/pages/privacy-policy" className="hover:underline">Privacy policy</Link>
            <Link href="/pages/terms"          className="hover:underline">Terms of service</Link>
          </div>
        </div>

        {/* ── RIGHT — Order Summary ─────────────────────────────────────────── */}
        <div className="bg-[#fafafa] border-l border-gray-100 px-6 md:px-10 py-10">

          {/* Items */}
          <div className="space-y-4 mb-6">
            {cartItems.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">Your cart is empty.</p>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="flex items-start gap-3">
                  <div className="relative shrink-0">
                    <div className="w-16 h-16 rounded-md border border-gray-200 bg-white overflow-hidden flex items-center justify-center">
                      {item.image
                        ? <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                        : <div className="w-full h-full bg-gray-100" />
                      }
                    </div>
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-gray-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {item.qty}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 font-medium leading-snug line-clamp-2">{item.name}</p>
                    {item.accessories > 0 && (
                      <p className="text-[11px] text-gray-400 mt-0.5">+${usd(item.accessories)} accessories</p>
                    )}
                    {item.shipping > 0 && (
                      <div className="flex items-center gap-1 mt-0.5 text-[11px] text-gray-400">
                        <Truck size={10} /> ${usd(item.shipping)} shipping
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-gray-800 shrink-0">
                    ${usd((item.price + item.accessories) * item.qty)}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Discount code */}
          <div className="flex gap-2 mb-2">
            <div className="relative flex-1">
              <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={code}
                onChange={(e) => { setCode(e.target.value.toUpperCase()); setCodeError(false) }}
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
          {codeError   && <p className="text-[11px] text-red-500 mb-4">Invalid code.</p>}
          {codeApplied && <p className="text-[11px] text-[#186737] mb-4">HORECA10 — 10% off applied</p>}

          <div className="h-px bg-gray-200 my-4" />

          {/* Price rows */}
          <div className="space-y-2 text-sm mb-4">
            <PriceRow label={`Subtotal (${totalItems} item${totalItems !== 1 ? 's' : ''})`} value={`$${usd(subtotal)}`} />
            {codeApplied && <PriceRow label="Discount (HORECA10)" value={`-$${usd(discount)}`} green />}
            <PriceRow
              label="Shipping & Handling"
              value={shippingTotal === 0 ? 'Free' : `$${usd(shippingTotal)}`}
              green={shippingTotal === 0}
            />
            {liftGate      && <PriceRow label="Lift Gate Service"    value={`$${usd(liftFee)}`} />}
            {residential   && <PriceRow label="Residential Address"  value={`$${usd(resFee)}`} />}
            {insideDelivery && <PriceRow label="Inside Delivery"     value={`$${usd(insideFee)}`} />}
            {ratePercent > 0 && (
              <PriceRow label={`Tax (${ratePercent}%)`} value={`$${usd(totalTax)}`} />
            )}
          </div>

          <div className="h-px bg-gray-200 mb-4" />

          {/* Total */}
          <div className="flex items-center justify-between">
            <span className="font-bold text-gray-900 text-base">Total Amount</span>
            <span className="font-bold text-gray-900 text-xl">${usd(grandTotal)}</span>
          </div>
        </div>
      </div>
    </div>
 </>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Field({
  value, onChange, type = 'text', placeholder,
}: {
  value: string; onChange: (v: string) => void; type?: string; placeholder?: string
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full h-12 px-3 border border-gray-300 rounded-md text-sm outline-none focus:border-[#186737] focus:ring-1 focus:ring-[#186737]/20 bg-white placeholder:text-gray-400 transition-all"
    />
  )
}

function SelectField({
  value, onChange, options, placeholder,
}: {
  value: string; onChange: (v: string) => void; options: string[]; placeholder?: string
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-12 px-3 border border-gray-300 rounded-md text-sm outline-none focus:border-[#186737] focus:ring-1 focus:ring-[#186737]/20 bg-white text-gray-700 appearance-none cursor-pointer"
      >
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronRight size={13} className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" />
    </div>
  )
}

function PriceRow({
  label, value, green = false, muted = false,
}: {
  label: string; value: string; green?: boolean; muted?: boolean
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-600">{label}</span>
      <span className={`font-medium ${green ? 'text-[#186737]' : muted ? 'text-gray-400 italic text-xs' : 'text-gray-800'}`}>
        {value}
      </span>
    </div>
  )
}









































