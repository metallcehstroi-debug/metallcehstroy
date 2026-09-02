import React, { useState } from 'react';
import {
  Star,
  MessageCircle,
  CheckCircle2,
  Mail,
  Calendar,
  ThumbsUp,
  X,
} from 'lucide-react';
import { REAL_REVIEWS } from '../data/siteData';
import { EditableText, EditableImage } from '../editor/Editable';

interface ReviewsPageProps {
  onOpenOrder: (title?: string) => void;
}

export const ReviewsPage: React.FC<ReviewsPageProps> = ({ onOpenOrder }) => {
  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  return (
    <div className="bg-white py-10 sm:py-16">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 2xl:px-10">
        
        {/* Breadcrumb & Header */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <div className="text-xs font-semibold text-slate-500 mb-2">
            <span>Главная</span> <span className="mx-1">/</span> <span className="text-orange-600">Отзывы клиентов</span>
          </div>
          <div className="inline-flex items-center gap-1.5 bg-orange-100 text-orange-700 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
            <MessageCircle className="w-3.5 h-3.5" />
            Подлинные отзывы
          </div>
          <EditableText as="h1" id="reviews.h1" className="text-3xl sm:text-5xl font-black text-slate-900 font-heading tracking-tight block">
            Отзывы наших заказчиков
          </EditableText>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            Мы гордимся доверием наших клиентов. Каждый отзыв подкреплен реальной фотографией сданного навеса или забора и контактом для связи.
          </p>
        </div>

        {/* Rating Banner */}
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 mb-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="text-4xl sm:text-5xl font-extrabold text-slate-900 font-heading">
              5.0
            </div>
            <div>
              <div className="flex text-amber-500 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <div className="text-xs sm:text-sm text-slate-600 font-medium">
                Средняя оценка качества на основе более 140 сданных объектов
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 px-4 py-2 rounded-2xl">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>100% реальные отзывы заказчиков</span>
          </div>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12">
          {REAL_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="white-card rounded-3xl p-6 sm:p-7 flex flex-col justify-between"
            >
              <div>
                {/* Author Info */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-extrabold text-base shadow-sm shrink-0">
                      {rev.author.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base font-heading">
                          <EditableText id={`review.${rev.id}.author`}>{rev.author}</EditableText>
                        </h3>
                        {rev.verified && (
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                            Проверен
                          </span>
                        )}
                      </div>
                      {rev.email && (
                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-mono">{rev.email}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex text-amber-500 justify-end mb-1">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center justify-end gap-1 font-medium">
                      <Calendar className="w-3 h-3" />
                      <span>{rev.date}</span>
                    </div>
                  </div>
                </div>

                {/* Project Tag */}
                {rev.project && (
                  <div className="mb-3">
                    <span className="inline-block bg-orange-50 text-orange-800 border border-orange-200 text-xs font-semibold px-2.5 py-1 rounded-lg">
                      Объект: <EditableText id={`review.${rev.id}.project`}>{rev.project}</EditableText>
                    </span>
                  </div>
                )}

                {/* Review Text */}
                <EditableText as="p" id={`review.${rev.id}.text`} multiline className="text-xs sm:text-sm text-slate-700 leading-relaxed italic block">
                  {`«${rev.text}»`}
                </EditableText>
              </div>

              {/* Photo attachment from actual site */}
              {rev.image && (
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                      <EditableImage
                        id={`review.${rev.id}.image`}
                        src={rev.image}
                        alt={rev.project || rev.author}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-xs">
                      <span className="text-slate-500 block">Фото изделия:</span>
                      <button
                        onClick={() => setActivePhoto(rev.image || null)}
                        className="text-orange-600 hover:text-orange-700 font-bold cursor-pointer"
                      >
                        Увеличить фото
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenOrder(`Хочу такой же навес, как в отзыве у ${rev.author}`)}
                    className="text-xs font-bold text-slate-700 hover:text-orange-600 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
                  >
                    Хочу так же →
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Box */}
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-3xl p-6 sm:p-10 text-center max-w-2xl mx-auto space-y-4 shadow-sm">
          <ThumbsUp className="w-10 h-10 text-orange-600 mx-auto" />
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">
            Хотите такой же надежный навес или забор?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Оставьте заявку прямо сейчас и зафиксируйте за собой скидку 2% при онлайн-заказе!
          </p>
          <button
            onClick={() => onOpenOrder('Оставить заявку на расчет навеса со скидкой 2%')}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 px-8 rounded-xl text-sm shadow-md transition-all cursor-pointer active:scale-95"
          >
            Оформить заявку со скидкой 2%
          </button>
        </div>

      </div>

      {/* Photo Lightbox */}
      {activePhoto && (
        <div
          onClick={() => setActivePhoto(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 cursor-pointer animate-in fade-in"
        >
          <div className="relative max-w-3xl w-full max-h-[85vh] flex items-center justify-center">
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-2 right-2 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={activePhoto}
              alt="Увеличенное фото объекта"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl border border-slate-700 shadow-2xl"
            />
          </div>
        </div>
      )}

    </div>
  );
};
