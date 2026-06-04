import React, { useState, useMemo } from 'react';
import { useBattleStore } from '../../core/battle/useBattleStore';
import { TerrainType, ArmsType } from '../../core/battle/BattleTypes';
import { GameButton } from '../components/ui/GameButton';
import {
    BATTLE_PANEL_BACKGROUND_IMAGE,
    PLAIN_MAP_BACKGROUND_IMAGE,
    WATER_MAP_BACKGROUND_IMAGE,
    getTerrainRenderLayers,
    computeMountainBlocks,
} from '../battle/battleTerrainRendering';

const TILE_SIZE = 80;
const SCENE_WIDTH = 1180;
const SCENE_HEIGHT = 720;
const PANEL_WIDTH = 720;
const PANEL_HEIGHT = 82;
const ancientFontFamily = '"Kaiti", "STKaiti", "KaiTi", "Songti SC", serif';

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

const TERRAIN_DESCRIPTIONS: Record<TerrainType, string> = {
    [TerrainType.GRASS]: '适合所有兵种作战之地形，无特殊影响。',
    [TerrainType.PLAIN]: '适合骑兵作战之地形，骑兵在平原移动极快。',
    [TerrainType.MOUNTAIN]: '适合步兵和弓箭兵作战之地形。步兵、弓箭兵防御上升30%。',
    [TerrainType.FOREST]: '适合步兵作战之地形。骑兵难以穿越。',
    [TerrainType.VILLAGE]: '驻防据点。驻扎可获得防御加成，并微量恢复兵力。',
    [TerrainType.CITY]: '核心据点。驻扎可获得极大的防御加成，并恢复兵力和体力。',
    [TerrainType.CAMP]: '军事据点。驻扎可获得防御加成。',
    [TerrainType.RIVER]: '适合水军作战之地形。水军在河流中移动极快，其他兵种移动极慢。',
};

const ARMS_NAMES: Record<ArmsType, string> = {
    [ArmsType.INFANTRY]: '步兵',
    [ArmsType.CAVALRY]: '骑兵',
    [ArmsType.ARCHER]: '弓箭兵',
    [ArmsType.WATER]: '水军',
    [ArmsType.JI]: '极兵',
    [ArmsType.XUAN]: '玄兵'
};

