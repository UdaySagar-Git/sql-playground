import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CustomTooltip } from '../ChartTooltip';

interface ScatterChartComponentProps {
  data: Array<Record<string, string | number>>;
  chartColors: string[];
  xAxisName: string;
  yAxisName: string;
}

export const ScatterChartComponent = ({
  data,
  chartColors,
  xAxisName,
  yAxisName
}: ScatterChartComponentProps) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <ScatterChart margin={{ top: 10, right: 30, left: 20, bottom: 40 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          name={xAxisName || 'X Axis'}
          type="category"
          angle={-45}
          textAnchor="end"
          height={70}
          tick={{ fontSize: 11 }}
        />
        <YAxis
          dataKey={yAxisName}
          name={yAxisName || 'Y Axis'}
          tick={{ fontSize: 11 }}
        />
        <Tooltip
          content={<CustomTooltip />}
          wrapperStyle={{ zIndex: 1000 }}
          cursor={{ strokeDasharray: '3 3', stroke: '#aaa', strokeWidth: 1 }}
          offset={10}
        />
        <Legend wrapperStyle={{ fontSize: 11, paddingTop: 20 }} />
        <Scatter
          name={`${xAxisName || 'X'} vs ${yAxisName || 'Y'}`}
          data={data}
          fill={chartColors[0]}
          shape="circle"
          legendType="circle"
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
}; 