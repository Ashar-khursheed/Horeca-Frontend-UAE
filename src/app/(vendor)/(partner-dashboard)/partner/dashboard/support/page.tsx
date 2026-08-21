"use client";

import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle,
  ChevronRight,
  Clock,
  Eye,
  LayoutGrid,
  Loader2,
  MessageSquare,
  Paperclip,
  Phone,
  Plus,
  Search,
  TicketIcon,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchVendorProfile } from "@/store/slices/vendor-profile/vendorProfileSlice";

// ── Types ─────────────────────────────────────────────────────────────────────
type TicketStatus   = "Open" | "In Progress" | "Resolved" | "Closed";
type TicketPriority = "Low" | "Medium" | "High" | "Critical";
type View           = "list" | "create" | "detail";

interface Ticket {
  id: string;
  subject: string;
  description: string;
  category: string;
  priority: TicketPriority;
  status: TicketStatus;
  dateSubmitted: string;
  lastUpdated: string;
}

// ── Static data ───────────────────────────────────────────────────────────────
const MOCK_TICKETS: Ticket[] = [
  {
    id: "V-2",
    subject: "Payout for PO-2022 not received",
    description: "The payout for PO-2022 was marked Paid on Jun 30 but I haven't seen it in my bank account yet.",
    category: "Payouts",
    priority: "High",
    status: "Open",
    dateSubmitted: "Jul 20, 2026",
    lastUpdated: "Jul 20, 2026",
  },
  {
    id: "V-1",
    subject: "Unable to update stock for SKU TUC27FHC",
    description: "I tried updating stock quantity for this product but the change isn't saving.",
    category: "Product Listing",
    priority: "Medium",
    status: "Resolved",
    dateSubmitted: "Jul 10, 2026",
    lastUpdated: "Jul 11, 2026",
  },
];

const CATEGORIES  = ["Order Issues", "Payouts", "Product Listing", "Account Management", "Technical Support"];
const PRIORITIES: TicketPriority[] = ["Low", "Medium", "High", "Critical"];
const STATUSES:   TicketStatus[]   = ["Open", "In Progress", "Resolved", "Closed"];

const STATUS_STYLE: Record<TicketStatus, string> = {
  "Open":        "bg-blue-50 text-blue-700 border-blue-200",
  "In Progress": "bg-amber-50 text-amber-700 border-amber-200",
  "Resolved":    "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Closed":      "bg-gray-100 text-gray-500 border-gray-200",
};

const STATUS_DOT: Record<TicketStatus, string> = {
  "Open":        "bg-blue-500",
  "In Progress": "bg-amber-500",
  "Resolved":    "bg-emerald-500",
  "Closed":      "bg-gray-400",
};

const PRIORITY_STYLE: Record<TicketPriority, string> = {
  Low:      "bg-gray-100 text-gray-600 border-gray-200",
  Medium:   "bg-blue-50 text-blue-600 border-blue-200",
  High:     "bg-orange-50 text-orange-600 border-orange-200",
  Critical: "bg-red-50 text-red-600 border-red-200",
};

const EXPECTED_TIME: Record<TicketPriority, string> = {
  Critical: "Within 4 hours",
  High:     "Within 8 hours",
  Medium:   "Within 24 hours",
  Low:      "Within 7 business days",
};

const RESPONSE_TIMES = [
  { label: "Critical", time: "Within 4 hours",  color: "text-red-600" },
  { label: "High",     time: "Within 8 hours",  color: "text-orange-600" },
  { label: "Medium",   time: "Within 24 hours", color: "text-blue-600" },
  { label: "Low",      time: "Within 48 hours", color: "text-gray-600" },
];

const EMPTY_FORM = {
  fullName: "", email: "", company: "", phone: "",
  category: "", priority: "", subject: "", description: "", reference: "",
};

