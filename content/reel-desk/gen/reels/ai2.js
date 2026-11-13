module.exports = {
id: 'ai2', cat: 'career', tag: 'AI', kw: 'AILEARN',
title: 'Everyone Is Talking About AI. No One Tells You What You Need to Learn',
sub: 'The AI skills to learn, in the right order, for data and tech careers. What to learn, what to skip, and a 90-day plan.',
pages: [
 { h: 'Pick your level first', l: 'People stall because they try to learn everything. Most jobs need level 1 and 2.', items: [
   ['Level 1: Use AI well (everyone)','Clear prompts, check every output, keep company data private, know where AI is weak.'],
   ['Level 2: Work with AI (data and tech roles)','Use AI for SQL, Python and analysis. Understand tokens, context window and hallucination.'],
   ['Level 3: Build with AI (builders)','Call models from code, get JSON output, embeddings, RAG, agents, evaluation.'],
   ['Not needed for most jobs','Training large models from scratch. That is research work.'] ] },
 { h: 'Level 1: Use AI well', l: 'Use these 5 parts for almost any prompt. The last one catches most mistakes.', code:
`ROLE:    You are a senior data analyst.
CONTEXT: Table sales has order_id,
         order_date, region, amount.
TASK:    Month-on-month revenue growth %
         by region.
FORMAT:  PostgreSQL, one line per step.
CHECK:   List 2 ways this could be wrong.`,
   items: [
   ['Check every output','AI can be confidently wrong. Verify numbers, names and code.'],
   ['Protect data','Never paste confidential data into a public AI tool. Follow your company\'s AI policy.'],
   ['Your basics matter more now','SQL, Python, statistics and business sense let you judge what AI gives you.'] ] },
 { h: 'Level 2: How AI works', l: 'The 5 terms that come up at work and in interviews, in plain words.', items: [
   ['LLM','Large language model. Predicts the next piece of text based on patterns learned from huge amounts of text.'],
   ['Token','The unit of text a model reads and writes, roughly part of a word. Usage is counted in tokens.'],
   ['Context window','How much text the model can consider at once, including your prompt and its reply.'],
   ['Temperature','Randomness setting. Lower gives more consistent answers, higher gives more varied ones.'],
   ['Hallucination','A confident answer that is wrong. The reason checking output is a core skill.'] ] },
 { h: 'Level 3 and your 90-day plan', l: 'Build skills in order, one hour a day.', items: [
   ['Days 1-15','Use AI daily at work with the 5-part prompt. Check every output.'],
   ['Days 16-45','Strengthen SQL, Python and statistics. Use AI as a tutor, not an answer key.'],
   ['Days 46-60','Learn the 5 terms. Use AI to classify 50 rows of real text, then check accuracy by hand.'],
   ['Days 61-90','Call a model from Python, get JSON output, and build a small RAG search: find relevant documents first, then let the model answer from them.'] ],
   box: '<b>Skip for now:</b> training models from scratch, deep transformer maths, chasing every new tool.' },
]};
