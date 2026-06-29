'use server'

import axios from 'axios'
import { cookies } from 'next/headers'

const serverApi = axios.create({
  baseURL: 'https://goldenapi.site.je/api', // 🆕 الدومين الجديد
})

export async function login(username: string, password: string) {
  const response = await serverApi.post('/Auth/login', { username, password })
console.log('Login response:', JSON.stringify(response.data)) //
  
  const token = response.data?.data?.token ?? response.data?.token

  if (token) {
    ;(await cookies()).set('token', token, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24,
    })
    return { success: true }
  }

  return { success: false }
}

export async function logout() {
  ;(await cookies()).delete('token')
}

export async function getToken() {
  const token = (await cookies()).get('token')?.value
  return token
}