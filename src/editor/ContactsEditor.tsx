import React from 'react';
import { useEditor } from './EditorContext';
import { useCompanyInfo } from './useCompanyInfo';
import { X, Phone, Mail, MapPin, Clock, User, Link2, Building2, Save } from 'lucide-react';

interface ContactsEditorProps {
  open: boolean;
  onClose: () => void;
}

/** Централизованный редактор контактов и реквизитов компании */
export const ContactsEditor: React.FC<ContactsEditorProps> = ({ open, onClose }) => {
  const { setValue, notify } = useEditor();
  const info = useCompanyInfo();

  if (!open) return null;

  const Field = ({
    label,
    icon: Icon,
    valueKey,
    value,
    placeholder,
    multiline,
  }: {
    label: string;
    icon: React.ElementType;
    valueKey: string;
    value: string;
    placeholder?: string;
    multiline?: boolean;
  }) => (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 mb-1">
        <Icon className="w-3.5 h-3.5 text-orange-600" />
        {label}
      </label>
      {multiline ? (
        <textarea
          defaultValue={value}
          placeholder={placeholder}
          rows={2}
          onBlur={(e) => setValue(valueKey, e.target.value)}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 outline-none focus:border-orange-500 resize-none"
        />
      ) : (
        <input
          defaultValue={value}
          placeholder={placeholder}
          onBlur={(e) => setValue(valueKey, e.target.value)}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 outline-none focus:border-orange-500"
        />
      )}
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-[135] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[88vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Шапка */}
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
          <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
            <Phone className="w-5 h-5 text-orange-600" /> Контакты и реквизиты
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <p className="text-xs text-slate-500 -mt-2">
            Измените контакты — они автоматически обновятся во всей шапке, футере и на странице
            контактов. Изменения сохраняются автоматически.
          </p>

          {/* Телефоны */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-orange-600" /> Телефоны
            </h4>
            {[1, 2, 3].map((n) => (
              <div key={n} className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl">
                <Field
                  label={`Телефон ${n} (отображение)`}
                  icon={Phone}
                  valueKey={`company.phone${n}`}
                  value={(info as any)[`phone${n}`]}
                  placeholder="+7 (___) ___-__-__"
                />
                <Field
                  label="Для звонка (без пробелов)"
                  icon={Phone}
                  valueKey={`company.phone${n}raw`}
                  value={(info as any)[`phone${n}raw`]}
                  placeholder="+7__________"
                />
                <Field
                  label="Подпись"
                  icon={User}
                  valueKey={`company.phone${n}label`}
                  value={(info as any)[`phone${n}label`]}
                  placeholder="Отдел продаж"
                />
              </div>
            ))}
          </div>

          {/* Email + мессенджер */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="E-mail"
              icon={Mail}
              valueKey="company.email"
              value={info.email}
              placeholder="mail@example.ru"
            />
            <Field
              label="Ссылка на мессенджер MAX"
              icon={Link2}
              valueKey="company.maxUrl"
              value={info.maxUrl}
              placeholder="https://max.ru/u/..."
            />
          </div>

          {/* Адреса */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-orange-600" /> Адреса
            </h4>
            <Field
              label="Главный офис"
              icon={Building2}
              valueKey="company.officeAddress"
              value={info.officeAddress}
              multiline
            />
            <Field
              label="Производство"
              icon={Building2}
              valueKey="company.productionAddress"
              value={info.productionAddress}
              multiline
            />
            <Field
              label="Дополнительный офис"
              icon={Building2}
              valueKey="company.secondOffice"
              value={info.secondOffice}
              multiline
            />
          </div>

          {/* Прочее */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="Режим работы"
              icon={Clock}
              valueKey="company.workingHours"
              value={info.workingHours}
            />
            <Field
              label="Генеральный директор"
              icon={User}
              valueKey="company.director"
              value={info.director}
            />
            <Field label="ИНН" icon={Building2} valueKey="company.inn" value={info.inn} />
            <Field label="ОГРН" icon={Building2} valueKey="company.ogrn" value={info.ogrn} />
          </div>

          <button
            onClick={() => {
              notify('Контакты сохранены');
              onClose();
            }}
            className="w-full inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl text-sm transition-colors"
          >
            <Save className="w-4 h-4" /> Готово
          </button>
        </div>
      </div>
    </div>
  );
};
