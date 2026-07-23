import { useEffect, useMemo, useState } from "react";
import { StatusBar, Header, PrimaryButton, Card, SectionTitle, Toggle, Toast, useNav } from "../components/ui";
import {
  IconTrain,
  IconStar,
  IconSparkles,
  IconFood,
  IconCheck,
  IconCard,
  IconLuggage,
  IconPet,
  IconLounge,
  IconPlus,
  IconMinus,
  IconTrash,
  IconUsers,
  IconSeat,
  IconUser,
  IconChevronRight,
  IconLightning,
  IconWifi,
} from "../components/icons";
import {
  user,
  savedPassengers,
  wagonsForTrain,
  foodMenus,
  paymentMethods,
  getStops,
  timeToMin,
  type PassengerDraft,
  type Wagon,
} from "../data";
import { calcTotal, useBooking, type ServiceState } from "../booking";

type Step = "passengers" | "seats" | "services" | "pay";

const STEPS: { id: Step; label: string }[] = [
  { id: "passengers", label: "Пассажиры" },
  { id: "seats", label: "Места" },
  { id: "services", label: "Услуги" },
  { id: "pay", label: "Оплата" },
];

const TAKEN_PATTERNS: string[][] = [
  ["11B", "15B", "13А"],
  ["11B", "13B", "16А", "12B"],
  ["12А", "14B", "17B"],
];

const SEAT_GRID = [
  ["11А", "11B", "12А", "12B"],
  ["13А", "13B", "14А", "14B"],
  ["15А", "15B", "16А", "16B"],
  ["17А", "17B", "18А", "18B"],
];

function emptyPassenger(n: number): PassengerDraft {
  return {
    id: `new-${Date.now()}-${n}`,
    isSelf: false,
    lastName: "",
    firstName: "",
    middleName: "",
    birthDate: "",
    document: "",
    type: "adult",
  };
}

function fullName(p: PassengerDraft) {
  const parts = [p.lastName, p.firstName, p.middleName].filter(Boolean);
  return parts.length ? parts.join(" ") : "Новый пассажир";
}

function typeLabel(t: PassengerDraft["type"]) {
  return t === "child" ? "Ребёнок" : t === "senior" ? "Льготный" : "Взрослый";
}

