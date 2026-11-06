"use client";

import * as React from "react";
import { Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/input";
import { updateStore } from "@/lib/supabase/mutations";
import { useDashboardStore } from "@/lib/dashboard-provider";
import { logoColor, logoInitials } from "@/lib/home-data";

type DraftState = {
  name: string;
  description: string;
  logoUrl: string;
  imageBanner: string;
  operationHours: string;
};

function toDraft(store: {
  name: string;
  description?: string;
  logo?: string;
  imageBanner?: string;
  operationHours?: string;
}): DraftState {
  return {
    name: store.name,
    description: store.description ?? "",
    logoUrl: store.logo ?? "",
    imageBanner: store.imageBanner ?? "",
    operationHours: store.operationHours ?? "",
  };
}

export function StoreProfileCard() {
  const { store, refresh } = useDashboardStore();
  const [editing, setEditing] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [draft, setDraft] = React.useState<DraftState | null>(null);

  const openEditor = () => {
    if (!store) return;
    setDraft(toDraft(store));
    setEditing(true);
    setMessage(null);
  };

  const closeEditor = () => {
    setEditing(false);
    setDraft(null);
    setMessage(null);
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!store || !draft) return;
    setSaving(true);
    const result = await updateStore(store.id, {
      name: draft.name,
      description: draft.description,
      logoUrl: draft.logoUrl,
      imageBanner: draft.imageBanner,
      operationHours: draft.operationHours,
    });
    setSaving(false);
    if (result.ok) {
      await refresh();
      setMessage({ type: "success", text: result.message });
      closeEditor();
    } else {
      setMessage({ type: "error", text: result.message });
    }
  }

  // Tampilan kartu profil (read-only)
  if (!editing) {
    if (!store) return null;
    const hasLogo = Boolean(store.logo);
    const logoColorValue = hasLogo ? undefined : logoColor(store.name);
    const logoText = hasLogo ? undefined : logoInitials(store.name);

    return (
      <article className="flex min-h-[132px] items-start gap-3 rounded-2xl border border-[#dce5f0] bg-white p-4 sm:p-5">
        <span
          className="relative grid size-14 shrink-0 place-items-center overflow-hidden rounded-full border-[3px] border-white text-xs font-bold text-white shadow-sm"
          style={{ backgroundColor: logoColorValue }}
          aria-hidden="true"
        >
          {hasLogo ? (
            <img
              src={store.logo!}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            logoText
          )}
        </span>
        <div className="min-w-0 flex-1 pt-1">
          <h2 className="font-bold text-[#2b4568]">{store.name}</h2>
          <p className="mt-1 text-sm text-[#8b929c]">
            {store.description || "Belum ada deskripsi warung."}
          </p>
        </div>
        <button
          className="inline-flex shrink-0 items-center gap-1 rounded-md border border-[#e1e6ed] px-2.5 py-1.5 text-[10px] text-[#8794a5] transition hover:border-primary hover:text-primary"
          onClick={openEditor}
          type="button"
        >
          <Pencil size={12} /> Ubah Profil
        </button>
      </article>
    );
  }

  // Tampilan form edit
  return (
    <form
      className="rounded-2xl border border-[#dce5f0] bg-white p-4 sm:p-5"
      onSubmit={handleSubmit}
    >
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold text-[#2b4568]">Ubah Profil Warung</h2>
        <button
          className="grid size-8 place-items-center rounded-md text-[#71839b] hover:bg-[#f1f5f9]"
          onClick={closeEditor}
          type="button"
          aria-label="Tutup form"
        >
          <X size={14} />
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Nama Warung" htmlFor="store-name" required>
          <Input
            value={draft?.name ?? ""}
            onChange={(e) =>
              setDraft((prev) =>
                prev ? { ...prev, name: e.target.value } : prev,
              )
            }
            id="store-name"
            required
            minLength={3}
            maxLength={60}
          />
        </Field>
        <Field
          label="Jam Operasional"
          htmlFor="store-hours"
          hint="Contoh: 07:00 - 20:00"
        >
          <Input
            value={draft?.operationHours ?? ""}
            onChange={(e) =>
              setDraft((prev) =>
                prev ? { ...prev, operationHours: e.target.value } : prev,
              )
            }
            id="store-hours"
            placeholder="07:00 - 20:00"
          />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Deskripsi" htmlFor="store-desc">
            <Textarea
              value={draft?.description ?? ""}
              onChange={(e) =>
                setDraft((prev) =>
                  prev ? { ...prev, description: e.target.value } : prev,
                )
              }
              id="store-desc"
              maxLength={500}
            />
          </Field>
        </div>
        <Field
          label="URL Logo"
          htmlFor="store-logo"
          hint="URL gambar logo (format bulat disarankan)"
          optional
        >
          <Input
            value={draft?.logoUrl ?? ""}
            onChange={(e) =>
              setDraft((prev) =>
                prev ? { ...prev, logoUrl: e.target.value } : prev,
              )
            }
            id="store-logo"
            type="url"
            placeholder="https://example.com/logo.png"
          />
        </Field>
        <Field
          label="URL Gambar Banner"
          htmlFor="store-banner"
          hint="URL gambar banner (opsional)"
          optional
        >
          <Input
            value={draft?.imageBanner ?? ""}
            onChange={(e) =>
              setDraft((prev) =>
                prev ? { ...prev, imageBanner: e.target.value } : prev,
              )
            }
            id="store-banner"
            type="url"
            placeholder="https://example.com/banner.jpg"
          />
        </Field>
      </div>
      {message && (
        <p
          className={`mt-2 text-xs ${message.type === "error" ? "text-danger" : "text-success"}`}
          role="status"
        >
          {message.text}
        </p>
      )}
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="secondary" size="sm" type="button" onClick={closeEditor}>
          Batal
        </Button>
        <Button size="sm" loading={saving} type="submit">
          Simpan
        </Button>
      </div>
    </form>
  );
}
