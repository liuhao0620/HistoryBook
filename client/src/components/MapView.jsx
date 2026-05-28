// 战略地图组件（独立文件，异常隔离）
import React, { useRef, useEffect, useCallback } from 'react';

const W = 480, H = 400, P = 25;

export default function MapView({ cities, lords, sel, onSelect }) {
  const ref = useRef(null);

  // 坐标映射（闭包，不依赖 render）
  const xs = cities.map(c => c.x);
  const ys = cities.map(c => c.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const sx = (x) => (x - minX) / (maxX - minX || 1) * (W - 2 * P) + P;
  const sy = (y) => (y - minY) / (maxY - minY || 1) * (H - 2 * P) + P;

  const draw = useCallback(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    c.width = W; c.height = H;
    ctx.fillStyle = '#0d1b36';
    ctx.fillRect(0, 0, W, H);

    // 道路
    for (const city of cities) {
      for (const lid of city.links || []) {
        const t = cities.find(x => x.id === lid);
        if (!t) continue;
        ctx.beginPath();
        ctx.moveTo(sx(city.x), sy(city.y));
        ctx.lineTo(sx(t.x), sy(t.y));
        ctx.strokeStyle = 'rgba(255,255,255,0.12)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }

    // 城市点
    for (const city of cities) {
      const lord = lords.find(l => l.id === city.lord);
      const r = city.id === sel ? 8 : 6;
      const cx = sx(city.x);
      const cy = sy(city.y);

      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = lord ? lord.color : '#555';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = city.id === sel ? '#ffd700' : (city.lord && city.lord === cities.find(x => x.id === sel)?.lord ? '#fff' : '#444');
      ctx.lineWidth = city.id === sel ? 2.5 : 1;
      ctx.stroke();

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(city.name.slice(0, 2), cx, cy - 10);
    }

    // 高亮选中城市的连接路径
    const sc = cities.find(x => x.id === sel);
    if (sc) {
      for (const lid of sc.links || []) {
        const t = cities.find(x => x.id === lid);
        if (!t) continue;
        ctx.beginPath();
        ctx.moveTo(sx(sc.x), sy(sc.y));
        ctx.lineTo(sx(t.x), sy(t.y));
        ctx.strokeStyle = 'rgba(255,215,0,0.4)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }
  }, [cities, lords, sel]);

  useEffect(() => {
    try { draw(); } catch (e) { console.error('MapView draw error:', e); }
  }, [draw]);

  const handleTap = useCallback((e) => {
    const rect = ref.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const ratioX = rect.width / W;
    const ratioY = rect.height / H;
    const mxNorm = mx / ratioX;
    const myNorm = my / ratioY;
    for (const city of cities) {
      const dx = mxNorm - sx(city.x);
      const dy = myNorm - sy(city.y);
      if (dx * dx + dy * dy < 144) {
        onSelect(city.id);
        return;
      }
    }
  }, [cities, onSelect]);

  return (
    <canvas
      ref={ref}
      style={{ width: '100%', height: 'auto', maxHeight: H, cursor: 'pointer', display: 'block' }}
      onClick={handleTap}
      onTouchStart={e => { const t = e.touches[0]; handleTap({ clientX: t.clientX, clientY: t.clientY }); }}
    />
  );
}
