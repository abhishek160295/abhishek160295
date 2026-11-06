module.exports = {
id: 't18', cat: 'career', tag: 'CAREER', kw: '5MISTAKES',
title: 'I Rejected 40 Data Analyst Candidates. Same 5 Mistakes Every Time',
sub: 'The 5 mistakes that end data analyst interviews, what each one looks like from the interviewer\'s side, and exactly what to do instead.',
pages: [
 { h: 'Before the 5 mistakes', l: 'Most rejected candidates knew enough SQL and Excel. They lost on how they used it.', items: [
   ['What interviewers are really checking','Can this person take a vague business question, get the right numbers, and explain what they mean?'],
   ['Why skills alone do not save you','Two candidates write the same correct query. The one who explains why the result matters gets the offer.'],
   ['How to use this PDF','For each mistake, read "what it looks like" and be honest about whether you do it.'] ] },
 { h: 'Mistake 1: You cannot explain your own project', l: 'The most common reason I stop an interview early.', items: [
   ['What it looks like','"I used Python to clean the data and made a dashboard." Then silence when I ask why a chart was chosen or how missing values were handled.'],
   ['Why it fails','It tells me the project was followed from a tutorial, not built.'],
   ['Do this instead','For every project know: the question, the data size and source, the hardest cleaning step, one surprising finding, and what you would change.'] ],
   box: '<b>Test yourself:</b> explain your best project for 2 minutes without notes, to someone non-technical. Record it.' },
 { h: 'Mistake 2: Writing SQL before asking a question', l: 'The task is "find our top customers". Most candidates start typing immediately.', items: [
   ['What it looks like','Jumping straight to ORDER BY revenue DESC LIMIT 10.'],
   ['Why it fails','Top by revenue, orders or profit? Which time period? Including returns? Real work starts with these questions.'],
   ['Do this instead','Ask 2 or 3 clarifying questions, state your assumption out loud, then write the query.'] ],
   box: '<b>Say this:</b> "I will define top customers as highest net revenue in the last 12 months, excluding cancelled orders. Is that right?"' },
 { h: 'Mistake 3: Never checking your own numbers', l: 'A wrong number delivered confidently is worse than no number.', items: [
   ['What it looks like','The query returns ₹48 crore monthly revenue for a company that does ₹5 crore a year, and the candidate reads it out.'],
   ['Why it fails','In the job, that number goes to a manager and gets used in a decision.'],
   ['Do this instead','After every result, check: row count before and after joins, totals against a known figure, and whether the scale makes sense.'] ],
   box: '<b>Habit:</b> say "let me sanity check this" before you share any number. Interviewers notice.' },
 { h: 'Mistake 4: A resume of tools, not results', l: 'I read the resume before the interview. This decides how hard I push.', items: [
   ['What it looks like','"Skills: SQL, Python, Power BI, Excel, Tableau, Statistics." Project lines that only say what was used.'],
   ['Why it fails','Everyone lists the same tools. Nothing tells me what you achieved.'],
   ['Do this instead','Every line: action + tool + scale + result.','Built a Power BI sales dashboard for 40 managers,\ncutting weekly reporting from 6 hours to 20 minutes.'] ] },
 { h: 'Mistake 5: No "so what"', l: 'The analysis is correct. The candidate stops at the chart.', items: [
   ['What it looks like','"Sales in the South dropped 12% last quarter." End of answer.'],
   ['Why it fails','Analysts are paid for what the business should do next, not for describing a chart.'],
   ['Do this instead','Finish every answer with cause and action: what likely drove it, how you would confirm it, what you would recommend.'] ],
   box: '<b>Formula:</b> what happened → why it likely happened → what I would check → what I would recommend.' },
 { h: 'Your fix-it checklist', l: 'Work through these before your next interview.', items: [
   ['Project story ready','2-minute version and 30-second version, for each project.'],
   ['Clarify before you code','Practise asking 2 questions before every SQL problem.'],
   ['Sanity checks built in','Row counts, totals, scale. Every time.'],
   ['Resume rewritten','Every line ends with a number.'],
   ['"So what" in every answer','Close with a recommendation, not a description.'] ] },
]};
