import { useEffect, useRef, useState, type ReactNode } from "react";
import { StatusBar, PrimaryButton, Toast, useNav } from "../components/ui";
import {
  IconBack,
  IconWifi,
  IconCheck,
  IconStar,
  IconPlus,
  IconMinus,
  IconSend,
  IconTrain,
  IconRoute,
  IconUser,
  IconLightning,
} from "../components/icons";
import { getStops, user } from "../data";
import { useBooking } from "../booking";

/* ── data ───────────────────────────────────────── */
const MOVIES = [
  { id: 1, title: "Чебурашка 2", meta: "2026 · Семейный · 1 ч 52 мин", emoji: "🍊", g: "from-amber-400 to-orange-600", prog: 62, desc: "Продолжение истории самого доброго героя страны. Ушастик подрос — и вместе с Геной отправляется в новое путешествие." },
  { id: 2, title: "Мастер и Маргарита", meta: "2024 · Драма · 2 ч 37 мин", emoji: "🐈‍⬛", g: "from-slate-600 to-slate-900", prog: 0, desc: "Экранизация великого романа: Москва 30-х, загадочный Воланд и история любви, которая сильнее времени." },
  { id: 3, title: "Бременские музыканты", meta: "2024 · Мюзикл · 1 ч 56 мин", emoji: "🎺", g: "from-emerald-400 to-teal-600", prog: 0, desc: "Трубадур, Принцесса и верные друзья — ничего на свете лучше нету, чем дороги и песни." },
  { id: 4, title: "Ледокол", meta: "2016 · Катастрофа · 2 ч 00 мин", emoji: "🚢", g: "from-cyan-500 to-blue-700", prog: 18, desc: "Экипаж ледокола «Михаил Громов» зажат льдами Антарктики. 133 дня в плену — и ни одного права на ошибку." },
  { id: 5, title: "Гостья из будущего", meta: "Сериал · Фантастика", emoji: "⏳", g: "from-rzd to-rzd-darker", prog: 0, desc: "Алиса Селезнёва прибывает из XXI века, чтобы спасти миелофон. Классика, которую приятно пересмотреть в дороге." },
];

const TRACKS = [
  { id: 1, title: "Купейный блюз", artist: "Ясная Поляна", dur: "3:42", emoji: "🎷", g: "from-blue-500 to-cyan-400" },
  { id: 2, title: "Дождь за окном", artist: "Лоу-Фай Трио", dur: "4:05", emoji: "🌧️", g: "from-slate-500 to-slate-700" },
  { id: 3, title: "Голубой вагон", artist: "Сказочные голоса", dur: "2:58", emoji: "🚂", g: "from-emerald-500 to-teal-600" },
  { id: 4, title: "Звезда по имени Солнце", artist: "Меридиан", dur: "4:21", emoji: "☀️", g: "from-amber-400 to-orange-600" },
];

const BOOKS = [
  { id: 1, title: "Двенадцать стульев", author: "Ильф и Петров", emoji: "🪑", g: "from-emerald-500 to-teal-700", page: 142, prog: 34 },
  { id: 2, title: "Два капитана", author: "В. Каверин", emoji: "✈️", g: "from-sky-500 to-blue-700", page: 1, prog: 0 },
  { id: 3, title: "Белый Бим Чёрное ухо", author: "Г. Троепольский", emoji: "🐕", g: "from-amber-500 to-orange-700", page: 188, prog: 78 },
  { id: 4, title: "Вечера на хуторе", author: "Н. Гоголь", emoji: "🌙", g: "from-slate-600 to-slate-800", page: 64, prog: 21 },
];

const MENU = [
  { id: 1, name: "Бизнес-ланч «Сапсан»", desc: "Куриное филе, пюре, салат, морс", price: 590, emoji: "🍗" },
  { id: 2, name: "Завтрак дорожный", desc: "Омлет, тосты, масло, кофе", price: 420, emoji: "🍳" },
  { id: 3, name: "Борщ с пампушками", desc: "Со сметаной и зеленью", price: 380, emoji: "🥣" },
  { id: 4, name: "Чай с фирменными сладостями", desc: "Стакан в подстаканнике + 2 конфеты", price: 190, emoji: "🫖" },
  { id: 5, name: "Детский ланч-бокс", desc: "Каша, сок, яблоко, печенье", price: 350, emoji: "🧃" },
];

const CONDUCTOR_ANSWERS: { re: RegExp; reply: string }[] = [
  { re: /одеял|плед|подушк/, reply: "Конечно! Дополнительный плед принесу к месту 14А в течение 5 минут 🛏" },
  { re: /холод|прохлад|тепл|температ/, reply: "Принято, скорректирую климат в вагоне до 22 °C ❄️" },
  { re: /розетк|заряд|ток/, reply: "Вызвала электромеханика — подойдёт к вашему месту в ближайшие минуты 🔌" },
  { re: /где|станц|едем|скоро/, reply: "Проходим Вышний Волочёк, скорость 160 км/ч. До Твери около 20 минут 🚄" },
  { re: /чай|кофе|вод|пить/, reply: "Чай и кофе — пожалуйста! Загляните в раздел «Ресторан» или принесу к месту ☕" },
];

