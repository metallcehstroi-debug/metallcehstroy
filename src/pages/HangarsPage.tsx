import React, { useState } from 'react';
import {
  CheckCircle2,
  FileCheck2,
  Calendar,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { EditableText, EditableImage } from '../editor/Editable';
import { useAppliedFilter } from '../editor/navFilter';

interface HangarsPageProps {
  onOpenOrder: (title?: string) => void;
}

export const HangarsPage: React.FC<HangarsPageProps> = ({ onOpenOrder }) => {
  const [highlight, setHighlight] = useState<string | null>(null);

  // Выбор типа ангара из выпадающего меню шапки
  useAppliedFilter('hangars', (f) => {
    if (f === 'cold' || f === 'warm') {
      setHighlight(f);
      setTimeout(() => {
        document.getElementById(`hangar-${f}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 200);
    } else {
      setHighlight(null);
    }
  });

  const hangars = [
    {
      id: 'cold',
      title: 'Холодный ангар для хранения и логистики',
      price: 'от 7 500 ₽/м²',
      desc: 'Быстровозводимое арочное или прямостенное сооружение для сельскохозяйственных нужд, хранения спецтехники, оборудования, стройматериалов и оптовой торговли.',
      features: [
        'Возведение на любом типе почвы',
        'Пролеты без внутренних опор от 12 до 24 метров',
        'Высота в коньке от 4.5 до 9.0 метров',
        'Обшивка прочным профлистом С21 / НС35',
        'Срок проектирования и монтажа от 10 дней',
      ],
      image: 'https://xn--80ajbqiadvrjgf1bm.xn--p1ai/wp-content/uploads/freshizer/2b42d4bc74d97011fdf52d92312cf52f_820ba8d5-44e0-4829-a741-2aaf07bf825f-2300-800-c-90.png',
      badge: 'Экономичный',
    },
    {
      id: 'warm',
      title: 'Утепленный ангар из сэндвич-панелей',
      price: 'от 12 500 ₽/м²',
      desc: 'Теплое энергоэффективное здание для круглогодичного производства, автосервиса, автомойки, логистического комплекса или теплого склада товаров.',
      features: [
        'Сэндвич-панели с базальтовой ватой или PIR 100–150 мм',
        'Минимальные теплопотери и низкие затраты на отопление',
        'Установка промышленных ворот, окон и дверей',
        'Полный пакет проектной документации КМ / КМД',
        'Срок службы более 40 лет',
      ],
      image: 'https://xn--80ajbqiadvrjgf1bm.xn--p1ai/wp-content/uploads/freshizer/3473fb3522aa9daaa560994a580343fa_WhatsApp-Image-2025-03-17-at-16.27.53-780-780-c-90.webp',
      badge: 'Круглый год',
    },
  ];

  return (
    <div className="bg-white py-10 sm:py-16">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 2xl:px-10">
        
        {/* Breadcrumb */}
        <div className="mb-8">
          <div className="text-xs font-semibold text-slate-500 mb-2">
            <span>Главная</span> <span className="mx-1">/</span> <span className="text-orange-600">Ангары и Склады</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 font-heading tracking-tight">
            <EditableText id="hangars.h1.part1">Строительство ангаров и складов</EditableText>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
              <EditableText id="hangars.h1.part2">под ключ в Москве и МО</EditableText>
            </span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-3 max-w-3xl leading-relaxed">
            Проектирование, собственное изготовление и быстрый монтаж легких металлических конструкций (ЛМК). 
            Строим склады, зернохранилища, боксы для техники и производственные цеха по выгодной цене от <strong>7 500 ₽/м²</strong>.
          </p>
        </div>

        {/* Cover Banner */}
        <div className="relative rounded-3xl overflow-hidden mb-12 shadow-md aspect-21/9 bg-slate-900">
          <img
            src="https://xn--80ajbqiadvrjgf1bm.xn--p1ai/wp-content/uploads/freshizer/2b42d4bc74d97011fdf52d92312cf52f_820ba8d5-44e0-4829-a741-2aaf07bf825f-2300-800-c-90.png"
            alt="Ангары и склады МеталлЦехСтрой"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-transparent flex items-center p-6 sm:p-12">
            <div className="max-w-xl text-white space-y-3">
              <span className="inline-block bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Быстровозводимые здания ЛМК
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-heading">
                Ангары и склады под ключ от 7 500 ₽/м²
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 hidden sm:block">
                Бесплатный расчет сметы по вашему ТЗ и выезд главного инженера на площадку застройки.
              </p>
              <button
                onClick={() => onOpenOrder('Заказ расчета ангара/склада')}
                className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold py-2.5 px-5 rounded-xl text-xs sm:text-sm transition-all cursor-pointer shadow-md"
              >
                Рассчитать смету ангара (0 ₽)
              </button>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {hangars.map((h, i) => (
            <div
              key={i}
              id={`hangar-${h.id}`}
              className={`white-card rounded-3xl overflow-hidden flex flex-col justify-between group transition-all duration-500 ${
                highlight === h.id ? 'ring-2 ring-orange-500 shadow-xl shadow-orange-500/20 -translate-y-1' : ''
              }`}
            >
              <div>
                <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
                  <EditableImage
                    id={`hangar.${h.id}.image`}
                    src={h.image}
                    alt={h.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-lg shadow-sm">
                    {h.badge}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent p-3 rounded-xl text-white">
                    <span className="text-xs text-orange-300 font-semibold block">Стоимость:</span>
                    <span className="text-2xl font-extrabold font-heading text-white">
                      <EditableText id={`hangar.${h.id}.price`}>{h.price}</EditableText>
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-8 space-y-4">
                  <EditableText as="h3" id={`hangar.${h.id}.title`} className="text-xl sm:text-2xl font-bold text-slate-900 font-heading block">
                    {h.title}
                  </EditableText>
                  <EditableText as="p" id={`hangar.${h.id}.desc`} multiline className="text-sm text-slate-600 leading-relaxed block">
                    {h.desc}
                  </EditableText>

                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs sm:text-sm text-slate-700">
                    {h.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 pt-0">
                <button
                  onClick={() => onOpenOrder(`Заявка на расчет ангара: ${h.title}`)}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 px-6 rounded-xl text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <span>Заказать бесплатный расчет сметы</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits Strip */}
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="text-base font-bold text-slate-900">В 3 раза быстрее</div>
              <div className="text-xs text-slate-500">Быстровозводимый монтаж без сырых строительных процессов</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-base font-bold text-slate-900">Проект КМ / КМД</div>
              <div className="text-xs text-slate-500">Полный комплект чертежей и проектной документации</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-base font-bold text-slate-900">Гарантия 2 года</div>
              <div className="text-xs text-slate-500">Официальные гарантийные обязательства производства в договоре</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
