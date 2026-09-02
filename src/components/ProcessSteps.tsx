import React from 'react';
import {
  PhoneCall,
  Compass,
  FileSpreadsheet,
  FileCheck,
  Wrench,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import { EditableText } from '../editor/Editable';

interface ProcessStepsProps {
  onOpenOrder: (title?: string) => void;
}

export const ProcessSteps: React.FC<ProcessStepsProps> = ({ onOpenOrder }) => {
  const steps = [
    {
      number: '01',
      icon: PhoneCall,
      title: 'Заявка или звонок',
      desc: 'Оставьте заявку на сайте или позвоните. За 10 минут сделаем предварительный расчёт стоимости вашего навеса.',
      timing: '10 минут',
    },
    {
      number: '02',
      icon: Compass,
      title: 'Выезд замерщика (3 000 ₽)',
      desc: 'Опытный инженер приедет на ваш участок с лазерным дальномером, образцами металла, поликарбоната и каталогом цветов RAL. Замер стоит 3 000 ₽ — при заключении договора сумма вычитается из стоимости заказа.',
      timing: '3 000 ₽ — вычитается из заказа',
    },
    {
      number: '03',
      icon: FileCheck,
      title: 'Согласование договора',
      desc: 'Заключаем официальный договор с фиксированной ценой, которая не вырастет в процессе. Сразу передаем задачу в цех.',
      timing: 'Фиксированная цена',
    },
    {
      number: '04',
      icon: FileSpreadsheet,
      title: 'Индивидуальный проект',
      desc: 'Подготовим до 3-х вариантов проекта с учетом привязки к дому или забору и расчетом ветровых и снеговых нагрузок.',
      timing: 'Бесплатно в подарок',
    },
    {
      number: '05',
      icon: Wrench,
      title: 'Производство и монтаж',
      desc: 'Изготавливаем конструкцию на производстве в Домодедово за 14 дней. Приезжаем на участок и монтируем за 1–2 дня без мусора.',
      timing: 'Монтаж за 1–2 дня',
    },
    {
      number: '06',
      icon: CheckCircle,
      title: 'Приемка и гарантия 2 года',
      desc: 'Вы принимаете работу, подписываете акт выполненных работ, получаете гарантийный талон на 24 месяца и производите расчет.',
      timing: 'Гарантия 24 мес.',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-slate-200 relative">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 2xl:px-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-200 text-xs font-bold text-amber-800 mb-3">
            <EditableText id="steps.badge">Простые шаги установки</EditableText>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-heading tracking-tight">
            <EditableText id="steps.h1.part1">Как мы работаем:</EditableText>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
              <EditableText id="steps.h1.part2">от звонка до готового изделия</EditableText>
            </span>
          </h2>
          <EditableText as="p" id="steps.subtitle" multiline className="text-slate-600 text-sm sm:text-base mt-2 block">
            Прозрачный и отлаженный за 12 лет процесс. Вы всегда контролируете каждый этап своего заказа.
          </EditableText>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="white-card rounded-3xl p-6 sm:p-7 relative group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-3xl font-black text-slate-200 group-hover:text-orange-200 font-heading transition-colors">
                      {step.number}
                    </span>
                  </div>

                  <EditableText
                    as="h3"
                    id={`steps.${idx}.title`}
                    className="text-base sm:text-lg font-bold text-slate-900 font-heading mb-2 block"
                  >
                    {step.title}
                  </EditableText>

                  <EditableText
                    as="p"
                    id={`steps.${idx}.desc`}
                    multiline
                    className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 block"
                  >
                    {step.desc}
                  </EditableText>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                  <EditableText id={`steps.${idx}.timing`} className="text-orange-600">
                    {step.timing}
                  </EditableText>
                  <span className="text-slate-400">Шаг {idx + 1} из 6</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Bar */}
        <div className="mt-12 text-center">
          <button
            onClick={() => onOpenOrder('Заявка на 1-й шаг: выезд замерщика и расчет')}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold py-3.5 px-8 rounded-xl text-sm shadow-md shadow-orange-500/25 transition-all cursor-pointer active:scale-95 group"
          >
            <EditableText id="steps.cta">Вызвать замерщика (3 000 ₽ — вычитается из заказа)</EditableText>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
};
