"use client";

import { apiUrls } from "@/apis/api-endpoint";
import { makeApiRequest } from "@/apis/axios-instance";
import CTA from "@/components/cta";
import { CurrencySymbol } from "@/components/currency-symbol";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { usePhoneValidation } from "@/hooks/usePhoneValidation";
import { loginUser } from "@/store/slices/auth/authSlice";
import { fetchCountryByName } from "@/store/slices/country/countrySlice";
import type { AppDispatch, RootState } from "@/store/store";
import { getDefaultAddressCache, useLocationData, type DefaultAddressCache } from "@/utils/locationStorage";
import {
  getUaeOrderShipping,
  UAE_FREE_SHIPPING_MIN,
} from "@/utils/shipping";
import { buildQuotePdfFilename } from "@/utils/quote-filename";
import { createQuotationSchema } from "@/validation/schema";
import { useFormik } from "formik";
import {
  AlertCircle,
  Building2,
  Check,
  CheckCircle,
  ChevronRight,
  FileText,
  Home,
  Info,
  Loader2,
  Mail,
  Minus,
  Plus,
  Tag,
  Trash2,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AddProductModal, type SearchProduct } from "./_components/add-product-modal";
import QuoteProcessingModal, {
  type QuoteProcessStep,
} from "./_components/quote-processing-modal";
import {
  addToQuote,
  clearQuoteList,
  getQuoteList,
  removeFromQuote,
  updateQuoteQty,
} from "@/utils/quoteStorage";

// ── Types ─────────────────────────────────────────────────────────────────────
type QuoteProduct = {
  id: number;
  name: string;
  brand: string;
  sku: string;
  image: string;
  warranty: string;
  deliveryDays: string;
  shippingCost: number;
  price: number;
  qty: number;
  vendorId?: number;
  accessoryItemIds?: number[];
};

interface CountryItem { id: number; name: string; phone_code: string; icon: string | null; }
interface CountriesResponse { message: string; data: CountryItem[]; }
interface LookupItem { id: number; name: string; }
interface LookupResponse { success: boolean; data: LookupItem[]; }

// ── Edit mode: shape of an existing quote fetched via GET frontend/quotes/{id} ────
interface ApiQuoteAccessoryCharge {
  accessory_item_id: number;
}
interface ApiQuoteProduct {
  quantity: number;
  unit_price: string;
  shipping_charge: string;
  vendor_id: number;
  accessory_charges?: ApiQuoteAccessoryCharge[];
  product_supplier: { delivery_days: string; return_policy: string };
  product: {
    id: number;
    sku: string;
    name: { en: string; ar?: string };
    image_urls: { en: string[] };
    brand?: { name: { en: string; ar?: string } };
    warranty_attribute?: { en: string; ar?: string };
  };
}
interface ApiQuoteDetail {
  id: number;
  company_name: string | null;
  is_lift_gate: number | null;
  is_residential_address: number | null;
  is_inside_delivery: number | null;
  coupon_id: number | null;
  discount: string | null;
  payment_mode: string;
  status: string;
  customer: { name: string; email: string; mobile_number: string | null };
  quote_products: ApiQuoteProduct[];
}

// ── Mock Data ─────────────────────────────────────────────────────────────────
const INITIAL_PRODUCTS: QuoteProduct[] = [

];

const UAE_VAT_RATE = 0.05;
const UAE = "United Arab Emirates";

const fmtPrice = (n: number) =>
  Number(n).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const ALREADY_REGISTERED = "you are already registered";

const generateGuestPassword = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$";
  return Array.from({ length: 16 }, () =>
    chars[Math.floor(Math.random() * chars.length)],
  ).join("");
};

function isAlreadyRegisteredMessage(msg: string | undefined): boolean {
  const text = (msg ?? "").toLowerCase();
  return text.includes(ALREADY_REGISTERED) || text.includes("please login to continue");
}

function apiErrorMessage(err: unknown): string {
  return (
    (err as { response?: { data?: { message?: string } } })?.response?.data
      ?.message ?? (err as { message?: string })?.message ?? ""
  );
}

type AuthApiBody = {
  success?: boolean;
  message?: string;
  token?: string;
  plain_password?: string;
  dummy_password?: string;
  password?: string;
  data?: { plain_password?: string; dummy_password?: string; password?: string };
  user?: { plain_password?: string; password?: string };
  customer?: { plain_password?: string; password?: string };
};

function extractPlainPassword(body: AuthApiBody | undefined): string | undefined {
  if (!body) return undefined;
  const candidates = [
    body.plain_password,
    body.dummy_password,
    body.password,
    body.data?.plain_password,
    body.data?.dummy_password,
    body.data?.password,
    body.user?.plain_password,
    body.user?.password,
    body.customer?.plain_password,
    body.customer?.password,
  ];
  return candidates.find((p): p is string => typeof p === "string" && p.length > 0);
}

function authBodyFromUnknown(err: unknown): AuthApiBody | undefined {
  return (err as { response?: { data?: AuthApiBody } })?.response?.data;
}

/** Guest register (loginOrder) then login with the API dummy password.
 *  `success: false` + "already registered / please login" still logs in. */
async function registerGuestAndLogin(
  dispatch: AppDispatch,
  email: string,
  name: string,
  dialCode: string,
  mobile: string,
): Promise<boolean> {
  const guestPassword = generateGuestPassword();
  const guestFormData = new FormData();
  guestFormData.append("name", name);
  guestFormData.append("email", email);
  guestFormData.append("type", "Business");
  guestFormData.append("country_code", dialCode);
  guestFormData.append("is_guest", String(true));
  guestFormData.append("mobile_number", mobile);

  let body: AuthApiBody | undefined;
  try {
    body = await makeApiRequest<AuthApiBody>(apiUrls.REGISTER, {
      method: "POST",
      data: guestFormData,
    });
  } catch (authErr: unknown) {
    body = authBodyFromUnknown(authErr);
    const msg = body?.message ?? apiErrorMessage(authErr);
    if (!isAlreadyRegisteredMessage(msg) && !extractPlainPassword(body)) {
      throw authErr;
    }
  }

  const alreadyOrPleaseLogin = isAlreadyRegisteredMessage(body?.message);
  const password = extractPlainPassword(body) || guestPassword;

  // Dummy password (API or generated) — also login when success is false / please login.
  try {
    await dispatch(loginUser({ email, password })).unwrap();
    return true;
  } catch (loginErr) {
    if (alreadyOrPleaseLogin) {
      return !!(typeof window !== "undefined" && localStorage.getItem("token"));
    }
    throw loginErr;
  }
}

