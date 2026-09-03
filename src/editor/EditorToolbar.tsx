import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useEditor } from './EditorContext';
import { ContactsEditor } from './ContactsEditor';
import { CalculatorEditor } from './CalculatorEditor';
import { ProjectDownloadButton } from './ProjectDownload';
import {
  Pencil,
  Eye,
  Undo2,
  Redo2,
  RotateCcw,
  Download,
  Upload,
  LogOut,
  Lock,
  X,
  Settings2,
  Check,
  Info,
  KeyRound,
  Phone,
  Calculator as CalcIcon,
  GripHorizontal,
  Minimize2,
  Save,
} from 'lucide-react';

const REVEAL_KEY = 'mcs_editor_revealed_v1';
const CLICKS_NEEDED = 4;
const CLICK_WINDOW_MS = 2500;
const PANEL_W = 300;

/* Плавающая панель редактора: перетаскиваемая, активируется 4 кликами в левом нижнем углу */
export const EditorLauncher: React.FC = () => {
  const {
    isAuthed,
    editMode,
    toggleEditMode,
    login,
    logout,
    undo,
    redo,
    canUndo,
    canRedo,
    resetAll,
    overridesCount,
    hasOverrides,
    exportJson,
    importJson,
    bakeToCode,
    lastSavedAt,
    notify,
    editorToast,
  } = useEditor();

  /* --- Скрытая активация: 4 клика в левом нижнем углу --- */
  const [revealed, setRevealed] = useState<boolean>(
    () => typeof window !== 'undefined' && sessionStorage.getItem(REVEAL_KEY) === '1'
  );
  const clickCount = useRef(0);
  const clickTimer = useRef<number | null>(null);
  const [hintDots, setHintDots] = useState(0);

  const reveal = useCallback(() => {
    setRevealed(true);
    setHintDots(0);
    clickCount.current = 0;
    try {
      sessionStorage.setItem(REVEAL_KEY, '1');
    } catch {
      /* ignore */
    }
  }, []);

  const handleHotZoneClick = useCallback(() => {
    const now = Date.now();
    // Сбрасываем счётчик, если клики идут с большой паузой
    if (clickTimer.current) window.clearTimeout(clickTimer.current);
    if (clickCount.current === 0) clickCount.current = 1;
    else clickCount.current += 1;

    setHintDots(clickCount.current);
    clickTimer.current = window.setTimeout(() => {
      clickCount.current = 0;
      setHintDots(0);
    }, CLICK_WINDOW_MS);

    if (clickCount.current >= CLICKS_NEEDED) {
      if (clickTimer.current) window.clearTimeout(clickTimer.current);
      reveal();
    }
    void now;
  }, [reveal]);

  /* --- Состояние окна --- */
  const [panelOpen, setPanelOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [contactsOpen, setContactsOpen] = useState(false);
  const [calcEditorOpen, setCalcEditorOpen] = useState(false);
  const [bakeOpen, setBakeOpen] = useState(false);
  const [bakeSnippet, setBakeSnippet] = useState('');
  const [baking, setBaking] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  /* --- Перетаскивание окна --- */
  const [pos, setPos] = useState<{ left: number; bottom: number }>({ left: 20, bottom: 92 });
  const dragRef = useRef<{ dx: number; dy: number; startX: number; startY: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (!dragging) return;

    const onMove = (e: PointerEvent) => {
      const d = dragRef.current;
      if (!d) return;
      const nextLeft = e.clientX - d.dx;
      // bottom считается от нижнего края окна
      const nextBottom = window.innerHeight - e.clientY - d.dy;
      const maxLeft = window.innerWidth - PANEL_W - 12;
      const maxBottom = window.innerHeight - 80;
      setPos({
        left: Math.max(12, Math.min(nextLeft, Math.max(12, maxLeft))),
        bottom: Math.max(12, Math.min(nextBottom, Math.max(12, maxBottom))),
      });
    };
    const onUp = () => {
      dragRef.current = null;
      setDragging(false);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [dragging]);

  const startDrag = (e: React.PointerEvent) => {
    // не даём тянуть за кнопки
    if ((e.target as HTMLElement).closest('button')) return;
    dragRef.current = {
      dx: e.clientX - pos.left,
      dy: window.innerHeight - e.clientY - pos.bottom,
      startX: e.clientX,
      startY: e.clientY,
    };
    setDragging(true);
  };

  /* При первом открытии ставим панель рядом с текущим положением кнопки */
  const openPanel = () => {
    if (panelOpen) return setPanelOpen(false);
    const maxLeft = Math.max(12, window.innerWidth - PANEL_W - 12);
    setPos((p) => ({
      left: Math.min(Math.max(12, p.left), maxLeft),
      bottom: Math.max(80, Math.min(p.bottom, window.innerHeight - 120)),
    }));
    setPanelOpen(true);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      setLoginOpen(false);
      setPassword('');
      setLoginError(false);
      setPanelOpen(true);
    } else {
      setLoginError(true);
    }
  };

  const doExport = () => {
    const blob = new Blob([exportJson()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `metallcehstroy-content-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const doImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const ok = importJson(String(reader.result));
      if (!ok) alert('Не удалось прочитать файл. Убедитесь, что это корректный JSON бэкап.');
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const savedLabel = lastSavedAt
    ? new Date(lastSavedAt).toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : null;

  return (
    <>
      {/* Тост редактора */}
      {editorToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[160] bg-slate-900 text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3">
          <Check className="w-4 h-4 text-emerald-400" />
          {editorToast}
        </div>
      )}

      {/* === Скрытая зона активации: 4 клика в левом нижнем углу === */}
      {!revealed && (
        <div
          onClick={handleHotZoneClick}
          title=""
          className="fixed bottom-0 left-0 z-[150] w-24 h-24 select-none"
        >
          {/* Едва заметная подсказка прогресса кликов */}
          {hintDots > 0 && (
            <div className="absolute bottom-3 left-3 flex gap-1 pointer-events-none">
              {[...Array(CLICKS_NEEDED)].map((_, i) => (
                <span
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    i < hintDots ? 'bg-orange-500 scale-110' : 'bg-slate-300/60'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* === Кнопка редактора (появляется после активации) === */}
      {revealed && !panelOpen && (
        <button
          onClick={() => (isAuthed ? openPanel() : setLoginOpen(true))}
          aria-label="Режим администратора"
          className="fixed bottom-5 left-5 z-[150] w-11 h-11 rounded-full bg-slate-900/85 hover:bg-slate-900 text-white shadow-lg flex items-center justify-center transition-all hover:scale-105 backdrop-blur-sm"
          title="Режим редактирования сайта"
        >
          {isAuthed ? <Settings2 className="w-5 h-5" /> : <Lock className="w-4.5 h-4.5" />}
        </button>
      )}

      {/* === Перетаскиваемая панель === */}
      {revealed && panelOpen && isAuthed && (
        <div
          className="fixed z-[155] bg-white border border-slate-200 rounded-2xl shadow-2xl shadow-slate-900/25 w-[300px] select-none"
          style={{ left: pos.left, bottom: pos.bottom }}
        >
          {/* Ручка перетаскивания */}
          <div
            onPointerDown={startDrag}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-t-2xl border-b border-slate-100 bg-slate-50 ${
              dragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
          >
            <GripHorizontal className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
              <Settings2 className="w-3.5 h-3.5 text-orange-600" />
              Редактор сайта
            </span>

            <span className="ml-auto flex items-center gap-1">
              <button
                onClick={() => setPanelOpen(false)}
                aria-label="Свернуть панель"
                className="w-6 h-6 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200 flex items-center justify-center"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setPanelOpen(false)}
                aria-label="Закрыть панель"
                className="w-6 h-6 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          </div>

          <div className="p-3 space-y-2.5 max-h-[70vh] overflow-y-auto">
            {/* Статус режима */}
            <div
              className={`text-[11px] rounded-lg px-2.5 py-2 flex items-start gap-2 leading-snug ${
                editMode ? 'bg-orange-50 text-orange-800' : 'bg-slate-50 text-slate-600'
              }`}
            >
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>
                {editMode
                  ? 'Наведите на текст или фото и нажмите, чтобы изменить. Панель можно перетащить за шапку.'
                  : 'Режим просмотра. Включите редактирование.'}
              </span>
            </div>

            {/* Переключатель режима */}
            <button
              onClick={toggleEditMode}
              className={`w-full inline-flex items-center justify-center gap-2 font-bold py-2.5 rounded-xl text-xs transition-colors ${
                editMode
                  ? 'bg-slate-800 hover:bg-slate-900 text-white'
                  : 'bg-orange-600 hover:bg-orange-700 text-white'
              }`}
            >
              {editMode ? (
                <>
                  <Eye className="w-3.5 h-3.5" /> Режим просмотра
                </>
              ) : (
                <>
                  <Pencil className="w-3.5 h-3.5" /> Включить редактирование
                </>
              )}
            </button>

            {/* Undo / Redo */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={undo}
                disabled={!canUndo}
                className="inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-semibold py-2 rounded-xl text-[11px]"
              >
                <Undo2 className="w-3.5 h-3.5" /> Отменить
              </button>
              <button
                onClick={redo}
                disabled={!canRedo}
                className="inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-semibold py-2 rounded-xl text-[11px]"
              >
                <Redo2 className="w-3.5 h-3.5" /> Вернуть
              </button>
            </div>

            {/* Автосохранение */}
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-2 text-[11px] text-emerald-800 flex items-start gap-2 leading-snug">
              <Save className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>
                Изменений: <strong>{overridesCount}</strong>
                {savedLabel && (
                  <>
                    {' · '}автосохранено в {savedLabel}
                  </>
                )}
                <br />
                Черновик остаётся в этом браузере. Для остальных браузеров опубликуйте ZIP ниже.
              </span>
            </div>

            {/* Настройки калькулятора */}
            <button
              onClick={() => setCalcEditorOpen(true)}
              className="w-full inline-flex items-center justify-center gap-2 bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200 font-bold py-2.5 rounded-xl text-[11px] transition-colors"
            >
              <CalcIcon className="w-3.5 h-3.5 text-orange-600" /> Настройки цен калькулятора
            </button>

            {/* Редактор контактов */}
            <button
              onClick={() => setContactsOpen(true)}
              className="w-full inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-bold py-2.5 rounded-xl text-[11px] transition-colors"
            >
              <Phone className="w-3.5 h-3.5" /> Редактор контактов и реквизитов
            </button>

            {/* Дополнительный вариант для разработчика */}
            <button
              onClick={async () => {
                if (!hasOverrides) {
                  notify('Нет изменений для фиксации');
                  return;
                }
                setBaking(true);
                notify('Готовлю код (сжимаю фотографии)...');
                const snippet = await bakeToCode();
                setBaking(false);
                setBakeSnippet(snippet);
                setBakeOpen(true);
              }}
              disabled={baking}
              className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-[11px] transition-colors"
              title="Дополнительный файл для ручной замены разработчиком"
            >
              <Check className="w-3.5 h-3.5" />
              {baking ? 'Готовлю файл...' : 'Скачать только файл правок (.ts)'}
            </button>

            {/* Скачать все файлы проекта */}
            <ProjectDownloadButton notify={notify} />

            {/* Экспорт / Импорт */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={doExport}
                className="inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 rounded-xl text-[11px]"
              >
                <Download className="w-3.5 h-3.5" /> Бэкап
              </button>
              <button
                onClick={() => fileRef.current?.click()}
                className="inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 rounded-xl text-[11px]"
              >
                <Upload className="w-3.5 h-3.5" /> Загрузить
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="application/json,.json"
                onChange={doImport}
                className="hidden"
              />
            </div>

            {/* Сброс */}
            {confirmReset ? (
              <div className="bg-red-50 rounded-xl p-2.5 space-y-2">
                <p className="text-[11px] text-red-700 font-medium text-center leading-snug">
                  Сбросить все изменения к исходному сайту?
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      resetAll();
                      setConfirmReset(false);
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-1.5 rounded-lg text-[11px]"
                  >
                    Да, сбросить
                  </button>
                  <button
                    onClick={() => setConfirmReset(false)}
                    className="bg-white border border-slate-200 text-slate-600 font-bold py-1.5 rounded-lg text-[11px]"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setConfirmReset(true)}
                disabled={!hasOverrides}
                className="w-full inline-flex items-center justify-center gap-1.5 text-red-600 hover:bg-red-50 disabled:opacity-40 font-semibold py-2 rounded-xl text-[11px]"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Сбросить все изменения
              </button>
            )}

            {/* Выход */}
            <button
              onClick={logout}
              className="w-full inline-flex items-center justify-center gap-1.5 text-slate-500 hover:text-slate-800 font-semibold py-1.5 text-[11px] border-t border-slate-100 pt-2.5"
            >
              <LogOut className="w-3.5 h-3.5" /> Выйти из редактора
            </button>
          </div>
        </div>
      )}

      {/* Модалка входа */}
      {loginOpen && (
        <div
          className="fixed inset-0 z-[170] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setLoginOpen(false)}
        >
          <form
            onSubmit={handleLogin}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-orange-600" /> Вход в редактор
              </h3>
              <button
                type="button"
                onClick={() => setLoginOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Введите пароль администратора, чтобы редактировать тексты, фото, цены и контакты прямо
              на сайте.
            </p>

            <div>
              <input
                autoFocus
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setLoginError(false);
                }}
                placeholder="Пароль"
                className={`w-full border-2 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-colors ${
                  loginError ? 'border-red-400' : 'border-slate-300 focus:border-orange-500'
                }`}
              />
              {loginError && (
                <p className="text-xs text-red-500 mt-1">Неверный пароль. Попробуйте ещё раз.</p>
              )}
              <p className="text-[11px] text-slate-400 mt-1.5">
                Пароль по умолчанию: <span className="font-mono font-bold">admin</span>
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
            >
              Войти
            </button>
          </form>
        </div>
      )}

      {/* Редактор контактов */}
      <ContactsEditor open={contactsOpen} onClose={() => setContactsOpen(false)} />

      {/* Настройки калькулятора */}
      <CalculatorEditor open={calcEditorOpen} onClose={() => setCalcEditorOpen(false)} />

      {/* Окно с готовым кодом правок */}
      <BakeModal
        open={bakeOpen}
        snippet={bakeSnippet}
        onClose={() => setBakeOpen(false)}
        notify={notify}
      />
    </>
  );
};

/* ===== Окно готового кода для запекания правок ===== */
const BakeModal: React.FC<{
  open: boolean;
  snippet: string;
  onClose: () => void;
  notify: (m: string) => void;
}> = ({ open, snippet, onClose, notify }) => {
  const taRef = useRef<HTMLTextAreaElement | null>(null);

  if (!open) return null;

  const sizeKb = (snippet.length / 1024).toFixed(1);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      notify('Код скопирован — вставьте его в чат или в файл bakedOverrides.ts');
    } catch {
      taRef.current?.focus();
      taRef.current?.select();
      notify('Выделите текст в поле и нажмите Ctrl+C');
    }
  };

  const selectAll = () => {
    taRef.current?.focus();
    taRef.current?.select();
  };

  const download = () => {
    const blob = new Blob([snippet], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bakedOverrides.ts';
    a.click();
    URL.revokeObjectURL(url);
    notify('Файл bakedOverrides.ts скачан');
  };

  return (
    <div
      className="fixed inset-0 z-[170] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-5 sm:p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Check className="w-4.5 h-4.5 text-emerald-600" /> Код ваших правок готов
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Объём: <strong>{sizeKb} КБ</strong>. Фотографии сжаты автоматически. Вставьте этот
              код в чат или замените им файл{' '}
              <span className="font-mono">src/data/bakedOverrides.ts</span> — изменения станут
              постоянными для всех посетителей.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 shrink-0"
            aria-label="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <textarea
          ref={taRef}
          readOnly
          value={snippet}
          onFocus={selectAll}
          className="w-full h-56 font-mono text-[11px] leading-relaxed bg-slate-950 text-emerald-200 rounded-xl p-3 outline-none resize-none"
        />

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={copy}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors"
          >
            <Check className="w-3.5 h-3.5" /> Скопировать код
          </button>
          <button
            onClick={download}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white font-bold py-2.5 rounded-xl text-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Скачать файл .ts
          </button>
          <button
            onClick={onClose}
            className="sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
