// ─── Menu ───────────────────────────────────────────────────
export type MenuCategory = 'starters' | 'mains' | 'desserts' | 'drinks'
// 'type' هنا لأننا بنحدد "اختيار من عدة قيم" مش object
export interface MenuItemSize {
 id?: string | number;  
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
  extras?:      Extra[]       // ← ربط الإضافات بالوجبة بشكل اختياري لمنع الإيرورز
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
  sizeId?: number | null   // 🆕 رقم الحجم اللي الباك محتاجه
  selectedExtras?: SelectedExtra[]
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
// تقييم من الباك (GET /reviews)
export interface ApiReview {
  id: number
  order_id: number
  customer_name: string
  rating: number
  comment: string | null
  created_at: string
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
 menuItems?: MenuItem[]
reviews?: Review[]
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
  category_id: number
  name:        string
  description: string
  is_active:   boolean
  base_price?: number                                  // لو المنتج من غير أحجام
  sizes?:      { size_name: string; price: number }[]  // لو المنتج ليه أحجام
}
// ─── Extras (الإضافات الجديدة) ─────────────────────────────────
// الإكسترا زي المنتج: يا إما سعر واحد، يا إما أحجام وكل حجم بسعره
export interface ExtraSize {
  id?: string | number
  size_name: string
  price: number
}
export interface Extra {
  id: string | number
  name: string
  description?: string | null
  image?: string | null
  price: number              // سعر الوحدة لو مفيهاش أحجام
  isAvailableAlone: boolean
  isDeleted?: boolean
  hasSizes?: boolean
  sizes?: ExtraSize[]        // لو الإكسترا ليها أحجام
  createdAt?: string
}
// إكسترا اتحددت للسلة: السعر هو سعر الحجم المختار (لو ليها أحجام)
export interface SelectedExtra extends Extra {
  sizeLabel?: string
  sizeId?: string | number | null
}
export interface CreateExtraDto {
  name: string
  price: number              // بيتجاهل لو hasSizes = true
  isAvailableAlone: boolean
  description?: string
  imageFile?: File | null
  hasSizes?: boolean
  sizes?: { size_name: string; price: number }[]
}


export type ExtraFormData = {
  name: string
  price: number
  isAvailableAlone: boolean
}

// ─── Orders (شكل ريم الحقيقي) ──────────────────────────────
export type ApiOrderStatus =
  | 'pending'
  | 'preparing'
  | 'delivered'
  | 'cancelled'
  | 'completed'

export interface ApiOrderItemExtra {
  id: number
  name: string
  size_id: number | null
  size_name: string | null
  price: number
}

export interface ApiOrderItem {
  id: number
  product_name: string
  size_name: string | null
  quantity: number
  unit_price: number
  subtotal: number
  extras?: ApiOrderItemExtra[]
}

export interface ApiOrder {
  id: number
  order_type: 'delivery' | 'reservation'
  status: ApiOrderStatus
  total_price: number
  is_reviewed: boolean
  can_review: boolean
  customer: {
    id: number
    name: string
    phone: string
    last_address: string | null
  }
  address: string | null
  latitude: number | null
  longitude: number | null
  number_of_guests: number | null
  date_only: string | null   // YYYY-MM-DD
  time_only: string | null   // HH:mm:ss
  notes: string | null
  items: ApiOrderItem[]
  created_at: string
}

// ─── Products (شكل الحقيقي من GET /products) ────────────
export interface ApiProductSize {
  id: number
  size_name: string
  price: number
}

export interface ApiProductBase {
  id: number
  category_id: number
  name: string                    // بيتغير حسب Accept-Language وممكن يبقى ""
  description: string | null
  name_en: string | null
  name_ar: string | null
  description_en: string | null
  description_ar: string | null
  base_price: number
  image: string | null
  is_active: boolean
  has_sizes: boolean
  sizes: ApiProductSize[]
}

export interface ApiProduct extends ApiProductBase {
  extras?: ApiProductBase[]       // إضافات المنتج (هي نفسها منتجات)
}