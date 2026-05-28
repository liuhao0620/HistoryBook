// ============================================
// 三国霸业 - 游戏核心引擎（完整版）
// ============================================

import {
  ARMY_TYPE, CHARACTER, KING_CHARACTER, CITY_STATE,
  INTERIOR_ORDERS, DIPLOMACY_ORDERS, ARMAMENT_ORDERS,
  ORDER_THEW_COST, PERSON_MAX_AGE,
} from '../../../shared/constants.js';

export default class GameEngine {
  constructor() {
    this.scenario = null;
    this.year = 208; this.month = 1;
    this.playerLord = null;
    this.lords = []; this.persons = []; this.cities = [];
    this.items = []; this.orders = []; this.eventLog = [];
    this.battleState = null;
    this.phase = 'idle';
  }

  // ========== 初始化 ==========

  loadScenario(scenarioData, playerLordOverride) {
    this.scenario = scenarioData;
    this.year = scenarioData.startYear;
    this.month = scenarioData.startMonth;
    this.playerLord = playerLordOverride || scenarioData.playerLord;
    this.lords = scenarioData.lords.map(l => ({...l}));
    this.persons = scenarioData.persons.map(p => this._initPerson(p));
    this.cities = scenarioData.cities.map(c => this._initCity(c));
    this.items = (scenarioData.items || []).map(i => ({...i}));
    this.orders = []; this.eventLog = []; this.battleState = null;
    this.phase = 'order';
    if (scenarioData.scripts?.onStart) { try { scenarioData.scripts.onStart(this); } catch(e) {} }
    this._log(`剧本开始 — ${scenarioData.name}`);
    return this.getState();
  }

  _initPerson(p) { return {
    id:p.id,name:p.name,lord:p.lord,oldLord:p.lord,city:p.city||0,
    level:p.level||1,force:p.force||50,iq:p.iq||50,
    devotion:p.devotion||70,character:p.character||CHARACTER.LOYAL,
    experience:p.experience||0,thew:p.thew||80,
    armyType:p.armyType||ARMY_TYPE.INFANTRY,armyCount:p.armyCount||0,
    maxArmy:this._calcMaxArmy(p),equipment:p.equipment||[-1,-1],
    age:p.age||25,skills:p.skills||[],portraitId:p.portraitId||0,isAlive:true
  };}

  _initCity(c) { return {
    id:c.id,name:c.name,lord:c.lord||0,governor:c.governor||0,
    state:c.state||CITY_STATE.NORMAL,
    farmingLimit:c.farmingLimit||1000,farming:c.farming||500,
    commerceLimit:c.commerceLimit||1000,commerce:c.commerce||500,
    devotion:c.devotion||70,disasterDef:c.disasterDef||50,
    populationLimit:c.populationLimit||100000,population:c.population||50000,
    money:c.money||1000,food:c.food||10000,reserveArmy:c.reserveArmy||5000,
    x:c.x||0,y:c.y||0,links:c.links||[],battleMapId:c.battleMapId||0
  };}

  _calcMaxArmy(p) { return (p.level||1)*100+(p.force||0)*10+(p.iq||0)*10; }

  // ========== 状态 ==========

  getState() { return {
    scenarioId:this.scenario?.id,year:this.year,month:this.month,
    playerLord:this.playerLord,phase:this.phase,lords:this.lords,
    cities:this.cities,persons:this.persons,items:this.items,
    orders:this.orders,eventLog:this.eventLog.slice(-50),battleState:this.battleState
  };}

  getPlayerState() { return this.getState(); }

  // ========== 指令 ==========

  addOrder(order) {
    const person = this.getPerson(order.personId);
    if (!person) return {ok:false,msg:'武将不存在'};
    if (person.thew < ORDER_THEW_COST) return {ok:false,msg:'体力不足'};
    if (person.lord !== this.playerLord) return {ok:false,msg:'不是你的武将'};
    const city = this.getCity(order.cityId);
    if (!city) return {ok:false,msg:'城市不存在'};
    // 金钱检查
    if (order.money > 0 && city.money < order.money) return {ok:false,msg:'金钱不足'};
    if (order.food > 0 && city.food < order.food) return {ok:false,msg:'粮草不足'};
    person.thew -= ORDER_THEW_COST;
    const oe = {id:Date.now(),type:order.type,personId:order.personId,cityId:order.cityId,
      targetId:order.targetId||0,arms:order.arms||0,food:order.food||0,money:order.money||0,
      turns:1,progress:0};
    this.orders.push(oe);
    return {ok:true,order:oe};
  }

