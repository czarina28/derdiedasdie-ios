// A verified entitlement is issued by our backend, never by local purchase state.
// No persistent "plus=true" flag: recheck ownership on launch and after restore.
export const PLUS_ENTITLEMENT_ENDPOINT=''; // HTTPS endpoint to configure after backend deployment.
export async function verifiedPlusEntitlement({transactionId,signal}={}){
 if(!PLUS_ENTITLEMENT_ENDPOINT) return {active:false,configured:false};
 const url=new URL(PLUS_ENTITLEMENT_ENDPOINT);
 if(url.protocol!=='https:')throw new Error('Plus verification requires HTTPS.');
 const response=await fetch(url.toString(),{
  method:'POST',
  headers:{'Content-Type':'application/json'},
  body:JSON.stringify({productId:'de.derdiedasdie.app.plus',transactionId:transactionId||null}),
  signal
 });
 if(!response.ok)throw new Error('Entitlement verification failed ('+response.status+').');
 const result=await response.json();
 // The server must verify transaction with Apple, product, app, revocation
 // and ownership. Client response alone is not a substitute for that.
 return {active:result?.verified===true&&result?.active===true,configured:true};
}
