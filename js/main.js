/**
 * Inicialização e configuração da calculadora
 */

/**
 * Inicializa a calculadora quando o DOM estiver carregado
 */
document.addEventListener('DOMContentLoaded', () => {
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
});

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
