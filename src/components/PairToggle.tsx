import type { ReactNode } from "react";

type PairOption<T extends string> = { value: T; label: ReactNode };

// two options in one button, " / " between them; click switches to the other
export function PairToggle<T extends string>({
  value,
  onChange,
  options: [a, b],
}: {
  value: T;
  onChange: (value: T) => void;
  options: [PairOption<T>, PairOption<T>];
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(value === a.value ? b.value : a.value)}
      className="btn btn-ghost inline-flex items-center gap-1 text-sm tracking-wide"
    >
      <span className={value === a.value ? "text-fg" : "text-muted"}>{a.label}</span>
      {" / "}
      <span className={value === b.value ? "text-fg" : "text-muted"}>{b.label}</span>
    </button>
  );
}
