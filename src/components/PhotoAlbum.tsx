import React, { useState, useCallback } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Camera,
  Wrench,
  Images,
} from 'lucide-react';
import { PROCESS_PHOTOS, hasAlbum, ProjectPhotos } from '../data/processPhotos';

interface PhotoAlbumProps {
  /** id объекта из REAL_PORTFOLIO */
  portId: string;
  /** Название объекта (для заголовка) */
  title: string;
  /** Главное фото объекта из карточки (показывается первым если нет альбома) */
  mainImage: string;
  /** Альбом, созданный пользователем в редакторе */
  album?: ProjectPhotos;
  /** Закрыть лайтбокс */
  onClose: () => void;
  /** Заказать такой же */
  onOrder?: (title: string) => void;
}

/** Полноэкранный фотоальбом объекта: результат + процесс установки */
export const PhotoAlbum: React.FC<PhotoAlbumProps> = ({
  portId,
  title,
  mainImage,
  album: suppliedAlbum,
  onClose,
  onOrder,
}) => {
  const album: ProjectPhotos = suppliedAlbum ?? PROCESS_PHOTOS[portId] ?? {
    result: [mainImage],
    process: [],
  };

  // Объединяем все фото: сначала результат, потом процесс
  const allPhotos = [...album.result, ...album.process];
  // Если альбома нет — показываем хотя бы главное фото
  if (allPhotos.length === 0) allPhotos.push(mainImage);

  const resultCount = album.result.length;
  const processCount = album.process.length;
  const totalCount = allPhotos.length;

  const [activeIdx, setActiveIdx] = useState(0);

  const goNext = useCallback(() => {
    setActiveIdx((i) => (i + 1) % totalCount);
  }, [totalCount]);

  const goPrev = useCallback(() => {
    setActiveIdx((i) => (i - 1 + totalCount) % totalCount);
  }, [totalCount]);

  // Определяем тип текущего фото
  const isProcessPhoto = activeIdx >= resultCount;
  const photoLabel = isProcessPhoto
    ? `Процесс установки · фото ${activeIdx - resultCount + 1} из ${processCount}`
    : `Результат · фото ${activeIdx + 1} из ${resultCount}`;

  return (
    <div
      className="fixed inset-0 z-[60] bg-slate-950/95 backdrop-blur-md flex flex-col animate-in fade-in"
      onClick={onClose}
    >
      {/* Шапка */}
      <div
        className="flex items-center justify-between px-4 sm:px-6 py-3 bg-slate-950/80 border-b border-slate-800/50 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="min-w-0 flex-1">
          <h3 className="text-white font-bold text-sm sm:text-base font-heading truncate">
            {title}
          </h3>
          <div className="flex items-center gap-3 mt-0.5">
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                isProcessPhoto
                  ? 'bg-amber-950/80 text-amber-400 border border-amber-800/40'
                  : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/40'
              }`}
            >
              {isProcessPhoto ? (
                <Wrench className="w-3 h-3" />
              ) : (
                <Camera className="w-3 h-3" />
              )}
              {photoLabel}
            </span>
            <span className="text-xs text-slate-500">
              {activeIdx + 1} / {totalCount}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {onOrder && (
            <button
              onClick={() => {
                onClose();
                onOrder(`Хочу такой же: ${title}`);
              }}
              className="hidden sm:inline-flex items-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl cursor-pointer transition-colors"
            >
              Заказать такой
            </button>
          )}
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center cursor-pointer transition-colors"
            aria-label="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Основное фото */}
      <div
        className="flex-1 relative flex items-center justify-center overflow-hidden px-2 sm:px-12"
        onClick={onClose}
      >
        <img
          key={activeIdx}
          src={allPhotos[activeIdx]}
          alt={`${title} — фото ${activeIdx + 1}`}
          className="max-w-full max-h-[calc(100dvh-180px)] sm:max-h-[calc(100dvh-200px)] object-contain rounded-lg shadow-2xl animate-in fade-in duration-200"
          style={{ objectFit: 'contain' }}
          onClick={(e) => e.stopPropagation()}
        />

        {/* Навигация стрелками */}
        {totalCount > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/70 hover:bg-slate-800 text-white flex items-center justify-center cursor-pointer transition-colors backdrop-blur-xs"
              aria-label="Предыдущее фото"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900/70 hover:bg-slate-800 text-white flex items-center justify-center cursor-pointer transition-colors backdrop-blur-xs"
              aria-label="Следующее фото"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </>
        )}
      </div>

      {/* Ряд миниатюр */}
      {totalCount > 1 && (
        <div
          className="shrink-0 bg-slate-950/90 border-t border-slate-800/50 px-4 py-3 overflow-x-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Разделитель: Результат / Процесс */}
          {processCount > 0 && (
            <div className="flex items-center gap-3 mb-2 text-[10px] font-bold uppercase tracking-widest">
              <span className="text-emerald-500 flex items-center gap-1">
                <Camera className="w-3 h-3" />
                Результат ({resultCount})
              </span>
              <span className="h-px flex-1 bg-slate-800" />
              <span className="text-amber-500 flex items-center gap-1">
                <Wrench className="w-3 h-3" />
                Процесс установки ({processCount})
              </span>
            </div>
          )}

          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {allPhotos.map((src, idx) => {
              const isProcess = idx >= resultCount;
              const isActive = idx === activeIdx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveIdx(idx)}
                  className={`relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 ${
                    isActive
                      ? 'ring-2 ring-orange-500 scale-105 shadow-lg shadow-orange-500/30'
                      : 'opacity-60 hover:opacity-90 hover:scale-105'
                  }`}
                  aria-label={`Фото ${idx + 1}`}
                >
                  <img
                    src={src}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {/* Маленький индикатор типа фото */}
                  {isProcess && (
                    <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-amber-500/90 flex items-center justify-center">
                      <Wrench className="w-2.5 h-2.5 text-white" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

/** Бейдж «N фото» на карточке, показывающий что есть фотоальбом */
export const AlbumBadge: React.FC<{ portId: string; album?: ProjectPhotos }> = ({ portId, album: suppliedAlbum }) => {
  if (!suppliedAlbum && !hasAlbum(portId)) return null;
  const album = suppliedAlbum ?? PROCESS_PHOTOS[portId];
  const total = album.result.length + album.process.length;
  return (
    <span className="inline-flex items-center gap-1 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs border border-white/10">
      <Images className="w-3 h-3 text-amber-400" />
      {total} фото
      {album.process.length > 0 && (
        <span className="text-amber-300">+ процесс</span>
      )}
    </span>
  );
};