  removeOrder(orderId) {
    const idx = this.orders.findIndex(o=>o.id===orderId);
    if (idx===-1) return {ok:false,msg:'指令不存在'};
    const p = this.getPerson(this.orders[idx].personId);
    if (p) p.thew += ORDER_THEW_COST;
    this.orders.splice(idx,1);
    return {ok:true};
  }

  // ========== 月份执行 ==========

  executeMonth() {
    if (this.phase==='battle') return {ok:false,msg:'战斗中'};
    if (this.phase==='gameover') return {ok:false,msg:'已结束'};
    this.phase='execute'; const results=[];
    if (this.scenario?.scripts?.onMonthStart) { try{this.scenario.scripts.onMonthStart(this)}catch(e){} }
    for (const o of this.orders) { const r = this._exec(o); if (r) results.push(r); }
    this.orders=[]; this._aiTurn(); this._updateCities(); this._updatePersons();
    if (this.scenario?.scripts?.onMonthEnd) { try{this.scenario.scripts.onMonthEnd(this)}catch(e){} }
    this.month++; if (this.month>12) { this.month=1; this.year++; }
    for (const p of this.persons) { if (p.isAlive) p.thew=Math.min(p.thew+5,100); }
    this.phase='order';
    const wc = this._checkWinLose();
    if (wc) { this.phase='gameover'; results.push(wc); }
    this._log(`${this.year}年${this.month}月`);
    return {ok:true,results,state:this.getState()};
  }

  _exec(order) {
    const p=this.getPerson(order.personId),c=this.getCity(order.cityId);
    if (!p||!c) return null;
    let r={orderId:order.id,type:order.type,person:p.name,city:c.name,msg:''};
    switch(order.type) {
      case INTERIOR_ORDERS.ASSART: this._assart(p,c,r); break;
      case INTERIOR_ORDERS.COMMERCE: this._commerce(p,c,r); break;
      case INTERIOR_ORDERS.SEARCH: this._search(p,c,r); break;
      case INTERIOR_ORDERS.GOVERN: this._govern(p,c,r); break;
      case INTERIOR_ORDERS.INSPECT: this._inspect(p,c,r); break;
      case INTERIOR_ORDERS.SURRENDER: this._surrender(p,c,order,r); break;
      case INTERIOR_ORDERS.EXECUTE: this._execute(p,c,order,r); break;
      case INTERIOR_ORDERS.BANISH: this._banish(p,c,r); break;
      case INTERIOR_ORDERS.REWARD: this._reward(p,c,order,r); break;
      case INTERIOR_ORDERS.CONFISCATE: this._confiscate(p,c,r); break;
      case INTERIOR_ORDERS.TRADE: this._trade(p,c,order,r); break;
      case INTERIOR_ORDERS.FEAST: this._feast(p,c,r); break;
      case INTERIOR_ORDERS.TRANSPORT: this._transport(p,c,order,r); break;
      case INTERIOR_ORDERS.MOVE: this._move(p,c,order,r); break;
      case INTERIOR_ORDERS.APPOINT: this._appoint(p,c,order,r); break;
      case INTERIOR_ORDERS.DISTRIBUTE: this._distribute(p,c,order,r); break;
      case INTERIOR_ORDERS.PILLAGE: this._pillage(p,c,order,r); break;
      case DIPLOMACY_ORDERS.ALIENATE: this._alienate(p,c,order,r); break;
      case DIPLOMACY_ORDERS.RECRUIT: this._recruit(p,c,order,r); break;
      case DIPLOMACY_ORDERS.SUBVERT: this._subvert(p,c,order,r); break;
      case DIPLOMACY_ORDERS.COUNTER_SPY: this._counterSpy(p,c,r); break;
      case DIPLOMACY_ORDERS.PERSUADE: this._persuade(p,c,order,r); break;
      case ARMAMENT_ORDERS.SCOUT: this._scout(p,c,order,r); break;
      case ARMAMENT_ORDERS.CONSCRIPT: this._conscript(p,c,order,r); break;
      case ARMAMENT_ORDERS.BATTLE: r.battle={atkCityId:c.id,defCityId:order.targetId}; r.msg=`出征！`; break;
      default: r.msg='指令未实现';
    }
    return r;
  }

