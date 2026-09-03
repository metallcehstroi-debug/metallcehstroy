import React from 'react';
import {
  Gift,
  Clock,
} from 'lucide-react';
import { PROMOTIONS } from '../data/siteData';

interface PromotionsSectionProps {
  onOpenOrder: (title?: string) => void;
}

export const PromotionsSection: React.FC<PromotionsSectionProps> = ({ onOpenOrder }) => {
  return (
    <section id="promotions" className="py-16 sm:py-24 bg-slate-950 border-b border-slate-800 relative">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 2xl:px-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-950/60 border border-orange-600/30 text-xs font-bold text-orange-400 mb-3">
            <Gift className="w-3.5 h-3.5" />
            Выгодные предложения
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-heading tracking-tight">
            Специальные акции и скидки от{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
              «МеталлЦехСтрой»
            </span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            Мы регулярно обновляем программы лояльности, чтобы вы могли заказать навес или забор по лучшей цене в регионе.
          </p>
        </div>

        {/* Promotions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {PROMOTIONS.map((promo) => (
            <div
              key={promo.id}
              className={`rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 relative overflow-hidden group ${
                promo.highlight
                  ? 'bg-gradient-to-br from-orange-950/50 via-slate-900 to-slate-950 border-2 border-orange-500/80 shadow-2xl shadow-orange-950/40'
                  : 'bg-slate-900/70 border border-slate-800 hover:border-slate-700 shadow-xl'
              }`}
            >
              {promo.highlight && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-orange-500 to-amber-600 text-white text-[11px] font-extrabold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                  Главная акция
                </div>
              )}

              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-xs font-bold text-amber-300 bg-amber-950/60 border border-amber-800/40 px-2.5 py-0.5 rounded-md">
                    {promo.badge}
                  </span>
                  {promo.validUntil && (
                    <span className="text-xs text-orange-400 flex items-center gap-1 font-semibold">
                      <Clock className="w-3.5 h-3.5" />
                      до {promo.validUntil}
                    </span>
                  )}
                </div>

                <h3 className="text-lg sm:text-xl font-extrabold text-white font-heading mb-2">
                  {promo.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                  {promo.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div className="text-2xl sm:text-3xl font-extrabold font-heading text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                  {promo.discount}
                </div>

                <button
                  onClick={() => onOpenOrder(`Активация акции: ${promo.title} (${promo.discount})`)}
                  className={`text-xs font-bold py-2 px-4 rounded-xl transition-all cursor-pointer ${
                    promo.highlight
                      ? 'bg-orange-600 hover:bg-orange-500 text-white shadow-md'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white'
                  }`}
                >
                  Участвовать →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Asterisk note from original site */}
        <div className="mt-8 p-4 bg-slate-900/50 rounded-xl border border-slate-800/80 text-xs text-slate-400 text-center">
          * Внимание: скидки не суммируются между собой. Акции могут быть изменены или прекращены при исчерпании складского запаса профиля. Уточняйте подробности у менеджера.
        </div>

      </div>
    </section>
  );
};
