import { query as categoriesQuery } from "./categories";
import { query as customersQuery } from "./customers";
import { query as employeesQuery } from "./employees";
import { query as employee_territoriesQuery } from "./employee_territories";
import { query as ordersQuery } from "./orders";
import { query as order_detailsQuery } from "./order_details";
import { query as productsQuery } from "./products";
import { query as regionsQuery } from "./regions";
import { query as shippersQuery } from "./shippers";
import { query as suppliersQuery } from "./suppliers";
import { query as territoriesQuery } from "./territories";

export const sqlFiles = {
  categories: categoriesQuery,
  customers: customersQuery,
  employees: employeesQuery,
  employee_territories: employee_territoriesQuery,
  orders: ordersQuery,
  order_details: order_detailsQuery,
  products: productsQuery,
  regions: regionsQuery,
  shippers: shippersQuery,
  suppliers: suppliersQuery,
  territories: territoriesQuery,
};
