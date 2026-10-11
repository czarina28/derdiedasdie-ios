# derdiedasdie — first-revenue release plan

## Objective
Ship a trustworthy iPhone app with a purchasable premium upgrade, and validate the first real paying customer. Approval and downloads alone are not success.

## What exists (code review, October 2026)
- Vite/vanilla JavaScript app with Capacitor 7 dependencies and app configuration.
- Grammar question catalog, ten-question sessions, answer explanations, and topic practice.
- Local history via localStorage: attempts, misses, streaks, recent questions, and sessions.
- Existing **Fix My German** personalized sessions, **Review mistakes**, skill summaries, and session feedback are available without payment.
- No verified StoreKit purchase implementation or entitlement restoration yet. No claim of tested iOS builds.

## Product promise
**You know better. Now do better.**
All grammar subjects and basic review remain free. Premium should add lasting value without removing existing free capabilities.

## Proposed paid offer (hypothesis to validate)
**derdiedasdie Plus — €4.99 one-time unlock** (local storefront prices may vary).

Candidate premium features:
1. A persistent **My Weak Spots** dashboard with grammar-area trends over time, not merely the existing top-three skill list.
2. A guided, multi-session **Personal Practice Plan** that prioritizes recurring errors and tracks improvement.
3. Expanded progress history and progress visualization.

The first premium deliverable should be the weak-spots dashboard plus a meaningful guided practice plan, not just a decorative paywall.

## Acceptance criteria before charging
- Core practice, explanations, Fix My German, and existing mistake review remain free.
- Premium screens demonstrate clear value and distinguish locked versus unlocked features without interrupting ordinary practice.
- Purchase uses Apple in-app purchase for iOS digital features, with an appropriate non-consumable product identifier.
- Entitlement is granted only after verified successful purchase and persists across relaunches.
- **Restore Purchases** works after reinstall / on another eligible device.
- Purchase failures, cancellation, offline state, and unavailable StoreKit are handled gracefully.
- A physical Apple device and Apple sandbox / TestFlight purchase tests are available before release.
- App privacy disclosures and review materials reflect actual implementation.
- Grammar content and purchase logic pass automated tests; native iOS build and safe-area behavior are tested.
- Pricing, costs, and actual revenue are tracked separately from downloads.

## Delivery sequence
1. Review app behavior, local persistence, tests, and current iPhone UX.
2. Implement premium feature logic and demo experience without enabling a real purchase yet.
3. Integrate iOS StoreKit purchase and restoration, keeping access checks independent of UI.
4. Obtain test-device access; run sandbox purchase, restore, and failure-path tests.
5. Build/sign via macOS/Xcode or a suitable cloud build workflow; prepare App Store Connect listing and submit.
6. Track first real paid purchase and gather feedback; adjust offer based on evidence.

## Constraints
- Windows-first development; iOS compilation/signing requires macOS/Xcode somewhere in the workflow.
- Do not publish a premium paywall without a working, tested purchase and restore flow.
- Do not promise revenue: €4.99 and the feature bundle are experiments.
