import express from 'express'; import { createServer } from 'http'; import { Server } from 'socket.io';
import cors from 'cors'; import path from 'path'; import { fileURLToPath } from 'url';
import GameEngine from './engine/GameEngine.js'; import BattleEngine from './engine/BattleEngine.js';
import { BATTLE_RESULT, BATTLE_MODE } from '../../shared/constants.js';

const __filename = fileURLToPath(import.meta.url); const __dirname = path.dirname(__filename);
const app = express(); const server = createServer(app);
const io = new Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
app.use(cors()); app.use(express.json());
app.use(express.static(path.join(__dirname, '../../client/dist')));

const engine = new GameEngine(); const battleEngine = new BattleEngine(engine);
const scenarios = {};

async function loadScenarios() {
  const scenarioMap = { dongzhuo: 'dongzhuo.js', caocao: 'caocao.js', chibi: 'chibi.js', sanzu: 'sanzu.js' };
  for (const [id, file] of Object.entries(scenarioMap)) {
    try { const m = await import(`./data/scenarios/${file}`); scenarios[id] = m.default; }
    catch (e) { console.warn(`剧本 ${id} 加载失败:`, e.message); }
  }
  console.log('已加载剧本:', Object.keys(scenarios).join(', '));
}

// ===== API =====

app.get('/api/scenarios', (req, res) => {
  res.json({ scenarios: Object.values(scenarios).map(s => ({
    id: s.id, name: s.name, description: s.description, startYear: s.startYear,
    lords: s.lords.map(l => ({ id: l.id, name: l.name, color: l.color }))
  }))});
});

app.post('/api/game/new', (req, res) => {
  const { scenarioId, lordId } = req.body;
  const sc = scenarios[scenarioId];
  if (!sc) return res.status(400).json({ error: '剧本不存在' });
  if (lordId && !sc.lords.find(l => l.id === lordId)) return res.status(400).json({ error: '君主不存在' });
  const state = engine.loadScenario(sc, lordId || null);
  io.emit('game:state', engine.getPlayerState());
  res.json({ ok: true, state: engine.getPlayerState() });
});

app.get('/api/game/state', (req, res) => { res.json(engine.getPlayerState()); });

app.post('/api/game/order', (req, res) => {
  const r = engine.addOrder(req.body);
  if (r.ok) { io.emit('game:order', r.order); io.emit('game:state', engine.getPlayerState()); }
  res.json(r);
});

app.delete('/api/game/order/:id', (req, res) => {
  const r = engine.removeOrder(parseInt(req.params.id));
  if (r.ok) io.emit('game:state', engine.getPlayerState());
  res.json(r);
});

app.post('/api/game/execute', (req, res) => {
  const r = engine.executeMonth(); io.emit('game:state', engine.getPlayerState()); res.json(r);
});

// ===== 战斗 =====

app.get('/api/battle/state', (req, res) => {
  res.json(battleEngine.state ? battleEngine._getClientState() : null);
});

app.post('/api/battle/start', (req, res) => {
  const { atkCityId, defCityId, attackerIds } = req.body;
  const bs = battleEngine.initBattle(atkCityId, defCityId, attackerIds, BATTLE_MODE.ATTACK);
  if (!bs) return res.status(400).json({ error: '无法开始战斗' });
  engine.phase = 'battle'; io.emit('battle:start', bs); io.emit('game:state', engine.getPlayerState());
  res.json(bs);
});

app.post('/api/battle/move-range', (req, res) => {
  const u = battleEngine.getCurrentUnit(); res.json(u ? battleEngine.getMoveRange(u) : []);
});

app.post('/api/battle/move', (req, res) => {
  const u = battleEngine.getCurrentUnit(); if (!u) return res.status(400).json({ error: '无当前单位' });
  const r = battleEngine.moveUnit(u, req.body.toX, req.body.toY);
  io.emit('battle:state', battleEngine._getClientState()); res.json(r);
});

app.post('/api/battle/attack-range', (req, res) => {
  const u = battleEngine.getCurrentUnit(); res.json(u ? battleEngine.getAttackRange(u) : []);
});

app.post('/api/battle/attack', (req, res) => {
  const u = battleEngine.getCurrentUnit();
  const opp = req.body.isDefender ? battleEngine.state.attackers : battleEngine.state.defenders;
  const d = opp[req.body.defenderIdx];
  if (!u || !d) return res.status(400).json({ error: '无效目标' });
  const r = battleEngine.attack(u, d); io.emit('battle:state', battleEngine._getClientState()); res.json(r);
});

app.post('/api/battle/end-action', (req, res) => {
  const u = battleEngine.getCurrentUnit(); if (u) u.hasActed = true;
  const next = battleEngine._nextUnit();
  if (next.sideEnd && battleEngine.state.result !== BATTLE_RESULT.CONTINUE) {
    const br = battleEngine.endBattle(); engine.phase = 'order';
    io.emit('battle:end', br); io.emit('game:state', engine.getPlayerState());
    res.json({ sideEnd: true, battleOver: true, result: br });
  } else { io.emit('battle:state', battleEngine._getClientState()); res.json(next); }
});

app.post('/api/game/save', (req, res) => {
  res.json({ ok: true, slot: req.body.slot, data: engine.save() });
});

app.post('/api/game/load', (req, res) => {
  if (!req.body.data) return res.status(400).json({ error: '数据为空' });
  const s = engine.load(req.body.data); io.emit('game:state', engine.getPlayerState());
  res.json({ ok: true, state: s });
});

// ===== WebSocket =====

io.on('connection', (socket) => {
  socket.on('game:request-state', () => socket.emit('game:state', engine.getPlayerState()));
  socket.on('battle:request-state', () => {
    if (battleEngine.state) socket.emit('battle:state', battleEngine._getClientState());
  });
});

const PORT = process.env.PORT || 3001;
async function start() {
  await loadScenarios();
  server.listen(PORT, () => console.log(`服在 http://localhost:${PORT}`));
}
start();
export { app, server };
