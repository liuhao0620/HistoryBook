import React, { useState } from 'react';
import { useGameStore } from '../../core/state/useGameStore';
import { AssartCommand } from '../../core/commands/InternalCommands';
import { ConscriptionCommand } from '../../core/commands/MilitaryCommands';

export const CityPanel: React.FC = () => {
    const { selectedCityId, cities, persons, forces } = useGameStore();
    const [selectedPersonId, setSelectedPersonId] = useState<number | null>(null);

    if (selectedCityId === null) return <div>请选择城池</div>;

    const city = cities[selectedCityId];
    if (!city) return <div>城池数据异常</div>;

    const cityPersons = city.personQueue.map(id => persons[id]).filter(Boolean);

    const handleCommand = (cmdType: string) => {
        if (selectedPersonId === null) {
            alert('请先选择一名武将执行命令！');
            return;
        }

        let cmd;
        if (cmdType === 'ASSART') {
            cmd = new AssartCommand(city.id, selectedPersonId);
        } else if (cmdType === 'CONSCRIPTION') {
            const arms = Math.min(city.peopleDevotion * 10, city.money * 2);
            cmd = new ConscriptionCommand(city.id, selectedPersonId, arms);
        }

        if (cmd) {
            const result = cmd.execute();
            if (result.success && result.message) {
                useGameStore.getState().addLog(`【系统】${result.message}`);
            }
        }
    };

    return (
        <div style={{ display: 'flex', gap: '20px', padding: '20px', backgroundColor: '#efebe9', height: '100%' }}>
            {/* 城池信息 */}
            <div style={{ flex: 1, border: '1px solid #8d6e63', padding: '15px', borderRadius: '5px', backgroundColor: '#fff' }}>
                <h2>{city.name} [城池]</h2>
                <hr />
                <p>归属: {forces[city.belong]?.kingId !== undefined ? persons[forces[city.belong].kingId]?.name : '无'}</p>
                <p>太守: {city.satrapId === 0 ? '无' : persons[city.satrapId - 1]?.name || '无'}</p>
                <p>金钱: {city.money} | 粮食: {city.food}</p>
                <p>农业: {city.farming} / {city.farmingLimit}</p>
                <p>商业: {city.commerce} / {city.commerceLimit}</p>
                <p>人口: {city.population} | 民忠: {city.peopleDevotion}</p>
                <p>后备兵力: {city.mothballArms}</p>
            </div>

            {/* 武将列表 */}
            <div style={{ flex: 1, border: '1px solid #8d6e63', padding: '15px', borderRadius: '5px', backgroundColor: '#fff' }}>
                <h2>驻扎武将</h2>
                <hr />
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {cityPersons.map(p => (
                        <li 
                            key={p.id} 
                            onClick={() => setSelectedPersonId(p.id)}
                            style={{ 
                                padding: '10px', 
                                border: '1px solid #ccc', 
                                marginBottom: '5px',
                                cursor: 'pointer',
                                backgroundColor: selectedPersonId === p.id ? '#d7ccc8' : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}
                        >
                            <div style={{
                                width: '40px', height: '40px',
                                borderRadius: '4px', border: '1px solid #8d6e63',
                                backgroundImage: `url(/assets/images/generals/${p.name}.png)`,
                                backgroundSize: 'cover', backgroundPosition: 'center',
                                backgroundColor: '#ccc',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px'
                            }}>
                            </div>
                            <div>
                                <strong>{p.name}</strong><br/>
                                智力: {p.iq} | 武力: {p.force} | 体力: {p.thew} | 带兵: {p.arms}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* 指令面板 */}
            <div style={{ flex: 1, border: '1px solid #8d6e63', padding: '15px', borderRadius: '5px', backgroundColor: '#fff' }}>
                <h2>内政指令</h2>
                <hr />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button onClick={() => handleCommand('ASSART')} style={btnStyle}>🌾 开垦 (需4体力, 50金)</button>
                    <button onClick={() => handleCommand('CONSCRIPTION')} style={btnStyle}>⚔️ 征兵 (需4体力, 消耗金钱)</button>
                </div>
            </div>
        </div>
    );
};

const btnStyle = {
    padding: '10px',
    backgroundColor: '#5d4037',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px'
};
