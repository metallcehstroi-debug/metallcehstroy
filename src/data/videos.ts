/** Видео с официального канала МеталлЦехСтрой на RUTUBE
 *  https://rutube.ru/channel/41778134/
 *  Названия взяты напрямую с канала. */

export interface VideoItem {
  id: string;
  /** Хеш видео на RUTUBE */
  hash: string;
  title: string;
  category: 'Навесы' | 'Заборы и ворота' | 'Обшивка' | 'Производство';
  views?: string;
  age?: string;
  isShort?: boolean;
}

export const RUTUBE_CHANNEL = 'https://rutube.ru/channel/41778134/';

/** Ссылка на плеер для встраивания */
export function rutubeEmbed(hash: string): string {
  return `https://rutube.ru/play/embed/${hash}/`;
}

/** Ссылка на страницу видео */
export function rutubeWatch(hash: string, isShort?: boolean): string {
  return isShort ? `https://rutube.ru/shorts/${hash}/` : `https://rutube.ru/video/${hash}/`;
}

export const VIDEOS: VideoItem[] = [
  {
    id: 'v1',
    hash: 'ad852f61bd93f7ac1132a96c954ea022',
    title: 'Забор жалюзи с откатными воротами с автоматикой',
    category: 'Заборы и ворота',
    views: '44 просмотра',
    age: '8 месяцев назад',
  },
  {
    id: 'v2',
    hash: '5a97f5169d933092fa755debf8e2c443',
    title: 'Обшивка навеса евробрусом, с распашными воротами, с дверью и с окнами',
    category: 'Обшивка',
    views: '17 просмотров',
    age: '8 месяцев назад',
  },
  {
    id: 'v3',
    hash: '4b274bdd6809ed2b48154bcbd1069448',
    title: 'Обшивка навеса фасадной панелью',
    category: 'Обшивка',
    views: '193 просмотра',
    age: '8 месяцев назад',
  },
  {
    id: 'v4',
    hash: '93e532dc85b814f490fe7d79ea4c89ac',
    title: 'Хозблок-Шкаф из профнастила с раздвижными дверями',
    category: 'Навесы',
    views: '57 просмотров',
    age: 'год назад',
  },
  {
    id: 'v5',
    hash: 'b19240df272c3a1938c5f186164146f8',
    title: 'Четырёхскатный вальмовый навес из металлочерепицы',
    category: 'Навесы',
    views: '285 просмотров',
    age: 'год назад',
  },
  {
    id: 'v6',
    hash: 'e102b0996d03610d2765257c443572cc',
    title: 'Монтаж односкатного навеса к дому из поликарбоната',
    category: 'Навесы',
    views: '552 просмотра',
    age: 'год назад',
  },
  {
    id: 'v7',
    hash: '37cf9df53b522780436aef06fc17ec7c',
    title: 'Двухскатный навес из профнастила. Цвет: коричневый',
    category: 'Навесы',
    views: '63 просмотра',
    age: '2 года назад',
  },
  {
    id: 'v8',
    hash: '00d620a391399855a4edea6d2b0e4882',
    title: 'Односкатный навес из сотового поликарбоната. Кровля: оранжевая, каркас: белый',
    category: 'Навесы',
    views: '13 просмотров',
    age: '2 года назад',
  },
  {
    id: 'v9',
    hash: 'baf41f0ed1d38228f23091a21577009f',
    title: 'Односкатный навес из монолитного поликарбоната',
    category: 'Навесы',
    views: '39 просмотров',
    age: '2 года назад',
  },
  {
    id: 'v10',
    hash: '68b0fe33694eec1c2560c01e7f3a35f1',
    title: 'Односкатный навес из профнастила',
    category: 'Навесы',
    views: '25 просмотров',
    age: '2 года назад',
  },
  {
    id: 'v11',
    hash: '03ccf9cff6735840b2ac856545c7f392',
    title: 'Односкатный навес с фризом',
    category: 'Навесы',
    views: '110 просмотров',
    age: '2 года назад',
  },
  {
    id: 'v12',
    hash: 'b73a5197e78160ee438c040b5823ab5b',
    title: 'Четырёхскатный навес из металлочерепицы с обшивкой из сотового поликарбоната',
    category: 'Навесы',
    views: '94 просмотра',
    age: '2 года назад',
  },
  {
    id: 'v13',
    hash: '398856ffa9438adb9e490b9274b1daa9',
    title: 'Раздвижной полуарочный навес — козырёк к дому',
    category: 'Навесы',
    views: '49 просмотров',
    age: '2 года назад',
  },
  {
    id: 'v14',
    hash: '9e8827c3fc69d836194ab6de988fdf4a',
    title: 'Полуарочный навес из металлочерепицы',
    category: 'Навесы',
    views: '30 просмотров',
    age: '2 года назад',
  },
  {
    id: 'v15',
    hash: 'cad84e02c131d7411317a653ed8d80e7',
    title: 'Односкатный навес из поликарбоната',
    category: 'Навесы',
    views: '459 просмотров',
    age: '2 года назад',
  },
  {
    id: 'v16',
    hash: '4a0829fad09d2d91a7d04542b4bc252a',
    title: 'Лестница к берегу',
    category: 'Производство',
    views: '13 просмотров',
    age: '3 года назад',
  },
  {
    id: 'v17',
    hash: '4a60d9490049bc548a8e742341b48dfa',
    title: 'Строим новый ангар',
    category: 'Производство',
    age: '3 года назад',
  },
  {
    id: 'v18',
    hash: '8f7b0371f8853103e2bef2bf2a219945',
    title: 'Установка стелы над дорогой',
    category: 'Производство',
    views: '1 просмотр',
    age: '3 года назад',
  },
  {
    id: 'v19',
    hash: '6fdedf11238f0428237d851d9ae9bc00',
    title: 'Откатные ворота, забор из профнастила',
    category: 'Заборы и ворота',
    views: '2 просмотра',
    age: '3 года назад',
  },
  {
    id: 'v20',
    hash: 'ad599918b451c76b1a1c870c2b2f7880',
    title: 'Забор из профнастила',
    category: 'Заборы и ворота',
    views: '1 просмотр',
    age: '3 года назад',
  },
  // ===== SHORTS =====
  {
    id: 's1',
    hash: '3bf9bf28aa077709401ed207bc700083',
    title: 'Односкатный навес из сотового поликарбоната',
    category: 'Навесы',
    views: '20 просмотров',
    isShort: true,
  },
  {
    id: 's2',
    hash: '7a6b8eb4a736b6d101f907342c1bb989',
    title: 'Обшивка навеса евробрусом, с распашными воротами, с дверью и с окнами',
    category: 'Обшивка',
    views: '21 просмотр',
    isShort: true,
  },
  {
    id: 's3',
    hash: '333e81cc7ce4410fb03d49b8fbe377cf',
    title: 'Обшивка навеса фасадной панелью. Процесс нашей работы',
    category: 'Обшивка',
    views: '51 просмотр',
    isShort: true,
  },
];

export const VIDEO_CATEGORIES = ['Все видео', 'Навесы', 'Заборы и ворота', 'Обшивка', 'Производство'];
