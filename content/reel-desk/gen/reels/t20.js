module.exports = {
id: 't20', cat: 'career', tag: 'CAREER', kw: 'ICHECK',
title: 'I Take Data Analyst Interviews. This Is What I Actually Check',
sub: 'The 6 things I score in every data analyst interview, what a weak and a strong answer look like for each, and how to prepare.',
pages: [
 { h: 'What gets scored', l: 'Tools are the entry ticket. These 6 decide the offer.', items: [
   ['1. How you approach a vague question','Do you clarify before you start?'],
   ['2. SQL you can explain','Not just correct, but reasoned.'],
   ['3. Whether you check your numbers','Sanity checks before sharing.'],
   ['4. Your own project, in depth','Did you really build it?'],
   ['5. Business sense','Do you know why the number matters?'],
   ['6. Communication','Can a manager follow you?'] ] },
 { h: '1. Approaching a vague question', l: '"Our sales are down. Look into it." This is how I start most case rounds.', items: [
   ['Weak answer','Starts listing queries immediately.'],
   ['Strong answer','"Down compared to what period? Is it all regions or some? Revenue or order count? Any recent changes like pricing or a site release?"'],
   ['What I learn','Whether you can work without perfect instructions. That is most of the real job.'] ] },
 { h: '2. SQL you can explain', l: 'I give a medium question, usually a ranking or month-on-month problem.', items: [
   ['Weak answer','Silent typing, then a query that may or may not run.'],
   ['Strong answer','"I will first get monthly revenue in a CTE, then use LAG to get the previous month, then calculate the percentage."'],
   ['What I learn','Whether your logic is clear. A small syntax error is fine if your thinking is right.'] ] },
 { h: '3. Checking your own numbers', l: 'I sometimes give data with a trap: duplicates, or a join that doubles rows.', items: [
   ['Weak answer','Reads out the result as final.'],
   ['Strong answer','"Total is ₹4.2 crore. That looks high for one month. Let me check row counts after the join."'],
   ['What I learn','Whether I can trust your numbers when they go to leadership.'] ] },
 { h: '4. Your own project', l: 'I pick one project from your resume and go 3 levels deep.', items: [
   ['Level 1','"What was the question?" Most people answer this.'],
   ['Level 2','"How did you handle missing values? Why that chart?" Half the candidates struggle here.'],
   ['Level 3','"What would you do differently? What did the data not tell you?" This separates the strong ones.'],
   ['How to prepare','Know every decision in your project and the reason behind it.'] ] },
 { h: '5 and 6: Business sense and communication', l: 'The two that move you from "maybe" to "hire".', items: [
   ['Weak business answer','"Revenue went down 12%."'],
   ['Strong business answer','"Revenue went down 12%, mostly from repeat customers in two cities after a delivery fee change. I would check if reversing it for repeat buyers recovers orders."'],
   ['Weak communication','Long technical detail before the point.'],
   ['Strong communication','Answer first, then the reason, then detail only if asked.'] ] },
 { h: 'How to prepare for my interview', l: 'A one-week plan that covers all 6.', items: [
   ['Days 1-2','Practise 5 vague case questions. Write 3 clarifying questions for each before solving.'],
   ['Days 3-4','Solve 10 SQL problems while speaking your approach out loud.'],
   ['Day 5','For every result you get in practice, write one sanity check.'],
   ['Day 6','Go 3 levels deep on your best project. Write down every decision and why.'],
   ['Day 7','Mock interview: answer first, reason second, detail last.'] ],
   box: '<b>Bottom line:</b> I hire the person I would trust to send numbers to my manager without me checking them.' },
]};
