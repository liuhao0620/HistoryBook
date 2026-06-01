const fs = require('fs');
const path = require('path');

const scenariosFile = path.join(__dirname, '../public/config/scenarios.json');
const data = JSON.parse(fs.readFileSync(scenariosFile, 'utf-8'));

const outBase = path.join(__dirname, '../sanguobaye-web/public/config/scenarios');

data.forEach(scenario => {
    const scenarioId = scenario.id;
    let folderName = '';
    if (scenarioId === 0) folderName = '190_0';
    else if (scenarioId === 1) folderName = '198_1';
    else if (scenarioId === 2) folderName = '208_2';
    else if (scenarioId === 3) folderName = '225_3';

    if (!folderName) return;

    const outDir = path.join(outBase, folderName);
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }

    // cities.json
    fs.writeFileSync(path.join(outDir, 'cities.json'), JSON.stringify(scenario.cities, null, 2));

    // persons.json
    fs.writeFileSync(path.join(outDir, 'persons.json'), JSON.stringify(scenario.generals, null, 2));

    // queues.json
    const queues = {
        genQueue: scenario.genQueue,
        goodsQueue: scenario.goodsQueue
    };
    fs.writeFileSync(path.join(outDir, 'queues.json'), JSON.stringify(queues, null, 2));

    // forces.json
    const forceIds = new Set([
        ...scenario.cities.map(c => c.belong),
        ...scenario.generals.map(g => g.belong)
    ]);
    const forces = Array.from(forceIds)
        .filter(b => b > 0)
        .sort((a, b) => a - b)
        .map(id => ({
            id,
            kingId: id - 1
        }));
    
    fs.writeFileSync(path.join(outDir, 'forces.json'), JSON.stringify(forces, null, 2));
    console.log(`Generated ${folderName}`);
});
