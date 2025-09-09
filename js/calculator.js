/**
 * Lógica principal de cálculo da estratégia de proteção múltipla
 */

// calculatorData agora é definido em main.js para evitar problemas de ordem de carregamento

/**
 * Calcula os stakes ótimos para equilibrar os lucros
 */
function calculateOptimalStakes() {
  const { multipla, protecoes, freebetPercent } = calculatorData;
  const r = freebetPercent / 100;
  
  if (multipla.odd <= 1 || multipla.stake <= 0) return;

  // Lucro líquido que queremos igualar em todos os cenários
  const multiplaNetProfit = multipla.freebet 
    ? (multipla.stake * (multipla.odd - 1)) * r 
    : (multipla.stake * multipla.odd - multipla.stake);

  for (let i = 0; i < calculatorData.numProtecoes; i++) {
    const p = protecoes[i];
    if (!p || p.odd <= 1) { 
      p.calculatedStake = 0; 
      continue; 
    }

    const commissionFactor = 1 - (p.commission / 100);
    let stake = 0;

    if (p.isLay) {
      if (p.freebet) {
        // LAY FREEBET: ganho = stake * commissionFactor * r
        const gainPerStake = commissionFactor * r;
        stake = gainPerStake > 0 ? multiplaNetProfit / gainPerStake : 0;
      } else {
        // LAY NORMAL: 
        // Quando ganha: perde responsibility = stake * (odd - 1)
        // Quando perde: ganha stake * commissionFactor
        // Para igualar multiplaNetProfit quando a proteção ganha:
        // multiplaNetProfit = stake * commissionFactor - stake * (odd - 1)
        const gainPerStake = commissionFactor; // LAY win = stake * (1 - comissão)
        stake = gainPerStake > 0 ? multiplaNetProfit / gainPerStake : 0;
      }
    } else {
      // BACK
      if (p.freebet) {
        // BACK FREEBET: ganho = stake * (odd * commissionFactor - 1) * r
        const gainPerStake = (p.odd * commissionFactor - 1) * r;
        stake = gainPerStake > 0 ? multiplaNetProfit / gainPerStake : 0;
      } else {
        // BACK NORMAL: ganho = stake * (odd * commissionFactor - 1)
        const gainPerStake = p.odd * commissionFactor - 1;
        stake = gainPerStake > 0 ? multiplaNetProfit / gainPerStake : 0;
      }
    }

    stake = Math.max(0, stake);
    p.calculatedStake = roundToStep(stake, calculatorData.rounding);
    
    // Stake mínimo para evitar valores muito pequenos
    if (p.calculatedStake > 0 && p.calculatedStake < 0.50) {
      p.calculatedStake = 0.50;
    }
  }
}

/**
 * Calcula o lucro para um cenário específico
 * @param {number} scenarioIndex - 0 para múltipla, 1+ para proteções
 * @returns {number} - Lucro calculado para o cenário
 */
function calculateScenarioProfit(scenarioIndex) {
  const { multipla, protecoes, freebetPercent } = calculatorData;
  const r = freebetPercent / 100;

  if (scenarioIndex === 0) {
    // Múltipla vence
    let profit = 0;
    
    // Ganho da múltipla
    if (multipla.freebet) {
      profit += multipla.stake * (multipla.odd - 1) * r;
    } else {
      profit += multipla.stake * multipla.odd - multipla.stake;
    }

    // Perdas das proteções
    for (let i = 0; i < calculatorData.numProtecoes; i++) {
      const p = protecoes[i]; 
      if (!p || !p.calculatedStake || p.odd <= 1) continue;
      
      if (p.freebet) {
        // Freebet não perde nada quando não acerta
        continue;
      }
      
      if (p.isLay) {
        // LAY perde a responsabilidade quando o evento acontece
        profit -= p.calculatedStake * (p.odd - 1);
      } else {
        // BACK perde o stake quando não acerta
        profit -= p.calculatedStake;
      }
    }
    return profit;
    
  } else {
    // Uma das proteções vence
    const k = scenarioIndex - 1;
    if (k >= calculatorData.numProtecoes) return 0;
    const p = protecoes[k]; 
    if (!p || !p.calculatedStake || p.odd <= 1) return 0;

    let profit = 0;

    // Perda da múltipla (se não for freebet)
    if (!multipla.freebet) {
      profit -= multipla.stake;
    }

    // Ganho da proteção que venceu
    const commissionFactor = 1 - (p.commission / 100);
    if (p.freebet) {
      if (p.isLay) {
        profit += p.calculatedStake * commissionFactor * r;
      } else {
        profit += p.calculatedStake * (p.odd * commissionFactor - 1) * r;
      }
    } else {
      if (p.isLay) {
        profit += p.calculatedStake * commissionFactor;
      } else {
        profit += p.calculatedStake * p.odd * commissionFactor - p.calculatedStake;
      }
    }

    // Perdas das outras proteções
    for (let i = 0; i < calculatorData.numProtecoes; i++) {
      if (i === k) continue; // Pula a que venceu
      const x = protecoes[i]; 
      if (!x || !x.calculatedStake || x.odd <= 1) continue;
      
      if (x.freebet) {
        // Freebet não perde nada
        continue;
      }
      
      if (x.isLay) {
        // LAY ganha quando o evento não acontece
        profit -= x.calculatedStake * (x.odd - 1);
      } else {
        // BACK perde quando não acerta
        profit -= x.calculatedStake;
      }
    }
    
    return profit;
  }
}

