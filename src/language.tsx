import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
const english: Record<string, string> = {
  "work.details": "Project details",
  "nav.skills": "Capabilities",
  "nav.home": "← Home",
  "profile.title": "Fullstack Developer.\nWeb & Mobile.",
  "contact.heading": "Let’s work\ntogether.",
  "system.client": "Responsive web interfaces",
  "system.server": "REST APIs \u00b7 Authentication",
  "system.data": "Data modeling and management",
  "work.ui": "Designed and implemented the inventory dashboard interface.",
  "work.backend": "Developed the backend and database for asset records.",
  "work.qr": "Integrated QR codes for asset identification.",
  "work.testing": "Tested and troubleshot the system.",
  "nav.about": "About",
  "nav.experience": "Experience",
  "nav.certifications": "Credentials",
  "nav.work": "Work",
  "nav.contact": "Contact",
  "nav.talk": "Contact me ↗",
  "nav.emailMe": "Email me ↗",
  "hero.role": "FULLSTACK & MOBILE DEVELOPER",
  "hero.hello": "FULLSTACK DEVELOPER",
  "hero.title": 'Fahrur<br><em>Anshori</em><span class="accent">.</span>',
  "hero.desc":
    "I build web applications with React, Node.js, and SQL databases. My work covers frontend implementation, REST APIs, authentication, and data integration.",
  "hero.workCta": "View projects",
  "hero.footer": "React / Next.js \u00b7 Node.js / Express \u00b7 SQL",
  "hero.scroll": "SELECTED WORK",
  "section.about": "ABOUT",
  "section.experience": "EXPERIENCE",
  "section.capabilities": "CAPABILITIES",
  "section.certifications": "CREDENTIALS",
  "section.work": "SELECTED WORK",
  "section.contact": "CONTACT",
  "common.selected": "SELECTED",
  "about.title": "Frontend.<br>Backend.<br><em>Full picture.</em>",
  "about.p1":
    "Informatics student at Universitas Muhammadiyah Magelang, focusing on software development.",
  "about.p2":
    "My development experience includes a QR-based inventory dashboard at BNNK Magelang and interface implementation at PT Asta Brata Teknologi.",
  "experience.bnnk":
    "Designed and developed a QR-based inventory dashboard, from requirements analysis and UI design to databases, frontend, backend, and system testing.",
  "experience.asta":
    "Contributed to application interfaces with a focus on responsive, clear, usable UI, collaborating with the development team.",
  "date.bnnk": "AUGUST 2025 — NOVEMBER 2025",
  "date.asta": "MARCH 2021 — MAY 2021",
  "cert.headerRight": "SELECTED CREDENTIALS",
  "cert.kicker": "LEARNING & CREDENTIALS",
  "cert.title": "Credentials.",
  "cert.desc":
    "Credentials in software engineering, networking, and digital marketing.",
  "cert.total": "Total credentials",
  "cert.activeCount": "Currently active",
  "cert.statusActive": "ACTIVE",
  "cert.statusExpired": "EXPIRED",
  "date.ccna": "JUL 2026 — JUL 2029",
  "date.microsoft": "MAY 2022 — DEC 2027",
  "date.google": "APR 2021 — DEC 2026",
  "date.bnsp": "SEP 2021 — SEP 2024",
  "work.featured": "FEATURED PROJECT",
  "work.desc":
    "A QR-based inventory dashboard to support asset management, identification, and record keeping at BNNK Magelang.",
  "work.roleLabel": "MY ROLE",
  "work.scopeLabel": "SCOPE",
  "work.preview": "Interface illustration · sample data",
  "contact.title": 'Get in<br>touch<span class="contact-dot">.</span>',
};
const LanguageContext = createContext({
  language: "id",
  setLanguage: (_lang: string) => {},
  t: (_key: string, fallback: string) => fallback,
});
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState(() => {
    try {
      return localStorage.getItem("portfolio-language") === "en" ? "en" : "id";
    } catch {
      return "id";
    }
  });
  useEffect(() => {
    document.documentElement.lang = language;
    try {
      localStorage.setItem("portfolio-language", language);
    } catch {}
    document.dispatchEvent(new Event("portfolio:language"));
  }, [language]);
  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: (key, fallback) =>
          language === "en" ? (english[key] ?? fallback) : fallback,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}
export const useLanguage = () => useContext(LanguageContext);
