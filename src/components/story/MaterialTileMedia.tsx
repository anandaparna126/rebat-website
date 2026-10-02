"use client";

import { useEffect, useState } from "react";
import type { IncomingMaterial } from "@/lib/story";

// The picture area of a "What we accept" tile: the material's video if it has
// one, otherwise a slow crossfade through its photographs, otherwise its one
// photograph.
export function MaterialTileMedia({ material }: { material: IncomingMaterial }) {
  const photos = material.gallery && material.gallery.length > 1 ? material.gallery : material.image ? [material.image] : [];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (photos.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % photos.length), 3600);
    return () => clearInterval(id);
  }, [photos.length]);

  if (material.video) {
    return (
      <video
        src={material.video}
        poster={material.image}
        aria-label={material.name}
        className="h-56 w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      />
    );
  }

  if (photos.length === 0) return null;

  return (
    <div className="relative h-56 w-full overflow-hidden bg-grey-100">
      {photos.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt={i === index ? material.name : ""}
          aria-hidden={i !== index}
          loading="lazy"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${i === index ? "opacity-100" : "opacity-0"}`}
        />
      ))}
      {photos.length > 1 && (
        <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5" aria-hidden="true">
          {photos.map((_, i) => (
            <span key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === index ? "w-5 bg-white" : "w-1.5 bg-white/50"}`} />
          ))}
        </div>
      )}
    </div>
  );
}
