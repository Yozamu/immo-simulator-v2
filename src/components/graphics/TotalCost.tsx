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

  const COLORS = ['rgba(66, 165, 245, 0.75)', 'rgba(0, 194, 251, 0.75)', 'rgba(0, 217, 228, 0.75)'];

  return (
    <div style={{ width: '400px', height: '400px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart width={400} height={400}>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
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
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TotalCost;
