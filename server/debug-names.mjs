import fs from 'fs';
const buf = fs.readFileSync('E:\\Personal\\sanguobaye_c\\src\\dat.lib.orig');
const u32 = p => buf.readUInt32LE(p);
const u16 = p => buf.readUInt16LE(p);

function resInfo(id) {
  const ra = u32((id - 1) * 4);
  if (ra === 0 || ra === 0xFFFFFFFF) return null;
  return { addr: ra, ResLen: u32(ra), ResId: u16(ra + 4), ItmCnt: u16(ra + 6), ItmLen: u16(ra + 8), ResKey: buf[ra + 10] };
}

function readRaw(id, idx) {
  const n = resInfo(id);
  if (!n || idx >= n.ItmCnt) return null;
  const off = n.addr + 12 + idx * n.ItmLen;
  let d = buf.slice(off, off + n.ItmLen);
  if (n.ResKey) d = Buffer.from([...d].map(b => (b - n.ResKey) & 0xFF));
  return d;
}

// CITY_NAME resource 58
console.log('=== CITY_NAME (58) ===');
const ci = resInfo(58);
console.log(`items=${ci.ItmCnt} itemLen=${ci.ItmLen} key=${ci.ResKey}`);
const dec = new TextDecoder('gbk');
for (let i = 0; i < ci.ItmCnt; i++) {
  let d = readRaw(58, i);
  let end = d.length; while (end > 0 && d[end - 1] === 0) end--;
  const hex = [...d.slice(0, Math.min(end, 10))].map(b => b.toString(16)).join(' ');
  const str = dec.decode(d.slice(0, end));
  if (str.length > 0) console.log(`  [${i}] hex=${hex}='${str}'`);
}

// GENERAL_NAME resource 62
console.log('\n=== GENERAL_NAME (62) ===');
const gi = resInfo(62);
console.log(`items=${gi.ItmCnt} itemLen=${gi.ItmLen} key=${gi.ResKey}`);
for (let i = 0; i < Math.min(40, gi.ItmCnt); i++) {
  let d = readRaw(62, i);
  let end = d.length; while (end > 0 && d[end - 1] === 0) end--;
  const hex = [...d.slice(0, Math.min(end, 8))].map(b => b.toString(16)).join(' ');
  const str = dec.decode(d.slice(0, end));
  console.log(`  [${i}] hex=${hex}='${str}'`);
}

// CITY_RESID period 0 header analysis
console.log('\n=== CITY_RESID period 0 raw bytes ===');
const d0 = readRaw(57, 0);
console.log(`raw length=${d0.length}`);
// First 40 bytes as hex
for (let i = 0; i < Math.min(40, d0.length); i += 16) {
  const hex = [...d0.slice(i, i + 16)].map(b => b.toString(16).padStart(2, '0')).join(' ');
  const ascii = [...d0.slice(i, i + 16)].map(b => b >= 32 && b < 127 ? String.fromCharCode(b) : '.').join('');
  console.log(`  ${i.toString(16).padStart(4, '0')}: ${hex}  ${ascii}`);
}
