"use client";

import { apiUrls } from "@/apis/api-endpoint";
import { makeApiRequest } from "@/apis/axios-instance";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { usePhoneValidation } from "@/hooks/usePhoneValidation";
import { loginUser } from "@/store/slices/auth/authSlice";
import { addAddress, type AddressPayload } from "@/store/slices/customer-address/customerAddressSlice";
import { fetchCountryByName } from "@/store/slices/country/countrySlice";
import type { AppDispatch, RootState } from "@/store/store";
import { getDefaultAddressCache, useLocationData, type DefaultAddressCache } from "@/utils/locationStorage";
import { createQuotationSchema } from "@/validation/schema";
import { useFormik } from "formik";
import {
    AlertCircle,
    Building2,
    Check,
    CheckCircle,
    ChevronRight,
    FileText,
    Hash,
    Home,
    Info,
    Loader2,
    Mail,
    MapPin,
    MessageCircle,
    Minus,
    Phone,
    Plus,
    ShoppingCart,
    Tag,
    Trash2,
    User,
    X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AddProductModal, type SearchProduct } from "./_components/add-product-modal";
import CTA from "@/components/cta";

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

// ── Mock Data ─────────────────────────────────────────────────────────────────
const INITIAL_PRODUCTS: QuoteProduct[] = [

];

const UAE_VAT_RATE = 0.05;
const UAE = "United Arab Emirates";
const MAX_EMAILS = 5;

const fmtPrice = (n: number) =>
  Number(n).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

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
    <label className="text-xs font-semibold text-gray-700">
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

