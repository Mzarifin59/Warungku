export type MitraProduct = {
  name: string;
  category: string;
  price: string;
  stock: number;
  status: "Tersedia" | "Stok menipis" | "Tidak tersedia";
  updatedAt: string;
};

export const mitraProducts: MitraProduct[] = [
  {
    name: "Ayam Lalapan",
    category: "Makanan",
    price: "Rp 15.000",
    stock: 18,
    status: "Tersedia",
    updatedAt: "Hari ini, 10.42",
  },
  {
    name: "Ayam Bakar Madu",
    category: "Makanan",
    price: "Rp 22.000",
    stock: 12,
    status: "Tersedia",
    updatedAt: "Hari ini, 09.15",
  },
  {
    name: "Paket Ayam Komplit",
    category: "Paket Hemat",
    price: "Rp 25.000",
    stock: 3,
    status: "Stok menipis",
    updatedAt: "Kemarin, 16.30",
  },
  {
    name: "Sambal Bawang",
    category: "Pelengkap",
    price: "Rp 5.000",
    stock: 25,
    status: "Tersedia",
    updatedAt: "Kemarin, 14.08",
  },
  {
    name: "Es Teh Manis",
    category: "Minuman",
    price: "Rp 5.000",
    stock: 0,
    status: "Tidak tersedia",
    updatedAt: "20 Okt 2026, 11.20",
  },
  {
    name: "Nasi Putih",
    category: "Pelengkap",
    price: "Rp 5.000",
    stock: 20,
    status: "Tersedia",
    updatedAt: "19 Okt 2026, 13.45",
  },
];
