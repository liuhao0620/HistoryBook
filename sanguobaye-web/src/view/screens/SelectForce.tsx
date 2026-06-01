import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../core/state/useGameStore';
import { C_MAP, CITY_MAP_W, CITY_MAP_H } from '../../core/constants/cityMap';

export const SelectForce: React.FC = () => {
    const { selectedScenario, loadScenarioAndStart, setScreen } = useGameStore();
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
        <div style={{ display: 'flex', height: '100vh', backgroundColor: '#2b1d14', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
                width: '1180px', height: '720px', 
                backgroundColor: '#000', 
                backgroundImage: 'url(/assets/images/bg_main_menu.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: '0 0 20px rgba(0,0,0,0.8)',
                display: 'flex', color: '#cda654', fontFamily: '"STKaiti", "KaiTi", serif',
                position: 'relative', padding: '40px', boxSizing: 'border-box', gap: '40px'
            }}>
                {/* 增加半透明遮罩层 */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 0 }}></div>

                <button 
                    onClick={() => setScreen('SELECT_SCENARIO')}
                    style={{ 
                        position: 'absolute', top: '20px', right: '20px',
                        padding: '10px 20px', backgroundColor: 'rgba(26, 17, 12, 0.8)', color: '#cda654', 
                        border: '2px solid #cda654', cursor: 'pointer', fontSize: '20px', fontFamily: '"STKaiti", "KaiTi", serif',
                        zIndex: 100
                    }}>
                    返回
                </button>

                {/* 左侧：势力列表 */}
                <div className="custom-scrollbar" style={{ 
                    width: '200px', border: '4px solid #cda654', backgroundColor: 'rgba(26, 17, 12, 0.8)', 
                    display: 'flex', flexDirection: 'column', overflowY: 'auto', padding: '10px 0', boxSizing: 'border-box', zIndex: 1
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
                                        padding: '15px 10px', fontSize: '32px', textAlign: 'center',
                                        cursor: 'pointer', letterSpacing: '5px', fontWeight: 'bold',
                                        backgroundColor: isHovered ? '#cda654' : 'transparent',
                                        color: isHovered ? '#1a110c' : '#cda654',
                                        transition: 'all 0.2s'
                                    }}>
                                    {getKingName(force.kingId)}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 右侧：标题与地图区域 */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '20px', zIndex: 1 }}>
                    <div style={{ fontSize: '48px', marginBottom: '30px', letterSpacing: '10px', fontWeight: 'bold' }}>
                        势力形势图
                    </div>

                    {/* 右侧：地图渲染 */}
                    <div style={{ 
                        width: '800px', height: '550px', border: '4px solid #cda654', 
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
                                    width: `${CITY_MAP_W * 50}px`, 
                                    height: `${CITY_MAP_H * 50}px`,
                                    transform: 'scale(1.2)', // 缩小一点以确保所有城池都显示出来
                                    transformOrigin: 'center center',
                                    marginTop: '50px' // 整体往下挪一格（50px）使之在形势图中居中
                                }}>
                            {/* SVG 层用于绘制连线 */}
                            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }}>
                                {cityLinks.map((cityLink) => {
                                    const mapIndex = C_MAP.indexOf(cityLink.cityId + 1);
                                    if (mapIndex === -1) return null;
                                    const startX = (mapIndex % CITY_MAP_W) * 50 + 25;
                                    const startY = Math.floor(mapIndex / CITY_MAP_W) * 50 + 25;

                                    return cityLink.links.map((link: any, idx: number) => {
                                        if (cityLink.cityId >= link.targetId) return null;
                                        
                                        const targetIndex = C_MAP.indexOf(link.targetId + 1);
                                        if (targetIndex === -1) return null;
                                        const endX = (targetIndex % CITY_MAP_W) * 50 + 25;
                                        const endY = Math.floor(targetIndex / CITY_MAP_W) * 50 + 25;

                                        return (
                                            <line 
                                                key={`${cityLink.cityId}-${link.targetId}-${idx}`}
                                                x1={startX} 
                                                y1={startY} 
                                                x2={endX} 
                                                y2={endY} 
                                                stroke="#8d6e63" 
                                                strokeWidth="2"
                                                strokeDasharray="5,5"
                                            />
                                        );
                                    });
                                })}
                            </svg>

                            {C_MAP.map((cityIndex, index) => {
                                if (cityIndex === 0) return null;
                                const city = selectedScenario.cities[cityIndex - 1];
                                if (!city) return null;

                                const x = index % CITY_MAP_W;
                                const y = Math.floor(index / CITY_MAP_W);
                                 
                                // 查找该势力信息，为了获取颜色
                                const force = selectedScenario.forces ? selectedScenario.forces.find((f: any) => f.id === city.belong) : { id: city.belong, kingId: city.belong - 1, color: '#555' };
                                const isCurrentForceHovered = hoveredForce === city.belong;
 
                                 return (
                                     <React.Fragment key={city.id}>
                                         {/* 渲染城市 */}
                                         <div 
                                            style={{
                                                position: 'absolute',
                                                top: `${y * 50}px`, 
                                                left: `${x * 50}px`,
                                                width: '50px',
                                                height: '50px',
                                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                                zIndex: isCurrentForceHovered ? 20 : 10
                                            }}>
                                            {/* 城池实心色块 */}
                                            <div style={{ 
                                                width: '32px', height: '32px',
                                                backgroundImage: city.belong !== 0 ? 'url(/assets/images/city_friendly.png)' : 'url(/assets/images/city_neutral.png)',
                                                backgroundSize: 'cover', backgroundPosition: 'center',
                                                backgroundColor: 'transparent',
                                                filter: isCurrentForceHovered ? 'drop-shadow(0 0 10px #FFF)' : (force && force.color ? `drop-shadow(0 0 5px ${force.color})` : 'none'),
                                                transition: 'all 0.2s',
                                                transform: isCurrentForceHovered ? 'scale(1.5)' : 'scale(1)'
                                            }}></div>
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
