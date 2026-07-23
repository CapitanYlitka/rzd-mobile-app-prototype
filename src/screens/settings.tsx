import { useEffect, useState, type ReactNode } from "react";
import {
  StatusBar,
  Header,
  PrimaryButton,
  Card,
  SectionTitle,
  Toggle,
  Toast,
  useNav,
  useTheme,
  THEME_LABELS,
  type ThemeId,
} from "../components/ui";
import {
  IconUser,
  IconUsers,
  IconCard,
  IconPalette,
  IconBell,
  IconPhone,
  IconChevronRight,
  IconCheck,
  IconStar,
  IconPlus,
  IconTrash,
  IconMail,
} from "../components/icons";
import { user, savedPassengers, savedCards, support, type PassengerDraft, type BankCard } from "../data";

/* ── shared row ─────────────────────────────────── */
function SettingRow({
  icon,
  tint = "bg-rzd-light text-rzd",
  title,
  value,
  badge,
  onClick,
  delay,
}: {
  icon: ReactNode;
  tint?: string;
  title: string;
  value?: string;
  badge?: ReactNode;
  onClick?: () => void;
  delay?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`tap w-full px-4 py-3 flex items-center gap-3 text-left ${delay ? `fade-up ${delay}` : ""}`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${tint}`}>{icon}</div>
      <span className="flex-1 font-semibold text-ink text-[14.5px]">{title}</span>
      {badge}
      {value && <span className="text-[12.5px] text-ink-2">{value}</span>}
      <IconChevronRight className="w-4.5 h-4.5 text-ink-2/40 shrink-0" />
    </button>
  );
}

/* ═══════════════ ЭКРАН · НАСТРОЙКИ (ХАБ) ═══════════════ */
export function SettingsScreen() {
  const nav = useNav();
  const { theme } = useTheme();
  const [supportOpen, setSupportOpen] = useState(false);

  return (
    <div className="h-full flex flex-col bg-surface">
      <div className="bg-gradient-to-br from-rzd to-rzd-darker rounded-b-[28px] pb-5 shrink-0">
        <StatusBar light />
        <Header light title="Настройки" subtitle="Профиль и приложение" />
        <button onClick={() => nav.push("settings-profile")} className="tap w-full px-5 mt-2 fade-up">
          <div className="flex items-center gap-3.5">
            <img src={user.avatar} alt="" className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white/60" />
            <div className="flex-1 text-left min-w-0">
              <p className="text-white font-bold text-[16px] truncate">{user.name}</p>
              <p className="text-white/65 text-[12px]">+7 916 245-88-14 · a.smirnov@mail.ru</p>
              <span className="inline-flex items-center gap-1 mt-1.5 bg-white/15 rounded-lg px-2 py-0.5 text-[11px] font-semibold text-white">
                <IconStar className="w-3 h-3 text-amber-300" filled /> РЖД Бонус · {user.level}
              </span>
            </div>
            <IconChevronRight className="w-5 h-5 text-white/50 shrink-0" />
          </div>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-4">
        <div className="mt-5">
          <SectionTitle>Аккаунт</SectionTitle>
          <Card className="divide-y divide-black/5">
            <SettingRow icon={<IconUser className="w-5 h-5" />} title="Личные данные" delay="d-1" onClick={() => nav.push("settings-profile")} />
            <SettingRow
              icon={<IconUsers className="w-5 h-5" />}
              title="Попутчики"
              value={`${savedPassengers.length} чел.`}
              delay="d-2"
              onClick={() => nav.push("settings-passengers")}
            />
            <SettingRow
              icon={<IconCard className="w-5 h-5" />}
              title="Карты оплаты"
              value={`${savedCards.length} карты`}
              delay="d-3"
              onClick={() => nav.push("settings-cards")}
            />
          </Card>
        </div>

        <div className="mt-6">
          <SectionTitle>Приложение</SectionTitle>
          <Card className="divide-y divide-black/5">
            <SettingRow
              icon={<IconPalette className="w-5 h-5" />}
              tint="bg-violet-50 text-violet-500"
              title="Тема оформления"
              value={THEME_LABELS[theme]}
              delay="d-3"
              onClick={() => nav.push("settings-app")}
            />
            <SettingRow
              icon={<IconBell className="w-5 h-5" />}
              tint="bg-amber-50 text-amber-500"
              title="Уведомления"
              value="Вкл."
              delay="d-4"
              onClick={() => nav.push("settings-app")}
            />
          </Card>
        </div>

        <div className="mt-6">
          <SectionTitle>Помощь</SectionTitle>
          <Card className="divide-y divide-black/5">
            <button
              onClick={() => nav.push("chat")}
              className="tap w-full px-4 py-3 flex items-center gap-3 text-left fade-up d-5"
            >
              <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-rzd-light">
                <img src="/images/grisha.png" alt="Гриша" className="w-full h-full object-cover" />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-ink text-[14.5px]">Чат-бот Гриша</p>
                <p className="text-[12px] text-emerald-600 font-semibold">онлайн · ответит за секунду</p>
              </div>
              <IconChevronRight className="w-4.5 h-4.5 text-ink-2/40 shrink-0" />
            </button>

            <button
              onClick={() => setSupportOpen((v) => !v)}
              className="tap w-full px-4 py-3 flex items-center gap-3 text-left fade-up d-6"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <IconPhone className="w-5 h-5" />
              </div>
              <span className="flex-1 font-semibold text-ink text-[14.5px]">Служба поддержки</span>
              <IconChevronRight
                className={`w-4.5 h-4.5 text-ink-2/40 shrink-0 transition-transform ${supportOpen ? "rotate-90" : ""}`}
              />
            </button>
            {supportOpen && (
              <div className="px-4 pb-4 pt-1 fade-up">
                <p className="text-[12.5px] text-ink-2 leading-snug mb-3">{support.hours}</p>
                <div className="flex gap-2">
                  <a
                    href={support.phoneHref}
                    className="tap flex-1 h-11 rounded-xl bg-rzd text-white font-semibold text-[13.5px] flex items-center justify-center gap-2 shadow-md shadow-rzd/25"
                  >
                    <IconPhone className="w-4 h-4" /> {support.phone}
                  </a>
                  <a
                    href={`mailto:${support.email}`}
                    className="tap flex-1 h-11 rounded-xl border-[1.5px] border-rzd/40 text-rzd font-semibold text-[13.5px] flex items-center justify-center gap-2"
                  >
                    <IconMail className="w-4 h-4" /> Написать
                  </a>
                </div>
              </div>
            )}
          </Card>
        </div>

        <p className="text-center text-[11px] text-ink-2 mt-6">
          РЖД Пассажирам · версия 8.4.2
          <br />
          Прототип раздела Smart Profile
        </p>
      </div>
    </div>
  );
}

/* ── field input ────────────────────────────────── */
function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  readOnly,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  type?: string;
  readOnly?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[10.5px] font-semibold text-ink-2 uppercase tracking-wide">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        type={type}
        readOnly={readOnly}
        className={`mt-1 w-full h-11 px-3.5 rounded-xl bg-surface text-[14px] font-semibold text-ink outline-none focus:ring-2 focus:ring-rzd/30 ${
          readOnly ? "opacity-60" : ""
        }`}
      />
    </label>
  );
}

/* ═══════════════ ЛИЧНЫЕ ДАННЫЕ ═══════════════ */
export function ProfileSettingsScreen() {
  const [form, setForm] = useState({
    lastName: user.lastName,
    firstName: user.firstName,
    middleName: user.middleName,
    birthDate: user.birthDate,
    phone: "+7 916 245-88-14",
    email: "a.smirnov@mail.ru",
    document: "4510 123456",
  });
  const [toast, setToast] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(false), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="relative h-full flex flex-col bg-surface">
      <div className="bg-white shrink-0 border-b border-black/5">
        <StatusBar />
        <Header title="Личные данные" subtitle="Используются при покупке билетов" />
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar pb-4">
        <div className="flex flex-col items-center mt-5 fade-up">
          <div className="relative">
            <img src={user.avatar} alt="" className="w-20 h-20 rounded-3xl object-cover" />
            <span className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center">
              <IconStar className="w-3.5 h-3.5 text-white" filled />
            </span>
          </div>
          <button onClick={() => setToast(true)} className="tap mt-3 text-[13px] font-semibold text-rzd">
            Сменить фото
          </button>
        </div>

        <div className="px-5 mt-5">
          <Card className="p-4 space-y-3.5 fade-up d-1">
            <div className="grid grid-cols-2 gap-3">
              <Input label="Фамилия" value={form.lastName} onChange={set("lastName")} />
              <Input label="Имя" value={form.firstName} onChange={set("firstName")} />
            </div>
            <Input label="Отчество" value={form.middleName} onChange={set("middleName")} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Дата рождения" value={form.birthDate} onChange={set("birthDate")} placeholder="ДД.ММ.ГГГГ" />
              <Input label="Телефон" value={form.phone} onChange={set("phone")} type="tel" />
            </div>
            <Input label="Email" value={form.email} onChange={set("email")} type="email" />
          </Card>
        </div>

        <div className="px-5 mt-4">
          <Card className="p-4 space-y-3.5 fade-up d-2">
            <Input label="Документ · паспорт РФ" value={form.document} onChange={set("document")} placeholder="Серия и номер" />
            <Input label="Карта РЖД Бонус" value={user.cardNumber} readOnly />
            <p className="text-[11.5px] text-ink-2 leading-snug">
              Данные документа подставляются в билеты автоматически — проверьте совпадение с оригиналом.
            </p>
          </Card>
        </div>

        <div className="px-5 mt-5 fade-up d-3">
          <PrimaryButton onClick={() => setToast(true)}>
            <IconCheck className="w-5 h-5" /> Сохранить изменения
          </PrimaryButton>
        </div>
      </div>
      <Toast show={toast} text="Личные данные сохранены" />
    </div>
  );
}

/* ═══════════════ ПОПУТЧИКИ ═══════════════ */
export function PassengersSettingsScreen() {
  const [list, setList] = useState<PassengerDraft[]>(() => savedPassengers.map((p) => ({ ...p })));
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ lastName: "", firstName: "", birthDate: "", document: "", type: "adult" as PassengerDraft["type"] });
  const [toast, setToast] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(false), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const add = () => {
    if (!form.lastName || !form.firstName) return;
    setList((prev) => [
      ...prev,
      {
        id: `u-${Date.now()}`,
        isSelf: false,
        middleName: "",
        lastName: form.lastName,
        firstName: form.firstName,
        birthDate: form.birthDate,
        document: form.document,
        type: form.type,
      },
    ]);
    setForm({ lastName: "", firstName: "", birthDate: "", document: "", type: "adult" });
    setShowForm(false);
    setToast(true);
  };

  return (
    <div className="relative h-full flex flex-col bg-surface">
      <div className="bg-white shrink-0 border-b border-black/5">
        <StatusBar />
        <Header title="Попутчики" subtitle="Данные сохранятся для быстрой покупки" />
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar pb-4">
        <div className="px-5 mt-4 space-y-2.5">
          {list.map((p, i) => (
            <Card key={p.id} className={`p-4 flex items-center gap-3 pop-in d-${Math.min(i + 1, 6)}`}>
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 overflow-hidden ${p.isSelf ? "" : "bg-rzd-light text-rzd"}`}>
                {p.isSelf ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : <IconUser className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-ink text-[14px] truncate">
                  {[p.lastName, p.firstName, p.middleName].filter(Boolean).join(" ") || "Без имени"}
                  {p.isSelf ? " (вы)" : ""}
                </p>
                <p className="text-[12px] text-ink-2 truncate">
                  {p.type === "child" ? "Ребёнок" : p.type === "senior" ? "Льготный" : "Взрослый"}
                  {p.document ? ` · ${p.document}` : ""}
                </p>
              </div>
              {!p.isSelf && (
                <button
                  onClick={() => setList((prev) => prev.filter((x) => x.id !== p.id))}
                  className="tap w-9 h-9 rounded-xl bg-surface text-ink-2 flex items-center justify-center"
                  aria-label="Удалить"
                >
                  <IconTrash className="w-4 h-4" />
                </button>
              )}
            </Card>
          ))}
        </div>

        {showForm ? (
          <div className="px-5 mt-4 fade-up">
            <Card className="p-4 space-y-3">
              <p className="font-bold text-ink text-[14px]">Новый попутчик</p>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Фамилия" value={form.lastName} onChange={(v) => setForm((f) => ({ ...f, lastName: v }))} />
                <Input label="Имя" value={form.firstName} onChange={(v) => setForm((f) => ({ ...f, firstName: v }))} />
                <Input label="Дата рождения" value={form.birthDate} onChange={(v) => setForm((f) => ({ ...f, birthDate: v }))} placeholder="ДД.ММ.ГГГГ" />
                <Input label="Документ" value={form.document} onChange={(v) => setForm((f) => ({ ...f, document: v }))} placeholder="Серия номер" />
              </div>
              <div className="flex gap-2">
                {(["adult", "child", "senior"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setForm((f) => ({ ...f, type: t }))}
                    className={`tap flex-1 h-9 rounded-xl text-[12px] font-semibold ${form.type === t ? "bg-rzd text-white" : "bg-surface text-ink-2"}`}
                  >
                    {t === "child" ? "Ребёнок" : t === "senior" ? "Льготный" : "Взрослый"}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 pt-1">
                <PrimaryButton className={`!h-11 ${!form.lastName || !form.firstName ? "opacity-50 pointer-events-none" : ""}`} onClick={add}>
                  Добавить
                </PrimaryButton>
                <button onClick={() => setShowForm(false)} className="tap shrink-0 h-11 px-4 rounded-2xl bg-surface text-ink-2 font-semibold text-[13.5px]">
                  Отмена
                </button>
              </div>
            </Card>
          </div>
        ) : (
          <div className="px-5 mt-4">
            <button
              onClick={() => setShowForm(true)}
              className="tap w-full h-14 rounded-2xl border-2 border-dashed border-rzd/30 text-rzd font-semibold text-[14px] flex items-center justify-center gap-2 bg-rzd-light/40"
            >
              <IconPlus className="w-5 h-5" /> Добавить попутчика
            </button>
          </div>
        )}

        <p className="px-5 mt-5 text-[11.5px] text-ink-2 leading-snug">
          Добавляйте близких, чтобы оформлять билеты на всех за пару шагов — данные подставятся автоматически.
        </p>
      </div>
      <Toast show={toast} text="Попутчик добавлен" />
    </div>
  );
}

