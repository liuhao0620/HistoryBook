import React, { useEffect, useState } from 'react';
import { useGameStore, getSaveSlotsInfo } from '../../core/state/useGameStore';

export const MainMenu: React.FC = () => {
    const { setScreen, loadGame } = useGameStore();
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
        <div style={{ display: 'flex', height: '100vh', backgroundColor: '#2b1d14', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
                width: '1180px', height: '720px', 
                backgroundColor: '#000', 
                backgroundImage: 'url(/assets/images/bg_main_menu.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: '0 0 20px rgba(0,0,0,0.8)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                color: '#cda654', fontFamily: '"STKaiti", "KaiTi", serif', position: 'relative'
            }}>
                {/* 增加一个半透明的遮罩层，让UI文字更清晰 */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 0 }}></div>
                
                {/* 游戏标题 */}
                <div style={{
                    fontSize: '64px', fontWeight: 'bold', letterSpacing: '20px',
                    border: '4px solid #cda654', padding: '20px 40px', marginBottom: '60px',
                    backgroundColor: 'rgba(26, 17, 12, 0.8)', textShadow: '2px 2px 4px #000',
                    zIndex: 1
                }}>
                    三 国 霸 业
                </div>
                
                {showLoadMenu ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '600px', zIndex: 1 }}>
                        <h2 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '10px' }}>选择读取进度</h2>
                        {slots.map(s => (
                            <button 
                                key={s.slot}
                                onClick={() => !s.empty && handleSlotClick(s.slot)}
                                style={{
                                    ...menuBtnStyle, 
                                    backgroundColor: 'rgba(26, 17, 12, 0.8)',
                                    opacity: s.empty ? 0.5 : 1,
                                    cursor: s.empty ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '15px 30px'
                                }}
                                disabled={s.empty}
                            >
                                <span>进度 {s.slot}</span>
                                <span>{s.empty ? '空' : `${s.year}年${s.month}月 - ${s.forceName}`}</span>
                            </button>
                        ))}
                        <button onClick={() => setShowLoadMenu(false)} style={{...menuBtnStyle, backgroundColor: 'rgba(26, 17, 12, 0.8)', marginTop: '20px'}}>
                            返回
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '30px', width: '600px', zIndex: 1 }}>
                        <button onClick={() => setScreen('SELECT_SCENARIO')} style={{...menuBtnStyle, backgroundColor: 'rgba(26, 17, 12, 0.8)'}}>
                            新君登基
                        </button>
                        <button 
                            onClick={handleLoadGameClick} 
                            style={{...menuBtnStyle, backgroundColor: 'rgba(26, 17, 12, 0.8)', opacity: hasSave ? 1 : 0.5, cursor: hasSave ? 'pointer' : 'not-allowed'}}
                            disabled={!hasSave}
                        >
                            重返沙场
                        </button>
                        <button
                            onClick={() => setShowCredits(true)}
                            style={{...menuBtnStyle, backgroundColor: 'rgba(26, 17, 12, 0.8)'}}
                        >
                            制作群组
                        </button>
                        <button
                            onClick={() => setScreen('MAP_EDITOR')}
                            style={{...menuBtnStyle, backgroundColor: 'rgba(26, 17, 12, 0.8)'}}
                        >
                            地图编辑
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
                        width: '600px', backgroundColor: '#1a110c', border: '4px solid #cda654',
                        padding: '40px', color: '#cda654', textAlign: 'center', fontFamily: '"Kaiti", "STKaiti", serif'
                    }}>
                        <h2 style={{ fontSize: '42px', borderBottom: '2px solid #cda654', paddingBottom: '20px', marginTop: 0 }}>制作群组</h2>
                        <div style={{ fontSize: '24px', lineHeight: '2.5', margin: '30px 0', textAlign: 'left', paddingLeft: '50px' }}>
                            <p><strong>原版游戏：</strong>《三国霸业》</p>
                            <p><strong>复刻程序与交互：</strong>Trae AI</p>
                            <p><strong>美术插图生成：</strong>OpenAI</p>
                            <p><strong>总体规划与统筹：</strong>刘豪</p>
                        </div>
                        <button 
                            onClick={() => setShowCredits(false)}
                            style={{
                                padding: '10px 40px', fontSize: '24px', fontWeight: 'bold', fontFamily: '"Kaiti", "STKaiti", serif',
                                backgroundColor: '#cda654', color: '#1a110c', border: 'none', cursor: 'pointer'
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

const menuBtnStyle: React.CSSProperties = {
    padding: '15px 0',
    width: '100%',
    backgroundColor: '#1a110c',
    color: '#cda654',
    border: '2px solid #cda654',
    fontSize: '36px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontFamily: '"STKaiti", "KaiTi", serif',
    letterSpacing: '10px',
    boxShadow: '4px 4px 0px rgba(0,0,0,0.5)',
    transition: 'all 0.2s',
    textAlign: 'center'
};
