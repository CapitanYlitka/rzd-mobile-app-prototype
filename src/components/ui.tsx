import { createContext, useContext, type ReactNode } from "react";
import { IconBack, IconWifi } from "./icons";

/* ── navigation ─────────────────────────────────── */
export type ScreenId =
  | "home"
  | "search-results"
  | "ticket"
  | "smart-profile"
  | "recommendations"
  | "favorite-routes"
  | "analytics"
  | "search"
  | "trips"
  | "bonus"
  | "buy-ticket"
  | "success"
  | "settings"
  | "settings-profile"
  | "settings-passengers"
  | "settings-cards"
  | "settings-app"
  | "chat"
  | "portal";

export type Nav = {
  push: (s: ScreenId) => void;
  pop: () => void;
  reset: (s: ScreenId) => void;
  current: ScreenId;
  canGoBack: boolean;
};

export const NavContext = createContext<Nav>(null as unknown as Nav);
export const useNav = () => useContext(NavContext);

/* ── theme ──────────────────────────────────────── */
export type ThemeId = "light" | "dark" | "brand";

export const THEME_LABELS: Record<ThemeId, string> = {
  light: "Светлая",
  dark: "Тёмная",
  brand: "Фирменная",
};

export type Theme = { theme: ThemeId; setTheme: (t: ThemeId) => void };

export const ThemeContext = createContext<Theme>({ theme: "light", setTheme: () => undefined });
export const useTheme = () => useContext(ThemeContext);

/* ── toggle switch ──────────────────────────────── */
export function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`tap w-[52px] h-8 rounded-full p-1 transition-colors shrink-0 ${on ? "bg-rzd" : "bg-black/15"}`}
      aria-pressed={on}
    >
      <div className={`w-6 h-6 rounded-full bg-white shadow transition-transform ${on ? "translate-x-5" : ""}`} />
    </button>
  );
}

/* ── toast ──────────────────────────────────────── */
export function Toast({ show, text }: { show: boolean; text: string }) {
  if (!show) return null;
  return (
    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-40 bg-[#111113] text-white text-[13px] font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 toast-in whitespace-nowrap">
      <svg className="w-4 h-4 text-emerald-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 13l4.5 4.5L19 7" />
      </svg>
      {text}
    </div>
  );
}

/* ── status bar ─────────────────────────────────── */
export function StatusBar({ light }: { light?: boolean }) {
  return (
    <div className={`flex items-center justify-between px-6 pt-3 pb-1 text-[13px] font-semibold ${light ? "text-white" : "text-ink"}`}>
      <span>9:41</span>
      <div className="flex items-center gap-1.5">
        {/* signal */}
        <svg className="w-4 h-3" viewBox="0 0 16 12" fill="currentColor">
          <rect x="0" y="8" width="3" height="4" rx="0.8" />
          <rect x="4.3" y="5.5" width="3" height="6.5" rx="0.8" />
          <rect x="8.6" y="3" width="3" height="9" rx="0.8" />
          <rect x="12.9" y="0.5" width="3" height="11.5" rx="0.8" />
        </svg>
        <IconWifi className="w-4 h-4" />
        {/* battery */}
        <svg className="w-6 h-3" viewBox="0 0 25 12" fill="none">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3" stroke="currentColor" opacity="0.4" />
          <rect x="2" y="2" width="15" height="8" rx="1.6" fill="currentColor" />
          <path d="M23.5 4v4c1-.3 1.5-1 1.5-2s-.5-1.7-1.5-2z" fill="currentColor" opacity="0.4" />
        </svg>
      </div>
    </div>
  );
}

/* ── header with back ───────────────────────────── */
export function Header({
  title,
  subtitle,
  light,
  right,
}: {
  title: string;
  subtitle?: string;
  light?: boolean;
  right?: ReactNode;
}) {
  const nav = useNav();
  return (
    <div className={`flex items-center gap-2 px-4 py-2 ${light ? "text-white" : "text-ink"}`}>
      {nav.canGoBack && (
        <button
          onClick={nav.pop}
          className={`tap -ml-1 w-10 h-10 rounded-full flex items-center justify-center ${
            light ? "bg-white/15" : "bg-surface"
          }`}
          aria-label="Назад"
        >
          <IconBack className="w-5 h-5" />
        </button>
      )}
      <div className="flex-1 min-w-0">
        <h1 className="text-[19px] font-bold leading-tight truncate">{title}</h1>
        {subtitle && (
          <p className={`text-[12px] leading-tight ${light ? "text-white/70" : "text-ink-2"}`}>{subtitle}</p>
        )}
      </div>
      {right}
    </div>
  );
}

/* ── primary button ─────────────────────────────── */
export function PrimaryButton({
  children,
  onClick,
  variant = "red",
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "red" | "white" | "outline" | "dark";
  className?: string;
}) {
  const styles = {
    red: "bg-rzd text-white shadow-lg shadow-rzd/30",
    white: "bg-white text-rzd shadow-lg shadow-black/10",
    outline: "bg-transparent text-rzd border-[1.5px] border-rzd/60",
    dark: "bg-ink text-white",
  }[variant];
  return (
    <button
      onClick={onClick}
      className={`tap w-full h-[52px] rounded-2xl font-semibold text-[15px] flex items-center justify-center gap-2 ${styles} ${className}`}
    >
      {children}
    </button>
  );
}

/* ── section heading ────────────────────────────── */
export function SectionTitle({ children, action, onAction }: { children: ReactNode; action?: string; onAction?: () => void }) {
  return (
    <div className="flex items-baseline justify-between px-5 mb-3">
      <h2 className="text-[16px] font-bold text-ink">{children}</h2>
      {action && (
        <button onClick={onAction} className="tap text-[13px] font-semibold text-rzd">
          {action}
        </button>
      )}
    </div>
  );
}

/* ── generic card ───────────────────────────────── */
export function Card({ children, className = "", onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl shadow-[0_1px_10px_rgba(0,0,0,0.05)] ${onClick ? "tap cursor-pointer" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

/* ── chip / pill ────────────────────────────────── */
export function Chip({ children, active, onClick }: { children: ReactNode; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`tap shrink-0 px-4 h-9 rounded-full text-[13px] font-semibold transition-colors ${
        active ? "bg-rzd text-white" : "bg-white text-ink border border-black/8"
      }`}
    >
      {children}
    </button>
  );
}

/* ── home indicator ─────────────────────────────── */
export function HomeIndicator({ light }: { light?: boolean }) {
  return (
    <div className="flex justify-center pt-2 pb-2">
      <div className={`w-32 h-[5px] rounded-full ${light ? "bg-white/80" : "bg-ink/80"}`} />
    </div>
  );
}
