"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field, Input, Textarea } from "@/components/ui/input";
import { ImagePicker } from "@/components/mitra/image-picker";
import { useDashboardStore } from "@/lib/dashboard-provider";
import { useSession } from "@/lib/session-store";
import {
  createStore,
  isSlugAvailable,
  updateStore,
  type StoreInput,
} from "@/lib/supabase/mutations";
import {
  SLUG_MAX,
  formatWhatsApp,
  isReservedSlug,
  isSlugLengthOk,
  normalizeWhatsApp,
  toSlug,
} from "@/lib/constants";
import type { Store } from "@/lib/types";

type Draft = {
  name: string;
  slug: string;
  whatsapp: string;
  description: string;
  location: string;
  operationHours: string;
  logoUrl: string;
  imageBanner: string;
};

type Errors = Partial<Record<keyof Draft, string>>;
type SlugState = "idle" | "checking" | "available" | "taken" | "unknown";

function toDraft(store: Store | null): Draft {
  return {
    name: store?.name ?? "",
    slug: store?.slug ?? "",
    whatsapp: store ? formatWhatsApp(store.whatsappNumber) : "",
    description: store?.description ?? "",
    location: store?.location ?? "",
    operationHours: store?.operationHours ?? "",
    logoUrl: store?.logo ?? "",
    imageBanner: store?.imageBanner ?? "",
  };
}

function validate(draft: Draft): Errors {
  const errors: Errors = {};
  const name = draft.name.trim();
  if (name.length < 2) errors.name = "Nama warung minimal 2 karakter.";
  else if (name.length > 80) errors.name = "Nama warung maksimal 80 karakter.";

  if (!isSlugLengthOk(draft.slug))
    errors.slug = `Alamat toko 3–${SLUG_MAX} karakter.`;
  else if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(draft.slug))
    errors.slug = "Hanya huruf kecil, angka, dan tanda hubung.";
  else if (isReservedSlug(draft.slug))
    errors.slug = "Alamat ini tidak bisa dipakai. Pilih yang lain.";

  if (!draft.whatsapp.trim()) errors.whatsapp = "Nomor WhatsApp wajib diisi.";
  else if (!normalizeWhatsApp(draft.whatsapp))
    errors.whatsapp = "Nomor tidak valid. Contoh: 0812 3456 7890.";

  if (draft.description.length > 500)
    errors.description = "Deskripsi maksimal 500 karakter.";
  return errors;
}

