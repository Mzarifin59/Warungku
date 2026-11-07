import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kebijakan Privasi — WarungKu",
  description:
    "Bagaimana WarungKu mengumpulkan dan menggunakan datamu.",
  robots: { index: false, follow: false },
};

export default function PrivacyPage() {
  return (
    <main className="container mx-auto max-w-prose px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold tracking-tight text-text sm:text-3xl">
        Kebijakan Privasi
      </h1>
      <p className="mt-3 text-sm leading-6 text-text-muted">
        Dokumen ini menjelaskan data apa yang kami kumpulkan, mengapa, dan
        bagaimana kamu dapat menghapus akunmu. Terakhir diperbarui:
        November 2026.
      </p>

      <section className="mt-8 space-y-6">
        <section>
          <h2 className="text-lg font-semibold text-text">Data yang kami kumpulkan</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-text-muted">
            <li>
              Nama, alamat email, dan kata sandi saat kamu mendaftar.
            </li>
            <li>
              Data tokomu: nama, deskripsi, alamat tautan, logo, dan{" "}
              <strong className="font-medium text-text">nomor WhatsApp</strong>.
            </li>
            <li>
              Produk yang kamu kelola: nama, harga, foto, dan kategori.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text">
            Nomor WhatsApp tokomu bersifat publik
          </h2>
          <p className="mt-2 text-sm leading-6 text-text-muted">
            Nomor WhatsApp yang kamu isikan akan tampil di halaman tokomu
            dan menjadi tujuan pesanan dari pelanggan. Ini adalah cara
            WarungKu bekerja — pelanggan mengirim pesan ke nomor tersebut
            setelah memilih produk.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text">
            Data pelanggan tidak disimpan
          </h2>
          <p className="mt-2 text-sm leading-6 text-text-muted">
            Kami <strong className="font-medium text-text">tidak</strong>{" "}
            menyimpan nama, catatan, atau riwayat pesanan dari pelanggan
            yang pesan lewat tokomu. Percakapan terjadi langsung di
            WhatsApp antara penjual dan pembeli.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-text">
            Menghapus akunmu
          </h2>
          <p className="mt-2 text-sm leading-6 text-text-muted">
            Kamu dapat menghapus akun dan seluruh datanya kapan saja.
            Hubungi tim kami melalui email{" "}
            <a
              className="font-medium text-primary hover:underline"
              href="mailto:halo@warungku.id"
            >
              halo@warungku.id
            </a>{" "}
            dan sebutkan alamat email akunmu.
          </p>
        </section>
      </section>
    </main>
  );
}
