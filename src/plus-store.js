// Apple StoreKit product discovery. Ownership is checked separately in plus-entitlement.js.
// All grammar practice remains free; PLUS unlocks progress and mastery insights only.
export const PLUS_PRODUCT_ID='de.derdiedasdie.app.plus';

export async function plusProduct(){
 if(!window.Capacitor?.isNativePlatform?.())return null;
 const {NativePurchases,PURCHASE_TYPE}=await import('@capgo/native-purchases');
 const support=await NativePurchases.isBillingSupported();
 if(!support?.isBillingSupported)throw new Error('App Store purchases are unavailable on this device.');
 const {products}=await NativePurchases.getProducts({productIdentifiers:[PLUS_PRODUCT_ID],productType:PURCHASE_TYPE.INAPP});
 return (products||[]).find(p=>p.identifier===PLUS_PRODUCT_ID)||null;
}
