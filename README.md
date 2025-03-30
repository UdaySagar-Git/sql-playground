# SQL Playground

Try the Demo : https://sql-playground.udaysagar.in/

## Overview

The SQLplayground is a high-performance, in-browser SQL execution tool built with Next.js. Designed to handle millions of rows efficiently, it leverages WebAssembly-based SQL.js for query execution and IndexedDB for data persistence. Optimized to prevent unnecessary re-renders, it is built with the intent to be easily integrated with any backend in the future.

## Architecture Overview

### Core Technologies

- **Next.js & React**: Frontend framework for UI development.
- **SQL.js**: Enables in-browser SQL execution.
- **Dexie.js (IndexedDB)**: Stores query history and saved queries locally.
- **React Query**: Manages state, caching, and background updates.
- **React-Virtuoso**: Implements virtualized rendering for handling large datasets efficiently.
- **Monaco Editor**: Provides a powerful SQL code editor.

### Data Flow

1. **Initial Load**:
   - Initializes the SQL.js instance.
   - Loads predefined mock tables into SQL.js.
   - Loads previously saved queries, query history, and tabs from local storage.
2. **Query Execution Flow**:
   - The user enters an SQL query.
   - SQL.js executes the query.
   - Results are paginated and displayed in a virtualized table.
   - The query is stored in history in IndexedDB.
3. **Data Persistence**:
   - IndexedDB stores saved queries and query history.
   - Local Storage retains tab states.
   - SQL.js handles in-memory tables, which reset upon reload.

<img src="docs/architecture.png" alt="SQL Playground Architecture" width="800">

## Key Features

- **In-browser SQL query execution** with SQL.js.
- **Pagination & Virtualized Rendering**: Ensures smooth interaction with large datasets.
- **Debounced Search**: Prevents unnecessary query execution while typing.
- **Infinite Scrolling**: Efficiently handles large lists of queries and history.
- **Query Editor**: A multi-tab SQL editor powered by Monaco Editor, featuring quick-run functionality with Ctrl/Cmd + Enter.
- **Table Descriptions**: Displays the number of rows and table columns along with their data types.
- **Query History and Saved Queries** for easy reference.
- **Charts for Detailed Analysis**.
- **Dark Mode Support**: Enhances user experience.
- **Responsive Mobile Design**: Ensures usability across devices.

## Performance Optimizations

- **Virtualized Rendering**: Uses `React-Virtuoso` to efficiently display large datasets.
- **State Management**: Utilizes `React Query` to reduce unnecessary re-renders and improve caching.
- **Debounced Search**: Enhances performance by reducing redundant queries while typing.
- **Infinite Scrolling**: Uses `Intersection Observer` for seamless cursor-based pagination.
- **Optimized Table Rendering**: Re-renders the table list only when a DDL/DML query affects the table schema.
- **Reduced Bundle Size**: Implements code splitting for optimal performance.
- **Background Initialization**: Initializes SQL.js during load time for better responsiveness.
- **Lazy Loading**: `lazy()` and `Suspense` load non-critical components asynchronously.
- **Optimized Re-renders**: Uses `useMemo` and `useCallback` to prevent unnecessary component updates.
- **Reusable Components**: Ensures maintainability and performance optimization.

## Project Structure

```
src/
├── actions/      # Handles business logic and database interactions
├── api/          # Provides hooks for data fetching and API communication
├── components/   # Contains modular UI components and reusable elements
├── hooks/        # Custom React hooks for shared logic
├── lib/          # Utility functions and core configurations
├── mock/         # Predefined mock data and table structures
├── providers/    # React context providers
├── app/          # Core application components and pages
├── styles/       # Global and module-specific styles
└── types/        # TypeScript type definitions
```

## Performance Benchmarks

| Metric                         | Value |
| ------------------------------ | ----- |
| First Contentful Paint (FCP)   | 0.4s  |
| Largest Contentful Paint (LCP) | 0.4s  |
| Total Blocking Time (TBT)      | 10ms  |
| Cumulative Layout Shift (CLS)  | 0.009 |
| Performance Score              | 99    |
| Accessibility Score            | 82    |
| Best Practices Score           | 89    |
| SEO Score                      | 100   |

<img src="docs/performance.png" alt="SQL Playground Performance Benchmarks" width="400">

## Tools Used for Performance Measurement

- **React Scan**: Analyzed component rendering performance.
- **Lighthouse**: Evaluated accessibility, performance, and SEO.
- **GTmetrix**: Measured load times and best practices.
- **Chrome DevTools**: Debugged performance bottlenecks.

## Missing Features (Planned Enhancements)

- Optimize performance by offloading SQL.js initialization and CSV export to a worker thread.
- **Advanced Filtering and Sorting**: Enable dynamic filtering and sorting of query results.
- **Data Import Support**: Allow users to import tables from CSV files.
- **User Authentication & Cloud Sync**: Enable saving queries across sessions and devices.
