import type { ComponentType, ReactNode, SVGProps } from "react";
import { cn } from "@/lib/cn";

type RoundIconBtnProps = React.ButtonHTMLAttributes<HTMLButtonElement>;
// & {
//   icon: ComponentType<SVGProps<SVGSVGElement>>;
// };

// colors derive from currentColor — pass a text-* class to recolor
export function RoundIconBtn({
  onClick,
  children,
  className,
  ...props
}: RoundIconBtnProps) {
  return (
    <button
      type="button"
      {...props}
      onClick={onClick}
      className={cn(
        "grid size-10 shrink-0 place-items-center rounded-full",
        "bg-current/15 transition-colors hover:bg-current/10",
        "touch-manipulation",
        className,
      )}
    >
      {children}
    </button>
  );
}
