
'use client'
import { useState } from 'react'
import TopBar from '@/components/admin/TopBar'
import { EOF } from 'dns/promises'

export default function AccountPage() {
  const [form, setForm] = useState({ username: 'admin', currentPassword: '', newPassword: '', confirmPassword: '' })
  const [saved, setSaved] = useState(false)

  return (
    <>
      <TopBar title="Account" />
      <div className="adm-content" style={{ maxWidth: '500px' }}>
        <div className="adm-table-wrap" style={{ padding: '1.5rem' }}>

          <div className="adm-form-group">
            <label>Username</label>
            <input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
          </div>
          <div className="adm-form-group">
            <label>Current Password</label>
            <input type="password" placeholder="••••••••" value={form.currentPassword} onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} />
          </div>
          <div className="adm-form-group">
            <label>New Password</label>
            <input type="password" placeholder="••••••••" value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} />
          </div>
          <div className="adm-form-group">
            <label>Confirm New Password</label>
            <input type="password" placeholder="••••••••" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
          </div>

          <button className="adm-btn primary" onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 3000) }}>
            <i className="fa-solid fa-floppy-disk" /> Update Account
          </button>
          {saved && <div style={{ marginTop: '1rem', color: 'var(--adm-green)', fontSize: '0.82rem' }}><i className="fa-solid fa-check-circle" /> Updated!</div>}
        </div>
      </div>
    </>
  )
}

