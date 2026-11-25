import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CONDITIONS, fmtKm, fmtTmt, fmtUsd, totalUsd, useCars } from "@/lib/cars";
import { PrototypeNote, SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GARAJ — Used cars from Dubai to Turkmenistan" },
      { name: "description", content: "Browse used cars imported from Dubai with full price breakdown in USD and TMT." },
      { property: "og:title", content: "GARAJ — Dubai Cars. Turkmenistan." },
      { property: "og:description", content: "Used cars from Dubai with shipping and repair estimates." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const sel = "h-11 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-ring focus:outline-none";

function Index() {
  const cars = useCars();
  const pub = cars.filter((c) => c.published);
  const brands = [...new Set(pub.map((c) => c.brand))].sort();
  const [brand, setBrand] = useState("");
  const [yearFrom, setYearFrom] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [cond, setCond] = useState("");
  const list = useMemo(() => pub.filter((c) =>
    (!brand || c.brand === brand) && (!yearFrom || c.year >= +yearFrom) &&
    (!priceMax || c.priceUsd <= +priceMax) && (!cond || c.condition === cond)), [pub, brand, yearFrom, priceMax, cond]);
  const years = Array.from({ length: 12 }, (_, i) => 2025 - i);

  return (
    <div className="min-h-screen bg-background">
      <PrototypeNote />
      <SiteHeader />
      <section className="mx-auto max-w-7xl px-4 pb-6 pt-10">
        <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-5xl">Cars from Dubai,<br />delivered to <span className="text-primary">Turkmenistan</span></h1>
        <p className="mt-3 max-w-xl text-muted-foreground">Every listing shows the car price, shipping and estimated repair — so you know the full cost upfront.</p>
      </section>
      <section className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-2 gap-3 rounded-2xl bg-secondary p-4 md:grid-cols-5">
          <select className={sel} value={brand} onChange={(e) => setBrand(e.target.value)}><option value="">All brands</option>{brands.map((b) => <option key={b}>{b}</option>)}</select>
          <select className={sel} value={yearFrom} onChange={(e) => setYearFrom(e.target.value)}><option value="">Year from</option>{years.map((y) => <option key={y}>{y}</option>)}</select>
          <input className={sel} type="number" placeholder="Max price, USD" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} />
          <select className={sel} value={cond} onChange={(e) => setCond(e.target.value)}><option value="">Any condition</option>{CONDITIONS.map((c) => <option key={c}>{c}</option>)}</select>
          <button className="col-span-2 h-11 rounded-lg text-sm font-medium text-muted-foreground hover:bg-background md:col-span-1" onClick={() => { setBrand(""); setYearFrom(""); setPriceMax(""); setCond(""); }}>Reset filters</button>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">{list.length} cars found</p>
        <div className="mt-3 grid gap-6 pb-16 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => (
            <Link key={c.id} to="/cars/$id" params={{ id: c.id }} className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:shadow-lg">
              <div className="aspect-[4/3] overflow-hidden bg-secondary">
                {c.images[0] && <img src={c.images[0]} alt={`${c.brand} ${c.model}`} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold">{c.brand} {c.model}</h3>
                  <span className="shrink-0 rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground">{c.condition}</span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{c.year} · {fmtKm(c.mileageKm)}</p>
                <p className="mt-3 text-xl font-bold">{fmtUsd(c.priceUsd)}</p>
                <p className="text-xs text-muted-foreground">Total est. {fmtUsd(totalUsd(c))} · {fmtTmt(totalUsd(c))}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
