import { Progress } from '@/components/ui/progress';
import useMainStore from '@/store/store';
import {
  calculateIndebtedness,
  calculateLoanAmount,
  calculateMonthlyInsuranceCost,
  calculateMonthlyLoanCost,
  calculateMonthlyPayment,
  calculateNotaryFees,
  calculateTotalSalary,
  calculateTotalcontribution,
} from '@/utils/simulationResults';
import { COLORS } from '@/utils/constants';

const ProjectFeasibility = () => {
  const price = useMainStore((state) => state.inputValues.price);
  const loanDuration = useMainStore((state) => state.inputValues.loanDuration);
  const salary = useMainStore((state) => state.inputValues.salary);
  const coSalary = useMainStore((state) => state.inputValues.coSalary);
  const contribution = useMainStore((state) => state.inputValues.contribution);
  const coContribution = useMainStore((state) => state.inputValues.coContribution);
  const hasCoBorrower = useMainStore((state) => state.filters.hasCoBorrower);
  const loanRate = useMainStore((state) => state.inputValues.loanRate);
  const insuranceRate = useMainStore((state) => state.inputValues.insuranceRate);

  const notaryFees = calculateNotaryFees(price);
  const totalSalary = calculateTotalSalary(salary, hasCoBorrower ? coSalary : 0);
  const totalContribution = calculateTotalcontribution(contribution, hasCoBorrower ? coContribution : 0);
  const loanAmount = calculateLoanAmount(price, totalContribution, notaryFees);
  const monthlyLoanCost = calculateMonthlyLoanCost(loanAmount, loanRate, loanDuration);
  const monthlyInsuranceCost = calculateMonthlyInsuranceCost(loanAmount, insuranceRate);
  const monthlyPayment = calculateMonthlyPayment(monthlyLoanCost, monthlyInsuranceCost);
  const indebtedness = calculateIndebtedness(monthlyPayment, totalSalary);
  const doable = indebtedness <= 0.35;
  const debtPercent = +(indebtedness * 100).toFixed(2);
  const percentOfMaxIndebtedness = Math.min(100, (debtPercent / 35) * 100);
  const debtBarColor = doable ? (indebtedness <= 0.3 ? COLORS[0] : COLORS[1]) : COLORS[2];

  return (
    <div className="text-left flex flex-col gap-2 pt-8">
      <label>
        Endettement {debtPercent}% (Réalisable:{' '}
        {doable ? <strong className="text-green-500">OUI</strong> : <strong className="text-red-500">NON</strong>})
      </label>
      <Progress color={debtBarColor} value={percentOfMaxIndebtedness} />
    </div>
  );
};

export default ProjectFeasibility;
