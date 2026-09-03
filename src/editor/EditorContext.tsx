import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from 'react';

import { BAKED_OVERRIDES } from '../data/bakedOverrides';
import { loadCustomItems } from './customItems';
import { compressDataUrl, isHugeDataUrl } from './imageCompress';

const STORAGE_KEY = 'mcs_site_content_overrides_v1';
const AUTH_KEY = 'mcs_editor_authed_v1';
const EDITOR_PASSWORD = 'admin'; // Пароль для входа в редактор

/** Собирает сниппет кода для запекания правок в сборку (src/data/bakedOverrides.ts).
 *  Большие фотографии автоматически сжимаются, чтобы код оставался коротким
 *  и легко вставлялся в чат или файл. */
async function buildBakeSnippet(overrides: Record<string, string>): Promise<string> {
  const safe = (v: string) => JSON.stringify(v);

  const lines: string[] = [];
  for (const [k, v] of Object.entries(overrides)) {
    const val = isHugeDataUrl(v) ? await compressDataUrl(v) : v;
    lines.push(`  ${safe(k)}: ${safe(val)},`);
  }
  const entries = lines.join('\n');

  const custom = loadCustomItems();
  const compressedCustom = await Promise.all(
    custom.map(async (item) => {
      if (item && typeof item.image === 'string' && isHugeDataUrl(item.image)) {
        return { ...item, image: await compressDataUrl(item.image) };
      }
      return item;
    })
  );
  const items = JSON.stringify(compressedCustom, null, 2)
    .split('\n')
    .map((l, i) => (i === 0 ? l : '  ' + l))
    .join('\n');

  return `export const BAKED_OVERRIDES: Record<string, string> = {\n${entries}\n};\n\nexport const BAKED_CUSTOM_ITEMS: unknown[] = ${items};`;
}

export interface HistoryState {
  overrides: Record<string, string>;
}

interface EditorContextValue {
  /** Режим редактирования включён */
  editMode: boolean;
  toggleEditMode: () => void;
  /** Авторизован ли пользователь как редактор */
  isAuthed: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  /** Получить актуальное значение (override или дефолт) */
  getText: (key: string, fallback: string) => string;
  getImage: (key: string, fallback: string) => string;
  /** Установить значение */
  setValue: (key: string, value: string) => void;
  /** Есть ли несохранённые изменения (для индикатора) */
  hasOverrides: boolean;
  overridesCount: number;
  /** Все переопределения (для панели / экспорта) */
  overrides: Record<string, string>;
  /** Сбросить одно значение к дефолту */
  resetKey: (key: string) => void;
  /** Сбросить всё */
  resetAll: () => void;
  /** Undo / Redo */
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  /** Экспорт / импорт JSON */
  exportJson: () => string;
  importJson: (json: string) => boolean;
  /** Сгенерировать короткий код для запекания правок в сборку */
  bakeToCode: () => Promise<string>;
  /** Момент последнего автосохранения (null — ещё не сохраняли) */
  lastSavedAt: number | null;
  /** Тост-уведомление внутри редактора */
  notify: (msg: string) => void;
  editorToast: string | null;
}

const EditorContext = createContext<EditorContextValue | null>(null);

/** Резервная копия на случай повреждения основного хранилища */
const BACKUP_KEY = 'mcs_site_content_overrides_backup_v1';

function safeParse(raw: string | null): Record<string, string> | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? (parsed as Record<string, string>) : null;
  } catch {
    return null;
  }
}

function loadOverrides(): Record<string, string> {
  // Базовый слой — запечённые в код изменения (переживают обновления сайта)
  let merged: Record<string, string> = { ...BAKED_OVERRIDES };

  let local = safeParse(localStorage.getItem(STORAGE_KEY));
  // Если основное хранилище повреждено — восстанавливаемся из резервной копии
  if (!local) local = safeParse(localStorage.getItem(BACKUP_KEY));

  // В одной из ранних сборок логотип сохранился как обрезанный data URL.
  // Такой файл не декодируется и перекрывает исправный логотип из сборки.
  // Удаляем только заведомо повреждённое локальное значение, сохраняя
  // остальные пользовательские правки редактора.
  if (
    typeof local?.['brand.logo'] === 'string' &&
    local['brand.logo'].startsWith('data:image/') &&
    local['brand.logo'].length < 4096
  ) {
    local = { ...local };
    delete local['brand.logo'];
  }

  if (local) merged = { ...merged, ...local };
  return merged;
}

/** Пишет и основную, и резервную копию */
function persist(overrides: Record<string, string>) {
  const json = JSON.stringify(overrides);
  try {
    localStorage.setItem(STORAGE_KEY, json);
  } catch {
    /* quota */
  }
  try {
    localStorage.setItem(BACKUP_KEY, json);
  } catch {
    /* quota */
  }
}

