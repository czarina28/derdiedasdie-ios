# derdiedasdie iOS

German grammar practice for iPhone, built with Vite, Capacitor 8, and JavaScript. The website at derdiedasdie.de is a separate product.

## Product rules

- **All grammar practice is free and unlimited**, including mixed practice, topic practice, Review Mistakes, and Target Weak Spots. Never paywall exercises, answers, corrections, or explanations.
- **derdiedasdie PLUS** adds progress, mastery tracking across days, longitudinal insights, and personalized practice planning. Tagline: “Know what you've mastered. Know what's next.”
- PLUS is a **one-time, non-consumable in-app purchase** with App Store Connect product ID `de.derdiedasdie.app.plus` (US price tier intended: $3.99). Display Apple's localized product price, never a hardcoded price.
- PLUS ownership must be derived from verified native StoreKit current entitlements, never localStorage, a preview flag, or a purchase-response success alone. See `src/plus-entitlement.js`.
- Mastery requires three distinct perfect days, six distinct questions, and at least two distinct question IDs on each perfect day. See `src/mastery.js`.

## Development and browser preview

Work on `feature/native-home-dashboard`; do not change `main` as part of release preparation.

```sh
npm install
npm test
npm run build
npm run dev
```

Browser app-layout preview: `http://localhost:5173/derdiedasdie-ios/?preview`. Browser preview never grants PLUS or simulates Apple purchases.

## Native release preparation

- Capacitor app ID: `de.derdiedasdie.app`; web output: `dist`.
- The Capacitor bundle must be built with `npx vite build --mode capacitor` (or equivalent `npm run build -- --mode capacitor`) **before** `npx cap sync ios`. The default Vite build uses a GitHub Pages subpath and is not suitable for the iOS bundle.
- `scripts/install-plus-storekit.sh` is a compatibility no-op for older Bitrise workflows. The active purchase implementation uses `@capgo/native-purchases`, not `native/PlusStoreKitPlugin.swift`.
- Confirm the Bitrise workflow's branch, native project generation, version/build number, code signing, and release configuration before starting a build. The iOS project is not checked into this branch.
- Test a real TestFlight installation: onboarding/home, all four tabs, full practice session, Review Mistakes, session completion, dark/light modes, safe areas, persistence after relaunch, and PLUS product discovery, purchase, restore, and entitlement handling.
- Complete App Store Connect listing, privacy/support links, screenshots, and first IAP submission alongside the app version. Do not submit before the native purchase path is verified on device.
