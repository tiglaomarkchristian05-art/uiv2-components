(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const state = { query: '', category: 'all', expanded: new Set() };
  const accents = [
    ['groups','#db2777','#fdf2f8'],['badge','#2563eb','#eff6ff'],['school','#7c3aed','#f5f3ff'],
    ['shield','#0891b2','#ecfeff'],['account_balance_wallet','#059669','#ecfdf5'],['inventory_2','#d97706','#fffbeb'],
    ['local_shipping','#dc2626','#fef2f2'],['apartment','#475569','#f8fafc'],['monitoring','#eec643','#fffbea','#1f1d26','#4a3820'],['handshake','#0f766e','#f0fdfa']
  ];

  const normalize = value => String(value || '').toLowerCase().trim();
  const debounce = (fn, delay = 180) => { let timer; return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); }; };
  const categories = [
    ['all','All systems'],['core','Core transactions'],['finance','Financial'],['operations','Operations'],['insights','Analytics & CRM']
  ];
  const categoryFor = subsystem => {
    const category = normalize(subsystem.category);
    if (category.includes('core transaction')) return 'core';
    if (category.includes('financial')) return 'finance';
    if (category.includes('business intelligence') || category.includes('customer relationship')) return 'insights';
    return 'operations';
  };

  function renderFilters() {
    const root = $('#category-filters'); root.replaceChildren();
    categories.forEach(([value, label]) => {
      const button = document.createElement('button'); button.type = 'button'; button.dataset.category = value;
      button.className = value === state.category ? 'active' : ''; button.setAttribute('aria-pressed', String(value === state.category)); button.textContent = label; root.append(button);
    });
  }

  function filteredSubsystems() {
    const query = normalize(state.query);
    return SUBSYSTEMS.filter(subsystem => {
      if (state.category !== 'all' && categoryFor(subsystem) !== state.category) return false;
      if (!query) return true;
      return [subsystem.title, subsystem.category, subsystem.description, ...subsystem.modules.map(item => typeof item === 'string' ? item : item.name)].some(value => normalize(value).includes(query));
    });
  }

  function createCard(subsystem, index) {
    const expanded = state.expanded.has(subsystem.id), modules = subsystem.modules.map(item => typeof item === 'string' ? item : item.name);
    const palette=accents[index % accents.length], article = document.createElement('article'); article.className = 'subsystem-card'; article.dataset.subsystemId = subsystem.id; article.style.setProperty('--card-accent',palette[1]); article.style.setProperty('--card-soft',palette[2]); if(palette[3]){article.classList.add('dual-tone');article.style.setProperty('--card-gradient',`linear-gradient(135deg,${palette[3]},${palette[4]})`);}
    const top = document.createElement('div'); top.className = 'subsystem-card-top';
    const icon = document.createElement('span'); icon.className = 'subsystem-icon material-symbols-outlined'; icon.textContent = accents[index % accents.length][0]; icon.setAttribute('aria-hidden','true');
    const number = document.createElement('span'); number.className = 'subsystem-number'; number.textContent = String(index + 1).padStart(2,'0'); top.append(icon,number);
    const eyebrow = document.createElement('p'); eyebrow.className = 'card-eyebrow'; eyebrow.textContent = subsystem.category;
    const title = document.createElement('h3'); title.textContent = subsystem.title;
    const description = document.createElement('p'); description.className = 'subsystem-description'; description.textContent = subsystem.description;
    const divider = document.createElement('div'); divider.className = 'module-heading';
    const moduleLabel = document.createElement('span'); moduleLabel.className='module-count-badge'; moduleLabel.innerHTML=`<span class="material-symbols-outlined" aria-hidden="true">layers</span>${modules.length} Modules`;
    const expand = document.createElement('button'); expand.type = 'button'; expand.className = 'expand-modules'; expand.dataset.expandId = subsystem.id; expand.setAttribute('aria-expanded',String(expanded)); expand.innerHTML=`<span>${expanded?'Hide Details':'View Details'}</span><span class="material-symbols-outlined" aria-hidden="true">${expanded?'expand_less':'expand_more'}</span>`; divider.append(moduleLabel,expand);
    const list = document.createElement('ol'); list.className = 'subsystem-module-list'; list.hidden=!expanded;
    modules.forEach(moduleName => { const item = document.createElement('li'); const check = document.createElement('span'); check.className = 'material-symbols-outlined'; check.textContent = 'check'; const label = document.createElement('span'); label.textContent = moduleName; item.append(check,label); list.append(item); });
    const actions = document.createElement('div'); actions.className = 'subsystem-card-actions';
    const link = document.createElement('a'); link.className = 'open-dashboard'; link.href = `../dashboard_app_layout/code.html?subsystem=${encodeURIComponent(subsystem.id)}`; link.innerHTML = '<span>Open Dashboard</span><span class="material-symbols-outlined" aria-hidden="true">arrow_forward</span>'; actions.append(link);
    article.append(top,eyebrow,title,description,divider,list,actions); return article;
  }

  function render() {
    const results = filteredSubsystems(), grid = $('#module-selector-grid'); grid.replaceChildren();
    results.forEach(subsystem => grid.append(createCard(subsystem, SUBSYSTEMS.indexOf(subsystem))));
    $('#selector-empty-state').hidden = results.length > 0; grid.hidden = results.length === 0;
    $('#selector-result-count').textContent = `${results.length} of ${SUBSYSTEMS.length} subsystems`;
    $('#clear-module-search').hidden = !state.query; renderFilters();
  }

  function reset() { state.query = ''; state.category = 'all'; $('#module-search').value = ''; render(); $('#module-search').focus(); }

  document.addEventListener('DOMContentLoaded', () => {
    $('#subsystem-total').textContent = SUBSYSTEMS.length;
    $('#module-total').textContent = SUBSYSTEMS.reduce((total, subsystem) => total + subsystem.modules.length, 0);
    render();
    $('#module-search').addEventListener('input', debounce(event => { state.query = event.target.value; render(); }));
    $('#clear-module-search').addEventListener('click', reset); $('#reset-selector').addEventListener('click', reset);
    document.addEventListener('click', event => {
      const category = event.target.closest('[data-category]'); if (category) { state.category = category.dataset.category; render(); }
      const expand = event.target.closest('[data-expand-id]'); if (expand) { const id = expand.dataset.expandId; state.expanded.has(id) ? state.expanded.delete(id) : state.expanded.add(id); render(); document.querySelector(`[data-subsystem-id="${id}"]`)?.scrollIntoView({ behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'nearest' }); }
    });
  });
})();
