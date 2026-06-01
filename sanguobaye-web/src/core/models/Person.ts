export interface Person {
    id: number;
    name: string;
    belong: number; // Force/Person ID, 0xffff means in-field (在野)
    oldBelong: number;
    force: number; // 武力
    iq: number; // 智力
    thew: number; // 体力 (0-100)
    devotion: number; // 忠诚度 (0-100)
    experience: number;
    level: number;
    age: number;
    armsType: number; // 兵种
    arms: number; // 带兵数量
    equip: number[]; // 装备的道具ID，最多2件
    character: number; // 性格: 0:忠义, 1:大志, 2:贪财, 3:怕死, 4:卤莽
    city?: number; // 所在城池ID
    acted?: boolean; // 本回合是否已行动
}
