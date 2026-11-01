import { useLanguage } from './language'
import HalftoneWordmarkFooter from '@/components/ui/halftone-wordmark-footer'
import './styles/globals.css'

export default function PortfolioFooter() {
  const {language} = useLanguage()
  const en = language === 'en'
  return <div className="w-full"><HalftoneWordmarkFooter
    wordmark="fahrur" label="Fahrur Anshori" meta="©2026 · Magelang, Indonesia"
    palette={{ background: '#000000', ink: '#ffffff', warm: '#ffffff' }}
    fontFamily="DM, Arial, sans-serif" dotGap={5} radius={85} crop={0.18} grain={0.35}
    height="clamp(560px, 48vw, 740px)"
    columns={[
      { title: en ? 'Navigate' : 'Navigasi', links: [{ label: en ? 'Projects' : 'Project', href: 'index.html#work' }, { label: en ? 'About' : 'Tentang', href: 'about.html' }, { label: en ? 'Capabilities' : 'Kemampuan', href: 'skills.html' }, { label: en ? 'Certifications' : 'Sertifikasi', href: 'certifications.html' }] },
      { title: 'Social', links: [{ label: 'GitHub ↗', href: 'https://github.com/zucksfox?tab=repositories' }, { label: 'LinkedIn ↗', href: 'https://www.linkedin.com/in/fahrur-anshori/' }] },
      { title: en ? 'Contact' : 'Kontak', links: [{ label: en ? 'Contact page ↗' : 'Halaman kontak ↗', href: 'contact.html' }, { label: 'fahruransh@gmail.com', href: 'mailto:fahruransh@gmail.com' }] },
    ]}
  /></div>
}
