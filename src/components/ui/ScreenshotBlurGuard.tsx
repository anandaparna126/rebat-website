"use client";

import { useEffect } from "react";

// Blurs the whole page while the tab isn't the visible one (switched away,
// minimised, or — on mobile — backgrounded). This is NOT real screenshot
// protection: no browser exposes an event for "the user just took a
// screenshot," so Print Screen, the OS Snipping Tool, a phone's screenshot
// button, and most screen-capture software all fire with the tab still
// reporting as visible and never trigger this at all. This only catches
// the narrower case of someone switching to another window/app with this
// tab still open behind it. Added anyway at the user's explicit direction
// after that limitation was flagged.
export function ScreenshotBlurGuard() {
  useEffect(() => {
    function update() {
      const hidden = document.visibilityState !== "visible";
      document.documentElement.style.filter = hidden ? "blur(22px)" : "";
    }
    document.documentElement.style.transition = "filter 200ms ease";
    document.addEventListener("visibilitychange", update);
    return () => {
      document.removeEventListener("visibilitychange", update);
      document.documentElement.style.filter = "";
    };
  }, []);

  return null;
}
