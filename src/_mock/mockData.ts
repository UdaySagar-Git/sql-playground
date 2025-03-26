export interface Column {
  name: string;
  type: string;
}

export interface Table {
  name: string;
  columns: Column[];
}

export interface Query {
  id: string;
  sql: string;
  displayName?: string;
  timestamp: Date;
}

export interface ResultRow {
  [key: string]: string | number;
}

export const mockTables: Table[] = [
  {
    name: "employees",
    columns: [
      { name: "id", type: "INTEGER" },
      { name: "name", type: "VARCHAR(100)" },
      { name: "title", type: "VARCHAR(50)" },
      { name: "department", type: "VARCHAR(50)" },
      { name: "hire_date", type: "DATE" },
      { name: "salary", type: "DECIMAL(10,2)" },
    ],
  },
  {
    name: "customers",
    columns: [
      { name: "id", type: "INTEGER" },
      { name: "name", type: "VARCHAR(100)" },
      { name: "email", type: "VARCHAR(100)" },
      { name: "country", type: "VARCHAR(50)" },
      { name: "phone", type: "VARCHAR(20)" },
      { name: "created_at", type: "TIMESTAMP" },
    ],
  },
  {
    name: "orders",
    columns: [
      { name: "id", type: "INTEGER" },
      { name: "customer_id", type: "INTEGER" },
      { name: "order_date", type: "DATE" },
      { name: "total_amount", type: "DECIMAL(10,2)" },
      { name: "status", type: "VARCHAR(20)" },
      { name: "shipping_address", type: "TEXT" },
    ],
  },
  {
    name: "products",
    columns: [
      { name: "id", type: "INTEGER" },
      { name: "name", type: "VARCHAR(100)" },
      { name: "price", type: "DECIMAL(10,2)" },
      { name: "category", type: "VARCHAR(50)" },
      { name: "stock", type: "INTEGER" },
      { name: "description", type: "TEXT" },
    ],
  },
];

export const mockQueries: Query[] = [
  {
    id: "1",
    sql: "SELECT * FROM employees;",
    displayName: "Get All Employees",
    timestamp: new Date("2024-03-26T10:00:00"),
  },
  {
    id: "2",
    sql: "SELECT * FROM customers WHERE country = 'INDIA';",
    displayName: "Indian Customers",
    timestamp: new Date("2024-03-26T10:15:00"),
  },
];

export const mockResults: ResultRow[] = [
  {
    id: 1,
    name: "person 1",
    title: "Developer",
    department: "Engineering",
    hire_date: "2023-01-15",
    salary: 75000,
  },
  {
    id: 2,
    name: "person 2",
    title: "Designer",
    department: "Design",
    hire_date: "2023-02-20",
    salary: 65000,
  },
  {
    id: 3,
    name: "person 3",
    title: "Manager",
    department: "Management",
    hire_date: "2023-03-10",
    salary: 85000,
  },
];
