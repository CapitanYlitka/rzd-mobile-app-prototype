export const user = {
  name: "Алексей Смирнов",
  shortName: "Алексей",
  lastName: "Смирнов",
  firstName: "Алексей",
  middleName: "Игоревич",
  birthDate: "14.03.1992",
  document: "Паспорт · 4510 123456",
  level: "Золотой",
  levelProgress: 0.72,
  points: 24680,
  toNextLevel: 5320,
  cardNumber: "9002 4816 3357",
  avatar: "/images/avatar.jpg",
};

export type PassengerDraft = {
  id: string;
  isSelf: boolean;
  lastName: string;
  firstName: string;
  middleName: string;
  birthDate: string;
  document: string;
  type: "adult" | "child" | "senior";
};

export const savedPassengers: PassengerDraft[] = [
  {
    id: "self",
    isSelf: true,
    lastName: "Смирнов",
    firstName: "Алексей",
    middleName: "Игоревич",
    birthDate: "14.03.1992",
    document: "Паспорт · 4510 123456",
    type: "adult",
  },
  {
    id: "p2",
    isSelf: false,
    lastName: "Смирнова",
    firstName: "Мария",
    middleName: "Андреевна",
    birthDate: "22.07.1994",
    document: "Паспорт · 4511 654321",
    type: "adult",
  },
  {
    id: "p3",
    isSelf: false,
    lastName: "Смирнов",
    firstName: "Артём",
    middleName: "Алексеевич",
    birthDate: "05.11.2016",
    document: "Св-во · VI-МЮ 123456",
    type: "child",
  },
];

export type Wagon = {
  id: string;
  number: string;
  className: string;
  classCode: string;
  type: string;
  seatsFree: number;
  priceFrom: number;
  amenities: string[];
  popular?: boolean;
};

export const wagons: Wagon[] = [
  {
    id: "w5",
    number: "5",
    className: "Бизнес",
    classCode: "1Р",
    type: "Сидячий",
    seatsFree: 8,
    priceFrom: 6890,
    amenities: ["Питание", "Wi-Fi", "Розетка"],
  },
  {
    id: "w7",
    number: "7",
    className: "Эконом+",
    classCode: "2С",
    type: "Сидячий",
    seatsFree: 18,
    priceFrom: 3890,
    amenities: ["Wi-Fi", "Розетка"],
    popular: true,
  },
  {
    id: "w9",
    number: "9",
    className: "Эконом",
    classCode: "2В",
    type: "Сидячий",
    seatsFree: 24,
    priceFrom: 2990,
    amenities: ["Wi-Fi"],
  },
  {
    id: "w12",
    number: "12",
    className: "Семейный",
    classCode: "2Е",
    type: "Сидячий",
    seatsFree: 12,
    priceFrom: 3490,
    amenities: ["Wi-Fi", "Детское меню"],
  },
];

export type ExtraService = {
  id: "food" | "luggage" | "pet" | "lounge";
  title: string;
  subtitle: string;
  price: number;
  perPassenger?: boolean;
  unit?: string;
};

export const extraServices: ExtraService[] = [
  {
    id: "food",
    title: "Питание в поезде",
    subtitle: "Завтрак + кофе · ваш обычный выбор",
    price: 420,
    perPassenger: true,
  },
  {
    id: "luggage",
    title: "Дополнительный багаж",
    subtitle: "До 30 кг сверх нормы",
    price: 350,
    unit: "место",
  },
  {
    id: "pet",
    title: "Провоз животного",
    subtitle: "В контейнере · мелкие животные",
    price: 900,
    unit: "животное",
  },
  {
    id: "lounge",
    title: "Бизнес-зал вокзала",
    subtitle: "Ленинградский · до 3 часов ожидания",
    price: 1200,
    perPassenger: true,
  },
];

export const foodMenus = [
  { id: "breakfast", title: "Завтрак + кофе", price: 420, tag: "Часто берёте" },
  { id: "business", title: "Бизнес-ланч", price: 790, tag: "Хит" },
  { id: "kids", title: "Детское меню", price: 350, tag: "" },
  { id: "none", title: "Без питания", price: 0, tag: "" },
];

