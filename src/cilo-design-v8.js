/* CENTRAL UI V8 — structural normalization. Keeps all existing data/actions. */
(() => {
  const qs=(s,r=document)=>r.querySelector(s);
  const qsa=(s,r=document)=>[...r.querySelectorAll(s)];

  function normalizeBrandSelector(){
    const select=qs('#brandSelect');
    const toolbar=qs('.global-toolbar');
    if(!select||!toolbar)return;
    let ctx=select.closest('.brand-context');
    if(!ctx){
      ctx=document.createElement('label');
      ctx.className='brand-context';
      ctx.setAttribute('aria-label','Marca ativa');
      const hidden=document.createElement('span');
      hidden.className='brand-context-label';hidden.textContent='Marca';
      ctx.appendChild(hidden);ctx.appendChild(select);
    }
    if(ctx.parentElement!==toolbar) toolbar.prepend(ctx);
  }

  function normalizeGlobalSearch(){
    const search=qs('.global-search'); if(!search)return;
    const input=qs('input',search); if(input){input.type='search'; input.autocomplete='off';}
    if(!qs('svg',search)) search.insertAdjacentHTML('afterbegin','<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.6"></circle><path d="m16.2 16.2 4 4"></path></svg>');
  }

  function normalizeTaskToolbar(){
    const bar=qs('.cu-toolbar'); if(!bar)return;
    const views=qs('.cu-views',bar), search=qs('.cu-search',bar), summary=qs('.cu-summary',bar);
    if(!views||!search)return;
    let top=qs('.cu-toolbar-top',bar), controls=qs('.cu-toolbar-controls',bar);
    if(!top){top=document.createElement('div');top.className='cu-toolbar-top';bar.prepend(top)}
    if(!controls){controls=document.createElement('div');controls.className='cu-toolbar-controls';bar.appendChild(controls)}
    if(views.parentElement!==top) top.prepend(views);
    if(summary&&summary.parentElement!==top) top.appendChild(summary);
    if(search.parentElement!==controls) controls.prepend(search);
    qsa('.cu-filter',bar).forEach(f=>{if(f.parentElement!==controls)controls.appendChild(f)});
    if(!qs('svg',search)) search.insertAdjacentHTML('afterbegin','<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"></circle><path d="m16 16 4 4"></path></svg>');
    const input=qs('input',search);if(input){input.type='search';input.placeholder='Buscar tarefa, descrição ou projeto…';input.autocomplete='off'}
  }

  function normalizeRail(){
    qsa('.navitem').forEach(btn=>{
      const icon=qs('.icon',btn); if(!icon)return;
      icon.setAttribute('aria-hidden','true');
      if(!btn.getAttribute('aria-label')) btn.setAttribute('aria-label',btn.dataset.label||btn.textContent.trim());
    });
  }

  function normalizeTaskDetail(){
    const drawer=qs('#taskDetailDrawer'); if(!drawer?.classList.contains('open'))return;
    const side=qs('.tdetail-side',drawer), grid=qs('.tdetail-grid',side);
    if(side&&grid&&!qs('.tdetail-side-head',side)){
      const status=qs('#detailStatus')?.value||'Status';
      const priority=qs('#detailPriority')?.value||'normal';
      const priorityLabel={urgent:'Urgente',high:'Alta',normal:'Normal',low:'Baixa'}[priority]||'Normal';
      const head=document.createElement('div');head.className='tdetail-side-head';
      head.innerHTML='<strong>Contexto da tarefa</strong><span>status, responsáveis, prazos e recorrência</span>';
      const signals=document.createElement('div');signals.className='tdetail-signals';
      signals.innerHTML=`<span class="detail-signal">${status}</span><span class="detail-signal">${priorityLabel}</span>`;
      side.insertBefore(head,grid);side.insertBefore(signals,grid);
    }
    const title=qs('#taskTitleInput',drawer);if(title){title.autocomplete='off';title.spellcheck=false}
  }

  function normalizePlanning(){
    const mind=qs('#mindWrap'); if(mind) mind.setAttribute('aria-label','Mapa mental do planejamento mensal');
    const month=qs('#planMonthGrid'); if(month) month.parentElement?.setAttribute('data-scroll-hint','horizontal');
    const week=qs('#planWeekGrid'); if(week) week.parentElement?.setAttribute('data-scroll-hint','horizontal');
  }

  function normalizeCampaignWorkspace(){
    const ws=qs('#campaignWorkspace.active'); if(!ws)return;
    qsa('.tap-section',ws).forEach(s=>s.setAttribute('data-cilo-surface','tap'));
  }

  function fixTodayLabel(){
    const chip=qs('#todayLabel'); if(!chip)return;
    chip.setAttribute('title',chip.textContent.trim());
  }

  function enhance(){
    document.documentElement.dataset.centralUi='v8';
    normalizeBrandSelector();normalizeGlobalSearch();normalizeTaskToolbar();normalizeRail();normalizeTaskDetail();normalizePlanning();normalizeCampaignWorkspace();fixTodayLabel();
  }

  let queued=false;
  const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;enhance()})};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
  new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
  window.addEventListener('resize',schedule,{passive:true});
})();