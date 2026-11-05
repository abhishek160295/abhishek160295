// Reel-friendly PDFs: 9:16 pages, huge type, 5 pages each (cover + 4).
const { chromium } = require('playwright');
const path = require('path');
const OUT = path.join(__dirname, '..', 'reel', 'pdfs');

const css = `
@page{size:1080px 1920px;margin:0}
*{box-sizing:border-box;margin:0}
body{font-family:Helvetica,Arial,sans-serif;background:#0b0b0b;color:#fff}
.pg{width:1080px;height:1920px;padding:120px 90px 110px;display:flex;flex-direction:column;page-break-after:always;position:relative;overflow:hidden}
.pg:last-child{page-break-after:auto}
.n{font-size:34px;color:#888;letter-spacing:.1em;font-weight:700}
.tag{align-self:flex-start;background:#FFD21F;color:#0b0b0b;font-weight:900;font-size:40px;letter-spacing:.08em;padding:12px 26px;border-radius:10px}
h1{font-size:132px;line-height:1.02;font-weight:900;color:#FFD21F;margin:60px 0 40px}
.cover p{font-size:54px;line-height:1.3;color:#e8e8e8}
h2{font-size:100px;line-height:1.05;font-weight:900;color:#FFD21F;margin:auto 0 60px}
.sp{margin-bottom:auto}
.cover h1{margin-top:auto}
.cover p{margin-bottom:auto}
ul{list-style:none;padding:0;display:flex;flex-direction:column;gap:46px}
li{font-size:68px;line-height:1.22;font-weight:700;padding-left:56px;position:relative}
li::before{content:"";position:absolute;left:0;top:22px;width:26px;height:26px;background:#FFD21F;border-radius:4px}
li small{display:block;font-size:46px;font-weight:400;color:#bdbdbd;margin-top:10px;font-family:Menlo,Consolas,monospace}
.code{background:#1b1b1b;border-left:10px solid #FFD21F;border-radius:10px;padding:34px 36px;font-family:Menlo,Consolas,monospace;font-size:44px;line-height:1.4;white-space:pre-wrap;color:#fff;margin-top:20px}
.big{font-size:64px;line-height:1.25;font-weight:700}
.note{margin-top:auto;font-size:40px;color:#bdbdbd;line-height:1.3}
.brand{position:absolute;bottom:56px;left:90px;right:90px;display:flex;justify-content:space-between;font-size:34px;color:#888;font-weight:700}
.brand b{color:#FFD21F}
`;
const page = (i, inner) => `<section class="pg"><div class="n">${String(i).padStart(2,'0')} / 05</div>${inner}<div class="brand"><b>@thedataguy16</b><span>Save · Share</span></div></section>`;
const list = items => `<ul>${items.map(x => Array.isArray(x) ? `<li>${x[0]}<small>${x[1]}</small></li>` : `<li>${x}</li>`).join('')}</ul>`;
const doc = (tag, title, sub, pages) => `<html><head><meta charset="utf-8"><style>${css}</style></head><body>
<section class="pg cover"><div class="tag">${tag}</div><h1>${title}</h1><p>${sub}</p><div class="brand"><b>@thedataguy16</b><span>Swipe →</span></div></section>
${pages.map((p, i) => page(i + 2, `<h2>${p[0]}</h2>${p[1]}<div class="sp"></div>`)).join('')}</body></html>`;

