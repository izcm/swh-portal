import { Fragment, useState } from "react";

import { useLanguage } from "@/lib/context/language";

import { Carosel } from "@/components/Carosel";
import { LightBox } from "@/components/LightBox";

import { services } from "../services/data/services";
import { copy } from "./data/copy";
import type { ProjectData } from "./data/projects";
import { TechnicalSummary } from "./TechnicalSummary";

export function Project({
  project: {
    id,
    title,
    subtitle,
    client,
    situation,
    solution,
    services: serviceIds,
    mediaItems,
    technicalParts,
  },
  index,
}: {
  project: ProjectData;
  index: number;
}) {
  const { lang } = useLanguage();
  const t = copy[lang];
  const labels = t.project;

  const details = [
    { label: labels.client, text: client },
    { label: labels.situation, text: situation },
    { label: labels.solution, text: solution },
  ];

  const [slideIndex, setSlideIndex] = useState(0);
  const [openLightBox, setOpenLightBox] = useState(false);

  return (
    <section
      id={id}
      className="flex flex-col gap-8 min-h-below-nav scroll-mt-36 snap-start"
    >
      <div className="flex flex-col lg:flex-row gap-16">
        {/* TEXT CONTENT */}
        <div className="lg:max-w-lg min-w-sm flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <span className="inline-flex gap-2 eyebrow font-mono text-xs">
              {String(index + 1).padStart(2, "0")} <span>/</span>{" "}
              {labels.selectedProjects}
            </span>
            <h2 className="text-5xl font-medium">
              {title}
              <span className="text-muted">.</span>
            </h2>
            <span className="text-subtle font-light">{subtitle}</span>
          </div>

          <div className="horizontal-line" />

          {details.map(({ label, text }, i) => (
            <div key={i} className="flex flex-col gap-2 max-w-2xl">
              <span className="eyebrow text-xs font-medium">{label}</span>
              <p className="text-subtle">{text}</p>
            </div>
          ))}

          <div className="horizontal-line" />

          <span className="text-sm text-accent-strong inline-flex gap-3 flex-wrap">
            {serviceIds.map((id, i) => (
              <Fragment key={id}>
                {i > 0 && <span>·</span>}
                <span>
                  {services[lang].find((service) => service.id === id)?.title}
                </span>
              </Fragment>
            ))}
          </span>
        </div>

        <div className="w-full mx-auto lg:max-w-180 self-center">
          <Carosel
            items={mediaItems.map((item, i) => ({
              title: item.title,
              content:
                item.type === "image" ? (
                  <img
                    className="border border-line rounded"
                    src={item.src}
                    alt={item.alt}
                    // the same img is used as a thumbnail — only the current
                    // slide opens the lightbox, others just navigate
                    onClick={() => {
                      if (i === slideIndex) setOpenLightBox(true);
                    }}
                  />
                ) : (
                  <video
                    className="border border-line rounded"
                    src={item.src}
                    onClick={() => {
                      if (i === slideIndex) setOpenLightBox(true);
                    }}
                  />
                ),
            }))}
            labels={t.showcase}
            index={slideIndex}
            onChange={setSlideIndex}
            animate={false}
          />
        </div>
        {/* <Showcase
          labels={t.showcase}
          mediaItems={project.mediaItems}
          technicalParts={project.technicalParts}
        /> */}
      </div>
      <TechnicalSummary projectId={id} index={index} parts={technicalParts} />

      <LightBox
        items={mediaItems}
        labels={t.showcase}
        isOpen={openLightBox}
        index={slideIndex}
        onChange={setSlideIndex}
        onClose={() => setOpenLightBox(false)}
      />
    </section>
  );
}