/**
 * Atualiza todos os cálculos da calculadora
 */
function updateCalculation() {
  // Verifica consistência dos dados antes do cálculo
  verifyProtectionData();
  
  // Atualiza dados da múltipla
  const odd1El = document.getElementById('odd1');
  const stake1El = document.getElementById('stake1');
  const freebet1El = document.getElementById('freebet1');
  
  if (odd1El) calculatorData.multipla.odd = parseDecimal(odd1El.value) || 0;
  if (stake1El) calculatorData.multipla.stake = parseDecimal(stake1El.value) || 0;
  if (freebet1El) calculatorData.multipla.freebet = freebet1El.checked;

  // Atualiza dados das proteções
  for (let i = 0; i < calculatorData.numProtecoes; i++) {
    const idx = i + 2;
    const p = calculatorData.protecoes[i];
    
    // Busca elementos apenas se existirem
    const oddEl = document.getElementById(`odd${idx}`);
    const commEl = document.getElementById(`commission${idx}`);
    const commCheck = document.getElementById(`comm${idx}`);
    const fbCheck = document.getElementById(`freebet${idx}`);
    
    if (oddEl) p.odd = parseDecimal(oddEl.value) || 0;
    
    if (commCheck && commCheck.checked && commEl) {
      p.commission = parseDecimal(commEl.value) || 0;
    } else {
      p.commission = 0;
    }
    
    if (fbCheck) p.freebet = fbCheck.checked;
    
    // Debug: log mudanças críticas
    if (calculatorData.debugMode) {
      console.log(`Proteção ${i+1}: isLay=${p.isLay}, odd=${p.odd}, commission=${p.commission}, freebet=${p.freebet}`);
    }
  }

  calculateOptimalStakes();
  updateUI();
  updateDebugInfo();
  hideStatus();
}

/**
 * Atualiza informações de debug (se ativo)
 */
function updateDebugInfo() {
  if (!calculatorData.debugMode) return;
  
  const debugEl = document.getElementById('debug-content');
  const { multipla, protecoes, freebetPercent } = calculatorData;
  const r = freebetPercent / 100;
  
  let info = `<strong>Estado da Calculadora:</strong><br>`;
  info += `Múltipla: odd=${multipla.odd}, stake=${multipla.stake}, freebet=${multipla.freebet}<br>`;
  info += `FreebetPercent: ${freebetPercent}% (r=${r.toFixed(2)})<br><br>`;
  
  const multiplaNetProfit = multipla.freebet 
    ? (multipla.stake * (multipla.odd - 1)) * r 
    : (multipla.stake * multipla.odd - multipla.stake);
  info += `<strong>Lucro alvo da múltipla: ${multiplaNetProfit.toFixed(2)}</strong><br><br>`;
  
  info += `<strong>Proteções:</strong><br>`;
  for (let i = 0; i < calculatorData.numProtecoes; i++) {
    const p = protecoes[i];
    if (!p) continue;
    
    const responsibility = p.isLay ? (p.calculatedStake || 0) * (p.odd - 1) : 0;
    info += `${i+1}. ${p.isLay ? 'LAY' : 'BACK'} | odd=${p.odd} | comm=${p.commission}% | freebet=${p.freebet}<br>`;
    info += `   → stake calculado: ${(p.calculatedStake||0).toFixed(2)}`;
    if (p.isLay) info += ` | responsabilidade: ${responsibility.toFixed(2)}`;
    info += `<br>`;
  }
  
  info += `<br><strong>Verificação de lucros por cenário:</strong><br>`;
  const profits = [];
  for (let i = 0; i <= calculatorData.numProtecoes; i++) {
    const profit = calculateScenarioProfit(i);
    profits.push(profit);
    const scenarioName = i === 0 ? 'Múltipla vence' : `Proteção ${i} vence`;
    info += `${scenarioName}: ${profit.toFixed(2)}<br>`;
  }
  
  const minProfit = Math.min(...profits);
  const maxProfit = Math.max(...profits);
  const diff = maxProfit - minProfit;
  info += `<br><strong>Amplitude:</strong> ${diff.toFixed(2)} (min: ${minProfit.toFixed(2)}, max: ${maxProfit.toFixed(2)})<br>`;
  
  if (diff < 1) {
    info += `<span style="color: var(--success);">✅ Lucros bem equilibrados!</span>`;
  } else if (diff < 5) {
    info += `<span style="color: var(--warning);">⚠️ Pequeno desequilíbrio</span>`;
  } else {
    info += `<span style="color: var(--danger);">❌ Grande desequilíbrio</span>`;
  }
  
  debugEl.innerHTML = info;
}