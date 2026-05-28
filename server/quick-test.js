import GameEngine from './src/engine/GameEngine.js';
import chibiScenario from './src/data/scenarios/chibi.js';

const engine = new GameEngine();
engine.loadScenario(chibiScenario);
const state = engine.getState();
console.log('OK: ' + state.year + '/' + state.month);
console.log('Cities: ' + state.cities.length + ' Persons: ' + state.persons.length);
