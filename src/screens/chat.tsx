import { useEffect, useRef, useState } from "react";
import { StatusBar, Header } from "../components/ui";
import { IconSend, IconStar } from "../components/icons";
import { user, support } from "../data";

type Msg = { id: number; from: "bot" | "user"; text: string; time: string };

const now = () =>
  new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });

const QUICK = [
  { label: "💳 Возврат билета", q: "Как вернуть билет?" },
  { label: "🐾 Провоз животных", q: "Можно ли ехать с животным?" },
  { label: "🛋 Бизнес-зал", q: "Расскажи про бизнес-зал" },
  { label: "⭐ Баллы", q: "Как начисляются баллы?" },
  { label: "🧳 Багаж", q: "Сколько стоит багаж?" },
  { label: "🙌 Оператор", q: "Позови оператора поддержки" },
];

const ANSWERS: { re: RegExp; reply: string }[] = [
  {
    re: /возврат|вернуть|сдать/,
    reply:
      "Вернуть билет легко 💳 Откройте «Мои поездки» → билет → «Вернуть». За 8+ часов до отправления вернём 100% стоимости, за 2–8 часов — 50%. Деньги вернутся на карту в течение 3–30 дней.",
  },
  {
    re: /животн|питом|кот|собак|пёс/,
    reply:
      "С питомцем — можно! 🐾 Мелкие животные до 10 кг едут в переноске (до 180 см по сумме измерений). Услуга — 900 ₽, добавляется в разделе «Услуги» при оформлении. Не забудьте ветпаспорт.",
  },
  {
    re: /багаж|чемодан|клади/,
    reply:
      "Бесплатно провезёте до 36 кг ручной клади 🧳 Дополнительное место багажа — 350 ₽ (до 30 кг). Оформляется в один клик при покупке билета.",
  },
  {
    re: /бизнес-зал|лаунж|зал/,
    reply:
      "Бизнес-зал ждёт! 🛋 Ленинградский вокзал, 2 этаж: напитки, снэки, Wi-Fi и тихая зона. 1 200 ₽ с человека, до 3 часов ожидания. Добавьте к билету в разделе «Услуги» — проход по QR-коду.",
  },
  {
    re: /балл|бонус/i,
    reply:
      "За поездки начисляем 12,5% от стоимости билета ⭐ Курс простой: 1 балл = 1 ₽. Оплачивайте баллами до 100% билета — полностью или частично. Ваш уровень «Золотой», до «Платины» всего 5 320 баллов!",
  },
  {
    re: /питан|еда|завтрак|обед|кофе|бистро/,
    reply:
      "В «Сапсане» есть вагон-бистро и доставка к месту 🍽 Кстати, ваш любимый «Завтрак + кофе» за 420 ₽ — добавить его к билету можно в разделе «Услуги».",
  },
  {
    re: /привет|здравств|добрый|хай|салют/i,
    reply:
      "И вам привет! 👋 Я Гриша — ваш проводник по приложению. Расскажу про билеты, багаж, бонусы и бизнес-залы быстрее кассира. Что подсказать?",
  },
  {
    re: /оператор|человек|поддержк|помогите|жалоб/,
    reply: `Передал ваш вопрос в службу поддержки 🙌 Среднее время ответа — 2 минуты. А пока — бесплатная линия ${support.phone} (24/7) или почта ${support.email}.`,
  },
  {
    re: /спасибо|благодар|круто|супер/,
    reply: "Всегда пожалуйста! Хорошей поездки 🚄❤️ Если что — я тут, на связи 24/7.",
  },
];

const DEFAULT_REPLY =
  "Хм, тут мне нужен совет старших коллег 🤔 Я отлично знаю темы: возврат билетов, багаж, животные, бизнес-залы и бонусы. Спросите про них — или позовите оператора.";

function answer(q: string): string {
  for (const a of ANSWERS) if (a.re.test(q)) return a.reply;
  return DEFAULT_REPLY;
}

