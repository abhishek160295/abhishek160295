// Reel-friendly PDFs: 9:16 pages, huge type, 5 pages each (cover + 4).
const { chromium } = require('playwright');
const path = require('path');
const OUT = path.join(__dirname, '..', 'reel', 'pdfs');

const css = `
@page{size:1080px 1920px;margin:0}
*{box-sizing:border-box;margin:0}
body{font-family:Helvetica,Arial,sans-serif;background:#0b0b0b;color:#fff}
.pg{width:1080px;height:1920px;padding:100px 84px 130px;display:flex;flex-direction:column;page-break-after:always;position:relative;overflow:hidden}
.pg:last-child{page-break-after:auto}
.n{font-size:30px;color:#888;letter-spacing:.1em;font-weight:700}
.tag{align-self:flex-start;background:#FFD21F;color:#0b0b0b;font-weight:900;font-size:38px;letter-spacing:.08em;padding:12px 26px;border-radius:10px}
.cover h1{font-size:124px;line-height:1.02;font-weight:900;color:#FFD21F;margin:auto 0 40px}
.cover p{font-size:48px;line-height:1.35;color:#e8e8e8}
.cover ul{margin:50px 0 auto;gap:22px}
.cover li{font-size:42px}
h2{font-size:78px;line-height:1.05;font-weight:900;color:#FFD21F;margin:auto 0 14px}
.sp{margin-bottom:auto}
.lead{font-size:38px;line-height:1.35;color:#cfcfcf;margin-bottom:40px}
ul{list-style:none;padding:0;display:flex;flex-direction:column;gap:38px}
li{font-size:46px;line-height:1.2;font-weight:800;padding-left:48px;position:relative}
li::before{content:"";position:absolute;left:0;top:14px;width:22px;height:22px;background:#FFD21F;border-radius:4px}
li .e{display:block;font-size:35px;line-height:1.35;font-weight:400;color:#d0d0d0;margin-top:8px}
li code,.e code{display:block;font-family:Menlo,Consolas,monospace;font-size:32px;font-weight:400;color:#FFE27A;background:#1a1a1a;border-radius:8px;padding:12px 16px;margin-top:12px;white-space:pre-wrap}
.code{background:#1a1a1a;border-left:8px solid #FFD21F;border-radius:10px;padding:28px 30px;font-family:Menlo,Consolas,monospace;font-size:34px;line-height:1.4;white-space:pre-wrap;color:#fff;margin:6px 0 30px}
.box{background:#FFD21F;color:#0b0b0b;border-radius:12px;padding:28px 32px;font-size:36px;line-height:1.35;font-weight:600;margin-top:44px}
.box b{font-weight:900}
.brand{position:absolute;bottom:52px;left:84px;right:84px;display:flex;justify-content:space-between;font-size:30px;color:#888;font-weight:700}
.brand b{color:#FFD21F}
`;
const page = (i, inner) => `<section class="pg"><div class="n">${String(i).padStart(2,'0')} / 05</div>${inner}<div class="brand"><b>@thedataguy16</b><span>Save · Share</span></div></section>`;
const list = items => `<ul>${items.map(([t, e, c]) => `<li>${t}${e ? `<span class="e">${e}</span>` : ''}${c ? `<code>${c}</code>` : ''}</li>`).join('')}</ul>`;
const box = h => `<div class="box">${h}</div>`;
const doc = (tag, title, sub, inside, pages) => `<html><head><meta charset="utf-8"><style>${css}</style></head><body>
<section class="pg cover"><div class="tag">${tag}</div><h1>${title}</h1><p>${sub}</p><ul>${inside.map(x => `<li>${x}</li>`).join('')}</ul><div class="brand"><b>@thedataguy16</b><span>Swipe →</span></div></section>
${pages.map((p, i) => page(i + 2, `<h2>${p[0]}</h2><p class="lead">${p[1]}</p>${p[2]}<div class="sp"></div>`)).join('')}</body></html>`;

