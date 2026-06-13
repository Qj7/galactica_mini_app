import { Suspense } from "react";

import { Header } from "@/components/Header";
import { RequestsPage } from "@/components/RequestsPage";

export default function Home() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <Suspense
          fallback={
            <div className="rounded-xl border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500">
              Loading requests…
            </div>
          }
        >
          <RequestsPage />
        </Suspense>
      </main>
    </>
  );
}
