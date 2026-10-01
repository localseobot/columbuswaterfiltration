import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-teal-accent">404</p>
      <h1 className="mt-3 text-4xl font-bold text-brand-950">Page not found</h1>
      <p className="mt-4 text-brand-700">
        That address is not on this site. Try the services list or request a
        free water test.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="rounded-full bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white">
          Home
        </Link>
        <Link
          href="/services"
          className="rounded-full border border-brand-300 px-5 py-2.5 text-sm font-semibold text-brand-800"
        >
          Services
        </Link>
        <Link
          href="/free-water-test"
          className="rounded-full border border-brand-300 px-5 py-2.5 text-sm font-semibold text-brand-800"
        >
          Free water test
        </Link>
      </div>
    </main>
  );
}
