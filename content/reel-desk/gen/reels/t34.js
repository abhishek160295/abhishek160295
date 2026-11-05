module.exports = {
id: 't34', cat: 'ml', tag: 'DATA SCIENCE', kw: 'DS24',
title: "If I Had a Data Science Interview in 24 Hours, I'd Study Only This",
sub: 'An hour-by-hour plan for the last 24 hours, with the exact topics, answers and code to revise. Nothing extra.',
pages: [
 { h: 'The 24-hour plan', l: 'Study in this order. The most asked topics come first, so even if you stop early you have covered what matters.', items: [
   ['Hours 1-4: Statistics','p-value, tests, A/B testing, distributions. Asked in almost every round.'],
   ['Hours 5-9: Machine learning','Core algorithms, metrics, overfitting, imbalance.'],
   ['Hours 10-13: SQL and Python','Window functions and Pandas groupby. Usually a live coding round.'],
   ['Hours 14-16: Case question','Metric dropped or design an experiment.'],
   ['Hours 17-19: Your own projects','The round most people lose.'],
   ['Hours 20-21: One mock interview','Say answers out loud. Record yourself.'],
   ['Hours 22-24: Sleep','A tired brain forgets definitions. Do not skip this.'] ] },
 { h: 'Hours 1-4: Statistics', l: 'Know these answers in one or two lines each.', items: [
   ['p-value','If nothing really changed, the chance of seeing a result this extreme. Below 0.05 usually counts as significant.'],
   ['Type I vs Type II error','Type I is a false alarm. Type II is missing a real effect, usually from a small sample.'],
   ['Central Limit Theorem','Averages of large samples are roughly normal, whatever the original data looks like. That is why t-tests work.'],
   ['Which test','Two means: t-test. Three or more: ANOVA. Two categories: chi-square. Two rates: z-test.'],
   ['A/B test steps','One metric, fix sample size first, random split, run full weeks, no peeking, check guardrails.'] ] },
 { h: 'Hours 5-9: Machine learning', l: 'Interviewers test understanding, not memory. Be ready to explain trade-offs.', items: [
   ['Bias vs variance','High bias: too simple, underfits. High variance: memorises, overfits.'],
   ['Random Forest vs Gradient Boosting','Forest builds trees in parallel and averages. Boosting builds them one after another, each fixing the last one\'s errors.'],
   ['Precision vs recall','Precision: of what I flagged, how much was right. Recall: of all real cases, how many I caught.'],
   ['Imbalanced data','Do not trust accuracy. Use recall, F1, PR-AUC. Fix with class weights or resampling.'],
   ['Regularisation','L1 (Lasso) can drop features to zero. L2 (Ridge) shrinks all of them.'],
   ['Data leakage','A feature that would not exist at prediction time. Gives great test scores and fails in production.'] ] },
 { h: 'Hours 10-13: SQL and Python', l: 'Practise these exact patterns. Most coding rounds are a variation.', code:
`-- Top 3 products by revenue per category
SELECT * FROM (
  SELECT category, product, SUM(revenue) rev,
    RANK() OVER (PARTITION BY category
      ORDER BY SUM(revenue) DESC) rk
  FROM sales GROUP BY category, product) t
WHERE rk <= 3;

# Same in Pandas
s = df.groupby(["category","product"])["revenue"].sum()
s.groupby(level=0, group_keys=False).nlargest(3)`,
   items: [['Also revise','LAG for period change, LEFT JOIN with IS NULL, merge and pivot_table in Pandas.']] },
 { h: 'Hours 14-16: Case question', l: '"Daily orders dropped 15% yesterday. What do you do?" Use this structure for any metric question.', items: [
   ['1. Check the data first','Is tracking broken? Did a dashboard or definition change?'],
   ['2. Internal or external','Release, pricing change, outage? Or holiday, competitor, weather?'],
   ['3. Slice the drop','By platform, city, new vs returning users, funnel step. Find where it is concentrated.'],
   ['4. Form a hypothesis and test it','"Drop is only on Android after yesterday\'s app update."'],
   ['5. Recommend','Roll back, fix, or monitor. Say what metric would confirm it.'] ] },
 { h: 'Hours 17-19: Your projects', l: 'Prepare a 2-minute story for each project on your resume. Use this order.', items: [
   ['Problem','What business question, for whom, why it mattered.'],
   ['Data','Source, size, the messiest cleaning issue you fixed.'],
   ['Approach','Baseline first, then the model you chose and why not the alternatives.'],
   ['Result in numbers','"Recall went from 0.52 to 0.81" or "saves ₹12 lakh a year".'],
   ['What you would do differently','Shows maturity. Every interviewer asks it.'] ],
   box: '<b>Rule:</b> if you cannot explain a line on your resume for 2 minutes, remove it before the interview.' },
 { h: 'Last-night checklist', l: 'Hours 20-24. Do these, then stop studying.', items: [
   ['One mock interview','Ask a friend or record yourself answering 5 questions from this PDF.'],
   ['3 questions to ask them','Team\'s biggest data problem, how success is measured, what the first 90 days look like.'],
   ['Setup ready','Laptop charged, IDE or SQL editor open, resume printed or on screen.'],
   ['Sleep 6+ hours','Recall drops sharply when you are tired. The last 3 hours of study are worth less than sleep.'] ] },
]};
