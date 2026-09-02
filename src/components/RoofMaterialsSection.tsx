import React from 'react';
import { Layers, ShieldCheck, Sun, Umbrella, VolumeX } from 'lucide-react';
import { ROOF_MATERIALS } from '../data/siteData';
import { EditableText, EditableImage } from '../editor/Editable';

interface RoofMaterialsProps {
  onOpenOrder: (title?: string) => void;
}

export const RoofMaterialsSection: React.FC<RoofMaterialsProps> = ({ onOpenOrder }) => {
  return (
    <section id="materials" className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200 relative">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 2xl:px-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 border border-orange-200 text-xs font-bold text-orange-700 mb-3">
            <Layers className="w-3.5 h-3.5" />
            <EditableText id="roof.badge">Выбор кровельного покрытия</EditableText>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-heading tracking-tight">
            <EditableText id="roof.h1.part1">Материалы</EditableText>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
              <EditableText id="roof.h1.part2">кровли навеса</EditableText>
            </span>
          </h2>
          <EditableText as="p" id="roof.subtitle" multiline className="text-slate-600 text-sm sm:text-base mt-2 block">
            Используем только первичные сертифицированные полимеры и сталь с оцинкованием от 140 г/м². Подберем оптимальный вариант под архитектурный стиль вашего дома и бюджет.
          </EditableText>
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {ROOF_MATERIALS.map((mat) => (
            <div
              key={mat.id}
              className="white-card rounded-3xl overflow-hidden flex flex-col justify-between group"
            >
              {/* Material Image */}
              <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
                <EditableImage
                  id={`roof.${mat.id}.image`}
                  src={mat.image}
                  alt={mat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs text-orange-700 text-xs font-bold px-2.5 py-1 rounded-lg shadow-xs">
                  <EditableText id={`roof.${mat.id}.price`}>{mat.priceAdd}</EditableText>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[11px] font-semibold text-orange-300 block">
                    Толщина: <EditableText id={`roof.${mat.id}.thickness`}>{mat.thickness}</EditableText>
                  </span>
                  <h3 className="text-base sm:text-lg font-bold font-heading">
                    <EditableText id={`roof.${mat.id}.name`}>{mat.name}</EditableText>
                  </h3>
                </div>
              </div>

              {/* Material Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <EditableText as="p" id={`roof.${mat.id}.features`} multiline className="text-xs sm:text-sm text-slate-600 leading-relaxed block">
                  {mat.features}
                </EditableText>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>UV-защита 100%</span>
                  </div>

                  <button
                    onClick={() => onOpenOrder(`Консультация по кровле: ${mat.name}`)}
                    className="text-xs font-bold text-orange-600 hover:text-orange-700 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Выбрать</span>
                    <span>→</span>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Advice Banner */}
        <div className="mt-12 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl shrink-0">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <EditableText as="h4" id="roof.tip1.title" className="text-sm font-bold text-slate-900 mb-1 block">
                Для парковки авто
              </EditableText>
              <EditableText as="p" id="roof.tip1.desc" multiline className="text-xs text-slate-600 leading-relaxed block">
                Рекомендуем бронзовый или янтарный поликарбонат, либо металлочерепицу. Они защищают салон от перегрева.
              </EditableText>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl shrink-0">
              <VolumeX className="w-5 h-5" />
            </div>
            <div>
              <EditableText as="h4" id="roof.tip2.title" className="text-sm font-bold text-slate-900 mb-1 block">
                Для террасы и окон дома
              </EditableText>
              <EditableText as="p" id="roof.tip2.desc" multiline className="text-xs text-slate-600 leading-relaxed block">
                Мягкая черепица или толстый монолитный поликарбонат поглощают шум падающих капель дождя на 100%.
              </EditableText>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl shrink-0">
              <Umbrella className="w-5 h-5" />
            </div>
            <div>
              <EditableText as="h4" id="roof.tip3.title" className="text-sm font-bold text-slate-900 mb-1 block">
                Защита от града
              </EditableText>
              <EditableText as="p" id="roof.tip3.desc" multiline className="text-xs text-slate-600 leading-relaxed block">
                Монолитный поликарбонат толщиной 6–8 мм невозможно разбить даже ударом кувалды или упавшей веткой.
              </EditableText>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
