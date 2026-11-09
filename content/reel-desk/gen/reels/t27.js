module.exports = {
id: 't27', cat: 'career', tag: 'EXCEL + AI', kw: 'PROMPTS5',
title: '5 ChatGPT Prompts That Do 2 Hours of Excel Work in 2 Minutes',
sub: '5 copy-paste prompts for the Excel jobs that eat the most time: formulas, messy data, pivots, summaries and macros. Each with an example of what you get.',
pages: [
 { h: 'Before you use any prompt', l: 'These 3 rules decide whether the answer is useful or wrong.', items: [
   ['Give the structure, not the data','Paste column names and 5 sample rows. Never paste confidential customer or salary data.'],
   ['Say your Excel version','Excel 365 has XLOOKUP, FILTER and LET. Older versions do not. The formula depends on it.'],
   ['Always test on 3 rows','Check the result by hand on a few rows before filling it down 10,000 rows.'] ] },
 { h: 'Prompt 1: Write the formula', l: 'Replaces 20 minutes of searching forums.', code:
`I use Excel 365. My sheet has these columns:
A: Order Date, B: Region, C: Product, D: Amount.
Data is in rows 2 to 5000.

Write one formula for cell G2 that gives total
Amount for the Region in F2, for the month in E1
only. Explain each part in one line.`,
   items: [['What you get','A SUMIFS with date range conditions, plus an explanation you can repeat in an interview.']] },
 { h: 'Prompt 2: Clean messy data', l: 'Replaces an hour of manual fixing.', code:
`Here are 5 sample rows from my data (paste rows).
Problems I see: extra spaces in names, dates in
mixed formats (01/02/26 and 2026-02-01), amounts
stored as text with "Rs" and commas, and duplicate
order IDs.

Give me step-by-step Power Query steps to fix all
of these, in the order I should apply them.`,
   items: [['What you get','A repeatable cleaning recipe. Next month you just click Refresh.']] },
 { h: 'Prompt 3: Build the pivot report', l: 'Replaces trial and error with pivot fields.', code:
`My columns: Date, Region, Salesperson, Product,
Quantity, Amount.

I need a monthly report for my manager showing:
revenue by region by month, each region's share
of total, and the top 3 salespeople per region.

Tell me exactly which fields go in Rows, Columns,
Values and Filters, and which Value Field Settings
to change.`,
   items: [['What you get','The exact pivot setup, including "Show Values As % of Grand Total" and a Top 3 filter.']] },
 { h: 'Prompt 4: Write the summary', l: 'Replaces 30 minutes of writing the email that goes with the report.', code:
`Here is my pivot output (paste the small summary
table, not raw data).

Write 5 bullet points for a sales head:
- the biggest change vs last month, with numbers
- the best and worst region
- one risk to watch
- one recommended action
Plain language, no jargon, under 120 words.`,
   items: [['What you get','A first draft you edit in 2 minutes. Always check every number against the table.']] },
 { h: 'Prompt 5: Automate the repeat work', l: 'For the task you do every week the same way.', code:
`I do this every Monday in Excel:
1. Open the file "weekly_sales.xlsx"
2. Delete rows where Status = "Cancelled"
3. Sort by Region, then Amount descending
4. Add a total row at the bottom
5. Save as "report_<today's date>.xlsx"

Write a VBA macro that does all 5 steps. Add a
comment above each block. Tell me how to run it.`,
   items: [['What you get','A macro you run with one click. Test it on a copy of the file first.']] },
 { h: 'Where the 2 hours go', l: 'A typical weekly report, before and after.', items: [
   ['Finding the right formula','20-30 min before. Prompt 1: 2 min.'],
   ['Cleaning the data','40-60 min before. Prompt 2 once, then Refresh every week.'],
   ['Setting up the pivot','15-20 min before. Prompt 3: 2 min.'],
   ['Writing the summary','20-30 min before. Prompt 4: 2 min plus a check.'],
   ['Repeating it next week','Prompt 5 turns the whole routine into one click.'] ],
   box: '<b>The rule:</b> AI writes the first draft. You check the numbers. Never send an AI-written number you have not verified.' },
]};
