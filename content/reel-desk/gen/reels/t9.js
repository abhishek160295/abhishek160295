module.exports = {
id: 't9', cat: 'sql', tag: 'SQL + POWER BI', kw: 'RESTART26',
title: "If I Started Learning Power BI & SQL Again in 2026, I'd Do This First",
sub: 'The order I would learn in, the first 3 things I would do in week 1, what I would skip, and the one project that ties SQL and Power BI together.',
pages: [
 { h: 'The 3 things I would do first', l: 'Before any course. These set up everything else.', items: [
   ['1. Pick one real dataset and stick with it','A sales or e-commerce dataset with orders, customers and products. Use it for both SQL and Power BI, so you learn tools, not datasets.'],
   ['2. Write 10 business questions about it','"Which city brings the most revenue?" "Who stopped ordering?" Every lesson you take, use it to answer one of these.'],
   ['3. Install both tools on day 1','PostgreSQL (or MySQL) and Power BI Desktop. Load the same data into both.'] ],
   box: '<b>Why:</b> learning with your own questions makes the skill stick. Courses teach syntax. Questions teach the job.' },
 { h: 'The order: SQL first, then Power BI', l: 'Power BI is much easier once you can think in tables and joins.', items: [
   ['Weeks 1-2: SQL basics','SELECT, WHERE, GROUP BY, HAVING, ORDER BY. Answer 5 of your 10 questions.'],
   ['Weeks 3-4: SQL joins and windows','LEFT JOIN, anti join, CTEs, ROW_NUMBER, LAG. Answer the rest.'],
   ['Weeks 5-6: Power BI model and DAX','Load the same data, build a star schema, write 10 measures.'],
   ['Weeks 7-8: The project','One dashboard that answers your 10 questions, with SQL doing the heavy lifting.'] ] },
 { h: 'SQL: what to learn first', l: 'In this order. Each one builds on the last.', items: [
   ['Filtering and sorting','WHERE, IN, BETWEEN, LIKE, IS NULL, ORDER BY.'],
   ['Aggregation','COUNT, SUM, AVG with GROUP BY and HAVING.'],
   ['Joins','INNER, LEFT, and LEFT JOIN with IS NULL to find missing records.'],
   ['CTEs','Break long queries into named steps. Makes everything after this easier.'],
   ['Window functions','ROW_NUMBER, RANK, LAG, SUM() OVER. The most asked interview topic.'] ] },
 { h: 'Power BI: what to learn first', l: 'Skip fancy visuals. Learn the parts that make reports correct.', items: [
   ['Power Query','Clean types, remove duplicates, unpivot. Do cleaning here, not in DAX.'],
   ['Star schema','One fact table, dimension tables, one-to-many relationships, a Date table.'],
   ['Core DAX','SUM, DIVIDE, CALCULATE, ALL. Then time intelligence: YTD, last year, YoY %.'],
   ['6 visuals','Card, line, bar, matrix, slicer, line-and-column. Enough for almost every dashboard.'],
   ['Publish and share','Power BI Service, scheduled refresh, Row Level Security basics.'] ] },
 { h: 'What I would skip in 2026', l: 'Things that take time and rarely show up in analyst jobs or interviews.', items: [
   ['Memorising syntax','AI tools write syntax. Spend the time understanding what the query does and checking the result.'],
   ['Every DAX function','Learn 15 well. CALCULATE and filter context matter more than 100 functions.'],
   ['Database administration','Indexes and tuning are good to know later. Not needed to get your first analyst role.'],
   ['Certificates before a project','One strong project gets more interviews than three certificates.'] ] },
 { h: 'The one project that ties both together', l: 'This is what I would put first on my resume.', items: [
   ['SQL layer','Write views that clean and join raw tables: sales_clean, customer_summary, monthly_revenue.'],
   ['Power BI layer','Connect to those views. Build the star schema and 10 measures on top.'],
   ['The dashboard','KPI cards, revenue trend vs last year, revenue by region, top customers, churned customers.'],
   ['The write-up','A short README: 10 questions, the answers, and 3 recommendations for the business.'] ],
   box: '<b>Interview line:</b> "I did the heavy transformations in SQL views and kept DAX for business measures, so the model stays fast and simple."' },
 { h: 'How to use AI while learning', l: 'In 2026 this is a real advantage if you use it correctly.', items: [
   ['Write first, then ask','Write your query or measure, then ask AI to review it. Do not start by asking for the answer.'],
   ['Ask it to explain','"Explain line by line what this query does and when it would give a wrong result."'],
   ['Generate practice','"Give me 10 SQL questions on this schema, from easy to hard, without answers."'],
   ['Always check the numbers','AI can write a query that runs and returns the wrong total. Verify against a known figure.'] ] },
]};
