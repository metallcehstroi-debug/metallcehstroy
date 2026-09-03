import React from 'react';
import { Car, Check, ChevronRight, ArrowRight, Ruler, ShieldCheck, Clock, Camera } from 'lucide-react';
import { STANDARD_CANOPIES } from '../data/standardCanopies';
import { EditableText, EditableImage } from '../editor/Editable';
import { PageId } from './Header';
import { requestFilter } from '../editor/navFilter';

interface CanopyTypesSectionProps {
  onNavigate: (page: PageId) => void;
  onOpenOrder: (title?: string) => void;
}

const P = 'https://xn--80ajbqiadvrjgf1bm.xn--p1ai/wp-content/uploads/freshizer';

/** Типы навесов на главной: арочные, полуарочные, односкатные, двухскатные, консольные, с фризом.
 *  photo — реальная фотография сданного объекта с участков заказчиков. */
const TYPES: {
  id: string;
  group: string;
  title: string;
  desc: string;
  badge?: string;
  photo: string;
  oldSitePrice: number;
}[] = [
  {
    id: 'arch',
    group: 'Арочные',
    title: 'Арочные навесы',
    desc: 'Классическая полукруглая форма. Снег и вода сходят сами, конструкция выдерживает высокие нагрузки.',
    badge: 'Хит продаж',
    photo: `${P}/2296076d27b2cfba8a1c9d4fb5d32c68_f51777c2-0a13-48c9-9154-8f82a0a7071d-270-270-c-100.jpg`,
    oldSitePrice: 4750,
  },
  {
    id: 'semiarch',
    group: 'Полуарочные',
    title: 'Полуарочные навесы',
    desc: 'Идеальны как пристройка к дому, гаражу или забору. Вода отводится строго в одну сторону.',
    photo: `${P}/b3088754ec64ee86f3fb0c3f95c0e68d_IMG_20260826_135928-270-270-c-100.jpg`,
    oldSitePrice: 4550,
  },
  {
    id: 'mono',
    group: 'Односкатные',
    title: 'Односкатные навесы',
    desc: 'Лаконичная форма с направленным уклоном. Самое практичное и экономичное решение.',
    photo: `${P}/27e01f6bf409d281211e01203e9a5a88_5258ae28-c334-4972-aeb4-931a28e240f1-270-270-c-100.jpg`,
    oldSitePrice: 4150,
  },
  {
    id: 'gable',
    group: 'Двухскатные',
    title: 'Двухскатные навесы',
    desc: 'Классическая крыша «домиком» в едином стиле с кровлей вашего дома.',
    badge: 'Популярно',
    photo: `${P}/a1c9826cff892c85e40d72133765a4c5_9788dc33-1459-4729-8e95-67ddfb52ddb7-270-270-c-100.jpg`,
    oldSitePrice: 4350,
  },
  {
    id: 'cant',
    group: 'Консольные',
    title: 'Консольные навесы',
    desc: 'Опоры только с одной стороны — свободный заезд и открытие дверей без препятствий.',
    badge: 'Свободный заезд',
    photo: `${P}/64e8a0a87d69a25d10fabfadb94265ce_4754c9f0-f3af-4635-b203-04544abf4de6-270-270-c-100.jpg`,
    oldSitePrice: 5150,
  },
  {
    id: 'frieze',
    group: 'С фризом',
    title: 'Навесы с фризом',
    desc: 'Современный стиль High-Tech: декоративный фриз скрывает фермы и уклон кровли.',
    badge: 'High-Tech',
    photo: `${P}/da0a285b551846fb894568fdfd32c121_8fccc93b-7830-49da-a7c1-620d7104fcb0-270-270-c-100.jpg`,
    oldSitePrice: 9500,
  },
];

