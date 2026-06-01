import React from 'react';
import { useGameStore } from '../../core/state/useGameStore';

export const SelectScenario: React.FC = () => {
    const { availableScenarios, selectScenario, setScreen } = useGameStore();

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

                <button 
                    onClick={() => setScreen('MAIN_MENU')}
                    style={{ 
                        position: 'absolute', top: '20px', right: '20px',
                        padding: '10px 20px', backgroundColor: 'rgba(26, 17, 12, 0.8)', color: '#cda654', 
                        border: '2px solid #cda654', cursor: 'pointer', fontSize: '20px', fontFamily: '"STKaiti", "KaiTi", serif',
                        zIndex: 1
                    }}>
                    返回
                </button>

                <div style={{
                    fontSize: '48px', fontWeight: 'bold', letterSpacing: '15px',
                    color: '#cda654', textShadow: '2px 2px 4px #000',
                    marginBottom: '40px',
                    zIndex: 1
                }}>
                    三 国 霸 业
                </div>

                <div style={{ 
                    display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '30px', 
                    width: '80%', maxWidth: '800px',
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
                                style={scenarioCardStyle}>
                                {/* 左侧剧本插图 */}
                                <div style={{ 
                                    flex: 1, 
                                    backgroundColor: '#3e2723', 
                                    backgroundImage: bgImage,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    borderRight: '2px solid #cda654' 
                                }}>
                                </div>
                                {/* 右侧竖排文字，从右向左两列 */}
                                <div style={{ 
                                    padding: '10px 20px', display: 'flex', flexDirection: 'row-reverse', gap: '15px', alignItems: 'center' 
                                }}>
                                    <div style={{ writingMode: 'vertical-rl', fontSize: '32px', letterSpacing: '5px' }}>{rightCol}</div>
                                    <div style={{ writingMode: 'vertical-rl', fontSize: '32px', letterSpacing: '5px' }}>{leftCol}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const scenarioCardStyle: React.CSSProperties = {
    display: 'flex',
    height: '150px',
    backgroundColor: '#1a110c',
    border: '4px solid #cda654',
    cursor: 'pointer',
    boxShadow: '4px 4px 0px rgba(0,0,0,0.5)',
};
