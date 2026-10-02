// Browser-side form submission to the ReBAT backend (Django, /backend).
// Kept separate from api.ts so client components don't bundle the
// server-side content fetchers (and the fallback article bodies with them).
export const PUBLIC_API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8012").replace(/\/$/, "");

export interface EnquiryPayload {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  topic?: string;
  message?: string;
  /** Honeypot — hidden from real visitors, so anything here is a bot. */
  website?: string;
}

/** Sends a website form submission to the backend (browser-side). Throws an
 * Error with a visitor-readable message on failure. */
export async function submitEnquiry(payload: EnquiryPayload): Promise<void> {
  let res: Response;
  try {
    res = await fetch(`${PUBLIC_API_URL}/api/enquiries/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, source_page: window.location.pathname }),
    });
  } catch {
    throw new Error("Couldn't reach our server. Please check your connection and try again.");
  }
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    throw new Error(data?.error ?? "Something went wrong. Please try again.");
  }
}

/** Reads the shared enquiry fields out of a submitted <form>. */
export function enquiryFromForm(form: HTMLFormElement, topic?: string): EnquiryPayload {
  const data = new FormData(form);
  const field = (name: string) => String(data.get(name) ?? "").trim();
  return {
    name: field("name"),
    email: field("email"),
    phone: field("phone"),
    company: field("company"),
    message: field("message"),
    website: field("website"),
    topic: topic ?? "General",
  };
}
