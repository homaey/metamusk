/**
 * i18n setup. Detects the user's language (Telegram language_code → browser →
 * stored choice), falls back to English, and keeps document direction (LTR/RTL)
 * in sync so Persian/Arabic render correctly.
 */
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { resources, RTL_LANGS } from "./locales.js";

const STORAGE_KEY = "metamusk_lang";

export function applyDirection(lang: string): void {
  const base = lang.split("-")[0]!;
  const dir = RTL_LANGS.includes(base) ? "rtl" : "ltr";
  document.documentElement.dir = dir;
  document.documentElement.lang = base;
}

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: Object.keys(resources),
    nonExplicitSupportedLngs: true, // map en-US → en, fa-IR → fa, etc.
    load: "languageOnly",
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: STORAGE_KEY,
      caches: ["localStorage"],
    },
  });

applyDirection(i18n.language || "en");
i18n.on("languageChanged", applyDirection);

export function changeLanguage(lang: string): void {
  localStorage.setItem(STORAGE_KEY, lang);
  void i18n.changeLanguage(lang);
}

export default i18n;
