import { Link } from 'react-router-dom'
import { useLanguage } from '../language'
export default function Skills(){const {t}=useLanguage();return <><div className="page-intro"><Link to="/index.html">{t("nav.home", "← Beranda")}</Link><h1>{t("nav.skills", "Kemampuan")}</h1></div><section id="stack" className="section stack">
    <div className="section-head"><span>03 / <span>{t("section.capabilities", "KEMAMPUAN")}</span></span><span>STACK</span></div>
    <div className="stack-list">
      <article><span>01</span><h3>Frontend</h3><p>React · Next.js · TypeScript<br />HTML · CSS · Tailwind CSS</p></article>
      <article><span>02</span><h3>Backend</h3><p>Node.js · Express.js · REST API · Authentication</p></article>
      <article><span>03</span><h3>Mobile</h3><p>Flutter · Dart · React Native · Cross-platform Development</p></article>
      <article><span>04</span><h3>Data & Tools</h3><p>MySQL · PostgreSQL · Firebase · Git · GitHub · Postman · Figma · VS Code</p></article>
    </div>
  </section></>}
