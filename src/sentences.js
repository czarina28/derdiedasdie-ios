// Curated, contextual practice items. These are not yet externally linguistically reviewed.
// Keep the answer unique and distractors distinct; avoid decontextualized grammar-table prompts.
export const sentences = [
 {before:"Ich habe gestern ",after:" interessanten Film gesehen.",options:["ein","einen","einem","einer"],answer:"einen",explanation:"„Sehen“ takes an accusative object (Wen oder was?). „Film“ is masculine (der Film), so „ein“ becomes „einen“: einen interessanten Film. The adjective takes -en."},
 {before:"Sie fährt jeden Morgen mit ",after:" Fahrrad zur Arbeit.",options:["das","dem","den","des"],answer:"dem",explanation:"„Mit“ requires the dative. „Fahrrad“ is neuter (das Fahrrad), so the definite article changes to „dem“: mit dem Fahrrad."},
 {before:"Wir warten schon seit einer Stunde auf ",after:" Bus.",options:["der","den","dem","des"],answer:"den",explanation:"The expression „warten auf“ takes the accusative. „Bus“ is masculine (der Bus), so the accusative article is „den“: auf den Bus."},
 {before:"Kannst du mir bitte ",after:" Schlüssel geben?",options:["der","den","dem","des"],answer:"den",explanation:"The key is the thing being given: den Schlüssel."},
 {before:"Ich habe heute mit ",after:" neuen Kollegin gesprochen.",options:["meine","meiner","meinen","meines"],answer:"meiner",explanation:"„Mit“ takes the dative: mit meiner neuen Kollegin."},
 {before:"Wir wohnen in ",after:" kleinen Wohnung.",options:["eine","einen","einer","einem"],answer:"einer",explanation:"A fixed location with „in“ takes the dative: in einer kleinen Wohnung."},
 {before:"Er hat ",after:" alten Computer verkauft.",options:["sein","seinen","seinem","seiner"],answer:"seinen",explanation:"The computer is the direct object: seinen alten Computer."},
 {before:"Das Geschenk ist für ",after:" Schwester.",options:["mein","meine","meiner","meinem"],answer:"meine",explanation:"„Für“ takes the accusative: für meine Schwester."},
 {before:"Wir haben gestern ",after:" leckeres Essen gekocht.",options:["ein","einen","einem","eines"],answer:"ein",explanation:"„Essen“ is neuter: ein leckeres Essen."},
 {before:"Ich suche ",after:" ruhigen Ort zum Lesen.",options:["ein","einen","einem","einer"],answer:"einen",explanation:"„Ort“ is masculine and the object of „suchen“: einen ruhigen Ort."},
 {before:"Sie hat ",after:" rote Jacke im Zug vergessen.",options:["ihr","ihre","ihren","ihrem"],answer:"ihre",explanation:"„Jacke“ is feminine: ihre rote Jacke."},
 {before:"Nach ",after:" langen Tag brauche ich Ruhe.",options:["ein","einen","einem","eines"],answer:"einem",explanation:"„Nach“ takes the dative: nach einem langen Tag."},
 {before:"Er hilft ",after:" älteren Nachbarn beim Einkaufen.",options:["sein","seinen","seinem","seiner"],answer:"seinem",explanation:"„Helfen“ takes the dative: seinem älteren Nachbarn."},
 {before:"Wir gehen heute in ",after:" neue Restaurant am Bahnhof.",options:["das","dem","den","des"],answer:"das",explanation:"Movement into a place: in das neue Restaurant."},
 {before:"Das Kind spielt mit ",after:" kleinen Hund.",options:["der","den","dem","des"],answer:"dem",explanation:"„Mit“ takes the dative: mit dem kleinen Hund."},
 {before:"Ich möchte ",after:" frischen Kaffee bestellen.",options:["ein","einen","einem","einer"],answer:"einen",explanation:"„Kaffee“ is masculine: einen frischen Kaffee."},
 {before:"Wir haben ",after:" schöne Aussicht vom Balkon.",options:["ein","eine","einen","einem"],answer:"eine",explanation:"„Aussicht“ is feminine: eine schöne Aussicht."},
 {before:"Sie arbeitet seit ",after:" letzten Sommer in München.",options:["der","den","dem","des"],answer:"dem",explanation:"„Seit“ takes the dative: seit dem letzten Sommer."},
 {before:"Ich trinke meinen Kaffee gern mit ",after:" kalter Milch.",options:["die","der","den","das"],answer:"der",explanation:"„Mit“ takes the dative: mit der kalten Milch. In this sentence, the adjective is „kalter“ without an article; to practice the article naturally, use „mit der kalten Milch“."},
 {before:"Wir treffen uns vor ",after:" großen Gebäude.",options:["das","dem","den","des"],answer:"dem",explanation:"A fixed location with „vor“ takes the dative: vor dem großen Gebäude."}
].filter(item=>!item.before.includes("gern mit ")); // Reserved item requires a separately reviewed sentence.
export function validateSentence(q){
 const options=q.options;
 return Boolean(q.before&&q.after&&q.explanation&&options.length>=2&&options.length<=4&&new Set(options).size===options.length&&options.filter(x=>x===q.answer).length===1&&!options.includes('—'));
}
export function checkAnswer(q,choice){return q.answer===choice;}
