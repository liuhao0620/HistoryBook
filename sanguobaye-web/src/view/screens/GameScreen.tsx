import React, { useState, useEffect } from 'react';
import { useGameStore, getSaveSlotsInfo } from '../../core/state/useGameStore';
import { useScale } from '../../core/hooks/useScale';

const bounceKeyframes = `
@keyframes bounce {
    from { transform: translateX(-50%) translateY(0); }
    to { transform: translateX(-50%) translateY(-5px); }
}
`;
import { useBattleStore } from '../../core/battle/useBattleStore';
import { C_MAP, CITY_MAP_W, getCityCenterCoords } from '../../core/constants/cityMap';
import { 
    AssartCommand, AccractbusinessCommand, SearchCommand, 
    FatherCommand, InspectionCommand, SurrenderCommand, 
    LargessCommand, ConfiscateCommand, TreatCommand, 
    KillCommand, BanishCommand, ExchangeCommand
} from '../../core/commands/InternalCommands';
import { 
    ConscriptionCommand, ReconnoitreCommand, DistributeCommand, 
    DepredateCommand, TransportationCommand, MoveCommand 
} from '../../core/commands/MilitaryCommands';
import { 
    AlienateCommand, CanvassCommand, CounterespionageCommand, InduceCommand 
} from '../../core/commands/DiplomacyCommands';
import { AIBattleSimulator } from '../../core/ai/AIBattleSimulator';
import { GameButton } from '../components/ui/GameButton';
import { GameModal } from '../components/ui/GameModal';

type CommandStep = 'NONE' | 'SELECT_EXECUTORS' | 'SELECT_TARGET_CITY' | 'SELECT_TARGET_PERSON' | 'INPUT_AMOUNTS';

