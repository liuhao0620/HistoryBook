// ============================================
// 三国霸业 - 战斗引擎
// ============================================

import {
  ARMY_TYPE, ARMY_NAMES, ARMY_MOVE,
  TERRAIN, TERRAIN_NAMES,
  TERRAIN_MOVE_COST, TERRAIN_POWER_MOD,
  ARMY_COUNTER_MOD, ARMY_ATK_MOD, ARMY_DEF_MOD,
  BATTLE_STATE, WEATHER,
  BATTLE_MODE, BATTLE_RESULT,
  DIRECTION,
  TILE_SIZE, MAX_FIGHTERS_PER_SIDE,
} from '../../../shared/constants.js';

// 8方向偏移
const DIR_OFFSETS = [
  { dx: 0, dy: -1 },   // N
  { dx: 1, dy: -1 },   // NE
  { dx: 1, dy: 0 },    // E
  { dx: 1, dy: 1 },    // SE
  { dx: 0, dy: 1 },    // S
  { dx: -1, dy: 1 },   // SW
  { dx: -1, dy: 0 },   // W
  { dx: -1, dy: -1 },  // NW
];

class BattleEngine {
  constructor(gameEngine) {
    this.engine = gameEngine;
    this.state = null;
    this.eventLog = [];
  }

  /** 初始化战斗 */
  initBattle(atkCityId, defCityId, attackers, mode = BATTLE_MODE.ATTACK) {
    const atkCity = this.engine.getCity(atkCityId);
    const defCity = this.engine.getCity(defCityId);

    if (!atkCity || !defCity) return null;

    const mapId = defCity.battleMapId || 1;
    const mapWidth = 16;
    const mapHeight = 12;

    // 生成或获取战斗地图
    const tiles = this._getBattleMap(mapId, mapWidth, mapHeight);

    // 构建攻击方单位
    const atkUnits = attackers.map((personId, idx) => {
      const person = this.engine.getPerson(personId);
      if (!person) return null;
      return this._createUnit(person, atkCity.lord, 0, idx, mapWidth, mapHeight);
    }).filter(Boolean);

    // 构建防守方单位
    const defPersons = this.engine.persons.filter(
      p => p.city === defCityId && p.lord === defCity.lord && p.isAlive
    ).slice(0, MAX_FIGHTERS_PER_SIDE);

    const defUnits = defPersons.map((person, idx) => {
      return this._createUnit(person, defCity.lord, 1, idx, mapWidth, mapHeight);
    });

    this.state = {
      mapId,
      mapWidth,
      mapHeight,
      tiles,
      attackers: atkUnits,
      defenders: defUnits,
      currentSide: 1, // 0=攻击方, 1=防守方
      currentUnitIdx: 0,
      turn: 0,
      weather: this._randWeather(),
      atkProvender: Math.floor(atkCity.food * 0.3),
      defProvender: Math.floor(defCity.food * 0.3),
      mode,
      result: BATTLE_RESULT.CONTINUE,
      atkCityId,
      defCityId,
    };

    // 消耗出征粮草
    atkCity.food -= this.state.atkProvender;
    defCity.food -= this.state.defProvender;

    this.eventLog = [];
    this._log('战斗开始！');

    // 第一个回合
    this._startTurn();

    return this._getClientState();
  }

  _createUnit(person, lord, side, idx, mapWidth, mapHeight) {
    const move = ARMY_MOVE[person.armyType] || 4;
    // 计算位置
    let x, y;
    if (side === 0) {
      // 攻击方：左下区域
      x = 2 + (idx % 5) * 2;
      y = mapHeight - 3 - Math.floor(idx / 5) * 2;
    } else {
      // 防守方：右上区域（城池附近）
      x = mapWidth - 3 - (idx % 5) * 2;
      y = 2 + Math.floor(idx / 5) * 2;
    }

    return {
      personId: person.id,
      name: person.name,
      lord,
      armyType: person.armyType,
      armyCount: person.armyCount,
      maxArmy: person.maxArmy,
      force: person.force,
      iq: person.iq,
      level: person.level,
      exp: 0,
      move,
      curMove: move,
      x, y,
      state: BATTLE_STATE.NORMAL,
      stateTurns: 0,
      skills: [...person.skills],
      equipmentAtk: 0,
      equipmentDef: 0,
      atkRange: this._getDefaultAtkRange(person.armyType),
      hasActed: false,
      isAlive: true,
      side,
    };
  }

