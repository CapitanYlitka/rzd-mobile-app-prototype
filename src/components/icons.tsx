type P = { className?: string; strokeWidth?: number };
const base = (className?: string) => className ?? "w-6 h-6";

export const IconSearch = ({ className, strokeWidth = 1.8 }: P) => (
  <svg className={base(className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round">
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </svg>
);

export const IconTicket = ({ className, strokeWidth = 1.8 }: P) => (
  <svg className={base(className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4V8z" />
    <path d="M13 6v2M13 11v2M13 16v2" strokeDasharray="0.1 3" />
  </svg>
);

export const IconTrain = ({ className, strokeWidth = 1.8 }: P) => (
  <svg className={base(className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="3" width="14" height="14" rx="3" />
    <path d="M5 10h14" />
    <circle cx="9" cy="13.5" r="0.6" fill="currentColor" />
    <circle cx="15" cy="13.5" r="0.6" fill="currentColor" />
    <path d="M8 21l2-3.5M16 21l-2-3.5" />
  </svg>
);

export const IconStar = ({ className, filled }: P & { filled?: boolean }) => (
  <svg className={base(className)} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={1.8} strokeLinejoin="round">
    <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.9L12 3.5z" />
  </svg>
);

export const IconUser = ({ className, strokeWidth = 1.8 }: P) => (
  <svg className={base(className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4.5 20c1.4-3.2 4.2-5 7.5-5s6.1 1.8 7.5 5" />
  </svg>
);

export const IconSparkles = ({ className }: P) => (
  <svg className={base(className)} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2z" />
    <path d="M19 14l.9 2.6L22.5 17.5l-2.6.9L19 21l-.9-2.6-2.6-.9 2.6-.9L19 14z" opacity="0.7" />
    <path d="M5.5 15l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7.7-2z" opacity="0.5" />
  </svg>
);

export const IconChevronRight = ({ className, strokeWidth = 2 }: P) => (
  <svg className={base(className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 5l7 7-7 7" />
  </svg>
);

export const IconBack = ({ className, strokeWidth = 2 }: P) => (
  <svg className={base(className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 5l-7 7 7 7" />
  </svg>
);

export const IconSwap = ({ className, strokeWidth = 1.8 }: P) => (
  <svg className={base(className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 4v13M7 17l-3-3M7 17l3-3" />
    <path d="M17 20V7M17 7l-3 3M17 7l3 3" />
  </svg>
);

export const IconCalendar = ({ className, strokeWidth = 1.8 }: P) => (
  <svg className={base(className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round">
    <rect x="4" y="5" width="16" height="16" rx="3" />
    <path d="M4 10h16M8 3v4M16 3v4" />
  </svg>
);

export const IconFood = ({ className, strokeWidth = 1.8 }: P) => (
  <svg className={base(className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round">
    <path d="M5 3v7a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V3M7 3v18M7 12v9" />
    <path d="M17 3c-1.7 0-3 2.2-3 5s1.3 5 3 5v8M17 3v18" />
  </svg>
);

export const IconSeat = ({ className, strokeWidth = 1.8 }: P) => (
  <svg className={base(className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 4v9a2 2 0 0 0 2 2h8" />
    <path d="M7 13h8a2 2 0 0 1 2 2v5" />
    <path d="M5 20h13" />
  </svg>
);

export const IconGift = ({ className, strokeWidth = 1.8 }: P) => (
  <svg className={base(className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="9" width="16" height="4" />
    <rect x="6" y="13" width="12" height="8" />
    <path d="M12 9v12" />
    <path d="M12 9C10 9 7.5 8.5 7.5 6.5 7.5 5 8.6 4 10 4c2 0 2 3 2 5zM12 9c2 0 4.5-.5 4.5-2.5C16.5 5 15.4 4 14 4c-2 0-2 3-2 5z" />
  </svg>
);

export const IconChart = ({ className, strokeWidth = 1.8 }: P) => (
  <svg className={base(className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round">
    <path d="M4 20h16" />
    <path d="M7 20v-6M12 20V8M17 20v-9" />
  </svg>
);

export const IconRoute = ({ className, strokeWidth = 1.8 }: P) => (
  <svg className={base(className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="18" r="2.5" />
    <circle cx="18" cy="6" r="2.5" />
    <path d="M8.5 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.5" />
  </svg>
);

export const IconClock = ({ className, strokeWidth = 1.8 }: P) => (
  <svg className={base(className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round">
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

export const IconBell = ({ className, strokeWidth = 1.8 }: P) => (
  <svg className={base(className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 10a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
    <path d="M10 20a2 2 0 0 0 4 0" />
  </svg>
);

export const IconWifi = ({ className }: P) => (
  <svg className={base(className)} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 18.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM12 14c-1.9 0-3.6.7-4.9 1.9l1.4 1.5A5.2 5.2 0 0 1 12 16c1.3 0 2.6.5 3.5 1.4l1.4-1.5A7.2 7.2 0 0 0 12 14zM12 9.5c-3.1 0-6 1.2-8.1 3.2l1.4 1.5A9.7 9.7 0 0 1 12 11.5c2.6 0 5 1 6.7 2.7l1.4-1.5A11.7 11.7 0 0 0 12 9.5z" />
  </svg>
);

export const IconLightning = ({ className }: P) => (
  <svg className={base(className)} viewBox="0 0 24 24" fill="currentColor">
    <path d="M13 2L4.5 13.5H11L9.5 22 19 10h-6.5L13 2z" />
  </svg>
);

export const IconCheck = ({ className, strokeWidth = 2.2 }: P) => (
  <svg className={base(className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 13l4.5 4.5L19 7" />
  </svg>
);

export const IconCard = ({ className, strokeWidth = 1.8 }: P) => (
  <svg className={base(className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round">
    <rect x="3" y="6" width="18" height="13" rx="2.5" />
    <path d="M3 10.5h18M7 15h4" />
  </svg>
);

export const IconLuggage = ({ className, strokeWidth = 1.8 }: P) => (
  <svg className={base(className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="7" width="12" height="13" rx="2.5" />
    <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
    <path d="M9.5 11v5M14.5 11v5" />
  </svg>
);

export const IconHome = ({ className, strokeWidth = 1.8 }: P) => (
  <svg className={base(className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 10.5L12 4l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19v-8.5z" />
    <path d="M9.5 20.5v-6h5v6" />
  </svg>
);

export const IconPet = ({ className, strokeWidth = 1.8 }: P) => (
  <svg className={base(className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="15.5" rx="5.5" ry="4.5" />
    <circle cx="6.2" cy="9.2" r="1.8" />
    <circle cx="9.5" cy="6.8" r="1.8" />
    <circle cx="14.5" cy="6.8" r="1.8" />
    <circle cx="17.8" cy="9.2" r="1.8" />
  </svg>
);

export const IconLounge = ({ className, strokeWidth = 1.8 }: P) => (
  <svg className={base(className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 14v4h16v-4" />
    <path d="M3 14h18a1 1 0 0 0 0-2H3a1 1 0 0 0 0 2z" />
    <path d="M6 12V8a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v4" />
    <path d="M6 18v2M18 18v2" />
  </svg>
);

export const IconPlus = ({ className, strokeWidth = 2 }: P) => (
  <svg className={base(className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const IconMinus = ({ className, strokeWidth = 2 }: P) => (
  <svg className={base(className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round">
    <path d="M5 12h14" />
  </svg>
);

export const IconTrash = ({ className, strokeWidth = 1.8 }: P) => (
  <svg className={base(className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 7h14M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M8 7l1 12h6l1-12" />
  </svg>
);

export const IconUsers = ({ className, strokeWidth = 1.8 }: P) => (
  <svg className={base(className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round">
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 19c.9-3 3.2-4.5 6.5-4.5s5.6 1.5 6.5 4.5" />
    <circle cx="17" cy="9" r="2.5" />
    <path d="M16 14.5c2.4.3 4.2 1.5 5 3.5" />
  </svg>
);

export const IconGear = ({ className, strokeWidth = 1.8 }: P) => (
  <svg className={base(className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M19.4 13a7.6 7.6 0 0 0 .1-1 7.6 7.6 0 0 0-.1-1l2.1-1.7a.5.5 0 0 0 .1-.7l-2-3.4a.5.5 0 0 0-.6-.2l-2.5 1a7.7 7.7 0 0 0-1.7-1l-.4-2.5a.5.5 0 0 0-.5-.4h-4a.5.5 0 0 0-.5.4l-.4 2.5a7.7 7.7 0 0 0-1.7 1l-2.5-1a.5.5 0 0 0-.6.2l-2 3.4a.5.5 0 0 0 .1.7L4.5 11a7.6 7.6 0 0 0-.1 1 7.6 7.6 0 0 0 .1 1l-2.1 1.7a.5.5 0 0 0-.1.7l2 3.4c.1.2.4.3.6.2l2.5-1a7.7 7.7 0 0 0 1.7 1l.4 2.5c0 .2.3.4.5.4h4c.2 0 .5-.2.5-.4l.4-2.5a7.7 7.7 0 0 0 1.7-1l2.5 1c.2.1.5 0 .6-.2l2-3.4a.5.5 0 0 0-.1-.7L19.4 13z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const IconPhone = ({ className, strokeWidth = 1.8 }: P) => (
  <svg className={base(className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.8 3.5c.5 0 .9.3 1.1.8l1 2.6c.2.5.1 1-.3 1.4L7.4 9.5a12.5 12.5 0 0 0 7.1 7.1l1.2-1.2c.4-.4 1-.5 1.4-.3l2.6 1c.5.2.8.6.8 1.1v2.4c0 .9-.7 1.6-1.6 1.5C10.5 20.3 3.7 13.5 2.9 5.1c-.1-.9.6-1.6 1.5-1.6h2.4z" />
  </svg>
);

export const IconPalette = ({ className, strokeWidth = 1.8 }: P) => (
  <svg className={base(className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3a9 9 0 1 0 0 18c1.3 0 2.1-.8 2.1-1.8 0-.6-.3-1-.6-1.4-.3-.4-.6-.8-.6-1.4 0-1 .8-1.8 2.1-1.8h1.6A4.4 4.4 0 0 0 21 10.2C20.9 6.1 16.9 3 12 3z" />
    <circle cx="7.5" cy="11" r="1.1" fill="currentColor" stroke="none" />
    <circle cx="10.5" cy="7.5" r="1.1" fill="currentColor" stroke="none" />
    <circle cx="14.8" cy="7.5" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);

export const IconSend = ({ className }: P) => (
  <svg className={base(className)} viewBox="0 0 24 24" fill="currentColor">
    <path d="M3.5 20.5l18-8.5-18-8.5 2.5 7 9 1.5-9 1.5-2.5 7z" />
  </svg>
);

export const IconMail = ({ className, strokeWidth = 1.8 }: P) => (
  <svg className={base(className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
    <path d="M3.5 7l8.5 6 8.5-6" />
  </svg>
);

/* RZD logotype — stylized */
export const RzdLogo = ({ className }: P) => (
  <svg className={className ?? "h-6"} viewBox="0 0 86 28" fill="currentColor">
    <path d="M2 22L14 6h7L9 22H2z" />
    <path d="M13 22l7.5-10H14l3-4h14L23.5 18H30l-3 4H13z" />
    <path d="M34 6h9c5 0 8 3.2 8 8s-3 8-8 8h-9l3-4h5.6c2.6 0 4.2-1.6 4.2-4s-1.6-4-4.2-4H31l3-4z" />
    <text x="56" y="20" fontSize="13" fontWeight="700" fontFamily="Inter, sans-serif">РЖД</text>
  </svg>
);
