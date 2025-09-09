/**
 * Gerenciamento da interface do usuário
 */

// Timer para debounce dos recálculos
let _recalcTimer = null;

/**
 * Agenda um recálculo com debounce
 * @param {number} delay - Delay em millisegundos (padrão: 200ms)
 */
function scheduleRecalc(delay = 200) {
  showStatus('Recalculando...');
  if (_recalcTimer) clearTimeout(_recalcTimer);
  _recalcTimer = setTimeout(() => {
    updateCalculation();
  }, delay);
}

/**
 * Gera o HTML de um card de proteção
 * @param {number} i - Índice da proteção (0-based)
 * @returns {string} - HTML do card
 */
function protecaoCardTemplate(i) {
  const idx = i + 2;
  const p = calculatorData.protecoes[i];
  const isLayActive = p.isLay ? 'active' : '';
  const isBackActive = !p.isLay ? 'active' : '';
  const commChecked = p.commission > 0 ? 'checked' : '';
  const freeChecked = p.freebet ? 'checked' : '';
  const commDisplay = p.commission > 0 ? 'block' : 'none';
  const respDisplay = p.isLay ? 'block' : 'none';
  
  return `
    <div class="house-card protecao" data-protecao="${i}">
      <div class="badge badge-protecao">🛡️ Proteção ${i+1}</div>
      <h3 class="house-title">Proteção ${i+1}</h3>

      <div class="grid-2" style="margin-bottom: .75rem;">
        <div class="form-group">
          <label class="form-label">Odd</label>
          <input class="form-input" id="odd${idx}" value="${formatDecimal(p.odd)}" placeholder="ex: 2.00" />
        </div>
        <div class="form-group">
          <label class="form-label">Stake Calculado</label>
          <div class="form-input" id="calc-stake${idx}" style="display:flex;align-items:center;background:rgba(17,24,39,.4);font-family:ui-monospace,monospace;color:var(--success);">R$ 0,00</div>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Tipo de Aposta</label>
        <div style="display:flex;gap:.5rem;">
          <button class="btn-toggle ${isBackActive}" data-type="BACK" data-index="${idx}">BACK</button>
          <button class="btn-toggle ${isLayActive}" data-type="LAY" data-index="${idx}">LAY</button>
        </div>
      </div>

      <div style="display:flex;gap:.75rem;margin:.75rem 0;flex-wrap:wrap;">
        <label class="checkbox-group">
          <input type="checkbox" id="comm${idx}" ${commChecked} />
          <span>Comissão</span>
        </label>
        <label class="checkbox-group">
          <input type="checkbox" id="freebet${idx}" ${freeChecked} />
          <span>Freebet</span>
        </label>
      </div>

      <div class="form-group" id="comm-field${idx}" style="display:${commDisplay};">
        <label class="form-label">Comissão (%)</label>
        <input class="form-input" id="commission${idx}" value="${formatDecimal(p.commission)}" placeholder="ex: 5.0" />
      </div>

      <div class="form-group" id="resp-field${idx}" style="display:${respDisplay};">
        <label class="form-label">Responsabilidade</label>
        <div style="position:relative;">
          <span style="position:absolute;left:.75rem;top:50%;transform:translateY(-50%);color:var(--text-muted);font-weight:600;font-size:.75rem;">R$</span>
          <input class="form-input" id="responsibility${idx}" style="padding-left:2.25rem;font-family:ui-monospace,monospace;" placeholder="calculado automaticamente" readonly />
        </div>
      </div>
    </div>`;
}

/**
 * Renderiza os cards de proteção
 */
function renderProtecoes() {
  const list = document.getElementById('protecoes-list');
  const n = calculatorData.numProtecoes;

  // Garante que temos proteções suficientes no array
  while (calculatorData.protecoes.length < n) {
    calculatorData.protecoes.push({
      odd: 2.00,
      isLay: false,
      commission: 0,
      freebet: false
    });
  }

  // Gera HTML dos cards
  let html = '';
  for (let i = 0; i < n; i++) {
    html += protecaoCardTemplate(i);
  }
  list.innerHTML = html;

  // Adiciona event listeners
  attachProtecaoEventListeners(n);
  scheduleRecalc();
}

/**
 * Adiciona event listeners aos cards de proteção
 * @param {number} n - Número de proteções
 */
