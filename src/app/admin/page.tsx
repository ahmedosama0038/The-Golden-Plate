
'use client'

import { useState }    from 'react'
import { useRouter }   from 'next/navigation'
import { useForm }     from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, LoginData } from '@/lib/schemas'

export default function AdminLoginPage() {
  const router   = useRouter()
  const [error,  setError]   = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginData) => {
    setError('')
    try {
      // مؤقتاً: mock login حتى علياء تخلص الـ API
      // هنبدله بـ authApi.login لاحقاً
      if (data.username === 'admin' && data.password === 'admin123') {
        // نحفظ token مؤقت في cookie
        document.cookie = 'token=mock-token-123; path=/; max-age=86400'
        router.push('/admin/dashboard')
      } else {
        setError('Invalid credentials')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="adm-login-wrap" style={{ marginLeft: 0 }}>
      <div className="adm-login-card">

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 700, color: 'var(--adm-gold)', marginBottom: '0.3rem' }}>
            The Golden Plate
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--adm-muted)', letterSpacing: '2px', textTransform: 'uppercase' }}>
            Admin Panel
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>

          <div className="adm-form-group">
            <label>Username</label>
            <input {...register('username')} placeholder="admin" />
            {errors.username && (
              <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>
                {errors.username.message}
              </span>
            )}
          </div>

          <div className="adm-form-group">
            <label>Password</label>
            <input {...register('password')} type="password" placeholder="••••••••" />
            {errors.password && (
              <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>
                {errors.password.message}
              </span>
            )}
          </div>

          {error && (
            <div style={{ padding: '0.7rem', marginBottom: '1rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#ef4444', fontSize: '0.8rem', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="adm-btn primary"
            disabled={isSubmitting}
            style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}
          >
            {isSubmitting
              ? <><i className="fa-solid fa-spinner fa-spin" /> Signing in...</>
              : <><i className="fa-solid fa-right-to-bracket" /> Sign In</>
            }
          </button>

        </form>

        {/* hint مؤقت */}
        <p style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--adm-muted)', fontSize: '0.72rem' }}>
          Temp: admin / admin123
        </p>

      </div>
    </div>
  )
}