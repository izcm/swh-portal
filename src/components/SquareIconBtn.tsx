import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  onClick: () => void;
  label: string;
  children: ReactNode;
  className?: string;
};

// colors derive from currentColor — pass a text-* class to recolor
export function SquareIconBtn({ onClick, label, children, className }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "grid shrink-0 place-items-center",
        "bg-current/10 transition-colors hover:bg-current/5",
        "touch-manipulation self-stretch w-10",
        className,
      )}
    >
      {children}
    </button>
  );
}
