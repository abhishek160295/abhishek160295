module.exports = {
id: 't15', cat: 'sql', tag: 'SQL', kw: 'JOIN2X',
title: 'Interviewer: "Your JOIN doubled the row count. Why?" Comment your answer',
sub: 'The full answer: why it happens, how to prove it, 3 ways to fix it, and the follow-up questions interviewers ask next.',
pages: [
 { h: 'The short answer', l: 'Say this first, in one breath. Then show you can prove it.', items: [
   ['The join key is not unique on one side','One row on the left matches more than one row on the right, so the left row is repeated once for every match.'],
   ['It is not a bug in SQL','JOIN returns every matching pair. The data has duplicates, or you joined at the wrong grain.'],
   ['The real danger','Row count is the visible symptom. The silent damage is inflated SUM and COUNT in every report built on top.'] ],
   box: '<b>Grain</b> = what one row means. orders: one row per order. order_items: one row per item. Joining them makes one row per item.' },
 { h: 'See it happen', l: 'One customer, two address rows. Every order for that customer now appears twice.', code:
`customers
id | name
1  | Asha

addresses
customer_id | city
1           | Pune
1           | Mumbai   <- duplicate key

orders
order_id | customer_id | amount
101      | 1           | 500
102      | 1           | 300

SELECT o.order_id, o.amount, a.city
FROM orders o
JOIN addresses a
  ON a.customer_id = o.customer_id;

order_id | amount | city
101      | 500    | Pune
101      | 500    | Mumbai
102      | 300    | Pune
102      | 300    | Mumbai

2 orders became 4 rows.
SUM(amount) = 1600. Real total = 800.` },
 { h: 'Prove it in 3 queries', l: 'Interviewers want to see how you debug, not just the definition.', items: [
   ['1. Count before and after','If the joined count is higher than the left table count, rows are multiplying.','SELECT COUNT(*) FROM orders;              -- 2\nSELECT COUNT(*) FROM orders o\nJOIN addresses a USING (customer_id);     -- 4'],
   ['2. Find the duplicate keys','Any key with COUNT above 1 on the right side is the cause.','SELECT customer_id, COUNT(*)\nFROM addresses\nGROUP BY customer_id\nHAVING COUNT(*) > 1;'],
   ['3. Check the grain','Ask: what does one row of each table mean? If they differ, the join must handle it.'] ] },
 { h: 'Fix 1: aggregate first, then join', l: 'Best when the right table has many rows per key and you only need a total from it.', code:
`WITH item_totals AS (
  SELECT order_id,
         SUM(qty)        AS total_qty,
         SUM(qty*price)  AS item_value
  FROM order_items
  GROUP BY order_id          -- now one row per order
)
SELECT o.order_id, o.order_date, t.total_qty, t.item_value
FROM orders o
LEFT JOIN item_totals t ON t.order_id = o.order_id;`,
   items: [['Why it works','Both sides are now at the same grain: one row per order.']] },
 { h: 'Fix 2 and Fix 3', l: 'When you need one specific row, or just want to know if a match exists.', items: [
   ['Fix 2: pick one row with ROW_NUMBER','Keep the latest address per customer, then join.','WITH a AS (\n  SELECT *, ROW_NUMBER() OVER (\n    PARTITION BY customer_id\n    ORDER BY updated_at DESC) AS rn\n  FROM addresses)\nSELECT o.*, a.city\nFROM orders o\nJOIN a ON a.customer_id = o.customer_id\n     AND a.rn = 1;'],
   ['Fix 3: EXISTS when you only filter','You want orders from customers who have any Mumbai address. No rows are added.','SELECT o.* FROM orders o\nWHERE EXISTS (\n  SELECT 1 FROM addresses a\n  WHERE a.customer_id = o.customer_id\n    AND a.city = \'Mumbai\');'] ],
   box: '<b>Do not fix it with DISTINCT.</b> It hides the symptom, is slow on big tables, and SUM can still be wrong.' },
 { h: 'Follow-up questions', l: 'Interviewers usually ask one of these next. Have the answer ready.', items: [
   ['"Would LEFT JOIN fix it?"','No. LEFT JOIN keeps unmatched rows. Duplicate keys multiply rows in any join type.'],
   ['"How do you stop this in production?"','Add a unique constraint or a data test on the key (for example dbt unique test). Check row counts after every join in a pipeline.'],
   ['"When is a row increase correct?"','When you meant to change the grain, like orders to order items. Then name the output clearly and never sum order-level columns.'],
   ['"Why not just use DISTINCT?"','It hides the problem and two genuinely different rows with the same values collapse into one.'] ] },
 { h: 'How to answer in the interview', l: 'A 40-second answer that sounds experienced.', items: [
   ['1. Cause','"The join key is not unique on the right table, so each left row is repeated for every match."'],
   ['2. Proof','"I would compare row counts before and after, then GROUP BY the key with HAVING COUNT(*) > 1."'],
   ['3. Fix','"Depending on the need: aggregate the right table first, pick one row with ROW_NUMBER, or use EXISTS if I only need to filter."'],
   ['4. Prevention','"And I would add a uniqueness test on that key so it does not happen again."'] ],
   box: '<b>Comment test:</b> if your answer said "duplicate keys", you got the core right. The proof and the fix are what get you hired.' },
]};
