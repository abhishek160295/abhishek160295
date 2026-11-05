// Extra detail pages per PDF: [insertAt, [heading, lead, html]]
module.exports = (list, box) => {
const Y = '#FFD21F', K = '#141414', G = '#6b6b6b', L = '#f4f1e4';
const svg = (h, body) => `<svg width="912" height="${h}" viewBox="0 0 912 ${h}" xmlns="http://www.w3.org/2000/svg" style="display:block;margin:6px 0 34px" font-family="Helvetica,Arial,sans-serif">${body}</svg>`;
const t = (x, y, s, txt, o = {}) => `<text x="${x}" y="${y}" font-size="${s}" fill="${o.fill || K}" font-weight="${o.w || 400}" text-anchor="${o.a || 'start'}">${txt}</text>`;
const r = (x, y, w, h, fill, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 10}" fill="${fill}" stroke="${o.s || 'none'}" stroke-width="${o.sw || 0}"/>`;
const ln = (x1, y1, x2, y2, c = K, w = 4) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w}"/>`;
const qs = arr => `<ol style="padding-left:56px;display:block;columns:2;column-gap:56px;font-size:32px;line-height:1.28;color:#141414">${arr.map(q => `<li style="font-weight:400;padding-left:6px;margin-bottom:18px;break-inside:avoid">${q}</li>`).join('')}</ol>`;

// Window function graphic
const rows = [['Sales','Asha',95,1],['Sales','Ravi',95,1],['Sales','Neha',80,2],['Tech','Kiran',120,1],['Tech','Meera',110,2],['Tech','Arjun',90,3]];
const winSvg = svg(610, r(0,0,912,70,K,{rx:8}) + ['dept','name','salary','rank'].map((h,i)=>t(30+i*225,47,34,h,{fill:Y,w:800})).join('') +
  rows.map((rw,i)=>{const y=70+i*80;const fill=rw[0]==='Sales'?'#fff8d6':'#ffffff';return r(0,y,912,80,fill,{rx:0,s:'#e5e2d6',sw:2})+rw.map((c,j)=>t(30+j*225,y+52,36,c,{w:j===3?800:400})).join('')}).join('') +
  ln(0,310,912,310,Y,8) + t(912,600,28,'Rank restarts at every new dept (PARTITION BY)',{a:'end',fill:G}));

// Pivot graphic
const pivotSvg = svg(470,
  r(0,0,420,470,L) + t(30,58,34,'Raw rows',{w:800}) + ['North · Jan · 120','South · Jan · 90','North · Feb · 140','South · Feb · 75','North · Jan · 60'].map((s,i)=>t(30,120+i*66,32,s)).join('') +
  `<path d="M445 235 L495 235" stroke="${K}" stroke-width="6"/><path d="M495 220 L520 235 L495 250 Z" fill="${K}"/>` +
  r(540,0,372,470,'#fff8d6',{s:Y,sw:4}) + t(565,58,34,'Pivot',{w:800}) +
  [['','Jan','Feb'],['North','180','140'],['South','90','75'],['Total','270','215']].map((rw,i)=>rw.map((c,j)=>t(565+j*115,130+i*80,34,c,{w:i===0||j===0||i===3?800:400})).join('')).join('') + ln(565,350,890,350,K,3));

// Star schema graphic
const box2 = (x,y,w,h,title,sub,fill)=>r(x,y,w,h,fill,{s:K,sw:3})+t(x+w/2,y+h/2-4,38,title,{a:'middle',w:800})+t(x+w/2,y+h/2+40,28,sub,{a:'middle',fill:G});
const starSvg = svg(790,
  ln(456,380,180,110,K,4)+ln(456,380,732,110,K,4)+ln(456,380,180,650,K,4)+ln(456,380,732,650,K,4)+
  box2(306,300,300,160,'Sales','fact table',Y)+
  box2(40,40,280,140,'Date','dimension','#fff')+box2(592,40,280,140,'Product','dimension','#fff')+
  box2(40,580,280,140,'Customer','dimension','#fff')+box2(592,580,280,140,'Store','dimension','#fff')+
  t(456,775,28,'Each line: 1 → many. Filters flow into the fact table.',{a:'middle',fill:G}));

