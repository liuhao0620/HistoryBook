import dongzhuo from './src/data/scenarios/dongzhuo.js';
import caocao from './src/data/scenarios/caocao.js';
import chibi from './src/data/scenarios/chibi.js';
import sanzu from './src/data/scenarios/sanzu.js';

const all = [dongzhuo, caocao, chibi, sanzu];
for (const s of all) {
  console.log(`\n=== ${s.name} ===`);
  console.log(`Lords: ${s.lords.length}, Cities: ${s.cities.length}, Persons: ${s.persons.length}`);
  const g = {};
  s.persons.forEach(p => { g[p.lord] = (g[p.lord]||0)+1; });
  Object.entries(g).sort((a,b)=>b[1]-a[1]).forEach(([k,v]) => {
    const ln = s.lords.find(l=>l.id==k);
    console.log(`  ${ln?ln.name.padEnd(8):'在野'.padEnd(8)} ${String(v).padStart(3)}人`);
  });
}
