// ============================================
// 三国霸业 - 数据类型定义 (JS 注释形式)
// ============================================

/**
 * @typedef {Object} Person - 武将
 * @property {number} id - 武将ID
 * @property {string} name - 姓名
 * @property {number} lord - 归属君主ID (0=在野)
 * @property {number} oldLord - 旧归属
 * @property {number} city - 所在城市ID
 * @property {number} level - 等级
 * @property {number} force - 武力
 * @property {number} iq - 智力
 * @property {number} devotion - 忠诚度 (0-100)
 * @property {number} character - 性格
 * @property {number} experience - 经验值
 * @property {number} thew - 体力 (0-100)
 * @property {number} armyType - 兵种
 * @property {number} armyCount - 兵力
 * @property {[number, number]} equipment - 装备 [武器, 防具]
 * @property {number} age - 年龄
 * @property {number[]} skills - 技能列表
 * @property {number} portraitId - 头像ID
 */

/**
 * @typedef {Object} City - 城市
 * @property {number} id - 城市ID
 * @property {string} name - 城市名称
 * @property {number} lord - 归属君主ID
 * @property {number} governor - 太守ID
 * @property {number} state - 城市状态
 * @property {number} farmingLimit - 农业上限
 * @property {number} farming - 农业值
 * @property {number} commerceLimit - 商业上限
 * @property {number} commerce - 商业值
 * @property {number} devotion - 民忠 (0-100)
 * @property {number} disasterDef - 防灾
 * @property {number} populationLimit - 人口上限
 * @property {number} population - 人口
 * @property {number} money - 金钱
 * @property {number} food - 粮食
 * @property {number} reserveArmy - 后备兵
 * @property {number} x - 地图X坐标
 * @property {number} y - 地图Y坐标
 * @property {number[]} links - 连接的城市ID列表
 * @property {number} battleMapId - 战斗地图ID
 */

/**
 * @typedef {Object} Item - 道具
 * @property {number} id - 道具ID
 * @property {string} name - 名称
 * @property {string} desc - 描述
 * @property {number} type - 类型 (0=消耗品, 1=武器, 2=防具, 3=坐骑, 4=兵书)
 * @property {number} atkBonus - 武力加成
 * @property {number} iqBonus - 智力加成
 * @property {number} moveBonus - 移动力加成
 * @property {number} armyChange - 兵种改变
 * @property {number[]} atkRange - 攻击范围
 * @property {number} price - 价格
 */

/**
 * @typedef {Object} Order - 指令
 * @property {number} type - 指令类型ID
 * @property {number} personId - 执行武将ID
 * @property {number} cityId - 所在城市ID
 * @property {number} targetId - 目标ID (武将/城市/道具)
 * @property {number} arms - 士兵数量
 * @property {number} food - 粮食
 * @property {number} money - 金钱
 * @property {number} turns - 消耗回合数
 * @property {number} progress - 执行进度
 */

/**
 * @typedef {Object} BattleUnit - 战斗单位
 * @property {number} personId - 武将ID
 * @property {number} lord - 归属君主
 * @property {number} armyType - 兵种
 * @property {number} armyCount - 兵力
 * @property {number} maxArmy - 最大兵力
 * @property {number} force - 武力
 * @property {number} iq - 智力
 * @property {number} level - 等级
 * @property {number} exp - 经验
 * @property {number} move - 移动力
 * @property {number} curMove - 当前剩余移动力
 * @property {number} x - 地图X坐标
 * @property {number} y - 地图Y坐标
 * @property {number} state - 状态
 * @property {number[]} skills - 可用技能
 * @property {number} equipmentAtk - 装备攻击加成
 * @property {number} equipmentDef - 装备防御加成
 * @property {number} atkRangeType - 攻击范围类型
 */

/**
 * @typedef {Object} BattleState - 战斗状态
 * @property {number} mapId - 地图ID
 * @property {number} mapWidth - 地图宽度(块)
 * @property {number} mapHeight - 地图高度(块)
 * @property {number[][]} tiles - 地形数据
 * @property {BattleUnit[]} attackers - 攻击方单位
 * @property {BattleUnit[]} defenders - 防守方单位
 * @property {number} currentSide - 当前行动方
 * @property {number} currentUnitIdx - 当前行动单位
 * @property {number} turn - 回合数
 * @property {number} weather - 天气
 * @property {number} atkProvender - 攻击方粮草
 * @property {number} defProvender - 防守方粮草
 * @property {number} mode - 战斗模式
 * @property {number} result - 战斗结果
 */

/**
 * @typedef {Object} Lord - 君主
 * @property {number} id - 君主ID
 * @property {string} name - 名称
 * @property {number} character - 君主性格
 * @property {number} color - 颜色标识
 */

/**
 * @typedef {Object} Scenario - 剧本
 * @property {string} id - 剧本ID
 * @property {string} name - 剧本名称
 * @property {string} description - 描述
 * @property {number} startYear - 开始年份
 * @property {number} startMonth - 开始月份
 * @property {Lord[]} lords - 君主列表
 * @property {City[]} cities - 城市列表
 * @property {Person[]} persons - 武将列表
 * @property {Item[]} items - 道具列表
 * @property {number} playerLord - 玩家君主ID
 * @property {Object} battleMaps - 战斗地图数据
 * @property {Object} scripts - 剧本脚本
 */

/**
 * @typedef {Object} GameSave - 存档
 * @property {string} scenarioId - 剧本ID
 * @property {number} year - 当前年份
 * @property {number} month - 当前月份
 * @property {number} playerLord - 玩家君主
 * @property {Person[]} persons - 武将数据
 * @property {City[]} cities - 城市数据
 * @property {Item[]} items - 道具数据
 * @property {Order[]} orders - 待执行指令
 * @property {Object[]} eventLog - 事件日志
 */

module.exports = {};
