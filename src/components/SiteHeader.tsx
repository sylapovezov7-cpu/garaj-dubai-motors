import { Link } from "@tanstack/react-router";
import { IMO_LINK } from "@/lib/cars";
import { MessageCircle } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-baseline gap-3">
          <span className="font-display text-2xl font-extrabold tracking-tight">GARAJ<span className="text-primary">.</span></span>
          <span className="hidden text-xs text-muted-foreground sm:inline">Dubai Cars. Turkmenistan.</span>
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          <Link to="/" className="rounded-md px-3 py-2 hover:bg-secondary" activeOptions={{ exact: true }} activeProps={{ className: "font-semibold" }}>Catalogue</Link>
          <Link to="/admin" className="rounded-md px-3 py-2 hover:bg-secondary" activeProps={{ className: "font-semibold" }}>Admin</Link>
          <a href={IMO_LINK} className="hidden items-center gap-2 rounded-md bg-primary px-3 py-2 font-medium text-primary-foreground hover:bg-primary/90 sm:inline-flex"><MessageCircle className="h-4 w-4" />IMO</a>
        </nav>
      </div>
    </header>
  );
}

export function PrototypeNote() {
  return <div className="bg-secondary py-1.5 text-center text-xs text-muted-foreground">Prototype — sample listings. Changes are kept only in this browser, not saved online yet.</div>;
}
