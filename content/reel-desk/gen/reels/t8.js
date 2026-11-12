module.exports = {
id: 't8', cat: 'python', tag: 'PYTHON', kw: 'PY20LPA',
title: 'Every Python Function a Data Analyst Needs at ₹15-20 LPA',
sub: 'The complete list of 24 Python and Pandas functions expected from a mid-level data analyst, grouped into 6 jobs, with the code for each. Ends with a self-check.',
pages: [
 { h: 'The 6 jobs, 24 functions', l: 'At ₹15-20 LPA you are expected to handle messy, large data on your own and automate repeat work.', items: [
   ['1. Load and inspect','4 functions'],['2. Clean','4 functions'],['3. Filter and transform','4 functions'],['4. Summarise','4 functions'],['5. Combine and reshape','4 functions'],['6. Dates and automation','4 functions'] ],
   box: 'Score yourself on the last page. 20+ means your Python matches this salary band.' },
 { h: '1. Load and inspect', l: 'The first 5 minutes with any dataset.', items: [
   ['read_csv / read_excel','Set types and dates while loading.','pd.read_csv("f.csv", parse_dates=["date"],\n            usecols=["id", "date", "amount"])'],
   ['info','Types and non-null counts in one view.','df.info()'],
   ['describe','Quick stats, including percentiles.','df.describe(percentiles=[.5, .9, .99])'],
   ['value_counts','Frequency and share of each value.','df["city"].value_counts(normalize=True)'] ] },
 { h: '2. Clean', l: 'Real data is always dirty. These four handle most problems.', items: [
   ['isna + fillna','Find and fill missing values.','df["discount"] = df["discount"].fillna(0)'],
   ['drop_duplicates','Keep the latest row per key.','df.sort_values("updated").drop_duplicates(\n    "order_id", keep="last")'],
   ['astype / to_numeric','Fix types. errors="coerce" turns bad values into NaN.','df["amt"] = pd.to_numeric(df["amt"], errors="coerce")'],
   ['str methods','Clean text in one line.','df["city"] = df["city"].str.strip().str.title()'] ] },
 { h: '3. Filter and transform', l: 'Select and create columns without loops.', items: [
   ['loc','Filter rows and pick columns, or update values.','df.loc[df["amount"] < 0, "amount"] = 0'],
   ['query','Readable multi-condition filters.','df.query("region == \'North\' and amount > 5000")'],
   ['np.where','If-else on a whole column.','df["size"] = np.where(df["amount"] > 10000,\n                      "Large", "Small")'],
   ['assign','Add several columns in one chain.','df = df.assign(tax=df.amount * 0.18,\n               net=lambda d: d.amount - d.tax)'] ] },
 { h: '4. Summarise', l: 'These answer most business questions.', items: [
   ['groupby + agg','Named aggregations.','df.groupby("region").agg(rev=("amount", "sum"),\n    orders=("order_id", "nunique"))'],
   ['transform','Group value back on every row, for share of group.','df["share"] = df.amount / df.groupby(\n    "region").amount.transform("sum")'],
   ['rank','Rank within groups.','df["rk"] = df.groupby("dept").salary.rank(\n    ascending=False, method="dense")'],
   ['nlargest','Top N quickly.','df.nlargest(10, "amount")'] ] },
 { h: '5. Combine and reshape', l: 'Joining tables and building report views.', items: [
   ['merge','SQL joins. validate catches duplicate keys.','orders.merge(cust, on="cust_id", how="left",\n             validate="many_to_one")'],
   ['concat','Stack monthly files.','pd.concat([jan, feb, mar], ignore_index=True)'],
   ['pivot_table','Excel-style pivot.','df.pivot_table(index="region", columns="month",\n    values="amount", aggfunc="sum", fill_value=0)'],
   ['melt','Wide to long, for month columns.','df.melt(id_vars="region", var_name="month",\n        value_name="sales")'] ] },
 { h: '6. Dates and automation', l: 'This group separates ₹8 LPA from ₹18 LPA analysts.', items: [
   ['dt accessor','Month, weekday, period from dates.','df["month"] = df["date"].dt.to_period("M")'],
   ['resample','Daily data to weekly or monthly totals.','df.set_index("date").amount.resample("W").sum()'],
   ['rolling + pct_change','Moving averages and growth.','s.rolling(7).mean(); s.pct_change().mul(100)'],
   ['glob + to_excel','Combine every file in a folder and save the report.','files = glob.glob("data/*.csv")\npd.concat(map(pd.read_csv, files)).to_excel(\n    "report.xlsx", index=False)'] ] },
 { h: 'Score yourself', l: 'Count how many of the 24 you can use without searching.', items: [
   ['20-24','Your Python matches ₹15-20 LPA roles. Show it with one automation project.'],
   ['14-19','Focus on groups 4-6: transform, merge validate, resample, automation.'],
   ['Below 14','Get groups 1-3 solid first. Practise on one messy real dataset daily.'] ],
   box: '<b>Interview proof:</b> "I automated the weekly report: 12 files merged, cleaned and summarised in one script, saving 5 hours a week." That one line is worth more than the whole list.' },
]};
