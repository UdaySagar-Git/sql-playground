import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CustomTooltip } from '../ChartTooltip';

interface BarChartComponentProps {
  data: Array<Record<string, string | number>>;
  yAxisColumns: string[];
  chartColors: string[];
}

export const BarChartComponent = ({ data, yAxisColumns, chartColors }: BarChartComponentProps) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 40 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          angle={-45}
          textAnchor="end"
          height={70}
          tick={{ fontSize: 11 }}
        />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip
          content={<CustomTooltip />}
          wrapperStyle={{ zIndex: 1000 }}
          cursor={{ fillOpacity: 0.1 }}
          offset={10}
        />
        <Legend wrapperStyle={{ fontSize: 11, paddingTop: 20 }} />
        {yAxisColumns.map((column, index) => (
          <Bar
            key={column}
            dataKey={column}
            fill={chartColors[index % chartColors.length]}
            maxBarSize={50}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}; 