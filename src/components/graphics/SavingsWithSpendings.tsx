import useMainStore from '@/store/store';
import type { CustomTooltipProps } from '@/types/commonTypes';
import {
  calculateLoanAmount,
  calculateMonthlyInsuranceCost,
  calculateMonthlyLoanCost,
  calculateMonthlyPayment,
  calculateNotaryFees,
  calculateTotalSalary,
  calculateTotalcontribution,
} from '@/utils/simulationResults';
import { COLORS } from '@/utils/constants';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SavingsWithSpendings = () => {
  const price = useMainStore((state) => state.inputValues.price);
  const worksBudget = useMainStore((state) => state.inputValues.worksBudget);
  const loanDuration = useMainStore((state) => state.inputValues.loanDuration);
  const loanRate = useMainStore((state) => state.inputValues.loanRate);
  const contribution = useMainStore((state) => state.inputValues.contribution);
  const coContribution = useMainStore((state) => state.inputValues.coContribution);
  const insuranceRate = useMainStore((state) => state.inputValues.insuranceRate);
  const salary = useMainStore((state) => state.inputValues.salary);
  const coSalary = useMainStore((state) => state.inputValues.coSalary);
  const hasCoBorrower = useMainStore((state) => state.filters.hasCoBorrower);

  const notaryFees = calculateNotaryFees(price);
  const totalSalary = calculateTotalSalary(salary, hasCoBorrower ? coSalary : 0);
  const totalContribution = calculateTotalcontribution(contribution, hasCoBorrower ? coContribution : 0);
  const loanAmount = calculateLoanAmount(price, totalContribution, notaryFees, worksBudget);
  const monthlyLoanCost = calculateMonthlyLoanCost(loanAmount, loanRate, loanDuration);
  const monthlyInsuranceCost = calculateMonthlyInsuranceCost(loanAmount, insuranceRate);
  const monthlyPayment = calculateMonthlyPayment(monthlyLoanCost, monthlyInsuranceCost);

  const data = [];
  const leftToLive = totalSalary - monthlyPayment;

  for (let i = 1; i <= loanDuration; i++) {
    data.push({
      year: i,
      name: `Année ${i}`,
      savings80: +(leftToLive * 0.8 * i * 12).toFixed(),
      savings60: +(leftToLive * 0.6 * i * 12).toFixed(),
      savings40: +(leftToLive * 0.4 * i * 12).toFixed(),
      savings20: +(leftToLive * 0.2 * i * 12).toFixed(),
    });
  }

  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{ backgroundColor: payload[0].fill, padding: '8px' }}>
          <div>{payload[0].payload.name}</div>
          <div>Reste à vivre mensuel: {leftToLive.toFixed()}€</div>
          <div>
            80% d'épargne ({(leftToLive * 0.8).toFixed()}€) : {payload[0].value}€
          </div>
          <div>
            60% d'épargne ({(leftToLive * 0.6).toFixed()}€) : {payload[1].value}€
          </div>
          <div>
            40% d'épargne ({(leftToLive * 0.4).toFixed()}€) : {payload[2].value}€
          </div>
          <div>
            20% d'épargne ({(leftToLive * 0.2).toFixed()}€) : {payload[3].value}€
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        width={500}
        height={400}
        data={data}
        margin={{
          top: 20,
          right: 40,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="white" />
        <XAxis dataKey="year" stroke="white" />
        <YAxis stroke="white" />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="savings80" stroke={COLORS[0]} fill={COLORS[0]} />
        <Area type="monotone" dataKey="savings60" stroke={COLORS[1]} fill={COLORS[1]} />
        <Area type="monotone" dataKey="savings40" stroke={COLORS[2]} fill={COLORS[2]} />
        <Area type="monotone" dataKey="savings20" stroke={COLORS[3]} fill={COLORS[3]} />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default SavingsWithSpendings;
