import { useCallback, useRef, useState } from "react";
import { NavContext, ThemeContext, type Nav, type ScreenId, type ThemeId, THEME_LABELS } from "./components/ui";
import { HomeScreen, SearchScreen, TripsScreen, BonusScreen } from "./screens/main";
import {
  SmartProfileScreen,
  RecommendationsScreen,
  FavoriteRoutesScreen,
  AnalyticsScreen,
} from "./screens/profile";
import { BuyTicketScreen, SuccessScreen, TicketScreen } from "./screens/purchase";
import { SearchResultsScreen } from "./screens/search-results";
import { PortalScreen } from "./screens/portal";
import {
  SettingsScreen,
  ProfileSettingsScreen,
  PassengersSettingsScreen,
  CardsSettingsScreen,
  AppSettingsScreen,
} from "./screens/settings";
import { ChatScreen } from "./screens/chat";
import { IconSparkles, IconChevronRight } from "./components/icons";
import { BookingProvider } from "./booking";

const SCREENS: Record<ScreenId, { title: string; el: () => React.ReactElement }> = {
  "home": { title: "Главная", el: () => <HomeScreen /> },
  "search-results": { title: "Выбор поезда", el: () => <SearchResultsScreen /> },
  "ticket": { title: "Электронный билет", el: () => <TicketScreen /> },
  "smart-profile": { title: "Smart Profile", el: () => <SmartProfileScreen /> },
  "recommendations": { title: "Рекомендации", el: () => <RecommendationsScreen /> },
  "favorite-routes": { title: "Любимые маршруты", el: () => <FavoriteRoutesScreen /> },
  "analytics": { title: "Аналитика", el: () => <AnalyticsScreen /> },
  "search": { title: "Поиск билетов", el: () => <SearchScreen /> },
  "trips": { title: "Мои поездки", el: () => <TripsScreen /> },
  "bonus": { title: "РЖД Бонус", el: () => <BonusScreen /> },
  "buy-ticket": { title: "Оформление билета", el: () => <BuyTicketScreen /> },
  "success": { title: "Билет оформлен", el: () => <SuccessScreen /> },
  "settings": { title: "Настройки", el: () => <SettingsScreen /> },
  "settings-profile": { title: "Личные данные", el: () => <ProfileSettingsScreen /> },
  "settings-passengers": { title: "Попутчики", el: () => <PassengersSettingsScreen /> },
  "settings-cards": { title: "Карты оплаты", el: () => <CardsSettingsScreen /> },
  "settings-app": { title: "Оформление", el: () => <AppSettingsScreen /> },
  "chat": { title: "Чат-бот Гриша", el: () => <ChatScreen /> },
  "portal": { title: "Попутчик", el: () => <PortalScreen /> },
};

const FLOW: ScreenId[] = ["home", "smart-profile", "recommendations", "favorite-routes", "analytics"];

type StackItem = { id: ScreenId; key: number };