export type PaymentMethod = {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  kind: "card" | "sbp";
};

export const paymentMethods: PaymentMethod[] = [
  { id: "mir", title: "Мир ··· 4582", subtitle: "Основная карта", badge: "МИР", kind: "card" },
  { id: "visa", title: "Visa ··· 9021", subtitle: "Личная карта", badge: "VISA", kind: "card" },
  { id: "sbp", title: "СБП", subtitle: "Система быстрых платежей · без комиссии", badge: "СБП", kind: "sbp" },
];

export type BankCard = {
  id: string;
  brand: "МИР" | "VISA";
  number: string;
  holder: string;
  expiry: string;
  primary: boolean;
  gradient: string;
};

export const savedCards: BankCard[] = [
  {
    id: "c1",
    brand: "МИР",
    number: "2200 3800 4582 1145",
    holder: "ALEKSEI SMIRNOV",
    expiry: "09/28",
    primary: true,
    gradient: "from-[#0d4f6e] via-[#0d6e58] to-[#2aa17b]",
  },
  {
    id: "c2",
    brand: "VISA",
    number: "4276 1200 9021 7743",
    holder: "ALEKSEI SMIRNOV",
    expiry: "02/27",
    primary: false,
    gradient: "from-[#233348] to-[#4a6076]",
  },
];

export const support = {
  phone: "8 800 775-00-00",
  phoneHref: "tel:88007750000",
  email: "support@rzd.ru",
  hours: "Бесплатно по России · круглосуточно",
};

/* ── поезда по маршрутам ────────────────────────── */
export type TrainClass = {
  classCode: string;
  className: string;
  price: number;
  seatsFree: number;
};

export type Train = {
  id: string;
  number: string;
  name: string;
  brand: "sapsan" | "lastochka" | "firm" | "classic";
  depart: string;
  arrive: string;
  duration: string;
  durationMin: number;
  stationFrom: string;
  stationTo: string;
  features: string[];
  classes: TrainClass[];
};

