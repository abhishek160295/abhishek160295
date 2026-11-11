module.exports = {
id: 't35', cat: 'ml', tag: 'DATA SCIENCE', kw: 'ML60',
title: 'If I Have 0 Knowledge of Machine Learning, This Is My 60-Day Plan',
sub: 'A day-by-day 60-day plan from zero to building and explaining real machine learning models. 1.5 to 2 hours a day. Free resources only.',
pages: [
 { h: 'How the 60 days are split', l: 'Each block builds on the one before. Do not skip ahead.', items: [
   ['Days 1-10: Python and Pandas','You cannot do ML without handling data.'],
   ['Days 11-20: Statistics and maths you need','Only the parts ML actually uses.'],
   ['Days 21-35: Core algorithms','Regression, classification, trees, clustering.'],
   ['Days 36-45: Making models good','Features, validation, tuning, imbalanced data.'],
   ['Days 46-60: Two projects','The part that gets you interviews.'] ],
   box: '<b>Daily rule:</b> 30 minutes learning, the rest coding. Watching without coding does not count.' },
 { h: 'Days 1 to 10: Python and Pandas', l: 'Goal: load any CSV, clean it, and summarise it without help.', items: [
   ['Days 1-3','Python basics: variables, lists, dicts, loops, functions.'],
   ['Days 4-6','Pandas: read_csv, info, filtering with loc and query, groupby.'],
   ['Days 7-8','Cleaning: missing values, duplicates, types, dates.'],
   ['Days 9-10','Charts with Matplotlib or Seaborn. Mini task: explore one Kaggle dataset and write 5 findings.'] ] },
 { h: 'Days 11 to 20: Statistics and maths', l: 'Learn what each idea means and when it matters. Skip proofs.', items: [
   ['Days 11-13','Mean, median, standard deviation, distributions, percentiles.'],
   ['Days 14-15','Correlation, and why it is not causation.'],
   ['Days 16-17','Probability basics and conditional probability.'],
   ['Days 18-19','Linear algebra intuition: vectors, matrices, dot product. Just enough to read model code.'],
   ['Day 20','Gradient descent intuition: how a model improves by small steps. A visual explainer is enough.'] ] },
 { h: 'Days 21 to 35: Core algorithms', l: 'Learn each with scikit-learn on a real dataset.', items: [
   ['Days 21-23','Train-test split, linear regression, MAE and RMSE. Predict house prices.'],
   ['Days 24-26','Logistic regression, confusion matrix, precision, recall, F1. Predict churn.'],
   ['Days 27-29','Decision trees and random forests. Feature importance.'],
   ['Days 30-32','Gradient boosting with LightGBM or XGBoost.'],
   ['Days 33-35','K-Means clustering. Segment customers and name each segment.'] ],
   code: `from sklearn.model_selection import (
    train_test_split)
X_tr, X_te, y_tr, y_te = train_test_split(
    X, y, test_size=0.2)
model.fit(X_tr, y_tr)
print(model.score(X_te, y_te))` },
 { h: 'Days 36 to 45: Making models good', l: 'This is where beginners and job-ready candidates separate.', items: [
   ['Days 36-37','Cross-validation. Why one train-test split is not enough.'],
   ['Days 38-39','Feature engineering: encoding categories, scaling, date features.'],
   ['Days 40-41','Imbalanced data: class weights, resampling, choosing the right metric.'],
   ['Days 42-43','Hyperparameter tuning with GridSearchCV or RandomizedSearchCV.'],
   ['Days 44-45','Pipelines: put cleaning and model in one object so nothing leaks.'] ] },
 { h: 'Days 46 to 60: Two projects', l: 'One classification, one regression or clustering. Real business framing.', items: [
   ['Days 46-52: Project 1, churn prediction','Clean, explore, baseline, improve, explain top features, estimate ₹ impact of acting on predictions.'],
   ['Days 53-58: Project 2, sales forecast or segmentation','Same structure. Finish with clear recommendations.'],
   ['Day 59','Push both to GitHub with a README a manager can read in 2 minutes.'],
   ['Day 60','Practise explaining each project out loud in 2 minutes.'] ] },
 { h: 'Free resources for each block', l: 'Use one per block. Switching between many slows you down.', items: [
   ['Python and Pandas','Kaggle Learn: Python and Pandas courses.'],
   ['Statistics','StatQuest (YouTube): short visual explanations.'],
   ['Algorithms','scikit-learn user guide plus StatQuest videos on each algorithm.'],
   ['Practice data','Kaggle datasets: telecom churn, house prices, mall customers.'] ],
   box: '<b>Day 60 check:</b> can you take a new dataset, build a baseline and an improved model, and explain why it is better? Then you are ready to apply.' },
]};
