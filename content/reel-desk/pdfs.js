const { chromium } = require('playwright');
const path = require('path');
const OUT = path.join(__dirname, '..', 'reel', 'pdfs');

const css = `
@page{size:A4;margin:16mm 15mm 18mm}
*{box-sizing:border-box}
body{font-family:Helvetica,Arial,sans-serif;color:#141414;font-size:10.5pt;line-height:1.45;margin:0}
.cover{background:#0d0d0d;color:#fff;padding:22px 24px;border-radius:6px;margin-bottom:18px}
.cover .tag{display:inline-block;background:#FFD21F;color:#0d0d0d;font-weight:800;font-size:9pt;letter-spacing:.08em;padding:3px 8px;border-radius:3px}
.cover h1{font-size:25pt;line-height:1.1;margin:12px 0 6px;color:#FFD21F}
.cover p{margin:0;color:#ddd}
h2{font-size:13.5pt;margin:18px 0 6px;padding-bottom:4px;border-bottom:2px solid #FFD21F;break-after:avoid}
h3{font-size:11pt;margin:12px 0 3px;break-after:avoid}
pre{background:#f4f2ea;border-left:3px solid #FFD21F;padding:7px 10px;font-size:8.8pt;white-space:pre-wrap;margin:4px 0 8px;break-inside:avoid;font-family:Menlo,Consolas,monospace}
table{width:100%;border-collapse:collapse;margin:6px 0 10px;font-size:9.5pt;break-inside:avoid}
th{background:#0d0d0d;color:#FFD21F;text-align:left;padding:5px 7px}
td{border-bottom:1px solid #ddd;padding:5px 7px;vertical-align:top}
ol,ul{margin:4px 0 8px;padding-left:20px} li{margin:2px 0}
.box{background:#fff8d6;border:1px solid #f0d860;padding:8px 11px;border-radius:4px;margin:8px 0;break-inside:avoid}
code{font-family:Menlo,Consolas,monospace;font-size:9pt;background:#f4f2ea;padding:0 3px}
.foot{margin-top:20px;font-size:9pt;color:#666;border-top:1px solid #ddd;padding-top:6px}
`;
const wrap = (tag, title, sub, body) => `<html><head><meta charset="utf-8"><style>${css}</style></head><body>
<div class="cover"><span class="tag">${tag}</span><h1>${title}</h1><p>${sub}</p></div>${body}
<div class="foot">@thedataguy16 · Save this. Share it with one friend preparing for a data role.</div></body></html>`;

