import React, { useState } from 'react';
import {
  Check,
  ChevronRight,
  Info,
  Maximize2,
  X,
} from 'lucide-react';
import { CATALOG_PRODUCTS, ProductItem } from '../data/siteData';
import { EditableText, EditableImage } from '../editor/Editable';
import { useAppliedFilter } from '../editor/navFilter';

interface FencesPageProps {
  onSelectProduct: (product: ProductItem) => void;
  onOpenOrder: (title?: string) => void;
}

export const FencesPage: React.FC<FencesPageProps> = ({
  onSelectProduct,
  onOpenOrder,
}) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [modalItem, setModalItem] = useState<ProductItem | null>(null);

  const fencesAndGates = CATALOG_PRODUCTS.filter(
    (item) => item.category === 'fence' || item.category === 'gate'
  );

  // Подкатегории для чипов и фильтра из меню
  const subCats = Array.from(
    new Set(fencesAndGates.map((i) => i.subCategory).filter(Boolean))
  ) as string[];

  // Фильтр из выпадающего меню шапки
  useAppliedFilter('fences', (f) => setActiveTab(f));

  const displayed = fencesAndGates.filter((item) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'fence') return item.category === 'fence';
    if (activeTab === 'gate') return item.category === 'gate';
    if (activeTab === 'Откатные и распашные ворота') return item.category === 'gate';
    return item.subCategory === activeTab;
  });

  return (
    <div className="bg-white py-10 sm:py-16">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 2xl:px-10">
        
        {/* Breadcrumb & Heading */}
        <div className="mb-8">
          <div className="text-xs font-semibold text-slate-500 mb-2">
            <span>Главная</span> <span className="mx-1">/</span> <span className="text-orange-600">Заборы и Ворота</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 font-heading tracking-tight">
            Заборы и ворота для дома и дачи{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
              под ключ
            </span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-3 max-w-3xl leading-relaxed">
            <EditableText as="span" id="fencespage.subtitle" multiline>
              Установка заборов из профнастила, металлического евроштакетника, 3D-сетки Gitter, премиальных заборов «Жалюзи», а также монтаж распашных и откатных ворот с надежной итальянской автоматикой. Монтаж до 100 метров в день с гарантией 2 года!
            </EditableText>
          </p>
        </div>

        {/* Real Cover Banner */}
        <div className="relative rounded-3xl overflow-hidden mb-10 shadow-md aspect-21/9 bg-slate-900">
          <img
            src="https://xn--80ajbqiadvrjgf1bm.xn--p1ai/wp-content/uploads/freshizer/561b82c64dd2f0f301a0f04b9902e62f_Обложка-для-заборов-2300-800-c-90.jpg"
            alt="Заборы и ворота МеталлЦехСтрой"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-transparent flex items-center p-6 sm:p-12">
            <div className="max-w-xl text-white space-y-3">
              <span className="inline-block bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Собственный цех металлообработки
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-heading">
                Заборы и Ворота от 835 ₽/м²
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 hidden sm:block">
                Выезд замерщика 3 000 ₽ — вычитается из стоимости заказа при заключении договора.
              </p>
              <button
                onClick={() => onOpenOrder('Заказ замера забора и ворот')}
                className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold py-2.5 px-5 rounded-xl text-xs sm:text-sm transition-all cursor-pointer shadow-md"
              >
                Вызвать замерщика (3 000 ₽)
              </button>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-8 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Все заборы и ворота
          </button>
          <button
            onClick={() => setActiveTab('fence')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'fence'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Только заборы
          </button>
          <button
            onClick={() => setActiveTab('gate')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'gate'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Откатные и распашные ворота
          </button>
        </div>

        {/* Чипы подкатегорий */}
        <div className="flex items-center gap-1.5 flex-wrap mb-8 -mt-4">
          {subCats.map((sc) => (
            <button
              key={sc}
              onClick={() => setActiveTab(activeTab === sc ? 'all' : sc)}
              className={`px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-bold transition-all cursor-pointer border ${
                activeTab === sc
                  ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-amber-300 hover:text-amber-700'
              }`}
            >
              {sc}
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayed.map((item) => (
            <div
              key={item.id}
              className="white-card rounded-3xl overflow-hidden flex flex-col justify-between group"
            >
              <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                <EditableImage
                  id={`product.${item.id}.image`}
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  {item.badge && (
                    <span className="bg-orange-600 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-lg shadow-sm">
                      {item.badge}
                    </span>
                  )}
                  <span className="bg-white/95 text-slate-800 text-[11px] font-bold px-2 py-0.5 rounded-lg shadow-xs">
                    {item.subCategory}
                  </span>
                </div>

                <button
                  onClick={() => setModalItem(item)}
                  aria-label="Увеличить фото"
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/40 hover:bg-orange-600 text-white transition-colors cursor-pointer"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[11px] text-orange-300 font-bold uppercase tracking-wider block">
                    Цена под ключ:
                  </span>
                  <span className="text-2xl font-extrabold font-heading text-white">
                    <EditableText id={`product.${item.id}.price`}>{item.price}</EditableText>
                  </span>
                  {item.unit && <span className="text-xs text-slate-200 ml-1">/{item.unit}</span>}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <EditableText
                    as="h3"
                    id={`product.${item.id}.title`}
                    className="text-base sm:text-lg font-bold text-slate-900 font-heading group-hover:text-orange-600 transition-colors leading-snug block"
                  >
                    {item.title}
                  </EditableText>
                  <EditableText
                    as="p"
                    id={`product.${item.id}.desc`}
                    multiline
                    className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed block"
                  >
                    {item.description}
                  </EditableText>

                  <div className="mt-3.5 space-y-1.5 pt-3 border-t border-slate-100 text-xs text-slate-700">
                    {item.features.slice(0, 3).map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => setModalItem(item)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 px-3 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Info className="w-3.5 h-3.5" />
                    <span>Описание</span>
                  </button>

                  <button
                    onClick={() => {
                      onSelectProduct(item);
                      onOpenOrder(`Заказ забора/ворот: ${item.title} (${item.price})`);
                    }}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1 active:scale-95"
                  >
                    <span>Заказать</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Modal */}
      {modalItem && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative my-6 animate-in zoom-in-95 border border-slate-200">
            <button
              onClick={() => setModalItem(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative aspect-16/9 bg-slate-900">
              <img
                src={modalItem.image}
                alt={modalItem.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-xs text-orange-300 font-bold uppercase">Цена от производителя:</span>
                <div className="text-2xl font-extrabold font-heading">
                  {modalItem.price} {modalItem.unit && `/${modalItem.unit}`}
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">
                {modalItem.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {modalItem.description}
              </p>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Характеристики:
                </div>
                {modalItem.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => {
                    const itm = modalItem;
                    setModalItem(null);
                    onSelectProduct(itm);
                    onOpenOrder(`Заказ забора/ворот: ${itm.title} (${itm.price})`);
                  }}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 px-4 rounded-xl text-sm shadow-md transition-all cursor-pointer text-center"
                >
                  Оформить заявку со скидкой 2%
                </button>
                <button
                  onClick={() => setModalItem(null)}
                  className="px-6 py-3.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-sm font-semibold transition-colors cursor-pointer"
                >
                  Закрыть
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
