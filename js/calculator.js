/**
 * Equalização de lucros com/sem Freebet (2..N proteções), BACK/LAY, comissões.
 */

function safeNum(x, d = 0) { const n = Number(x); return Number.isFinite(n) ? n : d; }
function solveLinearSystem(A, b) {
  const n = A.length, M = A.map((r, i) => [...r, b[i]]);
  for (let c = 0, r = 0; c < n && r < n; c++, r++) {
    let p = r;
    for (let i = r + 1; i < n; i++) if (Math.abs(M[i][c]) > Math.abs(M[p][c])) p = i;
    if (Math.abs(M[p][c]) < 1e-12) continue;
    if (p !== r) [M[p], M[r]] = [M[r], M[p]];
    const d = M[r][c];
    for (let k = c; k <= n; k++) M[r][k] /= d;
    for (let i = 0; i < n; i++) {
      if (i === r) continue;
      const f = M[i][c];
      for (let k = c; k <= n; k++) M[i][k] -= f * M[r][k];
    }
  }
  return M.map(row => row[n] || 0);
}

function computeEqualizedStakes({
  oddMulti, stakeMulti, isFreebet, freebetValue, ratioExtract, protections
}) {
  const n = protections.length;
  if (!n) return { stakes: [], alvoProtecao: 0, lucroMultipla: 0 };

  const O   = protections.map(p => safeNum(p.odd, 0));
  const C   = protections.map(p => Math.max(0, Math.min(100, safeNum(p.commission, 0))) / 100);
  const LAY = protections.map(p => !!p.isLay);

  // Por 1 de stake:
  // Proteção i VENCE: BACK => +(Oi*(1-Ci) - 1), LAY => +(1 - Ci)
  // Proteção j PERDE: BACK => -1,                 LAY => -(Oj - 1)
  const winFactor  = O.map((oi, i) => LAY[i] ? (1 - C[i]) : (oi * (1 - C[i]) - 1));
  const loseFactor = O.map((oi, i) => LAY[i] ? (-(oi - 1)) : (-1));

  const F = isFreebet ? safeNum(freebetValue, 0) : 0;
  const r = Math.max(0, Math.min(1, safeNum(ratioExtract, 0)));

  const retornoMulti = isFreebet ? F * (oddMulti - 1) : stakeMulti * oddMulti;
  const custoMulti   = isFreebet ? 0                     : stakeMulti;

  let alvoProtecao = isFreebet ? (r * F) : 0;

  const makeSystem = (alvo) => {
    const A = Array.from({ length: n }, () => Array(n).fill(0));
    const b = Array(n).fill(alvo + custoMulti);
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++)
      A[i][j] = (i === j) ? winFactor[i] : loseFactor[j];
    return { A, b };
  };

  let { A, b } = makeSystem(alvoProtecao);
  let L = solveLinearSystem(A, b);

  const anyNeg = () => L.some(x => x < 0);
  if (anyNeg()) {
    let lo = 0, hi = Math.max(alvoProtecao, 1e-6);
    for (let it = 0; it < 42; it++) {
      const mid = (lo + hi) / 2;
      ({ A, b } = makeSystem(mid));
      L = solveLinearSystem(A, b);
      if (anyNeg()) hi = mid; else lo = mid;
    }
    alvoProtecao = lo;
  }

  // Lucro_M(s) = retornoMulti + s*Σ(Lj*loseFactor_j) - custoMulti
  const sumLose = L.reduce((acc, Lj, j) => acc + Lj * loseFactor[j], 0);
  const lucroMultiMax = retornoMulti + 0 * sumLose - custoMulti; // s=0
  const lucroMultiMin = retornoMulti + 1 * sumLose - custoMulti; // s=1

  let alvoMulti = isFreebet ? Math.min(alvoProtecao, lucroMultiMax) : alvoProtecao;
  alvoMulti = Math.max(Math.min(alvoMulti, lucroMultiMax), lucroMultiMin);

  let s = (sumLose !== 0) ? (alvoMulti - retornoMulti + custoMulti) / sumLose : 0;
  s = Math.max(0, Math.min(1, s));

  const stakes = L.map(x => Math.max(0, s * x));
  const lucroMultipla = retornoMulti + stakes.reduce((a, Lj, j) => a + Lj * loseFactor[j], 0) - custoMulti;

  return { stakes, alvoProtecao, lucroMultipla };
}

/* ---- Estado e integração ---- */
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

function getFreebetRatioFromUI() {
  const ids = ['fb-range', 'freebetPercent', 'filter-freebet', 'select-freebet'];
  for (const id of ids) {
    const el = document.getElementById(id);
    if (!el) continue;
    const v = parseDecimal(el.value);
    if (Number.isFinite(v)) return v > 1 ? v / 100 : Math.max(0, Math.min(1, v));
  }
  const elText = document.getElementById('freebet-percent');
  if (elText) {
    const m = (elText.textContent || '').match(/(\d+)/);
    if (m) return Math.max(0, Math.min(1, Number(m[1]) / 100));
  }
  return Math.max(0, Math.min(1, (window.calculatorData.freebetPercent || 70) / 100));
}
function getRoundingFromUI() {
  const el = document.getElementById('select-round');
  const v = parseDecimal(el ? el.value : 0.01);
  return Number.isFinite(v) && v > 0 ? v : (window.calculatorData.rounding || 0.01);
}
function verifyProtectionData() {
  const cd = window.calculatorData;
  if (!Array.isArray(cd.protecoes)) cd.protecoes = [];
  while (cd.protecoes.length < cd.numProtecoes) cd.protecoes.push({ odd: 2.0, isLay: true, commission: 0, calculatedStake: 0, responsibility: 0 });
  if (cd.protecoes.length > cd.numProtecoes) cd.protecoes = cd.protecoes.slice(0, cd.numProtecoes);
}

