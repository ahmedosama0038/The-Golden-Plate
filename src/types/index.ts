
// ─── Menu ───────────────────────────────────────────────────
export type MenuCategory = 'starters' | 'mains' | 'desserts' | 'drinks'
// 'type' هنا لأننا بنحدد "اختيار من عدة قيم" مش object
export interface MenuItemSize {
  id?: string;     
  label?: string;   
  name?: string;    
  price: number;
}
// types/index.ts — أضيف الـ fields الجديدة
export interface MenuItem {
  id:           string | number
  name:         string
  description:  string
  price:        number
  category:     MenuCategory | string | number
  image:        string        // للـ static data
  itemImage:    string | null // من الـ API ← جديد
  categoryId?:  number
  categoryName?: string
  priceList?:   { price: number; size: number }[]
  tags?:        string[]
  sizes?:       MenuItemSize[]
  featured?:    boolean
  available?:   boolean
  discount?:    number
}
// ─── Cart ───────────────────────────────────────────────────
export interface CartItem {
  id: string          
  menuItemId: string  
  name: string
  price: number       
  image: string
  quantity: number
  size?: string
}

// ─── Order ──────────────────────────────────────────────────
export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'delivered'
  | 'cancelled'

export interface Order {
  id: string
  items: CartItem[]
  total: number
  status: OrderStatus
  customerName?: string
  customerPhone?: string
  notes?: string
  createdAt: string
}

// ─── Reservation ────────────────────────────────────────────
export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled'

export interface Reservation {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  date: string
  time: string
  guests: string
  notes?: string
  status: ReservationStatus
  createdAt: string
}

// ─── Review ─────────────────────────────────────────────────
export type ReviewStatus = 'pending' | 'approved' | 'rejected'

export interface Review {
  id: string
  name: string
  rating: number       // 1 → 5
  text: string
  status: ReviewStatus
  createdAt: string
}

// ─── Team & Timeline (About page) ───────────────────────────
export interface TeamMember {
  id: string
  name: string
  role: string
  image: string
}

export interface TimelineItem {
  year: string
  title: string
  description: string
}

// ─── Social & Contact ───────────────────────────────────────
export interface SocialLink {
  platform: string
  url: string
  icon: string  // Font Awesome class
}

export interface ContactInfo {
  address: string
  phone: string
  email: string
  whatsapp: string
  mapEmbedUrl: string
  hoursWeekday: string
  hoursWeekend: string
}

// ─── Site Settings ──────────────────────────────────────────
export interface SiteSettings {
  restaurantName: string
  tagline: string
  currency: string
  accentColor: string
  enableOrdering: boolean
  enableReservations: boolean
  enableWhatsapp: boolean
  maintenanceMode: boolean
}

// ─── Hero Content ───────────────────────────────────────────
export interface HeroContent {
  heading: string
  highlight: string
  description: string
  ctaText: string
}

// ─── Full Restaurant Data ───────────────────────────────────
// ده الـ object الكبير اللي بيجمع كل حاجة
export interface RestaurantData {
  settings: SiteSettings
  hero: HeroContent
  contact: ContactInfo
  socials: SocialLink[]
  team: TeamMember[]
  timeline: TimelineItem[]
  menuItems: MenuItem[]
  reviews: Review[]
  stats: {
    years: number
    guests: number   // بالـ K (e.g. 50 = 50K)
    awards: number
    satisfaction: number
  }
  about: {
    story: string
    story2: string
  }
}

// ─── Form Data ──────────────────────────────────────────────
// بيتستخدم في react-hook-form + zod validation
export interface ReservationFormData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  date: string
  time: string
  guests: string
  notes?: string
}
export interface Category {
   id:            number
  name:          string
  categoryImage: string | null  // الاسم الحقيقي من الـ API
}

export interface CreateProductDto {
  name:        string
  description: string
  discount:    number
  categoryId:  number
  priceList:   { price: number; size: number }[]
  ingredients: string[]
}