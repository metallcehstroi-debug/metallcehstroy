import React, { useState } from 'react';
import {
  Star,
  MessageCircle,
  CheckCircle2,
  Mail,
  Calendar,
  ThumbsUp,
} from 'lucide-react';
import { REAL_REVIEWS } from '../data/siteData';

interface ReviewsSectionProps {
  onOpenOrder: (title?: string) => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ onOpenOrder }) => {
  const [activeReviewImg, setActiveReviewImg] = useState<string | null>(null);

  return (
    <section id="reviews" className="py-16 sm:py-24 bg-slate-900/70 border-b border-slate-800 relative">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 2xl:px-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-950/60 border border-orange-600/30 text-xs font-bold text-orange-400 mb-3">
            <MessageCircle className="w-3.5 h-3.5" />
            Честные отзывы заказчиков
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-heading tracking-tight">
            Что говорят клиенты о работе{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">
              «МеталлЦехСтрой»
            </span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            Реальные отзывы наших клиентов с указанием почты и фотографиями сданных объектов.
          </p>
        </div>

        {/* Rating Summary Strip */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-6 mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-3xl sm:text-4xl font-extrabold text-white font-heading">
              5.0
            </div>
            <div>
              <div className="flex text-amber-400 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <div className="text-xs text-slate-400">
                На основе более чем 140 проверенных отзывов
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3.5 py-2 rounded-xl">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>100% реальные фото и контакты заказчиков</span>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {REAL_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="bg-slate-950 border border-slate-800/90 hover:border-orange-500/40 rounded-2xl p-6 shadow-xl flex flex-col justify-between transition-all duration-300 group"
            >
              <div>
                {/* Header of review card */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-white font-bold text-base shadow-sm shrink-0">
                      {rev.author.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-sm sm:text-base font-heading">
                          {rev.author}
                        </h3>
                        {rev.verified && (
                          <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-700/40 px-2 py-0.5 rounded-full font-semibold">
                            Проверен
                          </span>
                        )}
                      </div>
                      {rev.email && (
                        <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                          <Mail className="w-3 h-3 text-slate-500" />
                          <span className="font-mono">{rev.email}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex text-amber-400 justify-end mb-1">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center justify-end gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{rev.date}</span>
                    </div>
                  </div>
                </div>

                {/* Project Tag */}
                {rev.project && (
                  <div className="mb-3">
                    <span className="inline-block bg-slate-900 border border-slate-800 text-orange-300 text-xs font-semibold px-2.5 py-1 rounded-lg">
                      Объект: {rev.project}
                    </span>
                  </div>
                )}

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                  «{rev.text}»
                </p>
              </div>

              {/* Photo attachment from actual site */}
              {rev.image && (
                <div className="mt-4 pt-4 border-t border-slate-900 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={rev.image}
                      alt={rev.project || rev.author}
                      onClick={() => setActiveReviewImg(rev.image || null)}
                      className="w-14 h-14 object-cover rounded-lg border border-slate-700 hover:border-orange-500 cursor-pointer transition-colors shadow-sm"
                    />
                    <div className="text-xs">
                      <span className="text-slate-400 block">Фото с объекта:</span>
                      <button
                        onClick={() => setActiveReviewImg(rev.image || null)}
                        className="text-orange-400 hover:text-orange-300 font-semibold cursor-pointer"
                      >
                        Увеличить фото
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => onOpenOrder(`Хочу аналогичный навес, как в отзыве у ${rev.author}`)}
                    className="text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-xl transition-colors cursor-pointer"
                  >
                    Хочу так же →
                  </button>
                </div>
              )}

            </div>
          ))}
        </div>

        {/* Leave Review / Request CTA */}
        <div className="mt-12 text-center bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto space-y-4">
          <ThumbsUp className="w-8 h-8 text-orange-400 mx-auto" />
          <h3 className="text-lg sm:text-xl font-bold text-white font-heading">
            Станьте нашим довольным клиентом!
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            Оставьте заявку сегодня и закрепите за собой скидку 2% при онлайн-заказе!
          </p>
          <button
            onClick={() => onOpenOrder('Оставить заявку на расчет навеса со скидкой 2%')}
            className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold py-3 px-8 rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-95"
          >
            Оформить заявку со скидкой
          </button>
        </div>

      </div>

      {/* Review Image Zoom Modal */}
      {activeReviewImg && (
        <div
          onClick={() => setActiveReviewImg(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer animate-in fade-in"
        >
          <div className="relative max-w-3xl w-full max-h-[85vh] flex items-center justify-center">
            <img
              src={activeReviewImg}
              alt="Увеличенное фото объекта"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl border border-slate-700 shadow-2xl"
            />
            <div className="absolute bottom-4 text-xs text-white bg-black/60 px-4 py-1.5 rounded-full backdrop-blur-xs">
              Кликните в любом месте, чтобы закрыть
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
