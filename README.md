# derdiedasdie iOS

A mobile-first German practice app based on the existing derdiedasdie.de JavaScript trainers. The website remains a separate product.

## Product principles

- **Every learning subject is free.** Never put articles, adjective endings, noun endings, weak masculine nouns, prefixes, verb/preposition practice, flashcards, WortFünf, or C1 practice behind a paywall.
- Free users can practice each subject and receive answer corrections and explanations.
- Potential paid extras: personalized mistake review, advanced progress statistics, and custom study plans. Pricing and purchase implementation are not finalized.
- Prioritize correct grammatical feedback, accessible difficulty, offline exercises, and an iPhone-safe layout.
- Preserve original learning content and validate answer rules with tests before release.

## Planned technical approach

- Vite + vanilla JavaScript for a unified mobile UI and reusable grammar modules.
- Capacitor for the iOS shell.
- Local storage for initial progress, with a more robust persistence strategy as needed.
- StoreKit in-app purchase integration must be implemented and tested on a physical Apple device before submission.
- Windows-first development; iOS builds require a macOS/Xcode environment or an appropriate cloud build pipeline.

## Initial scope

1. Mobile home screen, daily five-question challenge, and basic session scoring.
2. Extract and test article/adjective-ending logic from the supplied website trainer.
3. Add weak masculine nouns, prefixes, verb/preposition practice, and flashcards.
4. Add clear explanation feedback and local progress.
5. Integrate premium extras without restricting subjects.
6. Add remaining modes after the core app is tested.

## Source files

Original trainer HTML/JavaScript files were supplied in the ChatGPT conversation and have not yet been copied into this repository. Do not assume the source code has been migrated.
