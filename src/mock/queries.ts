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
  {
    id: "3",
    sql: "SELECT department, COUNT(*) as employee_count, AVG(salary) as avg_salary, MAX(salary) as highest_salary, MIN(salary) as lowest_salary \nFROM employees \nGROUP BY department \nORDER BY avg_salary DESC;",
    displayName: "Department Salary Analysis",
    timestamp: new Date("2024-03-26T10:30:00"),
  },
  {
    id: "4",
    sql: "SELECT c.name, c.country, COUNT(o.id) as order_count, SUM(o.total_amount) as total_spent \nFROM customers c \nLEFT JOIN orders o ON c.id = o.customer_id \nGROUP BY c.id \nHAVING order_count > 0 \nORDER BY total_spent DESC \nLIMIT 5;",
    displayName: "Top 5 Customers by Spending",
    timestamp: new Date("2024-03-26T10:45:00"),
  },
  {
    id: "5",
    sql: "SELECT p.category, p.name, p.price, \n(SELECT AVG(price) FROM products WHERE category = p.category) as category_avg \nFROM products p \nWHERE p.price > (SELECT AVG(price) FROM products) \nORDER BY (p.price - category_avg) DESC;",
    displayName: "Premium Products by Category",
    timestamp: new Date("2024-03-26T11:00:00"),
  },
  {
    id: "6",
    sql: "SELECT \n  SUBSTR(o.order_date, 1, 7) as month, \n  c.country, \n  COUNT(o.id) as order_count, \n  SUM(o.total_amount) as revenue \nFROM orders o \nJOIN customers c ON o.customer_id = c.id \nGROUP BY month, c.country \nORDER BY month ASC, revenue DESC;",
    displayName: "Monthly Revenue by Country",
    timestamp: new Date("2024-03-26T11:15:00"),
  },
  {
    id: "7",
    sql: "WITH customer_orders AS (\n  SELECT \n    c.id, \n    c.name, \n    COUNT(o.id) as order_count, \n    AVG(o.total_amount) as avg_order_value\n  FROM customers c\n  LEFT JOIN orders o ON c.id = o.customer_id\n  GROUP BY c.id\n)\nSELECT \n  co.name,\n  co.order_count,\n  co.avg_order_value,\n  CASE \n    WHEN co.order_count >= 2 THEN 'Loyal'\n    WHEN co.order_count = 1 THEN 'New'\n    ELSE 'Inactive'\n  END as customer_status\nFROM customer_orders co\nORDER BY co.order_count DESC, co.avg_order_value DESC;",
    displayName: "Customer Segmentation Analysis",
    timestamp: new Date("2024-03-26T11:30:00"),
  },
];
