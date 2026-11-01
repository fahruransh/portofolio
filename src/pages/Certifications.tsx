import { Link } from 'react-router-dom'
import { useLanguage } from '../language'
export default function Certifications(){const {t}=useLanguage();return <><div className="page-intro"><Link to="/index.html">{t("nav.home", "← Beranda")}</Link><h1>{t("nav.certifications", "Sertifikasi")}</h1></div><section id="certifications" className="section certifications">
    <div className="section-head"><span>03 / <span>{t("section.certifications", "SERTIFIKASI")}</span></span><span>{t("cert.headerRight", "KREDENSIAL PILIHAN")}</span></div>

      <div className="cert-ledger" id="cert-slider" tabIndex={0} role="region" aria-label="Sertifikasi" aria-roledescription="carousel">
        <article className="cert-item featured-cert">
          <div className="cert-index"><span>01</span><span className="cert-year">2026</span></div>
          <div className="cert-content">
            <div className="cert-name-row">
              <h3>CCNA: Introduction to Networks</h3>
              <b className="status active">{t("cert.statusActive", "AKTIF")}</b>
            </div>
            <div className="cert-meta"><p>Cisco Networking Academy</p><span>{t("date.ccna", "JUL 2026 — JUL 2029")}</span></div>
          </div>
        </article>

        <article className="cert-item">
          <div className="cert-index"><span>02</span><span className="cert-year">2022</span></div>
          <div className="cert-content">
            <div className="cert-name-row">
              <h3>Microsoft Advertising Certified Professional</h3>
              <b className="status active">{t("cert.statusActive", "AKTIF")}</b>
            </div>
            <div className="cert-meta"><p>Microsoft</p><span>{t("date.microsoft", "MEI 2022 — DES 2027")}</span></div>
          </div>
        </article>

        <article className="cert-item">
          <div className="cert-index"><span>03</span><span className="cert-year">2021</span></div>
          <div className="cert-content">
            <div className="cert-name-row">
              <h3>The Fundamentals of Digital Marketing</h3>
              <b className="status active">{t("cert.statusActive", "AKTIF")}</b>
            </div>
            <div className="cert-meta"><p>Google Digital Garage</p><span>{t("date.google", "APR 2021 — DES 2026")}</span></div>
          </div>
        </article>

        <article className="cert-item expired-cert">
          <div className="cert-index"><span>04</span><span className="cert-year">2021</span></div>
          <div className="cert-content">
            <div className="cert-name-row">
              <h3>Rekayasa Perangkat Lunak</h3>
              <b className="status expired">{t("cert.statusExpired", "BERAKHIR")}</b>
            </div>
            <div className="cert-meta"><p>Badan Nasional Sertifikasi Profesi</p><span>{t("date.bnsp", "SEP 2021 — SEP 2024")}</span></div>
          </div>
        </article>
      </div>
    <div className="cert-controls"><span className="cert-position" aria-live="polite" aria-atomic="true">01 / 04</span><div><button type="button" className="cert-prev" aria-label="Sertifikasi sebelumnya" aria-controls="cert-slider">←</button><button type="button" className="cert-next" aria-label="Sertifikasi berikutnya" aria-controls="cert-slider">→</button></div></div>
  </section></>}
