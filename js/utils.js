/**
 * Utils: parse/format/round + status + tema
 */
function parseDecimal(value) {
  if (value === null || value === undefined) return NaN;
  const str = String(value).trim();
  if (str === '') return NaN;
  const hasComma = str.includes(',');
  const hasDot = str.includes('.');
  let norm = str;
  if (hasComma && hasDot) norm = str.replace(/\./g, '').replace(',', '.');
  else if (hasComma) norm = str.replace(',', '.');
  const n = Number(norm);
  return Number.isFinite(n) ? n : NaN;
}
function roundToStep(value, step = 0.01) {
  if (!Number.isFinite(value) || !Number.isFinite(step) || step <= 0) return value;
  return Math.round(value / step) * step;
}
function formatCurrency(v) {
  const n = Number(v) || 0;
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
function formatDecimal(v, dec = 2) {
  const n = Number(v);
  if (!Number.isFinite(n)) return '';
  return n.toLocaleString('pt-BR', { minimumFractionDigits: dec, maximumFractionDigits: dec });
}
function showStatus(text = 'Recalculando...') {
  const el = document.getElementById('calculation-status');
  if (!el) return;
  el.textContent = text;
  el.style.display = 'block';
  clearTimeout(showStatus._t);
  showStatus._t = setTimeout(() => { el.style.display = 'none'; }, 800);
}
function hideStatus() {
  const el = document.getElementById('calculation-status');
  if (el) el.style.display = 'none';
}
function toggleTheme() {
  const body = document.body;
  const btn = document.querySelector('.theme-toggle');
  if (body.getAttribute('data-theme') === 'light') {
    body.removeAttribute('data-theme');
    if (btn) btn.textContent = '🌙 Tema Escuro';
  } else {
    body.setAttribute('data-theme', 'light');
    if (btn) btn.textContent = '☀️ Tema Claro';
  }
}
