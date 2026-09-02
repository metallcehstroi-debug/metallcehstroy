import { useEffect } from 'react';

const KEY = 'mcs_pending_filter';
const EVENT = 'mcs:filter';

/** Запросить применение фильтра на целевой странице и перейти к ней */
export function requestFilter(page: string, filter: string) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ page, filter, ts: Date.now() }));
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { page, filter } }));
}

/** Хук: страница подписывается на входящий фильтр (при переходе из меню) */
export function useAppliedFilter(page: string, apply: (filter: string) => void) {
  useEffect(() => {
    // Разовое применение ожидающего фильтра
    try {
      const raw = sessionStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.page === page) {
          sessionStorage.removeItem(KEY);
          apply(parsed.filter);
        }
      }
    } catch {
      /* ignore */
    }

    // Живые события (если пользователь уже на странице)
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { page: string; filter: string };
      if (detail && detail.page === page) apply(detail.filter);
    };
    window.addEventListener(EVENT, handler);
    return () => window.removeEventListener(EVENT, handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);
}
