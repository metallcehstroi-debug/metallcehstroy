#!/usr/bin/env node
/**
 * Скрипт упаковки проекта в ZIP для скачивания.
 * Запуск: node scripts/pack.js
 * Результат: metallcehstroy-site.zip в корне проекта
 *
 * В архив попадают все исходники БЕЗ node_modules, dist и .git.
 */

import { createWriteStream } from 'node:fs';
import { readFile, readdir, stat, mkdir, writeFile, rm } from 'node:fs/promises';
import { join, relative, dirname, resolve } from 'node:path';
import { deflateRawSync, crc32 } from 'node:zlib';

const ROOT = process.cwd();
const OUT_NAME = 'metallcehstroy-site.zip';
const OUT_PATH = join(ROOT, OUT_NAME);

/** Папки и файлы, которые не включаем в архив */
const EXCLUDE_DIRS = new Set([
  'node_modules',
  'dist',
  '.git',
  '.vercel',
  '.netlify',
  'coverage',
  '.cache',
]);
const EXCLUDE_FILES = new Set([OUT_NAME, '.DS_Store', 'Thumbs.db']);
const EXCLUDE_EXT = new Set(['.log', '.tmp']);

let entries = []; // { name, data }
let totalFiles = 0;

async function walk(dir) {
  const items = await readdir(dir, { withFileTypes: true });
  for (const item of items) {
    const full = join(dir, item.name);
    const rel = relative(ROOT, full).replace(/\\/g, '/');

    if (item.isDirectory()) {
      if (EXCLUDE_DIRS.has(item.name)) continue;
      await walk(full);
    } else if (item.isFile()) {
      if (EXCLUDE_FILES.has(item.name)) continue;
      if (EXCLUDE_EXT.has(item.name.split('.').pop())) continue;
      const data = await readFile(full);
      entries.push({ name: rel, data });
      totalFiles++;
    }
  }
}

/** Собирает ZIP-файл (алгоритм STORE для несжимаемых + DEFLATE для текста) */
function buildZip(files) {
  const chunks = [];
  const central = [];
  let offset = 0;

  const dosTime = (() => {
    const d = new Date();
    const year = Math.max(d.getFullYear() - 1980, 0);
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const hours = d.getHours();
    const mins = d.getMinutes();
    const secs = Math.floor(d.getSeconds() / 2);
    return ((year << 9) | (month << 5) | day) & 0xffff;
  })();
  const dosDate = (() => {
    const d = new Date();
    return ((d.getHours() << 11) | (d.getMinutes() << 5) | Math.floor(d.getSeconds() / 2)) & 0xffff;
  })();

  for (const file of files) {
    const nameBuf = Buffer.from(file.name, 'utf8');
    const crc = crc32(file.data) >>> 0;
    const compressed = deflateRawSync(file.data, { level: 9 });
    const useDeflate = compressed.length < file.data.length;
    const payload = useDeflate ? compressed : file.data;
    const method = useDeflate ? 8 : 0;

    // Local file header
    const lfh = Buffer.alloc(30);
    lfh.writeUInt32LE(0x04034b50, 0);
    lfh.writeUInt16LE(20, 4); // version
    lfh.writeUInt16LE(0x0800, 6); // UTF-8 flag
    lfh.writeUInt16LE(method, 8);
    lfh.writeUInt16LE(dosTime, 10);
    lfh.writeUInt16LE(dosDate, 12);
    lfh.writeUInt32LE(crc, 14);
    lfh.writeUInt32LE(payload.length, 18);
    lfh.writeUInt32LE(file.data.length, 22);
    lfh.writeUInt16LE(nameBuf.length, 26);
    lfh.writeUInt16LE(0, 28);
    chunks.push(lfh, nameBuf, payload);

    // Central directory record
    const cdh = Buffer.alloc(46);
    cdh.writeUInt32LE(0x02014b50, 0);
    cdh.writeUInt16LE(20, 4);
    cdh.writeUInt16LE(20, 6);
    cdh.writeUInt16LE(0x0800, 8);
    cdh.writeUInt16LE(method, 10);
    cdh.writeUInt16LE(dosTime, 12);
    cdh.writeUInt16LE(dosDate, 14);
    cdh.writeUInt32LE(crc, 16);
    cdh.writeUInt32LE(payload.length, 20);
    cdh.writeUInt32LE(file.data.length, 24);
    cdh.writeUInt16LE(nameBuf.length, 28);
    cdh.writeUInt16LE(0, 30);
    cdh.writeUInt16LE(0, 32);
    cdh.writeUInt16LE(0, 34);
    cdh.writeUInt16LE(0, 36);
    cdh.writeUInt32LE(0, 38);
    cdh.writeUInt32LE(offset, 42);
    central.push(Buffer.concat([cdh, nameBuf]));

    offset += 30 + nameBuf.length + payload.length;
  }

  const centralBuf = Buffer.concat(central);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(files.length, 8);
  eocd.writeUInt16LE(files.length, 10);
  eocd.writeUInt32LE(centralBuf.length, 12);
  eocd.writeUInt32LE(offset, 16);
  eocd.writeUInt16LE(0, 20);

  return Buffer.concat([...chunks, centralBuf, eocd]);
}

async function main() {
  console.log('📦 Собираю архив проекта...\n');

  // Убираем старый архив, чтобы он не попал сам в себя
  try {
    await rm(OUT_PATH, { force: true });
  } catch {
    /* ignore */
  }

  // Добавляем инструкцию, если её вдруг нет
  try {
    await stat(join(ROOT, 'SETUP.md'));
  } catch {
    await writeFile(join(ROOT, 'SETUP.md'), '# Инструкция по установке\n', 'utf8');
  }

  await walk(ROOT);

  if (entries.length === 0) {
    console.error('❌ Не найдено файлов для упаковки.');
    process.exit(1);
  }

  // Сортируем для читаемости в архиве
  entries.sort((a, b) => a.name.localeCompare(b.name));

  const zip = buildZip(entries);
  await writeFile(OUT_PATH, zip);

  const sizeKb = (zip.length / 1024).toFixed(1);
  console.log(`✅ Готово!\n`);
  console.log(`   Файл:    ${OUT_NAME}`);
  console.log(`   Размер:  ${sizeKb} КБ`);
  console.log(`   Файлов:  ${totalFiles}\n`);
  console.log('Архив можно скачать и загрузить на GitHub или Vercel.');
}

main().catch((err) => {
  console.error('❌ Ошибка:', err.message);
  process.exit(1);
});
