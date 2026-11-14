import { useEffect, useLayoutEffect, useState } from "react";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router";
import { ResponsiveToaster, useTheme } from "@a2zb/react";

import { Nav, Footer, Hero, Work, Contact } from "./features";
import { Service, ServiceLinks, Services } from "./features/services";
import { copy as servicesCopy } from "./features/services/data/copy";
import { cn } from "@/lib/cn";
import { useLanguage } from "@/lib/context/language";

function Layout() {
  const { pathname, state } = useLocation();
  const { theme } = useTheme();

  useLayoutEffect(() => {
    if (state?.keepScroll) return;

    window.scrollTo(0, 0);
  }, [pathname, state]);

  return (
    <>
      <Nav />

      <main className="min-h-dvh">
        <Outlet />
      </main>

      <div className="mt-auto">
        <Footer />
      </div>

      <ResponsiveToaster theme={theme === "dark" ? "dark" : "light"} />
    </>
  );
}

function Home() {
  const { lang } = useLanguage();
  const t = servicesCopy[lang];

  return (
    <>
      <div className="md:min-h-below-nav-and-dev-banner mb-12 flex flex-col overflow-x-clip">
        <Hero />
      </div>

      <section
        className={cn(
          "flex flex-col gap-4 px-4 pb-8 pt-16",
          "sm:px-8",
          "xl:mx-auto xl:w-[94vw] xl:px-0",
        )}
      >
        <span className="eyebrow">{t.eyebrow}</span>
        <ServiceLinks />
      </section>
      {/* <Demo /> */}
    </>
  );
}

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:id" element={<Service />} />
        <Route path="/work" element={<Work />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

function ScrollPlayground() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    function handleScroll() {
      setScrollY(window.scrollY);
      console.log(window.scrollY);
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="h-[200vh] pt-40">
      <div
        className="w-20 h-20 bg-blue-500"
        style={{
          transform: `translateY(${scrollY}px)`,
        }}
      />
    </div>
  );
}

export default App;
