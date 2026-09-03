import React from 'react';
import {
  Factory,
  ShieldCheck,
  Award,
  Users,
  Snowflake,
  FileCheck2,
  CheckCircle2,
} from 'lucide-react';
import { COMPANY_INFO } from '../data/siteData';
import { EditableText } from '../editor/Editable';

interface WhyUsProps {
  onOpenOrder: (title?: string) => void;
}

export const WhyUs: React.FC<WhyUsProps> = ({ onOpenOrder }) => {
  const advantages = [
    {
      icon: Factory,
      title: 'Собственное производство в Домодедово',
      desc: 'Цех металлообработки, раскроя, гибки и порошковой окраски. Никаких посредников, наценок и переплат.',
      badge: 'Прямые цены',
    },
    {
      icon: Snowflake,
      title: 'Снеговая нагрузка до 250 кг/м²',
      desc: 'Толстостенный профиль по ГОСТу (стойки 80×80 и 100×100 мм с толщиной стенки от 3 до 4 мм). Конструкция не прогнется даже в рекордные снегопады.',
      badge: 'Безопасность',
    },
    {
      icon: FileCheck2,
      title: 'Фиксированная смета по договору',
      desc: 'Озвученная инженером сумма после замера прописывается в официальном договоре и не увеличивается ни на рубль.',
      badge: '100% честно',
    },
    {
      icon: Users,
      title: 'Опытные штатные бригады',
      desc: 'Слаженные бригады из 4–5 человек под руководством опытных бригадиров (бригадир Вячеслав). Монтаж за 1–2 дня с уборкой мусора.',
      badge: 'Без выходных',
    },
    {
      icon: Award,
      title: 'Личный контроль руководства',
      desc: `Генеральный директор ${COMPANY_INFO.director} лично курирует сложные проекты и контролирует культуру монтажа на каждом объекте.`,
      badge: 'Высший стандарт',
    },
    {
      icon: ShieldCheck,
      title: 'Официальная гарантия 2 года',
      desc: 'Несем полную гарантийную ответственность по договору на металлокаркас, сварные соединения, покрытие и кровельный настил.',
      badge: '24 месяца',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-slate-200 relative">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 2xl:px-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 border border-orange-200 text-xs font-bold text-orange-700 mb-3">
            <Factory className="w-3.5 h-3.5" />
            Наше производство и стандарты качества
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-heading tracking-tight">
            <EditableText id="whyus.h1.part1">Почему более 500 заказчиков</EditableText>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
              <EditableText id="whyus.h1.part2">выбирают «МеталлЦехСтрой»</EditableText>
            </span>
          </h2>
          <EditableText
            as="p"
            id="whyus.subtitle"
            multiline
            className="text-slate-600 text-sm sm:text-base mt-2 block"
          >
            Мы не просто варим навесы — мы создаем надежную архитектурную защиту для вашего дома и автомобиля на десятки лет вперед.
          </EditableText>
        </div>

        {/* 6 Core Advantages Cards in White Theme */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {advantages.map((adv, idx) => {
            const Icon = adv.icon;
            return (
              <div
                key={idx}
                className="white-card rounded-3xl p-6 sm:p-7 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 group-hover:scale-110 group-hover:bg-orange-600 group-hover:text-white transition-all shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold text-orange-700 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-full">
                      {adv.badge}
                    </span>
                  </div>

                  <EditableText
                    as="h3"
                    id={`whyus.adv${idx}.title`}
                    className="text-base sm:text-lg font-bold text-slate-900 font-heading mb-2 group-hover:text-orange-600 transition-colors block"
                  >
                    {adv.title}
                  </EditableText>

                  <EditableText
                    as="p"
                    id={`whyus.adv${idx}.desc`}
                    multiline
                    className="text-xs sm:text-sm text-slate-600 leading-relaxed block"
                  >
                    {adv.desc}
                  </EditableText>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-[11px] text-slate-400 font-medium">
                  <span>Стандарт МеталлЦехСтрой</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Factory Showcase & Director Quote Banner in Rich Dark Theme */}
        <div className="mt-12 sm:mt-16 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Ambient warm glow in background */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-950/80 border border-orange-600/40 text-xs font-bold text-orange-400 uppercase tracking-wider">
                <Award className="w-4 h-4 text-amber-400" />
                <EditableText id="whyus.director.badge">Слово генерального директора</EditableText>
              </div>

              <h3 className="text-xl sm:text-3xl font-extrabold text-white font-heading leading-snug">
                <EditableText id="whyus.director.heading">
                  «Для нас главное — чтобы клиент радовался своему навесу и через 10 лет»
                </EditableText>
              </h3>

              <EditableText
                as="p"
                id="whyus.director.quote"
                multiline
                className="text-sm text-slate-300 leading-relaxed italic block"
              >
                «Мы начинали как небольшой сварочный цех более 12 лет назад. Сегодня у нас современное производство в Домодедово и собственный автопарк. Но наш главный принцип остался неизменным: делать как для себя. Мы никогда не экономим на толщине металла, используем только проверенную сталь ГОСТ и даем честную смету сразу, без скрытых надбавок во время монтажа.»
              </EditableText>

              <div className="pt-3 flex items-center gap-4 border-t border-slate-800/80">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-600 flex items-center justify-center font-extrabold text-white text-lg shadow-lg shadow-orange-500/20 shrink-0 ring-2 ring-orange-500/30">
                  ВП
                </div>
                <div>
                  <div className="text-base font-bold text-white font-heading">
                    <EditableText id="whyus.director.name">{COMPANY_INFO.director}</EditableText>
                  </div>
                  <div className="text-xs text-orange-400 font-semibold">
                    <EditableText id="whyus.director.role">Генеральный директор ООО «МеталлЦехСтрой»</EditableText>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 bg-slate-900/90 backdrop-blur-md p-6 rounded-2xl border border-slate-800 space-y-3.5 text-xs text-slate-300 shadow-xl">
              <div className="font-bold text-sm text-white mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <EditableText id="whyus.facility.title">Производственные мощности:</EditableText>
              </div>
              <div className="flex items-center justify-between gap-3 py-1.5 border-b border-slate-800">
                <EditableText as="span" id="whyus.facility.row1.label" className="text-slate-400">
                  Локация производства:
                </EditableText>
                <strong className="text-white font-semibold text-right">
                  <EditableText id="whyus.facility.row1.value">г. Домодедово</EditableText>
                </strong>
              </div>
              <div className="flex items-center justify-between gap-3 py-1.5 border-b border-slate-800">
                <EditableText as="span" id="whyus.facility.row2.label" className="text-slate-400">
                  Производственная площадь:
                </EditableText>
                <strong className="text-white font-semibold text-right">
                  <EditableText id="whyus.facility.row2.value">1 200 м²</EditableText>
                </strong>
              </div>
              <div className="flex items-center justify-between gap-3 py-1.5 border-b border-slate-800">
                <EditableText as="span" id="whyus.facility.row3.label" className="text-slate-400">
                  Объем выпуска в месяц:
                </EditableText>
                <strong className="text-white font-semibold text-right">
                  <EditableText id="whyus.facility.row3.value">до 60 навесов</EditableText>
                </strong>
              </div>
              <div className="flex items-center justify-between gap-3 py-1.5">
                <EditableText as="span" id="whyus.facility.row4.label" className="text-slate-400">
                  Монтажные бригады:
                </EditableText>
                <strong className="text-white font-semibold text-right">
                  <EditableText id="whyus.facility.row4.value">6 штатных звеньев</EditableText>
                </strong>
              </div>

              <button
                onClick={() => onOpenOrder('Запись на экскурсию на производство в Домодедово')}
                className="w-full mt-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-orange-500/20 text-center cursor-pointer active:scale-95"
              >
                <EditableText id="whyus.facility.btn">
                  Посетить наше производство в Домодедово →
                </EditableText>
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