/* ═══════════════════ ЭКРАН · ОФОРМЛЕНИЕ БИЛЕТА ═══════════════════ */
export function BuyTicketScreen() {
  const nav = useNav();
  const { booking, updateBooking } = useBooking();
  const train = booking.selectedTrain;
  const trainWagons = useMemo(() => wagonsForTrain(train), [train]);

  const [step, setStep] = useState<Step>("passengers");
  const [passengers, setPassengers] = useState<PassengerDraft[]>([savedPassengers[0]]);
  const [wagonId, setWagonId] = useState(
    () => trainWagons.find((w) => w.popular)?.id ?? trainWagons[0].id,
  );
  const [seats, setSeats] = useState<string[]>(["14А"]);
  const [services, setServices] = useState<ServiceState>({
    food: true,
    foodMenuId: "breakfast",
    luggage: 0,
    pet: 0,
    lounge: false,
  });
  const [showAddPassenger, setShowAddPassenger] = useState(false);
  const [activeSeatPax, setActiveSeatPax] = useState(0);
  const [pointsUsed, setPointsUsed] = useState(0);
  const [payMethodId, setPayMethodId] = useState("mir");

  const wagonIndex = Math.max(0, trainWagons.findIndex((w) => w.id === wagonId));
  const wagon = trainWagons[wagonIndex];
  const taken = useMemo(() => new Set(TAKEN_PATTERNS[wagonIndex] ?? []), [wagonIndex]);
  const totals = useMemo(
    () => calcTotal(trainWagons, passengers.length, wagonId, services),
    [trainWagons, passengers.length, wagonId, services],
  );

  // clamp bonus usage if total changed (e.g. after going back from services)
  useEffect(() => {
    const max = Math.min(totals.total, user.points);
    setPointsUsed((prev) => Math.min(prev, max));
  }, [totals.total]);

  const cashToPay = totals.total - pointsUsed;
  const stepIndex = STEPS.findIndex((s) => s.id === step);

  const goNext = () => {
    if (step === "passengers") {
      if (passengers.length === 0) return;
      // sync seats length with passengers
      setSeats((prev) => {
        const next = [...prev];
        while (next.length < passengers.length) {
          const free = SEAT_GRID.flat().find((s) => !taken.has(s) && !next.includes(s));
          if (free) next.push(free);
          else break;
        }
        return next.slice(0, passengers.length);
      });
      setActiveSeatPax(0);
      setStep("seats");
    } else if (step === "seats") {
      if (seats.length < passengers.length) return;
      setStep("services");
    } else if (step === "services") {
      setStep("pay");
    } else {
      updateBooking({
        passengers,
        wagonId,
        seats,
        services,
        total: totals.total,
        pointsUsed,
        payMethodId,
        bonus: Math.round(cashToPay * 0.125),
        routeId: booking.routeId,
      });
      nav.push("success");
    }
  };

  const goBack = () => {
    if (step === "passengers") nav.pop();
    else if (step === "seats") setStep("passengers");
    else if (step === "services") setStep("seats");
    else setStep("services");
  };

  const toggleSeat = (s: string) => {
    if (taken.has(s)) return;
    setSeats((prev) => {
      const next = [...prev];
      const already = next.indexOf(s);
      if (already >= 0) {
        // free this seat
        next.splice(already, 1);
        return next;
      }
      if (next.length < passengers.length) {
        return [...next, s];
      }
      // replace seat of active passenger
      next[activeSeatPax] = s;
      // move active to next without seat if any
      const emptyIdx = next.findIndex((x, i) => !x && i < passengers.length);
      if (emptyIdx >= 0) setActiveSeatPax(emptyIdx);
      else if (activeSeatPax < passengers.length - 1) setActiveSeatPax(activeSeatPax + 1);
      return next.slice(0, passengers.length);
    });
  };

  const addSaved = (p: PassengerDraft) => {
    if (passengers.some((x) => x.id === p.id)) return;
    if (passengers.length >= 4) return;
    setPassengers((prev) => [...prev, { ...p }]);
    setShowAddPassenger(false);
  };

  const addBlank = () => {
    if (passengers.length >= 4) return;
    setPassengers((prev) => [...prev, emptyPassenger(prev.length + 1)]);
    setShowAddPassenger(false);
  };

  const removePax = (id: string) => {
    setPassengers((prev) => prev.filter((p) => p.id !== id));
  };

  const updatePax = (id: string, patch: Partial<PassengerDraft>) => {
    setPassengers((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  };

  const nextDisabled =
    (step === "passengers" && (passengers.length === 0 || passengers.some((p) => !p.lastName || !p.firstName))) ||
    (step === "seats" && seats.filter(Boolean).length < passengers.length);

  const nextLabel =
    step === "pay"
      ? cashToPay > 0
        ? `Оплатить ${cashToPay.toLocaleString("ru-RU")} ₽`
        : "Оплатить баллами"
      : step === "services"
      ? "К оплате"
      : step === "seats"
      ? "К услугам"
      : "Выбрать места";

  return (
    <div className="h-full flex flex-col bg-surface">
      <div className="bg-white shrink-0 border-b border-black/5">
        <StatusBar />
        <div className="flex items-center gap-2 px-4 py-2">
          <button
            onClick={goBack}
            className="tap -ml-1 w-10 h-10 rounded-full bg-surface flex items-center justify-center"
            aria-label="Назад"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-[19px] font-bold leading-tight truncate">Оформление билета</h1>
            <p className="text-[12px] text-ink-2">
              {train.name} · {train.number} · {booking.searchDate}
            </p>
          </div>
        </div>

        {/* step indicator */}
        <div className="px-5 pb-3">
          <div className="flex items-center gap-1">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`w-full h-1.5 rounded-full transition-colors ${
                    i <= stepIndex ? "bg-rzd" : "bg-black/8"
                  }`}
                />
                <span className={`text-[10px] font-semibold ${i === stepIndex ? "text-rzd" : "text-ink-2"}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-4">
        {/* route mini */}
        <div className="px-5 mt-3 fade-up">
          <Card className="px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rzd-light text-rzd flex items-center justify-center shrink-0">
              <IconTrain className="w-4.5 h-4.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-ink text-[13.5px] truncate">
                {booking.searchFrom} → {booking.searchTo} · {train.depart}–{train.arrive}
              </p>
              <p className="text-[11.5px] text-ink-2">
                {wagon.className} · вагон {wagon.number} · {passengers.length}{" "}
                {passengers.length === 1 ? "пассажир" : passengers.length < 5 ? "пассажира" : "пассажиров"}
              </p>
            </div>
            <p className="font-bold text-rzd text-[13px] shrink-0">
              {totals.total.toLocaleString("ru-RU")} ₽
            </p>
          </Card>
        </div>

        {step === "passengers" && (
          <PassengersStep
            passengers={passengers}
            showAdd={showAddPassenger}
            setShowAdd={setShowAddPassenger}
            onAddSaved={addSaved}
            onAddBlank={addBlank}
            onRemove={removePax}
            onUpdate={updatePax}
          />
        )}

        {step === "seats" && (
          <SeatsStep
            wagonList={trainWagons}
            wagonId={wagonId}
            setWagonId={(id) => {
              setWagonId(id);
              // reset seats that may be taken in new wagon
              const idx = Math.max(0, trainWagons.findIndex((w) => w.id === id));
              const t = new Set(TAKEN_PATTERNS[idx] ?? []);
              setSeats((prev) => {
                const cleaned = prev.filter((s) => s && !t.has(s));
                const need = passengers.length;
                const free = SEAT_GRID.flat().filter((s) => !t.has(s) && !cleaned.includes(s));
                while (cleaned.length < need && free.length) cleaned.push(free.shift()!);
                return cleaned.slice(0, need);
              });
              setActiveSeatPax(0);
            }}
            passengers={passengers}
            seats={seats}
            taken={taken}
            activeSeatPax={activeSeatPax}
            setActiveSeatPax={setActiveSeatPax}
            onToggleSeat={toggleSeat}
          />
        )}

        {step === "services" && (
          <ServicesStep
            services={services}
            setServices={setServices}
            passengerCount={passengers.length}
          />
        )}

        {step === "pay" && (
          <PayStep
            passengers={passengers}
            seats={seats}
            wagon={wagon}
            services={services}
            totals={totals}
            pointsUsed={pointsUsed}
            setPointsUsed={setPointsUsed}
            payMethodId={payMethodId}
            setPayMethodId={setPayMethodId}
          />
        )}
      </div>

      {/* bottom bar */}
      <div className="shrink-0 bg-white border-t border-black/5 px-5 pt-3 pb-2">
        <div className="flex items-center justify-between mb-2.5">
          <div>
            <p className="text-[12px] text-ink-2">
              {passengers.length}{" "}
              {passengers.length === 1 ? "билет" : passengers.length < 5 ? "билета" : "билетов"}
              {seats.length > 0 ? ` · места ${seats.filter(Boolean).join(", ")}` : ""}
            </p>
            <p className="text-[22px] font-bold text-ink leading-tight">
              {(step === "pay" ? cashToPay : totals.total).toLocaleString("ru-RU")} ₽
              {step === "pay" && pointsUsed > 0 && (
                <span className="ml-2 text-[13px] font-semibold text-ink-2 line-through align-middle">
                  {totals.total.toLocaleString("ru-RU")} ₽
                </span>
              )}
            </p>
            {step === "pay" && pointsUsed > 0 && (
              <p className="text-[11px] text-amber-600 font-semibold">
                −{pointsUsed.toLocaleString("ru-RU")} ₽ баллами
              </p>
            )}
          </div>
          <p className="text-[11px] text-amber-600 font-semibold flex items-center gap-1">
            <IconStar className="w-3.5 h-3.5" filled />
            +{step === "pay" ? Math.round(cashToPay * 0.125) : totals.bonus} баллов
          </p>
        </div>
        <PrimaryButton onClick={goNext} className={nextDisabled ? "opacity-50 pointer-events-none" : ""}>
          {step === "pay" ? (
            cashToPay > 0 ? (
              <IconCard className="w-5 h-5" />
            ) : (
              <IconStar className="w-5 h-5" />
            )
          ) : null}
          {nextLabel}
        </PrimaryButton>
        <div className="flex justify-center pt-2.5 pb-1">
          <div className="w-32 h-[5px] rounded-full bg-ink/80" />
        </div>
      </div>
    </div>
  );
}

/* ── step 1: passengers ─────────────────────────── */
function PassengersStep({
  passengers,
  showAdd,
  setShowAdd,
  onAddSaved,
  onAddBlank,
  onRemove,
  onUpdate,
}: {
  passengers: PassengerDraft[];
  showAdd: boolean;
  setShowAdd: (v: boolean) => void;
  onAddSaved: (p: PassengerDraft) => void;
  onAddBlank: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, patch: Partial<PassengerDraft>) => void;
}) {
  return (
    <div className="mt-4">
      <SectionTitle>Кто едет?</SectionTitle>
      <div className="px-5 space-y-3">
        {passengers.map((p, i) => (
          <Card key={p.id} className={`p-4 fade-up d-${Math.min(i + 1, 6)}`}>
            <div className="flex items-center gap-3">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 overflow-hidden ${
                  p.isSelf ? "" : "bg-rzd-light text-rzd"
                }`}
              >
                {p.isSelf ? (
                  <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <IconUser className="w-5 h-5" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-ink text-[14px] truncate">{fullName(p)}</p>
                  {p.isSelf && (
                    <span className="text-[10px] font-bold text-rzd bg-rzd-light px-1.5 py-0.5 rounded-md shrink-0">
                      ВЫ
                    </span>
                  )}
                </div>
                <p className="text-[12px] text-ink-2">
                  {typeLabel(p.type)}
                  {p.document ? ` · ${p.document}` : ""}
                </p>
              </div>
              {!p.isSelf && (
                <button
                  onClick={() => onRemove(p.id)}
                  className="tap w-9 h-9 rounded-xl bg-surface text-ink-2 flex items-center justify-center"
                  aria-label="Удалить"
                >
                  <IconTrash className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* editable fields for non-self / incomplete */}
            {(!p.isSelf || !p.document) && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Field
                  label="Фамилия"
                  value={p.lastName}
                  onChange={(v) => onUpdate(p.id, { lastName: v })}
                />
                <Field
                  label="Имя"
                  value={p.firstName}
                  onChange={(v) => onUpdate(p.id, { firstName: v })}
                />
                <Field
                  label="Отчество"
                  value={p.middleName}
                  onChange={(v) => onUpdate(p.id, { middleName: v })}
                />
                <Field
                  label="Дата рождения"
                  value={p.birthDate}
                  onChange={(v) => onUpdate(p.id, { birthDate: v })}
                  placeholder="ДД.ММ.ГГГГ"
                />
                <div className="col-span-2">
                  <Field
                    label="Документ"
                    value={p.document}
                    onChange={(v) => onUpdate(p.id, { document: v })}
                    placeholder="Паспорт · серия номер"
                  />
                </div>
                <div className="col-span-2 flex gap-2">
                  {(["adult", "child", "senior"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => onUpdate(p.id, { type: t })}
                      className={`tap flex-1 h-9 rounded-xl text-[12px] font-semibold ${
                        p.type === t ? "bg-rzd text-white" : "bg-surface text-ink-2"
                      }`}
                    >
                      {typeLabel(t)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ))}

        {passengers.length < 4 && (
          <button
            onClick={() => setShowAdd(true)}
            className="tap w-full h-14 rounded-2xl border-2 border-dashed border-rzd/30 text-rzd font-semibold text-[14px] flex items-center justify-center gap-2 bg-rzd-light/40"
          >
            <IconPlus className="w-5 h-5" /> Добавить пассажира
          </button>
        )}
      </div>

      {/* add passenger sheet */}
      {showAdd && (
        <div className="fixed inset-0 z-[80] flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowAdd(false)} />
          <div className="relative w-full max-w-[390px] bg-white rounded-t-[28px] p-5 pb-8 animate-[fade-up_0.3s_ease]">
            <div className="w-10 h-1 rounded-full bg-black/15 mx-auto mb-4" />
            <h3 className="text-[17px] font-bold text-ink mb-1">Добавить пассажира</h3>
            <p className="text-[12.5px] text-ink-2 mb-4">Выберите из сохранённых или заполните данные вручную</p>

            <div className="space-y-2">
              {savedPassengers
                .filter((sp) => !passengers.some((p) => p.id === sp.id))
                .map((sp) => (
                  <button
                    key={sp.id}
                    onClick={() => onAddSaved(sp)}
                    className="tap w-full p-3.5 rounded-2xl bg-surface flex items-center gap-3 text-left"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white text-rzd flex items-center justify-center shrink-0 overflow-hidden">
                      {sp.isSelf ? (
                        <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <IconUser className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-ink text-[14px] truncate">
                        {fullName(sp)}
                        {sp.isSelf ? " (вы)" : ""}
                      </p>
                      <p className="text-[12px] text-ink-2">
                        {typeLabel(sp.type)} · {sp.document}
                      </p>
                    </div>
                    <IconPlus className="w-5 h-5 text-rzd" />
                  </button>
                ))}

              <button
                onClick={onAddBlank}
                className="tap w-full p-3.5 rounded-2xl border-[1.5px] border-rzd/30 text-rzd font-semibold text-[14px] flex items-center justify-center gap-2"
              >
                <IconPlus className="w-5 h-5" /> Новый пассажир
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-[10.5px] font-semibold text-ink-2 uppercase tracking-wide">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full h-10 px-3 rounded-xl bg-surface text-[13.5px] font-semibold text-ink outline-none focus:ring-2 focus:ring-rzd/30"
      />
    </label>
  );
}

/* ── step 2: wagon + seats ──────────────────────── */
function SeatsStep({
  wagonList,
  wagonId,
  setWagonId,
  passengers,
  seats,
  taken,
  activeSeatPax,
  setActiveSeatPax,
  onToggleSeat,
}: {
  wagonList: Wagon[];
  wagonId: string;
  setWagonId: (id: string) => void;
  passengers: PassengerDraft[];
  seats: string[];
  taken: Set<string>;
  activeSeatPax: number;
  setActiveSeatPax: (i: number) => void;
  onToggleSeat: (s: string) => void;
}) {
  return (
    <div className="mt-4">
      <SectionTitle>Выбор вагона</SectionTitle>
      <div className="flex gap-2.5 px-5 overflow-x-auto no-scrollbar pb-1">
        {wagonList.map((w) => {
          const active = w.id === wagonId;
          return (
            <button
              key={w.id}
              onClick={() => setWagonId(w.id)}
              className={`tap shrink-0 w-[148px] p-3.5 rounded-2xl border-[1.5px] text-left transition-colors ${
                active ? "bg-rzd border-rzd text-white shadow-lg shadow-rzd/25" : "bg-white border-black/8 text-ink"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-bold ${active ? "text-white/80" : "text-ink-2"}`}>
                  Вагон {w.number}
                </span>
                {w.popular && (
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                      active ? "bg-white/20 text-white" : "bg-rzd-light text-rzd"
                    }`}
                  >
                    ВАШ
                  </span>
                )}
              </div>
              <p className="font-bold text-[15px] mt-1.5 leading-tight">{w.className}</p>
              <p className={`text-[11px] mt-0.5 ${active ? "text-white/70" : "text-ink-2"}`}>
                {w.classCode} · {w.seatsFree} мест
              </p>
              <p className={`text-[13px] font-bold mt-2 ${active ? "text-white" : "text-rzd"}`}>
                от {w.priceFrom.toLocaleString("ru-RU")} ₽
              </p>
            </button>
          );
        })}
      </div>

      {/* passenger → seat mapping */}
      <div className="mt-5">
        <SectionTitle>Места для пассажиров</SectionTitle>
        <div className="px-5 space-y-2">
          {passengers.map((p, i) => {
            const seat = seats[i];
            const active = activeSeatPax === i;
            return (
              <button
                key={p.id}
                onClick={() => setActiveSeatPax(i)}
                className={`tap w-full p-3 rounded-2xl flex items-center gap-3 text-left border-[1.5px] ${
                  active ? "bg-rzd-light border-rzd/40" : "bg-white border-transparent"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-[13px] font-bold ${
                    seat ? "bg-rzd text-white" : "bg-surface text-ink-2"
                  }`}
                >
                  {seat || i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-ink text-[13.5px] truncate">{fullName(p)}</p>
                  <p className="text-[11.5px] text-ink-2">
                    {seat ? `Место ${seat}` : "Нажмите и выберите место на схеме"}
                  </p>
                </div>
                <IconSeat className={`w-5 h-5 ${active ? "text-rzd" : "text-ink-2/40"}`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* seat map */}
      <div className="px-5 mt-4 fade-up">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="font-bold text-ink text-[14px]">Схема вагона {wagonList.find((w) => w.id === wagonId)?.number}</p>
            <span className="text-[11px] font-semibold text-rzd bg-rzd-light px-2 py-1 rounded-lg flex items-center gap-1">
              <IconSparkles className="w-3.5 h-3.5" /> 14А — любимое
            </span>
          </div>
          <p className="text-[11.5px] text-ink-2 mb-3">
            Выберите {passengers.length}{" "}
            {passengers.length === 1 ? "место" : passengers.length < 5 ? "места" : "мест"} · сейчас для:{" "}
            <span className="font-semibold text-ink">{fullName(passengers[activeSeatPax] ?? passengers[0])}</span>
          </p>

          {/* train head decoration */}
          <div className="flex justify-center mb-2">
            <div className="text-[10px] font-bold text-ink-2 tracking-widest uppercase">← по ходу движения</div>
          </div>

          <div className="space-y-2">
            {SEAT_GRID.map((row, ri) => (
              <div key={ri} className="flex items-center justify-center gap-2">
                {row.map((s, si) => {
                  const busy = taken.has(s);
                  const selIdx = seats.indexOf(s);
                  const sel = selIdx >= 0;
                  const isFav = s === "14А";
                  return (
                    <div key={s} className="flex items-center">
                      <button
                        disabled={busy}
                        onClick={() => onToggleSeat(s)}
                        className={`tap relative w-12 h-11 rounded-xl text-[12px] font-bold border-[1.5px] transition-colors ${
                          busy
                            ? "bg-surface text-ink-2/35 border-transparent cursor-not-allowed"
                            : sel
                            ? "bg-rzd text-white border-rzd shadow-md shadow-rzd/30"
                            : isFav
                            ? "bg-amber-50 text-ink border-amber-300"
                            : "bg-white text-ink border-black/10"
                        }`}
                      >
                        {sel ? (
                          <span className="flex flex-col items-center leading-none">
                            <span className="text-[10px] opacity-80">{selIdx + 1}</span>
                            <span>{s}</span>
                          </span>
                        ) : (
                          s
                        )}
                      </button>
                      {si === 1 && <div className="w-5" />}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11px] text-ink-2">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-rzd" />
              Выбрано
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded border-[1.5px] border-amber-300 bg-amber-50" />
              Любимое
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded border-[1.5px] border-black/15 bg-white" />
              Свободно
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-surface border border-black/5" />
              Занято
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ── step 3: services ───────────────────────────── */
function ServicesStep({
  services,
  setServices,
  passengerCount,
}: {
  services: ServiceState;
  setServices: (s: ServiceState | ((prev: ServiceState) => ServiceState)) => void;
  passengerCount: number;
}) {
  const foodMenu = foodMenus.find((m) => m.id === services.foodMenuId) ?? foodMenus[0];

  return (
    <div className="mt-4">
      <SectionTitle>Дополнительные услуги</SectionTitle>

      {/* food */}
      <div className="px-5">
        <Card className="p-4 fade-up">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-rzd-light text-rzd flex items-center justify-center shrink-0">
              <IconFood className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-ink text-[14px]">Питание в поезде</p>
              <p className="text-[12px] text-ink-2">
                {services.food && foodMenu.price > 0
                  ? `${foodMenu.title} · ${foodMenu.price.toLocaleString("ru-RU")} ₽ × ${passengerCount}`
                  : "Не выбрано"}
              </p>
            </div>
            <Toggle
              on={services.food}
              onChange={(on) =>
                setServices((s) => ({
                  ...s,
                  food: on,
                  foodMenuId: on ? (s.foodMenuId === "none" ? "breakfast" : s.foodMenuId) : "none",
                }))
              }
            />
          </div>
          {services.food && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              {foodMenus
                .filter((m) => m.id !== "none")
                .map((m) => {
                  const active = services.foodMenuId === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setServices((s) => ({ ...s, foodMenuId: m.id, food: true }))}
                      className={`tap p-3 rounded-xl text-left border-[1.5px] ${
                        active ? "border-rzd bg-rzd-light" : "border-black/6 bg-surface"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <p className="font-semibold text-ink text-[12.5px] leading-tight">{m.title}</p>
                        {m.tag && (
                          <span className="text-[9px] font-bold text-rzd bg-white px-1.5 py-0.5 rounded shrink-0">
                            {m.tag}
                          </span>
                        )}
                      </div>
                      <p className="text-[12px] font-bold text-rzd mt-1">{m.price} ₽</p>
                    </button>
                  );
                })}
            </div>
          )}
        </Card>
      </div>

      {/* luggage */}
      <div className="px-5 mt-3">
        <Card className="p-4 fade-up d-1">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-rzd-light text-rzd flex items-center justify-center shrink-0">
              <IconLuggage className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-ink text-[14px]">Дополнительный багаж</p>
              <p className="text-[12px] text-ink-2">350 ₽ за место · до 30 кг</p>
            </div>
            <Counter
              value={services.luggage}
              min={0}
              max={4}
              onChange={(v) => setServices((s) => ({ ...s, luggage: v }))}
            />
          </div>
        </Card>
      </div>

      {/* pet */}
      <div className="px-5 mt-3">
        <Card className="p-4 fade-up d-2">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-rzd-light text-rzd flex items-center justify-center shrink-0">
              <IconPet className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-ink text-[14px]">Провоз животного</p>
              <p className="text-[12px] text-ink-2">900 ₽ · в контейнере / переноске</p>
            </div>
            <Counter
              value={services.pet}
              min={0}
              max={2}
              onChange={(v) => setServices((s) => ({ ...s, pet: v }))}
            />
          </div>
          {services.pet > 0 && (
            <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200/50 text-[12px] text-ink leading-snug">
              Потребуется ветеринарный паспорт. Животное размещается на месте пассажира или в багажной зоне.
            </div>
          )}
        </Card>
      </div>

      {/* lounge */}
      <div className="px-5 mt-3">
        <Card className="p-4 fade-up d-3 overflow-hidden relative">
          <div className="absolute -right-6 -top-8 w-28 h-28 rounded-full bg-rzd/5 blur-xl" />
          <div className="flex items-center gap-3 relative">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-ink to-[#3a3a3e] text-white flex items-center justify-center shrink-0">
              <IconLounge className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-bold text-ink text-[14px]">Бизнес-зал вокзала</p>
                <span className="text-[9px] font-bold bg-rzd text-white px-1.5 py-0.5 rounded-md">VIP</span>
              </div>
              <p className="text-[12px] text-ink-2">
                Ленинградский · 1 200 ₽ × {passengerCount} · до 3 ч
              </p>
            </div>
            <Toggle
              on={services.lounge}
              onChange={(on) => setServices((s) => ({ ...s, lounge: on }))}
            />
          </div>
          {services.lounge && (
            <div className="mt-3 grid grid-cols-3 gap-2 relative">
              {["Напитки и снэки", "Wi-Fi и розетки", "Тихая зона"].map((t) => (
                <div key={t} className="bg-surface rounded-xl px-2 py-2 text-center">
                  <p className="text-[11px] font-semibold text-ink leading-tight">{t}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="px-5 mt-4 fade-up d-4">
        <Card className="p-3.5 flex items-start gap-3 !bg-rzd-light border-[1.5px] border-rzd/15">
          <IconSparkles className="w-5 h-5 text-rzd shrink-0 mt-0.5" />
          <p className="text-[12.5px] text-ink leading-snug">
            Smart Profile запомнил ваши предпочтения: питание «Завтрак + кофе» и место у окна включены по
            умолчанию.
          </p>
        </Card>
      </div>
    </div>
  );
}

function Counter({
  value,
  min,
  max,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-1.5 shrink-0">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="tap w-8 h-8 rounded-xl bg-surface text-ink flex items-center justify-center disabled:opacity-30"
      >
        <IconMinus className="w-4 h-4" />
      </button>
      <span className="w-6 text-center font-bold text-ink text-[15px]">{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="tap w-8 h-8 rounded-xl bg-rzd-light text-rzd flex items-center justify-center disabled:opacity-30"
      >
        <IconPlus className="w-4 h-4" />
      </button>
    </div>
  );
}

/* ── step 4: payment summary ────────────────────── */
function PayStep({
  passengers,
  seats,
  wagon,
  services,
  totals,
  pointsUsed,
  setPointsUsed,
  payMethodId,
  setPayMethodId,
}: {
  passengers: PassengerDraft[];
  seats: string[];
  wagon: Wagon;
  services: ServiceState;
  totals: ReturnType<typeof calcTotal>;
  pointsUsed: number;
  setPointsUsed: (v: number) => void;
  payMethodId: string;
  setPayMethodId: (v: string) => void;
}) {
  const foodMenu = foodMenus.find((m) => m.id === services.foodMenuId);
  const maxPoints = Math.min(totals.total, user.points);
  const cash = totals.total - pointsUsed;
  const earned = Math.round(cash * 0.125);
  const segment: "none" | "partial" | "full" =
    pointsUsed <= 0 ? "none" : pointsUsed >= maxPoints ? "full" : "partial";
  const setSegment = (s: "none" | "partial" | "full") => {
    if (s === "none") setPointsUsed(0);
    else if (s === "partial")
      setPointsUsed(Math.min(maxPoints, Math.max(10, Math.round(maxPoints / 2))));
    else setPointsUsed(maxPoints);
  };
  const pct = maxPoints > 0 ? (pointsUsed / maxPoints) * 100 : 0;
  const lines: { label: string; price: number }[] = [
    {
      label: `Билет ${wagon.className} × ${passengers.length}`,
      price: totals.ticketSum,
    },
  ];
  if (services.food && foodMenu && foodMenu.price > 0) {
    lines.push({
      label: `Питание «${foodMenu.title}» × ${passengers.length}`,
      price: foodMenu.price * passengers.length,
    });
  }
  if (services.luggage > 0) {
    lines.push({ label: `Багаж × ${services.luggage}`, price: services.luggage * 350 });
  }
  if (services.pet > 0) {
    lines.push({ label: `Провоз животного × ${services.pet}`, price: services.pet * 900 });
  }
  if (services.lounge) {
    lines.push({
      label: `Бизнес-зал × ${passengers.length}`,
      price: 1200 * passengers.length,
    });
  }

  return (
    <div className="mt-4">
      <SectionTitle>Проверьте заказ</SectionTitle>

      <div className="px-5 space-y-3">
        {/* passengers + seats */}
        <Card className="p-4 fade-up">
          <div className="flex items-center gap-2 mb-3">
            <IconUsers className="w-5 h-5 text-rzd" />
            <p className="font-bold text-ink text-[14px]">Пассажиры и места</p>
          </div>
          <div className="space-y-2.5">
            {passengers.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-rzd text-white text-[12px] font-bold flex items-center justify-center shrink-0">
                  {seats[i] ?? "—"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-ink text-[13.5px] truncate">
                    {fullName(p)}
                    {p.isSelf ? " (вы)" : ""}
                  </p>
                  <p className="text-[11px] text-ink-2">
                    Вагон {wagon.number} · {typeLabel(p.type)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* services chips */}
        <Card className="p-4 fade-up d-1">
          <p className="font-bold text-ink text-[14px] mb-3">Услуги</p>
          <div className="flex flex-wrap gap-2">
            {services.food && foodMenu && foodMenu.price > 0 && (
              <Chip icon={<IconFood className="w-3.5 h-3.5" />} text={foodMenu.title} />
            )}
            {services.luggage > 0 && (
              <Chip icon={<IconLuggage className="w-3.5 h-3.5" />} text={`Багаж ×${services.luggage}`} />
            )}
            {services.pet > 0 && (
              <Chip icon={<IconPet className="w-3.5 h-3.5" />} text={`Животное ×${services.pet}`} />
            )}
            {services.lounge && (
              <Chip icon={<IconLounge className="w-3.5 h-3.5" />} text="Бизнес-зал" />
            )}
            {!services.food && !services.luggage && !services.pet && !services.lounge && (
              <p className="text-[13px] text-ink-2">Дополнительные услуги не выбраны</p>
            )}
          </div>
        </Card>

        {/* price breakdown */}
        <Card className="p-4 fade-up d-2">
          <p className="font-bold text-ink text-[14px] mb-3">Детализация</p>
          <div className="space-y-2">
            {lines.map((l) => (
              <div key={l.label} className="flex items-center justify-between text-[13px]">
                <span className="text-ink-2">{l.label}</span>
                <span className="font-semibold text-ink">{l.price.toLocaleString("ru-RU")} ₽</span>
              </div>
            ))}
            <div className="pt-2 mt-1 border-t border-dashed border-black/10 flex items-center justify-between">
              <span className="font-bold text-ink text-[15px]">Итого</span>
              <span className="font-bold text-rzd text-[18px]">{totals.total.toLocaleString("ru-RU")} ₽</span>
            </div>
          </div>
        </Card>

        {/* pay with bonus points */}
        <Card className="p-4 fade-up d-3 overflow-hidden relative">
          <div className="absolute -right-8 -top-10 w-32 h-32 rounded-full bg-amber-400/15 blur-xl" />
          <div className="flex items-center gap-3 relative">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center shrink-0">
              <IconStar className="w-5 h-5" filled />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-ink text-[14px]">Оплата баллами РЖД Бонус</p>
              <p className="text-[12px] text-ink-2">
                Доступно {user.points.toLocaleString("ru-RU")} · 1 балл = 1 ₽
              </p>
            </div>
            <span
              className={`shrink-0 text-[11px] font-bold px-2 py-1 rounded-lg transition-colors ${
                pointsUsed > 0 ? "bg-amber-100 text-amber-700" : "bg-surface text-ink-2"
              }`}
            >
              −{pointsUsed.toLocaleString("ru-RU")} ₽
            </span>
          </div>

          {/* segmented control */}
          <div className="relative mt-3.5 grid grid-cols-3 gap-1 bg-surface rounded-xl p-1">
            {(
              [
                ["none", "Не использовать"],
                ["partial", "Частично"],
                ["full", "Полностью"],
              ] as const
            ).map(([v, label]) => (
              <button
                key={v}
                onClick={() => setSegment(v)}
                className={`tap h-9 rounded-lg text-[12px] font-bold transition-colors ${
                  segment === v ? "bg-rzd text-white shadow-md shadow-rzd/25" : "text-ink-2"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {segment !== "none" && (
            <div className="relative mt-4 fade-up">
              <div className="flex items-baseline justify-between mb-2.5">
                <p className="text-[12px] text-ink-2">Списать баллы</p>
                <p className="font-bold text-ink text-[16px]">
                  {pointsUsed.toLocaleString("ru-RU")}{" "}
                  <span className="text-[12px] text-ink-2 font-semibold">
                    из {maxPoints.toLocaleString("ru-RU")}
                  </span>
                </p>
              </div>
              <input
                type="range"
                className="bonus-slider"
                min={0}
                max={maxPoints}
                step={10}
                value={pointsUsed}
                onChange={(e) => setPointsUsed(Number(e.target.value))}
                style={{
                  background: `linear-gradient(to right, #f59e0b ${pct}%, #f4f4f6 ${pct}%)`,
                }}
                aria-label="Оплата баллами"
              />
              <div className="flex gap-2 mt-3">
                {(
                  [
                    ["25%", 0.25],
                    ["50%", 0.5],
                    ["75%", 0.75],
                    ["Максимум", 1],
                  ] as const
                ).map(([l, f]) => (
                  <button
                    key={l}
                    onClick={() => setPointsUsed(Math.round(maxPoints * f))}
                    className={`tap flex-1 h-8 rounded-lg text-[11px] font-bold transition-colors ${
                      pointsUsed === Math.round(maxPoints * f)
                        ? "bg-amber-100 text-amber-700"
                        : "bg-surface text-ink-2"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between rounded-xl bg-surface px-3.5 py-2.5">
                <span className="text-[12px] text-ink-2">
                  {cash > 0 ? "Останется оплатить картой" : "Оплата полностью баллами 🎉"}
                </span>
                <span className={`font-bold text-[15px] ${cash > 0 ? "text-rzd" : "text-emerald-600"}`}>
                  {cash.toLocaleString("ru-RU")} ₽
                </span>
              </div>
              {user.points < totals.total && segment === "full" && (
                <p className="mt-2 text-[11.5px] text-amber-700 bg-amber-50 rounded-lg px-3 py-2 leading-snug">
                  Баллов не хватает на полную оплату — спишем максимум, остаток{" "}
                  {cash.toLocaleString("ru-RU")} ₽ уйдёт на выбранную карту.
                </p>
              )}
            </div>
          )}
        </Card>

        {/* payment method */}
        <div className={`mt-3 fade-up d-4 transition-opacity ${cash === 0 ? "opacity-40 pointer-events-none" : ""}`}>
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="font-bold text-ink text-[14px]">Способ оплаты</p>
              {cash === 0 && (
                <span className="text-[11px] font-semibold text-ink-2">не требуется</span>
              )}
            </div>
            <div className="space-y-2">
              {paymentMethods.map((pm) => {
                const active = payMethodId === pm.id;
                return (
                  <button
                    key={pm.id}
                    onClick={() => setPayMethodId(pm.id)}
                    className={`tap w-full p-3 rounded-xl flex items-center gap-3 border-[1.5px] transition-colors ${
                      active ? "border-rzd bg-rzd-light/60" : "border-transparent bg-surface"
                    }`}
                  >
                    {pm.kind === "sbp" ? (
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5b3fd4] to-[#8a5cf6] text-white flex items-center justify-center shadow-sm">
                        <IconLightning className="w-5 h-5" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                        <IconCard className="w-5 h-5 text-ink" />
                      </div>
                    )}
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-ink text-[13.5px] flex items-center gap-2">
                        {pm.title}
                        <span className="text-[9px] font-black tracking-wider text-ink-2 bg-white px-1.5 py-0.5 rounded border border-black/8">
                          {pm.badge}
                        </span>
                      </p>
                      <p className="text-[11.5px] text-ink-2">{pm.subtitle}</p>
                    </div>
                    <span
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
                        active ? "border-rzd" : "border-black/20"
                      }`}
                    >
                      {active && <span className="w-2.5 h-2.5 rounded-full bg-rzd" />}
                    </span>
                  </button>
                );
              })}
            </div>
            {cash > 0 && (
              <p className="mt-3 text-[12px] text-ink-2">
                К списанию: <span className="font-bold text-ink">{cash.toLocaleString("ru-RU")} ₽</span>
              </p>
            )}
          </Card>
        </div>

        {/* earned bonus */}
        <Card className="p-4 flex items-center gap-3 !bg-amber-50 border border-amber-200/60 fade-up d-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center shrink-0">
            <IconStar className="w-5 h-5" filled />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-ink text-[14px]">
              {earned > 0 ? `+${earned} баллов РЖД Бонус` : "Баллы не начисляются"}
            </p>
            <p className="text-[12px] text-ink-2">
              {earned > 0
                ? `За оплату картой · на счёт ···${user.cardNumber.slice(-4)} после поездки`
                : "Оплата полностью баллами — премиальный билет"}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Chip({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-ink bg-surface px-2.5 py-1.5 rounded-lg">
      <span className="text-rzd">{icon}</span>
      {text}
    </span>
  );
}

/* ═══════════════════ ЭКРАН · ЭЛЕКТРОННЫЙ БИЛЕТ ═══════════════════ */
function QRCode() {
  const n = 17;
  const cells = useMemo(() => {
    let s = 20260227;
    const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    return Array.from({ length: n * n }, () => rnd() > 0.5);
  }, []);
  const inFinder = (r: number, c: number) =>
    (r < 7 && c < 7) || (r < 7 && c >= n - 7) || (r >= n - 7 && c < 7);
  return (
    <div className="relative w-36 h-36 mx-auto">
      <div
        className="grid w-full h-full gap-[2px]"
        style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}
      >
        {cells.map((v, i) => {
          const r = Math.floor(i / n);
          const c = i % n;
          return <div key={i} className={v && !inFinder(r, c) ? "bg-ink rounded-[1px]" : ""} />;
        })}
      </div>
      {["top-0 left-0", "top-0 right-0", "bottom-0 left-0"].map((pos) => (
        <div key={pos} className={`absolute ${pos} w-[32%] h-[32%] border-[3px] border-ink bg-white`}>
          <div className="absolute inset-[24%] bg-ink" />
        </div>
      ))}
    </div>
  );
}

const BRAND_TITLE: Record<string, string> = {
  sapsan: "Скоростной",
  lastochka: "Скоростной",
  firm: "Фирменный",
  classic: "Пассажирский",
};

export function TicketScreen() {
  const nav = useNav();
  const { booking } = useBooking();
  const [toast, setToast] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(false), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  const train = booking.selectedTrain;
  const classIdx = Math.min(
    Math.max(parseInt(booking.wagonId.split("-c")[1] ?? "0", 10) || 0, 0),
    train.classes.length - 1,
  );
  const boughtClass = train.classes[classIdx] ?? train.classes[0];
  const wagonNumber =
    train.brand === "sapsan" ? [5, 7, 9][classIdx] ?? classIdx + 1 :
    train.brand === "lastochka" ? [1, 2, 3][classIdx] ?? classIdx + 1 :
    [3, 5, 7][classIdx] ?? classIdx + 1;
  const stops = getStops(train);
  const routeKm = stops[stops.length - 1]?.km;

  const foodMenu = foodMenus.find((m) => m.id === booking.services.foodMenuId);
  const extras: string[] = [];
  if (booking.services.food && foodMenu && foodMenu.price > 0) extras.push(foodMenu.title);
  if (booking.services.luggage > 0) extras.push(`Багаж ×${booking.services.luggage}`);
  if (booking.services.pet > 0) extras.push(`Животное ×${booking.services.pet}`);
  if (booking.services.lounge) extras.push("Бизнес-зал");

  return (
    <div className="relative h-full flex flex-col bg-surface">
      <div className="bg-white shrink-0 border-b border-black/5">
        <StatusBar />
        <Header
          title="Электронный билет"
          subtitle={`${train.name} · ${train.number} · ${booking.searchDate}`}
        />
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-4">
        {/* status row */}
        <div className="px-5 mt-4 flex items-center gap-2 fade-up">
          <span className="inline-flex items-center gap-1.5 text-[12px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg">
            <IconCheck className="w-3.5 h-3.5" /> Действителен
          </span>
          <span className="text-[12px] font-semibold text-ink-2 bg-white px-2.5 py-1.5 rounded-lg">
            {booking.searchDate}
          </span>
          <span className="ml-auto text-[12px] font-semibold text-ink-2">
            {booking.passengers.length}{" "}
            {booking.passengers.length === 1 ? "пассажир" : booking.passengers.length < 5 ? "пассажира" : "пассажиров"}
          </span>
        </div>

        {/* ticket card */}
        <div className="px-5 mt-3 fade-up d-1">
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-rzd to-rzd-dark px-4 py-2.5 flex items-center justify-between">
              <p className="text-white text-[13px] font-bold">
                {train.name} · {train.number}
              </p>
              <p className="text-white/75 text-[11px] font-semibold">{BRAND_TITLE[train.brand]}</p>
            </div>
            <div className="p-4">
              {/* route */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[24px] font-bold text-ink leading-none">{train.depart}</p>
                  <p className="text-[12px] text-ink-2 mt-1 max-w-[88px] truncate">{booking.searchFrom}</p>
                </div>
                <div className="flex-1 px-3 flex flex-col items-center">
                  <p className="text-[11px] text-ink-2 mb-1">{train.duration}</p>
                  <div className="w-full flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-rzd" />
                    <div className="flex-1 border-t-2 border-dashed border-rzd/40" />
                    <IconTrain className="w-4.5 h-4.5 text-rzd train-anim" />
                    <div className="flex-1 border-t-2 border-dashed border-rzd/40" />
                    <div className="w-2 h-2 rounded-full border-2 border-rzd" />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[24px] font-bold text-ink leading-none">{train.arrive}</p>
                  <p className="text-[12px] text-ink-2 mt-1 max-w-[88px] truncate ml-auto">{booking.searchTo}</p>
                </div>
              </div>

              {/* qr */}
              <div className="mt-5 pt-4 border-t border-dashed border-black/10">
                <QRCode />
                <p className="text-center text-[11.5px] text-ink-2 mt-3">
                  Покажите QR-код проводнику при посадке
                </p>
              </div>

              {/* seats */}
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                {[
                  ["Вагон", String(wagonNumber)],
                  ["Места", booking.seats.filter(Boolean).join(", ") || "—"],
                  ["Класс", boughtClass.classCode],
                ].map(([k, v]) => (
                  <div key={k} className="bg-surface rounded-xl py-2 px-1">
                    <p className="text-[11px] text-ink-2">{k}</p>
                    <p className="font-bold text-ink text-[14px] truncate">{v}</p>
                  </div>
                ))}
              </div>

              {/* passengers */}
              <div className="mt-4 space-y-2">
                {booking.passengers.map((p, i) => (
                  <div key={p.id} className="flex items-center justify-between">
                    <p className="text-[13px] font-semibold text-ink truncate">
                      {fullName(p)}
                      {p.isSelf ? " (вы)" : ""}
                    </p>
                    <span className="text-[11.5px] font-bold text-rzd bg-rzd-light px-2 py-0.5 rounded-md shrink-0 ml-2">
                      место {booking.seats[i] ?? "—"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* portal entry */}
        <div className="px-5 mt-3.5 fade-up d-2">
          <button
            onClick={() => nav.push("portal")}
            className="tap w-full rounded-2xl overflow-hidden text-left shadow-lg shadow-[#0d1b3e]/30"
          >
            <div className="relative bg-gradient-to-r from-[#0d1b3e] via-[#14335f] to-[#175460] p-4 flex items-center gap-3.5">
              <div className="absolute -right-6 -top-10 w-32 h-32 rounded-full bg-sky-400/15 blur-2xl" />
              <div className="w-11 h-11 rounded-xl bg-white/12 text-white flex items-center justify-center shrink-0 relative">
                <IconWifi className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#14335f] pulse-dot" />
              </div>
              <div className="flex-1 min-w-0 relative">
                <p className="text-white font-bold text-[14.5px] flex items-center gap-2">
                  Попутчик
                  <span className="text-[9px] font-black bg-emerald-400/20 text-emerald-300 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                    Wi-Fi в поезде
                  </span>
                </p>
                <p className="text-white/65 text-[12px] leading-snug mt-0.5">
                  Кино, музыка, книги и еда к месту — бесплатно
                </p>
              </div>
              <IconChevronRight className="w-5 h-5 text-white/45 shrink-0 relative" />
            </div>
          </button>
        </div>

        {/* route with stops */}
        <div className="px-5 mt-3.5 fade-up d-3">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <p className="font-bold text-ink text-[14px]">Маршрут поезда</p>
              <span className="text-[11px] font-semibold text-ink-2">
                {routeKm != null ? `${routeKm} км · ` : ""}
                {stops.length - 2}{" "}
                {stops.length - 2 === 1 ? "остановка" : stops.length - 2 < 5 ? "остановки" : "остановок"}
              </span>
            </div>
            <p className="text-[11.5px] text-ink-2 mt-0.5 mb-4">
              {train.name} · {train.number} · в пути {train.duration}
            </p>
            <div>
              {(() => {
                let day = 0;
                let lastMin = -1;
                return stops.map((s, i) => {
                  const first = i === 0;
                  const lastStop = i === stops.length - 1;
                  const t = s.dep ?? s.arr ?? "00:00";
                  const m = timeToMin(t);
                  if (m < lastMin) day += 1;
                  lastMin = m;
                  const d = day;
                  return (
                    <div key={s.station + i} className="flex gap-3">
                      <div className="w-[88px] shrink-0 text-right pt-0.5">
                        <p className="text-[12.5px] font-bold text-ink tabular-nums leading-tight">
                          {first ? s.dep : lastStop ? s.arr : `${s.arr}–${s.dep}`}
                          {d > 0 && <span className="text-[9px] text-rzd align-top font-black"> +{d}</span>}
                        </p>
                        {!first && !lastStop && (
                          <p className="text-[10px] text-ink-2 mt-0.5">стоянка {s.stopMin} мин</p>
                        )}
                      </div>
                      <div className="flex flex-col items-center shrink-0">
                        <div
                          className={
                            first
                              ? "w-3 h-3 rounded-full bg-rzd mt-1 shadow-[0_0_0_3px_rgba(226,26,26,0.15)]"
                              : lastStop
                              ? "w-3 h-3 rounded-full border-[2.5px] border-rzd bg-white mt-1"
                              : "w-2.5 h-2.5 rounded-full bg-white border-2 border-rzd/35 mt-1.5"
                          }
                        />
                        {!lastStop && <div className="w-[2px] flex-1 bg-rzd/15 my-1 rounded-full" />}
                      </div>
                      <div className={`flex-1 min-w-0 ${lastStop ? "" : "pb-4"}`}>
                        <p className="font-semibold text-ink text-[13.5px] leading-tight flex items-center gap-1.5 flex-wrap">
                          {s.station}
                          {first && (
                            <span className="text-[9px] font-black text-white bg-rzd px-1.5 py-0.5 rounded-md uppercase tracking-wide">
                              Посадка
                            </span>
                          )}
                          {lastStop && (
                            <span className="text-[9px] font-black text-white bg-emerald-600 px-1.5 py-0.5 rounded-md uppercase tracking-wide">
                              Прибытие
                            </span>
                          )}
                        </p>
                        {s.km != null && s.km > 0 && (
                          <p className="text-[10.5px] text-ink-2 mt-0.5">{s.km} км пути</p>
                        )}
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </Card>
        </div>

        {/* trip details */}
        <div className="px-5 mt-3.5 fade-up d-4">
          <Card className="p-4">
            <p className="font-bold text-ink text-[14px] mb-2.5">Детали поездки</p>
            <div className="space-y-1.5 text-[12.5px]">
              <div className="flex justify-between gap-3">
                <span className="text-ink-2 shrink-0">Отправление</span>
                <span className="font-semibold text-ink text-right">{train.stationFrom || booking.searchFrom}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-ink-2 shrink-0">Прибытие</span>
                <span className="font-semibold text-ink text-right">{train.stationTo || booking.searchTo}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-ink-2 shrink-0">Оплачено</span>
                <span className="font-semibold text-ink text-right">
                  {booking.total.toLocaleString("ru-RU")} ₽
                  {booking.pointsUsed > 0 && (
                    <span className="text-amber-600"> · баллами −{booking.pointsUsed.toLocaleString("ru-RU")}</span>
                  )}
                </span>
              </div>
            </div>
            {extras.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-dashed border-black/10">
                {extras.map((e) => (
                  <span key={e} className="text-[11px] font-semibold text-ink bg-surface px-2 py-1 rounded-lg">
                    {e}
                  </span>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* actions */}
        <div className="px-5 mt-4 space-y-2.5 fade-up d-5">
          <PrimaryButton onClick={() => nav.pop()}>Мои поездки</PrimaryButton>
          <button
            onClick={() => setToast(true)}
            className="tap w-full h-[52px] rounded-2xl font-semibold text-[15px] text-rzd border-[1.5px] border-rzd/50"
          >
            Оформить возврат
          </button>
          <p className="text-center text-[11px] text-ink-2">
            100% стоимости — при возврате за 8+ часов до отправления
          </p>
        </div>
      </div>

      <Toast show={toast} text="Заявка на возврат создана" />
    </div>
  );
}

/* ═══════════════════ ЭКРАН · БИЛЕТ ОФОРМЛЕН ═══════════════════ */
export function SuccessScreen() {
  const nav = useNav();
  const { booking } = useBooking();
  const train = booking.selectedTrain;
  const classIdx = Math.min(
    Math.max(parseInt(booking.wagonId.split("-c")[1] ?? "0", 10) || 0, 0),
    train.classes.length - 1,
  );
  const boughtClass = train.classes[classIdx] ?? train.classes[0];
  const wagonNumber =
    train.brand === "sapsan" ? [5, 7, 9][classIdx] ?? classIdx + 1 :
    train.brand === "lastochka" ? [1, 2, 3][classIdx] ?? classIdx + 1 :
    [3, 5, 7][classIdx] ?? classIdx + 1;
  const paxCount = booking.passengers.length;
  const cashPaid = booking.total - booking.pointsUsed;
  const pm = paymentMethods.find((m) => m.id === booking.payMethodId);
  const foodMenu = foodMenus.find((m) => m.id === booking.services.foodMenuId);
  const extras: string[] = [];
  if (booking.services.food && foodMenu && foodMenu.price > 0) extras.push(foodMenu.title);
  if (booking.services.luggage > 0) extras.push(`Багаж ×${booking.services.luggage}`);
  if (booking.services.pet > 0) extras.push(`Животное ×${booking.services.pet}`);
  if (booking.services.lounge) extras.push("Бизнес-зал");

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-rzd to-rzd-darker">
      <StatusBar light />
      <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col items-center px-6 pt-6">
        <div className="pop-in w-20 h-20 rounded-full bg-white/15 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
            <IconCheck className="w-8 h-8 text-rzd" />
          </div>
        </div>
        <h1 className="fade-up d-1 text-white text-[24px] font-bold mt-5">
          {paxCount > 1 ? "Билеты оформлены!" : "Билет оформлен!"}
        </h1>
        <p className="fade-up d-2 text-white/70 text-[13.5px] mt-1 text-center">
          {paxCount > 1
            ? `${paxCount} электронных билета отправлены на почту`
            : "Электронный билет отправлен на почту"}
          <br />и доступны в разделе «Мои поездки»
        </p>

        {/* ticket */}
        <div className="fade-up d-3 w-full mt-6 bg-white rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-rzd bg-rzd-light px-2.5 py-1 rounded-lg">
                {train.name.toUpperCase()} · {train.number}
              </span>
              <span className="text-[12px] text-ink-2">{booking.searchDate}</span>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-[26px] font-bold text-ink leading-none">{train.depart}</p>
                <p className="text-[13px] text-ink-2 mt-1 max-w-[80px] truncate">{booking.searchFrom}</p>
              </div>
              <div className="flex flex-col items-center px-2">
                <IconTrain className="w-6 h-6 text-rzd train-anim" />
                <p className="text-[10.5px] text-ink-2 mt-1">{train.duration}</p>
              </div>
              <div className="text-right">
                <p className="text-[26px] font-bold text-ink leading-none">{train.arrive}</p>
                <p className="text-[13px] text-ink-2 mt-1 max-w-[80px] truncate ml-auto">{booking.searchTo}</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              {[
                ["Вагон", String(wagonNumber)],
                ["Места", booking.seats.filter(Boolean).join(", ") || "—"],
                ["Класс", boughtClass.classCode],
              ].map(([k, v]) => (
                <div key={k} className="bg-surface rounded-xl py-2 px-1">
                  <p className="text-[11px] text-ink-2">{k}</p>
                  <p className="font-bold text-ink text-[14px] truncate">{v}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex items-center">
            <div className="absolute -left-3 w-6 h-6 rounded-full bg-rzd-dark" />
            <div className="flex-1 border-t-2 border-dashed border-black/10 mx-4" />
            <div className="absolute -right-3 w-6 h-6 rounded-full bg-rzd-dark" />
          </div>

          <div className="p-5 pt-4">
            <p className="text-[11px] text-ink-2 mb-2">
              {paxCount > 1 ? "Пассажиры" : "Пассажир"}
            </p>
            <div className="space-y-2">
              {booking.passengers.map((p, i) => (
                <div key={p.id} className="flex items-center justify-between">
                  <p className="text-[13.5px] font-bold text-ink truncate">
                    {fullName(p)}
                    {p.isSelf ? " (вы)" : ""}
                  </p>
                  <span className="text-[12px] font-semibold text-rzd bg-rzd-light px-2 py-0.5 rounded-md shrink-0 ml-2">
                    {booking.seats[i] ?? "—"}
                  </span>
                </div>
              ))}
            </div>

            {extras.length > 0 && (
              <div className="mt-3 pt-3 border-t border-dashed border-black/10">
                <p className="text-[11px] text-ink-2 mb-1.5">Услуги</p>
                <div className="flex flex-wrap gap-1.5">
                  {extras.map((e) => (
                    <span
                      key={e}
                      className="text-[11px] font-semibold text-ink bg-surface px-2 py-1 rounded-lg"
                    >
                      {e}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-3 pt-3 border-t border-dashed border-black/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[12px] text-ink-2">Оплачено</p>
                  <p className="text-[18px] font-bold text-ink">
                    {booking.total.toLocaleString("ru-RU")} ₽
                  </p>
                </div>
                <div className="text-right">
                  {booking.bonus > 0 ? (
                    <p className="text-[11px] text-amber-600 font-semibold flex items-center gap-1 justify-end">
                      <IconStar className="w-3.5 h-3.5" filled />+{booking.bonus} баллов
                    </p>
                  ) : (
                    <p className="text-[11px] text-ink-2">премиальный билет</p>
                  )}
                  <div className="flex gap-[2.5px] h-10 items-stretch mt-1.5 justify-end" aria-hidden>
                    {[3, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 2, 1, 3, 1, 2, 1].map((w, i) => (
                      <div key={i} className="bg-ink rounded-[1px]" style={{ width: w * 1.4 }} />
                    ))}
                  </div>
                </div>
              </div>

              {/* payment breakdown */}
              <div className="mt-2.5 space-y-1.5">
                {booking.pointsUsed > 0 && (
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-ink-2 flex items-center gap-1.5">
                      <IconStar className="w-3.5 h-3.5 text-amber-500" filled />
                      Баллами РЖД Бонус
                    </span>
                    <span className="font-bold text-amber-600">
                      −{booking.pointsUsed.toLocaleString("ru-RU")} ₽
                    </span>
                  </div>
                )}
                {cashPaid > 0 && (
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="text-ink-2">{pm ? pm.title : "Карта"}</span>
                    <span className="font-semibold text-ink">
                      {cashPaid.toLocaleString("ru-RU")} ₽
                    </span>
                  </div>
                )}
                {booking.pointsUsed === 0 && (
                  <p className="text-[12px] text-ink-2">
                    {booking.bonus > 0 ? "Оплачено картой полностью" : ""}
                  </p>
                )}
                {booking.pointsUsed > 0 && (
                  <div className="flex items-center justify-between text-[11px] text-ink-2 pt-1 border-t border-dashed border-black/8">
                    <span>Остаток на бонусном счёте</span>
                    <span className="font-semibold text-ink">
                      {(user.points - booking.pointsUsed).toLocaleString("ru-RU")} баллов
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {booking.services.lounge && (
          <div className="fade-up d-4 w-full mt-3 bg-white/15 rounded-2xl p-3.5 flex items-center gap-3">
            <IconLounge className="w-6 h-6 text-white shrink-0" />
            <div className="flex-1">
              <p className="text-white font-semibold text-[13px]">Проход в бизнес-зал открыт</p>
              <p className="text-white/70 text-[11.5px]">Ленинградский вокзал · покажите QR на входе</p>
            </div>
            <IconChevronRight className="w-5 h-5 text-white/50" />
          </div>
        )}

        <div className="w-full mt-6 mb-4 space-y-2.5">
          <div className="fade-up d-5">
            <PrimaryButton variant="white" onClick={() => nav.reset("trips")}>
              Перейти к моим поездкам
            </PrimaryButton>
          </div>
          <div className="fade-up d-6">
            <button
              onClick={() => nav.reset("home")}
              className="tap w-full h-[52px] rounded-2xl font-semibold text-[15px] text-white/90 border-[1.5px] border-white/40"
            >
              На главную
            </button>
          </div>
        </div>
      </div>
      <div className="flex justify-center pt-2 pb-2">
        <div className="w-32 h-[5px] rounded-full bg-white/80" />
      </div>
    </div>
  );
}
