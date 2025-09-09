/* CSS Custom Properties */
:root {
  --primary: #3b82f6;
  --secondary: #22c55e;
  --accent: #8b5cf6;
  --warning: #f59e0b;
  --danger: #dc2626;
  --success: #22c55e;
  --bg-primary: #111827;
  --bg-secondary: #1f2937;
  --bg-card: #374151;
  --text-primary: #f9fafb;
  --text-secondary: #d1d5db;
  --text-muted: #9ca3af;
  --border: #4b5563;
  --border-light: #6b7280;
}

/* Light Theme */
[data-theme="light"] {
  --bg-primary: #f8fafc;
  --bg-secondary: #f1f5f9;
  --bg-card: #ffffff;
  --text-primary: #1e293b;
  --text-secondary: #475569;
  --text-muted: #64748b;
  --border: #e2e8f0;
  --border-light: #cbd5e1;
}

/* Reset and Base */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 50%, var(--bg-card) 100%);
  color: var(--text-primary);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  min-height: 100vh;
  line-height: 1.5;
  transition: background .3s ease, color .3s ease;
  padding: 1rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Header */
.calc-header {
  text-align: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: rgba(31, 41, 59, .4);
  border-radius: 12px;
  border: 1px solid var(--border);
}

[data-theme="light"] .calc-header {
  background: rgba(255, 255, 255, .6);
}

.calc-header h1 {
  font-size: 1.75rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: .5rem;
  text-align: center;
}

.calc-header p {
  color: var(--text-secondary);
  font-size: .875rem;
  text-align: center;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
}

.stat-card {
  background: rgba(17, 24, 39, .6);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  transition: all .3s ease;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

[data-theme="light"] .stat-card {
  background: rgba(255, 255, 255, .8);
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 800;
  font-family: ui-monospace, monospace;
  margin-bottom: .25rem;
  color: var(--primary);
}

.stat-label {
  font-size: .625rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: .05em;
  font-weight: 600;
}

/* Cards */
.card {
  background: rgba(31, 41, 59, .8);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  transition: all .3s ease;
}

[data-theme="light"] .card {
  background: rgba(255, 255, 255, .9);
}

.section-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: .5rem;
}

.section-title::before {
  content: '';
  width: 3px;
  height: 20px;
  background: linear-gradient(180deg, var(--primary), var(--secondary));
  border-radius: 2px;
}

/* House Grid */
.house-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.house-card {
  background: linear-gradient(135deg, rgba(31, 41, 59, .8), rgba(55, 65, 81, .6));
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 1rem;
  transition: all .3s ease;
  position: relative;
}

.house-card.multipla {
  border-left: 3px solid var(--warning);
  background: linear-gradient(135deg, rgba(245, 158, 11, .1), rgba(31, 41, 59, .8));
}

.house-card.protecao {
  border-left: 3px solid var(--success);
}

[data-theme="light"] .house-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, .9), rgba(248, 250, 252, .8));
}

[data-theme="light"] .house-card.multipla {
  background: linear-gradient(135deg, rgba(245, 158, 11, .1), rgba(255, 255, 255, .9));
}

.house-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--primary), var(--secondary));
  border-radius: 12px 12px 0 0;
}

.house-title {
  font-size: .875rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: .75rem;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: .05em;
}

/* Forms */
.form-group {
  margin-bottom: .75rem;
}

.form-label {
  display: block;
  font-weight: 600;
  font-size: .75rem;
  color: var(--text-secondary);
  margin-bottom: .375rem;
  text-transform: uppercase;
  letter-spacing: .05em;
}

.form-input,
.form-select {
  width: 100%;
  padding: .75rem;
  border: 2px solid var(--border);
  border-radius: 8px;
  background: rgba(17, 24, 39, .8);
  color: var(--text-primary);
  font-size: .875rem;
  transition: all .2s ease;
}

[data-theme="light"] .form-input,
[data-theme="light"] .form-select {
  background: rgba(255, 255, 255, .9);
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, .1);
}

