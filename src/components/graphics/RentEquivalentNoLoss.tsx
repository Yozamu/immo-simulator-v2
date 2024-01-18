import useMainStore from '@/store/store';
import type { CustomTooltipProps } from '@/types/commonTypes';
import {
  calculateLoanAmount,
  calculateLoanRepayment,
  calculateMonthlyInsuranceCost,
  calculateNotaryFees,
  calculateTotalInsuranceCost,
  calculateTotalcontribution,
} from '@/utils/simulationResults';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { COLORS } from '@/utils/constants';

const RentEquivalentNoLoss = () => {
  const price = useMainStore((state) => state.inputValues.price);
  const loanDuration = useMainStore((state) => state.inputValues.loanDuration);
  const loanRate = useMainStore((state) => state.inputValues.loanRate);
  const contribution = useMainStore((state) => state.inputValues.contribution);
  const coContribution = useMainStore((state) => state.inputValues.coContribution);
  const insuranceRate = useMainStore((state) => state.inputValues.insuranceRate);
  const hasCoBorrower = useMainStore((state) => state.filters.hasCoBorrower);

  const notaryFees = calculateNotaryFees(price);
  const totalContribution = calculateTotalcontribution(contribution, hasCoBorrower ? coContribution : 0);
  const loanAmount = calculateLoanAmount(price, totalContribution, notaryFees);
  const { interests, capital } = calculateLoanRepayment(loanAmount, loanRate, loanDuration);
  const monthlyInsuranceCost = calculateMonthlyInsuranceCost(loanAmount, insuranceRate);
  const totalInsuranceCost = calculateTotalInsuranceCost(monthlyInsuranceCost, loanDuration);

  const data = [];
  const len = interests.length;

  for (let i = 12; i <= len; i += 12) {
    const currentlyPaidInterests = +interests
      .slice(0, i)
      .reduce((acc, curr) => acc + curr, 0)
      .toFixed();
    const currentlyPaidCapital = +capital
      .slice(0, i)
      .reduce((acc, curr) => acc + curr, 0)
      .toFixed();
    const equivalent = +((currentlyPaidInterests + totalInsuranceCost + notaryFees) / i).toFixed(2);
    data.push({
      year: i / 12,
      name: `Année ${i / 12}`,
      equivalent,
      equivalentWithCapital: +(equivalent + currentlyPaidCapital / i).toFixed(2),
    });
  }

  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const equivalent = +payload[0].value;
      const equivalentWithCapital = +payload[1].value;
      return (
        <div className="custom-tooltip p-2" style={{ backgroundColor: payload[0].fill }}>
          <div>{payload[0].payload.name}</div>
          <div>Equivalent loyer (perte sèche) : {equivalent}€</div>
          <div>Coût réel avec capital payé : {equivalentWithCapital}€</div>
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
        <Area type="monotone" dataKey="equivalent" stroke={COLORS[0]} fill={COLORS[0]} />
        <Area type="monotone" dataKey="equivalentWithCapital" stroke={COLORS[1]} fill={COLORS[1]} />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default RentEquivalentNoLoss;
