export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/95 backdrop-blur supports-[backdrop-filter]:bg-slate-950/80">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Galactica
        </p>
        <h1 className="text-xl font-semibold text-slate-100 sm:text-2xl">
          Smart Warehouse
        </h1>
      </div>
    </header>
  );
}
