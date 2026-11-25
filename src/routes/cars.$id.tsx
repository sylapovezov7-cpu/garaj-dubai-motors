import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { fmtKm, fmtTmt, fmtUsd, IMO_LINK, IMO_PHONE, totalUsd, useCars } from "@/lib/cars";
import { PrototypeNote, SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/cars/$id")({
  head: () => ({
    meta: [
      { title: "Автомобиль — GARAJ" },
      { name: "description", content: "Фото, характеристики и полная стоимость автомобиля из Дубая." },
      { property: "og:title", content: "Автомобиль — GARAJ" },
      { property: "og:description", content: "Фото, характеристики и стоимость в USD и TMT." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CarPage,
});

function CarPage() {
  const { id } = Route.useParams();
  const car = useCars().find((c) => c.id === id);
  const [img, setImg] = useState(0);
  if (!car) return (<div><SiteHeader /><div className="p-16 text-center"><p>Автомобиль не найден.</p><Link to="/" className="text-primary">Вернуться в каталог</Link></div></div>);
  const specs: [string, string][] = [["Год выпуска", String(car.year)], ["Пробег", fmtKm(car.mileageKm)], ["Состояние", car.condition], ["Двигатель", car.engine], ["Коробка передач", car.transmission], ["Топливо", car.fuel], ["Привод", car.drive], ["Кузов", car.bodyType], ["Цвет", car.color]];
  const total = totalUsd(car);
  return (
    <div className="min-h-screen">
      <PrototypeNote />
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />Каталог</Link>
        <h1 className="mt-3 font-display text-2xl font-extrabold sm:text-4xl">{car.brand} {car.model}, {car.year} г.</h1>
        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_380px]">
          <div>
            <div className="aspect-[16/10] overflow-hidden rounded-2xl bg-secondary">
              {car.images[img] && <img src={car.images[img]} alt={`${car.brand} ${car.model}`} className="h-full w-full object-cover" />}
            </div>
            {car.images.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto">
                {car.images.map((src, i) => (
                  <button key={i} onClick={() => setImg(i)} className={`h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 ${i === img ? "border-primary" : "border-transparent"}`}><img src={src} alt="" className="h-full w-full object-cover" /></button>
                ))}
              </div>
            )}
            <h2 className="mt-8 text-lg font-semibold">Характеристики</h2>
            <dl className="mt-3 grid grid-cols-1 gap-x-8 sm:grid-cols-2">
              {specs.map(([k, v]) => <div key={k} className="flex justify-between border-b border-border py-2.5 text-sm"><dt className="text-muted-foreground">{k}</dt><dd className="font-medium">{v}</dd></div>)}
            </dl>
            {car.description && <><h2 className="mt-8 text-lg font-semibold">Описание</h2><p className="mt-2 text-muted-foreground">{car.description}</p></>}
          </div>
          <aside className="h-fit rounded-2xl bg-secondary p-6 lg:sticky lg:top-24">
            <p className="text-sm text-muted-foreground">Примерная итоговая стоимость</p>
            <p className="text-3xl font-bold">{fmtUsd(total)}</p>
            <p className="text-lg font-semibold text-primary">{fmtTmt(total)}</p>
            <div className="mt-5 space-y-2 text-sm">
              <Row k="Цена автомобиля" v={fmtUsd(car.priceUsd)} />
              <Row k="Доставка Дубай → Туркменистан" v={fmtUsd(car.shippingUsd)} />
              <Row k="Примерный ремонт" v={fmtUsd(car.repairUsd)} />
            </div>
            <a href={IMO_LINK} className="mt-6 flex h-12 items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-primary-foreground hover:bg-primary/90"><MessageCircle className="h-5 w-5" />Написать в IMO</a>
            <p className="mt-2 text-center text-xs text-muted-foreground">{IMO_PHONE}</p>
          </aside>
        </div>
      </main>
    </div>
  );
}
function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between gap-4"><span className="text-muted-foreground">{k}</span><span className="font-medium">{v}</span></div>;
}