export const TRAINS: Record<string, Train[]> = {
  spb: [
    {
      id: "spb-757",
      number: "757А",
      name: "Сапсан",
      brand: "sapsan",
      depart: "07:00",
      arrive: "10:45",
      duration: "3 ч 45 мин",
      durationMin: 225,
      stationFrom: "Ленинградский вокзал",
      stationTo: "Московский вокзал",
      features: ["Wi-Fi", "Розетки", "Вагон-бистро"],
      classes: [
        { classCode: "2С", className: "Эконом", price: 3890, seatsFree: 18 },
        { classCode: "2Е", className: "Эконом+", price: 4590, seatsFree: 12 },
        { classCode: "1Р", className: "Бизнес", price: 6890, seatsFree: 8 },
      ],
    },
    {
      id: "spb-762",
      number: "762А",
      name: "Сапсан",
      brand: "sapsan",
      depart: "09:40",
      arrive: "13:25",
      duration: "3 ч 45 мин",
      durationMin: 225,
      stationFrom: "Ленинградский вокзал",
      stationTo: "Московский вокзал",
      features: ["Wi-Fi", "Розетки", "Вагон-бистро"],
      classes: [
        { classCode: "2С", className: "Эконом", price: 4290, seatsFree: 14 },
        { classCode: "1Р", className: "Бизнес", price: 7490, seatsFree: 5 },
      ],
    },
    {
      id: "spb-716",
      number: "716А",
      name: "Сапсан",
      brand: "sapsan",
      depart: "15:40",
      arrive: "19:25",
      duration: "3 ч 45 мин",
      durationMin: 225,
      stationFrom: "Ленинградский вокзал",
      stationTo: "Московский вокзал",
      features: ["Wi-Fi", "Розетки"],
      classes: [
        { classCode: "2С", className: "Эконом", price: 3990, seatsFree: 6 },
        { classCode: "2Е", className: "Эконом+", price: 4690, seatsFree: 9 },
        { classCode: "1Р", className: "Бизнес", price: 7190, seatsFree: 4 },
      ],
    },
    {
      id: "spb-002",
      number: "002А",
      name: "Красная стрела",
      brand: "firm",
      depart: "23:55",
      arrive: "07:55",
      duration: "8 ч 00 мин",
      durationMin: 480,
      stationFrom: "Ленинградский вокзал",
      stationTo: "Московский вокзал",
      features: ["Ресторан", "Бельё включено", "Кондиционер"],
      classes: [
        { classCode: "3П", className: "Плацкарт", price: 2850, seatsFree: 12 },
        { classCode: "2К", className: "Купе", price: 4190, seatsFree: 9 },
        { classCode: "1С", className: "СВ", price: 9900, seatsFree: 2 },
      ],
    },
    {
      id: "spb-030",
      number: "030А",
      name: "Гранд Экспресс",
      brand: "firm",
      depart: "23:40",
      arrive: "08:05",
      duration: "8 ч 25 мин",
      durationMin: 505,
      stationFrom: "Ленинградский вокзал",
      stationTo: "Московский вокзал",
      features: ["Душ", "Завтрак", "Wi-Fi"],
      classes: [
        { classCode: "2К", className: "Купе", price: 5300, seatsFree: 7 },
        { classCode: "1Л", className: "Люкс", price: 12400, seatsFree: 2 },
      ],
    },
    {
      id: "spb-026",
      number: "026А",
      name: "Две столицы",
      brand: "firm",
      depart: "21:50",
      arrive: "06:30",
      duration: "8 ч 40 мин",
      durationMin: 520,
      stationFrom: "Ленинградский вокзал",
      stationTo: "Московский вокзал",
      features: ["Ресторан", "Кондиционер", "Розетки"],
      classes: [
        { classCode: "3П", className: "Плацкарт", price: 2650, seatsFree: 8 },
        { classCode: "2К", className: "Купе", price: 3990, seatsFree: 11 },
        { classCode: "1С", className: "СВ", price: 8400, seatsFree: 3 },
      ],
    },
  ],
  kzn: [
    {
      id: "kzn-002",
      number: "002Й",
      name: "Премиум",
      brand: "firm",
      depart: "20:08",
      arrive: "07:40",
      duration: "11 ч 32 мин",
      durationMin: 692,
      stationFrom: "Казанский вокзал",
      stationTo: "Казань-Пассажирская",
      features: ["Ресторан", "Кондиционер", "Розетки"],
      classes: [
        { classCode: "3П", className: "Плацкарт", price: 2980, seatsFree: 10 },
        { classCode: "2К", className: "Купе", price: 4480, seatsFree: 8 },
        { classCode: "1С", className: "СВ", price: 8900, seatsFree: 3 },
      ],
    },
    {
      id: "kzn-118",
      number: "118Й",
      name: "Скорый",
      brand: "classic",
      depart: "16:20",
      arrive: "05:35",
      duration: "13 ч 15 мин",
      durationMin: 795,
      stationFrom: "Казанский вокзал",
      stationTo: "Казань-Пассажирская",
      features: ["Кондиционер"],
      classes: [
        { classCode: "3П", className: "Плацкарт", price: 2540, seatsFree: 16 },
        { classCode: "2К", className: "Купе", price: 3990, seatsFree: 7 },
      ],
    },
    {
      id: "kzn-050",
      number: "050Й",
      name: "Татарстан",
      brand: "firm",
      depart: "22:10",
      arrive: "10:05",
      duration: "11 ч 55 мин",
      durationMin: 715,
      stationFrom: "Казанский вокзал",
      stationTo: "Казань-Пассажирская",
      features: ["Ресторан", "Wi-Fi", "Бельё включено"],
      classes: [
        { classCode: "3П", className: "Плацкарт", price: 2890, seatsFree: 9 },
        { classCode: "2К", className: "Купе", price: 4290, seatsFree: 10 },
        { classCode: "1С", className: "СВ", price: 8200, seatsFree: 4 },
      ],
    },
  ],
  nn: [
    {
      id: "nn-708",
      number: "708Н",
      name: "Ласточка",
      brand: "lastochka",
      depart: "06:35",
      arrive: "10:10",
      duration: "3 ч 35 мин",
      durationMin: 215,
      stationFrom: "Курский вокзал",
      stationTo: "Московский вокзал",
      features: ["Wi-Fi", "Розетки", "Кондиционер"],
      classes: [
        { classCode: "2С", className: "Сидячий", price: 1450, seatsFree: 22 },
        { classCode: "1Р", className: "Бизнес", price: 2900, seatsFree: 6 },
      ],
    },
    {
      id: "nn-712",
      number: "712Н",
      name: "Ласточка",
      brand: "lastochka",
      depart: "13:35",
      arrive: "17:10",
      duration: "3 ч 35 мин",
      durationMin: 215,
      stationFrom: "Курский вокзал",
      stationTo: "Московский вокзал",
      features: ["Wi-Fi", "Розетки"],
      classes: [
        { classCode: "2С", className: "Сидячий", price: 1450, seatsFree: 15 },
        { classCode: "1Р", className: "Бизнес", price: 2900, seatsFree: 8 },
      ],
    },
    {
      id: "nn-702",
      number: "702Н",
      name: "Ласточка",
      brand: "lastochka",
      depart: "18:05",
      arrive: "21:40",
      duration: "3 ч 35 мин",
      durationMin: 215,
      stationFrom: "Курский вокзал",
      stationTo: "Московский вокзал",
      features: ["Wi-Fi", "Розетки"],
      classes: [
        { classCode: "2С", className: "Сидячий", price: 1550, seatsFree: 4 },
        { classCode: "1Р", className: "Бизнес", price: 2900, seatsFree: 9 },
      ],
    },
    {
      id: "nn-062",
      number: "062М",
      name: "Нижегородец",
      brand: "firm",
      depart: "23:50",
      arrive: "07:30",
      duration: "7 ч 40 мин",
      durationMin: 460,
      stationFrom: "Курский вокзал",
      stationTo: "Московский вокзал",
      features: ["Ресторан", "Бельё включено"],
      classes: [
        { classCode: "3П", className: "Плацкарт", price: 1890, seatsFree: 13 },
        { classCode: "2К", className: "Купе", price: 2890, seatsFree: 6 },
      ],
    },
  ],
  generic: [
    {
      id: "g-054",
      number: "054А",
      name: "Фирменный",
      brand: "firm",
      depart: "08:15",
      arrive: "20:40",
      duration: "12 ч 25 мин",
      durationMin: 745,
      stationFrom: "",
      stationTo: "",
      features: ["Ресторан", "Кондиционер"],
      classes: [
        { classCode: "3П", className: "Плацкарт", price: 2790, seatsFree: 11 },
        { classCode: "2К", className: "Купе", price: 4290, seatsFree: 8 },
      ],
    },
    {
      id: "g-118",
      number: "118А",
      name: "Пассажирский",
      brand: "classic",
      depart: "14:50",
      arrive: "06:20",
      duration: "15 ч 30 мин",
      durationMin: 930,
      stationFrom: "",
      stationTo: "",
      features: ["Кондиционер"],
      classes: [
        { classCode: "3П", className: "Плацкарт", price: 2190, seatsFree: 19 },
        { classCode: "2К", className: "Купе", price: 3490, seatsFree: 10 },
      ],
    },
    {
      id: "g-036",
      number: "036А",
      name: "Скорый",
      brand: "classic",
      depart: "22:35",
      arrive: "11:10",
      duration: "12 ч 35 мин",
      durationMin: 755,
      stationFrom: "",
      stationTo: "",
      features: ["Розетки"],
      classes: [
        { classCode: "3П", className: "Плацкарт", price: 2490, seatsFree: 7 },
        { classCode: "2К", className: "Купе", price: 3890, seatsFree: 12 },
        { classCode: "1С", className: "СВ", price: 7600, seatsFree: 2 },
      ],
    },
  ],
};

