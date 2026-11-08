import Image from "next/image";
import { cn } from "@/lib/utils";

/** Logo WarungKu (`public/logo_warungku.svg`). Dekoratif: beri label di link pembungkusnya. */
export function LogoMark({ size = 32, className }: { size?: number; className?: string }) {
  return (
    <Image
      src="/logo_warungku.svg"
      alt=""
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      style={{ width: size, height: size }}
      priority
      unoptimized
    />
  );
}
