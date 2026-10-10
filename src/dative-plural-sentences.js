// Dative plural noun endings: add -n unless plural already ends in -n or -s.
export const dativePluralSentences = [
{id:'dativeplural-001',before:'Ich spiele oft mit meinen ',after:'.',options:['Freunde','Freunden','Freundes','Freund'],answer:'Freunden',explanation:'„Mit“ takes dative. In the dative plural, „Freunde“ adds -n: mit meinen Freunden.'},
{id:'dativeplural-002',before:'Sie hilft den ',after:' bei den Hausaufgaben.',options:['Kinder','Kindern','Kindes','Kind'],answer:'Kindern',explanation:'„Helfen“ takes dative. Plural „Kinder“ becomes „Kindern“ in the dative plural.'},
{id:'dativeplural-003',before:'Nach drei ',after:' war das Projekt fertig.',options:['Wochen','Woche','Woches','Woch'],answer:'Wochen',explanation:'„Nach“ takes dative. The plural of „Woche“ is already „Wochen“, so no extra -n is added.'},
{id:'dativeplural-004',before:'Wir fahren mit zwei ',after:' zum Bahnhof.',options:['Autos','Auton','Autoen','Auto'],answer:'Autos',explanation:'„Mit“ takes dative, but plurals ending in -s do not add -n: mit zwei Autos.'},
{id:'dativeplural-005',before:'Zwischen den ',after:' steht eine Bank.',options:['Bäume','Bäumen','Baumes','Baum'],answer:'Bäumen',explanation:'„Zwischen“ describes a location here, so it takes dative. Plural „Bäume“ adds -n: zwischen den Bäumen.'},
{id:'dativeplural-006',before:'Ich habe mit den ',after:' gesprochen.',options:['Lehrer','Lehrern','Lehrers','Lehrerin'],answer:'Lehrern',explanation:'„Mit“ requires dative. Plural „Lehrer“ becomes „Lehrern“ in the dative plural.'},
{id:'dativeplural-007',before:'Die Kinder spielen mit ihren ',after:'.',options:['Spielzeuge','Spielzeugen','Spielzeuges','Spielzeug'],answer:'Spielzeugen',explanation:'„Mit“ requires dative. Plural „Spielzeuge“ adds -n: mit ihren Spielzeugen.'},
{id:'dativeplural-008',before:'Wir haben mit den ',after:' aus Berlin telefoniert.',options:['Kollegen','Kollege','Kollegens','Kolleg'],answer:'Kollegen',explanation:'„Kollegen“ is already the plural form ending in -n. In dative plural, it stays „Kollegen“: mit den Kollegen.'}
];
