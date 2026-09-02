import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Phone,
  MapPin,
  Menu,
  X,
  ChevronDown,
  Calculator,
  Compass,
  Clock,
  Mail,
  Home,
  Ruler,
  Car,
  Fence,
  Warehouse,
  Wrench,
  Gift,
  Camera,
  Star,
  Contact,
  ChevronRight,
  FileText,
  LayoutGrid,
  Video,
} from 'lucide-react';
import { MaxIcon } from './MaxIcon';
import { useCompanyInfo, useEditablePhones } from '../editor/useCompanyInfo';
import { useEditor } from '../editor/EditorContext';
import { EditableText } from '../editor/Editable';
import { requestFilter } from '../editor/navFilter';

export type PageId =
  | 'home'
  | 'standard'
  | 'canopies'
  | 'fences'
  | 'hangars'
  | 'services'
  | 'promotions'
  | 'gallery'
  | 'video'
  | 'reviews'
  | 'contacts'
  | 'calculator';

interface HeaderProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  onOpenOrder: (title?: string) => void;
}

interface SubItem {
  label: string;
  desc?: string;
  page: PageId;
  filter?: string;
}

interface NavItemDef {
  id: PageId;
  label: string;
  shortLabel?: string;
  icon: React.ElementType;
  subs?: SubItem[];
}

