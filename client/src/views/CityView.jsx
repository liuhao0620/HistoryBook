import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { INTERIOR_ORDERS, DIPLOMACY_ORDERS, ARMAMENT_ORDERS, ARMY_NAMES } from '../../../shared/constants';
import MapView from '../components/MapView';

const O = {
  1:'开垦',2:'招商',3:'搜寻',4:'治理',5:'出巡',6:'招降',7:'处斩',
  8:'流放',9:'赏赐',10:'没收',11:'交易',12:'宴请',13:'输送',14:'移动',
  15:'离间',16:'招揽',17:'策反',18:'反间',19:'劝降',23:'侦察',24:'征兵',25:'分配',26:'掠夺',27:'出征',28:'任命',
};

const ORDER_LISTS = {
  interior: [1,2,3,4,5,9,11,12,13,14,28,25,26,6,7,8,10],
  diplo: [15,16,17,18,19],
  arm: [23,24,27],
};

export default function CityView() {
  const { state, actions } = useGame();
  const gs = state.gameState;
  const [sel, setSel] = useState(null);
  const [tab, setTab] = useState(0); // 0=内政 1=外交 2=军备
  const [modal, setModal] = useState(null); // { type, ... }
  const [err, setErr] = useState(null);

  useEffect(() => {
    try {
      if (!gs) return;
      const pc = gs.cities?.filter(c => c.lord === gs.playerLord) || [];
      if (!sel && pc.length) setSel(pc[0].id);
    } catch (e) { setErr(String(e)); }
  }, [gs, sel]);

  if (!gs) return <Err>游戏未加载</Err>;
  if (err) return <Err>{err}</Err>;

  const pCities = gs.cities?.filter(c => c.lord === gs.playerLord) || [];
  const city = gs.cities?.find(c => c.id === sel);
  const cPs = gs.persons?.filter(p => p.city === sel && p.lord === gs.playerLord && p.isAlive) || [];
  const cOrders = gs.orders?.filter(o => o.cityId === sel) || [];
  const enemyCities = gs.cities?.filter(c => c.lord !== gs.playerLord && c.lord !== 0) || [];
  const allyCities = pCities.filter(c => c.id !== sel);
  const tabOrders = tab === 0 ? ORDER_LISTS.interior : tab === 1 ? ORDER_LISTS.diplo : ORDER_LISTS.arm;

  const openOrder = (type) => {
    setModal({ type, personId: '', targetId: '', money: '', arms: '' });
  };

  const submitOrder = async () => {
    if (!city || !modal) return;
    const m = modal;
    if (m.type === 27) { // BATTLE
      const fIds = cPs.filter(p => p.armyCount > 0).slice(0, 5).map(p => p.id);
      await actions.startBattle(city.id, parseInt(m.targetId), fIds);
    } else {
      await actions.addOrder({
        type: m.type, cityId: city.id, personId: parseInt(m.personId),
        targetId: m.targetId ? parseInt(m.targetId) : 0,
        money: parseInt(m.money) || 0, food: parseInt(m.money) || 0, arms: parseInt(m.arms) || 0,
      });
    }
    setModal(null);
  };

  const modalNeeds = (t) => ({
    pers: [1,2,3,4,5,9,11,12,15,16,17,18,19,23,24,26,28,25].includes(t),
    tgt: [7].includes(t),
    tcity: [13,14,16,23,27,17,19].includes(t),
    money: [9].includes(t),
    arms: [24,26].includes(t),
    enemytg: [27,23,15,17,18,19].includes(t),
  });

  const handleExecute = async () => {
    try { await actions.executeMonth(); } catch (e) { setErr(String(e)); }
  };

  return (
    <div style={{display:'flex',height:'100%',flexDirection:'column',background:'#0d1b36'}}>
      {/* 城市选择条 */}
      <div style={barS}>
        <div style={{display:'flex',gap:4,flexWrap:'wrap',flex:1}}>
          {pCities.map(c => (
            <button key={c.id} onClick={()=>setSel(c.id)} style={cityBtn(c.id===sel)}>
              {c.name}
            </button>
          ))}
        </div>
        <span style={{color:'#808090',fontSize:10}}>{gs.year}/{gs.month}</span>
      </div>

      {/* 战略地图 */}
      <div style={{background:'#0d1b36',borderBottom:'1px solid #0f3460',overflow:'hidden',flexShrink:0}}>
        {(()=>{ try { return <MapView cities={gs.cities||[]} lords={gs.lords||[]} sel={sel} onSelect={setSel}/>; } catch(e){ return <div style={{color:'#e94560',fontSize:10,padding:4}}>地图加载失败</div> }})()}
      </div>

      {city && (
        <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>
          {/* 信息面板 */}
          <div style={{flex:1,overflowY:'auto',padding:'6px 8px'}}>
            <div style={sec}><div style={sTitle}>{city.name} <span style={{fontSize:10,color:'#808090'}}>金{city.money} 粮{city.food} 兵{city.reserveArmy}</span></div></div>
            <div style={sec}>
              {cPs.map(p => (
                <div key={p.id} style={pCard}>
                  <span style={{fontWeight:'bold',color:'#e0d5b7',minWidth:40}}>{p.name}</span>
                  <span style={{color:'#808090',fontSize:10}}>Lv.{p.level} 武{p.force} 智{p.iq} 体{p.thew}/{100} {ARMY_NAMES[p.armyType]}兵{p.armyCount}</span>
                </div>
              ))}
            </div>
            {cOrders.length > 0 && <div style={sec}>
              {cOrders.map(o => (
                <div key={o.id} style={{display:'flex',fontSize:11,padding:'2px 0',gap:4}}>
                  <span>{O[o.type]||'?'}</span>
                  <span style={{color:'#808090'}}>[{gs.persons?.find(p=>p.id===o.personId)?.name}]</span>
                  <button onClick={()=>actions.removeOrder(o.id)} style={{marginLeft:'auto',background:'none',border:'none',color:'#e94560',cursor:'pointer'}}>✕</button>
                </div>
              ))}
            </div>}
          </div>

          {/* 指令面板 */}
          <div style={{borderTop:'1px solid #0f3460',padding:'4px 8px',background:'#0d1b36',flexShrink:0}}>
            <div style={{display:'flex',gap:2,marginBottom:3}}>
              {['内政','外交','军备'].map((t,i)=><button key={i} onClick={()=>setTab(i)} style={tabBtn(i===tab)}>{t}</button>)}
            </div>
            <div style={{display:'flex',gap:3,flexWrap:'wrap'}}>
              {tabOrders.map(oid => <button key={oid} onClick={()=>openOrder(oid)} style={orderBtn}>{O[oid]||oid}</button>)}
            </div>
          </div>

          {/* 执行栏 */}
          <div style={{display:'flex',justifyContent:'flex-end',padding:'4px 8px',background:'#16213e',borderTop:'1px solid #0f3460',flexShrink:0,gap:6}}>
            <button onClick={handleExecute} style={execBtn}>执行本月</button>
          </div>
        </div>
      )}

      {!city && sel && <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',color:'#808090',fontSize:14}}>城市数据加载中...</div>}

      {/* 指令弹窗 */}
      {modal && <Modal city={city} cPs={cPs} modal={modal} setModal={setModal} 
          enemyCities={enemyCities} allyCities={allyCities}
          modalNeeds={modalNeeds} submitOrder={submitOrder} />}
    </div>
  );
}

function Modal({ city, cPs, modal, setModal, enemyCities, allyCities, modalNeeds, submitOrder }) {
  const m = modal;
  const needs = modalNeeds(m.type);
  const set = (k, v) => setModal({ ...m, [k]: v });
  return (
    <div style={overlay} onClick={() => setModal(null)}>
      <div style={modalS} onClick={e => e.stopPropagation()}>
        <div style={{fontSize:16,fontWeight:'bold',color:'#e94560',marginBottom:12}}>{O[m.type]||m.type}指令</div>

        {needs.pers && <>
          <Label>执行武将</Label>
          <Select value={m.personId} onChange={v=>set('personId',v)}>
            <option value="">选择</option>
            {cPs.filter(p=>p.thew>=4).map(p=><option key={p.id} value={p.id}>{p.name} 体{p.thew}</option>)}
          </Select>
        </>}

        {needs.tgt && <>
          <Label>目标武将</Label>
          <Select value={m.targetId} onChange={v=>set('targetId',v)}>
            <option value="">选择</option>
            {cPs.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}
          </Select>
        </>}

        {needs.tcity && <>
          <Label>{needs.enemytg ? '目标城市' : '友方城市'}</Label>
          <Select value={m.targetId} onChange={v=>set('targetId',v)}>
            <option value="">选择</option>
            {(needs.enemytg?enemyCities:allyCities).map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
        </>}

        {needs.money && <><Label>金额</Label><Input type="number" value={m.money} onChange={v=>set('money',v)} /></>}
        {needs.arms && <><Label>数量</Label><Input type="number" value={m.arms} onChange={v=>set('arms',v)} /></>}

        <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:12}}>
          <button onClick={()=>setModal(null)} style={btn2}>取消</button>
          <button onClick={submitOrder} style={btn1}>确定</button>
        </div>
      </div>
    </div>
  );
}

