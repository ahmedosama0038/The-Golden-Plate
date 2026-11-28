// بيختار الاسم/الوصف حسب لغة الموقع، ولو فاضي بيرجع للغة التانية
export function pickLocalized(
  item: object | null | undefined,
  field: 'name' | 'description',
  lang: 'ar' | 'en'
): string {
  const rec = (item ?? {}) as Record<string, unknown>
  const en = rec[`${field}_en`]
  const ar = rec[`${field}_ar`]
  const primary = lang === 'ar' ? ar : en
  const secondary = lang === 'ar' ? en : ar
  return String(primary || secondary || rec[field] || '')
}