function calculateOptimalStakes() {
  const cd = window.calculatorData;
  const r = getFreebetRatioFromUI();

  if (cd.multipla.odd <= 1 || cd.multipla.stake <= 0) {
    for (let i = 0; i < cd.numProtecoes; i++) {
      const p = cd.protecoes[i]; if (!p) continue;
      p.calculatedStake = 0; p.responsibility = 0;
    }
    return;
  }

  const protections = [];
  for (let i = 0; i < cd.numProtecoes; i++) {
    const p = cd.protecoes[i] || {};
    protections.push({
      odd: safeNum(p.odd, 0),
      commission: safeNum(p.commission, 0),
      isLay: !!p.isLay
    });
  }

  const isFreebet = !!cd.multipla.freebet;
  const freebetValue = isFreebet ? cd.multipla.stake : 0;

  const { stakes, alvoProtecao, lucroMultipla } = computeEqualizedStakes({
    oddMulti: cd.multipla.odd,
    stakeMulti: cd.multipla.stake,
    isFreebet,
    freebetValue,
    ratioExtract: r,
    protections
  });

  const step = getRoundingFromUI();
  for (let i = 0; i < cd.numProtecoes; i++) {
    const p = cd.protecoes[i]; if (!p) continue;
    const raw = safeNum(stakes[i], 0);
    let stake = roundToStep(Math.max(0, raw), step);
    if (stake > 0 && stake < 0.5) stake = 0.5;
    p.calculatedStake = stake;
    p.responsibility  = p.isLay ? stake * Math.max(0, p.odd - 1) : 0;
  }

  const metaProtecaoEl = document.getElementById('meta-protecao');
  if (metaProtecaoEl) metaProtecaoEl.textContent = formatCurrency(alvoProtecao);
  const metaMultiEl = document.getElementById('meta-multipla');
  if (metaMultiEl) metaMultiEl.textContent = formatCurrency(lucroMultipla);
}

function reflectStakesInUI() {
  const cd = window.calculatorData;
  for (let i = 0; i < cd.numProtecoes; i++) {
    const idx = i + 2;
    const p = cd.protecoes[i];

    const stakeEl = document.getElementById(`calc-stake${idx}`);
    if (stakeEl) {
      stakeEl.textContent = formatCurrency(safeNum(p?.calculatedStake, 0));
    }

    const respEl = document.getElementById(`responsibility${idx}`);
    if (respEl) {
      const txt = formatCurrency(safeNum(p?.responsibility, 0));
      if ('value' in respEl) respEl.value = txt;   // se for <input>
      else respEl.textContent = txt;               // se for <div>/<span>
    }
  }
}
function updateTotalsDisplay() {
  const cd = window.calculatorData;
  let total = 0;
  for (let i = 0; i < cd.numProtecoes; i++) {
    const p = cd.protecoes[i]; if (!p) continue;
    total += p.isLay ? safeNum(p.responsibility, 0) : safeNum(p.calculatedStake, 0);
  }
  const totEl = document.getElementById('totalInvestment');
  if (totEl) totEl.textContent = formatCurrency(total);
}

function updateCalculation() {
  verifyProtectionData();

  const odd1El = document.getElementById('odd1');
  const stake1El = document.getElementById('stake1');
  const freebet1El = document.getElementById('freebet1');

  { const v = parseDecimal(odd1El.value);   if (Number.isFinite(v)) window.calculatorData.multipla.odd   = v; }
  { const v = parseDecimal(stake1El.value); if (Number.isFinite(v)) window.calculatorData.multipla.stake = v; }
  if (freebet1El) window.calculatorData.multipla.freebet = !!freebet1El.checked;

  for (let i = 0; i < window.calculatorData.numProtecoes; i++) {
    const idx = i + 2, p = window.calculatorData.protecoes[i];
    const oddEl  = document.getElementById(`odd${idx}`);
    const commEl = document.getElementById(`commission${idx}`);
    const commCK = document.getElementById(`comm${idx}`);
    if (oddEl) { const v = parseDecimal(oddEl.value); if (Number.isFinite(v)) p.odd = v; }
    if (commCK && commCK.checked && commEl) {
     const v = parseDecimal(commEl.value);
     p.commission = Number.isFinite(v) ? v : (p.commission || 0);
 } else { p.commission = 0; }
    p.isLay = !!p.isLay;
  }

  calculateOptimalStakes();
  reflectStakesInUI();
  updateTotalsDisplay();

  if (window.calculatorData.debugMode) {
    const dbg = document.getElementById('debug-content');
    if (dbg) {
      const cd = window.calculatorData;
      dbg.innerHTML = cd.protecoes.slice(0, cd.numProtecoes).map((p, i) =>
        `P${i+1} ${p.isLay ? 'LAY' : 'BACK'} ODD=${p.odd} COMM=${p.commission}% | stake=${formatCurrency(safeNum(p.calculatedStake,0))} resp=${formatCurrency(safeNum(p.responsibility,0))}`
      ).join('<br>');
    }
  }
}
window.updateCalculation = updateCalculation;
