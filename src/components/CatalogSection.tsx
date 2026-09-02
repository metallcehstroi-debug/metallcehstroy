import React, { useState } from 'react';
import {
  Grid,
  Filter,
  Check,
  ChevronRight,
  Info,
  Maximize2,
  Sparkles,
  Search,
  X,
} from 'lucide-react';
import { CATALOG_PRODUCTS, ProductItem } from '../data/siteData';

interface CatalogSectionProps {
  onSelectProduct: (product: ProductItem) => void;
  onOpenOrder: (title?: string) => void;
}

export const CatalogSection: React.FC<CatalogSectionProps> = ({ onSelectProduct, onOpenOrder }) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [detailModalItem, setDetailModalItem] = useState<ProductItem | null>(null);

  const categories = [
    { id: 'all', label: 'Все изделия' },
    { id: 'canopy-arch', label: 'Арочные навесы' },
    { id: 'canopy-gable', label: 'Двухскатные навесы' },
    { id: 'canopy-frieze', label: 'С фризом (High-Tech)' },
    { id: 'canopy-cantilever', label: 'Консольные навесы' },
    { id: 'fence', label: 'Заборы' },
    { id: 'gate', label: 'Ворота и калитки' },
    { id: 'hangar', label: 'Ангары и склады' },
    { id: 'services', label: 'Доп. услуги' },
  ];

  const filteredProducts = CATALOG_PRODUCTS.filter((item) => {
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchFeatures = item.features.some((f) => f.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchFeatures) return false;
    }

    // Category match
    if (activeFilter === 'all') return true;
    if (activeFilter === 'fence') return item.category === 'fence';
    if (activeFilter === 'gate') return item.category === 'gate';
    if (activeFilter === 'hangar') return item.category === 'hangar';
    if (activeFilter === 'services') return item.category === 'services';
    if (activeFilter === 'canopy-arch') return item.category === 'canopy' && item.subCategory?.includes('Арочные');
    if (activeFilter === 'canopy-gable') return item.category === 'canopy' && item.subCategory?.includes('Двухскатные');
    if (activeFilter === 'canopy-frieze') return item.category === 'canopy' && item.subCategory?.includes('фризом');
    if (activeFilter === 'canopy-cantilever') return item.category === 'canopy' && item.subCategory?.includes('Консольные');
    return true;
  });

  return (
    <section id="canopies" className="py-16 sm:py-24 bg-slate-950 border-b border-slate-800 relative">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 2xl:px-10">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-950/60 border border-orange-600/30 text-xs font-bold text-orange-400 mb-3">
              <Grid className="w-3.5 h-3.5" />
              Каталог готовой продукции
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-heading tracking-tight">
              Типовые и заказные{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
                навесы и заборы
              </span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-2xl">
              Все типовые размеры производятся на кондукторах нашего производства в Домодедово. 
              Также изготавливаем любые нестандартные конструкции по вашим чертежам или эскизам.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Поиск по каталогу..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9.5 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-orange-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeFilter === cat.id
                  ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md shadow-orange-950/50'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-slate-800 p-8">
            <Filter className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-1">Ничего не найдено</h3>
            <p className="text-slate-400 text-sm mb-4">Попробуйте изменить поисковый запрос или сбросить фильтры.</p>
            <button
              onClick={() => {
                setActiveFilter('all');
                setSearchQuery('');
              }}
              className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-2 px-4 rounded-xl"
            >
              Сбросить фильтры
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((item) => (
              <div
                key={item.id}
                className="group bg-slate-900/80 border border-slate-800/90 hover:border-orange-500/40 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-orange-950/20 transition-all duration-300 flex flex-col"
              >
                {/* Product Image Box */}
                <div className="relative aspect-16/10 overflow-hidden bg-slate-950">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {item.badge && (
                      <span className="bg-orange-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md shadow-sm">
                        {item.badge}
                      </span>
                    )}
                    {item.dimensions && (
                      <span className="bg-slate-900/90 text-slate-200 text-[11px] font-medium px-2 py-0.5 rounded-md backdrop-blur-xs border border-slate-700/50">
                        {item.dimensions}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => setDetailModalItem(item)}
                    aria-label={`Увеличить фото ${item.title}`}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/50 hover:bg-orange-600 text-white backdrop-blur-xs transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>

                  <div className="absolute bottom-3 left-3 right-3 flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] text-orange-300 font-bold uppercase tracking-wider block">
                        Цена от производителя:
                      </span>
                      <span className="text-xl sm:text-2xl font-extrabold text-white font-heading">
                        {item.price}
                      </span>
                      {item.unit && <span className="text-xs text-slate-300 ml-1">/{item.unit}</span>}
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-white font-heading group-hover:text-orange-400 transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Features list */}
                    <div className="mt-3.5 space-y-1.5 pt-3 border-t border-slate-800/80 text-xs text-slate-300">
                      {item.features.slice(0, 3).map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => setDetailModalItem(item)}
                      className="flex-1 bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white font-bold py-2.5 px-3 rounded-xl text-xs transition-colors border border-slate-700 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span>Подробнее</span>
                    </button>

                    <button
                      onClick={() => {
                        onSelectProduct(item);
                        onOpenOrder(`Заказ изделия: ${item.title} (${item.price})`);
                      }}
                      className="flex-1 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs shadow-md shadow-orange-950/40 transition-all cursor-pointer flex items-center justify-center gap-1 active:scale-95"
                    >
                      <span>Заказать</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* Custom Project CTA Box */}
        <div className="mt-12 bg-gradient-to-r from-slate-900 via-orange-950/30 to-slate-900 border border-orange-500/30 rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              Индивидуальный проект любой сложности
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
              Не нашли нужные размеры или хотите уникальный дизайн?
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl">
              Пришлите фото участка, чертеж или эскиз от руки. Наш конструкторский отдел 
              бесплатно подготовит визуализацию и детальную смету с точностью до рубля!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={() => onOpenOrder('Индивидуальный проект по моим размерам')}
              className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold py-3 px-6 rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-95"
            >
              Заказать расчет своего проекта
            </button>
          </div>
        </div>

      </div>

      {/* DETAIL MODAL */}
      {detailModalItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl my-8 relative animate-in zoom-in-95">
            
            {/* Modal close */}
            <button
              onClick={() => setDetailModalItem(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image */}
            <div className="relative aspect-16/9 bg-slate-950">
              <img
                src={detailModalItem.image}
                alt={detailModalItem.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
                <div>
                  <span className="text-xs text-orange-400 font-bold uppercase">Прайс производства:</span>
                  <div className="text-2xl font-extrabold font-heading">{detailModalItem.price}</div>
                </div>
                {detailModalItem.dimensions && (
                  <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-semibold">
                    {detailModalItem.dimensions}
                  </span>
                )}
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <h3 className="text-xl sm:text-2xl font-extrabold text-white font-heading">
                {detailModalItem.title}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {detailModalItem.description}
              </p>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-1">
                  Характеристики и комплектация:
                </div>
                {detailModalItem.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => {
                    const item = detailModalItem;
                    setDetailModalItem(null);
                    onSelectProduct(item);
                    onOpenOrder(`Заказ изделия: ${item.title} (${item.price})`);
                  }}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-md cursor-pointer text-center"
                >
                  Оформить заказ со скидкой 2%
                </button>
                <button
                  onClick={() => setDetailModalItem(null)}
                  className="px-5 py-3 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-sm font-semibold transition-colors"
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