// Dashboard wireframe
const dashSvg = svg(820,
  r(0,0,912,820,'#fff',{s:K,sw:3}) + [0,1,2,3].map(i=>r(24+i*218,24,200,130,L)+t(44+i*218,74,26,['Revenue','Orders','AOV','Margin'][i],{fill:G})+t(44+i*218,128,44,['₹4.2Cr','18.4K','₹2,280','21%'][i],{w:800})).join('') +
  r(24,178,864,300,L)+t(48,220,28,'Trend: revenue by month',{fill:G})+`<polyline points="60,430 180,390 300,410 420,330 540,350 660,280 780,250 860,230" fill="none" stroke="${K}" stroke-width="6"/>` +
  r(24,502,420,294,L)+t(48,544,28,'By region',{fill:G})+[260,200,150,90].map((w,i)=>r(48,570+i*52,w,34,Y,{rx:4})).join('') +
  r(468,502,420,294,L)+t(492,544,28,'Detail table',{fill:G})+[0,1,2,3,4].map(i=>ln(492,580+i*44,864,580+i*44,'#d8d4c4',3)).join(''));

// Bar + line chart graphic (python)
const chartSvg = svg(420,
  r(0,0,440,420,L)+t(24,50,30,'plt.bar',{w:800})+[180,260,140,300].map((h,i)=>r(50+i*95,380-h,60,h,Y,{rx:4,s:K,sw:2})).join('')+ln(30,380,420,380,K,3) +
  r(472,0,440,420,L)+t(496,50,30,'plt.plot',{w:800})+`<polyline points="510,330 590,280 670,300 750,200 830,160 890,120" fill="none" stroke="${K}" stroke-width="6"/>`+ln(500,380,895,380,K,3));

// Normal curve
let pts=[];for(let i=0;i<=200;i++){const x=-4+i*0.04;pts.push(`${(456+x*105).toFixed(1)},${(470-380*Math.exp(-x*x/2)).toFixed(1)}`)}
const area=(a,b,fill)=>{let p=[`${456+a*105},470`];for(let x=a;x<=b+1e-9;x+=0.05)p.push(`${(456+x*105).toFixed(1)},${(470-380*Math.exp(-x*x/2)).toFixed(1)}`);p.push(`${456+b*105},470`);return `<polygon points="${p.join(' ')}" fill="${fill}"/>`};
const normSvg = svg(640, area(-3,3,'#fff3b0')+area(-2,2,'#ffe36b')+area(-1,1,Y)+`<polyline points="${pts.join(' ')}" fill="none" stroke="${K}" stroke-width="5"/>`+ln(30,470,882,470,K,3)+
  t(456,380,40,'68%',{a:'middle',w:800})+t(456,570,32,'95% within ±2 SD',{a:'middle'})+t(456,620,30,'99.7% within ±3 SD',{a:'middle',fill:G})+
  [-3,-2,-1,0,1,2,3].map(v=>t(456+v*105,505,26,v===0?'mean':(v>0?'+':'')+v,{a:'middle',fill:G})).join(''));

// Scatter
const sc=[[80,330],[130,300],[170,310],[220,250],[260,240],[310,200],[350,190],[400,150],[440,130],[480,110],[200,280],[370,170]];
const scatSvg = svg(420, r(0,0,912,420,L)+sc.map(([x,y])=>`<circle cx="${x+40}" cy="${y}" r="14" fill="${Y}" stroke="${K}" stroke-width="3"/>`).join('')+ln(60,380,600,380,K,3)+ln(60,60,60,380,K,3)+
  t(330,410,26,'Ice cream sales',{a:'middle',fill:G})+t(630,140,34,'r = 0.92',{w:800})+t(630,195,30,'with drownings.',{})+t(630,250,30,'Cause: summer heat',{w:800})+t(630,295,30,'drives both.',{}));

