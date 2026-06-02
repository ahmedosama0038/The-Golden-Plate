
'use client'
import { useState } from 'react'
import TopBar from '@/components/admin/TopBar'
import { restaurantData } from '@/data/restaurant'

export default function AboutAdminPage() {
  const [form, setForm] = useState(restaurantData.about)
  const [saved, setSaved] = useState(false)

  return (
    <>
      <TopBar title="About Page" />
      <div className="adm-content" style={{ maxWidth: '700px' }}>
        <div className="adm-table-wrap" style={{ padding: '1.5rem' }}>

          <div className="adm-form-group">
            <label>Story (Paragraph 1)</label>
            <textarea rows={4} value={form.story} onChange={(e) => setForm({ ...form, story: e.target.value })} style={{ resize: 'vertical', background: 'var(--adm-bg)', border: '1px solid var(--adm-border)', borderRadius: '8px', color: 'var(--adm-text)', padding: '0.7rem', fontFamily: 'inherit', fontSize: '0.85rem', outline: 'none', width: '100%' }} />
          </div>

          <div className="adm-form-group">
            <label>Story (Paragraph 2)</label>
            <textarea rows={4} value={form.story2} onChange={(e) => setForm({ ...form, story2: e.target.value })} style={{ resize: 'vertical', background: 'var(--adm-bg)', border: '1px solid var(--adm-border)', borderRadius: '8px', color: 'var(--adm-text)', padding: '0.7rem', fontFamily: 'inherit', fontSize: '0.85rem', outline: 'none', width: '100%' }} />
          </div>

          <button className="adm-btn primary" onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 3000) }}>
            <i className="fa-solid fa-floppy-disk" /> Save Changes
          </button>
          {saved && <div style={{ marginTop: '1rem', color: 'var(--adm-green)', fontSize: '0.82rem' }}><i className="fa-solid fa-check-circle" /> Saved!</div>}
        </div>
      </div>
    </>
  )
}

