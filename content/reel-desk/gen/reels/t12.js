module.exports = {
id: 't12', cat: 'sql', tag: 'SQL', kw: 'SQL20',
title: "If You Can't Answer These 20 SQL Questions, Don't Apply Yet",
sub: '20 SQL questions from real data analyst interviews, easy to hard, each with a working answer. Try each one before you read the answer.',
pages: [
 { h: 'The tables used', l: 'All 20 answers use these tables. Answers are in PostgreSQL syntax.', code:
`employees(emp_id, name, dept, salary, manager_id, hire_date)
orders(order_id, customer_id, order_date, amount, status)
customers(customer_id, name, city, signup_date)
logins(user_id, login_date)`,
   items: [['How to score','Count how many you solve without looking. The scoring guide is on the last page.']] },
 { h: 'Questions 1 to 4', l: 'Basics. Every round starts here.', items: [
   ['1. Employees earning above 50,000 in Sales','',"SELECT name, salary FROM employees\nWHERE dept = 'Sales' AND salary > 50000;"],
   ['2. Number of employees per department','','SELECT dept, COUNT(*) AS headcount\nFROM employees GROUP BY dept;'],
   ['3. Departments with average salary above 60,000','HAVING filters after grouping.','SELECT dept, AVG(salary) FROM employees\nGROUP BY dept HAVING AVG(salary) > 60000;'],
   ['4. Customers with no city recorded','= NULL never matches. Use IS NULL.','SELECT * FROM customers WHERE city IS NULL;'] ] },
 { h: 'Questions 5 to 8', l: 'Joins.', items: [
   ['5. Each order with the customer name','','SELECT o.order_id, c.name, o.amount\nFROM orders o\nJOIN customers c\n  ON c.customer_id = o.customer_id;'],
   ['6. Customers who never ordered','','SELECT c.* FROM customers c\nLEFT JOIN orders o\n  ON o.customer_id = c.customer_id\nWHERE o.order_id IS NULL;'],
   ['7. Employees with their manager\'s name','Self join. LEFT keeps the CEO who has no manager.','SELECT e.name, m.name AS manager\nFROM employees e\nLEFT JOIN employees m\n  ON m.emp_id = e.manager_id;'],
   ['8. Employees earning more than their manager','','SELECT e.name FROM employees e\nJOIN employees m\n  ON m.emp_id = e.manager_id\nWHERE e.salary > m.salary;'] ] },
 { h: 'Questions 9 to 12', l: 'Aggregation with logic.', items: [
   ['9. Revenue per city, highest first','','SELECT c.city, SUM(o.amount) AS revenue\nFROM orders o\nJOIN customers c USING (customer_id)\nGROUP BY c.city\nORDER BY revenue DESC;'],
   ['10. Delivered vs cancelled orders per month','',"SELECT DATE_TRUNC('month', order_date) AS m,\n  COUNT(*) FILTER\n    (WHERE status='Delivered') AS delivered,\n  COUNT(*) FILTER\n    (WHERE status='Cancelled') AS cancelled\nFROM orders\nGROUP BY 1 ORDER BY 1;"],
   ['11. Each city\'s share of total revenue %','',"SELECT c.city,\n  ROUND(100.0 * SUM(o.amount)\n    / SUM(SUM(o.amount)) OVER (), 1) AS pct\nFROM orders o\nJOIN customers c USING (customer_id)\nGROUP BY c.city;"],
   ['12. Duplicate customer names','','SELECT name, COUNT(*) FROM customers\nGROUP BY name HAVING COUNT(*) > 1;'] ] },
 { h: 'Questions 13 to 16', l: 'Window functions. The most asked topic.', items: [
   ['13. Second highest salary','','SELECT DISTINCT salary FROM (\n  SELECT salary, DENSE_RANK() OVER\n    (ORDER BY salary DESC) AS rk\n  FROM employees) t\nWHERE rk = 2;'],
   ['14. Top 2 earners per department','','SELECT * FROM (\n  SELECT *, DENSE_RANK() OVER (\n    PARTITION BY dept\n    ORDER BY salary DESC) AS rk\n  FROM employees) t\nWHERE rk <= 2;'],
   ['15. Running total of daily revenue','','SELECT order_date,\n  SUM(amount) AS day_rev,\n  SUM(SUM(amount)) OVER\n    (ORDER BY order_date) AS running\nFROM orders\nGROUP BY order_date;'],
   ['16. Each customer\'s first order','','SELECT * FROM (\n  SELECT *, ROW_NUMBER() OVER (\n    PARTITION BY customer_id\n    ORDER BY order_date) AS rn\n  FROM orders) t\nWHERE rn = 1;'] ] },
 { h: 'Questions 17 and 18', l: 'Hard. These decide senior vs junior.', items: [
   ['17. Month-on-month revenue growth %','',"WITH m AS (\n  SELECT DATE_TRUNC('month', order_date) AS mon,\n         SUM(amount) AS rev\n  FROM orders GROUP BY 1),\nl AS (\n  SELECT mon, rev,\n    LAG(rev) OVER (ORDER BY mon) AS prev\n  FROM m)\nSELECT mon,\n  ROUND(100.0 * (rev - prev) / prev, 1)\n    AS growth_pct\nFROM l;"],
   ['18. Users who logged in 3 days in a row','',"WITH d AS (\n  SELECT DISTINCT user_id, login_date\n  FROM logins),\ng AS (\n  SELECT user_id,\n    login_date - CAST(ROW_NUMBER() OVER (\n      PARTITION BY user_id\n      ORDER BY login_date) AS INT) AS grp\n  FROM d)\nSELECT DISTINCT user_id\nFROM g\nGROUP BY user_id, grp\nHAVING COUNT(*) >= 3;"] ],
   box: '<b>Q18 trick:</b> consecutive dates minus their row number give the same value, so each streak becomes one group.' },
 { h: 'Questions 19 and 20', l: 'Statistics in SQL and set logic.', items: [
   ['19. Median salary per department','',"SELECT dept,\n  PERCENTILE_CONT(0.5)\n    WITHIN GROUP (ORDER BY salary)\n    AS median_salary\nFROM employees\nGROUP BY dept;"],
   ['20. Customers who ordered in January but not February','',"SELECT customer_id FROM orders\nWHERE order_date >= '2026-01-01'\n  AND order_date <  '2026-02-01'\nEXCEPT\nSELECT customer_id FROM orders\nWHERE order_date >= '2026-02-01'\n  AND order_date <  '2026-03-01';"] ] },
 { h: 'Your score', l: 'Count the ones you solved without looking.', items: [
   ['17-20','Apply now. You are ahead of most candidates.'],
   ['12-16','Apply, and practise window functions (13-18) daily while you interview.'],
   ['8-11','Spend 2 weeks on joins and window functions first.'],
   ['Below 8','Work through the basics again. Re-take this test in 3 weeks.'] ],
   box: '<b>In the interview:</b> say your approach before writing. "I will rank salaries within each department, then filter to rank 2 or less."' },
]};