// ── Small Breadcrumb ──────────────────────────────────────────────────────────
const QuoteBreadcrumb = () => (
  <nav className="bg-white border-b border-gray-100">
    <div className="global-container">
      <ol className="flex items-center flex-wrap gap-y-1 h-10 text-xs">
        <li className="flex items-center">
          <Link
            href="/"
            className="text-gray-400 hover:text-[#186737] transition-colors flex items-center gap-1"
          >
            <Home size={11} />
            Home
          </Link>
        </li>
        <li className="flex items-center">
          <ChevronRight size={12} className="mx-1.5 text-gray-300" />
          <span className="text-[#186737] font-semibold">Create Quotation</span>
        </li>
      </ol>
    </div>
  </nav>
);

// ── Field wrapper ─────────────────────────────────────────────────────────────
const Field = ({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-[#145c30]">
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

const inputCls =
  "w-full h-10 px-3 rounded-[7px] border border-emerald-200 text-sm text-gray-900 outline-none focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/15 transition-all placeholder:text-emerald-700/40 bg-white";

// ── Product Row ───────────────────────────────────────────────────────────────
const ProductRow = ({
  product,
  onQtyChange,
  onRemove,
}: {
  product: QuoteProduct;
  onQtyChange: (id: number, qty: number) => void;
  onRemove: (id: number) => void;
}) => {
  const lineTotal = product.price * product.qty;

  return (
    <tr className="border-t border-gray-100 align-top group">
      {/* Product Details */}
      <td className="py-4 pr-4">
        <div className="flex gap-3">
          <div className="w-16 h-16 shrink-0 rounded-[7px] bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain p-1.5"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "https://placehold.co/64x64/f3f4f6/9ca3af?text=No+Img";
              }}
            />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
              {product.name}
            </p>
            <p className="text-xs text-[#186737] font-semibold mt-0.5">
              Brand: {product.brand}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Item No:{" "}
              <span className="text-[#186737] font-medium">{product.sku}</span>
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Warranty:{" "}
              <span className="font-medium text-gray-700">{product.warranty}</span>
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Shipping Charge:{" "}
              <span className="font-medium text-gray-700">
                ${fmtPrice(product.shippingCost)}
              </span>{" "}
              Mostly ships in {product.deliveryDays}
            </p>
            <button
              onClick={() => onRemove(product.id)}
              className="mt-1.5 text-[11px] text-red-500 hover:text-red-700 hover:underline font-semibold flex items-center gap-1 transition-colors"
            >
              <Trash2 size={11} />
              Delete
            </button>
          </div>
        </div>
      </td>

      {/* Limit Price */}
      <td className="py-4 pr-4 whitespace-nowrap">
        <span className="text-sm font-semibold text-gray-800">
          ${fmtPrice(product.price)}
        </span>
      </td>

      {/* Quantity */}
      <td className="py-4 pr-4">
        <div className="flex items-center border border-[#BCE3C9] rounded-[5px] overflow-hidden bg-white w-fit">
          <button
            onClick={() => onQtyChange(product.id, Math.max(1, product.qty - 1))}
            disabled={product.qty <= 1}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Minus size={13} className="text-gray-600" strokeWidth={2} />
          </button>
          <span className="w-8 text-center text-sm font-bold text-[#186737]">
            {product.qty}
          </span>
          <button
            onClick={() => onQtyChange(product.id, Math.min(99, product.qty + 1))}
            disabled={product.qty >= 99}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Plus size={13} className="text-gray-600" strokeWidth={2} />
          </button>
        </div>
      </td>

      {/* Total */}
      <td className="py-4 whitespace-nowrap">
        <span className="text-sm font-bold text-gray-900">
          ${fmtPrice(lineTotal)}
        </span>
      </td>
    </tr>
  );
};

// ── Mobile Product Card ───────────────────────────────────────────────────────
const MobileProductCard = ({
  product,
  onQtyChange,
  onRemove,
}: {
  product: QuoteProduct;
  onQtyChange: (id: number, qty: number) => void;
  onRemove: (id: number) => void;
}) => {
  const lineTotal = product.price * product.qty;

  return (
    <div className="border border-gray-100 rounded-[7px] p-4 bg-white">
      <div className="flex gap-3">
        <div className="w-16 h-16 shrink-0 rounded-[7px] bg-gray-50 border border-gray-100 flex items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain p-1.5"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "https://placehold.co/64x64/f3f4f6/9ca3af?text=No+Img";
            }}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
            {product.name}
          </p>
          <p className="text-xs text-[#186737] font-semibold mt-0.5">
            {product.brand}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">SKU: {product.sku}</p>
        </div>
      </div>

      <div className="mt-3 space-y-1">
        <p className="text-xs text-gray-500">
          Warranty:{" "}
          <span className="font-medium text-gray-700">{product.warranty}</span>
        </p>
        <p className="text-xs text-gray-500">
          Ships in {product.deliveryDays} · Shipping: ${fmtPrice(product.shippingCost)}
        </p>
      </div>

      <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center border border-[#BCE3C9] rounded-[5px] overflow-hidden bg-white">
          <button
            onClick={() => onQtyChange(product.id, Math.max(1, product.qty - 1))}
            disabled={product.qty <= 1}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 transition-colors"
          >
            <Minus size={13} className="text-gray-600" strokeWidth={2} />
          </button>
          <span className="w-8 text-center text-sm font-bold text-[#186737]">
            {product.qty}
          </span>
          <button
            onClick={() => onQtyChange(product.id, Math.min(99, product.qty + 1))}
            disabled={product.qty >= 99}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 transition-colors"
          >
            <Plus size={13} className="text-gray-600" strokeWidth={2} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-gray-900">
            ${fmtPrice(lineTotal)}
          </span>
          <button
            onClick={() => onRemove(product.id)}
            className="text-red-400 hover:text-red-600 transition-colors"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────
export default function CreateQuotationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const isEditMode = !!editId;
  const [editLoading, setEditLoading] = useState(isEditMode);
  const [editLoadError, setEditLoadError] = useState(false);
  // Fields the create form has no UI for — carried over unchanged from the original quote.
  const editCarryOverRef = useRef({
    is_lift_gate: false,
    is_residential_address: false,
    is_inside_delivery: false,
    coupon_id: null as number | null,
  });
  const [products, setProducts] = useState<QuoteProduct[]>(INITIAL_PRODUCTS);
  const quoteHydrated = useRef(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [quoteStep, setQuoteStep] = useState<QuoteProcessStep>("idle");
  const [quoteSuccess, setQuoteSuccess] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const locationFromRedux = useLocationData();
  const country = useSelector((s: RootState) => s.country);

  // ── Country / State / City lookup state ─────────────────────────────────────
  const [countries, setCountries] = useState<CountryItem[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(true);
  const [cities, setCities] = useState<LookupItem[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(false);

  // ── Coupon state ──────────────────────────────────────────────────────────────
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponInfo, setCouponInfo] = useState<{
    coupon_id: number;
    coupon_code: string;
    discount_type: string;
    discount_value: number;
  } | null>(null);
  const [discount, setDiscount] = useState(0);

  // get customer profile from redux and prefill the form if available
  const customerProfile = useSelector((s: RootState) => s?.profile?.customer );
  const [pendingAddress, setPendingAddress] = useState<DefaultAddressCache | null>(null);
  const autofillDone = useRef(false);
  // Fetch country details (dial code + flag icon) once we know the visitor's country
  useEffect(() => {
    if (locationFromRedux?.country) {
      dispatch(fetchCountryByName(locationFromRedux.country));
    }
  }, [locationFromRedux?.country, dispatch]);

  const dialCode = country.data?.phone_code ?? "";
  const isoCode = locationFromRedux?.countryCode ?? "";
  const detectedCountry = country.data?.name ?? locationFromRedux?.country ?? "";
  const countryId = country.data?.id as number | undefined;

  const [licenseFile, setLicenseFile] = useState<File | null>(null);

  const formik = useFormik({
    initialValues: {
      company_name: "",
      name: "",
      email: "",
      mobile_number: "",
      country: "",
      state: "",
      city: "",
      payment_mode: "",
      quote_name: "",
      register_customer: false,
    },
    validationSchema: createQuotationSchema,
    validateOnBlur: true,
    validateOnChange: true,
    onSubmit: async (values) => {
      if (products.length === 0) {
        setSubmitError("Please add at least one product to generate a quotation.");
        return;
      }
      setSubmitError("");
      setSubmitting(true);
      setQuoteSuccess(false);
      setQuoteStep("details");
      try {
        const email = values.email.trim();
        const mobile = values.mobile_number.replace(/\D/g, "");
        const countryIsUAE = values.country === UAE;
        let customerAddressId: number | undefined;

        const quoteSubtotal = products.reduce((s, p) => s + p.price * p.qty, 0);
        const uaeShipping = countryIsUAE ? getUaeOrderShipping(quoteSubtotal) : null;
        const productsPayload = products.map((p, index) => ({
          product_id: p.id,
          vendor_id: p.vendorId ?? 0,
          quantity: p.qty,
          shipping_charge: countryIsUAE
            ? (index === 0 ? (uaeShipping ?? 0) : 0)
            : p.shippingCost,
          accessory_item_ids: p.accessoryItemIds ?? [],
        }));

        // ── Edit mode: update the existing quote ──────────────────────────────
        if (isEditMode) {
          const updatePayload = {
            company_name: values.company_name.trim() || undefined,
            customer_address_id: customerAddressId,
            is_lift_gate: editCarryOverRef.current.is_lift_gate,
            is_residential_address: editCarryOverRef.current.is_residential_address,
            is_inside_delivery: editCarryOverRef.current.is_inside_delivery,
            tax_percentage: countryIsUAE ? UAE_VAT_RATE * 100 : 0,
            coupon_id: couponInfo?.coupon_id ?? editCarryOverRef.current.coupon_id ?? undefined,
            discount: discount || undefined,
            payment_mode: values.payment_mode || "",
            products: productsPayload,
          };

          setQuoteStep("quote");
          await makeApiRequest(apiUrls.QUOTE_UPDATE(editId!), {
            method: "PUT",
            data: updatePayload,
          });
          setQuoteStep("done");
          setSubmitted(true);
          setQuoteSuccess(true);
          setTimeout(() => router.push("/"), 5000);
          return;
        }

        const buildQuotePayload = (_addressId: number | undefined) => ({
          company_name: values.company_name.trim(),
          name: values.name.trim(),
          email,
          country_code: dialCode,
          mobile_number: mobile,
          quote_name: "",
          customer_notes: "",
          register_customer: values.register_customer,
          address: "",
          address2: "",
          country: values.country,
          state: "",
          city: values.city.trim(),
          zip_code: "",
          tax_percentage: countryIsUAE ? UAE_VAT_RATE * 100 : 0,
          coupon_id: couponInfo?.coupon_id,
          discount: discount || undefined,
          payment_mode: "",
          products: productsPayload,
          emails: [email],
        });

        type QuoteCreateRes = {
          success?: boolean;
          message?: string;
          data?: {
            id?: number;
            quote_id?: number;
            quote_number?: string;
            quote_name?: string;
            company_name?: string;
          };
          id?: number;
          quote_id?: number;
          quote_number?: string;
        };

        const postQuote = (addressId: number | undefined) => {
          const payload = buildQuotePayload(addressId);
          const fd = new FormData();
          Object.entries(payload).forEach(([key, val]) => {
            if (val === undefined || val === null) return;
            if (typeof val === "object") fd.append(key, JSON.stringify(val));
            else fd.append(key, String(val));
          });
          if (licenseFile) fd.append("trade_license", licenseFile);
          else fd.append("trade_license", "");
          return makeApiRequest<QuoteCreateRes>(apiUrls.QUOTES, {
            method: "POST",
            data: fd,
          });
        };

        const loginFromAuthBody = async (body: AuthApiBody | undefined) => {
          const password = extractPlainPassword(body);
          if (!password) return false;
          await dispatch(loginUser({ email, password })).unwrap();
          return true;
        };

        setQuoteStep("quote");
        let res: QuoteCreateRes;
        try {
          res = await postQuote(customerAddressId);
          if (res?.success === false) {
            const err = { response: { data: res } };
            throw err;
          }
        } catch (quoteErr: unknown) {
          const body = authBodyFromUnknown(quoteErr) ?? (quoteErr as { response?: { data?: AuthApiBody } })?.response?.data;
          const msg = body?.message ?? apiErrorMessage(quoteErr);

          if (!isAlreadyRegisteredMessage(msg)) {
            throw quoteErr;
          }

          // "Please login to continue" — always log in, then retry quote.
          let didLogin = await loginFromAuthBody(body);
          if (!didLogin) {
            didLogin = await registerGuestAndLogin(
              dispatch,
              email,
              values.name.trim(),
              dialCode,
              mobile,
            );
          }
          if (!didLogin) {
            throw quoteErr;
          }

          res = await postQuote(undefined);
          if (res?.success === false) {
            throw { response: { data: res } };
          }
        }

        setQuoteStep("email");
        const quoteId = res?.data?.id ?? res?.data?.quote_id ?? res?.id ?? res?.quote_id;
        if (quoteId) {
          try {
            const blob = await makeApiRequest<Blob>(apiUrls.QUOTE_DOWNLOAD_PDF(quoteId), {
              responseType: "blob",
            });
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = blobUrl;
            a.download = buildQuotePdfFilename({
              quoteName: res?.data?.quote_name || values.quote_name,
              businessName: res?.data?.company_name || values.company_name,
              quoteNumber: res?.data?.quote_number ?? res?.quote_number,
              quoteId,
            });
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(blobUrl);
          } catch {
            /* quote already created */
          }
        }

        setQuoteStep("done");
        setSubmitted(true);
        clearQuoteList();
        setProducts([]);

        setQuoteSuccess(true);
        setTimeout(() => router.push("/"), 5000);
      } catch (err: unknown) {
        setQuoteStep("idle");
        setQuoteSuccess(false);
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data
            ?.message ?? "Failed to generate quotation. Please try again.";
        setSubmitError(msg);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const isUAE = formik.values.country === UAE;
  // Sourced from the `frontend/countries/...` API response in Redux (state.country.data),
  // same as checkout — real currency for whichever country is selected, not a fixed value.
  const currencySymbol = country?.data?.currency_symbol ?? "";

  // ── Edit mode: load the existing quote (?id=) and prefill this same form ────────
  const editFetchDone = useRef(false);
  useEffect(() => {
    if (!editId || editFetchDone.current) return;
    editFetchDone.current = true;
    (async () => {
      try {
        const res = await makeApiRequest<{ success: boolean; data: ApiQuoteDetail }>(
          `${apiUrls.QUOTES}/${editId}`,
        );
        if (!res.success) {
          setEditLoadError(true);
          return;
        }
        const q = res.data;

        if (q.status !== "Pending") {
          setEditLoadError(true);
          return;
        }

        formik.setFieldValue("company_name", q.company_name ?? "");
        formik.setFieldValue("name", q.customer?.name ?? "");
        formik.setFieldValue("email", q.customer?.email ?? "");
        formik.setFieldValue("mobile_number", q.customer?.mobile_number ?? "");
        formik.setFieldValue("payment_mode", q.payment_mode || "Credit Card");
        formik.setFieldValue("register_customer", false);

        editCarryOverRef.current = {
          is_lift_gate: q.is_lift_gate === 1,
          is_residential_address: q.is_residential_address === 1,
          is_inside_delivery: q.is_inside_delivery === 1,
          coupon_id: q.coupon_id ?? null,
        };
        setDiscount(Number(q.discount) || 0);

        setProducts(
          q.quote_products.map((item) => ({
            id: item.product.id,
            name: item.product.name?.en || item.product.name?.ar || "",
            brand: item.product.brand?.name?.en || item.product.brand?.name?.ar || "",
            sku: item.product.sku,
            image: item.product.image_urls?.en?.[0] ?? "",
            warranty:
              item.product.warranty_attribute?.en ||
              item.product.warranty_attribute?.ar ||
              "—",
            deliveryDays: item.product_supplier?.delivery_days ?? "",
            shippingCost: Number(item.shipping_charge) || 0,
            price: Number(item.unit_price) || 0,
            qty: item.quantity,
            vendorId: item.vendor_id ?? 0,
            accessoryItemIds: (item.accessory_charges ?? []).map(
              (a) => a.accessory_item_id,
            ),
          })).reverse(),
        );
      } catch {
        setEditLoadError(true);
      } finally {
        setEditLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editId]);

  const phoneValidation = usePhoneValidation(
    formik.values.mobile_number.replace(/\D/g, ""),
    isoCode,
  );

  const err = (field: keyof typeof formik.values): string | undefined => {
    const touched = formik.touched[field];
    const error = formik.errors[field];
    return touched ? (error as string | undefined) : undefined;
  };

  // Fetch full countries list for the dropdown (once)
  useEffect(() => {
    setCountriesLoading(true);
    makeApiRequest<CountriesResponse>(apiUrls.COUNTRIES)
      .then((res) => setCountries(res.data ?? []))
      .catch(() => setCountries([]))
      .finally(() => setCountriesLoading(false));
  }, []);

  // Default the address country to the visitor's detected country, once —
  // skipped when a saved default address will be restored instead.
  useEffect(() => {
    if (detectedCountry && !formik.values.country && !getDefaultAddressCache()) {
      formik.setFieldValue("country", detectedCountry);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detectedCountry]);

  // If logged in: prefill contact details from the customer profile, and the
  // shipping address from the locally cached default address.
  useEffect(() => {
    if (!customerProfile || autofillDone.current) return;
    autofillDone.current = true;

    formik.setFieldValue("name", customerProfile.name ?? "");
    formik.setFieldValue("email", customerProfile.email ?? "");
    formik.setFieldValue("mobile_number", customerProfile.mobile_number ?? "");
    formik.setFieldValue("register_customer", false);
    if (customerProfile.business_detail?.business_name) {
      formik.setFieldValue("company_name", customerProfile.business_detail.business_name);
    }

    const cached = getDefaultAddressCache();
    if (cached?.country) {
      formik.setFieldValue("country", cached.country);
      if (cached.city) formik.setFieldValue("city", cached.city);
      dispatch(fetchCountryByName(cached.country));
      setPendingAddress(cached);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerProfile]);

  // Once cities have loaded, auto-select the matching cached city
  useEffect(() => {
    if (!pendingAddress?.city || cities.length === 0) return;
    const match = cities.find((c) => c.name.toLowerCase() === pendingAddress.city!.toLowerCase());
    if (match) {
      formik.setFieldValue("city", match.name);
      setPendingAddress(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cities]);

  useEffect(() => {
    if (!countryId) return;
    setCities([]);
    setCitiesLoading(true);
    makeApiRequest<LookupResponse>("frontend/countries/lookup", {
      params: { country_id: countryId, type: "cities" },
    })
      .then((res) => setCities(res.data ?? []))
      .catch(() => setCities([]))
      .finally(() => setCitiesLoading(false));
  }, [countryId]);

  useEffect(() => {
    if (isEditMode || quoteHydrated.current) return;
    quoteHydrated.current = true;
    const stored = getQuoteList();
    if (stored.length) {
      setProducts(
        stored.map(({ product: _product, ...item }) => item),
      );
    }
  }, [isEditMode]);

  const handleQtyChange = (id: number, qty: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, qty } : p))
    );
    updateQuoteQty(id, qty);
  };

  const handleRemove = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    removeFromQuote(id);
  };

  const handleAddProduct = (p: SearchProduct) => {
    setProducts((prev) => {
      if (prev.some((existing) => existing.id === p.id)) return prev;
      const supplier = p.suppliers?.[0];
      const next = {
        id: p.id,
        name: p.name?.en ?? "",
        brand: "",
        sku: p.sku,
        image: p.images?.en?.[0] ?? "",
        warranty: "—",
        deliveryDays: supplier?.delivery_days ?? "",
        shippingCost: supplier?.shipping_charge ?? 0,
        price: p.sale_price > 0 ? p.sale_price : p.price,
        qty: 1,
        vendorId: supplier?.vendor_id,
        accessoryItemIds: [] as number[],
      };
      addToQuote({ ...next, product: p });
      return [next, ...prev];
    });
  };

  // ── Coupon handlers ───────────────────────────────────────────────────────────
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }
    setCouponLoading(true);
    setCouponError("");
    try {
      const res = await makeApiRequest<{
        success: boolean;
        message: string;
        data: {
          coupon_id: number;
          coupon_code: string;
          discount_type: "fixed" | "percentage";
          discount_value: string;
        };
      }>(`customer/check-coupon?coupon_code=${couponCode}&orderValue=${subtotal.toFixed(2)}`);

      if (res?.success && res?.data) {
        const { coupon_id, coupon_code, discount_type, discount_value } = res.data;
        const dv = Number(discount_value);
        const discountAmount = discount_type === "fixed" ? dv : (subtotal * dv) / 100;

        if (discountAmount > subtotal) {
          setCouponError(
            `Coupon discount exceeds your order subtotal (${currencySymbol}${fmtPrice(subtotal)}). This coupon cannot be applied.`
          );
          return;
        }

        setCouponInfo({ coupon_id, coupon_code, discount_type, discount_value: dv });
        setDiscount(discountAmount);
        setCouponApplied(true);
      } else {
        setCouponError(res?.message || "Invalid coupon code");
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Failed to apply coupon. Try again.";
      setCouponError(msg);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setCouponApplied(false);
    setCouponInfo(null);
    setCouponError("");
    setDiscount(0);
  };

  // ── Totals ────────────────────────────────────────────────────────────────────
  const subtotal = products.reduce((s, p) => s + p.price * p.qty, 0);
  const itemShipping = products.reduce((s, p) => s + p.shippingCost * p.qty, 0);
  const shipping = isUAE ? getUaeOrderShipping(subtotal) : itemShipping;
  const freeShippingRemaining = isUAE
    ? Math.max(0, UAE_FREE_SHIPPING_MIN - subtotal)
    : 0;
  const cappedDiscount = Math.min(discount, subtotal);
  const taxableAmount = Math.max(0, subtotal - cappedDiscount + shipping);
  const taxRate = isUAE ? UAE_VAT_RATE : 0;
  const tax = taxableAmount * taxRate;
  const grandTotal = taxableAmount + tax;

  const handleGenerate = () => {
    if (phoneValidation.isInvalid || phoneValidation.validating) return;
    formik.handleSubmit();
  };

  if (isEditMode && editLoading) {
    return (
      <>
        <QuoteBreadcrumb />
        <main className="min-h-screen bg-gray-50/60">
          <div className="global-container py-6 sm:py-8 animate-pulse">
            <div className="mb-6 space-y-2">
              <div className="h-6 bg-gray-200 rounded w-64" />
              <div className="h-3 bg-gray-100 rounded w-96 max-w-full" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px] gap-6 items-start">
              {/* LEFT */}
              <div className="space-y-5">
                {[6, 4, 3].map((rows, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden"
                  >
                    <div className="px-5 py-3.5 border-b border-gray-100">
                      <div className="h-4 bg-gray-200 rounded w-40" />
                    </div>
                    <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {Array.from({ length: rows }).map((_, j) => (
                        <div key={j} className="space-y-1.5">
                          <div className="h-3 bg-gray-100 rounded w-20" />
                          <div className="h-10 bg-gray-100 rounded-[7px]" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* RIGHT */}
              <div className="space-y-4">
                <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-gray-100">
                    <div className="h-4 bg-gray-200 rounded w-28" />
                  </div>
                  <div className="p-5 space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex justify-between">
                        <div className="h-3 bg-gray-100 rounded w-16" />
                        <div className="h-3 bg-gray-100 rounded w-14" />
                      </div>
                    ))}
                    <div className="h-11 bg-gray-200 rounded-[7px] mt-2" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (isEditMode && editLoadError) {
    return (
      <>
        <QuoteBreadcrumb />
        <main className="min-h-screen bg-gray-50/60">
          <div className="global-container py-6 sm:py-8">
            <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm py-20 text-center">
              <AlertCircle size={40} className="mx-auto text-amber-200 mb-3" />
              <p className="text-sm font-semibold text-gray-500">
                This quote could not be loaded for editing — it may no longer be Pending.
              </p>
              <Link
                href="/dashboard/quotes"
                className="mt-3 inline-block text-xs text-[#186737] hover:underline font-medium"
              >
                Back to My Quotes
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <QuoteBreadcrumb />
      <main className="min-h-screen bg-gray-50/60">
        <div className="global-container py-6 sm:py-8">
          {/* Page title */}
          <div className="mb-4">
            <h1 className="text-xl sm:text-2xl font-bold text-[#186737]">
              {isEditMode ? "Edit Your Quotation" : "Your Customized Quotation"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {isEditMode
                ? "Update the details below and save your changes."
                : "Fill in your details and review the products before confirming."}
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_300px] gap-5 items-start">
            <div className="grid grid-cols-1 lg:grid-cols-[480px_minmax(0,1fr)] gap-5 items-stretch">
              {/* Customer Information */}
              <section className="rounded-[7px] border border-emerald-200 shadow-sm overflow-hidden h-fit bg-gradient-to-b from-[#e8f6ee] via-white to-[#fff8e8]">
                <div className="px-4 py-2.5 flex items-center gap-2 bg-[#186737]">
                  <User size={15} className="text-[#f5c451]" />
                  <h2 className="font-bold text-white text-sm">
                    Your Information
                  </h2>
                </div>

                <div className="p-4 grid grid-cols-1 gap-3">
                  <Field label="Name" required>
                    <div className="relative">
                      <User
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#186737]"
                      />
                      <input
                        name="name"
                        className={`${inputCls} pl-9 h-9`}
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Full name"
                      />
                    </div>
                    {err("name") && (
                      <p className="text-[11px] text-red-500 mt-1">{err("name")}</p>
                    )}
                  </Field>

                  <Field label="Company Name" required>
                    <div className="relative">
                      <Building2
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#186737]"
                      />
                      <input
                        name="company_name"
                        className={`${inputCls} pl-9 h-9`}
                        value={formik.values.company_name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Your company name"
                      />
                    </div>
                    {err("company_name") && (
                      <p className="text-[11px] text-red-500 mt-1">{err("company_name")}</p>
                    )}
                  </Field>

                  <Field label="Email" required>
                    <div className="relative">
                      <Mail
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#186737]"
                      />
                      <input
                        type="email"
                        name="email"
                        disabled={!!customerProfile}
                        className={`${inputCls} pl-9 h-9 ${customerProfile ? "cursor-not-allowed bg-gray-50 text-gray-400" : ""}`}
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="you@company.com"
                      />
                    </div>
                    {err("email") && (
                      <p className="text-[11px] text-red-500 mt-1">{err("email")}</p>
                    )}
                  </Field>

                  <Field label="Cell Phone Number" required>
                    <div
                      className={`flex h-9 rounded-[7px] border overflow-hidden transition-all ${
                        err("mobile_number") || phoneValidation.isInvalid
                          ? "border-red-400"
                          : "border-emerald-200 focus-within:border-[#186737] focus-within:ring-2 focus-within:ring-[#186737]/15"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 px-3 bg-emerald-50 border-r border-emerald-200 shrink-0">
                        {country.loading ? (
                          <span className="text-xs text-gray-400 animate-pulse">...</span>
                        ) : (
                          <>
                            {country.data?.icon && (
                              <img src={country.data.icon} alt="Country" className="w-4 h-4" />
                            )}
                            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                              {dialCode}
                            </span>
                          </>
                        )}
                      </div>
                      <input
                        type="tel"
                        name="mobile_number"
                        inputMode="numeric"
                        className="flex-1 px-3 text-sm outline-none placeholder:text-gray-400 bg-white"
                        value={formik.values.mobile_number}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="50 123 4567"
                      />
                    </div>
                    {err("mobile_number") && (
                      <p className="text-[11px] text-red-500 mt-1">{err("mobile_number")}</p>
                    )}
                    {!err("mobile_number") && phoneValidation.isInvalid && (
                      <p className="text-[11px] text-red-500 mt-1">{phoneValidation.errorMsg}</p>
                    )}
                  </Field>

                  <Field label="Country" required>
                    <SearchableSelect
                      options={countries}
                      value={formik.values.country}
                      onChange={(name) => {
                        formik.setFieldValue("country", name);
                        formik.setFieldValue("state", "");
                        formik.setFieldValue("city", "");
                        formik.setFieldTouched("country", true, false);
                        dispatch(fetchCountryByName(name));
                      }}
                      placeholder="Select Country"
                      searchPlaceholder="Search country…"
                      loading={countriesLoading}
                      error={!!err("country")}
                    />
                    {err("country") && (
                      <p className="text-[11px] text-red-500 mt-1">{err("country")}</p>
                    )}
                  </Field>

                  <Field label="City" required>
                    {cities.length > 0 ? (
                      <SearchableSelect
                        options={cities}
                        value={formik.values.city}
                        onChange={(name) => {
                          formik.setFieldValue("city", name);
                          formik.setFieldTouched("city", true, false);
                        }}
                        placeholder="Select City"
                        searchPlaceholder="Search city…"
                        loading={citiesLoading}
                        disabled={!countryId}
                        error={!!err("city")}
                      />
                    ) : (
                      <input
                        name="city"
                        className={`${inputCls} h-9`}
                        value={formik.values.city}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder={countryId ? "Enter city" : "Select country first"}
                        disabled={!countryId && !formik.values.country}
                      />
                    )}
                    {err("city") && (
                      <p className="text-[11px] text-red-500 mt-1">{err("city")}</p>
                    )}
                  </Field>

                  <Field label="Trade License (optional)">
                    <label className="flex items-center gap-2 h-9 px-3 rounded-[7px] border border-dashed border-[#186737]/50 bg-emerald-50 cursor-pointer hover:border-[#186737] hover:bg-emerald-100/70 transition-colors">
                      <FileText size={14} className="text-[#186737] shrink-0" />
                      <span className="text-xs text-[#186737] truncate">
                        {licenseFile ? licenseFile.name : "Upload trade license"}
                      </span>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.webp"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0] ?? null;
                          setLicenseFile(file);
                        }}
                      />
                    </label>
                  </Field>

                  {!customerProfile && (
                    <div>
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          name="register_customer"
                          checked={formik.values.register_customer}
                          onChange={formik.handleChange}
                          className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#186737] focus:ring-[#186737]/30 cursor-pointer"
                        />
                        <span className="text-xs font-medium text-gray-600">
                          Kindly create an account using the details below so my information can be securely saved for future quotations.
                        </span>
                      </label>
                    </div>
                  )}
                </div>
              </section>

              {/* Quotation Details */}
              <section className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-0 lg:h-0 lg:min-h-full">
                <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2 shrink-0">
                  <FileText size={15} className="text-[#186737]" />
                  <h2 className="font-bold text-gray-900 text-sm">
                    Quotation Details
                  </h2>
                  <span className="mr-auto text-xs text-gray-400 font-medium">
                    {products.length} product{products.length !== 1 ? "s" : ""}
                  </span>
               
                  <button
                    onClick={() => setAddModalOpen(true)}
                    className="flex items-center gap-1.5 bg-transparent text-[#186737] text-sm font-semibold underline underline-offset-2 hover:text-[#145c30] transition-colors"
                  >
                    <Plus size={15} strokeWidth={2.5} />
                    Add More Products
                  </button>
           
                </div>
               

                {products.length === 0 ? (
                  <div className="p-10 text-center">
                    <FileText size={32} className="text-gray-200 mx-auto mb-3" />
                    <p className="text-sm text-gray-400">No products added yet.</p>
                  </div>
                ) : (
                  <>
                    {/* Desktop table */}
                    <div className="quote-scroll hidden md:block flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
                      <table className="w-full">
                        <thead className="sticky top-0 z-10">
                          <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">
                              Product Details
                            </th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3 whitespace-nowrap">
                              Limit Price
                            </th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">
                              Quantity
                            </th>
                            <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-4 py-3">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody className="px-5">
                          {products.map((p) => (
                            <tr key={p.id} className="border-t border-gray-100 align-top group">
                              <td className="py-4 pl-5 pr-4">
                                <div className="flex gap-3">
                                  <div className="w-16 h-16 shrink-0 rounded-[7px] bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center">
                                    <img
                                      src={p.image}
                                      alt={p.name}
                                      className="w-full h-full object-contain p-1.5"
                                      onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).src =
                                          "https://placehold.co/64x64/f3f4f6/9ca3af?text=No+Img";
                                      }}
                                    />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
                                      {p.name}
                                    </p>
                                    {p.brand && (
                                      <p className="text-xs text-[#186737] font-semibold mt-0.5">
                                        Brand: {p.brand}
                                      </p>
                                    )}
                                    <p className="text-xs text-gray-500 mt-0.5">
                                      SKU #:{" "}
                                      <span className="text-[#186737] font-medium">
                                        {p.sku}
                                      </span>
                                    </p>
                                    {/* <p className="text-xs text-gray-500 mt-0.5">
                                      Warranty:{" "}
                                      <span className="font-medium text-gray-700">
                                        {p.warranty}
                                      </span>
                                    </p> */}
                                    <p className="text-xs text-gray-500 mt-0.5">
                                      {/* Shipping Charge:{" "} */}
                                      <span className="font-medium text-gray-700 inline-flex items-center gap-0.5">
                                        <CurrencySymbol currency={currencySymbol} fontsize="11px" />
                                        {fmtPrice(p.price)}
                                      </span>{" "}
                                      Mostly ships in {p.deliveryDays}
                                    </p>
                                    <button
                                      onClick={() => handleRemove(p.id)}
                                      className="mt-1.5 text-[11px] text-red-500 hover:text-red-700 hover:underline font-semibold flex items-center gap-1 transition-colors"
                                    >
                                      <Trash2 size={11} />
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 pr-4 pl-3.5 whitespace-nowrap">
                                <span className="text-sm font-semibold text-gray-800">
                                  <CurrencySymbol currency={currencySymbol} fontsize="15px" />
                                  {fmtPrice(p.price)}
                                </span>
                              </td>
                              <td className="py-4 pr-4">
                                <div className="flex items-center border border-[#BCE3C9] rounded-[5px] overflow-hidden bg-white w-fit">
                                  <button
                                    onClick={() => handleQtyChange(p.id, Math.max(1, p.qty - 1))}
                                    disabled={p.qty <= 1}
                                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                  >
                                    <Minus size={13} className="text-gray-600" strokeWidth={2} />
                                  </button>
                                  <span className="w-8 text-center text-sm font-bold text-[#186737]">
                                    {p.qty}
                                  </span>
                                  <button
                                    onClick={() => handleQtyChange(p.id, Math.min(99, p.qty + 1))}
                                    disabled={p.qty >= 99}
                                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                  >
                                    <Plus size={13} className="text-gray-600" strokeWidth={2} />
                                  </button>
                                </div>
                              </td>
                              <td className="py-4 whitespace-nowrap">
                                <span className="text-sm font-bold text-gray-900">
                                  <CurrencySymbol currency={currencySymbol} fontsize="15px" />
                                  {fmtPrice(p.price * p.qty)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile cards */}
                    <div className="quote-scroll md:hidden p-4 space-y-3 overflow-y-auto flex-1 min-h-0">
                      {products.map((p) => (
                        <div key={p.id} className="border border-gray-100 rounded-[7px] p-4">
                          <div className="flex gap-3">
                            <div className="w-16 h-16 shrink-0 rounded-[7px] bg-gray-50 border border-gray-100 flex items-center justify-center">
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-full h-full object-contain p-1.5"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src =
                                    "https://placehold.co/64x64/f3f4f6/9ca3af?text=No+Img";
                                }}
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
                                {p.name}
                              </p>
                              {p.brand && (
                                <p className="text-xs text-[#186737] font-semibold mt-0.5">
                                  {p.brand}
                                </p>
                              )}
                              <p className="text-xs text-gray-500">SKU: {p.sku}</p>
                            </div>
                          </div>
                          <div className="mt-2.5 space-y-1">
                            {/* <p className="text-xs text-gray-500">
                              Warranty:{" "}
                              <span className="font-medium text-gray-700">{p.warranty}</span>
                            </p> */}
                            <p className="text-xs text-gray-500 flex items-center flex-wrap gap-x-1">
                              Ships in {p.deliveryDays} 
                              {/* <span className="inline-flex items-center gap-0.5">
                                <CurrencySymbol currency={currencySymbol} fontsize="11px" />
                                {fmtPrice(p.shippingCost)}
                              </span> */}
                            </p>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              Limit Price:{" "}
                              <span className="font-medium text-gray-700 inline-flex items-center gap-0.5">
                                <CurrencySymbol currency={currencySymbol} fontsize="11px" />
                                {fmtPrice(p.price)}
                              </span>
                            </p>
                          </div>
                          <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center border border-[#BCE3C9] rounded-[5px] overflow-hidden bg-white">
                              <button
                                onClick={() => handleQtyChange(p.id, Math.max(1, p.qty - 1))}
                                disabled={p.qty <= 1}
                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 transition-colors"
                              >
                                <Minus size={13} className="text-gray-600" strokeWidth={2} />
                              </button>
                              <span className="w-8 text-center text-sm font-bold text-[#186737]">
                                {p.qty}
                              </span>
                              <button
                                onClick={() => handleQtyChange(p.id, Math.min(99, p.qty + 1))}
                                disabled={p.qty >= 99}
                                className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 transition-colors"
                              >
                                <Plus size={13} className="text-gray-600" strokeWidth={2} />
                              </button>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-bold text-gray-900 flex items-center gap-0.5">
                                <CurrencySymbol currency={currencySymbol} fontsize="15px" />
                                {fmtPrice(p.price * p.qty)}
                              </span>
                              <button
                                onClick={() => handleRemove(p.id)}
                                className="text-red-400 hover:text-red-600 transition-colors"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Add More Products */}
                {/* <div className="px-5 py-4 border-t border-gray-100 flex justify-end shrink-0">
                  <button
                    onClick={() => setAddModalOpen(true)}
                    className="flex items-center gap-1.5 bg-[#186737] hover:bg-[#145c30] text-white text-sm font-semibold px-4 py-2 rounded-[7px] transition-colors duration-200"
                  >
                    <Plus size={15} strokeWidth={2.5} />
                    Add More Products
                  </button>
                </div> */}
              </section>
            </div>

            {/* ── RIGHT SIDEBAR ─────────────────────────────────────────── */}
            <div className="sticky top-[0px] space-y-4">
              {/* Quote Summary */}
              <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-3.5 border-b border-gray-100">
                  <h2 className="font-bold text-gray-900 text-sm">
                    Quote Summary
                  </h2>
                </div>

                <div className="p-5 space-y-3">
                  {/* Coupon */}
                  <div className="hidden">
                    <div className="hidden gap-2 mb-2">
                      <div className="relative flex-1">
                        <Tag
                          size={14}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => {
                            setCouponCode(e.target.value.toUpperCase());
                            setCouponError("");
                          }}
                          placeholder="Enter coupon code"
                          disabled={couponApplied}
                          className="w-full h-10 pl-9 pr-3 border border-gray-300 rounded-[7px] text-sm outline-none focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 bg-white disabled:bg-gray-50 disabled:text-gray-400"
                        />
                      </div>
                      {couponApplied ? (
                        <button
                          onClick={handleRemoveCoupon}
                          className="h-10 px-4 rounded-[7px] bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium transition-colors border border-red-200"
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          onClick={handleApplyCoupon}
                          disabled={couponLoading || !couponCode}
                          className="h-10 px-4 rounded-[7px] bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-gray-700 text-sm font-medium transition-colors min-w-[68px]"
                        >
                          {couponLoading ? (
                            <Loader2 size={15} className="animate-spin mx-auto" />
                          ) : (
                            "Apply"
                          )}
                        </button>
                      )}
                    </div>
                    {couponError && (
                      <p className="text-[11px] text-red-500 mb-2 flex items-center gap-1">
                        <AlertCircle size={11} /> {couponError}
                      </p>
                    )}
                    {couponApplied && couponInfo && (
                      <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-[7px] px-3 py-2 mb-1">
                        <div>
                          <p className="text-[12px] font-semibold text-emerald-700">
                            {couponInfo.coupon_code}
                          </p>
                          <p className="text-[11px] text-emerald-600 flex items-center gap-0.5">
                            Saving <CurrencySymbol currency={currencySymbol} fontsize="11px" />
                            {fmtPrice(discount)}
                          </p>
                        </div>
                        <Check size={15} className="text-emerald-600" />
                      </div>
                    )}
                  </div>

                  {/* Line items */}
                  <div className="space-y-2.5 pt-1 border-t border-gray-50">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="font-semibold text-gray-900 flex items-center gap-0.5">
                        <CurrencySymbol currency={currencySymbol} fontsize="15px" />
                        {fmtPrice(subtotal)}
                      </span>
                    </div>
                    {cappedDiscount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Discount</span>
                        <span className="font-semibold text-emerald-600 flex items-center gap-0.5">
                          -<CurrencySymbol currency={currencySymbol} fontsize="15px" />
                          {fmtPrice(cappedDiscount)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Shipping</span>
                      {isUAE ? (
                        shipping > 0 ? (
                          <span className="font-semibold text-gray-900 flex items-center gap-0.5">
                            <CurrencySymbol currency={currencySymbol} fontsize="15px" />
                            {fmtPrice(shipping)}
                          </span>
                        ) : (
                          <span className="font-semibold text-green-600">Free</span>
                        )
                      ) : (
                        <span className="font-semibold text-green-600">Free</span>
                      )}
                    </div>
                    {isUAE && freeShippingRemaining > 0 && (
                      <p className="text-[11px] text-gray-500 -mt-1">
                        Add{" "}
                        <CurrencySymbol currency={currencySymbol} fontsize="11px" />
                        {fmtPrice(freeShippingRemaining)} more for free shipping (orders of{" "}
                        <CurrencySymbol currency={currencySymbol} fontsize="11px" />
                        {fmtPrice(UAE_FREE_SHIPPING_MIN)}+)
                      </p>
                    )}
                    {isUAE && (
                      <div className="flex justify-between text-sm items-center">
                        <span className="text-gray-500 flex items-center gap-1">
                          VAT ({(UAE_VAT_RATE * 100).toFixed(0)}%)
                          <Info size={12} className="text-gray-300" />
                        </span>
                        <span className="font-semibold text-gray-900 flex items-center gap-0.5">
                          <CurrencySymbol currency={currencySymbol} fontsize="15px" />
                          {fmtPrice(tax)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                    <span className="font-bold text-gray-900 text-sm">
                      Grand Total
                    </span>
                    <span className="font-bold text-gray-900 text-xl flex items-center gap-0.5">
                      <CurrencySymbol currency={currencySymbol} weight="bold" fontsize="18px" />
                      {fmtPrice(grandTotal)}
                    </span>
                  </div>

                  {/* Quote validity note */}
                  <div className="flex items-start gap-1.5 bg-gray-50 rounded-[7px] p-2.5">
                    <Info size={12} className="text-gray-400 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      This quote is valid for{" "}
                      <span className="font-semibold text-gray-700">7 days</span>{" "}
                      from the date of creation.
                    </p>
                  </div>

                  {submitError && (
                    <p className="text-[11px] text-red-500 flex items-center gap-1">
                      <AlertCircle size={11} /> {submitError}
                    </p>
                  )}

                  {/* CTAs */}
                  <button
                    onClick={handleGenerate}
                    disabled={submitting}
                    className={`w-full py-3 rounded-[7px] font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed ${
                      submitted
                        ? "bg-emerald-600 text-white"
                        : "bg-[#186737] hover:bg-[#145c30] text-white"
                    }`}
                  >
                    {submitting ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : submitted ? (
                      <CheckCircle size={15} />
                    ) : (
                      <FileText size={15} />
                    )}
                    {submitting
                      ? isEditMode
                        ? "Saving…"
                        : "Generating…"
                      : submitted
                        ? isEditMode
                          ? "Saved!"
                          : "Quotation Sent!"
                        : isEditMode
                          ? "Save Changes"
                          : "Generate & Email Quotation"}
                  </button>

                  {/* <button className="w-full py-3 rounded-[7px] font-semibold text-sm flex items-center justify-center gap-2 border border-[#186737] text-[#186737] hover:bg-[#f0f9f4] transition-colors duration-200">
                    <ShoppingCart size={15} />
                    Buy Now
                  </button> */}
                </div>
              </div>

              {/* Need Help */}
              {/* <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#f0f9f4] border-2 border-[#c3e6d4] flex items-center justify-center shrink-0">
                      <MessageCircle size={16} className="text-[#186737]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        Need Help Placing Order
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                        Our Customer Success Team will guide you with every step.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button className="flex items-center justify-center gap-2 py-2.5 rounded-[7px] border border-[#186737] text-[#186737] text-xs font-semibold hover:bg-[#f0f9f4] transition-colors duration-200">
                      <MessageCircle size={13} />
                      Chat Now
                    </button>
                    <button className="flex items-center justify-center gap-2 py-2.5 rounded-[7px] border border-[#186737] text-[#186737] text-xs font-semibold hover:bg-[#f0f9f4] transition-colors duration-200">
                      <Phone size={13} />
                      Call Now
                    </button>
                  </div>
                </div>
              </div> */}
              <CTA/>
            </div>
          </div>
        </div>
      </main>

      <QuoteProcessingModal
        step={quoteStep}
        success={quoteSuccess}
        onGoHome={() => router.push("/")}
      />

      <AddProductModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAddProduct}
        addedIds={products.map((p) => p.id)}
        isUAE={isUAE}
      />
    </>
  );
}
