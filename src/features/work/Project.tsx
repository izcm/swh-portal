import { useState } from "react";

import { useLanguage } from "@/lib/context/language";

import { Carosel } from "@/components/Carosel";
import { LightBox } from "@/components/LightBox";

import { services } from "../services/data/services";
import { copy } from "./data/copy";
import type { ProjectData } from "./data/projects";
import { Showcase } from "./Showcase";

export function Project({ project }: { project: ProjectData }) {
  const { lang } = useLanguage();
  const t = copy[lang];
  const labels = t.project;

  const details = [
    { label: labels.client, text: project.client },
    { label: labels.situation, text: project.situation },
    { label: labels.solution, text: project.solution },
  ];

  const [slideIndex, setSlideIndex] = useState(0);
  const [openLightBox, setOpenLightBox] = useState(false);

  return (
    <section
      id={project.id}
      className="flex flex-col gap-8 min-h-below-nav scroll-mt-36 snap-start"
    >
      <div className="flex flex-col lg:flex-row gap-6">
        {/* TEXT CONTENT */}
        <div className="lg:max-w-md flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <span className="inline-flex gap-2 eyebrow font-mono text-xs">
              {labels.work} <span>/</span> {labels.project}
            </span>
            <h2 className="text-5xl">{project.title}</h2>
          </div>

          <div className="horizontal-line" />

          {details.map(({ label, text }, i) => (
            <div key={i} className="flex flex-col gap-2 max-w-2xl">
              <span className="eyebrow text-xs tracking-[0.2em]">{label}</span>
              <p className="text-subtle">{text}</p>
            </div>
          ))}

          <div className="horizontal-line" />

          <span className="text-sm text-accent-strong">
            {project.services
              .map(
                (id) =>
                  services[lang].find((service) => service.id === id)?.title,
              )
              .join(" · ")}
          </span>
        </div>

        <div className="w-full mx-auto lg:max-w-150">
          <Carosel
            items={project.mediaItems.map((item, i) => ({
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
      {/* <div className="bg-raised w-full h-full">
        <h3 className="text-3xl">Hubben</h3>
      </div> */}

      <LightBox
        items={project.mediaItems}
        labels={t.showcase}
        isOpen={openLightBox}
        index={slideIndex}
        onChange={setSlideIndex}
        onClose={() => setOpenLightBox(false)}
      />
    </section>
  );
}
