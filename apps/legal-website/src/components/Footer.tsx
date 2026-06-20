import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Scale, Phone, Mail, MapPin, Instagram, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  const t = useTranslations("footer");
  const tContact = useTranslations("contact");
  const locale = useLocale();
  const isRTL = locale === "fa";

  return (
    <footer
      className="bg-primary-950 text-white"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href={`/${locale}`} className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gold-500 rounded-lg flex items-center justify-center">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <span className={`font-bold text-lg ${isRTL ? "font-fa" : "font-en"}`}>
                {isRTL ? "موسسه حقوقی" : "Legal Firm"}
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              {t("description")}
            </p>
            <div className="flex items-center gap-3">
              {[Instagram, Linkedin, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 bg-white/10 hover:bg-gold-500 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-5">{t("links")}</h3>
            <ul className="space-y-3">
              {[
                { href: `/${locale}`, label: isRTL ? "صفحه اصلی" : "Home" },
                { href: `/${locale}/lawyers`, label: isRTL ? "وکلای ما" : "Our Lawyers" },
                { href: `/${locale}/services`, label: isRTL ? "خدمات" : "Services" },
                { href: `/${locale}/articles`, label: isRTL ? "مقالات" : "Articles" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-gold-400 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-white mb-5">{t("services")}</h3>
            <ul className="space-y-3">
              {(isRTL
                ? ["دادخواست", "اظهارنامه", "شکواییه", "لوایح قضایی", "مشاوره حقوقی"]
                : ["Petition", "Legal Notice", "Complaint", "Legal Briefs", "Legal Consulting"]
              ).map((item) => (
                <li key={item}>
                  <Link
                    href={`/${locale}/documents`}
                    className="text-gray-400 hover:text-gold-400 text-sm transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-5">{tContact("title")}</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold-400 mt-0.5 shrink-0" />
                <span className="text-gray-400 text-sm">{tContact("addressValue")}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <a href="tel:+982188888888" className="text-gray-400 hover:text-gold-400 text-sm transition-colors">
                  {tContact("phoneValue")}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <a href="mailto:info@legalfirm.ir" className="text-gray-400 hover:text-gold-400 text-sm transition-colors">
                  {tContact("emailValue")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Legal Firm. {t("rights")}.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
              {t("privacy")}
            </Link>
            <Link href="#" className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
              {t("terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