export const GameScreen: React.FC = () => {
    const { year, month, selectedCityId, cities, persons, forces, playerForceId, nextTurn, setScreen, selectCity, delayedTasks, processDelayedTasks, updateCity, updatePerson, addReport, aiThinkingForceId, reportQueue, clearReports } = useGameStore();
    const initBattle = useBattleStore(state => state.initBattle);
    const scale = useScale();
    const [cityLinks, setCityLinks] = useState<any[]>([]);

    const [currentReportIndex, setCurrentReportIndex] = useState<number>(0);
    const playerReports = reportQueue.filter(r => r.forceId === playerForceId);
    const showReportModal = playerReports.length > 0 && currentReportIndex < playerReports.length;

    const handleNextReport = () => {
        if (currentReportIndex + 1 >= playerReports.length) {
            clearReports();
            setCurrentReportIndex(0);
        } else {
            setCurrentReportIndex(prev => prev + 1);
        }
    };

    useEffect(() => {
        fetch('/config/city_links.json')
            .then(res => res.json())
            .then(data => setCityLinks(data));
    }, []);

    // 处理延迟任务
    useEffect(() => {
        const completedTasks = delayedTasks.filter(t => t.monthsLeft <= 0);
        if (completedTasks.length > 0) {
            const newAiReports: string[] = [];
            completedTasks.forEach(task => {
                if (task.type === 'TRANSPORT') {
                    updateCity(task.data.toCityId, c => {
                        c.money += task.data.money;
                        c.food += task.data.food;
                        c.mothballArms += task.data.arms;
                    });
                    const msgPrefix = task.data.executorId === forces[task.forceId]?.kingId ? `孤已将物资押送到` : `主公，臣已将物资押送到`;
                    addReport({ forceId: task.forceId, msg: `${msgPrefix} ${cities[task.data.toCityId]?.name}，送达金钱 ${task.data.money}，粮草 ${task.data.food}，兵力 ${task.data.arms}。`, avatarId: task.data.executorId });
                } else if (task.type === 'MOVE') {
                    task.data.personIds.forEach((pid: number) => {
                        updatePerson(pid, p => { p.city = task.data.toCityId; });
                    });
                    const executorId = task.data.personIds[0];
                    const msgPrefix = executorId === forces[task.forceId]?.kingId ? `孤率军` : `主公，臣已率军`;
                    addReport({ forceId: task.forceId, msg: `${msgPrefix}抵达 ${cities[task.data.toCityId]?.name}。`, avatarId: executorId });
                } else if (task.type === 'RECONNOITRE') {
                    const msgPrefix = task.data.executorId === forces[task.forceId]?.kingId ? `孤探明了` : `主公，臣探明了`;
                    addReport({ forceId: task.forceId, msg: `${msgPrefix} ${cities[task.data.targetCityId]?.name} 的兵力情况。`, avatarId: task.data.executorId });
                } else if (task.type === 'ATTACK') {
                    const targetCityId = task.data.targetCityId;
                    const executors = task.data.executorIds;
                    const fromCityId = task.data.fromCityId;
                    const defenderIds = Object.values(persons).filter(p => p.city === targetCityId).map(p => p.id);
                    if (defenderIds.length === 0) {
                        updateCity(targetCityId, c => { c.belong = task.forceId; });
                        executors.forEach((pid: number) => {
                            updatePerson(pid, p => { p.city = targetCityId; });
                        });
                        const executorId = executors[0];
                        const isKing = executorId === forces[task.forceId]?.kingId;
                        const msgPrefix = isKing ? `孤已兵不血刃占领了` : `主公，臣已兵不血刃占领了`;
                        addReport({ forceId: task.forceId, msg: `${msgPrefix} ${cities[targetCityId].name}！`, avatarId: executorId });
                    } else {
                        const targetCityBelong = cities[targetCityId].belong;
                        if (task.forceId !== playerForceId && targetCityBelong !== playerForceId) {
                            // AI vs AI -> fast simulate
                            const result = AIBattleSimulator.simulateBattle(task.forceId, targetCityBelong, targetCityId, executors, defenderIds);
                            addReport({ forceId: task.forceId, msg: result.reportMsg });
                            newAiReports.push(result.reportMsg);
                        } else {
                            initBattle(fromCityId, targetCityId, executors, defenderIds).then(() => {
                                setScreen('BATTLE');
                            });
                        }
                    }
                } else if (task.type === 'DIPLOMACY') {
                    // 简易外交结算
                    const target = persons[task.data.targetId];
                    if (target) {
                        const executor = persons[task.data.executorId];
                        const isKing = executor?.id === forces[task.forceId]?.kingId;
                        const msgPrefix = isKing ? `孤` : `主公，臣`;
                        const success = Math.random() * 100 < ((executor?.iq || 50) - target.iq + 50);
                        if (success) {
                            if (task.data.subtype === 'Alienate') {
                                updatePerson(target.id, p => { p.devotion = Math.max(0, p.devotion - 10); });
                                addReport({ forceId: task.forceId, msg: `${msgPrefix}的离间之计成功了！\n【外交】${target.name} 忠诚度下降。`, avatarId: executor?.id });
                            } else if (task.data.subtype === 'Canvass') {
                                updatePerson(target.id, p => { p.belong = playerForceId; p.devotion = 60; });
                                addReport({ forceId: task.forceId, msg: `${msgPrefix}已成功招揽 ${target.name}！`, avatarId: executor?.id });
                                addReport({ forceId: task.forceId, msg: `良禽择木而栖，贤臣择主而事。在下愿随明公！\n【外交】招揽成功，${target.name} 加入我方！`, avatarId: target.id });
                            } else if (task.data.subtype === 'Counterespionage') {
                                updatePerson(target.id, p => { p.belong = playerForceId; });
                                addReport({ forceId: task.forceId, msg: `${msgPrefix}的策反之计成功了，${target.name} 已经倒戈！`, avatarId: executor?.id });
                                addReport({ forceId: task.forceId, msg: `旧主无道，在下愿弃暗投明！\n【外交】策反成功，${target.name} 倒戈！`, avatarId: target.id });
                            } else if (task.data.subtype === 'Induce') {
                                updatePerson(target.id, p => { p.belong = playerForceId; });
                                addReport({ forceId: task.forceId, msg: `${msgPrefix}已成功劝降 ${target.name}！`, avatarId: executor?.id });
                                addReport({ forceId: task.forceId, msg: `末将愿降，请受我一拜！\n【外交】劝降成功，${target.name} 投降！`, avatarId: target.id });
                            }
                        } else {
                            addReport({ forceId: task.forceId, msg: `${msgPrefix}针对 ${target.name} 的计谋失败了。`, avatarId: executor?.id });
                            if (['Canvass', 'Induce'].includes(task.data.subtype)) {
                                addReport({ forceId: task.forceId, msg: `忠臣不事二主，要杀便杀！`, avatarId: target.id });
                            }
                        }
                    }
                }
            });
            if (newAiReports.length > 0) {
                setAiBattleReports(newAiReports);
            }
            processDelayedTasks();
        }
    }, [month]);

    const myCities = Object.values(cities).filter(c => c.belong === playerForceId);
    const myPersons = Object.values(persons).filter(p => p.belong === playerForceId);
    
    const currentCity = selectedCityId !== null ? cities[selectedCityId] : null;

    const [menuState, setMenuState] = useState<'NONE' | 'MAIN' | 'CITY' | 'DOMESTIC' | 'DIPLOMACY' | 'MILITARY' | 'STATUS' | 'SAVE'>('NONE');

    const [commandCtx, setCommandCtx] = useState<{
        cmd: string | null;
        step: CommandStep;
        executors: number[];
        targetCityId?: number;
        targetPersonId?: number;
        amounts?: Record<number | string, number>;
    }>({ cmd: null, step: 'NONE', executors: [], amounts: {} });

    const [reportMsg, setReportMsg] = useState<{avatarId: number, text: string} | null>(null);
    const [aiBattleReports, setAiBattleReports] = useState<string[]>([]);
    const [saveSlots, setSaveSlots] = useState<any[]>([]);

    const handleCommandClick = (cmd: string) => {
        setCommandCtx({ cmd, step: 'SELECT_EXECUTORS', executors: [], amounts: {} });
        setMenuState('NONE');
    };

    const isMultiSelectCommand = (cmd: string | null) => {
        return cmd === '移动' || cmd === '分配' || cmd === '赏赐' || cmd === '出征';
    };

    const handleGeneralClick = (generalId: number) => {
        if (isMultiSelectCommand(commandCtx.cmd)) {
            setCommandCtx(prev => {
                const isSelected = prev.executors.includes(generalId);
                return {
                    ...prev,
                    executors: isSelected 
                        ? prev.executors.filter(id => id !== generalId)
                        : [...prev.executors, generalId]
                };
            });
        } else {
            handleSingleExecutorSelected(generalId);
        }
    };

    const handleSingleExecutorSelected = (generalId: number) => {
        const cmd = commandCtx.cmd;
        if (['离间', '招揽', '策反', '劝降', '招降'].includes(cmd!)) {
            setCommandCtx(prev => ({ ...prev, step: 'SELECT_TARGET_PERSON', executors: [generalId] }));
        } else if (['侦察', '输送'].includes(cmd!)) {
            setCommandCtx(prev => ({ ...prev, step: 'SELECT_TARGET_CITY', executors: [generalId] }));
        } else {
            executeCommands(cmd!, [generalId]);
        }
    };

    const handleMultiSelectConfirm = () => {
        const cmd = commandCtx.cmd;
        if (commandCtx.executors.length === 0) return;

        if (cmd === '移动' || cmd === '出征') {
            setCommandCtx(prev => ({ ...prev, step: 'SELECT_TARGET_CITY' }));
        } else {
            executeCommands(cmd!, commandCtx.executors, { amounts: commandCtx.amounts });
        }
    };

    const handleTargetCitySelected = (targetCityId: number) => {
        const cmd = commandCtx.cmd;
        if (cmd === '输送') {
            setCommandCtx(prev => ({ ...prev, step: 'INPUT_AMOUNTS', targetCityId }));
        } else {
            executeCommands(cmd!, commandCtx.executors, { targetCityId });
        }
    };

    const handleTargetPersonSelected = (targetPersonId: number) => {
        const cmd = commandCtx.cmd;
        executeCommands(cmd!, commandCtx.executors, { targetPersonId });
    };

    const executeCommands = (cmd: string, executors: number[], extraArgs?: any) => {
        if (!currentCity) return;
        
        const store = useGameStore.getState();

        if (cmd === '出征') {
            if (!extraArgs?.targetCityId || !executors || executors.length === 0) {
                alert('必须选择目标城池和出征武将');
                return;
            }
            // 扣除出征武将体力，并标记为已行动
            executors.forEach((pid: number) => {
                store.updatePerson(pid, p => { p.thew = Math.max(0, p.thew - 10); p.acted = true; });
            });
            
            store.addLog(`【军备】${store.persons[executors[0]].name} 等人向 ${store.cities[extraArgs.targetCityId].name} 发起了进攻！命令已下达，将于下月执行。`);
            const executorId = executors[0];
            const isKing = store.forces[store.playerForceId]?.kingId === executorId;
            const msgPrefix = isKing ? `向 ${store.cities[extraArgs.targetCityId].name} 的出征命令已经下达，` : `主公，向 ${store.cities[extraArgs.targetCityId].name} 的出征命令已经传达，`;
            setReportMsg({ avatarId: executorId, text: `${msgPrefix}大军将于下月兵临城下！` });

            store.addDelayedTask({
                type: 'ATTACK',
                monthsLeft: 1, // 下个回合开始时触发
                forceId: store.playerForceId,
                data: {
                    fromCityId: currentCity.id,
                    targetCityId: extraArgs.targetCityId,
                    executorIds: executors
                }
            });

            setCommandCtx({ cmd: null, step: 'NONE', executors: [], amounts: {} });
            return;
        }

        if (cmd === '输送' && !extraArgs?.amounts && extraArgs?.targetCityId !== undefined) {
            setCommandCtx(prev => ({ ...prev, step: 'INPUT_AMOUNTS' }));
            return;
        }

        for (const executorId of executors) {
            let commandObj = null;
            switch (cmd) {
                case '开垦': commandObj = new AssartCommand(currentCity.id, executorId); break;
                case '招商': commandObj = new AccractbusinessCommand(currentCity.id, executorId); break;
                case '搜寻': commandObj = new SearchCommand(currentCity.id, executorId); break;
                case '治理': commandObj = new FatherCommand(currentCity.id, executorId); break;
                case '出巡': commandObj = new InspectionCommand(currentCity.id, executorId); break;
                case '征兵': commandObj = new ConscriptionCommand(currentCity.id, executorId); break;
                case '侦察': commandObj = new ReconnoitreCommand(executorId, extraArgs?.targetCityId!); break;
                case '掠夺': commandObj = new DepredateCommand(currentCity.id, executorId); break;
                case '分配': 
                    const targetArms = extraArgs?.amounts?.[executorId] ?? persons[executorId].arms ?? 0;
                    commandObj = new DistributeCommand(currentCity.id, executorId, targetArms); 
                    break;
                case '赏赐': commandObj = new LargessCommand(currentCity.id, executorId); break;
                case '没收': commandObj = new ConfiscateCommand(currentCity.id, executorId); break;
                case '宴请': commandObj = new TreatCommand(currentCity.id, executorId); break;
                case '处斩': commandObj = new KillCommand(executorId); break;
                case '流放': commandObj = new BanishCommand(executorId); break;
                case '招降': commandObj = new SurrenderCommand(executorId, extraArgs?.targetPersonId!); break;
                
                case '移动': commandObj = new MoveCommand(currentCity.id, extraArgs?.targetCityId!, executors, playerForceId); break;
                case '输送': commandObj = new TransportationCommand(currentCity.id, extraArgs?.targetCityId!, executorId, playerForceId, extraArgs?.amounts?.money || 0, extraArgs?.amounts?.food || 0, extraArgs?.amounts?.arms || 0); break;
    
                case '离间': commandObj = new AlienateCommand(currentCity.id, executorId, extraArgs?.targetPersonId!); break;
                case '招揽': commandObj = new CanvassCommand(currentCity.id, executorId, extraArgs?.targetPersonId!); break;
                case '策反': commandObj = new CounterespionageCommand(currentCity.id, executorId, extraArgs?.targetPersonId!); break;
                case '劝降': commandObj = new InduceCommand(currentCity.id, executorId, extraArgs?.targetPersonId!); break;
                case '交易': 
                    commandObj = new ExchangeCommand(currentCity.id, executorId, extraArgs?.amounts?.type || 'buy', extraArgs?.amounts?.amount || 0); 
                    break;
            }
    
            if (commandObj) {
                const result = commandObj.execute() as { success: boolean; message?: string };
                if (result.success) {
                    if (!['赏赐', '没收', '宴请', '处斩', '流放'].includes(cmd)) {
                        store.updatePerson(executorId, p => { p.acted = true; });
                    }
                    if (result.message) {
                        setReportMsg({ avatarId: executorId, text: result.message });
                    }
                } else {
                    if (result.message) {
                        setReportMsg({ avatarId: executorId, text: result.message });
                    }
                }
            }
    
            if (cmd === '移动') break; 
        }
    
        const continuousCommands = ['开垦', '招商', '搜寻', '治理', '出巡', '征兵', '赏赐', '没收', '宴请'];
        if (!continuousCommands.includes(cmd)) {
            setCommandCtx({ cmd: null, step: 'NONE', executors: [], amounts: {} });
        } else {
            // Keep the modal open, but clear the selection
            setCommandCtx(prev => ({ ...prev, executors: [] }));
        }
    };

    const renderCommandUI = () => {
        if (commandCtx.step === 'NONE') return null;

        if (commandCtx.step === 'SELECT_EXECUTORS') {
            const isMulti = isMultiSelectCommand(commandCtx.cmd);
            const isTargetOnlyCmd = ['赏赐', '没收', '宴请', '处斩', '流放'].includes(commandCtx.cmd!);
            
            let availablePersons = Object.values(persons).filter(p => p.belong === playerForceId && p.city === currentCity?.id);
            if (!isTargetOnlyCmd) {
                availablePersons = availablePersons.filter(p => !p.acted);
            }

            return (
                <div style={{ position: 'absolute', inset: 0, zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div 
                        style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)' }} 
                        onClick={() => setCommandCtx({ cmd: null, step: 'NONE', executors: [], amounts: {} })}
                    />
                    <div className="ancient-menu-panel" style={{ width: `${800 * scale}px`, padding: `${24 * scale}px`, position: 'relative' }}>
                        <div style={{ paddingBottom: `${16 * scale}px`, marginBottom: `${16 * scale}px`, borderBottom: `${2 * scale}px solid #b78031`, fontSize: `${28 * scale}px`, color: '#f1c66f', fontWeight: 'bold' }}>
                            {`请选择【${commandCtx.cmd}】的${isTargetOnlyCmd ? '目标' : '执行武将'}`}
                        </div>
                        <div style={{ display: 'flex', borderBottom: `${2 * scale}px solid #b78031`, padding: `${8 * scale}px ${10 * scale}px`, fontSize: `${22 * scale}px`, fontWeight: 'bold', color: '#d6a85b' }}>
                            {isMulti && <div style={{ width: `${30 * scale}px` }}></div>}
                            <div style={{ flex: 1.2 }}>姓名</div>
                            <div style={{ flex: 1 }}>等级</div>
                            <div style={{ flex: 1.5 }}>武力/智力</div>
                            <div style={{ flex: 1.5 }}>体力/忠诚</div>
                            <div style={{ flex: 1.5 }}>兵种/兵力</div>
                            <div style={{ flex: 1.5 }}>装备道具</div>
                            {commandCtx.cmd === '分配' && <div style={{ width: `${100 * scale}px` }}>分配兵力</div>}
                        </div>
                        <div className="custom-scrollbar" style={{ maxHeight: `${400 * scale}px`, overflowY: 'auto' }}>
                            {availablePersons.length === 0 ? (
                                <div style={{ padding: `${32 * scale}px`, textAlign: 'center', fontSize: `${24 * scale}px`, color: '#766244' }}>无可选择的武将。</div>
                            ) : availablePersons.map(p => {
                                const isSelected = commandCtx.executors.includes(p.id);
                                const armsTypeName = p.armsType === 0 ? '步兵' : p.armsType === 1 ? '弓兵' : p.armsType === 2 ? '骑兵' : p.armsType === 3 ? '水军' : '未知';
                                const equipNames = p.equip && p.equip.length > 0 ? p.equip.map(eid => useGameStore.getState().goods[eid]?.name || '未知').join(', ') : '无';
                                
                                return (
                                    <div 
                                        key={p.id} 
                                        onClick={() => handleGeneralClick(p.id)} 
                                        style={{ 
                                            display: 'flex', padding: `${12 * scale}px ${10 * scale}px`, fontSize: `${22 * scale}px`, 
                                            cursor: 'pointer', borderBottom: `${1 * scale}px solid #766244`,
                                            backgroundColor: isSelected ? 'rgba(174, 121, 43, 0.3)' : 'transparent',
                                            alignItems: 'center',
                                            color: isSelected ? '#f1c66f' : '#d6a85b',
                                            transition: 'background-color 0.2s'
                                        }}
                                        onMouseEnter={(e) => { if(!isSelected) e.currentTarget.style.backgroundColor = 'rgba(174, 121, 43, 0.15)'; }}
                                        onMouseLeave={(e) => { if(!isSelected) e.currentTarget.style.backgroundColor = 'transparent'; }}
                                    >
                                        {isMulti && <div style={{ width: `${30 * scale}px` }}><input type="checkbox" checked={isSelected} readOnly /></div>}
                                        <div style={{ flex: 1.2, fontWeight: 'bold' }}>{p.name}</div>
                                        <div style={{ flex: 1 }}>{p.level}</div>
                                        <div style={{ flex: 1.5 }}>{p.force} / {p.iq}</div>
                                        <div style={{ flex: 1.5 }}>{p.thew} / {p.devotion}</div>
                                        <div style={{ flex: 1.5 }}>{armsTypeName} / {p.arms}</div>
                                        <div style={{ flex: 1.5, fontSize: `${18 * scale}px`, color: '#b78031' }}>{equipNames}</div>
                                        {commandCtx.cmd === '分配' && isSelected && (
                                            <div style={{ width: `${100 * scale}px` }}>
                                                <input 
                                                    type="number" 
                                                    value={commandCtx.amounts?.[p.id] ?? p.arms ?? 0} 
                                                    onChange={(e) => setCommandCtx(prev => ({
                                                        ...prev, 
                                                        amounts: { ...prev.amounts, [p.id]: parseInt(e.target.value) || 0 }
                                                    }))}
                                                    onClick={e => e.stopPropagation()}
                                                    style={{ width: `${80 * scale}px`, fontSize: `${20 * scale}px`, backgroundColor: '#2a1609', border: `${1 * scale}px solid #b78031`, padding: `${4 * scale}px ${8 * scale}px`, color: '#f1c66f', fontFamily: '"Kaiti", "STKaiti", "KaiTi", "Songti SC", serif' }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                        <div style={{ textAlign: 'center', paddingTop: `${24 * scale}px`, display: 'flex', justifyContent: 'center', gap: `${32 * scale}px` }}>
                            {isMulti && <button className="ancient-menu-button" onClick={handleMultiSelectConfirm}>确认</button>}
                            <button className="ancient-menu-button" style={{ color: '#766244' }} onClick={() => setCommandCtx({ cmd: null, step: 'NONE', executors: [], amounts: {} })}>取消</button>
                        </div>
                    </div>
                </div>
            );
        }

        if (commandCtx.step === 'SELECT_TARGET_CITY') {
            return (
                <div style={{ position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', backgroundColor: 'rgba(26,17,12,0.9)', padding: '15px 30px', zIndex: 200, color: 'var(--theme-gold)', border: '2px solid var(--theme-gold)', fontSize: '24px', textAlign: 'center', borderRadius: '8px' }}>
                    <div style={{ marginBottom: '10px' }}>请在大地图上点击目标城池。</div>
                    <GameButton variant="secondary" onClick={() => setCommandCtx({ cmd: null, step: 'NONE', executors: [], amounts: {} })}>取消</GameButton>
                </div>
            );
        }

        if (commandCtx.step === 'SELECT_TARGET_PERSON') {
            let availablePersons = Object.values(persons);
            if (commandCtx.cmd === '招降' || commandCtx.cmd === '处斩' || commandCtx.cmd === '流放') {
                availablePersons = availablePersons.filter(p => p.city === currentCity?.id && p.belong !== playerForceId);
            } else {
                availablePersons = availablePersons.filter(p => p.belong !== playerForceId && p.belong !== 0);
            }

            return (
                <GameModal 
                    isOpen={true} 
                    onClose={() => setCommandCtx({ cmd: null, step: 'NONE', executors: [], amounts: {} })}
                    title="请选择目标武将"
                    style={{ width: `${500 * scale}px` }}
                >
                    <div style={{ display: 'flex', borderBottom: '2px solid var(--theme-brown)', padding: `${5 * scale}px ${10 * scale}px`, fontSize: `${20 * scale}px`, fontWeight: 'bold' }}>
                        <div style={{ flex: 1.2 }}>姓名</div>
                        <div style={{ flex: 1 }}>势力</div>
                        <div style={{ flex: 1 }}>所在城市</div>
                        <div style={{ flex: 1.5 }}>武力/智力</div>
                        <div style={{ flex: 1 }}>忠诚</div>
                    </div>
                    <div className="custom-scrollbar" style={{ maxHeight: `${300 * scale}px`, overflowY: 'auto' }}>
                        {availablePersons.length === 0 ? (
                            <div style={{ padding: `${20 * scale}px`, textAlign: 'center', fontSize: `${20 * scale}px` }}>无符合条件的武将。</div>
                        ) : availablePersons.map(p => (
                            <div key={p.id} onClick={() => handleTargetPersonSelected(p.id)} style={{ display: 'flex', padding: `${10 * scale}px`, fontSize: `${20 * scale}px`, cursor: 'pointer', borderBottom: '1px solid var(--theme-border)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.1)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                <div style={{ flex: 1.2 }}>{p.name}</div>
                                <div style={{ flex: 1 }}>{p.belong ? persons[forces[p.belong]?.kingId]?.name || '君主' : '在野'}</div>
                                <div style={{ flex: 1 }}>{p.city !== undefined ? cities[p.city]?.name : '未知'}</div>
                                <div style={{ flex: 1.5 }}>{p.force} / {p.iq}</div>
                                <div style={{ flex: 1 }}>{p.devotion}</div>
                            </div>
                        ))}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: `${15 * scale}px` }}>
                        <GameButton variant="secondary" onClick={() => setCommandCtx({ cmd: null, step: 'NONE', executors: [], amounts: {} })}>取消</GameButton>
                    </div>
                </GameModal>
            );
        }

        if (commandCtx.step === 'INPUT_AMOUNTS') {
            return (
                <GameModal 
                    isOpen={true} 
                    onClose={() => setCommandCtx({ cmd: null, step: 'NONE', executors: [], amounts: {} })}
                    title="输入输送数量"
                    style={{ width: `${400 * scale}px` }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: `${15 * scale}px`, alignItems: 'center' }}>
                        <span>金钱 (最大 {currentCity?.money}):</span>
                        <input type="number" min="0" max={currentCity?.money} value={commandCtx.amounts?.money || 0} onChange={e => setCommandCtx(prev => ({ ...prev, amounts: { ...prev.amounts, money: parseInt(e.target.value) || 0 } }))} style={{ width: `${100 * scale}px`, fontSize: `${20 * scale}px`, padding: `${2 * scale}px ${5 * scale}px` }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: `${15 * scale}px`, alignItems: 'center' }}>
                        <span>粮食 (最大 {currentCity?.food}):</span>
                        <input type="number" min="0" max={currentCity?.food} value={commandCtx.amounts?.food || 0} onChange={e => setCommandCtx(prev => ({ ...prev, amounts: { ...prev.amounts, food: parseInt(e.target.value) || 0 } }))} style={{ width: `${100 * scale}px`, fontSize: `${20 * scale}px`, padding: `${2 * scale}px ${5 * scale}px` }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: `${25 * scale}px`, alignItems: 'center' }}>
                        <span>兵力 (最大 {currentCity?.mothballArms}):</span>
                        <input type="number" min="0" max={currentCity?.mothballArms} value={commandCtx.amounts?.arms || 0} onChange={e => setCommandCtx(prev => ({ ...prev, amounts: { ...prev.amounts, arms: parseInt(e.target.value) || 0 } }))} style={{ width: `${100 * scale}px`, fontSize: `${20 * scale}px`, padding: `${2 * scale}px ${5 * scale}px` }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: `${20 * scale}px` }}>
                        <GameButton onClick={() => executeCommands(commandCtx.cmd!, commandCtx.executors, { targetCityId: commandCtx.targetCityId, amounts: commandCtx.amounts })}>确认输送</GameButton>
                        <GameButton variant="secondary" onClick={() => setCommandCtx({ cmd: null, step: 'NONE', executors: [], amounts: {} })}>取消</GameButton>
                    </div>
                </GameModal>
            );
        }

        return null;
    };

    return (
        <div style={{ display: 'flex', height: '100%', width: '100%', backgroundColor: '#20150d', color: '#d6a85b', fontFamily: '"STKaiti", "KaiTi", serif', alignItems: 'center', justifyContent: 'center', userSelect: 'none' }}>
            <style>{bounceKeyframes}</style>
            
            <div style={{ display: 'flex', width: '100%', height: '100%', backgroundColor: '#25180d' }}>
                
                <div style={{ flex: 1, position: 'relative', borderRight: `${2 * scale}px solid #b78031`, boxSizing: 'border-box', backgroundColor: '#25180d', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 0 90px rgba(0,0,0,0.45)' }}>
                    
                    {aiThinkingForceId !== null && (
                        <div style={{
                            position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)',
                            zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <div style={{
                                backgroundColor: 'rgba(26,17,12,0.9)', padding: '15px 40px',
                                border: '2px solid var(--theme-gold)', borderRadius: '4px',
                                color: 'var(--theme-gold)', fontSize: '24px', letterSpacing: '4px',
                                boxShadow: '0 0 15px rgba(205,166,84,0.3)'
                            }}>
                                {forces[aiThinkingForceId]?.kingId !== undefined ? persons[forces[aiThinkingForceId].kingId]?.name : '未知'} 势力策略中...
                            </div>
                        </div>
                    )}
                    
                    <div 
                        onClick={(e) => {
                            if (reportMsg) setReportMsg(null);
                            if (e.target === e.currentTarget) {
                                if (commandCtx.step === 'SELECT_TARGET_CITY') {
                                    // Clicking on empty map cancels selection
                                    setCommandCtx({ cmd: null, step: 'NONE', executors: [], amounts: {} });
                                    return;
                                }
                                setMenuState('MAIN');
                            }
                        }}
                        style={{ 
                            position: 'relative', 
                            width: '100%', 
                            height: '100%',
                            backgroundColor: '#b0c4de',
                            backgroundImage: 'url(/assets/images/bg_world_map_new.png)',
                            backgroundSize: '100% 100%',
                            backgroundPosition: 'center',
                            border: 'none',
                            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)'
                        }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.3)', pointerEvents: 'none', zIndex: 0 }}></div>
                        
                        {menuState !== 'NONE' && (
                            <>
                                <div 
                                    style={{ position: 'absolute', inset: 0, zIndex: 99, backgroundColor: 'rgba(0,0,0,0.5)' }} 
                                    onClick={() => setMenuState('NONE')}
                                />
                                <div className="ancient-menu-panel" style={{ 
                                    position: 'absolute', 
                                    top: '50%', 
                                    left: '50%', 
                                    transform: 'translate(-50%, -50%)',
                                    zIndex: 100, 
                                    minWidth: '280px',
                                    maxHeight: '80vh',
                                    overflowY: 'auto',
                                    pointerEvents: 'auto',
                                    padding: '10px 0',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}>
                                    {menuState === 'MAIN' && (
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <button className="ancient-menu-button" onClick={() => { nextTurn(); setMenuState('NONE'); }}>策略结束</button>
                                            <button className="ancient-menu-button" onClick={() => { 
                                                setSaveSlots(getSaveSlotsInfo());
                                                setMenuState('SAVE'); 
                                            }}>存储进度</button>
                                            <button className="ancient-menu-button" style={{ borderBottom: 'none' }} onClick={() => setScreen('MAIN_MENU')}>结束游戏</button>
                                        </div>
                                    )}

                                    {menuState === 'SAVE' && (
                                        <div style={{ display: 'flex', flexDirection: 'column', width: `${360 * scale}px` }}>
                                            <div style={{ display: 'flex', justifyContent: 'center', borderBottom: `${2 * scale}px solid #b78031`, padding: `0 ${24 * scale}px ${16 * scale}px`, fontSize: `${32 * scale}px`, fontWeight: 'bold' }}>
                                                <span style={{ color: '#f1c66f', letterSpacing: `${8 * scale}px` }}>选择进度</span>
                                            </div>
                                            {saveSlots.map((s, idx) => (
                                                <button 
                                                    key={s.slot} 
                                                    className="ancient-menu-button"
                                                    onClick={() => {
                                                        useGameStore.getState().saveGame(s.slot);
                                                        setMenuState('NONE');
                                                    }}
                                                    style={{ 
                                                        padding: `${16 * scale}px ${24 * scale}px`, 
                                                        display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: '1.4',
                                                        borderBottom: idx === saveSlots.length - 1 ? 'none' : `${1 * scale}px solid rgba(183, 128, 49, 0.3)`
                                                    }}
                                                >
                                                    <span style={{ fontSize: `${24 * scale}px` }}>进度 {s.slot}</span>
                                                    <span style={{ fontSize: `${18 * scale}px`, opacity: 0.8, marginTop: `${8 * scale}px`, color: '#d6a85b', textShadow: 'none' }}>
                                                        {s.empty ? '空' : `${s.year}年${s.month}月 ${s.forceName}`}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    {menuState === 'CITY' && currentCity && (
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <div style={{ display: 'flex', justifyContent: 'center', borderBottom: `${2 * scale}px solid #b78031`, padding: `0 ${24 * scale}px ${16 * scale}px`, fontSize: `${32 * scale}px`, fontWeight: 'bold' }}>
                                                <span style={{ color: '#f1c66f', letterSpacing: `${8 * scale}px` }}>{currentCity.name}</span>
                                            </div>
                                            <button className="ancient-menu-button" onClick={() => setMenuState('DOMESTIC')}>内政</button>
                                            <button className="ancient-menu-button" onClick={() => setMenuState('DIPLOMACY')}>外交</button>
                                            <button className="ancient-menu-button" onClick={() => setMenuState('MILITARY')}>军备</button>
                                            <button className="ancient-menu-button" style={{ borderBottom: 'none' }} onClick={() => setMenuState('STATUS')}>状况</button>
                                        </div>
                                    )}

                                    {menuState === 'DOMESTIC' && (
                                        <div style={{ display: 'flex', flexDirection: 'column', width: `${380 * scale}px` }}>
                                            <div style={{ display: 'flex', justifyContent: 'center', borderBottom: `${2 * scale}px solid #b78031`, padding: `0 ${24 * scale}px ${16 * scale}px`, fontSize: `${32 * scale}px`, fontWeight: 'bold' }}>
                                                <span style={{ color: '#f1c66f', letterSpacing: `${8 * scale}px` }}>内政</span>
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr' }}>
                                                <button className="ancient-menu-button" style={{ borderBottom: '1px solid rgba(183, 128, 49, 0.3)' }} onClick={() => handleCommandClick('开垦')}>开垦</button>
                                                <div style={{ backgroundColor: 'rgba(183, 128, 49, 0.3)' }}></div>
                                                <button className="ancient-menu-button" style={{ borderBottom: '1px solid rgba(183, 128, 49, 0.3)' }} onClick={() => handleCommandClick('招商')}>招商</button>
                                                
                                                <button className="ancient-menu-button" style={{ borderBottom: '1px solid rgba(183, 128, 49, 0.3)' }} onClick={() => handleCommandClick('搜寻')}>搜寻</button>
                                                <div style={{ backgroundColor: 'rgba(183, 128, 49, 0.3)' }}></div>
                                                <button className="ancient-menu-button" style={{ borderBottom: '1px solid rgba(183, 128, 49, 0.3)' }} onClick={() => handleCommandClick('治理')}>治理</button>
                                                
                                                <button className="ancient-menu-button" style={{ borderBottom: '1px solid rgba(183, 128, 49, 0.3)' }} onClick={() => handleCommandClick('出巡')}>出巡</button>
                                                <div style={{ backgroundColor: 'rgba(183, 128, 49, 0.3)' }}></div>
                                                <button className="ancient-menu-button" style={{ borderBottom: '1px solid rgba(183, 128, 49, 0.3)' }} onClick={() => handleCommandClick('招降')}>招降</button>
                                                
                                                <button className="ancient-menu-button" style={{ borderBottom: '1px solid rgba(183, 128, 49, 0.3)' }} onClick={() => handleCommandClick('处斩')}>处斩</button>
                                                <div style={{ backgroundColor: 'rgba(183, 128, 49, 0.3)' }}></div>
                                                <button className="ancient-menu-button" style={{ borderBottom: '1px solid rgba(183, 128, 49, 0.3)' }} onClick={() => handleCommandClick('流放')}>流放</button>
                                                
                                                <button className="ancient-menu-button" style={{ borderBottom: '1px solid rgba(183, 128, 49, 0.3)' }} onClick={() => handleCommandClick('赏赐')}>赏赐</button>
                                                <div style={{ backgroundColor: 'rgba(183, 128, 49, 0.3)' }}></div>
                                                <button className="ancient-menu-button" style={{ borderBottom: '1px solid rgba(183, 128, 49, 0.3)' }} onClick={() => handleCommandClick('没收')}>没收</button>
                                                
                                                <button className="ancient-menu-button" style={{ borderBottom: '1px solid rgba(183, 128, 49, 0.3)' }} onClick={() => handleCommandClick('交易')}>交易</button>
                                                <div style={{ backgroundColor: 'rgba(183, 128, 49, 0.3)' }}></div>
                                                <button className="ancient-menu-button" style={{ borderBottom: '1px solid rgba(183, 128, 49, 0.3)' }} onClick={() => handleCommandClick('宴请')}>宴请</button>
                                                
                                                <button className="ancient-menu-button" style={{ borderBottom: 'none' }} onClick={() => handleCommandClick('输送')}>输送</button>
                                                <div style={{ backgroundColor: 'rgba(183, 128, 49, 0.3)' }}></div>
                                                <button className="ancient-menu-button" style={{ borderBottom: 'none' }} onClick={() => handleCommandClick('移动')}>移动</button>
                                            </div>
                                        </div>
                                    )}

                                    {menuState === 'DIPLOMACY' && (
                                        <div style={{ display: 'flex', flexDirection: 'column', width: `${380 * scale}px` }}>
                                            <div style={{ display: 'flex', justifyContent: 'center', borderBottom: `${2 * scale}px solid #b78031`, padding: `0 ${24 * scale}px ${16 * scale}px`, fontSize: `${32 * scale}px`, fontWeight: 'bold' }}>
                                                <span style={{ color: '#f1c66f', letterSpacing: `${8 * scale}px` }}>外交</span>
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr' }}>
                                                <button className="ancient-menu-button" style={{ borderBottom: '1px solid rgba(183, 128, 49, 0.3)' }} onClick={() => handleCommandClick('结盟')}>结盟</button>
                                                <div style={{ backgroundColor: 'rgba(183, 128, 49, 0.3)' }}></div>
                                                <button className="ancient-menu-button" style={{ borderBottom: '1px solid rgba(183, 128, 49, 0.3)' }} onClick={() => handleCommandClick('离间')}>离间</button>
                                                
                                                <button className="ancient-menu-button" style={{ borderBottom: '1px solid rgba(183, 128, 49, 0.3)' }} onClick={() => handleCommandClick('招揽')}>招揽</button>
                                                <div style={{ backgroundColor: 'rgba(183, 128, 49, 0.3)' }}></div>
                                                <button className="ancient-menu-button" style={{ borderBottom: '1px solid rgba(183, 128, 49, 0.3)' }} onClick={() => handleCommandClick('策反')}>策反</button>
                                                
                                                <button className="ancient-menu-button" style={{ borderBottom: 'none' }} onClick={() => handleCommandClick('反间')}>反间</button>
                                                <div style={{ backgroundColor: 'rgba(183, 128, 49, 0.3)' }}></div>
                                                <button className="ancient-menu-button" style={{ borderBottom: 'none' }} onClick={() => handleCommandClick('劝降')}>劝降</button>
                                            </div>
                                        </div>
                                    )}

                                    {menuState === 'MILITARY' && (
                                        <div style={{ display: 'flex', flexDirection: 'column', width: `${380 * scale}px` }}>
                                            <div style={{ display: 'flex', justifyContent: 'center', borderBottom: `${2 * scale}px solid #b78031`, padding: `0 ${24 * scale}px ${16 * scale}px`, fontSize: `${32 * scale}px`, fontWeight: 'bold' }}>
                                                <span style={{ color: '#f1c66f', letterSpacing: `${8 * scale}px` }}>军备</span>
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1px 1fr' }}>
                                                <button className="ancient-menu-button" style={{ borderBottom: '1px solid rgba(183, 128, 49, 0.3)' }} onClick={() => handleCommandClick('侦察')}>侦察</button>
                                                <div style={{ backgroundColor: 'rgba(183, 128, 49, 0.3)' }}></div>
                                                <button className="ancient-menu-button" style={{ borderBottom: '1px solid rgba(183, 128, 49, 0.3)' }} onClick={() => handleCommandClick('征兵')}>征兵</button>
                                                
                                                <button className="ancient-menu-button" style={{ borderBottom: '1px solid rgba(183, 128, 49, 0.3)' }} onClick={() => handleCommandClick('分配')}>分配</button>
                                                <div style={{ backgroundColor: 'rgba(183, 128, 49, 0.3)' }}></div>
                                                <button className="ancient-menu-button" style={{ borderBottom: '1px solid rgba(183, 128, 49, 0.3)' }} onClick={() => handleCommandClick('掠夺')}>掠夺</button>
                                                
                                                <button className="ancient-menu-button" style={{ borderBottom: 'none' }} onClick={() => handleCommandClick('出征')}>出征</button>
                                                <div style={{ backgroundColor: 'rgba(183, 128, 49, 0.3)' }}></div>
                                                <div style={{ borderBottom: 'none' }}></div>
                                            </div>
                                        </div>
                                    )}

                                    {menuState === 'STATUS' && currentCity && (
                                        <div style={{ display: 'flex', flexDirection: 'column', width: `${380 * scale}px`, fontSize: `${22 * scale}px`, padding: `0 ${24 * scale}px` }}>
                                            <div style={{ display: 'flex', justifyContent: 'center', borderBottom: `${2 * scale}px solid #b78031`, paddingBottom: `${16 * scale}px`, marginBottom: `${16 * scale}px`, fontSize: `${32 * scale}px`, fontWeight: 'bold' }}>
                                                <span style={{ color: '#f1c66f', letterSpacing: `${4 * scale}px` }}>{currentCity.name}</span>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: `${12 * scale}px` }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>归属:</span> <span style={{ color: '#f1c66f' }}>{forces[currentCity.belong] ? persons[forces[currentCity.belong].kingId]?.name : '无'}</span></div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>太守:</span> <span style={{ color: '#f1c66f' }}>
                                                    {currentCity.satrapId === 0 
                                                        ? '无' 
                                                        : (persons[currentCity.satrapId - 1]?.name || '无')}
                                                </span></div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>农业:</span> <span style={{ color: '#f1c66f' }}>{currentCity.farming}/{currentCity.farmingLimit}</span></div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>商业:</span> <span style={{ color: '#f1c66f' }}>{currentCity.commerce}/{currentCity.commerceLimit}</span></div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>民忠:</span> <span style={{ color: '#f1c66f' }}>{currentCity.peopleDevotion}</span></div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>防灾:</span> <span style={{ color: '#f1c66f' }}>{currentCity.avoidCalamity}</span></div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>人口:</span> <span style={{ color: '#f1c66f' }}>{currentCity.population}</span></div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>金钱:</span> <span style={{ color: '#f1c66f' }}>{currentCity.money}</span></div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>粮食:</span> <span style={{ color: '#f1c66f' }}>{currentCity.food}</span></div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>后备兵力:</span> <span style={{ color: '#f1c66f' }}>{currentCity.mothballArms}</span></div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>状态:</span> <span style={{ color: '#f1c66f' }}>{['正常', '饥荒', '旱灾', '水灾', '暴动'][currentCity.state] || '正常'}</span></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                    <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }}>
                        {cityLinks.map((cityLink) => {
                            const startCoords = getCityCenterCoords(cityLink.cityId);
                            if (!startCoords) return null;

                            return cityLink.links.map((link: any, idx: number) => {
                                if (cityLink.cityId >= link.targetId) return null;
                                
                                const endCoords = getCityCenterCoords(link.targetId);
                                if (!endCoords) return null;

                                return (
                                    <line 
                                        key={`${cityLink.cityId}-${link.targetId}-${idx}`}
                                        x1={startCoords.x * scale} 
                                        y1={startCoords.y * scale} 
                                        x2={endCoords.x * scale} 
                                        y2={endCoords.y * scale} 
                                        stroke="#8d6e63" 
                                        strokeWidth={2 * scale}
                                        strokeDasharray={`${5 * scale},${5 * scale}`}
                                    />
                                );
                            });
                        })}
                    </svg>

                    {C_MAP.map((cityIndex, index) => {
                        if (cityIndex === 0) return null;
                        const city = cities[cityIndex - 1];
                        if (!city) return null;

                        const cityCoords = getCityCenterCoords(city.id);
                        if (!cityCoords) return null;
                        
                        const force = forces[city.belong];

                        // 计算城池规模和图片
                        const isFriendly = city.belong === playerForceId;
                        const isNeutral = city.belong === 0;
                        const cityImage = isFriendly ? 'url(/assets/images/city_friendly.png)' : (isNeutral ? 'url(/assets/images/city_neutral.png)' : 'url(/assets/images/city_enemy.png)');
                        const citySize = (isFriendly ? 75 : 60) * scale; // 按照 1.5 倍等比例放大 (原本为 50 和 40)

                        return (
                            <div 
                                key={city.id}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (reportMsg) setReportMsg(null);

                                    if (commandCtx.step === 'SELECT_TARGET_CITY') {
                                        handleTargetCitySelected(city.id);
                                        return;
                                    }

                                    selectCity(city.id);
                                    if (city.belong === playerForceId) {
                                        setMenuState('CITY');
                                    } else {
                                        setMenuState('NONE');
                                    }
                                }}
                                style={{
                                    position: 'absolute',
                                    top: `${cityCoords.y * scale - citySize / 2}px`,
                                    left: `${cityCoords.x * scale}px`,
                                    transform: 'translate(-50%, 0)',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                                    cursor: commandCtx.step === 'SELECT_TARGET_CITY' ? 'crosshair' : 'pointer',
                                    zIndex: 10
                                }}>
                                
                                {/* 城池实心色块 */}
                                <div style={{ 
                                    width: `${citySize}px`, height: `${citySize}px`,
                                    backgroundImage: cityImage,
                                    backgroundSize: 'cover', backgroundPosition: 'center',
                                    backgroundColor: 'transparent',
                                    filter: selectedCityId === city.id 
                                        ? `drop-shadow(0 0 ${20 * scale}px #FFF)` 
                                        : (force ? `drop-shadow(0 0 ${10 * scale}px ${force.color})` : 'none'),
                                    transition: 'all 0.2s',
                                    transform: selectedCityId === city.id ? 'scale(1.2)' : 'scale(1)',
                                    zIndex: city.belong === playerForceId ? 10 : 1,
                                    position: 'relative'
                                }}>
                                    {city.belong === playerForceId && (
                                        <div style={{
                                            position: 'absolute', top: `${-25 * scale}px`, left: '50%', transform: 'translateX(-50%)',
                                            color: '#d6a85b', fontSize: `${24 * scale}px`, fontWeight: 'bold', textShadow: `0 0 ${5 * scale}px #000`,
                                            animation: 'bounce 1s infinite alternate'
                                        }}>
                                            ▼
                                        </div>
                                    )}
                                </div>

                                {/* 城市名称 */}
                                <div style={{
                                    marginTop: `${6 * scale}px`,
                                    transform: `scale(${scale})`,
                                    transformOrigin: 'top center',
                                    zIndex: 10
                                }}>
                                    <span style={{ 
                                        backgroundColor: city.belong === playerForceId ? '#d6a85b' : '#2a1609', 
                                        color: city.belong === playerForceId ? '#2a1609' : '#d6a85b',
                                        padding: '3px 6px', 
                                        fontSize: '18px', 
                                        fontWeight: city.belong === playerForceId ? 'bold' : 'normal',
                                        border: '2px solid #d6a85b', 
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {city.name}
                                    </span>
                                </div>
                            </div>
                        );
                    })}

                    {renderCommandUI()}

                    {reportMsg && (
                        <GameModal 
                            isOpen={true} 
                            onClose={() => setReportMsg(null)}
                            style={{ width: '600px', cursor: 'pointer' }}
                        >
                            <div onClick={() => setReportMsg(null)} style={{ display: 'flex', alignItems: 'center', gap: `${20 * scale}px` }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <div style={{ 
                                        width: `${80 * scale}px`, height: `${80 * scale}px`, border: `${2 * scale}px solid var(--theme-brown)`, backgroundColor: '#000',
                                        backgroundImage: persons[reportMsg.avatarId]?.name ? `url(/assets/images/generals/${persons[reportMsg.avatarId]?.name}.png)` : 'none',
                                        backgroundSize: 'cover', backgroundPosition: 'center',
                                        display: 'flex', justifyContent: 'center', alignItems: 'center'
                                    }}>
                                        {!persons[reportMsg.avatarId]?.name && "头像"}
                                    </div>
                                    <div style={{ marginTop: `${5 * scale}px`, fontSize: `${20 * scale}px`, color: 'var(--theme-dark)', fontWeight: 'bold' }}>
                                        {persons[reportMsg.avatarId]?.name}
                                    </div>
                                </div>
                                <div style={{ flex: 1, fontSize: `${24 * scale}px`, color: 'var(--theme-dark)', lineHeight: '1.5' }}>
                                    {reportMsg.text}
                                </div>
                            </div>
                        </GameModal>
                    )}

                    {showReportModal && (
                        <GameModal 
                            isOpen={true} 
                            onClose={handleNextReport}
                            title="回合汇报"
                            style={{ width: `${600 * scale}px` }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: `${20 * scale}px` }}>
                                {playerReports[currentReportIndex].avatarId !== undefined && (
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <div style={{ 
                                            width: `${80 * scale}px`, height: `${80 * scale}px`, border: `${2 * scale}px solid var(--theme-brown)`, backgroundColor: '#000',
                                            backgroundImage: persons[playerReports[currentReportIndex].avatarId!]?.name ? `url(/assets/images/generals/${persons[playerReports[currentReportIndex].avatarId!]?.name}.png)` : 'none',
                                            backgroundSize: 'cover', backgroundPosition: 'center',
                                            display: 'flex', justifyContent: 'center', alignItems: 'center'
                                        }}>
                                            {!persons[playerReports[currentReportIndex].avatarId!]?.name && "头像"}
                                        </div>
                                        <div style={{ marginTop: `${5 * scale}px`, fontSize: `${20 * scale}px`, color: 'var(--theme-dark)', fontWeight: 'bold' }}>
                                            {persons[playerReports[currentReportIndex].avatarId!]?.name}
                                        </div>
                                    </div>
                                )}
                                <div style={{ flex: 1, fontSize: `${22 * scale}px`, color: 'var(--theme-dark)', lineHeight: '1.6', minHeight: `${80 * scale}px`, display: 'flex', alignItems: 'center', whiteSpace: 'pre-line' }}>
                                    {playerReports[currentReportIndex].msg}
                                </div>
                            </div>
                            <div style={{ textAlign: 'center', marginTop: `${20 * scale}px` }}>
                                <GameButton onClick={handleNextReport}>确认</GameButton>
                            </div>
                        </GameModal>
                    )}

                    {aiBattleReports.length > 0 && !showReportModal && (
                        <GameModal 
                            isOpen={true} 
                            onClose={() => {
                                const nextReports = [...aiBattleReports];
                                nextReports.shift();
                                setAiBattleReports(nextReports);
                            }}
                            title="天下大势"
                            style={{ width: `${600 * scale}px` }}
                        >
                            <div style={{ fontSize: `${22 * scale}px`, color: 'var(--theme-dark)', lineHeight: '1.6', minHeight: `${80 * scale}px`, display: 'flex', alignItems: 'center', justifyContent: 'center', whiteSpace: 'pre-line' }}>
                                {aiBattleReports[0]}
                            </div>
                            <div style={{ textAlign: 'center', marginTop: `${20 * scale}px` }}>
                                <GameButton onClick={() => {
                                    const nextReports = [...aiBattleReports];
                                    nextReports.shift();
                                    setAiBattleReports(nextReports);
                                }}>
                                    确认
                                </GameButton>
                            </div>
                        </GameModal>
                    )}
                </div>
            </div>

            <div style={{ width: `${300 * scale}px`, backgroundColor: '#2a1609', display: 'flex', flexDirection: 'column', padding: `${16 * scale}px`, boxSizing: 'border-box', borderLeft: `${2 * scale}px solid #b78031`, boxShadow: `inset 0 0 0 ${2 * scale}px #2a1609, inset 0 0 0 ${4 * scale}px #b78031` }}>
                
                <div style={{ 
                    width: '100%', height: `${300 * scale}px`, border: `${2 * scale}px solid #b78031`, marginBottom: `${30 * scale}px`, 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#2a1609',
                    backgroundImage: forces[playerForceId] && persons[forces[playerForceId].kingId] ? `url(/assets/images/generals/${persons[forces[playerForceId].kingId].name}.png)` : 'none',
                    backgroundSize: 'cover', backgroundPosition: 'top',
                    boxShadow: `inset 0 0 ${8 * scale}px rgba(0,0,0,0.8)`
                }}>
                    {!(forces[playerForceId] && persons[forces[playerForceId].kingId]) && "[君主头像]"}
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-around', color: '#d6a85b', fontSize: `${32 * scale}px`, marginBottom: 'auto' }}>
                    <span>城: {myCities.length}</span>
                    <span>将: {myPersons.length}</span>
                </div>

                <div style={{ borderTop: `${2 * scale}px solid #b78031`, paddingTop: `${30 * scale}px`, textAlign: 'center', fontSize: `${42 * scale}px`, letterSpacing: `${4 * scale}px`, paddingBottom: `${30 * scale}px`, color: '#d6a85b' }}>
                    <div>{year} 年</div>
                    <div style={{ margin: `${15 * scale}px 0` }}>{month} 月</div>
                    <div style={{ marginTop: `${30 * scale}px`, fontWeight: 'bold' }}>{currentCity?.name || '平原'}</div>
                </div>
            </div>

        </div>
        </div>
    );
};
