// "use client";

// import { CustomerProfile } from "@/store/slices/my-profile/profileSlice";
// import { RootState } from "@/store/store";
// import { Bell, Building2, Lock, MapPin, User } from "lucide-react";
// import { useState } from "react";
// import { useSelector } from "react-redux";
// import { AddressesTab } from "./_components/AddressesTab";
// import { BusinessTab } from "./_components/BusinessTab";
// import { NotificationsTab } from "./_components/NotificationsTab";
// import { PersonalTab } from "./_components/PersonalTab";
// import { SecurityTab } from "./_components/SecurityTab";

// type Tab = "personal" | "business" | "security" | "notifications" | "addresses";

// const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
//   { id: "personal",      label: "Personal Info",  icon: User },
//   { id: "business",      label: "Business",       icon: Building2 },
//   { id: "security",      label: "Security",       icon: Lock },
//   // { id: "notifications", label: "Notifications",  icon: Bell },
//   { id: "addresses",     label: "Addresses",      icon: MapPin },
// ];

// export default function MyProfilePage() {
//   const [tab, setTab] = useState<Tab>("personal");
//   const customer = useSelector((state: RootState) => state.profile.customer);
  

//   return (
//     <div className="p-4 sm:p-6 max-w-[900px]">
//       {/* Header */}
//       <div className="mb-6">
//         <h1 className="text-xl sm:text-2xl font-bold text-gray-900">My Profile</h1>
//         <p className="text-sm text-gray-500 mt-1">
//           Manage your account information, security, and preferences.
//         </p>
//       </div>

//       {/* Tab nav */}
//       <div className="flex gap-1 bg-gray-100 p-1 rounded-[7px] mb-6 overflow-x-auto">
//         {TABS.map(({ id, label, icon: Icon }) => (
//           <button
//             key={id}
//             onClick={() => setTab(id)}
//             className={`flex items-center gap-2 px-4 py-2 rounded-[7px] text-sm font-semibold whitespace-nowrap transition-all duration-200 flex-1 justify-center ${
//               tab === id
//                 ? "bg-white text-[#186737] shadow-sm"
//                 : "text-gray-500 hover:text-gray-700"
//             }`}

//           >
//             <Icon size={14} />
//             <span className="hidden sm:inline">{label}</span>
//           </button>
//         ))}
//       </div>

//       {/* Tab content */}
//       {tab === "personal"      && <PersonalTab customer={customer as CustomerProfile | null} />}
//       {tab === "business"      && <BusinessTab />}
//       {tab === "security"      && <SecurityTab />}
//       {tab === "notifications" && <NotificationsTab />}
//       {tab === "addresses"     && <AddressesTab />}
//     </div>
//   );
// }





"use client";

import { CustomerProfile } from "@/store/slices/my-profile/profileSlice";
import { RootState } from "@/store/store";
import { Building2, Lock, MapPin, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { AddressesTab } from "./_components/AddressesTab";
import { BusinessTab } from "./_components/BusinessTab";
import { NotificationsTab } from "./_components/NotificationsTab";
import { PersonalTab } from "./_components/PersonalTab";
import { SecurityTab } from "./_components/SecurityTab";

type Tab =
  | "personal"
  | "business"
  | "security"
  | "notifications"
  | "addresses";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "personal", label: "Personal Info", icon: User },
  { id: "business", label: "Business", icon: Building2 },
  { id: "security", label: "Security", icon: Lock },
  { id: "addresses", label: "Addresses", icon: MapPin },
];

export default function MyProfilePage() {
  const customer = useSelector<RootState, CustomerProfile | null>(
    (state) => state.profile.customer
  );

  const [tab, setTab] = useState<Tab>("personal");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const hash = window.location.hash.replace("#", "") as Tab;

    const validTabs: Tab[] = [
      "personal",
      "business",
      "security",
      "notifications",
      "addresses",
    ];

    if (validTabs.includes(hash)) {
      setTab(hash);
    }
  }, []);

  const handleTabChange = (newTab: Tab) => {
    setTab(newTab);
    window.history.replaceState(null, "", `#${newTab}`);
  };

  // Hydration mismatch avoid karne ke liye
  if (!mounted) {
    return null;
  }

  return (
    <div className="p-4 sm:p-6 max-w-[900px]">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          My Profile
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your account information, security, and preferences.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-[7px] mb-6 overflow-x-auto">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => handleTabChange(id)}
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

      {/* Content */}
      {tab === "personal" && (
        <PersonalTab customer={customer as CustomerProfile | null} />
      )}

      {tab === "business" && <BusinessTab />}

      {tab === "security" && <SecurityTab />}

      {tab === "notifications" && <NotificationsTab />}

      {tab === "addresses" && <AddressesTab />}
    </div>
  );
}