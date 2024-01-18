import useMainStore from '@/store/store';
import type { CustomTooltipProps } from '@/types/commonTypes';
import {
  calculateLoanAmount,
  calculateMonthlyInsuranceCost,
  calculateMonthlyLoanCost,
  calculateMonthlyPayment,
  calculateNotaryFees,
  calculateTotalcontribution,
} from '@/utils/simulationResults';
import { COLORS } from '@/utils/constants';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SpendingsFromProject = () => {
  const price = useMainStore((state) => state.inputValues.price);
  const worksBudget = useMainStore((state) => state.inputValues.worksBudget);
  const loanDuration = useMainStore((state) => state.inputValues.loanDuration);
  const loanRate = useMainStore((state) => state.inputValues.loanRate);
  const contribution = useMainStore((state) => state.inputValues.contribution);
  const coContribution = useMainStore((state) => state.inputValues.coContribution);
  const coLoanPercent = useMainStore((state) => state.inputValues.coLoanPercent);
  const insuranceRate = useMainStore((state) => state.inputValues.insuranceRate);
  const hasCoBorrower = useMainStore((state) => state.filters.hasCoBorrower);

  const notaryFees = calculateNotaryFees(price);
  const totalContribution = calculateTotalcontribution(contribution, hasCoBorrower ? coContribution : 0);
  const loanAmount = calculateLoanAmount(price, totalContribution, notaryFees, worksBudget);
  const monthlyLoanCost = calculateMonthlyLoanCost(loanAmount, loanRate, loanDuration);
  const monthlyInsuranceCost = calculateMonthlyInsuranceCost(loanAmount, insuranceRate);
  const monthlyPayment = calculateMonthlyPayment(monthlyLoanCost, monthlyInsuranceCost);

  const lineChartData = [];

  for (let i = 1; i <= loanDuration; i++) {
    lineChartData.push({
      year: i,
      name: `Année ${i}`,
      A: +(contribution + ((100 - coLoanPercent) / 100) * monthlyPayment * i * 12).toFixed(),
      B: +(coContribution + (coLoanPercent / 100) * monthlyPayment * i * 12).toFixed(),
    });
  }

  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip p-2" style={{ backgroundColor: payload[0].color }}>
          <div>{payload[0].payload.name}</div>
          <div>
            {payload[0].name} : {payload[0].value}€
          </div>
          {hasCoBorrower && (
            <div>
              {payload[1].name} : {payload[1].value}€
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        width={500}
        height={300}
        data={lineChartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="white" />
        <XAxis dataKey="year" stroke="white" />
        <YAxis stroke="white" />
        <Tooltip content={<CustomTooltip />} />
        <Legend formatter={(value, _entry, _index) => <span style={{ color: 'white' }}>{value}</span>} />
        <Line type="monotone" name="Emprunteur" dataKey="A" stroke={COLORS[0]} dot={false} />
        {hasCoBorrower && <Line type="monotone" name="Co-Emprunteur" dataKey="B" stroke={COLORS[1]} dot={false} />}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SpendingsFromProject;
