import { Link } from 'react-router-dom'
import { useLanguage } from '../language'
export default function About(){const {t}=useLanguage();return <><div className="page-intro"><Link to="/index.html">{t("nav.home", "← Beranda")}</Link><h1>{t("nav.about", "Tentang")}</h1></div><section id="about" className="section profile">
    <div className="section-head"><span>01 / <span>{t("section.about", "TENTANG")}</span></span></div>
    <h2 className="profile-heading">{t("hero.desc", "Saya membangun aplikasi web dengan React, Node.js, dan database SQL. Menangani frontend, REST API, autentikasi, dan integrasi data.")}</h2>
    <div className="about-copy">
      <p>{t("about.p1", "Mahasiswa S1 Informatika Universitas Muhammadiyah Magelang dengan fokus pada Software Development.")}</p>
      <p>{t("about.p2", "Pengalaman pengembangan mencakup dashboard inventaris berbasis QR Code di BNNK Magelang dan implementasi antarmuka di PT Asta Brata Teknologi.")}</p>
    </div>
  </section></>}
