// // // import React from "react";
// // // import type { ApiOrderDetail } from "@/components/download-invoice";

// // // // ─── Helpers ──────────────────────────────────────────────────────────────────
// // // function formatDateShort(dateStr: string): string {
// // //   if (!dateStr) return "";
// // //   const d = new Date(dateStr);
// // //   return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
// // // }

// // // function toUSD(val: string | number): string {
// // //   return Number(val).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
// // // }

// // // function convertAmountToWords(amount: number): string {
// // //   try {
// // //     // eslint-disable-next-line @typescript-eslint/no-require-imports
// // //     const { toWords } = require("number-to-words");
// // //     const [whole, fraction = "00"] = amount.toFixed(2).split(".");
// // //     const words = toWords(Number(whole)).replace(/\b\w/g, (l: string) => l.toUpperCase());
// // //     return `${words} And ${fraction}/100 U.S. Dollars Only`;
// // //   } catch {
// // //     return `${toUSD(amount)} U.S. Dollars Only`;
// // //   }
// // // }

// // // // API address string → structured
// // // function parseAddress(raw: string) {
// // //   const lines = raw.split(/\\n|\n/).filter(Boolean);
// // //   const address = lines[0] ?? raw;
// // //   const rest = lines[1] ?? "";
// // //   const parts = rest.split(",").map((s) => s.trim());
// // //   return {
// // //     address,
// // //     city: parts[0] ?? "",
// // //     state: parts[1] ?? "",
// // //     country: (parts[2] ?? "").replace(/^-\s*/, ""),
// // //   };
// // // }

// // // function formatPhoneNumber(code: string, number: string) {
// // //   return `${code} ${number}`;
// // // }

// // // // ─── TermOfSale ───────────────────────────────────────────────────────────────
// // // const TermOfSale: React.FC = () => (
// // //   <div className="text-[8px] leading-relaxed space-y-0.5">
// // //     <p>1. All orders are subject to acceptance by The HoReCa Store Inc.</p>
// // //     <p>2. Prices are subject to change without notice.</p>
// // //     <p>3. All sales are final unless otherwise stated in writing.</p>
// // //     <p>4. Returns must be pre-authorized and subject to a restocking fee.</p>
// // //     <p>5. Title and risk of loss pass to buyer upon delivery to carrier.</p>
// // //     <p>6. The HoReCa Store Inc. is not liable for carrier-caused delays.</p>
// // //     <p>7. Payment terms are as agreed at time of purchase.</p>
// // //     <p>8. Disputes must be reported within 5 business days of receipt.</p>
// // //     <p>9. Warranty claims are handled directly with the manufacturer.</p>
// // //     <p>10. All prices are in USD unless otherwise specified.</p>
// // //     <p>11. Late payments may incur additional charges as per applicable law.</p>
// // //     <p>12. Force majeure events are not the responsibility of HoReCa Store.</p>
// // //   </div>
// // // );

// // // // ─── Main Component ───────────────────────────────────────────────────────────
// // // interface InvoiceUsStaticProps {
// // //   order: ApiOrderDetail;
// // // }

// // // const InvoiceUsStatic: React.FC<InvoiceUsStaticProps> = ({ order }) => {
// // //   const currency = order.currency?.target_symbol ?? "$";
// // //   const addr = parseAddress(order.customer_address);

// // //   // Pagination logic — same as original InvoiceUs.jsx
// // //   const firstPageCount = 7;
// // //   const middlePageCount = 9;
// // //   const allProducts = order.order_products ?? [];

// // //   const firstPageProducts = allProducts.slice(0, firstPageCount);
// // //   const restProducts = allProducts.slice(firstPageCount);

// // //   const middlePages: typeof allProducts[] = [];
// // //   let middleUsedCount = 0;
// // //   for (let i = 0; i < restProducts.length; i += middlePageCount) {
// // //     const chunk = restProducts.slice(i, i + middlePageCount);
// // //     const isLastChunk = i + middlePageCount >= restProducts.length;
// // //     if (chunk.length === 1 && isLastChunk && allProducts.length !== 2) break;
// // //     middlePages.push(chunk);
// // //     middleUsedCount += chunk.length;
// // //   }

// // //   const remainingForLast = restProducts.slice(middleUsedCount);
// // //   const shouldShowProductInLastPage = remainingForLast.length === 1 || allProducts.length === 2;
// // //   const lastPageProducts = shouldShowProductInLastPage ? remainingForLast : [];
// // //   const totalPages = 1 + middlePages.length + 1;

// // //   const paymentMode = order.pay_with_cheque === 1
// // //     ? "Check"
// // //     : (order.payments[0]?.payment_mode ?? "");

// // //   // Discount flags
// // //   const hasDiscount = Number(order.discount) > 0;
// // //   const hasAdditional = Number(order.additional_discount_amount) > 0;
// // //   const hasCheque = order.pay_with_cheque === 1 && Number((order as any).cheque_discount ?? 0) > 0;
// // //   const chequeDiscount = Number((order as any).cheque_discount ?? 0);
// // //   const chequeDiscountPct = Number((order as any).cheque_discount_percentage ?? 0);

// // //   // ── Product Row renderer ────────────────────────────────────────────────────
// // //   const renderProductRow = (item: ApiOrderDetail["order_products"][number], index: number, globalIndex: number) => {
// // //     const isEven = index % 2 !== 0;
// // //     const sno = String(globalIndex + 1).padStart(2, "0");
// // //     const price = item.product_supplier.price;
// // //     const rowTotal = (price * item.quantity).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
// // //     const name = item.product.name?.en ?? "";
// // //     const image = item.product.image_urls?.en?.[0] ?? "";
// // //     const brand = item.product.brand?.name?.en ?? "";
// // //     const sellingUnit = item.product.selling_unit_attribute?.en ?? "";
// // //     const accCharge = (item as any).accessory_item_charge ?? "0.00";
// // //     const accCharges = (item as any).accessory_charges ?? [];
// // //     const parentCat = item.product.category?.most_parent_seo_url ?? "";
// // //     const cat = item.product.category?.seo_url ?? "";
// // //     const slug = item.product.seo_url ?? "";
// // //     const productUrl = `/${parentCat}/${cat}/${slug}`;

// // //     return (
// // //       <div
// // //         key={item.id}
// // //         className={`grid grid-cols-[5%,32%,10%,8%,10%,10%,12%,13%] border-b border-black ${isEven ? "bg-gray-200" : "bg-white"}`}
// // //       >
// // //         <div className="border-r border-black pl-2 pr-2 pb-4 pt-1 text-center flex justify-center items-center text-[9px]">
// // //           {sno}
// // //         </div>

// // //         <div className="border-r border-black pl-2 pr-2 pb-4 pt-1 space-y-0.5 text-[9px]">
// // //           <p className="font-bold text-[10px]">
// // //             {name.length > 75 ? `${name.slice(0, 75)}...` : name}
// // //           </p>
// // //           <p>
// // //             <span className="font-bold">Brand:</span>{" "}
// // //             <span className="text-red-600">{brand}</span>{" "}
// // //             | <span className="font-bold">SKU #:</span>{" "}
// // //             <span className="text-red-600">{item.product.sku}</span>
// // //           </p>
// // //           <p className="pb-[3px]">
// // //             <span className="font-bold">Shipping by:</span>{" "}
// // //             <span className="text-red-600">{item.expected_shipping_date}</span>
// // //           </p>
// // //           {accCharges.length > 0 && (
// // //             <div className="mt-2">
// // //               {accCharges.map((ac: any, idx: number) => (
// // //                 <div className="mb-1" key={ac.id || idx}>
// // //                   <p className="font-semibold text-[10px] text-black">
// // //                     <span className="font-bold">{ac.accessory_item_name}:</span> ${ac.accessory_item_price}
// // //                   </p>
// // //                 </div>
// // //               ))}
// // //             </div>
// // //           )}
// // //           <a href={productUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-[9.7px]">
// // //             Click here for more details
// // //           </a>
// // //         </div>

// // //         <div className="border-r border-black flex justify-center items-center pl-2 pr-2 pb-4 pt-1">
// // //           <img
// // //             src={image}
// // //             className="w-12 h-12 object-contain"
// // //             crossOrigin="anonymous"
// // //             alt={name}
// // //             onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/images/placeholder.png"; }}
// // //           />
// // //         </div>

// // //         <div className="border-r border-black pl-2 pr-2 pb-4 pt-1 text-center flex justify-center items-center text-[9px]">
// // //           {item.quantity}
// // //         </div>
// // //         <div className="border-r border-black pl-2 pr-2 pb-4 pt-1 text-center flex justify-center items-center text-[9px]">
// // //           ${Number(accCharge).toFixed(2)}
// // //         </div>
// // //         <div className="border-r border-black pl-2 pr-2 pb-4 pt-1 text-center flex justify-center items-center text-[9px]">
// // //           {sellingUnit}
// // //         </div>
// // //         <div className="border-r border-black pl-2 pr-2 pb-4 pt-1 text-center flex justify-center items-center text-[9px]">
// // //           ${toUSD(price)}
// // //         </div>
// // //         <div className="pl-2 pr-2 pb-4 pt-1 text-center flex justify-center items-center text-[9px]">
// // //           ${rowTotal}
// // //         </div>
// // //       </div>
// // //     );
// // //   };

// // //   // ── Totals Box ──────────────────────────────────────────────────────────────
// // //   const TotalsBox = () => (
// // //     <div className="border border-black bg-white">
// // //       <div className="p-4">
// // //         <div className="w-full text-[12px]">
// // //           {/* Subtotal */}
// // //           <div className="grid grid-cols-[70%,30%] py-1">
// // //             <div className="font-semibold text-left">INVOICE SUBTOTAL</div>
// // //             <div className="text-right">${toUSD(order.amount)}</div>
// // //           </div>

// // //           {/* Coupon Discount */}
// // //           {hasDiscount && (
// // //             <>
// // //               <div className="grid grid-cols-[70%,30%] py-1">
// // //                 <div className="font-semibold text-left text-red-600">Coupon Discount</div>
// // //                 <div className="text-right text-red-600">- ${toUSD(order.discount)}</div>
// // //               </div>
// // //               <div className="w-full h-[1px] bg-gray-300 my-2" />
// // //               <div className="grid grid-cols-[70%,30%] py-1">
// // //                 <div className="font-semibold text-left">Subtotal After Coupon</div>
// // //                 <div className="text-right font-bold">${toUSD(Number(order.amount) - Number(order.discount))}</div>
// // //               </div>
// // //             </>
// // //           )}

// // //           {/* Additional Discount */}
// // //           {hasAdditional && (order as any).additional_discount_type && (order as any).additional_discount_percentage && (
// // //             <>
// // //               <div className="w-full h-[1px] bg-gray-200 my-2" />
// // //               <div className="grid grid-cols-[70%,30%] py-1">
// // //                 <div className="text-left">
// // //                   <span className="font-semibold text-orange-700">
// // //                     Additional Discount
// // //                     {(order as any).additional_discount_type === "percentage" &&
// // //                       ` (${Number((order as any).additional_discount_percentage).toFixed(1)}%)`}
// // //                   </span>
// // //                   {(order as any).additional_discount_reason && (
// // //                     <p className="text-[8px] text-gray-600 mt-0.5">
// // //                       Reason: {(order as any).additional_discount_reason}
// // //                     </p>
// // //                   )}
// // //                 </div>
// // //                 <div className="text-right text-orange-700 font-semibold">
// // //                   - ${toUSD(order.additional_discount_amount)}
// // //                 </div>
// // //               </div>
// // //             </>
// // //           )}

// // //           {/* Subtotal After Discounts (no cheque) */}
// // //           {(hasDiscount || hasAdditional) && !hasCheque && (
// // //             <>
// // //               <div className="w-full h-[1px] bg-gray-200 my-2" />
// // //               <div className="grid grid-cols-[70%,30%] py-1 font-semibold">
// // //                 <span className="text-black text-left">Subtotal After Discounts</span>
// // //                 <span className="text-gray-900 text-right">
// // //                   ${toUSD(Number(order.amount) - Number(order.discount || 0) - Number(order.additional_discount_amount || 0))}
// // //                 </span>
// // //               </div>
// // //             </>
// // //           )}

