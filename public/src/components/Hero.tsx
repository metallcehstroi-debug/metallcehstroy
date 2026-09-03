import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Calculator,
  Compass,
  ArrowRight,
  Sparkles,
  Truck,
  Star,
  Award,
} from 'lucide-react';
import { COMPANY_INFO, REAL_REVIEWS } from '../data/siteData';
import { EditableText, EditableImage } from '../editor/Editable';
import { useEditor } from '../editor/EditorContext';

interface HeroProps {
  onOpenOrder: (title?: string) => void;
  onNavigateToCalculator: () => void;
  onNavigateToCatalog: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenOrder,
  onNavigateToCalculator,
  onNavigateToCatalog,
}) => {
  const { editMode, getText, setValue } = useEditor();

  // Отзыв, показанный на карточке героя (выбирается в редакторе)
  const reviewId = getText('hero.review.id', 'rev-2');
  const review = REAL_REVIEWS.find((r) => r.id === reviewId) ?? REAL_REVIEWS[0];
  const setReviewId = (id: string) => setValue('hero.review.id', id);

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-20 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-b border-slate-200">
      
      {/* Background soft ambient orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100/50 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-amber-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 2xl:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Headline and Selling points */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-xs font-bold text-orange-700 shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-orange-600 animate-ping" />
              <EditableText id="hero.pill.left">Собственное производство в Домодедово</EditableText>
              <span className="text-slate-300">•</span>
              <EditableText id="hero.pill.right" className="text-amber-700">Более 1000 сданных объектов · Гарантия 2 года</EditableText>
            </div>

            {/* Main H1 */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-tight font-heading">
              <EditableText id="hero.h1.part1">Навесы, заборы и ангары</EditableText>{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
                <EditableText id="hero.h1.part2">под ключ по всей России</EditableText>
              </span>
            </h1>

            {/* Subtitle with real facts */}
            <EditableText
              as="p"
              id="hero.subtitle"
              multiline
              className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed block"
            >
              Производство и монтаж навесов, заборов и ангаров под ключ. Собственное производство. Более 1000 успешно сданных объектов по всей России с официальной гарантией 2 года.
            </EditableText>

            {/* Trust bullet points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-sm text-slate-700 font-medium">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Выезд замерщика 3 000 ₽ — вычитается из договора</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <EditableText id="hero.bullet.project">Индивидуальный проект и визуализация</EditableText>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Честная смета: цена не вырастет в процессе</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Дополнительная скидка 2% при заказе онлайн</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-3">
              <button
                onClick={onNavigateToCalculator}
                className="inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-orange-600 via-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold py-3.5 px-7 rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/35 transition-all text-base cursor-pointer active:scale-95 group"
              >
                <Calculator className="w-5 h-5 text-amber-200" />
                <span>Рассчитать стоимость онлайн</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onOpenOrder('Вызов замерщика (3 000 ₽ — вычитается из стоимости заказа)')}
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-300 hover:border-orange-500 text-slate-800 font-bold py-3.5 px-6 rounded-xl transition-all text-base cursor-pointer active:scale-95 shadow-xs"
              >
                <Compass className="w-5 h-5 text-orange-600" />
                <EditableText id="hero.btn.measure">Вызвать замерщика</EditableText>
              </button>
            </div>

            {/* Micro guarantees strip */}
            <div className="flex flex-wrap items-center gap-6 pt-3 text-xs text-slate-500 border-t border-slate-200">
              <div className="flex items-center gap-1.5 font-medium">
                <Truck className="w-4 h-4 text-orange-600" />
                <EditableText id="hero.micro1">Собственная доставка по всей России</EditableText>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <EditableText id="hero.micro2">Официальный договор</EditableText>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <EditableText id="hero.micro3">Окончательный расчёт по факту монтажа</EditableText>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Visual Card with Real Work Photo */}
          <div className="lg:col-span-5 relative">
            <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-xl hover:shadow-2xl transition-shadow relative">
              
              {/* Featured installation image */}
              <div className="relative rounded-2xl overflow-hidden aspect-4/3 sm:aspect-16/10 group">
                <EditableImage
                  id="hero.image"
                  src="https://xn--80ajbqiadvrjgf1bm.xn--p1ai/wp-content/uploads/freshizer/2296076d27b2cfba8a1c9d4fb5d32c68_f51777c2-0a13-48c9-9154-8f82a0a7071d-270-270-c-100.jpg"
                  alt="Арочный навес из сотового поликарбоната МеталлЦехСтрой"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="eager"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 pointer-events-none" />

                {/* Floating Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                  <span className="bg-orange-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <EditableText id="hero.image.badge1">Реальный сданный объект</EditableText>
                  </span>
                  <span className="bg-white/90 text-slate-900 text-xs font-semibold px-2 py-1 rounded-lg backdrop-blur-xs">
                    <EditableText id="hero.image.badge2">МО, Истринский р-н</EditableText>
                  </span>
                </div>

                <div className="absolute top-3 right-3 bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
                  <EditableText id="hero.image.badge3">Монтаж 2 дня</EditableText>
                </div>

                {/* Title on image */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="text-xs text-orange-300 font-semibold uppercase tracking-wider">
                    <EditableText id="hero.image.caption1">Арочный навес 6 × 7 м на 2 автомобиля</EditableText>
                  </p>
                  <p className="text-sm font-bold truncate">
                    <EditableText id="hero.image.caption2">
                      Сотовый поликарбонат 10 мм бронза + ферма из профиля ГОСТ
                    </EditableText>
                  </p>
                </div>
              </div>

              {/* Выбор отзыва в режиме редактора */}
              {editMode && (
                <label className="mt-3 flex items-center gap-2 text-[11px] font-bold text-slate-600 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                  <Star className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="shrink-0">Отзыв на карточке:</span>
                  <select
                    value={reviewId}
                    onChange={(e) => setReviewId(e.target.value)}
                    className="flex-1 min-w-0 bg-white border border-slate-300 rounded-lg px-2 py-1 text-[11px] text-slate-800 outline-none focus:border-orange-500 cursor-pointer"
                  >
                    {REAL_REVIEWS.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.author} — {r.project || r.date}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              {/* Verified client review card snapshot */}
              <div className="mt-3.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
                {review.image ? (
                  <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-orange-200 shrink-0 shadow-sm bg-white">
                    <EditableImage
                      id={`hero.review.${review.id}.image`}
                      src={review.image}
                      alt={review.author}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
                    {review.author.charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      <EditableText id={`hero.review.${review.id}.author`}>
                        {review.author + (review.project ? ` · ${review.project}` : '')}
                      </EditableText>
                    </div>
                    <div className="flex text-amber-500 shrink-0">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                  </div>
                  <EditableText
                    as="p"
                    id={`hero.review.${review.id}.text`}
                    multiline
                    className="text-xs text-slate-600 italic line-clamp-3 leading-relaxed block"
                  >
                    {`«${review.text}»`}
                  </EditableText>
                </div>
              </div>

              {/* Director signature highlight */}
              <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-orange-600" />
                  <span>Контроль директора: <strong className="text-slate-800">{COMPANY_INFO.director}</strong></span>
                </div>
                <button
                  onClick={onNavigateToCatalog}
                  className="text-orange-600 hover:text-orange-700 font-bold cursor-pointer"
                >
                  Все модели →
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* Live Counters Banner in Clean White Card Style */}
        <div className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 bg-white border border-slate-200 p-5 sm:p-7 rounded-3xl shadow-sm">
          
          <div className="text-center sm:text-left border-r border-slate-200 last:border-r-0 pr-2">
            <div className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-heading">
              <EditableText id="hero.stat1.num">12 лет</EditableText>
            </div>
            <EditableText as="div" id="hero.stat1.label" className="text-xs sm:text-sm text-slate-600 mt-1 font-medium block">
              Опыта в производстве металлоконструкций
            </EditableText>
          </div>

          <div className="text-center sm:text-left border-r border-slate-200 last:border-r-0 pr-2">
            <div className="text-2xl sm:text-4xl font-extrabold text-orange-600 font-heading">
              <EditableText id="hero.stat2.num">1000+</EditableText>
            </div>
            <EditableText as="div" id="hero.stat2.label" className="text-xs sm:text-sm text-slate-600 mt-1 font-medium block">
              Успешно сданных объектов по всей России
            </EditableText>

          </div>

          <div className="text-center sm:text-left border-r border-slate-200 last:border-r-0 pr-2">
            <div className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-heading">
              <EditableText id="hero.stat3.num">2 года</EditableText>
            </div>
            <EditableText as="div" id="hero.stat3.label" className="text-xs sm:text-sm text-slate-600 mt-1 font-medium block">
              Официальной гарантии по договору
            </EditableText>
          </div>

          <div className="text-center sm:text-left">
            <div className="text-2xl sm:text-4xl font-extrabold text-emerald-600 font-heading">
              <EditableText id="hero.stat4.num">3 000 ₽</EditableText>
            </div>
            <EditableText as="div" id="hero.stat4.label" className="text-xs sm:text-sm text-slate-600 mt-1 font-medium block">
              Выезд замерщика — вычитается из стоимости заказа
            </EditableText>
          </div>

        </div>

      </div>
    </section>
  );
};
