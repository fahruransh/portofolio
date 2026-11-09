import { Link, useSearchParams } from "react-router-dom";
import { useLanguage } from "../language";

export default function Project() {
  const [params] = useSearchParams();
  const { t, language } = useLanguage();
  const en = language === "en";
  const barede = params.get("slug") === "bukit-barede";
  const inventory = params.get("slug") === "bnnk-inventory";
  const tubing = params.get("slug") === "tubing-ticketing";
  const tracket = params.get("slug") === "tracket";
  if (!barede && !inventory && !tubing && !tracket)
    return (
      <section className="section">
        <h1>{en ? "Project not found" : "Project tidak ditemukan"}</h1>
        <Link to="/#work">
          ← {en ? "Selected projects" : "Project pilihan"}
        </Link>
      </section>
    );
  const title = tracket
    ? "Tracket"
    : barede
      ? "Bukit Barede Ticket Website"
      : tubing
        ? "Aplikasi Ticketing Tubing"
        : "BNNK Inventory Dashboard";
  return (
    <>
      <div className="page-intro">
        <Link to="/#work">
          ← {en ? "Selected projects" : "Project pilihan"}
        </Link>
        <h1>{title}</h1>
      </div>
      <section className="section project-detail">
        <figure>
          <img
            src={
              import.meta.env.BASE_URL +
              (tracket
                ? "tracket-dashboard-preview.jpg"
                : barede
                  ? "project-barede-placeholder.jpg"
                  : tubing
                    ? "project-tubing-placeholder.jpg"
                    : "project-inventory-placeholder.jpg")
            }
            alt={
              tracket
                ? en
                  ? "Tracket workshop service dashboard with blurred personal data"
                  : "Dashboard servis bengkel Tracket dengan data pribadi disamarkan"
                : ""
            }
            width="640"
            height={tracket ? "auto" : 440}
          />
          <figcaption>
            {tracket
              ? en
                ? "Tracket service-management dashboard preview. Personal and customer details blurred."
                : "Pratinjau dashboard manajemen servis Tracket. Data pribadi dan pelanggan disamarkan."
              : en
                ? "Placeholder image — not a project screenshot."
                : "Gambar sementara — bukan screenshot project."}
          </figcaption>
        </figure>
        <h2>{en ? "About the project" : "Tentang project"}</h2>
        {tracket ? (
          <>
            <p>
              {en
                ? "Tracket is a workshop service-management application for tracking repair orders, technician queues, spare parts, warranties, and service reports."
                : "Tracket adalah aplikasi manajemen servis bengkel untuk memantau order perbaikan, antrean teknisi, suku cadang, garansi, dan laporan servis."}
            </p>
            <h2>{en ? "STACK" : "TEKNOLOGI"}</h2>
            <p>Laravel 12 · PHP 8.2 · MySQL · Tailwind CSS · Vite</p>
            <a
              className="project-profile"
              href="https://github.com/fahruransh/Tracket"
              target="_blank"
              rel="noreferrer"
            >
              {en ? "View source on GitHub ↗" : "Lihat source di GitHub ↗"}
            </a>
          </>
        ) : barede ? (
          <p>
            {en
              ? "Ticket website for Bukit Barede. Further project details will be added."
              : "Website tiket Bukit Barede. Detail project selengkapnya akan ditambahkan."}
          </p>
        ) : tubing ? (
          <>
            <p>
              {en
                ? "Ticketing application for tubing activities, covering ticket purchase, booking data, customer verification, and operational status tracking."
                : "Aplikasi ticketing untuk kegiatan tubing yang mencakup pembelian tiket, data booking, verifikasi pelanggan, dan pemantauan status operasional."}
            </p>
            <h2>{en ? "MY ROLE" : "PERAN SAYA"}</h2>
            <p>Fullstack Developer</p>
            <h2>{en ? "SCOPE" : "CAKUPAN"}</h2>
            <p>UI · Ticketing Flow · Booking Data · Admin Operations</p>
            <ul>
              <li>{en ? "Designed the ticket purchase and booking flow." : "Merancang alur pembelian tiket dan booking."}</li>
              <li>{en ? "Structured customer and booking data for daily operations." : "Menyusun data pelanggan dan booking untuk kebutuhan operasional harian."}</li>
              <li>{en ? "Built status handling for ticket verification and service readiness." : "Membangun pengelolaan status untuk verifikasi tiket dan kesiapan layanan."}</li>
            </ul>
          </>
        ) : (
          <>
            <p>
              {t(
                "work.desc",
                "Sistem dashboard inventaris berbasis QR Code untuk membantu proses pengelolaan, identifikasi, dan pencatatan aset di BNNK Magelang.",
              )}
            </p>
            <h2>{t("work.roleLabel", "PERAN SAYA")}</h2>
            <p>Fullstack Developer</p>
            <h2>{t("work.scopeLabel", "CAKUPAN")}</h2>
            <p>UI · Frontend · Backend · Database · QR Integration</p>
            <ul>
              <li>
                {t(
                  "work.ui",
                  "Merancang dan mengimplementasikan UI dashboard inventaris.",
                )}
              </li>
              <li>
                {t(
                  "work.backend",
                  "Mengembangkan backend dan database pencatatan aset.",
                )}
              </li>
              <li>
                {t(
                  "work.qr",
                  "Mengintegrasikan QR Code untuk identifikasi aset.",
                )}
              </li>
              <li>
                {t(
                  "work.testing",
                  "Melakukan pengujian dan troubleshooting sistem.",
                )}
              </li>
            </ul>
            <a
              className="project-profile"
              href="https://github.com/fahruransh?tab=repositories"
              target="_blank"
              rel="noreferrer"
            >
              {en
                ? "Browse my GitHub repositories ↗"
                : "Lihat daftar repository GitHub saya ↗"}
            </a>
          </>
        )}
      </section>
    </>
  );
}