// Confusion matrix
const cm = svg(580, t(545,40,30,'Predicted',{a:'middle',fill:G,w:700})+t(395,92,32,'Fraud',{a:'middle',w:800})+t(695,92,32,'Not fraud',{a:'middle',w:800})+
  `<text x="40" y="320" font-size="30" fill="${G}" font-weight="700" transform="rotate(-90 40 320)" text-anchor="middle">Actual</text>`+
  t(235,220,32,'Fraud',{a:'end',w:800})+t(235,430,32,'Not fraud',{a:'end',w:800})+
  r(250,110,290,200,Y,{s:K,sw:3})+t(395,200,40,'TP',{a:'middle',w:800})+t(395,250,28,'caught fraud',{a:'middle'})+
  r(550,110,290,200,'#fff',{s:K,sw:3})+t(695,200,40,'FN',{a:'middle',w:800})+t(695,250,28,'missed fraud',{a:'middle'})+
  r(250,320,290,200,'#fff',{s:K,sw:3})+t(395,410,40,'FP',{a:'middle',w:800})+t(395,460,28,'false alarm',{a:'middle'})+
  r(550,320,290,200,L,{s:K,sw:3})+t(695,410,40,'TN',{a:'middle',w:800})+t(695,460,28,'correctly cleared',{a:'middle'}));

// Overfitting curves
const fit = svg(460, r(0,0,912,460,L)+ln(70,400,880,400,K,3)+ln(70,40,70,400,K,3)+
  `<path d="M90 120 C 300 300, 500 350, 860 380" fill="none" stroke="${K}" stroke-width="6"/>`+
  `<path d="M90 140 C 280 300, 420 320, 520 300 S 760 200, 860 120" fill="none" stroke="#c99a00" stroke-width="6" stroke-dasharray="18 10"/>`+
  ln(470,60,470,400,G,2)+t(480,90,28,'sweet spot',{fill:G,w:700})+t(640,420,26,'',{})+
  t(880,440,26,'model complexity →',{a:'end',fill:G})+t(700,355,30,'train error',{w:700})+t(690,150,30,'test error',{w:700,fill:'#8a6a00'}));

// Salary bars
const sal=[['0-2 yrs',4,8,6,12],['2-5 yrs',8,15,12,25],['5-8 yrs',15,25,25,40],['8+ yrs',25,45,40,70]];
const sx=v=>220+v*7.4;
const salSvg = svg(640, sal.map(([l,a,b,c,d],i)=>{const y=40+i*145;return t(0,y+50,34,l,{w:800})+r(sx(a),y,sx(b)-sx(a),44,Y,{rx:6,s:K,sw:2})+t(sx(b)+12,y+33,26,`DA ₹${a}-${b}`)+r(sx(c),y+56,sx(d)-sx(c),44,K,{rx:6})+t(sx(d)+12,y+89,26,`DS ₹${c}-${d}`,{fill:G})}).join('')+
  ln(220,620,885,620,'#d8d4c4',3)+[0,20,40,60].map(v=>t(sx(v),612,22,v+' LPA',{a:'middle',fill:G})).join(''));