const inputCls =
  "w-full h-10 px-3 rounded-[7px] border border-gray-200 text-sm text-gray-900 outline-none focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 transition-all placeholder:text-gray-400 bg-white";

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
              SKU #:{" "}
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
  const [products, setProducts] = useState<QuoteProduct[]>(INITIAL_PRODUCTS);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [addModalOpen, setAddModalOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const locationFromRedux = useLocationData();
  const country = useSelector((s: RootState) => s.country);

  // ── Country / State / City lookup state ─────────────────────────────────────
  const [countries, setCountries] = useState<CountryItem[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(true);
  const [states, setStates] = useState<LookupItem[]>([]);
  const [cities, setCities] = useState<LookupItem[]>([]);
  const [selectedStateId, setSelectedStateId] = useState<number | null>(null);
  const [statesLoading, setStatesLoading] = useState(false);
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
  const customerProfile = useSelector((s: RootState) => s?.profile?.customer);
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

  const formik = useFormik({
    initialValues: {
      company_name: "",
      name: "",
      email: "",
      additionalEmails: [] as { value: string }[],
      mobile_number: "",
      address: "",
      address2: "",
      country: "",
      state: "",
      city: "",
      zip_code: "",
      payment_mode: "Credit Card",
      quote_name: "",
      register_customer: true,
      notes: "",
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
      try {
        // If the customer isn't logged in, register them as a guest (same flow as
        // loginOrder's GuestPanel) and log them in before creating the quote.
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) {
          const guestFormData = new FormData();
          guestFormData.append("name", values.name.trim());
          guestFormData.append("email", values.email.trim());
          guestFormData.append("type", "Business");
          guestFormData.append("country_code", dialCode);
          guestFormData.append("is_guest", String(true));
          guestFormData.append("mobile_number", values.mobile_number.replace(/\D/g, ""));

          const regRes = await makeApiRequest<{
            success: boolean;
            message?: string;
            plain_password?: string;
          }>(apiUrls.REGISTER, { method: "POST", data: guestFormData });

          if (!regRes.success) {
            setSubmitError(regRes.message ?? "Registration failed. Please try again.");
            return;
          }
          if (!regRes.plain_password) {
            setSubmitError("Registration succeeded but no password returned. Please try again.");
            return;
          }

          await dispatch(
            loginUser({ email: values.email.trim(), password: regRes.plain_password })
          ).unwrap();
        }

        // Save the shipping address (same Redux add-address flow used elsewhere),
        // always as the default, then read the saved address back from the local cache.
        const addressPayload: AddressPayload = {
          type: "",
          address: values.address.trim(), 
          country: values.country,
          state: isUAE ? "" : values.state,
          city: values.city,
          zip_code: values.zip_code.trim(),
          is_default: true,
        };
        await dispatch(addAddress(addressPayload)).unwrap();

        const customerAddressId = getDefaultAddressCache()?.id;
        if (!customerAddressId) {
          setSubmitError("Failed to save shipping address. Please try again.");
          return;
        }

        const payload = {
          company_name: values.company_name.trim() || undefined,
          name: values.name.trim(),
          email: values.email.trim(),
          country_code: dialCode,
          mobile_number: values.mobile_number.replace(/\D/g, ""),
          register_customer: values.register_customer,
          customer_address_id: customerAddressId,
          tax_percentage: isUAE ? UAE_VAT_RATE * 100 : 0,
          coupon_id: couponInfo?.coupon_id,
          discount: discount || undefined,
          payment_mode: values.payment_mode,
          products: products.map((p) => ({
            product_id: p.id,
            vendor_id: p.vendorId ?? 0,
            quantity: p.qty,
            shipping_charge: p.shippingCost,
            accessory_item_ids: p.accessoryItemIds ?? [],
          })),
          emails: Array.from(
            new Set(
              [values.email.trim(), ...values.additionalEmails.map((e) => e.value.trim())].filter(Boolean)
            )
          ),
        };

        const res = await makeApiRequest<{
          success?: boolean;
          data?: { id?: number; quote_id?: number };
          id?: number;
          quote_id?: number;
        }>(apiUrls.QUOTES, { method: "POST", data: payload });

        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 2500);

        const quoteId = res?.data?.id ?? res?.data?.quote_id ?? res?.id ?? res?.quote_id;
        if (quoteId) {
          const blob = await makeApiRequest<Blob>(apiUrls.QUOTE_DOWNLOAD_PDF(quoteId), {
            responseType: "blob",
          });
          const blobUrl = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = blobUrl;
          a.download = `quote_${quoteId}.pdf`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(blobUrl);
        }

        window.location.href = "/";
      } catch (err: unknown) {
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

  const phoneValidation = usePhoneValidation(
    formik.values.mobile_number.replace(/\D/g, ""),
    isoCode,
  );

  const err = (field: keyof typeof formik.values): string | undefined => {
    const touched = formik.touched[field];
    const error = formik.errors[field];
    return touched ? (error as string | undefined) : undefined;
  };

  const emailErr = (i: number) => {
    const touched = formik.touched.additionalEmails?.[i]?.value;
    const errors = formik.errors.additionalEmails;
    if (!touched || !Array.isArray(errors)) return undefined;
    const entry = errors[i];
    return typeof entry === "object" && entry ? (entry as { value?: string }).value : undefined;
  };

  const addEmailField = () => {
    if (formik.values.additionalEmails.length >= MAX_EMAILS - 1) return;
    formik.setFieldValue("additionalEmails", [...formik.values.additionalEmails, { value: "" }]);
  };

  const removeEmailField = (i: number) =>
    formik.setFieldValue(
      "additionalEmails",
      formik.values.additionalEmails.filter((_, idx) => idx !== i)
    );

  const setEmailField = (i: number, value: string) =>
    formik.setFieldValue(
      "additionalEmails",
      formik.values.additionalEmails.map((e, idx) => (idx === i ? { value } : e))
    );

  const touchEmailField = (i: number) =>
    formik.setFieldTouched(`additionalEmails[${i}].value`, true);

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
    if (cached) {
      formik.setFieldValue("address", cached.address ?? "");
      formik.setFieldValue("address2", cached.address2 ?? "");
      formik.setFieldValue("zip_code", cached.zip_code ?? "");
      if (cached.country) {
        formik.setFieldValue("country", cached.country);
        dispatch(fetchCountryByName(cached.country));
        setPendingAddress(cached);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerProfile]);

  // Once the restored country's states have loaded, auto-select the matching state
  useEffect(() => {
    if (!pendingAddress?.state || states.length === 0) return;
    const match = states.find((s) => s.name.toLowerCase() === pendingAddress.state!.toLowerCase());
    if (match) {
      formik.setFieldValue("state", match.name);
      setSelectedStateId(match.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [states]);

  // Once the resulting cities have loaded (via state, or directly for UAE), auto-select the matching city
  useEffect(() => {
    if (!pendingAddress?.city || cities.length === 0) return;
    const match = cities.find((c) => c.name.toLowerCase() === pendingAddress.city!.toLowerCase());
    if (match) {
      formik.setFieldValue("city", match.name);
      setPendingAddress(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cities]);

  // Whenever the selected country changes: UAE → cities directly (no state step),
  // any other country → states first, then cities under the chosen state.
  useEffect(() => {
    if (!countryId) return;
    setSelectedStateId(null);
    setStates([]);
    setCities([]);
    if (isUAE) {
      setCitiesLoading(true);
      makeApiRequest<LookupResponse>("frontend/countries/lookup", {
        params: { country_id: countryId, type: "cities" },
      })
        .then((res) => setCities(res.data ?? []))
        .finally(() => setCitiesLoading(false));
    } else {
      setStatesLoading(true);
      makeApiRequest<LookupResponse>("frontend/countries/lookup", {
        params: { country_id: countryId, type: "states" },
      })
        .then((res) => setStates(res.data ?? []))
        .finally(() => setStatesLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryId, isUAE]);

  // Fetch cities once a state is chosen (non-UAE flow only)
  useEffect(() => {
    if (isUAE) return;
    if (!selectedStateId) { setCities([]); return; }
    setCitiesLoading(true);
    setCities([]);
    makeApiRequest<LookupResponse>("frontend/countries/lookup", {
      params: { state_id: selectedStateId, type: "cities" },
    })
      .then((res) => setCities(res.data ?? []))
      .finally(() => setCitiesLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStateId, isUAE]);

  const handleQtyChange = (id: number, qty: number) =>
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, qty } : p))
    );

  const handleRemove = (id: number) =>
    setProducts((prev) => prev.filter((p) => p.id !== id));

  const handleAddProduct = (p: SearchProduct) => {
    setProducts((prev) => {
      if (prev.some((existing) => existing.id === p.id)) return prev;
      const supplier = p.suppliers?.[0];
      return [
        ...prev,
        {
          id: p.id,
          name: p.name?.en ?? "",
          brand: "",
          sku: p.sku,
          image: p.images?.en?.[0] ?? "",
          warranty: "—",
          deliveryDays: supplier?.delivery_days ?? "",
          shippingCost: 0,
          price: p.sale_price > 0 ? p.sale_price : p.price,
          qty: 1,
          vendorId: supplier?.vendor_id,
          accessoryItemIds: [],
        },
      ];
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
            `Coupon discount exceeds your order subtotal ($${fmtPrice(subtotal)}). This coupon cannot be applied.`
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
  const shipping = products.reduce((s, p) => s + p.shippingCost * p.qty, 0);
  const cappedDiscount = Math.min(discount, subtotal);
  const taxableAmount = Math.max(0, subtotal - cappedDiscount + shipping);
  const taxRate = isUAE ? UAE_VAT_RATE : 0;
  const tax = taxableAmount * taxRate;
  const grandTotal = taxableAmount + tax;

  const handleGenerate = () => {
    if (phoneValidation.isInvalid || phoneValidation.validating) return;
    formik.handleSubmit();
  };

  return (
    <>
      <QuoteBreadcrumb />
      <main className="min-h-screen bg-gray-50/60">
        <div className="global-container py-6 sm:py-8">
          {/* Page title */}
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-[#186737]">
              Your Customized Quotation
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Based on your selection, this quotation has been prepared for you.
              Please review before confirming.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px] gap-6 items-start">
            {/* ── LEFT COLUMN ───────────────────────────────────────────── */}
            <div className="space-y-5">
              {/* Customer Information */}
              <section className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
                  <User size={15} className="text-[#186737]" />
                  <h2 className="font-bold text-gray-900 text-sm">
                    Customer Information
                  </h2>
                </div>

                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Company Name">
                    <div className="relative">
                      <Building2
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        name="company_name"
                        className={`${inputCls} pl-9`}
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

                  <Field label="Contact Name" required>
                    <div className="relative">
                      <User
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        name="name"
                        className={`${inputCls} pl-9`}
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

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-gray-700">
                        Email Address<span className="text-red-500 ml-0.5">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={addEmailField}
                        disabled={formik.values.additionalEmails.length >= MAX_EMAILS - 1}
                        className="w-5 h-5 rounded-full flex items-center justify-center bg-[#186737]/10 text-[#186737] hover:bg-[#186737] hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        title="Add another email"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <div className="relative">
                      <Mail
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="email"
                        name="email"
                        className={`${inputCls} pl-9`}
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="you@company.com"
                      />
                    </div>
                    {err("email") && (
                      <p className="text-[11px] text-red-500 mt-1">{err("email")}</p>
                    )}

                    {formik.values.additionalEmails.map((addr, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="flex-1">
                          <div className="relative">
                            <Mail
                              size={14}
                              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                            <input
                              type="email"
                              value={addr.value}
                              onChange={(e) => setEmailField(i, e.target.value)}
                              onBlur={() => touchEmailField(i)}
                              placeholder="additional@company.com"
                              className={`${inputCls} pl-9`}
                            />
                          </div>
                          {emailErr(i) && (
                            <p className="text-[11px] text-red-500 mt-1">{emailErr(i)}</p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeEmailField(i)}
                          className="w-10 h-10 shrink-0 rounded-[7px] flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
                          title="Remove email"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <Field label="Mobile Number" required>
                    <div
                      className={`flex h-10 rounded-[7px] border overflow-hidden transition-all ${
                        err("mobile_number") || phoneValidation.isInvalid
                          ? "border-red-400"
                          : "border-gray-200 focus-within:border-[#186737] focus-within:ring-2 focus-within:ring-[#186737]/10"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 px-3 bg-gray-50 border-r border-gray-200 shrink-0">
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
                        className="flex-1 px-3 text-sm outline-none bg-white placeholder:text-gray-400"
                        value={formik.values.mobile_number}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="(555) 000-0000"
                      />
                    </div>
                    {detectedCountry && !err("mobile_number") && !phoneValidation.isInvalid && !phoneValidation.validating && (
                      <p className="text-[11px] text-gray-400 mt-1">Detected: {detectedCountry}</p>
                    )}
                    {phoneValidation.validating && !err("mobile_number") && (
                      <p className="text-[11px] text-gray-400 mt-1">Validating...</p>
                    )}
                    {err("mobile_number") && (
                      <p className="text-[11px] text-red-500 mt-1">{err("mobile_number")}</p>
                    )}
                    {!err("mobile_number") && phoneValidation.isInvalid && (
                      <p className="text-[11px] text-red-500 mt-1">{phoneValidation.errorMsg}</p>
                    )}
                  </Field>

                  <Field label="Payment Terms">
                    <Select
                      value={formik.values.payment_mode}
                      onValueChange={(val) => {
                        formik.setFieldValue("payment_mode", val);
                        formik.setFieldTouched("payment_mode", true);
                      }}
                    >
                      <SelectTrigger className={`${inputCls} cursor-pointer`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Credit Card">Credit Card</SelectItem>
                        <SelectItem value="Net 30">Net 30</SelectItem>
                        <SelectItem value="Net 60">Net 60</SelectItem>
                        <SelectItem value="Wire Transfer">Wire Transfer</SelectItem>
                        <SelectItem value="Check">Check</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field label="Quote Name">
                    <div className="relative">
                      <Tag
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        name="quote_name"
                        className={`${inputCls} pl-9`}
                        value={formik.values.quote_name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter your quote name"
                      />
                    </div>
                    {err("quote_name") && (
                      <p className="text-[11px] text-red-500 mt-1">{err("quote_name")}</p>
                    )}
                  </Field>

                  {!customerProfile && (
                    <div className="sm:col-span-2">
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          name="register_customer"
                          checked={formik.values.register_customer}
                          onChange={formik.handleChange}
                          className="w-4 h-4 rounded border-gray-300 text-[#186737] focus:ring-[#186737]/30 cursor-pointer"
                        />
                        <span className="text-xs font-medium text-gray-600">
                          Kindly create an account using the details below so my information can be securely saved for future quotations.
                        </span>
                      </label>
                    </div>
                  )}
                </div>
              </section>

              {/* Shipping Address */}
              <section className="bg-white rounded-[7px] border border-gray-100 shadow-sm">
                <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
                  <MapPin size={15} className="text-[#186737]" />
                  <h2 className="font-bold text-gray-900 text-sm">
                    Shipping Address
                  </h2>
                </div>

                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Address" required={!formik.values.address2.trim()}>
                    <input
                      name="address"
                      className={inputCls}
                      value={formik.values.address}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Street address, building, etc."
                    />
                    {err("address") && (
                      <p className="text-[11px] text-red-500 mt-1">{err("address")}</p>
                    )}
                  </Field>

                  <Field label="Address 2">
                    <input
                      name="address2"
                      className={inputCls}
                      value={formik.values.address2}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Apartment, suite, unit, etc. (optional)"
                    />
                    {err("address2") && (
                      <p className="text-[11px] text-red-500 mt-1">{err("address2")}</p>
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

                  {!isUAE && (
                    <Field label="State" required>
                      <SearchableSelect
                        options={states}
                        value={formik.values.state}
                        onChange={(name, id) => {
                          formik.setFieldValue("state", name);
                          formik.setFieldValue("city", "");
                          formik.setFieldTouched("state", true, false);
                          setSelectedStateId(id);
                        }}
                        placeholder="Select State"
                        searchPlaceholder="Search state…"
                        loading={statesLoading}
                        disabled={!countryId}
                        error={!!err("state")}
                      />
                      {err("state") && (
                        <p className="text-[11px] text-red-500 mt-1">{err("state")}</p>
                      )}
                    </Field>
                  )}

                  <Field label="City" required>
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
                      disabled={isUAE ? !countryId : !selectedStateId}
                      error={!!err("city")}
                    />
                    {err("city") && (
                      <p className="text-[11px] text-red-500 mt-1">{err("city")}</p>
                    )}
                  </Field>

                  <Field label="Zip Code" required>
                    <div className="relative">
                      <Hash
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        name="zip_code"
                        className={`${inputCls} pl-9`}
                        value={formik.values.zip_code}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="00000"
                      />
                    </div>
                    {err("zip_code") && (
                      <p className="text-[11px] text-red-500 mt-1">{err("zip_code")}</p>
                    )}
                  </Field>
                </div>
              </section>

              {/* Quotation Details */}
              <section className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
                  <FileText size={15} className="text-[#186737]" />
                  <h2 className="font-bold text-gray-900 text-sm">
                    Quotation Details
                  </h2>
                  <span className="ml-auto text-xs text-gray-400 font-medium">
                    {products.length} product{products.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {products.length === 0 ? (
                  <div className="p-10 text-center">
                    <FileText size={32} className="text-gray-200 mx-auto mb-3" />
                    <p className="text-sm text-gray-400">No products added yet.</p>
                  </div>
                ) : (
                  <>
                    {/* Desktop table */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full">
                        <thead>
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
                                    <p className="text-xs text-gray-500 mt-0.5">
                                      Warranty:{" "}
                                      <span className="font-medium text-gray-700">
                                        {p.warranty}
                                      </span>
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                      Shipping Charge:{" "}
                                      <span className="font-medium text-gray-700">
                                        ${fmtPrice(p.shippingCost)}
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
                                  ${fmtPrice(p.price)}
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
                                  ${fmtPrice(p.price * p.qty)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile cards */}
                    <div className="md:hidden p-4 space-y-3">
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
                            <p className="text-xs text-gray-500">
                              Warranty:{" "}
                              <span className="font-medium text-gray-700">{p.warranty}</span>
                            </p>
                            <p className="text-xs text-gray-500">
                              Ships in {p.deliveryDays} · Shipping: ${fmtPrice(p.shippingCost)}
                            </p>
                            <p className="text-xs text-gray-500">
                              Limit Price: <span className="font-medium text-gray-700"> ${fmtPrice(p.price)}</span>
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
                              <span className="text-sm font-bold text-gray-900">
                                ${fmtPrice(p.price * p.qty)}
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
                <div className="px-5 py-4 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={() => setAddModalOpen(true)}
                    className="flex items-center gap-1.5 bg-[#186737] hover:bg-[#145c30] text-white text-sm font-semibold px-4 py-2 rounded-[7px] transition-colors duration-200"
                  >
                    <Plus size={15} strokeWidth={2.5} />
                    Add More Products
                  </button>
                </div>
              </section>

              {/* Notes */}
              <section className="hidden bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-3.5 border-b border-gray-100">
                  <h2 className="font-bold text-gray-900 text-sm">
                    Add notes to horecastore{" "}
                    <span className="text-gray-400 font-normal text-xs">(optional)</span>
                  </h2>
                </div>
                <div className="p-5">
                  <textarea
                    name="notes"
                    rows={4}
                    className="w-full px-3 py-2.5 rounded-[7px] border border-gray-200 text-sm text-gray-900 outline-none focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 transition-all placeholder:text-gray-400 resize-none bg-white"
                    placeholder="Add special instruction or notes for our team..."
                    value={formik.values.notes}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {err("notes") && (
                    <p className="text-[11px] text-red-500 mt-1">{err("notes")}</p>
                  )}
                </div>
              </section>
            </div>

            {/* ── RIGHT SIDEBAR ─────────────────────────────────────────── */}
            <div className="sticky top-[180px] space-y-4">
              {/* Quote Summary */}
              <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-3.5 border-b border-gray-100">
                  <h2 className="font-bold text-gray-900 text-sm">
                    Quote Summary
                  </h2>
                </div>

                <div className="p-5 space-y-3">
                  {/* Coupon */}
                  <div>
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
                          <p className="text-[11px] text-emerald-600">
                            Saving ${fmtPrice(discount)}
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
                      <span className="font-semibold text-gray-900">
                        $ {fmtPrice(subtotal)}
                      </span>
                    </div>
                    {cappedDiscount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Discount</span>
                        <span className="font-semibold text-emerald-600">
                          - $ {fmtPrice(cappedDiscount)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Shipping</span>
                      <span className="font-semibold text-gray-900">
                        $ {fmtPrice(shipping)}
                      </span>
                    </div>
                    {isUAE && (
                      <div className="flex justify-between text-sm items-center">
                        <span className="text-gray-500 flex items-center gap-1">
                          VAT ({(UAE_VAT_RATE * 100).toFixed(0)}%)
                          <Info size={12} className="text-gray-300" />
                        </span>
                        <span className="font-semibold text-gray-900">
                          $ {fmtPrice(tax)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                    <span className="font-bold text-gray-900 text-sm">
                      Grand Total
                    </span>
                    <span className="font-bold text-gray-900 text-xl">
                      $ {fmtPrice(grandTotal)}
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
                    {submitting ? "Generating…" : submitted ? "Quotation Sent!" : "Generate & Email Quotation"}
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

      <AddProductModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAddProduct}
        addedIds={products.map((p) => p.id)}
      />
    </>
  );
}
