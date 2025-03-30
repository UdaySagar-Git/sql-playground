export const QUERY_KEYS = {
  SAVED_QUERIES: "savedQueries",
  QUERY_HISTORY: "queryHistory",
  QUERY_RESULTS: "queryResults",
  TABLES: "tables",
  TABS: "tabs",
  CURRENT_TAB_ID: "currentTabId",
};

export const LOCAL_STORAGE_TABS_KEY = "sql-query-tabs";
export const LOCAL_STORAGE_ACTIVE_TAB_KEY = "sql-query-active-tab";

export const SAMPLE_QUERY1 = "SELECT * FROM employees;";

export const SAMPLE_QUERY2 = `-- Create a employees table
DROP TABLE IF EXISTS employees;
CREATE TABLE employees (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  department TEXT,
  salary NUMERIC,
  hire_date DATE
);

-- Populate table with sample data
INSERT INTO employees (name, department, salary, hire_date) VALUES
  ('Alice Smith', 'Engineering', 85000, '2020-01-15'),
  ('Bob Johnson', 'Marketing', 72000, '2019-03-20'),
  ('Carol Williams', 'Engineering', 92000, '2018-11-07'),
  ('Dave Brown', 'Finance', 115000, '2017-05-12'),
  ('Eve Davis', 'Engineering', 110000, '2021-08-30');

-- Query the data
SELECT 
  department, 
  COUNT(*) as employee_count,
  ROUND(AVG(salary), 2) as avg_salary
FROM employees
GROUP BY department
ORDER BY avg_salary DESC;`;

export const SAMPLE_QUERY3 = `-- Drop table if exists
DROP TABLE IF EXISTS categories;

-- Create categories table
CREATE TABLE categories (
  category_id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_name TEXT NOT NULL,
  type TEXT,
  budget NUMERIC,
  created_date DATE
);

-- Populate table with 100000 rows
WITH RECURSIVE generate_series(id) AS (
  SELECT 1
  UNION ALL
  SELECT id + 1 FROM generate_series WHERE id < 100000
)
INSERT INTO categories (category_name, type, budget, created_date)
SELECT 
  'Category ' || id, 
  'Type ' || (id % 5), 
  10000, 
  '2020-01-01'
FROM generate_series;

-- Query the data
SELECT * FROM categories;`;
