import React, { useState, useEffect } from 'react';
import { Phone, ArrowUp, Calculator } from 'lucide-react';
import { MaxIcon, MAX_URL } from './MaxIcon';
import { PageId } from './Header';

interface FloatingActionsProps {
  onOpenOrder: (title?: string) => void;
  onNavigate: (page: PageId) => void;
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({ onOpenOrder, onNavigate }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 350);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed bottom-5 right-4 sm:right-5 z-40 flex flex-col items-end gap-2.5">
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Наверх"
          className="w-11 h-11 rounded-full bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-300 shadow-lg flex items-center justify-center transition-all cursor-pointer active:scale-90 hover:-translate-y-0.5"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Quick calculator */}
      <button
        onClick={() => {
          onNavigate('calculator');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        aria-label="Калькулятор стоимости"
        className="group hidden sm:inline-flex items-center gap-2 bg-white hover:bg-orange-50 text-slate-800 hover:text-orange-700 border border-slate-200 hover:border-orange-300 text-xs font-bold py-2.5 px-3.5 rounded-full shadow-lg transition-all cursor-pointer hover:scale-105 active:scale-95"
      >
        <Calculator className="w-4 h-4 text-orange-600" />
        <span>Калькулятор</span>
      </button>

      {/* MAX messenger */}
      <a
        href={MAX_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Написать в MAX"
        className="group relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-visible bg-white text-white shadow-xl shadow-[#5A5CE8]/35 ring-2 ring-white transition-all hover:scale-110 active:scale-95 cursor-pointer"
      >
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7B7CF0] opacity-30" />
        <MaxIcon className="relative w-full h-full" />

        <span className="hidden sm:flex items-center gap-1.5 absolute right-full mr-3 bg-slate-900 text-white text-xs font-semibold py-2 px-3 rounded-xl whitespace-nowrap opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all shadow-lg pointer-events-none">
          Написать менеджеру в MAX
          <span className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-6 border-transparent border-l-slate-900" />
        </span>
      </a>

      {/* Quick call */}
      <button
        onClick={() => onOpenOrder('Быстрый заказ звонка менеджера')}
        aria-label="Заказать звонок"
        className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-orange-600 hover:bg-orange-700 text-white shadow-xl shadow-orange-600/30 transition-all hover:scale-110 active:scale-95 cursor-pointer"
      >
        <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
    </div>
  );
};