export function ChatScreen() {
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      id: 1,
      from: "bot",
      text: `Здравствуйте, ${user.shortName}! 👋 Я Гриша — бот-помощник «РЖД Пассажирам». Отвечу на вопрос за секунду или позову оператора.`,
      time: now(),
    },
    {
      id: 2,
      from: "bot",
      text: "О чём расскажем сегодня?",
      time: now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const idRef = useRef(10);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = boxRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [msgs, typing]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t || typing) return;
    setMsgs((m) => [...m, { id: ++idRef.current, from: "user", text: t, time: now() }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { id: ++idRef.current, from: "bot", text: answer(t), time: now() }]);
    }, 950 + Math.random() * 500);
  };

  const hasUserMsg = msgs.some((m) => m.from === "user");

  return (
    <div className="h-full flex flex-col bg-surface">
      {/* header */}
      <div className="bg-white shrink-0 border-b border-black/5">
        <StatusBar />
        <Header
          title="Чат-бот Гриша"
          subtitle={
            typing ? "печатает…" : "онлайн · поддержка 24/7"
          }
          right={
            <div className="relative shrink-0">
              <img src="/images/grisha.png" alt="Гриша" className="w-11 h-11 rounded-2xl object-cover ring-2 ring-rzd-light" />
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
            </div>
          }
        />
      </div>

      {/* messages */}
      <div ref={boxRef} className="flex-1 overflow-y-auto no-scrollbar px-4 py-4 space-y-3">
        {msgs.map((m) => (
          <div key={m.id} className={`msg-in flex items-end gap-2 ${m.from === "user" ? "justify-end" : ""}`}>
            {m.from === "bot" && (
              <img src="/images/grisha.png" alt="" className="w-7 h-7 rounded-full object-cover shrink-0" />
            )}
            <div
              className={`max-w-[78%] px-3.5 py-2.5 shadow-sm ${
                m.from === "user"
                  ? "bg-rzd text-white rounded-2xl rounded-br-md"
                  : "bg-white text-ink rounded-2xl rounded-bl-md"
              }`}
            >
              <p className="text-[13.5px] leading-relaxed whitespace-pre-wrap">{m.text}</p>
              <p className={`text-[10px] mt-1 ${m.from === "user" ? "text-white/60" : "text-ink-2"}`}>{m.time}</p>
            </div>
          </div>
        ))}

        {typing && (
          <div className="msg-in flex items-end gap-2">
            <img src="/images/grisha.png" alt="" className="w-7 h-7 rounded-full object-cover shrink-0" />
            <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5 shadow-sm">
              {[0, 1, 2].map((i) => (
                <span key={i} className="typing-dot w-2 h-2 rounded-full bg-ink-2" />
              ))}
            </div>
          </div>
        )}

        {/* quick chips */}
        {!hasUserMsg && !typing && (
          <div className="flex flex-wrap gap-2 pt-1 msg-in">
            {QUICK.map((q) => (
              <button
                key={q.label}
                onClick={() => send(q.q)}
                className="tap px-3.5 h-9 rounded-full bg-rzd-light text-rzd text-[12.5px] font-semibold"
              >
                {q.label}
              </button>
            ))}
          </div>
        )}

        {/* bonus hint */}
        <div className="flex justify-center pt-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] text-ink-2 bg-white px-3 py-1.5 rounded-full shadow-sm">
            <IconStar className="w-3.5 h-3.5 text-amber-500" filled />
            {user.points.toLocaleString("ru-RU")} баллов · уровень «{user.level}»
          </span>
        </div>
      </div>

      {/* input */}
      <div className="shrink-0 bg-white border-t border-black/5 px-4 pt-2.5 pb-2">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(input)}
            placeholder="Спросить Гришу…"
            className="flex-1 h-11 px-4 rounded-full bg-surface text-[14px] text-ink outline-none focus:ring-2 focus:ring-rzd/25"
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || typing}
            className={`tap w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-colors ${
              input.trim() && !typing ? "bg-rzd text-white shadow-md shadow-rzd/30" : "bg-surface text-ink-2/40"
            }`}
            aria-label="Отправить"
          >
            <IconSend className="w-5 h-5" />
          </button>
        </div>
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-32 h-[5px] rounded-full bg-ink/80" />
        </div>
      </div>
    </div>
  );
}
