import type { Metadata } from "next";
import { AuthPage } from "@/components/view/auth-page";

export const metadata: Metadata = {
  title: "Login — Warungku",
};

export default function LoginPage() {
  return <AuthPage mode="login" />;
}
