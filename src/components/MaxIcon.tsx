import React, { useRef } from 'react';
import { useEditor } from '../editor/EditorContext';

export const MAX_URL_DEFAULT =
  'https://max.ru/u/f9LHodD0cOJP7pLv_FQ77YWeI8kbMRGxYvAcbwkusC2aJI7kjh00kRS5Ezc';

/** Официальный логотип мессенджера MAX: сине-фиолетовый круг с белым кольцом-«облачком» */
const MaxLogoSvg: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="maxGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#2E8BF7" />
        <stop offset="0.55" stopColor="#5A5CE8" />
        <stop offset="1" stopColor="#8B3DF0" />
      </linearGradient>
    </defs>
    <circle cx="100" cy="100" r="100" fill="url(#maxGrad)" />
    {/* белое кольцо с хвостиком внизу-слева, как у официального знака MAX */}
    <path
      fill="#F5F7FA"
      fillRule="evenodd"
      d="M100 30c-38.6 0-70 31.4-70 70 0 14.6 4.5 28.2 12.2 39.4 1.6 8.9.4 17.6-3.4 26.2-1.4 3.2.9 6.6 4.4 6.4 11.9-.6 22.8-4.3 32.6-10.6 7.6 2.6 15.8 4 24.2 4 38.6 0 70-31.4 70-70S138.6 30 100 30Zm0 34c19.9 0 36 16.1 36 36s-16.1 36-36 36c-6.6 0-12.8-1.8-18.1-4.9-2.6-1.5-5.8-1.3-8.2.5-2.3 1.7-4.8 3.1-7.5 4.2 1-3.4 1.6-6.9 1.7-10.5.1-2.3-.6-4.6-1.9-6.5A35.8 35.8 0 0 1 64 100c0-19.9 16.1-36 36-36Z"
    />
  </svg>
);

export const MAX_URL = MAX_URL_DEFAULT;

/** Иконка MAX: своя картинка из редактора или официальный знак.
 *  В режиме редактора по клику на иконку можно загрузить свою картинку. */
export const MaxIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => {
  const { getImage, editMode, setValue, notify } = useEditor();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const custom = getImage('brand.maxicon', '');

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      notify('Файл слишком большой (макс. 2 МБ)');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setValue('brand.maxicon', String(reader.result));
      notify('Иконка MAX обновлена на всех кнопках');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <span className="relative inline-flex shrink-0">
      {custom ? (
        <img src={custom} alt="MAX" className={`${className} object-cover rounded-full`} />
      ) : (
        <MaxLogoSvg className={className} />
      )}
      {editMode && (
        <>
          <button
            type="button"
            title="Загрузить свою картинку для кнопки MAX"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              inputRef.current?.click();
            }}
            className="absolute -inset-1 rounded-full bg-black/0 hover:bg-black/60 transition-colors flex items-center justify-center cursor-pointer group/maxicon"
          >
            <span className="opacity-0 group-hover/maxicon:opacity-100 text-white text-[8px] font-bold leading-tight text-center transition-opacity">
              своё
              <br />
              фото
            </span>
          </button>
          <input ref={inputRef} type="file" accept="image/*" onChange={onFile} className="hidden" />
        </>
      )}
    </span>
  );
};

interface MaxLinkProps {
  href?: string;
  className?: string;
  iconClass?: string;
  children?: React.ReactNode;
  /** подпись оверлея в режиме редактора */
  editLabel?: string;
}

/** Ссылка на MAX с возможностью заменить иконку в режиме редактора */
export const MaxLink: React.FC<MaxLinkProps> = ({
  href = MAX_URL_DEFAULT,
  className = '',
  iconClass = 'w-5 h-5',
  children,
  editLabel = 'Иконка MAX',
}) => {
  const { editMode, setValue, notify } = useEditor();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      notify('Файл слишком большой (макс. 2 МБ)');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setValue('brand.maxicon', String(reader.result));
      notify('Иконка MAX обновлена на всех кнопках');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  if (editMode) {
    return (
      <span className={`relative inline-flex ${className}`}>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-full h-full"
        >
          <MaxIcon className={iconClass} />
          {children}
        </a>
        <button
          type="button"
          title={`Загрузить свою картинку: ${editLabel}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            inputRef.current?.click();
          }}
          className="absolute inset-0 bg-black/0 hover:bg-black/55 transition-colors rounded-full flex items-center justify-center cursor-pointer group/maxbtn"
        >
          <span className="opacity-0 group-hover/maxbtn:opacity-100 text-white text-[9px] font-bold bg-black/70 px-1.5 py-0.5 rounded text-center leading-tight transition-opacity">
            Своё
            <br />
            фото
          </span>
        </button>
        <input ref={inputRef} type="file" accept="image/*" onChange={onFile} className="hidden" />
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center ${className}`}
    >
      <MaxIcon className={iconClass} />
      {children}
    </a>
  );
};