// // //           {/* Check Discount */}
// // //           {hasCheque && (
// // //             <>
// // //               <div className="w-full h-[1px] bg-gray-200 my-2" />
// // //               <div className="grid grid-cols-[70%,30%] py-1">
// // //                 <span className="text-green-700 font-semibold text-left">
// // //                   Check Discount ({chequeDiscountPct.toFixed(1)}%)
// // //                 </span>
// // //                 <span className="text-green-700 font-semibold text-right">
// // //                   - ${toUSD(chequeDiscount)}
// // //                 </span>
// // //               </div>
// // //             </>
// // //           )}

// // //           {/* Subtotal After ALL Discounts (with cheque) */}
// // //           {(hasDiscount || hasAdditional) && hasCheque && (
// // //             <>
// // //               <div className="w-full h-[1px] bg-gray-200 my-2" />
// // //               <div className="grid grid-cols-[70%,30%] py-1 font-semibold">
// // //                 <span className="text-black text-left">Subtotal After All Discounts</span>
// // //                 <span className="text-gray-900 text-right">
// // //                   ${toUSD(Number(order.amount) - Number(order.discount || 0) - Number(order.additional_discount_amount || 0) - chequeDiscount)}
// // //                 </span>
// // //               </div>
// // //             </>
// // //           )}

// // //           {/* Inside Delivery */}
// // //           {order.is_inside_delivery === 1 && (
// // //             <>
// // //               <div className="w-full h-[1px] bg-gray-200 my-2" />
// // //               <div className="grid grid-cols-[70%,30%] py-1">
// // //                 <span className="text-black font-semibold text-left">Inside Delivery</span>
// // //                 <span className="text-black font-semibold text-right">$249.00</span>
// // //               </div>
// // //             </>
// // //           )}

// // //           {/* Lift Gate */}
// // //           {order.is_lift_gate === 1 && (
// // //             <>
// // //               <div className="w-full h-[1px] bg-gray-200 my-2" />
// // //               <div className="grid grid-cols-[70%,30%] py-1">
// // //                 <span className="text-black font-semibold text-left">Lift Gate Delivery</span>
// // //                 <span className="text-black font-semibold text-right">$75.00</span>
// // //               </div>
// // //             </>
// // //           )}

// // //           {/* Residential */}
// // //           {order.is_residential_address === 1 && (
// // //             <>
// // //               <div className="w-full h-[1px] bg-gray-200 my-2" />
// // //               <div className="grid grid-cols-[70%,30%] py-1">
// // //                 <span className="text-black font-semibold text-left">Residential Address Fee</span>
// // //                 <span className="text-black font-semibold text-right">$199.00</span>
// // //               </div>
// // //             </>
// // //           )}

// // //           {/* Shipping */}
// // //           <div className="w-full h-[1px] bg-gray-200 my-2" />
// // //           <div className="grid grid-cols-[70%,30%] py-1">
// // //             <div className="font-semibold text-left">Shipping</div>
// // //             <div className="text-right">${toUSD(order.shipping_charge)}</div>
// // //           </div>

// // //           {/* Tax */}
// // //           <div className="grid grid-cols-[70%,30%] py-1">
// // //             <div className="font-semibold text-left">Sales Tax {Number(order.tax_percentage).toFixed(2)}%</div>
// // //             <div className="text-right">${toUSD(order.tax_amount)}</div>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {/* Net Total */}
// // //       <p className="flex justify-between text-[#FF0000] bg-[#E7E7E7] pl-2 pr-2 pb-2 pt-2 font-semibold text-[12px]">
// // //         <span>NET TOTAL INCL. SALES TAX</span>
// // //         <span>{currency} {toUSD(order.total_amount)}</span>
// // //       </p>
// // //       <div className="text-right pl-4 pt-2 pb-4 pr-2">
// // //         <p className="font-semibold text-[10px]">
// // //           {convertAmountToWords(Number(order.total_amount))}
// // //         </p>
// // //       </div>
// // //     </div>
// // //   );

// // //   // ── Shared Header ─────────────────────────────────────────────────────────
// // //   const Header = () => (
// // //     <div className="grid grid-cols-3 gap-4 p-2">
// // //       <div className="flex items-center">
// // //         <img
// // //           className="h-16 w-40 object-contain"
// // //           src="/images/horecalogo.png"
// // //           alt="logo"
// // //         />
// // //       </div>
// // //       <div className="text-center">
// // //         <h1 className="text-[16px] font-bold">SALES INVOICE</h1>
// // //         <p className="text-[13px] font-bold text-[#186737]">Save Money, Simplify Procurement.</p>
// // //       </div>
// // //       <div className="text-right text-[9px]">
// // //         <p className="font-bold">THE HORECA STORE INC.</p>
// // //         <p>8800 Bissonnet Street, Ste A,</p>
// // //         <p>Houston, Texas 77074</p>
// // //         <p>Phone: 1 (866) 446-7322</p>
// // //         <p>Email: sales@thehorecastore.com</p>
// // //         <p>www.thehorecastore.com</p>
// // //       </div>
// // //     </div>
// // //   );

// // //   // ── Shared Bill To ────────────────────────────────────────────────────────
// // //   const BillToBox = () => (
// // //     <div className="border border-black">
// // //       <div className="bg-gray-200 pl-2 pr-2 pb-2 pt-2 text-center font-semibold text-sm">Bill To</div>
// // //       <div className="pl-2 pr-2 pb-4 pt-2">
// // //         <p className="font-bold text-sm mb-1 uppercase">{order.customer.name}</p>
// // //         <p className="mb-2 text-xs">
// // //           {addr.address}<br />
// // //           {addr.city}, {addr.state}, {addr.country}
// // //         </p>
// // //         <div className="space-y-1 text-xs">
// // //           <p>
// // //             {order.customer.type.toLowerCase() === "business" ? (
// // //               <>
// // //                 <span className="font-semibold">Attention To:</span> {order.customer.name}{" "}
// // //                 <span className="font-semibold ml-8">Telephone:</span>{" "}
// // //                 {formatPhoneNumber(order.customer.country_code, order.customer.mobile_number)}
// // //               </>
// // //             ) : (
// // //               <>
// // //                 <span className="font-semibold">Telephone:</span>{" "}
// // //                 {formatPhoneNumber(order.customer.country_code, order.customer.mobile_number)}
// // //               </>
// // //             )}
// // //           </p>
// // //           <p><span className="font-semibold">Email:</span> {order.customer.email}</p>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );

// // //   // ── Invoice Info Table ────────────────────────────────────────────────────
// // //   const InvoiceInfoTable = () => (
// // //     <div>
// // //       <div className="w-full text-[9px] border border-black">
// // //         {/* Row 1 header */}
// // //         <div className="grid grid-cols-3 bg-gray-200 border-b border-black font-bold text-center">
// // //           <div className="border-r border-black pl-2 pr-2 pb-2 pt-1">Date</div>
// // //           <div className="border-r border-black pl-2 pr-2 pb-2 pt-1">Invoice No</div>
// // //           <div className="pl-2 pr-2 pb-2 pt-1">Payment Status</div>
// // //         </div>
// // //         {/* Row 1 data */}
// // //         <div className="grid grid-cols-3 text-center border-b border-black">
// // //           <div className="border-r border-black pl-2 pr-2 pb-2 pt-1">
// // //             {formatDateShort(order.created_at)}
// // //           </div>
// // //           <div className="border-r border-black pl-2 pr-2 pb-2 pt-1 text-red-600 font-semibold">
// // //             INV-{order.order_number}
// // //           </div>
// // //           <div className="pl-2 pr-2 pb-2 pt-1">{order.is_paid ? "Paid" : "Pending"}</div>
// // //         </div>
// // //         {/* Row 2 header */}
// // //         <div className="grid grid-cols-3 bg-gray-200 border-b border-black font-bold text-center">
// // //           <div className="border-r border-black pl-2 pr-2 pb-2 pt-1">Payment Mode</div>
// // //           <div className="border-r border-black pl-2 pr-2 pb-2 pt-1">Order Type</div>
// // //           <div className="pl-2 pr-2 pb-2 pt-1">Currency</div>
// // //         </div>
// // //         {/* Row 2 data */}
// // //         <div className={`grid grid-cols-3 text-center ${order.payments[1] ? "border-b border-black" : ""}`}>
// // //           <div className="border-r border-black pl-2 pr-2 pb-2 pt-1">{paymentMode}</div>
// // //           <div className="border-r border-black pl-2 pr-2 pb-2 pt-1">Online</div>
// // //           <div className="pl-2 pr-2 pb-2 pt-1 text-red-600 font-semibold">{currency}</div>
// // //         </div>
// // //         {/* Second payment row */}
// // //         {order.payments[1] && (
// // //           <div className="grid grid-cols-3 text-center">
// // //             <div className="border-r border-black pl-2 pr-2 pb-2 pt-1">{order.payments[1].payment_mode}</div>
// // //             <div className="border-r border-black pl-2 pr-2 pb-2 pt-1">Online</div>
// // //             <div className="pl-2 pr-2 pb-2 pt-1 text-red-600 font-semibold">{currency}</div>
// // //           </div>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );

// // //   // ── Product Table Header ──────────────────────────────────────────────────
// // //   const ProductTableHeader = () => (
// // //     <div className="grid grid-cols-[5%,32%,10%,8%,10%,10%,12%,13%] bg-gray-200 font-bold border-b border-black text-[9px]">
// // //       {["S.No","Description","Image","Quantity","Accessories Total Amount","UNIT","Unit Price","Total"].map((h, i, arr) => (
// // //         <div key={h} className={`pl-2 pr-2 pb-4 pt-1 text-center flex justify-center items-center ${i < arr.length - 1 ? "border-r border-black" : ""}`}>
// // //           {h}
// // //         </div>
// // //       ))}
// // //     </div>
// // //   );

// // //   // ── Bank Details ──────────────────────────────────────────────────────────
// // //   const BankBox = () => (
// // //     <div className="border border-black bg-white">
// // //       <div className="bg-gray-200 text-center px-2 pb-2 pt-2">
// // //         <p className="font-semibold text-[13px]">Bank Details</p>
// // //       </div>
// // //       <div className="w-full text-[10px] border-t border-black">
// // //         {[
// // //           ["Account Name", "THE HORECA STORE INC"],
// // //           ["Beneficiary Address", "8800 BISSONNET ST STE A, HOUSTON TX 77074-2435"],
// // //           ["Account No", "6130 9953 3"],
// // //           ["Bank", "JP Morgan Chase Bank"],
// // //           ["Routing Code", "1110 0061 4"],
// // //         ].map(([label, val], i) => (
// // //           <div key={label} className="grid grid-cols-[30%,70%] border-b border-black">
// // //             <div className="bg-[#E7E7E7] font-semibold whitespace-nowrap pl-1 pr-2 pt-1 pb-2">{label}</div>
// // //             <div className="font-semibold pl-1 pr-2 pt-1 pb-2">{val}</div>
// // //           </div>
// // //         ))}
// // //         <div className="grid grid-cols-[30%,70%]">
// // //           <p className="bg-[#E7E7E7] font-semibold pl-2 pr-2 pt-1 pb-2">In Case Of Cheque Payment</p>
// // //           <div className="font-semibold pl-1 pr-2 pt-1 pb-2">
// // //             Please prepare all cheques in favor of
// // //             <p><span className="text-[#FF0000] block">THE HORECA STORE INC</span></p>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );

