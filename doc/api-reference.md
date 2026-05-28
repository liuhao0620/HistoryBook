# API 参考

Base URL: `http://localhost:3001/api`

## 剧本

### GET /scenarios

获取可用剧本列表。

**Response:**
```json
{
  "scenarios": [
    {
      "id": "chibi",
      "name": "赤壁之战",
      "description": "公元208年...",
      "startYear": 208,
      "lords": [
        { "id": 1, "name": "孙权" },
        { "id": 2, "name": "曹操" }
      ]
    }
  ]
}
```

## 游戏

### POST /game/new

开始新游戏。

**Request:**
```json
{ "scenarioId": "chibi" }
```

**Response:**
```json
{
  "ok": true,
  "state": {
    "scenarioId": "chibi",
    "year": 208, "month": 10,
    "playerLord": 1, "phase": "order",
    "lords": [...], "cities": [...], "persons": [...],
    "items": [...], "orders": [], "eventLog": [...]
  }
}
```

---

### GET /game/state

获取当前游戏状态。

**Response:** 同上 `state` 对象。

---

### POST /game/order

添加指令。

**Request:**
```json
{
  "type": 1,          // 指令类型（见 constants.js INTERIOR_ORDERS 等）
  "cityId": 1,        // 所在城市
  "personId": 101,    // 执行武将
  "targetId": 0,      // 目标（可选）
  "money": 0,         // 金额（可选）
  "food": 0,          // 粮食（可选）
  "arms": 0           // 兵力（可选）
}
```

**Response:**
```json
{ "ok": true, "order": { "id": 1234567890, ... } }
```
或
```json
{ "ok": false, "msg": "体力不足" }
```

---

### DELETE /game/order/:id

删除指令（退还体力）。

---

### POST /game/execute

执行本月所有指令，推进一个回合。

**Response:**
```json
{
  "ok": true,
  "results": [
    { "orderId": 123, "type": 1, "person": "甘宁", "city": "建业", "msg": "开垦成功..." }
  ],
  "state": { ... }
}
```

---

### POST /game/save

保存游戏（返回存档 JSON，前端存到 localStorage）。

**Request:**
```json
{ "slot": 1 }
```

**Response:**
```json
{ "ok": true, "slot": 1, "data": { /* 完整存档 */ } }
```

---

### POST /game/load

读取存档。

**Request:**
```json
{ "data": { /* 完整存档 JSON */ } }
```

**Response:**
```json
{ "ok": true, "state": { ... } }
```

---

## 战斗

### POST /battle/start

开始战斗。

**Request:**
```json
{
  "atkCityId": 1,
  "defCityId": 5,
  "attackerIds": [101, 102, 103]
}
```

**Response:**
```json
{
  "mapId": 1, "mapWidth": 16, "mapHeight": 12,
  "tiles": [[0,1,...], ...],
  "attackers": [{ "personId": 101, "name": "甘宁", ... }, ...],
  "defenders": [...],
  "currentSide": 1, "turn": 1, "weather": 0,
  "atkProvender": 15000, "defProvender": 18000,
  "mode": 1, "result": 0,
  "currentUnit": { /* 当前行动单位 */ }
}
```

---

### POST /battle/move-range

获取当前单位的可移动范围。

**Response:**
```json
[{ "x": 2, "y": 9, "cost": 0 }, { "x": 3, "y": 9, "cost": 1 }, ...]
```

---

### POST /battle/move

移动当前单位。

**Request:**
```json
{ "toX": 3, "toY": 9 }
```

**Response:**
```json
{ "ok": true, "moveCost": 1, "remaining": 4 }
// 失败:
{ "ok": false, "msg": "无法移动到目标位置" }
```

---

### POST /battle/attack-range

获取当前单位的可攻击范围。

**Response:**
```json
[{ "x": 2, "y": 8 }, { "x": 3, "y": 8 }, ...]
```

---

### POST /battle/attack

攻击目标单位。

**Request:**
```json
{ "defenderIdx": 0, "isDefender": false }
```
- `defenderIdx`: 目标在敌方数组中的索引
- `isDefender`: 当前行动方是否是防守方

**Response:**
```json
{
  "ok": true,
  "damage": 85,
  "counterDamage": 20,
  "attackerDead": false,
  "defenderDead": false
}
```

---

### POST /battle/end-action

结束当前单位行动，切换到下一个单位。

**Response:**
```json
// 正常切换:
{ "sideEnd": false, "unit": { /* 下一个单位 */ } }

// 一方行动完毕:
{ "sideEnd": true }

// 战斗结束:
{
  "sideEnd": true,
  "battleOver": true,
  "result": {
    "result": 1,          // BATTLE_RESULT.WON
    "atkSurvivors": 3,
    "defSurvivors": 0,
    "log": ["战斗开始！", "..."]
  }
}
```

---

## WebSocket 事件

服务端通过 Socket.IO 推送以下事件（客户端无需主动轮询）：

| 事件 | 触发时机 | Payload |
|------|---------|---------|
| `game:state` | 状态变更 | 完整游戏状态 |
| `game:order` | 添加指令 | 指令对象 |
| `game:log` | 执行月份 | 执行结果数组 |
| `battle:state` | 战斗状态变更 | 战斗状态 |
| `battle:start` | 战斗开始 | 战斗状态 |
| `battle:end` | 战斗结束 | `{ result, atkSurvivors, defSurvivors, log }` |

客户端可发送（服务器响应）：
- `game:request-state` → 返回 `game:state`
- `battle:request-state` → 返回 `battle:state`

## 指令类型码

参见 `shared/constants.js`：

| 码 | 指令 | 类别 |
|----|------|------|
| 1 | 开垦 | 内政 |
| 2 | 招商 | 内政 |
| 3 | 搜寻 | 内政 |
| 4 | 治理 | 内政 |
| 5 | 出巡 | 内政 |
| 6 | 招降 | 内政 |
| 7 | 处斩 | 内政 |
| 8 | 流放 | 内政 |
| 9 | 赏赐 | 内政 |
| 10 | 没收 | 内政 |
| 11 | 交易 | 内政 |
| 12 | 宴请 | 内政 |
| 13 | 输送 | 内政 |
| 14 | 移动 | 内政 |
| 15 | 离间 | 外交 |
| 16 | 招揽 | 外交 |
| 17 | 策反 | 外交 |
| 18 | 反间 | 外交 |
| 19 | 劝降 | 外交 |
| 23 | 侦察 | 军备 |
| 24 | 征兵 | 军备 |
| 25 | 分配 | 军备 |
| 26 | 掠夺 | 军备 |
| 27 | 出征 | 军备 |