// 辅助组件
function Label({children}){return <label style={{display:'block',fontSize:11,color:'#a0a0b0',marginTop:6}}>{children}</label>}
function Select({value,onChange,children}){return <select style={inputS} value={value} onChange={e=>onChange(e.target.value)}>{children}</select>}
function Input({type,value,onChange,placeholder}){return <input style={inputS} type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder||''}/>}

const inputS={width:'100%',padding:'5px 8px',margin:'3px 0',borderRadius:4,border:'1px solid #0f3460',background:'#1a1a2e',color:'#e0d5b7',fontSize:12};
const barS={display:'flex',alignItems:'center',padding:'4px 6px',background:'#16213e',borderBottom:'1px solid #0f3460',flexShrink:0};
const cityBtn=a=>({padding:'3px 8px',fontSize:11,fontWeight:'bold',borderRadius:3,cursor:'pointer',background:a?'#e94560':'#0f3460',color:'#fff',border:'none',margin:1});
const tabBtn=a=>({padding:'3px 12px',fontSize:11,fontWeight:'bold',border:'none',borderRadius:3,background:a?'#e94560':'#0f3460',color:a?'#fff':'#a0a0b0',cursor:'pointer'});
const orderBtn={padding:'2px 6px',fontSize:10,borderRadius:3,cursor:'pointer',background:'#0f3460',color:'#a0a0b0',border:'none'};
const sec={marginBottom:8}; const sTitle={fontSize:15,fontWeight:'bold',color:'#e94560',paddingBottom:4};
const pCard={display:'flex',alignItems:'center',gap:6,padding:'3px 4px',margin:'2px 0',background:'rgba(15,52,96,.3)',borderRadius:3,fontSize:11};
const execBtn={padding:'5px 18px',fontSize:13,fontWeight:'bold',borderRadius:5,border:'none',background:'#e94560',color:'#fff',cursor:'pointer'};
const overlay={position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,.7)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:500};
const modalS={background:'#16213e',borderRadius:8,padding:16,minWidth:280,maxWidth:400,maxHeight:'70%',overflowY:'auto',border:'1px solid #0f3460'};
const btn1={padding:'5px 16px',fontSize:12,fontWeight:'bold',borderRadius:4,border:'none',background:'#e94560',color:'#fff',cursor:'pointer'};
const btn2={padding:'5px 16px',fontSize:12,borderRadius:4,border:'none',background:'#0f3460',color:'#a0a0b0',cursor:'pointer'};
function Err({children}){return <div style={{color:'#e94560',padding:20,fontSize:12}}>{children}</div>}