return {
'SQL': [
 [2, ['How a window function works', 'Rows are not collapsed like GROUP BY. Each row keeps its detail and gets a new column.', winSvg + `<div class="code">SELECT dept, name, salary,
  DENSE_RANK() OVER (PARTITION BY dept
                     ORDER BY salary DESC) AS rank
FROM employees;</div>` + list([['PARTITION BY','Splits rows into groups. Ranking restarts in each.'],['ORDER BY','Decides the order inside each group.']])]],
 [5, ['CTE: write SQL people can read', 'Interviewers notice clean code. A CTE turns a nested mess into steps.', `<div class="code">WITH monthly AS (
  SELECT DATE_TRUNC('month', order_date) AS m,
         SUM(amount) AS revenue
  FROM orders GROUP BY 1
),
growth AS (
  SELECT m, revenue,
         LAG(revenue) OVER (ORDER BY m) AS prev
  FROM monthly
)
SELECT m, revenue,
       ROUND(100.0*(revenue-prev)/prev, 1) AS mom_pct
FROM growth;</div>` + list([['Readable','Each step has a name. Easy to debug one step at a time.'],['Reusable','Refer to the same CTE more than once in the query.']])]],
 [6, ['16 practice questions', 'Solve each using the 8 patterns. If you can do 12, you are interview ready.', qs(['Second highest salary without LIMIT','Top 3 products by revenue per category','Customers who ordered in Jan but not Feb','7-day rolling average of sales','Users with 3+ consecutive login days','Remove duplicate emails, keep latest','% of total revenue by region','Employees earning more than their manager','First order date of every customer','Month on month growth %','COUNT(*) vs COUNT(col) vs COUNT(DISTINCT)','Why NULL = NULL is not true','Median salary per department','Month 2 retention of month 1 users','Highest order per customer with order details','How you would speed up a slow query'])]],
],
'EXCEL': [
 [2, ['Pivot table in 5 steps', 'The fastest way to summarise thousands of rows. Asked in almost every Excel round.', pivotSvg + list([['1. Ctrl + T','Turn data into a Table so the pivot grows with new rows.'],['2. Insert → PivotTable','Place it on a new sheet.'],['3. Rows and Values','Region to Rows, Sales to Values. Month to Columns.'],['4. Group dates','Right-click a date → Group → Months.'],['5. Show as %','Value Field Settings → Show Values As → % of Grand Total.']])]],
 [5, ['Shortcuts that save hours', 'Speed is noticed in live Excel tests. Practise these until they are habit.', list([['Ctrl + T','Convert range to a Table'],['Ctrl + Shift + L','Turn filters on or off'],['Alt + =','AutoSum the column above'],['Ctrl + Arrow keys','Jump to the edge of the data'],['F4','Lock a cell reference ($A$1) while writing a formula'],['Ctrl + ;','Insert today\'s date'],['Ctrl + Alt + V','Paste Special (values, formats, transpose)'],['Ctrl + 1','Format cells']])]],
 [6, ['15 practice questions', 'Use a sales dataset with date, region, product, qty and price.', qs(['Lookup a value that sits left of the key column','Total North sales in March only','Flag orders above average order value','Extract the domain from an email','Count unique customers','Rank salespeople within each region','Convert 20261105 into a real date','Find duplicates across two sheets','Month-end date for every transaction','Create Low / Medium / High buckets','Auto-updating top 5 products by revenue','% contribution of each region','Working days between order and delivery','Combine first and last name','Dropdown that filters a table'])]],
],
'POWER BI': [
 [1, ['Star schema at a glance', 'Draw this in the interview. It shows you understand modelling, not just visuals.', starSvg + box('<b>Rule:</b> numbers you add up live in the fact table. Things you filter or group by live in dimensions.')]],
 [3, ['Power Query: clean before you model', 'Do the cleaning here, not in DAX. Every step is recorded and re-runs on refresh.', list([['Change type','Set dates, whole numbers and text first. Wrong types break relationships.'],['Remove duplicates and blanks','Right-click column → Remove Duplicates. Filter out nulls.'],['Unpivot','Turn Jan, Feb, Mar columns into Month and Value rows. Needed for time analysis.'],['Merge vs Append','Merge = JOIN (adds columns). Append = UNION (adds rows).'],['Group By','Pre-aggregate huge tables to make reports faster.']])]],
 [6, ['Dashboard layout that works', 'Managers read top-left to bottom-right. Put the answer first, detail last.', dashSvg + list([['Top row','3-4 KPI cards with comparison to last period.'],['Middle','One trend chart. Bottom: breakdown and detail table.']])]],
],
'PYTHON': [
 [3, ['Charts in 3 lines', 'One chart that answers the question beats ten pretty ones.', chartSvg + `<div class="code">import matplotlib.pyplot as plt
s = df.groupby("region")["amount"].sum()
s.sort_values().plot(kind="barh")
plt.title("Revenue by region"); plt.show()</div>` + list([['Bar','Compare categories.'],['Line','Show change over time.'],['Histogram','See the spread of one number.']])]],
 [4, ['Clean messy real data', 'Real datasets look nothing like course datasets. These fix most issues.', `<div class="code"># text columns
df["city"] = df["city"].str.strip().str.title()

# money stored as text "₹1,200"
df["amt"] = (df["amt"].str.replace("[₹,]", "", regex=True)
               .astype(float))

# remove outliers with IQR
q1, q3 = df["amt"].quantile([.25, .75])
iqr = q3 - q1
df = df[df["amt"].between(q1-1.5*iqr, q3+1.5*iqr)]

# dates
df["date"] = pd.to_datetime(df["date"], dayfirst=True)</div>` + box('<b>Always print df.shape</b> before and after cleaning. Say how many rows you removed and why.')]],
 [6, ['10 interview questions', 'With the one line answer interviewers want to hear.', list([['loc vs iloc','loc uses labels, iloc uses positions.'],['merge vs concat','merge joins on keys, concat stacks tables.'],['apply vs vectorised','Vectorised is much faster. Use apply only when needed.'],['Missing values?','Check why they are missing, then drop, fill or flag.'],['Huge CSV?','Read in chunks, pick columns with usecols, set dtypes.'],['List vs tuple','List can change, tuple cannot.']])]],
],
'STATISTICS': [
 [1, ['The normal curve', 'Most measurements cluster around the average. This shape is the base of most tests.', normSvg + list([['Why it matters','A value beyond 2 SD happens about 5% of the time. That is the idea behind p < 0.05.'],['z-score','How many SDs a value is from the mean. z = (x − mean) / SD.']])]],
 [3, ['Correlation is not causation', 'The most common mistake in business analysis.', scatSvg + list([['Ask the third factor','What else could drive both numbers? Season, price, region?'],['Prove cause with a test','Only a controlled experiment (A/B test) shows cause.'],['Confidence interval','"Lift is 4% ± 1.5%" tells more than "lift is 4%".']])]],
 [6, ['10 questions with answers', 'Short, clear answers score better than textbook ones.', list([['p-value to a manager','If nothing changed, a result this big would happen less than 5% of the time.'],['Median over mean?','When data is skewed or has outliers.'],['Significant but 0.1% lift?','Statistically real, but check if it is worth the cost.'],['Simpson\'s paradox','A trend in every group reverses when groups are combined.'],['Sample vs population','Sample is the part you measure. Population is everyone.']])]],
],
'DATA SCIENCE': [
 [2, ['Read a confusion matrix', 'Every classification metric comes from these 4 boxes.', cm + `<div class="code">Precision = TP / (TP + FP)
Recall    = TP / (TP + FN)
Accuracy  = (TP + TN) / total</div>`]],
 [4, ['Overfitting in one picture', 'The model memorised the training data instead of learning the pattern.', fit + list([['Signs','Train score 98%, test score 70%.'],['Fixes','More data, simpler model, regularisation, cross-validation, fewer features.'],['Underfitting','Both scores low. Model is too simple.']])]],
 [6, ['ML project workflow', 'Interviewers ask "walk me through your project". Use these steps.', `<div class="code">from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report

X_tr, X_te, y_tr, y_te = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42)
model = RandomForestClassifier(class_weight="balanced")
model.fit(X_tr, y_tr)
print(classification_report(y_te, model.predict(X_te)))</div>` + list([['1. Business problem','What decision will the model support?'],['2. Clean, explore, build features','Most of the time goes here.'],['3. Baseline, explain','Beat a simple baseline, then show top features and the money or time saved.']])]],
],
'CAREER': [
 [1, ['Salary ranges at a glance', 'Indicative ranges in ₹ LPA. Yellow is Data Analyst, black is Data Scientist.', salSvg + box('<b>Pattern:</b> the gap between DA and DS widens with experience. Many analysts move to DS or analytics lead roles at 4-6 years.')]],
 [4, ['Resume: before and after', 'Same work, written to show impact. This is what gets shortlisted.', list([['Before','Created dashboards in Power BI for sales team.'],['After','Built a Power BI sales dashboard used by 40 managers, cutting weekly reporting from 6 hours to 20 minutes.'],['Before','Worked on SQL queries.'],['After','Wrote SQL to find ₹18L in duplicate vendor payments across 2.3M transactions.']]) + box('<b>Formula:</b> action + tool + scale + result in numbers.')]],
 [6, ['5 AI prompts that save hours', 'Use AI to go faster. Always check the output yourself.', `<div class="code">1. "Here is my table schema: [paste].
   Write SQL to [goal] and explain each step."

2. "This Excel formula returns #N/A: [paste].
   List likely causes in order."

3. "Turn this pivot output into 5 insights
   for a sales head: [paste]."

4. "Write DAX for YoY growth using a
   Date table called 'Date'."

5. "Review this Pandas code for bugs
   and speed: [paste]."</div>` + box('<b>Will AI replace analysts?</b> It replaces the typing, not the judgement. Knowing the right question and spotting a wrong answer is the job.')]],
],
};
};
