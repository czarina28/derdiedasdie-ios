import {verbFormSentences} from './verb-form-sentences.js';
import {pronounSentences} from './pronoun-sentences.js';
import {adjectiveEndingSentences} from './adjective-ending-sentences.js';
import {classifyQuestion} from './curriculum.js';
// Central catalog: keep topic metadata and question validation in one place.
import {sentences,validateSentence} from './sentences.js';
import {moreSentences} from './more-sentences.js';
import {vielSentences} from './viel-sentences.js';
import {genitiveSentences} from './genitive-sentences.js';
import {prepositionSentences} from './preposition-sentences.js';
import {wordOrderSentences} from './word-order-sentences.js';
import {dativePluralSentences} from './dative-plural-sentences.js';
import {moreWordOrderSentences} from './more-word-order-sentences.js';
import {quantifierSentences} from './quantifier-sentences.js';

export const TOPICS=Object.freeze({
 articles:'Articles & endings',
 viel:'Quantifiers & determiners',
 genitive:'Genitive',
 prepositions:'Verbs & prepositions',
 wordOrder:'Word order & clauses'
});
export const QUESTION_SOURCES=[
 {key:'core',topic:TOPICS.articles,questions:sentences},
 {key:'everyday',topic:TOPICS.articles,questions:moreSentences},
 {key:'viel',topic:TOPICS.viel,questions:vielSentences},
 {key:'genitive',topic:TOPICS.genitive,questions:genitiveSentences},
 {key:'prep',topic:TOPICS.prepositions,questions:prepositionSentences},
 {key:'order',topic:TOPICS.wordOrder,questions:wordOrderSentences},
 {key:'dativeplural',topic:TOPICS.articles,questions:dativePluralSentences},
 {key:'orderextra',topic:TOPICS.wordOrder,questions:moreWordOrderSentences},
 {key:'quant',topic:TOPICS.viel,questions:quantifierSentences},
 {key:'adj',topic:'Adjective endings',questions:adjectiveEndingSentences},
 {key:'pron',topic:'Pronouns & determiners',questions:pronounSentences},
 {key:'verb',topic:'Verb forms & tenses',questions:verbFormSentences}
];
export function buildCatalog(){
 const catalog=[];
 const seen=new Set();
 let legacyIndex=0;
 for(const source of QUESTION_SOURCES){
  for(let i=0;i<source.questions.length;i++){
   const q=source.questions[i];
   if(!validateSentence(q))continue;
   if(typeof q.id!=='string'||!q.id.startsWith(source.key+'-'))throw new Error('Missing or invalid permanent question ID in '+source.key);
   if(seen.has(q.id))throw new Error('Duplicate question ID: '+q.id);
   seen.add(q.id);
   const [topic,subtopic]=classifyQuestion(q);
   catalog.push({...q,legacyId:legacyIndex++,topic,subtopic});
  }
 }
 return catalog;
}
