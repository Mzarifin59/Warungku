"use client";

import * as React from "react";
import Link from "next/link";
import { Check, Copy, ExternalLink, MessageCircle } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Toggle } from "@/components/ui/toggle";
import { useDashboardStore } from "@/lib/dashboard-provider";
import { normalizeWhatsApp } from "@/lib/constants";
import { setStoreStatus } from "@/lib/supabase/mutations";
import type { Store } from "@/lib/types";

/** Alasan toko belum boleh terbit (docs 04 F1), atau `null` bila boleh. */
export function publishBlocker(store: Store): string | null {
  if (!normalizeWhatsApp(store.whatsappNumber))
    return "Isi nomor WhatsApp yang valid untuk menerbitkan warung.";
  if (!store.products.some((p) => p.available))
    return "Tambahkan minimal 1 produk yang tersedia untuk menerbitkan warung.";
  return null;
}

/** Hook untuk terbit / tarik warung dengan dialog konfirmasi. */
export function usePublish(store: Store) {
  const { patchStore, toast } = useDashboardStore();
  const [busy, setBusy] = React.useState(false);
  const [confirmOff, setConfirmOff] = React.useState(false);

  async function apply(next: Store["status"]) {
    setBusy(true);
    const result = await setStoreStatus(store.id, next);
    setBusy(false);
    setConfirmOff(false);
    if (!result.ok) {
      toast({ text: result.message, variant: "error" });
      return;
    }
    patchStore((s) => ({ ...s, status: next }));
    toast({
      text:
        next === "published"
          ? "Warungmu sudah tayang! Bagikan link-nya ke pelanggan."
          : "Warung disembunyikan dari pelanggan.",
    });
  }

  const dialog = (
    <Dialog
      open={confirmOff}
      onClose={() => setConfirmOff(false)}
      title="Sembunyikan warung?"
      confirmLabel="Ya, sembunyikan"
      confirmVariant="destructive"
      confirmLoading={busy}
      onConfirm={() => void apply("draft")}
    >
      Warungmu tidak akan terlihat lagi oleh pelanggan sampai diterbitkan
      kembali. Data produk tetap aman.
    </Dialog>
  );

  return {
    busy,
    blocker: publishBlocker(store),
    publish: () => void apply("published"),
    requestUnpublish: () => setConfirmOff(true),
    dialog,
  };
}

/** Kartu pengaturan terbit (D02). */
export function PublishCard({ store }: { store: Store }) {
  const { busy, blocker, publish, requestUnpublish, dialog } = usePublish(store);
  const published = store.status === "published";

  return (
    <section className="rounded-2xl border border-[#dce5f0] bg-white p-4 sm:p-5" aria-labelledby="publish-title">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 id="publish-title" className="text-sm font-bold text-[#2b4568]">
            Status warung:{" "}
            <span className={published ? "text-success" : "text-warning"}>
              {published ? "Terbit" : "Draft"}
            </span>
          </h2>
          <p className="mt-1 text-xs text-[#8794a5]">
            {published
              ? "Warungmu bisa dilihat dan dipesan oleh siapa saja lewat link."
              : "Warungmu belum terlihat oleh pelanggan."}
          </p>
          {!published && blocker && (
            <p className="mt-2 text-xs text-warning">{blocker}</p>
          )}
        </div>
        <Toggle
          checked={published}
          disabled={busy || (!published && Boolean(blocker))}
          label={published ? "Sembunyikan warung" : "Terbitkan warung"}
          onCheckedChange={(next) => (next ? publish() : requestUnpublish())}
        />
      </div>
      {dialog}
    </section>
  );
}

const noopSubscribe = () => () => {};

/** Kartu link warung: salin, bagikan ke WhatsApp, lihat (docs 04 F1). */
export function ShareLinkCard({ store }: { store: Store }) {
  const [copied, setCopied] = React.useState(false);
  const origin = React.useSyncExternalStore(
    noopSubscribe,
    () => window.location.origin,
    () => "",
  );

  const path = `/warung/${store.slug}`;
  const url = `${origin}${path}`;
  const waShare = `https://wa.me/?text=${encodeURIComponent(
    `Yuk pesan di ${store.name}: ${url}`,
  )}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Salin link warung:", url);
    }
  }

  return (
    <article className="rounded-2xl border border-[#c6dcf8] bg-[#dcecff] p-4">
      <h2 className="text-xs font-semibold text-[#334f73]">Link Warung Kamu</h2>
      <div className="mt-2 flex h-10 items-center gap-2 rounded-lg border border-[#d3dce8] bg-white pl-3 text-xs text-[#5f7189]">
        <span className="min-w-0 flex-1 truncate">{url || path}</span>
        <button
          type="button"
          onClick={() => void copy()}
          className="grid size-10 shrink-0 place-items-center text-[#7f8da0] hover:text-primary"
          aria-label="Salin link warung"
        >
          {copied ? <Check size={15} className="text-success" /> : <Copy size={15} />}
        </button>
      </div>
      <p className="mt-1.5 text-[11px] text-[#5f7189]" aria-live="polite">
        {copied ? "Link tersalin!" : "Bagikan link ini ke pelangganmu."}
      </p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <a
          href={waShare}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-9 items-center justify-center gap-1.5 rounded-lg bg-whatsapp text-xs font-medium text-white hover:bg-whatsapp-hover"
        >
          <MessageCircle size={14} /> Bagikan
        </a>
        <Link
          href={path}
          target="_blank"
          className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[#b8cfee] bg-white text-xs font-medium text-[#334f73] hover:border-primary hover:text-primary"
        >
          <ExternalLink size={14} /> Lihat Warung
        </Link>
      </div>
    </article>
  );
}