/* Grid and Layout */
.grid-2 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

/* Buttons */
.btn {
  padding: .75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all .2s ease;
  text-transform: uppercase;
  font-size: .75rem;
  letter-spacing: .05em;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: #fff;
}

.btn-secondary {
  background: rgba(55, 65, 81, .8);
  color: var(--text-primary);
  border: 2px solid var(--border);
}

.btn-toggle {
  background: rgba(55, 65, 81, .8);
  color: var(--text-secondary);
  border: 2px solid var(--border);
  min-width: 60px;
  padding: .75rem 1rem;
  transition: all .3s ease;
}

.btn-toggle.active {
  background: linear-gradient(135deg, var(--primary), var(--secondary));
  color: #fff;
  border-color: var(--primary);
}

.btn-share-card {
  margin-top: .75rem;
  width: 100%;
  padding: .5rem;
  font-size: .75rem;
  border: none;
  border-radius: 6px;
  background: linear-gradient(135deg, #8b5cf6, #3b82f6);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: all .2s ease;
}

/* Checkbox Groups */
.checkbox-group {
  display: flex;
  align-items: center;
  gap: .5rem;
  margin: .5rem 0;
  font-size: .75rem;
  color: var(--text-secondary);
}

.checkbox-group input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: var(--primary);
  cursor: pointer;
}

/* Results Table */
.results-table {
  width: 100%;
  border-collapse: collapse;
  background: rgba(17, 24, 39, .8);
  border-radius: 12px;
  overflow: hidden;
  margin-top: 1rem;
}

[data-theme="light"] .results-table {
  background: rgba(255, 255, 255, .9);
}

.results-table th {
  background: rgba(17, 24, 39, .9);
  color: var(--text-primary);
  font-weight: 700;
  text-transform: uppercase;
  padding: .75rem .5rem;
  font-size: .75rem;
  letter-spacing: .05em;
  border-bottom: 2px solid var(--primary);
}

[data-theme="light"] .results-table th {
  background: rgba(248, 250, 252, .9);
}

.results-table td {
  padding: .75rem .5rem;
  border-bottom: 1px solid var(--border);
  color: var(--text-primary);
  font-size: .875rem;
}

.results-table th:first-child,
.results-table td:first-child {
  text-align: left;
}

.results-table th:not(:first-child),
.results-table td:not(:first-child) {
  text-align: right;
}

.profit-positive {
  color: #22c55e !important;
  font-weight: 700 !important;
}

.profit-negative {
  color: #dc2626 !important;
  font-weight: 700 !important;
}

.profit-highlight {
  color: #3b82f6 !important;
  font-weight: 800 !important;
}

.text-small {
  font-size: .75rem;
  color: var(--text-muted);
}

/* Theme Toggle */
.theme-toggle {
  position: fixed;
  top: 1rem;
  right: 1rem;
  background: rgba(55, 65, 81, .8);
  border: 2px solid var(--border);
  border-radius: 25px;
  color: var(--text-primary);
  padding: .5rem 1rem;
  font-size: .75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all .3s ease;
  z-index: 1000;
}

/* Badges */
.badge {
  display: inline-block;
  padding: .25rem .75rem;
  border-radius: 12px;
  font-size: .625rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: .5rem;
}

.badge-multipla {
  background: linear-gradient(135deg, var(--warning), #fb923c);
  color: #fff;
}

.badge-protecao {
  background: linear-gradient(135deg, var(--success), var(--accent));
  color: #fff;
}

/* Debug Info */
.debug-info {
  background: rgba(139, 92, 246, .1);
  border: 1px solid var(--accent);
  border-radius: 8px;
  padding: .75rem;
  margin: .5rem 0;
  font-size: .75rem;
  font-family: ui-monospace, monospace;
}

/* Media Queries */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: .75rem;
  }
  
  .house-grid {
    grid-template-columns: 1fr;
  }
  
  .grid-2 {
    grid-template-columns: 1fr;
  }
}js/utils.js
