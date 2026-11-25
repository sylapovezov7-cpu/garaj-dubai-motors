import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Pencil, Plus, Trash2, X } from "lucide-react";
import { carStore, CONDITIONS, fmtUsd, totalUsd, useCars, type Car } from "@/lib/cars";
import { PrototypeNote, SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin dashboard — GARAJ" },
      { name: "description", content: "Manage GARAJ car listings: add, edit, publish and delete." },
      { property: "og:title", content: "Admin dashboard — GARAJ" },
      { property: "og:description", content: "Manage GARAJ car listings." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

const blank = (): Car => ({ id: crypto.randomUUID(), brand: "", model: "", year: 2022, mileageKm: 0, priceUsd: 0, shippingUsd: 2000, repairUsd: 0, condition: "Good", engine: "", transmission: "Automatic", fuel: "Petrol", drive: "FWD", color: "", bodyType: "SUV", description: "", images: [], published: false });

function Admin() {
  const cars = useCars();
  const [edit, setEdit] = useState<Car | null>(null);
  return (
    <div className="min-h-screen bg-secondary">
      <PrototypeNote />
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-2xl font-extrabold">Listings</h1>
          <div className="flex gap-2">
            <button onClick={() => confirm("Restore the sample listings?") && carStore.reset()} className="h-10 rounded-lg px-3 text-sm text-muted-foreground hover:bg-background">Restore samples</button>
            <button onClick={() => setEdit(blank())} className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90"><Plus className="h-4 w-4" />Add car</button>
          </div>
        </div>
        <div className="mt-6 space-y-3">
          {cars.map((c) => (
            <div key={c.id} className="flex items-center gap-4 rounded-xl bg-background p-3">
              <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-secondary">{c.images[0] && <img src={c.images[0]} alt="" className="h-full w-full object-cover" />}</div>
              <div className="min-w-0 flex-1">
                <Link to="/cars/$id" params={{ id: c.id }} className="block truncate font-semibold hover:text-primary">{c.brand || "Untitled"} {c.model}</Link>
                <p className="text-sm text-muted-foreground">{c.year} · {fmtUsd(c.priceUsd)} · total {fmtUsd(totalUsd(c))}</p>
              </div>
              <span className={`hidden rounded-full px-2 py-0.5 text-xs sm:inline ${c.published ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"}`}>{c.published ? "Published" : "Draft"}</span>
              <div className="flex gap-1">
                <IconBtn label={c.published ? "Unpublish" : "Publish"} onClick={() => carStore.upsert({ ...c, published: !c.published })}>{c.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</IconBtn>
                <IconBtn label="Edit" onClick={() => setEdit(c)}><Pencil className="h-4 w-4" /></IconBtn>
                <IconBtn label="Delete" onClick={() => confirm(`Delete ${c.brand} ${c.model}?`) && carStore.remove(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></IconBtn>
              </div>
            </div>
          ))}
        </div>
      </main>
      {edit && <CarForm car={edit} onClose={() => setEdit(null)} />}
    </div>
  );
}

function IconBtn({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return <button aria-label={label} title={label} onClick={onClick} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-secondary">{children}</button>;
}

const inp = "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-ring focus:outline-none";

function CarForm({ car, onClose }: { car: Car; onClose: () => void }) {
  const [f, setF] = useState<Car>(car);
  const set = <K extends keyof Car>(k: K, v: Car[K]) => setF((p) => ({ ...p, [k]: v }));
  const text = (k: keyof Car, label: string) => (
    <label className="text-sm"><span className="mb-1 block text-muted-foreground">{label}</span><input className={inp} value={String(f[k])} onChange={(e) => set(k, e.target.value as never)} /></label>);
  const num = (k: keyof Car, label: string) => (
    <label className="text-sm"><span className="mb-1 block text-muted-foreground">{label}</span><input type="number" className={inp} value={Number(f[k])} onChange={(e) => set(k, Number(e.target.value) as never)} /></label>);
  const upload = (files: FileList | null) => {
    Array.from(files ?? []).forEach((file) => {
      const r = new FileReader();
      r.onload = () => setF((p) => ({ ...p, images: [...p.images, String(r.result)] }));
      r.readAsDataURL(file);
    });
  };
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 sm:items-center sm:p-4" onClick={onClose}>
      <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-2xl bg-background p-6 sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between"><h2 className="text-xl font-bold">{car.brand ? "Edit car" : "Add car"}</h2><IconBtn label="Close" onClick={onClose}><X className="h-5 w-5" /></IconBtn></div>
        <form className="mt-4 space-y-5" onSubmit={(e) => { e.preventDefault(); carStore.upsert(f); onClose(); }}>
          <div className="grid gap-3 sm:grid-cols-3">
            {text("brand", "Brand")}{text("model", "Model")}{num("year", "Year")}
            {num("mileageKm", "Mileage, km")}
            <label className="text-sm"><span className="mb-1 block text-muted-foreground">Condition</span><select className={inp} value={f.condition} onChange={(e) => set("condition", e.target.value as Car["condition"])}>{CONDITIONS.map((c) => <option key={c}>{c}</option>)}</select></label>
            {text("bodyType", "Body type")}
            {text("engine", "Engine")}{text("transmission", "Transmission")}{text("fuel", "Fuel")}
            {text("drive", "Drive")}{text("color", "Color")}
          </div>
          <div className="grid gap-3 rounded-xl bg-secondary p-4 sm:grid-cols-3">
            {num("priceUsd", "Car price, USD")}{num("shippingUsd", "Shipping, USD")}{num("repairUsd", "Est. repair, USD")}
            <p className="text-sm sm:col-span-3">Estimated total: <b>{fmtUsd(totalUsd(f))}</b></p>
          </div>
          <label className="block text-sm"><span className="mb-1 block text-muted-foreground">Description</span><textarea rows={3} className={`${inp} h-auto py-2`} value={f.description} onChange={(e) => set("description", e.target.value)} /></label>
          <div>
            <span className="mb-2 block text-sm text-muted-foreground">Photos</span>
            <div className="flex flex-wrap gap-2">
              {f.images.map((src, i) => (
                <div key={i} className="relative h-20 w-28 overflow-hidden rounded-lg">
                  <img src={src} alt="" className="h-full w-full object-cover" />
                  <button type="button" aria-label="Remove photo" onClick={() => set("images", f.images.filter((_, j) => j !== i))} className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-background/90"><X className="h-3 w-3" /></button>
                </div>
              ))}
              <label className="grid h-20 w-28 cursor-pointer place-items-center rounded-lg border-2 border-dashed border-input text-xs text-muted-foreground hover:border-primary">
                + Upload<input type="file" accept="image/*" multiple className="hidden" onChange={(e) => upload(e.target.files)} />
              </label>
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.published} onChange={(e) => set("published", e.target.checked)} className="h-4 w-4 accent-primary" />Published (visible in catalogue)</label>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="h-10 rounded-lg px-4 text-sm hover:bg-secondary">Cancel</button>
            <button className="h-10 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
