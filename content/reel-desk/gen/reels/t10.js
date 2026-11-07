module.exports = {
id: 't10', cat: 'sql', tag: 'SQL', kw: 'SQL30',
title: "If I Have 0 Knowledge of SQL, This Is How I'd Get Job-Ready in 30 Days",
sub: 'A day-by-day 30-day plan from zero to interview-ready SQL. 1 to 1.5 hours a day. Each day has a topic and a practice task.',
pages: [
 { h: 'Before day 1', l: 'Set this up once. It takes 30 minutes.', items: [
   ['Pick one database','PostgreSQL (free) or MySQL. Do not switch midway.'],
   ['Get a practice dataset','A sample sales or e-commerce database with customers, orders, products.'],
   ['Rule for every day','Write every query yourself. Reading solutions does not count.'],
   ['Keep a notebook','Every mistake and its fix. This becomes your revision sheet for interviews.'] ] },
 { h: 'Week 1: Days 1 to 7', l: 'Reading data. By day 7 you can answer simple business questions.', items: [
   ['Day 1','SELECT, FROM, LIMIT. Task: show 10 orders with chosen columns.'],
   ['Day 2','WHERE with =, >, <, AND, OR. Task: orders above ₹5,000 from Mumbai.'],
   ['Day 3','IN, BETWEEN, LIKE, IS NULL. Task: customers with missing email.'],
   ['Day 4','ORDER BY, DISTINCT. Task: list unique cities, sorted.'],
   ['Day 5','COUNT, SUM, AVG, MIN, MAX. Task: total revenue and average order value.'],
   ['Day 6','GROUP BY. Task: revenue by city.'],
   ['Day 7','HAVING plus revision. Task: cities with more than 100 orders.'] ] },
 { h: 'Week 2: Days 8 to 14', l: 'Joins and logic. This is where most real work happens.', items: [
   ['Day 8','INNER JOIN. Task: each order with customer name.'],
   ['Day 9','LEFT JOIN. Task: all customers with their order count, including zero.'],
   ['Day 10','Anti join (LEFT JOIN + IS NULL). Task: customers who never ordered.'],
   ['Day 11','Joining 3 tables. Task: revenue by product category by city.'],
   ['Day 12','CASE WHEN. Task: label orders Small, Medium, Large.'],
   ['Day 13','Date functions. Task: revenue by month and by weekday.'],
   ['Day 14','Revision. Solve 10 mixed questions without help.'] ] },
 { h: 'Week 3: Days 15 to 21', l: 'Intermediate SQL. This is what separates you in interviews.', items: [
   ['Day 15','Subqueries. Task: orders above the average order value.'],
   ['Day 16','CTEs (WITH). Task: rewrite day 15 as a CTE.'],
   ['Day 17','ROW_NUMBER, RANK, DENSE_RANK. Task: top 3 products per category.'],
   ['Day 18','Running totals with SUM() OVER. Task: cumulative revenue by day.'],
   ['Day 19','LAG and LEAD. Task: month-on-month revenue growth %.'],
   ['Day 20','Deduplication with ROW_NUMBER. Task: keep the latest row per customer.'],
   ['Day 21','Revision. 10 window function questions.'] ] },
 { h: 'Week 4: Days 22 to 30', l: 'Interview prep and one project to show.', items: [
   ['Days 22-23','Classic questions: second highest salary, duplicates, employee earning more than manager.'],
   ['Days 24-25','Business metrics: retention, repeat customers, conversion by funnel step.'],
   ['Days 26-27','Project: 8 business questions on one dataset, answered in SQL, with a short write-up.'],
   ['Day 28','Put the project on GitHub with a README showing each question and insight.'],
   ['Day 29','Timed practice: 5 medium questions in 60 minutes.'],
   ['Day 30','Mock interview. Explain your thinking out loud while solving.'] ] },
 { h: 'Job-ready means you can do this', l: 'Check these on day 30. If you can, start applying.', items: [
   ['Write joins without checking syntax','Including LEFT JOIN with IS NULL.'],
   ['Use GROUP BY with HAVING correctly','And explain the difference from WHERE.'],
   ['Solve top N per group','With DENSE_RANK in a subquery or CTE.'],
   ['Calculate growth and running totals','With LAG and SUM() OVER.'],
   ['Explain one project end to end','The business question, your queries and what you found.'] ],
   box: '<b>If you miss a day,</b> do not double up. Move the plan by one day. Consistency matters more than speed.' },
]};
