/**
 * Utilitários para formatação e parsing de números
 */

/**
 * Converte string para decimal, lidando com formatos BR (vírgula como decimal)
 * @param {string|number} value - Valor a ser convertido
 * @returns {number} - Número convertido ou NaN se inválido
 */
function parseDecimal(value) {
  if (value === null || value === undefined) return NaN;
  const str = String(value).trim();
  if (str === '') return NaN;
  
  const hasComma = str.includes(',');
  const hasDot = str.includes('.');
  let processed = str;
  
  // Se tem vírgula mas não ponto, vírgula é decimal
  if (hasComma && !hasDot) {
    processed = str.replace(',', '.');
  } 
  // Se tem ambos, ponto é milhar e vírgula é decimal
  else if (hasComma && hasDot) {
    processed = str.replace(/\./g, '').replace(',', '.');
  }
  
  const parsed = parseFloat(processed);
  return Number.isFinite(parsed) ? parsed : NaN;
}

/**
 * Formata número como moeda brasileira
 * @param {number} value - Valor a ser formatado
 * @returns {string} - Valor formatado como R$ X,XX
 */
function formatCurrency(value) {
  return (Number.isFinite(value) ? value : 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 2
  });
}

/**
 * Formata número com casas decimais
 * @param {number} value - Valor a ser formatado
 * @param {number} decimals - Número de casas decimais (padrão: 2)
 * @returns {string} - Número formatado
 */
function formatDecimal(value, decimals = 2) {
  return Number.isFinite(value)
    ? value.toLocaleString('pt-BR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      })
    : '';
}

/**
 * Arredonda valor para o passo especificado
 * @param {number} value - Valor a ser arredondado
 * @param {number} step - Passo do arredondamento (padrão: 0.01)
 * @returns {number} - Valor arredondado
 */
function roundToStep(value, step = 0.01) {
  if (!Number.isFinite(value) || !Number.isFinite(step) || step <= 0) {
    return value;
  }
  return Math.round(value / step) * step;
}

/**
 * Mostra mensagem de status temporária
 * @param {string} message - Mensagem a ser exibida
 */
function showStatus(message) {
  const el = document.getElementById('calculation-status');
  if (!el) return;
  el.textContent = message;
  el.style.display = 'block';
}

/**
 * Esconde mensagem de status
 */
function hideStatus() {
  const el = document.getElementById('calculation-status');
  if (!el) return;
  el.style.display = 'none';
}

/**
 * Alterna entre tema claro e escuro
 */
function toggleTheme() {
  const body = document.body;
  const btn = document.querySelector('.theme-toggle');
  
  if (body.getAttribute('data-theme') === 'light') {
    body.removeAttribute('data-theme');
    btn.textContent = '🌙 Tema Escuro';
  } else {
    body.setAttribute('data-theme', 'light');
    btn.textContent = '☀️ Tema Claro';
  }
}
