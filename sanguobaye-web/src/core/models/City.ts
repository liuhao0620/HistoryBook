export interface City {
    id: number;
    name: string;
    belong: number; // Force/Person ID
    satrapId: number; // 太守
    state: number; // 0: 正常, 1: 饥荒, 2: 旱灾, 3: 水灾, 4: 暴动
    farming: number;
    farmingLimit: number;
    commerce: number;
    commerceLimit: number;
    peopleDevotion: number; // 民忠 (0-100)
    avoidCalamity: number; // 防灾 (0-100)
    population: number;
    populationLimit: number;
    money: number;
    food: number;
    mothballArms: number; // 后备兵力
    personQueue: number[]; // 驻防武将ID列表
    toolQueue: number[]; // 闲置道具ID列表
}