const docs = {
sql: doc('SQL', 'SQL Interview Pack', '8 patterns behind most SQL interview questions. Learn the pattern once, solve 50 questions with it.',
 ['8 patterns with ready queries', 'The JOIN mistake that doubles rows', 'Order of execution, explained'],
 [
 ['Patterns 1 to 4', 'Window functions. If you know these, you clear most product and service company rounds.', list([
  ['Top N per group', 'Top 3 salaries in each department. DENSE_RANK keeps ties.', 'DENSE_RANK() OVER (PARTITION BY dept\n  ORDER BY salary DESC) AS rk  -- then WHERE rk &lt;= 3'],
  ['Running total', 'Cumulative revenue by date.', 'SUM(amount) OVER (ORDER BY order_date)'],
  ['Month on month change', 'Compare each row with the previous one.', 'revenue - LAG(revenue) OVER (ORDER BY month)'],
  ['Remove duplicates', 'Keep only the latest row per email.', 'ROW_NUMBER() OVER (PARTITION BY email\n  ORDER BY created_at DESC)  -- keep rn = 1'],
 ])],
 ['Patterns 5 to 8', 'Joins and conditional logic. These separate a fresher answer from an experienced one.', list([
  ['Consecutive days', 'Users who logged in 3 days in a row. Same streak = same group value.', 'login_date - ROW_NUMBER() OVER (\n  PARTITION BY user_id ORDER BY login_date)'],
  ['Find what is missing', 'Customers who never ordered.', 'LEFT JOIN orders o ON o.cust_id = c.id\nWHERE o.id IS NULL'],
  ['Pivot without PIVOT', 'Turn status rows into columns.', "SUM(CASE WHEN status='Returned' THEN 1 ELSE 0 END)"],
  ['Self join', 'Employees who earn more than their manager.', 'JOIN employees m ON e.manager_id = m.id\nWHERE e.salary &gt; m.salary'],
 ])],
 ['Your JOIN doubled the rows', 'Most asked debugging question. The answer is almost always duplicate keys.', `<div class="code">-- Step 1: find the duplicate keys
SELECT customer_id, COUNT(*)
FROM orders
GROUP BY customer_id
HAVING COUNT(*) &gt; 1;</div>` + list([
  ['Why it happens', '1 row on the left matches 3 rows on the right, so you get 3 rows back. Sums get inflated.'],
  ['Fix 1: aggregate first', 'GROUP BY on the right table, then join.'],
  ['Fix 2: deduplicate', 'Use ROW_NUMBER() and keep rn = 1 before joining.'],
 ])],
 ['Order of execution', 'SQL does not run top to bottom. Knowing this answers 5 common questions at once.', `<div class="code">1 FROM / JOIN     5 SELECT
2 WHERE           6 DISTINCT
3 GROUP BY        7 ORDER BY
4 HAVING          8 LIMIT</div>` + list([
  ['Alias fails in WHERE', 'SELECT runs after WHERE, so the alias does not exist yet.'],
  ['WHERE vs HAVING', 'WHERE filters rows before grouping. HAVING filters groups after.'],
  ['Alias works in ORDER BY', 'ORDER BY runs after SELECT.'],
 ])],
 ]),

excel: doc('EXCEL', 'Excel for Data Analysts', 'The functions that cover daily analyst work, plus the 2 debugging questions every interviewer asks.',
 ['8 functions with real examples', 'The #N/A checklist', 'Why SUM shows 0'],
 [
 ['Lookup and summarise', 'This is 70% of Excel work in any analyst job.', list([
  ['XLOOKUP', 'Looks left or right, handles "not found" on its own. Replaces VLOOKUP.', '=XLOOKUP(A2, Emp[ID], Emp[Name], "Not found")'],
  ['SUMIFS', 'Sum with any number of conditions.', '=SUMIFS(Sales, Region, "North", Month, "Mar")'],
  ['COUNTIFS', 'Count with conditions. Great for open tickets per owner.', '=COUNTIFS(Status, "Open", Owner, G2)'],
  ['IFS', 'Clean buckets without nesting 5 IFs.', '=IFS(B2&gt;=90,"A", B2&gt;=75,"B", TRUE,"C")'],
 ])],
 ['Clean and shape', 'Raw data is never clean. These save hours every week.', list([
  ['TRIM + CLEAN', 'Removes extra and invisible spaces that break lookups.', '=TRIM(CLEAN(A2))'],
  ['TEXTSPLIT', 'Split "Delhi, North, 2026" into 3 columns.', '=TEXTSPLIT(A2, ", ")'],
  ['UNIQUE + FILTER', 'Live lists that update when data changes.', '=FILTER(Data, Data[Sales] &gt; 50000)'],
  ['TEXT', 'Turn dates into readable labels for reports.', '=TEXT(A2, "mmm-yy")'],
 ])],
 ['VLOOKUP shows #N/A', 'Interviewers ask this to see if you have worked with real data. Check in this order.', list([
  ['1. Hidden spaces', '"A101 " and "A101" do not match. Wrap the lookup value.', '=VLOOKUP(TRIM(A2), Range, 2, FALSE)'],
  ['2. Number stored as text', 'One side is 101, the other is "101". Green triangle in the corner gives it away. Fix with VALUE or Text to Columns.'],
  ['3. Range not locked', 'Range shifts when copied down. Use $A$2:$C$500 or a Table.'],
  ['4. Missing FALSE', 'Without it Excel does an approximate match.'],
 ])],
 ['SUM shows 0', 'The numbers are there, the total is 0. Three causes, in order of how often I see them.', list([
  ['Numbers stored as text', 'Left aligned, green triangle. Select the column, Data, Text to Columns, Finish.'],
  ['Calculation is Manual', 'Someone switched it to speed up a big file. Formulas, Calculation Options, Automatic.'],
  ['Circular reference', 'The SUM range includes its own cell. Status bar shows the cell address.'],
 ]) + box('<b>Interview tip:</b> say the checks in order. It shows you have debugged real files, not just practised clean data.')],
 ]),

powerbi: doc('POWER BI', 'Power BI Interview Notes', 'The model, the DAX and the concepts that come up in every Power BI round.',
 ['Star schema, explained simply', '6 DAX measures you will reuse', 'Top questions with answers'],
 [
 ['Model it right', 'Most slow or wrong reports are a modelling problem, not a DAX problem.', list([
  ['Star schema', 'One fact table (Sales) in the middle. Dimension tables (Date, Product, Customer) around it.'],
  ['One-to-many, single direction', 'Filters flow from dimension to fact. Avoid both-direction filters unless you must.'],
  ['Always add a Date table', 'Mark it as a date table. Time intelligence functions need it.', "Date = CALENDAR(DATE(2024,1,1), DATE(2026,12,31))"],
 ])],
 ['6 measures you will reuse', 'Write these once and you can build most business dashboards.', `<div class="code">Total = SUM(Sales[Amount])

North = CALCULATE([Total], Region[Name]="North")

% of Total = DIVIDE([Total],
    CALCULATE([Total], ALL(Region)))

Sales LY = CALCULATE([Total],
    SAMEPERIODLASTYEAR('Date'[Date]))

YoY % = DIVIDE([Total] - [Sales LY], [Sales LY])

YTD = TOTALYTD([Total], 'Date'[Date])</div>` + box('<b>DIVIDE</b> instead of "/" returns blank instead of an error when the bottom is 0.')],
 ['Concepts they test', 'Know the one line answer, then give an example.', list([
  ['Measure vs calculated column', 'Column: computed row by row at refresh, stored, used for slicing. Measure: computed at query time, used for totals and KPIs.'],
  ['Row context vs filter context', 'Row context is the current row. Filter context is what slicers, visuals and CALCULATE have filtered.'],
  ['SUM vs SUMX', 'SUMX calculates row by row first, then adds. Use it for Qty × Price.', 'SUMX(Sales, Sales[Qty] * Sales[Price])'],
 ])],
 ['Most asked questions', 'Prepare a 2 line answer for each.', list([
  ['What does CALCULATE do?', 'Changes the filter context, then evaluates the expression.'],
  ['Import vs DirectQuery', 'Import is fast, data is copied. DirectQuery is live, slower, for very large or real-time data.'],
  ['Row Level Security', 'Roles with DAX filters so each manager sees only their region.'],
  ['Slow report?', 'Fewer visuals per page, remove unused columns, measures over calculated columns, star schema.'],
 ])],
 ]),

python: doc('PYTHON', 'Python for Data Analysts', 'Only the Pandas you need for analyst work, mapped to SQL you already know, with a 30-day plan.',
 ['Load, clean and analyse in 10 lines', 'SQL to Pandas cheat table', '30-day plan from zero'],
 [
 ['Load and clean', 'First 5 minutes with any new dataset. Run these before any analysis.', `<div class="code">import pandas as pd
df = pd.read_csv("sales.csv")

df.shape          # rows, columns
df.info()         # types and nulls
df.describe()     # quick stats
df.isna().sum()   # nulls per column

df = df.drop_duplicates()
df["date"] = pd.to_datetime(df["date"])
df["amount"] = df["amount"].fillna(0)</div>` + box('<b>Check dtypes first.</b> Numbers read as text are the #1 reason a groupby gives wrong totals.')],
 ['Analyse', 'These 4 lines answer most business questions.', list([
  ['Filter', 'North region orders above ₹5,000.', 'df.query("region == \'North\' and amount &gt; 5000")'],
  ['Group and summarise', 'Revenue and order count by region.', 'df.groupby("region").agg(\n  revenue=("amount","sum"), orders=("id","count"))'],
  ['Join', 'Add customer details to orders.', 'pd.merge(orders, customers, on="cust_id", how="left")'],
  ['Pivot', 'Region by month table.', 'df.pivot_table(index="region",\n  columns="month", values="amount", aggfunc="sum")'],
 ])],
 ['SQL to Pandas', 'If you know SQL, you already know 80% of Pandas.', list([
  ['WHERE', '', 'df[df.amount &gt; 500]   or   df.query()'],
  ['GROUP BY', '', 'df.groupby("col").agg(...)'],
  ['JOIN', '', 'pd.merge(a, b, on="id", how="left")'],
  ['UNION ALL', '', 'pd.concat([a, b])'],
  ['ORDER BY ... DESC', '', 'df.sort_values("amount", ascending=False)'],
  ['ROW_NUMBER', '', 'df.groupby("g").cumcount() + 1'],
 ])],
 ['30 days from zero', 'One hour a day is enough. The project at the end matters more than the course.', list([
  ['Days 1-5: Python basics', 'Variables, lists, dictionaries, loops, functions. Skip classes for now.'],
  ['Days 6-17: Pandas', 'Load, clean, filter, groupby, merge, pivot, dates.'],
  ['Days 18-22: Charts', 'Bar, line, histogram with Matplotlib or Seaborn.'],
  ['Days 23-30: One project', 'Real dataset, 5 business questions answered, pushed to GitHub with a clear README.'],
 ])],
 ]),

stats: doc('STATISTICS', 'Statistics Cheat Sheet', 'The concepts interviewers ask, each explained the way you would say it to a manager.',
 ['Core concepts in plain words', 'Which test to use, when', 'A/B testing step by step'],
 [
 ['The basics', 'You will use these every week, not just in interviews.', list([
  ['Mean vs median', 'Use median when data is skewed. Average salary in a team with one CEO is misleading. Median is not.'],
  ['Standard deviation', 'How spread out values are. Small SD means values sit close to the average.'],
  ['68 · 95 · 99.7 rule', 'In a normal distribution, that share of values falls within 1, 2 and 3 standard deviations.'],
  ['Outliers (IQR rule)', 'Below Q1 − 1.5×IQR or above Q3 + 1.5×IQR.'],
 ])],
 ['Hypothesis testing', 'The most asked stats topic. Learn to explain p-value without jargon.', list([
  ['Null hypothesis', 'The default claim: nothing changed. The new button did not change conversion.'],
  ['p-value', 'If nothing really changed, how likely is a result this big? Below 0.05 usually means significant.'],
  ['Type I error', 'False alarm. You say the button worked when it did not.'],
  ['Type II error', 'Missed it. The button worked but your test did not detect it. Usually too small a sample.'],
 ])],
 ['Which test to use', 'Pick by what you are comparing.', list([
  ['Two group averages', 't-test. Average order value, app A vs app B.'],
  ['Three or more averages', 'ANOVA. Average spend across 4 cities.'],
  ['Two categories related?', 'Chi-square. Is gender related to product choice?'],
  ['Two conversion rates', 'Two-proportion z-test. Old checkout 3.1% vs new 3.6%.'],
  ['Two numbers related?', 'Correlation, then regression. Ad spend vs sales.'],
 ])],
 ['A/B testing in 6 steps', 'Asked at every product company. Say the steps in this order.', list([
  ['1. One primary metric', 'For example checkout conversion rate.'],
  ['2. Sample size first', 'Decide significance (0.05), power (80%) and the smallest lift you care about.'],
  ['3. Random split', 'Users, not sessions, so one person sees one version.'],
  ['4. Run full weeks', 'Weekday and weekend behaviour differ. Do not stop early when it looks good.'],
  ['5-6. Test and check guardrails', 'Significant? Then make sure revenue or retention did not drop.'],
 ])],
 ]),

ml: doc('DATA SCIENCE', 'Machine Learning Starter Pack', 'The algorithms, metrics and concepts that cover most entry-level data science interviews.',
 ['7 algorithms and when to use each', 'The 99% accuracy trap', '60-day plan from zero'],
 [
 ['7 algorithms', 'You do not need 40. These cover most real tabular data problems.', list([
  ['Linear Regression', 'Predict a number. Next month sales.'],
  ['Logistic Regression', 'Predict yes or no. Will this customer churn?'],
  ['Decision Tree', 'Easy to explain to business. Clear if-then rules.'],
  ['Random Forest', 'Many trees voting. Strong first model on most datasets.'],
  ['XGBoost / LightGBM', 'Usually the best accuracy on tabular data.'],
  ['K-Means', 'Group similar customers when there is no label.'],
  ['KNN', 'Predict from the nearest similar records. Simple baseline.'],
 ])],
 ['Pick the right metric', 'Accuracy alone can lie. Choose by what a mistake costs.', list([
  ['Precision', 'Of everything flagged, how much was right? Use when false alarms are costly, like spam.'],
  ['Recall', 'Of all real cases, how many did we catch? Use when missing one is costly, like fraud or disease.'],
  ['F1 score', 'Balance of precision and recall.'],
  ['RMSE / MAE', 'Average error when predicting a number. MAE is easier to explain.'],
 ])],
 ['"99% accurate. Why is that bad?"', 'A favourite interview question. Here is the full answer.', list([
  ['The trap', 'If 1% of transactions are fraud, a model that always says "not fraud" is 99% accurate and catches zero fraud.'],
  ['What to check', 'Confusion matrix, recall and precision on the fraud class.'],
  ['How to fix', 'Class weights, oversampling (SMOTE), or lowering the decision threshold.'],
 ]) + `<div class="code">RandomForestClassifier(class_weight="balanced")</div>`],
 ['60 days from zero', 'Two projects at the end are worth more than five certificates.', list([
  ['Days 1-10: Python and Pandas', 'Load, clean, group, merge, plot.'],
  ['Days 11-20: Statistics', 'Distributions, hypothesis testing, regression.'],
  ['Days 21-45: Scikit-learn', 'The 7 algorithms, train-test split, cross-validation, metrics.'],
  ['Days 46-60: Two projects', 'Churn prediction and customer segmentation, each with a business recommendation.'],
 ])],
 ]),

career: doc('CAREER', 'Data Career Playbook', 'Salary, the switch plan and what interviewers actually look for, from 14 years in data.',
 ['Salary bands in India', 'What moves you from ₹4 to ₹15 LPA', '90-day plan for career switchers'],
 [
 ['Salary bands in India', 'Indicative ranges. City, company type and domain change these a lot.', list([
  ['0-2 years', 'Data Analyst ₹4-8 LPA · Data Scientist ₹6-12 LPA'],
  ['2-5 years', 'Data Analyst ₹8-15 LPA · Data Scientist ₹12-25 LPA'],
  ['5-8 years', 'Data Analyst ₹15-25 LPA · Data Scientist ₹25-40 LPA'],
  ['8+ years', 'Analytics Lead ₹25-45 LPA · Lead Data Scientist ₹40-70 LPA'],
  ['Company type', 'Product companies and GCCs often pay 1.5 to 2 times a service company at the same experience.'],
 ]) + box('<b>Biggest jump</b> usually comes from switching companies at 2-3 years with strong projects, not from waiting for appraisals.')],
 ['₹4 LPA to ₹15 LPA', 'The skills are not the only difference. How you show them matters as much.', list([
  ['SQL beyond basics', 'Window functions, CTEs, and explaining query logic out loud.'],
  ['One BI tool done properly', 'Power BI with a clean data model and DAX, not just drag and drop.'],
  ['Talk in impact', '"Cut weekly reporting from 6 hours to 20 minutes" beats "built a dashboard".'],
  ['Pick a domain', 'BFSI, e-commerce or supply chain. Domain knowledge gets you paid more.'],
 ])],
 ['90-day switch plan', 'For non-tech or non-data backgrounds. 1.5 to 2 hours a day.', list([
  ['Weeks 1-3: Excel', 'Lookups, pivots, one sales dashboard.'],
  ['Weeks 4-7: SQL', '50 questions using the 8 patterns.'],
  ['Weeks 8-10: Power BI', 'One end-to-end report with a star schema.'],
  ['Weeks 11-12: Python + stats', 'One EDA notebook on a real dataset.'],
  ['Week 13: Apply', 'Resume with numbers, LinkedIn updated, 20 targeted applications.'],
 ])],
 ['What I check in interviews', 'After taking many data interviews, these decide most outcomes.', list([
  ['Can you explain your own project?', 'Without reading. Why you chose that approach and what you would do differently.'],
  ['Do you ask the business question first?', 'Before writing SQL, ask what decision the numbers will support.'],
  ['Can you spot a wrong number?', 'Sanity checks: totals, row counts, sudden spikes.'],
  ['Resume with numbers', 'Rows, hours saved, revenue, accuracy. Tools alone say nothing.'],
 ])],
 ]),
};

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  for (const [k, html] of Object.entries(docs)) {
    await p.setContent(html, { waitUntil: 'load' });
    await p.pdf({ path: path.join(OUT, k + '.pdf'), width: '1080px', height: '1920px', printBackground: true, preferCSSPageSize: true });
    if (k === 'sql') { await p.setViewportSize({ width: 1080, height: 1920 }); await p.screenshot({path: path.join(__dirname,'check.png'),fullPage:true}); if(0) await p.screenshot({ path: path.join(__dirname, 'check.png'), fullPage: true }); }
  }
  await b.close();
  console.log('done');
})();