  // ---- 内政 ----
  _assart(p,c,r) { const g=Math.floor(p.force*0.5+this._r(10,30)); c.farming=Math.min(c.farming+g,c.farmingLimit); r.msg=`开垦 +${c.farming-(c.farming-g)}`; p.experience+=5; }
  _commerce(p,c,r) { const g=Math.floor(p.iq*0.5+this._r(10,30)); c.commerce=Math.min(c.commerce+g,c.commerceLimit); r.msg=`招商 +${g}`; p.experience+=5; }
  _search(p,c,r) {
    if (this._r(0,100)<35) {
      const fp=this.persons.find(x=>x.lord===0&&x.city===c.id&&x.isAlive);
      if (fp) { fp.lord=p.lord; fp.city=c.id; r.msg=`找到 ${fp.name}！`; p.experience+=10; }
      else r.msg='搜寻无果';
    } else r.msg='搜寻无果';
  }
  _govern(p,c,r) { const g=Math.floor(p.iq*0.3+this._r(1,10)); c.devotion=Math.min(c.devotion+g,100); c.state=CITY_STATE.NORMAL; r.msg=`治理 +${g}民忠`; p.experience+=5; }
  _inspect(p,c,r) { if (this._r(0,100)<p.iq*0.5) { c.devotion=Math.min(c.devotion+5,100); r.msg='出巡 +5民忠'; } else r.msg='出巡无果'; p.experience+=3; }
  _surrender(p,c,o,r) {
    const cap=this.persons.filter(x=>x.lord===this.playerLord&&x.city===c.id&&x.isAlive);
    if (cap.length===0) { r.msg='无俘虏'; return; }
    const t=cap[0]; const rates={4:5,3:20,2:30,1:60,0:15};
    if (this._r(0,100)<rates[t.character]+(p.iq-t.iq)*0.5) { t.devotion=50+Math.floor(p.iq/2); r.msg=`${t.name} 归顺`; p.experience+=15; }
    else { r.msg='招降失败'; p.experience+=5; }
  }
  _execute(p,c,o,r) {
    const t=this.getPerson(o.targetId);
    if (!t||t.city!==c.id) { r.msg='目标不在城中'; return; }
    t.isAlive=false; r.msg=`${t.name} 被处斩`;
  }
  _banish(p,c,r) { c.reserveArmy=0; c.population=Math.floor(c.population*0.9); r.msg='流放成功'; p.experience+=2; }
  _reward(p,c,o,r) {
    if (c.money<o.money) { r.msg='金钱不足'; return; }
    c.money-=o.money; const dg=Math.floor(o.money/10);
    for (const x of this.persons) { if (x.city===c.id&&x.lord===this.playerLord&&x.isAlive) x.devotion=Math.min(x.devotion+dg,100); }
    r.msg=`赏赐 ${o.money}金`; p.experience+=3;
  }
  _confiscate(p,c,r) { c.money+=500; c.devotion=Math.max(c.devotion-10,0); c.reserveArmy=Math.max(c.reserveArmy-200,0); r.msg='没收 +500金 -10民忠'; p.experience+=2; }
  _trade(p,c,o,r) {
    if (o.money>0&&c.money>=o.money) { c.money-=o.money; const food=o.money*5; c.food+=food; r.msg=`买粮 ${food}`; }
    else if (o.food>0&&c.food>=o.food) { c.food-=o.food; const gold=Math.floor(o.food*0.4); c.money+=gold; r.msg=`卖粮得${gold}金`; }
    else r.msg='交易失败'; p.experience+=5;
  }
  _feast(p,c,r) { if (c.money<100) { r.msg='金钱不足'; return; } c.money-=100; p.thew=Math.min(p.thew+30,100); r.msg=`宴请 +30体`; }
  _transport(p,c,o,r) {
    const tc=this.getCity(o.targetId);
    if (!tc||tc.lord!==c.lord) { r.msg='无效目标'; return; }
    const fm=Math.min(o.food||0,c.food),mm=Math.min(o.money||0,c.money),am=Math.min(o.arms||0,c.reserveArmy);
    c.food-=fm;c.money-=mm;c.reserveArmy-=am; tc.food+=fm;tc.money+=mm;tc.reserveArmy+=am;
    r.msg=`输送:粮${fm}金${mm}兵${am}`; p.experience+=3;
  }
  _move(p,c,o,r) { const tc=this.getCity(o.targetId); if (!tc||tc.lord!==c.lord) { r.msg='无效目标'; return; } p.city=tc.id; r.msg=`移动到${tc.name}`; p.experience+=2; }
  _appoint(p,c,o,r) { const t=this.getPerson(o.targetId); if (!t||t.city!==c.id) { r.msg='目标不在城中'; return; } c.governor=t.id; r.msg=`任命${t.name}为太守`; }
  _distribute(p,c,o,r) {
    const t=this.getPerson(o.targetId); if (!t||t.city!==c.id) { r.msg='目标不在城中'; return; }
    const it=this.getItem(o.arms); if (!it) { r.msg='道具不存在'; return; }
    if (it.type===1) t.equipment[0]=it.id; else if (it.type===2) t.equipment[1]=it.id;
    if (it.atkBonus) t.force+=it.atkBonus; if (it.iqBonus) t.iq+=it.iqBonus;
    r.msg=`${it.name}→${t.name}`; p.experience+=3;
  }
  _pillage(p,c,o,r) {
    const gf=Math.min(o.food||Math.floor(c.food*0.5),c.food),gm=Math.min(o.money||Math.floor(c.money*0.5),c.money);
    c.food-=gf;c.money-=gm;c.devotion=Math.max(c.devotion-20,0);c.population=Math.floor(c.population*0.95);
    if (c.devotion<30) c.state=CITY_STATE.REBELLION;
    r.msg=`掠夺:粮${gf}金${gm}`; p.experience+=8;
  }

