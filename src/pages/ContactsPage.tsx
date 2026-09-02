import React, { useState } from 'react';
import {
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Building,
  Factory,
  Send,
  CheckCircle2,
  MapPin,
} from 'lucide-react';
import { MaxIcon } from '../components/MaxIcon';
import { useCompanyInfo, useEditablePhones } from '../editor/useCompanyInfo';

interface ContactsPageProps {
  onOpenOrder: (title?: string) => void;
}

export const ContactsPage: React.FC<ContactsPageProps> = ({ onOpenOrder }) => {
  const company = useCompanyInfo();
  const phones = useEditablePhones();
  const MAX_URL = company.maxUrl;
  const COMPANY_INFO = {
    workingHours: company.workingHours,
    email: company.email,
    director: company.director,
    inn: company.inn,
    ogrn: company.ogrn,
    phones,
  };
  const [quickName, setQuickName] = useState('');
  const [quickPhone, setQuickPhone] = useState('');
  const [sent, setSent] = useState(false);

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPhone.trim()) return;
    setSent(true);
    setTimeout(() => {
      onOpenOrder(`Быстрый вопрос со страницы контактов от ${quickName || 'Клиента'} (${quickPhone})`);
    }, 400);
  };

  return (
    <div className="bg-white py-10 sm:py-16">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 2xl:px-10">
        
        {/* Breadcrumb & Header */}
        <div className="mb-10 text-center max-w-3xl mx-auto">
          <div className="text-xs font-semibold text-slate-500 mb-2">
            <span>Главная</span> <span className="mx-1">/</span> <span className="text-orange-600">Контакты и адреса</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 font-heading tracking-tight">
            Контакты «МеталлЦехСтрой»
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed">
            Свяжитесь с нами любым удобным способом или приезжайте на производство в Домодедово!
          </p>
        </div>

        {/* 2 Location Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          
          {/* Main Office */}
          <div className="white-card rounded-3xl p-6 sm:p-8 space-y-4 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-orange-600 uppercase tracking-wider block mb-1">
                Главный офис продаж:
              </span>
              <h3 className="text-lg font-bold text-slate-900 font-heading">
                {company.officeAddress}
              </h3>
              <p className="text-xs text-slate-500 mt-1">Консультация и подписание договоров</p>
            </div>
            <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-orange-600" />
                <span>{COMPANY_INFO.workingHours}</span>
              </div>
              <p className="text-slate-500 text-[11px]">Консультация, образцы, подписание договоров</p>
            </div>
          </div>

          {/* Domodedovo Factory */}
          <div className="white-card rounded-3xl p-6 sm:p-8 space-y-4 border-2 border-orange-200 relative overflow-hidden bg-gradient-to-br from-white via-orange-50/20 to-amber-50/30">
            <div className="w-12 h-12 rounded-2xl bg-orange-600 flex items-center justify-center text-white shadow-md">
              <Factory className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-orange-700 uppercase tracking-wider block mb-1">
                Производственная база:
              </span>
              <h3 className="text-lg font-bold text-slate-900 font-heading">
                {company.productionAddress}
              </h3>
              <p className="text-xs text-slate-500 mt-1">Собственное производство 1 200 м²</p>
            </div>
            <div className="pt-3 border-t border-slate-200 text-xs text-slate-600 space-y-1">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Склад готовой продукции и профиля</span>
              </div>
              <p className="text-slate-500 text-[11px]">Возможен самовывоз и экскурсия в цех</p>
            </div>
          </div>

        </div>

        {/* Detailed Contacts & Direct Communication */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          
          {/* Phones & Info */}
          <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="text-xl font-extrabold text-slate-900 font-heading">
              Прямые номера телефонов и мессенджеры
            </h3>

            <div className="space-y-3">
              {COMPANY_INFO.phones.map((p, idx) => (
                <div
                  key={idx}
                  className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-orange-300 transition-colors shadow-2xs"
                >
                  <div>
                    <span className="text-xs text-slate-500 font-medium block">{p.label}</span>
                    <a
                      href={`tel:${p.raw}`}
                      className="text-lg sm:text-xl font-extrabold text-slate-900 hover:text-orange-600 transition-colors font-heading"
                    >
                      {p.display}
                    </a>
                  </div>
                  <a
                    href={`tel:${p.raw}`}
                    className="inline-flex items-center justify-center gap-1.5 bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold px-4 py-2 rounded-xl text-xs transition-colors self-start sm:self-auto"
                  >
                    <Phone className="w-3.5 h-3.5 text-orange-600" />
                    <span>Позвонить</span>
                  </a>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <a
                href={MAX_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#5A5CE8] hover:bg-[#4A4BD8] text-white font-bold p-4 rounded-2xl flex items-center justify-center gap-2 text-sm shadow-md shadow-[#5A5CE8]/25 transition-all active:scale-95"
              >
                <MaxIcon className="w-5 h-5" />
                <span>Написать в MAX</span>
              </a>

              <a
                href={`mailto:${COMPANY_INFO.email}`}
                className="bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold p-4 rounded-2xl flex items-center justify-center gap-2 text-sm transition-colors shadow-2xs"
              >
                <Mail className="w-5 h-5 text-orange-600" />
                <span>{COMPANY_INFO.email}</span>
              </a>
            </div>

            {/* Requisites from original site */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2 text-xs text-slate-600">
              <div className="font-bold text-slate-800 uppercase tracking-wider mb-1">
                Реквизиты организации:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>Юридическое лицо: <strong>ООО «МеталлЦехСтрой»</strong></div>
                <div>Генеральный директор: <strong>{COMPANY_INFO.director}</strong></div>
                <div>ИНН: <strong>{COMPANY_INFO.inn}</strong></div>
                <div>ОГРН: <strong>{COMPANY_INFO.ogrn}</strong></div>
              </div>
            </div>
          </div>

          {/* Right Lead form & QR Code */}
          <div className="lg:col-span-5 white-card rounded-3xl p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 font-heading">
                Быстрый вопрос инженеру
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Оставьте контакт, и мы перезвоним в течение 10 минут
              </p>
            </div>

            {sent ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-slate-900 text-base">Запрос принят!</h4>
                <p className="text-xs text-slate-600">Инженер уже набирает ваш номер.</p>
              </div>
            ) : (
              <form onSubmit={handleQuickSubmit} className="space-y-3">
                <div>
                  <input
                    type="text"
                    placeholder="Ваше имя"
                    value={quickName}
                    onChange={(e) => setQuickName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-orange-500"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    required
                    placeholder="+7 (___) ___-__-__ *"
                    value={quickPhone}
                    onChange={(e) => setQuickPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-orange-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Получить ответ инженера</span>
                </button>
              </form>
            )}

            {/* QR Code as in the real site */}
            <div className="pt-4 border-t border-slate-200 flex items-center gap-4">
              <img
                src="https://xn--80ajbqiadvrjgf1bm.xn--p1ai/wp-content/uploads/freshizer/d26b2d5e971637e3569f37db16525c0c_qrcode-120-120-c-100.png"
                alt="QR код металлцехстрой.рф"
                className="w-20 h-20 rounded-xl bg-white border border-slate-200 p-1 shrink-0"
              />
              <div className="text-xs text-slate-500">
                <strong className="text-slate-800 block mb-0.5">Наш сайт на смартфоне</strong>
                Наведите камеру мобильного телефона, чтобы мгновенно открыть сайт и сохранить контакты.
              </div>
            </div>

          </div>

        </div>

        {/* ===== Карта производства (Яндекс.Карты) ===== */}
        <div className="mt-10 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 font-heading flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-600" />
                Производство на карте
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {company.productionAddress} — собственный цех металлоконструкций и склад готовой
                продукции.
              </p>
            </div>
            <a
              href="https://yandex.ru/maps/?text=Московская%20область%2C%20г.%20Домодедово%2C%20ул.%20Станционная%2C%20д.%2026"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold py-2 px-3.5 rounded-xl transition-colors shrink-0"
            >
              Открыть в Яндекс.Картах
            </a>
          </div>

          <iframe
            src="https://yandex.ru/map-widget/v1/?text=%D0%9C%D0%BE%D1%81%D0%BA%D0%BE%D0%B2%D1%81%D0%BA%D0%B0%D1%8F%20%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8C%2C%20%D0%B3.%20%D0%94%D0%BE%D0%BC%D0%BE%D0%B4%D0%B5%D0%B4%D0%BE%D0%B2%D0%BE%2C%20%D1%83%D0%BB.%20%D0%A1%D1%82%D0%B0%D0%BD%D1%86%D0%B8%D0%BE%D0%BD%D0%BD%D0%B0%D1%8F%2C%20%D0%B4.%2026&z=16&l=map"
            title="Производство МеталлЦехСтрой на карте — Домодедово, ул. Станционная, 26"
            className="w-full h-[380px] sm:h-[450px] border-0 block"
            allowFullScreen
            loading="lazy"
          />
        </div>

      </div>
    </div>
  );
};
