const fs = require('fs');

const buf = fs.readFileSync('E:\\Personal\\sanguobaye_c\\src\\dat.lib.orig');

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
                
                if (itmLen === 0) {
                    const resLen = buf.readUInt32LE(addr);
                    const itemData = Buffer.alloc(resLen - 12);
                    for (let j = 0; j < resLen - 12; j++) {
                        itemData[j] = (buf[payloadStart + j] - resKey) & 0xFF;
                    }
                    return itemData;
                } else {
                    const itemData = Buffer.alloc(itmCnt * itmLen);
                    for (let j = 0; j < itmCnt * itmLen; j++) {
                        itemData[j] = (buf[payloadStart + j] - resKey) & 0xFF;
                    }
                    return itemData;
                }
            }
        }
    }
    return null;
};

const clnkData = getResource(59); // CITY_LINKR
if (clnkData) {
    console.log(`Extracted CITY_LINKR: ${clnkData.length} bytes`);
    
    // CITY_LINKR contains array of structs for 38 cities. 
    // Wait, the C code says:
    // clnk = ResLoadToCon(CITY_LINKR,1,g_CBnkPtr);
    // clnkcount = city[citycount] * 16 + dircount;
    // So it's 16 bytes per city? 38 * 16 = 608 bytes. Let's see length.
    
    const cityLinks = [];
    const numCities = Math.floor(clnkData.length / 16);
    for (let i = 0; i < numCities; i++) {
        const links = [];
        for (let j = 0; j < 8; j++) {
            const targetCity = clnkData.readUInt8(i * 16 + j);
            const distance = clnkData.readUInt8(i * 16 + 8 + j);
            if (targetCity !== 0) {
                links.push({
                    targetId: targetCity - 1, // 1-based to 0-based
                    distance: distance
                });
            }
        }
        cityLinks.push({ cityId: i, links });
    }
    
    fs.writeFileSync('E:\\Personal\\HistoryBook\\sanguobaye-web\\public\\config\\city_links.json', JSON.stringify(cityLinks, null, 2));
    console.log('Saved city_links.json');
} else {
    console.log('CITY_LINKR not found');
}
