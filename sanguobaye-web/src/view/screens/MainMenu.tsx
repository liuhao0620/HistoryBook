import React, { useEffect, useState } from 'react';
import { useGameStore, getSaveSlotsInfo } from '../../core/state/useGameStore';

export const MainMenu: React.FC = () => {
    const { setScreen, loadGame } = useGameStore();
    const scale = 1; // Global scaling is handled in App.tsx
    const [slots, setSlots] = useState<any[]>([]);
    const [showLoadMenu, setShowLoadMenu] = useState(false);
    const [showCredits, setShowCredits] = useState(false); // 控制制作群组弹窗

    useEffect(() => {
        setSlots(getSaveSlotsInfo());
    }, []);

    const hasSave = slots.some(s => !s.empty);

    const handleLoadGameClick = () => {
        if (hasSave) {
            setShowLoadMenu(true);
        }
    };

    const handleSlotClick = (slotId: number) => {
        const success = loadGame(slotId);
        if (!success) {
            alert('读取存档失败或存档已损坏。');
        }
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
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                color: '#d6a85b', fontFamily: '"STKaiti", "KaiTi", serif', position: 'relative'
            }}>
                {/* 增加一个半透明的遮罩层，让UI文字更清晰 */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 0 }}></div>
                
                {/* 游戏标题 */}
                <div style={{
                    fontSize: `${120 * scale}px`, fontWeight: 'bold', letterSpacing: `${30 * scale}px`,
                    border: `${6 * scale}px solid #d6a85b`, padding: `${40 * scale}px ${80 * scale}px`, marginBottom: `${100 * scale}px`,
                    backgroundColor: 'rgba(26, 17, 12, 0.8)', textShadow: `${4 * scale}px ${4 * scale}px ${8 * scale}px #000`,
                    zIndex: 1
                }}>
                    三 国 霸 业
                </div>
                
                {showLoadMenu ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: `${30 * scale}px`, width: `${900 * scale}px`, zIndex: 1 }}>
                        <h2 style={{ textAlign: 'center', fontSize: `${48 * scale}px`, marginBottom: `${20 * scale}px` }}>选择读取进度</h2>
                        {slots.map(s => (
                            <button 
                                key={s.slot}
                                onClick={() => !s.empty && handleSlotClick(s.slot)}
                                style={{
                                    ...getMenuBtnStyle(scale), 
                                    backgroundColor: 'rgba(26, 17, 12, 0.8)',
                                    opacity: s.empty ? 0.5 : 1,
                                    cursor: s.empty ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: `${24 * scale}px ${48 * scale}px`
                                }}
                                disabled={s.empty}
                            >
                                <span>进度 {s.slot}</span>
                                <span>{s.empty ? '空' : `${s.year}年${s.month}月 - ${s.forceName}`}</span>
                            </button>
                        ))}
                        <button onClick={() => setShowLoadMenu(false)} style={{...getMenuBtnStyle(scale), backgroundColor: 'rgba(26, 17, 12, 0.8)', marginTop: `${30 * scale}px`}}>
                            返回
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: `${40 * scale}px`, width: `${1000 * scale}px`, zIndex: 1 }}>
                        <button onClick={() => setScreen('SELECT_SCENARIO')} style={{...getMenuBtnStyle(scale), backgroundColor: 'rgba(26, 17, 12, 0.8)'}}>
                            新君登基
                        </button>
                        <button 
                            onClick={handleLoadGameClick} 
                            style={{...getMenuBtnStyle(scale), backgroundColor: 'rgba(26, 17, 12, 0.8)', opacity: hasSave ? 1 : 0.5, cursor: hasSave ? 'pointer' : 'not-allowed'}}
                            disabled={!hasSave}
                        >
                            重返沙场
                        </button>
                        <button
                            onClick={() => setShowCredits(true)}
                            style={{...getMenuBtnStyle(scale), backgroundColor: 'rgba(26, 17, 12, 0.8)'}}
                        >
                            制作群组
                        </button>
                        <button
                            onClick={() => setScreen('SETTINGS')}
                            style={{...getMenuBtnStyle(scale), backgroundColor: 'rgba(26, 17, 12, 0.8)'}}
                        >
                            游戏设置
                        </button>
                    </div>
                )}
            </div>

            {/* 制作群组弹窗 */}
            {showCredits && (
                <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div style={{
                        width: `${900 * scale}px`, backgroundColor: '#2a1609', border: `${6 * scale}px solid #d6a85b`,
                        padding: `${60 * scale}px`, color: '#d6a85b', textAlign: 'center', fontFamily: '"Kaiti", "STKaiti", serif'
                    }}>
                        <h2 style={{ fontSize: `${64 * scale}px`, borderBottom: `${4 * scale}px solid #d6a85b`, paddingBottom: `${30 * scale}px`, marginTop: 0 }}>制作群组</h2>
                        <div style={{ fontSize: `${36 * scale}px`, lineHeight: '2.5', margin: `${40 * scale}px 0`, textAlign: 'left', paddingLeft: `${80 * scale}px` }}>
                            <p><strong>原版游戏：</strong>《三国霸业》</p>
                            <p><strong>复刻程序与交互：</strong>Trae AI</p>
                            <p><strong>美术插图生成：</strong>OpenAI</p>
                            <p><strong>总体规划与统筹：</strong>刘豪</p>
                        </div>
                        <button 
                            onClick={() => setShowCredits(false)}
                            style={{
                                padding: `${20 * scale}px ${80 * scale}px`, fontSize: `${36 * scale}px`, fontWeight: 'bold', fontFamily: '"Kaiti", "STKaiti", serif',
                                backgroundColor: '#d6a85b', color: '#2a1609', border: 'none', cursor: 'pointer'
                            }}
                        >
                            返回
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const getMenuBtnStyle = (scale: number): React.CSSProperties => ({
    padding: `${30 * scale}px 0`,
    width: '100%',
    backgroundColor: '#2a1609',
    color: '#d6a85b',
    border: `${4 * scale}px solid #d6a85b`,
    fontSize: `${56 * scale}px`,
    fontWeight: 'bold',
    cursor: 'pointer',
    fontFamily: '"STKaiti", "KaiTi", serif',
    letterSpacing: `${16 * scale}px`,
    boxShadow: `${6 * scale}px ${6 * scale}px 0px rgba(0,0,0,0.5)`,
    transition: 'all 0.2s',
    textAlign: 'center'
});
