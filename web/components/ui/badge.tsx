import { cn } from "@/lib/utils";

type Tone =
  | "success"
  | "success-subtle"
  | "warning"
  | "warning-subtle"
  | "danger"
  | "danger-subtle"
  | "info"
  | "info-subtle"
  | "neutral";

const toneClasses: Record<Tone, string> = {
  success: "bg-success text-white",
  "success-subtle": "bg-success-subtle text-success",
  warning: "bg-warning text-white",
  "warning-subtle": "bg-warning-subtle text-warning",
  danger: "bg-danger text-white",
  "danger-subtle": "bg-danger-subtle text-danger",
  info: "bg-info text-white",
  "info-subtle": "bg-info-subtle text-info",
  neutral: "bg-surface-muted text-text-muted",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
