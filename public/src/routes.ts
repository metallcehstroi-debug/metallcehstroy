import type { PageId } from './components/Header';

export interface SiteRoute {
  page: PageId;
  path: string;
  filter?: string;
}

export const SITE_ROUTES: SiteRoute[] = [
  { page: 'home', path: '/' },
  { page: 'standard', path: '/стандартные-навесы' },
  { page: 'canopies', path: '/навесы', filter: 'all' },
  { page: 'canopies', path: '/навесы/арочные', filter: 'Арочные' },
  { page: 'canopies', path: '/навесы/двухскатные', filter: 'Двухскатные' },
  { page: 'canopies', path: '/навесы/односкатные', filter: 'Односкатные' },
  { page: 'canopies', path: '/навесы/с-фризом', filter: 'С фризом' },
  { page: 'canopies', path: '/навесы/консольные', filter: 'Консольные' },
  { page: 'canopies', path: '/навесы/козырьки-и-террасы', filter: 'Козырьки' },
  { page: 'fences', path: '/заборы-и-ворота', filter: 'all' },
  { page: 'fences', path: '/заборы/из-профнастила', filter: 'Профнастил' },
  { page: 'fences', path: '/заборы/евроштакетник', filter: 'Евроштакетник' },
  { page: 'fences', path: '/заборы/жалюзи', filter: 'Жалюзи' },
  { page: 'fences', path: '/заборы/сетка', filter: '3D Сетка' },
  { page: 'fences', path: '/заборы/на-монолитном-основании', filter: 'Основание' },
  { page: 'fences', path: '/ворота/откатные', filter: 'Откатные' },
  { page: 'fences', path: '/ворота/распашные', filter: 'Распашные' },
  { page: 'hangars', path: '/ангары' },
  { page: 'hangars', path: '/ангары/холодные', filter: 'cold' },
  { page: 'hangars', path: '/ангары/тёплые', filter: 'warm' },
  { page: 'services', path: '/услуги' },
  { page: 'promotions', path: '/акции' },
  { page: 'gallery', path: '/фото-работ' },
  { page: 'video', path: '/видео', filter: 'all' },
  { page: 'video', path: '/видео/навесы', filter: 'Навесы' },
  { page: 'video', path: '/видео/заборы-и-ворота', filter: 'Заборы и ворота' },
  { page: 'video', path: '/видео/обшивка', filter: 'Обшивка' },
  { page: 'video', path: '/видео/производство', filter: 'Производство' },
  { page: 'reviews', path: '/отзывы' },
  { page: 'contacts', path: '/контакты' },
  { page: 'calculator', path: '/калькулятор' },
];

const normalizePath = (path: string) => {
  let decoded = path;
  try { decoded = decodeURI(path); } catch { /* malformed URL: use source */ }
  return decoded.length > 1 ? decoded.replace(/\/+$/, '') : decoded;
};

export function routeFromPath(path = window.location.pathname): SiteRoute {
  const normalized = normalizePath(path);
  return SITE_ROUTES.find((route) => route.path === normalized) ?? SITE_ROUTES[0];
}

export function pathForRoute(page: PageId, filter?: string): string {
  return (
    SITE_ROUTES.find((route) => route.page === page && route.filter === filter)?.path ??
    SITE_ROUTES.find((route) => route.page === page && !route.filter)?.path ??
    SITE_ROUTES.find((route) => route.page === page)?.path ??
    '/'
  );
}
