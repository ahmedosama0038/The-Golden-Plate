import TrackClient from '@/components/track/TrackClient'
import type { Metadata } from 'next'


export const metadata: Metadata = { title: 'Track Order' }

export default function TrackPage() {
  return <TrackClient />
}