import React from 'react';
import {
  Check,
  ChevronRight,
} from 'lucide-react';
import { SERVICES_LIST } from '../data/siteData';
import { EditableText, EditableImage } from '../editor/Editable';

interface ServicesPageProps {
  onOpenOrder: (title?: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onOpenOrder }) => {
  return (
    <div className="bg-white py-10 sm:py-16">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 2xl:px-10">
        
        {/* Breadcrumb & Header */}
        <div className="mb-10">
          <div className="text-xs font-semibold text-slate-500 mb-2">
            <span>Главная</span> <span className="mx-1">/</span> <span className="text-orange-600">Услуги и сервис</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 font-heading tracking-tight">
            <EditableText id="services.h1.part1">Услуги монтажа и металлообработки</EditableText>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
              <EditableText id="services.h1.part2">«МеталлЦехСтрой»</EditableText>
            </span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-3 max-w-3xl leading-relaxed">
            Полный спектр сопутствующих строительных и монтажных работ. Работаем собственными инструментами и тяжелой спецтехникой, 
            без привлечения субподрядчиков.
          </p>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {SERVICES_LIST.map((srv) => (
            <div
              key={srv.id}
              className="white-card rounded-3xl overflow-hidden flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                  <EditableImage
                    id={`service.${srv.id}.image`}
                    src={srv.image}
                    alt={srv.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                  
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <span className="text-xs text-orange-300 font-bold uppercase block">Стоимость:</span>
                  <span className="text-xl sm:text-2xl font-extrabold font-heading text-white">
                    <EditableText id={`service.${srv.id}.price`}>{srv.price}</EditableText>
                  </span>
                    {srv.unit && <span className="text-xs text-slate-200 ml-1">/{srv.unit}</span>}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <EditableText
                    as="h3"
                    id={`service.${srv.id}.title`}
                    className="text-lg font-bold text-slate-900 font-heading group-hover:text-orange-600 transition-colors block"
                  >
                    {srv.title}
                  </EditableText>
                  <EditableText
                    as="p"
                    id={`service.${srv.id}.desc`}
                    multiline
                    className="text-xs sm:text-sm text-slate-600 leading-relaxed block"
                  >
                    {srv.desc}
                  </EditableText>

                  <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-700">
                    {srv.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => onOpenOrder(`Заказ услуги: ${srv.title} (${srv.price})`)}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                >
                  <span>Заказать услугу</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Guaranteed Standards Banner */}
        <div className="mt-12 bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
              Нужен монтаж на сложном участке или нестандартные работы?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Мы выполняем демонтаж старых заборов, бурение в скальных и пучинистых грунтах, бетонирование сложных уклонов и подключение автоматики.
            </p>
          </div>

          <button
            onClick={() => onOpenOrder('Индивидуальная консультация по нестандартным услугам')}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 px-6 rounded-xl text-sm transition-all cursor-pointer shadow-sm shrink-0 active:scale-95"
          >
            Получить консультацию инженера
          </button>
        </div>

      </div>
    </div>
  );
};
