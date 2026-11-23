import type { CartItem } from '@/types'

export const EXTRAS_CHECKOUT_MESSAGE = {
  ar: 'الطلب بإضافات غير متاح دلوقتي لأن حساب سعرها على السيرفر لسه مش متوصل. شيل الإضافات عشان تكمل طلبك. السلة مش هتتمسح ومش هنحوّلك لواتساب.',
  en: 'Orders with extras are unavailable until backend pricing is connected. Remove the extras to continue. Your cart will be kept and you will not be redirected to WhatsApp.',
} as const

export class UnverifiedExtrasError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'UnverifiedExtrasError'
  }
}

export function assertOrderPricingVerified(items: Pick<CartItem, 'selectedExtras'>[], lang: 'ar' | 'en') {
  if (items.some((item) => (item.selectedExtras?.length ?? 0) > 0)) {
    throw new UnverifiedExtrasError(EXTRAS_CHECKOUT_MESSAGE[lang])
  }
}
