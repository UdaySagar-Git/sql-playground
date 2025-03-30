DROP TABLE IF EXISTS regions;

CREATE TABLE regions (
    regionID	INT,
    regionDescription	VARCHAR(512)
);

INSERT INTO regions (regionID, regionDescription) VALUES
	('1', 'Eastern'),
	('2', 'Western'),
	('3', 'Northern'),
	('4', 'Southern');