// ============================================
// 三国霸业 - 剧本插件接口定义
// ============================================

export function validateScenario(scenario) {
  const errors = [];

  if (!scenario.id) errors.push('缺少剧本ID');
  if (!scenario.name) errors.push('缺少剧本名称');
  if (!Array.isArray(scenario.lords)) errors.push('君主列表格式错误');
  if (!Array.isArray(scenario.cities)) errors.push('城市列表格式错误');
  if (!Array.isArray(scenario.persons)) errors.push('武将列表格式错误');
  if (!scenario.playerLord) errors.push('未指定玩家君主');

  if (scenario.lords) {
    const lordIds = new Set(scenario.lords.map(l => l.id));
    if (lordIds.size !== scenario.lords.length) errors.push('君主ID重复');
    if (!lordIds.has(scenario.playerLord)) errors.push('玩家君主不在君主列表中');
  }

  if (scenario.cities && scenario.lords) {
    const lordIds = new Set(scenario.lords.map(l => l.id));
    for (const city of scenario.cities) {
      if (city.lord && !lordIds.has(city.lord)) {
        errors.push(`城市"${city.name}"归属君主${city.lord}不存在`);
      }
    }
  }

  if (scenario.persons && scenario.lords) {
    const lordIds = new Set(scenario.lords.map(l => l.id));
    lordIds.add(0);
    for (const person of scenario.persons) {
      if (!lordIds.has(person.lord)) {
        errors.push(`武将"${person.name}"归属君主${person.lord}不存在`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
}
