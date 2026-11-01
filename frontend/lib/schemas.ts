import { z } from "zod";

/**
 * Skema validasi form — WarungKu Fase 1.
 *
 * Dipakai oleh auth (A01/A02) dan form produk/toko (D02/D04).
 * Zod sudah ada di dependencies (tanpa menambahkan dep eksternal).
 */

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Nama minimal 2 karakter")
      .max(60, "Nama maksimal 60 karakter"),
    email: z.string().trim().email("Format email tidak valid"),
    password: z
      .string()
      .min(8, "Kata sandi minimal 8 karakter")
      .max(72, "Kata sandi maksimal 72 karakter"),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    path: ["passwordConfirmation"],
    message: "Konfirmasi kata sandi tidak cocok",
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email("Format email tidak valid"),
  password: z.string().min(1, "Masukkan kata sandi"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const storeFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Nama toko minimal 2 karakter")
      .max(80, "Nama toko maksimal 80 karakter"),
    slug: z
      .string()
      .trim()
      .min(3, "Alamat toko minimal 3 karakter")
      .max(40, "Alamat toko maksimal 40 karakter")
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Hanya huruf kecil, angka, dan tanda hubung",
      ),
    description: z.string().trim().max(500, "Maksimal 500 karakter").optional(),
    whatsapp: z
      .string()
      .trim()
      .min(1, "Nomor WhatsApp wajib diisi"),
  })
  .refine((data) => data.slug.length >= 3, {
    path: ["slug"],
    message: "Alamat toko minimal 3 karakter",
  });

export type StoreFormInput = z.infer<typeof storeFormSchema>;

export const productFormSchema = z
  .object({
    name: z.string().trim().min(1, "Nama produk wajib diisi").max(100, "Maksimal 100 karakter"),
    price: z
      .number()
      .int("Harga harus bilangan bulat")
      .min(0, "Harga tidak boleh negatif")
      .max(100_000_000, "Maksimal Rp 100.000.000"),
    categoryId: z.string().nullish(),
    description: z.string().trim().max(1000, "Maksimal 1.000 karakter").optional(),
    available: z.boolean().default(true),
  });

export type ProductFormInput = z.infer<typeof productFormSchema>;
