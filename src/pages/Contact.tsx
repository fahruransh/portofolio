import { Link } from "react-router-dom";
import { useLanguage } from "../language";
export default function Contact() {
  const { t } = useLanguage();
  return (
    <>
      <div className="page-intro">
        <Link to="/index.html">{t("nav.home", "← Beranda")}</Link>
        <h1>{t("nav.contact", "Kontak")}</h1>
      </div>
      <section id="contact" className="section contact">
        <span>
          06 / <span>{t("section.contact", "KONTAK")}</span>
        </span>
        <h2>{t("contact.heading", "Mari bekerja\nbersama.")}</h2>
        <a className="contact-orb" href="mailto:fahruransh@gmail.com">
          {t("nav.emailMe", "Hubungi saya ↗")}
        </a>
      </section>
    </>
  );
}
