// ============================================================
//  data/restaurant.ts  —  بيانات المطعم
//  المنيو والتقييمات بقوا جايين من الـ API (ريم)، فاتشالوا من هنا
//  أي حقل فاضي في contact أو socials بيتخفي من الموقع لوحده
// ============================================================

import type {
  RestaurantData,
  TeamMember,
  TimelineItem,
  SocialLink,
} from '@/types'

// ─────────────────────────────────────────────────────────────
//  TEAM  (TODO: وهمي، صفحة About مخفية من الناف لحد ما تتغير)
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
//  TIMELINE  (TODO: وهمي)
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
//  فاضية لحد ما يبقى فيه روابط حقيقية. الشكل:
//  { platform: 'instagram', url: 'https://instagram.com/اسم_الحساب', icon: 'fa-brands fa-instagram' }
// ─────────────────────────────────────────────────────────────

export const socialLinks: SocialLink[] = []

// ─────────────────────────────────────────────────────────────
//  FULL RESTAURANT DATA OBJECT
// ─────────────────────────────────────────────────────────────

export const restaurantData: RestaurantData = {
  settings: {
    restaurantName: 'The Golden Plate',
    tagline: 'Crafted for the discerning palate.',
    currency: 'ج.م',
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

  // الحقل الفاضي بيتخفي من صفحة الحجز. عبّيه لما تعرف القيمة الحقيقية.
  contact: {
    address: '',         // العنوان بالتفصيل
    phone: '01021245010',
    email: '',
    whatsapp: '01021245010', // بيتقبل بالصفر أو بكود مصر، والتحويل أوتوماتيك
    mapEmbedUrl: '',     // الـ src بتاع iframe من Google Maps ← Share ← Embed a map
    hoursWeekday: '',    // مثال: 'السبت–الخميس: 12:00 PM – 11:00 PM'
    hoursWeekend: '',    // مثال: 'الجمعة: 1:00 PM – 12:00 AM'
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