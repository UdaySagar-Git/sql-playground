<!-- source:
https://github.com/graphql-compose/graphql-compose-examples/tree/master/examples/northwind/data/csv -->

### Employees

- Has Territories []

### Customers

- Has Order []

### Orders

- Has Order-Details []
- Has CustomerID
- Has EmployeeID
- Has ShipperID "ShipVia"

### Order-Details

- Has OrderID
- Has ProductID

### Products

- Has SupplierID
- Has CategoryID

### Territories

- Has RegionID
