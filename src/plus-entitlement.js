import {NativePurchases,PURCHASE_TYPE} from '@capgo/native-purchases';
import {PLUS_PRODUCT_ID} from './plus-store.js';

// On iOS the plugin enumerates StoreKit 2 Transaction.currentEntitlements,
// discards unverified transactions natively, and returns only verified ones.
// Do not grant PLUS from a purchase response, localStorage or Transaction.all.
export async function verifiedPlusEntitlement(){
 if(!window.Capacitor?.isNativePlatform?.())return {active:false,configured:false};
 const result=await NativePurchases.getPurchases({
  productType:PURCHASE_TYPE.INAPP,
  onlyCurrentEntitlements:true
 });
 const active=(result?.purchases||[]).some(p=>
  p.productIdentifier===PLUS_PRODUCT_ID &&
  !p.revocationDate &&
  !p.expirationDate
 );
 return {active,configured:true};
}

export async function buyVerifiedPlus(){
 // StoreKit purchase confirmation alone is not proof of an active entitlement.
 const transaction=await NativePurchases.purchaseProduct({
  productIdentifier:PLUS_PRODUCT_ID,
  productType:PURCHASE_TYPE.INAPP
 });
 const ownership=await verifiedPlusEntitlement();
 return {active:ownership.active,pending:!ownership.active,transactionId:transaction?.transactionId};
}

export async function restoreVerifiedPlus(){
 // StoreKit 2 can already expose verified ownership without AppStore.sync().
 // Check that first: an Apple sync failure must not hide an existing entitlement.
 const current=await verifiedPlusEntitlement();
 if(current.active)return {active:true};
 try{
  await NativePurchases.restorePurchases();
 }catch(error){
  // Even if Apple sync fails, recheck current entitlements before reporting it.
  const afterFailure=await verifiedPlusEntitlement();
  if(afterFailure.active)return {active:true};
  throw error;
 }
 const afterSync=await verifiedPlusEntitlement();
 return {active:afterSync.active};
}
