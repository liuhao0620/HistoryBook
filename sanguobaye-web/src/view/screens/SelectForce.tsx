import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../core/state/useGameStore';
import { useScale } from '../../core/hooks/useScale';
import { C_MAP, CITY_MAP_W, CITY_MAP_H, getCityCenterCoords } from '../../core/constants/cityMap';

export const SelectForce: React.FC = () => {
    const { selectedScenario, loadScenarioAndStart, setScreen } = useGameStore();
    const scale = useScale();
    const [hoveredForce, setHoveredForce] = useState<number | null>(null);
    const [cityLinks, setCityLinks] = useState<any[]>([]);

    useEffect(() => {
        fetch('/config/city_links.json')
            .then(res => res.json())
            .then(data => setCityLinks(data));
    }, []);

    if (!selectedScenario) return null;

    const getKingName = (kingId: number) => {
        const p = selectedScenario.generals.find((p: any) => p.id === kingId);
        return p ? p.name : '未知';
    };

    return (
        <div style={{ display: 'flex', height: '100%', width: '100%', backgroundColor: '#20150d', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
                width: '100%', height: '100%', 
                backgroundColor: '#000', 
                backgroundImage: 'url(/assets/images/bg_main_menu.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: '0 0 20px rgba(0,0,0,0.8)',
                display: 'flex', color: '#d6a85b', fontFamily: '"STKaiti", "KaiTi", serif',
                position: 'relative', padding: `${40 * scale}px`, boxSizing: 'border-box', gap: `${40 * scale}px`
            }}>
                {/* 增加半透明遮罩层 */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 0 }}></div>

                <button 
                    onClick={() => setScreen('SELECT_SCENARIO')}
                    style={{ 
                        position: 'absolute', top: `${40 * scale}px`, right: `${40 * scale}px`,
                        padding: `${16 * scale}px ${32 * scale}px`, backgroundColor: 'rgba(26, 17, 12, 0.8)', color: '#d6a85b', 
                        border: `${4 * scale}px solid #d6a85b`, cursor: 'pointer', fontSize: `${32 * scale}px`, fontFamily: '"STKaiti", "KaiTi", serif',
                        zIndex: 100
                    }}>
                    返回
                </button>

                {/* 左侧：势力列表 */}
                <div className="custom-scrollbar" style={{ 
                    width: `${350 * scale}px`, border: `${6 * scale}px solid #d6a85b`, backgroundColor: 'rgba(26, 17, 12, 0.8)', 
                    display: 'flex', flexDirection: 'column', overflowY: 'auto', padding: `${20 * scale}px 0`, boxSizing: 'border-box', zIndex: 1
                }}>
                    <div style={{ flex: '1 1 auto' }}>
                        {selectedScenario.forces.map((force: any) => {
                            const isHovered = hoveredForce === force.id;

                            return (
                                <div 
                                    key={force.id}
                                    onMouseEnter={() => setHoveredForce(force.id)}
                                    onMouseLeave={() => setHoveredForce(null)}
                                    onClick={() => loadScenarioAndStart(force.id)}
                                    style={{
                                        padding: `${24 * scale}px ${20 * scale}px`, fontSize: `${48 * scale}px`, textAlign: 'center',
                                        cursor: 'pointer', letterSpacing: `${8 * scale}px`, fontWeight: 'bold',
                                        backgroundColor: isHovered ? '#d6a85b' : 'transparent',
                                        color: isHovered ? '#2a1609' : '#d6a85b',
                                        transition: 'all 0.2s'
                                    }}>
                                    {getKingName(force.kingId)}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 右侧：标题与地图区域 */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: `${40 * scale}px`, zIndex: 1 }}>
                    <div style={{ fontSize: `${72 * scale}px`, marginBottom: `${40 * scale}px`, letterSpacing: `${16 * scale}px`, fontWeight: 'bold' }}>
                        势力形势图
                    </div>

                    {/* 右侧：地图渲染 */}
                    <div style={{ 
                        width: `${1200 * scale}px`, height: `${800 * scale}px`, border: `${6 * scale}px solid #d6a85b`, 
                        backgroundColor: '#000',
                        backgroundImage: 'url(/assets/images/bg_world_map.jpg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
                        overflow: 'hidden'
                    }}>
                        {/* 增加一个半透明蒙层，防止地图背景太亮影响城池色块阅读 */}
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 0 }}></div>
                        
                        <div style={{
                            position: 'relative',
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1
                        }}>
                            
                                <div style={{ 
                                    position: 'relative', 
                                    width: `${1620 * scale}px`, 
                                    height: `${1080 * scale}px`,
                                    transform: `scale(${1200 / 1620})`,
                                    transformOrigin: 'center center'
                                }}>
                            {/* SVG 层用于绘制连线 */}
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
                                                strokeWidth={4 * scale}
                                                strokeDasharray={`${8 * scale},${8 * scale}`}
                                            />
                                        );
                                    });
                                })}
                            </svg>

                            {C_MAP.map((cityIndex, index) => {
                                if (cityIndex === 0) return null;
                                const city = selectedScenario.cities[cityIndex - 1];
                                if (!city) return null;

                                const cityCoords = getCityCenterCoords(city.id);
                                if (!cityCoords) return null;
                                 
                                // 查找该势力信息，为了获取颜色
                                const force = selectedScenario.forces ? selectedScenario.forces.find((f: any) => f.id === city.belong) : { id: city.belong, kingId: city.belong - 1, color: '#555' };
                                const isCurrentForceHovered = hoveredForce === city.belong;
 
                                 return (
                                     <React.Fragment key={city.id}>
                                         {/* 渲染城市 */}
                                         <div 
                                            style={{
                                                position: 'absolute',
                                                top: `${cityCoords.y * scale}px`, 
                                                left: `${cityCoords.x * scale}px`,
                                                transform: 'translate(-50%, -50%)',
                                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                                zIndex: isCurrentForceHovered ? 20 : 10
                                            }}>
                                            {/* 城池实心色块 */}
                                            <div style={{ 
                                                width: `${48 * scale}px`, height: `${48 * scale}px`,
                                                backgroundImage: city.belong !== 0 ? 'url(/assets/images/city_friendly.png)' : 'url(/assets/images/city_neutral.png)',
                                                backgroundSize: 'cover', backgroundPosition: 'center',
                                                backgroundColor: 'transparent',
                                                filter: isCurrentForceHovered ? `drop-shadow(0 0 ${15 * scale}px #FFF)` : (force && force.color ? `drop-shadow(0 0 ${8 * scale}px ${force.color})` : 'none'),
                                                transition: 'all 0.2s',
                                                transform: isCurrentForceHovered ? 'scale(1.5)' : 'scale(1)'
                                            }}></div>
                                            {/* 城市名称 */}
                                            <span style={{ 
                                                marginTop: `${4 * scale}px`, 
                                                backgroundColor: city.belong !== 0 ? '#d6a85b' : '#2a1609', 
                                                color: city.belong !== 0 ? '#2a1609' : '#d6a85b',
                                                padding: `${2 * scale}px ${4 * scale}px`, 
                                                fontSize: `${12 * scale}px`, 
                                                fontWeight: city.belong !== 0 ? 'bold' : 'normal',
                                                border: `${1 * scale}px solid #d6a85b`, 
                                                whiteSpace: 'nowrap',
                                                zIndex: 10
                                            }}>
                                                {city.name}
                                            </span>
                                        </div>
                                     </React.Fragment>
                                 );
                             })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
};
