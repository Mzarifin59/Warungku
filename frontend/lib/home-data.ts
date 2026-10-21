import type { IconName } from "@/components/icon";

export type Category = {
  name: string;
  icon: IconName;
  color: string;
};

export type Store = {
  name: string;
  category: string;
  rating: string;
  reviews: number;
  location: string;
  image: string;
  logo: string;
  logoColor: string;
  tagline: string;
  sold: number;
  hours: string;
};

export type Product = {
  name: string;
  price: string;
  store: string;
  image: string;
  logo: string;
  logoColor: string;
};

export const categories: Category[] = [
  { name: "Makanan", icon: "utensils", color: "#ef4444" },
  { name: "Minuman", icon: "cup", color: "#f5c400" },
  { name: "Cemilan", icon: "popcorn", color: "#fb8737" },
  { name: "Kebutuhan Harian", icon: "basket", color: "#6383ed" },
  { name: "Roti & Kue", icon: "cake", color: "#e77e66" },
  { name: "Kerajinan", icon: "scissors", color: "#95958f" },
];

export const stores: Store[] = [
  {
    name: "Dapur Rasa",
    category: "Makanan",
    rating: "4.8",
    reviews: 120,
    location: "Bandung",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=720&q=85",
    logo: "DR",
    tagline: "Jago nya Ayam Lalapan",
    sold: 190,
    hours: "07:00 - 20:00",
    logoColor: "#ed7836",
  },
  {
    name: "Toko Roti Ibu",
    category: "Roti & Kue",
    rating: "4.5",
    reviews: 110,
    location: "Bandung",
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=720&q=85",
    logo: "RI",
    tagline: "Roti & kue segar setiap hari",
    sold: 340,
    hours: "06:00 - 18:00",
    logoColor: "#b9874a",
  },
  {
    name: "Keripik Makmur",
    category: "Cemilan",
    rating: "4.5",
    reviews: 100,
    location: "Bandung",
    image:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=720&q=85",
    logo: "KM",
    tagline: "Keripik renyah khas Bandung",
    sold: 520,
    hours: "08:00 - 21:00",
    logoColor: "#cf8955",
  },
  {
    name: "Sarapan Pagi",
    category: "Makanan",
    rating: "4.4",
    reviews: 98,
    location: "Bandung",
    image:
      "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=720&q=85",
    logo: "SP",
    tagline: "Sarapan hangat, harga bersahabat",
    sold: 410,
    hours: "05:30 - 11:00",
    logoColor: "#e7ab44",
  },
];

export const products: Product[] = [
  {
    name: "Donut Cokelat",
    price: "Rp 7.000",
    store: "Toko Roti Ibu",
    image:
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=480&q=85",
    logo: "RI",
    logoColor: "#b9874a",
  },
  {
    name: "Keripik Singkong",
    price: "Rp 15.000",
    store: "Keripik Makmur",
    image:
      "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=480&q=85",
    logo: "KM",
    logoColor: "#cf8955",
  },
  {
    name: "Sarapan Murah",
    price: "Rp 12.000",
    store: "Sarapan Pagi",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=480&q=85",
    logo: "SP",
    logoColor: "#e7ab44",
  },
  {
    name: "Kue Lapis Pandan",
    price: "Rp 10.000",
    store: "Toko Roti Ibu",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=480&q=85",
    logo: "RI",
    logoColor: "#b9874a",
  },
  {
    name: "Es Kopi Susu",
    price: "Rp 12.000",
    store: "Kopi Santosa",
    image:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=480&q=85",
    logo: "KS",
    logoColor: "#9b7653",
  },
  {
    name: "Ayam Bakar",
    price: "Rp 20.000",
    store: "Dapur Rasa",
    image:
      "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=480&q=85",
    logo: "DR",
    logoColor: "#ed7836",
  },
];

export const benefits: { icon: IconName; title: string; description: string }[] = [
  {
    icon: "devices",
    title: "Responsif",
    description: "Nyaman di semua perangkat",
  },
  {
    icon: "shield",
    title: "Aman & Terpercaya",
    description: "Transaksi lebih aman",
  },
  {
    icon: "headset",
    title: "Bantuan 24/7",
    description: "Siap membantu kapan saja",
  },
];

export function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, "dan")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getStoreBySlug(slug: string) {
  return stores.find((store) => slugify(store.name) === slug);
}