const docs = {
sql: wrap('SQL', 'SQL Interview Pack', '8 patterns that cover most interview questions, plus 20 questions to test yourself.', `
<h2>Order of execution (asked in almost every round)</h2>
<pre>FROM → JOIN → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT</pre>
<p>This is why you cannot use a SELECT alias inside WHERE, but you can inside ORDER BY.</p>
<h2>The 8 patterns</h2>
<h3>1. Top N per group</h3>
<pre>SELECT * FROM (
  SELECT e.*, DENSE_RANK() OVER (PARTITION BY dept ORDER BY salary DESC) rk
  FROM employees e) t
WHERE rk &lt;= 3;</pre>
<h3>2. Running total</h3>
<pre>SELECT order_date, amount,
       SUM(amount) OVER (ORDER BY order_date) AS running_total
FROM orders;</pre>
<h3>3. Month over month change</h3>
<pre>SELECT month, revenue,
       revenue - LAG(revenue) OVER (ORDER BY month) AS mom_change
FROM monthly_revenue;</pre>
<h3>4. Remove duplicates, keep latest</h3>
<pre>DELETE FROM t WHERE id IN (
  SELECT id FROM (
    SELECT id, ROW_NUMBER() OVER (PARTITION BY email ORDER BY created_at DESC) rn
    FROM t) x WHERE rn &gt; 1);</pre>
<h3>5. Consecutive days (gaps and islands)</h3>
<pre>SELECT user_id, MIN(login_date), MAX(login_date), COUNT(*) AS streak
FROM (
  SELECT user_id, login_date,
         login_date - ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date) * INTERVAL '1 day' AS grp
  FROM logins) x
GROUP BY user_id, grp HAVING COUNT(*) &gt;= 3;</pre>
<h3>6. Find what is missing (anti join)</h3>
<pre>SELECT c.* FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
WHERE o.id IS NULL;</pre>
<h3>7. Conditional aggregation (pivot without PIVOT)</h3>
<pre>SELECT region,
       SUM(CASE WHEN status='Delivered' THEN 1 ELSE 0 END) AS delivered,
       SUM(CASE WHEN status='Returned'  THEN 1 ELSE 0 END) AS returned
FROM orders GROUP BY region;</pre>
<h3>8. Self join (employee and manager)</h3>
<pre>SELECT e.name AS employee, m.name AS manager
FROM employees e LEFT JOIN employees m ON e.manager_id = m.id;</pre>
<div class="box"><b>The JOIN trap:</b> if your JOIN doubled the row count, the join key is not unique on one side. Check with <code>SELECT key, COUNT(*) FROM t GROUP BY key HAVING COUNT(*) &gt; 1</code>. Fix by deduplicating first or aggregating before the join.</div>
<h2>RANK vs DENSE_RANK vs ROW_NUMBER</h2>
<table><tr><th>Salary</th><th>ROW_NUMBER</th><th>RANK</th><th>DENSE_RANK</th></tr>
<tr><td>900</td><td>1</td><td>1</td><td>1</td></tr><tr><td>900</td><td>2</td><td>1</td><td>1</td></tr><tr><td>800</td><td>3</td><td>3</td><td>2</td></tr></table>
<h2>20 questions to test yourself</h2>
<ol><li>Second highest salary without LIMIT/TOP.</li><li>Difference between WHERE and HAVING.</li><li>Customers who ordered in Jan but not Feb.</li><li>Top 3 products by revenue in each category.</li><li>7-day rolling average of sales.</li><li>Users who logged in 3 days in a row.</li><li>Find duplicate emails and keep the latest row.</li><li>Percentage of total revenue per region.</li><li>Employees earning more than their manager.</li><li>First order date of every customer.</li><li>Month on month growth %.</li><li>Difference between UNION and UNION ALL.</li><li>INNER vs LEFT JOIN output when keys repeat.</li><li>COUNT(*) vs COUNT(col) vs COUNT(DISTINCT col).</li><li>Why does NULL = NULL not return true?</li><li>CTE vs subquery vs temp table.</li><li>Retention: users active in month 1 who came back in month 2.</li><li>Median salary per department.</li><li>Cumulative distinct users by day.</li><li>How you would speed up a slow query.</li></ol>`),

excel: wrap('EXCEL', 'Excel for Data Analysts', 'The 15 functions that cover real work, the 2 debugging checklists interviewers love, and 15 practice questions.', `
<h2>The 15 functions</h2>
<table><tr><th>Function</th><th>Use it for</th><th>Example</th></tr>
<tr><td>XLOOKUP</td><td>Any lookup, left or right</td><td><code>=XLOOKUP(A2,Emp[ID],Emp[Name],"Not found")</code></td></tr>
<tr><td>INDEX + MATCH</td><td>Lookups in older Excel</td><td><code>=INDEX(C:C,MATCH(A2,A:A,0))</code></td></tr>
<tr><td>SUMIFS</td><td>Sum with conditions</td><td><code>=SUMIFS(Sales,Region,"North",Month,E1)</code></td></tr>
<tr><td>COUNTIFS</td><td>Count with conditions</td><td><code>=COUNTIFS(Status,"Open",Owner,G2)</code></td></tr>
<tr><td>IFS / IF</td><td>Buckets and flags</td><td><code>=IFS(B2&gt;=90,"A",B2&gt;=75,"B",TRUE,"C")</code></td></tr>
<tr><td>IFERROR</td><td>Clean error output</td><td><code>=IFERROR(B2/C2,0)</code></td></tr>
<tr><td>TRIM / CLEAN</td><td>Remove hidden spaces</td><td><code>=TRIM(CLEAN(A2))</code></td></tr>
<tr><td>TEXT</td><td>Format dates and numbers</td><td><code>=TEXT(A2,"mmm-yy")</code></td></tr>
<tr><td>LEFT / MID / RIGHT</td><td>Extract codes</td><td><code>=MID(A2,4,3)</code></td></tr>
<tr><td>TEXTSPLIT</td><td>Split by delimiter</td><td><code>=TEXTSPLIT(A2,",")</code></td></tr>
<tr><td>UNIQUE</td><td>Distinct list</td><td><code>=UNIQUE(Region)</code></td></tr>
<tr><td>FILTER</td><td>Dynamic subsets</td><td><code>=FILTER(Data,Data[Sales]&gt;50000)</code></td></tr>
<tr><td>SORT / SORTBY</td><td>Ranked lists</td><td><code>=SORTBY(Name,Sales,-1)</code></td></tr>
<tr><td>EOMONTH</td><td>Month-end reporting</td><td><code>=EOMONTH(A2,0)</code></td></tr>
<tr><td>LET</td><td>Readable long formulas</td><td><code>=LET(t,SUM(B:B),B2/t)</code></td></tr></table>
<h2>Checklist: VLOOKUP returns #N/A for half the data</h2>
<ol><li><b>Hidden spaces.</b> Wrap the lookup value in TRIM.</li><li><b>Numbers stored as text</b> on one side. Convert with VALUE or Text to Columns.</li><li><b>Range not locked.</b> Use $ or a Table so the range does not shift when copied down.</li><li>Bonus: the 4th argument is missing, so it is doing an approximate match. Use FALSE.</li></ol>
<h2>Checklist: SUM shows 0 but data is there</h2>
<ol><li>Numbers stored as text (left aligned, green triangle).</li><li>Calculation set to Manual. Formulas tab, Calculation Options, Automatic.</li><li>Circular reference somewhere in the sheet.</li></ol>
<h2>Pivot tables in 5 steps</h2>
<ol><li>Convert data to a Table (Ctrl+T).</li><li>Insert, PivotTable.</li><li>Category to Rows, metric to Values.</li><li>Date to Columns, then group by Month.</li><li>Value Field Settings, Show Values As, % of Grand Total.</li></ol>
<h2>15 practice questions</h2>
<ol><li>Lookup a value that sits to the left of the key column.</li><li>Total sales for North region in March only.</li><li>Flag orders above the average order value.</li><li>Extract the domain from an email ID.</li><li>Count unique customers.</li><li>Rank salespeople within each region.</li><li>Convert 20261105 into a real date.</li><li>Find duplicates across two sheets.</li><li>Month-end date for every transaction.</li><li>Create Low / Medium / High buckets.</li><li>Top 5 products by revenue, auto-updating.</li><li>Percentage contribution of each region.</li><li>Days between order and delivery, excluding weekends.</li><li>Combine first and last name with a space.</li><li>Build a dropdown that filters a table.</li></ol>`),

powerbi: wrap('POWER BI', 'Power BI Interview Notes', 'Data model, the 10 DAX functions you will actually use, and the questions that come up most.', `
<h2>Model it as a star schema</h2>
<p>One fact table (sales, orders) in the middle. Dimension tables (date, product, customer) around it. One-to-many relationships, single direction filters. Always add a proper Date table and mark it as a date table.</p>
<h2>Measure vs calculated column</h2>
<table><tr><th></th><th>Calculated column</th><th>Measure</th></tr>
<tr><td>Computed</td><td>At refresh, row by row</td><td>At query time</td></tr><tr><td>Stored</td><td>Yes, uses memory</td><td>No</td></tr><tr><td>Context</td><td>Row context</td><td>Filter context</td></tr><tr><td>Use for</td><td>Slicing, grouping</td><td>Totals, ratios, KPIs</td></tr></table>
<h2>The 10 DAX functions</h2>
<pre>Total Sales   = SUM(Sales[Amount])
Sales North   = CALCULATE([Total Sales], Product[Region] = "North")
% of Total    = DIVIDE([Total Sales], CALCULATE([Total Sales], ALL(Product)))
Revenue       = SUMX(Sales, Sales[Qty] * Sales[Price])
Sales LY      = CALCULATE([Total Sales], SAMEPERIODLASTYEAR('Date'[Date]))
YoY %         = DIVIDE([Total Sales] - [Sales LY], [Sales LY])
Sales YTD     = TOTALYTD([Total Sales], 'Date'[Date])
Last Month    = CALCULATE([Total Sales], DATEADD('Date'[Date], -1, MONTH))
Big Orders    = CALCULATE([Total Sales], FILTER(Sales, Sales[Amount] &gt; 10000))
Product Rank  = RANKX(ALL(Product[Name]), [Total Sales])
Category      = RELATED(Product[Category])   -- in a calculated column</pre>
<h2>Power Query steps you should know</h2>
<ul><li>Remove duplicates, change type, trim, replace values.</li><li>Unpivot columns (wide months to long format).</li><li>Merge queries (join) and Append queries (union).</li><li>Group By and conditional columns.</li></ul>
<h2>The 6 visuals that cover most dashboards</h2>
<p>KPI card, line chart (trend), bar chart (comparison), matrix (detail), slicer (filter), map only when geography matters.</p>
<h2>15 most asked questions</h2>
<ol><li>Filter context vs row context.</li><li>What does CALCULATE do?</li><li>ALL vs ALLEXCEPT vs REMOVEFILTERS.</li><li>Import vs DirectQuery vs Live connection.</li><li>What is Row Level Security and how do you set it up?</li><li>Why do you need a Date table?</li><li>Star vs snowflake schema.</li><li>Many-to-many relationships and their risk.</li><li>Bi-directional filter: when and why not.</li><li>SUM vs SUMX.</li><li>How to improve a slow report.</li><li>Drill down vs drill through.</li><li>Bookmarks and what they are used for.</li><li>Scheduled refresh and the gateway.</li><li>Walk me through a dashboard you built.</li></ol>`),

python: wrap('PYTHON', 'Python for Data Analysts', 'Only the Pandas you need, a 30-day plan from zero, and 10 interview questions.', `
<h2>The 12 Pandas functions</h2>
<pre>import pandas as pd
df = pd.read_csv("sales.csv")                 # 1 load
df.head(); df.info(); df.describe()          # 2 inspect
df.isna().sum(); df.fillna(0); df.dropna()   # 3 missing values
df.drop_duplicates(subset="order_id")        # 4 duplicates
df.loc[df["region"] == "North", ["amount"]]  # 5 select
df.query("amount &gt; 5000 and region == 'North'")  # 6 filter
df.groupby("region").agg(total=("amount","sum"), orders=("order_id","count"))  # 7
pd.merge(orders, customers, on="customer_id", how="left")   # 8 join
df.pivot_table(index="region", columns="month", values="amount", aggfunc="sum")  # 9
df["date"] = pd.to_datetime(df["date"]); df["month"] = df["date"].dt.month  # 10
df["region"].value_counts(normalize=True)    # 11 share
df["tax"] = df["amount"] * 0.18              # 12 vectorise, avoid loops</pre>
<h2>SQL to Pandas</h2>
<table><tr><th>SQL</th><th>Pandas</th></tr><tr><td>WHERE</td><td><code>df[df.col &gt; 5]</code> or <code>query</code></td></tr><tr><td>GROUP BY</td><td><code>groupby().agg()</code></td></tr><tr><td>JOIN</td><td><code>merge</code></td></tr><tr><td>UNION ALL</td><td><code>pd.concat</code></td></tr><tr><td>ORDER BY</td><td><code>sort_values</code></td></tr><tr><td>ROW_NUMBER</td><td><code>groupby().cumcount()+1</code></td></tr></table>
<h2>30-day plan from zero</h2>
<table><tr><th>Days</th><th>Focus</th></tr><tr><td>1-5</td><td>Variables, lists, dicts, loops, functions</td></tr><tr><td>6-12</td><td>Pandas: load, clean, filter, groupby, merge</td></tr><tr><td>13-17</td><td>Dates, string methods, pivot tables</td></tr><tr><td>18-22</td><td>Charts with Matplotlib and Seaborn</td></tr><tr><td>23-27</td><td>One end-to-end EDA project on a real dataset</td></tr><tr><td>28-30</td><td>Push to GitHub, write the README, practise questions</td></tr></table>
<h2>10 interview questions</h2>
<ol><li>List vs tuple vs dict vs set.</li><li>loc vs iloc.</li><li>merge vs join vs concat.</li><li>How do you handle missing values?</li><li>apply vs vectorised operations.</li><li>Find the top 3 products per category.</li><li>Remove outliers using IQR.</li><li>Convert a wide table to long (melt).</li><li>Read a 5 GB CSV that does not fit in memory.</li><li>Write a function that returns month on month growth.</li></ol>`),

stats: wrap('STATISTICS', 'Statistics Cheat Sheet', 'The concepts interviewers ask, explained in one line each, plus A/B testing step by step.', `
<h2>Core concepts</h2>
<table><tr><th>Concept</th><th>One line</th></tr>
<tr><td>Mean vs median</td><td>Use median when data is skewed (salaries, house prices).</td></tr>
<tr><td>Standard deviation</td><td>Average distance of values from the mean.</td></tr>
<tr><td>Normal distribution</td><td>68% within 1 SD, 95% within 2, 99.7% within 3.</td></tr>
<tr><td>Central Limit Theorem</td><td>Sample means are roughly normal for large samples, whatever the original shape.</td></tr>
<tr><td>Null hypothesis</td><td>The default claim: there is no effect.</td></tr>
<tr><td>p-value</td><td>Chance of seeing a result this extreme if the null is true. Below 0.05 usually means significant.</td></tr>
<tr><td>Type I error</td><td>False positive. You say there is an effect when there is none.</td></tr>
<tr><td>Type II error</td><td>False negative. You miss a real effect.</td></tr>
<tr><td>Confidence interval</td><td>Range likely to contain the true value, e.g. 95% CI.</td></tr>
<tr><td>Statistical power</td><td>Chance of detecting an effect that exists. Aim for 80%.</td></tr>
<tr><td>Correlation</td><td>-1 to 1, strength of linear link. Does not prove causation.</td></tr>
<tr><td>Outliers (IQR)</td><td>Below Q1 - 1.5×IQR or above Q3 + 1.5×IQR.</td></tr></table>
<h2>Which test to use</h2>
<table><tr><th>Question</th><th>Test</th></tr><tr><td>Compare 2 group means</td><td>t-test</td></tr><tr><td>Compare 3+ group means</td><td>ANOVA</td></tr><tr><td>Two categorical variables related?</td><td>Chi-square</td></tr><tr><td>Compare 2 conversion rates</td><td>Two-proportion z-test</td></tr><tr><td>Relationship between 2 numbers</td><td>Correlation / regression</td></tr></table>
<h2>A/B testing in 7 steps</h2>
<ol><li>Define one primary metric (e.g. conversion rate).</li><li>Write the hypothesis. H0: no difference.</li><li>Decide minimum detectable effect, significance (0.05) and power (0.8).</li><li>Calculate sample size before starting.</li><li>Randomly split users. Run for full weeks.</li><li>Do not peek and stop early.</li><li>Test significance, check guardrail metrics, then decide.</li></ol>
<div class="box"><b>Correlation vs causation:</b> ice cream sales and drowning both rise in summer. Temperature drives both. Always ask what third factor could explain the link.</div>
<h2>10 questions asked in data interviews</h2>
<ol><li>Explain p-value to a non-technical manager.</li><li>When would you use median over mean?</li><li>What is the Central Limit Theorem and why does it matter?</li><li>Type I vs Type II error with a business example.</li><li>How do you pick a sample size for an A/B test?</li><li>Your test is significant but the lift is 0.1%. Ship it?</li><li>What is Simpson's paradox?</li><li>How do you detect outliers?</li><li>Difference between a population and a sample.</li><li>What is multicollinearity?</li></ol>`),

ml: wrap('DATA SCIENCE', 'Machine Learning Starter Pack', '7 algorithms that cover most work, the metrics that matter, and a 60-day plan from zero.', `
<h2>The 7 algorithms</h2>
<table><tr><th>Algorithm</th><th>Type</th><th>Typical use</th></tr>
<tr><td>Linear Regression</td><td>Regression</td><td>Forecast sales, price</td></tr>
<tr><td>Logistic Regression</td><td>Classification</td><td>Churn yes/no, loan default</td></tr>
<tr><td>Decision Tree</td><td>Both</td><td>Explainable rules</td></tr>
<tr><td>Random Forest</td><td>Both</td><td>Strong baseline on tabular data</td></tr>
<tr><td>Gradient Boosting (XGBoost / LightGBM)</td><td>Both</td><td>Best accuracy on tabular data</td></tr>
<tr><td>K-Means</td><td>Clustering</td><td>Customer segments</td></tr>
<tr><td>KNN</td><td>Both</td><td>Simple similarity, recommendations</td></tr></table>
<h2>Metrics</h2>
<table><tr><th>Metric</th><th>When</th></tr><tr><td>Accuracy</td><td>Only when classes are balanced</td></tr><tr><td>Precision</td><td>False positives are costly (spam filter)</td></tr><tr><td>Recall</td><td>False negatives are costly (fraud, disease)</td></tr><tr><td>F1</td><td>Balance of precision and recall</td></tr><tr><td>ROC-AUC</td><td>Ranking quality across thresholds</td></tr><tr><td>RMSE / MAE</td><td>Regression error</td></tr></table>
<div class="box"><b>"Your model is 99% accurate. Why is that bad?"</b> If only 1% of transactions are fraud, a model that predicts "not fraud" every time is 99% accurate and catches nothing. Check recall, precision and the confusion matrix. Fix with resampling, class weights or a better threshold.</div>
<h2>Basics every interviewer checks</h2>
<ul><li><b>Overfitting:</b> great on train, poor on test. Fix with more data, simpler model, regularisation, cross-validation.</li><li><b>Train / validation / test split</b> and why you never tune on test.</li><li><b>Data leakage:</b> a feature that would not be known at prediction time.</li><li><b>Bias vs variance</b> trade-off.</li><li><b>Feature scaling</b> matters for KNN, K-Means, logistic regression.</li></ul>
<pre>from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, stratify=y, random_state=42)
model = RandomForestClassifier(class_weight="balanced").fit(X_tr, y_tr)
print(classification_report(y_te, model.predict(X_te)))</pre>
<h2>60-day plan from zero</h2>
<table><tr><th>Days</th><th>Focus</th></tr><tr><td>1-10</td><td>Python and Pandas basics</td></tr><tr><td>11-20</td><td>Statistics: distributions, hypothesis testing, regression</td></tr><tr><td>21-35</td><td>Scikit-learn: the 7 algorithms, metrics, cross-validation</td></tr><tr><td>36-45</td><td>Feature engineering, imbalanced data, tuning</td></tr><tr><td>46-60</td><td>Two end-to-end projects with a README and a short demo</td></tr></table>
<h2>5 projects that get shortlisted</h2>
<ol><li>Customer churn prediction with business impact in ₹.</li><li>Sales forecasting for the next 3 months.</li><li>Customer segmentation with K-Means and named segments.</li><li>Credit risk scoring with an explainability section.</li><li>A/B test analysis with a clear recommendation.</li></ol>`),

career: wrap('CAREER', 'Data Career Playbook', 'Indicative salary bands, the 90-day switch plan, resume fixes and AI prompts that save hours.', `
<h2>Indicative salary bands in India (2026)</h2>
<table><tr><th>Experience</th><th>Data Analyst</th><th>Data Scientist</th></tr>
<tr><td>0-2 years</td><td>₹4-8 LPA</td><td>₹6-12 LPA</td></tr><tr><td>2-5 years</td><td>₹8-15 LPA</td><td>₹12-25 LPA</td></tr><tr><td>5-8 years</td><td>₹15-25 LPA</td><td>₹25-40 LPA</td></tr></table>
<p style="font-size:9pt;color:#555">Ranges vary a lot by city, company type and domain. Use them as a direction, not a promise.</p>
<h2>What moves you from ₹4 to ₹15 LPA</h2>
<ol><li>SQL at window-function level, not just SELECT and JOIN.</li><li>One BI tool done properly (Power BI or Tableau).</li><li>Talking in business impact: "cut report time from 6 hours to 20 minutes".</li><li>Domain depth (BFSI, e-commerce, supply chain).</li><li>Switching companies with 2-3 strong projects to show.</li></ol>
<h2>90-day plan for non-tech to data analyst</h2>
<table><tr><th>Weeks</th><th>Focus</th><th>Output</th></tr><tr><td>1-3</td><td>Excel</td><td>One dashboard</td></tr><tr><td>4-7</td><td>SQL</td><td>50 solved questions</td></tr><tr><td>8-10</td><td>Power BI</td><td>One end-to-end report</td></tr><tr><td>11-12</td><td>Python basics + statistics</td><td>One EDA notebook</td></tr><tr><td>13</td><td>Resume, LinkedIn, applications</td><td>20 targeted applications</td></tr></table>
<h2>5 resume mistakes I see every week</h2>
<ol><li>Listing tools without saying what you did with them.</li><li>No numbers. Add time saved, revenue, rows, accuracy.</li><li>Course certificates at the top, projects at the bottom.</li><li>Two pages for under 3 years of experience.</li><li>Projects copied from the same YouTube tutorial everyone uses.</li></ol>
<h2>What I check when I take an interview</h2>
<ul><li>Can you explain your own project without reading?</li><li>Do you ask about the business question before writing SQL?</li><li>Can you spot a wrong number in your own output?</li><li>Do you know the trade-off of what you chose?</li></ul>
<h2>5 AI prompts that save hours</h2>
<pre>1. "Here is my table schema: [paste]. Write a SQL query to [goal]. Explain each step."
2. "This Excel formula returns #N/A: [paste]. List the likely causes in order."
3. "Summarise this pivot output into 5 bullet insights for a sales head: [paste]."
4. "Write DAX for year-on-year growth with a Date table called 'Date'."
5. "Review this Pandas code for bugs and performance: [paste]."</pre>
<div class="box"><b>Will AI replace analysts?</b> It replaces the typing, not the judgement. Knowing which question to ask and whether the answer is wrong is the job. Use AI to go faster and say so in interviews.</div>`),
};

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  for (const [k, html] of Object.entries(docs)) {
    await p.setContent(html, { waitUntil: 'load' });
    await p.pdf({ path: path.join(OUT, k + '.pdf'), format: 'A4', printBackground: true });
  }
  await b.close();
  console.log('done');
})();
