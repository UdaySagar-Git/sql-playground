DROP TABLE IF EXISTS shippers;

CREATE TABLE shippers (
    shipperID	VARCHAR(512),
    companyName	VARCHAR(512),
    phone	VARCHAR(512)
);

INSERT INTO shippers (shipperID, companyName, phone) VALUES
	('1', 'Speedy Express', '(503) 555-9831'),
	('2', 'United Package', '(503) 555-3199'),
	('3', 'Federal Shipping', '(503) 555-9931');