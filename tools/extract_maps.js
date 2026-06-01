const fs = require('fs');
const path = require('path');

const buf = fs.readFileSync('E:\\Personal\\sanguobaye_c\\src\\dat.lib.orig');
const decoder = new TextDecoder('gbk');

const getResource = (targetId) => {
    for (let i = 0; i < 200; i++) {
        const addr = buf.readUInt32LE(i * 4);
        if (addr > 0 && addr < buf.length) {
            const resId = buf.readUInt16LE(addr + 4);
            if (resId === targetId) {
                const itmCnt = buf.readUInt16LE(addr + 6);
                const itmLen = buf.readUInt16LE(addr + 8);
                const resKey = buf.readUInt8(addr + 10);
                const payloadStart = addr + 12;
                
                const items = [];
                if (itmLen === 0) {
                    if (itmCnt === 1) {
                        const resLen = buf.readUInt32LE(addr);
                        const itemData = Buffer.alloc(resLen - 12);
                        for (let j = 0; j < resLen - 12; j++) {
                            itemData[j] = (buf[payloadStart + j] - resKey) & 0xFF;
                        }
                        items.push(itemData);
                    } else {
                        const ridxArray = [];
                        for (let j = 0; j < itmCnt; j++) {
                            const offset = buf.readUInt16LE(payloadStart + j * 4);
                            const rlen = buf.readUInt16LE(payloadStart + j * 4 + 2);
                            ridxArray.push({ offset, rlen });
                        }
                        for (const ridx of ridxArray) {
                            const itemData = Buffer.alloc(ridx.rlen);
                            for (let j = 0; j < ridx.rlen; j++) {
                                itemData[j] = (buf[addr + ridx.offset + j] - resKey) & 0xFF;
                            }
                            items.push(itemData);
                        }
                    }
                } else {
                    for (let j = 0; j < itmCnt; j++) {
                        const itemData = Buffer.alloc(itmLen);
                        for (let k = 0; k < itmLen; k++) {
                            itemData[k] = (buf[payloadStart + j * itmLen + k] - resKey) & 0xFF;
                        }
                        items.push(itemData);
                    }
                }
                return items;
            }
        }
    }
    return null;
};

const outDir = path.join(__dirname, '../sanguobaye-web/public/config/maps');
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

for (let i = 0; i <= 6; i++) {
    const resId = 110 + i;
    const items = getResource(resId);
    if (items && items.length > 0) {
        const mapData = items[0];
        const width = mapData[0];
        const height = mapData[2];
        const rawTiles = Array.from(mapData.slice(16, 16 + width * height));
        
        // Convert to TerrainType
        const tiles = rawTiles.map(idx => {
            if (idx > 15) {
                if (idx === 41) return 6; // Tent
                return 7; // River
            } else if (idx > 5) return 2; // Hill
            else if (idx > 4) return 3; // Wood
            else if (idx > 3) return 4; // Thorp
            else if (idx > 2) return 5; // City
            else if (idx > 1) return 0; // Lea
            else if (idx > 0) return 1; // Dene
            return 1; // Default Dene
        });
        
        const mapObj = {
            id: i,
            width,
            height,
            tiles
        };
        fs.writeFileSync(path.join(outDir, `map_${i}.json`), JSON.stringify(mapObj));
        console.log(`Extracted map_${i}.json (${width}x${height})`);
    } else {
        console.log(`Failed to extract map ${i} (ResID ${resId})`);
    }
}

// Also write city map mapping
const dCityMapId = [6,0,1,6,3,4,2,5,6,3,1,0,2,3,4,0,2,1,4,6,1,1,3,5,6,6,3,3,4,2,6,6,1,2,3,4,5,1];
fs.writeFileSync(path.join(outDir, 'city_map_mapping.json'), JSON.stringify(dCityMapId));
console.log('Extracted city_map_mapping.json');