const docs = {
sql: doc('SQL', 'SQL Interview Pack', '8 patterns that cover most SQL interview questions.', [
 ['Patterns 1 to 4', list([['Top N per group','DENSE_RANK() OVER (PARTITION BY ...)'],['Running total','SUM() OVER (ORDER BY date)'],['Month on month','LAG(revenue) OVER (...)'],['Remove duplicates','ROW_NUMBER() ... WHERE rn = 1']])],
 ['Patterns 5 to 8', list([['Consecutive days','date - ROW_NUMBER()'],['Find missing rows','LEFT JOIN ... WHERE b.id IS NULL'],['Pivot without PIVOT','SUM(CASE WHEN ... THEN 1 END)'],['Employee and manager','Self join on manager_id']])],
 ['Your JOIN doubled the rows?', `<p class="big">The join key is not unique on one side.</p><div class="code">SELECT key, COUNT(*)
FROM t
GROUP BY key
HAVING COUNT(*) &gt; 1;</div><p class="note">Fix: remove duplicates or aggregate before you join.</p>`],
 ['Order of execution', `<div class="code">FROM
JOIN
WHERE
GROUP BY
HAVING
SELECT
ORDER BY
LIMIT</div><p class="note">That is why a SELECT alias fails inside WHERE.</p>`],
]),
excel: doc('EXCEL', 'Excel for Data Analysts', 'The functions that cover real work, and the 2 checks every interviewer asks.', [
 ['Lookup and sum', list([['XLOOKUP','Lookup in any direction'],['INDEX + MATCH','For older Excel'],['SUMIFS','Sum with conditions'],['COUNTIFS','Count with conditions']])],
 ['Clean and shape', list([['TRIM + CLEAN','Kill hidden spaces'],['TEXTSPLIT','Split by comma'],['UNIQUE + FILTER','Live lists'],['IFERROR','No ugly errors']])],
 ['VLOOKUP shows #N/A?', list([['Hidden spaces','Wrap value in TRIM'],['Number stored as text','Convert with VALUE'],['Range not locked','Use $ or a Table'],['Last argument missing','Set it to FALSE']])],
 ['SUM shows 0?', list([['Numbers stored as text','Green triangle, left aligned'],['Calculation is Manual','Formulas → Calculation → Automatic'],['Circular reference','Check the status bar']])],
]),
powerbi: doc('POWER BI', 'Power BI Interview Notes', 'Model, DAX and the questions that come up every time.', [
 ['Model it right', list([['Star schema','1 fact table, dimensions around it'],['One-to-many','Single direction filters'],['Date table','Mark it as date table']])],
 ['DAX you will use', `<div class="code">Total = SUM(Sales[Amt])

North = CALCULATE([Total],
  Region[Name]="North")

% Total = DIVIDE([Total],
  CALCULATE([Total], ALL(Region)))

LY = CALCULATE([Total],
  SAMEPERIODLASTYEAR('Date'[Date]))</div>`],
 ['Measure vs column', list([['Column','Row by row, stored, for slicing'],['Measure','At query time, for totals and KPIs'],['SUM vs SUMX','SUMX goes row by row first']])],
 ['Most asked', list(['Filter vs row context','What CALCULATE does','Import vs DirectQuery','Row Level Security','How to speed up a slow report'])],
]),
python: doc('PYTHON', 'Python for Data Analysts', 'Only the Pandas you need, and a 30-day plan from zero.', [
 ['Load and inspect', `<div class="code">df = pd.read_csv("sales.csv")
df.head()
df.info()
df.isna().sum()
df.drop_duplicates()</div>`],
 ['Analyse', `<div class="code">df.query("amount &gt; 5000")

df.groupby("region")["amount"].sum()

pd.merge(a, b, on="id", how="left")

df.pivot_table(index="region",
  columns="month", values="amount")</div>`],
 ['SQL to Pandas', list([['WHERE','df.query()'],['GROUP BY','groupby().agg()'],['JOIN','merge()'],['UNION ALL','pd.concat()']])],
 ['30 days from zero', list([['Days 1-5','Python basics'],['Days 6-17','Pandas: clean, group, merge'],['Days 18-22','Charts'],['Days 23-30','1 full project on GitHub']])],
]),
stats: doc('STATISTICS', 'Statistics Cheat Sheet', 'What interviewers ask, one line each.', [
 ['The basics', list([['Median over mean','When data is skewed'],['68 · 95 · 99.7','Within 1, 2, 3 standard deviations'],['Central Limit Theorem','Sample means look normal']])],
 ['Hypothesis testing', list([['p-value','Chance of this result if nothing changed'],['Below 0.05','Usually significant'],['Type I','False alarm'],['Type II','Missed a real effect']])],
 ['Which test?', list([['2 group means','t-test'],['3+ group means','ANOVA'],['2 categories','Chi-square'],['2 conversion rates','z-test']])],
 ['A/B test in 5 steps', list(['Pick one metric','Fix sample size first','Split users randomly','Run full weeks, no peeking','Check significance, then decide'])],
]),
ml: doc('DATA SCIENCE', 'Machine Learning Starter Pack', '7 algorithms, the right metrics, and a 60-day plan.', [
 ['The 7 algorithms', list(['Linear Regression','Logistic Regression','Decision Tree','Random Forest','XGBoost / LightGBM','K-Means','KNN'])],
 ['Pick the right metric', list([['Precision','False positives are costly'],['Recall','False negatives are costly'],['F1','Balance of both'],['RMSE','Regression error']])],
 ['"99% accurate. Why is that bad?"', `<p class="big">If 1% is fraud, predicting "not fraud" every time is 99% accurate and catches nothing.</p><p class="note">Check recall and the confusion matrix. Use class weights or resampling.</p>`],
 ['60 days from zero', list([['Days 1-10','Python + Pandas'],['Days 11-20','Statistics'],['Days 21-45','Scikit-learn and metrics'],['Days 46-60','2 end-to-end projects']])],
]),
career: doc('CAREER', 'Data Career Playbook', 'Salary, the switch plan and what interviewers check.', [
 ['Salary bands (India)', list([['0-2 years','DA ₹4-8 LPA · DS ₹6-12 LPA'],['2-5 years','DA ₹8-15 LPA · DS ₹12-25 LPA'],['5-8 years','DA ₹15-25 LPA · DS ₹25-40 LPA']]) + `<p class="note">Indicative only. Varies by city, company and domain.</p>`],
 ['₹4 to ₹15 LPA', list(['Window functions in SQL','One BI tool done properly','Talk in business impact','Pick a domain','Switch with 2-3 strong projects'])],
 ['90-day switch plan', list([['Weeks 1-3','Excel → 1 dashboard'],['Weeks 4-7','SQL → 50 questions'],['Weeks 8-10','Power BI → 1 report'],['Weeks 11-13','Python, resume, apply']])],
 ['What I check in interviews', list(['Can you explain your own project?','Do you ask the business question first?','Can you spot a wrong number?','Do you know your trade-offs?'])],
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
