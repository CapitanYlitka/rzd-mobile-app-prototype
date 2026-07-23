import { useEffect, useState } from "react";
import {
  StatusBar,
  Header,
  PrimaryButton,
  SectionTitle,
  Card,
  Chip,
  Toggle,
  Toast,
  useNav,
} from "../components/ui";
import {
  IconSearch,
  IconTicket,
  IconStar,
  IconSparkles,
  IconChevronRight,
  IconSwap,
  IconCalendar,
  IconTrain,
  IconBell,
  IconClock,
  IconGift,
  IconCheck,
  IconLightning,
  IconUser,
  IconHome,
  IconGear,
} from "../components/icons";
import { user, upcomingTrip, tripHistory, favoriteRoutes } from "../data";
import { useBooking } from "../booking";

/* ═══════════════════ ЭКРАН 1 · ГЛАВНАЯ ═══════════════════ */
export function HomeScreen() {
  const nav = useNav();
  return (
    <div className="relative h-full flex flex-col bg-surface">
      {/* floating Grisha */}
      <button
        onClick={() => nav.push("chat")}
        className="tap fab-ping absolute right-4 bottom-[96px] z-30 w-14 h-14 rounded-full bg-white shadow-xl shadow-black/25 flex items-center justify-center"
        aria-label="Чат-бот Гриша"
      >
        <img src="/images/grisha.png" alt="Гриша" className="w-11 h-11 rounded-full object-cover" />
        <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
      </button>
      {/* red hero */}
      <div className="bg-gradient-to-br from-rzd to-rzd-darker rounded-b-[28px] pb-6 shrink-0">
        <StatusBar light />
        <div className="flex items-center justify-between px-5 pt-2">
          <div className="fade-up">
            <p className="text-white/70 text-[13px]">Доброе утро 👋</p>
            <h1 className="text-white text-[22px] font-bold leading-tight">{user.shortName}</h1>
          </div>
          <div className="flex items-center gap-2 fade-up d-1">
            <button
              onClick={() => nav.push("settings")}
              className="tap w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-white"
              aria-label="Настройки"
            >
              <IconGear className="w-5 h-5" />
            </button>
            <button className="tap w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-white">
              <IconBell className="w-5 h-5" />
            </button>
            <button onClick={() => nav.push("smart-profile")} className="tap w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/60">
              <img src={user.avatar} alt="Профиль" className="w-full h-full object-cover" />
            </button>
          </div>
        </div>
        {/* search pill */}
        <button
          onClick={() => nav.push("search")}
          className="tap fade-up d-2 mx-5 mt-4 w-[calc(100%-40px)] h-12 bg-white rounded-2xl flex items-center gap-3 px-4 text-ink-2 shadow-lg shadow-black/10"
        >
          <IconSearch className="w-5 h-5 text-rzd" />
          <span className="text-[14px]">Куда поедем? Поиск билетов…</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-4">
        {/* quick actions */}
        <div className="grid grid-cols-4 gap-2 px-5 mt-5">
          {[
            { icon: <IconSearch className="w-[22px] h-[22px]" />, label: "Билеты", to: "search" as const },
            { icon: <IconTicket className="w-[22px] h-[22px]" />, label: "Поездки", to: "trips" as const },
            { icon: <IconStar className="w-[22px] h-[22px]" />, label: "РЖД Бонус", to: "bonus" as const },
            { icon: <IconSparkles className="w-[22px] h-[22px]" />, label: "Smart Profile", to: "smart-profile" as const },
          ].map((a, i) => (
            <button key={a.label} onClick={() => nav.push(a.to)} className={`tap pop-in d-${i + 1} flex flex-col items-center gap-2`}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${a.to === "smart-profile" ? "bg-rzd text-white shadow-lg shadow-rzd/30" : "bg-white text-rzd shadow-[0_1px_10px_rgba(0,0,0,0.06)]"}`}>
                {a.icon}
              </div>
              <span className="text-[11px] font-semibold text-ink leading-tight text-center">{a.label}</span>
            </button>
          ))}
        </div>

        {/* Smart Profile promo card */}
        <div className="px-5 mt-6 fade-up d-3">
          <Card onClick={() => nav.push("smart-profile")} className="relative overflow-hidden p-4 bg-gradient-to-br !from-ink !to-[#3a3a3e] bg-gradient-to-br from-ink to-[#3a3a3e]">
            <div className="absolute -right-6 -top-8 w-32 h-32 rounded-full bg-rzd/40 blur-2xl" />
            <div className="flex items-center gap-3 relative">
              <div className="w-11 h-11 rounded-xl bg-rzd flex items-center justify-center text-white shrink-0">
                <IconSparkles className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-white font-bold text-[15px]">RZD Smart Profile</p>
                  <span className="text-[9px] font-bold bg-rzd text-white px-1.5 py-0.5 rounded-md tracking-wide">NEW</span>
                </div>
                <p className="text-white/60 text-[12px] leading-snug mt-0.5">Персональные рекомендации, любимые маршруты и аналитика поездок</p>
              </div>
              <IconChevronRight className="w-5 h-5 text-white/50 shrink-0" />
            </div>
          </Card>
        </div>

        {/* upcoming trip */}
        <div className="mt-6">
          <SectionTitle action="Все" onAction={() => nav.push("trips")}>Ближайшая поездка</SectionTitle>
          <div className="px-5 fade-up d-4">
            <Card onClick={() => nav.push("trips")} className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-semibold text-rzd bg-rzd-light px-2.5 py-1 rounded-lg">{upcomingTrip.date}</span>
                <span className="text-[12px] text-ink-2 flex items-center gap-1"><IconTrain className="w-4 h-4" />{upcomingTrip.train}</span>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div>
                  <p className="text-[24px] font-bold text-ink leading-none">{upcomingTrip.depart}</p>
                  <p className="text-[13px] text-ink-2 mt-1">{upcomingTrip.from}</p>
                </div>
                <div className="flex-1 px-3 flex flex-col items-center">
                  <p className="text-[11px] text-ink-2 mb-1">3 ч 45 мин</p>
                  <div className="w-full flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-rzd" />
                    <div className="flex-1 h-[2px] bg-gradient-to-r from-rzd to-rzd/20 relative">
                      <IconTrain className="w-4 h-4 text-rzd absolute -top-[7px] left-1/2 -translate-x-1/2 train-anim" />
                    </div>
                    <div className="w-2 h-2 rounded-full border-2 border-rzd" />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[24px] font-bold text-ink leading-none">{upcomingTrip.arrive}</p>
                  <p className="text-[13px] text-ink-2 mt-1">{upcomingTrip.to}</p>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-dashed border-black/10 flex items-center justify-between text-[12px]">
                <span className="text-ink-2">{upcomingTrip.seat}</span>
                <span className="font-semibold text-ink">{upcomingTrip.station}</span>
              </div>
            </Card>
          </div>
        </div>

        {/* bonus mini card */}
        <div className="mt-6">
          <SectionTitle action="Подробнее" onAction={() => nav.push("bonus")}>РЖД Бонус</SectionTitle>
          <div className="px-5 fade-up d-5">
            <Card onClick={() => nav.push("bonus")} className="p-4 flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white shrink-0">
                <IconStar className="w-6 h-6" filled />
              </div>
              <div className="flex-1">
                <p className="font-bold text-ink text-[15px]">{user.points.toLocaleString("ru-RU")} баллов</p>
                <p className="text-[12px] text-ink-2">Уровень «{user.level}» · до Платины {user.toNextLevel.toLocaleString("ru-RU")}</p>
              </div>
              <IconChevronRight className="w-5 h-5 text-ink-2/50" />
            </Card>
          </div>
        </div>
      </div>

      <BottomNav active="home" />
    </div>
  );
}

/* ── bottom navigation ──────────────────────────── */
export function BottomNav({ active }: { active: "home" | "search" | "trips" | "profile" }) {
  const nav = useNav();
  const items = [
    { id: "home" as const, icon: IconHome, label: "Главная", to: "home" as const },
    { id: "search" as const, icon: IconSearch, label: "Билеты", to: "search" as const },
    { id: "trips" as const, icon: IconTicket, label: "Поездки", to: "trips" as const },
    { id: "profile" as const, icon: IconUser, label: "Профиль", to: "smart-profile" as const },
  ];
  return (
    <div className="shrink-0 bg-white border-t border-black/5 px-2 pt-1.5">
      <div className="grid grid-cols-4">
        {items.map((it) => (
          <button
            key={it.id}
            onClick={() => (active === it.id ? undefined : nav.reset(it.to))}
            className={`tap flex flex-col items-center gap-0.5 py-1 ${active === it.id ? "text-rzd" : "text-ink-2/70"}`}
          >
            <it.icon className="w-6 h-6" />
            <span className="text-[10px] font-semibold">{it.label}</span>
          </button>
        ))}
      </div>
      <div className="flex justify-center pt-1 pb-2">
        <div className="w-32 h-[5px] rounded-full bg-ink/80" />
      </div>
    </div>
  );
}

/* ═══════════════════ ЭКРАН 6 · ПОИСК БИЛЕТОВ ═══════════════════ */
export function SearchScreen() {
  const nav = useNav();
  const { updateBooking } = useBooking();
  const [from, setFrom] = useState("Москва");
  const [to, setTo] = useState("Санкт-Петербург");
  const swap = () => { setFrom(to); setTo(from); };
  const findTrains = () => {
    updateBooking({ searchFrom: from, searchTo: to });
    nav.push("search-results");
  };
  return (
    <div className="h-full flex flex-col bg-surface">
      <div className="bg-gradient-to-br from-rzd to-rzd-darker rounded-b-[28px] pb-5 shrink-0">
        <StatusBar light />
        <Header light title="Поиск билетов" subtitle="Поезда дальнего следования" />
        {/* search form */}
        <div className="mx-5 mt-2 bg-white rounded-2xl shadow-xl shadow-black/15 overflow-hidden fade-up">
          <div className="relative">
            <div className="px-4 py-3 border-b border-black/5">
              <p className="text-[11px] text-ink-2 font-semibold uppercase tracking-wide">Откуда</p>
              <input value={from} onChange={(e) => setFrom(e.target.value)} className="w-full text-[16px] font-semibold text-ink outline-none" />
            </div>
            <div className="px-4 py-3">
              <p className="text-[11px] text-ink-2 font-semibold uppercase tracking-wide">Куда</p>
              <input value={to} onChange={(e) => setTo(e.target.value)} className="w-full text-[16px] font-semibold text-ink outline-none" />
            </div>
            <button onClick={swap} className="tap absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-rzd-light text-rzd flex items-center justify-center">
              <IconSwap className="w-5 h-5" />
            </button>
          </div>
          <div className="flex border-t border-black/5">
            <div className="flex-1 px-4 py-3 flex items-center gap-2">
              <IconCalendar className="w-5 h-5 text-rzd" />
              <div>
                <p className="text-[11px] text-ink-2">Туда</p>
                <p className="text-[14px] font-semibold text-ink">27 фев</p>
              </div>
            </div>
            <div className="w-px bg-black/5" />
            <div className="flex-1 px-4 py-3 flex items-center gap-2">
              <IconUser className="w-5 h-5 text-rzd" />
              <div>
                <p className="text-[11px] text-ink-2">Пассажиры</p>
                <p className="text-[14px] font-semibold text-ink">1 взрослый</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-4">
        <div className="px-5 mt-4 fade-up d-1">
          <PrimaryButton onClick={findTrains}>
            <IconSearch className="w-5 h-5" /> Найти поезда
          </PrimaryButton>
        </div>

        <div className="mt-5 fade-up d-2">
          <SectionTitle>Популярные направления</SectionTitle>
          <div className="flex gap-2 px-5 overflow-x-auto no-scrollbar">
            {["Санкт-Петербург", "Казань", "Нижний Новгород", "Сочи", "Екатеринбург"].map((c, i) => (
              <Chip key={c} active={i === 0} onClick={() => setTo(c)}>{c}</Chip>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <SectionTitle action="Все маршруты" onAction={() => nav.push("favorite-routes")}>Вы часто ищете</SectionTitle>
          <div className="px-5 space-y-3">
            {favoriteRoutes.map((r, i) => (
              <Card
                key={r.id}
                onClick={() => {
                  updateBooking({ searchFrom: r.from, searchTo: r.to });
                  nav.push("search-results");
                }}
                className={`p-4 fade-up d-${i + 3} flex items-center gap-3`}
              >
                <div className="w-10 h-10 rounded-xl bg-rzd-light text-rzd flex items-center justify-center shrink-0">
                  <IconTrain className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-ink text-[14px] truncate">{r.from} — {r.to}</p>
                  <p className="text-[12px] text-ink-2">{r.trainName} · {r.duration}</p>
                </div>
                <p className="font-bold text-rzd text-[14px] shrink-0">от {r.price.toLocaleString("ru-RU")} ₽</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <BottomNav active="search" />
    </div>
  );
}

/* ═══════════════════ ЭКРАН 7 · МОИ ПОЕЗДКИ ═══════════════════ */
export function TripsScreen() {
  const nav = useNav();
  const [tab, setTab] = useState<"future" | "past">("future");
  const [timeSheet, setTimeSheet] = useState(false);
  const [reminder, setReminder] = useState(true);
  const [toast, setToast] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(false), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const diff = Math.max(0, new Date("2026-02-27T07:00:00").getTime() - now);
  const dd = Math.floor(diff / 86400000);
  const hh = Math.floor((diff % 86400000) / 3600000);
  const mm = Math.floor((diff % 3600000) / 60000);
  const ss = Math.floor((diff % 60000) / 1000);

  return (
    <div className="relative h-full flex flex-col bg-surface">
      <div className="bg-white shrink-0 border-b border-black/5">
        <StatusBar />
        <Header title="Мои поездки" subtitle="Билеты и история" />
        <div className="px-5 pb-3 flex gap-2">
          {(["future", "past"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`tap flex-1 h-10 rounded-xl text-[13px] font-semibold ${tab === t ? "bg-rzd text-white" : "bg-surface text-ink-2"}`}
            >
              {t === "future" ? "Предстоящие" : "Прошедшие"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar py-4">
        {tab === "future" ? (
          <div className="px-5 space-y-3">
            <Card className="overflow-hidden fade-up">
              <div className="bg-gradient-to-r from-rzd to-rzd-dark px-4 py-2.5 flex items-center justify-between">
                <span className="text-white text-[12px] font-semibold">{upcomingTrip.date}</span>
                <span className="text-white/80 text-[12px]">{upcomingTrip.train}</span>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[22px] font-bold text-ink leading-none">{upcomingTrip.depart}</p>
                    <p className="text-[13px] text-ink-2 mt-1">Москва</p>
                  </div>
                  <div className="flex-1 px-4 flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-rzd" />
                    <div className="flex-1 border-t-2 border-dashed border-rzd/40" />
                    <IconTrain className="w-5 h-5 text-rzd" />
                    <div className="flex-1 border-t-2 border-dashed border-rzd/40" />
                    <div className="w-2 h-2 rounded-full border-2 border-rzd" />
                  </div>
                  <div className="text-right">
                    <p className="text-[22px] font-bold text-ink leading-none">{upcomingTrip.arrive}</p>
                    <p className="text-[13px] text-ink-2 mt-1">С-Петербург</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  {[["Вагон", "7"], ["Место", "14А"], ["Класс", "2С"]].map(([k, v]) => (
                    <div key={k} className="bg-surface rounded-xl py-2">
                      <p className="text-[11px] text-ink-2">{k}</p>
                      <p className="font-bold text-ink text-[15px]">{v}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex gap-2">
                  <PrimaryButton className="!h-11 text-[13px]" onClick={() => nav.push("ticket")}>Электронный билет</PrimaryButton>
                  <button
                    onClick={() => setTimeSheet(true)}
                    className="tap shrink-0 w-11 h-11 rounded-2xl border-[1.5px] border-rzd/50 text-rzd flex items-center justify-center"
                    aria-label="До отправления"
                  >
                    <IconClock className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </Card>
            <Card onClick={() => nav.push("search")} className="p-4 flex items-center gap-3 fade-up d-2">
              <div className="w-10 h-10 rounded-xl bg-rzd-light text-rzd flex items-center justify-center">
                <IconSearch className="w-5 h-5" />
              </div>
              <p className="flex-1 font-semibold text-ink text-[14px]">Купить новый билет</p>
              <IconChevronRight className="w-5 h-5 text-ink-2/50" />
            </Card>
          </div>
        ) : (
          <div className="px-5 space-y-3">
            {tripHistory.map((t, i) => (
              <Card key={t.id} className={`p-4 fade-up d-${i + 1}`}>
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-ink text-[14px]">{t.route}</p>
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <IconCheck className="w-3 h-3" />{t.status}
                  </span>
                </div>
                <p className="text-[12px] text-ink-2 mt-1">{t.date} · {t.train}</p>
                <div className="mt-3 pt-3 border-t border-dashed border-black/10 flex items-center justify-between text-[12px]">
                  <span className="text-ink-2">{t.seat}</span>
                  <span className="font-semibold text-amber-600 flex items-center gap-1">
                    <IconStar className="w-3.5 h-3.5" filled />+{t.bonus} баллов
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* departure countdown sheet */}
      {timeSheet && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setTimeSheet(false)} />
          <div className="relative w-full max-w-[390px] bg-white rounded-t-[28px] p-5 pb-8 animate-[fade-up_0.3s_ease]">
            <div className="w-10 h-1 rounded-full bg-black/15 mx-auto mb-4" />
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-rzd-light text-rzd flex items-center justify-center shrink-0">
                <IconClock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-ink-2 font-bold uppercase tracking-wider">До отправления</p>
                <p className="text-[16px] font-bold text-ink leading-tight">Пятница, 27 февраля · 07:00</p>
              </div>
            </div>

            {diff > 0 ? (
              <div className="grid grid-cols-4 gap-2 mt-4">
                {([[dd, "дней"], [hh, "часов"], [mm, "минут"], [ss, "секунд"]] as [number, string][]).map(([v, l]) => (
                  <div key={l} className="bg-surface rounded-xl py-3 text-center">
                    <p className="text-[22px] font-bold text-ink leading-none tabular-nums">
                      {String(v).padStart(2, "0")}
                    </p>
                    <p className="text-[10px] text-ink-2 mt-1.5">{l}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 bg-emerald-50 text-emerald-700 rounded-xl px-4 py-3 text-[13px] font-semibold">
                Посадка уже открыта — хорошей поездки! 🚄
              </div>
            )}

            <div className="mt-4 space-y-2.5">
              {(
                [
                  ["Посадка", "06:30 · за 30 минут"],
                  ["Вокзал", "Ленинградский · путь 3"],
                  ["Вагон / место", "7 · 14А, с головы состава"],
                ] as [string, string][]
              ).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between text-[13px]">
                  <span className="text-ink-2">{k}</span>
                  <span className="font-semibold text-ink">{v}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-3 bg-surface rounded-xl px-3.5 py-3">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-ink text-[13.5px]">Напомнить перед отправлением</p>
                <p className="text-[11.5px] text-ink-2">Push-уведомление за 1 час</p>
              </div>
              <Toggle
                on={reminder}
                onChange={(v) => {
                  setReminder(v);
                  if (v) setToast(true);
                }}
              />
            </div>

            <PrimaryButton className="mt-4" onClick={() => setTimeSheet(false)}>
              Понятно
            </PrimaryButton>
          </div>
        </div>
      )}
      <Toast show={toast} text="Напомним за 1 час до отправления" />

      <BottomNav active="trips" />
    </div>
  );
}

/* ═══════════════════ ЭКРАН 8 · РЖД БОНУС ═══════════════════ */
export function BonusScreen() {
  const nav = useNav();
  return (
    <div className="h-full flex flex-col bg-surface">
      <div className="bg-white shrink-0">
        <StatusBar />
        <Header title="РЖД Бонус" subtitle="Программа лояльности" />
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar pb-4">
        {/* gold card */}
        <div className="px-5 mt-4 fade-up">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 p-5 shadow-xl shadow-amber-500/30">
            <div className="absolute -right-10 -top-14 w-44 h-44 rounded-full bg-white/15 blur-xl" />
            <div className="flex items-center justify-between relative">
              <p className="text-white/90 font-bold tracking-wide text-[13px]">РЖД БОНУС</p>
              <span className="text-[11px] font-bold bg-white/25 text-white px-2.5 py-1 rounded-lg uppercase tracking-wider">{user.level}</span>
            </div>
            <p className="relative text-white text-[32px] font-bold mt-5 leading-none">{user.points.toLocaleString("ru-RU")}</p>
            <p className="relative text-white/80 text-[12px] mt-1">баллов на счёте</p>
            <div className="relative mt-5 flex items-end justify-between">
              <p className="text-white/90 text-[13px] font-semibold">{user.name}</p>
              <p className="text-white/70 text-[12px] font-mono tracking-widest">{user.cardNumber}</p>
            </div>
          </div>
        </div>

        {/* progress */}
        <div className="px-5 mt-4 fade-up d-1">
          <Card className="p-4">
            <div className="flex items-center justify-between text-[13px]">
              <span className="font-semibold text-ink">Золотой</span>
              <span className="text-ink-2">Платиновый</span>
            </div>
            <div className="mt-2 h-2.5 bg-surface rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-rzd" style={{ width: `${user.levelProgress * 100}%` }} />
            </div>
            <p className="text-[12px] text-ink-2 mt-2">Ещё {user.toNextLevel.toLocaleString("ru-RU")} баллов до уровня «Платиновый»</p>
          </Card>
        </div>

        {/* actions */}
        <div className="px-5 mt-4 grid grid-cols-2 gap-3">
          {[
            { icon: <IconGift className="w-5 h-5" />, t: "Потратить баллы", s: "Премиальные билеты", d: "d-2" },
            { icon: <IconLightning className="w-5 h-5" />, t: "Акции ×2", s: "Двойные баллы", d: "d-3" },
          ].map((a) => (
            <Card key={a.t} onClick={() => nav.push("recommendations")} className={`p-4 fade-up ${a.d}`}>
              <div className="w-10 h-10 rounded-xl bg-rzd-light text-rzd flex items-center justify-center">{a.icon}</div>
              <p className="font-semibold text-ink text-[13px] mt-3 leading-tight">{a.t}</p>
              <p className="text-[11px] text-ink-2 mt-0.5">{a.s}</p>
            </Card>
          ))}
        </div>

        {/* history */}
        <div className="mt-6">
          <SectionTitle>История начислений</SectionTitle>
          <div className="px-5 space-y-2">
            {tripHistory.slice(0, 3).map((t, i) => (
              <Card key={t.id} className={`px-4 py-3 flex items-center gap-3 fade-up d-${i + 4}`}>
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                  <IconStar className="w-4.5 h-4.5" filled />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-ink truncate">{t.route}</p>
                  <p className="text-[11px] text-ink-2">{t.date}</p>
                </div>
                <p className="text-[14px] font-bold text-emerald-600">+{t.bonus}</p>
              </Card>
            ))}
          </div>
        </div>

        <div className="px-5 mt-5 fade-up d-7">
          <PrimaryButton variant="outline" onClick={() => nav.push("smart-profile")}>
            <IconSparkles className="w-5 h-5" /> Смотреть Smart Profile
          </PrimaryButton>
        </div>
      </div>
      <BottomNav active="profile" />
    </div>
  );
}
