import React from 'react';
import {
  Fence,
  Check,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import { CATALOG_PRODUCTS, ProductItem } from '../data/siteData';
import { EditableText, EditableImage } from '../editor/Editable';
import { PageId } from './Header';

interface FencesSectionProps {
  onNavigate: (page: PageId) => void;
  onOpenOrder: (title?: string) => void;
  onSelectProduct: (product: ProductItem) => void;
}

export const FencesSection: React.FC<FencesSectionProps> = ({
  onNavigate,
  onOpenOrder,
  onSelectProduct,
}) => {
  // 6 ключевых позиций заборов и ворот с сайта
  const fenceItems = CATALOG_PRODUCTS.filter(
    (item) =>
      item.id === 'fence-prof' ||
      item.id === 'fence-shtaket' ||
      item.id === 'fence-zhalyuzi' ||
      item.id === 'fence-3d' ||
      item.id === 'fence-wood' ||
      item.id === 'gate-sliding'
  );

  return (
    <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 2xl:px-10">
        {/* Заголовок секции */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 border border-orange-200 text-xs font-bold text-orange-700 mb-3">
              <Fence className="w-3.5 h-3.5" />
              <EditableText id="home.fences.badge">Ограждения и въездные группы под ключ</EditableText>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-heading tracking-tight">
              <EditableText id="home.fences.title">Заборы для дома и дачи</EditableText>
            </h2>
            <EditableText
              as="p"
              id="home.fences.subtitle"
              multiline
              className="text-slate-600 text-sm sm:text-base mt-2 max-w-3xl block"
            >
              Установка заборов из профнастила, евроштакетника, премиум-жалюзи, 3D-сетки, дерева и на
              монолитном фундаменте. Производство и монтаж откатных и распашных ворот с автоматикой.
            </EditableText>
          </div>

          <button
            onClick={() => onNavigate('fences')}
            className="inline-flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors cursor-pointer shrink-0"
          >
            <span>Смотреть все заборы и ворота</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Сетка карточек заборов */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {fenceItems.map((item) => (
            <div
              key={item.id}
              className="white-card rounded-3xl overflow-hidden flex flex-col justify-between group"
            >
              {/* Фото */}
              <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                <EditableImage
                  id={`home.fence.${item.id}.image`}
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

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] text-orange-300 font-bold uppercase tracking-wider block">
                    Цена под ключ:
                  </span>
                  <span className="text-2xl font-extrabold font-heading text-white">
                    <EditableText id={`product.${item.id}.price`}>{item.price}</EditableText>
                  </span>
                  {item.unit && <span className="text-xs text-slate-200 ml-1">/{item.unit}</span>}
                </div>
              </div>

              {/* Тело карточки */}
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
                    onClick={() => {
                      onSelectProduct(item);
                      onOpenOrder(`Заказ забора: ${item.title} (${item.price})`);
                    }}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <span>Оформить заявку</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Инфо-плашка о монтаже заборов */}
        <div className="mt-10 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 flex-1 text-xs text-slate-600">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 shrink-0 font-bold text-[11px]">
                <EditableText id="fences.strip1.value">100м</EditableText>
              </div>
              <div>
                <EditableText as="strong" id="fences.strip1.title" className="text-slate-900 block font-semibold text-sm">
                  Монтаж до 100 м в день
                </EditableText>
                <EditableText as="span" id="fences.strip1.desc">
                  Штатная бригада 4–5 опытных мастеров
                </EditableText>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <EditableText as="strong" id="fences.strip2.title" className="text-slate-900 block font-semibold text-sm">
                  Сталь по ГОСТ
                </EditableText>
                <EditableText as="span" id="fences.strip2.desc">
                  Оцинкованный металл и полимерное покрытие
                </EditableText>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <EditableText as="strong" id="fences.strip3.title" className="text-slate-900 block font-semibold text-sm">
                  Гарантия 24 месяца
                </EditableText>
                <EditableText as="span" id="fences.strip3.desc">
                  Официальный договор с фиксированной ценой
                </EditableText>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('fences')}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer shrink-0"
          >
            <span>Все виды заборов и ворот</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
