module.exports = {
id: 't5', cat: 'powerbi', tag: 'POWER BI', kw: 'PBI3HR',
title: 'If I Had a Power BI Interview Tomorrow With Only 3 Hours',
sub: 'A 3-hour plan: what to revise in each hour, with the exact answers and DAX to have ready. Built around what Power BI interviews actually ask.',
pages: [
 { h: 'The 3-hour plan', l: 'Do it in this order. Hour 1 covers the questions asked in almost every round.', items: [
   ['Hour 1: Data model and DAX basics','Star schema, relationships, measures vs columns, CALCULATE.'],
   ['Hour 2: Time intelligence and common measures','YoY, YTD, % of total, ranking. Write them, do not just read them.'],
   ['Hour 3: Service, performance and your project','RLS, refresh, slow reports, and your 2-minute dashboard story.'] ],
   box: '<b>Rule:</b> in each hour, spend half the time reading and half saying the answers out loud.' },
 { h: 'Hour 1: Model answers', l: 'Have a one-line answer for each.', items: [
   ['Star schema','A fact table of events (sales) in the middle, dimension tables (date, product, customer) around it, one-to-many relationships.'],
   ['Why a Date table','Time intelligence needs a continuous date column marked as a date table.'],
   ['Measure vs calculated column','Column: row by row at refresh, stored, used to slice. Measure: at query time, used for totals.'],
   ['Filter vs row context','Row context is the current row in an iteration. Filter context is what slicers, visuals and CALCULATE filter.'],
   ['What CALCULATE does','Changes the filter context, then evaluates the expression.'] ] },
 { h: 'Hour 1: DAX to write', l: 'Write each one from memory. Then check.', code:
`Total Sales = SUM(Sales[Amount])

Sales North =
CALCULATE([Total Sales], Region[Name] = "North")

Sales All Regions =
CALCULATE([Total Sales], ALL(Region))

Revenue = SUMX(Sales, Sales[Qty] * Sales[Price])` ,
   items: [['SUM vs SUMX','SUMX goes row by row first. Needed when you multiply columns.']] },
 { h: 'Hour 2: Measures they ask for', l: 'These 5 come up in most practical rounds.', code:
`% of Total =
DIVIDE([Total Sales], CALCULATE([Total Sales], ALL(Product)))

Sales LY =
CALCULATE([Total Sales], SAMEPERIODLASTYEAR('Date'[Date]))

YoY % = DIVIDE([Total Sales] - [Sales LY], [Sales LY])

Sales YTD = TOTALYTD([Total Sales], 'Date'[Date])

Product Rank =
RANKX(ALL(Product[Name]), [Total Sales], , DESC)`,
   items: [['Why DIVIDE','Returns blank instead of an error when the denominator is 0.']] },
 { h: 'Hour 3: Service and performance', l: 'These separate people who have used Power BI at work from those who have only built in Desktop.', items: [
   ['Row Level Security','Create roles in Desktop with a DAX filter, assign users to roles in the Service.'],
   ['Import vs DirectQuery','Import: fast, data copied, scheduled refresh. DirectQuery: live, slower, for very large or real-time data.'],
   ['Refresh and gateway','Scheduled refresh in the Service. A gateway is needed when the data source is on-premises.'],
   ['Slow report fixes','Use Performance Analyzer, reduce visuals per page, remove unused columns, prefer measures to calculated columns, keep a star schema.'] ] },
 { h: 'Hour 3: Your project story', l: 'Almost every interview ends with "walk me through a dashboard you built". Prepare this.', items: [
   ['The business question','"Sales heads could not see which regions were missing target until month end."'],
   ['The data and model','Sources, how you cleaned them in Power Query, your star schema.'],
   ['2 measures you wrote','Explain one simple and one with CALCULATE or time intelligence.'],
   ['The impact','"Managers now check daily. Weekly review prep dropped from 4 hours to 30 minutes."'] ] },
 { h: 'Last 10 minutes', l: 'Before you log in or walk in.', items: [
   ['Open Power BI Desktop','If there is a live task, you do not want to wait for it to load.'],
   ['Have a sample file ready','Any sales dataset, in case they ask you to build something quickly.'],
   ['Say your project story once','Out loud, in under 2 minutes.'],
   ['Prepare 2 questions for them','What data sources the team uses, and how reports are used in decisions.'] ] },
]};
