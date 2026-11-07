import type { Metadata } from "next";
import { AuthPage } from "@/components/view/auth-page";

export const metadata: Metadata = {
  title: "Daftar — Warungku",
};

export default function RegisterPage() {
  return <AuthPage mode="register" />;
}
