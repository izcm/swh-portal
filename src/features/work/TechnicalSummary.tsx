import { useState } from "react";
import { ArrowDown } from "lucide-react";

import { cn } from "@/lib/cn";
import { useLanguage } from "@/lib/context/language";

import { RoundIconBtn } from "@/components/RoundIconBtn";

import { copy } from "./data/copy";
import { TechnicalParts, type TechnicalPart } from "./TechnicalView";

export function TechnicalSummary({
  projectId,
  index,
  parts,
}: {
  projectId: string;
  index: number;
  parts: TechnicalPart[];
}) {
  const { lang } = useLanguage();
  const t = copy[lang];
  const viewId = `${projectId}-technical`;
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-12">
      <div className="horizontal-line" />

      <div
        id={viewId}
        className="flex flex-col gap-4 md:flex-row md:items-center md:gap-8"
      >
        <div className="flex flex-col gap-3">
          <span className="inline-flex gap-2 eyebrow font-mono text-xs">
            {String(index + 1).padStart(2, "0")} <span>/</span>{" "}
            {t.technical.eyebrow}
          </span>
          <h3 className="text-4xl font-medium">
            {t.technical.heading}
            <span className="text-muted">.</span>
          </h3>
        </div>

        <div className="vertical-line hidden md:block" />

        <p className="text-sm text-subtle max-w-xs">
          {t.technical.description}
        </p>

        <RoundIconBtn
          onClick={() => setOpen(!open)}
          label={t.technical.heading}
          className={cn(
            "size-12 border border-line bg-raised",
            "hover:bg-ground hover:border-accent",
            "self-end md:self-auto md:ml-auto md:mr-8",
          )}
        >
          <ArrowDown
            className={cn("size-5 transition-transform", open && "rotate-180")}
            strokeWidth={1.5}
          />
        </RoundIconBtn>
      </div>

      {open && <TechnicalParts parts={parts} labels={t.showcase} />}
    </div>
  );
}
