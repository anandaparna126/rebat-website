// Distinguishes an external link (e.g. the external Jobs portal) from an
// internal route, so a plain <a> knows to open it in a new tab.
export function isExternalHref(href: string): boolean {
  return /^https?:\/\//.test(href);
}
