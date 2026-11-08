import { useLanguage } from "../language";
import { Link } from "react-router-dom";
export default function Home() {
  const { t, language } = useLanguage();
  const en = language === "en";

  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-symbol hero-portrait">
          <picture>
            <source
              type="image/webp"
              srcSet={`${import.meta.env.BASE_URL}fahrur-portrait-812.webp 812w, ${import.meta.env.BASE_URL}fahrur-portrait-1624.webp 1624w`}
              sizes="max(100vw, 207svh)"
            />
            <img
              src={import.meta.env.BASE_URL + "fahrur-portrait.png"}
              alt="Fahrur Anshori"
              width="1624"
              height="912"
              fetchPriority="high"
            />
          </picture>
        </div>
        <div className="location-tag">
          <span>
            {en ? "Located in" : "Berlokasi di"}
            <br />
            Magelang,
            <br />
            Indonesia
          </span>
          <span className="globe" aria-hidden="true">
            ◎
          </span>
        </div>
        <div className="hero-role">
          <span className="role-arrow" aria-hidden="true">
            ↘
          </span>
          <p>
            Fullstack &<br />
            Mobile Developer
          </p>
        </div>
        <div className="name-track">
          <h1 id="hero-title">Fahrur Anshori —</h1>
          <span aria-hidden="true">Fahrur Anshori —</span>
        </div>
        <a className="hero-scroll" href="#experience">
          <span aria-hidden="true">↓</span>
          <span className="hero-scroll-label">
            {en ? "Experience" : "Pengalaman"}
          </span>
        </a>
        <div className="hero-bottom">
          <span className="hero-index">PORTFOLIO / 2026</span>
        </div>
      </section>
      <section
        id="experience"
        className="section scroll-chapter experience-chapter"
      >
        <div className="chapter-content">
          <div className="section-head">
            <h2>
              01 / <span>{t("section.experience", "PENGALAMAN")}</span>
            </h2>
            <span>{t("common.selected", "PILIHAN")}</span>
          </div>
          <div className="career-list">
            <article>
              <div>
                <span>2025</span>
                <b>BNNK Magelang</b>
              </div>
              <div>
                <h3>Fullstack Developer</h3>
                <p>
                  {t(
                    "experience.bnnk",
                    "Merancang dan mengembangkan dashboard inventaris berbasis QR Code dari analisis kebutuhan, UI, database, frontend, backend hingga pengujian sistem.",
                  )}
                </p>
                <small>{t("date.bnnk", "AGUSTUS 2025 — NOVEMBER 2025")}</small>
              </div>
            </article>
            <article>
              <div>
                <span>2021</span>
                <b>PT Asta Brata Teknologi</b>
              </div>
              <div>
                <h3>Frontend Developer</h3>
                <p>
                  {t(
                    "experience.asta",
                    "Membantu pengembangan antarmuka aplikasi dengan fokus pada implementasi UI yang responsif, rapi, mudah digunakan, serta berkolaborasi dengan tim pengembang.",
                  )}
                </p>
                <small>{t("date.asta", "MARET 2021 — MEI 2021")}</small>
              </div>
            </article>
          </div>
        </div>
      </section>
      <section id="work" className="section work scroll-chapter work-chapter">
        <svg
          className="chapter-curve"
          viewBox="0 0 1000 100"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M0 0 Q500 170 1000 0 L1000 102 L0 102 Z" />
        </svg>
        <div className="chapter-content">
          <div className="section-head">
            <h2>
              02 / <span>{t("section.work", "PROJECT PILIHAN")}</span>
            </h2>
            <span>2024—2026</span>
          </div>
          <article className="work-entry">
            <Link
              className="work-row"
              to="/project.html?slug=bnnk-inventory"
              data-preview={
                import.meta.env.BASE_URL + "project-inventory-placeholder.jpg"
              }
            >
              <div className="work-title">
                <h3>BNNK Inventory Dashboard</h3>
              </div>
              <span className="work-category">
                Laravel 12 · PHP 8.2 · MySQL · 2025
              </span>
            </Link>
          </article>
          <article className="work-entry">
            <Link
              className="work-row"
              to="/project.html?slug=bukit-barede"
              data-preview={
                import.meta.env.BASE_URL + "project-barede-placeholder.jpg"
              }
            >
              <div className="work-title">
                <h3>Bukit Barede Ticket Website</h3>
              </div>
              <span className="work-category">
                {en ? "Ticket Website · HTML · JavaScript" : "Website Tiket · HTML · JavaScript"}
              </span>
            </Link>
          </article>
          <article className="work-entry">
            <Link
              className="work-row"
              to="/project.html?slug=tracket"
              data-preview={import.meta.env.BASE_URL + "tracket-dashboard-preview.jpg"}
            >
              <div className="work-title">
                <h3>Tracket</h3>
              </div>
              <span className="work-category">
                Laravel 12 · PHP 8.2 · MySQL
              </span>
            </Link>
          </article>
        </div>
      </section>
    </>
  );
}