  _getDefaultAtkRange(armyType) {
    // 默认攻击范围：近身4格
    return [
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0],
    ];
  }

  // ==========================================
  // 回合控制
  // ==========================================

  _startTurn() {
    this.state.turn++;
    const units = this._getCurrentSideUnits();
    units.forEach(u => {
      u.curMove = u.move;
      u.hasActed = false;
    });
    this.state.currentUnitIdx = 0;
    this._log(`--- 第 ${this.state.turn} 回合 ---`);
  }

  _nextUnit() {
    const units = this._getCurrentSideUnits();
    const alive = units.filter(u => u.isAlive && !u.hasActed);
    if (alive.length === 0) {
      // 切换到对方
      this.state.currentSide = 1 - this.state.currentSide;
      this._startTurn();

      // 检查战斗是否结束
      this._checkBattleEnd();
      return { sideEnd: true };
    }
    // 找下一个可用单位
    const nextIdx = units.findIndex(u => u.isAlive && !u.hasActed);
    this.state.currentUnitIdx = nextIdx;
    return { sideEnd: false, unit: units[nextIdx] };
  }

  _getCurrentSideUnits() {
    return this.state.currentSide === 0 ? this.state.attackers : this.state.defenders;
  }

  _getOppositeSideUnits() {
    return this.state.currentSide === 0 ? this.state.defenders : this.state.attackers;
  }

  getCurrentUnit() {
    const units = this._getCurrentSideUnits();
    return units[this.state.currentUnitIdx];
  }

  // ==========================================
  // 移动计算
  // ==========================================

  /** 计算单位可移动范围 */
  getMoveRange(unit) {
    if (!unit || !unit.isAlive || unit.hasActed) return [];
    if (unit.state === BATTLE_STATE.ROOTED) return [{ x: unit.x, y: unit.y, cost: 0 }];

    const range = [];
    const visited = new Set();
    const queue = [{ x: unit.x, y: unit.y, cost: 0 }];
    visited.add(`${unit.x},${unit.y}`);

    while (queue.length > 0) {
      const cur = queue.shift();
      range.push(cur);

      if (cur.cost >= unit.curMove) continue;

      for (const dir of DIR_OFFSETS) {
        const nx = cur.x + dir.dx;
        const ny = cur.y + dir.dy;
        if (nx < 0 || ny < 0 || nx >= this.state.mapWidth || ny >= this.state.mapHeight) continue;

        const key = `${nx},${ny}`;
        if (visited.has(key)) continue;

        // 检查地形通行
        const terrain = this.state.tiles[ny]?.[nx] ?? TERRAIN.GRASS;
        const moveCost = TERRAIN_MOVE_COST[terrain]?.[unit.armyType] ?? 255;
        if (moveCost === 255) continue;

        // 检查是否有其他单位占据
        const allUnits = [...this.state.attackers, ...this.state.defenders];
        const occupied = allUnits.find(u => u.isAlive && u.x === nx && u.y === ny);
        if (occupied) continue;

        const newCost = cur.cost + moveCost;
        if (newCost <= unit.curMove) {
          visited.add(key);
          queue.push({ x: nx, y: ny, cost: newCost });
        }
      }
    }

    return range;
  }

  /** 移动单位 */
  moveUnit(unit, toX, toY) {
    if (!unit || unit.hasActed) return { ok: false, msg: '该单位已行动' };
    const moveRange = this.getMoveRange(unit);
    const target = moveRange.find(r => r.x === toX && r.y === toY);
    if (!target) return { ok: false, msg: '无法移动到目标位置' };

    unit.x = toX;
    unit.y = toY;
    unit.curMove -= target.cost;
    return { ok: true, moveCost: target.cost, remaining: unit.curMove };
  }

  // ==========================================
  // 攻击计算
  // ==========================================

  /** 获取可攻击范围 */
  getAttackRange(unit) {
    if (!unit || !unit.isAlive || unit.hasActed) return [];

    const range = [];
    const atkPattern = unit.atkRange;
    const centerY = Math.floor(atkPattern.length / 2);
    const centerX = Math.floor(atkPattern[0].length / 2);

    for (let dy = 0; dy < atkPattern.length; dy++) {
      for (let dx = 0; dx < atkPattern[dy].length; dx++) {
        if (atkPattern[dy][dx] === 0) continue;
        const tx = unit.x + dx - centerX;
        const ty = unit.y + dy - centerY;
        if (tx < 0 || ty < 0 || tx >= this.state.mapWidth || ty >= this.state.mapHeight) continue;
        range.push({ x: tx, y: ty });
      }
    }
    return range;
  }

  /** 执行攻击 */
  attack(attacker, defender) {
    if (!attacker || !defender) return { ok: false, msg: '无效目标' };
    if (attacker.hasActed) return { ok: false, msg: '该单位已行动' };
    if (!defender.isAlive) return { ok: false, msg: '目标已阵亡' };

    // 检查攻击范围
    const atkRange = this.getAttackRange(attacker);
    if (!atkRange.find(r => r.x === defender.x && r.y === defender.y)) {
      return { ok: false, msg: '目标不在攻击范围内' };
    }

    // 计算伤害
    const damage = this._calcDamage(attacker, defender);

    defender.armyCount = Math.max(defender.armyCount - damage, 0);
    if (defender.armyCount <= 0) {
      defender.isAlive = false;
      defender.state = BATTLE_STATE.DEAD;
      attacker.exp += 30;
      this._log(`${defender.name} 被 ${attacker.name} 击败！`);
    } else {
      attacker.exp += 10;
      this._log(`${attacker.name} 攻击 ${defender.name}，造成 ${damage} 伤害`);
    }

    // 检查反击
    let counterDamage = 0;
    if (defender.isAlive) {
      const counterRange = this.getAttackRange(defender);
      if (counterRange.find(r => r.x === attacker.x && r.y === attacker.y)) {
        counterDamage = Math.floor(this._calcDamage(defender, attacker) * 0.5);
        attacker.armyCount = Math.max(attacker.armyCount - counterDamage, 0);
        if (attacker.armyCount <= 0) {
          attacker.isAlive = false;
          attacker.state = BATTLE_STATE.DEAD;
          defender.exp += 15;
          this._log(`${attacker.name} 在反击中阵亡！`);
        } else {
          this._log(`${defender.name} 反击，造成 ${counterDamage} 伤害`);
        }
      }
    }

    attacker.hasActed = true;

    return {
      ok: true,
      damage,
      counterDamage,
      attackerDead: !attacker.isAlive,
      defenderDead: !defender.isAlive,
    };
  }

  _calcDamage(attacker, defender) {
    // 基础伤害 = 攻方兵力 * 0.1
    let damage = Math.floor(attacker.armyCount * 0.08);

    // 武力影响
    const forceRatio = (attacker.force + 50) / (defender.force + 50);
    damage = Math.floor(damage * forceRatio);

    // 兵种相克
    const counterMod = ARMY_COUNTER_MOD[attacker.armyType][defender.armyType] / 100;
    damage = Math.floor(damage * counterMod);

    // 攻击/防御系数
    const atkMod = ARMY_ATK_MOD[attacker.armyType] / 100;
    const defMod = ARMY_DEF_MOD[defender.armyType] / 100;
    damage = Math.floor(damage * atkMod / defMod);

    // 地形影响
    const defTerrain = this.state.tiles[defender.y]?.[defender.x] ?? TERRAIN.GRASS;
    const terrainMod = TERRAIN_POWER_MOD[defTerrain]?.[defender.armyType] / 100 || 1;
    damage = Math.floor(damage / terrainMod);

    // 等级影响
    damage += (attacker.level - defender.level) * 5;

    // 天气影响
    if (this.state.weather === WEATHER.RAIN || this.state.weather === WEATHER.HAIL) {
      damage = Math.floor(damage * 0.8);
    }

    // 随机浮动
    damage = Math.floor(damage * (0.8 + Math.random() * 0.4));

    return Math.max(damage, 1);
  }

  // ==========================================
  // 战斗结束判断
  // ==========================================

  _checkBattleEnd() {
    const atkAlive = this.state.attackers.filter(u => u.isAlive);
    const defAlive = this.state.defenders.filter(u => u.isAlive);

    // 粮草耗尽
    if (this.state.atkProvender <= 0 && atkAlive.length > 0) {
      // 攻击方每回合消耗粮草
      const foodConsume = atkAlive.reduce((s, u) => s + u.armyCount, 0) * 0.02;
      this.state.atkProvender -= foodConsume;
      if (this.state.atkProvender <= 0) {
        this.state.result = BATTLE_RESULT.LOST;
        this._log('粮草耗尽，攻击方溃败！');
        return;
      }
    }
    if (this.state.defProvender <= 0 && defAlive.length > 0) {
      const foodConsume = defAlive.reduce((s, u) => s + u.armyCount, 0) * 0.02;
      this.state.defProvender -= foodConsume;
      if (this.state.defProvender <= 0) {
        this.state.result = BATTLE_RESULT.WON;
        this._log('防守方粮草耗尽！');
        return;
      }
    }

    // 一方全灭
    if (atkAlive.length === 0) {
      this.state.result = BATTLE_RESULT.LOST;
      this._log('攻击方全军覆没！');
    } else if (defAlive.length === 0) {
      this.state.result = BATTLE_RESULT.WON;
      this._log('防守方全军覆没！');
    }
  }

  /** 结束战斗，返回结果 */
  endBattle() {
    if (!this.state) return null;

    const result = this.state.result;
    const atkAlive = this.state.attackers.filter(u => u.isAlive);
    const defAlive = this.state.defenders.filter(u => u.isAlive);

    // 更新武将数据
    for (const unit of this.state.attackers) {
      const person = this.engine.getPerson(unit.personId);
      if (person) {
        person.armyCount = unit.armyCount;
        person.experience += unit.exp;
      }
    }
    for (const unit of this.state.defenders) {
      const person = this.engine.getPerson(unit.personId);
      if (person) {
        person.armyCount = unit.armyCount;
        person.experience += unit.exp;
        if (!unit.isAlive) person.isAlive = false;
      }
    }

    // 处理城市归属变更
    if (result === BATTLE_RESULT.WON) {
      const defCity = this.engine.getCity(this.state.defCityId);
      const atkCity = this.engine.getCity(this.state.atkCityId);
      if (defCity && atkCity) {
        defCity.lord = atkCity.lord;
        defCity.governor = 0;
        defCity.devotion = Math.floor(defCity.devotion * 0.5);
        this._log(`${defCity.name} 被攻占！`);
      }
    }

    const battleResult = {
      result,
      atkSurvivors: atkAlive.length,
      defSurvivors: defAlive.length,
      log: this.eventLog,
    };

    this.state = null;
    return battleResult;
  }

  // ==========================================
  // 地图生成
  // ==========================================

  _getBattleMap(mapId, width, height) {
    // 检查剧本是否提供了地图数据
    if (this.engine.scenario && this.engine.scenario.battleMaps) {
      const mapData = this.engine.scenario.battleMaps[mapId];
      if (mapData) return mapData.tiles;
    }

    // 默认随机生成
    const tiles = [];
    for (let y = 0; y < height; y++) {
      tiles[y] = [];
      for (let x = 0; x < width; x++) {
        // 边缘为河流/山
        if (x < 2 || x >= width - 2 || y < 2 || y >= height - 2) {
          tiles[y][x] = Math.random() < 0.5 ? TERRAIN.RIVER : TERRAIN.HILLS;
        } else if (x >= width - 4 && x < width - 1 && y >= 2 && y < 5) {
          // 城池区域
          tiles[y][x] = x === width - 3 && y === 3 ? TERRAIN.CITY : TERRAIN.GRASS;
        } else {
          const r = Math.random();
          if (r < 0.3) tiles[y][x] = TERRAIN.GRASS;
          else if (r < 0.5) tiles[y][x] = TERRAIN.PLAINS;
          else if (r < 0.65) tiles[y][x] = TERRAIN.FOREST;
          else if (r < 0.75) tiles[y][x] = TERRAIN.HILLS;
          else if (r < 0.8) tiles[y][x] = TERRAIN.VILLAGE;
          else if (r < 0.85) tiles[y][x] = TERRAIN.CAMP;
          else tiles[y][x] = TERRAIN.RIVER;
        }
      }
    }
    return tiles;
  }

  _randWeather() {
    const r = Math.random();
    if (r < 0.5) return WEATHER.FINE;
    if (r < 0.7) return WEATHER.CLOUDY;
    if (r < 0.85) return WEATHER.WIND;
    if (r < 0.95) return WEATHER.RAIN;
    return WEATHER.HAIL;
  }

  // ==========================================
  // 客户端状态
  // ==========================================

  _getClientState() {
    if (!this.state) return null;
    return {
      mapId: this.state.mapId,
      mapWidth: this.state.mapWidth,
      mapHeight: this.state.mapHeight,
      tiles: this.state.tiles,
      attackers: this.state.attackers,
      defenders: this.state.defenders,
      currentSide: this.state.currentSide,
      turn: this.state.turn,
      weather: this.state.weather,
      atkProvender: this.state.atkProvender,
      defProvender: this.state.defProvender,
      mode: this.state.mode,
      result: this.state.result,
      log: this.eventLog,
      currentUnit: this.getCurrentUnit(),
    };
  }

  _log(msg) {
    this.eventLog.push(msg);
  }
}

export default BattleEngine;
