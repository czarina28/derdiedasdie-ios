# Plus StoreKit integration status

The app uses Capacitor 7. A compatible `@capgo/native-purchases` v7 dependency and native adapter are staged in `src/plus-store.js`.

**Sales remain disabled** (`PLUS_SALES_ENABLED=false`). The GitHub Pages web preview cannot execute Apple StoreKit. Existing Plus practice remains a free preview.

Proposed Apple App Store Connect setup:
- Bundle ID: `de.derdiedasdie.app`
- Non-consumable in-app purchase ID: `de.derdiedasdie.app.plus`
- Intended German price point: €4.99, configured as an App Store price tier; actual localized price must come from StoreKit.
- Complete tax, banking, Paid Applications agreement and IAP review metadata in App Store Connect.

Before turning on the purchase button:
1. Run `npm install`, `npm run build`, and `npx cap sync ios` on the native build workflow.
2. Verify the App Store Connect product ID matches `PLUS_PRODUCT_ID` exactly.
3. Add authoritative Apple transaction validation (App Store Server API or another secure verifier) and an entitlement service. Never trust a localStorage boolean, client-only transaction, or unverified restore response.
4. Query current entitlements on app launch and after purchase/restore, and unlock **only** after verification. Handle cancellation, pending, revoked/refunded, offline and already-owned states.
5. Add StoreKit-derived localized price and title to the native purchase screen. Keep the web version explicitly unavailable for purchase.
6. Test on a real eligible Apple device via Sandbox/TestFlight: buy, relaunch, reinstall/restore, wrong account, cancelled purchase, and network failure.
7. Only then set `PLUS_SALES_ENABLED=true`, enable the UI and submit for review.

The adapter provides `plusProduct()`, `purchasePlus()`, and `restorePlus()`. Restored transactions are **not** automatically treated as an entitlement. Do not publish paid functionality until validation is implemented and tested.
