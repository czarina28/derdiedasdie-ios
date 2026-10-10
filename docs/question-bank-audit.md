# Existing question bank: first-pass curriculum audit

This is an inventory of the source files, not a claim that all items have passed linguistic review. The app validates questions at runtime; source record counts can differ from active counts.

| Source | Records in file | Existing topic | Proposed destination | Editorial notes |
|---|---:|---|---|---|
| core | 20 | Articles & endings | Cases & articles, possibly Adjective endings | Article/possessive choices; some examples include adjective endings, but the blank often tests an article, not the adjective. Classify by the **answer choice**, not merely by sentence context. |
| everyday | 60 | Articles & endings | Cases & articles, possibly Adjective endings | Mostly contextual article/determiner selection. Inspect each blank before moving. |
| viel | 24 | Quantifiers & determiners | Pronouns & determiners | viel/viele/vielen; countability and inflection. |
| genitive | 40 | Genitive | Cases & articles, with genitive subtopic | Some genitive-governing prepositions (wegen, trotz, während) can be cross-tagged; preserve a dedicated genitive drill filter. |
| prep | 57 | Verbs & prepositions | Prepositions | Fixed verb + preposition pairs; distinguish from case-governing and two-way prepositions in new content. |
| order | 20 | Word order & clauses | Word order or Sentence connections | Conjunction selection (weil, dass, ob, deshalb) should be classified separately from verb-position questions. |
| dativeplural | 8 | Articles & endings | Cases & articles | Dative plural noun inflection. |
| orderextra | 30 | Word order & clauses | Word order, Sentence connections, or Verb forms | Some blanks test verb agreement (e.g. orderextra-001) rather than word order alone. |
| quant | 20 | Quantifiers & determiners | Pronouns & determiners | Declined determiners (jeder, alle, beide, mehrere, einige). |
| **Total source records** | **279** | | | **278 active questions were previously reported by the app. Investigate the difference before setting new count assertions.** |

## Important findings

1. **Do not reclassify all article questions as adjective endings.** For example, core-001 asks for `einen` before `interessanten Film`; it tests article/case choice, not choosing the adjective ending.
2. **The current 'Word order & clauses' category mixes distinct skills.** order-001 asks for `weil` and order-004 asks for `gehen` after a fronted subordinate clause. The first is a connector decision; the second is sentence structure.
3. **Some 'word order' questions test conjugation.** orderextra-001 offers `bleibe`, `bleibt`, `bleibst`, `bleiben`. This does not isolate V2 order; it largely tests agreement. Review or rewrite such questions before counting them toward word-order coverage.
4. **New topic gaps are substantial.** There is no dedicated adjective-ending answer bank, no dedicated pronoun bank, and no dedicated tense or Konjunktiv II bank in the current source list. This is a source-level observation, not a guarantee that individual questions never touch these constructions.
5. **Preserve saved progress.** Never change permanent question IDs or reorder existing sources. Changing the topic labels will also affect saved session history and stage calculation; handle that separately.

## Next implementation pass

- Produce a per-question classification by inspecting each blank, options and explanation, with `primaryTopic` and `subtopic` plus editorial review status.
- Investigate the 279 source records versus 278 active questions.
- Add validation tests for the classification and permanent IDs.
- Only then change the home topic menu, session selection and mixed-practice balancing.
- Prioritize **new adjective-ending questions** that actually ask learners to choose adjective endings, plus pronouns and verb forms.

## Target topic allocation

Cases & articles 100; Adjective endings 85; Prepositions 85; Pronouns & determiners 60; Verb forms & tenses 55; Word order 50; Sentence connections 35; Advanced constructions 30. **Total 500.**

These are provisional editorial targets, not verified market-demand statistics.
