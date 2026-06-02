import React, { useState } from 'react';
import { useBattleStore } from '../../core/battle/useBattleStore';
import { TerrainType, ArmsType } from '../../core/battle/BattleTypes';
import { GameButton } from '../components/ui/GameButton';
import { PLAIN_MAP_BACKGROUND_IMAGE, getTerrainRenderLayers } from '../battle/battleTerrainRendering';

const TILE_SIZE = 80;

const UNIT_IMAGES: Record<number, string> = {
    [ArmsType.CAVALRY]: '/assets/images/battle/unit_cavalry.png',
    [ArmsType.INFANTRY]: '/assets/images/battle/unit_infantry.png',
    [ArmsType.ARCHER]: '/assets/images/battle/unit_archer.png',
    [ArmsType.WATER]: '/assets/images/battle/unit_navy.png',
    [ArmsType.JI]: '/assets/images/battle/unit_halberdier.png',
    [ArmsType.XUAN]: '/assets/images/battle/unit_mystic.png',
};

const TERRAIN_NAMES: Record<TerrainType, string> = {
    [TerrainType.GRASS]: '草地',
    [TerrainType.PLAIN]: '平原',
    [TerrainType.MOUNTAIN]: '高山',
    [TerrainType.FOREST]: '树林',
    [TerrainType.VILLAGE]: '村庄',
    [TerrainType.CITY]: '城池',
    [TerrainType.CAMP]: '营寨',
    [TerrainType.RIVER]: '河流',
};

