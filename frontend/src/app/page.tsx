import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  BarChart3Icon,
  ArrowRightLeftIcon,
  PieChartIcon,
  GithubIcon,
} from "lucide-react";

const features = [
  {
    icon: BarChart3Icon,
    title: "Portfolio Management",
    description:
      "Create multiple portfolios and track your holdings with accurate cost basis and ownership validation.",
  },
  {
    icon: ArrowRightLeftIcon,
    title: "Transaction Tracking",
    description:
      "Record buy and sell trades with strict validation to ensure data correctness.",
  },
  {
    icon: PieChartIcon,
    title: "Real-Time Analytics",
    description:
      "View portfolio value, unrealized gains, and asset allocation using live market data.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <h1 className="text-lg font-semibold">Portfolio Analytics</h1>
          <div className="flex items-center gap-3">
            <Button variant="outline" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight">
          Track your investment portfolio with real-time analytics.
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          A full-stack web application to record trades, monitor portfolio
          value, and understand asset allocation through a clean dashboard.
        </p>

        <div className="mt-8 flex gap-4">
          <Button size="lg" asChild>
            <Link href="/register">Create an account</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
        </div>
      </section>

      <Separator className="mx-auto max-w-6xl" />

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title}>
              <CardHeader>
                <f.icon className="size-5 text-muted-foreground" />
                <CardTitle className="text-sm">{f.title}</CardTitle>
                <CardDescription>{f.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <Card>
          <CardHeader>
            <CardTitle>Open Source</CardTitle>
            <CardDescription className="max-w-2xl">
              This project is open source. The repository includes the complete
              frontend, backend, database migrations, and deployment
              configuration.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild>
              <a
                href="https://github.com/chaithanyakota/portfolio-analytics"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GithubIcon />
                View on GitHub
              </a>
            </Button>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
