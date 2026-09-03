import React, { useState } from 'react';
import { Download, Package, Check, Loader2 } from 'lucide-react';
import { createZip, ZipFile } from './zipWriter';
import { useEditor } from './EditorContext';

const GITIGNORE = `node_modules
dist
.vercel
.env
.env.local
*.log
.DS_Store
metallcehstroy-site.zip
`;

const ENV_EXAMPLE = `# Скопируйте этот файл как .env и подставьте свои ключи из Supabase
VITE_SUPABASE_URL=https://ВАШ-ПРОЕКТ.supabase.co
VITE_SUPABASE_ANON_KEY=ваш_anon_public_ключ
`;

interface ProjectDownloadProps {
  notify: (msg: string) => void;
}

/** Кнопка скачивания всех файлов проекта одним ZIP-архивом. */
export const ProjectDownloadButton: React.FC<ProjectDownloadProps> = ({ notify }) => {
  const { bakeToCode } = useEditor();
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const handleDownload = async () => {
    setBusy(true);
    try {
      const eagerSrc = import.meta.glob('/src/**/*.{ts,tsx,css}', {
        query: '?raw',
        import: 'default',
        eager: true,
      }) as Record<string, string>;
      const eagerPub = import.meta.glob('/public/**/*.{svg,txt,json,webmanifest}', {
        query: '?raw',
        import: 'default',
        eager: true,
      }) as Record<string, string>;
      const eagerPubBinary = import.meta.glob('/public/**/*.{png,jpg,jpeg,webp,gif,ico}', {
        query: '?url',
        import: 'default',
        eager: true,
      }) as Record<string, string>;
      const eagerRoot = import.meta.glob('/*.{json,ts,html,md}', {
        query: '?raw',
        import: 'default',
        eager: true,
      }) as Record<string, string>;
      const eagerScript = import.meta.glob('/scripts/*.js', {
        query: '?raw',
        import: 'default',
        eager: true,
      }) as Record<string, string>;

      const files: ZipFile[] = [];
      const add = (map: Record<string, string>) => {
        for (const [path, val] of Object.entries(map)) {
          files.push({ name: path.replace(/^\//, ''), content: String(val) });
        }
      };

      [eagerSrc, eagerPub, eagerRoot, eagerScript].forEach(add);

      for (const [path, url] of Object.entries(eagerPubBinary)) {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Не удалось добавить ${path} в архив`);
        files.push({
          name: path.replace(/^\//, ''),
          content: new Uint8Array(await response.arrayBuffer()),
        });
      }

      // Сохраняем текущие правки редактора прямо в исходный код архива.
      // Благодаря этому они остаются видны всем после следующего обновления сайта.
      const bakedSource = await bakeToCode();
      const bakedFile = files.find((file) => file.name === 'src/data/bakedOverrides.ts');
      if (bakedFile) bakedFile.content = bakedSource;
      else files.push({ name: 'src/data/bakedOverrides.ts', content: bakedSource });

      files.push({ name: '.gitignore', content: GITIGNORE });
      files.push({ name: '.env.example', content: ENV_EXAMPLE });

      const seen = new Set<string>();
      const unique = files
        .filter((f) => {
          if (seen.has(f.name)) return false;
          seen.add(f.name);
          return true;
        })
        .sort((a, b) => a.name.localeCompare(b.name));

      const blob = await createZip(unique);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'metallcehstroy-site.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDone(true);
      notify(`Архив скачан: ${unique.length} файлов`);
      setTimeout(() => setDone(false), 3000);
    } catch {
      notify('Не удалось собрать архив');
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={busy}
      title="Скачать исходники сайта одним архивом"
      className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold py-2.5 rounded-xl text-[11px] transition-colors"
    >
      {busy ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Собираю архив...
        </>
      ) : done ? (
        <>
          <Check className="w-3.5 h-3.5" /> Архив скачан
        </>
      ) : (
        <>
          <Package className="w-3.5 h-3.5" /> Скачать все файлы сайта (ZIP)
          <Download className="w-3 h-3 opacity-70" />
        </>
      )}
    </button>
  );
};
