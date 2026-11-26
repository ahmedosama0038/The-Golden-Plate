import type { CartItem } from '@/types'

export type OrderExtra = { id: number; size_id: number | null }

export type OrderLine = {
  product_id: number
  size_id: number | null
  quantity: number
  extras?: OrderExtra[]
}

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
// - سطر لكل صنف في السلة
// - إضافات الصنف جواه في extras: [{ id, size_id }]
// - الباك هو اللي بيسعّر الإضافة لكل وحدة، فمنضربش الكمية بإيدينا
// - الإضافة من غير أحجام بتتبعت size_id: null
export function buildOrderItems(items: CartItem[], lang: 'ar' | 'en'): OrderLine[] {
  return items.map((item) => {
    const line: OrderLine = {
      product_id: Number(item.menuItemId),
      size_id: item.sizeId ?? null,
      quantity: item.quantity,
    }

    const extras = new Map<string, OrderExtra>()

    for (const extra of item.selectedExtras ?? []) {
      const id = Number(extra.id)
      const sizeId = extra.sizeId != null ? Number(extra.sizeId) : null
      const needsSize = Boolean(extra.sizeLabel)

      if (!Number.isFinite(id) || (needsSize && (sizeId === null || !Number.isFinite(sizeId)))) {
        throw new InvalidExtrasError(INVALID_EXTRAS_MESSAGE[lang])
      }

      extras.set(`${id}:${sizeId ?? 'null'}`, { id, size_id: sizeId })
    }

    if (extras.size > 0) line.extras = Array.from(extras.values())
    return line
  })
}