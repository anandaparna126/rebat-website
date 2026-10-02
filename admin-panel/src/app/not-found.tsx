import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 text-center">
      <h1 className="text-2xl font-bold text-ink">Page not found</h1>
      <Link href="/" className="text-sm font-medium text-brand">
        Back to dashboard
      </Link>
    </div>
  );
}
