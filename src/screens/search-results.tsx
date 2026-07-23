import { useEffect, useMemo, useState } from "react";
import { StatusBar, Card, useNav } from "../components/ui";
import {
  IconBack,
  IconSwap,
  IconTrain,
  IconSparkles,
  IconWifi,
  IconLightning,
  IconSearch,
} from "../components/icons";
import { trainsFor, searchDates, type Train } from "../data";
import { useBooking } from "../booking";

type SortMode = "time" | "price" | "duration";
type FilterMode = "all" | "fast" | "night";

const BRAND_LABEL: Record<Train["brand"], string> = {
  sapsan: "Скоростной",
  lastochka: "Скоростной",
  firm: "Фирменный",
  classic: "Пассажирский",
};

const BRAND_STYLE: Record<Train["brand"], string> = {
  sapsan: "bg-ink text-white",
  lastochka: "bg-emerald-100 text-emerald-700",
  firm: "bg-rzd-light text-rzd",
  classic: "bg-surface text-ink-2",
};

function pluralTrains(n: number) {
  const d10 = n % 10;
  const d100 = n % 100;
  if (d10 === 1 && d100 !== 11) return "поезд";
  if (d10 >= 2 && d10 <= 4 && (d100 < 10 || d100 >= 20)) return "поезда";
  return "поездов";
}