// // //   // ── Payment Terms ─────────────────────────────────────────────────────────
// // //   const PaymentTermsBox = () => (
// // //     <div className="border border-black bg-white">
// // //       <div className="bg-gray-200 text-center pl-2 pr-2 pb-2 pt-2">
// // //         <p className="font-semibold text-[13px]">Customer Payment Terms &amp; Order Processing Timeline</p>
// // //       </div>
// // //       <div className="pl-1 pb-2 text-[10px] leading-relaxed">
// // //         <p><strong>Bank Transfer (Wire/Local):</strong> Orders are processed after 2–3 business days upon receipt of funds.</p>
// // //         <p><strong>ACH Payments:</strong> Orders are processed after 3 business days from payment receipt.</p>
// // //         <p><strong>Personal Checks:</strong> Orders are processed after 5 business days from deposit date.</p>
// // //         <p><strong>Corporate Checks:</strong> Orders are processed after 3 business days from deposit date.</p>
// // //         <p><strong>Cash &amp; Card Payments:</strong> Orders are processed immediately upon successful payment.</p>
// // //         <p><strong>Online Payments (Credit/Debit):</strong> Subject to fraud screening—may take 1–2 extra business days if flagged.</p>
// // //         <p><strong>Confirmation:</strong> Orders are confirmed only after payment clearance and fraud checks are completed.</p>
// // //       </div>
// // //     </div>
// // //   );

// // //   // ── Page Footer ───────────────────────────────────────────────────────────
// // //   const PageFooter = ({ page, total }: { page: number; total: number }) => (
// // //     <div className="border-t border-black p-2 text-xs flex flex-col items-center gap-2">
// // //       <div className="w-full flex justify-between">
// // //         <div>
// // //           Order Online for Fast Shipping &amp; Lower Prices at{" "}
// // //           <a href="https://www.thehorecastore.com" target="_blank" rel="noopener noreferrer" className="text-green-700">
// // //             www.thehorecastore.com
// // //           </a>
// // //         </div>
// // //         <div>Page {page} of {total}</div>
// // //       </div>
// // //     </div>
// // //   );

// // //   // ── Shared page style — EXACTLY like original ─────────────────────────────
// // //   const pageClass = "bg-white flex flex-col justify-between p-[5px] box-border";
// // //   const firstPageHeight = firstPageProducts.length <= 1 ? "1070px" : "1060px";

// // //   return (
// // //     <div
// // //       id="targetDiv"
// // //       style={{
// // //         width: "auto",
// // //         margin: "0 auto",
// // //         padding: "5mm",
// // //         fontSize: "12px",
// // //         lineHeight: "1.3",
// // //         fontFamily: "Arial, sans-serif",
// // //         backgroundColor: "white",
// // //       }}
// // //     >
// // //       {/* ══════════════ PAGE 1 ══════════════ */}
// // //       <div className={pageClass} style={{ height: firstPageHeight, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
// // //         <div className="flex flex-col justify-between h-full">

// // //           {/* Header */}
// // //           <Header />

// // //           {/* Bill To + Invoice Info */}
// // //           <div className="grid grid-cols-2 gap-4 p-2">
// // //             <BillToBox />
// // //             <InvoiceInfoTable />
// // //           </div>

// // //           {/* Products Table */}
// // //           <div className="p-2 mt-1" style={{ flexGrow: 1 }}>
// // //             <div className="w-full text-[9px] border border-black">
// // //               <ProductTableHeader />
// // //               {firstPageProducts.map((item, index) => renderProductRow(item, index, index))}
// // //             </div>

// // //             {/* Terms + Totals — only when <= 1 product on first page */}
// // //             {firstPageProducts.length <= 1 && (
// // //               <div className="grid grid-cols-[3fr_2fr] p-2 gap-4 mt-2">
// // //                 <div className="border border-black p-4 bg-white">
// // //                   <p className="text-[12px] font-semibold mb-2">TERMS OF SALE</p>
// // //                   <TermOfSale />
// // //                 </div>
// // //                 <TotalsBox />
// // //               </div>
// // //             )}
// // //           </div>

// // //           {/* Footer section — only when single product */}
// // //           {firstPageProducts.length <= 1 && (
// // //             <div className="mt-auto">
// // //               <p className="font-semibold text-xs text-center pt-[10px]">
// // //                 We sincerely appreciate your business and look forward to serving you again.
// // //               </p>
// // //               <div className="grid grid-cols-2 gap-4 pl-[7px] pr-[7px] pb-[20px] pt-[15px]">
// // //                 <BankBox />
// // //                 <PaymentTermsBox />
// // //               </div>
// // //               <p className="font-semibold text-center mb-4 text-[11px]">
// // //                 This is a system generated Invoice. Hence, no stamp or signature required.
// // //               </p>
// // //             </div>
// // //           )}

// // //           <PageFooter page={1} total={firstPageProducts.length > 1 ? totalPages : 1} />
// // //         </div>
// // //       </div>

// // //       {/* ══════════════ MIDDLE PAGES ══════════════ */}
// // //       {middlePages.map((pageProducts, pageIdx) => {
// // //         const startingIndex = firstPageCount + pageIdx * middlePageCount;
// // //         return (
// // //           <div key={pageIdx}>
// // //             <div style={{ pageBreakBefore: "always", height: "0px" }} />
// // //             <div
// // //               style={{ height: "1070px", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "5px", boxSizing: "border-box", backgroundColor: "white" }}
// // //             >
// // //               <div className="flex flex-col justify-between h-full">
// // //                 <Header />

// // //                 {/* Compact order info for middle pages */}
// // //                 <div className="p-2">
// // //                   <div className="w-full text-[9px] border border-black">
// // //                     <div className="grid grid-cols-6 bg-gray-200 text-center font-semibold border-b border-black">
// // //                       {["Date","Invoice No.","Payment Status","Payment Mode","Order Type","Currency"].map((h, i, arr) => (
// // //                         <div key={h} className={`pl-2 pr-2 pb-3 pt-1 ${i < arr.length - 1 ? "border-r border-black" : ""}`}>{h}</div>
// // //                       ))}
// // //                     </div>
// // //                     <div className="grid grid-cols-6 text-center">
// // //                       <div className="border-r border-black pl-2 pr-2 pb-3 pt-1">{formatDateShort(order.created_at)}</div>
// // //                       <div className="border-r border-black text-[#FF0000] pl-2 pr-2 pb-3 pt-1 font-semibold">INV-{order.order_number}</div>
// // //                       <div className="border-r border-black pl-2 pr-2 pb-3 pt-1">{order.is_paid ? "Paid" : "Pending"}</div>
// // //                       <div className="border-r border-black pl-2 pr-2 pb-3 pt-1">{paymentMode}</div>
// // //                       <div className="border-r border-black pl-2 pr-2 pb-3 pt-1">Online</div>
// // //                       <div className="text-[#FF0000] pl-2 pr-2 pb-3 pt-1 font-semibold">{currency}</div>
// // //                     </div>
// // //                   </div>
// // //                 </div>

// // //                 <div className="p-2" style={{ flexGrow: 1 }}>
// // //                   <div className="w-full text-[9px] border border-black">
// // //                     <ProductTableHeader />
// // //                     {pageProducts.map((item, idx) => renderProductRow(item, idx, startingIndex + idx))}
// // //                   </div>
// // //                 </div>

// // //                 <PageFooter page={pageIdx + 2} total={totalPages} />
// // //               </div>
// // //             </div>
// // //           </div>
// // //         );
// // //       })}

// // //       {/* ══════════════ LAST PAGE ══════════════ */}
// // //       {firstPageProducts.length > 1 && (
// // //         <>
// // //           <div style={{ pageBreakBefore: "always", height: "0px" }} />
// // //           <div
// // //             style={{ height: "1070px", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "5px", boxSizing: "border-box", backgroundColor: "white" }}
// // //           >
// // //             <div className="flex flex-col justify-between h-full">
// // //               <Header />

// // //               <div className="grid grid-cols-2 gap-4 p-2">
// // //                 <BillToBox />
// // //                 <InvoiceInfoTable />
// // //               </div>

// // //               {/* Last page products (if any) */}
// // //               {shouldShowProductInLastPage && lastPageProducts.length > 0 && (
// // //                 <div className="p-2 mt-1">
// // //                   <div className="w-full text-[9px] border border-black">
// // //                     <ProductTableHeader />
// // //                     {lastPageProducts.map((item, idx) => {
// // //                       const gi = firstPageCount + middlePages.length * middlePageCount + idx;
// // //                       return renderProductRow(item, idx, gi);
// // //                     })}
// // //                   </div>
// // //                 </div>
// // //               )}

// // //               {/* Terms + Totals */}
// // //               <div className="grid grid-cols-[3fr_2fr] p-2 gap-4">
// // //                 <div className="border border-black p-4 bg-white">
// // //                   <p className="text-[12px] font-semibold mb-2">TERMS OF SALE</p>
// // //                   <TermOfSale />
// // //                 </div>
// // //                 <TotalsBox />
// // //               </div>

// // //               {/* Footer */}
// // //               <div className="mt-auto">
// // //                 <p className="font-semibold text-xs text-center pb-3">
// // //                   We sincerely appreciate your business and look forward to serving you again.
// // //                 </p>
// // //                 <div className="grid grid-cols-2 gap-4 p-2">
// // //                   <BankBox />
// // //                   <PaymentTermsBox />
// // //                 </div>
// // //                 <p className="font-semibold text-center my-3 text-[11px]">
// // //                   This is a system generated Invoice. Hence, no stamp or signature required.
// // //                 </p>
// // //               </div>

// // //               <PageFooter page={totalPages} total={totalPages} />
// // //             </div>
// // //           </div>
// // //         </>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // export default InvoiceUsStatic;











// // // HorecaInvoice.tsx
// // // Usage: <HorecaInvoicePDF order={orderData} />
// // // Install: npm install @react-pdf/renderer

// // import React from "react";
// // import {
// //   Document,
// //   Page,
// //   Text,
// //   View,
// //   StyleSheet,
// //   Image,
// //   Font,
// //   pdf,
// // } from "@react-pdf/renderer";

// // // ─── Types ────────────────────────────────────────────────────────────────────

// // interface Currency {
// //   source_title: string;
// //   source_symbol: string;
// //   target_symbol: string;
// //   conversion_rate: number;
// // }

// // interface Customer {
// //   id: number;
// //   name: string;
// //   email: string;
// //   type: string;
// //   country_code: string;
// //   mobile_number: string;
// // }

// // interface Product {
// //   id: number;
// //   sku: string;
// //   name: { en: string };
// //   image_urls: { en: string[] };
// //   brand: { id: number; name: { en: string } };
// //   category: { id: number; name: { en: string } };
// //   selling_unit_attribute: { en: string };
// //   warranty_attribute: { en: string };
// // }

// // interface OrderProduct {
// //   id: number;
// //   product_id: number;
// //   quantity: number;
// //   unit_price: string;
// //   amount: string;
// //   shipping_charge: string;
// //   total_amount: string;
// //   status: string;
// //   expected_shipping_date: string;
// //   is_returnable: string;
// //   product: Product;
// // }

// // interface Payment {
// //   id: number;
// //   transaction_id: string;
// //   payment_method: string;
// //   amount: string;
// //   status: string;
// //   payment_details: {
// //     receipt_url?: string;
// //     created_at: string;
// //   };
// // }

// // interface OrderData {
// //   id: number;
// //   order_number: string;
// //   customer_address: string;
// //   shipping_charge: string;
// //   amount: string;
// //   tax_percentage: string;
// //   tax_amount: string;
// //   discount: string;
// //   additional_discount_amount: string;
// //   total_amount: string;
// //   is_paid: number;
// //   paid_amount: string;
// //   pending_amount: string;
// //   status: string;
// //   payment_mode: string;
// //   created_at: string;
// //   currency: Currency;
// //   customer: Customer;
// //   order_products: OrderProduct[];
// //   payments: Payment[];
// //   coupon_id: number | null;
// // }

// // // ─── HorecaStore Company Info ─────────────────────────────────────────────────

// // const COMPANY = {
// //   name: "THE HORECA STORE INC",
// //   address1: "8950 Glenhurst Street, Ste A",
// //   address2: "Houston, Texas, 77036 USA",
// //   phone: "+1 (888) 616-0111",
// //   email: "sales@thehorecastore.com",
// //   website: "www.thehorecastore.com",
// //   logoUrl: "https://thehorecastore.com/logo.png", // Replace with actual logo URL or base64
// // };

