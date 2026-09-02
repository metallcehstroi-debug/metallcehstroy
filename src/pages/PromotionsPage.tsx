import React from 'react';
import {
  Clock,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { PROMOTIONS } from '../data/siteData';
import { EditableText } from '../editor/Editable';

interface PromotionsPageProps {
  onOpenOrder: (title?: string) => void;
}

export const PromotionsPage: React.FC<PromotionsPageProps> = ({ onOpenOrder }) => {
  return (
    <div className="bg-white py-10 sm:py-16">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 2xl:px-10">
        
        {/* Breadcrumb & Header */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <div className="text-xs font-semibold text-slate-500 mb-2">
            <span>Главная</span> <span className="mx-1">/</span> <span className="text-orange-600">Акции и скидки</span>
          </div>
          <div className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-700 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Выгодные предложения производства
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 font-heading tracking-tight">
            <EditableText id="promotions.h1.part1">Акции и специальные предложения</EditableText>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
              <EditableText id="promotions.h1.part2">«МеталлЦехСтрой»</EditableText>
            </span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            МеталлЦехСтрой предлагает вам самые лучшие условия на рынке навесов и заборов Москвы и Московской области.
          </p>
        </div>

        {/* Promotions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12">
          {PROMOTIONS.map((promo) => (
            <div
              key={promo.id}
              className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative border ${
                promo.highlight
                  ? 'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-300 shadow-lg'
                  : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
              }`}
            >
              {promo.highlight && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-orange-600 to-amber-600 text-white text-[11px] font-extrabold px-3.5 py-1 rounded-bl-2xl uppercase tracking-wider shadow-xs">
                  Хит сезона
                </div>
              )}

              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-xs font-bold text-orange-700 bg-orange-100 border border-orange-200 px-2.5 py-0.5 rounded-lg">
                    <EditableText id={`promo.${promo.id}.badge`}>{promo.badge}</EditableText>
                  </span>
                  {promo.validUntil && (
                    <span className="text-xs text-slate-500 flex items-center gap-1 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-orange-600" />
                      до <EditableText id={`promo.${promo.id}.valid`}>{promo.validUntil}</EditableText>
                    </span>
                  )}
                </div>

                <EditableText as="h3" id={`promo.${promo.id}.title`} className="text-xl font-bold text-slate-900 font-heading mb-2 block">
                  {promo.title}
                </EditableText>

                <EditableText as="p" id={`promo.${promo.id}.desc`} multiline className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 block">
                  {promo.description}
                </EditableText>
              </div>

              <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between">
                <div className="text-2xl sm:text-3xl font-extrabold font-heading text-orange-600">
                  <EditableText id={`promo.${promo.id}.discount`}>{promo.discount}</EditableText>
                </div>

                <button
                  onClick={() => onOpenOrder(`Активировать акцию: ${promo.title}`)}
                  className={`text-xs font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer shadow-xs ${
                    promo.highlight
                      ? 'bg-orange-600 hover:bg-orange-700 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                  }`}
                >
                  Применить скидку →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Real Rules and Disclaimers block from original site */}
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto space-y-4">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-orange-600" />
            Правила и условия предоставления акций:
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Бесплатная подробная консультация</strong> дежурного инженера и расчет стоимости в день обращения.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Выезд замерщика — 3 000 ₽</strong>, сумма вычитается из стоимости заказа при заключении договора. Специалист приезжает с лазерным дальномером и образцами материалов по Москве и Московской области.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Летние скидки до 20%</strong> действуют по 31.08.2026 на весь металлокаркас и стандартные размеры навесов.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Скидка 2% при оформлении заявки онлайн</strong> на данном сайте.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Пенсионерам скидка 2%</strong> при предъявлении пенсионного удостоверения.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Официальная гарантия 2 года</strong> прописывается в договоре подряда.</span>
            </li>
          </ul>

          <div className="pt-3 border-t border-slate-200 text-xs text-slate-400 italic">
            * Внимание: скидка не может суммироваться с другой скидкой. Акции могут быть изменены или прекращены досрочно. Уточняйте при заказе.
          </div>
        </div>

      </div>
    </div>
  );
};
