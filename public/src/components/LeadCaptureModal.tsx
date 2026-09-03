import React, { useState, useEffect } from 'react';
import {
  X,
  Send,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MaxIcon, MAX_URL } from './MaxIcon';
import { sendLead } from '../editor/leadSubmit';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTitle?: string;
  onSuccess: (info: string) => void;
}

export const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({
  isOpen,
  onClose,
  initialTitle = 'Заявка на выезд замерщика (3 000 ₽ — вычитается из стоимости заказа)',
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [cityOrDistrict, setCityOrDistrict] = useState('');
  const [wishes, setWishes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSubmitted(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;

    setIsSubmitting(true);
    try {
      await sendLead({
        name: name || undefined,
        phone,
        product: initialTitle,
        message: [
          cityOrDistrict ? `Локация: ${cityOrDistrict}` : '',
          wishes ? `Размеры или пожелания: ${wishes}` : '',
        ].filter(Boolean).join('\n') || undefined,
        source: 'Модальное окно заявки',
      });
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      onSuccess(`Письмо отправлено на metallcehstroi@ya.ru [${initialTitle}]: ${name || 'Клиент'}, ${phone}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-in zoom-in-95">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6 space-y-4 animate-in zoom-in-95">
            <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto text-white shadow-lg">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <h3 className="text-2xl font-extrabold text-slate-900 font-heading">
              Заявка принята!
            </h3>

            <p className="text-sm text-slate-600 leading-relaxed">
              Спасибо, <strong>{name || 'уважаемый клиент'}</strong>! Мы зафиксировали за вами скидку <strong>2%</strong> при онлайн-заказе.
              Менеджер свяжется с вами в течение 10 минут по номеру:
            </p>

            <div className="text-lg font-mono font-bold text-orange-600 bg-orange-50 p-2.5 rounded-2xl border border-orange-200">
              {phone}
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <a
                href={MAX_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#5A5CE8] hover:bg-[#4A4BD8] text-white font-bold py-3 rounded-xl text-xs transition-colors shadow-sm shadow-[#5A5CE8]/25"
              >
                <MaxIcon className="w-4 h-4" />
                Написать в MAX для быстрого ответа
              </a>

              <button
                onClick={onClose}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl text-xs"
              >
                Закрыть окно
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Modal Header */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-700 uppercase tracking-wider mb-2 bg-orange-100 px-2.5 py-0.5 rounded-md">
                <Sparkles className="w-3.5 h-3.5" />
                Спецпредложение производства
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading leading-snug">
                {initialTitle}
              </h3>
              <p className="text-xs text-slate-500 mt-1.5">
                Заполните форму, и мы перезвоним через 10 минут, согласуем удобное время замера и рассчитаем смету со скидкой 2%.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Ваше имя:
                </label>
                <input
                  type="text"
                  placeholder="Как к вам обращаться"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-orange-500 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Номер телефона <span className="text-orange-600">*</span>:
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+7 (___) ___-__-__"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-orange-500 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Район или город (Москва / МО):
                </label>
                <input
                  type="text"
                  placeholder="Например: Домодедово, Истра, Чехов"
                  value={cityOrDistrict}
                  onChange={(e) => setCityOrDistrict(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-orange-500 shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Размеры или пожелания (необязательно):
                </label>
                <textarea
                  rows={2}
                  placeholder="Например: арочный навес 6×4 м, Истринский район"
                  value={wishes}
                  onChange={(e) => setWishes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-orange-500 resize-none shadow-2xs"
                />
              </div>

              {/* Perks list */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1.5 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Выезд замерщика 3 000 ₽ — вычитается при заключении договора</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Скидка 2% за онлайн заказ</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Фиксированная цена в договоре подряда</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-orange-600 via-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold py-3.5 px-6 rounded-xl text-sm shadow-md shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Отправка...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Отправить заявку со скидкой 2%</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>Ваши данные под защитой. Без спама и навязчивых звонков.</span>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
