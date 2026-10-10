export const TOPIC_LABELS = ['Cases & articles','Adjective endings','Prepositions','Pronouns & determiners','Verb forms & tenses','Word order','Sentence connections','Advanced constructions'];
export function classifyQuestion(q){
 const [source,suffix]=q.id.split('-');
 const n=Number(suffix);
 if(source==='adj')return ['Adjective endings','Strong, weak and mixed endings'];
 if(source==='genitive')return ['Cases & articles','Genitive'];
 if(source==='dativeplural')return ['Cases & articles','Dative plural'];
 if(source==='prep')return ['Prepositions','Verb-preposition pairs'];
 if(source==='viel')return ['Pronouns & determiners','Quantifiers'];
 if(source==='quant')return ['Pronouns & determiners','Determiners'];
 if(source==='order')return [[4,5,10,18].includes(n)?'Word order':'Sentence connections',[4,5,10,18].includes(n)?'Verb position':'Connectors'];
 if(source==='orderextra'){
  if(n>=16&&n<=20)return ['Pronouns & determiners','Relative pronouns'];
  if(n<=5||[6,9,11,12,14,15].includes(n))return ['Verb forms & tenses','Verb forms'];
  return ['Word order','Clause structure'];
 }
 if(source==='core'||source==='everyday')return ['Cases & articles','Articles and case'];
 throw new Error('Unclassified question: '+q.id);
}
