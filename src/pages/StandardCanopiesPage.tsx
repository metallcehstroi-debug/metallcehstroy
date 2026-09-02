import React, { useState } from 'react';
import {
  Check,
  ChevronRight,
  Info,
  Maximize2,
  X,
  Search,
  ArrowRight,
} from 'lucide-react';
import { STANDARD_CANOPIES, STANDARD_GROUPS, StandardCanopy } from '../data/standardCanopies';
import { EditableText, EditableImage } from '../editor/Editable';
import { useAppliedFilter } from '../editor/navFilter';
import { useEditor } from '../editor/EditorContext';

interface StandardCanopiesPageProps {
  onOpenOrder: (title?: string) => void;
}

export const StandardCanopiesPage: React.FC<StandardCanopiesPageProps> = ({ onOpenOrder }) => {
  const { getText } = useEditor();
  const [activeGroup, setActiveGroup] = useState<string>('Арочные');
  const [search, setSearch] = useState('');
  const [modalItem, setModalItem] = useState<StandardCanopy | null>(null);

  // Фильтр из выпадающего меню шапки
  useAppliedFilter('standard', (f) => {
    if (f === 'all') setActiveGroup('Арочные');
    else setActiveGroup(f);
  });

  const filtered = STANDARD_CANOPIES.filter((item) => {
    const matchGroup = item.group === activeGroup;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      String(item.price).includes(q) ||
      `${item.width}${item.length}`.includes(q);
    return matchGroup && matchSearch;
  });

  return (
    <div className="bg-white py-10 sm:py-16">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 2xl:px-10">
        {/* Заголовок */}
        <div className="mb-8">
          <div className="text-xs font-semibold text-slate-500 mb-2">
            <span>Главная</span> <span className="mx-1">/</span>{' '}
            <span className="text-orange-600">Стандартные навесы</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 font-heading tracking-tight">
            <EditableText id="standard.h1.part1">Стандартные навесы</EditableText>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
              <EditableText id="standard.h1.part2">с готовыми ценами</EditableText>
            </span>
          </h1>
          <EditableText
            as="p"
            id="standard.subtitle"
            multiline
            className="text-slate-600 text-sm sm:text-base mt-3 max-w-3xl leading-relaxed block"
          >
            Типовые размеры навесов, которые изготавливаются на кондукторах нашего производства в
            Домодедово. Высота всех стандартных моделей — 2200 мм. Цены указаны за полный комплект с
            каркасом, крепежом и кровельным покрытием.
          </EditableText>
        </div>

        {/* Обложка */}
        <div className="relative rounded-3xl overflow-hidden mb-8 shadow-md aspect-21/9 bg-slate-900">
          <EditableImage
            id="standard.cover"
            src="https://xn--80ajbqiadvrjgf1bm.xn--p1ai/wp-content/uploads/freshizer/a23e143ec2614a7aed3b3cd0618949ce_Fotoram.io_-2300-800-c-90.png"
            alt="Стандартные навесы"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/40 to-transparent flex items-center p-6 sm:p-12">
            <div className="max-w-xl text-white space-y-3">
              <span className="inline-block bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Производственный стандарт ГОСТ
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold font-heading">
                Типовые навесы от 112 800 ₽
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 hidden sm:block">
                Изготовление 3–5 дней · Монтаж 1–2 дня · Гарантия 2 года
              </p>
              <button
                onClick={() => onOpenOrder('Подбор стандартного навеса')}
                className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold py-2.5 px-5 rounded-xl text-xs sm:text-sm transition-all cursor-pointer shadow-md"
              >
                Помочь с выбором (0 ₽)
              </button>
            </div>
          </div>
        </div>

        {/* Фильтр по группам + поиск */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {STANDARD_GROUPS.map((group) => (
              <button
                key={group}
                onClick={() => setActiveGroup(group)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeGroup === group
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {group}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по модели или цене"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-orange-500"
            />
          </div>
        </div>

        {/* Карточки стандартных навесов */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {filtered.map((item) => {
            const price = getText(`standard.${item.id}.price`, item.price.toLocaleString('ru-RU') + ' ₽');
            return (
              <div
                key={item.id}
                className="white-card rounded-2xl overflow-hidden flex flex-col justify-between group"
              >
                <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
                  <EditableImage
                    id={`standard.${item.id}.image`}
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

                  <span className="absolute top-2 left-2 bg-white/95 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                    {item.width} × {item.length} мм
                  </span>

                  <button
                    onClick={() => setModalItem(item)}
                    aria-label="Подробнее"
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/40 hover:bg-orange-600 text-white transition-colors cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="absolute bottom-2.5 left-3 right-3 text-white">
                    <span className="text-[10px] text-orange-300 font-bold uppercase tracking-wider block">
                      Цена комплекта:
                    </span>
                    <span className="text-xl font-extrabold font-heading text-white">{price}</span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <EditableText
                      as="h3"
                      id={`standard.${item.id}.title`}
                      className="text-sm sm:text-base font-bold text-slate-900 font-heading group-hover:text-orange-600 transition-colors block"
                    >
                      {item.title}
                    </EditableText>
                    <div className="mt-2 space-y-1 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>Высота: {item.height} мм</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>Площадь: {((item.width / 1000) * (item.length / 1000)).toFixed(1)} м²</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>Снеговая нагрузка до 250 кг/м²</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setModalItem(item)}
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2 px-2 rounded-xl text-[11px] transition-colors cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Info className="w-3 h-3" /> Подробнее
                    </button>
                    <button
                      onClick={() => onOpenOrder(`Стандартный навес: ${item.title} (${price})`)}
                      className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-2 rounded-xl text-[11px] transition-all cursor-pointer flex items-center justify-center gap-1 active:scale-95"
                    >
                      Заказать <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-3xl p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">
              Нужен навес нестандартного размера?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
              Изготовим по вашим размерам. Инженер бесплатно приедет с образцами, сделает замер и
              подготовит проект.
            </p>
          </div>
          <button
            onClick={() => onOpenOrder('Индивидуальный навес по моим размерам')}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 px-6 rounded-xl text-sm transition-all cursor-pointer whitespace-nowrap inline-flex items-center gap-2"
          >
            Вызвать инженера <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Модальное окно модели */}
      {modalItem && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in"
          onClick={() => setModalItem(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl relative my-6 animate-in zoom-in-95 border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalItem(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative aspect-video bg-slate-900">
              <img src={modalItem.image} alt={modalItem.title} className="w-full h-full object-cover" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-xs text-orange-300 font-bold uppercase">Цена комплекта:</span>
                <div className="text-2xl font-extrabold font-heading">
                  {modalItem.price.toLocaleString('ru-RU')} ₽
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <h3 className="text-xl font-extrabold text-slate-900 font-heading">{modalItem.title}</h3>

              <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
                <div>
                  <div className="text-[11px] text-slate-500">Ширина</div>
                  <div className="font-bold text-slate-900">{modalItem.width} мм</div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500">Длина</div>
                  <div className="font-bold text-slate-900">{modalItem.length} мм</div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500">Высота</div>
                  <div className="font-bold text-slate-900">{modalItem.height} мм</div>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Каркас из профильной трубы ГОСТ с толщиной стенки 3 мм</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Поликарбонат 10 мм с UV-защитой или металлочерепица</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Антикоррозийная обработка и покраска</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Гарантия 2 года по договору</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => {
                    const itm = modalItem;
                    setModalItem(null);
                    onOpenOrder(`Стандартный навес: ${itm.title} (${itm.price.toLocaleString('ru-RU')} ₽)`);
                  }}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 px-4 rounded-xl text-sm shadow-md transition-all cursor-pointer text-center"
                >
                  Заказать со скидкой 2%
                </button>
                <button
                  onClick={() => setModalItem(null)}
                  className="px-6 py-3.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-sm font-semibold transition-colors cursor-pointer"
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
