export function Card({
  title,
  subtitle,
  children,
  right,
  className = "",
}: {
  title?: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-zinc-800 bg-zinc-950 p-4 ${className}`}>
      {(title || right) && (
        <div className="flex items-start justify-between gap-4">
          <div>
            {title && <h3 className="text-sm font-semibold">{title}</h3>}
            {subtitle && <p className="mt-1 text-xs text-zinc-400">{subtitle}</p>}
          </div>
          {right}
        </div>
      )}
      <div className={title || right ? "mt-3" : ""}>{children}</div>
    </div>
  );
}
