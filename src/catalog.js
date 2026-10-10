// Central catalog: keep topic metadata and question validation in one place.
import {sentences,validateSentence} from './sentences.js';
import {moreSentences} from './more-sentences.js';
import {vielSentences} from './viel-sentences.js';
import {genitiveSentences} from './genitive-sentences.js';

export const TOPICS=Object.freeze({
 articles:'Articles & endings',
 viel:'Viel & viele',
 genitive:'Genitive'
});
export const QUESTION_SOURCES=[
 {key:'core',topic:TOPICS.articles,questions:sentences},
 {key:'everyday',topic:TOPICS.articles,questions:moreSentences},
 {key:'viel',topic:TOPICS.viel,questions:vielSentences},
 {key:'genitive',topic:TOPICS.genitive,questions:genitiveSentences}
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
   catalog.push({...q,legacyId:legacyIndex++,topic:source.topic});
  }
 }
 return catalog;
}
