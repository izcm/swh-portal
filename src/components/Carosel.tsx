import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { RoundIconBtn } from "./RoundIconBtn";
import { cn } from "@/lib/cn";
import { useSlides } from "@/lib/useSlides";

export type CaroselItem = { content: ReactNode; title: string };

const defaultLabels = { previous: "Previous", next: "Next", figure: "FIG." };

type Props = {
  items: CaroselItem[];
  labels?: Partial<typeof defaultLabels>;

  defaultIndex?: number; // where to start when uncontrolled

  // pass if parent controls the index
  index?: number;
  onChange?: (i: number) => void;

  animate?: boolean;

  className?: string;
};

// https://www.youtube.com/watch?v=HXIHpDnsizk&list=PLZlA0Gpn_vH8mpXIUHjWoMAAgoCEinL0R&index=67
// have a look at carosel animations

const pad = (n: number) => String(n).padStart(2, "0");

export function Carosel({
  items,
  labels: labelsProp,
  index: indexProp,
  defaultIndex,
  onChange,
  animate = true,
  className,
}: Props) {
  const labels = { ...defaultLabels, ...labelsProp };
  const { index, direction, prev, next, goTo } = useSlides({
    count: items.length,
    index: indexProp,
    defaultIndex,
    onChange,
  });

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <CaroselSlide
        key={index}
        item={items[index]}
        direction={direction}
        animate={animate}
      />
      <CaroselBar
        figure={labels.figure}
        title={items[index].title}
        index={index}
        count={items.length}
        labels={labels}
        prev={prev}
        next={next}
      />
      <CaroselThumbnails items={items} index={index} goTo={goTo} />
    </div>
  );
}

export function CaroselSlide({
  item,
  direction,
  animate = true,
}: {
  item: CaroselItem;
  direction: "left" | "right";
  animate?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex-1 self-center rounded-lg overflow-hidden",
        animate && direction === "right" && "in-from-right",
        animate && direction === "left" && "in-from-left",
      )}
    >
      {item.content}
    </div>
  );
}

export function CaroselBar({
  figure,
  title,
  index,
  count,
  labels,
  prev,
  next,
}: {
  figure: string;
  title: string;
  index: number;
  count: number;
  labels: { previous: string; next: string };
  prev: () => void;
  next: () => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-3 font-mono tracking-wider text-xs text-subtle">
        <span className="whitespace-nowrap">
          {figure} {pad(index + 1)} – {title}
        </span>
        <span className="whitespace-nowrap ml-auto">
          {pad(index + 1)} / {pad(count)}
        </span>

        <div className="flex gap-2">
          {[
            { onClick: prev, label: labels.previous, Icon: ArrowLeft },
            { onClick: next, label: labels.next, Icon: ArrowRight },
          ].map(({ onClick, label, Icon }) => (
            <RoundIconBtn
              key={label}
              onClick={onClick}
              className="border rounded-sm size-7 border-line bg-raised hover:bg-ground hover:border-accent"
            >
              <Icon className="size-4" strokeWidth={1.8} />
            </RoundIconBtn>
          ))}
        </div>
      </div>
      <div className="horizontal-line mt-2" />
    </div>
  );
}

export function CaroselThumbnails({
  items,
  index,
  goTo,
}: {
  items: CaroselItem[];
  index: number;
  goTo: (i: number) => void;
}) {
  return (
    <div className="flex gap-4">
      {items.map((item, i) => (
        <div
          onClick={() => goTo(i)}
          className={cn(
            "cursor-pointer rounded border border-transparent p-0.5",
            i !== index && "hover:border-accent/60",
            i === index && "border border-accent hover:",
          )}
          key={i}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}

export function CaroselDots({
  count,
  index,
  goTo,
}: {
  count: number;
  index: number;
  goTo: (i: number) => void;
}) {
  return (
    <div className="flex self-center gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <button
          type="button"
          key={i}
          onClick={() => goTo(i)}
          aria-label={`Go to item ${i + 1}`}
          className={cn(
            "bg-accent rounded-full size-2 opacity-20 cursor-pointer",
            i !== index && "hover:opacity-50",
            i === index && "opacity-100",
          )}
        />
      ))}
    </div>
  );
}