// // const BANK = {
// //   name: "THE HORECA STORE INC",
// //   bank: "THE HORECA STORE AT 5F & 1 INNOVATION TE",
// //   routing: "PCB-82-3",
// //   swift: "JP Morgan Chase Bank",
// //   account: "To Deposit of Cheque: In favor of The Horeca Store, Inc.",
// // };

// // // ─── Styles ───────────────────────────────────────────────────────────────────

// // const RED = "#E53935";
// // const DARK = "#1A1A2E";
// // const GRAY = "#6B7280";
// // const LIGHT_GRAY = "#F3F4F6";
// // const MID_GRAY = "#D1D5DB";
// // const WHITE = "#FFFFFF";
// // const GREEN = "#16A34A";

// // const styles = StyleSheet.create({
// //   page: {
// //     fontFamily: "Helvetica",
// //     fontSize: 8,
// //     color: DARK,
// //     backgroundColor: WHITE,
// //     paddingHorizontal: 32,
// //     paddingVertical: 28,
// //   },

// //   // ── Header ──
// //   header: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "flex-start",
// //     marginBottom: 16,
// //     paddingBottom: 12,
// //     borderBottomWidth: 2,
// //     borderBottomColor: RED,
// //   },
// //   logoBlock: {
// //     flexDirection: "column",
// //     gap: 2,
// //   },
// //   logoText: {
// //     fontSize: 22,
// //     fontFamily: "Helvetica-Bold",
// //     color: RED,
// //     letterSpacing: 1,
// //   },
// //   logoTagline: {
// //     fontSize: 7,
// //     color: GRAY,
// //     letterSpacing: 0.5,
// //   },
// //   companyInfo: {
// //     alignItems: "flex-end",
// //     gap: 2,
// //   },
// //   companyName: {
// //     fontSize: 9,
// //     fontFamily: "Helvetica-Bold",
// //     color: DARK,
// //   },
// //   companyDetail: {
// //     fontSize: 7,
// //     color: GRAY,
// //     textAlign: "right",
// //   },

// //   // ── Invoice Title Banner ──
// //   titleBanner: {
// //     backgroundColor: RED,
// //     paddingVertical: 6,
// //     paddingHorizontal: 12,
// //     marginBottom: 14,
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //   },
// //   titleText: {
// //     fontSize: 13,
// //     fontFamily: "Helvetica-Bold",
// //     color: WHITE,
// //     letterSpacing: 2,
// //   },
// //   titleSub: {
// //     fontSize: 7,
// //     color: "#FFCDD2",
// //     letterSpacing: 0.5,
// //   },

// //   // ── Invoice Meta Row ──
// //   metaRow: {
// //     flexDirection: "row",
// //     gap: 8,
// //     marginBottom: 14,
// //   },
// //   metaBox: {
// //     flex: 1,
// //     backgroundColor: LIGHT_GRAY,
// //     padding: 8,
// //     borderRadius: 3,
// //     borderLeftWidth: 3,
// //     borderLeftColor: RED,
// //   },
// //   metaLabel: {
// //     fontSize: 6,
// //     color: GRAY,
// //     fontFamily: "Helvetica-Bold",
// //     textTransform: "uppercase",
// //     letterSpacing: 0.5,
// //     marginBottom: 2,
// //   },
// //   metaValue: {
// //     fontSize: 8,
// //     fontFamily: "Helvetica-Bold",
// //     color: DARK,
// //   },

// //   // ── Bill To / Ship To ──
// //   addressSection: {
// //     flexDirection: "row",
// //     gap: 12,
// //     marginBottom: 14,
// //   },
// //   addressBlock: {
// //     flex: 1,
// //     padding: 10,
// //     borderWidth: 1,
// //     borderColor: MID_GRAY,
// //     borderRadius: 3,
// //   },
// //   addressTitle: {
// //     fontSize: 7,
// //     fontFamily: "Helvetica-Bold",
// //     color: RED,
// //     textTransform: "uppercase",
// //     letterSpacing: 1,
// //     marginBottom: 5,
// //     paddingBottom: 4,
// //     borderBottomWidth: 1,
// //     borderBottomColor: MID_GRAY,
// //   },
// //   addressName: {
// //     fontSize: 9,
// //     fontFamily: "Helvetica-Bold",
// //     color: DARK,
// //     marginBottom: 3,
// //   },
// //   addressLine: {
// //     fontSize: 7.5,
// //     color: GRAY,
// //     marginBottom: 1.5,
// //     lineHeight: 1.4,
// //   },

// //   // ── Products Table ──
// //   tableContainer: {
// //     marginBottom: 14,
// //   },
// //   tableHeader: {
// //     flexDirection: "row",
// //     backgroundColor: DARK,
// //     paddingVertical: 6,
// //     paddingHorizontal: 8,
// //     borderRadius: 3,
// //     marginBottom: 1,
// //   },
// //   tableRow: {
// //     flexDirection: "row",
// //     paddingVertical: 7,
// //     paddingHorizontal: 8,
// //     borderBottomWidth: 1,
// //     borderBottomColor: MID_GRAY,
// //     alignItems: "center",
// //   },
// //   tableRowAlt: {
// //     backgroundColor: "#FAFAFA",
// //   },
// //   thText: {
// //     fontSize: 7,
// //     fontFamily: "Helvetica-Bold",
// //     color: WHITE,
// //     textTransform: "uppercase",
// //     letterSpacing: 0.5,
// //   },
// //   tdText: {
// //     fontSize: 7.5,
// //     color: DARK,
// //   },
// //   tdGray: {
// //     fontSize: 6.5,
// //     color: GRAY,
// //     marginTop: 1,
// //   },
// //   colNo: { width: "4%" },
// //   colDesc: { width: "44%" },
// //   colSku: { width: "12%" },
// //   colQty: { width: "8%", textAlign: "center" },
// //   colUnit: { width: "13%", textAlign: "right" },
// //   colShip: { width: "9%", textAlign: "right" },
// //   colTotal: { width: "10%", textAlign: "right" },

// //   // ── Totals + Summary ──
// //   bottomSection: {
// //     flexDirection: "row",
// //     gap: 12,
// //     marginBottom: 14,
// //   },
// //   termsBox: {
// //     flex: 1.2,
// //     backgroundColor: LIGHT_GRAY,
// //     padding: 10,
// //     borderRadius: 3,
// //   },
// //   termsTitle: {
// //     fontSize: 7,
// //     fontFamily: "Helvetica-Bold",
// //     color: DARK,
// //     textTransform: "uppercase",
// //     letterSpacing: 0.5,
// //     marginBottom: 5,
// //     borderBottomWidth: 1,
// //     borderBottomColor: MID_GRAY,
// //     paddingBottom: 4,
// //   },
// //   termItem: {
// //     flexDirection: "row",
// //     marginBottom: 3,
// //     gap: 4,
// //   },
// //   termBullet: {
// //     fontSize: 7.5,
// //     color: RED,
// //     fontFamily: "Helvetica-Bold",
// //   },
// //   termText: {
// //     fontSize: 7,
// //     color: GRAY,
// //     flex: 1,
// //     lineHeight: 1.5,
// //   },
// //   totalsBox: {
// //     flex: 1,
// //     borderWidth: 1,
// //     borderColor: MID_GRAY,
// //     borderRadius: 3,
// //     overflow: "hidden",
// //   },
// //   totalsHeader: {
// //     backgroundColor: DARK,
// //     paddingVertical: 5,
// //     paddingHorizontal: 10,
// //   },
// //   totalsHeaderText: {
// //     fontSize: 7,
// //     fontFamily: "Helvetica-Bold",
// //     color: WHITE,
// //     textTransform: "uppercase",
// //     letterSpacing: 0.5,
// //     textAlign: "center",
// //   },
// //   totalsRow: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     paddingVertical: 4,
// //     paddingHorizontal: 10,
// //     borderBottomWidth: 1,
// //     borderBottomColor: MID_GRAY,
// //   },
// //   totalsLabel: {
// //     fontSize: 7.5,
// //     color: GRAY,
// //   },
// //   totalsValue: {
// //     fontSize: 7.5,
// //     color: DARK,
// //     fontFamily: "Helvetica-Bold",
// //   },
// //   totalsDiscount: {
// //     fontSize: 7.5,
// //     color: GREEN,
// //     fontFamily: "Helvetica-Bold",
// //   },
// //   totalsFinalRow: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     paddingVertical: 7,
// //     paddingHorizontal: 10,
// //     backgroundColor: RED,
// //   },
// //   totalsFinalLabel: {
// //     fontSize: 8,
// //     fontFamily: "Helvetica-Bold",
// //     color: WHITE,
// //   },
// //   totalsFinalValue: {
// //     fontSize: 10,
// //     fontFamily: "Helvetica-Bold",
// //     color: WHITE,
// //   },
// //   totalsInWords: {
// //     paddingVertical: 5,
// //     paddingHorizontal: 10,
// //     backgroundColor: "#FFF3F3",
// //     borderTopWidth: 1,
// //     borderTopColor: "#FFCDD2",
// //   },
// //   inWordsText: {
// //     fontSize: 6.5,
// //     color: RED,
// //     textAlign: "center",
// //     fontFamily: "Helvetica-Bold",
// //   },

// //   // ── Payment Info ──
// //   paymentSection: {
// //     flexDirection: "row",
// //     gap: 12,
// //     marginBottom: 14,
// //     padding: 10,
// //     backgroundColor: LIGHT_GRAY,
// //     borderRadius: 3,
// //     borderLeftWidth: 3,
// //     borderLeftColor: GREEN,
// //   },
// //   paymentBlock: {
// //     flex: 1,
// //   },
// //   paymentTitle: {
// //     fontSize: 7,
// //     fontFamily: "Helvetica-Bold",
// //     color: GREEN,
// //     textTransform: "uppercase",
// //     letterSpacing: 0.5,
// //     marginBottom: 5,
// //   },
// //   paymentRow: {
// //     flexDirection: "row",
// //     gap: 4,
// //     marginBottom: 2,
// //     alignItems: "center",
// //   },
// //   paymentLabel: {
// //     fontSize: 6.5,
// //     color: GRAY,
// //     width: 90,
// //   },
// //   paymentValue: {
// //     fontSize: 7,
// //     color: DARK,
// //     fontFamily: "Helvetica-Bold",
// //     flex: 1,
// //   },

// //   // ── Bank Details ──
// //   bankSection: {
// //     marginBottom: 14,
// //     borderWidth: 1,
// //     borderColor: MID_GRAY,
// //     borderRadius: 3,
// //     overflow: "hidden",
// //   },
// //   bankHeader: {
// //     backgroundColor: "#1A1A2E",
// //     paddingVertical: 5,
// //     paddingHorizontal: 10,
// //   },
// //   bankHeaderText: {
// //     fontSize: 7,
// //     fontFamily: "Helvetica-Bold",
// //     color: WHITE,
// //     textTransform: "uppercase",
// //     letterSpacing: 0.5,
// //   },
// //   bankRow: {
// //     flexDirection: "row",
// //     paddingVertical: 4,
// //     paddingHorizontal: 10,
// //     borderBottomWidth: 1,
// //     borderBottomColor: MID_GRAY,
// //     alignItems: "center",
// //   },
// //   bankLabel: {
// //     fontSize: 7,
// //     color: GRAY,
// //     width: 120,
// //     fontFamily: "Helvetica-Bold",
// //   },
// //   bankValue: {
// //     fontSize: 7,
// //     color: DARK,
// //     flex: 1,
// //   },

// //   // ── Footer ──
// //   footer: {
// //     borderTopWidth: 2,
// //     borderTopColor: RED,
// //     paddingTop: 8,
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //   },
// //   footerLeft: {
// //     flex: 1,
// //   },
// //   footerThank: {
// //     fontSize: 8,
// //     fontFamily: "Helvetica-Bold",
// //     color: DARK,
// //     marginBottom: 2,
// //   },
// //   footerSub: {
// //     fontSize: 6.5,
// //     color: GRAY,
// //   },
// //   footerRight: {
// //     alignItems: "flex-end",
// //   },
// //   footerBrand: {
// //     fontSize: 14,
// //     fontFamily: "Helvetica-Bold",
// //     color: RED,
// //     letterSpacing: 1,
// //   },
// //   footerPage: {
// //     fontSize: 6.5,
// //     color: GRAY,
// //     marginTop: 2,
// //   },