export function trainsFor(from: string, to: string): Train[] {
  const s = `${from} ${to}`.toLowerCase();
  if (s.includes("петербург")) return TRAINS.spb;
  if (s.includes("казан")) return TRAINS.kzn;
  if (s.includes("новгород")) return TRAINS.nn;
  return TRAINS.generic;
}

export function wagonsForTrain(t: Train): Wagon[] {
  const numbers =
    t.brand === "sapsan" ? [5, 7, 9] : t.brand === "lastochka" ? [1, 2, 3] : [3, 5, 7];
  return t.classes.map((c, i) => ({
    id: `${t.id}-c${i}`,
    number: String(numbers[i] ?? i + 1),
    className: c.className,
    classCode: c.classCode,
    type: c.className,
    seatsFree: c.seatsFree,
    priceFrom: c.price,
    amenities: t.features.slice(0, 3),
    popular: t.id === "spb-757" && c.classCode === "2С",
  }));
}

export const searchDates = [
  { id: 0, label: "Чт", day: "26 фев", factor: 1.05 },
  { id: 1, label: "Пт", day: "27 фев", factor: 1 },
  { id: 2, label: "Сб", day: "28 фев", factor: 0.95 },
  { id: 3, label: "Вс", day: "1 мар", factor: 0.9 },
  { id: 4, label: "Пн", day: "2 мар", factor: 1.1 },
];

