module.exports = {
id: 't2', cat: 'powerbi', tag: 'POWER BI', kw: '6VISUALS',
title: 'Stop Learning 50 Power BI Visuals. These 6 Are Enough',
sub: 'The 6 visuals behind almost every business dashboard. For each: when to use it, the settings that matter and the mistake to avoid. Plus which visuals to skip.',
pages: [
 { h: 'Visual 1: Card', l: 'The headline number. Managers read these before anything else.', items: [
   ['Use it for','Revenue, orders, margin %, active customers. One number per card.'],
   ['Settings that matter','Display units in lakhs or crores, 1 decimal place, a short clear label.'],
   ['Make it better','Add a second card or measure showing change vs last period, coloured green or red.','Rev vs LY % = DIVIDE([Revenue] - [Revenue LY], [Revenue LY])'],
   ['Mistake to avoid','More than 4-5 cards in one row. The eye stops reading them.'] ] },
 { h: 'Visual 2: Line chart', l: 'Anything over time. The second thing every manager looks at.', items: [
   ['Use it for','Monthly revenue, daily orders, weekly active users.'],
   ['Settings that matter','Date table on the x-axis, continuous type, markers off unless few points.'],
   ['Make it better','Add last year as a second line, or a constant line for the target.'],
   ['Mistake to avoid','More than 3-4 lines. Use a slicer to switch category instead.'] ] },
 { h: 'Visual 3: Bar chart', l: 'Comparing categories. The most useful chart you will ever build.', items: [
   ['Use it for','Revenue by region, top 10 products, tickets by team.'],
   ['Settings that matter','Horizontal bars for long names. Sort descending by value.'],
   ['Make it better','Top N filter on the visual (Filters pane → Top N) to keep only the top 10.'],
   ['Mistake to avoid','Sorting alphabetically. Nobody wants to find the biggest bar.'] ] },
 { h: 'Visual 4: Matrix', l: 'The detail table that answers "show me the numbers behind this".', items: [
   ['Use it for','Region by month, product by store, any two-way breakdown.'],
   ['Settings that matter','Rows and columns hierarchies for drill-down, subtotals on, stepped layout.'],
   ['Make it better','Conditional formatting: background colour or data bars on the key column.'],
   ['Mistake to avoid','Using it as the main visual. It belongs at the bottom of the page.'] ] },
 { h: 'Visual 5: Slicer', l: 'Lets people answer their own questions without asking you for a new report.', items: [
   ['Use it for','Date range, region, product category, channel.'],
   ['Settings that matter','Dropdown style to save space. Between style for dates.'],
   ['Make it better','Sync slicers across pages (View → Sync slicers) so filters follow the user.'],
   ['Mistake to avoid','8 slicers on one page. Keep 2-3 and move the rest into the Filters pane.'] ] },
 { h: 'Visual 6: Line and column chart', l: 'Two measures, one chart. Perfect for actual vs target or volume vs rate.', items: [
   ['Use it for','Revenue as columns with margin % as a line. Orders with conversion rate.'],
   ['Settings that matter','Secondary y-axis for the line. Label both axes clearly.'],
   ['Make it better','Target as the line, actual as columns. Gaps jump out instantly.'],
   ['Mistake to avoid','Two measures with the same unit. Use a normal line chart instead.'] ] },
 { h: 'Visuals to skip', l: 'These look impressive in tutorials and confuse people at work.', items: [
   ['Pie and donut with many slices','Above 3-4 slices, nobody can compare the angles. Use a bar chart.'],
   ['Gauge','Takes a lot of space for one number. Use a card with a target comparison.'],
   ['Word cloud','Size of words is not a measure people can read. Use a bar chart of counts.'],
   ['3D or heavy custom visuals','Hard to read, slow, and often break after updates.'] ],
   box: '<b>Rule:</b> if a bar chart can show it, use a bar chart.' },
 { h: 'Put the 6 on one page', l: 'This layout covers most business dashboards.', items: [
   ['Top','3-4 cards: Revenue, Orders, Average order value, Margin %.'],
   ['Left middle','Line chart: revenue trend vs last year.'],
   ['Right middle','Bar chart: revenue by region, sorted.'],
   ['Bottom','Matrix: region by month, with conditional formatting.'],
   ['Side or top-right','2-3 slicers: date, category, channel.'],
   ['Second page','Line and column chart: actual vs target by month.'] ] },
]};
