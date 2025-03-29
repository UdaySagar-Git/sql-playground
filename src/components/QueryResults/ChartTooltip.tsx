import { TooltipProps } from 'recharts';
import styles from './queryResults.module.css';

interface TooltipPayload {
  name: string;
  value: number;
  payload?: Record<string, unknown>;
  dataKey?: string;
  fill?: string;
  stroke?: string;
  color?: string;
}

export const CustomTooltip = ({
  active,
  payload,
  label
}: TooltipProps<number, string> & { payload?: TooltipPayload[] }) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const formatValue = (value: number | undefined | null) => {
    if (value === undefined || value === null) return '';
    if (Math.abs(value) >= 1000) {
      return value.toLocaleString('en-US', { maximumFractionDigits: 2 });
    }
    if (Math.floor(value) !== value) {
      return value.toFixed(2);
    }
    return value.toString();
  };

  const getDotColor = (entry: TooltipPayload): string => {
    return entry.color || entry.fill || entry.stroke || '#8884d8';
  };

  return (
    <div className={styles.customTooltip}>
      <p className={styles.tooltipLabel}>{label}</p>
      {payload.map((entry, index) => (
        <div key={`item-${index}`} className={styles.tooltipItem}>
          <span
            className={styles.tooltipDot}
            style={{ backgroundColor: getDotColor(entry as TooltipPayload) }}
          ></span>
          <span className={styles.tooltipName}>{entry.name}: </span>
          <span className={styles.tooltipValue}>{formatValue(entry.value)}</span>
        </div>
      ))}
    </div>
  );
}; 