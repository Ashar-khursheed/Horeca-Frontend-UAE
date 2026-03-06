
'use client';

import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("home");

  return (
    <div className="min-h-screen bg-background">

      {/* Temp Header — baad me GlobalLayout me jayega */}
      <header className="flex items-center justify-between global-container py-4 border-b border-border">
        <h1 className="text-xl font-bold text-primary">HorecaStore</h1>
        <LanguageSwitcher />
      </header>

      {/* Hero */}
      <main className="global-container py-10">
        <h2 className="text-3xl font-bold text-heading">
          {t("hero_title")}
        </h2>
        <p className="text-muted-foreground mt-2">
          {t("hero_subtitle")}
        </p>
        <button className="btn btn-primary btn-md mt-6">
          {t("shop_now")}
        </button>
      </main>

    </div>
  );
}


import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

const languages = [
  { code: 'en', label: 'English', flag: '🇺🇸', native: 'English' },
  { code: 'ar', label: 'Arabic',  flag: '🇦🇪', native: 'عربي' },
];

export  function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = languages.find((l) => l.code === locale) ?? languages[0];

  // Outside click se close
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const switchLocale = (code: string) => {
    // /en/products → /ar/products
    const newPath = pathname.replace(`/${locale}`, `/${code}`);
    router.push(newPath);
    router.refresh();
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">

      {/* Trigger Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border 
                   border-gray-200 bg-white hover:bg-gray-50 
                   transition-all duration-200 text-sm font-medium"
      >
        <span>{current.flag}</span>
        <span className="text-gray-700">{current.native}</span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 
                     ${open ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" 
                strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full mt-2 end-0 w-40 bg-white rounded-xl 
                        shadow-lg border border-gray-100 overflow-hidden z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => switchLocale(lang.code)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm
                         transition-colors duration-150 hover:bg-gray-50
                         ${locale === lang.code 
                           ? 'bg-primary/10 text-primary font-semibold' 
                           : 'text-gray-700'}`}
            >
              <span className="text-base">{lang.flag}</span>
              <div className="text-start">
                <div className="font-medium">{lang.native}</div>
                <div className="text-xs text-gray-400">{lang.label}</div>
              </div>
              {locale === lang.code && (
                <svg className="w-4 h-4 ms-auto text-primary" 
                     fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" 
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                        clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}