import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import React from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface PdfOrderDetail {
  id: number;
  order_number: string;
  status: string;
  total_amount: string;
  amount: string;
  tax_amount: string;
  tax_percentage: string;
  shipping_charge: number;
  discount: string;
  additional_discount_amount: string;
  additional_discount_type?: string | null;
  additional_discount_percentage?: string | null;
  additional_discount_reason?: string | null;
  cheque_discount?: string;
  cheque_discount_percentage?: string;
  is_lift_gate: number;
  is_residential_address: number;
  is_inside_delivery: number;
  is_paid: number;
  paid_amount: string;
  pending_amount: string;
  payment_link: string | null;
  payment_mode: string | null;
  is_reserved: number;
  pay_with_cheque: number;
  created_at: string;
  customer_address: string;
  customer: {
    name: string;
    email: string;
    type: string;
    country_code: string;
    mobile_number: string;
  };
  order_products: Array<{
    id: number;
    quantity: number;
    unit_price: string;
    status: string;
    is_returnable: string;
    expected_shipping_date: string;
    accessory_item_charge?: string;
    accessory_charges?: Array<{
      id?: number;
      accessory_item_name: string;
      accessory_item_price: number;
    }>;
    product_supplier: {
      price?: number;
      delivery_days?: string;
      return_policy?: string;
    };
    product: {
      id: number;
      sku: string;
      name: { en: string };
      image_urls: { en: string[] };
      brand?: { name: { en: string } };
      warranty_attribute?: { en: string };
      selling_unit_attribute?: { en: string };
      currency_symbol?: string;
    };
  }>;
  payments: Array<{
    id: number;
    transaction_id: string;
    payment_method: string;
    amount: string;
    status: string;
    payment_mode: string;
    created_at: string;
  }>;
  total_products: number;
  currency: {
    source_title: string;
    source_symbol: string;
    target_title: string;
    target_symbol: string;
    conversion_rate: number;
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDateShort(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function toUSD(val: string | number): string {
  return Number(val).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function convertAmountToWords(amount: number): string {
  const ones = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen",
  ];
  const tens = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety",
  ];

  function numToWords(n: number): string {
    if (n === 0) return "Zero";
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
    if (n < 1000)
      return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + numToWords(n % 100) : "");
    if (n < 1000000)
      return numToWords(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + numToWords(n % 1000) : "");
    return numToWords(Math.floor(n / 1000000)) + " Million" + (n % 1000000 ? " " + numToWords(n % 1000000) : "");
  }

  const [whole, fraction = "00"] = amount.toFixed(2).split(".");
  return `${numToWords(Number(whole))} And ${fraction}/100 U.S. Dollars Only`;
}

function parseAddress(raw: string) {
  const lines = raw.split(/\\n|\n/).filter(Boolean);
  const line1 = lines[0] ?? raw;
  const rawLine2 = lines[1] ?? "";
  // Remove leading dash that sometimes comes from API  e.g. "NY, New York, - United States"
  const parts = rawLine2.split(",").map((s) => s.trim());
  const city = parts[0] ?? "";
  const state = parts[1] ?? "";
  const country = (parts[2] ?? "").replace(/^-\s*/, "");
  const line2 = [city, state, country].filter(Boolean).join(", ");
  return { line1, line2 };
}

// ── Styles ────────────────────────────────────────────────────────────────────

const S = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 8,
    color: "#111111",
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 14,
  },

  // Header
  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  headerLogo: { width: 90, height: 36, objectFit: "contain" },
  headerCenter: { flex: 1, alignItems: "center" },
  headerTitle: { fontSize: 13, fontFamily: "Helvetica-Bold", letterSpacing: 0.5 },
  headerSub: { fontSize: 8, color: "#186737", marginTop: 2, fontFamily: "Helvetica-Bold" },
  headerRight: { alignItems: "flex-end" },
  headerRightText: { fontSize: 7, lineHeight: 1.4 },
  headerRightBold: { fontSize: 7.5, fontFamily: "Helvetica-Bold", lineHeight: 1.4 },

  // Bill To + Invoice Info row
  twoCol: { flexDirection: "row", gap: 8, marginBottom: 6 },
  col: { flex: 1 },

  // Bordered box
  box: { border: "1 solid #000" },
  boxHeader: {
    backgroundColor: "#E7E7E7",
    paddingVertical: 4,
    paddingHorizontal: 6,
    textAlign: "center",
    fontFamily: "Helvetica-Bold",
    fontSize: 8.5,
    borderBottom: "1 solid #000",
  },
  boxBody: { paddingHorizontal: 8, paddingVertical: 8 },

  // Bill To
  billName: { fontFamily: "Helvetica-Bold", fontSize: 9, textTransform: "uppercase", marginBottom: 4 },
  billText: { fontSize: 7.5, lineHeight: 1.6, marginBottom: 2 },
  billLabel: { fontFamily: "Helvetica-Bold" },
  billRow: { flexDirection: "row", marginBottom: 4, alignItems: "flex-start" },
  billRowLabel: { fontFamily: "Helvetica-Bold", fontSize: 7.5, marginRight: 4, flexShrink: 0 },
  billRowValue: { fontSize: 7.5, flex: 1, lineHeight: 1.4 },

  // Invoice info table cells
  infoGrid: { flexDirection: "row", alignItems: "stretch" },
  infoCell: {
    flex: 1,
    paddingVertical: 4,
    paddingHorizontal: 4,
    textAlign: "center",
    fontSize: 7.5,
  },
  infoCellView: {
    flex: 1,
    paddingVertical: 5,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  infoCellText: {
    fontSize: 7.5,
    textAlign: "center",
  },
  infoCellBorderRight: { borderRight: "1 solid #000" },
  infoCellGray: { backgroundColor: "#E7E7E7" },
  infoCellRed: { color: "#CC0000", fontFamily: "Helvetica-Bold" },
  infoBorderBottom: { borderBottom: "1 solid #000" },

  // Product table
  prodTable: { border: "1 solid #000", marginBottom: 6 },
  prodHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#E7E7E7",
    borderBottom: "1 solid #000",
  },
  prodRow: { flexDirection: "row", borderBottom: "1 solid #000", alignItems: "stretch" },
  prodRowAlt: { backgroundColor: "#F0F0F0" },
  prodCell: {
    paddingVertical: 4,
    paddingHorizontal: 3,
    fontSize: 7,
    textAlign: "center",
    borderRight: "1 solid #000",
  },
  prodCellLast: {
    paddingVertical: 4,
    paddingHorizontal: 3,
    fontSize: 7,
    textAlign: "center",
  },
  prodHeaderText: { fontFamily: "Helvetica-Bold", fontSize: 7 },
  prodDescCell: {
    paddingVertical: 4,
    paddingHorizontal: 4,
    fontSize: 7,
    borderRight: "1 solid #000",
  },
  prodName: { fontFamily: "Helvetica-Bold", fontSize: 7.5, marginBottom: 2 },
  prodMeta: { fontSize: 6.5, lineHeight: 1.4 },
  prodMetaRed: { color: "#CC0000" },
  prodMetaBold: { fontFamily: "Helvetica-Bold" },
  prodImg: { width: 36, height: 36, objectFit: "contain" },

  // Bottom two-col
  termsBox: { flex: 3, border: "1 solid #000", padding: 8 },
  termsTitle: { fontFamily: "Helvetica-Bold", fontSize: 9, marginBottom: 4 },
  termsText: { fontSize: 6.5, lineHeight: 1.5 },

  totalsBox: { flex: 2, border: "1 solid #000" },
  totalsBody: { padding: 8 },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2.5,
  },
  totalsLabel: { fontSize: 7.5, fontFamily: "Helvetica-Bold" },
  totalsValue: { fontSize: 7.5 },
  totalsRed: { color: "#CC0000", fontFamily: "Helvetica-Bold" },
  totalsGreen: { color: "#186737", fontFamily: "Helvetica-Bold" },
  totalsDivider: { borderBottom: "0.5 solid #AAAAAA", marginVertical: 3 },
  totalsNetBar: {
    backgroundColor: "#E7E7E7",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderTop: "1 solid #000",
  },
  totalsNetText: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#CC0000" },
  totalsWords: {
    paddingHorizontal: 8,
    paddingTop: 4,
    paddingBottom: 6,
    textAlign: "right",
    fontSize: 6.5,
    fontFamily: "Helvetica-Bold",
  },

  // Appreciation
  appreciate: {
    textAlign: "center",
    fontFamily: "Helvetica-Bold",
    fontSize: 7.5,
    marginVertical: 6,
  },

  // Bank + Payment terms
  bankTable: { border: "1 solid #000" },
  bankHeader: {
    backgroundColor: "#E7E7E7",
    textAlign: "center",
    paddingVertical: 4,
    fontFamily: "Helvetica-Bold",
    fontSize: 8.5,
    borderBottom: "1 solid #000",
  },
  bankRow: { flexDirection: "row", borderBottom: "0.5 solid #000" },
  bankLabel: {
    width: "35%",
    backgroundColor: "#E7E7E7",
    fontFamily: "Helvetica-Bold",
    fontSize: 7,
    padding: 4,
    borderRight: "0.5 solid #000",
  },
  bankValue: { flex: 1, fontSize: 7, padding: 4, fontFamily: "Helvetica-Bold" },
  bankValueRed: { color: "#CC0000" },

  payTermsBox: { border: "1 solid #000" },
  payTermsHeader: {
    backgroundColor: "#E7E7E7",
    textAlign: "center",
    paddingVertical: 4,
    fontFamily: "Helvetica-Bold",
    fontSize: 7.5,
    borderBottom: "1 solid #000",
  },
  payTermsBody: { padding: 5 },
  payTermsLine: { fontSize: 6.5, lineHeight: 1.6 },
  payTermsBold: { fontFamily: "Helvetica-Bold" },

  // Footer
  footer: {
    borderTop: "1 solid #000",
    paddingTop: 5,
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: { fontSize: 7 },
  footerGreen: { color: "#186737" },

  systemNote: {
    textAlign: "center",
    fontFamily: "Helvetica-Bold",
    fontSize: 7,
    marginTop: 5,
    marginBottom: 2,
  },
});

