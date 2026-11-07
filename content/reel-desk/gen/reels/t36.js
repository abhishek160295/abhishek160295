module.exports = {
id: 't36', cat: 'stats', tag: 'STATISTICS', kw: 'STATS30',
title: 'Every Statistics Concept a Data Scientist Needs at ₹20-30 LPA',
sub: 'The complete list of 24 statistics concepts tested in mid-to-senior data scientist interviews, grouped into 6 areas, each explained in plain words.',
pages: [
 { h: 'The 6 areas, 24 concepts', l: 'At this level you are expected to choose the right method and explain its limits, not just define terms.', items: [
   ['1. Descriptive statistics','4 concepts'],['2. Probability','4 concepts'],['3. Inference','4 concepts'],['4. Experimentation','4 concepts'],['5. Regression','4 concepts'],['6. Causal thinking','4 concepts'] ],
   box: 'Score yourself on the last page. 20+ means you are ready for this band.' },
 { h: '1. Descriptive statistics', l: 'Summarising data correctly before modelling anything.', items: [
   ['Mean vs median','Median for skewed data like income or order value. Mean is pulled by outliers.'],
   ['Variance and standard deviation','How spread out values are. SD is in the same units as the data.'],
   ['Percentiles and IQR','p50, p90, p99 for latency or delivery time. IQR = Q3 − Q1, used for outlier rules.'],
   ['Skewness','Long right tail is common in business data. Log-transform before many models.'] ] },
 { h: '2. Probability', l: 'The base of every model and test.', items: [
   ['Conditional probability and Bayes','P(A|B) = P(B|A) × P(A) / P(B). Classic: positive test result for a rare disease is still likely a false positive.'],
   ['Normal distribution','Heights, measurement error, sample means. 68-95-99.7 rule.'],
   ['Binomial and Poisson','Binomial: number of conversions in n visits. Poisson: number of events per hour.'],
   ['Expected value','Average outcome weighted by probability. Used for pricing, risk and decision questions.'] ] },
 { h: '3. Inference', l: 'Going from a sample to a conclusion about everyone.', items: [
   ['Central Limit Theorem','Means of large samples are roughly normal, whatever the data looks like. Why t-tests work on skewed data.'],
   ['Confidence interval','A range that would contain the true value in 95% of repeated samples. Report it with every estimate.'],
   ['p-value','If the null were true, the chance of a result this extreme. It is not the chance the null is true.'],
   ['Type I, Type II and power','False positive, false negative, and the chance of detecting a real effect (aim for 80%).'] ] },
 { h: '4. Experimentation', l: 'The most tested area at product companies.', items: [
   ['Sample size','Set by baseline rate, minimum detectable effect, significance and power. Decide before starting.'],
   ['Peeking problem','Checking daily and stopping when significant inflates false positives. Fix the duration or use sequential methods.'],
   ['Multiple testing','20 metrics at 0.05 gives about 1 false win by chance. Use one primary metric or Bonferroni / FDR correction.'],
   ['Novelty and network effects','Early lift fades. Users influence each other. Run long enough and consider cluster randomisation.'] ] },
 { h: '5. Regression', l: 'Interviewers ask about assumptions and interpretation, not just fitting.', items: [
   ['Linear regression assumptions','Linear relationship, independent errors, constant variance, no strong multicollinearity.'],
   ['Coefficient interpretation','"Holding other features constant, each extra ₹1,000 in income adds X to spend."'],
   ['Logistic regression and odds','Coefficients are log-odds. exp(coef) is the odds ratio.'],
   ['Multicollinearity','Correlated features make coefficients unstable. Check VIF, drop or combine features.'] ] },
 { h: '6. Causal thinking', l: 'What separates ₹30 LPA candidates: knowing when data cannot prove cause.', items: [
   ['Correlation vs causation','Ice cream sales and drownings both rise in summer. Heat drives both.'],
   ['Confounders','A third variable affecting both cause and effect. Control for it or randomise.'],
   ['Selection bias','Analysing only users who stayed hides why others left.'],
   ['Difference-in-differences','When you cannot run an A/B test: compare the change in a treated group to the change in a similar untreated group.'] ] },
 { h: 'Score yourself', l: 'Count the concepts you can explain with a business example, without notes.', items: [
   ['20-24','Ready for ₹20-30 LPA data scientist interviews on the statistics side.'],
   ['14-19','Focus on Experimentation and Causal thinking. They are the most tested at this level.'],
   ['Below 14','Start with Inference. Everything in Experimentation depends on it.'] ],
   box: '<b>Interview tip:</b> for every concept, have one example from your own work or projects. Definitions alone sound junior.' },
]};
