"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { NavMenuItem } from "@/lib/nav-menus";

const CLOSE_DELAY = 150;

// cylib's own "hover a top nav link, its subsections drop down" pattern,
// matched against their live site: a tight stack of small pill links, no
// card, no images, no descriptions — just the subsection names, left-aligned
// under the trigger word. A short close delay so moving the cursor from the
// link down into the pills doesn't flicker it shut.
export function NavDropdown({
  href,
  label,
  items,
  linkColor,
  align = "left",
}: {
  href: string;
  label: string;
  items: NavMenuItem[];
  linkColor: string;
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  function show() {
    clearTimeout(closeTimer.current);
    setOpen(true);
  }
  function hide() {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY);
  }

  return (
    <li className="relative" style={{ color: linkColor }} onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
      <a href={href} className="transition-colors hover:text-brand" style={{ color: "inherit" }} aria-expanded={open}>
        {label}
      </a>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`absolute top-full z-50 mt-3 flex flex-col gap-[3px] ${align === "right" ? "right-0 items-end" : "left-0 items-start"}`}
          >
            {items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-lg bg-brand px-3 py-2.5 text-xs leading-none font-medium whitespace-nowrap text-white transition-colors hover:bg-brand-hover"
              >
                {item.title}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}
