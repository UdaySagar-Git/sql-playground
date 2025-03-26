import styles from "./tableList.module.css";

interface Table {
  name: string;
  columns: string[];
}

interface TableListProps {
  tables: Table[];
  onTableSelect: (tableName: string) => void;
}

export const TableList = ({ tables, onTableSelect }: TableListProps) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Tables</h2>
      <div className={styles.list}>
        {tables.map((table) => (
          <button
            key={table.name}
            className={styles.tableItem}
            onClick={() => onTableSelect(table.name)}
          >
            {table.name}
          </button>
        ))}
      </div>
    </div>
  );
}; 