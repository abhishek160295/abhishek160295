# The Data Guy: beehiiv Sending Process (recovered 2026-11-24)

Rebuilt from the live beehiiv account, the two saved beehiiv skills, and Google Drive. Nothing here is from memory.

## 1. Account

| Item | Value |
|---|---|
| Publication | The data Guy - Abhishek's Newsletter |
| ID | `pub_658b8b90-7f86-47c8-953f-5ffa9dd91e69` |
| URL | https://thedataguy16.beehiiv.com |
| Website (lead magnets) | thedataguy.online (Cloudflare, HTML files mirrored in Drive) |
| Active subscribers | 17,906 |
| Last 3 months | 15.12% open, 0.94% click, +35,232 new, -26,667 churned, $326.26 earned |
| Posts | 88 total (about 60 published, rest drafts) |

## 2. Daily send routine

1. Load the 2 saved beehiiv skills first: **"Data Guy email format (house style)"** and **"Link rules: Topmate only, never Notion"**.
2. Write the issue in the letter-style layout (Section 3).
3. Audience: **all free subscribers**, every day.
4. Sender name: **Abhishek | The Data Guy**. Hide title/subtitle in email (`display_title_in_email: false`).
5. Subject A/B test with **2 extra variants** on every send.
6. Tags used: `career`, `course`, `sales`, `data-analyst`, plus a topic tag (`sql`, `excel`, `power-bi`, `python`, `salary`, `resume`, `interview-prep`, `story`, `reviews`...).
7. Check every href before saving. Any Notion link gets swapped for Topmate.
8. Schedule or publish. Recent send times vary between about 03:30 and 15:30 UTC.

## 3. Issue layout (v2, letter style)

Reference issue: *"14 pages to help you crack your first data analyst interview"* (`post_0f3942f2-1047-4807-b653-55f4c44a3578`). Modeled on Nicolas Boucher's *The AI Finance Pro*.

1. Daily banner image (asset `57b00f05-f821-4ffa-b044-64925d706afd`). No other image above the first text.
2. H2 contrast hook, e.g. "1 question. 2 answers. 1 offer." or "86% vs 14%".
3. Short paragraphs of 1 to 3 lines. ❌ weak vs ✅ strong examples. A named structure.
4. One Ad Network ad after section 1. Prefer CPM ads. Never let an accepted ad pass its send-by date.
5. Horizontal rule, then a free PDF resource with cover image, an "Inside you will find:" list, and "Download the free X-page PDF here 👉 [link]" twice.
6. Horizontal rule, then "Putting it all together": the 90-Day System, 5 bullets, "So, right now, do 2 things: 1. download 2. see the 90-Day System", one button: **See the 90-Day System Here**.
7. Sign-off: See you tomorrow, / Best, / Your Data Career Coach / - Abhishek
8. P.S. asking for a reply.

**Why the letter style:** the old boxed design (v1) got 4.9 to 8% opens. Plain letters got 21 to 24%. Top earners:

| Issue | Earned | Opens |
|---|---|---|
| The Interview Question That Quietly Filters Out 90% of Data Analysts | $26.62 | 24% |
| She Said Yes to the Counter-Offer. She Was Gone in Seven Months. | $18.56 | 22% |
| No Tech Degree? Use the Side Door Into Data Analytics | $18.00 | 21% |
| You're Leaving ₹3-6 LPA on the Table Right Now | $15.75 | 24% |

What they share: one story or one decisive question, a contrast, a usable structure, very few images.

## 4. Subject lines

- "[N] pages to help you [outcome]"
- "The [thing] that quietly [decides/filters] ..."
- Use numbers, "you", and an open loop. Never the product name.

## 5. Hard rules

- **Never show the price.** Price lives only on Topmate.
- **Never any Notion link** (notion.so, notion.site, app.notion.com). Notion is the paid product.
- Every sell link goes to **https://topmate.io/abhishek_kumar1085/1990922**. No selling through beehiiv products.
- No invented testimonials, numbers or company claims. No em dashes.

## 6. Free resources

- Data Analyst Interview Pack (14 pages): https://cdn.jsdelivr.net/gh/abhishek160295/abhishek160295@b3cc08b32eb628500c64130100467ba1f80b06c1/newsletter-assets/2026-11-05/Data-Analyst-Interview-Pack.pdf (cover asset `e8705760-81f7-49eb-95cd-1c85d3e86612`)
- PDFs are hosted from this GitHub repo through jsDelivr, pinned to a commit hash.
- Site pages that feed signups (in Drive): sql, sqlsheet, sqlplan, joins, practice, pyhour, python-explained, python48, pyskills, pandasheet, advexcel, dax10, pbisheet, pbikid, pbijd, sqljd, misjd, davsds, revise14, advsql14, textclean, charts. `_blocks.html` holds the reusable 90-Day promo strip and box.

## 7. Automation

- **Welcome Flow** (`aut_4da3dd2b-a016-45d6-9d52-a8e52949efae`), live, trigger: signup.
- Currently only 1 email: "Welcome to The Data Guy" (27 sent, 29.6% open, 37.5% click).
- A 4-email follow-up is **written but not added**: Drive doc `welcome-sequence.md`.
  Plan: Welcome → 1 day → Email 2 → 2 days → Email 3 → 2 days → Email 4 → 2 days → Email 5.
  1. "The mistake 9 out of 10 freshers make in month one"
  2. "Why your certificates aren't getting callbacks"
  3. "What 90 days of structure looks like"
  4. "Quick question"

## 8. Timeline

- **Aug 2026:** launch, template-style issues, AI and career topics.
- **Aug 14:** Welcome Flow goes live.
- **Mid Sep to Oct:** daily 90-Day System sales-angle issues, lead magnet site built.
- **Oct 31:** "I deleted my entire email list. Here's why." Fresh start, list re-imported (17,878 via import).
- **Nov 5 to 6:** switch to v2 letter style with the 14-page PDF issue.
- **Last send:** Nov 16, "Your Power BI % column says 100% on every row." **No sends for 8 days.**

## 9. Open items

- Unsent drafts ready to polish: "Delete this from your resume today", "Day 0 vs Day 90: What a Recruiter Actually Sees", "You Don't Lose 6 Months. You Lose Your Place in Line.", "She Had 6 Certificates and 0 Interview Calls...", "4 People Who Shouldn't Buy the 90-Day System", "Scared of Statistics?...", "Coimbatore Fresher Hiring Just Jumped 28%", "Stop Starting Your Interview With 'My Name Is'", "SQL Gets You Shortlisted. These 15 Metrics Get You Hired.", "The Weekly Update That Makes Your Manager Notice You", "23 Brutal Truths About Being a Data Analyst".
- Add Emails 2 to 5 to the Welcome Flow.
- Churn is heavy (26.7k lost in 3 months). Worth running an unsubscribe-spike check.
- Delete leftover template drafts (Ava Sinclair x2, Newsletter Template, Sales Campaign, New post x2).
