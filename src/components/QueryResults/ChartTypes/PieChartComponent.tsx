import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CustomTooltip } from '../ChartTooltip';

interface PieChartComponentProps {
  data: Array<{ name: string; value: number }>;
  chartColors: string[];
}

export const PieChartComponent = ({ data, chartColors }: PieChartComponentProps) => {
  const pieData = data.slice(0, 10);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => percent > 0.05 ? `${name}: ${(percent * 100).toFixed(0)}%` : ''}
          outerRadius={120}
          innerRadius={0}
          fill="#8884d8"
          dataKey="value"
          paddingAngle={1}
        >
          {pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
          ))}
        </Pie>
        <Tooltip
          content={<CustomTooltip />}
          wrapperStyle={{ zIndex: 1000 }}
          cursor={false}
          offset={10}
        />
        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          wrapperStyle={{ fontSize: 11, paddingTop: 20 }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}; 