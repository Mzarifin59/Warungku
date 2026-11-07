"use client";

import * as React from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { useSession } from "@/lib/session-store";
import { IMAGE_ACCEPT, uploadImage } from "@/lib/supabase/mutations";
import { cn } from "@/lib/utils";

/**
 * ImagePicker — pilih foto dari perangkat, kompres & unggah ke Supabase
 * Storage, lalu kembalikan URL publik lewat `onChange`.
 */
export function ImagePicker({
  id,
  label,
  value,
  onChange,
  kind,
  shape = "square",
  onUploadingChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (url: string) => void;
  kind: "logo" | "banner" | "product";
  shape?: "square" | "circle" | "wide";
  onUploadingChange?: (uploading: boolean) => void;
}) {
  const { session } = useSession();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState("");

  async function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !session) return;
    setError("");
    setUploading(true);
    onUploadingChange?.(true);
    const result = await uploadImage(session.user.id, file, kind);
    setUploading(false);
    onUploadingChange?.(false);
    if (result.ok) onChange(result.data);
    else setError(result.message);
  }

  const frame = cn(
    "relative grid shrink-0 place-items-center overflow-hidden border border-dashed border-[#bcd0e8] bg-[#f5f9ff] text-[#7f93ad]",
    shape === "circle" && "size-20 rounded-full",
    shape === "square" && "size-24 rounded-xl",
    shape === "wide" && "aspect-[3/1] w-full max-w-sm rounded-xl",
  );

  return (
    <div className="space-y-1.5">
      <span className="block text-sm font-medium text-text" id={`${id}-label`}>
        {label} <span className="text-text-subtle">(opsional)</span>
      </span>
      <div className="flex flex-wrap items-center gap-3">
        <div className={frame}>
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element -- URL storage dinamis
            <img src={value} alt="" className="size-full object-cover" />
          ) : (
            <ImagePlus size={22} aria-hidden="true" />
          )}
          {uploading && (
            <span className="absolute inset-0 grid place-items-center bg-white/70">
              <Loader2 className="animate-spin text-primary motion-reduce:animate-none" size={20} />
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            aria-describedby={`${id}-label`}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#dce5f0] px-3 text-xs font-medium text-[#5f7189] transition hover:border-primary hover:text-primary disabled:opacity-50"
          >
            <ImagePlus size={14} aria-hidden="true" />
            {uploading ? "Mengunggah…" : value ? "Ganti foto" : "Pilih foto"}
          </button>
          {value && !uploading && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs text-[#8794a5] transition hover:bg-rose-50 hover:text-rose-600"
            >
              <Trash2 size={14} aria-hidden="true" /> Hapus
            </button>
          )}
        </div>
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={IMAGE_ACCEPT}
          className="sr-only"
          tabIndex={-1}
          onChange={handleFile}
        />
      </div>
      <p className="text-xs text-text-muted">JPG, PNG, atau WebP. Maks 2 MB.</p>
      {error && (
        <p className="text-xs text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