  // ---- 外交 ----
  _alienate(p,c,o,r) {
    const t=this.getPerson(o.targetId); if (!t||t.lord===this.playerLord) { r.msg='无效目标'; return; }
    const rates={4:5,3:30,2:40,1:30,0:50};
    if (this._r(0,100)<Math.min(rates[t.character]+(p.iq-t.iq)*0.5,90)) { t.devotion=Math.max(t.devotion-this._r(10,30),0); t.thew=Math.max(t.thew-5,0); }
    r.msg=t.devotion<30?`离间成功!${t.name}忠诚${t.devotion}`:`离间效果一般`; p.experience+=8;
  }
  _recruit(p,c,o,r) {
    const tc=this.getCity(o.targetId); if (!tc) { r.msg='无效目标'; return; }
    const tg=this.persons.filter(x=>x.city===tc.id&&x.isAlive&&(x.lord===0||(x.lord!==this.playerLord&&x.devotion<40)));
    if (tg.length===0) { r.msg='无合适目标'; p.experience+=2; return; }
    const t=tg[0]; if (this._r(0,100)<30+p.iq*0.3-t.devotion*0.2) { t.lord=this.playerLord;t.city=c.id;t.devotion=50; r.msg=`招揽${t.name}!`; p.experience+=15; }
    else { r.msg='招揽失败'; p.experience+=5; }
  }
  _subvert(p,c,o,r) {
    const tc=this.getCity(o.targetId); if (!tc||tc.lord===this.playerLord) { r.msg='无效目标'; return; }
    const ep=this.persons.filter(x=>x.city===tc.id&&x.lord===tc.lord&&x.isAlive); if (ep.length===0) { r.msg='城中无将'; return; }
    const t=ep[0]; const rates={4:5,3:60,2:20,1:10,0:30};
    if (this._r(0,100)<Math.min(rates[t.character]+(p.iq-t.iq)*0.3,85)) { t.lord=this.playerLord;t.city=c.id;t.devotion=40; r.msg=`策反${t.name}!`; p.experience+=20; }
    else { r.msg='策反失败'; p.experience+=5; }
  }
  _counterSpy(p,c,r) {
    const ec=this.cities.filter(x=>x.lord!==this.playerLord&&x.lord!==0); if (ec.length===0) { r.msg='无敌人'; return; }
    const tc=ec[0]; let cnt=0;
    for (const ep of this.persons.filter(x=>x.city===tc.id&&x.lord===tc.lord&&x.isAlive).slice(0,3)) { if (this._r(0,100)<40) { ep.devotion=Math.max(ep.devotion-15,0); cnt++; } }
    r.msg=cnt>0?`反间!${tc.name}${cnt}将动摇`:'反间无果'; p.experience+=10;
  }
  _persuade(p,c,o,r) {
    const tc=this.getCity(o.targetId); if (!tc||tc.lord===this.playerLord||tc.lord===0) { r.msg='无效目标'; return; }
    const tl=this.getLord(tc.lord); if (!tl) { r.msg='君主不存在'; return; }
    const rates={4:15,3:5,2:20,1:1,0:10};
    if (this._r(0,100)<rates[tl.character]+(p.iq-70)*0.3) {
      const pl=tc.lord; tc.lord=this.playerLord;tc.devotion=50;
      for (const x of this.persons) { if (x.city===tc.id&&x.lord===pl) { x.lord=this.playerLord;x.devotion=45; } }
      r.msg=`劝降成功!${tc.name}归降`; p.experience+=30;
    } else { r.msg='劝降失败'; p.experience+=5; }
  }

