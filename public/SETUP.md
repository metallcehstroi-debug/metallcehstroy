# МеталлЦехСтрой — инструкция по установке и публикации

Полное руководство: как запустить сайт локально, загрузить на GitHub, подключить базу Supabase (для заявок и редактирования) и опубликовать на Vercel.

---

## 📦 Что входит в архив

```
metallcehstroy-site/
├── public/
│   └── logo.svg              # Логотип сайта
├── src/
│   ├── components/           # Компоненты интерфейса
│   ├── editor/               # Визуальный редактор контента
│   ├── pages/                # Страницы сайта
│   ├── data/                 # Данные (товары, отзывы, видео)
│   ├── App.tsx               # Точка входа приложения
│   ├── index.css             # Стили
│   └── main.tsx              # Загрузчик React
├── index.html                # HTML-обёртка
├── package.json              # Зависимости проекта
├── tsconfig.json             # Настройки TypeScript
├── vite.config.ts            # Настройки сборки
└── README.md                 # Эта инструкция
```

---

## 1️⃣ Запуск сайта на своём компьютере

### Требования
Установите [Node.js](https://nodejs.org) версии **20 или новее**.

### Шаги

```bash
# 1. Распакуйте архив в любую папку
# 2. Откройте терминал в этой папке и установите зависимости
npm install

# 3. Запустите сайт в режиме разработки
npm run dev
```

Сайт откроется по адресу **http://localhost:5173**

> 💡 Для входа в редактор сделайте **4 быстрых клика в левом нижнем углу** экрана, пароль: `admin`

### Сборка для публикации

```bash
npm run build      # соберёт сайт в папку dist/
npm run preview    # покажет собранный сайт локально
```

---

## 2️⃣ Загрузка на GitHub

### Через сайт GitHub (без командной строки)

1. Зайдите на [github.com](https://github.com) и войдите в аккаунт.
2. Нажмите **+** (справа вверху) → **New repository**.
3. Укажите имя, например `metallcehstroy-site`, выберите **Private** или **Public**.
4. Нажмите **Create repository**.
5. На странице репозитория нажмите **uploading an existing file**.
6. Перетащите **все файлы проекта** (кроме папки `node_modules` и `dist`).
7. Нажмите **Commit changes**.

### Через Git (командная строка)

```bash
cd metallcehstroy-site

git init
git add .
git commit -m "Первый коммит: сайт МеталлЦехСтрой"
git branch -M main
git remote add origin https://github.com/ВАШ_ЛОГИН/metallcehstroy-site.git
git push -u origin main
```

---

## 3️⃣ Настройка Supabase (база заявок и фото)

Supabase — бесплатная база данных. Используется для приёма заявок и хранения загруженных фото.

### Шаг 1. Создайте проект

1. Зайдите на [supabase.com](https://supabase.com) → **Sign in** (можно через GitHub).
2. Нажмите **New project**.
3. Заполните:
   - **Name:** `metallcehstroy`
   - **Database Password:** придумайте и **сохраните** (нужен позже)
   - **Region:** `Frankfurt (eu-central-1)` — ближе всего к России
4. Нажмите **Create new project** и подождите ~2 минуты.

### Шаг 2. Создайте таблицу заявок

1. В левом меню нажмите **SQL Editor**.
2. Нажмите **New query** и вставьте код ниже:

```sql
-- Таблица заявок с сайта
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text,
  phone text not null,
  product text,
  message text,
  source text,
  status text default 'new'
);

-- Таблица правок контента (сохранение изменений редактора)
create table if not exists site_content (
  key text primary key,
  value text not null,
  updated_at timestamptz default now()
);

-- Таблица дополнительных объектов фотогалереи
create table if not exists custom_gallery (
  id text primary key,
  title text not null,
  category text default 'canopy',
  category_label text,
  date text,
  image text,
  material text,
  location text,
  duration text,
  description text,
  created_at timestamptz default now()
);

-- Разрешаем запись заявок всем (форма на сайте)
alter table leads enable row level security;
create policy "leads_insert" on leads for insert to anon with check (true);
create policy "leads_select" on leads for select to anon using (true);

-- Чтение и запись контента сайта
alter table site_content enable row level security;
create policy "content_read" on site_content for select to anon using (true);
create policy "content_write" on site_content for all to anon using (true) with check (true);

-- Чтение галереи
alter table custom_gallery enable row level security;
create policy "gallery_read" on custom_gallery for select to anon using (true);
create policy "gallery_write" on custom_gallery for all to anon using (true) with check (true);
```

3. Нажмите **Run** — таблицы созданы.

### Шаг 3. Скопируйте ключи

1. В Supabase откройте **Project Settings** (⚙️) → **API**.
2. Скопируйте два значения:
   - **Project URL** — например `https://abcdefg.supabase.co`
   - **anon public key** — длинная строка

### Шаг 4. Подключите к сайту

Создайте файл `.env` в корне проекта:

```env
VITE_SUPABASE_URL=https://abcdefg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

> ⚠️ Не публикуйте `service_role` key — он даёт полный доступ к базе.

### Шаг 5. Посмотрите заявки

В Supabase: **Table Editor** → **leads**. Все заявки с сайта появятся здесь автоматически.

Также **на почту** `metallcehstroi@ya.ru` заявки приходят через FormsUBMIT (уже настроено).

---

## 4️⃣ Публикация на Vercel

### Вариант А: через GitHub (рекомендуется)

1. Зайдите на [vercel.com](https://vercel.com) → **Sign up with GitHub**.
2. Нажмите **Add New...** → **Project**.
3. Найдите репозиторий `metallcehstroy-site` и нажмите **Import**.
4. В разделе **Environment Variables** добавьте:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | ваш URL из Supabase |
| `VITE_SUPABASE_ANON_KEY` | ваш anon key из Supabase |

5. Нажмите **Deploy**.
6. Через ~1 минуту сайт будет доступен по адресу вида `metallcehstroy-site.vercel.app`.

### Вариант B: через Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

### Настройка домена металлцехстрой.рф

1. В Vercel откройте проект → **Settings** → **Domains**.
2. Введите `металлцехстрой.рф` и нажмите **Add**.
3. Vercel покажет DNS-записи — добавьте их у вашего регистратора домена:
   - **A** запись: `76.76.21.21`
   - **CNAME** запись: `cname.vercel-dns.com`
4. Подождите до 24 часов, пока DNS обновится.
5. Включите SSL — Vercel выдаст бесплатный сертификат автоматически.

---

## 5️⃣ Как редактировать сайт после публикации

### Визуальный редактор

1. Откройте свой сайт.
2. Сделайте **4 быстрых клика в левом нижнем углу** экрана.
3. Введите пароль: **admin**
4. Нажмите **«Включить редактирование»**.
5. Наведите на любой текст или фото и нажмите — вносите изменения.
6. Изменения сохраняются автоматически в браузере.

### Зафиксировать правки для всех посетителей

1. В панели редактора нажмите **«Зафиксировать правки в коде»**.
2. В открывшемся окне нажмите **«Скачать файл .ts»**.
3. Замените этим файлом `src/data/bakedOverrides.ts` в проекте.
4. Сделайте коммит и запушьте на GitHub:

```bash
git add src/data/bakedOverrides.ts
git commit -m "Обновление контента сайта"
git push
```

5. Vercel автоматически пересоберёт сайт — изменения появятся через ~1 минуту.

> 💡 **Совет:** окно редактора можно перетащить за верхнюю панель, чтобы оно не мешало редактировать.

---

## 6️⃣ Куда приходят заявки

| Канал | Куда | Примечание |
|-------|------|------------|
| 📧 Email | `metallcehstroi@ya.ru` | Через FormsUBMIT (автоматически) |
| 🗄️ Supabase | таблица `leads` | Если настроен `.env` |
| 📱 MAX | личные сообщения | Кнопки «Написать в MAX» |

> ⚠️ **Первое письмо** из FormsUBMIT требует подтверждения: откройте почту `metallcehstroi@ya.ru`, найдите письмо от FormsUBMIT и нажмите **Activate**. После этого заявки будут приходить автоматически.

---

## 7️⃣ Обновление сайта

### Изменить тексты/фото
→ Используйте визуальный редактор на сайте (см. раздел 5).

### Добавить видео
→ Отредактируйте файл `src/data/videos.ts` — добавьте хеш нового ролика с RUTUBE.

### Изменить цены в калькуляторе
→ Панель редактора → **«Настройки цен калькулятора»**.

### Изменить контакты
→ Панель редактора → **«Редактор контактов и реквизитов»**.

### Заменить логотип
→ Панель редактора → наведите на лого в шапке → загрузите файл (до 2 МБ).

---

## 8️⃣ Структура файлов для правок вручную

| Файл | Что содержит |
|------|--------------|
| `src/data/siteData.ts` | Товары, отзывы, услуги, акции, FAQ |
| `src/data/standardCanopies.ts` | Стандартные навесы с ценами |
| `src/data/videos.ts` | Видеогалерея (RUTUBE) |
| `src/data/bakedOverrides.ts` | **Сохранённые правки редактора** |
| `src/components/Header.tsx` | Меню и навигация |
| `src/components/Footer.tsx` | Подвал сайта |
| `src/editor/leadSubmit.ts` | Адрес почты для заявок |

---

## 9️⃣ Частые проблемы

### Сайт не запускается локально
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Ошибка сборки на Vercel
Проверьте, что в проекте есть все файлы, а Node.js версия в Vercel — **20+**. Настройки: **Settings** → **Node.js Version**.

### Заявки не приходят на почту
1. Проверьте, что подтвердили FormsUBMIT (см. раздел 6).
2. Убедитесь, что адрес в `src/editor/leadSubmit.ts` корректный.

### Логотип не меняется
Убедитесь, что файл меньше 2 МБ и это JPG/PNG/WebP. После загрузки обновите страницу.

### Правки пропали
Правки хранятся в браузере (`localStorage`). Если вы **очистили данные браузера** — правки удалятся. Всегда фиксируйте важное кнопкой «Зафиксировать правки в коде».

---

## 🔟 Полезные ссылки

- [Node.js](https://nodejs.org)
- [GitHub](https://github.com)
- [Supabase](https://supabase.com)
- [Vercel](https://vercel.com)
- [RUTUBE — канал МеталлЦехСтрой](https://rutube.ru/channel/41778134/)

---

**Готово!** Сайт работает, заявки приходят, контент редактируется. 🎉
