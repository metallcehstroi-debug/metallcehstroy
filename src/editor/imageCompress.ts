/** Сжимает data-URL изображения, чтобы код запекания оставался коротким.
 *  Большие фото (загруженные в редакторе) пересжимаются в JPEG до maxDim пикселей. */
export async function compressDataUrl(
  dataUrl: string,
  maxDim = 1000,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        let { width, height } = img;
        const scale = Math.min(1, maxDim / Math.max(width, height));
        if (scale === 1 && dataUrl.length < 80_000) {
          // маленькое изображение — оставляем как есть
          resolve(dataUrl);
          return;
        }
        width = Math.max(1, Math.round(width * scale));
        height = Math.max(1, Math.round(height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(dataUrl);
          return;
        }
        // белый фон, чтобы прозрачность не превратилась в чёрные пятна в JPEG
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        const out = canvas.toDataURL('image/jpeg', quality);
        // если вдруг сжатый вариант больше исходного — вернём исходный
        resolve(out.length < dataUrl.length ? out : dataUrl);
      } catch {
        resolve(dataUrl);
      }
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

/** Короткая ли это строка (не огромное base64-изображение) */
export function isHugeDataUrl(v: string): boolean {
  return typeof v === 'string' && v.startsWith('data:image') && v.length > 60_000;
}

/** Подготавливает фотографию сразу при загрузке в редактор.
 *  Ограничивает физический размер, сохраняет хорошую детализацию и кодирует
 *  в WebP, чтобы тяжёлые снимки с телефона не замедляли весь сайт. */
export async function optimizeImageFile(
  file: File,
  maxDim = 1600,
  quality = 0.86
): Promise<string> {
  const source = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Не удалось прочитать изображение'));
    reader.readAsDataURL(file);
  });

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const scale = Math.min(1, maxDim / Math.max(img.naturalWidth, img.naturalHeight));
        const width = Math.max(1, Math.round(img.naturalWidth * scale));
        const height = Math.max(1, Math.round(img.naturalHeight * scale));
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(source);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
        const optimized = canvas.toDataURL('image/webp', quality);
        resolve(optimized.length < source.length ? optimized : source);
      } catch {
        resolve(source);
      }
    };
    img.onerror = () => resolve(source);
    img.src = source;
  });
}
