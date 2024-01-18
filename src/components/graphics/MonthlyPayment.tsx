import useMainStore from '@/store/store';
import {
  calculateLoanAmount,
  calculateMonthlyInsuranceCost,
  calculateMonthlyLoanCost,
  calculateMonthlyPayment,
  calculateNotaryFees,
  calculateTotalSalary,
  calculateTotalcontribution,
} from '@/utils/simulationResults';
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer } from 'recharts';
import { COLORS } from '@/utils/constants';

const MonthlyPayment = () => {
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

  const data = [
    {
      name: 'Salaire',
      uv: totalSalary,
      fill: COLORS[0],
    },
    {
      name: 'Mensualité',
      uv: monthlyPayment,
      fill: COLORS[1],
    },
    {
      name: 'Mensualité max',
      uv: (totalSalary * 0.35).toFixed(),
      fill: COLORS[2],
    },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadialBarChart cx="50%" cy="50%" innerRadius={80} outerRadius={160} barSize={16} data={data}>
        <RadialBar label={{ position: 'insideEnd', fill: '#fff' }} background dataKey="uv" />
        <Legend formatter={(value, _entry, _index) => <span style={{ color: 'white' }}>{value}</span>} />
      </RadialBarChart>
    </ResponsiveContainer>
  );
};

export default MonthlyPayment;
