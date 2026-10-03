'use server'

import { cookies } from 'next/headers'

export async function login(username: string, password: string) {
  // Mock login مؤقت
  if (username === 'Admin' && password === 'admin123') {
    (await cookies()).set('token', 'mock-token-123', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24,
      path: '/',
    })
    return { success: true }
  }
  return { success: false }
}

export async function logout() {
  (await cookies()).delete('token')
}

export async function getToken() {
  const token = (await cookies()).get('token')?.value
  return token
}