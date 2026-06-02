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

const decodeName = (buf) => {
    if (!buf) return '';
    let end = buf.indexOf(0);
    if (end === -1) end = buf.length;
    let name = decoder.decode(buf.slice(0, end));
    // Fix garbled PUA characters used in the original game
    name = name.replace(/李/g, '李傕');
    name = name.replace(/夏侯/g, '夏侯惇');
    name = name.replace(/费/g, '费祎');
    name = name.replace(/荀/g, '荀彧');
    name = name.replace(/张/g, '张郃');
    return name;
};

const outDir = path.join(__dirname, '../sanguobaye-web/public/config');
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

const writeToOut = (filename, data) => {
    fs.writeFileSync(path.join(outDir, filename), data);
};

// 1. Extract City Names (ResID 58)
const cityNamesRaw = getResource(58);
const cityNames = cityNamesRaw.map(decodeName);
writeToOut('city_names.json', JSON.stringify(cityNames, null, 2));

// 2. Extract General Names (ResID 62)
const genNamesRaw = getResource(62);
const genNames = genNamesRaw.map(decodeName);
writeToOut('general_names.json', JSON.stringify(genNames, null, 2));

// 3. Extract Goods
const goodsNamesRaw = getResource(73);
const goodsNames = goodsNamesRaw ? goodsNamesRaw.map(decodeName) : [];
const goodsInfRaw = getResource(74);
const goodsInfs = goodsInfRaw ? goodsInfRaw.map(decodeName) : [];
const goodsResRaw = getResource(66);
if (goodsResRaw && goodsResRaw.length > 0) {
    const data = goodsResRaw[0];
    const goodsCount = Math.floor(data.length / 66);
    const goodsList = [];
    for (let i = 0; i < goodsCount; i++) {
        const itemData = data.slice(i * 66, (i + 1) * 66);
        goodsList.push({
            id: i,
            name: goodsNames[i] || '',
            info: goodsInfs[i] || '',
            idx: itemData.readUInt8(0),
            useflag: itemData.readUInt8(1),
            at: itemData.readUInt8(62),
            iq: itemData.readUInt8(63),
            move: itemData.readUInt8(64),
            arm: itemData.readUInt8(65)
        });
    }
    writeToOut('goods.json', JSON.stringify(goodsList, null, 2));
}

// 4. Extract Scenarios
const cityResRaw = getResource(57);
const genResRaw = getResource(61);
const genQueueRaw = getResource(65);
const goodsQueueRaw = getResource(68);

const parseCity = (buf) => ({
    state: buf.readUInt8(0),
    belong: buf.readUInt8(1),
    satrapId: buf.readUInt8(2),
    farmingLimit: buf.readUInt16LE(3),
    farming: buf.readUInt16LE(5),
    commerceLimit: buf.readUInt16LE(7),
    commerce: buf.readUInt16LE(9),
    devotion: buf.readUInt8(11),
    avoidCalamity: buf.readUInt8(12),
    populationLimit: buf.readUInt32LE(13),
    population: buf.readUInt32LE(17),
    money: buf.readUInt16LE(21),
    food: buf.readUInt16LE(23),
    mothballArms: buf.readUInt16LE(25),
    personQueue: buf.readUInt8(27),
    persons: buf.readUInt8(28),
    toolQueue: buf.readUInt8(29),
    tools: buf.readUInt8(30)
});

const parseGeneral = (buf) => ({
    oldBelong: buf.readUInt8(0),
    belong: buf.readUInt8(1),
    level: buf.readUInt8(2),
    force: buf.readUInt8(3),
    iq: buf.readUInt8(4),
    devotion: buf.readUInt8(5),
    character: buf.readUInt8(6),
    experience: buf.readUInt8(7),
    thew: buf.readUInt8(8),
    armsType: buf.readUInt8(9),
    arms: buf.readUInt16LE(10),
    equip0: buf.readUInt8(12),
    equip1: buf.readUInt8(13),
    age: buf.readUInt8(14)
});

const scenarios = [];
for (let s = 0; s < 4; s++) {
    const cityData = cityResRaw[s];
    const genData = genResRaw[s];
    const genQueue = genQueueRaw[s];
    const goodsQueue = goodsQueueRaw[s];
    
    const yearDate = cityData.readUInt16LE(cityData.length - 2);
    const cities = [];
    for (let c = 0; c < 38; c++) {
        const cityBuf = cityData.slice(c * 31, (c + 1) * 31);
        cities.push({ id: c, name: cityNames[c] || '', ...parseCity(cityBuf) });
    }
    
    const generals = [];
    for (let g = 0; g < 200; g++) {
        const genBuf = genData.slice(g * 15, (g + 1) * 15);
        const parsed = parseGeneral(genBuf);
        generals.push({ id: g, name: genNames[parsed.oldBelong] || '', ...parsed });
    }
    
    const genQueueArr = [];
    for (let g = 0; g < 200; g++) {
        genQueueArr.push(genQueue.readUInt8(g));
    }
    
    const goodsQueueArr = [];
    for (let g = 0; g < 33; g++) {
        goodsQueueArr.push(goodsQueue.readUInt8(g));
    }
    
    scenarios.push({
        id: s,
        yearDate,
        cities,
        generals,
        genQueue: genQueueArr,
        goodsQueue: goodsQueueArr
    });
}

writeToOut('scenarios.json', JSON.stringify(scenarios, null, 2));

console.log('Extraction complete! Check ../sanguobaye-web/public/config/');
