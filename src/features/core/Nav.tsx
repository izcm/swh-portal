import { useState } from "react";
import { Link, NavLink } from "react-router";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "@a2zb/react";

import { cn } from "@/lib/cn";
import { useLanguage } from "@/lib/context/language";

import { PairToggle } from "@/components/PairToggle";
import { ContactModal } from "../contact";
import { copy } from "./copy";

export default function Nav() {
  const [contactOpen, setContactOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { lang, setLang } = useLanguage();
  const { theme, applyTheme } = useTheme();
  const t = copy[lang];

  const tabs = [
    { label: t.home, to: "/" },
    { label: t.services, to: "/services" },
    { label: t.work, to: "/work" },
  ];

  const tabLinks = (onClick?: () => void) =>
    tabs.map((tab) => (
      <NavLink
        key={tab.to}
        to={tab.to}
        end={tab.to === "/"}
        onClick={onClick}
        className={({ isActive }) =>
          cn(
            "rounded px-3 py-1.5 text-sm font-normal transition-colors",
            isActive ? "text-fg" : "btn-ghost",
          )
        }
      >
        {tab.label}
      </NavLink>
    ));

  const toggles = (
    <>
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
    </>
  );

  return (
    <>
      {/* <div className="bg-linear-to-r from-muted/25 via-muted/10 to-muted/25 ring-1 ring-inset ring-muted py-1.5 text-center text-xs font-semibold tracking-widest text-subtle uppercase">
        {t.underDevelopment}
      </div> */}

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

        {/* desktop */}
        <div className="hidden md:flex flex-1 items-center justify-end gap-6">
          <nav className="flex gap-4">{tabLinks()}</nav>
          {toggles}
          <button
            type="button"
            onClick={() => setContactOpen(true)}
            className="btn btn-secondary w-24 tracking-wide text-sm"
          >
            {t.contact}
          </button>
        </div>

        {/* mobile */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
          aria-expanded={menuOpen}
          className="btn btn-ghost ml-auto md:hidden"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {menuOpen && (
          <div className="md:hidden absolute inset-x-0 top-full z-10 flex flex-col gap-4 border-b border-faint bg-ground px-4 py-4">
            <nav className="flex flex-col gap-1">
              {tabLinks(() => setMenuOpen(false))}
            </nav>
            <div className="flex gap-4">{toggles}</div>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setContactOpen(true);
              }}
              className="btn btn-secondary w-full tracking-wide text-sm"
            >
              {t.contact}
            </button>
          </div>
        )}

        <ContactModal
          isOpen={contactOpen}
          onClose={() => setContactOpen(false)}
        />
      </header>
    </>
  );
}
