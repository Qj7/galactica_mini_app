export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Galactica
        </p>
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          Registrations
        </h1>
      </div>
    </header>
  );
}
