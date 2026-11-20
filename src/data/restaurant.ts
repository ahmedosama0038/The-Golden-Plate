// ============================================================
//  data/restaurant.ts  —  بيانات المطعم
//  المنيو والتقييمات بقوا جايين من الـ API (ريم)، فاتشالوا من هنا
// ============================================================

import type {
  RestaurantData,
  TeamMember,
  TimelineItem,
  SocialLink,
} from '@/types'

// ─────────────────────────────────────────────────────────────
//  TEAM
// ─────────────────────────────────────────────────────────────

export const teamMembers: TeamMember[] = [
  {
    id: 'team_001',
    name: 'Élise Moreau',
    role: 'Executive Chef',
    image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: 'team_002',
    name: 'Marco Ferretti',
    role: 'Pastry Chef',
    image: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: 'team_003',
    name: 'Aiko Tanaka',
    role: 'Head Sommelier',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: 'team_004',
    name: 'James Okafor',
    role: 'Restaurant Director',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
  },
]

// ─────────────────────────────────────────────────────────────
//  TIMELINE
// ─────────────────────────────────────────────────────────────

export const timeline: TimelineItem[] = [
  {
    year: '2018',
    title: 'The First Flame',
    description: 'Opened our doors with a 12-seat kitchen and a menu of 6 signature dishes.',
  },
  {
    year: '2020',
    title: 'Expanded Horizons',
    description: 'Moved to our flagship location, doubling capacity and adding a private dining wing.',
  },
  {
    year: '2023',
    title: 'Recognized Excellence',
    description: 'Awarded "Best New Fine Dining" and featured in Culinary Monthly magazine.',
  },
  {
    year: '2026',
    title: 'Digital & Global Reach',
    description: 'Launched premium online ordering, bringing the golden experience to your doorstep.',
  },
]

// ─────────────────────────────────────────────────────────────
//  SOCIAL LINKS
// ─────────────────────────────────────────────────────────────

export const socialLinks: SocialLink[] = [
  { platform: 'instagram', url: 'https://instagram.com', icon: 'fa-brands fa-instagram' },
  { platform: 'facebook', url: 'https://facebook.com', icon: 'fa-brands fa-facebook-f' },
  { platform: 'twitter', url: 'https://twitter.com', icon: 'fa-brands fa-x-twitter' },
]

// ─────────────────────────────────────────────────────────────
//  FULL RESTAURANT DATA OBJECT
// ─────────────────────────────────────────────────────────────

export const restaurantData: RestaurantData = {
  settings: {
    restaurantName: 'The Golden Plate',
    tagline: 'Crafted for the discerning palate.',
    currency: '$',
    accentColor: '#E0E0E0',
    enableOrdering: true,
    enableReservations: true,
    enableWhatsapp: true,
    maintenanceMode: false,
  },

  hero: {
    heading: 'Where {highlight} Meets Elegance',
    highlight: 'Flavor',
    description:
      'An exquisite culinary journey crafted with passion, precision, and the finest ingredients. Taste the artistry in every bite.',
    ctaText: 'Explore the Menu',
  },

  // TODO: بيانات وهمية، غيّرها بالحقيقية قبل أي عرض
  contact: {
    address: '123 Golden Avenue, Luxury District, New York, NY 10001',
    phone: '+1 (212) 555-0199',
    email: 'reservations@goldenplate.com',
    whatsapp: '12125550199',
    mapEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.11976397304603!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1734567890123',
    hoursWeekday: 'Mon–Fri: 12:00 PM – 11:00 PM',
    hoursWeekend: 'Sat–Sun: 11:00 AM – 12:00 AM',
  },

  socials: socialLinks,
  team: teamMembers,
  timeline,

  stats: {
    years: 7,
    guests: 50, // 50K
    awards: 12,
    satisfaction: 98,
  },

  about: {
    story:
      'Founded in 2018, The Golden Plate was born from a simple belief: that food is more than sustenance — it is memory, identity, and art.',
    story2:
      'Our founder, inspired by decades of travel across Mediterranean and Asian culinary heartlands, gathered a team of artisans who share one vision — to craft meals that transcend expectation.',
  },
}