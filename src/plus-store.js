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
 // First inspect currently visible purchases. An explicit restore may fail in
 // sandbox even when product discovery succeeds; report both results separately.
 let existing=[],lookupError=null,restoreError=null;
 try{
  const result=await NativePurchases.getPurchases({productType:PURCHASE_TYPE.INAPP});
  existing=(result?.purchases||[]).filter(p=>p.productIdentifier===PLUS_PRODUCT_ID);
 }catch(error){lookupError=error;}
 try{await NativePurchases.restorePurchases();}
 catch(error){restoreError=error;}
 let restored=[];
 if(!restoreError){
  try{
   const result=await NativePurchases.getPurchases({productType:PURCHASE_TYPE.INAPP});
   restored=(result?.purchases||[]).filter(p=>p.productIdentifier===PLUS_PRODUCT_ID);
  }catch(error){lookupError=error;}
 }
 return {purchases:restored.length?restored:existing,lookupError,restoreError};
}
export function purchaseErrorDetails(error){
 if(!error)return '';
 const parts=[error.message,error.code,error.domain,error.localizedDescription]
  .filter(value=>value!==undefined&&value!==null&&String(value).trim());
 return [...new Set(parts.map(String))].join(' · ')||'Unknown error';
}
// IMPORTANT: Never unlock Plus from a locally stored flag or unverified transaction.
// Add Apple transaction validation and authoritative entitlement checks before enabling sales.
