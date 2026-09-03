import React from 'react';
import { useEditor } from './EditorContext';
import { X, Calculator, Save, Info, Sliders, Fence, DoorOpen, Waves } from 'lucide-react';

interface CalculatorEditorProps {
  open: boolean;
  onClose: () => void;
}

/** Расширенная панель настроек цен калькулятора */
export const CalculatorEditor: React.FC<CalculatorEditorProps> = ({ open, onClose }) => {
  const { getText, setValue, notify } = useEditor();

  if (!open) return null;

  const Field = ({
    label,
    k,
    def,
    suffix = '₽',
  }: {
    label: string;
    k: string;
    def: string;
    suffix?: string;
  }) => (
    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
      <label className="block text-[11px] font-semibold text-slate-600 mb-1 truncate" title={label}>
        {label}
      </label>
      <div className="flex items-center gap-1">
        <input
          defaultValue={getText(k, def)}
          onBlur={(e) => setValue(k, e.target.value)}
          className="w-full min-w-0 border border-slate-300 rounded-md px-2 py-1.5 text-xs text-slate-800 outline-none focus:border-orange-500 font-mono"
        />
        <span className="text-[10px] text-slate-400 shrink-0">{suffix}</span>
      </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-[135] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[88vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
          <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
            <Calculator className="w-4.5 h-4.5 text-orange-600" /> Настройки цен калькулятора
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700" aria-label="Закрыть">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-xs text-slate-500 -mt-2 leading-relaxed">
            Измените значения и кликните вне поля — цена в калькуляторе пересчитается сразу.
            Все значения сохраняются автоматически.
          </p>

          {/* Общие параметры */}
          <section>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-orange-600" /> Общие параметры
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <Field label="Множитель цен" k="calc.multiplier" def="1.3" suffix="×" />
              <Field label="Скидка онлайн" k="calc.discount_percent" def="2" suffix="%" />
              <Field label="Выезд замерщика" k="calc.measure_cost" def="3000" />
            </div>
          </section>

          {/* Навесы: база за м² */}
          <section>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Calculator className="w-3.5 h-3.5 text-orange-600" /> Навесы: базовая цена за м²
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <Field label="Арочный" k="calc.price.arch" def="4750" />
              <Field label="Двухскатный" k="calc.price.gable" def="4600" />
              <Field label="Односкатный" k="calc.price.monoslope" def="4400" />
              <Field label="С фризом" k="calc.price.frieze" def="5800" />
              <Field label="Консольный" k="calc.price.cantilever" def="5400" />
              <Field label="Полуарочный" k="calc.price.semiarch" def="4650" />
            </div>
          </section>

          {/* Кровля: надбавка за м² */}
          <section>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Waves className="w-3.5 h-3.5 text-orange-600" /> Кровля: надбавка за м²
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <Field label="Монолитный поликарбонат" k="calc.roof.monopoly" def="1200" />
              <Field label="Металлочерепица" k="calc.roof.metaltile" def="800" />
              <Field label="Мягкая черепица" k="calc.roof.softtile" def="1500" />
              <Field label="Профнастил" k="calc.roof.proflist" def="500" />
            </div>
          </section>

          {/* Фундамент навеса и опции */}
          <section>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-orange-600" /> Навес: фундамент и опции
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              <Field label="Бетонирование, шт" k="calc.cfound.concrete" def="2000" />
              <Field label="Винтовая свая, шт" k="calc.cfound.piles" def="4500" />
              <Field label="Анкер, шт" k="calc.cfound.anchors" def="1200" />
              <Field label="Водосток, пог.м" k="calc.opt.gutter" def="1100" />
              <Field label="Снегозадержатель, пог.м" k="calc.opt.snow" def="1500" />
            </div>
          </section>

          {/* Заборы: цена за м² */}
          <section>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Fence className="w-3.5 h-3.5 text-orange-600" /> Заборы: цена за м²
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              <Field label="Профнастил" k="calc.fence.proflist" def="835" />
              <Field label="Евроштакетник" k="calc.fence.shtaket" def="950" />
              <Field label="Жалюзи" k="calc.fence.zhalyuzi" def="1450" />
              <Field label="3D сетка" k="calc.fence.3d" def="380" />
              <Field label="Рабица" k="calc.fence.rabitsa" def="285" />
            </div>
          </section>

          {/* Ворота и калитки */}
          <section>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <DoorOpen className="w-3.5 h-3.5 text-orange-600" /> Ворота и калитки (доплата)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              <Field label="Без ворот" k="calc.gate.none" def="0" />
              <Field label="Калитка" k="calc.gate.wicket" def="7000" />
              <Field label="Распашные ворота" k="calc.gate.swing" def="25000" />
              <Field label="Откатные 4 м без авт." k="calc.gate.sliding" def="65000" />
              <Field label="Откатные 4 м с авт." k="calc.gate.slidingauto" def="135000" />
            </div>
          </section>

          {/* Фундамент забора */}
          <section>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Fence className="w-3.5 h-3.5 text-orange-600" /> Забор: фундамент за пог. м
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <Field label="Трамбовка щебнем" k="calc.ffound.tamping" def="350" />
              <Field label="Бетонирование столбов" k="calc.ffound.concreting" def="650" />
              <Field label="Монолитная лента" k="calc.ffound.monolith" def="2400" />
            </div>
          </section>

          {/* Текст примечания */}
          <section>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-amber-600" /> Текст примечания о примерном расчёте
            </h4>
            <textarea
              defaultValue={getText(
                'calc.approx_note',
                'Это примерный расчёт, за точным расчётом обращайтесь по заявке. Инженер сделает детальный расчёт сметы и проект под ваш участок.'
              )}
              rows={3}
              onBlur={(e) => setValue('calc.approx_note', e.target.value)}
              className="w-full border border-slate-300 rounded-xl p-3 text-xs text-slate-800 outline-none focus:border-orange-500 resize-none"
            />
          </section>

          <button
            onClick={() => {
              notify('Настройки калькулятора сохранены');
              onClose();
            }}
            className="w-full inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl text-sm transition-colors"
          >
            <Save className="w-4 h-4" /> Сохранить и закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
