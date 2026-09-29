import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[100svh] flex-col items-start justify-center px-6">
      <p className="font-mono text-[11px] tracking-[0.2em] text-accent uppercase">
        404
      </p>
      <h1 className="mt-4 text-5xl font-medium tracking-tight">
        This page is not here.
      </h1>
      <Link href="/" className="mt-8 text-sm text-muted hover:text-fg">
        Back home
      </Link>
    </main>
  );
}
