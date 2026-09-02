import React, { useState, useMemo } from 'react';
import { Camera, Calendar, MapPin, Search, ChevronRight, ArrowRight } from 'lucide-react';
import { REAL_PORTFOLIO, PortfolioItem } from '../data/siteData';
import { EditableText, EditableImage } from '../editor/Editable';
import { useAppliedFilter } from '../editor/navFilter';
import { PhotoAlbum } from '../components/PhotoAlbum';

interface CanopiesPageProps {
  onOpenOrder: (title?: string) => void;
  onNavigateToStandard?: () => void;
}

/** Страница выполненных навесов с реальными фотографиями объектов */
export const CanopiesPage: React.FC<CanopiesPageProps> = ({
  onOpenOrder,
  onNavigateToStandard,
}) => {
  const [activeGroup, setActiveGroup] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [lightbox, setLightbox] = useState<PortfolioItem | null>(null);

  // Фильтр из выпадающего меню шапки
  useAppliedFilter('canopies', (f) => {
    if (f === 'all') setActiveGroup('all');
    else setActiveGroup(f);
  });

  const items = useMemo(
    () => REAL_PORTFOLIO.filter((i) => i.category === 'canopy' || i.category === 'gazebo'),
    []
  );

  const groups = useMemo(
    () => Array.from(new Set(items.map((i) => i.categoryLabel))),
    [items]
  );

  const filtered = items.filter((item) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.material.toLowerCase().includes(q) ||
      (item.location || '').toLowerCase().includes(q);
    const matchGroup = activeGroup === 'all' || item.categoryLabel === activeGroup;
    return matchSearch && matchGroup;
  });

  return (
    <div className="bg-white py-10 sm:py-16">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 2xl:px-10">
        {/* Заголовок */}
        <div className="mb-8">
          <div className="text-xs font-semibold text-slate-500 mb-2">
            <span>Главная</span> <span className="mx-1">/</span>{' '}
            <span className="text-orange-600">Навесы с реальными фото</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 font-heading tracking-tight">
            <EditableText id="canopies.h1.part1">Навесы с реальными фото</EditableText>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
              <EditableText id="canopies.h1.part2">объектов</EditableText>
            </span>
          </h1>
          <EditableText
            as="p"
            id="canopies.subtitle"
            multiline
            className="text-slate-600 text-sm sm:text-base mt-3 max-w-3xl leading-relaxed block"
          >
            Фотографии выполненных навесов на участках наших заказчиков в Москве и Московской
            области. Реальные объекты, а не 3D-рендеры: арочные, двухскатные, консольные, с фризом,
            беседки и козырьки.
          </EditableText>

          {onNavigateToStandard && (
            <button
              onClick={onNavigateToStandard}
              className="mt-4 inline-flex items-center gap-2 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-700 font-bold text-xs sm:text-sm py-2.5 px-4 rounded-xl transition-colors cursor-pointer"
            >
              Смотреть стандартные навесы с готовыми ценами
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Фильтр по типу + поиск */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setActiveGroup('all')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeGroup === 'all'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Все ({items.length})
            </button>
            {groups.map((group) => (
              <button
                key={group}
                onClick={() => setActiveGroup(group)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeGroup === group
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {group}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по объекту или материалу"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-orange-500"
            />
          </div>
        </div>

        {/* Сетка реальных фото */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="white-card rounded-3xl overflow-hidden flex flex-col justify-between group"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                <EditableImage
                  id={`gallery.${item.id}.image`}
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent pointer-events-none" />

                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="bg-orange-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-lg shadow-xs">
                    <EditableText id={`gallery.${item.id}.label`}>{item.categoryLabel}</EditableText>
                  </span>
                  <span className="bg-white/90 text-slate-800 text-[11px] font-semibold px-2 py-0.5 rounded-lg backdrop-blur-xs flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-orange-600" />
                    {item.date}
                  </span>
                </div>

                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <h3 className="text-sm sm:text-base font-bold font-heading line-clamp-2">
                    <EditableText id={`gallery.${item.id}.title`}>{item.title}</EditableText>
                  </h3>
                  {item.location && (
                    <div className="flex items-center gap-1 text-xs text-orange-300 mt-1">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-800">Материалы: </span>
                  <span>{item.material}</span>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setLightbox(item)}
                    className="text-xs font-bold text-slate-600 hover:text-orange-600 transition-colors cursor-pointer"
                  >
                    Смотреть фото
                  </button>
                  <button
                    onClick={() =>
                      onOpenOrder(`Хочу такой же навес: ${item.title} (${item.date})`)
                    }
                    className="inline-flex items-center gap-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-3 rounded-xl text-xs transition-all cursor-pointer active:scale-95"
                  >
                    Заказать такой <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA вниз */}
        <div className="mt-12 bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">
              Хотите такой же навес на своём участке?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
              Инженер приедет с образцами, сделает замер и подготовит проект бесплатно.
            </p>
          </div>
          <button
            onClick={() => onOpenOrder('Заявка со страницы навесов с фото')}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 px-6 rounded-xl text-sm transition-all cursor-pointer whitespace-nowrap inline-flex items-center gap-2"
          >
            Вызвать инженера <Camera className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Фотоальбом объекта с процессом установки */}
      {lightbox && (
        <PhotoAlbum
          portId={lightbox.id}
          title={`${lightbox.title} · ${lightbox.date}`}
          mainImage={lightbox.image}
          onClose={() => setLightbox(null)}
          onOrder={(t) => onOpenOrder(t)}
        />
      )}
    </div>
  );
};
