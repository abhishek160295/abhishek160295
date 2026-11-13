module.exports = {
id: 't37', cat: 'ml', tag: 'DATA SCIENCE', kw: 'DA2DS',
title: 'Data Analyst to Data Scientist in 6 Months. My Exact Roadmap',
sub: 'A month-by-month roadmap for working data analysts moving into data science. Builds on SQL and Excel you already know.',
pages: [
 { h: 'What you already have', l: 'An analyst is not starting from zero. Use what you already know.', items: [
   ['Already strong','SQL, data cleaning, business questions, dashboards, explaining numbers.'],
   ['The gap to close','Python for modelling, statistics, machine learning, and evaluating models.'],
   ['Your edge','Data scientists who cannot explain results are common. You already can.'] ],
   box: '<b>Time:</b> 1.5 hours on weekdays, 3-4 hours on weekends, alongside your current job.' },
 { h: 'Month 1: Python for data science', l: 'Get as comfortable in Python as you are in SQL.', items: [
   ['Weeks 1-2','Pandas in depth: groupby, merge, pivot, dates, missing values. Redo 10 of your SQL analyses in Pandas.'],
   ['Week 3','NumPy basics and charts with Matplotlib or Seaborn.'],
   ['Week 4','Write clean functions and notebooks. Mini project: a full exploratory analysis with findings.'] ] },
 { h: 'Month 2: Statistics', l: 'The part most analysts skip, and interviewers test the most.', items: [
   ['Week 1','Distributions, sampling, Central Limit Theorem.'],
   ['Week 2','Hypothesis testing, p-values, confidence intervals.'],
   ['Week 3','A/B testing end to end: sample size, running, reading results.'],
   ['Week 4','Correlation, linear regression and how to read coefficients.'] ] },
 { h: 'Months 3 and 4: Machine learning', l: 'Learn the core algorithms with scikit-learn on real data.', items: [
   ['Month 3','Train-test split, linear and logistic regression, decision trees, random forest, metrics (MAE, precision, recall, F1).'],
   ['Month 4','Gradient boosting, cross-validation, feature engineering, imbalanced data, pipelines, K-Means.'],
   ['Rule','For every algorithm, build it on one dataset and explain the result in business terms.'] ] },
 { h: 'Month 5: Two projects', l: 'Pick problems from your current domain. That is your strongest story.', items: [
   ['Project 1: Classification','Example: predict which customers will churn. Show recall, top drivers and the ₹ value of acting on it.'],
   ['Project 2: Regression or forecasting','Example: forecast next quarter\'s demand by region and compare against a simple baseline.'],
   ['For both','GitHub repo, clean notebook, a README with the business problem, approach, result and limitations.'] ] },
 { h: 'Month 6: Make the switch', l: 'The fastest route is often inside your current company.', items: [
   ['Internal move','Offer a small model that helps your current team. A working model is the best application.'],
   ['Resume','Title your projects by business outcome: "Churn model that flags 70% of churners 30 days early".'],
   ['Interview prep','Statistics questions, ML concepts, SQL, and walking through both projects.'],
   ['Target roles','Data scientist, product analyst with ML, decision scientist, analytics engineer with ML.'] ],
   box: '<b>Honest note:</b> 6 months makes you ready to apply for junior and associate data scientist roles. Interviews and the move itself can take a few more months.' },
]};
