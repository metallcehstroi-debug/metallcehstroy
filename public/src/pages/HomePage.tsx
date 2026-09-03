import React, { useState } from 'react';
import { Hero } from '../components/Hero';
import { Calculator } from '../components/Calculator';
import { RoofMaterialsSection } from '../components/RoofMaterialsSection';
import { WhyUs } from '../components/WhyUs';
import { ProcessSteps } from '../components/ProcessSteps';
import { ConsultationForm } from '../components/ConsultationForm';
import { FaqSection } from '../components/FaqSection';
import { FencesSection } from '../components/FencesSection';
import { CanopyTypesSection } from '../components/CanopyTypesSection';
import { PhotoAlbum, AlbumBadge } from '../components/PhotoAlbum';
import { CATALOG_PRODUCTS, REAL_PORTFOLIO, REAL_REVIEWS, ProductItem } from '../data/siteData';
import { EditableText, EditableImage } from '../editor/Editable';
import {
  ChevronRight,
  Maximize2,
  Check,
  Star,
  Sparkles,
  Calendar,
  Layers,
  Warehouse,
  ArrowRight,
  GripVertical,
} from 'lucide-react';
import { PageId } from '../components/Header';
import { savePortfolioOrder, usePortfolioOrder } from '../editor/customItems';
import { useEditor } from '../editor/EditorContext';

