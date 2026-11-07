import type { ReactNode } from "react";

/**
 * Empty state — wajib selalu punya satu aksi ("Selalu ada
 * langkah berikutnya").
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-surface px-4 py-10 text-center">
      <div className="mx-auto grid size-12 place-items-center rounded-full bg-surface-muted text-text-muted">
        {icon}
      </div>
      <p className="mt-3 font-medium text-text">{title}</p>
      {description && <p className="mt-1 text-sm text-text-muted">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
