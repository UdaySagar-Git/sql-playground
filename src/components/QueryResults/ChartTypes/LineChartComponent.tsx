import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { CustomTooltip } from '../ChartTooltip';
import styles from '../queryResults.module.css';

interface LineChartProps {
  data: Array<Record<string, string | number>>;
  yAxisColumns: string[];
  chartColors: string[];
}

export const LineChartComponent: React.FC<LineChartProps> = ({
  data,
  yAxisColumns,
  chartColors
}) => {
  if (!data || data.length === 0) {
    return <div className={styles.noChartData}>No data available for Line Chart</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 20,
          bottom: 40
        }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--border-color)"
          opacity={0.5}
        />
        <XAxis
          dataKey="name"
          angle={-45}
          textAnchor="end"
          height={70}
          tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
          tickLine={{ stroke: 'var(--border-color)' }}
          axisLine={{ stroke: 'var(--border-color)' }}
        />
        <YAxis
          tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
          tickLine={{ stroke: 'var(--border-color)' }}
          axisLine={{ stroke: 'var(--border-color)' }}
        />
        <Tooltip
          content={<CustomTooltip />}
          wrapperStyle={{ zIndex: 1000 }}
          cursor={{
            strokeDasharray: '5 5',
            stroke: 'var(--text-secondary)',
            strokeWidth: 1
          }}
          offset={10}
        />
        <Legend
          wrapperStyle={{
            fontSize: 11,
            paddingTop: 10,
            color: 'var(--text-primary)'
          }}
          iconType="circle"
        />
        {yAxisColumns.map((column, index) => (
          <Line
            key={column}
            type="monotone"
            dataKey={column}
            stroke={chartColors[index % chartColors.length]}
            strokeWidth={2}
            activeDot={{
              r: 6,
              strokeWidth: 1,
              stroke: 'var(--background-primary)',
              fill: chartColors[index % chartColors.length]
            }}
            dot={{
              r: 4,
              strokeWidth: 1,
              stroke: 'var(--background-primary)',
              fill: chartColors[index % chartColors.length]
            }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};