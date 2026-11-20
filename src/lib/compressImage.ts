// src/lib/compressImage.ts
// بيصغّر الصورة قبل الرفع (أقصى بُعد 1200px، JPEG بجودة 0.8)
// لو حصل أي خطأ بيرجّع الملف الأصلي، فمش بيكسر الرفع

export async function compressImage(
  file: File,
  maxSize = 1200,
  quality = 0.8
): Promise<File> {
  if (!file.type.startsWith('image/')) return file

  try {
    // from-image: بيصلّح اتجاه صور الموبايل (EXIF)
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })

    const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height))
    const w = Math.round(bitmap.width * scale)
    const h = Math.round(bitmap.height * scale)

    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h

    const ctx = canvas.getContext('2d')
    if (!ctx) return file
    ctx.drawImage(bitmap, 0, 0, w, h)
    bitmap.close?.()

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', quality)
    )
    if (!blob) return file

    // لو الصورة الأصلية أصغر من النسخة المضغوطة، سيبها زي ما هي
    if (blob.size >= file.size) return file

    return new File([blob], file.name.replace(/\.\w+$/, '') + '.jpg', {
      type: 'image/jpeg',
    })
  } catch {
    return file
  }
}