interface HomePageProps {
  onNavigate: (page: PageId) => void;
  onOpenOrder: (title?: string) => void;
  onSelectProduct: (product: ProductItem) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onOpenOrder,
  onSelectProduct,
}) => {
  const { editMode, notify } = useEditor();
  const portfolioOrder = usePortfolioOrder();
  const [draggedWorkId, setDraggedWorkId] = useState<string | null>(null);
  // Best sellers for home preview
  const bestSellers = CATALOG_PRODUCTS.filter((p) => p.popular).slice(0, 6);
  const orderedWorks = [...REAL_PORTFOLIO].sort((a, b) => {
    if (!portfolioOrder.length) return 0;
    const aIndex = portfolioOrder.indexOf(a.id);
    const bIndex = portfolioOrder.indexOf(b.id);
    return (aIndex < 0 ? Number.MAX_SAFE_INTEGER : aIndex) -
      (bIndex < 0 ? Number.MAX_SAFE_INTEGER : bIndex);
  });
  const recentWorks = orderedWorks.slice(0, 9);
  const homeReviews = REAL_REVIEWS.slice(0, 4);

  const moveRecentWork = (sourceId: string, targetId: string) => {
    if (!sourceId || sourceId === targetId) return;
    const ids = orderedWorks.map((item) => item.id);
    const from = ids.indexOf(sourceId);
    const to = ids.indexOf(targetId);
    if (from < 0 || to < 0) return;
    const [moved] = ids.splice(from, 1);
    ids.splice(to, 0, moved);
    savePortfolioOrder(ids);
    notify('Новый порядок объектов сохранён');
  };

  // Фотоальбом объекта на главной
  const [albumItem, setAlbumItem] = useState<typeof REAL_PORTFOLIO[0] | null>(null);

  return (
    <div>
      {/* 1. Hero */}
      <Hero
        onOpenOrder={onOpenOrder}
        onNavigateToCalculator={() => onNavigate('calculator')}
        onNavigateToCatalog={() => onNavigate('canopies')}
      />

      {/* Quick Category Navigation Tiles */}
      <section className="py-10 bg-white border-b border-slate-200">
        <div className="max-w-[1680px] mx-auto px-4 sm:px-6 2xl:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <button
              onClick={() => onNavigate('canopies')}
              className="white-card rounded-2xl p-5 text-left group hover:border-orange-500 transition-all cursor-pointer shadow-xs"
            >
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 mb-3 group-hover:scale-110 transition-transform">
                <Maximize2 className="w-5 h-5" />
              </div>
              <EditableText as="h3" id="home.tile1.title" className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-orange-600 font-heading block">
                Навесы для авто и дома
              </EditableText>
              <EditableText as="p" id="home.tile1.desc" className="text-xs text-slate-500 mt-1 block">
                Арочные, с фризом, консольные
              </EditableText>
              <EditableText as="span" id="home.tile1.link" className="text-xs text-orange-600 font-bold inline-flex items-center gap-1 mt-3">
                В каталог навесов →
              </EditableText>
            </button>

            <button
              onClick={() => onNavigate('fences')}
              className="white-card rounded-2xl p-5 text-left group hover:border-orange-500 transition-all cursor-pointer shadow-xs"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 mb-3 group-hover:scale-110 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <EditableText as="h3" id="home.tile2.title" className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-orange-600 font-heading block">
                Заборы и Ворота
              </EditableText>
              <EditableText as="p" id="home.tile2.desc" className="text-xs text-slate-500 mt-1 block">
                Профнастил, жалюзи, откатные
              </EditableText>
              <EditableText as="span" id="home.tile2.link" className="text-xs text-orange-600 font-bold inline-flex items-center gap-1 mt-3">
                В каталог заборов →
              </EditableText>
            </button>

            <button
              onClick={() => onNavigate('hangars')}
              className="white-card rounded-2xl p-5 text-left group hover:border-orange-500 transition-all cursor-pointer shadow-xs"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-3 group-hover:scale-110 transition-transform">
                <Warehouse className="w-5 h-5" />
              </div>
              <EditableText as="h3" id="home.tile3.title" className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-orange-600 font-heading block">
                Ангары и Склады
              </EditableText>
              <EditableText as="p" id="home.tile3.desc" className="text-xs text-slate-500 mt-1 block">
                Холодные и теплые ЛМК
              </EditableText>
              <EditableText as="span" id="home.tile3.link" className="text-xs text-orange-600 font-bold inline-flex items-center gap-1 mt-3">
                Склады под ключ →
              </EditableText>
            </button>

            <button
              onClick={() => onNavigate('calculator')}
              className="bg-gradient-to-br from-orange-500 to-amber-600 text-white rounded-2xl p-5 text-left group transition-all cursor-pointer shadow-md hover:shadow-lg"
            >
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5 text-amber-200" />
              </div>
              <EditableText as="h3" id="home.tile4.title" className="font-bold text-white text-sm sm:text-base font-heading block">
                Онлайн-калькулятор
              </EditableText>
              <EditableText as="p" id="home.tile4.desc" className="text-xs text-orange-100 mt-1 block">
                Расчет сметы онлайн за 1 минуту
              </EditableText>
              <EditableText as="span" id="home.tile4.link" className="text-xs text-white font-bold inline-flex items-center gap-1 mt-3 underline underline-offset-2">
                Рассчитать сейчас →
              </EditableText>
            </button>

          </div>
        </div>
      </section>

      {/* 2. Interactive Calculator Section */}
      <Calculator onSuccessOrder={(details) => onOpenOrder(details)} />

      {/* 3. Best Sellers Showcase */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="max-w-[1680px] mx-auto px-4 sm:px-6 2xl:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 border border-orange-200 text-xs font-bold text-orange-700 mb-3">
                <EditableText id="home.bestsellers.tag">Хиты продаж производства</EditableText>
              </div>
              <EditableText as="h2" id="home.bestsellers.title" className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-heading tracking-tight block">
                Популярные модели стандартных навесов
              </EditableText>
              <EditableText as="p" id="home.bestsellers.subtitle" className="text-slate-600 text-sm sm:text-base mt-2 block">
                Конструкции, которые чаще всего заказывают владельцы загородных домов и коттеджей.
              </EditableText>
            </div>

            <button
              onClick={() => onNavigate('standard')}
              className="inline-flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors cursor-pointer"
            >
              <span>Смотреть весь каталог продукции</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {bestSellers.map((item) => (
              <div
                key={item.id}
                className="white-card rounded-3xl overflow-hidden flex flex-col justify-between group"
              >
                <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                  <EditableImage
                    id={`bestseller.${item.id}.image`}
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {item.badge && (
                      <span className="bg-orange-600 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-lg shadow-sm">
                        <EditableText id={`bestseller.${item.id}.badge`}>{item.badge}</EditableText>
                      </span>
                    )}
                    {item.dimensions && (
                      <span className="bg-white/95 text-slate-900 text-[11px] font-bold px-2 py-0.5 rounded-lg shadow-xs">
                        <EditableText id={`bestseller.${item.id}.dims`}>{item.dimensions}</EditableText>
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <EditableText as="span" id={`bestseller.${item.id}.pricelabel`} className="text-[10px] text-orange-300 font-bold uppercase tracking-wider block">
                      Цена производства:
                    </EditableText>
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
                          <EditableText id={`bestseller.${item.id}.feat${idx}`} className="truncate">
                            {feat}
                          </EditableText>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => {
                        onSelectProduct(item);
                        onOpenOrder(`Заказ изделия: ${item.title} (${item.price})`);
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

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('standard')}
              className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 px-7 rounded-xl text-sm transition-colors cursor-pointer shadow-md"
            >
              <span>Стандартные навесы с ценами</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('canopies')}
              className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3.5 px-7 rounded-xl text-sm transition-colors cursor-pointer"
            >
              <span>Навесы с реальными фото</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. Виды навесов (арочные, полуарочные и т.д.) */}
      <CanopyTypesSection onNavigate={onNavigate} onOpenOrder={onOpenOrder} />

      {/* 5. Раздел по заборам и воротам */}
      <FencesSection
        onNavigate={onNavigate}
        onOpenOrder={onOpenOrder}
        onSelectProduct={onSelectProduct}
      />

      {/* 5. Roof Materials Section */}
      <RoofMaterialsSection onOpenOrder={onOpenOrder} />

      {/* 5. Recent Works Preview («Обновления») */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
        <div className="max-w-[1680px] mx-auto px-4 sm:px-6 2xl:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 border border-orange-200 text-xs font-bold text-orange-700 mb-3">
                <EditableText id="home.updates.tag">Раздел «Обновления»</EditableText>
              </div>
              <EditableText as="h2" id="home.updates.title" className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-heading tracking-tight block">
                Недавние работы в фотографиях
              </EditableText>
              <EditableText as="p" id="home.updates.subtitle" multiline className="text-slate-600 text-sm sm:text-base mt-2 block">
                Свежие фотографии объектов, сданных нашими бригадами за последнее время.
              </EditableText>
            </div>

            <button
              onClick={() => onNavigate('gallery')}
              className="inline-flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors cursor-pointer"
            >
              <EditableText id="home.updates.link">Перейти в полную фотогалерею</EditableText>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {recentWorks.map((item) => (
              <div
                key={item.id}
                onClick={() => !editMode && setAlbumItem(item)}
                draggable={editMode}
                onDragStart={(event) => {
                  if (!editMode) return;
                  setDraggedWorkId(item.id);
                  event.dataTransfer.effectAllowed = 'move';
                  event.dataTransfer.setData('text/plain', item.id);
                }}
                onDragOver={(event) => {
                  if (editMode) event.preventDefault();
                }}
                onDrop={(event) => {
                  if (!editMode) return;
                  event.preventDefault();
                  moveRecentWork(event.dataTransfer.getData('text/plain') || draggedWorkId || '', item.id);
                  setDraggedWorkId(null);
                }}
                onDragEnd={() => setDraggedWorkId(null)}
                className={`white-card rounded-3xl overflow-hidden flex flex-col justify-between group relative ${
                  editMode
                    ? `cursor-grab active:cursor-grabbing ${draggedWorkId === item.id ? 'opacity-50 ring-2 ring-orange-500' : ''}`
                    : 'cursor-pointer'
                }`}
              >
                {editMode && (
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 z-40 inline-flex items-center gap-1 rounded-full bg-slate-950/80 text-white px-2.5 py-1 text-[10px] font-bold shadow-lg pointer-events-none">
                    <GripVertical className="w-3.5 h-3.5" /> Перетащите
                  </div>
                )}
                <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                  <EditableImage
                    id={`gallery.${item.id}.image`}
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity pointer-events-none" />

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
                    <EditableText as="h3" id={`gallery.${item.id}.title`} className="text-sm sm:text-base font-bold font-heading line-clamp-2 block">
                      {item.title}
                    </EditableText>
                  </div>
                </div>

                <div className="p-4 text-xs text-slate-600 flex items-center justify-between gap-2">
                  <EditableText id={`gallery.${item.id}.material`} className="truncate max-w-[160px]">
                    {item.material}
                  </EditableText>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenOrder(`Хочу такой же: ${item.title}`);
                      }}
                      className="inline-flex items-center gap-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-1 px-2.5 rounded-lg transition-colors cursor-pointer active:scale-95 text-[10px]"
                    >
                      Заказать
                    </button>
                    <span className="text-orange-600 font-bold">
                      Фото →
                    </span>
                  </div>
                </div>

                {/* Бейдж фотоальбома */}
                <div className="absolute top-3 right-3">
                  <AlbumBadge portId={item.id} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Фотоальбом объекта с главной */}
      {albumItem && (
        <PhotoAlbum
          portId={albumItem.id}
          title={`${albumItem.title} · ${albumItem.date}`}
          mainImage={albumItem.image}
          onClose={() => setAlbumItem(null)}
          onOrder={(t) => onOpenOrder(t)}
        />
      )}

      {/* 6. WhyUs & Factory Standards */}
      <WhyUs onOpenOrder={onOpenOrder} />

      {/* 7. 6 Simple Steps to Installation */}
      <ProcessSteps onOpenOrder={onOpenOrder} />

      {/* 8. Verified Client Reviews Preview */}
      <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-[1680px] mx-auto px-4 sm:px-6 2xl:px-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 border border-orange-200 text-xs font-bold text-orange-700 mb-3">
                <EditableText id="home.reviews.tag">Честные отзывы</EditableText>
              </div>
              <EditableText as="h2" id="home.reviews.title" className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-heading tracking-tight block">
                Отзывы клиентов о нашей работе
              </EditableText>
              <EditableText as="p" id="home.reviews.subtitle" multiline className="text-slate-600 text-sm sm:text-base mt-2 block">
                Реальные впечатления заказчиков с контактами и фото сданных объектов.
              </EditableText>
            </div>

            <button
              onClick={() => onNavigate('reviews')}
              className="inline-flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors cursor-pointer"
            >
              <EditableText id="home.reviews.link">Читать все отзывы</EditableText>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {homeReviews.map((rev) => (
              <div
                key={rev.id}
                className="white-card rounded-3xl p-6 sm:p-7 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-extrabold text-base shadow-xs shrink-0">
                        {rev.author.charAt(0)}
                      </div>
                      <div>
                        <EditableText as="h3" id={`review.${rev.id}.author`} className="font-bold text-slate-900 text-sm sm:text-base font-heading block">
                          {rev.author}
                        </EditableText>
                        {rev.email && (
                          <div className="text-xs text-slate-400 font-mono">{rev.email}</div>
                        )}
                      </div>
                    </div>

                    <div className="flex text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>

                  {rev.project && (
                    <div className="mb-2">
                      <span className="inline-block bg-orange-50 text-orange-800 border border-orange-200 text-xs font-semibold px-2.5 py-0.5 rounded-md">
                        <EditableText id={`review.${rev.id}.project`}>{rev.project}</EditableText>
                      </span>
                    </div>
                  )}

                  <EditableText
                    as="p"
                    id={`review.${rev.id}.text`}
                    multiline
                    className="text-xs sm:text-sm text-slate-600 italic line-clamp-3 leading-relaxed block"
                  >
                    {`«${rev.text}»`}
                  </EditableText>
                </div>

                {rev.image && (
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                        <EditableImage
                          id={`review.${rev.id}.image`}
                          src={rev.image}
                          alt={rev.project || rev.author}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <EditableText id={`review.${rev.id}.caption`} className="text-xs text-slate-500">
                        Фотография навеса
                      </EditableText>
                    </div>
                    <button
                      onClick={() => onNavigate('reviews')}
                      className="text-xs font-bold text-orange-600 hover:text-orange-700 cursor-pointer"
                    >
                      Читать отзыв полностью →
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Consultation & Drawing upload Form */}
      <ConsultationForm onSuccessOrder={(details) => onOpenOrder(details)} />

      {/* 10. FAQ */}
      <FaqSection />
    </div>
  );
};
