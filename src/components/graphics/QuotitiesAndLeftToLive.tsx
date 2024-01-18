import useMainStore from '@/store/store';
import type { CustomTooltipProps } from '@/types/commonTypes';
import {
  calculateLeftToLive,
  calculateLoanAmount,
  calculateMonthlyInsuranceCost,
  calculateMonthlyLoanCost,
  calculateMonthlyPayment,
  calculateNotaryFees,
  calculateQuota,
  calculateTotalcontribution,
} from '@/utils/simulationResults';
import { COLORS } from '@/utils/constants';
import {
  Radar,
  RadarChart,
  PolarGrid,
  Legend,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const QuotitiesAndLeftToLive = () => {
  const price = useMainStore((state) => state.inputValues.price);
  const loanDuration = useMainStore((state) => state.inputValues.loanDuration);
  const loanRate = useMainStore((state) => state.inputValues.loanRate);
  const contribution = useMainStore((state) => state.inputValues.contribution);
  const coContribution = useMainStore((state) => state.inputValues.coContribution);
  const coLoanPercent = useMainStore((state) => state.inputValues.coLoanPercent);
  const insuranceRate = useMainStore((state) => state.inputValues.insuranceRate);
  const hasCoBorrower = useMainStore((state) => state.filters.hasCoBorrower);
  const salary = useMainStore((state) => state.inputValues.salary);
  const coSalary = useMainStore((state) => state.inputValues.coSalary);

  const notaryFees = calculateNotaryFees(price);
  const totalContribution = calculateTotalcontribution(contribution, hasCoBorrower ? coContribution : 0);
  const loanAmount = calculateLoanAmount(price, totalContribution, notaryFees);
  const monthlyLoanCost = calculateMonthlyLoanCost(loanAmount, loanRate, loanDuration);
  const monthlyInsuranceCost = calculateMonthlyInsuranceCost(loanAmount, insuranceRate);
  const monthlyPayment = calculateMonthlyPayment(monthlyLoanCost, monthlyInsuranceCost);
  const quota = calculateQuota(coLoanPercent, loanAmount, contribution, price);
  const leftToLive = calculateLeftToLive(salary, monthlyPayment, 100 - coLoanPercent);
  const coLeftToLive = calculateLeftToLive(coSalary, monthlyPayment, coLoanPercent);

  const radarData = hasCoBorrower
    ? [
        {
          subject: '% Crédit',
          A: 100 - coLoanPercent,
          B: coLoanPercent,
          fullMark: 100,
        },
        {
          subject: '% Salaire',
          A: ((salary / (salary + coSalary)) * 100).toFixed(),
          B: ((coSalary / (salary + coSalary)) * 100).toFixed(),
          fullMark: 100,
        },
        {
          subject: '% Apport',
          A: ((contribution / (contribution + coContribution)) * 100).toFixed(),
          B: ((coContribution / (contribution + coContribution)) * 100).toFixed(),
          fullMark: 100,
        },
        {
          subject: '% Quotités',
          A: quota,
          B: 100 - quota,
          fullMark: 100,
        },
        {
          subject: '% Reste',
          A: leftToLive,
          B: coLeftToLive,
          fullMark: 100,
        },
      ]
    : [];

  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{ backgroundColor: payload[0].fill, padding: '8px' }}>
          <div>{payload[0].payload.subject}</div>
          <div>
            {payload[0].name} : {payload[0].value}%
          </div>
          <div>
            {payload[1].name} : {payload[1].value}%
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div style={{ width: '400px', height: '400px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
          <PolarGrid stroke="white" />
          <PolarAngleAxis dataKey="subject" stroke="white" />
          <PolarRadiusAxis angle={45} domain={[0, 100]} stroke="white" />
          <Radar name="Emprunteur" dataKey="A" stroke={COLORS[0]} fill={COLORS[0]} fillOpacity={0.5} />
          <Radar name="Co-Emprunteur" dataKey="B" stroke={COLORS[1]} fill={COLORS[2]} fillOpacity={0.25} />
          <Legend formatter={(value, _entry, _index) => <span style={{ color: 'white' }}>{value}</span>} />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default QuotitiesAndLeftToLive;
