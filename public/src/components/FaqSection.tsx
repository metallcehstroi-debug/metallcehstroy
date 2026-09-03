import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { FAQS } from '../data/siteData';
import { MaxIcon, MAX_URL } from './MaxIcon';
import { EditableText } from '../editor/Editable';

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="py-16 sm:py-24 bg-white border-b border-slate-200 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 2xl:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 border border-orange-200 text-xs font-bold text-orange-700 mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            Часто задаваемые вопросы
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-heading tracking-tight">
            Ответы на популярные{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
              вопросы заказчиков
            </span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Всё, что вам важно знать перед заказом навеса, забора или ангара.
          </p>
        </div>

        {/* Accordion list */}
        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="white-card rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 cursor-pointer hover:text-orange-600 transition-colors"
                >
                  <span className="font-bold text-sm sm:text-base text-slate-900 font-heading">
                    <EditableText id={`faq.${idx}.q`}>{faq.q}</EditableText>
                  </span>
                  <div className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-orange-600 bg-orange-50' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 animate-in fade-in">
                    <EditableText id={`faq.${idx}.a`} multiline>
                      {faq.a}
                    </EditableText>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Question block */}
        <div className="mt-10 bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-slate-900 text-base">Остались вопросы по вашему участку?</h4>
            <p className="text-xs text-slate-500 mt-1">
              Напишите нашему менеджеру в мессенджер MAX — ответим за 5 минут.
            </p>
          </div>
          <a
            href={MAX_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#5A5CE8] hover:bg-[#4A4BD8] text-white font-bold py-2.5 px-5 rounded-xl text-xs transition-colors shrink-0 shadow-sm shadow-[#5A5CE8]/25"
          >
            <MaxIcon className="w-4 h-4" />
            Задать вопрос в MAX
          </a>
        </div>

      </div>
    </section>
  );
};
