import {
  StatusBar,
  Header,
  PrimaryButton,
  SectionTitle,
  Card,
  useNav,
} from "../components/ui";
import {
  IconStar,
  IconSparkles,
  IconChevronRight,
  IconTrain,
  IconFood,
  IconSeat,
  IconGift,
  IconChart,
  IconRoute,
  IconClock,
  IconWifi,
  IconLuggage,
  IconCheck,
  IconLightning,
  IconTicket,
  IconGear,
} from "../components/icons";
import { user, favoriteRoutes, tripHistory, analytics, services } from "../data";
import { BottomNav } from "./main";

const serviceIcon: Record<string, React.ReactNode> = {
  food: <IconFood className="w-5 h-5" />,
  luggage: <IconLuggage className="w-5 h-5" />,
  wifi: <IconWifi className="w-5 h-5" />,
  seat: <IconSeat className="w-5 h-5" />,
};

/* ═══════════════════ ЭКРАН 2 · SMART PROFILE ═══════════════════ */
export function SmartProfileScreen() {
  const nav = useNav();
  return (
    <div className="h-full flex flex-col bg-surface">
      <div className="bg-gradient-to-br from-rzd to-rzd-darker rounded-b-[28px] pb-6 shrink-0">
        <StatusBar light />
        <Header
          light
          title="Smart Profile"
          subtitle="Ваш умный профиль пассажира"
          right={
            <button
              onClick={() => nav.push("settings")}
              className="tap w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-white"
              aria-label="Настройки"
            >
              <IconGear className="w-5 h-5" />
            </button>
          }
        />
        {/* passenger */}
        <div className="flex items-center gap-4 px-5 mt-3 fade-up">
          <div className="relative">
            <img src={user.avatar} alt={user.name} className="w-[72px] h-[72px] rounded-2xl object-cover ring-2 ring-white/70" />
            <span className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center">
              <IconStar className="w-3.5 h-3.5 text-white" filled />
            </span>
          </div>
          <div className="flex-1">
            <h2 className="text-white text-[19px] font-bold leading-tight">{user.name}</h2>
            <p className="text-white/70 text-[12px] mt-0.5">Пассажир с 2019 года</p>
            <div className="mt-2 inline-flex items-center gap-1.5 bg-white/15 rounded-lg px-2.5 py-1">
              <IconStar className="w-3.5 h-3.5 text-amber-300" filled />
              <span className="text-white text-[12px] font-semibold">РЖД Бонус · {user.level}</span>
            </div>
          </div>
        </div>
        {/* bonus progress */}
        <div className="mx-5 mt-4 bg-white/12 rounded-2xl p-3.5 fade-up d-1">
          <div className="flex items-center justify-between text-[12px] text-white/80">
            <span>{user.points.toLocaleString("ru-RU")} баллов</span>
            <span>до Платины {user.toNextLevel.toLocaleString("ru-RU")}</span>
          </div>
          <div className="mt-2 h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-300 to-white rounded-full" style={{ width: `${user.levelProgress * 100}%` }} />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-4">
        {/* AI recommendation banner */}
        <div className="px-5 mt-5 fade-up d-2">
          <Card onClick={() => nav.push("recommendations")} className="p-4 border-[1.5px] border-rzd/20 !bg-rzd-light">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-rzd text-white flex items-center justify-center shrink-0">
                <IconSparkles className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-ink text-[14px]">Персональные рекомендации</p>
                <p className="text-[12px] text-ink-2 leading-snug">Мы подобрали поездку по вашим привычкам</p>
              </div>
              <span className="shrink-0 w-6 h-6 rounded-full bg-rzd text-white text-[11px] font-bold flex items-center justify-center">3</span>
            </div>
          </Card>
        </div>

        {/* quick stats */}
        <div className="px-5 mt-4 grid grid-cols-3 gap-2.5">
          {[
            { v: String(analytics.trips), l: "поездок", d: "d-2" },
            { v: `${(analytics.km / 1000).toFixed(1)}к`, l: "км в пути", d: "d-3" },
            { v: analytics.favTrain, l: "любимый поезд", d: "d-4" },
          ].map((s) => (
            <Card key={s.l} onClick={() => nav.push("analytics")} className={`p-3 text-center pop-in ${s.d}`}>
              <p className="text-[18px] font-bold text-rzd leading-tight">{s.v}</p>
              <p className="text-[10.5px] text-ink-2 mt-0.5">{s.l}</p>
            </Card>
          ))}
        </div>

        {/* favorite routes */}
        <div className="mt-6">
          <SectionTitle action="Все" onAction={() => nav.push("favorite-routes")}>Любимые маршруты</SectionTitle>
          <div className="flex gap-3 px-5 overflow-x-auto no-scrollbar pb-1">
            {favoriteRoutes.map((r, i) => (
              <Card key={r.id} onClick={() => nav.push("favorite-routes")} className={`shrink-0 w-[190px] p-4 fade-up d-${i + 3}`}>
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-rzd-light text-rzd flex items-center justify-center">
                    <IconRoute className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-[11px] font-semibold text-ink-2 bg-surface px-2 py-0.5 rounded-md">{r.trips}×</span>
                </div>
                <p className="font-bold text-ink text-[14px] mt-3 leading-tight">{r.fromCode} → {r.toCode}</p>
                <p className="text-[11.5px] text-ink-2 mt-0.5">{r.trainName} · {r.duration}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* favorite seats */}
        <div className="mt-6">
          <SectionTitle>Любимые места</SectionTitle>
          <div className="px-5">
            <Card className="p-4 fade-up d-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rzd-light text-rzd flex items-center justify-center shrink-0">
                  <IconSeat className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-ink text-[14px]">Место 14А · у окна</p>
                  <p className="text-[12px] text-ink-2">Сапсан, вагон 7 · выбирали 11 раз</p>
                </div>
                <span className="text-[11px] font-bold text-rzd bg-rzd-light px-2 py-1 rounded-lg">ТОП-1</span>
              </div>
              <div className="mt-3 flex gap-2">
                {["Окно", "По ходу движения", "Розетка рядом"].map((t) => (
                  <span key={t} className="text-[11px] font-semibold text-ink-2 bg-surface px-2.5 py-1.5 rounded-lg">{t}</span>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* trip history */}
        <div className="mt-6">
          <SectionTitle action="Аналитика" onAction={() => nav.push("analytics")}>История поездок</SectionTitle>
          <div className="px-5 space-y-2">
            {tripHistory.slice(0, 3).map((t, i) => (
              <Card key={t.id} className={`px-4 py-3 flex items-center gap-3 fade-up d-${i + 5}`}>
                <div className="w-9 h-9 rounded-xl bg-surface text-rzd flex items-center justify-center shrink-0">
                  <IconTrain className="w-4.5 h-4.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-ink truncate">{t.route}</p>
                  <p className="text-[11px] text-ink-2">{t.date} · {t.train}</p>
                </div>
                <IconChevronRight className="w-4 h-4 text-ink-2/40" />
              </Card>
            ))}
          </div>
        </div>

        {/* frequent services */}
        <div className="mt-6">
          <SectionTitle>Часто используемые услуги</SectionTitle>
          <div className="px-5 grid grid-cols-2 gap-2.5">
            {services.map((s, i) => (
              <Card
                key={s.id}
                onClick={s.id === "wifi" ? () => nav.push("portal") : undefined}
                className={`p-3.5 fade-up d-${i + 5} relative`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-rzd-light text-rzd flex items-center justify-center shrink-0">
                    {serviceIcon[s.icon]}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-semibold text-ink leading-tight">{s.label}</p>
                    <p className="text-[11px] text-ink-2">{s.used} раз</p>
                  </div>
                </div>
                {s.id === "wifi" && (
                  <span className="absolute top-2 right-2 text-[8.5px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md uppercase">
                    Попутчик
                  </span>
                )}
              </Card>
            ))}
          </div>
        </div>

        <div className="px-5 mt-6 fade-up d-8">
          <PrimaryButton onClick={() => nav.push("recommendations")}>
            <IconSparkles className="w-5 h-5" /> Открыть рекомендации
          </PrimaryButton>
        </div>
      </div>
      <BottomNav active="profile" />
    </div>
  );
}

/* ═══════════════════ ЭКРАН 3 · РЕКОМЕНДАЦИИ ═══════════════════ */
export function RecommendationsScreen() {
  const nav = useNav();
  const r = favoriteRoutes[0];
  return (
    <div className="h-full flex flex-col bg-surface">
      <div className="bg-white shrink-0 border-b border-black/5">
        <StatusBar />
        <Header title="Рекомендации" subtitle="Подобрано специально для вас" right={<IconSparkles className="w-6 h-6 text-rzd" />} />
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-4">
        {/* main recommendation */}
        <div className="px-5 mt-4 fade-up">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rzd to-rzd-darker p-5 shadow-xl shadow-rzd/25">
            <div className="absolute -right-8 -top-10 w-40 h-40 rounded-full bg-white/10 blur-xl" />
            <div className="relative flex items-center gap-2">
              <IconSparkles className="w-4.5 h-4.5 text-amber-300" />
              <p className="text-white/85 text-[12px] font-semibold uppercase tracking-wide">Умная рекомендация</p>
            </div>
            <h2 className="relative text-white text-[19px] font-bold mt-3 leading-snug">
              Вы часто ездите<br />Москва — Санкт-Петербург
            </h2>
            <p className="relative text-white/70 text-[12.5px] mt-1.5">14 поездок за год · обычно по пятницам утром</p>
            <div className="relative mt-4 bg-white/12 rounded-2xl p-3.5 flex items-center justify-between">
              <div>
                <p className="text-white text-[20px] font-bold leading-none">{r.depart}</p>
                <p className="text-white/70 text-[11px] mt-1">МСК · 27 фев</p>
              </div>
              <div className="flex flex-col items-center px-2">
                <IconTrain className="w-5 h-5 text-white/90 train-anim" />
                <p className="text-white/70 text-[10.5px] mt-0.5">{r.trainName} · {r.duration}</p>
              </div>
              <div className="text-right">
                <p className="text-white text-[20px] font-bold leading-none">{r.arrive}</p>
                <p className="text-white/70 text-[11px] mt-1">СПБ · 27 фев</p>
              </div>
            </div>
            <div className="relative mt-4 flex items-center gap-3">
              <button
                onClick={() => nav.push("buy-ticket")}
                className="tap flex-1 h-12 bg-white text-rzd rounded-2xl font-bold text-[15px] flex items-center justify-center gap-2"
              >
                <IconTicket className="w-5 h-5" /> Купить билет · {r.price.toLocaleString("ru-RU")} ₽
              </button>
            </div>
          </div>
        </div>

        {/* addon options */}
        <div className="mt-6">
          <SectionTitle>Дополните поездку</SectionTitle>
          <div className="px-5 space-y-2.5">
            {[
              { icon: <IconFood className="w-5 h-5" />, t: "Добавить питание", s: "Ваш выбор — «Завтрак + кофе», 420 ₽", badge: "Часто берёте", d: "d-1" },
              { icon: <IconSeat className="w-5 h-5" />, t: "Выбрать любимое место", s: "Место 14А у окна, вагон 7", badge: "ТОП-1", d: "d-2" },
              { icon: <IconStar className="w-5 h-5" />, t: "Начисление бонусов", s: "+486 баллов за эту поездку", badge: "×2 в акции", d: "d-3" },
            ].map((o) => (
              <Card key={o.t} onClick={() => nav.push("buy-ticket")} className={`p-4 flex items-center gap-3 fade-up ${o.d}`}>
                <div className="w-11 h-11 rounded-xl bg-rzd-light text-rzd flex items-center justify-center shrink-0">{o.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-ink text-[14px]">{o.t}</p>
                  <p className="text-[12px] text-ink-2 leading-snug">{o.s}</p>
                </div>
                <span className="shrink-0 text-[10px] font-bold text-rzd bg-rzd-light px-2 py-1 rounded-lg">{o.badge}</span>
              </Card>
            ))}
          </div>
        </div>

        {/* more recommendations */}
        <div className="mt-6">
          <SectionTitle action="Маршруты" onAction={() => nav.push("favorite-routes")}>Ещё для вас</SectionTitle>
          <div className="px-5 space-y-2.5">
            <Card onClick={() => nav.push("favorite-routes")} className="p-4 flex items-center gap-3 fade-up d-4">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                <IconLightning className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-ink text-[14px]">Двойные баллы в Казань</p>
                <p className="text-[12px] text-ink-2">До 15 марта на поезд «Премиум»</p>
              </div>
              <IconChevronRight className="w-5 h-5 text-ink-2/40" />
            </Card>
            <Card onClick={() => nav.push("favorite-routes")} className="p-4 flex items-center gap-3 fade-up d-5">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <IconGift className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-ink text-[14px]">Премиальный билет за баллы</p>
                <p className="text-[12px] text-ink-2">Хватает на Москва — Н. Новгород</p>
              </div>
              <IconChevronRight className="w-5 h-5 text-ink-2/40" />
            </Card>
          </div>
        </div>

        <div className="px-5 mt-6 fade-up d-6">
          <PrimaryButton variant="outline" onClick={() => nav.push("favorite-routes")}>
            <IconRoute className="w-5 h-5" /> Мои любимые маршруты
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════ ЭКРАН 4 · ЛЮБИМЫЕ МАРШРУТЫ ═══════════════════ */
export function FavoriteRoutesScreen() {
  const nav = useNav();
  return (
    <div className="h-full flex flex-col bg-surface">
      <div className="bg-white shrink-0 border-b border-black/5">
        <StatusBar />
        <Header title="Любимые маршруты" subtitle="Сохранены автоматически по вашим поездкам" />
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-4">
        <div className="px-5 mt-4 space-y-3.5">
          {favoriteRoutes.map((r, i) => (
            <Card key={r.id} className={`overflow-hidden fade-up d-${i + 1}`}>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-rzd bg-rzd-light px-2 py-1 rounded-lg">{r.trips} поездок</span>
                    {i === 0 && <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">⭐ Самый частый</span>}
                  </div>
                  <span className="text-[12px] text-ink-2">{r.km} км</span>
                </div>
                <div className="mt-3.5 flex items-center justify-between">
                  <div>
                    <p className="text-[17px] font-bold text-ink leading-tight">{r.from}</p>
                    <p className="text-[12px] text-ink-2 mt-0.5">{r.depart}</p>
                  </div>
                  <div className="flex-1 px-3 flex flex-col items-center">
                    <div className="w-full flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-rzd shrink-0" />
                      <div className="flex-1 border-t-2 border-dashed border-rzd/35" />
                      <IconTrain className="w-4.5 h-4.5 text-rzd shrink-0" />
                      <div className="flex-1 border-t-2 border-dashed border-rzd/35" />
                      <div className="w-2 h-2 rounded-full border-2 border-rzd shrink-0" />
                    </div>
                    <p className="text-[10.5px] text-ink-2 mt-1">{r.trainName} · {r.duration}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[17px] font-bold text-ink leading-tight">{r.to}</p>
                    <p className="text-[12px] text-ink-2 mt-0.5">{r.arrive}</p>
                  </div>
                </div>
              </div>
              <div className="px-4 pb-4 flex items-center gap-2.5">
                <button
                  onClick={() => nav.push("buy-ticket")}
                  className="tap flex-1 h-11 bg-rzd text-white rounded-xl font-semibold text-[13.5px] flex items-center justify-center gap-2 shadow-md shadow-rzd/25"
                >
                  <IconClock className="w-4.5 h-4.5" /> Повторить поездку
                </button>
                <div className="shrink-0 h-11 px-3.5 rounded-xl bg-surface flex items-center font-bold text-ink text-[13.5px]">
                  от {r.price.toLocaleString("ru-RU")} ₽
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* hint */}
        <div className="px-5 mt-5 fade-up d-4">
          <Card className="p-4 flex items-start gap-3 !bg-rzd-light border-[1.5px] border-rzd/15">
            <IconSparkles className="w-5 h-5 text-rzd shrink-0 mt-0.5" />
            <p className="text-[12.5px] text-ink leading-snug">
              Smart Profile анализирует ваши поездки и автоматически сохраняет частые маршруты — билет можно повторить в один клик.
            </p>
          </Card>
        </div>

        <div className="px-5 mt-5 fade-up d-5">
          <PrimaryButton onClick={() => nav.push("analytics")}>
            <IconChart className="w-5 h-5" /> Моя аналитика поездок
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════ ЭКРАН 5 · АНАЛИТИКА ═══════════════════ */
export function AnalyticsScreen() {
  const nav = useNav();
  const maxV = Math.max(...analytics.monthly.map((m) => m.v));
  return (
    <div className="h-full flex flex-col bg-surface">
      <div className="bg-white shrink-0 border-b border-black/5">
        <StatusBar />
        <Header title="Аналитика поездок" subtitle="Ваш год с РЖД · 2025–2026" right={<IconChart className="w-6 h-6 text-rzd" />} />
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-4">
        {/* big stats */}
        <div className="px-5 mt-4 grid grid-cols-2 gap-3">
          <Card className="p-4 pop-in">
            <div className="w-9 h-9 rounded-xl bg-rzd-light text-rzd flex items-center justify-center">
              <IconTicket className="w-4.5 h-4.5" />
            </div>
            <p className="text-[28px] font-bold text-ink mt-3 leading-none">{analytics.trips}</p>
            <p className="text-[12px] text-ink-2 mt-1">поездок за год</p>
          </Card>
          <Card className="p-4 pop-in d-1">
            <div className="w-9 h-9 rounded-xl bg-rzd-light text-rzd flex items-center justify-center">
              <IconRoute className="w-4.5 h-4.5" />
            </div>
            <p className="text-[28px] font-bold text-ink mt-3 leading-none">{analytics.km.toLocaleString("ru-RU")}</p>
            <p className="text-[12px] text-ink-2 mt-1">км пройдено</p>
          </Card>
        </div>

        {/* chart */}
        <div className="px-5 mt-3.5 fade-up d-2">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <p className="font-bold text-ink text-[14px]">Поездки по месяцам</p>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">+33% к прошлому году</span>
            </div>
            <div className="mt-4 flex items-end justify-between gap-2 h-28">
              {analytics.monthly.map((m, i) => (
                <div key={m.m} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-[10px] font-bold text-ink-2">{m.v}</span>
                  <div
                    className={`w-full rounded-lg grow-bar d-${i + 1} ${i === analytics.monthly.length - 1 ? "bg-rzd" : "bg-rzd/20"}`}
                    style={{ height: `${(m.v / maxV) * 100}%` }}
                  />
                  <span className="text-[10px] text-ink-2">{m.m}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* favorites */}
        <div className="mt-6">
          <SectionTitle>Ваши предпочтения</SectionTitle>
          <div className="px-5 space-y-2">
            {[
              { icon: <IconTrain className="w-5 h-5" />, k: "Любимый поезд", v: analytics.favTrain, s: "18 из 28 поездок", d: "d-3" },
              { icon: <IconSeat className="w-5 h-5" />, k: "Любимый тип вагона", v: analytics.favCar, s: "у окна · место 14А", d: "d-4" },
              { icon: <IconRoute className="w-5 h-5" />, k: "Любимый маршрут", v: analytics.favRoute, s: "14 поездок за год", d: "d-5" },
            ].map((p) => (
              <Card key={p.k} className={`px-4 py-3.5 flex items-center gap-3 fade-up ${p.d}`}>
                <div className="w-10 h-10 rounded-xl bg-rzd-light text-rzd flex items-center justify-center shrink-0">{p.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11.5px] text-ink-2">{p.k}</p>
                  <p className="text-[14px] font-bold text-ink truncate">{p.v}</p>
                </div>
                <span className="text-[11px] text-ink-2 shrink-0">{p.s}</span>
              </Card>
            ))}
          </div>
        </div>

        {/* bonus stats */}
        <div className="mt-6">
          <SectionTitle>Статистика бонусов</SectionTitle>
          <div className="px-5 fade-up d-6">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center shrink-0">
                  <IconStar className="w-5 h-5" filled />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-ink text-[15px]">{analytics.bonusEarned.toLocaleString("ru-RU")} баллов начислено</p>
                  <p className="text-[12px] text-ink-2">{analytics.bonusSpent.toLocaleString("ru-RU")} потрачено на премиальные билеты</p>
                </div>
              </div>
              <div className="mt-3.5 h-2.5 bg-surface rounded-full overflow-hidden flex">
                <div className="h-full bg-amber-400" style={{ width: "68%" }} />
                <div className="h-full bg-rzd" style={{ width: "22%" }} />
              </div>
              <div className="mt-2.5 flex items-center gap-4 text-[11px] text-ink-2">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" />Доступно</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rzd" />Потрачено</span>
                <span className="ml-auto font-bold text-ink">{user.points.toLocaleString("ru-RU")} на счёте</span>
              </div>
            </Card>
          </div>
        </div>

        {/* achievement */}
        <div className="px-5 mt-4 fade-up d-7">
          <Card className="p-4 flex items-center gap-3 !bg-gradient-to-r !from-ink !to-[#3a3a3e] bg-gradient-to-r from-ink to-[#3a3a3e]">
            <span className="text-[28px]">🏆</span>
            <div className="flex-1">
              <p className="text-white font-bold text-[14px]">Вы в топ-5% пассажиров</p>
              <p className="text-white/60 text-[12px]">маршрута Москва — Санкт-Петербург</p>
            </div>
            <IconCheck className="w-5 h-5 text-emerald-400" />
          </Card>
        </div>

        <div className="px-5 mt-5 fade-up d-8">
          <PrimaryButton onClick={() => nav.push("recommendations")}>
            <IconSparkles className="w-5 h-5" /> Получить рекомендации
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}
