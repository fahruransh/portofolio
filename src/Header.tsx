import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "./language";
export default function Header() {
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLElement>(null);
  const links = [
    ["/about.html", "nav.about", "Tentang"],
    ["/certifications.html", "nav.certifications", "Sertifikasi"],
    ["/skills.html", "nav.skills", "Kemampuan"],
    ["/contact.html", "nav.contact", "Kontak"],
  ];
  useEffect(() => {
    setOpen(false);
  }, [location]);
  useEffect(() => {
    const scroll = () => setScrolled(scrollY > 200);
    scroll();
    addEventListener("scroll", scroll, { passive: true });
    return () => removeEventListener("scroll", scroll);
  }, []);
  useEffect(() => {
    document.body.classList.toggle("scrolled", scrolled);
    return () => document.body.classList.remove("scrolled");
  }, [scrolled]);
  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    const main = document.querySelector("main");
    const nav = document.querySelector<HTMLElement>(".nav");
    const footer = document.querySelector<HTMLElement>("#halftone-footer");
    if (main) main.inert = open;
    if (nav) nav.inert = open;
    if (footer) footer.inert = open;
    document.dispatchEvent(
      new CustomEvent("portfolio:menu", { detail: { open } }),
    );
    const key = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
      if (e.key === "Tab") {
        const items = [
          button.current,
          ...Array.from(
            menu.current?.querySelectorAll<HTMLAnchorElement>("a") ?? [],
          ),
        ].filter(Boolean) as HTMLElement[];
        if (e.shiftKey && document.activeElement === items[0]) {
          e.preventDefault();
          items.at(-1)?.focus();
        } else if (!e.shiftKey && document.activeElement === items.at(-1)) {
          e.preventDefault();
          items[0]?.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("keydown", key);
      document.body.classList.remove("menu-open");
      if (main) main.inert = false;
      if (nav) nav.inert = false;
      if (footer) footer.inert = false;
    };
  }, [open]);
  return (
    <>
      <header className="nav">
        <Link className="brand" to="/">
          © <span>Code by Fahrur</span>
        </Link>
        <nav className="desktop-nav">
          {links
            .filter(([, key]) => key !== "nav.experience")
            .map(([url, key, label]) => (
              <Link key={key} to={url}>
                {t(key, label)}
              </Link>
            ))}
        </nav>
        <div className="nav-tools">
          <div className="lang-switch">
            {["id", "en"].map((lang, i) => (
              <span key={lang}>
                {i > 0 && " / "}
                <button
                  data-lang={lang}
                  aria-pressed={language === lang}
                  className={language === lang ? "active" : ""}
                  onClick={() => setLanguage(lang)}
                >
                  {lang.toUpperCase()}
                </button>
              </span>
            ))}
          </div>
        </div>
      </header>
      <button
        ref={button}
        className="menu-toggle"
        aria-expanded={open}
        aria-controls="mobile-navigation"
        aria-label={
          language === "en"
            ? open
              ? "Close navigation"
              : "Open navigation"
            : open
              ? "Tutup navigasi"
              : "Buka navigasi"
        }
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "×" : "☰"}
      </button>
      <div className="menu-shade" onClick={() => setOpen(false)} />
      <nav
        ref={menu}
        id="mobile-navigation"
        className={"mobile-menu" + (open ? " open" : "")}
        aria-hidden={!open}
        inert={!open}
      >
        <span className="menu-caption">
          {language === "en" ? "NAVIGATION" : "NAVIGASI"}
        </span>
        {links.map(([url, key, label]) => (
          <Link key={key} to={url} onClick={() => setOpen(false)}>
            {t(key, label)}
          </Link>
        ))}
        <div className="menu-social">
          <a href="https://github.com/zucksfox">GitHub ↗</a>
          <a href="https://www.linkedin.com/in/fahrur-anshori/">LinkedIn ↗</a>
        </div>
      </nav>
    </>
  );
}
