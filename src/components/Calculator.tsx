import React, { useState, useId } from 'react';
import {
  Calculator as CalcIcon,
  Sparkles,
  CheckCircle2,
  Layers,
  Maximize2,
  ShieldCheck,
  Flame,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MAX_URL } from './MaxIcon';
import { EditableText } from '../editor/Editable';
import { useEditor } from '../editor/EditorContext';
import { sendLead } from '../editor/leadSubmit';

interface CalculatorProps {
  onSuccessOrder: (details: string) => void;
}

export const Calculator: React.FC<CalculatorProps> = ({ onSuccessOrder }) => {
  const [calcTab, setCalcTab] = useState<'canopy' | 'fence'>('canopy');

  const widthId = useId();
  const lengthId = useId();
  const fenceLengthId = useId();

  // CANOPY STATE
  const [canopyType, setCanopyType] = useState<'arch' | 'gable' | 'monoslope' | 'frieze' | 'cantilever' | 'semiarch'>('arch');
  const [width, setWidth] = useState<number>(4);
  const [length, setLength] = useState<number>(6);
  const [roofMaterial, setRoofMaterial] = useState<'honey-poly' | 'mono-poly' | 'metal-tile' | 'soft-tile' | 'proflist'>('honey-poly');
  const [foundation, setFoundation] = useState<'concrete' | 'piles' | 'anchors'>('concrete');
  const [withGutters, setWithGutters] = useState<boolean>(true);
  const [withSnowGuard, setWithSnowGuard] = useState<boolean>(false);

  // FENCE STATE
  const [fenceType, setFenceType] = useState<'proflist' | 'shtaket' | 'zhalyuzi' | '3d' | 'rabitsa'>('proflist');
  const [fenceLength, setFenceLength] = useState<number>(40);
  const [fenceHeight, setFenceHeight] = useState<number>(2.0);
  const [gateType, setGateType] = useState<'none' | 'wicket' | 'swing' | 'sliding' | 'sliding-auto'>('sliding');
  const [fenceFoundation, setFenceFoundation] = useState<'tamping' | 'concreting' | 'monolith'>('concreting');

  // LEAD FORM STATE
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { getText } = useEditor();
  const multiplier = parseFloat(getText('calc.multiplier', '1.3')) || 1.3;
  const discountPercent = parseFloat(getText('calc.discount_percent', '2')) || 2;
  const measureCost = parseInt(getText('calc.measure_cost', '3000')) || 3000;

  // Canopy price computation
  const canopyArea = width * length;

  const basePricePerM2: Record<string, number> = {
    arch: parseInt(getText('calc.price.arch', '4750')) || 4750,
    gable: parseInt(getText('calc.price.gable', '4600')) || 4600,
    monoslope: parseInt(getText('calc.price.monoslope', '4400')) || 4400,
    frieze: parseInt(getText('calc.price.frieze', '5800')) || 5800,
    cantilever: parseInt(getText('calc.price.cantilever', '5400')) || 5400,
    semiarch: parseInt(getText('calc.price.semiarch', '4650')) || 4650,
  };

  const roofAddPerM2: Record<string, number> = {
    'honey-poly': 0,
    'mono-poly': parseInt(getText('calc.roof.monopoly', '1200')) || 0,
    'metal-tile': parseInt(getText('calc.roof.metaltile', '800')) || 0,
    'soft-tile': parseInt(getText('calc.roof.softtile', '1500')) || 0,
    'proflist': parseInt(getText('calc.roof.proflist', '500')) || 0,
  };

  const canopyPillarCount = Math.max(4, Math.ceil(length / 2.5) * 2);
  const cfoundUnit: Record<string, number> = {
    concrete: parseInt(getText('calc.cfound.concrete', '2000')) || 0,
    piles: parseInt(getText('calc.cfound.piles', '4500')) || 0,
    anchors: parseInt(getText('calc.cfound.anchors', '1200')) || 0,
  };
  const canopyFoundationCost = canopyPillarCount * (cfoundUnit[foundation] || 0);

  const gutterPerM = parseInt(getText('calc.opt.gutter', '1100')) || 0;
  const snowPerM = parseInt(getText('calc.opt.snow', '1500')) || 0;
  const guttersCost = withGutters ? length * 2 * gutterPerM : 0;
  const snowGuardCost = withSnowGuard ? length * 2 * snowPerM : 0;

  const canopyBaseTotal =
    ((canopyArea * (basePricePerM2[canopyType] + roofAddPerM2[roofMaterial])) +
      canopyFoundationCost +
      guttersCost +
      snowGuardCost) *
    multiplier;

  // Fence price computation
  const fenceArea = fenceLength * fenceHeight;
  const fenceM2Price: Record<string, number> = {
    proflist: parseInt(getText('calc.fence.proflist', '835')) || 0,
    shtaket: parseInt(getText('calc.fence.shtaket', '950')) || 0,
    zhalyuzi: parseInt(getText('calc.fence.zhalyuzi', '1450')) || 0,
    '3d': parseInt(getText('calc.fence.3d', '380')) || 0,
    rabitsa: parseInt(getText('calc.fence.rabitsa', '285')) || 0,
  };

  const gateCosts: Record<string, number> = {
    none: parseInt(getText('calc.gate.none', '0')) || 0,
    wicket: parseInt(getText('calc.gate.wicket', '7000')) || 0,
    swing: parseInt(getText('calc.gate.swing', '25000')) || 0,
    sliding: parseInt(getText('calc.gate.sliding', '65000')) || 0,
    'sliding-auto': parseInt(getText('calc.gate.slidingauto', '135000')) || 0,
  };

  const fenceFoundationCostPerM: Record<string, number> = {
    tamping: parseInt(getText('calc.ffound.tamping', '350')) || 0,
    concreting: parseInt(getText('calc.ffound.concreting', '650')) || 0,
    monolith: parseInt(getText('calc.ffound.monolith', '2400')) || 0,
  };

  const fenceBaseTotal =
    ((fenceArea * fenceM2Price[fenceType]) +
      fenceLength * fenceFoundationCostPerM[fenceFoundation] +
      gateCosts[gateType]) *
    multiplier;

  // Active total
  const activeBaseTotal = calcTab === 'canopy' ? canopyBaseTotal : fenceBaseTotal;
  // Скидка при оформлении заявки онлайн
  const discountedTotal = Math.round(activeBaseTotal * (1 - discountPercent / 100));
  const savings = activeBaseTotal - discountedTotal;

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userPhone.trim()) return;

    setIsSubmitting(true);

    const details = calcTab === 'canopy'
      ? `Калькулятор навеса: ${canopyType}, ${width}x${length}м (${canopyArea}м²), кровля: ${roofMaterial}, фундамент: ${foundation}, водосток: ${withGutters ? 'да' : 'нет'}, снегозадержатель: ${withSnowGuard ? 'да' : 'нет'}, предварительная сумма: ${discountedTotal.toLocaleString('ru-RU')} ₽`
      : `Калькулятор забора: ${fenceType}, ${fenceLength}м, h=${fenceHeight}м, ворота: ${gateType}, фундамент: ${fenceFoundation}, предварительная сумма: ${discountedTotal.toLocaleString('ru-RU')} ₽`;

    try {
      await sendLead({
        name: userName || undefined,
        phone: userPhone,
        product: calcTab === 'canopy' ? 'Расчёт навеса (калькулятор)' : 'Расчёт забора (калькулятор)',
        message: details,
        source: 'Онлайн-калькулятор',
      });
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      onSuccessOrder(`Письмо отправлено на metallcehstroi@ya.ru — ${details}`);
    }
  };

  return (
    <section id="calculator" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200 relative overflow-hidden">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 2xl:px-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 border border-orange-200 text-xs font-bold text-orange-700 mb-3">
            <CalcIcon className="w-3.5 h-3.5" />
            <EditableText id="calc.badge">Интерактивный расчет под ключ</EditableText>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 font-heading tracking-tight">
            <EditableText id="calc.title.p1">Калькулятор стоимости со скидкой</EditableText>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
              <EditableText id="calc.title.p2">онлайн за 1 минуту</EditableText>
            </span>
          </h2>
          <EditableText as="p" id="calc.subtitle" multiline className="text-slate-600 text-sm sm:text-base mt-2 block">
            Выберите параметры конструкции ниже. Расчет основан на производственном прайс-листе металлопроката и комплектующих. Зафиксируйте цену и получите бесплатный проект!
          </EditableText>
        </div>

        {/* Main White Calculator Box */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-8 shadow-xl">
          
          {/* Tab Switcher */}
          <div className="flex p-1 bg-slate-100 rounded-2xl max-w-md mx-auto mb-8 border border-slate-200">
            <button
              onClick={() => setCalcTab('canopy')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                calcTab === 'canopy'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Maximize2 className="w-4 h-4" />
              <span>Навесы для авто и дома</span>
            </button>

            <button
              onClick={() => setCalcTab('fence')}
              className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                calcTab === 'fence'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Заборы и ворота</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* Left Inputs Column */}
            <div className="lg:col-span-7 space-y-6">
              
              {calcTab === 'canopy' ? (
                <>
                  {/* Step 1: Canopy Type */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                      1. Форма навеса
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-semibold">
                      {[
                        { id: 'arch', label: 'Арочный', desc: 'Классика, сход снега' },
                        { id: 'gable', label: 'Двухскатный', desc: 'Стиль крыши дома' },
                        { id: 'monoslope', label: 'Односкатный', desc: 'Практичный уклон' },
                        { id: 'frieze', label: 'С фризом', desc: 'Хай-тек, скрытые фермы' },
                        { id: 'cantilever', label: 'Консольный', desc: 'Стойки с 1 стороны' },
                        { id: 'semiarch', label: 'Полуарочный', desc: 'Пристройка к дому' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setCanopyType(item.id as any)}
                          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                            canopyType === item.id
                              ? 'bg-orange-50 border-orange-500 text-orange-950 ring-1 ring-orange-500 shadow-xs'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <div className="font-bold text-sm text-slate-900 mb-0.5">{item.label}</div>
                          <div className="text-[11px] text-slate-500">{item.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 2: Dimensions */}
                  <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <label htmlFor={widthId} className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        2. Размеры конструкции:
                      </label>
                      <span className="text-sm font-bold text-orange-700 bg-orange-100 border border-orange-200 px-2.5 py-0.5 rounded-lg">
                        Площадь: {canopyArea} м²
                      </span>
                    </div>

                    {/* Width */}
                    <div>
                      <div className="flex justify-between text-xs text-slate-700 mb-1">
                        <span>Ширина заезда:</span>
                        <strong className="text-orange-600 text-sm">{width} метра</strong>
                      </div>
                      <input
                        id={widthId}
                        type="range"
                        min={3}
                        max={8}
                        step={0.5}
                        value={width}
                        onChange={(e) => setWidth(parseFloat(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                      />
                      <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                        <span>3 м (1 авто)</span>
                        <span>4.5 м (комфорт)</span>
                        <span>6+ м (2 авто)</span>
                      </div>
                    </div>

                    {/* Length */}
                    <div>
                      <div className="flex justify-between text-xs text-slate-700 mb-1">
                        <span>Длина навеса:</span>
                        <strong className="text-orange-600 text-sm">{length} метров</strong>
                      </div>
                      <input
                        id={lengthId}
                        type="range"
                        min={4}
                        max={12}
                        step={0.5}
                        value={length}
                        onChange={(e) => setLength(parseFloat(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                      />
                      <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                        <span>4 м (седан)</span>
                        <span>6 м (внедорожник)</span>
                        <span>10+ м (2 авто подряд)</span>
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Roof Material */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                      3. Материал кровли
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        { id: 'honey-poly', name: 'Сотовый поликарбонат 8 мм', note: 'Базовый, рассеянный свет' },
                        { id: 'mono-poly', name: 'Монолитный поликарбонат 6 мм', note: 'Ударопрочный как броня' },
                        { id: 'metal-tile', name: 'Металлочерепица Монтеррей', note: 'В цвет крыши дома' },
                        { id: 'soft-tile', name: 'Мягкая гибкая черепица', note: 'Бесшумная в дождь' },
                        { id: 'proflist', name: 'Профнастил С20/С21', note: 'Экономичный и жесткий' },
                      ].map((mat) => (
                        <button
                          key={mat.id}
                          type="button"
                          onClick={() => setRoofMaterial(mat.id as any)}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            roofMaterial === mat.id
                              ? 'bg-orange-50 border-orange-500 text-slate-900 ring-1 ring-orange-500'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <div className="font-bold text-xs sm:text-sm text-slate-900">{mat.name}</div>
                          <div className="text-[11px] text-slate-500">{mat.note}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 4: Foundation & Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        <EditableText id="calc.canopy.step4">4. Монтаж стоек</EditableText>
                      </label>
                      <select
                        value={foundation}
                        onChange={(e) => setFoundation(e.target.value as any)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-orange-500"
                      >
                        <option value="concrete">Бетонирование стоек</option>
                        <option value="piles">Винтовые сваи под ключ</option>
                        <option value="anchors">Анкеры к бетонной плите</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        5. Опции
                      </label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={withGutters}
                            onChange={(e) => setWithGutters(e.target.checked)}
                            className="w-4 h-4 rounded text-orange-600 focus:ring-0 cursor-pointer"
                          />
                          <span>Водосточная система</span>
                        </label>
                        <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={withSnowGuard}
                            onChange={(e) => setWithSnowGuard(e.target.checked)}
                            className="w-4 h-4 rounded text-orange-600 focus:ring-0 cursor-pointer"
                          />
                          <span>Снегозадержатель</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* FENCE */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                      1. Тип забора
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        { id: 'proflist', name: 'Профнастил' },
                        { id: 'shtaket', name: 'Евроштакетник' },
                        { id: 'zhalyuzi', name: 'Забор «Жалюзи»' },
                        { id: '3d', name: '3D Сетка Gitter' },
                        { id: 'rabitsa', name: 'Сетка Рабица' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setFenceType(item.id as any)}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            fenceType === item.id
                              ? 'bg-orange-50 border-orange-500 text-slate-900 ring-1 ring-orange-500'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <div className="font-bold text-xs sm:text-sm text-slate-900">{item.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dimensions */}
                  <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <label htmlFor={fenceLengthId} className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        2. Длина периметра:
                      </label>
                      <span className="text-sm font-bold text-orange-700 bg-orange-100 border border-orange-200 px-2.5 py-0.5 rounded-lg">
                        {fenceLength} пог. метров ({fenceArea} м²)
                      </span>
                    </div>

                    <input
                      id={fenceLengthId}
                      type="range"
                      min={10}
                      max={150}
                      step={5}
                      value={fenceLength}
                      onChange={(e) => setFenceLength(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>10 м (фасад)</span>
                      <span>50 м (участок 6 соток)</span>
                      <span>100+ м (10–15 соток)</span>
                    </div>

                    <div className="pt-2">
                      <label className="block text-xs text-slate-700 font-semibold mb-2">Высота забора:</label>
                      <div className="grid grid-cols-4 gap-2">
                        {[1.5, 1.8, 2.0, 2.2].map((h) => (
                          <button
                            key={h}
                            type="button"
                            onClick={() => setFenceHeight(h)}
                            className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              fenceHeight === h
                                ? 'bg-orange-600 text-white border-orange-600'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            {h} м
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Gates */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                      3. Въездная группа
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        { id: 'none', label: 'Без ворот', desc: 'Только полотно забора' },
                        { id: 'wicket', label: 'Калитка', desc: `+${gateCosts.wicket.toLocaleString('ru-RU')} ₽` },
                        { id: 'swing', label: 'Распашные ворота', desc: `+${gateCosts.swing.toLocaleString('ru-RU')} ₽` },
                        { id: 'sliding', label: 'Откатные ворота 4 м без автоматики', desc: `+${gateCosts.sliding.toLocaleString('ru-RU')} ₽` },
                        { id: 'sliding-auto', label: 'Откатные ворота 4 м с автоматикой', desc: `+${gateCosts['sliding-auto'].toLocaleString('ru-RU')} ₽` },
                      ].map((g) => (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => setGateType(g.id as any)}
                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            gateType === g.id
                              ? 'bg-orange-50 border-orange-500 text-slate-900 ring-1 ring-orange-500'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <div className="font-bold text-xs sm:text-sm text-slate-900">{g.label}</div>
                          <div className="text-[11px] text-slate-500">{g.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Foundation */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      <EditableText id="calc.fence.step4">4. Фундамент для забора</EditableText>
                    </label>
                    <select
                      value={fenceFoundation}
                      onChange={(e) => setFenceFoundation(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:border-orange-500"
                    >
                      <option value="concreting">Бетонирование столбов на 1.2 м</option>
                      <option value="tamping">Забивка и трамбовка щебнем</option>
                      <option value="monolith">Монолитный ленточный фундамент М-300</option>
                    </select>
                  </div>
                </>
              )}

            </div>

            {/* Right Summary Card in Clean Light Tone */}
            <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-md relative">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-5">
                <div>
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Итого к оплате:</span>
                  <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Скидка {discountPercent}% при заявке онлайн
                  </div>
                </div>
                <span className="bg-orange-100 text-orange-700 border border-orange-200 text-xs font-extrabold px-2.5 py-1 rounded-lg">
                  -{discountPercent}% скидка
                </span>
              </div>

              {/* Price display */}
              <div className="mb-6 space-y-1">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-heading tracking-tight">
                    {discountedTotal.toLocaleString('ru-RU')} ₽
                  </span>
                  <span className="text-base sm:text-lg text-slate-400 line-through font-semibold">
                    {activeBaseTotal.toLocaleString('ru-RU')} ₽
                  </span>
                </div>
                <div className="text-xs text-emerald-600 font-bold">
                  Ваша чистая выгода: {savings.toLocaleString('ru-RU')} ₽
                </div>

                <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 leading-relaxed mt-4">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <EditableText id="calc.approx_note" multiline>
                      Это примерный расчёт, за точным расчётом обращайтесь по заявке. Инженер сделает детальный расчёт сметы и проект под ваш участок.
                    </EditableText>
                  </span>
                </div>

                <div className="mt-4 space-y-2 border-t border-slate-200 pt-4 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Выезд замерщика</span>
                    <span className="font-bold text-slate-800">
                      {measureCost.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Вычитается при заключении договора</span>
                    <span className="font-bold text-emerald-600">
                      −{measureCost.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>
                  <p className="text-[11px] text-orange-700 bg-orange-50 border border-orange-200 rounded-lg px-2.5 py-2 leading-relaxed font-medium">
                    <EditableText id="calc.measure_subnote">
                      Замер фактически бесплатный: 3 000 ₽ возвращаются вам скидкой при подписании
                      договора.
                    </EditableText>
                  </p>
                </div>
              </div>

              {/* Features list */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 mb-6 space-y-2 text-xs text-slate-700">
                <div className="font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-orange-600" />
                  В смету уже включено:
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>
                    Выезд замерщика — <strong>3 000 ₽</strong>, вычитается из стоимости при
                    заключении договора
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Проект и расчет снеговых нагрузок — <strong>0 ₽</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Толстостенная сталь ГОСТ, сварка на производстве</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Официальный договор и гарантия <strong>2 года</strong></span>
                </div>
              </div>

              {/* Lead Form */}
              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center space-y-2 animate-in zoom-in-95">
                  <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">Скидка 2% зафиксирована!</h4>
                  <p className="text-xs text-slate-600">
                    Менеджер свяжется с вами в течение 10 минут, уточнит детали и согласует удобное время бесплатного замера.
                  </p>
                  <a
                    href={MAX_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-[#4A4BD8] hover:text-[#3A3BC8] font-bold pt-1"
                  >
                    Отправить чертёж в MAX →
                  </a>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-3">
                  <div className="text-xs font-bold text-slate-800">
                    <EditableText id="calc.form.title">{`Зафиксировать цену со скидкой ${discountPercent}%:`}</EditableText>
                  </div>

                  <div>
                    <input
                      type="text"
                      placeholder="Ваше имя"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-orange-500 shadow-2xs"
                    />
                  </div>

                  <div>
                    <input
                      type="tel"
                      required
                      placeholder="+7 (___) ___-__-__ *"
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-orange-500 shadow-2xs"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-md shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Отправка расчета...</span>
                    ) : (
                      <>
                        <Flame className="w-4 h-4 text-amber-200" />
                        <span>Зафиксировать цену ({discountedTotal.toLocaleString('ru-RU')} ₽)</span>
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-slate-500 text-center">
                    Без спама и звонков роботов. Конфиденциальность гарантирована.
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