const CONDUCTOR_DEFAULT =
  "Спасибо за обращение! Я подойду к вашему месту 14А в ближайшее время и во всём помогу 🙌";

/* ── helpers ────────────────────────────────────── */
function SignalBars() {
  return (
    <div className="flex items-end gap-[2.5px]">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="w-[3px] rounded-full bg-emerald-400 signal-anim"
          style={{ height: 5 + i * 3, animationDelay: `${i * 0.18}s` }}
        />
      ))}
    </div>
  );
}

function Sheet({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-[390px] max-h-[84%] overflow-y-auto no-scrollbar bg-white rounded-t-[28px] p-5 pb-8 animate-[fade-up_0.3s_ease]">
        <div className="w-10 h-1 rounded-full bg-black/15 mx-auto mb-4" />
        {children}
      </div>
    </div>
  );
}

function SheetHead({ title, sub, onClose }: { title: string; sub: string; onClose: () => void }) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div>
        <h3 className="text-[17px] font-bold text-ink">{title}</h3>
        <p className="text-[12px] text-ink-2 mt-0.5">{sub}</p>
      </div>
      <button onClick={onClose} className="tap w-8 h-8 rounded-full bg-surface text-ink-2 flex items-center justify-center shrink-0 text-[14px] font-bold">
        ✕
      </button>
    </div>
  );
}