export const EditorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [editMode, setEditMode] = useState(false);
  const [isAuthed, setIsAuthed] = useState(
    () => typeof window !== 'undefined' && localStorage.getItem(AUTH_KEY) === '1'
  );
  const [overrides, setOverrides] = useState<Record<string, string>>(loadOverrides);
  const [editorToast, setEditorToast] = useState<string | null>(null);

  // История для undo/redo
  const undoStack = useRef<Record<string, string>[]>([]);
  const redoStack = useRef<Record<string, string>[]>([]);
  const [, forceRerender] = useState(0);

  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);

  // Автосохранение: сразу + дублирующая запись, чтобы правки не терялись при обновлении
  useEffect(() => {
    persist(overrides);
    setLastSavedAt(Date.now());
  }, [overrides]);

  // Страховка: дописываем хранилище перед закрытием/обновлением вкладки
  useEffect(() => {
    const flush = () => persist(overrides);
    window.addEventListener('beforeunload', flush);
    document.addEventListener('visibilitychange', flush);
    return () => {
      window.removeEventListener('beforeunload', flush);
      document.removeEventListener('visibilitychange', flush);
    };
  }, [overrides]);

  // Синхронизация между открытыми вкладками
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY || e.key === BACKUP_KEY) {
        const next = safeParse(e.newValue);
        if (next) setOverrides(next);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const notify = useCallback((msg: string) => {
    setEditorToast(msg);
    window.clearTimeout((notify as any)._t);
    (notify as any)._t = window.setTimeout(() => setEditorToast(null), 2600);
  }, []);

  const toggleEditMode = useCallback(() => {
    setEditMode((v) => {
      const next = !v;
      notify(next ? 'Режим редактирования включён' : 'Режим просмотра');
      return next;
    });
  }, [notify]);

  const login = useCallback(
    (password: string) => {
      if (password === EDITOR_PASSWORD) {
        setIsAuthed(true);
        localStorage.setItem(AUTH_KEY, '1');
        setEditMode(true);
        notify('Добро пожаловать в редактор!');
        return true;
      }
      return false;
    },
    [notify]
  );

  const logout = useCallback(() => {
    setIsAuthed(false);
    setEditMode(false);
    localStorage.removeItem(AUTH_KEY);
    notify('Вы вышли из редактора');
  }, [notify]);

  const pushHistory = useCallback((prev: Record<string, string>) => {
    undoStack.current.push(prev);
    if (undoStack.current.length > 50) undoStack.current.shift();
    redoStack.current = [];
    forceRerender((n) => n + 1);
  }, []);

  const setValue = useCallback(
    (key: string, value: string) => {
      setOverrides((prev) => {
        if (prev[key] === value) return prev;
        pushHistory(prev);
        return { ...prev, [key]: value };
      });
    },
    [pushHistory]
  );

  const resetKey = useCallback(
    (key: string) => {
      setOverrides((prev) => {
        if (!(key in prev)) return prev;
        pushHistory(prev);
        const next = { ...prev };
        delete next[key];
        return next;
      });
      notify('Значение сброшено к исходному');
    },
    [pushHistory, notify]
  );

  const resetAll = useCallback(() => {
    setOverrides((prev) => {
      pushHistory(prev);
      return {};
    });
    notify('Все изменения сброшены');
  }, [pushHistory, notify]);

  const undo = useCallback(() => {
    if (undoStack.current.length === 0) return;
    setOverrides((current) => {
      const prev = undoStack.current.pop()!;
      redoStack.current.push(current);
      forceRerender((n) => n + 1);
      return prev;
    });
    notify('Отменено');
  }, [notify]);

  const redo = useCallback(() => {
    if (redoStack.current.length === 0) return;
    setOverrides((current) => {
      const next = redoStack.current.pop()!;
      undoStack.current.push(current);
      forceRerender((n) => n + 1);
      return next;
    });
    notify('Возвращено');
  }, [notify]);

  const getText = useCallback(
    (key: string, fallback: string) => {
      return key in overrides ? overrides[key] : fallback;
    },
    [overrides]
  );

  const getImage = useCallback(
    (key: string, fallback: string) => {
      return key in overrides ? overrides[key] : fallback;
    },
    [overrides]
  );

  const exportJson = useCallback(() => JSON.stringify(overrides, null, 2), [overrides]);

  const bakeToCode = useCallback(async () => {
    return buildBakeSnippet(overrides);
  }, [overrides]);

  const importJson = useCallback(
    (json: string) => {
      try {
        const parsed = JSON.parse(json);
        if (parsed && typeof parsed === 'object') {
          setOverrides((prev) => {
            pushHistory(prev);
            return parsed;
          });
          notify('Данные импортированы');
          return true;
        }
        return false;
      } catch {
        return false;
      }
    },
    [pushHistory, notify]
  );

  // Горячие клавиши
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!isAuthed) return;
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key.toLowerCase() === 'e' && !e.shiftKey) {
        e.preventDefault();
        toggleEditMode();
      }
      if (editMode && mod && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if (editMode && mod && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isAuthed, editMode, toggleEditMode, undo, redo]);

  const value: EditorContextValue = {
    editMode: editMode && isAuthed,
    toggleEditMode,
    isAuthed,
    login,
    logout,
    getText,
    getImage,
    setValue,
    hasOverrides: Object.keys(overrides).length > 0,
    overridesCount: Object.keys(overrides).length,
    overrides,
    resetKey,
    resetAll,
    undo,
    redo,
    canUndo: undoStack.current.length > 0,
    canRedo: redoStack.current.length > 0,
    exportJson,
    importJson,
    bakeToCode,
    lastSavedAt,
    notify,
    editorToast,
  };

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>;
};

export function useEditor(): EditorContextValue {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error('useEditor must be used within EditorProvider');
  return ctx;
}
