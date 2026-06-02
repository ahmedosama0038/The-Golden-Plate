// ============================================================
//  data/restaurant.ts  —  بيانات المطعم
// ============================================================
//
//  ده أصله gp-data.js في المشروع القديم
//
//  الفرق في النسخة الجديدة:
//  1. كل شيء typed — TypeScript بيعرف شكل البيانات
//  2. as const — بيخلي البيانات readonly (مش ممكن تتغير بالغلط)
//  3. export مباشر — سهل import في أي مكان
// ============================================================

import type {
  RestaurantData,
  MenuItem,
  TeamMember,
  TimelineItem,
  Review,
  SocialLink,
} from '@/types'

// ─────────────────────────────────────────────────────────────
//  MENU ITEMS
// ─────────────────────────────────────────────────────────────

export const menuItems: MenuItem[] = [
  // ── STARTERS ──
  {
    id: 'item_001',
    name: 'Truffle Arancini',
    description: 'Crispy saffron risotto balls filled with black truffle and aged Parmesan, served with aioli.',
    price: 18,
    category: 'starters',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=600&auto=format&fit=crop',
    tags: ['vegetarian', 'signature'],
    featured: true,
  },
  {
    id: 'item_002',
    name: 'Seared Scallops',
    description: 'Pan-seared sea scallops on cauliflower purée with crispy capers and micro herbs.',
    price: 24,
    category: 'starters',
    image: 'https://images.unsplash.com/photo-1519984388953-d2406bc725e1?q=80&w=600&auto=format&fit=crop',
    tags: ['seafood', 'signature'],
    featured: true,
  },
  {
    id: 'item_003',
    name: 'Burrata & Heritage Tomato',
    description: 'Creamy burrata with heirloom tomatoes, basil oil, and aged balsamic.',
    price: 16,
    category: 'starters',
    image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?q=80&w=600&auto=format&fit=crop',
    tags: ['vegetarian'],
  },
  {
    id: 'item_004',
    name: 'Foie Gras Torchon',
    description: 'Silky duck foie gras with brioche toast, fig compote, and sea salt flakes.',
    price: 32,
    category: 'starters',
    image: 'https://images.unsplash.com/photo-1482012792084-a0c3725f289f?q=80&w=600&auto=format&fit=crop',
    tags: ['chef\'s pick'],
  },

  // ── MAINS ──
  {
    id: 'item_005',
    name: 'Wagyu Beef Tenderloin',
    description: 'A5 Wagyu tenderloin with bone marrow butter, truffle jus, and pomme purée.',
    price: 89,
    category: 'mains',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=600&auto=format&fit=crop',
    tags: ['signature', 'chef\'s pick'],
    featured: true,
  },
  {
    id: 'item_006',
    name: 'Pan-Roasted Sea Bass',
    description: 'Wild-caught sea bass on saffron bouillabaisse with fennel and rouille.',
    price: 52,
    category: 'mains',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=600&auto=format&fit=crop',
    tags: ['seafood'],
    featured: true,
  },
  {
    id: 'item_007',
    name: 'Duck Confit',
    description: 'Slow-cooked duck leg with cherry gastrique, lentils du Puy, and roasted garlic.',
    price: 44,
    category: 'mains',
    image: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?q=80&w=600&auto=format&fit=crop',
    tags: [],
  },
  {
    id: 'item_008',
    name: 'Wild Mushroom Risotto',
    description: 'Carnaroli rice with porcini, chanterelle, and truffle oil, finished with 36-month Parmesan.',
    price: 36,
    category: 'mains',
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=600&auto=format&fit=crop',
    tags: ['vegetarian'],
  },

  // ── DESSERTS ──
  {
    id: 'item_009',
    name: 'Valrhona Chocolate Sphere',
    description: 'Dark chocolate sphere melted tableside with warm caramel, cocoa soil, and gold leaf.',
    price: 19,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?q=80&w=600&auto=format&fit=crop',
    tags: ['signature'],
    featured: true,
  },
  {
    id: 'item_010',
    name: 'Seasonal Soufflé',
    description: 'Light-as-air soufflé with Tahitian vanilla bean and crème anglaise (20-min prep).',
    price: 17,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?q=80&w=600&auto=format&fit=crop',
    tags: ['vegetarian'],
  },
  {
    id: 'item_011',
    name: 'Mille-Feuille',
    description: 'Caramelized puff pastry with vanilla diplomat cream and raspberry coulis.',
    price: 15,
    category: 'desserts',
    image: 'https://images.unsplash.com/photo-1464195244916-405fa0a82545?q=80&w=600&auto=format&fit=crop',
    tags: ['vegetarian'],
  },

  // ── DRINKS ──
  {
    id: 'item_012',
    name: 'Golden Signature Cocktail',
    description: 'House blend of aged bourbon, elderflower, fresh lemon, and 24k gold flakes.',
    price: 22,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=600&auto=format&fit=crop',
    tags: ['signature', 'alcoholic'],
    sizes: [
      { label: 'Single', price: 22 },
      { label: 'Double', price: 38 },
    ],
  },
  {
    id: 'item_013',
    name: 'Vintage Reserve Wine',
    description: 'Curated selection from our award-winning cellar. Ask your sommelier for recommendations.',
    price: 18,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=600&auto=format&fit=crop',
    tags: ['alcoholic'],
    sizes: [
      { label: 'Glass', price: 18 },
      { label: 'Bottle', price: 95 },
    ],
  },
  {
    id: 'item_014',
    name: 'Artisan Cold Brew',
    description: 'Single-origin Ethiopian cold brew, slow-steeped 24 hours with notes of jasmine and citrus.',
    price: 9,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=600&auto=format&fit=crop',
    tags: ['non-alcoholic'],
  },
]

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
//  REVIEWS
// ─────────────────────────────────────────────────────────────

export const defaultReviews: Review[] = [
  {
    id: 'rev_001',
    name: 'Sophia L.',
    rating: 5,
    text: 'An extraordinary experience. The Wagyu was the finest I\'ve ever tasted, and the service was impeccable.',
    status: 'approved',
    createdAt: '2025-11-15T19:30:00Z',
  },
  {
    id: 'rev_002',
    name: 'Marcus T.',
    rating: 5,
    text: 'The chocolate sphere dessert is pure theatre. We celebrated our anniversary and felt truly special.',
    status: 'approved',
    createdAt: '2025-12-02T20:15:00Z',
  },
  {
    id: 'rev_003',
    name: 'Yuki N.',
    rating: 4,
    text: 'Beautifully crafted dishes with incredible attention to detail. The sommelier\'s pairing was inspired.',
    status: 'approved',
    createdAt: '2026-01-08T18:45:00Z',
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
//  ده الـ object الرئيسي اللي بيجمع كل حاجة
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
  menuItems,
  reviews: defaultReviews,

  stats: {
    years: 7,
    guests: 50,     // 50K
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
