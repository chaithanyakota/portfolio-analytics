import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Navbar */}
      <header className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <h1 className="text-lg font-semibold">Portfolio Analytics</h1>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-lg border border-zinc-800 px-4 py-2 text-sm hover:bg-zinc-900"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-white"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="max-w-3xl text-4xl font-semibold leading-tight">
          Track your investment portfolio with real-time analytics.
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-zinc-400">
          This project is full-stack web application that can
          record trades, monitor portfolio value, and understand asset
          allocation through a clean dashboard.
        </p>

        <div className="mt-8 flex gap-4">
          <Link
            href="/register"
            className="rounded-lg bg-zinc-100 px-6 py-3 font-medium text-zinc-900 hover:bg-white"
          >
            Create an account
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-zinc-800 px-6 py-3 hover:bg-zinc-900"
          >
            Sign in
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 pb-8">
        <div className="grid gap-6 md:grid-cols-3">
          <Feature
            title="Portfolio Management"
            description="Create multiple portfolios and track your holdings with accurate cost basis and ownership validation."
          />
          <Feature
            title="Transaction Tracking"
            description="Record buy and sell trades with strict validation to ensure data correctness."
          />
          <Feature
            title="Real-Time Analytics"
            description="View portfolio value, unrealized gains, and asset allocation using live market data."
          />
        </div>
      </section>

      {/* Source Code */}
      <section className="mx-auto max-w-6xl px-4 pb-8">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-8">
          <h3 className="text-lg font-semibold">Open Source</h3>
          <p className="mt-3 max-w-2xl text-sm text-zinc-400">
            This project is open source. The repository includes the
            complete frontend, backend, database migrations, and deployment
            configuration.
          </p>

          <div className="mt-6">
            <a
              href="https://github.com/chaithanyakota/portfolio-analytics"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 px-5 py-3 text-sm hover:bg-zinc-900"
            >
              View source code on GitHub →
            </a>
          </div>
        </div>
      </section>


            {/* Footer
      <footer className="border-t border-zinc-800">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm text-zinc-500 md:flex-row md:items-center md:justify-between">
          <span>
            Built by Chaithanya Kota • Full-stack portfolio analytics platform
          </span>
          <a
            href="https://github.com/chaithanyakota"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-zinc-300"
          >
            GitHub
          </a>
        </div>
      </footer> */}

    </main>
  );
}

function Feature({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-zinc-400">{description}</p>
    </div>
  );
}
