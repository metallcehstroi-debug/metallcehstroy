import React, { useState } from 'react';
import {
  Send,
  CheckCircle2,
  Paperclip,
  X,
  ShieldCheck,
  Clock,
  Compass,
  Ruler,
  PencilRuler,
  Banknote,
  ListPlus,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MaxIcon, MAX_URL } from './MaxIcon';
import { EditableText } from '../editor/Editable';
import { sendLead } from '../editor/leadSubmit';
import { useEditor } from '../editor/EditorContext';

const ListEdit = ListPlus;

const defaultOptions = [
  'Навес для 1 автомобиля',
  'Навес для 2-х и более автомобилей',
  'Навес к дому / терраса / козырек',
  'Забор из профнастила',
  'Забор из евроштакетника',
  'Забор «Жалюзи»',
  'Откатные или распашные ворота',
  'Ангар или складское помещение',
  'Беседка или хозблок',
  'Другая металлоконструкция по чертежу',
];

interface ConsultationFormProps {
  onSuccessOrder?: (details: string) => void;
}

export const ConsultationForm: React.FC<ConsultationFormProps> = ({ onSuccessOrder }) => {
  const { editMode, getText, setValue, notify } = useEditor();

  // Редактируемый список «Что вас интересует»
  const [optionsOpen, setOptionsOpen] = useState(false);
  const storedOptions = getText('consult.options', '');
  const optionsList: string[] = (() => {
    if (storedOptions) {
      try {
        const parsed = JSON.parse(storedOptions);
        if (Array.isArray(parsed) && parsed.length) return parsed.map(String);
      } catch {
        /* ignore */
      }
    }
    return defaultOptions;
  })();
  const [optionsDraft, setOptionsDraft] = useState(optionsList.join('\n'));

  const saveOptions = () => {
    const list = optionsDraft
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    if (!list.length) {
      notify('Список не может быть пустым');
      return;
    }
    setValue('consult.options', JSON.stringify(list));
    setProductType(list[0]);
    setOptionsOpen(false);
    notify('Список вариантов обновлён');
  };

  const [productType, setProductType] = useState(optionsList[0] || 'Навес для 1 автомобиля');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [comment, setComment] = useState('');
  const [attachedFile, setAttachedFile] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;

    setIsSubmitting(true);
    try {
      await sendLead({
        name: name || undefined,
        phone,
        product: productType,
        message: comment || undefined,
        source: 'Форма «Оформите заявку сейчас»',
      });
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      if (onSuccessOrder) {
        onSuccessOrder(
          `Письмо отправлено на metallcehstroi@ya.ru: ${productType}, ${name || 'Гость'} (${phone})`
        );
      }
    }
  };

  const handleSimulateFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0].name);
    }
  };

  return (
    <section
      id="order-form"
      className="py-16 sm:py-24 relative overflow-hidden bg-gradient-to-b from-white via-amber-50/50 to-orange-50/70 border-y border-orange-100"
    >
      {/* Декоративный фон: линии-«навесы» */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full opacity-[0.06] pointer-events-none"
        fill="none"
        stroke="#ea580c"
        strokeWidth="2"
      >
        <path d="M-50 220 Q 200 60 450 220" />
        <path d="M-50 260 Q 200 100 450 260" />
        <path d="M1000 80 Q 1300 -60 1600 80" />
        <path d="M1000 130 Q 1300 -10 1600 130" />
        <path d="M-100 700 Q 300 520 700 700" />
        <path d="M1100 760 Q 1450 600 1800 760" />
      </svg>
      <div className="absolute -top-32 right-1/4 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 left-1/4 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 2xl:px-10 relative z-10">
        <div className="bg-white border border-orange-100 rounded-[2rem] p-6 sm:p-12 shadow-xl shadow-orange-900/5 relative overflow-hidden">
          {/* Верхняя лента */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Левая колонка */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 border border-orange-200 text-xs font-bold text-orange-800 shadow-xs">
                <Compass className="w-3.5 h-3.5" />
                <EditableText id="consult.badge">
                  Выезд замерщика — 3 000 ₽, вычитается из стоимости заказа
                </EditableText>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-slate-950 font-heading tracking-tight leading-tight">
                <EditableText id="consult.title.p1">Оформите заявку сейчас и получите</EditableText>{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
                  <EditableText id="consult.title.p2">дополнительную скидку 2%</EditableText>
                </span>
              </h2>

              <EditableText
                as="p"
                id="consult.subtitle"
                multiline
                className="text-slate-600 text-sm sm:text-base leading-relaxed block"
              >
                Выезд замерщика стоит 3 000 ₽, но при заключении договора эта сумма вычитается из
                стоимости заказа — фактически замер для вас бесплатный. Инженер приедет с каталогом
                материалов, произведёт точные замеры и подготовит индивидуальный проект с
                визуализацией.
              </EditableText>

              {/* Карточки-преимущества */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  { icon: Ruler, id: 'consult.card1', text: 'Замер в день обращения или на выходных' },
                  { icon: PencilRuler, id: 'consult.card2', text: 'Образцы материалов и проект с собой' },
                  { icon: Banknote, id: 'consult.card3', text: 'Договор и фиксация цены на 30 дней' },
                ].map((c) => {
                  const Icon = c.icon;
                  return (
                    <div
                      key={c.id}
                      className="bg-gradient-to-b from-slate-50 to-white border border-slate-200 rounded-2xl p-3.5 hover:border-orange-300 hover:shadow-md hover:-translate-y-0.5 transition-all"
                    >
                      <span className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center mb-2">
                        <Icon className="w-4 h-4" />
                      </span>
                      <EditableText as="p" id={c.id} multiline className="text-[11px] text-slate-600 leading-snug block font-medium">
                        {c.text}
                      </EditableText>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <EditableText id="consult.trust1">Ответ в течение 10 минут</EditableText>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <EditableText id="consult.trust2">Гарантия 24 месяца</EditableText>
                </div>
                <div className="flex items-center gap-1.5">
                  <Send className="w-4 h-4 text-[#5A5CE8]" />
                  <EditableText id="consult.trust3">Заявка уходит на metallcehstroi@ya.ru</EditableText>
                </div>
              </div>
            </div>

            {/* Правая колонка — форма */}
            <div className="lg:col-span-6 bg-gradient-to-b from-slate-50 to-orange-50/60 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
              {submitted ? (
                <div className="text-center py-8 space-y-4 animate-in zoom-in-95">
                  <div className="w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/25">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <EditableText as="h3" id="consult.success.title" className="text-xl font-bold text-slate-950 font-heading block">
                    Заявка отправлена на почту производства!
                  </EditableText>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                    <EditableText as="span" id="consult.success.text" multiline>
                      {`Спасибо, ${name || 'уважаемый заказчик'}! За вами закреплена скидка 2% онлайн. Дежурный инженер свяжется с вами по номеру ${phone} в течение 10 минут.`}
                    </EditableText>
                  </p>

                  <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                    <a
                      href={MAX_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-[#5A5CE8] hover:bg-[#4A4BD8] text-white font-bold py-2.5 px-5 rounded-xl text-xs transition-colors shadow-sm"
                    >
                      <MaxIcon className="w-4 h-4" />
                      Написать в MAX
                    </a>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setName('');
                        setPhone('');
                        setComment('');
                      }}
                      className="py-2.5 px-4 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      Отправить еще заявку
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        <EditableText id="consult.form.label_select">Что вас интересует?</EditableText>
                      </label>
                      {editMode && (
                        <button
                          type="button"
                          onClick={() => setOptionsOpen((v) => !v)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-700 bg-orange-50 border border-orange-200 hover:bg-orange-100 px-2 py-1 rounded-lg cursor-pointer"
                        >
                          <ListEdit className="w-3 h-3" />
                          {optionsOpen ? 'Скрыть редактор списка' : 'Изменить список'}
                        </button>
                      )}
                    </div>

                    {optionsOpen && editMode && (
                      <div className="mb-2 bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-2">
                        <p className="text-[11px] text-amber-800 font-medium leading-snug">
                          По одному варианту в строке. Нажмите «Сохранить список» — варианты сразу
                          появятся в списке выше.
                        </p>
                        <textarea
                          value={optionsDraft}
                          onChange={(e) => setOptionsDraft(e.target.value)}
                          rows={8}
                          className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-800 outline-none focus:border-orange-500 resize-y font-mono"
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={saveOptions}
                            className="bg-orange-600 hover:bg-orange-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg cursor-pointer"
                          >
                            Сохранить список
                          </button>
                          <button
                            type="button"
                            onClick={() => setOptionsDraft(defaultOptions.join('\n'))}
                            className="bg-white border border-slate-300 text-slate-600 text-[11px] font-bold px-3 py-1.5 rounded-lg cursor-pointer"
                          >
                            Вернуть стандартный
                          </button>
                        </div>
                      </div>
                    )}

                    <select
                      value={productType}
                      onChange={(e) => setProductType(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-orange-500 cursor-pointer shadow-2xs"
                    >
                      {optionsList.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Ваше имя:</label>
                      <input
                        type="text"
                        placeholder="Константин"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-orange-500 shadow-2xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Номер телефона <span className="text-orange-600">*</span>:
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+7 (___) ___-__-__"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-orange-500 shadow-2xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Размеры или пожелания (необязательно):
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Например: арочный навес 6х4м, Истринский район"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-orange-500 resize-none shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="inline-flex items-center gap-1.5 text-xs text-orange-600 hover:text-orange-700 font-bold cursor-pointer">
                      <Paperclip className="w-3.5 h-3.5" />
                      <span>Прикрепить эскиз или фото участка</span>
                      <input
                        type="file"
                        onChange={handleSimulateFile}
                        className="hidden"
                        accept="image/*,.pdf,.doc,.docx"
                      />
                    </label>
                    {attachedFile && (
                      <div className="mt-1 text-xs text-emerald-700 flex items-center gap-1 bg-white border border-slate-200 px-2 py-1 rounded-lg w-fit">
                        <span>Файл: {attachedFile}</span>
                        <button
                          type="button"
                          onClick={() => setAttachedFile(null)}
                          className="hover:text-red-500 cursor-pointer ml-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    <p className="text-[10px] text-slate-400 mt-1">
                      Файл приложите к письму в MAX после звонка инженера — так быстрее.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold py-3.5 px-6 rounded-xl text-sm shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Отправка заявки на почту...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <EditableText id="consult.form.btn">Вызвать замерщика со скидкой 2%</EditableText>
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                    Нажимая кнопку, вы соглашаетесь на обработку персональных данных. Без спама.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
