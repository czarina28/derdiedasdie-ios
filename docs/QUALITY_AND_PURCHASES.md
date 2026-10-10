# Content quality and monetization plan

## Non-negotiable product rule
Every learning subject and ordinary practice mode is free. No paid grammar categories.

## Vocabulary source audit (initial automated scan, 2026-10-10)
Source: supplied `flashcards(2).html`, `RAW_CARDS` array.
- 2,782 cards: 897 `Nouns`, 987 `Words`, 898 `Phrases`.
- 43 duplicate German-front strings after trimming and case folding, representing 45 extra records. **Do not delete automatically**: meanings may differ.
- All cards use `front`, `back`, `from`, `to`, `category`; no dedicated gender, plural, lemma, or verification fields.
- 0 of 897 `Nouns` fronts start with `der `, `die `, or `das ` (case-insensitive). Gender/plural data may still appear elsewhere or be inferred from text; this check is not a linguistic validation.
- Example to review: `Umschlungen` is categorized as `Nouns`; `Abgeordnete` translates to `mPs`.
- The original content must remain unchanged. Produce a normalized dataset and an exception report, with manual approval for ambiguous corrections.

## Normalized vocabulary schema (proposal)
```json
{
  "id": "stable-id",
  "lemma": "Hund",
  "partOfSpeech": "noun",
  "gender": "masculine",
  "plural": "Hunde",
  "translations": ["dog"],
  "example": null,
  "sourceText": "Hund",
  "sourceCategory": "Nouns",
  "verification": "unreviewed",
  "notes": []
}
```
Never infer unknown fields as facts. Distinguish `unreviewed`, `auto-checked`, and `human-reviewed`. Nouns with multiple genders or meanings may need separate senses.

## Grammar verification
1. Extract answer keys, grammatical tables, question generators, and examples from each source trainer.
2. Write deterministic test cases for all cases, genders, numbers, and declension patterns.
3. Flag inconsistent answers and ambiguous prompts; don't assume a single right answer if context is insufficient.
4. Review examples and translations with reliable reference dictionaries and, for unresolved cases, a qualified German reviewer.
5. Require passing tests and reviewed content before shipping.

## In-app purchase plan
- One non-consumable **Premium Features** unlock, not a subject paywall; price TBD.
- Free: all subjects, ordinary practice, answer corrections, essential explanations, and basic session scores.
- Premium candidates: custom mistake-review decks, advanced history and analytics, custom study plans, and export/backup if implemented.
- StoreKit 2 or a maintained Capacitor-native purchase bridge; choose after testing compatibility with the actual iOS build.
- Provide purchase, restore purchases, entitlement persistence, and offline entitlement behavior.
- Do not rely on a corporate-managed device for Sandbox testing. Validate purchase and restore on a personal iPad/iPhone with the appropriate test account before release.
- No paid UI promises before features exist. Check Apple App Store rules and product configuration at implementation time.

## Order of work
1. Create immutable source snapshot and machine-readable audit report.
2. Build normalized vocabulary dataset and review queue.
3. Extract and test grammar logic.
4. Build mobile app with free practice.
5. Implement and test premium features and StoreKit.
6. Beta test with native speakers and German learners, then submit.
