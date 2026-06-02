
'use client'
import { useState } from 'react'
import TopBar from '@/components/admin/TopBar'
import { restaurantData } from '@/data/restaurant'

export default function SettingsPage() {
  const [settings, setSettings] = useState(restaurantData.settings)
  const [saved, setSaved] = useState(false)
  const toggle = (key: string) => setSettings((p) => ({ ...p, [key]: !(p as any)[key] }))

  const TOGGLES = [
    { key: 'enableOrdering',      label: 'Enable Online Ordering'      },
    { key: 'enableReservations',  label: 'Enable Reservations'         },
    { key: 'enableWhatsapp',      label: 'Enable WhatsApp Orders'      },
    { key: 'maintenanceMode',     label: 'Maintenance Mode'            },
  ]

  return (
    <>
      <TopBar title="Settings" />
      <div className="adm-content" style={{ maxWidth: '600px' }}>
        <div className="adm-table-wrap" style={{ padding: '1.5rem' }}>

          <div className="adm-form-group">
            <label>Restaurant Name</label>
            <input value={settings.restaurantName} onChange={(e) => setSettings({ ...settings, restaurantName: e.target.value })} />
          </div>

          <div className="adm-form-group">
            <label>Tagline</label>
            <input value={settings.tagline} onChange={(e) => setSettings({ ...settings, tagline: e.target.value })} />
          </div>

          <div className="adm-form-group">
            <label>Currency Symbol</label>
            <input value={settings.currency} onChange={(e) => setSettings({ ...settings, currency: e.target.value })} style={{ maxWidth: '80px' }} />
          </div>

          {/* Toggles */}
          <div style={{ borderTop: '1px solid var(--adm-border)', paddingTop: '1rem', marginTop: '0.5rem' }}>
            {TOGGLES.map(({ key, label }) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.7rem 0', borderBottom: '1px solid var(--adm-border)' }}>
                <span style={{ fontSize: '0.85rem' }}>{label}</span>
                <button
                  onClick={() => toggle(key)}
                  style={{
                    width: '44px', height: '24px', borderRadius: '50px',
                    background: (settings as any)[key] ? 'var(--adm-green)' : 'var(--adm-border)',
                    border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.3s',
                  }}
                >
                  <span style={{
                    position: 'absolute', top: '4px',
                    left: (settings as any)[key] ? '22px' : '4px',
                    width: '16px', height: '16px', borderRadius: '50%',
                    background: '#fff', transition: 'left 0.3s',
                  }} />
                </button>
              </div>
            ))}
          </div>

          <button className="adm-btn primary" style={{ marginTop: '1.2rem' }} onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 3000) }}>
            <i className="fa-solid fa-floppy-disk" /> Save Settings
          </button>
          {saved && <div style={{ marginTop: '1rem', color: 'var(--adm-green)', fontSize: '0.82rem' }}><i className="fa-solid fa-check-circle" /> Settings saved!</div>}
        </div>
      </div>
    </>
  )
}