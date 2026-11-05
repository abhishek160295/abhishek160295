module.exports = {
id: 't7', cat: 'powerbi', tag: 'POWER BI', kw: 'PBI15',
title: 'Every Power BI Skill a Data Analyst Needs at ₹12-18 LPA',
sub: 'The complete skill list for a mid-level Power BI analyst role, grouped into 6 areas, with what "good enough" looks like for each. Ends with a self-check.',
pages: [
 { h: 'The 6 skill areas', l: 'At ₹12-18 LPA, companies expect you to own a report end to end, not just build visuals someone else designed.', items: [
   ['1. Data modelling','4 skills'],['2. DAX','5 skills'],['3. Power Query','4 skills'],['4. Report design','4 skills'],['5. Power BI Service','4 skills'],['6. Performance and business sense','4 skills'] ],
   box: '<b>25 skills in total.</b> Use the last page to score yourself.' },
 { h: '1. Data modelling', l: 'Most wrong numbers in Power BI come from the model, not the DAX.', items: [
   ['Star schema','Fact table in the middle, dimensions around it. You can draw and explain it.'],
   ['Relationships and cardinality','One-to-many by default. You know why many-to-many and both-direction filters are risky.'],
   ['Date table','You create one with CALENDAR or Power Query, mark it as a date table, and link every date to it.'],
   ['Clean column design','Remove unused columns, correct data types, hide keys from report view.'] ] },
 { h: '2. DAX', l: 'You do not need 200 functions. You need to understand context.', items: [
   ['CALCULATE and filter context','You can explain how CALCULATE changes filters, with ALL and REMOVEFILTERS.','% of Total = DIVIDE([Sales], CALCULATE([Sales], ALL(Product)))'],
   ['Time intelligence','YTD, last year, YoY %, rolling 3 months.','Sales LY = CALCULATE([Sales], SAMEPERIODLASTYEAR(\'Date\'[Date]))'],
   ['Iterators','SUMX, AVERAGEX for row-by-row maths like Qty × Price.'],
   ['Variables','VAR and RETURN to make long measures readable and faster.'],
   ['Ranking and Top N','RANKX and TOPN for "top 10 customers" style visuals.'] ] },
 { h: '3. Power Query', l: 'Clean the data before it reaches the model. Every step re-runs on refresh.', items: [
   ['Shaping','Change types, split columns, remove duplicates, replace errors.'],
   ['Unpivot','Turn month columns into Month and Value rows. Needed for any time analysis.'],
   ['Merge and Append','Merge is a JOIN, Append is a UNION. You know which join kind to pick.'],
   ['Parameters and folders','Combine 12 monthly Excel files from a folder automatically. Use parameters for file paths or dates.'] ] },
 { h: '4. Report design', l: 'A manager should get the answer in 5 seconds.', items: [
   ['Layout','KPI cards on top, trend in the middle, breakdown and detail below.'],
   ['Drill-through and tooltips','Right-click a region to open its detail page. Hover to see extra numbers.'],
   ['Bookmarks and buttons','Toggle between chart and table, or reset all filters with one click.'],
   ['Consistent formatting','One colour for one meaning, ₹ in lakhs or crores, no 3D or pie charts with 10 slices.'] ] },
 { h: '5. Power BI Service', l: 'Building the report is half the job. Sharing it safely is the other half.', items: [
   ['Workspaces and apps','Publish to a workspace, share through an app, manage roles.'],
   ['Scheduled refresh and gateway','Set daily refresh. Know when an on-premises gateway is needed.'],
   ['Row Level Security','Create roles so each regional manager sees only their region.','[Region] = USERPRINCIPALNAME() mapping, or a static role per region'],
   ['Import vs DirectQuery','Import for speed, DirectQuery for very large or near real-time data.'] ] },
 { h: '6. Performance and business sense', l: 'This is what moves you from ₹8 LPA to ₹15 LPA.', items: [
   ['Performance Analyzer','Find the slow visual. Fix with fewer visuals per page and simpler measures.'],
   ['Reduce model size','Remove high-cardinality columns like timestamps you do not need.'],
   ['Define KPIs with the business','Write down exactly what "active customer" or "revenue" means before building.'],
   ['Tell the story','Every page answers one question. Add a one-line insight at the top.'] ] },
 { h: 'Score yourself', l: 'Count how many of the 25 skills you can do without looking anything up.', items: [
   ['20-25','Ready for ₹12-18 LPA roles. Put 2 strong dashboards on your portfolio and apply.'],
   ['12-19','Close. Spend 3-4 weeks on DAX context and Power BI Service.'],
   ['Below 12','Start with modelling and Power Query. They make everything else easier.'] ],
   box: '<b>Interview tip:</b> bring one dashboard you built and explain the model, 2 measures and one business decision it changed.' },
]};
