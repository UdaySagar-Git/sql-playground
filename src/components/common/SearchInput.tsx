import { Search } from "lucide-react";
import styles from "./common.module.css";

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export const SearchInput = ({ value, onChange, placeholder = "Search..." }: SearchInputProps) => {
  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchInputWrapper}>
        <Search size={14} className={styles.searchIcon} />
        <input
          type="text"
          placeholder={placeholder}
          className={styles.searchInput}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
};