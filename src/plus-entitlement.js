import {registerPlugin} from '@capacitor/core';

// Native StoreKit 2 is the sole authority for Plus ownership.
// No PHP backend, stored boolean or JavaScript-provided transaction IDs.
const PlusStoreKit=registerPlugin('PlusStoreKit');
export async function verifiedPlusEntitlement(){
 if(!window.Capacitor?.isNativePlatform?.())return {active:false,configured:false};
 const result=await PlusStoreKit.status();
 return {active:result?.active===true,configured:true};
}
export async function buyVerifiedPlus(){
 const result=await PlusStoreKit.purchase();
 return {active:result?.active===true,cancelled:result?.cancelled===true,pending:result?.pending===true};
}
export async function restoreVerifiedPlus(){
 const result=await PlusStoreKit.restore();
 return {active:result?.active===true};
}
