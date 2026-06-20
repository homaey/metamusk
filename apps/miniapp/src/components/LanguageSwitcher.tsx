import { useTranslation } from "react-i18next";
import { LANGUAGES } from "../i18n/locales.js";
import { changeLanguage } from "../i18n/index.js";
import { haptic } from "../telegram.js";

/** Compact language picker (native <select> for accessibility + small footprint). */
export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { i18n, t } = useTranslation();
  const current = (i18n.language || "en").split("-")[0];

  return (
    <label className={`lang-switch ${compact ? "compact" : ""}`} aria-label={t("common.language")}>
      <span className="globe">🌐</span>
      <select
        value={current}
        onChange={(e) => { haptic("light"); changeLanguage(e.target.value); }}
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>{l.label}</option>
        ))}
      </select>
    </label>
  );
}
