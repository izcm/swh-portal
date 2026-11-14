import { Link, Navigate, useParams } from "react-router";

import { cn } from "@/lib/cn";
import { useLanguage } from "@/lib/context/language";
import { copy } from "./data/copy";
import { services } from "./data/services";
import { RelatedServices } from "./RelatedServices";
import { ServiceLinks } from "./ServiceLinks";

function ServiceNav() {
  const { lang } = useLanguage();
  const t = copy[lang].serviceNav;

  return (
    <nav className="flex flex-col items-start gap-8">
      <Link
        to="/services"
        className="eyebrow text-xs tracking-[0.25em] underline decoration-accent/50 decoration-1 underline-offset-8 hover:text-fg"
      >
        {t.allServices}
      </Link>

      <ServiceLinks keepScroll />
    </nav>
  );
}

export function Service() {
  const { id } = useParams();

  const { lang } = useLanguage();
  const t = copy[lang].service;

  const section = services[lang].find((s) => s.id === id);
  if (!section) return <Navigate to="/services" replace />;

  return (
    <div className="tab-container max-w-6xl">
      <ServiceNav />
      <header className="mt-10">
        <h1 className="text-5xl">{section.title}</h1>
      </header>
      <div
        className={cn(
          "flex mx-auto py-8 bg-transparent border-y border-line/40 rounded-none overflow-clip",
          "md:border md:bg-lowered/40 md:rounded-sm",
        )}
      >
        <div className="max-w-160 w-full mx-auto">{section.diagrams.hero}</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <section>
          <span className="eyebrow">{t.overview}</span>

          <div className="mt-3 flex flex-col gap-3 leading-relaxed text-subtle text-lg">
            {section.overview.paragraphs.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </section>

        {/* <section
        className={cn("mt-16 p-6", "bg-lowered border border-line rounded")}
      >
        <SvgPlaceholder label="Diagram" width={450} height={200} />
      </section> */}

        {section.relatedServices && (
          <RelatedServices relatedServices={section.relatedServices} />
        )}
      </div>
    </div>
  );
}
