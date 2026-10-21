-- Shared practice schema every SQL snippet on a slide must run against (sqlite).
-- Table and column names here are the ones specs should use.
CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, dept TEXT, city TEXT, salary INTEGER, manager_id INTEGER, hire_date TEXT, email TEXT, phone TEXT);
INSERT INTO employees VALUES
 (1,'Asha','IT','Pune',72000,NULL,'2021-04-12','asha@corp.in','98200 11111'),
 (2,'Ravi','IT','Indore',61000,1,'2022-07-01','ravi@corp.in',NULL),
 (3,'Neha','HR','Pune',48000,1,'2020-01-20','neha@corp.in','98200 33333'),
 (4,'Imran','Sales','Lucknow',55000,1,'2023-02-15','imran@corp.in',NULL),
 (5,'Pooja','Sales','Indore',52000,4,'2023-09-03','pooja@corp.in','98200 55555'),
 (6,'Karan','IT','Jaipur',61000,1,'2024-01-10','karan@corp.in',NULL),
 (7,'Sneha','HR','Jaipur',45000,3,'2024-06-18','sneha@corp.in','98200 77777'),
 (8,'Vikas','Sales','Pune',58000,4,'2022-11-30','asha@corp.in',NULL);
CREATE TABLE customers (id INTEGER PRIMARY KEY, customer_id INTEGER, name TEXT, city TEXT, email TEXT, signup_date TEXT, phone TEXT);
INSERT INTO customers VALUES (1,1,'Amit','Pune','amit@mail.com','2024-01-05',NULL),(2,2,'Divya','Indore','divya@mail.com','2024-02-11','90000 22222'),
 (3,3,'Rahul','Kanpur','rahul@mail.com','2024-03-20',NULL),(4,4,'Meena','Pune','meena@mail.com','2024-04-02','90000 44444'),(5,5,'Sanjay','Bhopal','amit@mail.com','2024-05-15',NULL);
CREATE TABLE users AS SELECT id, name, city, email, phone, signup_date FROM customers;
CREATE TABLE products (id INTEGER PRIMARY KEY, product_id INTEGER, product TEXT, category TEXT, price REAL);
INSERT INTO products VALUES (1,1,'Pen','Stationery',10),(2,2,'Notebook','Stationery',60),(3,3,'Mouse','Electronics',450),(4,4,'Keyboard','Electronics',900);
CREATE TABLE orders (id INTEGER PRIMARY KEY, order_id INTEGER, customer_id INTEGER, user_id INTEGER, product_id INTEGER, order_date TEXT, amount REAL, qty INTEGER, status TEXT, region TEXT, city TEXT);
INSERT INTO orders VALUES
 (1,1,1,1,1,'2024-01-10',500,5,'Delivered','West','Pune'),
 (2,2,1,1,3,'2024-01-22',900,2,'Delivered','West','Pune'),
 (3,3,2,2,2,'2024-02-03',1200,20,'Cancelled','Central','Indore'),
 (4,4,2,2,4,'2024-02-14',1800,2,'Delivered','Central','Indore'),
 (5,5,3,3,1,'2024-03-01',300,30,'Returned','North','Kanpur'),
 (6,6,4,4,3,'2024-03-09',450,1,'Delivered','West','Pune'),
 (7,7,1,1,2,'2024-03-15',2400,40,'Delivered','West','Pune'),
 (8,8,2,2,3,'2024-04-02',1350,3,'Delivered','Central','Indore');
CREATE TABLE sales (id INTEGER PRIMARY KEY, sale_date TEXT, month TEXT, region TEXT, product TEXT, sales REAL, amount REAL, qty INTEGER);
INSERT INTO sales VALUES (1,'2024-01-15','2024-01','North','Pen',1000,1000,10),(2,'2024-02-15','2024-02','North','Pen',1200,1200,12),
 (3,'2024-03-15','2024-03','North','Pen',900,900,9),(4,'2024-01-15','2024-01','South','Mouse',4000,4000,8),(5,'2024-02-15','2024-02','South','Mouse',4500,4500,9),(6,'2024-03-15','2024-03','South','Mouse',5200,5200,10);
CREATE TABLE departments (id INTEGER PRIMARY KEY, dept TEXT, dept_name TEXT, head TEXT);
INSERT INTO departments VALUES (1,'IT','Information Technology','Asha'),(2,'HR','Human Resources','Neha'),(3,'Sales','Sales','Imran'),(4,'Finance','Finance',NULL);