/* ═══════════════ ЭКРАН · ПОРТАЛ «ПОПУТЧИК» ═══════════════ */
export function PortalScreen() {
  const nav = useNav();
  const { booking } = useBooking();
  const train = booking.selectedTrain;

  const [phase, setPhase] = useState<0 | 1 | 2 | 3>(0);
  const [testSpeed, setTestSpeed] = useState(4);

  // подключение: поиск → соединение → проверка скорости
  useEffect(() => {
    if (phase >= 3) return;
    const delays = [1200, 1400, 1100];
    const t = setTimeout(() => setPhase((p) => (p + 1) as 0 | 1 | 2 | 3), delays[phase]);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => {
    if (phase !== 2) return;
    const id = setInterval(() => setTestSpeed((s) => Math.min(42.7, s + Math.random() * 5.5)), 140);
    return () => clearInterval(id);
  }, [phase]);

  if (phase < 3) {
    const texts = ["Ищем сеть поезда…", "Подключаемся к RZD_Poputchik_757А…", "Проверяем скорость"];
    return (
      <div className="h-full flex flex-col bg-gradient-to-br from-[#0d1b3e] via-[#14335f] to-[#175460]">
        <StatusBar light />
        <div className="flex-1 flex flex-col items-center justify-center px-8 -mt-8">
          <div className="relative w-44 h-44 flex items-center justify-center">
            {[0, 0.7, 1.4].map((d) => (
              <div key={d} className="absolute inset-0 rounded-full border-2 border-sky-300/40 radar-ring" style={{ animationDelay: `${d}s` }} />
            ))}
            <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
              <IconWifi className="w-12 h-12 text-white" />
            </div>
          </div>
          <p className="text-white text-[19px] font-bold mt-8 text-center">{texts[phase]}</p>
          {phase === 2 && (
            <p className="text-sky-200/85 text-[14px] font-bold mt-2 tabular-nums">{testSpeed.toFixed(1)} Мбит/с</p>
          )}
          <div className="flex gap-2 mt-6">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i <= phase ? "w-6 bg-sky-300" : "w-1.5 bg-white/25"}`} />
            ))}
          </div>
        </div>
        <div className="px-6 pb-4">
          <div className="bg-white/10 border border-white/10 rounded-2xl p-4 space-y-2.5">
            {[
              ["Сеть", "RZD_Poputchik_757А"],
              ["Доступ", "Бесплатно · без пароля"],
              ["Ваш вагон", `${train.name} · вагон 7 · место 14А`],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between text-[13px]">
                <span className="text-white/55">{k}</span>
                <span className="font-semibold text-white text-right">{v}</span>
              </div>
            ))}
          </div>
          <button onClick={() => setPhase(3)} className="tap w-full mt-4 text-white/55 text-[13px] font-semibold py-2">
            Пропустить
          </button>
          <div className="flex justify-center pt-1">
            <div className="w-32 h-[5px] rounded-full bg-white/80" />
          </div>
        </div>
      </div>
    );
  }

  return <PortalContent train={train} onBack={() => nav.pop()} />;
}

/* ── portal content ─────────────────────────────── */
function PortalContent({ train, onBack }: { train: ReturnType<typeof useBooking>["booking"]["selectedTrain"]; onBack: () => void }) {
  const { booking } = useBooking();
  const [toast, setToast] = useState(false);
  const [toastText, setToastText] = useState("");
  const say = (t: string) => { setToastText(t); setToast(true); };
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(false), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  // живой индикатор Wi‑Fi
  const [speed, setSpeed] = useState(34.6);
  useEffect(() => {
    const id = setInterval(() => setSpeed((s) => Math.max(28, Math.min(41, s + (Math.random() - 0.5) * 5))), 1100);
    return () => clearInterval(id);
  }, []);

  // текущая скорость поезда и ETA до ближайшей стоянки
  const cruise =
    train.brand === "sapsan" ? 245 :
    train.brand === "lastochka" ? 155 :
    train.brand === "firm" ? 95 : 80;
  const [trainSpeed, setTrainSpeed] = useState(cruise - 8);
  const [etaSec, setEtaSec] = useState(18 * 60 + 42); // ~18:42 до Твери
  useEffect(() => {
    const id = setInterval(() => {
      setTrainSpeed((s) => {
        const n = s + (Math.random() - 0.48) * 6;
        return Math.round(Math.max(cruise - 35, Math.min(cruise + 12, n)));
      });
      setEtaSec((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [cruise]);
  const etaM = Math.floor(etaSec / 60);
  const etaS = etaSec % 60;
  const etaLabel =
    etaSec <= 0 ? "уже на станции" :
    etaM >= 60 ? `${Math.floor(etaM / 60)} ч ${String(etaM % 60).padStart(2, "0")} мин` :
    `${etaM} мин ${String(etaS).padStart(2, "0")} сек`;
  const nextStop = getStops(train)[1]?.station ?? "следующая";

  // сворачивание hero-панели по скроллу
  const scrollRef = useRef<HTMLDivElement>(null);
  const [collapsed, setCollapsed] = useState(false);
  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCollapsed(el.scrollTop > 24);
  };

  // кино
  const [movie, setMovie] = useState<(typeof MOVIES)[number] | null>(null);
  const [playing, setPlaying] = useState(false);
  const [mProg, setMProg] = useState(0);
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setMProg((p) => (p >= 100 ? 100 : p + 0.5)), 400);
    return () => clearInterval(id);
  }, [playing]);
  const openMovie = (m: (typeof MOVIES)[number]) => { setMovie(m); setPlaying(false); setMProg(m.prog); };

  // музыка
  const [trackId, setTrackId] = useState<number | null>(null);
  const track = TRACKS.find((t) => t.id === trackId) ?? null;

  // ресторан
  const [foodOpen, setFoodOpen] = useState(false);
  const [cart, setCart] = useState<Record<number, number>>({});
  const [ordered, setOrdered] = useState(false);
  const [orderStep, setOrderStep] = useState(0);
  const cartSum = Object.entries(cart).reduce((s, [id, q]) => s + (MENU.find((m) => m.id === +id)?.price ?? 0) * q, 0);
  const cartCount = Object.values(cart).reduce((s, q) => s + q, 0);
  useEffect(() => {
    if (!ordered || orderStep >= 3) return;
    const t = setTimeout(() => setOrderStep((s) => s + 1), 1500);
    return () => clearTimeout(t);
  }, [ordered, orderStep]);

  // проводник
  const [condOpen, setCondOpen] = useState(false);

  // интернет
  const [netOpen, setNetOpen] = useState(false);

  // маршрут
  const [routeOpen, setRouteOpen] = useState(false);

  // оценка
  const [stars, setStars] = useState(0);

  return (
    <div className="relative h-full flex flex-col bg-surface">
      {/* hero */}
      <div className="bg-gradient-to-br from-[#0d1b3e] via-[#14335f] to-[#175460] rounded-b-[28px] shrink-0 transition-all duration-300">
        <StatusBar light />
        <div className="flex items-center gap-2 px-4 py-2">
          <button onClick={onBack} className="tap -ml-1 w-10 h-10 rounded-full bg-white/12 flex items-center justify-center text-white" aria-label="Назад">
            <IconBack className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-white text-[19px] font-bold leading-tight">Попутчик</h1>
            <p className="text-white/60 text-[11.5px]">Бортовой портал · {train.name} {train.number}</p>
          </div>
          <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
            <SignalBars />
            <span className="text-white text-[11.5px] font-semibold tabular-nums">{speed.toFixed(0)} Мбит/с</span>
          </div>
        </div>

        {/* collapsible greeting + trip info */}
        <div
          className={`grid transition-all duration-300 ease-out ${
            collapsed ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100"
          }`}
        >
          <div className="overflow-hidden">
            <div className="px-5 mt-2 fade-up">
              <h2 className="text-white text-[21px] font-bold leading-tight">
                Привет, {user.shortName}! 👋
                <span className="block text-white/65 text-[13px] font-semibold mt-0.5">В дороге будет не скучно</span>
              </h2>
            </div>

            {/* trip progress */}
            <div className="mx-5 mt-4 bg-white/10 border border-white/10 rounded-2xl p-3.5 fade-up d-1">
              <div className="flex items-center justify-between text-[11px] text-white/60 font-semibold">
                <span>{booking.searchFrom} · {train.depart}</span>
                <span>{booking.searchTo} · {train.arrive}</span>
              </div>
              <div className="relative mt-2.5 h-[3px] bg-white/15 rounded-full">
                <div className="progress-grow h-full rounded-full bg-gradient-to-r from-sky-300 to-emerald-400" style={{ width: "62%" }} />
                <span className="absolute" style={{ left: "58%", top: "-9px" }}>
                  <IconTrain className="w-5 h-5 text-white train-anim" />
                </span>
              </div>
              <p className="text-white/75 text-[11.5px] font-semibold mt-2.5">
                Пройдено 62% пути · в пути ещё ~1 ч 23 мин
              </p>

              {/* speed + ETA to next stop */}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="bg-white/10 rounded-xl px-3 py-2.5">
                  <p className="text-white/55 text-[10px] font-bold uppercase tracking-wider">Скорость</p>
                  <p className="text-white text-[20px] font-black tabular-nums leading-none mt-1">
                    {trainSpeed}
                    <span className="text-[11px] font-bold text-white/55 ml-1">км/ч</span>
                  </p>
                  <p className="text-white/45 text-[10px] mt-1">
                    {train.brand === "sapsan" || train.brand === "lastochka" ? "круизная" : "в пути"}
                  </p>
                </div>
                <div className="bg-white/10 rounded-xl px-3 py-2.5">
                  <p className="text-white/55 text-[10px] font-bold uppercase tracking-wider">До стоянки</p>
                  <p className={`text-[18px] font-black tabular-nums leading-none mt-1 ${etaSec <= 0 ? "text-emerald-300" : "text-white"}`}>
                    {etaLabel}
                  </p>
                  <p className="text-white/70 text-[11px] font-semibold mt-1 truncate">
                    {etaSec <= 0 ? "прибыли" : nextStop}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* compact strip when collapsed */}
        <div
          className={`grid transition-all duration-300 ease-out ${
            collapsed ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div className="px-5 pb-3 flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
                <span className="text-white/55 text-[10px] font-bold uppercase tracking-wider">Скорость</span>
                <span className="text-white text-[15px] font-black tabular-nums leading-none">
                  {trainSpeed}<span className="text-[10px] font-bold text-white/55 ml-0.5">км/ч</span>
                </span>
              </div>
              <div className="flex-1 flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2">
                <span className="text-white/55 text-[10px] font-bold uppercase tracking-wider">До</span>
                <span className={`text-[13px] font-black tabular-nums leading-none truncate ${etaSec <= 0 ? "text-emerald-300" : "text-white"}`}>
                  {etaLabel}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* content */}
      <div ref={scrollRef} onScroll={onScroll} className="flex-1 overflow-y-auto no-scrollbar pb-28">
        {/* кинозал */}
        <div className="mt-5">
          <div className="flex items-baseline justify-between px-5 mb-2.5">
            <h3 className="text-ink text-[16px] font-bold">🎬 Кинозал</h3>
            <span className="text-[11.5px] text-ink-2 font-semibold">5 фильмов · бесплатно</span>
          </div>
          <div className="flex gap-3 px-5 overflow-x-auto no-scrollbar pb-1">
            {MOVIES.map((m, i) => (
              <button key={m.id} onClick={() => openMovie(m)} className={`tap shrink-0 w-[128px] text-left pop-in d-${Math.min(i + 1, 6)}`}>
                <div className={`relative h-[150px] rounded-2xl bg-gradient-to-br ${m.g} flex items-center justify-center overflow-hidden`}>
                  <span className="text-[44px] drop-shadow-lg">{m.emoji}</span>
                  <span className="absolute top-2 left-2 text-[9px] font-black bg-black/35 text-white px-1.5 py-0.5 rounded-md">0 ₽</span>
                  {m.prog > 0 && m.prog < 100 && (
                    <div className="absolute bottom-0 inset-x-0 h-1 bg-black/30">
                      <div className="h-full bg-white" style={{ width: `${m.prog}%` }} />
                    </div>
                  )}
                </div>
                <p className="text-ink text-[12.5px] font-bold leading-tight mt-2">{m.title}</p>
                <p className="text-ink-2 text-[10.5px] mt-0.5 leading-tight">{m.meta}</p>
              </button>
            ))}
          </div>
        </div>

        {/* музыка */}
        <div className="mt-6">
          <div className="flex items-baseline justify-between px-5 mb-2.5">
            <h3 className="text-ink text-[16px] font-bold">🎧 Музыка</h3>
            <span className="text-[11.5px] text-ink-2 font-semibold">Дорожный плейлист</span>
          </div>
          <div className="px-5">
            <div className="bg-white rounded-2xl shadow-[0_1px_10px_rgba(0,0,0,0.05)] divide-y divide-black/5">
              {TRACKS.map((t) => {
                const active = trackId === t.id;
                return (
                  <button key={t.id} onClick={() => setTrackId(active ? null : t.id)} className="tap w-full px-3.5 py-2.5 flex items-center gap-3 text-left">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.g} flex items-center justify-center text-[18px] shrink-0 relative overflow-hidden`}>
                      {t.emoji}
                      {active && <div className="absolute inset-0 bg-black/35 flex items-center justify-center"><span className="text-white text-[10px]">■</span></div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[13.5px] font-bold truncate ${active ? "text-rzd" : "text-ink"}`}>{t.title}</p>
                      <p className="text-[11.5px] text-ink-2 truncate">{t.artist} · {t.dur}</p>
                    </div>
                    {active ? (
                      <div className="flex items-end gap-[2px] h-4 shrink-0">
                        {[0, 1, 2, 3].map((i) => (
                          <span key={i} className="eq-bar w-[3px] h-full bg-rzd rounded-full" style={{ animationDelay: `${i * 0.12}s` }} />
                        ))}
                      </div>
                    ) : (
                      <span className="text-ink-2/50 text-[13px] shrink-0">▶</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* библиотека */}
        <div className="mt-6">
          <div className="flex items-baseline justify-between px-5 mb-2.5">
            <h3 className="text-ink text-[16px] font-bold">📚 Библиотека</h3>
            <span className="text-[11.5px] text-ink-2 font-semibold">1 200 книг</span>
          </div>
          <div className="flex gap-3 px-5 overflow-x-auto no-scrollbar pb-1">
            {BOOKS.map((b) => (
              <button key={b.id} onClick={() => say(b.prog > 0 ? `Читаем со стр. ${b.page}` : "Приятного чтения! 📖")} className="tap shrink-0 w-[96px] text-left">
                <div className={`h-[118px] rounded-xl bg-gradient-to-b ${b.g} flex items-center justify-center relative overflow-hidden`}>
                  <span className="text-[34px] drop-shadow-lg">{b.emoji}</span>
                  <div className="absolute inset-y-0 left-0 w-[3px] bg-black/25" />
                  {b.prog > 0 && (
                    <span className="absolute bottom-1.5 right-1.5 text-[9px] font-black bg-black/40 text-white px-1.5 py-0.5 rounded">{b.prog}%</span>
                  )}
                </div>
                <p className="text-ink text-[11.5px] font-bold leading-tight mt-1.5">{b.title}</p>
                <p className="text-ink-2 text-[10px] mt-0.5">{b.author}</p>
              </button>
            ))}
          </div>
        </div>

        {/* сервисы 2×2 */}
        <div className="mt-6">
          <h3 className="px-5 text-ink text-[16px] font-bold mb-2.5">Сервисы в пути</h3>
          <div className="px-5 grid grid-cols-2 gap-2.5">
            <button onClick={() => setFoodOpen(true)} className="tap bg-white rounded-2xl p-3.5 text-left shadow-[0_1px_10px_rgba(0,0,0,0.05)] relative overflow-hidden">
              {cartCount > 0 && (
                <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-rzd text-white text-[10px] font-black flex items-center justify-center">{cartCount}</span>
              )}
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center text-[20px]">🍽</div>
              <p className="text-ink text-[13.5px] font-bold mt-2.5 leading-tight">Ресторан к месту</p>
              <p className="text-ink-2 text-[11px] mt-0.5 leading-tight">Доставка за 15 минут</p>
            </button>
            <button onClick={() => setCondOpen(true)} className="tap bg-white rounded-2xl p-3.5 text-left shadow-[0_1px_10px_rgba(0,0,0,0.05)]">
              <div className="w-10 h-10 rounded-xl bg-rzd-light text-rzd flex items-center justify-center">
                <IconUser className="w-5 h-5" />
              </div>
              <p className="text-ink text-[13.5px] font-bold mt-2.5 leading-tight">Вопрос проводнику</p>
              <p className="text-ink-2 text-[11px] mt-0.5 leading-tight">Ответ за пару минут</p>
            </button>
            <button onClick={() => setNetOpen(true)} className="tap bg-white rounded-2xl p-3.5 text-left shadow-[0_1px_10px_rgba(0,0,0,0.05)]">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-500 flex items-center justify-center">
                <IconWifi className="w-5 h-5" />
              </div>
              <p className="text-ink text-[13.5px] font-bold mt-2.5 leading-tight">Интернет</p>
              <p className="text-ink-2 text-[11px] mt-0.5 leading-tight tabular-nums">{speed.toFixed(0)} Мбит/с · бесплатно</p>
            </button>
            <button onClick={() => setRouteOpen(true)} className="tap bg-white rounded-2xl p-3.5 text-left shadow-[0_1px_10px_rgba(0,0,0,0.05)]">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <IconRoute className="w-5 h-5" />
              </div>
              <p className="text-ink text-[13.5px] font-bold mt-2.5 leading-tight">Маршрут</p>
              <p className="text-ink-2 text-[11px] mt-0.5 leading-tight">Следующая — Тверь</p>
            </button>
          </div>
        </div>

        {/* оценка */}
        <div className="px-5 mt-5">
          <div className="bg-white rounded-2xl p-4 shadow-[0_1px_10px_rgba(0,0,0,0.05)] flex items-center gap-3">
            <div className="flex-1">
              <p className="text-ink text-[13.5px] font-bold">Как вам поездка?</p>
              <p className="text-ink-2 text-[11.5px]">Оценка уйдёт начальнику поезда</p>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => { setStars(n); say("Спасибо! Оценка передана 🙌"); }}
                  className="tap"
                  aria-label={`Оценка ${n}`}
                >
                  <IconStar className={`w-6 h-6 transition-colors ${n <= stars ? "text-amber-400" : "text-black/15"}`} filled={n <= stars} />
                </button>
              ))}
            </div>
          </div>
          <p className="text-center text-[10.5px] text-ink-2 mt-4">
            «Попутчик» работает только в поезде · сеть RZD_Poputchik_757А · РЖД
          </p>
        </div>
      </div>

      {/* mini player */}
      {track && (
        <div className="absolute bottom-5 inset-x-4 z-40 pop-in">
          <div className="bg-gradient-to-r from-[#0d1b3e] to-[#175460] rounded-2xl px-3.5 py-2.5 flex items-center gap-3 shadow-2xl">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${track.g} flex items-center justify-center text-[18px] shrink-0`}>
              {track.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-[13px] font-bold truncate">{track.title}</p>
              <p className="text-white/55 text-[11px] truncate">{track.artist}</p>
            </div>
            <div className="flex items-end gap-[2.5px] h-4 shrink-0">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className="eq-bar w-[3px] h-full bg-emerald-400 rounded-full" style={{ animationDelay: `${i * 0.13}s` }} />
              ))}
            </div>
            <button onClick={() => setTrackId(null)} className="tap w-9 h-9 rounded-full bg-white/12 text-white flex items-center justify-center text-[11px] shrink-0">
              ■
            </button>
          </div>
        </div>
      )}

      {/* movie sheet */}
      <Sheet open={movie !== null} onClose={() => { setMovie(null); setPlaying(false); }}>
        {movie && (
          <div>
            <div className={`relative h-44 -mx-5 -mt-9 rounded-b-none bg-gradient-to-br ${movie.g} flex items-center justify-center`}>
              <span className="text-[64px] drop-shadow-xl">{movie.emoji}</span>
              <span className="absolute top-14 left-5 text-[10px] font-black bg-black/35 text-white px-2 py-1 rounded-lg">БЕСПЛАТНО В ПОЕЗДЕ</span>
            </div>
            <div className="mt-4">
              <h3 className="text-[18px] font-bold text-ink">{movie.title}</h3>
              <p className="text-[12px] text-ink-2 mt-0.5">{movie.meta}</p>
              <p className="text-[13px] text-ink leading-relaxed mt-3">{movie.desc}</p>

              {mProg > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between text-[11px] text-ink-2 mb-1.5">
                    <span>{movie.prog > 0 && mProg < 100 ? "Продолжить просмотр" : "Просмотрено"}</span>
                    <span className="tabular-nums font-bold">{Math.round(mProg)}%</span>
                  </div>
                  <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                    <div className="h-full bg-rzd rounded-full transition-all" style={{ width: `${mProg}%` }} />
                  </div>
                </div>
              )}

              <div className="flex gap-2 mt-4">
                {["Субтитры РУС", "Дорожка РУС", "16+"].map((c) => (
                  <span key={c} className="text-[10.5px] font-bold text-ink-2 bg-surface px-2 py-1 rounded-md">{c}</span>
                ))}
              </div>

              <PrimaryButton className="mt-5" onClick={() => setPlaying(!playing)}>
                {playing ? "⏸ Пауза" : "▶ Смотреть"}
              </PrimaryButton>
              {playing && (
                <p className="text-center text-[11px] text-ink-2 mt-2 fade-up">
                  Воспроизведение… звук в наушниках по Bluetooth 🎧
                </p>
              )}
            </div>
          </div>
        )}
      </Sheet>

      {/* food sheet */}
      <Sheet open={foodOpen} onClose={() => setFoodOpen(false)}>
        <SheetHead title="Вагон-ресторан" sub={`Доставка к месту 14А · ~15 минут`} onClose={() => setFoodOpen(false)} />

        {!ordered ? (
          <>
            <div className="space-y-2">
              {MENU.map((m) => {
                const q = cart[m.id] ?? 0;
                return (
                  <div key={m.id} className="flex items-center gap-3 bg-surface rounded-2xl p-3">
                    <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center text-[22px] shrink-0 shadow-sm">{m.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-ink text-[13.5px] font-bold leading-tight">{m.name}</p>
                      <p className="text-ink-2 text-[11px] mt-0.5 leading-tight">{m.desc}</p>
                      <p className="text-rzd text-[13px] font-bold mt-1">{m.price} ₽</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => setCart((c) => ({ ...c, [m.id]: Math.max(0, q - 1) }))}
                        className={`tap w-8 h-8 rounded-lg flex items-center justify-center ${q > 0 ? "bg-white text-ink shadow-sm" : "bg-black/5 text-ink-2/30"}`}
                      >
                        <IconMinus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-5 text-center font-bold text-ink text-[14px] tabular-nums">{q}</span>
                      <button
                        onClick={() => setCart((c) => ({ ...c, [m.id]: q + 1 }))}
                        className="tap w-8 h-8 rounded-lg bg-rzd text-white flex items-center justify-center shadow-sm shadow-rzd/30"
                      >
                        <IconPlus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <PrimaryButton
              className={`mt-4 ${cartCount === 0 ? "opacity-50 pointer-events-none" : ""}`}
              onClick={() => { setOrdered(true); setOrderStep(1); }}
            >
              Заказать к месту 14А · {cartSum.toLocaleString("ru-RU")} ₽
            </PrimaryButton>
          </>
        ) : (
          <div className="fade-up">
            <div className="bg-emerald-50 rounded-2xl p-4 flex items-center gap-3">
              <span className="text-[26px]">🍽</span>
              <div>
                <p className="text-ink font-bold text-[14px]">Заказ принят · {cartSum.toLocaleString("ru-RU")} ₽</p>
                <p className="text-ink-2 text-[12px]">Оплата при получении или с бонусного счёта</p>
              </div>
            </div>
            <div className="mt-4 space-y-0">
              {["Заказ принят", "Готовим на камбузе", "Несём к вашему месту"].map((s, i) => {
                const done = orderStep > i;
                const current = orderStep === i + 1;
                return (
                  <div key={s} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        done ? "bg-emerald-500 text-white" : current ? "bg-rzd text-white pulse-dot" : "bg-surface text-ink-2/40"
                      }`}>
                        {done ? <IconCheck className="w-3.5 h-3.5" /> : <span className="text-[11px] font-bold">{i + 1}</span>}
                      </div>
                      {i < 2 && <div className={`w-[2px] h-6 my-1 rounded-full ${orderStep > i + 1 ? "bg-emerald-400" : "bg-black/8"}`} />}
                    </div>
                    <p className={`text-[13.5px] font-semibold pt-0.5 ${done || current ? "text-ink" : "text-ink-2/50"}`}>{s}</p>
                  </div>
                );
              })}
            </div>
            {orderStep >= 3 && (
              <p className="text-center text-[12.5px] text-emerald-700 bg-emerald-50 rounded-xl py-3 font-semibold mt-2 fade-up">
                Приятного аппетита! Оцените кухню в вагоне-ресторане ⭐
              </p>
            )}
            <button
              onClick={() => { setOrdered(false); setOrderStep(0); setCart({}); setFoodOpen(false); }}
              className="tap w-full mt-4 h-11 rounded-2xl bg-surface text-ink-2 font-semibold text-[13.5px]"
            >
              Готово
            </button>
          </div>
        )}
      </Sheet>

      {/* conductor sheet */}
      <ConductorSheet open={condOpen} onClose={() => setCondOpen(false)} />

      {/* internet sheet */}
      <InternetSheet open={netOpen} onClose={() => setNetOpen(false)} speed={speed} />

      {/* route sheet */}
      <Sheet open={routeOpen} onClose={() => setRouteOpen(false)}>
        <RouteSheetContent train={train} onClose={() => setRouteOpen(false)} />
      </Sheet>

      <Toast show={toast} text={toastText} />
    </div>
  );
}

