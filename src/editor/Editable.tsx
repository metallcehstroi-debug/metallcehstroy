import React, { useState, useRef, useEffect } from 'react';
import { useEditor } from './EditorContext';
import { Pencil, Check, X, RotateCcw, ImageUp, Link2, Upload } from 'lucide-react';

/* ============================================================
   EditableText — инлайн-редактирование любого текста
   ============================================================ */

interface EditableTextProps {
  /** Уникальный ключ хранения */
  id: string;
  /** Значение по умолчанию (исходный текст с сайта) */
  children: string;
  /** HTML-тег или React-компонент обёртки */
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  /** Многострочный ввод */
  multiline?: boolean;
}

export const EditableText: React.FC<EditableTextProps> = ({
  id,
  children,
  as = 'span',
  className = '',
  multiline = false,
}) => {
  const { editMode, getText, setValue, resetKey, overrides } = useEditor();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement | null>(null);

  const current = getText(id, children);
  const isOverridden = id in overrides;

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const Tag = as as any;

  if (!editMode) {
    return <Tag className={className}>{current}</Tag>;
  }

  const startEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setDraft(current);
    setEditing(true);
  };

  const save = () => {
    setValue(id, draft);
    setEditing(false);
  };

  const cancel = () => setEditing(false);

  if (editing) {
    return (
      <span className="relative inline-block w-full align-top z-50">
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') cancel();
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) save();
            }}
            rows={Math.min(10, Math.max(2, draft.split('\n').length + 1))}
            className="w-full min-w-[240px] rounded-lg border-2 border-orange-500 bg-white text-slate-900 text-sm p-2.5 shadow-xl outline-none resize-y font-sans"
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') cancel();
              if (e.key === 'Enter') save();
            }}
            className="w-full min-w-[200px] rounded-lg border-2 border-orange-500 bg-white text-slate-900 text-sm px-2.5 py-1.5 shadow-xl outline-none font-sans"
          />
        )}
        <span className="flex items-center gap-1 mt-1.5">
          <button
            onClick={save}
            className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-sm"
          >
            <Check className="w-3 h-3" /> Сохранить
          </button>
          <button
            onClick={cancel}
            className="inline-flex items-center gap-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-md"
          >
            <X className="w-3 h-3" /> Отмена
          </button>
          {isOverridden && (
            <button
              onClick={() => {
                resetKey(id);
                setEditing(false);
              }}
              className="inline-flex items-center gap-1 bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-md"
            >
              <RotateCcw className="w-3 h-3" /> Сброс
            </button>
          )}
          {multiline && (
            <span className="text-[10px] text-slate-400 ml-1">Ctrl+Enter — сохранить</span>
          )}
        </span>
      </span>
    );
  }

  return (
    <Tag
      className={`${className} group/edit relative cursor-text rounded-sm outline-1 outline-dashed transition-colors ${
        isOverridden
          ? 'outline-emerald-400/70 hover:outline-emerald-500'
          : 'outline-orange-300/50 hover:outline-orange-500'
      } hover:bg-orange-50/40`}
      onClick={startEdit}
      title="Нажмите, чтобы редактировать"
    >
      {current}
      <span className="opacity-0 group-hover/edit:opacity-100 transition-opacity absolute -top-2 -right-2 z-30 bg-orange-600 text-white rounded-full p-0.5 shadow pointer-events-none">
        <Pencil className="w-3 h-3" />
      </span>
    </Tag>
  );
};

/* ============================================================
   EditableImage — замена изображений (URL или загрузка файла)
   ============================================================ */

interface EditableImageProps {
  id: string;
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

export const EditableImage: React.FC<EditableImageProps> = ({
  id,
  src,
  alt,
  className = '',
  loading = 'lazy',
}) => {
  const { editMode, getImage, setValue, resetKey, overrides } = useEditor();
  const [panelOpen, setPanelOpen] = useState(false);
  const [urlDraft, setUrlDraft] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const current = getImage(id, src);
  const isOverridden = id in overrides;

  if (!editMode) {
    return <img src={current} alt={alt} className={className} loading={loading} />;
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      alert('Файл слишком большой. Максимум 3 МБ (изображение хранится в браузере).');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setValue(id, String(reader.result));
      setPanelOpen(false);
    };
    reader.readAsDataURL(file);
  };

  const applyUrl = () => {
    if (urlDraft.trim()) {
      setValue(id, urlDraft.trim());
      setPanelOpen(false);
      setUrlDraft('');
    }
  };

  return (
    <span className="relative block w-full h-full group/img">
      <img src={current} alt={alt} className={className} loading={loading} />

      {/* Оверлей */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setUrlDraft(current.startsWith('data:') ? '' : current);
          setPanelOpen(true);
        }}
        className="absolute inset-0 z-20 flex items-center justify-center bg-slate-900/0 group-hover/img:bg-slate-900/50 transition-colors"
      >
        <span className="opacity-0 group-hover/img:opacity-100 transition-opacity inline-flex items-center gap-1.5 bg-orange-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg">
          <ImageUp className="w-4 h-4" /> Заменить фото
        </span>
      </button>

      {isOverridden && (
        <span className="absolute top-1.5 left-1.5 z-20 bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded pointer-events-none">
          изменено
        </span>
      )}

      {/* Панель замены */}
      {panelOpen && (
        <div
          className="fixed inset-0 z-[130] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={(e) => {
            e.stopPropagation();
            setPanelOpen(false);
          }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <ImageUp className="w-5 h-5 text-orange-600" /> Заменить изображение
              </h3>
              <button
                onClick={() => setPanelOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Превью */}
            <div className="rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-50">
              <img src={current} alt="Текущее" className="w-full h-full object-cover" />
            </div>

            {/* Загрузка с устройства */}
            <div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
              >
                <Upload className="w-4 h-4" /> Загрузить с устройства
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFile}
                className="hidden"
              />
              <p className="text-[11px] text-slate-400 mt-1 text-center">
                JPG, PNG, WebP · до 3 МБ · хранится в браузере
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="flex-1 h-px bg-slate-200" /> или по ссылке{' '}
              <span className="flex-1 h-px bg-slate-200" />
            </div>

            {/* URL */}
            <div className="space-y-2">
              <div className="relative">
                <Link2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={urlDraft}
                  onChange={(e) => setUrlDraft(e.target.value)}
                  placeholder="https://... ссылка на изображение"
                  className="w-full border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-800 outline-none focus:border-orange-500"
                />
              </div>
              <button
                onClick={applyUrl}
                disabled={!urlDraft.trim()}
                className="w-full bg-slate-800 hover:bg-slate-900 disabled:opacity-40 text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
              >
                Применить ссылку
              </button>
            </div>

            {isOverridden && (
              <button
                onClick={() => {
                  resetKey(id);
                  setPanelOpen(false);
                }}
                className="w-full inline-flex items-center justify-center gap-2 bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold py-2.5 rounded-xl text-sm transition-colors"
              >
                <RotateCcw className="w-4 h-4" /> Вернуть исходное фото
              </button>
            )}
          </div>
        </div>
      )}
    </span>
  );
};
