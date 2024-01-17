import type { CustomLabel, CustomTooltipProps } from '@/types/commonTypes';
import { COLORS } from '@/utils/constants';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface Props {}

const TotalCost: React.FC<Props> = () => {
  const totalInterestCost = 1000;
  const totalInsuranceCost = 1000;
  const notaryFees = 1000;

  const pieData = [
    { name: 'Intérêts', value: totalInterestCost },
    { name: 'Assurance', value: totalInsuranceCost },
    { name: 'Frais de notaire', value: notaryFees },
  ];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: CustomLabel) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2" style={{ backgroundColor: payload[0].payload.fill }}>
          {`${payload[0].name} : ${payload[0].value}€`}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-96 h-96">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={150}
            innerRadius={75}
            fill="#fff"
            dataKey="value"
          >
            {pieData.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend height={36} formatter={(value, _entry, _index) => <span style={{ color: 'white' }}>{value}</span>} />
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TotalCost;
