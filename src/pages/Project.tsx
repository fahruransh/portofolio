import { Link, useSearchParams } from 'react-router-dom'
import { useLanguage } from '../language'

export default function Project() {
  const [params] = useSearchParams()
  const { t, language } = useLanguage()
  const en = language === 'en'
  const barede = params.get('slug') === 'bukit-barede'
  const inventory = params.get('slug') === 'bnnk-inventory'
  if (!barede && !inventory) return <section className="section"><h1>{en ? 'Project not found' : 'Project tidak ditemukan'}</h1><Link to="/#work">← {en ? 'Selected projects' : 'Project pilihan'}</Link></section>
  const title = barede ? 'Bukit Barede Ticket Website' : 'BNNK Inventory Dashboard'
  return <>
    <div className="page-intro"><Link to="/#work">← {en ? 'Selected projects' : 'Project pilihan'}</Link><h1>{title}</h1></div>
    <section className="section project-detail">
      <figure><img src={import.meta.env.BASE_URL + (barede ? 'project-barede-placeholder.jpg' : 'project-inventory-placeholder.jpg')} alt="" width="640" height="440" /><figcaption>{en ? 'Placeholder image — not a project screenshot.' : 'Gambar sementara — bukan screenshot project.'}</figcaption></figure>
      <h2>{en ? 'About the project' : 'Tentang project'}</h2>
      {barede ? <p>{en ? 'Ticket website for Bukit Barede. Further project details will be added.' : 'Website tiket Bukit Barede. Detail project selengkapnya akan ditambahkan.'}</p> : <>
        <p>{t('work.desc', 'Sistem dashboard inventaris berbasis QR Code untuk membantu proses pengelolaan, identifikasi, dan pencatatan aset di BNNK Magelang.')}</p>
        <h2>{t('work.roleLabel', 'PERAN SAYA')}</h2><p>Fullstack Developer</p>
        <h2>{t('work.scopeLabel', 'CAKUPAN')}</h2><p>UI · Frontend · Backend · Database · QR Integration</p>
        <ul>
          <li>{t('work.ui', 'Merancang dan mengimplementasikan UI dashboard inventaris.')}</li>
          <li>{t('work.backend', 'Mengembangkan backend dan database pencatatan aset.')}</li>
          <li>{t('work.qr', 'Mengintegrasikan QR Code untuk identifikasi aset.')}</li>
          <li>{t('work.testing', 'Melakukan pengujian dan troubleshooting sistem.')}</li>
        </ul>
        <a className="project-profile" href="https://github.com/zucksfox?tab=repositories" target="_blank" rel="noreferrer">{en ? 'Browse my GitHub repositories ↗' : 'Lihat daftar repository GitHub saya ↗'}</a>
      </>}
    </section>
  </>
}
