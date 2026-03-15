"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export default function LangSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleChange = (nextLocale: string) => {
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000`;
    startTransition(() => {
      router.refresh();
    });
    window.location.reload();
  };

  const items = [
    { label: "English", value: "en" },
    { label: "العربية", value: "ar" },
  ];
  return (
    <>
      {/* <select value={locale} onChange={handleChange} disabled={isPending}>
        <option value="en">🇺🇸 English</option>
        <option value="ar">🇸🇦 العربية</option>
      </select> */}
      <Select value={locale} onValueChange={handleChange} disabled={isPending}>
        <SelectTrigger className="w-[150px] py-0">
          <SelectValue placeholder="Choose a language" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
}
