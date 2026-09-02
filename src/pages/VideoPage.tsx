import React, { useState } from 'react';
import { Play, X, ExternalLink, Video as VideoIcon, Eye, Clock, Zap } from 'lucide-react';
import { VIDEOS, VIDEO_CATEGORIES, VideoItem, rutubeEmbed, rutubeWatch, RUTUBE_CHANNEL } from '../data/videos';
import { EditableText } from '../editor/Editable';
import { useAppliedFilter } from '../editor/navFilter';

interface VideoPageProps {
  onOpenOrder: (title?: string) => void;
}

export const VideoPage: React.FC<VideoPageProps> = ({ onOpenOrder }) => {
  const [activeCat, setActiveCat] = useState('Все видео');
  const [player, setPlayer] = useState<VideoItem | null>(null);

  useAppliedFilter('video', (f) => setActiveCat(f === 'all' ? 'Все видео' : f));

  const filtered = VIDEOS.filter((v) => activeCat === 'Все видео' || v.category === activeCat);
  const shorts = filtered.filter((v) => v.isShort);
  const longs = filtered.filter((v) => !v.isShort);

  const Card: React.FC<{ item: VideoItem; compact?: boolean }> = ({ item, compact }) => (
    <div
      onClick={() => setPlayer(item)}
      className="white-card rounded-3xl overflow-hidden flex flex-col justify-between group cursor-pointer"
    >
      <div
        className={`relative bg-slate-900 overflow-hidden ${compact ? 'aspect-9/16' : 'aspect-video'}`}
      >
        {/* Запасной фон — если миниатюра не загрузится */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 flex items-center justify-center">
          <div className="text-center px-4">
            <VideoIcon className="w-8 h-8 text-orange-500/70 mx-auto mb-2" />
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              RUTUBE
            </span>
          </div>
        </div>

        {/* Превью через API миниатюр RUTUBE */}
        <img
          src={`https://rutube.ru/api/video/${item.hash}/thumbnail/?redirect=1`}
          alt={item.title}
          loading="lazy"
          className="relative w-full h-full object-cover opacity-95 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.visibility = 'hidden';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-slate-950/10" />

        {/* Кнопка Play */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="w-16 h-16 rounded-full bg-orange-600/90 group-hover:bg-orange-600 text-white flex items-center justify-center shadow-2xl shadow-orange-900/40 group-hover:scale-110 transition-all">
            <Play className="w-7 h-7 ml-1 fill-current" />
          </span>
        </div>

        {/* Бейджи */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="bg-orange-600 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-lg shadow-sm">
            {item.category}
          </span>
          {item.isShort && (
            <span className="bg-white/95 text-slate-900 text-[11px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-500" /> Shorts
            </span>
          )}
        </div>

        {/* Заголовок на превью */}
        <div className="absolute bottom-3 left-4 right-4 text-white">
          <h3 className="text-sm font-bold font-heading line-clamp-2 leading-snug">{item.title}</h3>
        </div>
      </div>

      <div className="p-4 flex items-center justify-between text-xs text-slate-500">
        <span className="flex items-center gap-3">
          {item.views && (
            <span className="inline-flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-slate-400" /> {item.views}
            </span>
          )}
          {item.age && (
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" /> {item.age}
            </span>
          )}
        </span>
        <span className="text-orange-600 font-bold group-hover:translate-x-0.5 transition-transform">
          Смотреть →
        </span>
      </div>
    </div>
  );

  return (
    <div className="bg-white py-10 sm:py-16">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 2xl:px-10">
        {/* Заголовок */}
        <div className="mb-8">
          <div className="text-xs font-semibold text-slate-500 mb-2">
            <span>Главная</span> <span className="mx-1">/</span>{' '}
            <span className="text-orange-600">Видеогалерея</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 border border-orange-200 text-xs font-bold text-orange-800 mb-3">
            <VideoIcon className="w-3.5 h-3.5" />
            <EditableText id="video.badge">Официальный канал на RUTUBE</EditableText>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 font-heading tracking-tight">
            <EditableText id="video.h1.p1">Видео наших работ</EditableText>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
              <EditableText id="video.h1.p2">и производства</EditableText>
            </span>
          </h1>
            <EditableText
              as="p"
              id="video.subtitle"
              multiline
              className="text-slate-600 text-sm sm:text-base mt-3 max-w-3xl leading-relaxed block"
            >
              Реальные видеоотчёты с объектов: монтаж навесов и заборов, обшивка, работа монтажных
              бригад и производственный процесс в цехе. Все ролики сняты нашими сотрудниками.
            </EditableText>

          <a
            href={RUTUBE_CHANNEL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm py-2.5 px-4 rounded-xl transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Перейти на канал RUTUBE
          </a>
        </div>

        {/* Фильтры */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-8 scrollbar-none">
          {VIDEO_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeCat === cat
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Основные видео */}
        {longs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {longs.map((v) => (
              <Card key={v.id} item={v} />
            ))}
          </div>
        )}

        {/* Shorts */}
        {shorts.length > 0 && (
          <div className="mt-14">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 font-heading mb-5 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <EditableText id="video.shorts.title">Короткие видео (Shorts)</EditableText>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-5">
              {shorts.map((v) => (
                <Card key={v.id} item={v} compact />
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-14 bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <EditableText
              as="h3"
              id="video.cta.title"
              className="text-xl sm:text-2xl font-extrabold text-slate-950 font-heading block"
            >
              Хотите такой же навес, как на видео?
            </EditableText>
            <EditableText
              as="p"
              id="video.cta.subtitle"
              multiline
              className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl block"
            >
              Инженер приедет с образцами материалов, сделает замер и подготовит индивидуальный
              проект с визуализацией.
            </EditableText>
          </div>
          <button
            onClick={() => onOpenOrder('Заявка из раздела «Видео»')}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 px-6 rounded-xl text-sm transition-all cursor-pointer whitespace-nowrap shadow-md"
          >
            Вызвать замерщика
          </button>
        </div>
      </div>

      {/* Плеер */}
      {player && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setPlayer(null)}
        >
          <div
            className={`bg-slate-950 rounded-3xl overflow-hidden shadow-2xl relative w-full ${
              player.isShort ? 'max-w-sm' : 'max-w-4xl'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPlayer(null)}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className={player.isShort ? 'aspect-9/16' : 'aspect-video'}>
              <iframe
                src={rutubeEmbed(player.hash)}
                title={player.title}
                allow="clipboard-write; autoplay"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-white font-bold text-sm sm:text-base font-heading line-clamp-2">
                  {player.title}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {player.category}
                  {player.views ? ` · ${player.views}` : ''}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <a
                  href={rutubeWatch(player.hash, player.isShort)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> На RUTUBE
                </a>
                <button
                  onClick={() => {
                    setPlayer(null);
                    onOpenOrder(`Заявка по видео: ${player.title}`);
                  }}
                  className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-colors cursor-pointer"
                >
                  Заказать такой
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
