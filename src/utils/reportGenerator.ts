import {
  GLI_RATE,
  IS_REDUCED_RATE,
  IS_REDUCED_RATE_THRESHOLD,
  IS_STANDARD_RATE,
  LMNP_DEPRECIATION_RATE,
  PROPERTY_MANAGEMENT_RATE,
  SCI_BUILDING_DEPRECIATION_YEARS,
  SCI_LAND_RATIO,
  SCI_MIN_CONTRIBUTION_RATIO,
} from '@/utils/constants';
import type { ReportData, ReportMeta, ReportRegime, YearlyAmortization } from '@/utils/reportData';

const fmtEur = (value: number, decimals = 0): string => {
  const rounded = decimals === 0 ? Math.round(value) : +value.toFixed(decimals);
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(rounded) + ' €';
};

const fmtPct = (value: number, decimals = 2): string => {
  return `${value.toFixed(decimals)} %`;
};

const fmtNum = (value: number, decimals = 0): string => {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(+value.toFixed(decimals));
};

const esc = (s: string | undefined | null): string => {
  if (s === undefined || s === null) return '';
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

const cls = (positive: boolean): string => (positive ? 'good' : 'bad');

// ------------- SECTIONS -------------

const buildHeader = (meta: ReportMeta, regime: ReportRegime): string => {
  const title =
    regime === 'nom-propre'
      ? "Rapport d'investissement locatif — Nom propre (régime réel)"
      : "Rapport d'investissement locatif — SCI à l'IS";
  const metaRows: { label: string; value: string }[] = [];
  if (meta.projectName) metaRows.push({ label: 'Projet', value: meta.projectName });
  if (meta.address) metaRows.push({ label: 'Adresse du bien', value: meta.address });
  if (meta.borrowerName) metaRows.push({ label: 'Emprunteur', value: meta.borrowerName });
  if (meta.coBorrowerName) metaRows.push({ label: 'Co-emprunteur', value: meta.coBorrowerName });
  metaRows.push({ label: 'Date du rapport', value: meta.date });

  return `
  <header class="cover">
    <h1>${esc(title)}</h1>
    ${meta.projectName ? `<p class="subtitle">${esc(meta.projectName)}</p>` : ''}
    <table class="meta">
      <tbody>
        ${metaRows
          .map((r) => `<tr><th>${esc(r.label)}</th><td>${esc(r.value)}</td></tr>`)
          .join('')}
      </tbody>
    </table>
    ${meta.notes ? `<div class="notes"><strong>Notes :</strong><br/>${esc(meta.notes).replace(/\n/g, '<br/>')}</div>` : ''}
  </header>`;
};

const buildProjectInputs = (data: ReportData): string => {
  const { inputs, shared } = data;
  const rows = (title: string, items: { label: string; value: string; hint?: string }[]) => `
    <h3>${esc(title)}</h3>
    <table class="kv">
      <tbody>
        ${items
          .map(
            (it) =>
              `<tr><th>${esc(it.label)}</th><td>${esc(it.value)}${
                it.hint ? `<span class="hint"> ${esc(it.hint)}</span>` : ''
              }</td></tr>`
          )
          .join('')}
      </tbody>
    </table>`;

  return `
  <section class="page-section">
    <h2>1. Données du projet</h2>
    ${rows('Bien immobilier', [
      { label: 'Prix du bien', value: fmtEur(inputs.price) },
      { label: 'Budget travaux', value: fmtEur(inputs.worksBudget) },
      { label: 'Frais de notaire', value: fmtEur(shared.notaryFees), hint: '(8 % du prix)' },
      { label: 'Coût total acquisition', value: fmtEur(shared.totalAcquisitionCost) },
    ])}
    ${rows('Financement', [
      { label: 'Apport total', value: fmtEur(shared.totalContribution) },
      { label: 'Montant du prêt', value: fmtEur(shared.loanAmount) },
      { label: 'Durée du prêt', value: `${inputs.loanDuration} ans` },
      { label: 'Taux du prêt', value: fmtPct(inputs.loanRate, 2) },
      { label: "Taux d'assurance", value: fmtPct(inputs.insuranceRate, 2) },
    ])}
    ${rows('Profil emprunteur(s)', [
      { label: 'Salaire principal', value: `${fmtEur(inputs.salary)} / mois` },
      ...(inputs.hasCoBorrower
        ? [
            { label: 'Salaire co-emprunteur', value: `${fmtEur(inputs.coSalary)} / mois` },
            { label: 'Apport co-emprunteur', value: fmtEur(inputs.coContribution) },
            { label: '% prêt co-emprunteur', value: `${inputs.coLoanPercent} %` },
          ]
        : []),
      { label: 'Revenu total mensuel', value: fmtEur(shared.totalSalary) },
      { label: 'Crédits actuels', value: `${fmtEur(inputs.currentCredits)} / mois` },
    ])}
    ${rows('Locatif', [
      { label: 'Loyer hors charges', value: `${fmtEur(inputs.rentHC)} / mois` },
      { label: 'Charges récupérables', value: `${fmtEur(inputs.recoverableCharges)} / mois` },
      { label: 'Charges de copropriété', value: `${fmtEur(inputs.coproCharges)} / mois` },
      { label: 'Taxe foncière (TOM incluse)', value: `${fmtEur(inputs.propertyTax)} / an` },
      { label: 'TOM (récupérable auprès du locataire)', value: `${fmtEur(inputs.tom)} / an` },
      { label: 'TMI (tranche marginale d\'imposition)', value: fmtPct(inputs.tmi, 0) },
    ])}
    ${rows('Options', [
      { label: 'LMNP (amortissement)', value: inputs.isLMNP ? 'Oui' : 'Non' },
      { label: 'Garantie loyers impayés (GLI)', value: inputs.hasGLI ? 'Oui' : 'Non' },
      { label: 'Gestion locative (agence)', value: inputs.hasPropertyManagement ? 'Oui' : 'Non' },
    ])}
  </section>`;
};

const buildSynthesisNomPropre = (data: ReportData): string => {
  const { nomPropre, shared } = data;
  const verdictText = nomPropre.doable ? 'PROJET RÉALISABLE' : 'ENDETTEMENT TROP ÉLEVÉ';
  const verdictClass = nomPropre.doable ? (nomPropre.indebtedness <= 0.3 ? 'verdict-green' : 'verdict-yellow') : 'verdict-red';
  const cashflowPos = nomPropre.monthlyCashflow >= 0;
  const cashflowBeforeTaxPos = nomPropre.monthlyCashflowBeforeTax >= 0;
  return `
  <section class="page-section">
    <h2>2. Synthèse</h2>
    <div class="verdict ${verdictClass}">
      <span class="verdict-label">Verdict bancaire</span>
      <span class="verdict-value">${esc(verdictText)}</span>
      <span class="verdict-detail">Endettement : ${fmtPct(nomPropre.indebtedness * 100, 2)} / max 35 %</span>
    </div>
    <table class="summary">
      <tbody>
        <tr><th>Mensualité crédit (assurance incluse)</th><td>${fmtEur(shared.monthlyPayment)}</td></tr>
        <tr><th>Endettement</th><td>${fmtPct(nomPropre.indebtedness * 100, 2)}</td></tr>
        <tr><th>Rendement brut</th><td>${fmtPct(nomPropre.grossYield, 2)}</td></tr>
        <tr><th>Rendement net</th><td>${fmtPct(nomPropre.netYield, 2)}</td></tr>
        <tr><th>Cashflow mensuel avant impôts</th><td class="${cls(cashflowBeforeTaxPos)}">${cashflowBeforeTaxPos ? '+' : ''}${fmtEur(nomPropre.monthlyCashflowBeforeTax)}</td></tr>
        <tr><th>Cashflow mensuel après impôts</th><td class="${cls(cashflowPos)}">${cashflowPos ? '+' : ''}${fmtEur(nomPropre.monthlyCashflow)}</td></tr>
        <tr><th>Cashflow annuel</th><td class="${cls(nomPropre.annualCashflow >= 0)}">${nomPropre.annualCashflow >= 0 ? '+' : ''}${fmtEur(nomPropre.annualCashflow)}</td></tr>
        <tr><th>Effort d'épargne mensuel</th><td>${fmtEur(nomPropre.savingsEffort)}</td></tr>
        <tr><th>Impôt foncier annuel estimé</th><td>${fmtEur(nomPropre.annualTax)}</td></tr>
      </tbody>
    </table>
  </section>`;
};

const buildSynthesisSciIs = (data: ReportData): string => {
  const { sciIs, shared } = data;
  const colorMap: Record<string, string> = {
    green: 'verdict-green',
    lime: 'verdict-lime',
    yellow: 'verdict-yellow',
    orange: 'verdict-orange',
    red: 'verdict-red',
  };
  const cashflowPos = sciIs.monthlyCashflow >= 0;
  const cashflowBeforeTaxPos = sciIs.monthlyCashflowBeforeTax >= 0;
  return `
  <section class="page-section">
    <h2>2. Synthèse</h2>
    <div class="verdict ${colorMap[sciIs.feasibility.color]}">
      <span class="verdict-label">Faisabilité bancaire</span>
      <span class="verdict-value">${esc(sciIs.feasibility.label)} (${sciIs.feasibility.score}/4)</span>
      <ul class="criteria">
        <li>${sciIs.feasibility.criteria.indebtedness ? '✓' : '✗'} Endettement ≤ 35 % (${fmtPct(sciIs.indebtedness * 100, 2)})</li>
        <li>${sciIs.feasibility.criteria.contribution ? '✓' : '✗'} Apport ≥ 10 % du coût total (${fmtPct(sciIs.contributionRatio, 2)})</li>
        <li>${sciIs.feasibility.criteria.cashflow ? '✓' : '✗'} Cashflow positif après IS</li>
        <li>${sciIs.feasibility.criteria.netYield ? '✓' : '✗'} Rendement net ≥ 5 % (${fmtPct(sciIs.netYield, 2)})</li>
      </ul>
    </div>
    <table class="summary">
      <tbody>
        <tr><th>Mensualité crédit (assurance incluse)</th><td>${fmtEur(shared.monthlyPayment)}</td></tr>
        <tr><th>Endettement</th><td>${fmtPct(sciIs.indebtedness * 100, 2)}</td></tr>
        <tr><th>Rendement brut</th><td>${fmtPct(sciIs.grossYield, 2)}</td></tr>
        <tr><th>Rendement net</th><td>${fmtPct(sciIs.netYield, 2)}</td></tr>
        <tr><th>Cashflow mensuel avant IS</th><td class="${cls(cashflowBeforeTaxPos)}">${cashflowBeforeTaxPos ? '+' : ''}${fmtEur(sciIs.monthlyCashflowBeforeTax)}</td></tr>
        <tr><th>Cashflow mensuel après IS</th><td class="${cls(cashflowPos)}">${cashflowPos ? '+' : ''}${fmtEur(sciIs.monthlyCashflow)}</td></tr>
        <tr><th>Cashflow annuel</th><td class="${cls(sciIs.annualCashflow >= 0)}">${sciIs.annualCashflow >= 0 ? '+' : ''}${fmtEur(sciIs.annualCashflow)}</td></tr>
        <tr><th>IS annuel estimé</th><td>${fmtEur(sciIs.corporateTax)}</td></tr>
        <tr><th>Économie vs nom propre (régime réel)</th><td class="${cls(sciIs.taxSavingsVsRealRegime >= 0)}">${sciIs.taxSavingsVsRealRegime >= 0 ? '+' : ''}${fmtEur(sciIs.taxSavingsVsRealRegime)} / an</td></tr>
      </tbody>
    </table>
  </section>`;
};

// ------------- CHARTS (inline SVG) -------------

const W = 720;
const H = 240;
const PADDING = { top: 20, right: 16, bottom: 36, left: 60 };
const INNER_W = W - PADDING.left - PADDING.right;
const INNER_H = H - PADDING.top - PADDING.bottom;

const xForIndex = (i: number, total: number): number => {
  if (total <= 1) return PADDING.left;
  return PADDING.left + (i * INNER_W) / (total - 1);
};
const yForValue = (v: number, max: number, min = 0): number => {
  if (max === min) return PADDING.top + INNER_H / 2;
  return PADDING.top + INNER_H - ((v - min) / (max - min)) * INNER_H;
};

const buildAmortizationChart = (yearly: YearlyAmortization[]): string => {
  if (yearly.length === 0) return '';
  const maxValue = Math.max(...yearly.map((y) => Math.max(y.interest, y.capital)));
  const interestPath = yearly
    .map((y, i) => `${i === 0 ? 'M' : 'L'} ${xForIndex(i, yearly.length).toFixed(1)} ${yForValue(y.interest, maxValue).toFixed(1)}`)
    .join(' ');
  const capitalPath = yearly
    .map((y, i) => `${i === 0 ? 'M' : 'L'} ${xForIndex(i, yearly.length).toFixed(1)} ${yForValue(y.capital, maxValue).toFixed(1)}`)
    .join(' ');
  const xTicks = [0, Math.floor(yearly.length / 4), Math.floor(yearly.length / 2), Math.floor((3 * yearly.length) / 4), yearly.length - 1]
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .map((i) => `<g><line x1="${xForIndex(i, yearly.length).toFixed(1)}" x2="${xForIndex(i, yearly.length).toFixed(1)}" y1="${PADDING.top + INNER_H}" y2="${PADDING.top + INNER_H + 4}" stroke="#777"/><text x="${xForIndex(i, yearly.length).toFixed(1)}" y="${H - 18}" text-anchor="middle" font-size="10" fill="#555">An ${yearly[i].year}</text></g>`)
    .join('');
  const yTicks = [0, 0.5, 1].map((t) => {
    const v = maxValue * t;
    const y = yForValue(v, maxValue).toFixed(1);
    return `<g><line x1="${PADDING.left}" x2="${W - PADDING.right}" y1="${y}" y2="${y}" stroke="#eee"/><text x="${PADDING.left - 6}" y="${y}" text-anchor="end" dominant-baseline="middle" font-size="10" fill="#555">${fmtNum(v)} €</text></g>`;
  }).join('');
  return `
  <figure class="chart">
    <figcaption>Évolution annuelle du remboursement — Capital vs Intérêts</figcaption>
    <svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img">
      ${yTicks}
      <path d="${interestPath}" fill="none" stroke="#c2410c" stroke-width="2"/>
      <path d="${capitalPath}" fill="none" stroke="#1d4ed8" stroke-width="2"/>
      ${xTicks}
      <g class="legend">
        <rect x="${W - 220}" y="${PADDING.top}" width="200" height="32" fill="white" stroke="#ddd"/>
        <line x1="${W - 210}" x2="${W - 190}" y1="${PADDING.top + 10}" y2="${PADDING.top + 10}" stroke="#1d4ed8" stroke-width="2"/>
        <text x="${W - 184}" y="${PADDING.top + 14}" font-size="11" fill="#222">Capital remboursé</text>
        <line x1="${W - 210}" x2="${W - 190}" y1="${PADDING.top + 24}" y2="${PADDING.top + 24}" stroke="#c2410c" stroke-width="2"/>
        <text x="${W - 184}" y="${PADDING.top + 28}" font-size="11" fill="#222">Intérêts payés</text>
      </g>
    </svg>
  </figure>`;
};

const buildLeftToPayChart = (yearly: YearlyAmortization[], loanAmount: number): string => {
  if (yearly.length === 0) return '';
  const series = [{ year: 0, leftToPay: loanAmount }, ...yearly];
  const maxValue = loanAmount;
  const path = series
    .map((y, i) => `${i === 0 ? 'M' : 'L'} ${xForIndex(i, series.length).toFixed(1)} ${yForValue(y.leftToPay, maxValue).toFixed(1)}`)
    .join(' ');
  const area = `M ${PADDING.left} ${PADDING.top + INNER_H} L ${series.map((y, i) => `${xForIndex(i, series.length).toFixed(1)} ${yForValue(y.leftToPay, maxValue).toFixed(1)}`).join(' L ')} L ${W - PADDING.right} ${PADDING.top + INNER_H} Z`;
  const xTicks = [0, Math.floor(series.length / 4), Math.floor(series.length / 2), Math.floor((3 * series.length) / 4), series.length - 1]
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .map((i) => `<g><line x1="${xForIndex(i, series.length).toFixed(1)}" x2="${xForIndex(i, series.length).toFixed(1)}" y1="${PADDING.top + INNER_H}" y2="${PADDING.top + INNER_H + 4}" stroke="#777"/><text x="${xForIndex(i, series.length).toFixed(1)}" y="${H - 18}" text-anchor="middle" font-size="10" fill="#555">An ${series[i].year}</text></g>`)
    .join('');
  const yTicks = [0, 0.5, 1].map((t) => {
    const v = maxValue * t;
    const y = yForValue(v, maxValue).toFixed(1);
    return `<g><line x1="${PADDING.left}" x2="${W - PADDING.right}" y1="${y}" y2="${y}" stroke="#eee"/><text x="${PADDING.left - 6}" y="${y}" text-anchor="end" dominant-baseline="middle" font-size="10" fill="#555">${fmtNum(v)} €</text></g>`;
  }).join('');
  return `
  <figure class="chart">
    <figcaption>Capital restant dû année par année</figcaption>
    <svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img">
      ${yTicks}
      <path d="${area}" fill="rgba(29, 78, 216, 0.12)" stroke="none"/>
      <path d="${path}" fill="none" stroke="#1d4ed8" stroke-width="2"/>
      ${xTicks}
    </svg>
  </figure>`;
};

const buildCashflowChart = (yearly: YearlyAmortization[], monthlyCashflow: number, label: string): string => {
  if (yearly.length === 0) return '';
  // Cashflow is approximately constant under our simple model — show as horizontal bars year by year.
  const annualCashflow = +(monthlyCashflow * 12).toFixed(2);
  const maxAbs = Math.max(Math.abs(annualCashflow), 1) * 1.2;
  const zeroY = yForValue(0, maxAbs, -maxAbs);
  const barWidth = INNER_W / yearly.length * 0.7;
  const bars = yearly
    .map((_y, i) => {
      const cx = xForIndex(i, yearly.length);
      const top = yForValue(Math.max(0, annualCashflow), maxAbs, -maxAbs);
      const bot = yForValue(Math.min(0, annualCashflow), maxAbs, -maxAbs);
      const x = cx - barWidth / 2;
      const yTop = annualCashflow >= 0 ? top : zeroY;
      const height = Math.abs(bot - top);
      const fill = annualCashflow >= 0 ? 'rgba(34, 197, 94, 0.75)' : 'rgba(239, 68, 68, 0.75)';
      return `<rect x="${x.toFixed(1)}" y="${yTop.toFixed(1)}" width="${barWidth.toFixed(1)}" height="${height.toFixed(1)}" fill="${fill}"/>`;
    })
    .join('');
  const xTicks = [0, Math.floor(yearly.length / 4), Math.floor(yearly.length / 2), Math.floor((3 * yearly.length) / 4), yearly.length - 1]
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .map((i) => `<text x="${xForIndex(i, yearly.length).toFixed(1)}" y="${H - 18}" text-anchor="middle" font-size="10" fill="#555">An ${yearly[i].year}</text>`)
    .join('');
  return `
  <figure class="chart">
    <figcaption>Cashflow annuel estimé sur la durée du prêt — ${esc(label)}</figcaption>
    <svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img">
      <line x1="${PADDING.left}" x2="${W - PADDING.right}" y1="${zeroY}" y2="${zeroY}" stroke="#999" stroke-width="1"/>
      <text x="${PADDING.left - 6}" y="${zeroY}" text-anchor="end" dominant-baseline="middle" font-size="10" fill="#555">0 €</text>
      <text x="${PADDING.left - 6}" y="${yForValue(annualCashflow, maxAbs, -maxAbs).toFixed(1)}" text-anchor="end" dominant-baseline="middle" font-size="10" fill="#555">${fmtNum(annualCashflow)} €</text>
      ${bars}
      ${xTicks}
    </svg>
  </figure>
  <p class="chart-note">Hypothèse simplifiée : loyer, charges et impôts considérés constants ; en réalité les intérêts diminuent et l'impôt augmente sur la durée.</p>`;
};

const buildBreakdownChart = (parts: { label: string; value: number; color: string }[], title: string): string => {
  const positives = parts.filter((p) => p.value > 0);
  if (positives.length === 0) return '';
  const total = positives.reduce((a, b) => a + b.value, 0);
  const barWidth = INNER_W;
  const barHeight = 36;
  const barY = PADDING.top + 30;
  let xCursor = PADDING.left;
  const segments = positives
    .map((p) => {
      const w = (p.value / total) * barWidth;
      const seg = `<g><rect x="${xCursor.toFixed(1)}" y="${barY}" width="${w.toFixed(1)}" height="${barHeight}" fill="${p.color}"/>${
        w > 50
          ? `<text x="${(xCursor + w / 2).toFixed(1)}" y="${barY + barHeight / 2 + 4}" text-anchor="middle" font-size="11" fill="white">${fmtNum(p.value)} €</text>`
          : ''
      }</g>`;
      xCursor += w;
      return seg;
    })
    .join('');
  const legendY = barY + barHeight + 22;
  const legendCols = 3;
  const legend = positives
    .map((p, i) => {
      const col = i % legendCols;
      const row = Math.floor(i / legendCols);
      const x = PADDING.left + (col * INNER_W) / legendCols;
      const y = legendY + row * 18;
      return `<g><rect x="${x.toFixed(1)}" y="${y - 9}" width="10" height="10" fill="${p.color}"/><text x="${(x + 14).toFixed(1)}" y="${y}" font-size="11" fill="#222" dominant-baseline="middle">${esc(p.label)} (${fmtNum(p.value)} €)</text></g>`;
    })
    .join('');
  const rows = Math.ceil(positives.length / legendCols);
  const totalH = legendY + rows * 18 + 10;
  return `
  <figure class="chart">
    <figcaption>${esc(title)}</figcaption>
    <svg viewBox="0 0 ${W} ${totalH}" xmlns="http://www.w3.org/2000/svg" role="img">
      <text x="${PADDING.left}" y="${barY - 8}" font-size="11" fill="#444">Total : ${fmtNum(total)} € / mois</text>
      ${segments}
      ${legend}
    </svg>
  </figure>`;
};

const buildChartsNomPropre = (data: ReportData): string => {
  const { shared, inputs, nomPropre } = data;
  const inflowParts = [
    { label: 'Loyer HC', value: inputs.rentHC, color: '#16a34a' },
    { label: 'Charges récup.', value: inputs.recoverableCharges, color: '#65a30d' },
  ];
  const outflowParts = [
    { label: 'Mensualité crédit', value: shared.monthlyPayment, color: '#1d4ed8' },
    { label: 'Copro', value: inputs.coproCharges, color: '#7c3aed' },
    { label: 'Taxe foncière /12', value: +(inputs.propertyTax / 12).toFixed(2), color: '#a16207' },
    { label: 'PNO /12', value: +(shared.pnoAnnual / 12).toFixed(2), color: '#0891b2' },
    { label: 'Impôt /12', value: +(nomPropre.annualTax / 12).toFixed(2), color: '#dc2626' },
    ...(inputs.hasGLI ? [{ label: 'GLI', value: shared.gliMonthly, color: '#db2777' }] : []),
    ...(inputs.hasPropertyManagement ? [{ label: 'Gestion', value: shared.managementMonthly, color: '#c2410c' }] : []),
  ];
  return `
  <section class="page-section">
    <h2>3. Visualisations</h2>
    ${buildAmortizationChart(shared.yearlyAmortization)}
    ${buildLeftToPayChart(shared.yearlyAmortization, shared.loanAmount)}
    ${buildBreakdownChart(inflowParts, 'Entrées mensuelles')}
    ${buildBreakdownChart(outflowParts, 'Sorties mensuelles')}
    ${buildCashflowChart(shared.yearlyAmortization, nomPropre.monthlyCashflow, 'Nom propre')}
  </section>`;
};

const buildChartsSciIs = (data: ReportData): string => {
  const { shared, inputs, sciIs } = data;
  const inflowParts = [
    { label: 'Loyer HC', value: inputs.rentHC, color: '#16a34a' },
    { label: 'Charges récup.', value: inputs.recoverableCharges, color: '#65a30d' },
  ];
  const outflowParts = [
    { label: 'Mensualité crédit', value: shared.monthlyPayment, color: '#1d4ed8' },
    { label: 'Copro', value: inputs.coproCharges, color: '#7c3aed' },
    { label: 'Taxe foncière /12', value: +(inputs.propertyTax / 12).toFixed(2), color: '#a16207' },
    { label: 'PNO /12', value: +(shared.pnoAnnual / 12).toFixed(2), color: '#0891b2' },
    { label: 'Compta /12', value: +(sciIs.accountingFeesAnnual / 12).toFixed(2), color: '#475569' },
    { label: 'IS /12', value: sciIs.monthlyCorporateTax, color: '#dc2626' },
    ...(inputs.hasGLI ? [{ label: 'GLI', value: shared.gliMonthly, color: '#db2777' }] : []),
    ...(inputs.hasPropertyManagement ? [{ label: 'Gestion', value: shared.managementMonthly, color: '#c2410c' }] : []),
  ];
  return `
  <section class="page-section">
    <h2>3. Visualisations</h2>
    ${buildAmortizationChart(shared.yearlyAmortization)}
    ${buildLeftToPayChart(shared.yearlyAmortization, shared.loanAmount)}
    ${buildBreakdownChart(inflowParts, 'Entrées mensuelles')}
    ${buildBreakdownChart(outflowParts, 'Sorties mensuelles')}
    ${buildCashflowChart(shared.yearlyAmortization, sciIs.monthlyCashflow, 'SCI à l\'IS')}
  </section>`;
};

// ------------- DETAILS WITH FORMULAS -------------

const formulaBlock = (label: string, formula: string, value: string, comment?: string): string => `
  <div class="formula">
    <div class="formula-label">${esc(label)}</div>
    <div class="formula-line"><code>${esc(formula)}</code> = <strong>${esc(value)}</strong></div>
    ${comment ? `<div class="formula-comment">${esc(comment)}</div>` : ''}
  </div>`;

const buildDetailsCommon = (data: ReportData): string => {
  const { inputs, shared } = data;
  return `
  <h3>Frais et financement</h3>
  ${formulaBlock(
    'Frais de notaire',
    `Prix × 8 % = ${fmtNum(inputs.price)} × 0,08`,
    fmtEur(shared.notaryFees),
    'Estimation forfaitaire des frais de notaire (acquisition dans l\'ancien).'
  )}
  ${formulaBlock(
    'Coût total acquisition',
    `Prix + Frais notaire + Travaux = ${fmtNum(inputs.price)} + ${fmtNum(shared.notaryFees)} + ${fmtNum(inputs.worksBudget)}`,
    fmtEur(shared.totalAcquisitionCost),
    'Base utilisée pour calculer les rendements et le ratio d\'apport.'
  )}
  ${formulaBlock(
    'Apport total',
    inputs.hasCoBorrower
      ? `Apport + Apport co = ${fmtNum(inputs.contribution)} + ${fmtNum(inputs.coContribution)}`
      : `${fmtNum(inputs.contribution)}`,
    fmtEur(shared.totalContribution)
  )}
  ${formulaBlock(
    'Montant du prêt',
    `Prix + Frais notaire + Travaux − Apport = ${fmtNum(inputs.price)} + ${fmtNum(shared.notaryFees)} + ${fmtNum(inputs.worksBudget)} − ${fmtNum(shared.totalContribution)}`,
    fmtEur(shared.loanAmount),
    'Capital emprunté à la banque.'
  )}
  ${formulaBlock(
    'Mensualité du crédit (hors assurance)',
    `Mensualité standard d\'un prêt à taux fixe (${fmtPct(inputs.loanRate, 2)}, ${inputs.loanDuration} ans)`,
    fmtEur(shared.monthlyLoanCost, 2)
  )}
  ${formulaBlock(
    'Mensualité d\'assurance',
    `Capital × Taux assurance / 12 = ${fmtNum(shared.loanAmount)} × ${fmtPct(inputs.insuranceRate, 2)} / 12`,
    fmtEur(shared.monthlyInsuranceCost, 2),
    'Assurance calculée sur le capital initial (formule simplifiée).'
  )}
  ${formulaBlock(
    'Mensualité totale',
    `Crédit + Assurance = ${fmtNum(shared.monthlyLoanCost)} + ${fmtNum(shared.monthlyInsuranceCost)}`,
    fmtEur(shared.monthlyPayment, 2)
  )}
  ${formulaBlock(
    'Coût total des intérêts',
    `Somme des intérêts sur ${inputs.loanDuration} ans`,
    fmtEur(shared.totalInterestCost)
  )}
  ${formulaBlock(
    'Coût total de l\'assurance',
    `${fmtNum(shared.monthlyInsuranceCost)} × ${inputs.loanDuration} × 12`,
    fmtEur(shared.totalInsuranceCost)
  )}
  ${formulaBlock(
    'Coût total du prêt',
    `Intérêts + Assurance = ${fmtNum(shared.totalInterestCost)} + ${fmtNum(shared.totalInsuranceCost)}`,
    fmtEur(shared.totalLoanCost)
  )}

  <h3>Charges et exploitation</h3>
  ${formulaBlock(
    'Copropriété annuelle non récupérable',
    `(Copro × 12) − max(0; Charges récup × 12 − TOM) = (${fmtNum(inputs.coproCharges)} × 12) − max(0; ${fmtNum(inputs.recoverableCharges)} × 12 − ${fmtNum(inputs.tom)})`,
    fmtEur(shared.nonRecoverableCoproAnnual),
    'Part des charges de copropriété restant à la charge du propriétaire.'
  )}
  ${formulaBlock(
    'Taxe foncière nette de TOM',
    `Taxe foncière − TOM = ${fmtNum(inputs.propertyTax)} − ${fmtNum(inputs.tom)}`,
    fmtEur(shared.propertyTaxNetOfTom),
    'La TOM est récupérable auprès du locataire.'
  )}
  ${formulaBlock(
    'PNO (Propriétaire Non Occupant) estimée',
    `min(250; max(80; Prix × 0,07 %)) = min(250; max(80; ${fmtNum(inputs.price)} × 0,0007))`,
    fmtEur(shared.pnoAnnual),
    'Assurance habitation obligatoire pour le bailleur.'
  )}
  ${formulaBlock(
    'Intérêts payés la 1ʳᵉ année',
    `Somme des intérêts sur les 12 premières mensualités`,
    fmtEur(shared.firstYearInterest),
    'Base utilisée pour le calcul fiscal (régime réel et IS).'
  )}
  ${
    inputs.hasGLI
      ? formulaBlock(
          'Garantie loyers impayés (GLI)',
          `Loyer HC × ${fmtPct(GLI_RATE * 100, 1)} = ${fmtNum(inputs.rentHC)} × ${GLI_RATE}`,
          `${fmtEur(shared.gliMonthly, 2)} / mois soit ${fmtEur(shared.gliAnnual)} / an`
        )
      : ''
  }
  ${
    inputs.hasPropertyManagement
      ? formulaBlock(
          'Gestion locative (agence)',
          `Loyer HC × ${fmtPct(PROPERTY_MANAGEMENT_RATE * 100, 1)} = ${fmtNum(inputs.rentHC)} × ${PROPERTY_MANAGEMENT_RATE}`,
          `${fmtEur(shared.managementMonthly, 2)} / mois soit ${fmtEur(shared.managementAnnual)} / an`
        )
      : ''
  }
  ${formulaBlock(
    'Coût d\'une vacance locative (1 mois)',
    `Loyer HC = ${fmtNum(inputs.rentHC)}`,
    fmtEur(shared.vacancyCost),
    'Hypothèse prudente : 1 mois de loyer perdu inclus dans le calcul du rendement net.'
  )}`;
};

const buildDetailsNomPropre = (data: ReportData): string => {
  const { inputs, shared, nomPropre } = data;
  return `
  <section class="page-section">
    <h2>4. Détails des calculs</h2>
    ${buildDetailsCommon(data)}

    <h3>Fiscalité — Régime réel (nom propre)</h3>
    ${
      inputs.isLMNP
        ? formulaBlock(
            'Amortissement LMNP',
            `Prix × ${fmtPct(LMNP_DEPRECIATION_RATE * 100, 1)} = ${fmtNum(inputs.price)} × ${LMNP_DEPRECIATION_RATE}`,
            fmtEur(nomPropre.lmnpAnnualDepreciation),
            'Amortissement déductible (régime LMNP au réel, location meublée).'
          )
        : ''
    }
    ${formulaBlock(
      'Charges déductibles totales',
      `Copro + TF − TOM + PNO + Intérêts an1${inputs.hasGLI ? ' + GLI' : ''}${inputs.hasPropertyManagement ? ' + Gestion' : ''}${inputs.isLMNP ? ' + Amort. LMNP' : ''}`,
      fmtEur(
        shared.nonRecoverableCoproAnnual +
          shared.propertyTaxNetOfTom +
          shared.pnoAnnual +
          shared.firstYearInterest +
          nomPropre.extraDeductiblesAnnual
      )
    )}
    ${formulaBlock(
      'Revenu foncier imposable',
      `Loyer HC × 12 − Charges déductibles = ${fmtNum(inputs.rentHC * 12)} − ${fmtNum(
        shared.nonRecoverableCoproAnnual + shared.propertyTaxNetOfTom + shared.pnoAnnual + shared.firstYearInterest + nomPropre.extraDeductiblesAnnual
      )}`,
      fmtEur(nomPropre.rawTaxableIncome),
      nomPropre.rawTaxableIncome < 0
        ? 'Déficit foncier : imputable sur le revenu global jusqu\'à 10 700 € / an (sous conditions).'
        : 'Base d\'imposition aux revenus fonciers.'
    )}
    ${formulaBlock(
      'Impôts annuels estimés',
      `max(0; Revenu imposable) × (TMI + 17,2 %) = ${fmtNum(Math.max(0, nomPropre.rawTaxableIncome))} × ${fmtPct(
        inputs.tmi + 17.2,
        1
      )}`,
      fmtEur(nomPropre.annualTax),
      'TMI (impôt sur le revenu) + 17,2 % de prélèvements sociaux.'
    )}
    ${
      inputs.isLMNP
        ? formulaBlock(
            'Économie fiscale liée au LMNP',
            `Impôt sans LMNP − Impôt avec LMNP`,
            `${fmtEur(nomPropre.lmnpAnnualSavings)} / an (${fmtEur(nomPropre.lmnpMonthlySavings, 2)} / mois)`
          )
        : ''
    }

    <h3>Rendements</h3>
    ${formulaBlock(
      'Rendement brut',
      `(Loyer HC × 12) / Coût acquisition × 100 = (${fmtNum(inputs.rentHC)} × 12) / ${fmtNum(shared.totalAcquisitionCost)} × 100`,
      fmtPct(nomPropre.grossYield, 2)
    )}
    ${formulaBlock(
      'Rendement net',
      `(Loyer HC × 12 − Copro − TF − PNO − Vacance${inputs.hasGLI || inputs.hasPropertyManagement ? ' − Extras' : ''}) / Coût acquisition × 100`,
      fmtPct(nomPropre.netYield, 2),
      'Hors fiscalité, intègre une vacance d\'1 mois et les options activées.'
    )}

    <h3>Cashflow et endettement</h3>
    ${formulaBlock(
      'Cashflow mensuel avant impôts',
      `Loyer HC + Charges récup. − Mensualité − Copro − TF/12 − PNO/12${inputs.hasGLI ? ' − GLI' : ''}${inputs.hasPropertyManagement ? ' − Gestion' : ''}`,
      `${nomPropre.monthlyCashflowBeforeTax >= 0 ? '+' : ''}${fmtEur(nomPropre.monthlyCashflowBeforeTax)}`
    )}
    ${formulaBlock(
      'Cashflow mensuel après impôts',
      `Cashflow avant impôts − Impôt/12 = ${fmtNum(nomPropre.monthlyCashflowBeforeTax)} − ${fmtNum(nomPropre.annualTax / 12)}`,
      `${nomPropre.monthlyCashflow >= 0 ? '+' : ''}${fmtEur(nomPropre.monthlyCashflow)}`
    )}
    ${formulaBlock(
      'Cashflow annuel',
      `Cashflow mensuel × 12`,
      `${nomPropre.annualCashflow >= 0 ? '+' : ''}${fmtEur(nomPropre.annualCashflow)}`
    )}
    ${formulaBlock(
      'Taux d\'endettement (mode locatif)',
      `(Mensualité + Crédits actuels) / (Salaire + 70 % × Loyer HC) = (${fmtNum(shared.monthlyPayment)} + ${fmtNum(
        inputs.currentCredits
      )}) / (${fmtNum(shared.totalSalary)} + 0,7 × ${fmtNum(inputs.rentHC)})`,
      fmtPct(nomPropre.indebtedness * 100, 2),
      '70 % du loyer pris en compte (abattement classique appliqué par les banques pour les revenus locatifs).'
    )}
  </section>`;
};

const buildDetailsSciIs = (data: ReportData): string => {
  const { inputs, shared, sciIs } = data;
  return `
  <section class="page-section">
    <h2>4. Détails des calculs</h2>
    ${buildDetailsCommon(data)}

    <h3>Amortissements (SCI à l'IS)</h3>
    ${formulaBlock(
      'Amortissement bâti',
      `Prix × (1 − Ratio terrain) / Durée bâti = ${fmtNum(inputs.price)} × (1 − ${SCI_LAND_RATIO}) / ${SCI_BUILDING_DEPRECIATION_YEARS}`,
      fmtEur(sciIs.depreciation.building),
      `Hypothèse standard : ${(SCI_LAND_RATIO * 100).toFixed(0)} % de terrain (non amortissable), ${SCI_BUILDING_DEPRECIATION_YEARS} ans pour le bâti.`
    )}
    ${formulaBlock(
      'Amortissement des frais de notaire',
      `Frais notaire / Durée prêt = ${fmtNum(shared.notaryFees)} / ${inputs.loanDuration}`,
      fmtEur(sciIs.depreciation.notary),
      'Les frais de notaire sont amortis sur la durée du prêt.'
    )}
    ${formulaBlock(
      'Amortissement total annuel',
      `Bâti + Notaire = ${fmtNum(sciIs.depreciation.building)} + ${fmtNum(sciIs.depreciation.notary)}`,
      fmtEur(sciIs.depreciation.total)
    )}

    <h3>Fiscalité — Impôt sur les Sociétés</h3>
    ${formulaBlock(
      'Charges déductibles annuelles',
      `Copro + TF − TOM + PNO + Intérêts an1 + Compta${inputs.hasGLI ? ' + GLI' : ''}${inputs.hasPropertyManagement ? ' + Gestion' : ''} + Amortissement`,
      fmtEur(
        shared.nonRecoverableCoproAnnual +
          shared.propertyTaxNetOfTom +
          shared.pnoAnnual +
          shared.firstYearInterest +
          sciIs.accountingFeesAnnual +
          shared.operatingDeductiblesAnnual +
          sciIs.depreciation.total
      ),
      `Inclut les frais de comptabilité (${fmtEur(sciIs.accountingFeesAnnual)} / an) et les amortissements, propres à la SCI IS.`
    )}
    ${formulaBlock(
      'Bénéfice imposable',
      `Loyer HC × 12 − Charges déductibles = ${fmtNum(inputs.rentHC * 12)} − ${fmtNum(
        shared.nonRecoverableCoproAnnual +
          shared.propertyTaxNetOfTom +
          shared.pnoAnnual +
          shared.firstYearInterest +
          sciIs.accountingFeesAnnual +
          shared.operatingDeductiblesAnnual +
          sciIs.depreciation.total
      )}`,
      fmtEur(sciIs.rawTaxableProfit),
      sciIs.rawTaxableProfit <= 0
        ? 'Déficit reportable sur les bénéfices futurs (sans limite de temps en SCI IS).'
        : 'Base imposable à l\'IS.'
    )}
    ${formulaBlock(
      'Impôt sur les sociétés',
      `Bénéfice × ${fmtPct(IS_REDUCED_RATE * 100, 0)} jusqu\'à ${fmtNum(IS_REDUCED_RATE_THRESHOLD)} €, puis × ${fmtPct(
        IS_STANDARD_RATE * 100,
        0
      )}`,
      fmtEur(sciIs.corporateTax),
      'Taux réduit applicable si la SCI respecte les conditions (CA < 10 M€, détention par personnes physiques ≥ 75 %).'
    )}
    ${formulaBlock(
      'Comparaison nom propre (régime réel)',
      `Impôt équivalent en nom propre : ${fmtEur(sciIs.annualTaxRealRegime)}`,
      `Économie SCI IS vs nom propre : ${sciIs.taxSavingsVsRealRegime >= 0 ? '+' : ''}${fmtEur(sciIs.taxSavingsVsRealRegime)} / an`,
      'Différence d\'imposition à la première année, hors fiscalité sur la sortie / dividendes.'
    )}

    <h3>Rendements</h3>
    ${formulaBlock(
      'Rendement brut',
      `(Loyer HC × 12) / Coût acquisition × 100`,
      fmtPct(sciIs.grossYield, 2)
    )}
    ${formulaBlock(
      'Rendement net',
      `(Loyer HC × 12 − Copro − TF − PNO − Vacance − Extras − Compta) / Coût acquisition × 100`,
      fmtPct(sciIs.netYield, 2),
      'Hors fiscalité, intègre la comptabilité et les options activées.'
    )}

    <h3>Cashflow et faisabilité</h3>
    ${formulaBlock(
      'Cashflow mensuel avant IS',
      `Loyer + Charges récup. − Mensualité − Copro − TF/12 − PNO/12 − Compta/12${inputs.hasGLI ? ' − GLI' : ''}${
        inputs.hasPropertyManagement ? ' − Gestion' : ''
      }`,
      `${sciIs.monthlyCashflowBeforeTax >= 0 ? '+' : ''}${fmtEur(sciIs.monthlyCashflowBeforeTax)}`
    )}
    ${formulaBlock(
      'Cashflow mensuel après IS',
      `Cashflow avant IS − IS/12 = ${fmtNum(sciIs.monthlyCashflowBeforeTax)} − ${fmtNum(sciIs.monthlyCorporateTax)}`,
      `${sciIs.monthlyCashflow >= 0 ? '+' : ''}${fmtEur(sciIs.monthlyCashflow)}`
    )}
    ${formulaBlock(
      'Cashflow annuel',
      `Cashflow mensuel × 12`,
      `${sciIs.annualCashflow >= 0 ? '+' : ''}${fmtEur(sciIs.annualCashflow)}`
    )}
    ${formulaBlock(
      'Taux d\'endettement',
      `(Mensualité + Crédits actuels) / (Salaire + 70 % × Loyer HC)`,
      fmtPct(sciIs.indebtedness * 100, 2)
    )}
    ${formulaBlock(
      'Ratio d\'apport',
      `Apport / Coût acquisition × 100 = ${fmtNum(shared.totalContribution)} / ${fmtNum(shared.totalAcquisitionCost)} × 100`,
      fmtPct(sciIs.contributionRatio, 2),
      `Seuil de faisabilité bancaire : ${(SCI_MIN_CONTRIBUTION_RATIO * 100).toFixed(0)} %.`
    )}
  </section>`;
};

const buildAmortizationTable = (yearly: YearlyAmortization[]): string => {
  return `
  <section class="page-section">
    <h2>5. Tableau d'amortissement annuel</h2>
    <table class="amort">
      <thead>
        <tr><th>Année</th><th>Intérêts payés</th><th>Capital remboursé</th><th>Capital restant dû</th></tr>
      </thead>
      <tbody>
        ${yearly
          .map(
            (y) =>
              `<tr><td>${y.year}</td><td>${fmtEur(y.interest)}</td><td>${fmtEur(y.capital)}</td><td>${fmtEur(y.leftToPay)}</td></tr>`
          )
          .join('')}
      </tbody>
    </table>
  </section>`;
};

const buildFooter = (): string => `
  <footer class="report-footer">
    <p>Document généré automatiquement à titre indicatif et non contractuel. Les calculs reposent sur les hypothèses saisies, des taux fiscaux indicatifs et un modèle simplifié (loyer et charges considérés constants, intérêts de la 1ʳᵉ année utilisés pour la fiscalité, frais de notaire forfaitaires à 8 %). Ce rapport ne se substitue pas à l\'analyse d\'un conseiller fiscal ou bancaire.</p>
  </footer>`;

// ------------- CSS -------------

const CSS = `
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; color: #1f2937; background: #f8fafc; }
  body { line-height: 1.45; }
  .report { max-width: 880px; margin: 0 auto; padding: 32px 40px 60px; background: white; }
  h1 { font-size: 22px; margin: 0 0 8px; color: #0f172a; }
  h2 { font-size: 18px; margin: 28px 0 14px; padding-bottom: 6px; border-bottom: 2px solid #1d4ed8; color: #0f172a; }
  h3 { font-size: 14px; margin: 18px 0 8px; color: #1e3a8a; text-transform: uppercase; letter-spacing: 0.04em; }
  p, label, td, th, li, span { font-size: 12px; }
  .cover { padding-bottom: 16px; border-bottom: 1px solid #e5e7eb; }
  .cover .subtitle { font-size: 14px; color: #475569; margin: 0 0 12px; font-style: italic; }
  .meta { border-collapse: collapse; margin-top: 10px; }
  .meta th { text-align: left; padding: 4px 10px 4px 0; color: #64748b; font-weight: 500; width: 160px; }
  .meta td { padding: 4px 0; font-weight: 600; }
  .notes { margin-top: 12px; padding: 8px 12px; background: #f1f5f9; border-left: 3px solid #1d4ed8; font-size: 12px; }
  .page-section { page-break-inside: avoid; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
  table.kv th { text-align: left; padding: 5px 10px 5px 0; color: #475569; font-weight: 500; width: 220px; }
  table.kv td { padding: 5px 0; font-weight: 600; }
  table.kv .hint { color: #64748b; font-weight: 400; font-size: 11px; }
  table.summary { border: 1px solid #cbd5e1; background: #f8fafc; }
  table.summary th, table.summary td { padding: 7px 12px; border-bottom: 1px solid #e2e8f0; text-align: left; }
  table.summary th { color: #475569; font-weight: 500; width: 60%; }
  table.summary td { font-weight: 700; }
  .good { color: #15803d; }
  .bad { color: #b91c1c; }
  .verdict { padding: 12px 16px; border-radius: 6px; margin-bottom: 14px; display: flex; flex-direction: column; gap: 4px; border-left: 6px solid #64748b; }
  .verdict-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #475569; }
  .verdict-value { font-size: 16px; font-weight: 700; }
  .verdict-detail { font-size: 12px; color: #475569; }
  .verdict ul.criteria { margin: 6px 0 0; padding-left: 18px; }
  .verdict-green { background: #dcfce7; border-color: #16a34a; color: #14532d; }
  .verdict-lime { background: #ecfccb; border-color: #65a30d; color: #365314; }
  .verdict-yellow { background: #fef9c3; border-color: #ca8a04; color: #713f12; }
  .verdict-orange { background: #ffedd5; border-color: #ea580c; color: #7c2d12; }
  .verdict-red { background: #fee2e2; border-color: #dc2626; color: #7f1d1d; }
  .chart { margin: 14px 0 18px; padding: 0; }
  .chart figcaption { font-size: 12px; color: #475569; margin-bottom: 6px; font-weight: 600; }
  .chart svg { width: 100%; height: auto; background: white; border: 1px solid #e2e8f0; border-radius: 4px; }
  .chart-note { font-size: 11px; color: #64748b; font-style: italic; margin: -4px 0 12px; }
  .formula { margin: 8px 0; padding: 8px 10px; background: #f8fafc; border-left: 3px solid #cbd5e1; }
  .formula-label { font-size: 12px; font-weight: 600; color: #0f172a; margin-bottom: 2px; }
  .formula-line { font-size: 12px; color: #374151; }
  .formula-line code { font-family: 'Courier New', monospace; background: transparent; padding: 0; color: #1e3a8a; }
  .formula-line strong { color: #0f172a; }
  .formula-comment { font-size: 11px; color: #64748b; font-style: italic; margin-top: 3px; }
  table.amort { border: 1px solid #cbd5e1; }
  table.amort th, table.amort td { padding: 5px 10px; border-bottom: 1px solid #e2e8f0; text-align: right; font-size: 11px; }
  table.amort th { background: #f1f5f9; color: #475569; font-weight: 600; text-align: right; }
  table.amort th:first-child, table.amort td:first-child { text-align: left; }
  .report-footer { margin-top: 30px; padding-top: 14px; border-top: 1px solid #e5e7eb; font-size: 10px; color: #64748b; font-style: italic; }
  @page { size: A4; margin: 12mm 14mm; }
  @media print {
    body { background: white; }
    .report { box-shadow: none; padding: 0; }
    .page-section { page-break-inside: avoid; }
    h2 { page-break-after: avoid; }
    .formula { page-break-inside: avoid; }
    .chart { page-break-inside: avoid; }
  }
`;

// ------------- ENTRY POINT -------------

export const generateHtmlReport = (data: ReportData, meta: ReportMeta, regime: ReportRegime): string => {
  const synthesis = regime === 'nom-propre' ? buildSynthesisNomPropre(data) : buildSynthesisSciIs(data);
  const charts = regime === 'nom-propre' ? buildChartsNomPropre(data) : buildChartsSciIs(data);
  const details = regime === 'nom-propre' ? buildDetailsNomPropre(data) : buildDetailsSciIs(data);
  const title =
    regime === 'nom-propre' ? "Rapport investissement locatif - Nom propre" : "Rapport investissement locatif - SCI IS";

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(title)}${meta.projectName ? ` - ${esc(meta.projectName)}` : ''}</title>
  <style>${CSS}</style>
</head>
<body>
  <main class="report">
    ${buildHeader(meta, regime)}
    ${buildProjectInputs(data)}
    ${synthesis}
    ${charts}
    ${details}
    ${buildAmortizationTable(data.shared.yearlyAmortization)}
    ${buildFooter()}
  </main>
  <script>
    window.addEventListener('load', function () {
      setTimeout(function () { window.print(); }, 250);
    });
  </script>
</body>
</html>`;
};
