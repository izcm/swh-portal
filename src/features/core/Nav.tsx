import { useState } from "react";
import { Link, NavLink } from "react-router";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@a2zb/react";

import { cn } from "@/lib/cn";
import { useLanguage } from "@/lib/context/language";

import { PairToggle } from "@/components/PairToggle";
import { ContactModal } from "../contact";
import { copy } from "./copy";

export default function Nav() {
  const [contactOpen, setContactOpen] = useState(false);
  const { lang, setLang } = useLanguage();
  const { theme, applyTheme } = useTheme();
  const t = copy[lang];

  const tabs = [
    { label: t.home, to: "/" },
    { label: t.services, to: "/services" },
    { label: t.work, to: "/work" },
  ];

  return (
    <>
      <div className="bg-linear-to-r from-muted/25 via-muted/10 to-muted/25 ring-1 ring-inset ring-muted py-1.5 text-center text-xs font-semibold tracking-widest text-subtle uppercase">
        {t.underDevelopment}
      </div>

      <header
        className="
          sticky top-0 z-20
          flex items-center gap-6 px-4 py-3
          bg-ground
          after:pointer-events-none after:absolute after:inset-x-0 after:top-full
          after:h-6 after:bg-linear-to-b after:from-ground after:via-ground/20 after:via-25% after:to-transparent
        "
      >
        <Link to="/" className="text-xl tracking-tight">
          SWH Studio
        </Link>

        <nav className="flex flex-1 justify-end gap-4">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.to === "/"}
              className={({ isActive }) =>
                cn(
                  "rounded px-3 py-1.5 text-sm font-normal transition-colors",
                  isActive ? "text-fg" : "btn-ghost",
                )
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </nav>

        <PairToggle
          value={lang}
          onChange={setLang}
          options={[
            { value: "no", label: "NO" },
            { value: "en", label: "EN" },
          ]}
        />

        <PairToggle
          value={theme}
          onChange={applyTheme}
          options={[
            { value: "light", label: <Sun size={14} /> },
            { value: "dark", label: <Moon size={14} /> },
          ]}
        />

        <button
          type="button"
          onClick={() => setContactOpen(true)}
          className="btn btn-secondary w-24 tracking-wide text-sm"
        >
          {t.contact}
        </button>
        <ContactModal
          isOpen={contactOpen}
          onClose={() => setContactOpen(false)}
        />
      </header>
    </>
  );
}
