module.exports = {
id: 't6', cat: 'python', tag: 'PYTHON', kw: 'PY48',
title: 'If I Had a Python Interview in 48 Hours, These 8 Topics Only',
sub: 'The 8 Python topics data analyst interviews actually test, with a 48-hour schedule, the key code for each and the questions to expect.',
pages: [
 { h: 'The 48-hour schedule', l: 'Two days, 4 topics each. Code every example yourself.', items: [
   ['Day 1 morning','Topic 1: core data types. Topic 2: loops, comprehensions, functions.'],
   ['Day 1 evening','Topic 3: loading and inspecting data. Topic 4: cleaning.'],
   ['Day 2 morning','Topic 5: filtering and groupby. Topic 6: merge and pivot.'],
   ['Day 2 evening','Topic 7: dates. Topic 8: charts. Then one timed mock task.'] ] },
 { h: 'Topic 1: Core data types', l: 'Asked as warm-up questions in almost every round.', items: [
   ['List vs tuple vs set vs dict','List: ordered, changeable. Tuple: ordered, fixed. Set: unique values. Dict: key-value pairs.'],
   ['Typical question','"Remove duplicates from a list but keep the order."','seen = set()\nresult = [x for x in items\n          if not (x in seen or seen.add(x))]\n# or simply: list(dict.fromkeys(items))'],
   ['Count frequency','Use a dict or Counter.','from collections import Counter\nCounter(["a","b","a"])   # {"a": 2, "b": 1}'] ] },
 { h: 'Topic 2: Loops, comprehensions, functions', l: 'They check if you can write clean, simple logic.', items: [
   ['List comprehension','One-line transform and filter.','high = [x * 1.18 for x in prices if x > 1000]'],
   ['Function with default argument','Write small reusable functions.','def growth(curr, prev=0):\n    if prev == 0:\n        return None\n    return round((curr - prev) / prev * 100, 1)'],
   ['Typical question','"Find the second largest number in a list without sorting."'] ] },
 { h: 'Topic 3 and 4: Load, inspect, clean', l: 'The first 10 minutes of any take-home task.', items: [
   ['Load and inspect','Always check shape, types and missing values first.','df = pd.read_csv("data.csv")\ndf.shape; df.info(); df.isna().sum()'],
   ['Clean','Duplicates, missing values, types, text.','df = df.drop_duplicates("order_id")\ndf["amount"] = pd.to_numeric(df["amount"],\n                             errors="coerce")\ndf["city"] = df["city"].str.strip().str.title()'],
   ['Typical question','"How do you handle missing values?" Answer: understand why they are missing, then drop, fill or flag. Never fill blindly.'] ] },
 { h: 'Topic 5 and 6: Analyse', l: 'Groupby, merge and pivot answer most take-home questions.', items: [
   ['Filter and groupby','Revenue and order count by region.','df[df["amount"] > 0].groupby("region").agg(\n    revenue=("amount", "sum"),\n    orders=("order_id", "nunique"))'],
   ['Top N per group','Top 3 products by revenue per category.','(df.groupby(["category", "product"])["amount"]\n   .sum().reset_index()\n   .sort_values("amount", ascending=False)\n   .groupby("category").head(3))'],
   ['Merge and pivot','Join tables, then make a report view.','m = orders.merge(customers, on="cust_id", how="left")\nm.pivot_table(index="region", columns="month",\n              values="amount", aggfunc="sum")'] ] },
 { h: 'Topic 7 and 8: Dates and charts', l: 'Almost every dataset has dates. Most tasks end with one chart.', items: [
   ['Dates','Convert, then extract parts or resample.','df["date"] = pd.to_datetime(df["date"])\ndf["month"] = df["date"].dt.to_period("M")\nmonthly = df.set_index("date")["amount"].resample("M").sum()'],
   ['Month-on-month growth','pct_change gives growth from the previous row.','monthly.pct_change().mul(100).round(1)'],
   ['One clear chart','Bar for comparison, line for trend. Always add a title.','monthly.plot(kind="line", title="Monthly revenue")'] ] },
 { h: 'Questions to expect', l: 'Practise answering these out loud in under a minute each.', items: [
   ['loc vs iloc','loc uses labels, iloc uses positions.'],
   ['merge vs concat','merge joins on keys like SQL. concat stacks tables.'],
   ['apply vs vectorised','Vectorised column operations are much faster. Use apply only when there is no built-in way.'],
   ['Large file that does not fit in memory','Read in chunks, load only needed columns with usecols, set smaller dtypes.'],
   ['Walk me through your analysis','Question, cleaning steps, method, finding, recommendation.'] ],
   box: '<b>Last step on day 2:</b> take any sales CSV and answer 5 questions in 45 minutes. That is what most take-home rounds look like.' },
]};
