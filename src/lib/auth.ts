'use server'

import axios from 'axios'
import { cookies } from 'next/headers'

const serverApi = axios.create({
  baseURL: 'https://myrestaurant.runasp.net/api',
})

export async function login(username: string, password: string) {
  const response = await serverApi.post('/Auth/login', { username, password })
  const token = response.data.token

  if (token) {
    (await cookies()).set('token', token, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24,
    })
  }
}

export async function logout() {
  (await cookies()).delete('token')
}

export async function getToken() {
  const token = (await cookies()).get('token')?.value
  return token
}