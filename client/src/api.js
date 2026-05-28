// ============================================
// API 客户端
// ============================================

const BASE = '/api';

async function req(method, path, body) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${BASE}${path}`, opts);
  return res.json();
}

const api = {
  // 剧本
  getScenarios: () => req('GET', '/scenarios'),

  // 游戏
  newGame: (scenarioId, lordId) => req('POST', '/game/new', { scenarioId, lordId }),
  getState: () => req('GET', '/game/state'),
  addOrder: (order) => req('POST', '/game/order', order),
  removeOrder: (id) => req('DELETE', `/game/order/${id}`),
  executeMonth: () => req('POST', '/game/execute'),

  // 保存/加载
  saveGame: (slot) => req('POST', '/game/save', { slot }),
  loadGame: (data) => req('POST', '/game/load', { data }),

  // 战斗
  getBattleState: () => req('GET', '/battle/state'),
  startBattle: (atkCityId, defCityId, attackerIds) =>
    req('POST', '/battle/start', { atkCityId, defCityId, attackerIds }),
  getMoveRange: () => req('POST', '/battle/move-range'),
  moveUnit: (toX, toY) => req('POST', '/battle/move', { toX, toY }),
  getAttackRange: () => req('POST', '/battle/attack-range'),
  attackUnit: (defenderIdx, isDefender) =>
    req('POST', '/battle/attack', { defenderIdx, isDefender }),
  endAction: () => req('POST', '/battle/end-action'),
};

export default api;
