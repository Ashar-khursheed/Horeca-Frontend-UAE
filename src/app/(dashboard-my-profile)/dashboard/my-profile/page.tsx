"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bell,
  Building2,
  Camera,
  CheckCircle,
  Eye,
  EyeOff,
  Globe,
  Hash,
  Lock,
  Mail,
  MapPin,
  Phone,
  Plus,
  Shield,
  User,
} from "lucide-react";
import { useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
type Tab = "personal" | "business" | "security" | "notifications" | "addresses";

// ── Shared input class ────────────────────────────────────────────────────────
const inputCls =
  "w-full h-10 px-3 rounded-[7px] border border-gray-200 text-sm text-gray-900 outline-none focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 transition-all placeholder:text-gray-400 bg-white";

const Field = ({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon?: React.ElementType;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
      {Icon && <Icon size={12} className="text-gray-400" />}
      {label}
    </label>
    {children}
  </div>
);

// ── Personal Info Tab ─────────────────────────────────────────────────────────
const PersonalTab = () => {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    firstName: "Arshad",
    lastName: "Khan",
    email: "webdeveloper08@horecastore.ae",
    phone: "+1 (888) 888-8877",
    country: "United States",
    city: "Houston",
    state: "Texas",
    zip: "77074",
  });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-5">
      {/* Avatar section */}
      <div className="flex items-center gap-5 p-5 bg-white rounded-[7px] border border-gray-100 shadow-sm">
        <div className="relative">
          <div className="w-20 h-20 rounded-[7px] bg-[#186737] flex items-center justify-center shadow-md">
            <span className="text-white font-black text-2xl">AK</span>
          </div>
          <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center shadow-sm hover:border-[#186737] transition-colors">
            <Camera size={12} className="text-gray-600" />
          </button>
        </div>
        <div>
          <h3 className="font-bold text-gray-900">Arshad Khan</h3>
          <p className="text-xs text-gray-500 mt-0.5">webdeveloper08@horecastore.ae</p>
          <button className="mt-2 text-xs font-semibold text-[#186737] hover:underline">
            Upload photo
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <User size={14} className="text-[#186737]" />
            Personal Information
          </h3>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="First Name" icon={User}>
            <input className={inputCls} value={form.firstName} onChange={set("firstName")} />
          </Field>
          <Field label="Last Name" icon={User}>
            <input className={inputCls} value={form.lastName} onChange={set("lastName")} />
          </Field>
          <Field label="Email Address" icon={Mail}>
            <input type="email" className={inputCls} value={form.email} onChange={set("email")} />
          </Field>
          <Field label="Phone Number" icon={Phone}>
            <input className={inputCls} value={form.phone} onChange={set("phone")} />
          </Field>
          <Field label="Country" icon={Globe}>
            <Select value={form.country} onValueChange={(val) => setForm((p) => ({ ...p, country: val }))}>
              <SelectTrigger className={`${inputCls} cursor-pointer`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="United States">United States</SelectItem>
                <SelectItem value="United Arab Emirates">United Arab Emirates</SelectItem>
                <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                <SelectItem value="Canada">Canada</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="City" icon={MapPin}>
            <input className={inputCls} value={form.city} onChange={set("city")} />
          </Field>
          <Field label="State / Province" icon={MapPin}>
            <input className={inputCls} value={form.state} onChange={set("state")} />
          </Field>
          <Field label="ZIP / Postal Code" icon={Hash}>
            <input className={inputCls} value={form.zip} onChange={set("zip")} />
          </Field>
        </div>
        <div className="px-5 pb-5 flex items-center gap-3">
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-[7px] text-sm font-semibold transition-all duration-200 ${
              saved
                ? "bg-emerald-600 text-white"
                : "bg-[#186737] hover:bg-[#145c30] text-white"
            }`}
          >
            {saved ? <><CheckCircle size={15} /> Saved!</> : "Save Changes"}
          </button>
          <button className="px-5 py-2.5 rounded-[7px] text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Business Tab ──────────────────────────────────────────────────────────────
const BusinessTab = () => {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    businessName: "Arshad Inc.",
    industry: "Restaurant & Hospitality",
    taxId: "XX-XXXXXXX",
    website: "",
    address: "Houston, Texas, United States",
    accountType: "Business",
  });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  return (
    <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-3.5 border-b border-gray-100">
        <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
          <Building2 size={14} className="text-[#186737]" />
          Business Information
        </h3>
      </div>
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Business Name" icon={Building2}>
          <input className={inputCls} value={form.businessName} onChange={set("businessName")} />
        </Field>
        <Field label="Industry" icon={Globe}>
          <Select value={form.industry} onValueChange={(val) => setForm((p) => ({ ...p, industry: val }))}>
            <SelectTrigger className={`${inputCls} cursor-pointer`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Restaurant & Hospitality">Restaurant & Hospitality</SelectItem>
              <SelectItem value="Food Service">Food Service</SelectItem>
              <SelectItem value="Retail">Retail</SelectItem>
              <SelectItem value="Healthcare">Healthcare</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field label="Tax ID / EIN">
          <input className={inputCls} value={form.taxId} onChange={set("taxId")} placeholder="XX-XXXXXXX" />
        </Field>
        <Field label="Website" icon={Globe}>
          <input className={inputCls} value={form.website} onChange={set("website")} placeholder="https://yoursite.com" />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Business Address" icon={MapPin}>
            <input className={inputCls} value={form.address} onChange={set("address")} />
          </Field>
        </div>
        <Field label="Account Type">
          <div className="grid grid-cols-2 gap-2">
            {["Business", "Personal"].map((type) => (
              <button
                key={type}
                onClick={() => setForm((p) => ({ ...p, accountType: type }))}
                className={`h-10 rounded-[7px] border text-sm font-semibold transition-all duration-150 ${
                  form.accountType === type
                    ? "border-[#186737] bg-[#f0f9f4] text-[#186737]"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </Field>
      </div>
      <div className="px-5 pb-5 flex items-center gap-3">
        <button
          onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2500); }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-[7px] text-sm font-semibold transition-all duration-200 ${
            saved ? "bg-emerald-600 text-white" : "bg-[#186737] hover:bg-[#145c30] text-white"
          }`}
        >
          {saved ? <><CheckCircle size={15} /> Saved!</> : "Save Changes"}
        </button>
        <button className="px-5 py-2.5 rounded-[7px] text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
};

// ── Security Tab ──────────────────────────────────────────────────────────────
const SecurityTab = () => {
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [saved, setSaved] = useState(false);
  const [pwd, setPwd] = useState({ current: "", new: "", confirm: "" });

  const strength =
    pwd.new.length === 0 ? 0
    : pwd.new.length < 6 ? 1
    : pwd.new.length < 10 ? 2
    : /[A-Z]/.test(pwd.new) && /[0-9]/.test(pwd.new) && /[^A-Za-z0-9]/.test(pwd.new) ? 4
    : 3;

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColor = ["", "bg-red-400", "bg-amber-400", "bg-blue-400", "bg-emerald-500"];

  const EyeBtn = ({ field }: { field: keyof typeof show }) => (
    <button
      type="button"
      onClick={() => setShow((p) => ({ ...p, [field]: !p[field] }))}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
    >
      {show[field] ? <EyeOff size={15} /> : <Eye size={15} />}
    </button>
  );

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <Lock size={14} className="text-[#186737]" />
            Change Password
          </h3>
        </div>
        <div className="p-5 space-y-4 max-w-md">
          {(["current", "new", "confirm"] as const).map((field) => (
            <Field
              key={field}
              label={field === "current" ? "Current Password" : field === "new" ? "New Password" : "Confirm New Password"}
              icon={Lock}
            >
              <div className="relative">
                <input
                  type={show[field] ? "text" : "password"}
                  className={`${inputCls} pr-10`}
                  value={pwd[field]}
                  onChange={(e) => setPwd((p) => ({ ...p, [field]: e.target.value }))}
                  placeholder="••••••••"
                />
                <EyeBtn field={field} />
              </div>
              {field === "new" && pwd.new.length > 0 && (
                <div className="mt-1.5">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((s) => (
                      <div key={s} className={`h-1 flex-1 rounded-full transition-all ${s <= strength ? strengthColor[strength] : "bg-gray-200"}`} />
                    ))}
                  </div>
                  <p className={`text-[11px] font-semibold mt-1 ${strengthColor[strength].replace("bg-", "text-")}`}>
                    {strengthLabel[strength]}
                  </p>
                </div>
              )}
            </Field>
          ))}
        </div>
        <div className="px-5 pb-5">
          <button
            onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2500); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-[7px] text-sm font-semibold transition-all duration-200 ${
              saved ? "bg-emerald-600 text-white" : "bg-[#186737] hover:bg-[#145c30] text-white"
            }`}
          >
            {saved ? <><CheckCircle size={15} /> Updated!</> : "Update Password"}
          </button>
        </div>
      </div>

      {/* 2FA */}
      <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-[7px] bg-[#f0f9f4] flex items-center justify-center shrink-0">
              <Shield size={17} className="text-[#186737]" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Two-Factor Authentication</h4>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed max-w-sm">
                Add an extra layer of security to your account by requiring a verification code.
              </p>
            </div>
          </div>
          <div className="shrink-0">
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#186737]" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Notifications Tab ─────────────────────────────────────────────────────────
const NotificationsTab = () => {
  const [prefs, setPrefs] = useState({
    orderUpdates: true,
    quoteStatus: true,
    promotions: false,
    newArrivals: false,
    paymentReminders: true,
    newsletterWeekly: false,
  });

  const NOTIF_GROUPS = [
    {
      title: "Order & Shipping",
      icon: Building2,
      items: [
        { key: "orderUpdates" as const, label: "Order status updates", desc: "Get notified when your order ships, is delivered, or has issues." },
        { key: "paymentReminders" as const, label: "Payment reminders", desc: "Receive reminders for upcoming or overdue payments." },
      ],
    },
    {
      title: "Quotes & Pricing",
      icon: Mail,
      items: [
        { key: "quoteStatus" as const, label: "Quote status changes", desc: "Know when your quotes are accepted, rejected, or expire." },
      ],
    },
    {
      title: "Marketing",
      icon: Bell,
      items: [
        { key: "promotions" as const, label: "Promotions & deals", desc: "Special offers, discounts, and flash sales." },
        { key: "newArrivals" as const, label: "New arrivals", desc: "Be first to know about new products in your categories." },
        { key: "newsletterWeekly" as const, label: "Weekly newsletter", desc: "Industry tips, product highlights, and company news." },
      ],
    },
  ];

  return (
    <div className="space-y-4">
      {NOTIF_GROUPS.map(({ title, items }) => (
        <div key={title} className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <Bell size={14} className="text-[#186737]" />
              {title}
            </h3>
          </div>
          <div className="divide-y divide-gray-50">
            {items.map(({ key, label, desc }) => (
              <div key={key} className="px-5 py-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{label}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={prefs[key]}
                    onChange={() => setPrefs((p) => ({ ...p, [key]: !p[key] }))}
                  />
                  <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#186737]" />
                </label>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// ── Addresses Tab ─────────────────────────────────────────────────────────────
const AddressesTab = () => {
  const [billingForm, setBillingForm] = useState({
    street: "Hoston",
    city: "Houston",
    state: "Texas",
    zip: "77074",
    country: "United States",
    label: "Office1",
  });
  const [billingSaved, setBillingSaved] = useState(false);

  const [shippingList, setShippingList] = useState([
    { id: 1, name: "Amsterdam",      full: "usa, 90001, Los Angeles Mannat Lands & End, United States",                                              isDefault: false },
    { id: 2, name: "",               full: "Monterey, CA, USA, 59101, Billings, United States",                                                       isDefault: false },
    { id: 3, name: "",               full: "Apple Valley Fair, Stevens Creek Boulevard, Santa Clara, CA, USA, 95050, Santa Clara, United States",     isDefault: false },
    { id: 4, name: "Hollister Smog 2", full: "North 13th Street, San Jose, CA, USA, 95023, Hollister, United States",                               isDefault: false },
    { id: 5, name: "Office1",        full: "Hoston, 77074, Houston, United States",                                                                   isDefault: true  },
    { id: 6, name: "Business",       full: "708 E. 47th St. Chicago Il, 60653, 60653, Chicago, United States",                                        isDefault: false },
  ]);

  const handleDelete = (id: number) =>
    setShippingList((p) => p.filter((a) => a.id !== id));
  const handleSetDefault = (id: number) =>
    setShippingList((p) => p.map((a) => ({ ...a, isDefault: a.id === id })));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-gray-900">Address Management</h2>
          <p className="text-xs text-[#186737] mt-0.5">Manage your billing and shipping addresses</p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-[7px] bg-[#186737] text-white text-sm font-semibold hover:bg-[#145c30] transition-colors shrink-0 shadow-sm shadow-[#186737]/20">
          <Plus size={14} />
          Add Address
        </button>
      </div>

      {/* Billing Address */}
      <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <MapPin size={14} className="text-[#186737]" />
            Billing Address
          </h3>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Street">
            <input
              className={inputCls}
              value={billingForm.street}
              onChange={(e) => setBillingForm((p) => ({ ...p, street: e.target.value }))}
              placeholder="Street address"
            />
          </Field>
          <Field label="City">
            <input
              className={inputCls}
              value={billingForm.city}
              onChange={(e) => setBillingForm((p) => ({ ...p, city: e.target.value }))}
              placeholder="City"
            />
          </Field>
          <Field label="State / Province">
            <input
              className={inputCls}
              value={billingForm.state}
              onChange={(e) => setBillingForm((p) => ({ ...p, state: e.target.value }))}
              placeholder="State"
            />
          </Field>
          <Field label="ZIP / Postal Code">
            <input
              className={inputCls}
              value={billingForm.zip}
              onChange={(e) => setBillingForm((p) => ({ ...p, zip: e.target.value }))}
              placeholder="ZIP"
            />
          </Field>
          <Field label="Country" icon={Globe}>
            <Select
              value={billingForm.country}
              onValueChange={(val) => setBillingForm((p) => ({ ...p, country: val }))}
            >
              <SelectTrigger className={`${inputCls} cursor-pointer`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="United States">United States</SelectItem>
                <SelectItem value="United Arab Emirates">United Arab Emirates</SelectItem>
                <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                <SelectItem value="Canada">Canada</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Address Label">
            <input
              className={inputCls}
              value={billingForm.label}
              onChange={(e) => setBillingForm((p) => ({ ...p, label: e.target.value }))}
              placeholder="e.g. Office, Home"
            />
          </Field>
        </div>
        <div className="px-5 pb-5 flex items-center gap-3">
          <button
            onClick={() => {
              setBillingSaved(true);
              setTimeout(() => setBillingSaved(false), 2500);
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-[7px] text-sm font-semibold transition-all duration-200 ${
              billingSaved
                ? "bg-emerald-600 text-white"
                : "bg-[#186737] hover:bg-[#145c30] text-white"
            }`}
          >
            {billingSaved ? <><CheckCircle size={15} /> Saved!</> : "Save Changes"}
          </button>
          <button className="px-5 py-2.5 rounded-[7px] text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
        </div>
      </div>

      {/* Shipping Addresses */}
      <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <MapPin size={14} className="text-[#186737]" />
            Shipping Addresses
            <span className="text-xs font-normal text-gray-400">({shippingList.length})</span>
          </h3>
          <button className="flex items-center gap-1 text-xs font-semibold text-[#186737] hover:underline">
            <Plus size={12} />
            Add New
          </button>
        </div>

        <div className="divide-y divide-gray-50">
          {shippingList.map((addr) => (
            <div key={addr.id} className="px-5 py-4 flex items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  {addr.isDefault && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wide text-white bg-[#186737] px-2 py-0.5 rounded-full">
                      <CheckCircle size={9} />
                      Default
                    </span>
                  )}
                  {addr.name && (
                    <p className="text-sm font-semibold text-gray-900">{addr.name}</p>
                  )}
                </div>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-1">{addr.full}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {!addr.isDefault && (
                  <button
                    onClick={() => handleSetDefault(addr.id)}
                    className="text-[11px] font-semibold text-gray-400 hover:text-[#186737] transition-colors whitespace-nowrap hidden sm:block"
                  >
                    Set Default
                  </button>
                )}
                <button className="px-3 py-1.5 rounded-[7px] bg-[#186737] text-white text-xs font-semibold hover:bg-[#145c30] transition-colors">
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(addr.id)}
                  className="px-3 py-1.5 rounded-[7px] border border-gray-200 text-gray-500 text-xs font-semibold hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────
const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "personal",      label: "Personal Info",    icon: User },
  { id: "business",      label: "Business",         icon: Building2 },
  { id: "security",      label: "Security",         icon: Lock },
  { id: "notifications", label: "Notifications",    icon: Bell },
  { id: "addresses",     label: "Addresses",        icon: MapPin },
];

export default function MyProfilePage() {
  const [tab, setTab] = useState<Tab>("personal");

  return (
    <div className="p-4 sm:p-6 max-w-[900px]">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your account information, security, and preferences.
        </p>
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-[7px] mb-6 overflow-x-auto">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-[7px] text-sm font-semibold whitespace-nowrap transition-all duration-200 flex-1 justify-center ${
              tab === id
                ? "bg-white text-[#186737] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Icon size={14} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "personal"      && <PersonalTab />}
      {tab === "business"      && <BusinessTab />}
      {tab === "security"      && <SecurityTab />}
      {tab === "notifications" && <NotificationsTab />}
      {tab === "addresses"     && <AddressesTab />}
    </div>
  );
}