export function SearchResultsScreen() {
  const nav = useNav();
  const { booking, updateBooking } = useBooking();
  const [loading, setLoading] = useState(true);
  const [dateId, setDateId] = useState(1);
  const [sort, setSort] = useState<SortMode>("time");
  const [filter, setFilter] = useState<FilterMode>("all");

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 750);
    return () => clearTimeout(t);
  }, []);

  const trains = useMemo(
    () => trainsFor(booking.searchFrom, booking.searchTo),
    [booking.searchFrom, booking.searchTo],
  );
  const date = searchDates[dateId];

  const list = useMemo(() => {
    const priced = trains.map((t) => ({
      ...t,
      minPrice: Math.round((Math.min(...t.classes.map((c) => c.price)) * date.factor) / 10) * 10,
    }));
    let l = [...priced];
    if (filter === "fast") l = l.filter((t) => t.brand === "sapsan" || t.brand === "lastochka");
    if (filter === "night") {
      l = l.filter((t) => {
        const h = parseInt(t.depart, 10);
        return h >= 20 || h < 6;
      });
    }
    if (sort === "time") l.sort((a, b) => a.depart.localeCompare(b.depart));
    if (sort === "price") l.sort((a, b) => a.minPrice - b.minPrice);
    if (sort === "duration") l.sort((a, b) => a.durationMin - b.durationMin);
    return l;
  }, [trains, date, sort, filter]);

  const pick = (trainId: string) => {
    const train = trains.find((t) => t.id === trainId);
    if (!train) return;
    updateBooking({ selectedTrain: train, searchDate: `${date.label}, ${date.day}` });
    nav.push("buy-ticket");
  };

  const swap = () =>
    updateBooking({ searchFrom: booking.searchTo, searchTo: booking.searchFrom });

  return (
    <div className="h-full flex flex-col bg-surface">
      {/* header */}
      <div className="bg-gradient-to-br from-rzd to-rzd-darker rounded-b-[28px] pb-5 shrink-0">
        <StatusBar light />
        <div className="flex items-center gap-2 px-4 py-2">
          <button
            onClick={nav.pop}
            className="tap -ml-1 w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-white"
            aria-label="Назад"
          >
            <IconBack className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-[19px] font-bold leading-tight truncate text-white">Выбор поезда</h1>
            <p className="text-[12px] text-white/70">
              {loading ? "Ищем подходящие рейсы…" : `Найдено ${list.length} ${pluralTrains(list.length)} · ${date.label}, ${date.day}`}
            </p>
          </div>
        </div>

        {/* route */}
        <div className="flex items-center justify-between px-5 mt-2 fade-up">
          <div className="flex-1 min-w-0">
            <p className="text-white text-[22px] font-bold leading-tight truncate">{booking.searchFrom}</p>
            <p className="text-white/60 text-[11.5px]">отправление</p>
          </div>
          <button
            onClick={swap}
            className="tap mx-3 w-11 h-11 rounded-full bg-white/15 text-white flex items-center justify-center shrink-0"
            aria-label="Поменять местами"
          >
            <IconSwap className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0 text-right">
            <p className="text-white text-[22px] font-bold leading-tight truncate">{booking.searchTo}</p>
            <p className="text-white/60 text-[11.5px]">прибытие</p>
          </div>
        </div>

        {/* date chips */}
        <div className="flex gap-2 px-5 mt-4 overflow-x-auto no-scrollbar fade-up d-1">
          {searchDates.map((d) => {
            const active = d.id === dateId;
            return (
              <button
                key={d.id}
                onClick={() => {
                  setDateId(d.id);
                  setLoading(true);
                  setTimeout(() => setLoading(false), 450);
                }}
                className={`tap shrink-0 w-[64px] rounded-xl py-2 text-center transition-colors ${
                  active ? "bg-white text-rzd shadow-lg shadow-black/10" : "bg-white/12 text-white/80"
                }`}
              >
                <p className="text-[11px] font-semibold opacity-75">{d.label}</p>
                <p className="text-[13px] font-bold leading-tight">{d.day}</p>
                <p className={`text-[9px] font-semibold mt-0.5 ${active ? "text-rzd/70" : "text-white/50"}`}>
                  {d.factor < 1 ? "дешевле" : d.factor > 1.05 ? "дороже" : " "}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* sort + filters */}
      <div className="flex gap-2 px-5 mt-4 overflow-x-auto no-scrollbar">
        {(
          [
            ["time", "По времени"],
            ["price", "Дешевле"],
            ["duration", "Быстрее"],
          ] as [SortMode, string][]
        ).map(([v, label]) => (
          <button
            key={v}
            onClick={() => setSort(v)}
            className={`tap shrink-0 px-3.5 h-9 rounded-full text-[12.5px] font-bold transition-colors ${
              sort === v ? "bg-rzd text-white shadow-md shadow-rzd/25" : "bg-white text-ink-2"
            }`}
          >
            {label}
          </button>
        ))}
        <div className="w-px h-6 bg-black/10 self-center shrink-0 mx-1" />
        {(
          [
            ["fast", "⚡ Скоростные"],
            ["night", "🌙 Ночные"],
          ] as [FilterMode, string][]
        ).map(([v, label]) => (
          <button
            key={v}
            onClick={() => setFilter(filter === v ? "all" : v)}
            className={`tap shrink-0 px-3.5 h-9 rounded-full text-[12.5px] font-bold transition-colors ${
              filter === v ? "bg-ink text-white" : "bg-white text-ink-2"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* list */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-4">
        {loading ? (
          <div className="px-5 mt-4 space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-[0_1px_10px_rgba(0,0,0,0.05)]">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-6 rounded-lg bg-surface animate-pulse" />
                  <div className="w-24 h-4 rounded-lg bg-surface animate-pulse" />
                  <div className="ml-auto w-16 h-6 rounded-lg bg-surface animate-pulse" />
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="w-14 h-7 rounded-lg bg-surface animate-pulse" />
                  <div className="flex-1 h-4 mx-4 rounded-full bg-surface animate-pulse" />
                  <div className="w-14 h-7 rounded-lg bg-surface animate-pulse" />
                </div>
                <div className="flex gap-2 mt-4">
                  <div className="w-20 h-8 rounded-lg bg-surface animate-pulse" />
                  <div className="w-20 h-8 rounded-lg bg-surface animate-pulse" />
                  <div className="w-20 h-8 rounded-lg bg-surface animate-pulse" />
                </div>
              </div>
            ))}
            <p className="text-center text-[12px] text-ink-2 flex items-center justify-center gap-2">
              <IconSearch className="w-4 h-4 animate-pulse" /> Подбираем рейсы по вашему маршруту…
            </p>
          </div>
        ) : list.length === 0 ? (
          <div className="px-5 mt-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-sm">
              <IconTrain className="w-8 h-8 text-ink-2/50" />
            </div>
            <p className="font-bold text-ink text-[15px] mt-4">Ничего не нашлось</p>
            <p className="text-[12.5px] text-ink-2 mt-1 leading-snug">
              Под этот фильтр поездов нет — попробуйте выбрать другой тип или дату.
            </p>
            <button
              onClick={() => setFilter("all")}
              className="tap mt-4 px-5 h-11 rounded-2xl bg-rzd text-white font-semibold text-[13.5px] shadow-md shadow-rzd/25"
            >
              Показать все поезда
            </button>
          </div>
        ) : (
          <div className="px-5 mt-4 space-y-3">
            {list.map((t, i) => {
              const isUsual = t.id === "spb-757";
              const totalSeats = t.classes.reduce((s, c) => s + c.seatsFree, 0);
              return (
                <Card
                  key={t.id}
                  onClick={() => pick(t.id)}
                  className={`overflow-hidden fade-up d-${Math.min(i + 1, 8)}`}
                >
                  {isUsual && (
                    <div className="bg-amber-50 border-b border-amber-200/50 px-4 py-1.5 flex items-center gap-1.5">
                      <IconSparkles className="w-3.5 h-3.5 text-amber-500" />
                      <p className="text-[11px] font-bold text-amber-700">
                        Ваш обычный поезд — по данным Smart Profile
                      </p>
                    </div>
                  )}
                  <div className="p-4">
                    {/* header */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-black bg-ink text-white px-2 py-1 rounded-lg tracking-wide">
                        {t.number}
                      </span>
                      <p className="font-bold text-ink text-[14.5px] truncate">{t.name}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${BRAND_STYLE[t.brand]}`}>
                        {BRAND_LABEL[t.brand]}
                      </span>
                      <div className="ml-auto text-right shrink-0">
                        <p className="text-[17px] font-bold text-rzd leading-none">
                          {t.minPrice.toLocaleString("ru-RU")} ₽
                        </p>
                        <p className="text-[10px] text-ink-2 mt-0.5">от · за место</p>
                      </div>
                    </div>

                    {/* times */}
                    <div className="flex items-center justify-between mt-3.5">
                      <div>
                        <p className="text-[21px] font-bold text-ink leading-none">{t.depart}</p>
                        <p className="text-[11px] text-ink-2 mt-1 max-w-[92px] truncate">
                          {t.stationFrom || booking.searchFrom}
                        </p>
                      </div>
                      <div className="flex-1 px-3 flex flex-col items-center">
                        <p className="text-[11px] text-ink-2 mb-1">{t.duration}</p>
                        <div className="w-full flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-rzd shrink-0" />
                          <div className="flex-1 border-t-2 border-dashed border-rzd/35" />
                          {t.brand === "sapsan" || t.brand === "lastochka" ? (
                            <IconLightning className="w-4 h-4 text-rzd shrink-0" />
                          ) : (
                            <IconTrain className="w-4 h-4 text-rzd shrink-0" />
                          )}
                          <div className="flex-1 border-t-2 border-dashed border-rzd/35" />
                          <div className="w-1.5 h-1.5 rounded-full border-2 border-rzd shrink-0" />
                        </div>
                        <p className="text-[10px] text-ink-2 mt-1">
                          {parseInt(t.arrive, 10) < parseInt(t.depart, 10) ? "+1 день" : "в тот же день"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[21px] font-bold text-ink leading-none">{t.arrive}</p>
                        <p className="text-[11px] text-ink-2 mt-1 max-w-[92px] truncate ml-auto">
                          {t.stationTo || booking.searchTo}
                        </p>
                      </div>
                    </div>

                    {/* features */}
                    <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                      {t.features.includes("Wi-Fi") && (
                        <span className="text-[10px] font-semibold text-ink-2 bg-surface px-2 py-1 rounded-md flex items-center gap-1">
                          <IconWifi className="w-3 h-3" /> Wi-Fi
                        </span>
                      )}
                      {t.features.filter((f) => f !== "Wi-Fi").slice(0, 2).map((f) => (
                        <span key={f} className="text-[10px] font-semibold text-ink-2 bg-surface px-2 py-1 rounded-md">
                          {f}
                        </span>
                      ))}
                      <span
                        className={`ml-auto text-[10.5px] font-bold ${
                          totalSeats <= 12 ? "text-rzd" : "text-emerald-600"
                        }`}
                      >
                        {totalSeats <= 12 ? `Осталось ${totalSeats} мест` : `${totalSeats} мест свободно`}
                      </span>
                    </div>

                    {/* classes */}
                    <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
                      {t.classes.map((c) => {
                        const p = Math.round((c.price * date.factor) / 10) * 10;
                        return (
                          <div
                            key={c.classCode}
                            className={`shrink-0 flex-1 min-w-[88px] rounded-xl px-2.5 py-2 border-[1.5px] ${
                              isUsual && c.classCode === "2С"
                                ? "border-rzd/40 bg-rzd-light"
                                : "border-black/6 bg-surface"
                            }`}
                          >
                            <p className="text-[11px] font-bold text-ink">{c.className}</p>
                            <p className="text-[12px] font-bold text-rzd leading-tight">
                              {p.toLocaleString("ru-RU")} ₽
                            </p>
                            <p className="text-[9.5px] text-ink-2">{c.classCode} · {c.seatsFree} мест</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Card>
              );
            })}

            <p className="text-center text-[11px] text-ink-2 pt-1">
              Цены указаны за одного взрослого · комиссия не взимается
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
