/** Мини-упаковщик ZIP для браузера (без сторонних библиотек). */

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[i] = c >>> 0;
  }
  return table;
})();

function crc32(bytes: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

/** Сжатие deflate-raw через встроенный API браузера (если поддерживается) */
async function deflateRaw(data: Uint8Array): Promise<Uint8Array | null> {
  try {
    const AnyWin = window as unknown as { CompressionStream?: typeof CompressionStream };
    if (!AnyWin.CompressionStream) return null;
    const cs = new AnyWin.CompressionStream('deflate-raw');
    const writer = cs.writable.getWriter();
    writer.write(data as unknown as BufferSource);
    writer.close();
    const buf = await new Response(cs.readable).arrayBuffer();
    return new Uint8Array(buf);
  } catch {
    return null;
  }
}

export interface ZipFile {
  name: string;
  content: string | Uint8Array;
}

function toBytes(v: string | Uint8Array): Uint8Array {
  return typeof v === 'string' ? new TextEncoder().encode(v) : v;
}

function u16(n: number) {
  return new Uint8Array([n & 0xff, (n >>> 8) & 0xff]);
}
function u32(n: number) {
  return new Uint8Array([n & 0xff, (n >>> 8) & 0xff, (n >>> 16) & 0xff, (n >>> 24) & 0xff]);
}
function concat(parts: Uint8Array[]): Uint8Array {
  const total = parts.reduce((s, p) => s + p.length, 0);
  const out = new Uint8Array(total);
  let o = 0;
  for (const p of parts) {
    out.set(p, o);
    o += p.length;
  }
  return out;
}

/** Собирает ZIP-архив и возвращает Blob */
export async function createZip(files: ZipFile[]): Promise<Blob> {
  const localParts: Uint8Array[] = [];
  const centralParts: Uint8Array[] = [];
  let offset = 0;

  const now = new Date();
  const dosTime =
    ((now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1)) & 0xffff;
  const dosDate =
    (((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate()) & 0xffff;

  for (const file of files) {
    const nameBytes = new TextEncoder().encode(file.name);
    const raw = toBytes(file.content);
    const crc = crc32(raw);

    const compressed = await deflateRaw(raw);
    const useDeflate = compressed !== null && compressed.length < raw.length;
    const payload = useDeflate ? (compressed as Uint8Array) : raw;
    const method = useDeflate ? 8 : 0;

    // Local file header
    const lfh = concat([
      u32(0x04034b50),
      u16(20),
      u16(0x0800), // UTF-8
      u16(method),
      u16(dosTime),
      u16(dosDate),
      u32(crc),
      u32(payload.length),
      u32(raw.length),
      u16(nameBytes.length),
      u16(0),
    ]);
    localParts.push(lfh, nameBytes, payload);

    // Central directory
    const cdh = concat([
      u32(0x02014b50),
      u16(20),
      u16(20),
      u16(0x0800),
      u16(method),
      u16(dosTime),
      u16(dosDate),
      u32(crc),
      u32(payload.length),
      u32(raw.length),
      u16(nameBytes.length),
      u16(0),
      u16(0),
      u16(0),
      u16(0),
      u32(0),
      u32(offset),
    ]);
    centralParts.push(cdh, nameBytes);

    offset += lfh.length + nameBytes.length + payload.length;
  }

  const central = concat(centralParts);
  const eocd = concat([
    u32(0x06054b50),
    u16(0),
    u16(0),
    u16(files.length),
    u16(files.length),
    u32(central.length),
    u32(offset),
    u16(0),
  ]);

  const finalBytes = concat([...localParts, central, eocd]);
  const buffer = new ArrayBuffer(finalBytes.length);
  new Uint8Array(buffer).set(finalBytes);
  return new Blob([buffer], { type: 'application/zip' });
}