  // ---- 军备 ----
  _scout(p,c,o,r) {
    const tc=this.getCity(o.targetId); if (!tc) { r.msg='无效目标'; return; }
    if (this._r(0,100)<60+(p.iq-50)*0.4) {
      const ep=this.persons.filter(x=>x.city===tc.id&&x.isAlive); r.msg=`侦察${tc.name}:金${tc.money}粮${tc.food}兵${tc.reserveArmy}将${ep.length}`;
    } else r.msg='情报不清'; p.experience+=5;
  }
  _conscript(p,c,o,r) {
    const mc=Math.floor(c.population*0.08); const ct=Math.min(o.arms||mc,mc);
    if (ct<=0) { r.msg='人口不足'; return; }
    const cost=Math.floor(ct*2.5); if (c.money<cost) { r.msg='金钱不足'; return; }
    c.money-=cost;c.population-=ct;c.reserveArmy+=ct;c.devotion=Math.max(c.devotion-2,0);
    r.msg=`征兵${ct}人 花费${cost}金`; p.experience+=5;
  }

  // ========== AI ==========

  _aiTurn() {
    for (const l of this.lords) { if (l.id!==this.playerLord) this._aiLord(l); }
  }

  _aiLord(l) {
    const lc=this.cities.filter(c=>c.lord===l.id);
    const lp=this.persons.filter(p=>p.lord===l.id&&p.isAlive);
    if (lc.length===0||lp.length===0) return;
    for (const c of lc) {
      const cp=lp.filter(p=>p.city===c.id); if (cp.length===0) continue;
      const p=cp[0];
      if (c.farming<c.farmingLimit*0.85) c.farming=Math.min(c.farming+this._r(8,25),c.farmingLimit);
      if (c.commerce<c.commerceLimit*0.85) c.commerce=Math.min(c.commerce+this._r(8,25),c.commerceLimit);
      if (c.devotion<75) c.devotion=Math.min(c.devotion+3,100);
      if (c.reserveArmy<15000&&c.money>2000&&c.population>10000) {
        const ct=Math.min(this._r(500,2000),Math.floor(c.population*0.05));
        c.money-=ct*2;c.population-=ct;c.reserveArmy+=ct;
      }
      for (const x of cp) { const df=Math.min(x.maxArmy-x.armyCount,c.reserveArmy); if(df>0){x.armyCount+=df;c.reserveArmy-=df;} }
      // AI 进攻逻辑：偶尔攻击相邻敌城
      if (this._r(0,100)<15) {
        const adj=this.cities.filter(ac=>c.links.includes(ac.id)&&ac.lord!==l.id&&ac.lord!==0);
        if (adj.length>0) {
          const tc=adj[0]; const fc=cp.filter(x=>x.armyCount>1000).slice(0,5);
          if (fc.length>0) {
            const atk=Math.min(Math.floor(c.food*0.2),c.food);
            c.food-=atk; c.reserveArmy-=1000;
            // 简化AI战斗：概率性占领
            if (this._r(0,100)<40+fc.length*5) {
              const pl=tc.lord; tc.lord=l.id;tc.devotion=40;
              for (const x of this.persons) { if (x.city===tc.id&&x.lord===pl) { x.lord=l.id;x.devotion=35; } }
              this._log(`AI:${l.name}攻占${tc.name}`);
            } else this._log(`AI:${l.name}进攻${tc.name}失败`);
          }
        }
      }
    }
  }

