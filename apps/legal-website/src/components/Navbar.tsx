"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Menu, X, Scale, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isRTL = locale === "fa";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: `/${locale}`, label: t("home") },
    { href: `/${locale}/lawyers`, label: t("lawyers") },
    { href: `/${locale}/services`, label: t("services") },
    { href: `/${locale}/documents`, label: t("documents") },
    { href: `/${locale}/articles`, label: t("articles") },
    { href: `/${locale}/contact`, label: t("contact") },
  ];

  const otherLocale = locale === "fa" ? "en" : "fa";
  const switchPath = pathname.replace(`/${locale}`, `/${otherLocale}`);

  return (
    <nav
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      )}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link
            href={`/${locale}`}
            className="flex items-center gap-2 group"
          >
            <div className="w-9 h-9 bg-primary-700 rounded-lg flex items-center justify-center group-hover:bg-primary-600 transition-colors">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <span
              className={cn(
                "font-bold text-lg",
                scrolled ? "text-primary-900" : "text-white",
                isRTL ? "font-fa" : "font-en"
              )}
            >
              {isRTL ? "موسسه حقوقی" : "Legal Firm"}
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  scrolled
                    ? "text-gray-700 hover:text-primary-700 hover:bg-primary-50"
                    : "text-white/90 hover:text-white hover:bg-white/10",
                  pathname === link.href && (scrolled ? "text-primary-700 bg-primary-50" : "text-white bg-white/20")
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Locale switcher */}
            <Link
              href={switchPath}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                scrolled
                  ? "text-gray-600 hover:text-primary-700 hover:bg-primary-50"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              )}
            >
              <Globe className="w-4 h-4" />
              {locale === "fa" ? "EN" : "FA"}
            </Link>
            {/* CTA */}
            <Link
              href={`/${locale}/contact`}
              className="bg-gold-500 hover:bg-gold-600 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors shadow-md"
            >
              {t("consultation")}
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className={cn(
              "lg:hidden p-2 rounded-lg",
              scrolled ? "text-gray-700" : "text-white"
            )}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-primary-50 text-primary-700"
                    : "text-gray-700 hover:bg-gray-50"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <Link
                href={switchPath}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600"
              >
                <Globe className="w-4 h-4" />
                {locale === "fa" ? "English" : "فارسی"}
              </Link>
              <Link
                href={`/${locale}/contact`}
                onClick={() => setMobileOpen(false)}
                className="bg-gold-500 text-white px-5 py-2 rounded-lg text-sm font-semibold"
              >
                {t("consultation")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
