/**
 * Thin wrapper over the Telegram WebApp runtime (window.Telegram.WebApp).
 * Degrades gracefully in a normal browser so the app is developable without
 * Telegram. We never trust the client-side user object for auth — `initData`
 * is verified server-side; this is for UX only.
 */

type ThemeParams = Record<string, string>;

interface CloudStorageAPI {
  setItem(key: string, value: string, cb?: (err: Error | null, ok: boolean) => void): void;
  getItem(key: string, cb: (err: Error | null, val: string) => void): void;
  getItems(keys: string[], cb: (err: Error | null, vals: Record<string, string>) => void): void;
  removeItem(key: string, cb?: (err: Error | null, ok: boolean) => void): void;
  removeItems(keys: string[], cb?: (err: Error | null, ok: boolean) => void): void;
  getKeys(cb: (err: Error | null, keys: string[]) => void): void;
}

interface TelegramWebApp {
  initData: string;
  initDataUnsafe?: { user?: { id: number; username?: string; first_name?: string } };
  colorScheme?: "light" | "dark";
  themeParams?: ThemeParams;
  ready: () => void;
  expand: () => void;
  HapticFeedback?: { impactOccurred: (s: "light" | "medium" | "heavy") => void };
  onEvent?: (event: string, cb: () => void) => void;
  CloudStorage?: CloudStorageAPI;
  showScanQrPopup?: (params: { text?: string }, callback: (data: string) => boolean | void) => void;
  closeScanQrPopup?: () => void;
}

function getWebApp(): TelegramWebApp | undefined {
  return (globalThis as { Telegram?: { WebApp?: TelegramWebApp } }).Telegram?.WebApp;
}

const TELEGRAM_SDK_URL = "https://telegram.org/js/telegram-web-app.js";

/**
 * Load the Telegram WebApp runtime AFTER first paint (non-blocking). Loading it
 * as a render-blocking <script> stalls the page if telegram.org is unreachable
 * (e.g. dev sandboxes). When absent, the app degrades to browser mode.
 */
function loadTelegramSdk(): Promise<void> {
  return new Promise((resolve) => {
    if (getWebApp() || document.querySelector(`script[src="${TELEGRAM_SDK_URL}"]`)) {
      return resolve();
    }
    const s = document.createElement("script");
    s.src = TELEGRAM_SDK_URL;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => resolve(); // tolerate offline / blocked: continue in browser mode
    document.head.appendChild(s);
  });
}

export const isTelegram = (): boolean => Boolean(getWebApp()?.initData);

/** The raw initData string to send to the backend as `Authorization: tma ...`. */
export const getInitData = (): string => getWebApp()?.initData ?? "";

export function applyTelegramTheme(): void {
  const wa = getWebApp();
  const root = document.documentElement;
  const scheme = wa?.colorScheme ?? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  root.dataset.theme = scheme;
  const params = wa?.themeParams ?? {};
  // Map Telegram theme vars onto our CSS custom properties when present.
  for (const [key, value] of Object.entries(params)) {
    root.style.setProperty(`--tg-${key.replace(/_/g, "-")}`, value);
  }
}

export async function initTelegram(): Promise<void> {
  applyTelegramTheme(); // paint immediately with system theme
  await loadTelegramSdk();
  const wa = getWebApp();
  wa?.ready();
  wa?.expand();
  applyTelegramTheme(); // re-apply with Telegram theme once available
  wa?.onEvent?.("themeChanged", applyTelegramTheme);
}

export function haptic(kind: "light" | "medium" | "heavy" = "light"): void {
  getWebApp()?.HapticFeedback?.impactOccurred(kind);
}

/** Telegram native QR scanner. Resolves with scanned text, or rejects if unavailable. */
export function scanQr(prompt?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const wa = getWebApp();
    if (!wa?.showScanQrPopup) { reject(new Error("QR scanner not available")); return; }
    wa.showScanQrPopup({ text: prompt }, (data) => {
      wa.closeScanQrPopup?.();
      resolve(data);
      return true; // close after first scan
    });
  });
}

/** Access Telegram CloudStorage (available inside Telegram only). */
export function getCloudStorage(): CloudStorageAPI | null {
  return getWebApp()?.CloudStorage ?? null;
}

export function isCloudStorageAvailable(): boolean {
  return Boolean(getCloudStorage());
}
