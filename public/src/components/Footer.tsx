import React from 'react';
import {
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { COMPANY_INFO as STATIC_INFO } from '../data/siteData';
import { MaxIcon } from './MaxIcon';
import { PageId } from './Header';
import { useCompanyInfo, useEditablePhones } from '../editor/useCompanyInfo';
import { EditableText } from '../editor/Editable';
import { useEditor } from '../editor/EditorContext';

interface FooterProps {
  onNavigate: (page: PageId) => void;
  onOpenOrder: (title?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenOrder }) => {
  const { getImage } = useEditor();
  const logoUrl = getImage('brand.logo', '');
  const company = useCompanyInfo();
  const phones = useEditablePhones();
  const MAX_URL = company.maxUrl;
  const COMPANY_INFO = {
    tagline: STATIC_INFO.tagline,
    director: company.director,
    workingHours: company.workingHours,
    email: company.email,
    officeAddress: company.officeAddress,
    productionAddress: company.productionAddress,
    phones,
  };

  const handleNav = (page: PageId) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-12 text-sm relative">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 2xl:px-10">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-12 border-b border-slate-800">
          
          {/* Column 1: Brand & Bio */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 ring-2 ring-orange-500/30 shadow-md bg-white">
                <img src={logoUrl || '/logo.webp'} alt="Логотип" className="w-full h-full object-cover" />
              </div>
              <span className="text-xl font-extrabold text-white font-heading uppercase tracking-tight">
                <EditableText id="brand.name">МеталлЦехСтрой</EditableText>
              </span>
            </div>

            <EditableText as="p" id="footer.bio" multiline className="text-xs text-slate-400 leading-relaxed max-w-sm block">
              {`${COMPANY_INFO.tagline}. Собственное производство металлоконструкций в г. Домодедово. Более 1000 успешно сданных объектов по всей России с официальной гарантией 2 года.`}
            </EditableText>

            <div className="pt-2 space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>
                  Генеральный директор:{' '}
                  <strong className="text-white">
                    <EditableText id="footer.director">{COMPANY_INFO.director}</EditableText>
                  </strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>
                  Режим работы:{' '}
                  <strong>
                    <EditableText id="footer.hours">{COMPANY_INFO.workingHours}</EditableText>
                  </strong>
                </span>
              </div>
            </div>

            {/* QR Code from original site */}
            <div className="pt-3 flex items-center gap-3">
              <img
                src="https://xn--80ajbqiadvrjgf1bm.xn--p1ai/wp-content/uploads/freshizer/d26b2d5e971637e3569f37db16525c0c_qrcode-120-120-c-100.png"
                alt="QR-код сайта металлцехстрой.рф"
                className="w-16 h-16 rounded-xl bg-white p-1 shadow-sm"
              />
              <div className="text-[11px] text-slate-400">
                <span className="text-slate-200 font-semibold block">Наш сайт на смартфоне</span>
                Наведите камеру телефона, чтобы быстро сохранить контакты производства в телефон.
              </div>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-heading">
              Продукция производства
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => handleNav('standard')}
                  className="text-orange-400 hover:text-orange-300 font-bold transition-colors cursor-pointer text-left"
                >
                  Стандартные навесы (цены)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('canopies')}
                  className="hover:text-orange-400 transition-colors cursor-pointer text-left"
                >
                  Навесы с реальными фото
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('canopies')}
                  className="hover:text-orange-400 transition-colors cursor-pointer text-left"
                >
                  Арочные навесы
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('canopies')}
                  className="hover:text-orange-400 transition-colors cursor-pointer text-left"
                >
                  Двухскатные навесы
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('canopies')}
                  className="hover:text-orange-400 transition-colors cursor-pointer text-left"
                >
                  Консольные навесы
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('canopies')}
                  className="hover:text-orange-400 transition-colors cursor-pointer text-left"
                >
                  Навесы с фризом
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('fences')}
                  className="hover:text-orange-400 transition-colors cursor-pointer text-left"
                >
                  Заборы из профнастила
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('fences')}
                  className="hover:text-orange-400 transition-colors cursor-pointer text-left"
                >
                  Заборы из евроштакетника
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('fences')}
                  className="hover:text-orange-400 transition-colors cursor-pointer text-left"
                >
                  Откатные и распашные ворота
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('hangars')}
                  className="hover:text-orange-400 transition-colors cursor-pointer text-left"
                >
                  Ангары и склады
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Sections Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-heading">
              Страницы сайта
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => handleNav('calculator')}
                  className="text-amber-400 hover:text-amber-300 font-bold transition-colors cursor-pointer text-left"
                >
                  Калькулятор онлайн
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('services')}
                  className="hover:text-orange-400 transition-colors cursor-pointer text-left"
                >
                  Услуги и монтаж
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('gallery')}
                  className="hover:text-orange-400 transition-colors cursor-pointer text-left"
                >
                  Фото сданных объектов
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('video')}
                  className="hover:text-orange-400 transition-colors cursor-pointer text-left"
                >
                  Видео работ (RUTUBE)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('reviews')}
                  className="hover:text-orange-400 transition-colors cursor-pointer text-left"
                >
                  Отзывы заказчиков
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('promotions')}
                  className="hover:text-orange-400 transition-colors cursor-pointer text-left"
                >
                  Онлайн-скидки 2%
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('contacts')}
                  className="hover:text-orange-400 transition-colors cursor-pointer text-left"
                >
                  Контакты и адреса
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenOrder('Вызов замерщика (3 000 ₽ — вычитается из стоимости заказа)')}
                  className="text-orange-400 hover:text-orange-300 font-bold transition-colors cursor-pointer text-left"
                >
                  Вызвать замерщика (3 000 ₽)
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Direct Contacts */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-heading">
              Контакты производства
            </h4>

            <div className="space-y-3 text-xs">
              {/* Phones */}
              <div className="space-y-1">
                <div className="text-slate-400 font-semibold">Телефоны:</div>
                {COMPANY_INFO.phones.map((phone, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <a
                      href={`tel:${phone.raw}`}
                      className="font-bold text-white hover:text-orange-400 text-sm font-heading"
                    >
                      <EditableText id={`footer.phone${i}`}>{phone.display}</EditableText>
                    </a>
                    <span className="text-slate-400 text-[11px]">{phone.label}</span>
                  </div>
                ))}
              </div>

              {/* Email */}
              <div className="flex items-center gap-2 pt-1">
                <Mail className="w-4 h-4 text-orange-500 shrink-0" />
                <a
                  href={`mailto:${COMPANY_INFO.email}`}
                  className="text-slate-300 hover:text-white"
                >
                  <EditableText id="footer.email">{COMPANY_INFO.email}</EditableText>
                </a>
              </div>

              {/* Office Address */}
              <div className="flex items-start gap-2 pt-1">
                <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block font-semibold">Офис в Москве:</span>
                  <EditableText as="span" id="footer.office" className="text-slate-300">
                    {COMPANY_INFO.officeAddress}
                  </EditableText>
                </div>
              </div>

              {/* Production Address */}
              <div className="flex items-start gap-2 pt-1">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block font-semibold">Производство и склад:</span>
                  <EditableText as="span" id="footer.production" className="text-slate-300">
                    {COMPANY_INFO.productionAddress}
                  </EditableText>
                </div>
              </div>

              {/* MAX messenger CTA */}
              <div className="pt-2">
                <a
                  href={MAX_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#5A5CE8] hover:bg-[#6D6EF0] text-white font-bold text-xs transition-colors shadow-sm shadow-[#5A5CE8]/25"
                >
                  <MaxIcon className="w-4 h-4" />
                  <span>Написать в MAX менеджеру</span>
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright & disclaimers */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            <EditableText as="p" id="footer.copyright" className="text-slate-300 font-medium">
              Металлцехстрой.рф © 2026. Все права защищены.
            </EditableText>
            <EditableText as="p" id="footer.disclaimer" multiline className="text-[11px] text-slate-400 mt-1">
              Данный интернет-сайт носит исключительно информационный характер и ни при каких условиях не является публичной офертой (ст. 437 ГК РФ).
            </EditableText>
          </div>

          <div className="text-right shrink-0">
            <EditableText as="span" id="footer.sign" className="text-slate-300 font-semibold">
              Сделано с любовью «МеталлЦехСтрой»
            </EditableText>
          </div>
        </div>

      </div>
    </footer>
  );
};
