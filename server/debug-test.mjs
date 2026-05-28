import GameEngine from './src/engine/GameEngine.js';
import chibiScenario from './src/data/scenarios/chibi.js';

console.log('chibiScenario:', chibiScenario?.name);

const engine = new GameEngine();
const state = engine.loadScenario(chibiScenario);
console.log('state:', state?.year, state?.month, state?.cities?.length);
console.log('playerLord:', state?.playerLord);