/* ── остановки поездов ──────────────────────────── */
export type TrainStop = {
  station: string;
  arr?: string;
  dep?: string;
  stopMin?: number;
  km?: number;
};

export const TRAIN_STOPS: Record<string, TrainStop[]> = {
  "spb-757": [
    { station: "Москва", dep: "07:00", km: 0 },
    { station: "Тверь", arr: "08:31", dep: "08:33", stopMin: 2, km: 167 },
    { station: "Бологое", arr: "09:26", dep: "09:28", stopMin: 2, km: 319 },
    { station: "Санкт-Петербург", arr: "10:45", km: 650 },
  ],
  "spb-762": [
    { station: "Москва", dep: "09:40", km: 0 },
    { station: "Тверь", arr: "11:08", dep: "11:10", stopMin: 2, km: 167 },
    { station: "Санкт-Петербург", arr: "13:25", km: 650 },
  ],
  "spb-716": [
    { station: "Москва", dep: "15:40", km: 0 },
    { station: "Тверь", arr: "17:08", dep: "17:10", stopMin: 2, km: 167 },
    { station: "Санкт-Петербург", arr: "19:25", km: 650 },
  ],
  "spb-002": [
    { station: "Москва", dep: "23:55", km: 0 },
    { station: "Тверь", arr: "01:48", dep: "01:52", stopMin: 4, km: 167 },
    { station: "Бологое", arr: "03:52", dep: "04:02", stopMin: 10, km: 319 },
    { station: "Вышний Волочёк", arr: "04:36", dep: "04:39", stopMin: 3, km: 369 },
    { station: "Санкт-Петербург", arr: "07:55", km: 650 },
  ],
  "spb-030": [
    { station: "Москва", dep: "23:40", km: 0 },
    { station: "Тверь", arr: "01:35", dep: "01:41", stopMin: 6, km: 167 },
    { station: "Бологое", arr: "03:45", dep: "03:55", stopMin: 10, km: 319 },
    { station: "Санкт-Петербург", arr: "08:05", km: 650 },
  ],
  "spb-026": [
    { station: "Москва", dep: "21:50", km: 0 },
    { station: "Тверь", arr: "23:42", dep: "23:46", stopMin: 4, km: 167 },
    { station: "Бологое", arr: "01:50", dep: "02:00", stopMin: 10, km: 319 },
    { station: "Санкт-Петербург", arr: "06:30", km: 650 },
  ],
  "kzn-002": [
    { station: "Москва", dep: "20:08", km: 0 },
    { station: "Владимир", arr: "22:48", dep: "23:06", stopMin: 18, km: 210 },
    { station: "Ковров", arr: "23:48", dep: "23:52", stopMin: 4, km: 278 },
    { station: "Сергач", arr: "02:50", dep: "02:53", stopMin: 3, km: 520 },
    { station: "Канаш", arr: "05:10", dep: "05:14", stopMin: 4, km: 660 },
    { station: "Казань", arr: "07:40", km: 797 },
  ],
  "kzn-118": [
    { station: "Москва", dep: "16:20", km: 0 },
    { station: "Владимир", arr: "18:55", dep: "19:05", stopMin: 10, km: 210 },
    { station: "Муром", arr: "20:40", dep: "20:44", stopMin: 4, km: 320 },
    { station: "Арзамас", arr: "23:30", dep: "23:36", stopMin: 6, km: 500 },
    { station: "Казань", arr: "05:35", km: 797 },
  ],
  "kzn-050": [
    { station: "Москва", dep: "22:10", km: 0 },
    { station: "Владимир", arr: "00:45", dep: "00:55", stopMin: 10, km: 210 },
    { station: "Сергач", arr: "04:40", dep: "04:43", stopMin: 3, km: 520 },
    { station: "Канаш", arr: "06:55", dep: "06:59", stopMin: 4, km: 660 },
    { station: "Казань", arr: "10:05", km: 797 },
  ],
  "nn-708": [
    { station: "Москва", dep: "06:35", km: 0 },
    { station: "Владимир", arr: "08:12", dep: "08:14", stopMin: 2, km: 210 },
    { station: "Ковров", arr: "09:01", dep: "09:03", stopMin: 2, km: 278 },
    { station: "Дзержинск", arr: "09:38", dep: "09:40", stopMin: 2, km: 410 },
    { station: "Нижний Новгород", arr: "10:10", km: 442 },
  ],
  "nn-712": [
    { station: "Москва", dep: "13:35", km: 0 },
    { station: "Владимир", arr: "15:12", dep: "15:14", stopMin: 2, km: 210 },
    { station: "Ковров", arr: "16:01", dep: "16:03", stopMin: 2, km: 278 },
    { station: "Дзержинск", arr: "16:38", dep: "16:40", stopMin: 2, km: 410 },
    { station: "Нижний Новгород", arr: "17:10", km: 442 },
  ],
  "nn-702": [
    { station: "Москва", dep: "18:05", km: 0 },
    { station: "Владимир", arr: "19:42", dep: "19:44", stopMin: 2, km: 210 },
    { station: "Ковров", arr: "20:31", dep: "20:33", stopMin: 2, km: 278 },
    { station: "Дзержинск", arr: "21:08", dep: "21:10", stopMin: 2, km: 410 },
    { station: "Нижний Новгород", arr: "21:40", km: 442 },
  ],
  "nn-062": [
    { station: "Москва", dep: "23:50", km: 0 },
    { station: "Владимир", arr: "02:10", dep: "02:20", stopMin: 10, km: 210 },
    { station: "Ковров", arr: "03:05", dep: "03:09", stopMin: 4, km: 278 },
    { station: "Нижний Новгород", arr: "07:30", km: 442 },
  ],
};