export function StoreForm({ store }: { store: Store | null }) {
  const isCreate = !store;
  const router = useRouter();
  const { session } = useSession();
  const { refresh, patchStore, toast } = useDashboardStore();

  const initial = toDraft(store);
  const storeId = store?.id;
  const storeSlug = store?.slug;
  const [draft, setDraft] = React.useState<Draft>(initial);
  const [errors, setErrors] = React.useState<Errors>({});
  const [formError, setFormError] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [uploading, setUploading] = React.useState(0);
  const [slugTouched, setSlugTouched] = React.useState(!isCreate);
  const [slugState, setSlugState] = React.useState<SlugState>("idle");
  const [confirmSlug, setConfirmSlug] = React.useState(false);

  // Sinkronkan ulang draft hanya bila field profil dari server berubah
  // (bukan saat status/produk di-patch) — pola "adjust state on render".
  const initialKey = JSON.stringify(initial);
  const [syncedKey, setSyncedKey] = React.useState(initialKey);
  if (syncedKey !== initialKey) {
    setSyncedKey(initialKey);
    setDraft(initial);
  }

  const dirty = (Object.keys(draft) as (keyof Draft)[]).some(
    (key) => draft[key] !== initial[key],
  );

  // Peringatan saat meninggalkan form yang belum disimpan.
  React.useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  // Cek ketersediaan slug (debounce ~400ms).
  React.useEffect(() => {
    const slug = draft.slug;
    let cancelled = false;
    const skip =
      !isSlugLengthOk(slug) || isReservedSlug(slug) || slug === storeSlug;
    const timer = window.setTimeout(
      async () => {
        if (skip) {
          setSlugState("idle");
          return;
        }
        setSlugState("checking");
        const available = await isSlugAvailable(slug, storeId);
      if (cancelled) return;
        setSlugState(
          available === null ? "unknown" : available ? "available" : "taken",
        );
      },
      skip ? 0 : 400,
    );
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [draft.slug, storeId, storeSlug]);

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "name" && !slugTouched) {
        next.slug = toSlug(String(value)).slice(0, SLUG_MAX);
      }
      return next;
    });
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setFormError("");
    const found = validate(draft);
    if (slugState === "taken") found.slug = "Alamat toko ini sudah dipakai.";
    setErrors(found);
    const firstKey = Object.keys(found)[0];
    if (firstKey) {
      document.getElementById(`store-${firstKey}`)?.focus();
      return;
    }
    if (store?.status === "published" && draft.slug !== store.slug) {
      setConfirmSlug(true);
      return;
    }
    void save();
  }

  async function save() {
    if (!session) return;
    setConfirmSlug(false);
    setSaving(true);
    const input: StoreInput = {
      name: draft.name,
      slug: draft.slug,
      whatsappNumber: normalizeWhatsApp(draft.whatsapp)!,
      description: draft.description,
      location: draft.location,
      operationHours: draft.operationHours,
      logoUrl: draft.logoUrl,
      imageBanner: draft.imageBanner,
    };

    if (isCreate) {
      const result = await createStore(session.user.id, input);
      if (!result.ok) {
        setSaving(false);
        setFormError(result.message);
        return;
      }
      await refresh();
      toast({ text: "Warung dibuat! Sekarang tambahkan produk pertamamu." });
      router.push("/mitra/produk/baru");
      return;
    }

    const result = await updateStore(store.id, input);
    setSaving(false);
    if (!result.ok) {
      setFormError(result.message);
      return;
    }
    patchStore((s) => ({
      ...s,
      name: input.name.trim(),
      slug: input.slug,
      whatsappNumber: input.whatsappNumber,
      description: draft.description.trim() || undefined,
      location: draft.location.trim() || undefined,
      operationHours: draft.operationHours.trim() || undefined,
      logo: draft.logoUrl || undefined,
      imageBanner: draft.imageBanner || undefined,
    }));
    toast({ text: "Profil warung tersimpan." });
  }

  const waPreview = normalizeWhatsApp(draft.whatsapp);

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-[#dce5f0] bg-white p-4 sm:p-6"
    >
      <h2 className="text-sm font-bold text-[#2b4568]">
        {isCreate ? "Data Warung" : "Profil Warung"}
      </h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nama warung" htmlFor="store-name" required error={errors.name}>
          <Input
            id="store-name"
            value={draft.name}
            onChange={(e) => set("name", e.target.value)}
            maxLength={80}
            placeholder="Contoh: Dapur Bu Sari"
            error={Boolean(errors.name)}
            autoComplete="organization"
          />
        </Field>

        <Field
          label="Alamat toko"
          htmlFor="store-slug"
          required
          hint="Ini alamat link warungmu. Pilih yang mudah diingat."
          error={errors.slug}
        >
          <div
            className={`flex h-11 items-center overflow-hidden rounded-md border bg-surface focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 ${
              errors.slug ? "border-danger" : "border-border-strong"
            }`}
          >
            <span className="shrink-0 border-r border-border bg-surface-muted px-2.5 py-3 text-xs text-text-muted">
              warungku.id/warung/
            </span>
            <input
              id="store-slug"
              value={draft.slug}
              onChange={(e) => {
                setSlugTouched(true);
                set(
                  "slug",
                  e.target.value
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                    .replace(/[^a-z0-9-]/g, "")
                    .slice(0, SLUG_MAX),
                );
              }}
              onBlur={() => set("slug", toSlug(draft.slug))}
              className="h-full min-w-0 flex-1 bg-transparent px-2.5 text-base text-text outline-none"
              aria-describedby="store-slug-status"
              autoCapitalize="none"
              spellCheck={false}
            />
          </div>
          <SlugStatus state={slugState} />
        </Field>

        <Field
          label="Nomor WhatsApp"
          htmlFor="store-whatsapp"
          required
          hint="Nomor ini tampil di warungmu dan dipakai untuk menerima pesanan."
          error={errors.whatsapp}
        >
          <Input
            id="store-whatsapp"
            value={draft.whatsapp}
            onChange={(e) => set("whatsapp", e.target.value)}
            onBlur={() => waPreview && set("whatsapp", formatWhatsApp(waPreview))}
            inputMode="tel"
            autoComplete="tel"
            placeholder="0812 3456 7890"
            error={Boolean(errors.whatsapp)}
          />
        </Field>

        <Field label="Lokasi" htmlFor="store-location" optional hint="Kota atau area, mis. Bandung">
          <Input
            id="store-location"
            value={draft.location}
            onChange={(e) => set("location", e.target.value)}
            maxLength={60}
            placeholder="Bandung"
          />
        </Field>

        <Field label="Jam operasional" htmlFor="store-hours" optional hint="Contoh: 07.00 - 20.00">
          <Input
            id="store-hours"
            value={draft.operationHours}
            onChange={(e) => set("operationHours", e.target.value)}
            maxLength={40}
            placeholder="07.00 - 20.00"
          />
        </Field>

        <div className="sm:col-span-2">
          <Field
            label="Deskripsi"
            htmlFor="store-description"
            optional
            hint={`${draft.description.length}/500 karakter`}
            error={errors.description}
          >
            <Textarea
              id="store-description"
              value={draft.description}
              onChange={(e) => set("description", e.target.value)}
              maxLength={500}
              rows={3}
              placeholder="Ceritakan singkat tentang warungmu."
            />
          </Field>
        </div>

        <ImagePicker
          id="store-logo"
          label="Logo"
          kind="logo"
          shape="circle"
          value={draft.logoUrl}
          onChange={(url) => set("logoUrl", url)}
          onUploadingChange={(u) => setUploading((n) => n + (u ? 1 : -1))}
        />
        <ImagePicker
          id="store-banner"
          label="Banner"
          kind="banner"
          shape="wide"
          value={draft.imageBanner}
          onChange={(url) => set("imageBanner", url)}
          onUploadingChange={(u) => setUploading((n) => n + (u ? 1 : -1))}
        />
      </div>

      {formError && (
        <p className="rounded-lg bg-danger-subtle px-3 py-2 text-sm text-danger" role="alert">
          {formError}
        </p>
      )}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        {!isCreate && dirty && (
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setDraft(initial);
              setErrors({});
              setFormError("");
            }}
          >
            Batalkan perubahan
          </Button>
        )}
        <Button
          type="submit"
          loading={saving}
          loadingLabel="Menyimpan…"
          disabled={(!isCreate && !dirty) || uploading > 0}
        >
          {isCreate ? "Buat Warung" : "Simpan"}
        </Button>
      </div>

      <Dialog
        open={confirmSlug}
        onClose={() => setConfirmSlug(false)}
        title="Ubah alamat toko?"
        confirmLabel="Ya, ubah"
        onConfirm={() => void save()}
        confirmLoading={saving}
      >
        Link lama <strong>/warung/{store?.slug}</strong> akan berhenti bekerja.
        Pelanggan yang menyimpan link lama tidak bisa membuka warungmu lagi.
      </Dialog>
    </form>
  );
}

function SlugStatus({ state }: { state: SlugState }) {
  const content: Record<SlugState, React.ReactNode> = {
    idle: null,
    checking: (
      <>
        <Loader2 size={12} className="animate-spin motion-reduce:animate-none" /> Memeriksa…
      </>
    ),
    available: (
      <>
        <Check size={12} /> Tersedia
      </>
    ),
    taken: (
      <>
        <X size={12} /> Sudah dipakai
      </>
    ),
    unknown: null,
  };
  const tone =
    state === "available"
      ? "text-success"
      : state === "taken"
        ? "text-danger"
        : "text-text-muted";
  return (
    <p
      id="store-slug-status"
      aria-live="polite"
      className={`flex min-h-4 items-center gap-1 text-xs ${tone}`}
    >
      {content[state]}
    </p>
  );
}
