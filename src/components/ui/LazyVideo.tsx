"use client";

import { useEffect, useRef, useState } from "react";

// Muted, looping background footage that only starts downloading once it is
// near the viewport, and pauses while scrolled away. Every section on the
// site uses autoplaying video, so rendering them all as plain <video
// autoPlay> made the browser fetch every clip on first load.
export function LazyVideo({
  src,
  className,
  rootMargin = "300px",
  ...rest
}: {
  src: string;
  className?: string;
  rootMargin?: string;
} & Omit<React.VideoHTMLAttributes<HTMLVideoElement>, "src" | "className">) {
  const ref = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          el.play().catch(() => {});
        } else if (!el.paused) {
          el.pause();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <video
      ref={ref}
      className={className}
      src={near ? src : undefined}
      preload="none"
      autoPlay={near}
      muted
      loop
      playsInline
      {...rest}
    />
  );
}
