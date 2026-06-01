import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../core/state/useGameStore';
import { C_MAP, CITY_MAP_W } from '../../core/constants/cityMap';

export const MapEditorScreen: React.FC = () => {
    const { setScreen } = useGameStore();
    const [positions, setPositions] = useState<Record<number, { x: number, y: number }>>({});
    const [cityLinks, setCityLinks] = useState<any[]>([]);
    const [cityNames, setCityNames] = useState<any[]>([]);
    const [draggingId, setDraggingId] = useState<number | null>(null);

    useEffect(() => {
        // 加载连通性和城池名字数据
        fetch('/config/city_links.json').then(r => r.json()).then(setCityLinks);
        fetch('/config/scenarios/190_0/cities.json').then(r => r.json()).then(data => {
            if (data) {
                setCityNames(data);
            }
        });

        // 初始化坐标为原本网格计算的值
        const initialPos: Record<number, { x: number, y: number }> = {};
        for (let i = 0; i < 38; i++) {
            const mapIndex = C_MAP.indexOf(i + 1);
            if (mapIndex !== -1) {
                // 原有的 GameScreen 坐标计算公式
                initialPos[i] = {
                    x: (mapIndex % CITY_MAP_W) * 80 + 10,
                    y: Math.floor(mapIndex / CITY_MAP_W) * 80 + 50
                };
            }
        }
        setPositions(initialPos);
    }, []);

    const handleMouseDown = (id: number) => {
        setDraggingId(id);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (draggingId !== null) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left - 30; // 减去半个宽度的偏移量
            const y = e.clientY - rect.top - 30;
            setPositions(prev => ({
                ...prev,
                [draggingId]: { x, y }
            }));
        }
    };

    const handleMouseUp = () => {
        setDraggingId(null);
    };

    const handleExport = () => {
        const json = JSON.stringify(positions, null, 2);
        console.log("【城市坐标导出数据】:\n", json);
        alert('坐标数据已打印到浏览器控制台 (按 F12 查看 Console)！你可以复制出来保存。');
    };

    return (
        <div style={{
            display: 'flex',
            height: '100vh',
            backgroundColor: '#1a110c',
            alignItems: 'center',
            justifyContent: 'center',
            userSelect: 'none'
        }}>
            <div style={{
                width: '1180px',
                height: '720px',
                backgroundColor: '#000',
                display: 'flex',
                boxShadow: '0 0 20px rgba(0,0,0,0.8)'
            }}>
                {/* 左侧：可拖拽的地图区域 */}
                <div
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    style={{
                        width: '960px',
                        height: '720px',
                        position: 'relative',
                        backgroundImage: 'url(/assets/images/bg_world_map.jpg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderRight: '4px solid #cda654',
                        overflow: 'hidden'
                    }}
                >
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.3)', pointerEvents: 'none', zIndex: 0 }}></div>

                    {/* 连通路线 */}
                    <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}>
                        {cityLinks.map(link => {
                            const currentId = link.id !== undefined ? link.id : link.cityId;
                            const start = positions[currentId];
                            if (!start) return null;
                            return link.links.map((l: any) => {
                                const targetId = typeof l === 'number' ? l : l.targetId;
                                if (currentId >= targetId) return null; // 避免重复画线
                                const end = positions[targetId];
                                if (!end) return null;
                                return (
                                    <line
                                        key={`${currentId}-${targetId}`}
                                        x1={start.x + 30} y1={start.y + 30}
                                        x2={end.x + 30} y2={end.y + 30}
                                        stroke="#8d6e63" strokeWidth="3" strokeDasharray="5,5"
                                    />
                                );
                            });
                        })}
                    </svg>

                    {/* 城市节点 */}
                    {Object.entries(positions).map(([idStr, pos]) => {
                        const id = parseInt(idStr);
                        const isDragging = draggingId === id;
                        return (
                            <div
                                key={id}
                                onMouseDown={() => handleMouseDown(id)}
                                style={{
                                    position: 'absolute',
                                    left: pos.x,
                                    top: pos.y,
                                    width: '60px',
                                    height: '60px',
                                    backgroundColor: isDragging ? 'rgba(205, 166, 84, 0.6)' : 'rgba(85, 85, 85, 0.6)',
                                    border: isDragging ? '2px solid #FFF' : '2px solid #cda654',
                                    cursor: isDragging ? 'grabbing' : 'grab',
                                    zIndex: isDragging ? 10 : 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#FFF',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    textShadow: '1px 1px 2px #000',
                                    backdropFilter: 'blur(2px)' // 稍微加一点毛玻璃效果，让文字更清晰
                                }}
                            >
                                {cityNames.find(c => c.id === id)?.name || id}
                            </div>
                        );
                    })}
                </div>

                {/* 右侧：操作面板 */}
                <div style={{
                    width: '220px',
                    padding: '20px',
                    backgroundColor: 'rgba(26, 17, 12, 0.95)',
                    color: '#cda654',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px'
                }}>
                    <h2 style={{ margin: 0, borderBottom: '1px solid #cda654', paddingBottom: '10px' }}>地图编辑器</h2>
                    <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#FFF' }}>
                        你可以在左侧地图中任意拖拽城市方块。<br/><br/>
                        连线会实时跟随变化。当你排版到完美匹配背景地貌时，点击下方按钮导出坐标数据。
                    </p>
                    
                    <div style={{ flex: 1 }}></div>

                    <button 
                        onClick={handleExport}
                        style={{
                            padding: '12px',
                            backgroundColor: '#cda654',
                            color: '#1a110c',
                            border: 'none',
                            fontWeight: 'bold',
                            fontSize: '16px',
                            cursor: 'pointer'
                        }}
                    >
                        保存并导出坐标
                    </button>
                    <button 
                        onClick={() => setScreen('MAIN_MENU')}
                        style={{
                            padding: '12px',
                            backgroundColor: 'transparent',
                            color: '#cda654',
                            border: '2px solid #cda654',
                            fontWeight: 'bold',
                            fontSize: '16px',
                            cursor: 'pointer'
                        }}
                    >
                        返回主菜单
                    </button>
                </div>
            </div>
        </div>
    );
};
