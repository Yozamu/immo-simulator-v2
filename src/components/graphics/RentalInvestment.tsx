import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import useRentalCalculations from '@/hooks/useRentalCalculations';
import { COLORS } from '@/utils/constants';

const RentalInvestment = () => {
  const { monthlyPayment, indebtedness, grossYield, netYield, monthlyCashflow } = useRentalCalculations();

  const debtPercent = +(indebtedness * 100).toFixed(2);
  const doable = indebtedness <= 0.35;
  const percentOfMaxIndebtedness = Math.min(100, (debtPercent / 35) * 100);
  const debtBarColor = doable ? (indebtedness <= 0.3 ? COLORS[0] : COLORS[1]) : COLORS[2];

  const cashflowPositive = monthlyCashflow >= 0;
  const yieldColor = netYield >= 4 ? COLORS[0] : netYield >= 2 ? COLORS[1] : COLORS[2];
  const netYieldRatio = Math.min(100, Math.max(0, (netYield / 8) * 100));

  return (
    <div className="text-left flex flex-col gap-2 pt-4">
      <label>
        Mensualité crédit : <strong>{Math.round(monthlyPayment)}€</strong>
      </label>
      <label>
        Endettement {debtPercent}% (Réalisable:{' '}
        {doable ? <strong className="text-green-500">OUI</strong> : <strong className="text-red-500">NON</strong>})
      </label>
      <Progress color={debtBarColor} value={percentOfMaxIndebtedness} />
      <Separator className="my-2" />
      <label>
        Rendement brut : <strong>{grossYield}%</strong>
      </label>
      <label>
        Rendement net : <strong>{netYield}%</strong>
      </label>
      <Progress color={yieldColor} value={netYieldRatio} />
      <Separator className="my-2" />
      <label>
        Cashflow mensuel :{' '}
        <strong className={cashflowPositive ? 'text-green-500' : 'text-red-500'}>
          {monthlyCashflow >= 0 ? '+' : ''}
          {monthlyCashflow}€
        </strong>
      </label>
    </div>
  );
};

export default RentalInvestment;
