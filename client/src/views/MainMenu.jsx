// ============================================
// 主菜单 — 四字匾额风格
// 新君登基 / 重返沙场 / 制作群组 / 运筹帷幄
// ============================================
import React, { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import api from '../api';

export default function MainMenu() {
  const { actions } = useGame();
  const [page, setPage] = useState(0); // 0=主菜单 1=选时期 2=选势力 3=读档 4=制作群组 5=编辑器
  const [scenarios, setScenarios] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [saves, setSaves] = useState([]);

  useEffect(() => { api.getScenarios().then(r => setScenarios(r.scenarios||[])); loadSaves(); }, []);

  const loadSaves = () => {
    const s = []; for (let i=1;i<=3;i++) { const d=localStorage.getItem(`save_${i}`); if(d) { try { const p=JSON.parse(d); s.push({slot:i,data:p,name:`存档${i}: ${p.year}年${p.month}月`}); } catch(e){} } } setSaves(s);
  };

  const startGame = (scenarioId, lordId) => { actions.newGame(scenarioId, lordId); };

  const mainBtns = [
    { label:'新君登基',    sub:'开始新的征途',              action:()=>{ setPage(1); } },
    { label:'重返沙场',    sub:'延续未竟的霸业',            action:()=>{ loadSaves(); setPage(3); } },
    { label:'制作群组',    sub:'饮水思源 铭记来路',          action:()=>{ setPage(4); } },
    { label:'运筹帷幄',    sub:'剧本编辑器（预留）',         action:()=>{ setPage(5); } },
  ];

  // ====== 主菜单 ======
  if (page===0) return (
    <div style={S.cont}>
      <h1 style={S.title}>三 国 霸 业</h1>
      <div style={S.subtitle}>HistoryBook</div>
      <div style={{marginTop:40,display:'flex',flexDirection:'column',gap:16}}>
        {mainBtns.map((btn,i)=>(
          <button key={i} onClick={btn.action} style={S.menuBtn}>
            <div style={S.menuBtnTitle}>{btn.label}</div>
            <div style={S.menuBtnSub}>{btn.sub}</div>
          </button>
        ))}
      </div>
      <div style={{marginTop:40,fontSize:11,color:'#404060'}}>v1.0 · React + Node.js</div>
    </div>
  );

  // ====== 新君登基 → 选时期 ======
  if (page===1) return (
    <div style={S.cont}>
      <h2 style={S.h2}>选择历史时期</h2>
      {scenarios.map(s=>(
        <button key={s.id} style={S.periodBtn} onClick={()=>{setSelectedScenario(s);setPage(2);}}>
          <div style={S.periodName}>{s.name}</div>
          <div style={S.periodYear}>{s.startYear}年</div>
          <div style={S.periodDesc}>{s.description}</div>
        </button>
      ))}
      <button onClick={()=>setPage(0)} style={S.backBtn}>← 返回</button>
    </div>
  );

  // ====== 选势力 ======
  if (page===2 && selectedScenario) return (
    <div style={S.cont}>
      <h2 style={S.h2}>{selectedScenario.name}</h2>
      <div style={{fontSize:12,color:'#808090',marginBottom:16}}>{selectedScenario.description}</div>
      <div style={{display:'flex',flexWrap:'wrap',gap:10,justifyContent:'center',maxWidth:420}}>
        {selectedScenario.lords.map(l=>(
          <button key={l.id} onClick={()=>startGame(selectedScenario.id,l.id)} style={{...S.lordBtn,borderColor:l.color}}>
            <span style={{color:l.color,fontSize:18}}>⬤</span>
            <span style={{color:'#e0d5b7'}}>{l.name}</span>
          </button>
        ))}
      </div>
      <button onClick={()=>{setPage(1);setSelectedScenario(null);}} style={S.backBtn}>← 返回选择时期</button>
    </div>
  );

  // ====== 重返沙场 ======
  if (page===3) return (
    <div style={S.cont}>
      <h2 style={S.h2}>重返沙场</h2>
      {saves.length===0 && <div style={{color:'#808090',margin:20}}>暂无存档</div>}
      {saves.map(s=>(
        <button key={s.slot} style={S.saveBtn} onClick={()=>actions.loadGame(s.data)}>
          <div style={{fontSize:16,fontWeight:'bold',color:'#e0d5b7'}}>存档 {s.slot}</div>
          <div style={{fontSize:12,color:'#808090',marginTop:4}}>{s.name}</div>
        </button>
      ))}
      <button onClick={()=>setPage(0)} style={S.backBtn}>← 返回</button>
    </div>
  );

  // ====== 制作群组 ======
  if (page===4) return (
    <div style={S.cont}>
      <h2 style={S.h2}>制作群组</h2>
      <div style={{...S.card,maxWidth:440}}>
        <div style={{fontSize:13,color:'#c0c0c0',lineHeight:2}}>
          <p>本游戏复刻自步步高电子词典经典策略游戏</p>
          <p style={{fontSize:18,fontWeight:'bold',color:'#e94560',margin:'12px 0'}}>《三国霸业》</p>
          <p style={{fontSize:11,color:'#606080'}}>iBaye · 原版多平台移植项目</p>
          <hr style={{borderColor:'#0f3460',margin:'16px 0'}}/>
          <p>原版 C 源码作者：高国军 / 陈泽伟（步步高，2005）</p>
          <p>多平台移植：bgwp / loong</p>
          <hr style={{borderColor:'#0f3460',margin:'16px 0'}}/>
          <p>本复刻版（HistoryBook）：</p>
          <p style={{color:'#e94560',fontWeight:'bold'}}>架构与代码：DeepSeek V4 (codewhale agent)</p>
          <p style={{fontSize:11,color:'#606080'}}>基于 React + Node.js 全栈架构</p>
          <p style={{fontSize:11,color:'#606080'}}>数据-表现分离 · 引擎可头跑测试</p>
          <hr style={{borderColor:'#0f3460',margin:'16px 0'}}/>
          <p style={{fontSize:11,color:'#505070'}}>2026年5月 · Version 1.0</p>
        </div>
      </div>
      <button onClick={()=>setPage(0)} style={S.backBtn}>← 返回</button>
    </div>
  );

  // ====== 运筹帷幄（剧本编辑器预留） ======
  if (page===5) return (
    <div style={S.cont}>
      <h2 style={S.h2}>运筹帷幄</h2>
      <div style={{...S.card,maxWidth:400,textAlign:'center'}}>
        <div style={{fontSize:48,marginBottom:16}}>🏗️</div>
        <div style={{fontSize:16,fontWeight:'bold',color:'#e0d5b7'}}>剧本编辑器</div>
        <div style={{fontSize:12,color:'#808090',marginTop:8,lineHeight:1.8}}>
          可在此添加、编辑、删除剧本<br/>
          自定义君主、城市、武将、道具<br/>
          脚本事件编辑器<br/>
          <span style={{color:'#e94560'}}>—— 即将推出 ——</span>
        </div>
      </div>
      <button onClick={()=>setPage(0)} style={S.backBtn}>← 返回</button>
    </div>
  );

  return null;
}

// ====== 样式 ======
const S = {
  cont: {
    width:'100%',height:'100%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
    background:'linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)',
    overflowY:'auto',padding:'40px 16px',boxSizing:'border-box',
  },
  title: {
    fontSize:40,fontWeight:'bold',color:'#e94560',
    textShadow:'0 0 30px rgba(233,69,96,.4), 0 2px 4px rgba(0,0,0,.5)',
    letterSpacing:12,marginBottom:4,
  },
  subtitle: { fontSize:13,color:'#606080',letterSpacing:6,marginBottom:8 },
  h2: { fontSize:24,fontWeight:'bold',color:'#e94560',marginBottom:20 },
  menuBtn: {
    width:260,padding:'14px 20px',background:'rgba(233,69,96,.06)',border:'1px solid rgba(233,69,96,.3)',
    borderRadius:6,cursor:'pointer',textAlign:'left',transition:'all .15s',
  },
  menuBtnTitle: { fontSize:20,fontWeight:'bold',color:'#e0d5b7' },
  menuBtnSub: { fontSize:12,color:'#707090',marginTop:4 },
  periodBtn: {
    width:360,maxWidth:'90vw',padding:'12px 16px',margin:'4px 0',
    background:'rgba(15,52,96,.2)',border:'1px solid #0f3460',borderRadius:6,
    cursor:'pointer',textAlign:'left',
  },
  periodName: { fontSize:16,fontWeight:'bold',color:'#e0d5b7' },
  periodYear: { fontSize:11,color:'#e94560',marginTop:2 },
  periodDesc: { fontSize:11,color:'#808090',marginTop:4 },
  lordBtn: {
    width:120,padding:'10px 8px',border:'2px solid',borderRadius:8,
    background:'rgba(15,52,96,.2)',cursor:'pointer',
    display:'flex',alignItems:'center',gap:6,justifyContent:'center',
    fontSize:15,fontWeight:'bold',
  },
  saveBtn: {
    width:300,maxWidth:'90vw',padding:'12px 16px',margin:'6px 0',
    background:'rgba(15,52,96,.2)',border:'1px solid #0f3460',borderRadius:6,
    cursor:'pointer',textAlign:'left',
  },
  card: {
    background:'rgba(15,52,96,.15)',border:'1px solid #0f3460',borderRadius:8,
    padding:'20px 24px',margin:'8px 0',
  },
  backBtn: {
    marginTop:24,padding:'6px 24px',fontSize:14,
    border:'1px solid #0f3460',borderRadius:6,
    background:'transparent',color:'#a0a0b0',cursor:'pointer',
  },
};