/* ── conductor chat ─────────────────────────────── */
type CMsg = { id: number; from: "c" | "me"; text: string };

function ConductorSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [msgs, setMsgs] = useState<CMsg[]>([
    { id: 1, from: "c", text: "Здравствуйте! Я Марина, проводник вагона 7 🧢 Напишите, если что-то нужно — плед, чай или помощь с местом." },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const idRef = useRef(10);

  const send = (text: string) => {
    const t = text.trim();
    if (!t || typing) return;
    setMsgs((m) => [...m, { id: ++idRef.current, from: "me", text: t }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const ans = CONDUCTOR_ANSWERS.find((a) => a.re.test(t))?.reply ?? CONDUCTOR_DEFAULT;
      setTyping(false);
      setMsgs((m) => [...m, { id: ++idRef.current, from: "c", text: ans }]);
    }, 1100);
  };

  return (
    <Sheet open={open} onClose={onClose}>
      <SheetHead title="Проводник · вагон 7" sub="Марина Ковалёва · на связи" onClose={onClose} />
      <div className="space-y-2 max-h-56 overflow-y-auto no-scrollbar pr-1">
        {msgs.map((m) => (
          <div key={m.id} className={`msg-in flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] px-3.5 py-2.5 ${
              m.from === "me" ? "bg-rzd text-white rounded-2xl rounded-br-md" : "bg-surface text-ink rounded-2xl rounded-bl-md"
            }`}>
              <p className="text-[13px] leading-relaxed">{m.text}</p>
            </div>
          </div>
        ))}
        {typing && (
          <div className="msg-in flex justify-start">
            <div className="bg-surface rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
              {[0, 1, 2].map((i) => <span key={i} className="typing-dot w-1.5 h-1.5 rounded-full bg-ink-2" />)}
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2 mt-3">
        {["🛏 Ещё один плед", "❄️ В вагоне холодно", "🔌 Не работает розетка", "🚄 Где мы сейчас?"].map((q) => (
          <button key={q} onClick={() => send(q.replace(/^\S+\s/, ""))} className="tap px-3 h-8 rounded-full bg-surface text-ink-2 text-[12px] font-semibold">
            {q}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send(input)}
          placeholder="Написать проводнику…"
          className="flex-1 h-11 px-4 rounded-full bg-surface text-[13.5px] text-ink outline-none focus:ring-2 focus:ring-rzd/25"
        />
        <button
          onClick={() => send(input)}
          disabled={!input.trim() || typing}
          className={`tap w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${
            input.trim() && !typing ? "bg-rzd text-white shadow-md shadow-rzd/30" : "bg-surface text-ink-2/40"
          }`}
          aria-label="Отправить"
        >
          <IconSend className="w-4.5 h-4.5" />
        </button>
      </div>
    </Sheet>
  );
}

/* ── internet sheet ─────────────────────────────── */
function InternetSheet({ open, onClose, speed }: { open: boolean; onClose: () => void; speed: number }) {
  const [turbo, setTurbo] = useState(false);
  const target = turbo ? 47 : 9.4;
  const [spd, setSpd] = useState(9.4);
  useEffect(() => {
    if (!open) return;
    const id = setInterval(() => setSpd((s) => s + (target - s) * 0.25 + (Math.random() - 0.5) * 1.6), 500);
    return () => clearInterval(id);
  }, [open, target]);

  return (
    <Sheet open={open} onClose={onClose}>
      <SheetHead title="Интернет в поезде" sub="Спутниковый канал + LTE вдоль маршрута" onClose={onClose} />
      <div className="bg-gradient-to-br from-[#0d1b3e] to-[#175460] rounded-2xl p-5 text-center">
        <p className="text-white/55 text-[11px] font-bold uppercase tracking-widest">Скорость сейчас</p>
        <p className="text-white text-[38px] font-black tabular-nums leading-tight mt-1">
          {Math.max(0.5, spd).toFixed(1)}
          <span className="text-[15px] font-bold text-white/60 ml-1.5">Мбит/с</span>
        </p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <SignalBars />
          <span className="text-emerald-300 text-[11.5px] font-semibold">RZD_Poputchik_757А · защищено</span>
        </div>
        <p className="text-white/45 text-[11px] mt-3">Использовано сегодня: 1,2 ГБ</p>
      </div>
      <div className="space-y-2 mt-4">
        <button onClick={() => setTurbo(false)} className={`tap w-full p-3.5 rounded-2xl border-[1.5px] flex items-center gap-3 text-left ${!turbo ? "border-rzd bg-rzd-light/60" : "border-transparent bg-surface"}`}>
          <IconWifi className={`w-5 h-5 ${!turbo ? "text-rzd" : "text-ink-2"}`} />
          <div className="flex-1">
            <p className="font-bold text-ink text-[13.5px]">Базовый</p>
            <p className="text-ink-2 text-[11.5px]">До 10 Мбит/с · портал, мессенджеры</p>
          </div>
          <span className="text-[12px] font-black text-emerald-600">0 ₽</span>
        </button>
        <button onClick={() => setTurbo(true)} className={`tap w-full p-3.5 rounded-2xl border-[1.5px] flex items-center gap-3 text-left ${turbo ? "border-rzd bg-rzd-light/60" : "border-transparent bg-surface"}`}>
          <IconLightning className={`w-5 h-5 ${turbo ? "text-rzd" : "text-ink-2"}`} />
          <div className="flex-1">
            <p className="font-bold text-ink text-[13.5px]">Турбо</p>
            <p className="text-ink-2 text-[11.5px]">До 50 Мбит/с · кино и видеозвонки</p>
          </div>
          <span className="text-[12px] font-black text-ink">149 ₽</span>
        </button>
      </div>
      <PrimaryButton className="mt-4" onClick={() => { setTurbo(true); }}>
        <IconLightning className="w-5 h-5" /> {turbo ? "Турбо подключён · 24 часа" : "Включить Турбо"}
      </PrimaryButton>
      <p className="text-center text-[11px] text-ink-2 mt-3">Текущая скорость вне поезда: {speed.toFixed(0)} Мбит/с</p>
    </Sheet>
  );
}

/* ── route sheet ────────────────────────────────── */
function RouteSheetContent({ train, onClose }: { train: ReturnType<typeof useBooking>["booking"]["selectedTrain"]; onClose: () => void }) {
  const stops = getStops(train);
  const nextIdx = 1;
  return (
    <div>
      <SheetHead title={`Маршрут · ${train.name} ${train.number}`} sub={`${stops[0]?.station} — ${stops[stops.length - 1]?.station}`} onClose={onClose} />
      <div className="bg-amber-50 border border-amber-200/50 rounded-xl px-3.5 py-2.5 flex items-center gap-2 mb-4">
        <IconTrain className="w-4.5 h-4.5 text-amber-600 shrink-0" />
        <p className="text-[12px] font-semibold text-amber-800">
          Следующая остановка — {stops[nextIdx]?.station}, через ~20 минут
        </p>
      </div>
      <div>
        {stops.map((s, i) => {
          const first = i === 0;
          const last = i === stops.length - 1;
          const isNext = i === nextIdx;
          return (
            <div key={s.station + i} className="flex gap-3">
              <div className="w-[80px] shrink-0 text-right pt-0.5">
                <p className="text-[12px] font-bold text-ink tabular-nums leading-tight">
                  {first ? s.dep : last ? s.arr : `${s.arr}–${s.dep}`}
                </p>
                {!first && !last && <p className="text-[10px] text-ink-2 mt-0.5">{s.stopMin} мин</p>}
              </div>
              <div className="flex flex-col items-center shrink-0">
                <div className={
                  isNext
                    ? "w-3.5 h-3.5 rounded-full bg-amber-400 mt-1 pulse-dot"
                    : first
                    ? "w-3 h-3 rounded-full bg-rzd mt-1"
                    : last
                    ? "w-3 h-3 rounded-full border-[2.5px] border-rzd bg-white mt-1"
                    : "w-2.5 h-2.5 rounded-full bg-white border-2 border-rzd/35 mt-1.5"
                } />
                {!last && <div className="w-[2px] flex-1 bg-rzd/15 my-1 rounded-full" />}
              </div>
              <div className={`flex-1 min-w-0 ${last ? "" : "pb-3.5"}`}>
                <p className={`text-[13px] leading-tight flex items-center gap-1.5 flex-wrap ${isNext ? "font-black text-amber-700" : "font-semibold text-ink"}`}>
                  {s.station}
                  {isNext && <span className="text-[9px] font-black text-white bg-amber-500 px-1.5 py-0.5 rounded-md uppercase">Скоро</span>}
                  {first && <span className="text-[9px] font-black text-white bg-rzd px-1.5 py-0.5 rounded-md uppercase">Вы здесь</span>}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
