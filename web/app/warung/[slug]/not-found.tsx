import Link from "next/link";
import { Store } from "lucide-react";

export default function StoreNotFound() {
  return (
    <div className="mx-auto grid min-h-[60vh] max-w-md place-items-center px-4 py-16 text-center">
      <div>
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-secondary text-primary">
          <Store size={26} aria-hidden="true" />
        </span>
        <h1 className="mt-4 text-xl font-bold text-text">Warung tidak ditemukan</h1>
        <p className="mt-2 text-sm text-text-muted">
          Alamat warung mungkin salah, atau warung ini belum buka.
        </p>
        <div className="mt-6 flex flex-col items-center gap-3">
          <Link
            href="/warung"
            className="inline-flex h-11 items-center rounded-md bg-primary px-5 text-sm font-medium text-white hover:bg-primary/90"
          >
            Jelajahi Warungku
          </Link>
          <Link href="/daftar" className="text-sm font-medium text-primary hover:underline">
            Buat warungmu sendiri
          </Link>
        </div>
      </div>
    </div>
  );
}