// //   // ── Status Badge ──
// //   badge: {
// //     paddingHorizontal: 6,
// //     paddingVertical: 2,
// //     borderRadius: 10,
// //   },
// //   badgePaid: { backgroundColor: "#DCFCE7" },
// //   badgePending: { backgroundColor: "#FEF9C3" },
// //   badgeText: {
// //     fontSize: 6.5,
// //     fontFamily: "Helvetica-Bold",
// //   },
// //   badgePaidText: { color: GREEN },
// //   badgePendingText: { color: "#CA8A04" },
// // });

// // // ─── Helpers ──────────────────────────────────────────────────────────────────

// // function fmt(amount: string | number, symbol = "$") {
// //   const num = typeof amount === "string" ? parseFloat(amount) : amount;
// //   return `${symbol}${num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
// // }

// // function fmtDate(iso: string) {
// //   const d = new Date(iso);
// //   return d.toLocaleDateString("en-US", {
// //     year: "numeric",
// //     month: "long",
// //     day: "numeric",
// //   });
// // }

// // function numberToWords(amount: number): string {
// //   const ones = [
// //     "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight",
// //     "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
// //     "Sixteen", "Seventeen", "Eighteen", "Nineteen",
// //   ];
// //   const tens = [
// //     "", "", "Twenty", "Thirty", "Forty", "Fifty",
// //     "Sixty", "Seventy", "Eighty", "Ninety",
// //   ];
// //   const dollars = Math.floor(amount);
// //   const cents = Math.round((amount - dollars) * 100);
// //   const toWords = (n: number): string => {
// //     if (n === 0) return "";
// //     if (n < 20) return ones[n] + " ";
// //     if (n < 100) return tens[Math.floor(n / 10)] + " " + ones[n % 10] + " ";
// //     return ones[Math.floor(n / 100)] + " Hundred " + toWords(n % 100);
// //   };
// //   const dolWords = toWords(dollars).trim() || "Zero";
// //   const centsStr = cents > 0 ? ` and ${cents}/100` : " and 00/100";
// //   return dolWords + centsStr + " US Dollars";
// // }

// // // ─── Invoice Component ────────────────────────────────────────────────────────

// // interface HorecaInvoicePDFProps {
// //   order: OrderData;
// // }

// // const HorecaInvoicePDF: React.FC<HorecaInvoicePDFProps> = ({ order }) => {
// //   const sym = order.currency.target_symbol || "$";
// //   const subtotal = parseFloat(order.amount);
// //   const discount = parseFloat(order.discount) || 0;
// //   const additionalDiscount = parseFloat(order.additional_discount_amount) || 0;
// //   const shipping = parseFloat(order.shipping_charge) || 0;
// //   const tax = parseFloat(order.tax_amount) || 0;
// //   const total = parseFloat(order.total_amount);
// //   const isPaid = order.is_paid === 1;
// //   const payment = order.payments?.[0];

// //   const addressLines = order.customer_address
// //     .replace(/\\n/g, "\n")
// //     .split("\n")
// //     .filter(Boolean);

// //   return (
// //     <Document
// //       title={`Invoice #${order.order_number} - HorecaStore`}
// //       author="The HorecaStore Inc"
// //       subject="Sales Invoice"
// //     >
// //       <Page size="A4" style={styles.page}>

// //         {/* ── HEADER ── */}
// //         <View style={styles.header}>
// //           <View style={styles.logoBlock}>
// //             <Text style={styles.logoText}>HORECA</Text>
// //             <Text style={styles.logoTagline}>Save Money, Simplify Procurement</Text>
// //           </View>
// //           <View style={styles.companyInfo}>
// //             <Text style={styles.companyName}>{COMPANY.name}</Text>
// //             <Text style={styles.companyDetail}>{COMPANY.address1}</Text>
// //             <Text style={styles.companyDetail}>{COMPANY.address2}</Text>
// //             <Text style={styles.companyDetail}>{COMPANY.phone}</Text>
// //             <Text style={styles.companyDetail}>{COMPANY.email}</Text>
// //             <Text style={styles.companyDetail}>{COMPANY.website}</Text>
// //           </View>
// //         </View>

// //         {/* ── TITLE BANNER ── */}
// //         <View style={styles.titleBanner}>
// //           <Text style={styles.titleText}>SALES INVOICE</Text>
// //           <Text style={styles.titleSub}>Save Money, Simplify Procurement</Text>
// //         </View>

// //         {/* ── META ROW ── */}
// //         <View style={styles.metaRow}>
// //           <View style={styles.metaBox}>
// //             <Text style={styles.metaLabel}>Invoice No.</Text>
// //             <Text style={styles.metaValue}>#{order.order_number}</Text>
// //           </View>
// //           <View style={styles.metaBox}>
// //             <Text style={styles.metaLabel}>Invoice Date</Text>
// //             <Text style={styles.metaValue}>{fmtDate(order.created_at)}</Text>
// //           </View>
// //           <View style={styles.metaBox}>
// //             <Text style={styles.metaLabel}>Payment Mode</Text>
// //             <Text style={styles.metaValue}>{order.payment_mode}</Text>
// //           </View>
// //           <View style={styles.metaBox}>
// //             <Text style={styles.metaLabel}>Payment Status</Text>
// //             <View style={[styles.badge, isPaid ? styles.badgePaid : styles.badgePending]}>
// //               <Text style={[styles.badgeText, isPaid ? styles.badgePaidText : styles.badgePendingText]}>
// //                 {isPaid ? "PAID" : "PENDING"}
// //               </Text>
// //             </View>
// //           </View>
// //           <View style={styles.metaBox}>
// //             <Text style={styles.metaLabel}>Order Status</Text>
// //             <Text style={styles.metaValue}>{order.status}</Text>
// //           </View>
// //           <View style={styles.metaBox}>
// //             <Text style={styles.metaLabel}>Currency</Text>
// //             <Text style={styles.metaValue}>{order.currency.source_title}</Text>
// //           </View>
// //         </View>

// //         {/* ── BILL TO / SHIP TO ── */}
// //         <View style={styles.addressSection}>
// //           <View style={styles.addressBlock}>
// //             <Text style={styles.addressTitle}>Bill To</Text>
// //             <Text style={styles.addressName}>{order.customer.name}</Text>
// //             {addressLines.map((line, i) => (
// //               <Text key={i} style={styles.addressLine}>{line}</Text>
// //             ))}
// //             <Text style={styles.addressLine}>
// //               Attention To: {order.customer.name}{"   "}Telephone: {order.customer.country_code} {order.customer.mobile_number}
// //             </Text>
// //             <Text style={styles.addressLine}>Email: {order.customer.email}</Text>
// //           </View>
// //           <View style={styles.addressBlock}>
// //             <Text style={styles.addressTitle}>Ship To</Text>
// //             <Text style={styles.addressName}>{order.customer.name}</Text>
// //             {addressLines.map((line, i) => (
// //               <Text key={i} style={styles.addressLine}>{line}</Text>
// //             ))}
// //             <Text style={styles.addressLine}>Customer Type: {order.customer.type}</Text>
// //             {payment && (
// //               <Text style={styles.addressLine}>
// //                 Transaction ID: {payment.transaction_id}
// //               </Text>
// //             )}
// //           </View>
// //         </View>

// //         {/* ── PRODUCTS TABLE ── */}
// //         <View style={styles.tableContainer}>
// //           {/* Table Header */}
// //           <View style={styles.tableHeader}>
// //             <Text style={[styles.thText, styles.colNo]}>#</Text>
// //             <Text style={[styles.thText, styles.colDesc]}>Description</Text>
// //             <Text style={[styles.thText, styles.colSku]}>SKU</Text>
// //             <Text style={[styles.thText, { ...styles.colQty, textAlign: "center" }]}>Qty</Text>
// //             <Text style={[styles.thText, { ...styles.colUnit, textAlign: "right" }]}>Unit Price</Text>
// //             <Text style={[styles.thText, { ...styles.colShip, textAlign: "right" }]}>Freight</Text>
// //             <Text style={[styles.thText, { ...styles.colTotal, textAlign: "right" }]}>Total</Text>
// //           </View>

// //           {/* Table Rows */}
// //           {order.order_products.map((item, idx) => (
// //             <View
// //               key={item.id}
// //               style={[styles.tableRow, idx % 2 === 1 ? styles.tableRowAlt : {}]}
// //             >
// //               <Text style={[styles.tdText, styles.colNo]}>{idx + 1}</Text>
// //               <View style={styles.colDesc}>
// //                 <Text style={styles.tdText}>{item.product.name.en}</Text>
// //                 <Text style={styles.tdGray}>
// //                   Brand: {item.product.brand.name.en}{"  |  "}
// //                   {item.product.category.most_parent_name?.en} › {item.product.category.name.en}
// //                 </Text>
// //                 <Text style={styles.tdGray}>
// //                   Ships: {item.expected_shipping_date}{"  "}
// //                   {item.is_returnable === "yes" ? "• Returnable" : ""}
// //                 </Text>
// //               </View>
// //               <Text style={[styles.tdText, styles.colSku]}>{item.product.sku}</Text>
// //               <Text style={[styles.tdText, { ...styles.colQty, textAlign: "center" }]}>
// //                 {item.quantity}
// //               </Text>
// //               <Text style={[styles.tdText, { ...styles.colUnit, textAlign: "right" }]}>
// //                 {fmt(item.unit_price, sym)}
// //               </Text>
// //               <Text style={[styles.tdText, { ...styles.colShip, textAlign: "right" }]}>
// //                 {parseFloat(item.shipping_charge) > 0 ? fmt(item.shipping_charge, sym) : "—"}
// //               </Text>
// //               <Text style={[styles.tdText, { ...styles.colTotal, textAlign: "right" }]}>
// //                 {fmt(item.total_amount, sym)}
// //               </Text>
// //             </View>
// //           ))}
// //         </View>

// //         {/* ── TERMS + TOTALS ── */}
// //         <View style={styles.bottomSection}>
// //           {/* Terms */}
// //           <View style={styles.termsBox}>
// //             <Text style={styles.termsTitle}>Terms of Sale</Text>
// //             {[
// //               "Kindly include our Order Number when processing this payment through bank transfer.",
// //               "Lead times are subject to manufacturer's schedule at the date of purchase with valid PO or Advance Payment.",
// //               "Lead times are based on business days and begin upon receipt of payment, unless otherwise agreed, and may be subject to change.",
// //               "Once items are available, delivery to customer is 1-5 business days depending on location.",
// //               "If delivery is delayed by the customer, storage charges may apply and invoiced per reasonable and necessary criteria.",
// //             ].map((t, i) => (
// //               <View key={i} style={styles.termItem}>
// //                 <Text style={styles.termBullet}>•</Text>
// //                 <Text style={styles.termText}>{t}</Text>
// //               </View>
// //             ))}
// //           </View>

