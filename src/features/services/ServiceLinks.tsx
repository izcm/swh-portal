import { NavLink } from "react-router";

import { cn } from "@/lib/cn";
import { useLanguage } from "@/lib/context/language";
import { services } from "./data/services";

export function ServiceLinks({ keepScroll = false }: { keepScroll?: boolean }) {
  const { lang } = useLanguage();

  return (
    <div className="swipe-row -mx-4 items-center gap-2 px-4 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
      {services[lang].map((service) => (
        <NavLink
          key={service.id}
          to={`/services/${service.id}`}
          state={keepScroll ? { keepScroll: true } : undefined}
          className={({ isActive }) =>
            cn(
              "shrink-0 whitespace-nowrap rounded-sm border px-4 py-2 text-[11px] uppercase tracking-[0.2em] transition-colors",
              isActive
                ? "border-accent/50 bg-raised/40 text-accent font-medium"
                : "border-line text-subtle hover:text-fg font-normal",
            )
          }
        >
          {service.title}
        </NavLink>
      ))}
    </div>
  );
}
