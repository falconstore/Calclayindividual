/**
 * Bootstrap minimalista: render + binds + cálculo
 */
(function () {
  if (!window.calculatorData) {
    window.calculatorData = {
      numProtecoes: 3,
      rounding: 0.01,
      multipla: { odd: 9.00, stake: 30, freebet: true },
      protecoes: [],
      freebetPercent: 70,
      debugMode: false
    };
  }

  function ensureProtecoesByDOM() {
    // usa select para definir
    const sel = document.getElementById('select-protecoes');
    const n = sel ? Number(sel.value) : (window.calculatorData.numProtecoes || 3);
    window.calculatorData.numProtecoes = Math.max(2, Math.min(6, n));
  }

  function bindMultipla() {
    const o = document.getElementById('odd1');
    const s = document.getElementById('stake1');
    const f = document.getElementById('freebet1');
    if (o) o.addEventListener('input', updateCalculation);
    if (s) s.addEventListener('input', updateCalculation);
    if (f) f.addEventListener('change', updateCalculation);
  }

  function bindGlobalControls() {
    const selProt = document.getElementById('select-protecoes');
    if (selProt) selProt.addEventListener('change', () => {
      ensureProtecoesByDOM();
      renderProtecoes();
    });

    const selRound = document.getElementById('select-round');
    if (selRound) selRound.addEventListener('change', () => {
      const v = parseDecimal(selRound.value);
      if (Number.isFinite(v) && v > 0) window.calculatorData.rounding = v;
      updateCalculation();
    });

    const range = document.getElementById('fb-range');
    const pctEl = document.getElementById('freebet-percent');
    const inc = document.getElementById('fb-inc');
    const dec = document.getElementById('fb-dec');

    function syncFreebet(val) {
      const v = Math.max(0, Math.min(100, Math.round(val)));
      window.calculatorData.freebetPercent = v;
      if (range) range.value = String(v);
      if (pctEl) pctEl.textContent = `${v}%`;
    }

    if (range) range.addEventListener('input', e => { syncFreebet(e.target.value); updateCalculation(); });
    if (inc) inc.addEventListener('click', () => { syncFreebet((window.calculatorData.freebetPercent || 0) + 1); updateCalculation(); });
    if (dec) dec.addEventListener('click', () => { syncFreebet((window.calculatorData.freebetPercent || 0) - 1); updateCalculation(); });

    const force = document.getElementById('force-recalc');
    if (force) force.addEventListener('click', () => updateCalculation());
  }

  document.addEventListener('DOMContentLoaded', () => {
    ensureProtecoesByDOM();
    renderProtecoes();
    bindMultipla();
    bindGlobalControls();
    updateCalculation();
  });
})();