export const BattleScreen: React.FC = () => {
    const store = useBattleStore();
    const { map, units, day, activeUnitId, reachableTiles, attackableTiles, isAiThinking, isAttackerTurn } = store;

    const [attackingUnitId, setAttackingUnitId] = useState<string | null>(null);
    const [attackedUnitId, setAttackedUnitId] = useState<string | null>(null);
    const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
    const [selectingSkill, setSelectingSkill] = useState<boolean>(false);
    const [hoveredTile, setHoveredTile] = useState<{x: number, y: number} | null>(null);
    
    // 拖拽地图状态
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [cameraPos, setCameraPos] = useState({ x: 0, y: 0 });
    const [hasDragged, setHasDragged] = useState(false);

    // 如果没有选择武将，不显示技能面板，也不锁定地图交互
    const [showUnitInfo, setShowUnitInfo] = useState<string | null>(null);

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

    // 获取当前悬停的地形和单位
    const hoveredTerrain = hoveredTile ? map.tiles[hoveredTile.y]?.[hoveredTile.x] : null;
    const hoveredUnit = hoveredTile ? Object.values(units).find(u => u.x === hoveredTile.x && u.y === hoveredTile.y && u.armsCount > 0) : null;

    const handleTileClick = (x: number, y: number) => {
        if (hasDragged) return; // 如果是拖拽结束触发的点击，则忽略
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
                setShowUnitInfo(activeUnitId);
                return;
            }

            store.selectUnit(null);
            setSelectingSkill(false);
        } else {
            if (clickedUnit) {
                if (clickedUnit.isAttacker === isAttackerTurn && !clickedUnit.hasActed) {
                    store.selectUnit(clickedUnit.id);
                    setSelectingSkill(false);
                } else {
                    setShowUnitInfo(clickedUnit.id);
                }
            }
        }
    };

    const handleImgError = (unitId: string) => {
        setImgErrors(prev => ({ ...prev, [unitId]: true }));
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setHasDragged(false);
        setDragStart({ x: e.clientX - cameraPos.x, y: e.clientY - cameraPos.y });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging) {
            setHasDragged(true);
            const newX = e.clientX - dragStart.x;
            const newY = e.clientY - dragStart.y;
            
            // 限制拖拽范围
            const minX = - (map.width * TILE_SIZE - 1180);
            const minY = - (map.height * TILE_SIZE - 720);
            
            setCameraPos({
                x: Math.min(0, Math.max(minX, newX)),
                y: Math.min(0, Math.max(minY, newY))
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        // 延迟清除 hasDragged 状态，防止触发点击事件
        setTimeout(() => setHasDragged(false), 50);
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
            
            {/* 顶部状态栏取消，改为底部信息栏 */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
                {/* 战场地图区 */}
                <div 
                    style={{ flex: 1, overflow: 'hidden', backgroundColor: '#111', cursor: isDragging ? 'grabbing' : 'grab' }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    <div style={{ 
                        position: 'relative',
                        width: map.width * TILE_SIZE, 
                        height: map.height * TILE_SIZE,
                        transform: `translate(${cameraPos.x}px, ${cameraPos.y}px)`,
                        transition: isDragging ? 'none' : 'transform 0.1s',
                        backgroundColor: '#111',
                        backgroundImage: `url(${PLAIN_MAP_BACKGROUND_IMAGE})`,
                        backgroundRepeat: 'repeat',
                        backgroundSize: '512px 512px',
                        backgroundPosition: '0 0'
                    }}>
                        {/* 绘制地形底图和覆盖物 */}
                        {map.tiles.map((row, y) => 
                            row.map((_terrain, x) => {
                                const isReachable = reachableTiles.some(t => t.x === x && t.y === y);
                                const isAttackable = attackableTiles.some(t => t.x === x && t.y === y);
                                const terrainLayers = getTerrainRenderLayers(x, y, map);

                                return (
                                    <div 
                                        key={`${x}-${y}`}
                                        onClick={() => handleTileClick(x, y)}
                                        onMouseEnter={() => setHoveredTile({x, y})}
                                        style={{
                                            position: 'absolute',
                                            left: x * TILE_SIZE,
                                            top: y * TILE_SIZE,
                                            width: TILE_SIZE,
                                            height: TILE_SIZE,
                                            backgroundColor: terrainLayers.fallbackColor,
                                            backgroundImage: terrainLayers.baseImage ? `url(${terrainLayers.baseImage})` : undefined,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            boxSizing: 'border-box',
                                            cursor: (isReachable || isAttackable) ? 'pointer' : 'default',
                                        }}
                                    >
                                        {/* 渲染覆盖物图层 */}
                                        {terrainLayers.overlays.map((src, index) => (
                                            <div
                                                key={`overlay-${index}`}
                                                style={{
                                                    position: 'absolute',
                                                    width: '100%',
                                                    height: '100%',
                                                    backgroundImage: `url(${src})`,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center',
                                                    pointerEvents: 'none',
                                                    zIndex: 2
                                                }}
                                            />
                                        ))}

                                        {/* 移动范围遮罩 */}
                                        {isReachable && <div style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.3)', pointerEvents: 'none', zIndex: 5 }} />}
                                        {/* 攻击范围遮罩 */}
                                        {isAttackable && <div style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(255, 0, 0, 0.4)', pointerEvents: 'none', zIndex: 5 }} />}
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

                            const isWater = map.tiles[unit.y]?.[unit.x] === TerrainType.RIVER;
                            const unitImgSrc = isWater ? '/assets/images/battle/unit_naval_ship.png' : UNIT_IMAGES[unit.armsType];

                            return (
                                <div
                                    key={unit.id}
                                    className={className}
                                    onClick={(e) => { e.stopPropagation(); handleTileClick(unit.x, unit.y); }}
                                    onMouseEnter={() => setHoveredTile({x: unit.x, y: unit.y})}
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
                                    {/* 势力底座光环 */}
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '10%',
                                        width: '70%',
                                        height: '30%',
                                        backgroundColor: unit.isAttacker ? 'rgba(255, 68, 68, 0.4)' : 'rgba(68, 68, 255, 0.4)',
                                        border: `2px solid ${isActive ? 'var(--theme-primary)' : (unit.isAttacker ? '#ff4444' : '#4444ff')}`,
                                        borderRadius: '50%',
                                        boxShadow: isActive ? '0 0 10px var(--theme-primary)' : '0 2px 4px rgba(0,0,0,0.5)',
                                        zIndex: 1
                                    }} />

                                    {/* 单位Sprite */}
                                    <img 
                                        src={unitImgSrc} 
                                        alt={unit.name}
                                        style={{ 
                                            width: '90%', 
                                            height: '90%', 
                                            objectFit: 'contain',
                                            zIndex: 2
                                        }}
                                    />

                                    {/* 兵力数字 */}
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '0',
                                        backgroundColor: 'rgba(0,0,0,0.7)',
                                        color: '#fff',
                                        fontSize: '10px',
                                        fontWeight: 'bold',
                                        padding: '1px 4px',
                                        borderRadius: '4px',
                                        zIndex: 3
                                    }}>
                                        {unit.name[0]} {unit.armsCount}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                
                {/* 底部信息面板 */}
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '600px',
                    height: '60px',
                    backgroundColor: '#d6d6d6',
                    border: '2px solid #000',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '24px',
                    color: '#000',
                    fontWeight: 'bold',
                    zIndex: 100,
                    fontFamily: '"SimSun", "Songti SC", serif'
                }}>
                    <div style={{ padding: '0 20px', borderRight: '2px solid #000', height: '100%', display: 'flex', alignItems: 'center' }}>
                        粮{store.attackerFood}
                    </div>
                    <div style={{ padding: '0 20px', borderRight: '2px solid #000', height: '100%', display: 'flex', alignItems: 'center' }}>
                        天 {day}
                    </div>
                    <div style={{ padding: '0 20px', flex: 1, height: '100%', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '24px', height: '24px', border: '2px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>?</div>
                        {hoveredUnit ? hoveredUnit.name : (hoveredTerrain !== null ? TERRAIN_NAMES[hoveredTerrain] : '')}
                    </div>
                    
                    {/* 操作按钮组放在最右侧 */}
                    <div style={{ display: 'flex', height: '100%', borderLeft: '2px solid #000' }}>
                        {activeUnitId && (
                            <>
                                <button 
                                    onClick={() => setSelectingSkill(!selectingSkill)}
                                    style={{ padding: '0 20px', border: 'none', borderRight: '2px solid #000', backgroundColor: selectingSkill ? '#999' : 'transparent', cursor: 'pointer', fontSize: '20px', fontWeight: 'bold' }}
                                >
                                    {selectingSkill ? '取消' : '技能'}
                                </button>
                                <button 
                                    onClick={() => { store.rest(activeUnitId); setSelectingSkill(false); }}
                                    style={{ padding: '0 20px', border: 'none', borderRight: '2px solid #000', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '20px', fontWeight: 'bold' }}
                                >
                                    待命
                                </button>
                            </>
                        )}
                        <button 
                            onClick={() => store.endTurn()} disabled={isAiThinking}
                            style={{ padding: '0 20px', border: 'none', backgroundColor: 'transparent', cursor: isAiThinking ? 'not-allowed' : 'pointer', fontSize: '20px', fontWeight: 'bold', color: isAiThinking ? '#999' : '#000' }}
                        >
                            结束回合
                        </button>
                    </div>
                </div>
            </div>
            
            {/* 武将详细信息弹窗 */}
            {showUnitInfo && units[showUnitInfo] && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: '#d6d6d6',
                    border: '4px solid #000',
                    padding: '20px',
                    zIndex: 200,
                    width: '400px',
                    color: '#000',
                    fontFamily: '"SimSun", "Songti SC", serif',
                    boxShadow: '8px 8px 0px rgba(0,0,0,0.3)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '18px' }}>
                            <div>等级: 1</div>
                            <div>兵种: 步兵</div>
                            <div>武力: {units[showUnitInfo].force}</div>
                            <div>智力: {units[showUnitInfo].iq}</div>
                            <div>经验: 0</div>
                            <div>生命: {units[showUnitInfo].hp}</div>
                            <div>技力: {units[showUnitInfo].mp}</div>
                            <div>攻击: {units[showUnitInfo].attack}</div>
                            <div>防御: {units[showUnitInfo].defense}</div>
                            <div>兵力: {units[showUnitInfo].armsCount}</div>
                            <div>状态: 正常</div>
                        </div>
                        <div style={{ width: '100px', height: '100px', border: '2px solid #000', marginLeft: '20px', display: 'flex', flexDirection: 'column' }}>
                            {!imgErrors[showUnitInfo] ? (
                                <img 
                                    src={`/assets/images/generals/${units[showUnitInfo].name}.png`} 
                                    alt={units[showUnitInfo].name}
                                    onError={() => handleImgError(showUnitInfo)}
                                    style={{ width: '100%', height: '70px', objectFit: 'cover' }}
                                />
                            ) : (
                                <div style={{ flex: 1, backgroundColor: units[showUnitInfo].color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {units[showUnitInfo].name[0]}
                                </div>
                            )}
                            <div style={{ height: '30px', borderTop: '2px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                {units[showUnitInfo].name}
                            </div>
                        </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <button onClick={() => setShowUnitInfo(null)} style={{ padding: '5px 20px', fontSize: '18px', border: '2px solid #000', backgroundColor: '#fff', cursor: 'pointer' }}>关闭</button>
                    </div>
                </div>
            )}
        </div>
        </div>
    );
};
