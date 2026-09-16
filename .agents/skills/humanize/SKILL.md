---
name: humanize
description: Rewrites AI-generated, stilted, or "over-polished" text so it reads like it was written by a specific human, not a chatbot. Use this whenever the user asks to "humanize" text, make something "sound less AI," "remove the AI tells," "de-AI" a draft, "fix the ChatGPT voice," or wants a piece edited so it won't get flagged as AI-written (Wikipedia drafts, essays, cover letters, articles, comments, LinkedIn posts, etc). Also use proactively when asked to "polish," "clean up," or "proofread" a draft and the draft itself contains classic LLM tells (em dashes, "delve/boasts/underscores," rule-of-three lists, "it's not just X, it's Y," inline-bold list headers, canned "plays a vital role" filler, tidy "in conclusion" wrap-ups) — flag this to the user and offer to humanize it, don't just leave the tells in place.
---

# Humanize

This skill rewrites text to remove the statistical fingerprints of LLM output — not by tricking a detector, but by restoring the specificity, unevenness, and plain-spokenness that generic AI phrasing smooths away. It's built from a field guide of real, catalogued AI-writing patterns (Wikipedia:Signs of AI writing), so the checklist below is grounded in actual observed tells, not vibes.

## The core idea

LLMs generate the statistically most likely next words. That means they regress to the mean: specific, unusual, textured facts get replaced with generic, positive-sounding, broadly-applicable language. A sentence like "invented the first automatic train coupler in 1873" tends to drift toward "was a revolutionary pioneer whose work left a lasting legacy." The claim gets *louder* while the actual information gets *blurrier*.

> It is like shouting louder and louder that a portrait shows a uniquely important person, while the portrait itself is fading from a sharp photograph into a blurry, generic sketch. — Wikipedia:Signs of AI writing

Humanizing text is mostly the reverse operation: find the blurry, generic, loudly-important-sounding sentence, and either cut it or replace it with the one specific, checkable fact it was standing in for. Everything else in this skill — the word lists, the punctuation quirks, the formatting habits — is just a catalogue of where that blurriness tends to hide.

## ⚠️ Critical caveats

**These signs are clues, not proof.** Human writing shares many of these traits — editorials, blogs, fan fiction, and press releases can all contain them naturally. Human speech is increasingly influenced by LLMs, making the lines blurrier every year.

**Do not over-rely on these signs.** A cluster of multiple signs in a single piece is a stronger signal than any single word or pattern. If the underlying content is specific, sourced, and well-structured, superficial AI tells may just be editing quirks.

**The goal is better content, not sterile text.** Swapping "delve" for "explore" doesn't fix a sentence that's still a generic significance-statement. Fix the *substance*, then the surface. See the Anti-patterns section below.

For a complete catalogue of word lists by era, model-specific fingerprints, and many more real examples, see `references/ai-tells.md`.

## Workflow

1. **Read the whole text first.** Understand what it's actually trying to say before touching a sentence. Don't lose or invent facts while editing — humanizing is a rewrite of *voice*, not a rewrite of *content*. If a sentence is pure filler with no real content, it's fine to cut it entirely rather than search for something to replace it with.

2. **Scan against the checklist below**, then also check `references/ai-tells.md` for the fuller catalogue (word lists by era, more examples of each pattern) if the text is long, formal, or high-stakes (e.g. a Wikipedia article, an academic piece).

3. **Rewrite pass.** Go section by section. For each flagged pattern, apply the fix described below rather than just deleting the word — swapping "delve into" for "explore" doesn't fix anything if the sentence around it is still a generic significance-statement.

4. **Vary the rhythm.** Human writing is uneven: sentence lengths jump around, some paragraphs are short, ideas don't always resolve into a neat triplet. After the rewrite pass, read through once just for rhythm — if every paragraph is the same length and every list has exactly three items, break that up.

5. **Don't overcorrect.** See "What NOT to touch" below. Perfect grammar, formal tone, and the plain word "is" are not AI tells — stripping them out in a panic makes text worse, not more human.

## Checklist of patterns to fix

### Content-level (the actual substance of the tell)

- **Unearned significance statements** — sentences whose only job is to assert that something matters, without adding a new fact. *"This marked a pivotal moment in..." / "underscores its enduring legacy..." / "plays a vital role in the broader ecosystem..."* Fix: delete the sentence, or replace it with the specific fact that would actually justify the claim (a date, a number, a name, a mechanism). If no such fact exists, the claim was probably synthesis — cut it.

