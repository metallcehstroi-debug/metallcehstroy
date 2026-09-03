import React, { useState } from 'react';
import {
  Camera,
  Calendar,
  MapPin,
  Clock,
  Maximize2,
  X,
  Sparkles,
} from 'lucide-react';
import { REAL_PORTFOLIO, PortfolioItem } from '../data/siteData';

interface PortfolioGalleryProps {
  onOpenOrder: (title?: string) => void;
}

export const PortfolioGallery: React.FC<PortfolioGalleryProps> = ({ onOpenOrder }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeItem, setActiveItem] = useState<PortfolioItem | null>(null);

  const categories = [
    { id: 'all', label: 'Все объекты (12)' },
    { id: 'canopy', label: 'Навесы для авто и дома' },
    { id: 'fence', label: 'Заборы' },
    { id: 'gate', label: 'Ворота' },
    { id: 'hangar', label: 'Ангары' },
    { id: 'gazebo', label: 'Беседки' },
  ];

  const filteredItems = REAL_PORTFOLIO.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  return (
    <section id="portfolio" className="py-16 sm:py-24 bg-slate-950 border-b border-slate-800 relative">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 2xl:px-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-950/60 border border-orange-600/30 text-xs font-bold text-orange-400 mb-3">
            <Camera className="w-3.5 h-3.5" />
            Фотогалерея обновлений
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-heading tracking-tight">
            Реальные работы{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
              наших монтажных бригад
            </span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            Все фото сделаны нашими бригадирами непосредственно на участках заказчиков в Москве и Московской области. Никаких чужих 3D-рендеров.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="group bg-slate-900/80 border border-slate-800 hover:border-orange-500/40 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col"
            >
              {/* Image Container */}
              <div className="relative aspect-4/3 overflow-hidden bg-slate-950">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-black/30 opacity-70 group-hover:opacity-90 transition-opacity" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="bg-orange-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md shadow-xs">
                    {item.categoryLabel}
                  </span>
                  <span className="bg-slate-900/90 text-slate-300 text-[11px] font-medium px-2 py-0.5 rounded-md backdrop-blur-xs flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-orange-400" />
                    {item.date}
                  </span>
                </div>

                <div className="absolute top-3 right-3 p-2 rounded-lg bg-black/50 text-white backdrop-blur-xs group-hover:bg-orange-600 transition-colors">
                  <Maximize2 className="w-4 h-4" />
                </div>

                {/* Bottom title info on image */}
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="text-sm sm:text-base font-bold text-white font-heading group-hover:text-orange-300 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  {item.location && (
                    <div className="flex items-center gap-1 text-[11px] text-slate-300 mt-1">
                      <MapPin className="w-3 h-3 text-orange-400 shrink-0" />
                      <span className="truncate">{item.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer details */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div className="text-xs text-slate-400">
                  <span className="text-slate-500 font-semibold">Материалы: </span>
                  <span className="text-slate-300">{item.material}</span>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  {item.duration && (
                    <span className="inline-flex items-center gap-1 text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      {item.duration}
                    </span>
                  )}
                  <span className="text-orange-400 font-semibold group-hover:translate-x-1 transition-transform inline-flex items-center gap-0.5">
                    Смотреть подробности →
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* LIGHTBOX MODAL */}
      {activeItem && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative my-6 animate-in zoom-in-95">
            
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* High-res Image */}
            <div className="relative aspect-16/10 bg-slate-950">
              <img
                src={activeItem.image}
                alt={activeItem.title}
                className="w-full h-full object-contain sm:object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-lg">
                  {activeItem.categoryLabel}
                </span>
                <span className="bg-slate-900/90 text-white text-xs px-3 py-1 rounded-lg backdrop-blur-xs flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-orange-400" />
                  {activeItem.date}
                </span>
              </div>
            </div>

            {/* Details Content */}
            <div className="p-6 sm:p-8 space-y-4">
              <h3 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
                {activeItem.title}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs sm:text-sm">
                <div>
                  <span className="text-slate-400 block mb-0.5">Локация объекта:</span>
                  <strong className="text-slate-200 flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-orange-500" />
                    {activeItem.location || 'Московская область'}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Срок возведения:</span>
                  <strong className="text-slate-200 flex items-center gap-1">
                    <Clock className="w-4 h-4 text-amber-500" />
                    {activeItem.duration || '2 рабочих дня'}
                  </strong>
                </div>
                <div className="sm:col-span-2 pt-2 border-t border-slate-800/80">
                  <span className="text-slate-400 block mb-0.5">Использованные материалы:</span>
                  <span className="text-slate-200 font-medium">{activeItem.material}</span>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                {activeItem.description}
              </p>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    const itm = activeItem;
                    setActiveItem(null);
                    onOpenOrder(`Хочу такой же объект: ${itm.title} (${itm.location || 'МО'})`);
                  }}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold py-3.5 px-5 rounded-xl text-sm shadow-md transition-all cursor-pointer text-center flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Рассчитать стоимость такого же навеса</span>
                </button>
                <button
                  onClick={() => setActiveItem(null)}
                  className="px-6 py-3.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-sm font-semibold transition-colors cursor-pointer"
                >
                  Закрыть
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </section>
  );
};