function attachProtecaoEventListeners(n) {
  for (let i = 0; i < n; i++) {
    const idx = i + 2;

    // Input da odd
    const oddEl = document.getElementById(`odd${idx}`);
    if (oddEl) {
      oddEl.addEventListener('input', (e) => {
        e.target.value = e.target.value;
        scheduleRecalc();
      });
    }

    // Input da comissão
    const commEl = document.getElementById(`commission${idx}`);
    if (commEl) {
      commEl.addEventListener('input', () => scheduleRecalc());
    }

    // Checkbox de comissão
    const commCheck = document.getElementById(`comm${idx}`);
    if (commCheck) {
      commCheck.addEventListener('change', (e) => {
        const commField = document.getElementById(`comm-field${idx}`);
        if (commField) {
          commField.style.display = e.target.checked ? 'block' : 'none';
        }
        if (!e.target.checked) {
          calculatorData.protecoes[i].commission = 0;
        }
        scheduleRecalc();
      });
    }

    // Checkbox de freebet
    const fbCheck = document.getElementById(`freebet${idx}`);
    if (fbCheck) {
      fbCheck.addEventListener('change', scheduleRecalc);
    }
  }

  // Botões BACK/LAY
  const toggleBtns = document.querySelectorAll('#protecoes-list .btn-toggle');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', (ev) => {
      const b = ev.currentTarget;
      const type = b.getAttribute('data-type');
      const idx = parseInt(b.getAttribute('data-index'), 10);
      const group = b.parentElement.querySelectorAll('.btn-toggle');
      
      // Remove active de todos e adiciona no clicado
      group.forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      
      // Atualiza dados
      const arrIndex = idx - 2;
      calculatorData.protecoes[arrIndex].isLay = (type === 'LAY');
      
      // Mostra/esconde campo de responsabilidade
      const respField = document.getElementById(`resp-field${idx}`);
      if (respField) {
        respField.style.display = (type === 'LAY') ? 'block' : 'none';
      }
      
      scheduleRecalc();
    });
  });
}

/**
 * Atualiza a interface com os dados calculados
 */
function updateUI() {
  const { protecoes } = calculatorData;

  // Atualiza stakes calculados e responsabilidade
  for (let i = 0; i < calculatorData.numProtecoes; i++) {
    const idx = i + 2;
    const p = protecoes[i];
    
    // Stake calculado
    const stakeEl = document.getElementById(`calc-stake${idx}`);
    if (stakeEl) {
      stakeEl.textContent = formatCurrency(p.calculatedStake || 0);
    }
    
    // Responsabilidade (para LAY)
    const respEl = document.getElementById(`responsibility${idx}`);
    if (respEl) {
      const responsibility = (p.isLay && p.odd > 1) ? 
        (p.calculatedStake || 0) * (p.odd - 1) : 0;
      respEl.value = formatDecimal(responsibility);
    }
  }

  // Atualiza totais
  updateTotals();
  
  // Atualiza tabela de resultados
  updateResultsTable();
}

/**
 * Atualiza os totais exibidos no cabeçalho
 */
function updateTotals() {
  const { protecoes } = calculatorData;
  
  // Total investido em proteções
  const totalProtection = protecoes
    .slice(0, calculatorData.numProtecoes)
    .reduce((sum, p) => sum + (p.calculatedStake || 0), 0);
  
  // Calcula lucros de todos os cenários
  const profits = [];
  for (let i = 0; i <= calculatorData.numProtecoes; i++) {
    profits.push(calculateScenarioProfit(i));
  }
  const minProfit = Math.min(...profits);

  // Atualiza elementos
  document.getElementById('totalInvestment').textContent = formatCurrency(totalProtection);
  
  const minProfitEl = document.getElementById('minProfit');
  minProfitEl.textContent = `${minProfit >= 0 ? '+' : ''}${formatCurrency(Math.abs(minProfit))}`;
  minProfitEl.className = minProfit >= 0 ? 'stat-value profit-positive' : 'stat-value profit-negative';
}

/**
 * Atualiza a tabela de resultados por cenário
 */
