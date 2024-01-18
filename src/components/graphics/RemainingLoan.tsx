import useMainStore from '@/store/store';
import type { CustomTooltipProps } from '@/types/commonTypes';
import {
  calculateLoanAmount,
  calculateLoanRepayment,
  calculateNotaryFees,
  calculateTotalInterestCost,
  calculateTotalcontribution,
} from '@/utils/simulationResults';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { COLORS } from '@/utils/constants';

const RemainingLoan = () => {
  const price = useMainStore((state) => state.inputValues.price);
  const loanDuration = useMainStore((state) => state.inputValues.loanDuration);
  const loanRate = useMainStore((state) => state.inputValues.loanRate);
  const contribution = useMainStore((state) => state.inputValues.contribution);
  const coContribution = useMainStore((state) => state.inputValues.coContribution);
  const hasCoBorrower = useMainStore((state) => state.filters.hasCoBorrower);

  const notaryFees = calculateNotaryFees(price);
  const totalContribution = calculateTotalcontribution(contribution, hasCoBorrower ? coContribution : 0);
  const loanAmount = calculateLoanAmount(price, totalContribution, notaryFees);
  const { interests, capital } = calculateLoanRepayment(loanAmount, loanRate, loanDuration);
  const totalInterestCost = calculateTotalInterestCost(loanAmount, loanRate, loanDuration);

  const data = [];
  const len = interests.length;

  for (let i = 0; i < len; i += 12) {
    data.push({
      year: i / 12 + 1,
      name: `Année ${i / 12 + 1}`,
      interests: Math.max(
        0,
        +interests
          .slice(i, len)
          .reduce((acc, curr) => acc + curr, 0)
          .toFixed()
      ),
      capital: capital
        .slice(i, len)
        .reduce((acc, curr) => acc + curr, 0)
        .toFixed(),
    });
  }

  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const interestsLeft = +payload[0].value;
      const capitalLeft = +payload[1].value;
      const totalLeft = interestsLeft + capitalLeft;
      const percentOfInterestsLeft = ((interestsLeft / totalInterestCost) * 100).toFixed();
      const percentOfCapitalLeft = ((capitalLeft / loanAmount) * 100).toFixed();
      const percentLeft = ((totalLeft / (totalInterestCost + loanAmount)) * 100).toFixed();
      return (
        <div className="custom-tooltip p-2" style={{ backgroundColor: payload[0].fill }}>
          <div>{payload[0].payload.name}</div>
          <div>
            {payload[0].name} : {interestsLeft}€ ({percentOfInterestsLeft}%)
          </div>
          <div>
            {payload[1].name} : {capitalLeft}€ ({percentOfCapitalLeft}%)
          </div>
          <div>
            Total restant : {totalLeft}€ ({percentLeft}%)
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="w-96 h-96">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 20,
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
          <Bar dataKey="interests" stackId="a" fill={COLORS[0]} name="Intérêts restants" />
          <Bar dataKey="capital" stackId="a" fill={COLORS[1]} name="Capital restant" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RemainingLoan;
