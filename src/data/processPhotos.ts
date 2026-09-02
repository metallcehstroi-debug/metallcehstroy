/** Фотографии процесса установки для каждого объекта портфолио.
 *  Ключ — id объекта из REAL_PORTFOLIO, значение — массив URL фотографий.
 *  Первые фото — итоговый результат, затем процесс установки.
 *
 *  Фото берутся напрямую со старого сайта металлцехстрой.рф
 *  в полном качестве (780×780, без сжатия).
 */

const B = 'https://xn--80ajbqiadvrjgf1bm.xn--p1ai/wp-content/uploads/freshizer';

export interface ProjectPhotos {
  /** Итоговые фото результата */
  result: string[];
  /** Фото процесса монтажа */
  process: string[];
}

/** Фотоальбомы объектов (id → фотографии) */
export const PROCESS_PHOTOS: Record<string, ProjectPhotos> = {
  // ===== Козырёк 04.07.2026 =====
  'port-1': {
    result: [
      `${B}/4c8249d3a017fb96b404701104750a1b_IMG_20260826_144030-780-780-c-100.jpg`,
      `${B}/ee6b911dcfc164b9c7afd6db387cdb29_IMG_20260826_144012-780-780-c-100.jpg`,
    ],
    process: [],
  },

  // ===== Полуарочный навес 02.07.2026 =====
  'port-2': {
    result: [
      `${B}/b3088754ec64ee86f3fb0c3f95c0e68d_IMG_20260826_135928-780-780-c-100.jpg`,
      `${B}/b138e298b0918b44a4cf90050c083f9e_IMG_20260826_135925-780-780-c-100.jpg`,
      `${B}/0478f38fc7a106770e10783c0e6b0954_IMG_20260826_135932-780-780-c-100.jpg`,
    ],
    process: [
      `${B}/409099602d230d7a11f72b90939005d8_IMG_20260826_135857-780-780-c-100.jpg`,
      `${B}/3855c87041c8e647f9ac1118424992ea_IMG_20260826_135905-780-780-c-100.jpg`,
      `${B}/8f2799042f905bb8dd3d58a1c95715e6_IMG_20260826_135908-780-780-c-100.jpg`,
      `${B}/93d0df2c3acc5f06b2a8d21823d677ea_IMG_20260826_135917-780-780-c-100.jpg`,
      `${B}/a6a9ab9da19ab37b497416a5f848c374_IMG_20260826_135922-780-780-c-100.jpg`,
    ],
  },

  // ===== Арочный навес 27.06.2026 =====
  'port-3': {
    result: [
      `${B}/2296076d27b2cfba8a1c9d4fb5d32c68_f51777c2-0a13-48c9-9154-8f82a0a7071d-780-780-c-100.jpg`,
      `${B}/bc7a26b80e4f70826607d4fda1dcd000_b733ca3a-8e9c-40c5-8f6a-b3f21e650355-780-780-c-100.jpg`,
      `${B}/c94defad0f422aa459c54786d715fa57_aa0d8393-4a91-4005-943d-f733dc53a68b-780-780-c-100.jpg`,
      `${B}/ec9a42726ca1e6ccec7949952d464235_3e315b58-4f90-4887-9985-81488a0ca5b8-780-780-c-100.jpg`,
      `${B}/6488e35f27c79fe63a14dbd393a016c7_c7ebd2fd-8088-4126-9f64-e759c54038a1-780-780-c-100.jpg`,
    ],
    process: [
      `${B}/2f8bff62508f7ca2051d9fce2e497438_c90642c7-5922-4bdd-977e-834719676213-780-780-c-100.jpg`,
      `${B}/14c4e390bf6010922d84ceb9ec593945_1a217b15-35a7-44cc-8741-379ab239e64d-780-780-c-100.jpg`,
      `${B}/bb1b913ea9dae84b5350b5ec6b3914c8_24b75dbd-4488-4a78-891d-af3d96a118c7-780-780-c-100.jpg`,
      `${B}/7e0a52e1eb009a9273d8e4bbb1460db4_393240b8-7478-4927-84e9-ffb4dce941b3-780-780-c-100.jpg`,
    ],
  },
};

/** Получить все фото объекта (результат + процесс) */
export function getAllPhotos(portId: string): string[] {
  const album = PROCESS_PHOTOS[portId];
  if (!album) return [];
  return [...album.result, ...album.process];
}

/** Количество фото процесса */
export function getProcessCount(portId: string): number {
  return PROCESS_PHOTOS[portId]?.process.length ?? 0;
}

/** Есть ли фотоальбом у объекта */
export function hasAlbum(portId: string): boolean {
  const album = PROCESS_PHOTOS[portId];
  return !!album && (album.result.length + album.process.length) > 0;
}
