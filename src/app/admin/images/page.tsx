
import TopBar from '@/components/admin/TopBar'

export default function ImagesAdminPage() {
  return (
    <>
      <TopBar title="Images" />
      <div className="adm-content">
        <div className="adm-empty" style={{ marginTop: '4rem' }}>
          <i className="fa-solid fa-photo-film" />
          <p>Image management will be available after API integration.</p>
        </div>
      </div>
    </>
  )
}