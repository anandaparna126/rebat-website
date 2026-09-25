import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE } from "@/lib/adminAuth";

export async function POST() {
  const jar = await cookies();
  jar.delete(ADMIN_SESSION_COOKIE);
  return Response.json({ ok: true });
}
