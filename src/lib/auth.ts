'use server'

import { cookies } from 'next/headers'

const API_URL = process.env.API_URL

// شكل الرد اللي ريم بترجعه
type LoginResponse = {
  status?: boolean
  message?: string
  data?: {
    token?: string
    user?: {
      id: number
      name: string
      email: string
      roles: string[]
    }
  }
}

export async function login(email: string, password: string) {
  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ email, password }),
      cache: 'no-store',
    })

    const text = await res.text()

    let body: LoginResponse
    try {
      body = JSON.parse(text)
    } catch {
      return {
        success: false,
        message: 'The server returned an unexpected response (hosting issue)',
      }
    }

    const token = body.data?.token

    if (!res.ok || !token) {
      return { success: false, message: body.message ?? 'Login failed' }
    }

    ;(await cookies()).set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24,
      path: '/',
    })

    return { success: true }
  } catch {
    return { success: false, message: 'Cannot reach the server' }
  }
}

export async function logout() {
  (await cookies()).delete('token')
}

export async function getToken() {
  const token = (await cookies()).get('token')?.value
  return token
}