import styles from "./common.module.css";

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  className?: string;
}

export const Loading = ({ size = 'medium', text, className = '' }: LoadingProps) => {
  const sizeMap = {
    small: 16,
    medium: 24,
    large: 32
  };

  return (
    <div className={`${styles.loadingContainer} ${className}`}>
      <div
        className={styles.loadingSpinner}
        style={{
          width: sizeMap[size],
          height: sizeMap[size],
          borderWidth: size === 'small' ? 1 : 2
        }}
      />
      {text && <span className={styles.loadingText}>{text}</span>}
    </div>
  );
}; 