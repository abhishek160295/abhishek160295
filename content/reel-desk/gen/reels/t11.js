module.exports = {
id: 't11', cat: 'python', tag: 'PYTHON + POWER BI', kw: '1HOUR',
title: '1-Hour Daily Python & Power BI Plan for Working Professionals',
sub: 'An 8-week plan built for people with a full-time job. One hour on weekdays, with a mini task every week and one project at the end.',
pages: [
 { h: 'How the hour is split', l: 'The same structure every weekday. It keeps you consistent when work gets busy.', items: [
   ['10 minutes: revise','Re-do yesterday\'s task from memory.'],
   ['20 minutes: learn','One concept only. Docs, a short video or a chapter.'],
   ['30 minutes: build','Apply it to your practice dataset. This is where learning sticks.'],
   ['Weekends','Optional. 1-2 hours to finish the week\'s mini task, or rest.'] ],
   box: '<b>Practice dataset:</b> pick one sales or HR dataset and use it for all 8 weeks, in both Python and Power BI.' },
 { h: 'Weeks 1 to 4: Python', l: 'Monday to Friday, one hour a day.', items: [
   ['Week 1: Python basics','Variables, lists, dicts, loops, functions. Mini task: a function that calculates growth %.'],
   ['Week 2: Pandas basics','read_csv, info, filtering, sorting, new columns. Mini task: load and clean your dataset.'],
   ['Week 3: Pandas analysis','groupby, merge, pivot_table, dates. Mini task: answer 5 business questions.'],
   ['Week 4: Charts and automation','Bar and line charts, saving output to Excel. Mini task: a script that produces a monthly summary file.'] ] },
 { h: 'Weeks 5 to 8: Power BI', l: 'Same hour, now turning analysis into dashboards.', items: [
   ['Week 5: Power Query','Load data, fix types, remove duplicates, unpivot. Mini task: a clean model-ready table.'],
   ['Week 6: Data model and DAX','Star schema, Date table, SUM, DIVIDE, CALCULATE. Mini task: 6 core measures.'],
   ['Week 7: Time intelligence and visuals','YTD, last year, YoY %, cards, line, bar, matrix, slicers. Mini task: a one-page dashboard.'],
   ['Week 8: Project and publish','Combine Python cleaning with Power BI reporting. Publish and write a short README.'] ] },
 { h: 'The week 8 project', l: 'This links both tools the way many teams actually use them.', items: [
   ['Python step','A script that reads raw monthly files, cleans them and saves one clean CSV.'],
   ['Power BI step','Load the clean CSV, build the model and measures, design the dashboard.'],
   ['Refresh step','Next month: run the script, click Refresh in Power BI. The whole report updates.'],
   ['What to show in interviews','"I built a monthly report pipeline: Python cleaning plus a Power BI dashboard, refreshed in under 5 minutes."'] ] },
 { h: 'Rules for busy weeks', l: 'You will miss days. These keep the plan alive.', items: [
   ['Never skip twice','Miss one day, fine. Never miss two in a row.'],
   ['15-minute minimum','On bad days, just do the 10-minute revision and 5 minutes of building.'],
   ['Same time every day','Before work or right after dinner. Habit beats motivation.'],
   ['Use your work data, safely','Practise on similar public data, then apply the skill at work. Never take company data home.'] ],
   box: '<b>After 8 weeks:</b> 40 hours of focused practice, 8 mini tasks and one end-to-end project. Enough to start using both tools at work.' },
]};
