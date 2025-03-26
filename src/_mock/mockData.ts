export interface Table {
  name: string;
  columns: string[];
}

export interface Query {
  id: string;
  sql: string;
  timestamp: Date;
}

export interface ResultRow {
  [key: string]: string | number;
}

export const mockTables: Table[] = [
  {
    name: "employees",
    columns: ["id", "name", "title", "department"],
  },
  {
    name: "customers",
    columns: ["id", "name", "email", "country"],
  },
  {
    name: "orders",
    columns: ["id", "customer_id", "order_date", "total_amount"],
  },
  {
    name: "products",
    columns: ["id", "name", "price", "category"],
  },
];

export const mockQueries: Query[] = [
  {
    id: "1",
    sql: "SELECT * FROM employees;",
    timestamp: new Date("2024-03-26T10:00:00"),
  },
  {
    id: "2",
    sql: "SELECT * FROM customers WHERE country = 'INDIA';",
    timestamp: new Date("2024-03-26T10:15:00"),
  },
];

export const mockResults: ResultRow[] = [
  { id: 1, name: "person 1", title: "Developer", department: "Engineering" },
  { id: 2, name: "person 2", title: "Designer", department: "Design" },
  { id: 3, name: "person 3", title: "Manager", department: "Management" },
];