// //           {/* Totals */}
// //           <View style={styles.totalsBox}>
// //             <View style={styles.totalsHeader}>
// //               <Text style={styles.totalsHeaderText}>Invoice Summary</Text>
// //             </View>
// //             <View style={styles.totalsRow}>
// //               <Text style={styles.totalsLabel}>Invoice Subtotal</Text>
// //               <Text style={styles.totalsValue}>{fmt(subtotal, sym)}</Text>
// //             </View>
// //             {discount > 0 && (
// //               <View style={styles.totalsRow}>
// //                 <Text style={styles.totalsLabel}>Coupon Discount</Text>
// //                 <Text style={styles.totalsDiscount}>-{fmt(discount, sym)}</Text>
// //               </View>
// //             )}
// //             <View style={styles.totalsRow}>
// //               <Text style={styles.totalsLabel}>Subtotal After Coupon</Text>
// //               <Text style={styles.totalsValue}>{fmt(subtotal - discount, sym)}</Text>
// //             </View>
// //             {additionalDiscount > 0 && (
// //               <View style={styles.totalsRow}>
// //                 <Text style={styles.totalsLabel}>Additional Discount</Text>
// //                 <Text style={styles.totalsDiscount}>-{fmt(additionalDiscount, sym)}</Text>
// //               </View>
// //             )}
// //             <View style={styles.totalsRow}>
// //               <Text style={styles.totalsLabel}>Subtotal After Discounts</Text>
// //               <Text style={styles.totalsValue}>{fmt(subtotal - discount - additionalDiscount, sym)}</Text>
// //             </View>
// //             <View style={styles.totalsRow}>
// //               <Text style={styles.totalsLabel}>Shipping</Text>
// //               <Text style={styles.totalsValue}>{fmt(shipping, sym)}</Text>
// //             </View>
// //             <View style={styles.totalsRow}>
// //               <Text style={styles.totalsLabel}>
// //                 Sales Tax ({parseFloat(order.tax_percentage).toFixed(2)}%)
// //               </Text>
// //               <Text style={styles.totalsValue}>{fmt(tax, sym)}</Text>
// //             </View>
// //             <View style={styles.totalsFinalRow}>
// //               <Text style={styles.totalsFinalLabel}>NET TOTAL INCL. SALES TAX</Text>
// //               <Text style={styles.totalsFinalValue}>{fmt(total, sym)}</Text>
// //             </View>
// //             <View style={styles.totalsInWords}>
// //               <Text style={styles.inWordsText}>{numberToWords(total)}</Text>
// //             </View>
// //           </View>
// //         </View>

// //         {/* ── PAYMENT INFO ── */}
// //         {payment && (
// //           <View style={styles.paymentSection}>
// //             <View style={styles.paymentBlock}>
// //               <Text style={styles.paymentTitle}>✓ Payment Confirmed</Text>
// //               <View style={styles.paymentRow}>
// //                 <Text style={styles.paymentLabel}>Transaction ID:</Text>
// //                 <Text style={styles.paymentValue}>{payment.transaction_id}</Text>
// //               </View>
// //               <View style={styles.paymentRow}>
// //                 <Text style={styles.paymentLabel}>Payment Method:</Text>
// //                 <Text style={styles.paymentValue}>{payment.payment_method}</Text>
// //               </View>
// //               <View style={styles.paymentRow}>
// //                 <Text style={styles.paymentLabel}>Amount Paid:</Text>
// //                 <Text style={styles.paymentValue}>{fmt(payment.amount, sym)}</Text>
// //               </View>
// //             </View>
// //             <View style={styles.paymentBlock}>
// //               <Text style={styles.paymentTitle}>Customer Payment Terms & Processing Timeline</Text>
// //               <Text style={[styles.termText, { lineHeight: 1.6 }]}>
// //                 <Text style={{ fontFamily: "Helvetica-Bold", color: DARK }}>Stock Items:</Text>
// //                 {" "}Orders are processed within 2 business days from payment receipt.{"\n"}
// //                 <Text style={{ fontFamily: "Helvetica-Bold", color: DARK }}>Made-to-Order:</Text>
// //                 {" "}Production begins within 2 business days after payment clearance.{"\n"}
// //                 <Text style={{ fontFamily: "Helvetica-Bold", color: DARK }}>Corporate Clients:</Text>
// //                 {" "}Orders are processed within 2 business days from PO acceptance.{"\n"}
// //                 <Text style={{ fontFamily: "Helvetica-Bold", color: DARK }}>Confirmation:</Text>
// //                 {" "}Orders are confirmed only after payment clearance and risk verification.
// //               </Text>
// //             </View>
// //           </View>
// //         )}

// //         {/* ── BANK DETAILS ── */}
// //         <View style={styles.bankSection}>
// //           <View style={styles.bankHeader}>
// //             <Text style={styles.bankHeaderText}>Bank Details — Wire Transfer Information</Text>
// //           </View>
// //           {[
// //             ["Account Name", BANK.name],
// //             ["Bank", BANK.bank],
// //             ["Routing / ABA", BANK.routing],
// //             ["SWIFT / Bank", BANK.swift],
// //             ["Cheque Instructions", BANK.account],
// //           ].map(([label, value], i) => (
// //             <View key={i} style={styles.bankRow}>
// //               <Text style={styles.bankLabel}>{label}</Text>
// //               <Text style={styles.bankValue}>{value}</Text>
// //             </View>
// //           ))}
// //         </View>

// //         {/* ── FOOTER ── */}
// //         <View style={styles.footer}>
// //           <View style={styles.footerLeft}>
// //             <Text style={styles.footerThank}>
// //               We sincerely appreciate your business and look forward to serving you again.
// //             </Text>
// //             <Text style={styles.footerSub}>
// //               For any queries, contact us at {COMPANY.email} | {COMPANY.phone}
// //             </Text>
// //           </View>
// //           <View style={styles.footerRight}>
// //             <Text style={styles.footerBrand}>HORECA</Text>
// //             <Text style={styles.footerPage}>Invoice #{order.order_number}</Text>
// //           </View>
// //         </View>

// //       </Page>
// //     </Document>
// //   );
// // };

// // export default HorecaInvoicePDF;

// // // ─── Usage Example ────────────────────────────────────────────────────────────
// // //
// // // import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
// // // import HorecaInvoicePDF from "./HorecaInvoice";
// // //
// // // // Browser Preview:
// // // <PDFViewer width="100%" height={800}>
// // //   <HorecaInvoicePDF order={orderData} />
// // // </PDFViewer>
// // //
// // // // Download Button:
// // // <PDFDownloadLink
// // //   document={<HorecaInvoicePDF order={orderData} />}
// // //   fileName={`invoice-${orderData.order_number}.pdf`}
// // // >
// // //   {({ loading }) => loading ? "Generating..." : "Download Invoice"}
// // // </PDFDownloadLink>
// // //
// // // // Server-side / API route (Next.js):
// // // const pdfBuffer = await pdf(<HorecaInvoicePDF order={orderData} />).toBuffer();
// // // res.setHeader("Content-Type", "application/pdf");
// // // res.send(pdfBuffer);











// // HorecaInvoice.tsx
// // Usage: <HorecaInvoicePDF order={orderData} />
// // Install: npm install @react-pdf/renderer

