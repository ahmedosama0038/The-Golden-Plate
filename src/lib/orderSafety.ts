import type { CartItem } from '@/types'

export type OrderLine = { product_id: number; size_id: number | null; quantity: number }

export const INVALID_EXTRAS_MESSAGE = {
  ar: 'في إضافة في السلة بياناتها ناقصة. شيلها وضيفها تاني من المنيو.',
  en: 'An extra in your cart has incomplete data. Remove it and add it again from the menu.',
} as const

export class InvalidExtrasError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidExtrasError'
  }
}

// بيحوّل السلة لسطور items للباك:
// - سطر لكل صنف
// - سطر لكل إضافة (product_id بتاع الإضافة + size_id بتاع حجمها)، كميتها = كمية الصنف
// - نفس الإضافة والحجم بيتجمعوا في سطر واحد
export function buildOrderItems(items: CartItem[], lang: 'ar' | 'en'): OrderLine[] {
  const mainLines: OrderLine[] = items.map((item) => ({
    product_id: Number(item.menuItemId),
    size_id: item.sizeId ?? null,
    quantity: item.quantity,
  }))

  const extraLines = new Map<string, OrderLine>()

  for (const item of items) {
    for (const extra of item.selectedExtras ?? []) {
      const productId = Number(extra.id)
      const sizeId = extra.sizeId != null ? Number(extra.sizeId) : null
      const needsSize = Boolean(extra.sizeLabel)

      if (!Number.isFinite(productId) || (needsSize && (sizeId === null || !Number.isFinite(sizeId)))) {
        throw new InvalidExtrasError(INVALID_EXTRAS_MESSAGE[lang])
      }

      const key = `${productId}:${sizeId ?? 'null'}`
      const existing = extraLines.get(key)
      if (existing) existing.quantity += item.quantity
      else extraLines.set(key, { product_id: productId, size_id: sizeId, quantity: item.quantity })
    }
  }

  return [...mainLines, ...Array.from(extraLines.values())]
}