- **Notability-by-listing** — piling up outlets/sources to *prove* importance rather than just citing them normally ("has been featured in Vogue, Wired, CNN, and other prominent outlets"). Fix: cite what's actually needed for the claim being made; drop the "and other outlets" padding.

- **Vague / weasel attribution** — "researchers believe," "some critics argue," "industry observers have noted" with no one named, or a claim attributed to "several sources" when only one or two are actually cited. Fix: name the actual source, or cut the claim if it can't be attributed to anyone specific.

- **Canned "Challenges" / "Future Outlook" wrap-up** — a rigid closing section that opens with "Despite its [positive thing], X faces several challenges..." and closes with vague optimism about "ongoing efforts." Fix: only keep this if there's a real, sourced challenge to report; state it plainly without the despite-framing scaffolding.

- **Superficial analysis tacked onto facts** — a factual sentence gets a trailing "-ing" clause that editorializes: *"...serving as a testament to its enduring cultural significance."* Fix: cut the trailing clause, let the fact stand on its own.

- **Knowledge-gap speculation** — "while specific details are limited, it likely..." followed by a guess dressed as insight. Fix: either state that the information isn't available and stop, or leave the sentence out entirely. Don't speculate and label it a finding.

- **Leads treating article/list titles as proper nouns** — introducing a list or concept as though the title itself is a real-world entity: *"'List of songs about Mexico' is a curated compilation of musical works that reference Mexico..."* Fix: introduce the subject directly without the title-as-entity scaffolding. Just state the list or the topic.

### Vocabulary

LLMs overuse a specific, fairly narrow set of words far more than human writers of comparable text. One or two of these in a piece is a coincidence; a cluster of them is a real signal. Common offenders: **delve, boasts, underscores, showcases, testament, tapestry, intricate/intricacies, meticulous(ly), pivotal, crucial, robust, vibrant, fosters/fostering, garners, key (as a filler adjective), landscape (as an abstract noun — "the evolving landscape of..."), interplay, enduring, bolstered, align/aligns with, nestled, in the heart of, groundbreaking, renowned, diverse array, commitment to, marking a shift.**

See `references/ai-tells.md` for the full list broken down by which "era" of chatbot tends to overuse which words — useful if you want to match or avoid a specific model's fingerprint.

Fix: don't just swap in a thesaurus synonym — that just trades one generic word for another. Rewrite the clause so it says something concrete instead. "The bridge underscores the town's industrial heritage" → either state the actual industrial-heritage fact the bridge relates to, or drop the clause.

### Syntax and sentence patterns

- **Avoidance of plain "is/has."** LLMs prefer "serves as," "stands as," "represents," "boasts," "offers," "features" over the flat, correct "is" or "has." *"The gallery serves as LAAA's exhibition space"* → *"The gallery is LAAA's exhibition space."* Plain copulas are not a weakness; restore them.

- **Negative parallelism / false contrast.** "Not only X, but also Y." "It's not just about X — it's about Y." "This isn't dissolution, it's becoming." Fix: usually you can just state Y, or state both facts as separate plain sentences. The contrast structure is rarely doing real work.

- **Rule of three.** Adjectives, phrases, or list items reflexively grouped in threes to sound comprehensive ("safe, reliable, and efficient"). Fix: cut to the one or two that are actually true/relevant, or expand to a real, uneven list if there genuinely are more than three things to say.

- **Hedging qualifiers as filler.** "tends to," "can potentially," "in many cases" used reflexively rather than because the hedge is actually needed. Fix: state the claim plainly if it's true, or don't make it.

### Structure and formatting

- **Inline-header vertical lists** — "**Bold Label:** description text" repeated as bullets, for content that would read more naturally as prose (or as a real Wikipedia/markup list, not a Markdown-style bolded one). Fix: convert to prose paragraphs unless the content is genuinely tabular or scannable data (like a spec sheet).

- **Section headings in Title Case for every word.** Fix: sentence case, unless the target's own style guide calls for title case.

- **Boldface used mechanically** for "key takeaways" style emphasis on every instance of a term. Fix: remove almost all of it; bold only what would genuinely be bolded in the surrounding style.

- **No dashes of any kind. Hard rule.** This includes em dashes (—), en dashes (–), and hyphens (-) used as punctuation. Replace every dash with a period, comma, or restructure the sentence. Do not leave a single dash in the output. This is zero-tolerance. Not "reduce" or "use sparingly." Zero.

- **Curly ("smart") quotes and apostrophes** inconsistently mixed with straight ones, or used where the target platform expects straight quotes (wikitext, code, plain text fields). Fix: match whatever quote style the destination actually uses. Note this one is weak on its own — lots of legitimate tools (Word, iOS, CMOS-style publishing) also produce curly quotes.

