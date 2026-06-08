import React from 'react';
import { useGameStore } from '../../core/state/useGameStore';
import { useScale } from '../../core/hooks/useScale';

export const SettingsScreen: React.FC = () => {
    const { setScreen, resolution, setResolution } = useGameStore();
    const scale = useScale();

    const handleSelect = (width: number, height: number) => {
        setResolution({ width, height });
    };

    return (
        <div style={{ display: 'flex', height: '100%', width: '100%', backgroundColor: '#20150d', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
                width: '100%', height: '100%', 
                backgroundColor: '#000', 
                backgroundImage: 'url(/assets/images/bg_main_menu.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                color: '#d6a85b', fontFamily: '"STKaiti", "KaiTi", serif', position: 'relative'
            }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 0 }}></div>

                <button 
                    onClick={() => setScreen('MAIN_MENU')}
                    style={{ 
                        position: 'absolute', top: `${40 * scale}px`, right: `${40 * scale}px`,
                        padding: `${16 * scale}px ${32 * scale}px`, backgroundColor: 'rgba(26, 17, 12, 0.8)', color: '#d6a85b', 
                        border: `${4 * scale}px solid #d6a85b`, cursor: 'pointer', fontSize: `${32 * scale}px`, fontFamily: '"STKaiti", "KaiTi", serif',
                        zIndex: 1
                    }}>
                    返回
                </button>

                <div style={{
                    fontSize: `${96 * scale}px`, fontWeight: 'bold', letterSpacing: `${30 * scale}px`,
                    color: '#d6a85b', textShadow: `${4 * scale}px ${4 * scale}px ${8 * scale}px #000`,
                    marginBottom: `${80 * scale}px`,
                    zIndex: 1
                }}>
                    游戏设置
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: `${40 * scale}px`, width: `${800 * scale}px`, zIndex: 1 }}>
                    <button 
                        onClick={() => handleSelect(1920, 1080)}
                        style={{
                            padding: `${30 * scale}px 0`, width: '100%', backgroundColor: resolution.width === 1920 ? 'rgba(214, 168, 91, 0.3)' : 'rgba(26, 17, 12, 0.8)',
                            color: '#d6a85b', border: `${4 * scale}px solid #d6a85b`, fontSize: `${48 * scale}px`, fontWeight: 'bold',
                            cursor: 'pointer', fontFamily: '"STKaiti", "KaiTi", serif', letterSpacing: `${8 * scale}px`,
                            boxShadow: `${6 * scale}px ${6 * scale}px 0px rgba(0,0,0,0.5)`, transition: 'all 0.2s', textAlign: 'center'
                        }}
                    >
                        1920 x 1080
                    </button>
                    <button 
                        onClick={() => handleSelect(1080, 720)}
                        style={{
                            padding: `${30 * scale}px 0`, width: '100%', backgroundColor: resolution.width === 1080 ? 'rgba(214, 168, 91, 0.3)' : 'rgba(26, 17, 12, 0.8)',
                            color: '#d6a85b', border: `${4 * scale}px solid #d6a85b`, fontSize: `${48 * scale}px`, fontWeight: 'bold',
                            cursor: 'pointer', fontFamily: '"STKaiti", "KaiTi", serif', letterSpacing: `${8 * scale}px`,
                            boxShadow: `${6 * scale}px ${6 * scale}px 0px rgba(0,0,0,0.5)`, transition: 'all 0.2s', textAlign: 'center'
                        }}
                    >
                        1080 x 720
                    </button>
                </div>
            </div>
        </div>
    );
};