function updateResultsTable() {
  const tbody = document.getElementById('results-body');
  const { multipla, protecoes } = calculatorData;
  let html = '';

  // Cenário: Múltipla vence
  const multiplaProfit = calculateScenarioProfit(0);
  const multiplaFreeText = multipla.freebet ? '<br><span class="text-small">(Freebet)</span>' : '';
  html += `
    <tr>
      <td><strong>Múltipla Vence</strong></td>
      <td>${formatDecimal(multipla.odd)}</td>
      <td><span style="color: var(--warning);">BACK</span></td>
      <td><strong>${formatCurrency(multipla.stake)}</strong>${multiplaFreeText}</td>
      <td class="${multiplaProfit >= 0 ? 'profit-positive' : 'profit-negative'}">
        <strong>${multiplaProfit >= 0 ? '+' : ''}${formatCurrency(Math.abs(multiplaProfit))}</strong>
      </td>
    </tr>`;

  // Cenários: Proteções vencem
  for (let i = 0; i < calculatorData.numProtecoes; i++) {
    const p = protecoes[i];
    const profit = calculateScenarioProfit(i + 1);
    const typeColor = p.isLay ? 'var(--primary)' : 'var(--success)';
    const typeText = p.isLay ? 'LAY' : 'BACK';
    const freebetText = p.freebet ? '<br><span class="text-small">(Freebet)</span>' : '';
    const commissionText = p.commission > 0 ? 
      `<br><span class="text-small">(${formatDecimal(p.commission)}%)</span>` : '';
    
    html += `
      <tr>
        <td><strong>Proteção ${i + 1} Vence</strong></td>
        <td>${formatDecimal(p.odd)}</td>
        <td><span style="color:${typeColor};">${typeText}</span>${commissionText}</td>
        <td><strong>${formatCurrency(p.calculatedStake || 0)}</strong>${freebetText}</td>
        <td class="${profit >= 0 ? 'profit-positive' : 'profit-negative'}">
          <strong>${profit >= 0 ? '+' : ''}${formatCurrency(Math.abs(profit))}</strong>
        </td>
      </tr>`;
  }
  
  tbody.innerHTML = html;
}

/**
 * Atualiza número de proteções
 * @param {string} val - Novo número de proteções
 */
function updateEntradas(val) {
  calculatorData.numProtecoes = parseInt(val) || 2;
  renderProtecoes();
}

/**
 * Atualiza precisão do arredondamento
 * @param {string} val - Nova precisão
 */
function updateRounding(val) {
  calculatorData.rounding = parseFloat(val) || 0.01;
  scheduleRecalc();
}

/**
 * Compartilha configuração atual via URL
 */
function shareCalculation() {
  const config = {
    multipla: calculatorData.multipla,
    protecoes: calculatorData.protecoes.slice(0, calculatorData.numProtecoes),
    numProtecoes: calculatorData.numProtecoes,
    rounding: calculatorData.rounding,
    freebetPercent: calculatorData.freebetPercent
  };
  
  try {
    const jsonStr = JSON.stringify(config);
    const base64 = btoa(encodeURIComponent(jsonStr));
    const url = `${window.location.origin}${window.location.pathname}?config=${base64}`;
    
    navigator.clipboard.writeText(url).then(() => {
      showStatus('🔗 Link copiado!');
    }).catch(() => {
      prompt('Copie este link:', url);
    });
  } catch (error) {
    showStatus('❌ Erro ao gerar link');
  }
}

/**
 * Carrega configuração compartilhada da URL
 */
function loadSharedConfig() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const configParam = urlParams.get('config');
    
    if (configParam) {
      const jsonStr = decodeURIComponent(atob(configParam));
      const config = JSON.parse(jsonStr);
      
      // Merge configuração carregada
      calculatorData = { ...calculatorData, ...config };
      
      // Atualiza elementos da interface
      document.getElementById('select-protecoes').value = calculatorData.numProtecoes;
      document.getElementById('select-round').value = calculatorData.rounding;
      document.getElementById('odd1').value = formatDecimal(calculatorData.multipla.odd);
      document.getElementById('stake1').value = formatDecimal(calculatorData.multipla.stake);
      document.getElementById('freebet1').checked = calculatorData.multipla.freebet;
      
      renderProtecoes();
      showStatus('✅ Configuração carregada!');
      
      // Remove parâmetro da URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  } catch (error) {
    console.warn('Erro ao carregar configuração:', error);
  }
}
