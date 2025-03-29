import { ChartType, QueryResult, VisualizationState } from '@/types';
import styles from './queryResults.module.css';
import { Dispatch, SetStateAction } from 'react';
import { ChartControls } from './ChartControls';
import { BarChartComponent } from './ChartTypes/BarChartComponent';
import { LineChartComponent } from './ChartTypes/LineChartComponent';
import { PieChartComponent } from './ChartTypes/PieChartComponent';
import { ScatterChartComponent } from './ChartTypes/ScatterChartComponent';

export const CHART_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088fe', '#00C49F', '#FFBB28', '#FF8042', '#a4de6c', '#d0ed57'];

interface QueryChartsProps {
  results: QueryResult;
  visualizationState: VisualizationState;
  setVisualizationState: Dispatch<SetStateAction<VisualizationState>>;
}

export const QueryCharts = ({
  results,
  visualizationState,
  setVisualizationState
}: QueryChartsProps) => {

  const handleChartTypeChange = (chartType: ChartType) => {
    setVisualizationState(prev => ({
      ...prev,
      selectedChartType: chartType
    }));
  };

  const handleMappingChange = (mappingKey: keyof VisualizationState['chartMappings'], value: string) => {
    setVisualizationState(prev => ({
      ...prev,
      chartMappings: {
        ...prev.chartMappings,
        [mappingKey]: value
      }
    }));
  };

  const formatChartData = () => {
    if (!results || results.values.length === 0) return [];

    const { chartMappings } = visualizationState;
    const { xAxis, category, value } = chartMappings;

    const xIndex = xAxis ? results.columns.indexOf(xAxis) : 0;
    const categoryIndex = category ? results.columns.indexOf(category) : 0;
    const valueIndex = value ? results.columns.indexOf(value) : 1;

    if (visualizationState.selectedChartType === ChartType.PIE && category && value) {
      return results.values.map(row => ({
        name: String(row[categoryIndex]),
        value: Number(row[valueIndex]) || 0
      }));
    }

    return results.values.map(row => {
      const formattedRow: Record<string, string | number> = {
        name: String(row[xIndex])
      };

      if (visualizationState.selectedChartType !== ChartType.PIE) {
        results.columns.forEach((col, colIndex) => {
          if (colIndex !== xIndex) {
            formattedRow[col] = Number(row[colIndex]) || 0;
          }
        });
      }

      return formattedRow;
    });
  };

  const renderChart = () => {
    if (!results || !results.columns.length) return null;

    const chartData = formatChartData();
    const { chartMappings } = visualizationState;
    const yAxisColumns = results.columns.filter(col => col !== chartMappings.xAxis);

    const maxDataPoints = 30;
    const displayData = chartData.length > maxDataPoints ? chartData.slice(0, maxDataPoints) : chartData;

    switch (visualizationState.selectedChartType) {
      case ChartType.BAR:
        return (
          <BarChartComponent
            data={displayData}
            yAxisColumns={yAxisColumns}
            chartColors={CHART_COLORS}
          />
        );

      case ChartType.LINE:
        return (
          <LineChartComponent
            data={displayData}
            yAxisColumns={yAxisColumns}
            chartColors={CHART_COLORS}
          />
        );

      case ChartType.PIE:
        return (
          <PieChartComponent
            data={displayData as Array<{ name: string; value: number }>}
            chartColors={CHART_COLORS}
          />
        );

      case ChartType.SCATTER:
        return (
          <ScatterChartComponent
            data={displayData}
            chartColors={CHART_COLORS}
            xAxisName={chartMappings.xAxis || ''}
            yAxisName={chartMappings.yAxis || ''}
          />
        );

      default:
        return null;
    }
  };

  if (!results || !results.columns.length) {
    return <div className={styles.noChartData}>No data available for visualization</div>;
  }

  return (
    <div className={styles.visualizationContainer}>
      <ChartControls
        columns={results.columns}
        visualizationState={visualizationState}
        onChartTypeChange={handleChartTypeChange}
        onMappingChange={handleMappingChange}
      />
      <div className={styles.chartContainer}>
        {renderChart()}
      </div>
    </div>
  );
}; 