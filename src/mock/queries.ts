import { SavedQuery } from "@/types";

export const mockQueries: SavedQuery[] = [
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
