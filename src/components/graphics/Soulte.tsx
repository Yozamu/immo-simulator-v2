import { Progress } from '@/components/ui/progress';
import useMainStore from '@/store/store';
import {
  calculateLoanAmount,
  calculateNotaryFees,
  calculateQuota,
  calculateSoulte,
  calculateTotalcontribution,
} from '@/utils/simulationResults';
import { COLORS } from '@/utils/constants';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const CAPITAL_LEFT_STEP = 1000;

const Soulte = () => {
  const coLoanPercent = useMainStore((state) => state.inputValues.coLoanPercent);
  const contribution = useMainStore((state) => state.inputValues.contribution);
  const worksBudget = useMainStore((state) => state.inputValues.worksBudget);
  const coContribution = useMainStore((state) => state.inputValues.coContribution);
  const hasCoBorrower = useMainStore((state) => state.filters.hasCoBorrower);
  const price = useMainStore((state) => state.inputValues.price);

  const [capitalLeft, setCapitalLeft] = useState(price);
  const percentCapitalLeft = +((capitalLeft / price) * 100).toFixed(2);

  const notaryFees = calculateNotaryFees(price);
  const totalContribution = calculateTotalcontribution(contribution, hasCoBorrower ? coContribution : 0);
  const loanAmount = calculateLoanAmount(price, totalContribution, notaryFees, worksBudget);
  const quota = calculateQuota(coLoanPercent, loanAmount, contribution, price);

  const soulteGiven = calculateSoulte(price, capitalLeft, 100 - quota);
  const soulteReceived = calculateSoulte(price, capitalLeft, quota);

  return (
    <div className="text-left flex flex-col gap-2 pt-8">
      <label>
        Valeur du bien : <strong>{price}€</strong>, quotités : <strong>{quota}%</strong> /{' '}
        <strong>{100 - quota}%</strong>
      </label>
      <div className="flex items-center gap-2">
        <label>Capital restant dû :</label>
        <Input
          className="w-fit text-black"
          type="number"
          value={capitalLeft}
          onChange={(e) => setCapitalLeft(+e.target.value)}
          step={CAPITAL_LEFT_STEP}
        />
        €
      </div>
      <Progress color={COLORS[0]} value={percentCapitalLeft} />
      <Separator className="my-4" />
      <h4 className="font-bold">Emprunteur</h4>
      <label>
        Prix rachat soulte : <strong>{soulteGiven}€</strong>
      </label>
      <label>
        Total restant soulte + crédit : <strong>{soulteGiven + capitalLeft}€</strong>
      </label>
      <Separator className="my-4" />
      <h4 className="font-bold">Co-emprunteur</h4>
      <label>
        Prix rachat soulte : <strong>{soulteReceived}€</strong>
      </label>
      <label>
        Total restant soulte + crédit : <strong>{soulteReceived + capitalLeft}€</strong>
      </label>
    </div>
  );
};

export default Soulte;
