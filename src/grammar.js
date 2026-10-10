// Declension tables transcribed from the supplied article_ending_quiz(2).html.
// This is a first automated-validation baseline, not independent linguistic certification.
export const genders = ['Masculine','Feminine','Neuter','Plural'];
export const cases = ['Nominative','Accusative','Dative','Genitive'];
export const articleTables = {
 'Definite article': {Nominative:['der','die','das','die'],Accusative:['den','die','das','die'],Dative:['dem','der','dem','den'],Genitive:['des','der','des','der']},
 'Indefinite article': {Nominative:['ein','eine','ein',null],Accusative:['einen','eine','ein',null],Dative:['einem','einer','einem',null],Genitive:['eines','einer','eines',null]},
 'Negative article': {Nominative:['kein','keine','kein','keine'],Accusative:['keinen','keine','kein','keine'],Dative:['keinem','keiner','keinem','keinen'],Genitive:['keines','keiner','keines','keiner']},
 'Possessive article pattern': {Nominative:['mein','meine','mein','meine'],Accusative:['meinen','meine','mein','meine'],Dative:['meinem','meiner','meinem','meinen'],Genitive:['meines','meiner','meines','meiner']}
};
export const adjectiveTables = {
 'Weak adjective endings': {Nominative:['-e','-e','-e','-en'],Accusative:['-en','-e','-e','-en'],Dative:['-en','-en','-en','-en'],Genitive:['-en','-en','-en','-en']},
 'Mixed adjective endings': {Nominative:['-er','-e','-es','-en'],Accusative:['-en','-e','-es','-en'],Dative:['-en','-en','-en','-en'],Genitive:['-en','-en','-en','-en']},
 'Strong adjective endings': {Nominative:['-er','-e','-es','-e'],Accusative:['-en','-e','-es','-e'],Dative:['-em','-er','-em','-en'],Genitive:['-en','-er','-en','-er']}
};
export const categories = {...articleTables,...adjectiveTables};
export function cell(table, grammaticalCase, gender) {return categories[table]?.[grammaticalCase]?.[genders.indexOf(gender)] ?? null;}
function shuffle(a,rng=Math.random){const copy=[...a];for(let i=copy.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}return copy;}
export function buildQuestion(table, grammaticalCase, gender, rng=Math.random){
 const answer=cell(table,grammaticalCase,gender);
 if(!answer)return null;
 const all=[...new Set(Object.values(categories[table]).flat().filter(v=>v&&v!==answer))];
 const distractors=shuffle(all,rng).slice(0,3);
 const options=shuffle([answer,...distractors],rng);
 if(options.length<2 || new Set(options).size!==options.length)throw new Error('Invalid options');
 return {id:`${table}|${grammaticalCase}|${gender}`,table,grammaticalCase,gender,answer,options,
  prompt:`Select the ${table.toLowerCase()} for ${grammaticalCase.toLowerCase()}, ${gender.toLowerCase()}.`,
  explanation:`The ${table.toLowerCase()} in the ${grammaticalCase.toLowerCase()} ${gender.toLowerCase()} form is “${answer}”.`};
}
export function questionBank(){return Object.keys(categories).flatMap(t=>cases.flatMap(c=>genders.map(g=>buildQuestion(t,c,g,()=>0.41)).filter(Boolean)));}
export function isCorrect(question,selectedValue){return selectedValue===question.answer;}
