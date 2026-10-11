// StoreKit adapter. No purchase is enabled until product and receipt verification are configured.
export const PLUS_PRODUCT_ID='de.derdiedasdie.app.plus'; // Configure in App Store Connect.
export const PLUS_SALES_ENABLED=false;
export async function store(){
 if(!window.Capacitor?.isNativePlatform?.())throw new Error('Purchases require the installed iPhone app.');
 const {NativePurchases,PURCHASE_TYPE}=await import('@capgo/native-purchases');
 const support=await NativePurchases.isBillingSupported();
 if(!support.isBillingSupported)throw new Error('App Store purchases are unavailable on this device.');
 return {NativePurchases,PURCHASE_TYPE};
}
export async function plusProduct(){
 const {NativePurchases,PURCHASE_TYPE}=await store();
 const {products}=await NativePurchases.getProducts({productIdentifiers:[PLUS_PRODUCT_ID],productType:PURCHASE_TYPE.INAPP});
 return products.find(p=>p.identifier===PLUS_PRODUCT_ID)||null;
}
export async function purchasePlus(){
 if(!PLUS_SALES_ENABLED)throw new Error('Plus purchases are not available yet.');
 const {NativePurchases,PURCHASE_TYPE}=await store();
 return NativePurchases.purchaseProduct({productIdentifier:PLUS_PRODUCT_ID,productType:PURCHASE_TYPE.INAPP});
}
export async function restorePlus(){
 const {NativePurchases,PURCHASE_TYPE}=await store();
 await NativePurchases.restorePurchases();
 const {purchases}=await NativePurchases.getPurchases({productType:PURCHASE_TYPE.INAPP});
 return purchases.filter(p=>p.productIdentifier===PLUS_PRODUCT_ID);
}
// IMPORTANT: Never unlock Plus from a locally stored flag or unverified transaction.
// Add Apple transaction validation and authoritative entitlement checks before enabling sales.
