export const CITY_MAP_W = 12;
export const CITY_MAP_H = 9;

// 0表示无城池，非0表示城池ID（1-based），对应 city id = 值 - 1
export const C_MAP: number[] = [
    0, 1, 0, 0, 0, 0, 0, 0, 0, 2, 0, 3,
    0, 0, 4, 0, 0, 5, 0, 6, 7, 0, 8, 0,
    0, 0, 0, 9, 10, 11, 0, 12, 13, 14, 0, 0,
    0, 0, 0, 15, 0, 0, 0, 16, 17, 18, 19, 0,
    0, 0, 20, 0, 0, 0, 21, 22, 0, 23, 24, 0,
    0, 0, 25, 26, 0, 0, 27, 28, 29, 0, 30, 0,
    31, 0, 0, 32, 33, 0, 0, 34, 0, 35, 0, 0,
    0, 0, 0, 0, 0, 36, 0, 37, 0, 38, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
];

// Each city's corresponding map id (0-6)
export const dCityMapId = [6,0,1,6,3,4,2,5,6,3,1,0,2,3,4,0,2,1,4,6,1,1,3,5,6,6,3,3,4,2,6,6,1,2,3,4,5,1];

export const getCityCenterCoords = (cityId: number) => {
    const mapIndex = C_MAP.indexOf(cityId + 1);
    if (mapIndex === -1) return null;
    
    const x = mapIndex % CITY_MAP_W;
    const y = Math.floor(mapIndex / CITY_MAP_W);
    return {
        x: x * 135 + 105,
        y: y * 120 - 15
    };
};