// ══════════════════════════════════════════════════════════════════════════════
// Page
// ══════════════════════════════════════════════════════════════════════════════
export default function PartnerSupportPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { vendor, contact } = useSelector((state: RootState) => state.vendorProfile);

  useEffect(() => {
    if (!vendor) dispatch(fetchVendorProfile());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const vendorName  = vendor?.name || contact?.name || "";
  const vendorEmail = contact?.email || "";

  const [view, setView]           = useState<View>("list");
  const [selected, setSelected]   = useState<Ticket | null>(null);
  const [tickets, setTickets]     = useState<Ticket[]>(MOCK_TICKETS);
  const [search, setSearch]       = useState("");
  const [filterStatus, setFilter] = useState("All Status");
  const [sortBy, setSortBy]       = useState("Date (Newest)");

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]       = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [errors, setErrors]           = useState<Partial<typeof EMPTY_FORM>>({});
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  // Prefill contact fields once the vendor profile has loaded, without
  // clobbering anything the vendor has already typed into the form.
  const prefilledRef = useRef(false);
  useEffect(() => {
    if (prefilledRef.current || (!vendorName && !vendorEmail)) return;
    prefilledRef.current = true;
    setForm((p) => ({
      ...p,
      fullName: p.fullName || vendorName,
      email:    p.email || vendorEmail,
      company:  p.company || vendorName,
    }));
  }, [vendorName, vendorEmail]);

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((p) => ({ ...p, [k]: e.target.value }));

  const openDetail = (t: Ticket) => { setSelected(t); setView("detail"); };
  const goList     = ()          => { setView("list");   setSelected(null); setErrors({}); };

  // ── Filtered list ──────────────────────────────────────────────────────────
  const filtered = tickets
    .filter((t) => {
      const q = search.toLowerCase();
      return (
        (!q || t.subject.toLowerCase().includes(q) || t.id.toLowerCase().includes(q)) &&
        (filterStatus === "All Status" || t.status === filterStatus)
      );
    })
    .sort((a, b) =>
      sortBy === "Date (Oldest)" ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id),
    );

  // ── Validation ─────────────────────────────────────────────────────────────
  const validate = () => {
    const e: Partial<typeof EMPTY_FORM> = {};
    if (!form.fullName.trim())    e.fullName    = "Required";
    if (!form.email.trim())       e.email       = "Required";
    if (!form.category)           e.category    = "Required";
    if (!form.priority)           e.priority    = "Required";
    if (!form.subject.trim())     e.subject     = "Required";
    if (!form.description.trim()) e.description = "Required";
    setErrors(e);
    return !Object.keys(e).length;
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    const now = new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    const t: Ticket = {
      id: `V-${tickets.length + 1}`,
      subject: form.subject,
      description: form.description,
      category: form.category,
      priority: form.priority as TicketPriority,
      status: "Open",
      dateSubmitted: now,
      lastUpdated: now,
    };
    setTickets((p) => [t, ...p]);
    setSubmitting(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setView("list");
      setForm({ ...EMPTY_FORM, fullName: vendorName, email: vendorEmail, company: vendorName });
      setAttachments([]);
      setErrors({});
    }, 1800);
  };

  // ══════════════════════════════════════════════════════════════════════════
  // DETAIL VIEW
  // ══════════════════════════════════════════════════════════════════════════
  if (view === "detail" && selected) {
    return (
      <div className="p-4 sm:p-6 max-w-6xl">
        {/* Header */}
        <div className="bg-white rounded-[10px] border border-gray-100 shadow-sm px-5 py-4 mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={goList}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500 shrink-0"
            >
              <ArrowLeft size={17} />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Ticket #{selected.id.replace("V-", "2000")}</h1>
              <p className="text-xs text-gray-400 mt-0.5">Created on {selected.dateSubmitted}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-11 sm:ml-0">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_STYLE[selected.status]}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[selected.status]}`} />
              {selected.status}
            </span>
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${PRIORITY_STYLE[selected.priority]}`}>
              ! {selected.priority} Priority
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col lg:flex-row gap-5 items-start">
          <div className="flex-1 min-w-0 space-y-4">
            <div className="bg-white rounded-[10px] border border-gray-100 shadow-sm p-5">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Subject</p>
              <p className="text-[17px] font-bold text-gray-900 mb-5">{selected.subject}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Description</p>
              <p className="text-sm text-gray-600 leading-relaxed">{selected.description}</p>
            </div>

            <div className="bg-white rounded-[10px] border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <MessageSquare size={15} className="text-gray-400" />
                  <h2 className="text-sm font-bold text-gray-800">Responses</h2>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center py-14 px-4 text-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                  <MessageSquare size={20} className="text-gray-400" />
                </div>
                <p className="text-sm font-semibold text-gray-600 mb-1">No responses yet</p>
                <p className="text-xs text-gray-400">
                  Our vendor support team will respond {EXPECTED_TIME[selected.priority].toLowerCase()}
                </p>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-72 shrink-0 space-y-4">
            <div className="bg-white rounded-[10px] border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-3.5 border-b border-gray-100">
                <h2 className="text-xs font-bold text-gray-800 uppercase tracking-widest">Ticket Information</h2>
              </div>
              <div className="p-5 space-y-4">
                <InfoRow icon={<LayoutGrid size={15} className="text-gray-400" />} label="Category" value={selected.category} />
                <InfoRow icon={<CalendarDays size={15} className="text-gray-400" />} label="Created On" value={selected.dateSubmitted} />
                <InfoRow icon={<Clock size={15} className="text-gray-400" />} label="Last Updated" value={selected.lastUpdated} />
                <div className="pt-1 border-t border-gray-100">
                  <p className="text-[11px] text-gray-400 mb-0.5">Expected Response Time</p>
                  <p className="text-sm font-bold text-[#186737]">{EXPECTED_TIME[selected.priority]}</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-[10px] border border-blue-100 p-5">
              <p className="text-sm font-bold text-blue-800 mb-1">Need Urgent Help?</p>
              <p className="text-xs text-blue-600 mb-4">For urgent issues, you can contact our vendor support team directly</p>
              <a
                href="tel:+97143388499"
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-[7px] transition-colors"
              >
                <Phone size={14} />
                Call Support
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // LIST VIEW
  // ══════════════════════════════════════════════════════════════════════════
  if (view === "list") {
    return (
      <div className="p-4 sm:p-6 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Support Center</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Need help with orders, payouts, or listings? Submit a support request and our vendor support team will get back to you shortly.
            </p>
          </div>
          <button
            onClick={() => setView("create")}
            className="shrink-0 self-start flex items-center gap-2 px-4 py-2.5 bg-[#186737] hover:bg-[#145c30] text-white text-sm font-semibold rounded-[7px] transition-colors shadow-sm"
          >
            <Plus size={16} />
            New Support Ticket
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="relative flex-1 min-w-[180px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by subject or description"
              className="w-full h-10 pl-9 pr-4 rounded-[7px] border border-gray-200 text-sm text-gray-800 outline-none focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10 bg-white placeholder:text-gray-400"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilter(e.target.value)}
            className="h-10 px-3 rounded-[7px] border border-gray-200 text-sm text-gray-700 outline-none focus:border-[#186737] bg-white min-w-[130px]"
          >
            <option>All Status</option>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="hidden sm:inline">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="h-10 px-3 rounded-[7px] border border-gray-200 text-sm text-gray-700 outline-none focus:border-[#186737] bg-white"
            >
              <option>Date (Newest)</option>
              <option>Date (Oldest)</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-[10px] border border-gray-100 shadow-sm overflow-hidden">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                <TicketIcon size={24} className="text-gray-400" />
              </div>
              <p className="text-sm font-semibold text-gray-700 mb-1">No tickets found</p>
              <p className="text-xs text-gray-400">
                {search || filterStatus !== "All Status"
                  ? "Try adjusting your search or filters."
                  : "You haven't submitted any support tickets yet."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    {["Ticket ID", "Subject", "Category", "Status", "Date Submitted", "Last Updated", "Actions"].map((h, i) => (
                      <th
                        key={h}
                        className={`text-left px-5 py-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap ${i === 3 ? "hidden md:table-cell" : ""} ${i === 4 || i === 5 ? "hidden lg:table-cell" : ""}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-5 py-3.5 font-semibold text-[#186737]">{t.id}</td>
                      <td className="px-5 py-3.5 text-gray-800 max-w-[200px]">
                        <p className="truncate">{t.subject}</p>
                      </td>
                      <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">{t.category}</td>
                      <td className="px-5 py-3.5 hidden md:table-cell">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${STATUS_STYLE[t.status]}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[t.status]}`} />
                          {t.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap hidden lg:table-cell">{t.dateSubmitted}</td>
                      <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap hidden lg:table-cell">{t.lastUpdated}</td>
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => openDetail(t)}
                          className="flex items-center gap-1 text-[#186737] font-semibold text-xs hover:underline"
                        >
                          <Eye size={13} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // CREATE FORM VIEW
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div className="p-4 sm:p-6 max-w-3xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
        <button onClick={goList} className="hover:text-[#186737] transition-colors">Support Center</button>
        <ChevronRight size={12} />
        <span className="text-gray-600">Create Ticket</span>
      </div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={goList} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
          <ArrowLeft size={17} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Create Support Ticket</h1>
          <p className="text-sm text-gray-500 mt-0.5">Need help? Submit a request and we'll get back to you within 24 hours.</p>
        </div>
      </div>

      {success && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-[9px] mb-5 text-sm text-emerald-700 font-medium">
          <CheckCircle size={16} className="shrink-0" />
          Ticket submitted successfully! Redirecting…
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Contact Information */}
        <section className="bg-white rounded-[10px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
            <span className="w-6 h-6 rounded-full bg-[#186737] text-white text-xs font-bold flex items-center justify-center shrink-0">1</span>
            <h2 className="text-sm font-bold text-gray-800">Contact Information</h2>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Full Name" required error={errors.fullName}>
              <input value={form.fullName} onChange={set("fullName")} placeholder="Enter your full name" className={iCls(!!errors.fullName)} />
            </Field>
            <Field label="Email" required error={errors.email}>
              <input type="email" value={form.email} onChange={set("email")} placeholder="your-email@company.com" className={iCls(!!errors.email)} />
            </Field>
            <Field label="Store Name">
              <input value={form.company} onChange={set("company")} placeholder="Enter store name" className={iCls(false)} />
            </Field>
            <Field label="Phone Number">
              <input value={form.phone} onChange={set("phone")} placeholder="+1 (555) 123-4567" className={iCls(false)} />
            </Field>
          </div>
        </section>

        {/* Ticket Details */}
        <section className="bg-white rounded-[10px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
            <span className="w-6 h-6 rounded-full bg-[#186737] text-white text-xs font-bold flex items-center justify-center shrink-0">2</span>
            <h2 className="text-sm font-bold text-gray-800">Ticket Details</h2>
          </div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Category" required error={errors.category}>
                <select value={form.category} onChange={set("category")} className={iCls(!!errors.category)}>
                  <option value="">Select a category</option>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Priority" required error={errors.priority}>
                <select value={form.priority} onChange={set("priority")} className={iCls(!!errors.priority)}>
                  <option value="">Select priority</option>
                  {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Subject" required error={errors.subject}>
              <input value={form.subject} onChange={set("subject")} placeholder="Brief description of your issue" className={iCls(!!errors.subject)} />
            </Field>
            <Field label="Description" required error={errors.description}>
              <textarea
                value={form.description} onChange={set("description")} rows={5}
                placeholder="Please provide detailed information about your issue including any error messages and steps taken…"
                className={`${iCls(!!errors.description)} resize-none`}
              />
            </Field>
            <Field label="Reference # (Optional)">
              <input value={form.reference} onChange={set("reference")} placeholder="e.g., Order #HS-1234" className={iCls(false)} />
            </Field>

            {/* Attachments */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Attachments (Optional)</label>
              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-[9px] p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-[#186737] hover:bg-[#f0faf4] transition-all"
              >
                <Upload size={22} className="text-gray-400" />
                <p className="text-sm text-gray-500">Click to upload or drag & drop</p>
                <p className="text-xs text-gray-400">PNG, JPG, PDF up to 10MB each</p>
              </div>
              <input ref={fileRef} type="file" multiple accept=".png,.jpg,.jpeg,.pdf" className="hidden"
                onChange={(e) => { setAttachments((p) => [...p, ...Array.from(e.target.files ?? [])].slice(0, 5)); e.target.value = ""; }}
              />
              {attachments.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {attachments.map((f, i) => (
                    <li key={i} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-[7px] text-xs text-gray-700">
                      <span className="flex items-center gap-2 truncate">
                        <Paperclip size={12} className="text-gray-400 shrink-0" />
                        <span className="truncate">{f.name}</span>
                        <span className="text-gray-400 shrink-0">({(f.size / 1024).toFixed(0)} KB)</span>
                      </span>
                      <button type="button" onClick={() => setAttachments((p) => p.filter((_, j) => j !== i))} className="ml-2 text-gray-400 hover:text-red-500 shrink-0">
                        <X size={13} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Response times info */}
            <div className="flex items-start gap-2.5 p-3.5 bg-blue-50/60 border border-blue-100 rounded-[9px]">
              <AlertCircle size={15} className="text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-blue-700 mb-1.5">Expected Response Times</p>
                <ul className="space-y-0.5">
                  {RESPONSE_TIMES.map(({ label, time, color }) => (
                    <li key={label} className="flex items-center gap-1.5 text-xs text-gray-600">
                      <span className={`font-semibold ${color}`}>{label}:</span> {time}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <div className="flex items-center justify-end gap-3 pb-6">
          <button type="button" onClick={goList} className="px-5 py-2.5 rounded-[7px] border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button
            type="submit" disabled={submitting || success}
            className="flex items-center gap-2 px-6 py-2.5 rounded-[7px] bg-[#186737] hover:bg-[#145c30] text-white text-sm font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
          >
            {submitting && <Loader2 size={15} className="animate-spin" />}
            {success ? "Submitted!" : "Submit Ticket"}
          </button>
        </div>
      </form>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function iCls(err: boolean) {
  return `w-full h-10 px-3 rounded-[7px] border text-sm text-gray-900 outline-none transition-all bg-white placeholder:text-gray-400 ${
    err
      ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
      : "border-gray-200 focus:border-[#186737] focus:ring-2 focus:ring-[#186737]/10"
  }`;
}

function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-[11px] text-red-500 mt-1">{error}</p>}
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-7 h-7 rounded-[7px] bg-gray-50 flex items-center justify-center shrink-0">{icon}</div>
      <div>
        <p className="text-[11px] text-gray-400">{label}</p>
        <p className="text-sm font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
}
