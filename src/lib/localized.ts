// بيختار الاسم/الوصف حسب لغة الموقع، ولو فاضي بيرجع للغة التانية
export function pickLocalized(
  item: any,
  field: 'name' | 'description',
  lang: 'ar' | 'en'
): string {
  const en = item?.[`${field}_en`]
  const ar = item?.[`${field}_ar`]
  const primary = lang === 'ar' ? ar : en
  const secondary = lang === 'ar' ? en : ar
  return String(primary || secondary || item?.[field] || '')
}