export function timeToMin(s: string): number {
  const [h, m] = s.split(":").map(Number);
  return h * 60 + m;
}

function fmtMin(min: number): string {
  const m = ((min % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}

export function getStops(t: Train): TrainStop[] {
  const ready = TRAIN_STOPS[t.id];
  if (ready) return ready;
  // синтетический маршрут для остальных поездов
  const pool = ["Владимир", "Рязань-2", "Ковров", "Вековка", "Пенза-1", "Инза", "Рузаевка", "Сергач"];
  let h = 0;
  for (const ch of t.id) h = (h * 31 + ch.charCodeAt(0)) % 997;
  const names = [pool[h % pool.length], pool[(h + 3) % pool.length]];
  const km = t.id.startsWith("spb") ? 650 : t.id.startsWith("kzn") ? 797 : t.id.startsWith("nn") ? 442 : 920;
  const dep = timeToMin(t.depart);
  const at = (frac: number) => fmtMin(dep + Math.round(t.durationMin * frac));
  const a1 = at(0.33);
  const a2 = at(0.66);
  return [
    { station: t.stationFrom ? t.stationFrom.replace(" вокзал", "") : "Отправление", dep: t.depart, km: 0 },
    { station: names[0], arr: a1, dep: fmtMin(timeToMin(a1) + 8), stopMin: 8, km: Math.round(km * 0.33) },
    { station: names[1], arr: a2, dep: fmtMin(timeToMin(a2) + 5), stopMin: 5, km: Math.round(km * 0.66) },
    { station: t.stationTo ? t.stationTo.replace(" вокзал", "") : "Прибытие", arr: t.arrive, km },
  ];
}

export type Route = {
  id: string;
  from: string;
  to: string;
  fromCode: string;
  toCode: string;
  train: string;
  trainName: string;
  duration: string;
  depart: string;
  arrive: string;
  price: number;
  trips: number;
  km: number;
};

export const favoriteRoutes: Route[] = [
  {
    id: "msk-spb",
    from: "Москва",
    to: "Санкт-Петербург",
    fromCode: "МСК",
    toCode: "СПБ",
    train: "757А",
    trainName: "Сапсан",
    duration: "3 ч 45 мин",
    depart: "07:00",
    arrive: "10:45",
    price: 3890,
    trips: 14,
    km: 650,
  },
  {
    id: "msk-nn",
    from: "Москва",
    to: "Нижний Новгород",
    fromCode: "МСК",
    toCode: "НН",
    train: "708Н",
    trainName: "Ласточка",
    duration: "3 ч 35 мин",
    depart: "06:35",
    arrive: "10:10",
    price: 1450,
    trips: 6,
    km: 442,
  },
  {
    id: "msk-kzn",
    from: "Москва",
    to: "Казань",
    fromCode: "МСК",
    toCode: "КЗН",
    train: "002Й",
    trainName: "Премиум",
    duration: "11 ч 32 мин",
    depart: "20:08",
    arrive: "07:40",
    price: 2980,
    trips: 4,
    km: 797,
  },
];

export const tripHistory = [
  { id: 1, route: "Москва → Санкт-Петербург", date: "12 фев 2026", train: "Сапсан · 757А", seat: "Вагон 7, место 14А", price: 3890, bonus: 486, status: "Завершена" },
  { id: 2, route: "Санкт-Петербург → Москва", date: "9 фев 2026", train: "Сапсан · 776А", seat: "Вагон 4, место 8С", price: 4120, bonus: 515, status: "Завершена" },
  { id: 3, route: "Москва → Казань", date: "24 янв 2026", train: "Премиум · 002Й", seat: "Вагон 9, купе 3", price: 2980, bonus: 372, status: "Завершена" },
  { id: 4, route: "Москва → Нижний Новгород", date: "11 янв 2026", train: "Ласточка · 708Н", seat: "Вагон 2, место 31", price: 1450, bonus: 181, status: "Завершена" },
];

export const upcomingTrip = {
  route: "Москва → Санкт-Петербург",
  from: "МСК",
  to: "СПБ",
  date: "Пт, 27 февраля",
  depart: "07:00",
  arrive: "10:45",
  train: "Сапсан · 757А",
  seat: "Вагон 7, место 14А",
  station: "Ленинградский вокзал",
};

export const analytics = {
  trips: 28,
  km: 15840,
  favTrain: "Сапсан",
  favCar: "Сидячий · класс 2С",
  favRoute: "Москва — Санкт-Петербург",
  bonusEarned: 24680,
  bonusSpent: 8000,
  monthly: [
    { m: "Сен", v: 3 },
    { m: "Окт", v: 5 },
    { m: "Ноя", v: 2 },
    { m: "Дек", v: 6 },
    { m: "Янв", v: 4 },
    { m: "Фев", v: 8 },
  ],
};

export const services = [
  { id: "food", label: "Питание в поезде", icon: "food", used: 12 },
  { id: "luggage", label: "Провоз багажа", icon: "luggage", used: 7 },
  { id: "wifi", label: "Wi-Fi в пути", icon: "wifi", used: 21 },
  { id: "seat", label: "Выбор места", icon: "seat", used: 26 },
];
