'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, LoginData } from '@/lib/schemas'
import { login } from '@/lib/auth'


export default function AdminLoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  })


// ...

const onSubmit = async (data: LoginData) => {
  setError('')
  try {
    const result = await login(data.username, data.password)

    if (result.success) {
      router.push('/admin/dashboard')
    } else {
      setError('Invalid credentials')
    }
  } catch (err) {
    setError('Invalid credentials')
  }
}

  return (
    <div className="adm-login-wrap">
      <div className="adm-login-bg"></div>
      <div className="adm-login-overlay"></div>

      <div className="adm-login-card animate-up">
        <div className="login-header">
          <i className="fa-solid fa-utensils"></i>
          <h1>The Golden Plate</h1>
          <p>Admin Portal Access</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="login-form">

          <div className="input-group">
            <input {...register('username')} placeholder=" " id="username" />
            <label htmlFor="username">Username</label>
            {errors.username && (
              <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                {errors.username.message}
              </span>
            )}
          </div>

          <div className="input-group">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder=" "
              id="password"
            />
            <label htmlFor="password">Password</label>
            <i
              className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} toggle-password`}
              onClick={() => setShowPassword(!showPassword)}
              style={{ cursor: 'pointer' }}
            ></i>
            {errors.password && (
              <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                {errors.password.message}
              </span>
            )}
          </div>

          {error && (
            <div style={{ padding: '0.7rem', marginBottom: '1rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#ef4444', fontSize: '0.8rem', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <div className="form-options">
            <label className="checkbox-container">
              <input type="checkbox" defaultChecked />
              <span className="checkmark"></span>
              Remember me
            </label>
            <a href="#" className="forgot-pass">Forgot Password?</a>
          </div>

          <button type="submit" className="btn-login" disabled={isSubmitting}>
            {isSubmitting ? (
              <><i className="fa-solid fa-spinner fa-spin" /> Signing in...</>
            ) : (
              <><span className="btn-text">Sign In to Dashboard</span> <i className="fa-solid fa-arrow-right"></i></>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}