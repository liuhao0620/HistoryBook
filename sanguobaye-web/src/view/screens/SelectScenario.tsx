import React from 'react';
import { useGameStore } from '../../core/state/useGameStore';
import { useScale } from '../../core/hooks/useScale';

export const SelectScenario: React.FC = () => {
    const { availableScenarios, selectScenario, setScreen } = useGameStore();
    const scale = useScale();

    return (
        <div style={{ display: 'flex', height: '100vh', backgroundColor: '#20150d', alignItems: 'center', justifyContent: 'center' }}>
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
                    三 国 霸 业
                </div>

                <div style={{ 
                    display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: `${50 * scale}px`, 
                    width: '80%', maxWidth: `${1400 * scale}px`,
                    zIndex: 1
                }}>
                    {availableScenarios.map((scenario) => {
                        // 将4个字的剧本名拆分成两列，模拟古风排版（右边读起）
                        const rightCol = scenario.name.slice(0, 2);
                        const leftCol = scenario.name.slice(2, 4);

                        // 映射对应的插图
                        let bgImage = '';
                        if (scenario.id === "190_0") bgImage = 'url(/assets/images/scenario_dongzhuo.jpg)';
                        if (scenario.id === "198_1") bgImage = 'url(/assets/images/scenario_caocao.jpg)';
                        if (scenario.id === "208_2") bgImage = 'url(/assets/images/scenario_chibi.jpg)';
                        if (scenario.id === "225_3") bgImage = 'url(/assets/images/scenario_dingli.jpg)';

                        return (
                            <div 
                                key={scenario.id}
                                onClick={() => selectScenario(scenario)}
                                style={getScenarioCardStyle(scale)}>
                                {/* 左侧剧本插图 */}
                                <div style={{ 
                                    flex: 1, 
                                    backgroundColor: '#25180d', 
                                    backgroundImage: bgImage,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    borderRight: `${4 * scale}px solid #d6a85b` 
                                }}>
                                </div>
                                {/* 右侧竖排文字，从右向左两列 */}
                                <div style={{ 
                                    padding: `${20 * scale}px ${40 * scale}px`, display: 'flex', flexDirection: 'row-reverse', gap: `${30 * scale}px`, alignItems: 'center' 
                                }}>
                                    <div style={{ writingMode: 'vertical-rl', fontSize: `${56 * scale}px`, letterSpacing: `${10 * scale}px` }}>{rightCol}</div>
                                    <div style={{ writingMode: 'vertical-rl', fontSize: `${56 * scale}px`, letterSpacing: `${10 * scale}px` }}>{leftCol}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const getScenarioCardStyle = (scale: number): React.CSSProperties => ({
    display: 'flex',
    height: `${250 * scale}px`,
    backgroundColor: '#2a1609',
    border: `${6 * scale}px solid #d6a85b`,
    cursor: 'pointer',
    boxShadow: `${6 * scale}px ${6 * scale}px 0px rgba(0,0,0,0.5)`,
});
