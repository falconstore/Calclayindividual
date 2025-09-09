/**
 * Inicialização e configuração da calculadora
 */

// Estado global da calculadora - deve ser definido antes de qualquer uso
window.calculatorData = {
  numProtecoes: 3,
  rounding: 0.01,
  multipla: { odd: 4.25, stake: 100, freebet: false },
  protecoes: [
    { odd: 1.95, isLay: true,  commission: 0 },
    { odd: 2.80, isLay: false, commission: 2.5 },
    { odd: 2.10, isLay: false, commission: 0 },
    { odd: 3.20, isLay: false, commission: 0 },
    { odd: 1.70, isLay: true,  commission: 0 },
    { odd: 2.40, isLay: false, commission: 0 }
  ],
  freebetPercent: 70, // 0-100%
  debugMode: false
};

// Alias para compatibilidade
let calculatorData = window.calculatorData;

/**
 * Inicializa a calculadora quando o DOM estiver carregado
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('Inicializando calculadora...');
  console.log('calculatorData definido:', typeof calculatorData !== 'undefined');
  
  // Força limpeza das proteções (remove freebet se existir)
  cleanupProtectionData();
  
  // Carrega configuração compartilhada (se houver)
  loadSharedConfig();
  
  // Se não carregou configuração, renderiza proteções padrão
  if (!window.location.search.includes('config=')) {
    renderProtecoes();
  }

  // Event listeners para múltipla
  setupMultiplaListeners();
  
  // Event listeners para controles de freebet
  setupFreebetControls();
  
  // Event listeners para outros controles
  setupOtherControls();
  
  // Event listener para debug (duplo clique no título)
  setupDebugToggle();

  // Cálculo inicial
  updateCalculation();
  
  console.log('Calculadora inicializada com sucesso!');
});

/**
 * Remove propriedades freebet das proteções (limpeza)
 */
function cleanupProtectionData() {
  for (let i = 0; i < calculatorData.protecoes.length; i++) {
    const p = calculatorData.protecoes[i];
    if (p && p.hasOwnProperty('freebet')) {
      delete p.freebet;
    }
  }
  
  if (calculatorData.debugMode) {
    console.log('Limpeza das proteções concluída - freebets removidos');
  }
}

/**
 * Configura event listeners para a múltipla
 */
function setupMultiplaListeners() {
  const odd1El = document.getElementById('odd1');
  const stake1El = document.getElementById('stake1');
  const freebet1El = document.getElementById('freebet1');
  
  if (odd1El) odd1El.addEventListener('input', scheduleRecalc);
  if (stake1El) stake1El.addEventListener('input', scheduleRecalc);
  if (freebet1El) freebet1El.addEventListener('change', scheduleRecalc);
}

/**
 * Configura controles de percentual de freebet
 */
function setupFreebetControls() {
  const fbRange = document.getElementById('fb-range');
  const fbInc = document.getElementById('fb-inc');
  const fbDec = document.getElementById('fb-dec');
  const fbLabel = document.getElementById('freebet-percent');
  
  /**
   * Sincroniza valor do freebet em todos os controles
   * @param {number} value - Novo valor (0-100)
   */
  const syncFreebet = (value) => {
    const val = Math.min(100, Math.max(0, parseInt(value || 0, 10)));
    calculatorData.freebetPercent = val;
    
    if (fbRange) fbRange.value = val;
    if (fbLabel) fbLabel.textContent = val + '%';
  };
  
  // Inicializa com valor padrão
  syncFreebet(calculatorData.freebetPercent);
  
  // Event listeners
  if (fbRange) {
    fbRange.addEventListener('input', (e) => {
      syncFreebet(e.target.value);
      scheduleRecalc();
    });
  }
  
  if (fbInc) {
    fbInc.addEventListener('click', () => {
      syncFreebet((calculatorData.freebetPercent || 0) + 1);
      scheduleRecalc();
    });
  }
  
  if (fbDec) {
    fbDec.addEventListener('click', () => {
      syncFreebet((calculatorData.freebetPercent || 0) - 1);
      scheduleRecalc();
    });
  }
}

/**
 * Configura outros controles da interface
 */
function setupOtherControls() {
  // Botão de recálculo forçado
  const forceRecalcBtn = document.getElementById('force-recalc');
  if (forceRecalcBtn) {
    forceRecalcBtn.addEventListener('click', () => {
      if (calculatorData.debugMode) {
        console.log('\n=== RECÁLCULO FORÇADO ===');
        console.log('Estado atual das proteções:', JSON.stringify(calculatorData.protecoes.slice(0, calculatorData.numProtecoes), null, 2));
      }
      scheduleRecalc(50); // Recálculo mais rápido
    });
  }
  
  // Selects de configuração
  const selectProtecoes = document.getElementById('select-protecoes');
  const selectRound = document.getElementById('select-round');
  
  if (selectProtecoes) {
    selectProtecoes.addEventListener('change', (e) => {
      updateEntradas(e.target.value);
    });
  }
  
  if (selectRound) {
    selectRound.addEventListener('change', (e) => {
      updateRounding(e.target.value);
    });
  }
}

/**
 * Configura toggle de debug (duplo clique no título)
 */
function setupDebugToggle() {
  const titleEl = document.querySelector('h1');
  const debugEl = document.getElementById('debug-info');
  
  if (titleEl && debugEl) {
    titleEl.addEventListener('dblclick', () => {
      calculatorData.debugMode = !calculatorData.debugMode;
      debugEl.style.display = calculatorData.debugMode ? 'block' : 'none';
      
      if (calculatorData.debugMode) {
        updateDebugInfo();
        showStatus('🔍 Modo debug ativado');
      } else {
        hideStatus();
      }
    });
  }
}