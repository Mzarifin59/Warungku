/**
 * Konten halaman informasi: Tentang (`/tentang`) & Bantuan (`/bantuan`).
 */

import type { IconName } from "@/components/icon";

export const aboutValues: { icon: IconName; title: string; description: string }[] = [
  {
    icon: "heart",
    title: "Berpihak pada lokal",
    description:
      "Kami percaya usaha kecil punya cerita dan kualitas yang layak dikenal lebih luas.",
  },
  {
    icon: "shield",
    title: "Membangun kepercayaan",
    description:
      "Kami ingin membuat pengalaman menemukan warung terasa nyaman, jelas, dan mudah.",
  },
  {
    icon: "bag",
    title: "Tumbuh bersama",
    description:
      "Ketika pelanggan dan pemilik warung terhubung, komunitas lokal ikut berkembang.",
  },
];

export const faqs: { question: string; answer: string }[] = [
  {
    question: "Apa itu Warungku?",
    answer:
      "Warungku adalah katalog online untuk warung dan pelaku UMKM lokal. Kamu bisa menjelajahi warung, melihat produk dan harganya, lalu memesan langsung ke penjual lewat WhatsApp.",
  },
  {
    question: "Bagaimana cara mencari warung atau produk?",
    answer:
      "Ketik kata kunci di kolom pencarian di bagian atas halaman — misalnya nama warung, nama produk, kategori, atau kota. Kamu juga bisa membuka halaman Jelajahi untuk memfilter warung per kategori.",
  },
  {
    question: "Bagaimana cara memesan?",
    answer:
      "Buka halaman warung, tambahkan produk ke keranjang, lalu tekan Pesan. Isi nama dan catatan, dan Warungku akan menyiapkan pesan pesanan yang rapi untuk dikirim ke WhatsApp penjual.",
  },
  {
    question: "Bagaimana dengan pembayaran dan pengiriman?",
    answer:
      "Pembayaran dan pengiriman disepakati langsung antara kamu dan penjual lewat WhatsApp. Warungku tidak memproses pembayaran.",
  },
  {
    question: "Saya punya usaha. Bagaimana cara membuka warung?",
    answer:
      "Daftar gratis, isi nama warung dan nomor WhatsApp, tambahkan produk, lalu terbitkan. Link warungmu siap dibagikan ke pelanggan.",
  },
  {
    question: "Bagaimana jika warung yang saya cari belum tersedia?",
    answer:
      "Daftar warung terus bertambah. Coba kata kunci lain, atau ajak warung langgananmu untuk bergabung di Warungku.",
  },
];