  // ========== 自然变化 ==========

  _updateCities() {
    for (const c of this.cities) {
      if (c.lord===0) continue;
      c.food+=Math.floor(c.farming*c.population/10000);
      c.money+=Math.floor(c.commerce*c.population/10000);
      c.population=Math.floor(c.population*1.005);
      c.food=Math.max(c.food-Math.floor(c.reserveArmy*0.5),0);
      if (this._r(0,100)<3&&c.food>0) { c.food=Math.max(c.food-500,0); c.state=CITY_STATE.FAMINE; }
      if (this._r(0,100)<2) { c.farming=Math.max(c.farming-30,0); c.state=CITY_STATE.FLOOD; }
    }
  }

  _updatePersons() {
    for (const p of this.persons) {
      if (!p.isAlive) continue;
      if (this.month===2) p.age++;
      if (p.age>PERSON_MAX_AGE) { p.isAlive=false; this._log(`${p.name}寿终`); }
      if (p.experience>=100) {
        p.level++;p.experience-=100;p.force+=this._r(1,3);p.iq+=this._r(1,3);
        p.maxArmy=this._calcMaxArmy(p); this._log(`${p.name}→Lv${p.level}`);
      }
    }
  }

  _checkWinLose() {
    const pc=this.cities.filter(c=>c.lord===this.playerLord);
    if (pc.length===0) return {type:'gameover',result:'lose',msg:'势力覆灭'};
    const ac=this.cities.filter(c=>c.lord!==0);
    if (ac.every(c=>c.lord===this.playerLord)) return {type:'gameover',result:'win',msg:'一统天下!'};
    return null;
  }

  // ========== 工具 ==========

  getPerson(id) { return this.persons.find(p=>p.id===id); }
  getCity(id) { return this.cities.find(c=>c.id===id); }
  getItem(id) { return this.items.find(i=>i.id===id); }
  getLord(id) { return this.lords.find(l=>l.id===id); }
  _r(a,b) { return Math.floor(Math.random()*(b-a+1))+a; }
  _log(s) { this.eventLog.push(`${this.year}/${this.month}: ${s}`); }

  save() { return JSON.parse(JSON.stringify({
    scenarioId:this.scenario?.id,year:this.year,month:this.month,
    playerLord:this.playerLord,lords:this.lords,persons:this.persons,
    cities:this.cities,items:this.items,orders:this.orders,
    eventLog:this.eventLog,phase:this.phase
  }));}

  load(d) {
    this.year=d.year;this.month=d.month;this.playerLord=d.playerLord;
    this.lords=d.lords;this.persons=d.persons;this.cities=d.cities;
    this.items=d.items||[];this.orders=d.orders||[];
    this.eventLog=d.eventLog||[];this.phase=d.phase||'order';
    this.battleState=null; return this.getState();
  }
}
