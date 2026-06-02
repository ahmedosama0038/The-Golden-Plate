
'use client'
import { useState } from 'react'
import TopBar from '@/components/admin/TopBar'
import { restaurantData } from '@/data/restaurant'
import { EOF } from 'dns/promises'

export default function HeroAdminPage() {
  const [form, setForm] = useState(restaurantData.hero)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    // لاحقاً: بنبعت للـ API
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <>
      <TopBar title="Hero Section" />
      <div className="adm-content" style={{ maxWidth: '700px' }}>
        <div className="adm-table-wrap" style={{ padding: '1.5rem' }}>

          <div className="adm-form-group">
            <label>Heading</label>
            <input value={form.heading} onChange={(e) => setForm({ ...form, heading: e.target.value })} />
          </div>

          <div className="adm-form-group">
            <label>Highlight Word (golden italic)</label>
            <input value={form.highlight} onChange={(e) => setForm({ ...form, highlight: e.target.value })} />
          </div>

          <div className="adm-form-group">
            <label>Description</label>
            <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ resize: 'vertical', background: 'var(--adm-bg)', border: '1px solid var(--adm-border)', borderRadius: '8px', color: 'var(--adm-text)', padding: '0.7rem', fontFamily: 'inherit', fontSize: '0.85rem', outline: 'none', width: '100%' }} />
          </div>

          <div className="adm-form-group">
            <label>CTA Button Text</label>
            <input value={form.ctaText} onChange={(e) => setForm({ ...form, ctaText: e.target.value })} />
          </div>

          <button className="adm-btn primary" onClick={handleSave}>
            <i className="fa-solid fa-floppy-disk" /> Save Changes
          </button>

          {saved && (
            <div style={{ marginTop: '1rem', color: 'var(--adm-green)', fontSize: '0.82rem' }}>
              <i className="fa-solid fa-check-circle" /> Saved successfully!
            </div>
          )}
        </div>
      </div>
    </>
  )
}

