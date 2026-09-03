/** Единая отправка заявок на почту производства.
 *  Основной канал — FormsUBMIT (AJAX, без бэкенда), резервный — письмо через почтовый клиент. */

export const LEAD_EMAIL = 'metallcehstroi@ya.ru';

export interface LeadPayload {
  name?: string;
  phone: string;
  product?: string;
  message?: string;
  source?: string;
}

function buildSubject(p: LeadPayload): string {
  return `Заявка с сайта — ${p.product || p.source || 'Общая заявка'} (${p.phone})`;
}

function buildText(p: LeadPayload): string {
  const lines = [
    `Имя: ${p.name || 'не указано'}`,
    `Телефон: ${p.phone}`,
    `Интересует: ${p.product || '—'}`,
    `Комментарий: ${p.message || '—'}`,
    `Источник: ${p.source || 'сайт'}`,
    `Дата: ${new Date().toLocaleString('ru-RU')}`,
  ];
  return lines.join('\n');
}

/** Возвращает канал доставки: 'email' — ушло на сервер, 'mailto' — открылся почтовый клиент */
export async function sendLead(p: LeadPayload): Promise<'email' | 'mailto'> {
  const body = {
    _subject: buildSubject(p),
    _template: 'table',
    _captcha: 'false',
    Имя: p.name || 'не указано',
    Телефон: p.phone,
    Заявка: p.product || '—',
    Комментарий: p.message || '—',
    Источник: p.source || 'сайт',
  };

  try {
    const res = await fetch(`https://formsubmit.co/ajax/${LEAD_EMAIL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) return 'email';
  } catch {
    /* переходим к резервному каналу */
  }

  // Резервный канал — письмо через почтовую программу пользователя
  try {
    window.location.href = `mailto:${LEAD_EMAIL}?subject=${encodeURIComponent(
      buildSubject(p)
    )}&body=${encodeURIComponent(buildText(p))}`;
  } catch {
    /* ignore */
  }
  return 'mailto';
}