// ── Sub-components ────────────────────────────────────────────────────────────

const Header = () => (
  <View style={S.headerRow}>
    <Image
      src="/logo.png"
      style={S.headerLogo}
    />
    <View style={S.headerCenter}>
      <Text style={S.headerTitle}>SALES INVOICE</Text>
      <Text style={S.headerSub}>Save Money, Simplify Procurement.</Text>
    </View>
    <View style={S.headerRight}>
      <Text style={S.headerRightBold}>THE HORECA STORE INC.</Text>
      <Text style={S.headerRightText}>8800 Bissonnet Street, Ste A,</Text>
      <Text style={S.headerRightText}>Houston, Texas 77074</Text>
      <Text style={S.headerRightText}>Phone: 1 (866) 446-7322</Text>
      <Text style={S.headerRightText}>Email: sales@thehorecastore.com</Text>
      <Text style={[S.headerRightText, S.footerGreen]}>www.thehorecastore.com</Text>
    </View>
  </View>
);

const BillToBox = ({ order }: { order: PdfOrderDetail }) => {
  const addr = parseAddress(order.customer_address);
  const phone = `${order.customer.country_code} ${order.customer.mobile_number}`;
  const shippingAddress = [addr.line1, addr.line2].filter(Boolean).join(", ");

  const rows = [
    { label: "Name",             value: order.customer.name },
    { label: "Type",             value: order.customer.type|| "N/A" },
    { label: "Email",            value: order.customer.email },
    { label: "Phone No.",        value: phone },
    { label: "Shipping Address", value: shippingAddress },
  ];

  return (
    <View style={[S.col, S.box]}>
      <Text style={S.boxHeader}>Bill To</Text>
      <View style={[S.boxBody, { justifyContent: "center" }]}>
        {rows.map(({ label, value }) => (
          <View key={label} style={S.billRow}>
            <Text style={S.billRowLabel}>{label}:</Text>
            <Text style={S.billRowValue}>{value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const InfoCell = ({
  children,
  gray,
  red,
  borderRight,
}: {
  children: React.ReactNode;
  gray?: boolean;
  red?: boolean;
  borderRight?: boolean;
}) => (
  <View style={[S.infoCellView, gray ? S.infoCellGray : {}, borderRight ? S.infoCellBorderRight : {}]}>
    <Text
      style={[
        S.infoCellText,
        gray ? { fontFamily: "Helvetica-Bold" as const } : {},
        red ? S.infoCellRed : {},
      ]}
    >
      {children}
    </Text>
  </View>
);

const InvoiceInfoTable = ({ order, paymentMode, currency }: { order: PdfOrderDetail; paymentMode: string; currency: string }) => (
  <View style={[S.col, S.box]}>
    {/* Row 1 header */}
    <View style={[S.infoGrid, S.infoBorderBottom]}>
      <InfoCell gray borderRight>Date</InfoCell>
      <InfoCell gray borderRight>Invoice No</InfoCell>
      <InfoCell gray>Payment Status</InfoCell>
    </View>
    {/* Row 1 data */}
    <View style={[S.infoGrid, S.infoBorderBottom]}>
      <InfoCell borderRight>{formatDateShort(order.created_at)}</InfoCell>
      <InfoCell borderRight red>INV-{order.order_number}</InfoCell>
      <InfoCell>{order.is_paid ? "Paid" : "Pending"}</InfoCell>
    </View>
    {/* Row 2 header */}
    <View style={[S.infoGrid, S.infoBorderBottom]}>
      <InfoCell gray borderRight>Order Mode</InfoCell>
      <InfoCell gray borderRight>Order Type</InfoCell>
      <InfoCell gray>Currency</InfoCell>
    </View>
    {/* Row 2 data */}
    <View style={[S.infoGrid, S.infoBorderBottom]}>
      <InfoCell borderRight>{paymentMode}</InfoCell>
      <InfoCell borderRight>Online</InfoCell>
      <InfoCell red>{currency}</InfoCell>
    </View>
    {/* Row 2 header */}
    <View style={[S.infoGrid, S.infoBorderBottom]}>
      <InfoCell gray borderRight>Order Status</InfoCell>
      <InfoCell gray>Transaction ID</InfoCell>
    </View>
    {/* Row 2 data */}
    <View style={[S.infoGrid]}>
      <InfoCell borderRight>{order.status}</InfoCell>
      <InfoCell  ><Text style={{ fontSize: 7}}> {order.payments[0]?.transaction_id ?? "—"}</Text></InfoCell>
    </View>
    {/* Row 3 header */}
    {/* <View style={[S.infoGrid, S.infoBorderBottom]}>
      <InfoCell gray borderRight>Order Status</InfoCell>
      <InfoCell gray>Transaction ID</InfoCell>
    </View> */}
    {/* Row 3 data */}
    {/* <View style={[S.infoGrid, { flex: 1 }]}>
      <InfoCell borderRight ><Text  style={{ fontSize: 6, textAlign: "center", marginTop:"-4px" }}>{order.status}</Text></InfoCell>
      <InfoCell>
        <Text style={{ fontSize: 6, textAlign: "center", marginTop:"-4px" }}>
          {order.payments[0]?.transaction_id ?? "—"}
        </Text>
      </InfoCell>
    </View> */}
  </View>
);

const PROD_COLS = [
  { label: "S.No", w: "5%" },
  { label: "Description", w: "32%", left: true },
  { label: "Image", w: "9%" },
  { label: "Qty", w: "6%" },
  { label: "Accessories Charge", w: "13%" },
  { label: "Unit", w: "8%" },
  { label: "Unit Price", w: "12%" },
  { label: "Total", w: "12%" },
];

const ProductTableHeader = () => (
  <View style={[S.prodHeaderRow, { alignItems: "stretch" }]}>
    {PROD_COLS.map((col, i) => (
      <View
        key={col.label}
        style={[
          {
            width: col.w,
            backgroundColor: "#E7E7E7",
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 3,
            paddingHorizontal: 3,
          },
          i < PROD_COLS.length - 1 ? { borderRight: "1 solid #000" } : {},
        ]}
      >
        <Text style={[S.prodHeaderText, { textAlign: "center" }]}>
          {col.label}
        </Text>
      </View>
    ))}
  </View>
);

type OrderProduct = PdfOrderDetail["order_products"][number];

const ProductRow = ({
  item,
  sno,
  isAlt,
}: {
  item: OrderProduct;
  sno: number;
  isAlt: boolean;
}) => {
  const name = item.product.name?.en ?? "";
  const image = item.product.image_urls?.en?.[0] ?? "";
  const brand = item.product.brand?.name?.en ?? "";
  const sellingUnit = item.product.selling_unit_attribute?.en ?? "";
  const accCharge = Number(item.accessory_item_charge ?? 0);
  const accCharges = item.accessory_charges ?? [];
  const price = Number(item.unit_price);
  const rowTotal = price * item.quantity;
  const displayName = name.length > 90 ? name.slice(0, 90) + "…" : name;

  return (
    <View style={[S.prodRow, isAlt ? S.prodRowAlt : {}]}>
      {/* S.No */}
      <View style={[S.prodCell, { width: "5%", alignItems: "center", justifyContent: "center" }]}>
        <Text>{String(sno).padStart(2, "0")}</Text>
      </View>

      {/* Description */}
      <View style={[S.prodDescCell, { width: "32%", justifyContent: "center" }]}>
        <Text style={S.prodName} >{displayName}</Text>
        <Text style={S.prodMeta}>
          <Text style={S.prodMetaBold}>Brand: </Text>
          <Text style={S.prodMetaRed}>{brand}</Text>
          <Text style={S.prodMetaBold}>  SKU #: </Text>
          <Text style={S.prodMetaRed}>{item.product.sku}</Text>
        </Text>
        <Text style={[S.prodMeta, { marginTop: 1 }]}>
          <Text style={S.prodMetaBold}>Shipping by: </Text>
          <Text style={S.prodMetaRed}>{item.expected_shipping_date}</Text>
        </Text>
        {accCharges.length > 0 &&
          accCharges.map((ac, idx) => (
            <Text key={idx} style={[S.prodMeta, { marginTop: 1 }]}>
              <Text style={S.prodMetaBold}>{ac.accessory_item_name}: </Text>
              ${ac.accessory_item_price}
            </Text>
          ))}
      </View>

      {/* Image */}
      <View style={[S.prodCell, { width: "9%", alignItems: "center", justifyContent: "center" }]}>
        {image ? (
          <Image src={image} style={S.prodImg} cache={false} />
        ) : (
          <Text style={{ fontSize: 6, color: "#999" }}>—</Text>
        )}
      </View>

      {/* Qty */}
      <View style={[S.prodCell, { width: "6%", alignItems: "center", justifyContent: "center" }]}>
        <Text>{item.quantity}</Text>
      </View>

      {/* Acc Charge */}
      <View style={[S.prodCell, { width: "13%", alignItems: "center", justifyContent: "center" }]}>
        <Text>${toUSD(accCharge)}</Text>
      </View>

      {/* Unit */}
      <View style={[S.prodCell, { width: "8%", alignItems: "center", justifyContent: "center" }]}>
        <Text>{sellingUnit}</Text>
      </View>

      {/* Unit Price */}
      <View style={[S.prodCell, { width: "12%", alignItems: "center", justifyContent: "center" }]}>
        <Text>${toUSD(price)}</Text>
      </View>

      {/* Total */}
      <View style={[S.prodCellLast, { width: "12%", alignItems: "center", justifyContent: "center" }]}>
        <Text>${toUSD(rowTotal)}</Text>
      </View>
    </View>
  );
};

const TermsOfSale = () => (
  <View style={S.termsBox}>
    <Text style={S.termsTitle}>TERMS OF SALE</Text>
    {[
      "1. All orders are subject to acceptance by The HoReCa Store Inc.",
      "2. Prices are subject to change without notice.",
      "3. All sales are final unless otherwise stated in writing.",
      "4. Returns must be pre-authorized and subject to a restocking fee.",
      "5. Title and risk of loss pass to buyer upon delivery to carrier.",
      "6. The HoReCa Store Inc. is not liable for carrier-caused delays.",
      "7. Payment terms are as agreed at time of purchase.",
      "8. Disputes must be reported within 5 business days of receipt.",
      "9. Warranty claims are handled directly with the manufacturer.",
      "10. All prices are in USD unless otherwise specified.",
      "11. Late payments may incur additional charges as per applicable law.",
      "12. Force majeure events are not the responsibility of HoReCa Store.",
    ].map((t) => (
      <Text key={t} style={S.termsText}>
        {t}
      </Text>
    ))}
  </View>
);

const TotalsBox = ({ order, currency }: { order: PdfOrderDetail; currency: string }) => {
  const subtotal = Number(order.amount);
  const discount = Number(order.discount);
  const additional = Number(order.additional_discount_amount);
  const additionalPct = Number(order.additional_discount_percentage ?? 0);
  const additionalType = order.additional_discount_type;
  const additionalReason = order.additional_discount_reason;
  const chequeDiscount = Number(order.cheque_discount ?? 0);
  const chequeDiscountPct = Number(order.cheque_discount_percentage ?? 0);
  const hasDiscount = discount > 0;
  const hasAdditional = additional > 0;
  const hasCheque = order.pay_with_cheque === 1 && chequeDiscount > 0;
  const total = Number(order.total_amount);

  const subtotalAfterCoupon = subtotal - discount;
  const subtotalAfterAll = subtotal - discount - additional - chequeDiscount;

  return (
    <View style={S.totalsBox}>
      <View style={S.totalsBody}>
        {/* Subtotal */}
        <View style={S.totalsRow}>
          <Text style={S.totalsLabel}>INVOICE SUBTOTAL</Text>
          <Text style={S.totalsValue}>${toUSD(subtotal)}</Text>
        </View>

        {/* Coupon */}
        {/* {hasDiscount && (
          <>
            <View style={S.totalsRow}>
              <Text style={[S.totalsLabel, S.totalsRed]}>Coupon Discount</Text>
              <Text style={S.totalsRed}>- ${toUSD(discount)}</Text>
            </View>
            <View style={S.totalsDivider} />
            <View style={S.totalsRow}>
              <Text style={S.totalsLabel}>Subtotal After Coupon</Text>
              <Text style={[S.totalsValue, { fontFamily: "Helvetica-Bold" }]}>${toUSD(subtotalAfterCoupon)}</Text>
            </View>
          </>
        )} */}

        {/* Additional Discount */}
        {hasAdditional && (
          <>
            <View style={S.totalsDivider} />
            <View style={S.totalsRow}>
              <View>
                <Text style={[S.totalsLabel, { color: "#B45309" }]}>
                  Additional Discount
                  {additionalType === "percentage" && additionalPct
                    ? ` (${additionalPct.toFixed(1)}%)`
                    : ""}
                </Text>
                {additionalReason ? (
                  <Text style={{ fontSize: 5.5, color: "#666", marginTop: 1 }}>
                    Reason: {additionalReason}
                  </Text>
                ) : null}
              </View>
              <Text style={{ fontSize: 7.5, color: "#B45309", fontFamily: "Helvetica-Bold" }}>
                - ${toUSD(additional)}
              </Text>
            </View>
          </>
        )}

        {/* Invoice After Discounts (no cheque) */}
        {(hasDiscount || hasAdditional) && !hasCheque && (
          <>
            <View style={S.totalsDivider} />
            <View style={S.totalsRow}>
              <Text style={S.totalsLabel}>Subtotal After Discounts</Text>
              <Text style={[S.totalsValue, { fontFamily: "Helvetica-Bold" }]}>
                ${toUSD(subtotal - discount - additional)}
              </Text>
            </View>
          </>
        )}

        {/* Cheque Discount */}
        {hasCheque && (
          <>
            <View style={S.totalsDivider} />
            <View style={S.totalsRow}>
              <Text style={[S.totalsLabel, S.totalsGreen]}>
                Check Discount ({chequeDiscountPct.toFixed(1)}%)
              </Text>
              <Text style={S.totalsGreen}>- ${toUSD(chequeDiscount)}</Text>
            </View>
          </>
        )}

        {/* Subtotal after ALL discounts with cheque */}
        {(hasDiscount || hasAdditional) && hasCheque && (
          <>
            <View style={S.totalsDivider} />
            <View style={S.totalsRow}>
              <Text style={S.totalsLabel}>Subtotal After All Discounts</Text>
              <Text style={[S.totalsValue, { fontFamily: "Helvetica-Bold" }]}>
                ${toUSD(subtotalAfterAll)}
              </Text>
            </View>
          </>
        )}

        {/* Inside Delivery */}
        {order.is_inside_delivery === 1 && (
          <>
            <View style={S.totalsDivider} />
            <View style={S.totalsRow}>
              <Text style={S.totalsLabel}>Inside Delivery</Text>
              <Text style={S.totalsValue}>$249.00</Text>
            </View>
          </>
        )}

        {/* Lift Gate */}
        {order.is_lift_gate === 1 && (
          <>
            <View style={S.totalsDivider} />
            <View style={S.totalsRow}>
              <Text style={S.totalsLabel}>Lift Gate Delivery</Text>
              <Text style={S.totalsValue}>$75.00</Text>
            </View>
          </>
        )}

        {/* Residential */}
        {order.is_residential_address === 1 && (
          <>
            <View style={S.totalsDivider} />
            <View style={S.totalsRow}>
              <Text style={S.totalsLabel}>Residential Address Fee</Text>
              <Text style={S.totalsValue}>$199.00</Text>
            </View>
          </>
        )}

        {/* Shipping */}
        <View style={S.totalsDivider} />
        <View style={S.totalsRow}>
          <Text style={S.totalsLabel}>Shipping</Text>
          <Text style={S.totalsValue}>${toUSD(order.shipping_charge)}</Text>
        </View>

        {/* Tax */}
        <View style={S.totalsRow}>
          <Text style={S.totalsLabel}>
            Sales Tax {Number(order.tax_percentage).toFixed(2)}%
          </Text>
          <Text style={S.totalsValue}>${toUSD(order.tax_amount)}</Text>
        </View>
      </View>

      {/* Net Total Bar */}
      <View style={S.totalsNetBar}>
        <Text style={S.totalsNetText}>NET TOTAL INCL. SALES TAX</Text>
        <Text style={S.totalsNetText}>{currency} {toUSD(total)}</Text>
      </View>

      {/* Amount in words */}
      <Text style={S.totalsWords}>{convertAmountToWords(total)}</Text>
    </View>
  );
};

const BankBox = () => (
  <View style={[S.col, S.bankTable]}>
    <Text style={S.bankHeader}>Bank Details</Text>
    {[
      ["Account Name", "THE HORECA STORE INC", false],
      ["Beneficiary Address", "8800 BISSONNET ST STE A, HOUSTON TX 77074-2435", false],
      ["Account No", "6130 9953 3", false],
      ["Bank", "JP Morgan Chase Bank", false],
      ["Routing Code", "1110 0061 4", false],
    ].map(([label, val]) => (
      <View key={String(label)} style={S.bankRow}>
        <Text style={S.bankLabel}>{label}</Text>
        <Text style={S.bankValue}>{val}</Text>
      </View>
    ))}
    <View style={S.bankRow}>
      <Text style={S.bankLabel}>In Case Of Cheque Payment</Text>
      <View style={{ flex: 1, padding: 4 }}>
        <Text style={{ fontSize: 7, fontFamily: "Helvetica-Bold" }}>
          Please prepare all cheques in favor of
        </Text>
        <Text style={[S.bankValue, S.bankValueRed, { padding: 0 }]}>
          THE HORECA STORE INC
        </Text>
      </View>
    </View>
  </View>
);

const PaymentTermsBox = () => (
  <View style={[S.col, S.payTermsBox]}>
    <Text style={S.payTermsHeader}>
      Customer Payment Terms &amp; Order Processing Timeline
    </Text>
    <View style={S.payTermsBody}>
      {[
        ["Bank Transfer (Wire/Local):", "Orders are processed after 2–3 business days upon receipt of funds."],
        ["ACH Payments:", "Orders are processed after 3 business days from payment receipt."],
        ["Personal Checks:", "Orders are processed after 5 business days from deposit date."],
        ["Corporate Checks:", "Orders are processed after 3 business days from deposit date."],
        ["Cash & Card Payments:", "Orders are processed immediately upon successful payment."],
        ["Online Payments (Credit/Debit):", "Subject to fraud screening—may take 1–2 extra business days if flagged."],
        ["Confirmation:", "Orders are confirmed only after payment clearance and fraud checks are completed."],
      ].map(([bold, rest]) => (
        <Text key={String(bold)} style={S.payTermsLine}>
          <Text style={S.payTermsBold}>{bold}</Text> {rest}
        </Text>
      ))}
    </View>
  </View>
);

const PageFooter = ({ page, total }: { page: number; total: number }) => (
  <View style={S.footer}>
    <Text style={S.footerText}>
      Order Online at{" "}
      <Text style={S.footerGreen}>www.thehorecastore.com</Text>
    </Text>
    <Text style={S.footerText}>
      Page {page} of {total}
    </Text>
  </View>
);

// ── Main PDF Document ─────────────────────────────────────────────────────────

interface InvoicePdfDocumentProps {
  order: PdfOrderDetail;
}

export const InvoicePdfDocument = ({ order }: InvoicePdfDocumentProps) => {
  const currency = order.currency?.target_symbol ?? "$";
  const paymentMode =
    order.pay_with_cheque === 1
      ? "Check"
      : (order.payments[0]?.payment_mode ?? "");

  const allProducts = order.order_products ?? [];
  const n = allProducts.length;

  // ── Dynamic pagination from order_products.length ──────────────────────────
  // A4 usable height ~814pt
  // Single page = header(~180) + products + terms+bank+footer(~310) → max ~7 products at 45pt each
  // First/middle page (no footer) = header(~180) + products → max ~13 products
  // Last page (with footer, has header) = same as single page → max ~7 products with footer

  const SINGLE_PAGE_MAX  = n <= 7 ? n : 7;   // ≤7 products → single page fits
  const FIRST_PAGE_MAX   = 10;                // first page (no footer section)
  const MIDDLE_PAGE_MAX  = 10;                // products per middle page
  const LAST_PAGE_MAX    = 6;                 // max products on last page alongside footer

  const isSinglePage = n <= SINGLE_PAGE_MAX;

  // First page: single page = all products; multi-page = up to FIRST_PAGE_MAX
  const firstPageProducts = allProducts.slice(0, isSinglePage ? n : FIRST_PAGE_MAX);
  const rest = allProducts.slice(isSinglePage ? n : FIRST_PAGE_MAX);

  // Middle pages: chunks of MIDDLE_PAGE_MAX, but skip last chunk if it fits on last page
  const middlePages: typeof allProducts[] = [];
  let middleCount = 0;
  for (let i = 0; i < rest.length; i += MIDDLE_PAGE_MAX) {
    const chunk = rest.slice(i, i + MIDDLE_PAGE_MAX);
    const isLastChunk = i + MIDDLE_PAGE_MAX >= rest.length;
    if (isLastChunk && chunk.length <= LAST_PAGE_MAX) break;
    middlePages.push(chunk);
    middleCount += chunk.length;
  }

  const lastPageProducts = rest.slice(middleCount);
  const totalPages = isSinglePage ? 1 : 1 + middlePages.length + 1;

  const sharedProps = { order, currency, paymentMode };

  return (
    <Document title={`Invoice-INV-${order.order_number}-HorecaStore`} author="The HoReCa Store Inc.">
      {/* ── PAGE 1 ── */}
      <Page size="A4" style={S.page}>
        <Header />

        {/* Bill To + Invoice Info */}
        <View style={S.twoCol}>
          <BillToBox order={order} />
          <InvoiceInfoTable {...sharedProps} />
        </View>

        {/* Products */}
        <View style={S.prodTable}>
          <ProductTableHeader />
          {firstPageProducts.map((item, i) => (
            <ProductRow key={item.id} item={item} sno={i + 1} isAlt={i % 2 !== 0} />
          ))}
        </View>

        {/* Terms + Totals only on single-page or last page */}
        {isSinglePage && (
          <View style={[S.twoCol, { marginBottom: 4 }]}>
            <TermsOfSale />
            <TotalsBox order={order} currency={currency} />
          </View>
        )}

        {isSinglePage && (
          <>
            <Text style={S.appreciate}>
              We sincerely appreciate your business and look forward to serving you again.
            </Text>
            <View style={S.twoCol}>
              <BankBox />
              <PaymentTermsBox />
            </View>
            <Text style={S.systemNote}>
              This is a system generated Invoice. Hence, no stamp or signature required.
            </Text>
          </>
        )}

        <PageFooter page={1} total={totalPages} />
      </Page>

      {/* ── MIDDLE PAGES ── */}
      {middlePages.map((pageProducts, pageIdx) => {
        const startIdx = firstPageProducts.length + pageIdx * MIDDLE_PAGE_MAX;
        return (
          <Page key={`mid-${pageIdx}`} size="A4" style={S.page}>
            <Header />

            {/* Compact info bar */}
            <View style={[S.box, { marginBottom: 6 }]}>
              <View style={[S.infoGrid, S.infoBorderBottom]}>
                {["Date", "Invoice No.", "Payment Status", "Payment Mode", "Order Type", "Currency"].map(
                  (h, i, arr) => (
                    <Text
                      key={h}
                      style={[
                        S.infoCell,
                        S.infoCellGray,
                        i < arr.length - 1 ? S.infoCellBorderRight : {},
                      ]}
                    >
                      {h}
                    </Text>
                  )
                )}
              </View>
              <View style={S.infoGrid}>
                <Text style={[S.infoCell, S.infoCellBorderRight]}>{formatDateShort(order.created_at)}</Text>
                <Text style={[S.infoCell, S.infoCellBorderRight, S.infoCellRed]}>INV-{order.order_number}</Text>
                <Text style={[S.infoCell, S.infoCellBorderRight]}>{order.is_paid ? "Paid" : "Pending"}</Text>
                <Text style={[S.infoCell, S.infoCellBorderRight]}>{paymentMode}</Text>
                <Text style={[S.infoCell, S.infoCellBorderRight]}>Online</Text>
                <Text style={[S.infoCell, S.infoCellRed]}>{currency}</Text>
              </View>
            </View>

            <View style={S.prodTable}>
              <ProductTableHeader />
              {pageProducts.map((item, i) => (
                <ProductRow key={item.id} item={item} sno={startIdx + i + 1} isAlt={i % 2 !== 0} />
              ))}
            </View>

            <PageFooter page={pageIdx + 2} total={totalPages} />
          </Page>
        );
      })}

      {/* ── LAST PAGE (multi-page) ── */}
      {!isSinglePage && (
        <Page size="A4" style={S.page}>
          <Header />

          <View style={S.twoCol}>
            <BillToBox order={order} />
            <InvoiceInfoTable {...sharedProps} />
          </View>

          {lastPageProducts.length > 0 && (
            <View style={S.prodTable}>
              <ProductTableHeader />
              {lastPageProducts.map((item, i) => {
                const gi = firstPageProducts.length + middleCount + i;
                return <ProductRow key={item.id} item={item} sno={gi + 1} isAlt={i % 2 !== 0} />;
              })}
            </View>
          )}

          <View style={[S.twoCol, { marginBottom: 4 }]}>
            <TermsOfSale />
            <TotalsBox order={order} currency={currency} />
          </View>

          <Text style={S.appreciate}>
            We sincerely appreciate your business and look forward to serving you again.
          </Text>

          <View style={S.twoCol}>
            <BankBox />
            <PaymentTermsBox />
          </View>

          <Text style={S.systemNote}>
            This is a system generated Invoice. Hence, no stamp or signature required.
          </Text>

          <PageFooter page={totalPages} total={totalPages} />
        </Page>
      )}
    </Document>
  );
};

export default InvoicePdfDocument;
