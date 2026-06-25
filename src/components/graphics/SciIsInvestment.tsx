import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import useSciIsCalculations from '@/hooks/useSciIsCalculations';
import { COLORS } from '@/utils/constants';

const FEASIBILITY_HEX: Record<string, string> = {
  green: 'rgba(34, 197, 94, 0.85)',
  lime: 'rgba(132, 204, 22, 0.85)',
  yellow: COLORS[3],
  orange: COLORS[1],
  red: COLORS[2],
};

const FEASIBILITY_TEXT: Record<string, string> = {
  green: 'text-green-500',
  lime: 'text-lime-400',
  yellow: 'text-yellow-400',
  orange: 'text-orange-400',
  red: 'text-red-500',
};

const SciIsInvestment = () => {
  const {
    monthlyPayment,
    indebtedness,
    contributionRatio,
    netYield,
    monthlyCashflow,
    monthlyCashflowBeforeTax,
    monthlyCorporateTax,
    feasibility,
    accountingFeesAnnual,
  } = useSciIsCalculations();

  const debtPercent = +(indebtedness * 100).toFixed(2);
  const cashflowPositive = monthlyCashflow >= 0;
  const cashflowBeforeTaxPositive = monthlyCashflowBeforeTax >= 0;

  const feasibilityRatio = (feasibility.score / 4) * 100;
  const feasibilityColor = FEASIBILITY_HEX[feasibility.color];
  const feasibilityText = FEASIBILITY_TEXT[feasibility.color];

  return (
    <div className="text-left flex flex-col gap-2 pt-4">
      <label>
        Faisabilité bancaire :{' '}
        <strong className={feasibilityText}>
          {feasibility.label} ({feasibility.score}/4)
        </strong>
      </label>
      <Progress color={feasibilityColor} value={feasibilityRatio} />
      <div className="text-xs opacity-80 flex flex-col gap-0.5 pl-1">
        <span>{feasibility.criteria.indebtedness ? '✓' : '✗'} Endettement ≤ 35% ({debtPercent}%)</span>
        <span>
          {feasibility.criteria.contribution ? '✓' : '✗'} Apport ≥ 10% du coût total ({contributionRatio}%)
        </span>
        <span>{feasibility.criteria.cashflow ? '✓' : '✗'} Cashflow positif après IS</span>
        <span>{feasibility.criteria.netYield ? '✓' : '✗'} Rendement net ≥ 5% ({netYield}%)</span>
      </div>
      <Separator className="my-2" />
      <label>
        Mensualité crédit : <strong>{Math.round(monthlyPayment)}€</strong>
      </label>
      <label>
        Frais de comptabilité : <strong className="text-red-400">-{Math.round(accountingFeesAnnual / 12)}€/mois</strong>
      </label>
      <label>
        IS mensualisé : <strong className="text-red-400">-{Math.round(monthlyCorporateTax)}€/mois</strong>
      </label>
      <Separator className="my-2" />
      <label>
        Cashflow mensuel avant IS :{' '}
        <strong className={cashflowBeforeTaxPositive ? 'text-green-500' : 'text-red-500'}>
          {monthlyCashflowBeforeTax >= 0 ? '+' : ''}
          {Math.round(monthlyCashflowBeforeTax)}€
        </strong>
      </label>
      <label>
        Cashflow mensuel après IS :{' '}
        <strong className={cashflowPositive ? 'text-green-500' : 'text-red-500'}>
          {monthlyCashflow >= 0 ? '+' : ''}
          {Math.round(monthlyCashflow)}€
        </strong>
      </label>
    </div>
  );
};

export default SciIsInvestment;
