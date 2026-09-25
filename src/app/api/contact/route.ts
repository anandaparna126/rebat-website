// POST /api/contact — forwards the "Contact us" form (see
// src/components/contact/ContactForm.tsx) to the RMS backend's public
// website-contact endpoint, same "this Next.js app is a thin proxy in
// front of RMS" pattern as src/lib/careers.ts. Keeps the RMS host and any
// future auth details server-side, out of the browser.
const DJANGO_API = process.env.RMS_DJANGO_API_URL || "http://localhost:8000/api";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const host = (request.headers.get("x-forwarded-host") || request.headers.get("host") || "")
    .split(",")[0]
    .trim();
  const slug = process.env.CAREERS_COMPANY_SLUG;

  try {
    const res = await fetch(`${DJANGO_API}/public/website-contact/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: body.name,
        email: body.email,
        phone: body.phone,
        message: body.message,
        hp_field: body.hp_field,
        source_url: typeof body.source_url === "string" ? body.source_url.slice(0, 300) : "",
        website_host: host,
        company_slug: slug,
      }),
      signal: AbortSignal.timeout(8000),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.success) {
      return Response.json(
        { error: data?.error || "Something went wrong. Please try again." },
        { status: res.ok ? 502 : res.status },
      );
    }
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Could not reach the server. Please try again in a moment." }, { status: 502 });
  }
}
