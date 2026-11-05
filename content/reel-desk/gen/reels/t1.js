module.exports = {
id: 't1', cat: 'sql', tag: 'SQL', kw: 'QUERIES',
title: 'Stop Memorizing 100 SQL Queries. These 10 Are Enough',
sub: '10 queries that cover most of what data analysts write at work and get asked in interviews. Each one with the problem, the query and why it matters.',
pages: [
 { h: 'Practise on this table', l: 'All 10 queries use these two tables. Create them once and run every query yourself.', code:
`orders(order_id, customer_id, order_date,
       amount, status)

customers(customer_id, name, city,
          signup_date)

employees(emp_id, name, dept,
          salary, manager_id)`,
   items: [['How to use this PDF','Read the problem, try writing the query yourself for 5 minutes, then compare.'],['Where to practise free','SQLite online, DB Fiddle, or the free tier of any cloud warehouse.']] },
 { h: 'Query 1 and 2', l: 'Aggregation and joins. The base of every report.', items: [
   ['1. Customers with more than 5 orders','WHERE filters rows before grouping. HAVING filters the groups after.','SELECT customer_id, COUNT(*) AS orders\nFROM orders\nGROUP BY customer_id\nHAVING COUNT(*) > 5;'],
   ['2. Customers who never ordered','LEFT JOIN keeps every customer. A NULL on the right side means no match.','SELECT c.customer_id, c.name\nFROM customers c\nLEFT JOIN orders o\n  ON o.customer_id = c.customer_id\nWHERE o.order_id IS NULL;'] ] },
 { h: 'Query 3 and 4', l: 'Window functions. The most asked topic in data analyst SQL rounds.', items: [
   ['3. Top 3 earners in each department','DENSE_RANK gives ties the same rank and does not skip numbers.','SELECT * FROM (\n  SELECT name, dept, salary,\n    DENSE_RANK() OVER (PARTITION BY dept\n      ORDER BY salary DESC) AS rk\n  FROM employees) t\nWHERE rk <= 3;'],
   ['4. Running total of revenue by day','Each row adds everything before it. Used in every growth dashboard.','SELECT order_date, SUM(amount) AS day_rev,\n  SUM(SUM(amount)) OVER (ORDER BY order_date)\n    AS running_rev\nFROM orders\nGROUP BY order_date;'] ] },
 { h: 'Query 5 and 6', l: 'Comparing periods and cleaning duplicates.', items: [
   ['5. Month on month revenue growth %','LAG reads the previous row. Divide by it to get growth.','WITH m AS (\n  SELECT DATE_TRUNC(\'month\', order_date) AS mon,\n         SUM(amount) AS rev\n  FROM orders GROUP BY 1)\nSELECT mon, rev,\n  ROUND(100.0 * (rev - LAG(rev) OVER (ORDER BY mon))\n    / LAG(rev) OVER (ORDER BY mon), 1) AS mom_pct\nFROM m;'],
   ['6. Keep only the latest row per customer','ROW_NUMBER numbers each row in a group. Keep number 1.','SELECT * FROM (\n  SELECT o.*, ROW_NUMBER() OVER (\n    PARTITION BY customer_id\n    ORDER BY order_date DESC) AS rn\n  FROM orders o) t\nWHERE rn = 1;'] ] },
 { h: 'Query 7 and 8', l: 'Turning rows into columns, and the classic interview opener.', items: [
   ['7. Delivered vs returned orders by city','CASE inside SUM counts only the rows that match. A pivot without PIVOT.','SELECT c.city,\n  SUM(CASE WHEN o.status = \'Delivered\' THEN 1 ELSE 0 END) AS delivered,\n  SUM(CASE WHEN o.status = \'Returned\'  THEN 1 ELSE 0 END) AS returned\nFROM orders o\nJOIN customers c USING (customer_id)\nGROUP BY c.city;'],
   ['8. Second highest salary','Works even when two people share the top salary.','SELECT DISTINCT salary FROM (\n  SELECT salary,\n    DENSE_RANK() OVER (ORDER BY salary DESC) AS rk\n  FROM employees) t\nWHERE rk = 2;'] ] },
 { h: 'Query 9', l: 'Streaks. Asked to check if you can think in patterns, not just syntax.', items: [
   ['9. Customers who ordered 3 days in a row','Date minus row number stays constant across a streak. Group by it.','WITH d AS (\n  SELECT DISTINCT customer_id, order_date FROM orders),\ng AS (\n  SELECT customer_id, order_date,\n    order_date - CAST(ROW_NUMBER() OVER (\n      PARTITION BY customer_id ORDER BY order_date)\n      AS INT) AS grp\n  FROM d)\nSELECT customer_id FROM g\nGROUP BY customer_id, grp\nHAVING COUNT(*) >= 3;'] ],
   box: '<b>Why it works:</b> dates 3, 4, 5 have row numbers 1, 2, 3. Date minus row number is 2 for all three, so they land in one group.' },
 { h: 'Query 10', l: 'Retention. The first metric any product or growth team asks an analyst for.', items: [
   ['10. Month 1 to month 2 retention','Of customers who signed up in a month, how many ordered the next month.','SELECT DATE_TRUNC(\'month\', c.signup_date) AS cohort,\n  COUNT(DISTINCT c.customer_id) AS signed_up,\n  COUNT(DISTINCT o.customer_id) AS came_back\nFROM customers c\nLEFT JOIN orders o\n  ON o.customer_id = c.customer_id\n AND DATE_TRUNC(\'month\', o.order_date) =\n     DATE_TRUNC(\'month\', c.signup_date) + INTERVAL \'1 month\'\nGROUP BY 1;'] ],
   box: '<b>Retention % =</b> came_back ÷ signed_up × 100. Present it as a cohort table, one row per signup month.' },
 { h: 'What these 10 cover', l: 'Learn the pattern behind each query, not the exact text. Most interview questions are one of these in a new costume.', items: [
   ['Filter groups','Query 1 (HAVING)'],['Find missing records','Query 2 (anti join)'],['Rank within groups','Queries 3 and 8'],['Running and period comparisons','Queries 4 and 5'],['Deduplicate','Query 6'],['Pivot','Query 7'],['Streaks and retention','Queries 9 and 10'] ],
   box: '<b>Syntax note:</b> date functions differ by database. DATE_TRUNC and INTERVAL are PostgreSQL. In MySQL use DATE_FORMAT and DATE_ADD.' },
]};
