import React, { useState, useMemo } from 'react';
import { useBattleStore } from '../../core/battle/useBattleStore';
import { TerrainType, ArmsType } from '../../core/battle/BattleTypes';
import {
    PLAIN_MAP_BACKGROUND_IMAGE,
    WATER_MAP_BACKGROUND_IMAGE,
    getTerrainRenderLayers,
    computeMountainBlocks,
} from '../battle/battleTerrainRendering';

const SCENE_WIDTH_BASE = 1920;
const SCENE_HEIGHT_BASE = 1080;
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

    const scale = 1; // Global scaling is handled in App.tsx
    const TILE_SIZE = 80 * scale;
    const SCENE_WIDTH = SCENE_WIDTH_BASE * scale;
    const SCENE_HEIGHT = SCENE_HEIGHT_BASE * scale;

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
            <div style={{ display: 'flex', height: '100%', width: '100%', backgroundColor: '#20150d', alignItems: 'center', justifyContent: 'center', fontFamily: ancientFontFamily, userSelect: 'none' }}>
                <div style={{ 
                    width: `${600 * scale}px`, 
                    height: `${400 * scale}px`, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    backgroundColor: '#2a1609',
                    border: '2px solid #b78031',
                    color: '#d6a85b',
                    boxShadow: 'inset 0 0 0 2px #2a1609, inset 0 0 0 4px #b78031, 0 6px 18px rgba(0,0,0,0.62)',
                    textShadow: '0 2px 2px rgba(0,0,0,0.75)'
                }}>
                    <h1 style={{ fontSize: `${48 * scale}px`, marginBottom: `${30 * scale}px` }}>战斗结束</h1>
                    <h2 style={{ fontSize: `${32 * scale}px`, color: winStatus === 'ATTACKER_WIN' ? '#ff6666' : '#6688ff', marginBottom: `${40 * scale}px`, textShadow: '0 2px 4px rgba(0,0,0,0.9)' }}>
                        {winStatus === 'ATTACKER_WIN' ? '攻方胜利！' : '守方胜利！'}
                    </h2>
                    <button 
                        style={{ 
                            padding: `${12 * scale}px ${32 * scale}px`, 
                            fontSize: `${24 * scale}px`, 
                            backgroundColor: '#2a1609',
                            border: '2px solid #b78031',
                            color: '#d6a85b',
                            fontWeight: 'bold',
                            fontFamily: ancientFontFamily,
                            cursor: 'pointer',
                            boxShadow: 'inset 0 0 0 2px #2a1609, inset 0 0 0 4px #b78031, 0 4px 8px rgba(0,0,0,0.5)',
                            textShadow: '0 2px 2px rgba(0,0,0,0.75)'
                        }}
                        onClick={() => store.endBattle(winStatus)}
                    >
                        返回大地图
                    </button>
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
            const minX = - (map.width * TILE_SIZE - SCENE_WIDTH);
            const minY = - (map.height * TILE_SIZE - SCENE_HEIGHT);
            
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
        <div style={{ display: 'flex', height: '100%', width: '100%', backgroundColor: '#20150d', alignItems: 'center', justifyContent: 'center', fontFamily: ancientFontFamily, userSelect: 'none' }}>
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
                <div style={{ 
                    position: 'relative',
                    width: map.width * TILE_SIZE, 
                    height: map.height * TILE_SIZE,
                    transform: `translate(${cameraPos.x}px, ${cameraPos.y}px)`,
                    transition: isDragging ? 'none' : 'transform 0.1s',
                    backgroundColor: '#9c7d3d',
                    backgroundImage: `url(${PLAIN_MAP_BACKGROUND_IMAGE})`,
                    backgroundRepeat: 'repeat',
                    backgroundSize: `${512 * scale}px ${512 * scale}px`,
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
                                            backgroundSize: isWater ? `${512 * scale}px ${512 * scale}px` : 'cover',
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
                                        {isReachable && <div style={{ position: 'absolute', width: '100%', height: '100%', backgroundImage: 'url(/assets/images/battle/ui_arrow.png)', backgroundSize: '80% 80%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', pointerEvents: 'none', zIndex: 5, opacity: 0.7 }} />}
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

                                    {/* 将领名字 */}
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '0',
                                        transform: `scale(${scale})`,
                                        transformOrigin: 'bottom center',
                                        zIndex: 3
                                    }}>
                                        <div style={{
                                            backgroundColor: 'rgba(45, 25, 10, 0.86)',
                                            color: '#f1d184',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            padding: '1px 6px',
                                            border: '1px solid rgba(214, 156, 67, 0.72)',
                                            borderRadius: '2px'
                                        }}>
                                            {unit.name}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                
                {/* 底部信息面板 */}

                <div
                    data-testid="ancient-compass-north"
                    aria-label="北"
                    style={{
                        position: 'absolute',
                        top: `${28 * scale}px`,
                        right: `${34 * scale}px`,
                        width: `${64 * scale}px`,
                        height: `${96 * scale}px`,
                        backgroundImage: `url(/assets/images/battle/compass_north.png)`,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        zIndex: 120,
                        filter: 'drop-shadow(0 3px 3px rgba(0,0,0,0.65))',
                    }}
                />

                <div data-testid="ancient-battle-panel" className="ancient-menu-panel" style={{
                    position: 'absolute',
                    bottom: `${10 * scale}px`,
                    left: `${10 * scale}px`,
                    width: `${600 * scale}px`,
                    height: `${80 * scale}px`,
                    backgroundColor: '#2a1609',
                    border: '2px solid #b78031',
                    boxSizing: 'border-box',
                    padding: `${10 * scale}px 0`,
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: `${30 * scale}px`,
                    color: '#d6a85b',
                    fontWeight: 'bold',
                    zIndex: 100,
                    fontFamily: ancientFontFamily,
                    boxShadow: 'inset 0 0 0 2px #2a1609, inset 0 0 0 4px #b78031, 0 6px 18px rgba(0,0,0,0.62)',
                    textShadow: '0 2px 2px rgba(0,0,0,0.75)',
                }}>
                    <div style={{ padding: `0 ${24 * scale}px`, borderRight: '1px solid rgba(185, 126, 41, 0.76)', height: '100%', display: 'flex', alignItems: 'center' }}>
                        粮{store.attackerFood}
                    </div>
                    <div style={{ padding: `0 ${24 * scale}px`, borderRight: '1px solid rgba(185, 126, 41, 0.76)', height: '100%', display: 'flex', alignItems: 'center' }}>
                        天 {day}
                    </div>
                    <div style={{ padding: `0 ${24 * scale}px`, flex: 1, height: '100%', display: 'flex', alignItems: 'center', gap: `${14 * scale}px`, minWidth: 0 }}>
                        <div style={{ width: `${42 * scale}px`, height: `${42 * scale}px`, border: '2px solid #b78031', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: `${30 * scale}px`, color: '#e2bd74', backgroundColor: 'rgba(32, 17, 6, 0.82)', boxShadow: 'inset 0 0 8px rgba(242,197,104,0.18)' }}>?</div>
                        {hoveredUnit ? hoveredUnit.name : (hoveredTerrain !== null ? TERRAIN_NAMES[hoveredTerrain] : '')}
                    </div>
                    
                    {/* 操作按钮组放在最右侧 */}
                    <div style={{ display: 'flex', height: '100%', borderLeft: '1px solid rgba(185, 126, 41, 0.76)' }}>
                        {activeUnitId && (
                            <>
                                <button 
                                    onClick={() => setSelectingSkill(!selectingSkill)}
                                    style={{ padding: `0 ${18 * scale}px`, border: 'none', borderRight: '1px solid rgba(185, 126, 41, 0.76)', backgroundColor: selectingSkill ? 'rgba(174, 121, 43, 0.34)' : 'transparent', cursor: 'pointer', fontSize: `${20 * scale}px`, fontWeight: 'bold', color: '#d6a85b', fontFamily: ancientFontFamily }}
                                >
                                    {selectingSkill ? '取消' : '技能'}
                                </button>
                                <button 
                                    onClick={() => { store.rest(activeUnitId); setSelectingSkill(false); }}
                                    style={{ padding: `0 ${18 * scale}px`, border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontSize: `${20 * scale}px`, fontWeight: 'bold', color: '#d6a85b', fontFamily: ancientFontFamily }}
                                >
                                    待命
                                </button>
                            </>
                        )}
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
                            backgroundColor: '#2a1609',
                            border: '2px solid #b78031',
                            padding: `${24 * scale}px`,
                            zIndex: 200,
                            width: showUnitInfo ? `${460 * scale}px` : `${360 * scale}px`,
                            color: '#d6a85b',
                            fontFamily: ancientFontFamily,
                            boxShadow: 'inset 0 0 0 2px #2a1609, inset 0 0 0 4px #b78031, 0 6px 18px rgba(0,0,0,0.62)',
                            textShadow: '0 2px 2px rgba(0,0,0,0.75)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: `${16 * scale}px`
                        }}
                    >
                        {showUnitInfo && units[showUnitInfo] && (() => {
                            const unit = units[showUnitInfo];
                            return (
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: `${8 * scale}px ${4 * scale}px`, fontSize: `${18 * scale}px`, lineHeight: '1.2' }}>
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
                                    <div style={{ width: `${84 * scale}px`, height: `${106 * scale}px`, border: '2px solid #b78031', marginLeft: `${16 * scale}px`, display: 'flex', flexDirection: 'column', backgroundColor: 'rgba(0,0,0,0.4)', boxShadow: 'inset 0 0 8px rgba(0,0,0,0.8)' }}>
                                        {!imgErrors[showUnitInfo] ? (
                                            <img 
                                                src={`/assets/images/generals/${unit.name}.png`} 
                                                alt={unit.name}
                                                onError={() => handleImgError(showUnitInfo)}
                                                style={{ width: '100%', height: `${80 * scale}px`, objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <div style={{ flex: 1, backgroundColor: unit.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: `${24 * scale}px`, color: '#fff', fontWeight: 'bold', textShadow: 'none' }}>
                                                {unit.name[0]}
                                            </div>
                                        )}
                                        <div style={{ height: `${22 * scale}px`, borderTop: '2px solid #b78031', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: `${14 * scale}px`, fontWeight: 'bold', backgroundColor: '#2a1609' }}>
                                            {unit.name}
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}

                        {showTerrainInfo && (() => {
                            const tType = map.tiles[showTerrainInfo.y][showTerrainInfo.x];
                            return (
                                <div style={{ fontSize: `${18 * scale}px`, lineHeight: '1.5' }}>
                                    {TERRAIN_NAMES[tType]}：{TERRAIN_DESCRIPTIONS[tType]}
                                </div>
                            );
                        })()}
                    </div>
                </div>
            ) : null}

            {/* 顶部右上角菜单按钮 */}
            <button
                onClick={() => setIsMenuOpen(true)}
                disabled={isAiThinking}
                style={{
                    position: 'absolute',
                    top: `${16 * scale}px`,
                    right: `${16 * scale}px`,
                    padding: `${8 * scale}px ${24 * scale}px`,
                    backgroundColor: '#2a1609',
                    border: '2px solid #b78031',
                    color: isAiThinking ? '#766244' : '#d6a85b',
                    fontSize: `${24 * scale}px`,
                    fontWeight: 'bold',
                    fontFamily: ancientFontFamily,
                    cursor: isAiThinking ? 'not-allowed' : 'pointer',
                    zIndex: 110,
                    boxShadow: 'inset 0 0 0 2px #2a1609, inset 0 0 0 4px #b78031, 0 6px 18px rgba(0,0,0,0.62)',
                    textShadow: '0 2px 2px rgba(0,0,0,0.75)',
                    borderBottom: '2px solid #b78031' // 覆盖掉组件默认的 bottom none
                }}
            >
                菜单
            </button>

            {/* 全局菜单弹窗 */}
            {isMenuOpen && (
                <>
                    <div 
                        style={{ position: 'absolute', inset: 0, zIndex: 199, backgroundColor: 'rgba(0,0,0,0.5)' }} 
                        onClick={() => setIsMenuOpen(false)}
                    />
                    <div className="ancient-menu-panel" style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 200,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'stretch',
                        fontFamily: ancientFontFamily,
                        color: '#d6a85b',
                        fontSize: `${28 * scale}px`,
                        fontWeight: 'bold',
                        padding: `${10 * scale}px 0`,
                        minWidth: `${240 * scale}px`
                    }}>
                        {menuItems.map((item, idx) => (
                            <button 
                                key={item.label}
                                className="ancient-menu-button"
                                onClick={item.action}
                                style={{
                                    borderBottom: idx === menuItems.length - 1 ? 'none' : '1px solid rgba(183, 128, 49, 0.3)'
                                }}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};
