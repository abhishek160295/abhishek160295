module.exports = {
id: 't38', cat: 'stats', tag: 'STATISTICS', kw: 'STATS10',
title: 'The Only 10 Statistics Questions Asked in Every Data Interview',
sub: 'The 10 statistics questions that come up again and again in data analyst and data scientist interviews, each with a clear answer and an example you can say out loud.',
pages: [
 { h: 'Questions 1 and 2', l: 'The warm-up questions. Get these smooth.', items: [
   ['1. Mean vs median: when do you use which?','Median when data is skewed or has outliers, like salaries or order values. Mean when data is roughly symmetric.'],
   ['Example to say','"Average order value was ₹2,400 but median was ₹900. A few bulk orders pulled the mean up, so I reported the median."'],
   ['2. What is standard deviation?','How spread out values are around the average, in the same units as the data.'],
   ['Example to say','"Two stores both average ₹1 lakh a day, but one has SD ₹5,000 and the other ₹40,000. The second is far less predictable."'] ] },
 { h: 'Questions 3 and 4', l: 'The most asked statistics questions overall.', items: [
   ['3. Explain p-value simply','If nothing really changed, the probability of seeing a result at least this extreme. Small p-value means the result is unlikely to be just chance.'],
   ['Trap to avoid','It is not "the probability the null hypothesis is true".'],
   ['4. Type I vs Type II error','Type I: false positive, you say there is an effect when there is none. Type II: false negative, you miss a real effect.'],
   ['Example to say','"Type I: launching a new checkout that does not actually help. Type II: dropping one that would have helped because the test was too small."'] ] },
 { h: 'Questions 5 and 6', l: 'Show you understand samples and uncertainty.', items: [
   ['5. What is the Central Limit Theorem?','Averages of large enough samples are roughly normally distributed, whatever the shape of the original data.'],
   ['Why it matters','It is why t-tests and confidence intervals work on skewed business data like revenue.'],
   ['6. What is a confidence interval?','A range that would contain the true value in 95% of repeated samples.'],
   ['Example to say','"Conversion lift is 2.1%, with a 95% confidence interval of 0.8% to 3.4%. The whole range is above zero, so the lift is real."'] ] },
 { h: 'Questions 7 and 8', l: 'Applied questions. Interviewers want the business link.', items: [
   ['7. Correlation vs causation','Correlation means two things move together. Causation means one causes the other. A third factor can drive both.'],
   ['Example to say','"Customers who use the app more spend more. But high spenders may just like the app. Only an experiment proves the app causes spending."'],
   ['8. How do you detect outliers?','IQR rule: below Q1 − 1.5×IQR or above Q3 + 1.5×IQR. Or z-score above 3. Then decide: error, or a real extreme case?'],
   ['Key point','Never delete outliers without checking why they exist.'] ] },
 { h: 'Question 9: A/B test design', l: '"How would you test a new checkout button?" Answer in this order.', items: [
   ['1. Metric','One primary metric: checkout conversion rate. Plus guardrails like revenue per user.'],
   ['2. Hypothesis','H0: no difference. H1: new button changes conversion.'],
   ['3. Sample size','Based on current rate, smallest lift worth detecting, 5% significance and 80% power.'],
   ['4. Run','Random 50/50 split by user, full weeks, no stopping early.'],
   ['5. Decide','Check significance and confidence interval, then guardrails, then ship or not.'] ] },
 { h: 'Question 10: Simpson\'s paradox', l: 'Asked to see if you check results by segment.', items: [
   ['What it is','A trend that appears in every group reverses when the groups are combined.'],
   ['Example','Version B converts better on mobile and on desktop separately, but worse overall, because B got far more mobile traffic, which converts lower.'],
   ['What to say','"I always break results by key segments like device and new vs returning users before concluding."'] ],
   box: '<b>Pattern across all 10:</b> definition in one line, then a business example. That combination is what scores.' },
 { h: 'How to practise these', l: 'Two days is enough if you do it this way.', items: [
   ['Day 1','Write your own one-line answer and one example for each question, from your work or projects.'],
   ['Day 2','Say all 10 out loud, under 60 seconds each. Record and listen back.'],
   ['Before the interview','Re-read questions 3, 4 and 9. They come up most.'] ] },
]};
