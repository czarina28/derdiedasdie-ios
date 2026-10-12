import Foundation
import StoreKit
import Capacitor

// Capacitor bridge to StoreKit 2. StoreKit's VerificationResult is checked
// inside native Swift; JavaScript never supplies its own entitlement flag.
@objc(PlusStoreKitPlugin)
public class PlusStoreKitPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "PlusStoreKitPlugin"
    public let jsName = "PlusStoreKit"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "status", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "purchase", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "restore", returnType: CAPPluginReturnPromise)
    ]
    private let productID = "de.derdiedasdie.app.plus"

    private func owned() async -> Bool {
        for await entitlement in Transaction.currentEntitlements {
            guard case .verified(let transaction) = entitlement else { continue }
            if transaction.productID == productID && transaction.revocationDate == nil {
                return true
            }
        }
        return false
    }

    @objc func status(_ call: CAPPluginCall) {
        Task {
            let active = await owned()
            call.resolve(["active": active])
        }
    }

    @objc func purchase(_ call: CAPPluginCall) {
        Task {
            do {
                guard let product = try await Product.products(for: [productID]).first else {
                    call.reject("PLUS product unavailable from App Store")
                    return
                }
                switch try await product.purchase() {
                case .success(let result):
                    guard case .verified(let transaction) = result else {
                        call.reject("Apple could not verify this transaction")
                        return
                    }
                    guard transaction.productID == productID && transaction.revocationDate == nil else {
                        call.reject("Transaction does not grant PLUS")
                        return
                    }
                    await transaction.finish()
                    call.resolve(["active": true])
                case .userCancelled:
                    call.resolve(["active": false, "cancelled": true])
                case .pending:
                    call.resolve(["active": false, "pending": true])
                @unknown default:
                    call.reject("Unknown purchase result")
                }
            } catch {
                call.reject(error.localizedDescription)
            }
        }
    }

    @objc func restore(_ call: CAPPluginCall) {
        Task {
            do {
                try await AppStore.sync()
                call.resolve(["active": await owned()])
            } catch {
                call.reject(error.localizedDescription)
            }
        }
    }
}
