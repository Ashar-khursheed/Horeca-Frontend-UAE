"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchVendorProfile } from "@/store/slices/vendor-profile/vendorProfileSlice";
import {
  AlertCircle,
  Banknote,
  Building2,
  CalendarDays,
  ChevronRight,
  CreditCard,
  FileText,
  Globe,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Truck,
  User,
  Users,
} from "lucide-react";

const fmtDate = (d?: string | null) =>
  d
    ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "—";

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex items-start gap-3 py-3">
      <div className="w-8 h-8 rounded-[7px] bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
        <Icon size={14} className="text-gray-400" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-gray-400 font-medium">{label}</p>
        <p className="text-sm font-semibold text-gray-800 break-words">{value || "—"}</p>
      </div>
    </div>
  );
}

function DocumentRow({ label, url }: { label: string; url?: string | null }) {
  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-[7px] bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
          <FileText size={14} className="text-gray-400" />
        </div>
        <p className="text-sm font-semibold text-gray-800 truncate">{label}</p>
      </div>
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold text-[#186737] hover:underline shrink-0"
        >
          View
        </a>
      ) : (
        <span className="text-xs text-gray-300 shrink-0">Not uploaded</span>
      )}
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="space-y-5">
      <div className="h-36 rounded-[7px] bg-gray-100 animate-pulse" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-56 rounded-[7px] bg-gray-100 animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export default function PartnerMyProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const { vendor, contact, loading, error } = useSelector((state: RootState) => state.vendorProfile);

  useEffect(() => {
    if (!vendor) dispatch(fetchVendorProfile());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const vendorName = vendor?.name || contact?.name || "Vendor";
  const initials =
    vendorName.split(" ").filter(Boolean).map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "V";
  const showSkeleton = loading && !vendor;

  return (
    <div className="p-4 sm:p-6 space-y-5 max-w-[1200px]">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-400">
        <Link href="/" className="hover:text-[#186737] transition-colors">Home</Link>
        <ChevronRight size={12} />
        <Link href="/partner/dashboard" className="hover:text-[#186737] transition-colors">Dashboard</Link>
        <ChevronRight size={12} />
        <span className="text-gray-700 font-medium">My Profile</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-sm text-gray-500 mt-1">Your account, business, and contact details.</p>
        </div>
        <Link
          href="/partner/dashboard/my-profile/edit"
          className="flex items-center gap-1.5 h-9 px-3.5 rounded-[7px] bg-[#186737] text-white text-sm font-semibold hover:bg-[#155c30] transition-colors shrink-0 w-fit"
        >
          <Pencil size={14} /> Edit Profile
        </Link>
      </div>

      {showSkeleton ? (
        <ProfileSkeleton />
      ) : error && !vendor ? (
        <div className="bg-white rounded-[7px] border border-gray-100 shadow-sm py-16 text-center">
          <AlertCircle size={36} className="mx-auto text-red-200 mb-3" />
          <p className="text-sm font-semibold text-gray-400">Failed to load profile</p>
          <button
            onClick={() => dispatch(fetchVendorProfile())}
            className="mt-3 text-xs text-[#186737] hover:underline font-medium"
          >
            Try again
          </button>
        </div>
      ) : (
        <>
          {/* Profile summary banner */}
          <div className="relative overflow-hidden rounded-[7px] bg-linear-to-br from-[#186737] via-[#1e7d42] to-[#22a34e] text-white shadow-lg">
            <div className="absolute -top-12 -right-12 w-52 h-52 rounded-full bg-white/5" />
            <div className="absolute -bottom-8 -right-4 w-36 h-36 rounded-full bg-white/5" />
            <div className="relative p-6 sm:p-8 flex items-center gap-4 flex-wrap">
              <div className="w-16 h-16 rounded-[7px] bg-white/20 border border-white/30 flex items-center justify-center shrink-0 backdrop-blur-sm">
                <span className="text-white font-black text-2xl">{initials}</span>
              </div>
              <div className="min-w-0">
                <h2 className="text-xl sm:text-2xl font-bold text-white truncate">{vendorName}</h2>
                <p className="text-white/70 text-sm mt-0.5">{contact?.email}</p>
                <div className="flex items-center gap-3 mt-2 flex-wrap text-xs text-white/75">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                    Vendor since {fmtDate(vendor?.created_at)}
                  </span>
                  <span className="flex items-center gap-1.5 bg-white/15 border border-white/20 rounded-full px-2.5 py-0.5">
                    <Truck size={11} />
                    Dropshipping: {vendor?.dropshipping ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Vendor Information */}
            <section className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-5">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-1">
                <Building2 size={15} className="text-[#186737]" />
                Vendor Information
              </h2>
              <div className="divide-y divide-gray-50">
                <InfoRow icon={Building2} label="Vendor Name" value={vendor?.name} />
                <InfoRow icon={Globe} label="Website" value={vendor?.website_link} />
                <InfoRow
                  icon={Banknote}
                  label="Credit Limit"
                  value={vendor?.credit_limit ? `$${vendor.credit_limit}` : null}
                />
                <InfoRow icon={CreditCard} label="Credit Terms" value={vendor?.net_terms} />
                <InfoRow icon={CalendarDays} label="Member Since" value={fmtDate(vendor?.created_at)} />
              </div>
            </section>

            {/* Address */}
            <section className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-5">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-1">
                <MapPin size={15} className="text-[#186737]" />
                Business Address
              </h2>
              <div className="divide-y divide-gray-50">
                <InfoRow icon={MapPin} label="Address" value={vendor?.address} />
                <InfoRow icon={Building2} label="City" value={vendor?.city?.name} />
                <InfoRow icon={Globe} label="Country" value={vendor?.country?.name} />
                <InfoRow icon={Mail} label="Zip Code" value={vendor?.zipcode} />
              </div>
            </section>

            {/* Contacts */}
            <section className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-5">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-1">
                <Users size={15} className="text-[#186737]" />
                Contacts
              </h2>
              {vendor?.contacts?.length ? (
                <div className="divide-y divide-gray-50">
                  {vendor.contacts.map((c) => (
                    <div key={c.id} className="py-3 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#186737]/10 flex items-center justify-center shrink-0">
                        <User size={14} className="text-[#186737]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-gray-800">{c.name}</p>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                            {c.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Mail size={11} /> {c.email || "—"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone size={11} /> {c.mobile_number || c.phone_number || "—"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 py-3">No contacts on file.</p>
              )}
            </section>

            {/* Documents */}
            <section className="bg-white rounded-[7px] border border-gray-100 shadow-sm p-5">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-1">
                <FileText size={15} className="text-[#186737]" />
                Documents
              </h2>
              <div className="divide-y divide-gray-50">
                <DocumentRow label="Vendor Logo" url={vendor?.logo_url} />
                <DocumentRow label="Business Licence" url={vendor?.business_licence_url} />
                <DocumentRow label="Tax Certificate" url={vendor?.tax_certificate_url} />
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
