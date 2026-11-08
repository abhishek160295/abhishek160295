module.exports = {
id: 't29', cat: 'excel', tag: 'EXCEL', kw: '1IN10',
title: 'Only 1 in 10 Data Analysts Get This Excel Question Right',
sub: 'The question: find the latest price of each product from a price history table. Most people return the first price, not the latest. Here is why, and 3 correct answers.',
pages: [
 { h: 'The question', l: 'Try it before you turn the page. This is how it is asked in interviews.', code:
`Sheet "History" (sorted by date, oldest first)

   A           B           C
1  Date        Product     Price
2  01-Jan-26   Pen         10
3  01-Jan-26   Notebook    40
4  15-Feb-26   Pen         12
5  10-Mar-26   Notebook    45
6  20-Apr-26   Pen         15

Sheet "Summary"
   A           B
1  Product     Latest price
2  Pen         ?      <- correct answer: 15
3  Notebook    ?      <- correct answer: 45`,
   items: [['The task','Write one formula in B2 that returns the most recent price for the product in A2, and copy it down.']] },
 { h: 'The answer most people give', l: 'This is what 9 out of 10 candidates write. It looks right. It is wrong.', code:
`=VLOOKUP(A2, History!B:C, 2, FALSE)

Result for Pen:      10   (should be 15)
Result for Notebook: 40   (should be 45)`,
   items: [
   ['Why it is wrong','VLOOKUP, XLOOKUP and MATCH with exact match all stop at the FIRST match from the top. In a history table, the first match is the oldest row.'],
   ['Why people miss it','The formula returns a valid price with no error. Nothing looks broken, so nobody checks.'] ],
   box: '<b>This is what the question really tests:</b> do you check whether a correct-looking number is actually the right one?' },
 { h: 'Answer 1: XLOOKUP from the bottom', l: 'The cleanest answer in Excel 365 and Excel 2021+.', code:
`=XLOOKUP(A2, History!B:B, History!C:C, "Not found", 0, -1)`,
   items: [
   ['The key part','The last argument, -1, tells XLOOKUP to search from the last row upwards. The first match it finds is the latest.'],
   ['Argument 5 = 0','Exact match.'],
   ['Condition','The history must be sorted oldest to newest. If not, use Answer 2.'] ] },
 { h: 'Answer 2: by the latest date', l: 'Works even when the table is not sorted. This is the answer that impresses most.', code:
`Step 1: latest date for the product
=MAXIFS(History!A:A, History!B:B, A2)

Step 2: one formula with LET (Excel 365)
=LET(
   d, MAXIFS(History!A:A, History!B:B, A2),
   XLOOKUP(1,
     (History!B:B = A2) * (History!A:A = d),
     History!C:C))`,
   items: [
   ['How it works','MAXIFS finds the latest date for the product. The multiplication creates 1 only where both product and date match.'],
   ['Best on a Table','Use structured references like History[Date] instead of full columns. Faster and easier to read.'] ] },
 { h: 'Answer 3: older Excel versions', l: 'If the company uses Excel 2016 or 2019, XLOOKUP and MAXIFS may not exist.', code:
`=LOOKUP(2, 1/(History!B$2:B$1000 = A2), History!C$2:C$1000)`,
   items: [
   ['How it works','1/(condition) gives 1 for matching rows and #DIV/0! for others. LOOKUP searching for 2 cannot find it, so it returns the last 1, which is the last matching row.'],
   ['Condition','Like Answer 1, it returns the last row in the table, so the data must be sorted by date.'],
   ['Use a fixed range','Avoid full columns here. They slow this formula down a lot.'] ] },
 { h: 'How to answer in the interview', l: 'Say it in this order. It shows you understand the trap, not just the formula.', items: [
   ['1. Name the trap','"A normal lookup returns the first match, which is the oldest price."'],
   ['2. Ask about the data','"Is the history sorted by date? Can a product have two rows on the same date?"'],
   ['3. Give the answer','"If sorted, XLOOKUP with search mode -1. If not, MAXIFS for the latest date and then match on product and date."'],
   ['4. Verify','"I would check one product by filtering the history table to confirm."'] ],
   box: '<b>Comment your answer.</b> If you wrote VLOOKUP before reading this, you are in the 9 out of 10. Now you are not.' },
]};
