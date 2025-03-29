import { ChartType, VisualizationState } from '@/types';
import styles from './queryResults.module.css';

interface ChartControlsProps {
  columns: string[];
  visualizationState: VisualizationState;
  onChartTypeChange: (chartType: ChartType) => void;
  onMappingChange: (mappingKey: keyof VisualizationState['chartMappings'], value: string) => void;
}

export const ChartControls = ({
  columns,
  visualizationState,
  onChartTypeChange,
  onMappingChange
}: ChartControlsProps) => {
  if (!columns.length) return null;

  return (
    <div className={styles.chartControls}>
      <div className={styles.chartTypeSelector}>
        <h4>Chart Type</h4>
        <div className={styles.chartTypeButtons}>
          <button
            className={`${styles.chartTypeButton} ${visualizationState.selectedChartType === ChartType.BAR ? styles.active : ''}`}
            onClick={() => onChartTypeChange(ChartType.BAR)}
          >
            Bar
          </button>
          <button
            className={`${styles.chartTypeButton} ${visualizationState.selectedChartType === ChartType.LINE ? styles.active : ''}`}
            onClick={() => onChartTypeChange(ChartType.LINE)}
          >
            Line
          </button>
          <button
            className={`${styles.chartTypeButton} ${visualizationState.selectedChartType === ChartType.PIE ? styles.active : ''}`}
            onClick={() => onChartTypeChange(ChartType.PIE)}
          >
            Pie
          </button>
          <button
            className={`${styles.chartTypeButton} ${visualizationState.selectedChartType === ChartType.SCATTER ? styles.active : ''}`}
            onClick={() => onChartTypeChange(ChartType.SCATTER)}
          >
            Scatter
          </button>
        </div>
      </div>

      <div className={styles.chartMappingControls}>
        <h4>Data Mapping</h4>
        <div className={styles.mappingSelectors}>
          {(visualizationState.selectedChartType === ChartType.BAR ||
            visualizationState.selectedChartType === ChartType.LINE ||
            visualizationState.selectedChartType === ChartType.SCATTER) && (
              <div className={styles.axisSelectors}>
                <div className={styles.mappingField}>
                  <label htmlFor="xAxis">X Axis:</label>
                  <select
                    id="xAxis"
                    value={visualizationState.chartMappings.xAxis || ''}
                    onChange={(e) => onMappingChange('xAxis', e.target.value)}
                  >
                    <option value="">Select column</option>
                    {columns.map(column => (
                      <option key={column} value={column}>{column}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.mappingField}>
                  <label htmlFor="yAxis">Y Axis:</label>
                  <select
                    id="yAxis"
                    value={visualizationState.chartMappings.yAxis || ''}
                    onChange={(e) => onMappingChange('yAxis', e.target.value)}
                  >
                    <option value="">Select column</option>
                    {columns.map(column => (
                      <option key={column} value={column}>{column}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

          {visualizationState.selectedChartType === ChartType.PIE && (
            <div className={styles.axisSelectors}>
              <div className={styles.mappingField}>
                <label htmlFor="category">Category:</label>
                <select
                  id="category"
                  value={visualizationState.chartMappings.category || ''}
                  onChange={(e) => onMappingChange('category', e.target.value)}
                >
                  <option value="">Select column</option>
                  {columns.map(column => (
                    <option key={column} value={column}>{column}</option>
                  ))}
                </select>
              </div>
              <div className={styles.mappingField}>
                <label htmlFor="value">Value:</label>
                <select
                  id="value"
                  value={visualizationState.chartMappings.value || ''}
                  onChange={(e) => onMappingChange('value', e.target.value)}
                >
                  <option value="">Select column</option>
                  {columns.map(column => (
                    <option key={column} value={column}>{column}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 