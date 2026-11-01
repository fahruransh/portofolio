
import { useLanguage } from '../language'
export default function Home(){
 const {t,language}=useLanguage()
 const en=language==='en'

 return <><section className="hero" aria-labelledby="hero-title"><div className="hero-symbol hero-portrait"><picture><source type="image/webp" srcSet={`${import.meta.env.BASE_URL}fahrur-portrait-812.webp 812w, ${import.meta.env.BASE_URL}fahrur-portrait-1624.webp 1624w`} sizes="max(100vw, 207svh)"/><img src={import.meta.env.BASE_URL + "fahrur-portrait.png"} alt="Fahrur Anshori" width="1624" height="912" fetchPriority="high" /></picture></div><div className="location-tag"><span>{en?'Located in':'Berlokasi di'}<br />Magelang,<br />Indonesia</span><span className="globe" aria-hidden="true">◎</span></div><div className="hero-role"><span className="role-arrow" aria-hidden="true">↘</span><p>Fullstack &<br />Mobile Developer</p></div><div className="name-track"><h1 id="hero-title">Fahrur Anshori —</h1><span aria-hidden="true">Fahrur Anshori —</span></div><a className="hero-scroll" href="#experience"><span aria-hidden="true">↓</span><span className="hero-scroll-label">{en?'Experience':'Pengalaman'}</span></a><div className="hero-bottom"><span className="hero-index">PORTFOLIO / 2026</span></div></section>
<section id="experience" className="section">
    <div className="section-head"><h2>01 / <span>{t("section.experience", "PENGALAMAN")}</span></h2><span>{t("common.selected", "PILIHAN")}</span></div>
    <div className="career-list">
      <article>
        <div><span>2025</span><b>BNNK Magelang</b></div>
        <div>
          <h3>Fullstack Developer</h3>
          <p>{t("experience.bnnk", "Merancang dan mengembangkan dashboard inventaris berbasis QR Code dari analisis kebutuhan, UI, database, frontend, backend hingga pengujian sistem.")}</p>
          <small>{t("date.bnnk", "AGUSTUS 2025 — NOVEMBER 2025")}</small>
        </div>
      </article>
      <article>
        <div><span>2021</span><b>PT Asta Brata Teknologi</b></div>
        <div>
          <h3>Frontend Developer</h3>
          <p>{t("experience.asta", "Membantu pengembangan antarmuka aplikasi dengan fokus pada implementasi UI yang responsif, rapi, mudah digunakan, serta berkolaborasi dengan tim pengembang.")}</p>
          <small>{t("date.asta", "MARET 2021 — MEI 2021")}</small>
        </div>
      </article>
    </div>
  </section><section id="work" className="section work">
    <div className="section-head"><h2>02 / <span>{t("section.work", "PROJECT PILIHAN")}</span></h2><span>2024—2026</span></div>
    <article className="work-entry"><div className="work-row"><div className="work-title"><h3>BNNK Inventory Dashboard</h3></div><span className="work-category">Fullstack Development · 2025</span></div><details className="work-details"><summary><span>{t("work.details", "Detail project")}</span><span aria-hidden="true">＋</span></summary><div className="project-grid">
        <p>{t("work.desc", "Sistem dashboard inventaris berbasis QR Code untuk membantu proses pengelolaan, identifikasi, dan pencatatan aset di BNNK Magelang.")} <a className="project-profile" href="https://github.com/zucksfox?tab=repositories" target="_blank" rel="noreferrer">{en?'Browse my GitHub repositories ↗':'Lihat daftar repository GitHub saya ↗'}</a></p>
        <div>
          <small>{t("work.roleLabel", "PERAN SAYA")}</small><p>Fullstack Developer</p>
          <small>{t("work.scopeLabel", "CAKUPAN")}</small><p>UI · Frontend · Backend · Database · QR Integration</p>
        </div>
        <ul className="project-deliverables">
          <li>{t("work.ui", "Merancang dan mengimplementasikan UI dashboard inventaris.")}</li>
          <li>{t("work.backend", "Mengembangkan backend dan database pencatatan aset.")}</li>
          <li>{t("work.qr", "Mengintegrasikan QR Code untuk identifikasi aset.")}</li>
          <li>{t("work.testing", "Melakukan pengujian dan troubleshooting sistem.")}</li>
        </ul>
      </div></details></article></section></>}
