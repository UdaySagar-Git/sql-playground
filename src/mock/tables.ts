import { Table } from "@/types";

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