const NAV_ITEMS: NavItemDef[] = [
  { id: 'home', label: 'Главная', icon: Home },
  { id: 'standard', label: 'Стандартные навесы', shortLabel: 'Стандартные', icon: Ruler },
  {
    id: 'canopies',
    label: 'Навесы',
    icon: Car,
    subs: [
      { label: 'Все навесы с реальными фото', desc: '52 готовых объекта', page: 'canopies', filter: 'all' },
      { label: 'Арочные', desc: 'Классическая форма', page: 'canopies', filter: 'Арочные' },
      { label: 'Двухскатные', desc: 'В стиле крыши дома', page: 'canopies', filter: 'Двухскатные' },
      { label: 'Односкатные', desc: 'Практичный уклон', page: 'canopies', filter: 'Односкатные' },
      { label: 'С фризом', desc: 'High-Tech дизайн', page: 'canopies', filter: 'С фризом' },
      { label: 'Консольные', desc: 'Стойки с одной стороны', page: 'canopies', filter: 'Консольные' },
      { label: 'Козырьки и террасы', desc: 'Над входом и у дома', page: 'canopies', filter: 'Козырьки' },
      { label: 'Стандартные навесы с ценами', desc: '32 типовые модели', page: 'standard' },
    ],
  },
  {
    id: 'fences',
    label: 'Заборы и ворота',
    shortLabel: 'Заборы',
    icon: Fence,
    subs: [
      { label: 'Все заборы и ворота', page: 'fences', filter: 'all' },
      { label: 'Из профнастила', desc: 'от 835 ₽/м²', page: 'fences', filter: 'Профнастил' },
      { label: 'Евроштакетник', desc: 'от 950 ₽/м²', page: 'fences', filter: 'Евроштакетник' },
      { label: 'Жалюзи', desc: 'от 1 450 ₽/м²', page: 'fences', filter: 'Жалюзи' },
      { label: '3D-сетка и рабица', desc: 'от 285 ₽/м²', page: 'fences', filter: '3D Сетка' },
      { label: 'На монолитном основании', desc: 'от 2 400 ₽/м.п.', page: 'fences', filter: 'Основание' },
      { label: 'Откатные ворота', desc: 'с автоматикой', page: 'fences', filter: 'Откатные' },
      { label: 'Распашные ворота', desc: 'с калиткой', page: 'fences', filter: 'Распашные' },
    ],
  },
  {
    id: 'hangars',
    label: 'Ангары',
    icon: Warehouse,
    subs: [
      { label: 'Все ангары и склады', page: 'hangars' },
      { label: 'Холодные ангары', desc: 'от 7 500 ₽/м²', page: 'hangars', filter: 'cold' },
      { label: 'Тёплые из сэндвич-панелей', desc: 'от 12 500 ₽/м²', page: 'hangars', filter: 'warm' },
    ],
  },
  { id: 'services', label: 'Услуги', icon: Wrench },
  { id: 'promotions', label: 'Акции', icon: Gift },
  { id: 'gallery', label: 'Фото работ', shortLabel: 'Фото', icon: Camera },
  {
    id: 'video',
    label: 'Видео',
    icon: Video,
    subs: [
      { label: 'Все видео', desc: 'Канал на RUTUBE', page: 'video', filter: 'all' },
      { label: 'Навесы', desc: 'Монтаж и готовые объекты', page: 'video', filter: 'Навесы' },
      { label: 'Заборы и ворота', desc: 'Установка ограждений', page: 'video', filter: 'Заборы и ворота' },
      { label: 'Обшивка', desc: 'Евробрус и фасадные панели', page: 'video', filter: 'Обшивка' },
      { label: 'Производство', desc: 'Работа цеха и бригад', page: 'video', filter: 'Производство' },
    ],
  },
  { id: 'reviews', label: 'Отзывы', icon: Star },
  { id: 'contacts', label: 'Контакты', icon: Contact },
];

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  onOpenOrder,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [phonesHover, setPhonesHover] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const closeTimer = useRef<number | null>(null);
  const { editMode, setValue } = useEditor();

  const company = useCompanyInfo();
  const phones = useEditablePhones();
  const MAX_URL = company.maxUrl;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleNavClick = (page: PageId, filter?: string) => {
    if (filter) requestFilter(page, filter);
    onNavigate(page);
    setOpenMenu(null);
    setMobileMenuOpen(false);
    setPhonesHover(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLeaveRequest = () => {
    setMobileMenuOpen(false);
    setPhonesHover(false);
    if (currentPage !== 'home') {
      onNavigate('home');
      setTimeout(() => {
        const el = document.getElementById('order-form');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      const el = document.getElementById('order-form');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openSub = useCallback((id: string) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setOpenMenu(id);
  }, []);

  const scheduleClose = useCallback(() => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenMenu(null), 140);
  }, []);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Логотип слишком большой. Максимум 2 МБ.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setValue('brand.logo', String(reader.result));
    reader.readAsDataURL(file);
  };

  return (
    <header
      className={`sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b transition-all duration-300 ${
        scrolled ? 'border-slate-200 shadow-md shadow-slate-900/5' : 'border-slate-100 shadow-xs'
      }`}
    >
      {/* Верхняя информационная панель */}
      <div className="hidden xl:block bg-gradient-to-r from-slate-50 via-white to-slate-50 border-b border-slate-100 text-[12px] text-slate-600">
        <div className="max-w-[1680px] mx-auto px-6 2xl:px-10 flex items-center justify-between gap-4 py-2">
          <div className="flex items-center gap-5 min-w-0">
            <div className="flex items-center gap-2 font-semibold text-slate-800 shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <Clock className="w-3.5 h-3.5 text-orange-600" />
              <span>{company.workingHours}</span>
            </div>
            <div className="h-3.5 w-px bg-slate-200" />
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-orange-600 shrink-0" />
              <span className="truncate">Офис: {company.officeAddress}</span>
            </div>
            <div className="h-3.5 w-px bg-slate-200" />
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="truncate">Производство: {company.productionAddress}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href={`mailto:${company.email}`}
              className="flex items-center gap-1.5 hover:text-orange-600 transition-colors font-medium"
            >
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{company.email}</span>
            </a>
            <a
              href={MAX_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#4A4BD8] hover:text-[#3A3BC8] font-semibold transition-colors bg-[#EEF0FF] hover:bg-[#E1E4FF] px-2.5 py-1 rounded-full"
            >
              <MaxIcon className="w-3.5 h-3.5" />
              <span>Мессенджер MAX</span>
            </a>
          </div>
        </div>
      </div>

      {/* ===== Основной ряд ===== */}
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 2xl:px-10">
        <div className="flex items-center justify-between gap-3 py-3">
          {/* Логотип */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 sm:gap-3 text-left group cursor-pointer shrink-0"
          >
              <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full shadow-lg shadow-orange-500/15 group-hover:scale-105 transition-all shrink-0 ring-2 ring-orange-100 overflow-hidden bg-white">
                <EditableLogo onUpload={handleLogoUpload} editMode={editMode} />
              </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[15px] sm:text-lg xl:text-xl font-black tracking-tight text-slate-950 font-heading uppercase leading-none">
                  <EditableText id="brand.name">МеталлЦехСтрой</EditableText>
                </span>
                <span className="hidden sm:inline-flex items-center bg-gradient-to-r from-orange-50 to-amber-50 text-orange-700 border border-orange-200/80 text-[10px] font-extrabold px-2 py-0.5 rounded-full tracking-wide">
                  <EditableText id="brand.tag">Производство</EditableText>
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium mt-0.5 hidden xs:block truncate">
                <EditableText id="brand.slogan">Навесы · Заборы · Ангары · Москва и МО</EditableText>
              </p>
            </div>
          </button>

          {/* Правая часть */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <button
              onClick={() => handleNavClick('calculator')}
              className={`hidden lg:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentPage === 'calculator'
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Калькулятор</span>
            </button>

            {/* Телефон + hover-список */}
            <div
              className="relative hidden md:block text-right"
              onMouseEnter={() => setPhonesHover(true)}
              onMouseLeave={() => setPhonesHover(false)}
            >
              <a
                href={`tel:${phones[0].raw}`}
                className="text-[15px] lg:text-base font-extrabold text-slate-950 hover:text-orange-600 transition-colors flex items-center justify-end gap-1.5 font-heading leading-none"
              >
                <span className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center">
                  <Phone className="w-3.5 h-3.5 text-orange-600" />
                </span>
                <span>{phones[0].display}</span>
              </a>
              <div className="flex items-center justify-end gap-1 text-[11px] text-slate-500 mt-0.5 cursor-default">
                <span>ещё 2 номера</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${phonesHover ? 'rotate-180 text-orange-600' : ''}`} />
              </div>

              <div
                className={`absolute right-0 top-full mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-2xl p-2 z-50 text-left transition-all duration-200 ${
                  phonesHover ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-1 pointer-events-none'
                }`}
              >
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 py-2 border-b border-slate-100">
                  Телефоны производства
                </div>
                {phones.map((phone, idx) => (
                  <a
                    key={idx}
                    href={`tel:${phone.raw}`}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm text-slate-800 hover:bg-orange-50 rounded-xl hover:text-orange-600 transition-colors"
                  >
                    <span className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                      <Phone className="w-3.5 h-3.5 text-orange-600" />
                    </span>
                    <span>
                      <span className="font-bold font-heading block">{phone.display}</span>
                      <span className="text-xs text-slate-500 font-normal">{phone.label}</span>
                    </span>
                  </a>
                ))}
                <div className="border-t border-slate-100 mt-1 pt-1">
                  <a
                    href={MAX_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 px-3 py-2.5 text-xs font-semibold text-[#4A4BD8] hover:bg-[#F2F3FF] rounded-xl transition-colors"
                  >
                    <MaxIcon className="w-4 h-4" />
                    <span>Написать в MAX инженеру</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Кнопка 1 */}
            <button
              onClick={() => onOpenOrder('Вызов замерщика (3 000 ₽ — вычитается из стоимости заказа)')}
              className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white text-xs lg:text-sm font-bold py-2.5 px-3.5 lg:px-4 rounded-xl shadow-md shadow-orange-500/25 hover:shadow-orange-500/35 transition-all cursor-pointer active:scale-95"
            >
              <Compass className="w-4 h-4" />
              <span className="whitespace-nowrap">Вызвать замерщика</span>
            </button>

            {/* Кнопка 2 */}
            <button
              onClick={handleLeaveRequest}
              className="hidden md:inline-flex items-center gap-2 bg-white hover:bg-orange-50 text-slate-800 hover:text-orange-700 border border-slate-300 hover:border-orange-400 text-xs lg:text-sm font-bold py-2.5 px-3.5 lg:px-4 rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <FileText className="w-4 h-4 text-orange-600" />
              <span className="whitespace-nowrap">Оставить заявку</span>
            </button>

            {/* Мобильные иконки */}
            <a
              href={MAX_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Написать в MAX"
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-[#EEF0FF] text-[#5A5CE8] border border-[#DDE0FF] hover:bg-[#E1E4FF] transition-colors"
            >
              <MaxIcon className="w-5 h-5" />
            </a>
            <a
              href={`tel:${phones[0].raw}`}
              aria-label="Позвонить"
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-orange-50 text-orange-600 border border-orange-100 hover:bg-orange-100 transition-colors"
            >
              <Phone className="w-5 h-5" />
            </a>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Меню"
              className={`xl:hidden w-10 h-10 flex items-center justify-center rounded-xl border transition-all cursor-pointer ${
                mobileMenuOpen
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* ===== Ряд навигации с выпадающими меню ===== */}
        <nav
          className="hidden xl:flex items-center justify-center gap-1 border-t border-slate-100 py-1.5"
          onMouseLeave={scheduleClose}
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = currentPage === item.id || (item.subs && item.subs.some((s) => s.page === currentPage));
            const hasSubs = !!item.subs?.length;
            const isOpen = openMenu === item.id;

            return (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() => (hasSubs ? openSub(item.id) : scheduleClose())}
              >
                <button
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-3 2xl:px-3.5 py-2 rounded-xl text-[13px] 2xl:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 group whitespace-nowrap tracking-tight ${
                    active
                      ? 'text-orange-700 bg-orange-50 shadow-xs'
                      : 'text-slate-900 hover:text-orange-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      active ? 'text-orange-600' : 'text-slate-500 group-hover:text-orange-500'
                    } transition-colors`}
                  />
                  <span>{item.shortLabel || item.label}</span>
                  {hasSubs && (
                    <ChevronDown
                      className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-orange-600' : ''}`}
                    />
                  )}
                  {active && (
                    <span className="absolute -bottom-[7px] left-1/2 -translate-x-1/2 w-7 h-0.5 bg-orange-500 rounded-full" />
                  )}
                </button>

                {/* Выпадающее меню */}
                {hasSubs && (
                  <div
                    onMouseEnter={() => openSub(item.id)}
                    onMouseLeave={scheduleClose}
                    className={`absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50 transition-all duration-200 ${
                      isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-1.5 pointer-events-none'
                    }`}
                  >
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl shadow-slate-900/10 p-2 w-72">
                      <div className="flex items-center gap-2 px-3 pt-1.5 pb-2 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                        <LayoutGrid className="w-3.5 h-3.5 text-orange-500" />
                        {item.label}
                      </div>
                      <div className="max-h-[60vh] overflow-y-auto">
                        {item.subs!.map((sub) => (
                          <button
                            key={sub.label}
                            onClick={() => handleNavClick(sub.page, sub.filter)}
                            className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-left hover:bg-orange-50 transition-colors cursor-pointer group/sub"
                          >
                            <span className="min-w-0">
                              <span className="block text-[13px] font-bold text-slate-900 group-hover/sub:text-orange-700 transition-colors truncate">
                                {sub.label}
                              </span>
                              {sub.desc && (
                                <span className="block text-[11px] text-slate-500 truncate">{sub.desc}</span>
                              )}
                            </span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover/sub:text-orange-500 group-hover/sub:translate-x-0.5 transition-all shrink-0" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Мобильное меню */}
      {mobileMenuOpen && (
        <div className="xl:hidden fixed inset-0 top-[57px] sm:top-[61px] z-50">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute inset-x-0 top-0 max-h-[calc(100dvh-57px)] overflow-y-auto bg-white border-b border-slate-200 shadow-2xl animate-in slide-in-from-top duration-200">
            <div className="px-4 sm:px-6 py-5 space-y-4">
              <div className="space-y-2.5">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const active = currentPage === item.id;
                  const expanded = mobileExpanded === item.id;
                  return (
                    <div
                      key={item.id}
                      className={`rounded-2xl border overflow-hidden transition-colors ${
                        active ? 'border-orange-300 bg-orange-50/60' : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className="flex items-stretch">
                        <button
                          onClick={() => handleNavClick(item.id, item.subs ? item.subs[0]?.filter : undefined)}
                          className="flex-1 flex items-center gap-3 p-3.5 text-left cursor-pointer"
                        >
                          <span
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                              active ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </span>
                          <span className={`text-sm font-bold ${active ? 'text-orange-800' : 'text-slate-900'}`}>
                            {item.label}
                          </span>
                        </button>
                        {item.subs && (
                          <button
                            onClick={() => setMobileExpanded(expanded ? null : item.id)}
                            aria-label="Подкатегории"
                            className="w-11 flex items-center justify-center border-l border-slate-100 text-slate-400 cursor-pointer"
                          >
                            <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180 text-orange-600' : ''}`} />
                          </button>
                        )}
                      </div>
                      {item.subs && expanded && (
                        <div className="px-3 pb-3 grid grid-cols-2 gap-1.5 animate-in fade-in">
                          {item.subs.map((sub) => (
                            <button
                              key={sub.label}
                              onClick={() => handleNavClick(sub.page, sub.filter)}
                              className="text-left px-3 py-2 rounded-xl bg-slate-50 hover:bg-orange-100 border border-slate-100 transition-colors"
                            >
                              <span className="block text-xs font-bold text-slate-800">{sub.label}</span>
                              {sub.desc && <span className="block text-[10px] text-slate-500">{sub.desc}</span>}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                <button
                  onClick={() => handleNavClick('calculator')}
                  className={`w-full p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex items-center justify-between ${
                    currentPage === 'calculator'
                      ? 'bg-amber-500 border-amber-500 text-white shadow-md'
                      : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 text-amber-900'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        currentPage === 'calculator' ? 'bg-white/20 text-white' : 'bg-amber-500 text-white'
                      }`}
                    >
                      <Calculator className="w-4 h-4" />
                    </span>
                    <span>
                      <span className="block text-sm font-bold">Калькулятор стоимости</span>
                      <span className={`text-[11px] font-medium ${currentPage === 'calculator' ? 'text-amber-100' : 'text-amber-700/80'}`}>
                        Расчёт онлайн за 1 минуту
                      </span>
                    </span>
                  </span>
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </button>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 space-y-3">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Связаться с производством</div>
                {phones.map((phone, idx) => (
                  <a key={idx} href={`tel:${phone.raw}`} className="flex items-center gap-2.5 py-1 text-slate-800 hover:text-orange-600 transition-colors">
                    <span className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                      <Phone className="w-3.5 h-3.5 text-orange-600" />
                    </span>
                    <span>
                      <span className="block text-sm font-bold font-heading">{phone.display}</span>
                      <span className="text-[11px] text-slate-500">{phone.label}</span>
                    </span>
                  </a>
                ))}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <a
                    href={MAX_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#5A5CE8] text-white text-xs font-bold"
                  >
                    <MaxIcon className="w-3.5 h-3.5" />
                    Мессенджер MAX
                  </a>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenOrder('Вызов замерщика (3 000 ₽ — вычитается из стоимости заказа)');
                    }}
                    className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-orange-600 text-white text-xs font-bold cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Вызвать замерщика
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 space-y-1.5 px-1 pb-2">
                <p className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                  <span>Офис: {company.officeAddress}</span>
                </p>
                <p className="flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <span>Производство: {company.productionAddress}</span>
                </p>
                <p className="flex items-start gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{company.workingHours}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

/** Логотип с возможностью замены в режиме редактора */
function EditableLogo({
  onUpload,
  editMode,
}: {
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  editMode: boolean;
}) {
  const { getImage } = useEditor();
  const src = getImage('brand.logo', '');

  if (editMode) {
    return (
      <label className="w-full h-full flex items-center justify-center cursor-pointer relative group/edit">
        {src ? (
          <img src={src} alt="Логотип" className="w-full h-full object-cover" />
        ) : (
          <img src="/logo.svg" alt="Логотип МеталлЦехСтрой" className="w-full h-full object-contain" />
        )}
        <div className="absolute inset-0 bg-black/0 group-hover/edit:bg-black/50 transition-colors flex items-center justify-center rounded-full">
          <span className="opacity-0 group-hover/edit:opacity-100 text-white text-[10px] font-bold bg-black/60 px-2 py-1 rounded-lg transition-opacity whitespace-nowrap">
            Заменить лого
          </span>
        </div>
        <input type="file" accept="image/*" onChange={onUpload} className="hidden" />
      </label>
    );
  }

  return (
    <img src={src || '/logo.svg'} alt="Логотип МеталлЦехСтрой" className="w-full h-full object-cover" />
  );
}
