'use client'

import { useState, useEffect } from 'react'
import TopBar from '@/components/admin/TopBar'
import { toast } from '@/lib/toast'

// البيانات الافتراضية للمطعم في حال لو مفيش حاجة متسجلة في الـ LocalStorage
const DEFAULT_CONTACT = {
  address: '123 Luxury St, New York, NY',
  phone: '+1 212 555 0199',
  email: 'info@goldenplate.com',
  whatsapp: '+1 212 555 0120',
  hoursWeekday: 'Mon - Fri: 11:00 AM - 11:00 PM',
  hoursWeekend: 'Sat - Sun: 10:00 AM - 11:30 PM',
}

export default function ContactInfoAdminPage() {
  const [form, setForm] = useState(DEFAULT_CONTACT)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // ── 1️⃣ جلب البيانات من الـ LocalStorage أول ما الصفحة تفتح ──
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('restaurant_contact')
      if (savedData) {
        try {
          setForm(JSON.parse(savedData))
        } catch (e) {
          console.error("Failed to parse contact data", e)
        }
      }
      setIsLoading(false)
    }
  }, [])

  // دالة لتحديث الحقول أثناء الكتابة
  const updateField = (field: string, val: string) => {
    setForm((p) => ({ ...p, [field]: val }))
  }

  // ── 2️⃣ حفظ التعديلات جوه الـ LocalStorage ──
  const handleSave = () => {
    setIsSaving(true)
    
    setTimeout(() => {
      localStorage.setItem('restaurant_contact', JSON.stringify(form))
      setIsSaving(false)
      toast.success('Contact info updated successfully in local storage!')
    }, 600) // إنيميشن وهمي خفيف عشان يحسس المستخدم بالسرعة والواقعية
  }

  return (
    <>
      <TopBar title="Contact Info" />
      <div className="adm-content" style={{ maxWidth: '700px' }}>

        {isLoading && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--adm-muted)' }}>
            <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem' }} />
          </div>
        )}

        {!isLoading && (
          <div className="adm-table-wrap" style={{ padding: '1.5rem' }}>
            {[
              { key: 'address',      label: 'Address'          },
              { key: 'phone',        label: 'Phone'            },
              { key: 'email',        label: 'Email'            },
              { key: 'whatsapp',     label: 'WhatsApp Number'  },
              { key: 'hoursWeekday', label: 'Weekday Hours'    },
              { key: 'hoursWeekend', label: 'Weekend Hours'    },
            ].map(({ key, label }) => (
              <div key={key} className="adm-form-group" style={{ marginBottom: '1.2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 500 }}>
                  {label}
                </label>
                <input 
                  value={(form as any)[key]} 
                  onChange={(e) => updateField(key, e.target.value)} 
                  disabled={isSaving}
                  style={{ 
                    width: '100%', 
                    padding: '0.6rem', 
                    borderRadius: '6px', 
                    border: '1px solid var(--adm-border)', 
                    background: 'var(--adm-bg-dark)', 
                    color: '#fff' 
                  }}
                />
              </div>
            ))}

            {/* زرار الحفظ الذكي */}
            <button 
              className="adm-btn primary" 
              onClick={handleSave}
              disabled={isSaving}
              style={{ marginTop: '0.5rem' }}
            >
              {isSaving ? (
                <><i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '0.4rem' }} /> Saving...</>
              ) : (
                <><i className="fa-solid fa-floppy-disk" style={{ marginRight: '0.4rem' }} /> Save Changes</>
              )}
            </button>
          </div>
        )}
      </div>
    </>
  )
}