export const BattleScreen: React.FC = () => {
    const store = useBattleStore();
    const { map, units, day, activeUnitId, reachableTiles, attackableTiles, isAiThinking, isAttackerTurn } = store;

    const mountainBlocks = useMemo(() => computeMountainBlocks(map), [map]);

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
    const [showTerrainInfo, setShowTerrainInfo] = useState<{x: number, y: number} | null>(null);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [hoveredMenuItem, setHoveredMenuItem] = useState<number | null>(null);

    const menuItems = [
        { label: '回合结束', action: () => { store.endTurn(); setIsMenuOpen(false); } },
        { label: '全军撤退', action: () => { setIsMenuOpen(false); } },
        { label: '战斗动画', action: () => { setIsMenuOpen(false); } },
        { label: '移动速度', action: () => { setIsMenuOpen(false); } },
        { label: '敌军移动', action: () => { setIsMenuOpen(false); } },
    ];

    const winStatus = store.checkWinCondition();

    if (winStatus) {
        return (
            <div style={{ display: 'flex', height: '100vh', backgroundColor: '#2b1d14', alignItems: 'center', justifyContent: 'center', fontFamily: '"Kaiti", "STKaiti", serif', userSelect: 'none' }}>
                <div style={{ width: `${SCENE_WIDTH}px`, height: `${SCENE_HEIGHT}px`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--theme-bg-dark)', color: 'var(--theme-primary)', boxShadow: '0 0 20px rgba(0,0,0,0.8)' }}>
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
                setShowTerrainInfo(null);
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
                    setShowTerrainInfo(null);
                }
            } else {
                setShowTerrainInfo({x, y});
                setShowUnitInfo(null);
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
        <div style={{ display: 'flex', height: '100vh', backgroundColor: '#20150d', alignItems: 'center', justifyContent: 'center', fontFamily: ancientFontFamily, userSelect: 'none' }}>
            <div
                data-testid="ancient-battle-frame"
                style={{
                    width: `${SCENE_WIDTH}px`,
                    height: `${SCENE_HEIGHT}px`,
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundColor: '#25180d',
                    color: '#e3bd70',
                }}
            >
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
                    style={{
                        flex: 1,
                        overflow: 'hidden',
                        position: 'relative',
                        backgroundColor: '#25180d',
                        cursor: isDragging ? 'grabbing' : 'grab',
                        boxShadow: 'inset 0 0 90px rgba(0,0,0,0.45)',
                    }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    <div
                        style={{
                            position: 'absolute',
                            inset: 0,
                            pointerEvents: 'none',
                            zIndex: 80,
                            background: 'radial-gradient(circle at center, transparent 58%, rgba(28, 17, 8, 0.36) 82%, rgba(13, 8, 4, 0.68) 100%)',
                        }}
                    />
                    <div style={{ 
                        position: 'relative',
                        width: map.width * TILE_SIZE, 
                        height: map.height * TILE_SIZE,
                        transform: `translate(${cameraPos.x}px, ${cameraPos.y}px)`,
                        transition: isDragging ? 'none' : 'transform 0.1s',
                        backgroundColor: '#9c7d3d',
                        backgroundImage: `url(${PLAIN_MAP_BACKGROUND_IMAGE})`,
                        backgroundRepeat: 'repeat',
                        backgroundSize: '512px 512px',
                        backgroundPosition: '0 0'
                    }}>
                        {/* 绘制地形底图和覆盖物 */}
                        {map.tiles.map((row, y) => 
                            row.map((terrain, x) => {
                                const isReachable = reachableTiles.some(t => t.x === x && t.y === y);
                                const isAttackable = attackableTiles.some(t => t.x === x && t.y === y);
                                const terrainLayers = getTerrainRenderLayers(x, y, map, mountainBlocks);
                                const isWater = terrain === TerrainType.RIVER;

                                return (
                                    <div 
                                        key={`${x}-${y}`}
                                        data-testid={`battle-terrain-tile-${x}-${y}`}
                                        onClick={() => handleTileClick(x, y)}
                                        onMouseEnter={() => setHoveredTile({x, y})}
                                        style={{
                                            position: 'absolute',
                                            left: x * TILE_SIZE,
                                            top: y * TILE_SIZE,
                                            width: TILE_SIZE,
                                            height: TILE_SIZE,
                                            backgroundColor: terrainLayers.fallbackColor,
                                            backgroundImage: isWater
                                                ? `url(${WATER_MAP_BACKGROUND_IMAGE})`
                                                : (terrainLayers.baseImage ? `url(${terrainLayers.baseImage})` : undefined),
                                            backgroundRepeat: isWater ? 'repeat' : undefined,
                                            backgroundSize: isWater ? '512px 512px' : 'cover',
                                            backgroundPosition: isWater ? `${-x * TILE_SIZE}px ${-y * TILE_SIZE}px` : 'center',
                                            boxSizing: 'border-box',
                                            cursor: (isReachable || isAttackable) ? 'pointer' : 'default',
                                            filter: 'sepia(0.18) saturate(0.95)',
                                        }}
                                    >
                                        {/* 渲染覆盖物图层 */}
                                        {terrainLayers.overlays.map((overlay, index) => (
                                            <div
                                                key={`overlay-${index}`}
                                                style={{
                                                    position: 'absolute',
                                                    left: overlay.left || '0',
                                                    top: overlay.top || '0',
                                                    width: overlay.width || '100%',
                                                    height: overlay.height || '100%',
                                                    transform: overlay.transform,
                                                    backgroundImage: `url(${overlay.src})`,
                                                    backgroundSize: '100% 100%',
                                                    backgroundPosition: 'center',
                                                    pointerEvents: 'none',
                                                    zIndex: 2
                                                }}
                                            />
                                        ))}

                                        {/* 移动范围遮罩 */}
                                        {isReachable && <div style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(246, 213, 130, 0.26)', boxShadow: 'inset 0 0 18px rgba(255, 241, 173, 0.42)', pointerEvents: 'none', zIndex: 5 }} />}
                                        {/* 攻击范围遮罩 */}
                                        {isAttackable && <div style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(138, 32, 22, 0.36)', boxShadow: 'inset 0 0 18px rgba(255, 85, 44, 0.46)', pointerEvents: 'none', zIndex: 5 }} />}
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
                                        filter: isActive ? 'drop-shadow(0 0 10px #f1c66f) brightness(1.15)' : 'drop-shadow(0 8px 8px rgba(39, 24, 9, 0.52))'
                                    }}
                                >
                                    {/* 势力底座光环 */}
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '10%',
                                        width: '68%',
                                        height: '26%',
                                        backgroundColor: unit.isAttacker ? 'rgba(116, 37, 24, 0.66)' : 'rgba(34, 58, 104, 0.64)',
                                        border: `2px solid ${isActive ? '#f1c66f' : '#6a4319'}`,
                                        borderRadius: '50%',
                                        boxShadow: isActive ? '0 0 12px #f1c66f, inset 0 0 8px rgba(255,231,152,0.4)' : '0 3px 7px rgba(0,0,0,0.65), inset 0 0 7px rgba(238,186,91,0.24)',
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
                                            zIndex: 2,
                                            filter: 'sepia(0.1) saturate(0.95) contrast(1.04)'
                                        }}
                                    />

                                    {/* 兵力数字 */}
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '0',
                                        backgroundColor: 'rgba(45, 25, 10, 0.86)',
                                        color: '#f1d184',
                                        fontSize: '10px',
                                        fontWeight: 'bold',
                                        padding: '1px 5px',
                                        border: '1px solid rgba(214, 156, 67, 0.72)',
                                        borderRadius: '2px',
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

                <div data-testid="ancient-battle-panel" style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    width: `${PANEL_WIDTH}px`,
                    height: `${PANEL_HEIGHT}px`,
                    backgroundColor: '#2a1609',
                    backgroundImage: `url(${BATTLE_PANEL_BACKGROUND_IMAGE})`,
                    backgroundSize: '100% 100%',
                    border: '2px solid #a4742a',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '30px',
                    color: '#d6a85b',
                    fontWeight: 'bold',
                    zIndex: 100,
                    fontFamily: ancientFontFamily,
                    boxShadow: '0 6px 18px rgba(0,0,0,0.62), inset 0 0 18px rgba(255,194,78,0.12)',
                    textShadow: '0 2px 2px rgba(0,0,0,0.75)',
                }}>
                    <div style={{ padding: '0 24px', borderRight: '1px solid rgba(185, 126, 41, 0.76)', height: '100%', display: 'flex', alignItems: 'center' }}>
                        粮{store.attackerFood}
                    </div>
                    <div style={{ padding: '0 24px', borderRight: '1px solid rgba(185, 126, 41, 0.76)', height: '100%', display: 'flex', alignItems: 'center' }}>
                        天 {day}
                    </div>
                    <div style={{ padding: '0 24px', flex: 1, height: '100%', display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
                        <div style={{ width: '42px', height: '42px', border: '2px solid #b78031', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px', color: '#e2bd74', backgroundColor: 'rgba(32, 17, 6, 0.82)', boxShadow: 'inset 0 0 8px rgba(242,197,104,0.18)' }}>?</div>
                        {hoveredUnit ? hoveredUnit.name : (hoveredTerrain !== null ? TERRAIN_NAMES[hoveredTerrain] : '')}
                    </div>
                    
                    {/* 操作按钮组放在最右侧 */}
                    <div style={{ display: 'flex', height: '100%', borderLeft: '1px solid rgba(185, 126, 41, 0.76)' }}>
                        {activeUnitId && (
                            <>
                                <button 
                                    onClick={() => setSelectingSkill(!selectingSkill)}
                                    style={{ padding: '0 18px', border: 'none', borderRight: '1px solid rgba(185, 126, 41, 0.76)', backgroundColor: selectingSkill ? 'rgba(174, 121, 43, 0.34)' : 'transparent', cursor: 'pointer', fontSize: '20px', fontWeight: 'bold', color: '#d6a85b', fontFamily: ancientFontFamily }}
                                >
                                    {selectingSkill ? '取消' : '技能'}
                                </button>
                                <button 
                                    onClick={() => { store.rest(activeUnitId); setSelectingSkill(false); }}
                                    style={{ padding: '0 18px', border: 'none', borderRight: '1px solid rgba(185, 126, 41, 0.76)', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '20px', fontWeight: 'bold', color: '#d6a85b', fontFamily: ancientFontFamily }}
                                >
                                    待命
                                </button>
                            </>
                        )}
                        <div style={{ position: 'relative', display: 'flex', height: '100%' }}>
                            <button 
                                onClick={() => setIsMenuOpen(!isMenuOpen)} disabled={isAiThinking}
                                style={{ padding: '0 18px', border: 'none', backgroundColor: 'transparent', cursor: isAiThinking ? 'not-allowed' : 'pointer', fontSize: '20px', fontWeight: 'bold', color: isAiThinking ? '#766244' : '#d6a85b', fontFamily: ancientFontFamily }}
                            >
                                菜单
                            </button>
                            {isMenuOpen && (
                                <>
                                    <div 
                                        style={{ position: 'fixed', inset: 0, zIndex: 199 }} 
                                        onClick={() => setIsMenuOpen(false)}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '100%',
                                        right: '0',
                                        marginBottom: '4px',
                                        backgroundColor: '#c0c0c0',
                                        border: '2px solid #000',
                                        color: '#000',
                                        fontFamily: '"SimSun", "Songti SC", serif',
                                        boxShadow: '4px 4px 0px rgba(0,0,0,0.4)',
                                        zIndex: 200,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        width: '140px',
                                        fontSize: '24px',
                                        fontWeight: 'bold',
                                        padding: '2px'
                                    }}>
                                        {menuItems.map((item, idx) => (
                                            <div 
                                                key={item.label}
                                                onMouseEnter={() => setHoveredMenuItem(idx)}
                                                onMouseLeave={() => setHoveredMenuItem(null)}
                                                onClick={item.action}
                                                style={{
                                                    padding: '8px 12px',
                                                    textAlign: 'center',
                                                    cursor: 'pointer',
                                                    backgroundColor: hoveredMenuItem === idx ? '#000' : 'transparent',
                                                    color: hoveredMenuItem === idx ? '#fff' : '#000',
                                                    userSelect: 'none'
                                                }}
                                            >
                                                {item.label}
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* 详细信息弹窗 */}
            {(showUnitInfo && units[showUnitInfo]) || (showTerrainInfo) ? (
                <div 
                    onClick={() => { setShowUnitInfo(null); setShowTerrainInfo(null); }}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 190,
                        backgroundColor: 'rgba(0,0,0,0.1)'
                    }}
                >
                    <div 
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            backgroundColor: '#c0c0c0',
                            border: '2px solid #000',
                            padding: '16px',
                            zIndex: 200,
                            width: showUnitInfo ? '420px' : '360px',
                            color: '#000',
                            fontFamily: '"SimSun", "Songti SC", serif',
                            boxShadow: '4px 4px 0px rgba(0,0,0,0.4)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px'
                        }}
                    >
                        {showUnitInfo && units[showUnitInfo] && (() => {
                            const unit = units[showUnitInfo];
                            return (
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px 4px', fontSize: '16px', lineHeight: '1.2' }}>
                                        <div>等级:{unit.level}</div>
                                        <div>兵种:{ARMS_NAMES[unit.armsType]}</div>
                                        <div>武力:{unit.force}</div>
                                        <div>智力:{unit.iq}</div>
                                        <div>经验:{unit.expGained || 0}</div>
                                        <div>生命:{unit.hp}</div>
                                        <div>技力:{unit.mp}</div>
                                        <div>攻击:{unit.attack}</div>
                                        <div>防御:{unit.defense}</div>
                                        <div style={{ gridColumn: '1 / span 2' }}>兵力:{unit.armsCount}</div>
                                        <div>状态:正常</div>
                                    </div>
                                    <div style={{ width: '80px', height: '100px', border: '2px solid #000', marginLeft: '12px', display: 'flex', flexDirection: 'column', backgroundColor: '#d0d0d0' }}>
                                        {!imgErrors[showUnitInfo] ? (
                                            <img 
                                                src={`/assets/images/generals/${unit.name}.png`} 
                                                alt={unit.name}
                                                onError={() => handleImgError(showUnitInfo)}
                                                style={{ width: '100%', height: '76px', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <div style={{ flex: 1, backgroundColor: unit.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: '#fff', fontWeight: 'bold' }}>
                                                {unit.name[0]}
                                            </div>
                                        )}
                                        <div style={{ height: '20px', borderTop: '1px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold' }}>
                                            {unit.name}
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}

                        {showTerrainInfo && (() => {
                            const tType = map.tiles[showTerrainInfo.y][showTerrainInfo.x];
                            return (
                                <div style={{ fontSize: '18px', lineHeight: '1.5' }}>
                                    {TERRAIN_NAMES[tType]}：{TERRAIN_DESCRIPTIONS[tType]}
                                </div>
                            );
                        })()}
                    </div>
                </div>
            ) : null}
        </div>
        </div>
    );
};