/* ═══════════════ КАРТЫ ОПЛАТЫ ═══════════════ */
export function CardsSettingsScreen() {
  const [cards, setCards] = useState<BankCard[]>(() => savedCards.map((c) => ({ ...c })));
  const [showForm, setShowForm] = useState(false);
  const [num, setNum] = useState("");
  const [expiry, setExpiry] = useState("");
  const [toast, setToast] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(false), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const formatNum = (v: string) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const formatExp = (v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
  };

  const addCard = () => {
    if (num.replace(/\s/g, "").length < 16 || expiry.length < 5) return;
    setCards((prev) => [
      ...prev,
      {
        id: `c-${Date.now()}`,
        brand: num.startsWith("4") ? "VISA" : "МИР",
        number: num,
        holder: `${user.lastName} ${user.firstName}`.toUpperCase(),
        expiry,
        primary: false,
        gradient: num.startsWith("4") ? "from-[#233348] to-[#4a6076]" : "from-[#0d4f6e] via-[#0d6e58] to-[#2aa17b]",
      },
    ]);
    setNum("");
    setExpiry("");
    setShowForm(false);
    setToast(true);
  };

  return (
    <div className="relative h-full flex flex-col bg-surface">
      <div className="bg-white shrink-0 border-b border-black/5">
        <StatusBar />
        <Header title="Карты оплаты" subtitle="Для быстрой оплаты билетов" />
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar pb-4">
        <div className="px-5 mt-4 space-y-3">
          {cards.map((c, i) => (
            <div key={c.id} className={`pop-in d-${Math.min(i + 1, 6)}`}>
              <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${c.gradient} p-4 text-white shadow-lg`}>
                <div className="absolute -right-8 -top-10 w-32 h-32 rounded-full bg-white/10 blur-xl" />
                <div className="flex items-center justify-between relative">
                  <div className="w-9 h-6.5 rounded-md bg-gradient-to-br from-amber-200 to-amber-500" />
                  <span className="text-[11px] font-black tracking-widest opacity-90">{c.brand}</span>
                </div>
                <p className="relative mt-4 font-mono text-[16px] tracking-[0.12em]">{c.number}</p>
                <div className="relative mt-3 flex items-end justify-between">
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-white/60">Держатель</p>
                    <p className="text-[12px] font-semibold tracking-wide">{c.holder}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] uppercase tracking-wider text-white/60">Срок</p>
                    <p className="text-[12px] font-semibold">{c.expiry}</p>
                  </div>
                  {c.primary && (
                    <span className="text-[10px] font-bold bg-white/25 px-2 py-1 rounded-lg uppercase tracking-wider">Основная</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                {!c.primary && (
                  <button
                    onClick={() => setCards((prev) => prev.map((x) => ({ ...x, primary: x.id === c.id })))}
                    className="tap flex-1 h-10 rounded-xl bg-white text-ink font-semibold text-[12.5px] shadow-sm"
                  >
                    Сделать основной
                  </button>
                )}
                <button
                  onClick={() => setCards((prev) => prev.filter((x) => x.id !== c.id))}
                  className={`tap h-10 px-3.5 rounded-xl flex items-center gap-1.5 text-[12.5px] font-semibold ${
                    c.primary ? "bg-surface text-ink-2/40 pointer-events-none" : "bg-white text-rzd shadow-sm"
                  }`}
                >
                  <IconTrash className="w-4 h-4" /> Удалить
                </button>
              </div>
            </div>
          ))}
        </div>

        {showForm && (
          <div className="px-5 mt-4 fade-up">
            <Card className="p-4 space-y-3">
              <p className="font-bold text-ink text-[14px]">Новая карта</p>
              <Input label="Номер карты" value={num} onChange={(v) => setNum(formatNum(v))} placeholder="0000 0000 0000 0000" />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Срок действия" value={expiry} onChange={(v) => setExpiry(formatExp(v))} placeholder="ММ/ГГ" />
                <Input label="CVV" value="" onChange={() => undefined} placeholder="•••" type="password" />
              </div>
              <div className="flex gap-2 pt-1">
                <PrimaryButton
                  className={`!h-11 ${num.replace(/\s/g, "").length < 16 || expiry.length < 5 ? "opacity-50 pointer-events-none" : ""}`}
                  onClick={addCard}
                >
                  Привязать карту
                </PrimaryButton>
                <button onClick={() => setShowForm(false)} className="tap shrink-0 h-11 px-4 rounded-2xl bg-surface text-ink-2 font-semibold text-[13.5px]">
                  Отмена
                </button>
              </div>
            </Card>
          </div>
        )}

        {!showForm && (
          <div className="px-5 mt-4">
            <button
              onClick={() => setShowForm(true)}
              className="tap w-full h-14 rounded-2xl border-2 border-dashed border-rzd/30 text-rzd font-semibold text-[14px] flex items-center justify-center gap-2 bg-rzd-light/40"
            >
              <IconPlus className="w-5 h-5" /> Добавить карту
            </button>
          </div>
        )}

        <p className="px-5 mt-5 text-[11.5px] text-ink-2 leading-snug flex items-start gap-1.5">
          <span className="shrink-0 mt-0.5">🔒</span>
          Данные карт хранятся в зашифрованном виде и защищены по стандарту PCI DSS. CVV не сохраняется.
        </p>
      </div>
      <Toast show={toast} text="Карта привязана" />
    </div>
  );
}

/* ═══════════════ НАСТРОЙКИ ПРИЛОЖЕНИЯ ═══════════════ */
const THEME_PREVIEWS: Record<ThemeId, { bg: string; card: string; ink: string }> = {
  light: { bg: "#f4f4f6", card: "#ffffff", ink: "#1c1c1e" },
  dark: { bg: "#16161a", card: "#1e1e24", ink: "#f1f1f4" },
  brand: { bg: "#f9ecec", card: "#ffffff", ink: "#1c1c1e" },
};

export function AppSettingsScreen() {
  const { theme, setTheme } = useTheme();
  const [prefs, setPrefs] = useState({ notify: true, faceId: true, autofill: true, sound: false });
  const [lang, setLang] = useState<"ru" | "en">("ru");

  return (
    <div className="h-full flex flex-col bg-surface">
      <div className="bg-white shrink-0 border-b border-black/5">
        <StatusBar />
        <Header title="Оформление" subtitle="Тема и поведение приложения" />
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar pb-4">
        <div className="mt-5">
          <SectionTitle>Тема приложения</SectionTitle>
          <div className="px-5 grid grid-cols-3 gap-2.5">
            {(Object.keys(THEME_LABELS) as ThemeId[]).map((t, i) => {
              const p = THEME_PREVIEWS[t];
              const active = theme === t;
              return (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`tap rounded-2xl p-2 border-[1.5px] transition-colors pop-in d-${i + 1} ${
                    active ? "border-rzd bg-rzd-light/50 shadow-md shadow-rzd/10" : "border-black/8 bg-white"
                  }`}
                >
                  <div className="rounded-xl overflow-hidden h-[72px]" style={{ background: p.bg }}>
                    <div className="h-5 bg-rzd" />
                    <div className="px-2 pt-2 space-y-1.5">
                      <div className="h-4 rounded-md shadow-sm" style={{ background: p.card }} />
                      <div className="flex gap-1.5">
                        <div className="h-4 flex-1 rounded-md" style={{ background: p.card }} />
                        <div className="h-4 flex-1 rounded-md" style={{ background: p.card }} />
                      </div>
                      <div className="h-1.5 w-8 rounded-full" style={{ background: p.ink, opacity: 0.25 }} />
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-1.5 mt-2">
                    <span className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${active ? "border-rzd" : "border-black/20"}`}>
                      {active && <span className="w-1.5 h-1.5 rounded-full bg-rzd" />}
                    </span>
                    <span className={`text-[11.5px] font-bold ${active ? "text-rzd" : "text-ink-2"}`}>{THEME_LABELS[t]}</span>
                  </div>
                </button>
              );
            })}
          </div>
          <p className="px-5 mt-3 text-[11.5px] text-ink-2">
            {theme === "dark"
              ? "Тёмная тема экономит заряд в ночных поездках 🌙"
              : theme === "brand"
              ? "Фирменная тема в стиле РЖД ❤️"
              : "Классический светлый интерфейс"}
          </p>
        </div>

        <div className="mt-6">
          <SectionTitle>Предпочтения</SectionTitle>
          <Card className="divide-y divide-black/5">
            {(
              [
                ["notify", "Уведомления о билетах", "Статус поездки, регистрация, возврат"],
                ["faceId", "Вход по Face ID", "Быстрый вход в приложение"],
                ["autofill", "Автозаполнение попутчиков", "Подставлять сохранённые данные"],
                ["sound", "Звук уведомлений", "Сигнал при изменении поездки"],
              ] as const
            ).map(([key, title, sub], i) => (
              <div key={key} className={`px-4 py-3 flex items-center gap-3 fade-up d-${i + 2}`}>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-ink text-[14px]">{title}</p>
                  <p className="text-[12px] text-ink-2">{sub}</p>
                </div>
                <Toggle on={prefs[key]} onChange={(v) => setPrefs((p) => ({ ...p, [key]: v }))} />
              </div>
            ))}
          </Card>
        </div>

        <div className="mt-6">
          <SectionTitle>Язык</SectionTitle>
          <div className="px-5">
            <Card className="p-1 grid grid-cols-2 gap-1 fade-up d-4">
              {(
                [
                  ["ru", "Русский"],
                  ["en", "English"],
                ] as const
              ).map(([v, label]) => (
                <button
                  key={v}
                  onClick={() => setLang(v)}
                  className={`tap h-10 rounded-xl text-[13px] font-bold transition-colors ${lang === v ? "bg-rzd text-white" : "text-ink-2"}`}
                >
                  {label}
                </button>
              ))}
            </Card>
          </div>
        </div>

        <p className="text-center text-[11px] text-ink-2 mt-6">РЖД Пассажирам · 8.4.2 · сборка 1204</p>
      </div>
    </div>
  );
}
