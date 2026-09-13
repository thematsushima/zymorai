import { DATA } from './data.js';
export const isRating = v => Number.isInteger(v) && v >= 1 && v <= 5;
export function validAnswer(id, value) {
  if (id <= 40) return isRating(value) || value === 'na';
  const q = DATA.contexts.find(q => q.id === id);
  if (!q || !Array.isArray(value) || !value.length || value.length > q.max || new Set(value).size !== value.length) return false;
  if (!value.every(v => Number.isInteger(v) && v >= 0 && v < q.options.length)) return false;
  return !(q.max > 1 && value.includes(q.options.length - 1) && value.length > 1);
}
export function score(answers = {}) {
  return DATA.axes.map(axis => {
    const evidence = axis.items.filter(id => isRating(answers[id])).map(id => ({id, raw: answers[id], value: axis.reverse.includes(id) ? 6 - answers[id] : answers[id], weight: 1}));
    const n = evidence.length;
    const mean = n >= 4 ? evidence.reduce((s,e) => s + e.value, 0) / n : null;
    return {...axis, evidence, n, mean, min: n ? Math.min(...evidence.map(e=>e.value)) : null, max: n ? Math.max(...evidence.map(e=>e.value)) : null,
      pattern: mean === null ? 'insufficient' : mean >= 4 ? 'agreement' : mean <= 2 ? 'disagreement' : 'mixed'};
  });
}
export function context(answers, id) {
  const q=DATA.contexts.find(q=>q.id===id);
  return validAnswer(id,answers[id]) ? answers[id].map(i=>q.options[i]) : [];
}
export function report(answers) {
  const axes=score(answers);
  const picked=(id,i)=> validAnswer(id, answers[id]) && answers[id].includes(i);
  const preference = validAnswer(48,answers[48]) ? answers[48][0] : null;
  const chosen=['enjoyment','friction','routine','restart','social','demand'][preference];
  const ids=[];
  if(chosen) ids.push(chosen);
  // Semantic anchors, not clinically calibrated cutoffs. No rank ordering of axis scores.
  for(const a of axes) if(a.mean!==null && (a.id==='restart' ? a.mean<=2 : a.mean>=4) && !ids.includes(a.id)) ids.push(a.id);
  const suggestions=ids.map(id=> {
    const a=axes.find(a=>a.id===id);
    let text=a.experiment;
    if(id==='feedback' && (picked(47,4)||picked(47,1)||picked(47,5))) text='You have not chosen formal tracking. Keep that preference: use a conversation when you want one, or simply notice what feels different without recording it.';
    if(id==='feedback' && picked(47,2)) text='If useful, keep one simple private record of a meaningful action or experience. You decide what to record and do not need to share it.';
    if(id==='social') text='Your preferred support: '+(context(answers,46).join('; ')||'not specified')+'. Your check-in preference: '+(context(answers,47).join('; ')||'not specified')+'. Start by agreeing these boundaries; company in one activity need not mean monitoring your eating.';
    if(id==='demand' && picked(48,5)) text='You chose understanding first. Observe one difficult moment, without requiring a behaviour change. Notice the situation and what you needed; decide later whether to act.';
    return {id,title:a.label,text,refs:a.refs,reason:id===chosen?'You selected this focus in question 48.':`Your ${a.label.toLowerCase()} responses averaged ${a.mean.toFixed(1)}/5 after reverse coding.`,basis:id===chosen?'explicit preference':'descriptive rule',items:a.evidence};
  });
  const notes=[];
  if(picked(42,0)) notes.push('You selected hunger or not feeling satisfied. Do not assume this is a reward or willpower problem. Revisit whether your eating plan meets your needs; individual dietary advice belongs with a qualified dietitian.');
  if(picked(42,2)) notes.push('You identified meal tracking as a difficulty. A recommendation to monitor progress does not mean you need to log calories or macros.');
  if(picked(46,5)) notes.push('You asked for space until you bring things up. This overrides any general suggestion for accountability or unsolicited check-ins.');
  if(picked(47,4)) notes.push('You chose no formal tracking for now. There is no requirement to collect data during your experiment.');
  return {version:DATA.version,axes,suggestions,notes,context:DATA.contexts.map(q=>({id:q.id,question:q.text,answers:context(answers,q.id)})),answered:Array.from({length:48},(_,i)=>i+1).filter(i=>validAnswer(i,answers[i])).length};
}
