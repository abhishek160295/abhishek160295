module.exports = {
id: 'ai1', cat: 'career', tag: 'AI', kw: 'AILEARN',
title: 'Everyone Is Talking About AI. No One Tells You What You Need to Learn',
sub: 'The exact AI skills to learn, in order, for data and tech careers. What to learn first, what to skip, and a 90-day plan.',
pages: [
 { h: 'First, pick your level', l: 'Most people stall because they try to learn everything. AI skills come in 3 levels. Most jobs need level 1 and 2.', items: [
   ['Level 1: Use AI well','Everyone. Get faster and better at your current work with AI tools.'],
   ['Level 2: Work with AI as an analyst','Data and tech roles. Use AI for SQL, Python, analysis, and understand how it works.'],
   ['Level 3: Build with AI','Developers and data scientists. Connect AI models to data and apps through code.'],
   ['Not needed for most jobs','Training large models from scratch. That is research work at a small number of companies.'] ] },
 { h: 'Level 1: Use AI well', l: 'These 4 skills apply to every role, technical or not.', items: [
   ['Write clear prompts','Give context, the task, the format you want, and an example. Vague prompts give vague answers.'],
   ['Verify everything','AI can state wrong facts confidently. This is called hallucination. Check numbers, names and code before you use them.'],
   ['Protect data','Never paste confidential customer, salary or company data into a public AI tool. Follow your company\'s AI policy.'],
   ['Know where it is weak','Exact calculations on large data, very recent events, and anything it cannot see. Use AI for drafts, not final answers.'] ] },
 { h: 'A prompt that works', l: 'Use this structure for almost any task. Copy it.', code:
`ROLE:    You are a senior data analyst.
CONTEXT: I have a sales table with columns
         order_id, order_date, region, amount.
TASK:    Write a SQL query for month-on-month
         revenue growth % by region.
FORMAT:  PostgreSQL. Explain each step
         in one line.
CHECK:   List 2 ways this query could give
         a wrong result.`,
   items: [['Why the last line matters','Asking AI to find weak points in its own answer catches many mistakes before you run anything.']] },
 { h: 'The foundations matter more now', l: 'AI makes skilled people faster. It does not replace the skill. You must be able to judge its output.', items: [
   ['SQL','AI writes queries. You must spot a wrong join or a missing filter.'],
   ['Python and Pandas','You must read and fix the code AI gives you.'],
   ['Statistics','You must know if an AI-suggested conclusion is real or noise.'],
   ['Business understanding','AI does not know your company, customers or goals. You do. This is your edge.'] ],
   box: '<b>Rule:</b> if you cannot check the answer, you cannot safely use the answer.' },
 { h: 'Level 2: How AI works', l: 'Know these terms in plain words. They come up in interviews and at work.', items: [
   ['LLM','Large language model. Predicts the next piece of text based on patterns learned from huge amounts of text.'],
   ['Token','The unit of text a model reads and writes. Roughly part of a word. Usage and cost are counted in tokens.'],
   ['Context window','The maximum amount of text the model can consider at once, including your prompt and its reply.'],
   ['Temperature','A setting for randomness. Lower gives more consistent answers, higher gives more varied ones.'],
   ['Hallucination','Confident but wrong output. The reason verification is a core skill.'] ] },
 { h: 'Level 2: Use AI in analysis work', l: 'The highest-value uses for analysts today.', items: [
   ['Write and review SQL and Python','Draft code faster, then ask AI to review your own code for bugs and edge cases.'],
   ['Explain unfamiliar code','Paste a long query and ask what each part does.'],
   ['Clean and categorise text','Classify feedback, tickets or reviews into themes, then check a sample by hand.'],
   ['Summarise results','Turn a table of results into a first-draft summary for managers, then verify every number.'] ] },
 { h: 'Level 3: Build with AI', l: 'Learn these in order. Each one builds on the last.', items: [
   ['1. Call a model from Python','Use an AI provider\'s API: send a prompt, get a response in code.'],
   ['2. Structured output','Ask for JSON with fixed fields, so the result can go straight into a table.'],
   ['3. Embeddings','Text turned into numbers that capture meaning. Similar texts get similar numbers. Used for search.'],
   ['4. RAG','Retrieval-augmented generation. Find relevant documents first, then give them to the model to answer from. Reduces made-up answers.'],
   ['5. Agents and tool use','The model decides which tool or function to call, like running a query, then uses the result.'],
   ['6. Evaluation','Test outputs against expected answers on many examples. This is what makes an AI project reliable.'] ] },
 { h: 'What to skip for now', l: 'These take months and rarely help in data analyst or junior roles.', items: [
   ['Training LLMs from scratch','Needs huge data, compute and research teams.'],
   ['Deep transformer maths first','Useful later for ML research roles. Not needed to use or build with AI.'],
   ['Chasing every new tool','Tools change every few months. The skills above stay useful.'],
   ['Collecting certificates','One working project shows more than five certificates.'] ] },
 { h: 'Your 90-day plan', l: 'One hour a day. Adjust the pace to your level.', items: [
   ['Days 1-15','Level 1: use AI daily at work. Practise the prompt structure and verify every output.'],
   ['Days 16-45','Strengthen SQL, Python and statistics with AI as your tutor, not your answer key.'],
   ['Days 46-60','Level 2: learn the terms on page 6. Use AI to classify a real text dataset and check its accuracy on 50 rows.'],
   ['Days 61-90','Level 3 basics: call a model from Python, get JSON output, build a small RAG search over your own documents.'] ],
   box: '<b>Project to show:</b> an analysis where AI did the first draft and you documented what you checked and fixed. That proves judgement, the skill companies want most.' },
]};