export default function App() {
  const keyRef = useRef(1);
  const [stack, setStack] = useState<StackItem[]>([{ id: "home", key: 0 }]);
  const [exiting, setExiting] = useState<StackItem | null>(null);
  const [theme, setTheme] = useState<ThemeId>("light");

  const push = useCallback((s: ScreenId) => {
    setStack((st) => [...st, { id: s, key: keyRef.current++ }]);
  }, []);

  const pop = useCallback(() => {
    setStack((st) => {
      if (st.length <= 1) return st;
      const top = st[st.length - 1];
      setExiting(top);
      setTimeout(() => setExiting(null), 300);
      return st.slice(0, -1);
    });
  }, []);

  const reset = useCallback((s: ScreenId) => {
    setStack([{ id: s, key: keyRef.current++ }]);
  }, []);

  const current = stack[stack.length - 1];
  const nav: Nav = { push, pop, reset, current: current.id, canGoBack: stack.length > 1 };

  return (
    <BookingProvider>
    <ThemeContext.Provider value={{ theme, setTheme }}>
    <div className="min-h-screen bg-[#101014] flex items-center justify-center gap-10 px-4 py-6 lg:px-10 relative overflow-hidden">
      {/* backdrop decor */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-[480px] h-[480px] rounded-full bg-rzd/25 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 w-[480px] h-[480px] rounded-full bg-rzd/15 blur-[140px]" />

      {/* side panel — desktop only */}
      <aside className="hidden lg:block w-[340px] shrink-0 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rzd flex items-center justify-center shadow-lg shadow-rzd/40">
            <span className="text-white font-black text-[15px] tracking-tight">РЖД</span>
          </div>
          <div>
            <h1 className="text-white text-[19px] font-bold leading-tight">РЖД Пассажирам</h1>
            <p className="text-white/50 text-[13px]">Интерактивный прототип · Smart Profile</p>
          </div>
        </div>

        <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-rzd">
            <IconSparkles className="w-4.5 h-4.5" />
            <span className="text-[12px] font-bold uppercase tracking-wider text-white/90">Новый раздел</span>
          </div>
          <p className="text-white/60 text-[13px] leading-relaxed mt-2">
            RZD Smart Profile — умный профиль пассажира: персональные рекомендации, любимые маршруты и места,
            аналитика поездок и повторная покупка билета в один клик.
          </p>
        </div>

        {/* prototype flow */}
        <div className="mt-5">
          <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest mb-3">Prototype · карта переходов</p>
          <div className="space-y-1.5">
            {FLOW.map((s, i) => (
              <div key={s}>
                <button
                  onClick={() => reset(s)}
                  className={`tap w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl border text-left transition-colors ${
                    current.id === s
                      ? "bg-rzd border-rzd text-white shadow-lg shadow-rzd/30"
                      : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                  }`}
                >
                  <span className={`w-6 h-6 rounded-lg text-[11px] font-bold flex items-center justify-center shrink-0 ${
                    current.id === s ? "bg-white/20" : "bg-white/10"
                  }`}>{i + 1}</span>
                  <span className="text-[13.5px] font-semibold flex-1">{SCREENS[s].title}</span>
                  <IconChevronRight className="w-4 h-4 opacity-50" />
                </button>
                {i < FLOW.length - 1 && <div className="ml-6 w-px h-2 bg-white/15" />}
              </div>
            ))}
          </div>
          <p className="text-white/35 text-[12px] leading-relaxed mt-4">
            Все переходы кликабельны: Главная → Smart Profile → Рекомендации → Маршруты → Аналитика.
            Поиск ведёт к списку поездов по маршруту; оформление — мастер из 4 шагов: пассажиры, вагон и места,
            услуги, оплата картой или баллами. В настройках — личные данные, попутчики, карты и темы.
          </p>
        </div>

        {/* theme switcher */}
        <div className="mt-5">
          <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest mb-2.5">Тема приложения</p>
          <div className="flex gap-2">
            {(Object.keys(THEME_LABELS) as ThemeId[]).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`tap flex-1 h-9 rounded-xl text-[12px] font-semibold border transition-colors ${
                  theme === t
                    ? "bg-rzd border-rzd text-white shadow-lg shadow-rzd/25"
                    : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
                }`}
              >
                {THEME_LABELS[t]}
              </button>
            ))}
          </div>
        </div>

        {/* signature */}
        <div className="mt-6 pt-5 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white font-black text-[13px]">
              DA
            </div>
            <div>
              <p className="text-white text-[13px] font-bold leading-tight">Project, design and development</p>
              <p className="text-white/55 text-[12px] leading-tight mt-0.5">
                by <span className="text-white font-semibold">Dmitry Alexandrov</span> with AI
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* phone */}
      <NavContext.Provider value={nav}>
        <div className="relative z-10 shrink-0">
          <div className="relative w-[390px] max-w-[calc(100vw-24px)] h-[820px] max-h-[calc(100vh-40px)] min-h-[640px] bg-black rounded-[52px] p-[10px] shadow-[0_40px_100px_rgba(0,0,0,0.7),0_0_0_2px_rgba(255,255,255,0.08)]">
            {/* side buttons */}
            <div className="absolute -left-[3px] top-[140px] w-[3px] h-10 bg-[#2a2a2e] rounded-l" />
            <div className="absolute -left-[3px] top-[195px] w-[3px] h-16 bg-[#2a2a2e] rounded-l" />
            <div className="absolute -right-[3px] top-[170px] w-[3px] h-20 bg-[#2a2a2e] rounded-r" />

            <div className="relative w-full h-full rounded-[42px] overflow-hidden bg-surface" data-theme={theme}>
              {/* dynamic island */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[110px] h-[30px] bg-black rounded-full z-50" />

              {/* screen stack */}
              {stack.map((item, i) => (
                <div
                  key={item.key}
                  className={`absolute inset-0 ${i > 0 ? "screen-enter" : ""} ${i < stack.length - 1 ? "pointer-events-none" : ""}`}
                  style={{ zIndex: i + 1 }}
                  aria-hidden={i < stack.length - 1}
                >
                  {SCREENS[item.id].el()}
                </div>
              ))}
              {/* exiting screen on top */}
              {exiting && (
                <div key={`exit-${exiting.key}`} className="absolute inset-0 screen-exit pointer-events-none" style={{ zIndex: 99 }}>
                  {SCREENS[exiting.id].el()}
                </div>
              )}
            </div>
          </div>

          {/* mobile hint */}
          <p className="lg:hidden text-center text-white/40 text-[12px] mt-4">
            Прототип «РЖД Пассажирам» · Smart Profile · все переходы кликабельны
          </p>
          <p className="text-center text-white/45 text-[11.5px] mt-3">
            Project, design and development by{" "}
            <span className="text-white/80 font-semibold">Dmitry Alexandrov</span> with AI
          </p>
        </div>
      </NavContext.Provider>
    </div>
    </ThemeContext.Provider>
    </BookingProvider>
  );
}
