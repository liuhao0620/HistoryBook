import React, { useState } from 'react';
import { useBattleStore } from '../../core/battle/useBattleStore';
import { TerrainType, Weather } from '../../core/battle/BattleTypes';
import { GamePanel } from '../components/ui/GamePanel';
import { GameButton } from '../components/ui/GameButton';

const TILE_SIZE = 80;

const TERRAIN_COLORS: Record<TerrainType, string> = {
    [TerrainType.GRASS]: '#4caf50',
    [TerrainType.PLAIN]: '#8bc34a',
    [TerrainType.MOUNTAIN]: '#795548',
    [TerrainType.FOREST]: '#2e7d32',
    [TerrainType.VILLAGE]: '#ffeb3b',
    [TerrainType.CITY]: '#9e9e9e',
    [TerrainType.CAMP]: '#f44336',
    [TerrainType.RIVER]: '#2196f3',
};

const WEATHER_NAMES: Record<Weather, string> = {
    [Weather.SUNNY]: '晴天',
    [Weather.CLOUDY]: '多云',
    [Weather.WINDY]: '大风',
    [Weather.RAINY]: '下雨',
    [Weather.SNOWY]: '冰雹',
};

export const BattleScreen: React.FC = () => {
    const store = useBattleStore();
    const { map, units, day, weather, activeUnitId, reachableTiles, attackableTiles, isAiThinking, isAttackerTurn } = store;

    const [attackingUnitId, setAttackingUnitId] = useState<string | null>(null);
    const [attackedUnitId, setAttackedUnitId] = useState<string | null>(null);
    const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
    const [selectingSkill, setSelectingSkill] = useState<boolean>(false);

    const winStatus = store.checkWinCondition();

    if (winStatus) {
        return (
            <div style={{ display: 'flex', height: '100vh', backgroundColor: '#2b1d14', alignItems: 'center', justifyContent: 'center', fontFamily: '"Kaiti", "STKaiti", serif', userSelect: 'none' }}>
                <div style={{ width: '1180px', height: '720px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--theme-bg-dark)', color: 'var(--theme-primary)', boxShadow: '0 0 20px rgba(0,0,0,0.8)' }}>
                    <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>战斗结束</h1>
                    <h2 style={{ fontSize: '32px', color: winStatus === 'ATTACKER_WIN' ? '#ff4444' : '#4444ff' }}>
                        {winStatus === 'ATTACKER_WIN' ? '攻方胜利！' : '守方胜利！'}
                    </h2>
                    <GameButton 
                        style={{ marginTop: '30px', padding: '10px 30px', fontSize: '20px' }}
                        onClick={() => store.endBattle(winStatus)}
                    >
                        返回大地图
                    </GameButton>
                </div>
            </div>
        );
    }

    const handleTileClick = (x: number, y: number) => {
        if (attackingUnitId || isAiThinking) return;

        const clickedUnit = Object.values(units).find(u => u.x === x && u.y === y && u.armsCount > 0);

        if (activeUnitId) {
            const activeUnit = units[activeUnitId];
            
            const isAttackable = attackableTiles.some(t => t.x === x && t.y === y);
            if (isAttackable && clickedUnit && clickedUnit.isAttacker !== activeUnit.isAttacker) {
                setAttackingUnitId(activeUnitId);
                setAttackedUnitId(clickedUnit.id);
                setTimeout(() => {
                    if (selectingSkill) {
                        store.useSkill(activeUnitId, clickedUnit.id, 4);
                        setSelectingSkill(false);
                    } else {
                        store.attack(activeUnitId, clickedUnit.id);
                    }
                    setAttackingUnitId(null);
                    setAttackedUnitId(null);
                }, 400);
                return;
            }

            const isReachable = reachableTiles.some(t => t.x === x && t.y === y);
            if (isReachable && !clickedUnit) {
                store.moveUnit(activeUnitId, x, y);
                return;
            }

            if (clickedUnit?.id === activeUnitId) {
                store.rest(activeUnitId);
                setSelectingSkill(false);
                return;
            }

            store.selectUnit(null);
            setSelectingSkill(false);
        } else {
            if (clickedUnit && clickedUnit.isAttacker === isAttackerTurn && !clickedUnit.hasActed) {
                store.selectUnit(clickedUnit.id);
                setSelectingSkill(false);
            }
        }
    };

    const handleImgError = (unitId: string) => {
        setImgErrors(prev => ({ ...prev, [unitId]: true }));
    };

    return (
        <div style={{ display: 'flex', height: '100vh', backgroundColor: '#2b1d14', alignItems: 'center', justifyContent: 'center', fontFamily: '"Kaiti", "STKaiti", serif', userSelect: 'none' }}>
            <div style={{ width: '1180px', height: '720px', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--theme-bg-dark)', color: 'var(--theme-text)', boxShadow: '0 0 20px rgba(0,0,0,0.8)' }}>
            <style>
                {`
                    @keyframes battleShake {
                        0% { transform: translate(1px, 1px) rotate(0deg) scale(1.1); }
                        10% { transform: translate(-1px, -2px) rotate(-1deg) scale(1.1); }
                        20% { transform: translate(-3px, 0px) rotate(1deg) scale(1.1); }
                        30% { transform: translate(3px, 2px) rotate(0deg) scale(1.1); }
                        40% { transform: translate(1px, -1px) rotate(1deg) scale(1.1); }
                        50% { transform: translate(-1px, 2px) rotate(-1deg) scale(1.1); }
                        60% { transform: translate(-3px, 1px) rotate(0deg) scale(1.1); }
                        70% { transform: translate(3px, 1px) rotate(-1deg) scale(1.1); }
                        80% { transform: translate(-1px, -1px) rotate(1deg) scale(1.1); }
                        90% { transform: translate(1px, 2px) rotate(0deg) scale(1.1); }
                        100% { transform: translate(1px, -2px) rotate(-1deg) scale(1); }
                    }
                    @keyframes battleBlink {
                        0% { opacity: 1; filter: brightness(1); }
                        50% { opacity: 0.3; filter: brightness(2) drop-shadow(0 0 10px red); }
                        100% { opacity: 1; filter: brightness(1); }
                    }
                    .unit-attacking {
                        animation: battleShake 0.4s ease-in-out;
                        z-index: 20 !important;
                    }
                    .unit-attacked {
                        animation: battleBlink 0.4s ease-in-out;
                        z-index: 19 !important;
                    }
                `}
            </style>
            
            {/* 顶部状态栏 */}
            <GamePanel style={{ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                    第 {day}/30 天 | 天气：{WEATHER_NAMES[weather]}
                </div>
                <div style={{ display: 'flex', gap: '20px', fontWeight: 'bold' }}>
                    <div style={{ color: '#ff6b6b' }}>攻方粮草：{store.attackerFood}</div>
                    <div style={{ color: '#4d94ff' }}>守方粮草：{store.defenderFood}</div>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    {isAiThinking && <span style={{ color: '#ffeb3b', animation: 'battleBlink 1s infinite' }}>AI思考中...</span>}
                    <GameButton onClick={() => store.endTurn()} disabled={isAiThinking}>
                        结束本回合
                    </GameButton>
                </div>
            </GamePanel>

            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                {/* 战场地图区 */}
                <div style={{ flex: 1, overflow: 'auto', backgroundColor: '#111', padding: '20px' }}>
                    <div style={{ 
                        position: 'relative',
                        width: map.width * TILE_SIZE, 
                        height: map.height * TILE_SIZE,
                        margin: '0 auto',
                        border: '2px solid var(--theme-border)',
                        boxShadow: '0 0 20px rgba(0,0,0,0.8)'
                    }}>
                        {/* 绘制地形 */}
                        {map.tiles.map((row, y) => 
                            row.map((terrain, x) => {
                                const isReachable = reachableTiles.some(t => t.x === x && t.y === y);
                                const isAttackable = attackableTiles.some(t => t.x === x && t.y === y);
                                return (
                                    <div 
                                        key={`${x}-${y}`}
                                        onClick={() => handleTileClick(x, y)}
                                        style={{
                                            position: 'absolute',
                                            left: x * TILE_SIZE,
                                            top: y * TILE_SIZE,
                                            width: TILE_SIZE,
                                            height: TILE_SIZE,
                                            backgroundColor: TERRAIN_COLORS[terrain],
                                            border: '1px solid rgba(255,255,255,0.05)',
                                            boxSizing: 'border-box',
                                            cursor: (isReachable || isAttackable) ? 'pointer' : 'default',
                                        }}
                                    >
                                        {/* 移动范围遮罩 */}
                                        {isReachable && <div style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.3)', pointerEvents: 'none' }} />}
                                        {/* 攻击范围遮罩 */}
                                        {isAttackable && <div style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(255, 0, 0, 0.4)', pointerEvents: 'none' }} />}
                                    </div>
                                );
                            })
                        )}

                        {/* 绘制单位 */}
                        {Object.values(units).filter(u => u.armsCount > 0).map(unit => {
                            const isActive = unit.id === activeUnitId;
                            const isAttacking = unit.id === attackingUnitId;
                            const isAttacked = unit.id === attackedUnitId;
                            
                            let className = '';
                            if (isAttacking) className = 'unit-attacking';
                            if (isAttacked) className = 'unit-attacked';

                            const showAvatar = !imgErrors[unit.id];

                            return (
                                <div
                                    key={unit.id}
                                    className={className}
                                    onClick={(e) => { e.stopPropagation(); handleTileClick(unit.x, unit.y); }}
                                    style={{
                                        position: 'absolute',
                                        left: unit.x * TILE_SIZE,
                                        top: unit.y * TILE_SIZE,
                                        width: TILE_SIZE,
                                        height: TILE_SIZE,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        zIndex: isActive ? 15 : 10,
                                        opacity: unit.hasActed && !isActive ? 0.6 : 1,
                                        transition: 'left 0.2s, top 0.2s',
                                        filter: isActive ? 'drop-shadow(0 0 8px var(--theme-primary)) brightness(1.2)' : 'none'
                                    }}
                                >
                                    <div style={{
                                        width: '85%',
                                        height: '85%',
                                        backgroundColor: showAvatar ? '#222' : unit.color,
                                        border: `2px solid ${isActive ? 'var(--theme-primary)' : (unit.isAttacker ? '#ff4444' : '#4444ff')}`,
                                        borderRadius: '50%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#fff',
                                        fontSize: '10px',
                                        fontWeight: 'bold',
                                        textShadow: '1px 1px 1px #000',
                                        overflow: 'hidden',
                                        position: 'relative',
                                        boxShadow: isActive ? '0 0 10px var(--theme-primary)' : '0 2px 4px rgba(0,0,0,0.5)'
                                    }}>
                                        {showAvatar ? (
                                            <>
                                                <img 
                                                    src={`/assets/images/generals/${unit.name}.png`} 
                                                    alt={unit.name}
                                                    onError={() => handleImgError(unit.id)}
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                                <div style={{
                                                    position: 'absolute',
                                                    bottom: 0,
                                                    width: '100%',
                                                    backgroundColor: 'rgba(0,0,0,0.6)',
                                                    fontSize: '8px',
                                                    textAlign: 'center',
                                                    padding: '1px 0'
                                                }}>
                                                    {unit.armsCount}
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div>{unit.name.substring(0, 1)}</div>
                                                <div style={{ fontSize: '8px' }}>{unit.armsCount}</div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 右侧信息面板 */}
                <GamePanel style={{ width: '280px', borderRadius: 0, borderTop: 'none', borderBottom: 'none', borderRight: 'none', display: 'flex', flexDirection: 'column' }}>
                    <h3 className="game-panel-title">选中单位</h3>
                    {activeUnitId && units[activeUnitId] ? (
                        <div style={{ fontSize: '14px', lineHeight: '1.8', marginTop: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                {!imgErrors[activeUnitId] ? (
                                    <img 
                                        src={`/assets/images/generals/${units[activeUnitId].name}.png`} 
                                        alt={units[activeUnitId].name}
                                        style={{ width: '50px', height: '50px', borderRadius: '5px', border: `1px solid ${units[activeUnitId].isAttacker ? '#ff4444' : '#4444ff'}`, objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div style={{ width: '50px', height: '50px', backgroundColor: units[activeUnitId].color, borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                        {units[activeUnitId].name[0]}
                                    </div>
                                )}
                                <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--theme-primary)' }}>
                                    {units[activeUnitId].name}
                                </div>
                            </div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px' }}>
                                <div>阵营: {units[activeUnitId].isAttacker ? <span style={{color: '#ff6b6b'}}>攻方</span> : <span style={{color: '#4d94ff'}}>守方</span>}</div>
                                <div>状态: {units[activeUnitId].hasActed ? '已行动' : '待命'}</div>
                                <div>兵力: {units[activeUnitId].armsCount} / {units[activeUnitId].maxArms}</div>
                                <div>体力: {units[activeUnitId].hp} / {units[activeUnitId].maxHp}</div>
                                <div>武力: {units[activeUnitId].force}</div>
                                <div>智力: {units[activeUnitId].iq}</div>
                            </div>
                            
                            <div style={{ marginTop: '15px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                <GameButton 
                                    onClick={() => setSelectingSkill(!selectingSkill)}
                                    style={{ flex: 1, padding: '5px', backgroundColor: selectingSkill ? 'var(--theme-primary)' : '' }}
                                >{selectingSkill ? '取消技能' : '火攻'}</GameButton>
                                <GameButton 
                                    onClick={() => { store.rest(activeUnitId); setSelectingSkill(false); }}
                                    style={{ flex: 1, padding: '5px' }}
                                >待命</GameButton>
                            </div>
                            
                            <div style={{ marginTop: '15px', color: 'var(--theme-text)', opacity: 0.8, fontSize: '12px', padding: '10px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '4px' }}>
                                提示：点击蓝色区域移动，点击红色区域攻击，或点击上方按钮。<br/>
                                {selectingSkill && <span style={{ color: '#ff4444' }}>请选择技能目标（红色区域内的敌军）。</span>}
                            </div>
                        </div>
                    ) : (
                        <div style={{ color: 'var(--theme-disabled)', fontSize: '14px', marginTop: '10px' }}>请在地图上点击己方未行动的武将。</div>
                    )}

                    <h3 className="game-panel-title" style={{ marginTop: '20px' }}>战斗日志</h3>
                    <div style={{ flex: 1, overflowY: 'auto', fontSize: '12px', color: 'var(--theme-text)', marginTop: '10px', paddingRight: '5px' }}>
                        {store.battleLogs.map((log, idx) => (
                            <div key={idx} style={{ 
                                marginBottom: '6px', 
                                paddingBottom: '6px',
                                borderBottom: '1px solid var(--theme-border)',
                                color: log.includes('战斗') ? '#ff9e9e' : (log.includes('移动') ? '#9eccff' : 'var(--theme-text)'),
                                opacity: 0.9
                            }}>
                                {log}
                            </div>
                        ))}
                    </div>
                </GamePanel>
            </div>
        </div>
        </div>
    );
};
