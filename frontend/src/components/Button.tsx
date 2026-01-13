import * as React from "react";

export function Button({
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={[
        "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium",
        "bg-zinc-100 text-zinc-900 hover:bg-white",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className,
      ].join(" ")}
    />
  );
}
