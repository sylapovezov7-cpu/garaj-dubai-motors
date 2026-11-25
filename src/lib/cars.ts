import { useSyncExternalStore } from "react";

export type Condition = "Отличное" | "Хорошее" | "Незначительные повреждения" | "Требует ремонта";
export type Car = {
  id: string; brand: string; model: string; year: number; mileageKm: number;
  priceUsd: number; shippingUsd: number; repairUsd: number; condition: Condition;
  engine: string; transmission: string; fuel: string; drive: string; color: string;
  bodyType: string; description: string; images: string[]; published: boolean;
};

export const TMT_PER_USD = 19.5;
export const IMO_PHONE = "+99362141285";
export const IMO_LINK = "imo://chat?phone=99362141285";
export const CONDITIONS: Condition[] = ["Отличное", "Хорошее", "Незначительные повреждения", "Требует ремонта"];

const u = (id: string) => `https://images.unsplash.com/${id}?w=1600&q=80&auto=format&fit=crop`;

const SAMPLE: Car[] = [
  { id: "1", brand: "Toyota", model: "Land Cruiser 300", year: 2022, mileageKm: 41000, priceUsd: 68500, shippingUsd: 2400, repairUsd: 0, condition: "Отличное", engine: "3.5 V6 Twin-Turbo", transmission: "Автомат", fuel: "Бензин", drive: "Полный", color: "Белый", bodyType: "Внедорожник", description: "Спецификация GCC, полная сервисная история у дилера Al-Futtaim Toyota в Дубае.", images: [u("photo-1594502184342-2e12f877aa73"), u("photo-1609521263047-f8f205293f24")], published: true },
  { id: "2", brand: "Lexus", model: "LX 600", year: 2023, mileageKm: 18500, priceUsd: 92000, shippingUsd: 2400, repairUsd: 600, condition: "Хорошее", engine: "3.4 V6 Twin-Turbo", transmission: "Автомат", fuel: "Бензин", drive: "Полный", color: "Чёрный", bodyType: "Внедорожник", description: "Небольшая царапина на заднем бампере. Аудиосистема Mark Levinson.", images: [u("photo-1606664515524-ed2f786a0bd6"), u("photo-1617469767053-d3b523a0b982")], published: true },
  { id: "3", brand: "Mercedes-Benz", model: "G 63 AMG", year: 2020, mileageKm: 56000, priceUsd: 118000, shippingUsd: 2600, repairUsd: 1500, condition: "Хорошее", engine: "4.0 V8 Biturbo", transmission: "Автомат", fuel: "Бензин", drive: "Полный", color: "Серый", bodyType: "Внедорожник", description: "Пригнан из Дубая, пакет Night.", images: [u("photo-1520031441872-265e4ff70366"), u("photo-1563720223185-11003d516935")], published: true },
  { id: "4", brand: "Toyota", model: "Camry", year: 2021, mileageKm: 72000, priceUsd: 17800, shippingUsd: 1900, repairUsd: 2200, condition: "Незначительные повреждения", engine: "2.5 I4", transmission: "Автомат", fuel: "Бензин", drive: "Передний", color: "Серебристый", bodyType: "Седан", description: "Повреждены передний бампер и фара, подушки безопасности не сработали.", images: [u("photo-1621007947382-bb3c3994e3fb")], published: true },
  { id: "5", brand: "Hyundai", model: "Santa Fe", year: 2019, mileageKm: 98000, priceUsd: 14500, shippingUsd: 1900, repairUsd: 3800, condition: "Требует ремонта", engine: "3.5 V6", transmission: "Автомат", fuel: "Бензин", drive: "Полный", color: "Синий", bodyType: "Внедорожник", description: "Боковой удар, требуется ремонт двери и кузовных панелей.", images: [u("photo-1633695632011-f1c3e4c3ba6c")], published: true },
  { id: "6", brand: "Nissan", model: "Patrol Nismo", year: 2021, mileageKm: 39000, priceUsd: 74000, shippingUsd: 2400, repairUsd: 0, condition: "Отличное", engine: "5.6 V8", transmission: "Автомат", fuel: "Бензин", drive: "Полный", color: "Белый", bodyType: "Внедорожник", description: "Топовая комплектация, один владелец в Абу-Даби.", images: [u("photo-1519641471654-76ce0107ad1b")], published: true },
  { id: "7", brand: "Kia", model: "K5 GT-Line", year: 2022, mileageKm: 33000, priceUsd: 16900, shippingUsd: 1900, repairUsd: 900, condition: "Хорошее", engine: "1.6 Turbo", transmission: "Автомат", fuel: "Бензин", drive: "Передний", color: "Красный", bodyType: "Седан", description: "Небольшие следы града на крыше.", images: [u("photo-1580273916550-e323be2ae537")], published: false },
];

const KEY = "garaj-cars-v2";
let cars: Car[] = SAMPLE;
let loaded = false;
const listeners = new Set<() => void>();
function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try { const s = localStorage.getItem(KEY); if (s) cars = JSON.parse(s); } catch { /* ignore */ }
}
function emit() {
  try { localStorage.setItem(KEY, JSON.stringify(cars)); } catch { /* quota */ }
  listeners.forEach((l) => l());
}
export const carStore = {
  subscribe(l: () => void) { load(); listeners.add(l); l(); return () => listeners.delete(l); },
  get: () => cars,
  upsert(c: Car) { cars = cars.some((x) => x.id === c.id) ? cars.map((x) => (x.id === c.id ? c : x)) : [c, ...cars]; emit(); },
  remove(id: string) { cars = cars.filter((x) => x.id !== id); emit(); },
  reset() { cars = SAMPLE; emit(); },
};
export function useCars() {
  return useSyncExternalStore(carStore.subscribe, carStore.get, () => SAMPLE);
}

export const totalUsd = (c: Pick<Car, "priceUsd" | "shippingUsd" | "repairUsd">) => c.priceUsd + c.shippingUsd + c.repairUsd;
export const fmtUsd = (n: number) => "$" + n.toLocaleString("ru-RU");
export const fmtTmt = (n: number) => Math.round(n * TMT_PER_USD).toLocaleString("ru-RU") + " TMT";
export const fmtKm = (n: number) => n.toLocaleString("ru-RU") + " км";
