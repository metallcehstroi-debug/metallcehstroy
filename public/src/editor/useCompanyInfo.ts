import { useEditor } from './EditorContext';
import { COMPANY_INFO } from '../data/siteData';

export interface EditableCompanyInfo {
  phone1: string;
  phone1raw: string;
  phone1label: string;
  phone2: string;
  phone2raw: string;
  phone2label: string;
  phone3: string;
  phone3raw: string;
  phone3label: string;
  email: string;
  officeAddress: string;
  productionAddress: string;
  secondOffice: string;
  workingHours: string;
  director: string;
  maxUrl: string;
  inn: string;
  ogrn: string;
}

/** Возвращает контактные данные с учётом правок редактора */
export function useCompanyInfo(): EditableCompanyInfo {
  const { getText } = useEditor();
  return {
    phone1: getText('company.phone1', COMPANY_INFO.phones[0].display),
    phone1raw: getText('company.phone1raw', COMPANY_INFO.phones[0].raw),
    phone1label: getText('company.phone1label', COMPANY_INFO.phones[0].label),
    phone2: getText('company.phone2', COMPANY_INFO.phones[1].display),
    phone2raw: getText('company.phone2raw', COMPANY_INFO.phones[1].raw),
    phone2label: getText('company.phone2label', COMPANY_INFO.phones[1].label),
    phone3: getText('company.phone3', COMPANY_INFO.phones[2].display),
    phone3raw: getText('company.phone3raw', COMPANY_INFO.phones[2].raw),
    phone3label: getText('company.phone3label', COMPANY_INFO.phones[2].label),
    email: getText('company.email', COMPANY_INFO.email),
    officeAddress: getText('company.officeAddress', COMPANY_INFO.officeAddress),
    productionAddress: getText('company.productionAddress', COMPANY_INFO.productionAddress),
    secondOffice: getText('company.secondOffice', COMPANY_INFO.secondOffice),
    workingHours: getText('company.workingHours', COMPANY_INFO.workingHours),
    director: getText('company.director', COMPANY_INFO.director),
    maxUrl: getText('company.maxUrl', COMPANY_INFO.maxUrl),
    inn: getText('company.inn', COMPANY_INFO.inn),
    ogrn: getText('company.ogrn', COMPANY_INFO.ogrn),
  };
}

/** Массив телефонов с учётом правок (для рендера списков) */
export function useEditablePhones() {
  const info = useCompanyInfo();
  return [
    { display: info.phone1, raw: info.phone1raw, label: info.phone1label },
    { display: info.phone2, raw: info.phone2raw, label: info.phone2label },
    { display: info.phone3, raw: info.phone3raw, label: info.phone3label },
  ];
}
