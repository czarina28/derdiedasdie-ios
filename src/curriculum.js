export const TOPIC_LABELS = ['Cases & articles','Adjective endings','Prepositions','Pronouns & determiners','Verb forms & tenses','Word order','Sentence connections','Advanced constructions'];
export function classifyQuestion(q){
 const [source,suffix]=q.id.split('-');
 const n=Number(suffix);
 if(source==='ersatz')return ['Advanced constructions',n<=10||n>=15?'Unreal past with modal verbs':'Ersatzinfinitiv word order'];
 if(source==='connect')return [n<=17?'Sentence connections':n<=21?'Word order':n<=24?'Word order':n<=34?'Sentence connections':'Word order',n<=17?'Connectors':n<=24?'Verb-second position':n<=34?'Subordinate clauses':'Clause inversion'];
 if(source==='advanced')return ['Advanced constructions',n<=5?'Reported speech':n<=10?'Unreal conditionals':n<=18?'Passive and alternatives':n<=23?'Participial attributes':'Complex connectors'];
 if(source==='verb')return ['Verb forms & tenses',n<=6?'Present tense':n<=10?'Perfect tense':n<=14?'Simple past':n<=16?'Future tense':n<=22?'Subjunctive and reported speech':n<=26?'Modal verbs':n<=29?'Imperatives':n<=32?'Infinitive constructions':n<=36?'Passive voice':'Complex tenses'];
 if(source==='pron')return ['Pronouns & determiners',n<=3||n===25?'Beide and beides':n<=10?'Relative pronouns':n<=16?'Personal and demonstrative pronouns':'Indefinite pronouns'];
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
