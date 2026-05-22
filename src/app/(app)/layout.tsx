import Header from "@/components/Header";
import Link from "next/link";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-grey px-4 py-4">
        <div className="mx-auto max-w-7xl">
          <p className="text-center text-xs text-navy/30">
            Educational information only — not regulated financial advice. We are not an FSP-licensed entity.{" "}
            <Link href="/disclaimer" className="underline hover:text-navy/50">
              Disclaimer
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