/* ===== Fallback: define updateCalculation se o calculator.js não definiu ===== */
(function () {
  if (typeof window.updateCalculation === 'function') return; // já existe, beleza

  function setTextOrValueById(id, text) {
    const el = document.getElementById(id);
    if (!el) return;
    if ('value' in el) el.value = text; else el.textContent = text;
  }
  function getFreebetRatio() {
    const r = document.getElementById('fb-range');
    if (r) { const v = Number(r.value); if (Number.isFinite(v)) return Math.max(0, Math.min(1, v/100)); }
    const lbl = document.getElementById('freebet-percent');
    if (lbl) { const m = (lbl.textContent||'').match(/(\d+)/); if (m) return Math.max(0, Math.min(1, Number(m[1])/100)); }
    return Math.max(0, Math.min(1, (window.calculatorData?.freebetPercent||70)/100));
  }
  function getRounding() {
    const el = document.getElementById('select-round');
    const v = (el && Number(el.value)) || window.calculatorData.rounding || 0.01;
    return Number.isFinite(v) && v > 0 ? v : 0.01;
  }

  window.updateCalculation = function updateCalculation() {
    // 1) Garante array de proteções
    const cd = window.calculatorData || (window.calculatorData = { numProtecoes: 3, protecoes: [] });
    if (!Array.isArray(cd.protecoes)) cd.protecoes = [];
    while (cd.protecoes.length < cd.numProtecoes) cd.protecoes.push({ odd: 2.0, isLay: true, commission: 0, calculatedStake: 0, responsibility: 0 });
    if (cd.protecoes.length > cd.numProtecoes) cd.protecoes.length = cd.numProtecoes;

    // 2) Lê múltipla (sem zerar se NaN)
    const odd1 = document.getElementById('odd1');   if (odd1)   { const v = parseDecimal(odd1.value);   if (Number.isFinite(v)) (cd.multipla = cd.multipla||{}).odd = v; }
    const stk1 = document.getElementById('stake1'); if (stk1)   { const v = parseDecimal(stk1.value);   if (Number.isFinite(v)) (cd.multipla = cd.multipla||{}).stake = v; }
    const fb1  = document.getElementById('freebet1'); if (fb1) cd.multipla.freebet = !!fb1.checked;

    // 3) Lê proteções
    for (let i = 0; i < cd.numProtecoes; i++) {
      const idx = i + 2, p = cd.protecoes[i];
      const oddEl  = document.getElementById(`odd${idx}`);
      const commEl = document.getElementById(`commission${idx}`);
      const commCK = document.getElementById(`comm${idx}`);
      if (oddEl) { const v = parseDecimal(oddEl.value); if (Number.isFinite(v)) p.odd = v; }
      if (commCK && commCK.checked && commEl) { const v = parseDecimal(commEl.value); p.commission = Number.isFinite(v) ? v : (p.commission||0); }
      else p.commission = 0;
      p.isLay = !!p.isLay; // o toggle da UI controla isso
    }

    // 4) Se não temos o solver do calculator.js, não dá pra calcular
    if (typeof computeEqualizedStakes !== 'function') {
      console.error('computeEqualizedStakes ausente (calculator.js não carregou). Verifique o caminho/erro de sintaxe.');
      return;
    }

    // 5) Calcula stakes equalizadas
    const r = getFreebetRatio();
    const isFreebet = !!(cd.multipla && cd.multipla.freebet);
    const freebetValue = isFreebet ? cd.multipla.stake : 0;
    const protections = cd.protecoes.map(p => ({ odd: Number(p.odd)||0, commission: Number(p.commission)||0, isLay: !!p.isLay }));

    const { stakes, alvoProtecao, lucroMultipla } = computeEqualizedStakes({
      oddMulti: Number(cd.multipla?.odd)||0,
      stakeMulti: Number(cd.multipla?.stake)||0,
      isFreebet,
      freebetValue,
      ratioExtract: r,
      protections
    });

    // 6) Arredonda, aplica responsabilidade e reflete na UI
    const step = getRounding();
    for (let i = 0; i < cd.numProtecoes; i++) {
      const idx = i + 2;
      const raw = Number(stakes[i]) || 0;
      let stake = Math.round(Math.max(0, raw) / step) * step;
      if (stake > 0 && stake < 0.5) stake = 0.5;
      const p = cd.protecoes[i];
      p.calculatedStake = stake;
      p.responsibility  = p.isLay ? stake * Math.max(0, (Number(p.odd)||0) - 1) : 0;

      setTextOrValueById(`calc-stake${idx}`, formatCurrency(stake));
      setTextOrValueById(`resp${idx}`,      formatCurrency(p.responsibility));
    }

    // 7) Totais e metas
    const tot = cd.protecoes.reduce((acc,p)=> acc + (p.isLay ? (Number(p.responsibility)||0) : (Number(p.calculatedStake)||0)), 0);
    const totEl = document.getElementById('totalInvestment'); if (totEl) totEl.textContent = formatCurrency(tot);
    const mP = document.getElementById('meta-protecao'); if (mP) mP.textContent = formatCurrency(alvoProtecao||0);
    const mM = document.getElementById('meta-multipla'); if (mM) mM.textContent = formatCurrency(lucroMultipla||0);
  };
})();