- **Markdown syntax leaking into non-Markdown output** — asterisks for bold, `##` headers, in a context (wikitext, plain email, a text field) that doesn't render Markdown. Fix: convert to whatever the destination actually supports, or plain text.

- **Emoji used as heading decoration** (👋, 🎯, 📌 in front of section titles). Fix: remove unless the venue is genuinely casual/emoji-native.

- **Skipping heading levels** (jumping to h3 without an h2 above it) — very unlikely for a human doing manual formatting; strong signal in wikitext specifically. Fix: match the heading hierarchy to the document's actual structure.

- **Small unnecessary tables** for content that reads more naturally as prose — "Key Statistics of X (2024–2025)" two-column tables for a handful of facts. Fix: convert to prose or a standard infobox.

- **Placeholder / broken reference artifacts** — stray tokens like `citeturn0search0`, `:contentReference[oaicite:0]{index=0}`, `oai_citation`, `[attached_file:1]`, `【85†L261-269】`, `[cite: 17]`. These are citation-rendering artifacts from copying chatbot UI output directly. Always strip them; they carry zero information.

## What NOT to touch

Don't "fix" things that only look like AI tells but are actually normal human writing — overcorrecting here makes prose worse and reads as paranoid, not more human:

- Perfect grammar and spelling. Plenty of skilled human writers produce clean copy.
- A formal or academic register on its own.
- Plain, correct use of transition words (*"Additionally," "However,"*) used occasionally — only a *reflexive, sentence-opening* pattern of these is a real signal.
- Unsourced claims — most under-cited writing on earth predates any LLM.
- A mix of casual and formal register — this is extremely common in genuine human writing (technical fields, code-switching, multiple authors).
- Correct, working markup/formatting for the actual target platform.
- Letter-like structure (salutation, sign-off) on its own — predates LLMs by decades.
- Odd but explainable formatting glitches (stray HTML tags, misplaced wiki-markup) — usually editor-tool bugs, not AI.

If in doubt, ask: does removing this genuinely add specificity or voice, or am I just deleting a word because it's on a list? Only make the edit if the answer is the former.

## Anti-patterns for editors

These are common mistakes people make when trying to "fix" AI-sounding text. Avoid them:

1. **Word-swap instead of content-fix.** Replacing "delve into" with "explore" doesn't help if the sentence around it is still a generic significance-statement. Fix the substance first; the vocabulary quirks usually resolve themselves.

### Dash-specific anti-patterns

These are the most common excuses for leaving a dash in. Do not fall for them.

- **"The original had an em dash for a dramatic pause."** Replace with a period. The pause still works.
- **"It is a compound modifier, not really a dash."** Use plain words. "Real-time" becomes "live" or "instant." "Cross-platform" becomes "works everywhere" or restructure the sentence.
- **"The hyphen is part of a proper noun."** If it is unavoidable (e.g. a trademark), keep it. Otherwise restructure to avoid the hyphen.
- **"It is a span of numbers, so en dash is correct."** Use "to" instead. "2025 to 2026" not "2025–2026."
- **"But the quote I am citing has an em dash."** Modernize the quotation by replacing the dash with a period or restructured phrasing. Preservation of original punctuation is less important than the hard rule.

2. **Treating symptoms as the problem.** The em dashes and bold lists are not themselves the policy violation — they are clues pointing to deeper issues (synthesis, OR, puffery, lack of sourcing). Fix the deep problem and the surface tells often disappear naturally.

3. **Overcorrection.** Stripping out every transition word, every big word, and every em dash in a panic produces text that's worse, not better. Human writing includes all of these things in moderation.

4. **Using AI detection scores.** Do not rely on AI detection tools (GPTZero, etc.) as evidence. They have non-trivial error rates and can be fooled by paraphrasing, markup changes, or newer models. A high score is not proof.

5. **Acting on a single tell.** One em dash or one use of "underscores" is a coincidence. A cluster of 5+ different types of tells in the same piece is a real signal.

## Output

Unless the user asks for a diff or a list of changes, just return the rewritten text directly, preserving the original's format (plain text, Markdown, wikitext, etc.) and length envelope — humanizing should not turn a short paragraph into a much longer one, or vice versa, since padding itself is often part of the AI signature. If the piece is long or the user seems to want to understand the specific changes, briefly summarize the main patterns that were fixed after delivering the rewrite (e.g., "removed 4 generic significance statements, removed all dashes, converted the bulleted list to prose").

**Final check before delivering: scan the entire output for any dash character (—, -, -). If one exists, remove it by rewriting the sentence. Do not deliver output containing a dash.**