export const CanopyTypesSection: React.FC<CanopyTypesSectionProps> = ({
  onNavigate,
  onOpenOrder,
}) => {
  const goToGroup = (group: string) => {
    requestFilter('standard', group);
    onNavigate('standard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 2xl:px-10">
        {/* Заголовок */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 border border-orange-200 text-xs font-bold text-orange-800 mb-3">
              <Car className="w-3.5 h-3.5" />
              <EditableText id="home.canopytypes.badge">Все виды навесов на ваш выбор</EditableText>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950 font-heading tracking-tight">
              <EditableText id="home.canopytypes.title">Навесы для авто, дома и дачи</EditableText>
            </h2>
            <EditableText
              as="p"
              id="home.canopytypes.subtitle"
              multiline
              className="text-slate-600 text-sm sm:text-base mt-2 max-w-3xl block"
            >
              Арочные, полуарочные, односкатные, двухскатные, консольные и навесы с фризом.
              Изготовление на собственном производстве в Домодедово из толстостенной стали ГОСТ с
              гарантией 2 года.
            </EditableText>
          </div>

          <button
            onClick={() => onNavigate('standard')}
            className="inline-flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors cursor-pointer shrink-0"
          >
            <span>Все навесы с ценами</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Сетка типов */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {TYPES.map((type) => {
            const models = STANDARD_CANOPIES.filter((c) => c.group === type.group);
            return (
              <div
                key={type.id}
                className="white-card rounded-3xl overflow-hidden flex flex-col justify-between group"
              >
                {/* Фото */}
                <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                  <EditableImage
                    id={`home.canopytype.${type.id}.image`}
                    src={type.photo}
                    alt={type.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/15 to-slate-950/10 pointer-events-none" />

                  {/* Бейдж «реальное фото» */}
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-1 rounded-lg shadow-md backdrop-blur-xs">
                      <Camera className="w-3 h-3" /> Реальное фото
                    </span>
                  </div>

                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {type.badge && (
                      <span className="bg-orange-600 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-lg shadow-sm">
                        <EditableText id={`home.canopytype.${type.id}.badge`}>{type.badge}</EditableText>
                      </span>
                    )}
                    <span className="bg-white/95 text-slate-800 text-[11px] font-bold px-2 py-0.5 rounded-lg shadow-xs">
                      {models.length} моделей
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <span className="text-[10px] text-orange-300 font-bold uppercase tracking-wider block">
                      Цена со старого сайта:
                    </span>
                    <span className="text-2xl font-extrabold font-heading text-white">
                      <EditableText id={`home.canopytype.${type.id}.price`}>
                        {`${type.oldSitePrice.toLocaleString('ru-RU')} ₽/м²`}
                      </EditableText>
                    </span>
                  </div>
                </div>

                {/* Тело */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <EditableText
                      as="h3"
                      id={`home.canopytype.${type.id}.title`}
                      className="text-base sm:text-lg font-bold text-slate-950 font-heading group-hover:text-orange-600 transition-colors block"
                    >
                      {type.title}
                    </EditableText>
                    <EditableText
                      as="p"
                      id={`home.canopytype.${type.id}.desc`}
                      multiline
                      className="text-xs text-slate-600 mt-2 leading-relaxed block"
                    >
                      {type.desc}
                    </EditableText>

                    <div className="mt-3.5 space-y-1.5 pt-3 border-t border-slate-100 text-xs text-slate-700">
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Снеговая нагрузка до 250 кг/м²</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Поликарбонат, металлочерепица или профнастил</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Монтаж за 1–2 дня, гарантия 2 года</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => goToGroup(type.group)}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 px-3 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Ruler className="w-3.5 h-3.5" />
                      <span>Размеры и цены</span>
                    </button>
                    <button
                      onClick={() => onOpenOrder(`Заявка на навес: ${type.title}`)}
                      className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1 active:scale-95"
                    >
                      <span>Заказать</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Инфо-плашка */}
        <div className="mt-10 bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 flex-1 text-xs text-slate-600">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 shrink-0 font-bold text-xs">
                <EditableText id="canopytypes.strip1.value">14</EditableText>
              </div>
              <div>
                <EditableText as="strong" id="canopytypes.strip1.title" className="text-slate-900 block font-semibold text-sm">
                  дней на изготовление
                </EditableText>
                <EditableText as="span" id="canopytypes.strip1.desc">
                  Собственное производство в Домодедово
                </EditableText>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <EditableText as="strong" id="canopytypes.strip2.title" className="text-slate-900 block font-semibold text-sm">
                  Сталь ГОСТ 3–6 мм
                </EditableText>
                <EditableText as="span" id="canopytypes.strip2.desc">
                  Двойной контроль сварных швов
                </EditableText>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <EditableText as="strong" id="canopytypes.strip3.title" className="text-slate-900 block font-semibold text-sm">
                  Монтаж за 1–2 дня
                </EditableText>
                <EditableText as="span" id="canopytypes.strip3.desc">
                  Бригада 4–5 опытных мастеров
                </EditableText>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('canopies')}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer shrink-0"
          >
            <span>Фото выполненных навесов</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