// import React from "react";
// import {
//   Document,
//   Page,
//   Text,
//   View,
//   StyleSheet,
//   Image,
//   Font,
//   pdf,
// } from "@react-pdf/renderer";

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface Currency {
//   source_title: string;
//   source_symbol: string;
//   target_symbol: string;
//   conversion_rate: number;
// }

// interface Customer {
//   id: number;
//   name: string;
//   email: string;
//   type: string;
//   country_code: string;
//   mobile_number: string;
// }

// interface Product {
//   id: number;
//   sku: string;
//   name: { en: string };
//   image_urls: { en: string[] };
//   brand: { id: number; name: { en: string } };
//   category: { id: number; name: { en: string } };
//   selling_unit_attribute: { en: string };
//   warranty_attribute: { en: string };
// }

// interface OrderProduct {
//   id: number;
//   product_id: number;
//   quantity: number;
//   unit_price: string;
//   amount: string;
//   shipping_charge: string;
//   total_amount: string;
//   status: string;
//   expected_shipping_date: string;
//   is_returnable: string;
//   product: Product;
// }

// interface Payment {
//   id: number;
//   transaction_id: string;
//   payment_method: string;
//   amount: string;
//   status: string;
//   payment_details: {
//     receipt_url?: string;
//     created_at: string;
//   };
// }

// interface OrderData {
//   id: number;
//   order_number: string;
//   customer_address: string;
//   shipping_charge: string;
//   amount: string;
//   tax_percentage: string;
//   tax_amount: string;
//   discount: string;
//   additional_discount_amount: string;
//   total_amount: string;
//   is_paid: number;
//   paid_amount: string;
//   pending_amount: string;
//   status: string;
//   payment_mode: string;
//   created_at: string;
//   currency: Currency;
//   customer: Customer;
//   order_products: OrderProduct[];
//   payments: Payment[];
//   coupon_id: number | null;
// }

// // ─── HorecaStore Company Info ─────────────────────────────────────────────────

// const COMPANY = {
//   name: "THE HORECA STORE INC.",
//   address1: "8800 Bissonnet Street, Ste A,",
//   address2: "Houston, Texas 77074",
//   phone: "1 (866) 446-7322",
//   email: "sales@thehorecastore.com",
//   website: "www.thehorecastore.com",
//   logoUrl: "https://thehorecastore.com/logo.png",
// };

// const BANK = {
//   accountName: "THE HORECA STORE INC",
//   beneficiaryAddress: "8800 BISSONNET ST STE A, HOUSTON TX 77074-2435",
//   accountNo: "6130 9953 3",
//   bank: "JP Morgan Chase Bank",
//   routingCode: "1110 0061 4",
//   cheque: "Please prepare all cheques in favor of THE HORECA STORE INC",
// };

// // ─── Styles ───────────────────────────────────────────────────────────────────

// const RED = "#E53935";
// const DARK = "#1A1A2E";
// const GRAY = "#6B7280";
// const LIGHT_GRAY = "#F3F4F6";
// const MID_GRAY = "#D1D5DB";
// const WHITE = "#FFFFFF";
// const GREEN = "#16A34A";

// const styles = StyleSheet.create({
//   page: {
//     fontFamily: "Helvetica",
//     fontSize: 8,
//     color: DARK,
//     backgroundColor: WHITE,
//     paddingHorizontal: 32,
//     paddingVertical: 28,
//   },

//   // ── Header ──
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     marginBottom: 16,
//     paddingBottom: 12,
//     borderBottomWidth: 2,
//     borderBottomColor: RED,
//   },
//   logoBlock: {
//     flexDirection: "column",
//     gap: 2,
//   },
//   logoText: {
//     fontSize: 22,
//     fontFamily: "Helvetica-Bold",
//     color: RED,
//     letterSpacing: 1,
//   },
//   logoTagline: {
//     fontSize: 7,
//     color: GRAY,
//     letterSpacing: 0.5,
//   },
//   companyInfo: {
//     alignItems: "flex-end",
//     gap: 2,
//   },
//   companyName: {
//     fontSize: 9,
//     fontFamily: "Helvetica-Bold",
//     color: DARK,
//   },
//   companyDetail: {
//     fontSize: 7,
//     color: GRAY,
//     textAlign: "right",
//   },

//   // ── Invoice Title Banner ──
//   titleBanner: {
//     backgroundColor: RED,
//     paddingVertical: 6,
//     paddingHorizontal: 12,
//     marginBottom: 14,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   titleText: {
//     fontSize: 13,
//     fontFamily: "Helvetica-Bold",
//     color: WHITE,
//     letterSpacing: 2,
//   },
//   titleSub: {
//     fontSize: 7,
//     color: "#FFCDD2",
//     letterSpacing: 0.5,
//   },

//   // ── Invoice Meta Row ──
//   metaRow: {
//     flexDirection: "row",
//     gap: 8,
//     marginBottom: 14,
//   },
//   metaBox: {
//     flex: 1,
//     backgroundColor: LIGHT_GRAY,
//     padding: 8,
//     borderRadius: 3,
//     borderLeftWidth: 3,
//     borderLeftColor: RED,
//   },
//   metaLabel: {
//     fontSize: 6,
//     color: GRAY,
//     fontFamily: "Helvetica-Bold",
//     textTransform: "uppercase",
//     letterSpacing: 0.5,
//     marginBottom: 2,
//   },
//   metaValue: {
//     fontSize: 8,
//     fontFamily: "Helvetica-Bold",
//     color: DARK,
//   },

//   // ── Bill To / Ship To ──
//   addressSection: {
//     flexDirection: "row",
//     gap: 12,
//     marginBottom: 14,
//   },
//   addressBlock: {
//     flex: 1,
//     padding: 10,
//     borderWidth: 1,
//     borderColor: MID_GRAY,
//     borderRadius: 3,
//   },
//   addressTitle: {
//     fontSize: 7,
//     fontFamily: "Helvetica-Bold",
//     color: RED,
//     textTransform: "uppercase",
//     letterSpacing: 1,
//     marginBottom: 5,
//     paddingBottom: 4,
//     borderBottomWidth: 1,
//     borderBottomColor: MID_GRAY,
//   },
//   addressName: {
//     fontSize: 9,
//     fontFamily: "Helvetica-Bold",
//     color: DARK,
//     marginBottom: 3,
//   },
//   addressLine: {
//     fontSize: 7.5,
//     color: GRAY,
//     marginBottom: 1.5,
//     lineHeight: 1.4,
//   },

//   // ── Products Table ──
//   tableContainer: {
//     marginBottom: 14,
//   },
//   tableHeader: {
//     flexDirection: "row",
//     backgroundColor: DARK,
//     paddingVertical: 6,
//     paddingHorizontal: 8,
//     borderRadius: 3,
//     marginBottom: 1,
//   },
//   tableRow: {
//     flexDirection: "row",
//     paddingVertical: 7,
//     paddingHorizontal: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: MID_GRAY,
//     alignItems: "center",
//   },
//   tableRowAlt: {
//     backgroundColor: "#FAFAFA",
//   },
//   thText: {
//     fontSize: 7,
//     fontFamily: "Helvetica-Bold",
//     color: WHITE,
//     textTransform: "uppercase",
//     letterSpacing: 0.5,
//   },
//   tdText: {
//     fontSize: 7.5,
//     color: DARK,
//   },
//   tdGray: {
//     fontSize: 6.5,
//     color: GRAY,
//     marginTop: 1,
//   },
//   colNo: { width: "4%" },
//   colDesc: { width: "44%" },
//   colSku: { width: "12%" },
//   colQty: { width: "8%", textAlign: "center" },
//   colUnit: { width: "13%", textAlign: "right" },
//   colShip: { width: "9%", textAlign: "right" },
//   colTotal: { width: "10%", textAlign: "right" },

//   // ── Totals + Summary ──
//   bottomSection: {
//     flexDirection: "row",
//     gap: 12,
//     marginBottom: 14,
//   },
//   termsBox: {
//     flex: 1.2,
//     backgroundColor: LIGHT_GRAY,
//     padding: 10,
//     borderRadius: 3,
//   },
//   termsTitle: {
//     fontSize: 7,
//     fontFamily: "Helvetica-Bold",
//     color: DARK,
//     textTransform: "uppercase",
//     letterSpacing: 0.5,
//     marginBottom: 5,
//     borderBottomWidth: 1,
//     borderBottomColor: MID_GRAY,
//     paddingBottom: 4,
//   },
//   termItem: {
//     flexDirection: "row",
//     marginBottom: 3,
//     gap: 4,
//   },
//   termBullet: {
//     fontSize: 7.5,
//     color: RED,
//     fontFamily: "Helvetica-Bold",
//   },
//   termText: {
//     fontSize: 7,
//     color: GRAY,
//     flex: 1,
//     lineHeight: 1.5,
//   },
//   totalsBox: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: MID_GRAY,
//     borderRadius: 3,
//     overflow: "hidden",
//   },
//   totalsHeader: {
//     backgroundColor: DARK,
//     paddingVertical: 5,
//     paddingHorizontal: 10,
//   },
//   totalsHeaderText: {
//     fontSize: 7,
//     fontFamily: "Helvetica-Bold",
//     color: WHITE,
//     textTransform: "uppercase",
//     letterSpacing: 0.5,
//     textAlign: "center",
//   },
//   totalsRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingVertical: 4,
//     paddingHorizontal: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: MID_GRAY,
//   },
//   totalsLabel: {
//     fontSize: 7.5,
//     color: GRAY,
//   },
//   totalsValue: {
//     fontSize: 7.5,
//     color: DARK,
//     fontFamily: "Helvetica-Bold",
//   },
//   totalsDiscount: {
//     fontSize: 7.5,
//     color: GREEN,
//     fontFamily: "Helvetica-Bold",
//   },
//   totalsFinalRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     paddingVertical: 7,
//     paddingHorizontal: 10,
//     backgroundColor: RED,
//   },
//   totalsFinalLabel: {
//     fontSize: 8,
//     fontFamily: "Helvetica-Bold",
//     color: WHITE,
//   },
//   totalsFinalValue: {
//     fontSize: 10,
//     fontFamily: "Helvetica-Bold",
//     color: WHITE,
//   },
//   totalsInWords: {
//     paddingVertical: 5,
//     paddingHorizontal: 10,
//     backgroundColor: "#FFF3F3",
//     borderTopWidth: 1,
//     borderTopColor: "#FFCDD2",
//   },
//   inWordsText: {
//     fontSize: 6.5,
//     color: RED,
//     textAlign: "center",
//     fontFamily: "Helvetica-Bold",
//   },

//   // ── Payment Info ──
//   paymentSection: {
//     flexDirection: "row",
//     gap: 12,
//     marginBottom: 14,
//     padding: 10,
//     backgroundColor: LIGHT_GRAY,
//     borderRadius: 3,
//     borderLeftWidth: 3,
//     borderLeftColor: GREEN,
//   },
//   paymentBlock: {
//     flex: 1,
//   },
//   paymentTitle: {
//     fontSize: 7,
//     fontFamily: "Helvetica-Bold",
//     color: GREEN,
//     textTransform: "uppercase",
//     letterSpacing: 0.5,
//     marginBottom: 5,
//   },
//   paymentRow: {
//     flexDirection: "row",
//     gap: 4,
//     marginBottom: 2,
//     alignItems: "center",
//   },
//   paymentLabel: {
//     fontSize: 6.5,
//     color: GRAY,
//     width: 90,
//   },
//   paymentValue: {
//     fontSize: 7,
//     color: DARK,
//     fontFamily: "Helvetica-Bold",
//     flex: 1,
//   },

//   // ── Bank Details ──
//   bankSection: {
//     marginBottom: 14,
//     borderWidth: 1,
//     borderColor: MID_GRAY,
//     borderRadius: 3,
//     overflow: "hidden",
//   },
//   bankHeader: {
//     backgroundColor: "#1A1A2E",
//     paddingVertical: 5,
//     paddingHorizontal: 10,
//   },
//   bankHeaderText: {
//     fontSize: 7,
//     fontFamily: "Helvetica-Bold",
//     color: WHITE,
//     textTransform: "uppercase",
//     letterSpacing: 0.5,
//   },
//   bankRow: {
//     flexDirection: "row",
//     paddingVertical: 4,
//     paddingHorizontal: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: MID_GRAY,
//     alignItems: "center",
//   },
//   bankLabel: {
//     fontSize: 7,
//     color: GRAY,
//     width: 140,
//     fontFamily: "Helvetica-Bold",
//   },
//   bankValue: {
//     fontSize: 7,
//     color: DARK,
//     flex: 1,
//   },

//   // ── Footer ──
//   footer: {
//     borderTopWidth: 2,
//     borderTopColor: RED,
//     paddingTop: 8,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   footerLeft: {
//     flex: 1,
//   },
//   footerThank: {
//     fontSize: 8,
//     fontFamily: "Helvetica-Bold",
//     color: DARK,
//     marginBottom: 2,
//   },
//   footerSub: {
//     fontSize: 6.5,
//     color: GRAY,
//   },
//   footerRight: {
//     alignItems: "flex-end",
//   },
//   footerBrand: {
//     fontSize: 14,
//     fontFamily: "Helvetica-Bold",
//     color: RED,
//     letterSpacing: 1,
//   },
//   footerPage: {
//     fontSize: 6.5,
//     color: GRAY,
//     marginTop: 2,
//   },

//   // ── Status Badge ──
//   badge: {
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: 10,
//   },
//   badgePaid: { backgroundColor: "#DCFCE7" },
//   badgePending: { backgroundColor: "#FEF9C3" },
//   badgeText: {
//     fontSize: 6.5,
//     fontFamily: "Helvetica-Bold",
//   },
//   badgePaidText: { color: GREEN },
//   badgePendingText: { color: "#CA8A04" },
// });

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// function fmt(amount: string | number, symbol = "$") {
//   const num = typeof amount === "string" ? parseFloat(amount) : amount;
//   return `${symbol}${num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
// }

// function fmtDate(iso: string) {
//   const d = new Date(iso);
//   return d.toLocaleDateString("en-US", {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   });
// }

// function numberToWords(amount: number): string {
//   const ones = [
//     "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight",
//     "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
//     "Sixteen", "Seventeen", "Eighteen", "Nineteen",
//   ];
//   const tens = [
//     "", "", "Twenty", "Thirty", "Forty", "Fifty",
//     "Sixty", "Seventy", "Eighty", "Ninety",
//   ];
//   const dollars = Math.floor(amount);
//   const cents = Math.round((amount - dollars) * 100);
//   const toWords = (n: number): string => {
//     if (n === 0) return "";
//     if (n < 20) return ones[n] + " ";
//     if (n < 100) return tens[Math.floor(n / 10)] + " " + ones[n % 10] + " ";
//     return ones[Math.floor(n / 100)] + " Hundred " + toWords(n % 100);
//   };
//   const dolWords = toWords(dollars).trim() || "Zero";
//   const centsStr = cents > 0 ? ` and ${cents}/100` : " and 00/100";
//   return dolWords + centsStr + " US Dollars";
// }

// // ─── Invoice Component ────────────────────────────────────────────────────────

// interface HorecaInvoicePDFProps {
//   order: OrderData;
// }

// const HorecaInvoicePDF: React.FC<HorecaInvoicePDFProps> = ({ order }) => {
//   const sym = order.currency.target_symbol || "$";
//   const subtotal = parseFloat(order.amount);
//   const discount = parseFloat(order.discount) || 0;
//   const additionalDiscount = parseFloat(order.additional_discount_amount) || 0;
//   const shipping = parseFloat(order.shipping_charge) || 0;
//   const tax = parseFloat(order.tax_amount) || 0;
//   const total = parseFloat(order.total_amount);
//   const isPaid = order.is_paid === 1;
//   const payment = order.payments?.[0];

//   const addressLines = order.customer_address
//     .replace(/\\n/g, "\n")
//     .split("\n")
//     .filter(Boolean);

//   return (
//     <Document
//       title={`Invoice #${order.order_number} - HorecaStore`}
//       author="The HorecaStore Inc"
//       subject="Sales Invoice"
//     >
//       <Page size="A4" style={styles.page}>

//         {/* ── HEADER ── */}
//         <View style={styles.header}>
//           <View style={styles.logoBlock}>
//             <Text style={styles.logoText}>HORECA</Text>
//             <Text style={styles.logoTagline}>Save Money, Simplify Procurement</Text>
//           </View>
//           <View style={styles.companyInfo}>
//             <Text style={styles.companyName}>{COMPANY.name}</Text>
//             <Text style={styles.companyDetail}>{COMPANY.address1}</Text>
//             <Text style={styles.companyDetail}>{COMPANY.address2}</Text>
//             <Text style={styles.companyDetail}>{COMPANY.phone}</Text>
//             <Text style={styles.companyDetail}>{COMPANY.email}</Text>
//             <Text style={styles.companyDetail}>{COMPANY.website}</Text>
//           </View>
//         </View>

//         {/* ── TITLE BANNER ── */}
//         <View style={styles.titleBanner}>
//           <Text style={styles.titleText}>SALES INVOICE</Text>
//           <Text style={styles.titleSub}>Save Money, Simplify Procurement</Text>
//         </View>

//         {/* ── META ROW ── */}
//         <View style={styles.metaRow}>
//           <View style={styles.metaBox}>
//             <Text style={styles.metaLabel}>Invoice No.</Text>
//             <Text style={styles.metaValue}>#{order.order_number}</Text>
//           </View>
//           <View style={styles.metaBox}>
//             <Text style={styles.metaLabel}>Invoice Date</Text>
//             <Text style={styles.metaValue}>{fmtDate(order.created_at)}</Text>
//           </View>
//           <View style={styles.metaBox}>
//             <Text style={styles.metaLabel}>Payment Mode</Text>
//             <Text style={styles.metaValue}>{order.payment_mode}</Text>
//           </View>
//           <View style={styles.metaBox}>
//             <Text style={styles.metaLabel}>Payment Status</Text>
//             <View style={[styles.badge, isPaid ? styles.badgePaid : styles.badgePending]}>
//               <Text style={[styles.badgeText, isPaid ? styles.badgePaidText : styles.badgePendingText]}>
//                 {isPaid ? "PAID" : "PENDING"}
//               </Text>
//             </View>
//           </View>
//           <View style={styles.metaBox}>
//             <Text style={styles.metaLabel}>Order Status</Text>
//             <Text style={styles.metaValue}>{order.status}</Text>
//           </View>
//           <View style={styles.metaBox}>
//             <Text style={styles.metaLabel}>Currency</Text>
//             <Text style={styles.metaValue}>{order.currency.source_title}</Text>
//           </View>
//         </View>

//         {/* ── BILL TO / SHIP TO ── */}
//         <View style={styles.addressSection}>
//           <View style={styles.addressBlock}>
//             <Text style={styles.addressTitle}>Bill To</Text>
//             <Text style={styles.addressName}>{order.customer.name}</Text>
//             {addressLines.map((line, i) => (
//               <Text key={i} style={styles.addressLine}>{line}</Text>
//             ))}
//             <Text style={styles.addressLine}>
//               Attention To: {order.customer.name}{"   "}Telephone: {order.customer.country_code} {order.customer.mobile_number}
//             </Text>
//             <Text style={styles.addressLine}>Email: {order.customer.email}</Text>
//           </View>
//           <View style={styles.addressBlock}>
//             <Text style={styles.addressTitle}>Ship To</Text>
//             <Text style={styles.addressName}>{order.customer.name}</Text>
//             {addressLines.map((line, i) => (
//               <Text key={i} style={styles.addressLine}>{line}</Text>
//             ))}
//             <Text style={styles.addressLine}>Customer Type: {order.customer.type}</Text>
//             {payment && (
//               <Text style={styles.addressLine}>
//                 Transaction ID: {payment.transaction_id}
//               </Text>
//             )}
//           </View>
//         </View>

//         {/* ── PRODUCTS TABLE ── */}
//         <View style={styles.tableContainer}>
//           {/* Table Header */}
//           <View style={styles.tableHeader}>
//             <Text style={[styles.thText, styles.colNo]}>#</Text>
//             <Text style={[styles.thText, styles.colDesc]}>Description</Text>
//             <Text style={[styles.thText, styles.colSku]}>SKU</Text>
//             <Text style={[styles.thText, { ...styles.colQty, textAlign: "center" }]}>Qty</Text>
//             <Text style={[styles.thText, { ...styles.colUnit, textAlign: "right" }]}>Unit Price</Text>
//             <Text style={[styles.thText, { ...styles.colShip, textAlign: "right" }]}>Freight</Text>
//             <Text style={[styles.thText, { ...styles.colTotal, textAlign: "right" }]}>Total</Text>
//           </View>

//           {/* Table Rows */}
//           {order.order_products.map((item, idx) => (
//             <View
//               key={item.id}
//               style={[styles.tableRow, idx % 2 === 1 ? styles.tableRowAlt : {}]}
//             >
//               <Text style={[styles.tdText, styles.colNo]}>{idx + 1}</Text>
//               <View style={styles.colDesc}>
//                 <Text style={styles.tdText}>{item.product.name.en}</Text>
//                 <Text style={styles.tdGray}>
//                   Brand: {item.product.brand.name.en}{"  |  "}
//                   {item.product.category.most_parent_name?.en} › {item.product.category.name.en}
//                 </Text>
//                 <Text style={styles.tdGray}>
//                   Ships: {item.expected_shipping_date}{"  "}
//                   {item.is_returnable === "yes" ? "• Returnable" : ""}
//                 </Text>
//               </View>
//               <Text style={[styles.tdText, styles.colSku]}>{item.product.sku}</Text>
//               <Text style={[styles.tdText, { ...styles.colQty, textAlign: "center" }]}>
//                 {item.quantity}
//               </Text>
//               <Text style={[styles.tdText, { ...styles.colUnit, textAlign: "right" }]}>
//                 {fmt(item.unit_price, sym)}
//               </Text>
//               <Text style={[styles.tdText, { ...styles.colShip, textAlign: "right" }]}>
//                 {parseFloat(item.shipping_charge) > 0 ? fmt(item.shipping_charge, sym) : "—"}
//               </Text>
//               <Text style={[styles.tdText, { ...styles.colTotal, textAlign: "right" }]}>
//                 {fmt(item.total_amount, sym)}
//               </Text>
//             </View>
//           ))}
//         </View>

//         {/* ── TERMS + TOTALS ── */}
//         <View style={styles.bottomSection}>
//           {/* Terms */}
//           <View style={styles.termsBox}>
//             <Text style={styles.termsTitle}>Terms of Sale</Text>
//             {[
//               "Kindly include our Order Number when processing this payment through bank transfer.",
//               "Lead times are subject to manufacturer's schedule at the date of purchase with valid PO or Advance Payment.",
//               "Lead times are based on business days and begin upon receipt of payment, unless otherwise agreed, and may be subject to change.",
//               "Once items are available, delivery to customer is 1-5 business days depending on location.",
//               "If delivery is delayed by the customer, storage charges may apply and invoiced per reasonable and necessary criteria.",
//             ].map((t, i) => (
//               <View key={i} style={styles.termItem}>
//                 <Text style={styles.termBullet}>•</Text>
//                 <Text style={styles.termText}>{t}</Text>
//               </View>
//             ))}
//           </View>

//           {/* Totals */}
//           <View style={styles.totalsBox}>
//             <View style={styles.totalsHeader}>
//               <Text style={styles.totalsHeaderText}>Invoice Summary</Text>
//             </View>
//             <View style={styles.totalsRow}>
//               <Text style={styles.totalsLabel}>Invoice Subtotal</Text>
//               <Text style={styles.totalsValue}>{fmt(subtotal, sym)}</Text>
//             </View>
//             {discount > 0 && (
//               <View style={styles.totalsRow}>
//                 <Text style={styles.totalsLabel}>Coupon Discount</Text>
//                 <Text style={styles.totalsDiscount}>-{fmt(discount, sym)}</Text>
//               </View>
//             )}
//             <View style={styles.totalsRow}>
//               <Text style={styles.totalsLabel}>Subtotal After Coupon</Text>
//               <Text style={styles.totalsValue}>{fmt(subtotal - discount, sym)}</Text>
//             </View>
//             {additionalDiscount > 0 && (
//               <View style={styles.totalsRow}>
//                 <Text style={styles.totalsLabel}>Additional Discount</Text>
//                 <Text style={styles.totalsDiscount}>-{fmt(additionalDiscount, sym)}</Text>
//               </View>
//             )}
//             <View style={styles.totalsRow}>
//               <Text style={styles.totalsLabel}>Subtotal After Discounts</Text>
//               <Text style={styles.totalsValue}>{fmt(subtotal - discount - additionalDiscount, sym)}</Text>
//             </View>
//             <View style={styles.totalsRow}>
//               <Text style={styles.totalsLabel}>Shipping</Text>
//               <Text style={styles.totalsValue}>{fmt(shipping, sym)}</Text>
//             </View>
//             <View style={styles.totalsRow}>
//               <Text style={styles.totalsLabel}>
//                 Sales Tax ({parseFloat(order.tax_percentage).toFixed(2)}%)
//               </Text>
//               <Text style={styles.totalsValue}>{fmt(tax, sym)}</Text>
//             </View>
//             <View style={styles.totalsFinalRow}>
//               <Text style={styles.totalsFinalLabel}>NET TOTAL INCL. SALES TAX</Text>
//               <Text style={styles.totalsFinalValue}>{fmt(total, sym)}</Text>
//             </View>
//             <View style={styles.totalsInWords}>
//               <Text style={styles.inWordsText}>{numberToWords(total)}</Text>
//             </View>
//           </View>
//         </View>

//         {/* ── BANK + PAYMENT TERMS (side by side like original) ── */}
//         <View style={{ flexDirection: "row", gap: 12, marginBottom: 14 }}>
//           {/* Bank Details */}
//           <View style={[styles.bankSection, { flex: 1, marginBottom: 0 }]}>
//             <View style={styles.bankHeader}>
//               <Text style={styles.bankHeaderText}>Bank Details</Text>
//             </View>
//             {[
//               ["Account Name", BANK.accountName, false],
//               ["Beneficiary Address", BANK.beneficiaryAddress, false],
//               ["Account No", BANK.accountNo, false],
//               ["Bank", BANK.bank, false],
//               ["Routing Code", BANK.routingCode, false],
//               ["In Case Of\nCheque Payment", BANK.cheque, true],
//             ].map(([label, value, isRed], i) => (
//               <View key={i} style={[styles.bankRow, i === 5 ? { borderBottomWidth: 0 } : {}]}>
//                 <Text style={styles.bankLabel}>{label as string}</Text>
//                 <Text style={[styles.bankValue, isRed ? { color: RED, fontFamily: "Helvetica-Bold" } : {}]}>
//                   {value as string}
//                 </Text>
//               </View>
//             ))}
//           </View>

//           {/* Customer Payment Terms */}
//           <View style={[styles.bankSection, { flex: 1, marginBottom: 0 }]}>
//             <View style={styles.bankHeader}>
//               <Text style={styles.bankHeaderText}>Customer Payment Terms & Order Processing Timeline</Text>
//             </View>
//             <View style={{ padding: 8, gap: 3 }}>
//               {[
//                 ["Bank Transfer (Wire/Local):", "Orders are processed after 2–3 business days upon receipt of funds."],
//                 ["ACH Payments:", "Orders are processed after 3 business days from payment receipt."],
//                 ["Personal Checks:", "Orders are processed after 5 business days from deposit date."],
//                 ["Corporate Checks:", "Orders are processed after 3 business days from deposit date."],
//                 ["Cash & Card Payments:", "Orders are processed immediately upon successful payment."],
//                 ["Online Payments (Credit/Debit):", "Subject to fraud screening—may take 1–2 extra business days if flagged."],
//                 ["Confirmation:", "Orders are confirmed only after payment clearance and fraud checks are completed."],
//               ].map(([bold, rest], i) => (
//                 <Text key={i} style={{ fontSize: 6.5, color: DARK, lineHeight: 1.5 }}>
//                   <Text style={{ fontFamily: "Helvetica-Bold" }}>{bold} </Text>
//                   <Text style={{ color: GRAY }}>{rest}</Text>
//                 </Text>
//               ))}
//             </View>
//           </View>
//         </View>

//         {/* ── SYSTEM GENERATED NOTE ── */}
//         <View style={{ marginBottom: 8, alignItems: "center" }}>
//           <Text style={{ fontSize: 7.5, fontFamily: "Helvetica-Bold", color: DARK }}>
//             This is a system generated Invoice. Hence, no stamp or signature required.
//           </Text>
//         </View>

//         {/* ── FOOTER ── */}
//         <View style={styles.footer}>
//           <View style={styles.footerLeft}>
//             <Text style={styles.footerSub}>
//               Order Online for Fast Shipping & Lower Prices at {COMPANY.website}
//             </Text>
//           </View>
//           <View style={styles.footerRight}>
//             <Text style={styles.footerPage}>Invoice #{order.order_number}</Text>
//           </View>
//         </View>

//       </Page>
//     </Document>
//   );
// };

// export default HorecaInvoicePDF;

// // ─── Usage Example ────────────────────────────────────────────────────────────
// //
// // import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
// // import HorecaInvoicePDF from "./HorecaInvoice";
// //
// // // Browser Preview:
// // <PDFViewer width="100%" height={800}>
// //   <HorecaInvoicePDF order={orderData} />
// // </PDFViewer>
// //
// // // Download Button:
// // <PDFDownloadLink
// //   document={<HorecaInvoicePDF order={orderData} />}
// //   fileName={`invoice-${orderData.order_number}.pdf`}
// // >
// //   {({ loading }) => loading ? "Generating..." : "Download Invoice"}
// // </PDFDownloadLink>
// //
// // // Server-side / API route (Next.js):
// // const pdfBuffer = await pdf(<HorecaInvoicePDF order={orderData} />).toBuffer();
// // res.setHeader("Content-Type", "application/pdf");
// // res.send(pdfBuffer);