"use client";

import { useRef, useState } from "react";
import { SITE_URL, uploadImage } from "@/lib/api";
import { useToast } from "@/components/Toast";
import { Spinner } from "@/components/ui";

/** Site-relative paths (e.g. "/images/newsroom/x.webp") live on the website
 * itself, so previews need the site's origin in front of them. */
export function previewUrl(src: string) {
  return src.startsWith("/") ? `${SITE_URL}${src}` : src;
}

// An image field that accepts either a pasted URL / site path or an upload
// to the backend (which returns the stored image's public URL).
export function ImageInput({
  value,
  onChange,
  label = "Image",
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const toast = useToast();

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    try {
      onChange(await uploadImage(file));
      toast("Image uploaded");
    } catch (err) {
      toast(err instanceof Error ? err.message : "Upload failed", "error");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div>
      <span className="label">{label}</span>
      <div className="flex gap-3">
        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg border border-grey-200 bg-grey-50">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl(value)} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-full items-center justify-center text-xs text-grey-400">No image</span>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <input
            className="field"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Paste an image URL or upload one"
          />
          <div className="flex gap-2">
            <button type="button" className="btn-secondary" onClick={() => fileRef.current?.click()} disabled={uploading}>
              {uploading ? <Spinner /> : null}
              {uploading ? "Uploading…" : "Upload image"}
            </button>
            {value && (
              <button type="button" className="btn-secondary" onClick={() => onChange("")}>
                Remove
              </button>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>
      </div>
    </div>
  );
}
