import React from 'react';
import {
  Warehouse,
  CheckCircle2,
  Maximize2,
  FileCheck2,
  Calendar,
  ArrowRight,
} from 'lucide-react';

interface HangarsSectionProps {
  onOpenOrder: (title?: string) => void;
}

export const HangarsSection: React.FC<HangarsSectionProps> = ({ onOpenOrder }) => {
  const hangarTypes = [
    {
      title: 'Холодный ангар для хранения',
      price: 'от 7 500 ₽/м²',
      desc: 'Для спецтехники, стройматериалов, зерна и логистических складов. Арочный или прямостенный каркас с обшивкой оцинкованным профнастилом.',
      features: [
        'Возведение на любом грунте',
        'Пролет без внутренних опор до 24 м',
        'Высота в коньке от 4 до 9 метров',
        'Срок строительства: от 10 дней',
      ],
      image: 'https://xn--80ajbqiadvrjgf1bm.xn--p1ai/wp-content/uploads/freshizer/2b42d4bc74d97011fdf52d92312cf52f_820ba8d5-44e0-4829-a741-2aaf07bf825f-2300-800-c-90.png',
      badge: 'Популярный',
    },
    {
      title: 'Утепленный ангар из сэндвич-панелей',
      price: 'от 12 500 ₽/м²',
      desc: 'Полноценное теплое помещение для круглогодичного автосервиса, цеха, магазина или склада продукции с температурным режимом.',
      features: [
        'Сэндвич-панели 100–150 мм (минвата/PIR)',
        'Окна, промышленные подъемные ворота',
        'Низкие затраты на отопление',
        'Срок службы более 40 лет',
      ],
      image: 'https://xn--80ajbqiadvrjgf1bm.xn--p1ai/wp-content/uploads/freshizer/3473fb3522aa9daaa560994a580343fa_WhatsApp-Image-2025-03-17-at-16.27.53-780-780-c-90.webp',
      badge: 'Круглый год',
    },
  ];

  return (
    <section id="hangars" className="py-16 sm:py-24 bg-slate-900/60 border-b border-slate-800 relative">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 2xl:px-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-950/60 border border-orange-600/30 text-xs font-bold text-orange-400 mb-3">
            <Warehouse className="w-3.5 h-3.5" />
            Быстровозводимые ангары и склады
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-heading tracking-tight">
            Строительство складов и ангаров{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
              под ключ от 7 500 ₽/м²
            </span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            Собственное изготовление легких металлоконструкций (ЛМК/ЛСТК). Разработка рабочей документации, фундамент, монтаж и обшивка.
          </p>
        </div>

        {/* 2 Big Hangar Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {hangarTypes.map((h, i) => (
            <div
              key={i}
              className="bg-slate-950 border border-slate-800 hover:border-orange-500/50 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between group transition-all duration-300"
            >
              <div>
                <div className="relative aspect-16/9 bg-slate-900 overflow-hidden">
                  <img
                    src={h.image}
                    alt={h.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />
                  
                  <div className="absolute top-4 left-4 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-lg shadow-md">
                    {h.badge}
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 flex items-baseline justify-between text-white">
                    <div>
                      <span className="text-xs text-orange-300 font-semibold block">Стоимость возведения:</span>
                      <span className="text-2xl font-extrabold font-heading text-white">{h.price}</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 sm:p-8 space-y-4">
                  <h3 className="text-xl font-bold text-white font-heading group-hover:text-orange-400 transition-colors">
                    {h.title}
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {h.desc}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-slate-900 text-xs sm:text-sm text-slate-300">
                    {h.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 pt-0">
                <button
                  onClick={() => onOpenOrder(`Заявка на расчет ангара: ${h.title}`)}
                  className="w-full bg-slate-800 hover:bg-orange-600 text-white font-bold py-3.5 px-6 rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Рассчитать смету ангара под ключ</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Hangar Advantages strip */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-950/80 border border-orange-700/40 flex items-center justify-center text-orange-400 shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">В 3 раза быстрее</div>
              <div className="text-xs text-slate-400">Быстровозводимый монтаж без мокрых процессов</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-700/40 flex items-center justify-center text-amber-400 shrink-0">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Проект КМ / КМД</div>
              <div className="text-xs text-slate-400">Полный пакет рабочей документации для регистрации</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-700/40 flex items-center justify-center text-emerald-400 shrink-0">
              <Maximize2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Любые размеры</div>
              <div className="text-xs text-slate-400">Прямостенные, арочные, шатровые и двухскатные</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
