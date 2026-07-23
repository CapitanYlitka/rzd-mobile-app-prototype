import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  savedPassengers,
  type PassengerDraft,
  type Wagon,
  type Train,
  TRAINS,
} from "./data";

export type ServiceState = {
  food: boolean;
  foodMenuId: string;
  luggage: number;
  pet: number;
  lounge: boolean;
};

export type BookingState = {
  passengers: PassengerDraft[];
  wagonId: string;
  seats: string[];
  services: ServiceState;
  total: number;
  pointsUsed: number;
  payMethodId: string;
  bonus: number;
  routeId: string;
  searchFrom: string;
  searchTo: string;
  searchDate: string;
  selectedTrain: Train;
};

type BookingCtx = {
  booking: BookingState;
  setBooking: (b: BookingState) => void;
  updateBooking: (partial: Partial<BookingState>) => void;
};

const defaultBooking: BookingState = {
  passengers: [savedPassengers[0]],
  wagonId: "w7",
  seats: ["14А"],
  services: {
    food: true,
    foodMenuId: "breakfast",
    luggage: 0,
    pet: 0,
    lounge: false,
  },
  total: 3890 + 420,
  pointsUsed: 0,
  payMethodId: "mir",
  bonus: 486,
  routeId: "msk-spb",
  searchFrom: "Москва",
  searchTo: "Санкт-Петербург",
  searchDate: "Пт, 27 фев",
  selectedTrain: TRAINS.spb[0],
};

const Ctx = createContext<BookingCtx>({
  booking: defaultBooking,
  setBooking: () => undefined,
  updateBooking: () => undefined,
});

export function BookingProvider({ children }: { children: ReactNode }) {
  const [booking, setBooking] = useState<BookingState>(defaultBooking);
  const value = useMemo(
    () => ({
      booking,
      setBooking,
      updateBooking: (partial: Partial<BookingState>) =>
        setBooking((prev) => ({ ...prev, ...partial })),
    }),
    [booking],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useBooking = () => useContext(Ctx);

export function calcTotal(
  wagonList: Wagon[],
  passengerCount: number,
  wagonId: string,
  services: ServiceState,
): { total: number; bonus: number; ticketSum: number; extrasSum: number } {
  const wagon = wagonList.find((w) => w.id === wagonId) ?? wagonList[0];
  const base = wagon.priceFrom;
  const ticketSum = base * Math.max(1, passengerCount);

  const foodPrice =
    services.food && services.foodMenuId !== "none"
      ? (services.foodMenuId === "business" ? 790 : services.foodMenuId === "kids" ? 350 : 420) *
        Math.max(1, passengerCount)
      : 0;
  const luggagePrice = services.luggage * 350;
  const petPrice = services.pet * 900;
  const loungePrice = services.lounge ? 1200 * Math.max(1, passengerCount) : 0;
  const extrasSum = foodPrice + luggagePrice + petPrice + loungePrice;
  const total = ticketSum + extrasSum;
  const bonus = Math.round(total * 0.125);
  return { total, bonus, ticketSum, extrasSum };
}
