module.exports = {
id: 't13', cat: 'excel', tag: 'EXCEL', kw: 'EXCEL15',
title: "If You Can't Answer These 15 Excel Questions, You're Not Interview Ready",
sub: '15 questions asked in data analyst Excel rounds, each with the answer and the formula. Try each one before reading the answer.',
pages: [
 { h: 'Questions 1 to 3', l: 'Lookups. Asked in almost every Excel round.', items: [
   ['1. Find a value to the LEFT of the lookup column','VLOOKUP cannot look left. Use XLOOKUP or INDEX MATCH.','=XLOOKUP(E2, C:C, A:A, "Not found")'],
   ['2. VLOOKUP returns #N/A but the value is visible','Hidden spaces or a number stored as text on one side.','=VLOOKUP(TRIM(E2), A:C, 2, FALSE)'],
   ['3. Find the LAST matching value, like the latest price','XLOOKUP with search mode -1 searches from the bottom.','=XLOOKUP(E2, A:A, C:C, , 0, -1)'] ] },
 { h: 'Questions 4 to 6', l: 'Conditional totals. The base of every Excel report.', items: [
   ['4. Total sales for North in March only','SUMIFS takes the sum range first, then pairs of range and condition.','=SUMIFS(Sales, Region, "North", Month, "Mar")'],
   ['5. Count orders above ₹10,000 that are Delivered','COUNTIFS with a comparison inside quotes.','=COUNTIFS(Amount, ">10000", Status, "Delivered")'],
   ['6. Average order value, ignoring zero orders','AVERAGEIFS skips rows that fail the condition.','=AVERAGEIFS(Amount, Amount, ">0")'] ] },
 { h: 'Questions 7 to 9', l: 'Unique values, ranking and duplicates.', items: [
   ['7. Count unique customers','UNIQUE returns the list, COUNTA counts it.','=COUNTA(UNIQUE(B2:B500))'],
   ['8. Rank salespeople within their region','COUNTIFS counts how many in the same region have higher sales, plus 1.','=COUNTIFS(Region, A2, Sales, ">"&C2) + 1'],
   ['9. Flag duplicate invoice numbers','Any count above 1 is a duplicate.','=IF(COUNTIF($A$2:$A$500, A2) > 1, "Duplicate", "")'] ] },
 { h: 'Questions 10 to 12', l: 'Dates and text. Real data always needs these.', items: [
   ['10. Convert 20261107 into a real date','Split the number into year, month and day.','=DATE(LEFT(A2,4), MID(A2,5,2), RIGHT(A2,2))'],
   ['11. Working days between order and delivery','NETWORKDAYS skips weekends. Add a holiday range as the third argument.','=NETWORKDAYS(B2, C2)'],
   ['12. Extract the domain from an email','Take everything after the @.','=TEXTAFTER(A2, "@")\nOlder Excel: =MID(A2, FIND("@",A2)+1, 100)'] ] },
 { h: 'Questions 13 to 15', l: 'Pivots, dynamic lists and debugging. These show real experience.', items: [
   ['13. Show each region\'s share of total sales in a pivot','Value Field Settings → Show Values As → % of Grand Total. No formula needed.'],
   ['14. A top 5 products list that updates itself','SORTBY orders by sales, TAKE keeps the first 5.','=TAKE(SORTBY(Product, Sales, -1), 5)'],
   ['15. SUM shows 0 but the cells have numbers','Numbers stored as text, calculation set to Manual, or a circular reference. Fix: Data → Text to Columns → Finish, and Formulas → Calculation Options → Automatic.'] ] },
 { h: 'How to use these 15', l: 'Knowing the formula is half. Explaining your choice is what interviewers score.', items: [
   ['Practise on one dataset','Sales data with date, region, product, customer, amount, status. All 15 work on it.'],
   ['Say why, not just what','"I used XLOOKUP because the return column is to the left, and it handles not-found cleanly."'],
   ['Know the older version too','Some companies still use Excel 2016. Know INDEX MATCH and MID-FIND alternatives.'],
   ['Score yourself','12+ without looking: ready. 8-11: one more week. Below 8: start with questions 1-6.'] ],
   box: '<b>Version note:</b> XLOOKUP, UNIQUE, TEXTAFTER, SORTBY and TAKE need Excel 365 or Excel 2021+ (TEXTAFTER and TAKE need 365).' },
]};
