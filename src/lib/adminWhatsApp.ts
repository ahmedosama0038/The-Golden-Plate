import type { ApiOrder } from '@/types'

// 01021245010 → 201021245010 (واتساب مبيقبلش الصفر الأول)
export const toWaNumber = (phone: string) => {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('20')) return digits
  return `20${digits.replace(/^0/, '')}`
}

export const buildCustomerMessage = (o: ApiOrder): string => {
  const name = o.customer.name
  const isRes = o.order_type === 'reservation'
  const kind = isRes ? 'حجزك' : 'طلبك'

  switch (o.status) {
    case 'pending':
      return `أهلاً ${name}، وصلنا ${kind} رقم #${o.id} من The Golden Plate وجاري مراجعته.`
    case 'preparing':
      return isRes
        ? `أهلاً ${name}، بنجهّز حجزك رقم #${o.id} (${o.date_only ?? ''} ${o.time_only?.slice(0, 5) ?? ''}) ومستنينك.`
        : `أهلاً ${name}، طلبك رقم #${o.id} بنجهّزه دلوقتي.`
    case 'delivered':
      return `أهلاً ${name}، طلبك رقم #${o.id} في الطريق ليك. بالهنا والشفا!`
    case 'completed':
      return isRes
        ? `شكراً ${name} على زيارتك لـ The Golden Plate، نتمنى نشوفك تاني.`
        : `شكراً ${name}، نتمنى طلبك #${o.id} يكون عجبك. رأيك يهمنا.`
    case 'cancelled':
      return `أهلاً ${name}، للأسف اضطرينا نلغي ${kind} رقم #${o.id}. ممكن نتواصل معاك؟`
    default:
      return `أهلاً ${name}، بخصوص ${kind} رقم #${o.id}.`
  }
}

export const openCustomerWhatsApp = (o: ApiOrder) => {
  const url = `https://wa.me/${toWaNumber(o.customer.phone)}?text=${encodeURIComponent(
    buildCustomerMessage(o)
  )}`
  window.open(url, '_blank')
}