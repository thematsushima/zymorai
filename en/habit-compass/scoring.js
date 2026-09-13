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
const PROFILES=[
 {id:'joy-led',emoji:'✨',name:'The Joy-Led Repeater',axis:'enjoyment',mode:'high',subtitle:'Pleasure is your habit superpower.',text:'You are most likely to return to a habit when the doing is rewarding now — a great playlist, a satisfying ritual, a small win, or simply a better mood afterwards. For you, “fun” is not a distraction from consistency; it can be part of the engine.',experiment:'Make one useful habit 10% more enjoyable this week. Add music, a favourite route, a tiny ritual, or an immediate feel-good finish.'},
 {id:'routine-led',emoji:'🧱',name:'The Routine Builder',axis:'routine',mode:'high',subtitle:'A good cue beats a heroic mood.',text:'Familiar times, places, and sequences appear to make follow-through easier for you. A reliable cue can quietly do some of the work, so you do not have to negotiate with yourself from scratch each day.',experiment:'Attach one tiny action to a cue that already happens — after coffee, after lunch, or when you get home.'},
 {id:'progress-led',emoji:'📈',name:'The Progress Spotter',axis:'feedback',mode:'high',subtitle:'Seeing movement keeps the story going.',text:'You seem to get energy from noticing change: showing up, getting stronger, finishing a chapter, or making something easier. A light progress signal may help you see that ordinary repetition is adding up.',experiment:'Pick one kind, low-pressure marker of progress for a week — ticks, minutes practised, or “did it feel easier?” — and drop it if it becomes annoying.'},
 {id:'self-directed',emoji:'🗺️',name:'The Self-Directed Explorer',axis:'autonomy',mode:'high',subtitle:'Your habits work best when they still feel like yours.',text:'Choice appears important to you. You may be more willing to continue when you can adapt the route, timing, or version of a habit instead of following a rigid script. Flexibility is not the opposite of commitment.',experiment:'Write a “choose-your-own-version” of one habit: the full version, a smaller version, and a different-time version.'},
 {id:'social',emoji:'🤝',name:'The Social Spark',axis:'social',mode:'high',subtitle:'A little company can create momentum.',text:'Support, shared activity, or simply knowing someone is in your corner seems to make habits more inviting. The right kind of company can be enough; it need not become pressure.',experiment:'Invite someone to join one low-stakes habit, or tell a friend exactly what kind of encouragement feels useful.'},
 {id:'friction',emoji:'🛝',name:'The Friction Fixer',axis:'friction',mode:'high',subtitle:'Make the good option the easy option.',text:'Starting appears to cost more energy when there are many decisions, preparations, or inconvenient steps. That is useful design information, not a character flaw. Your strongest lever may be reducing setup rather than increasing pressure.',experiment:'Remove one speed bump before it appears: lay something out, pre-decide the first step, or make the helpful option more visible.'},
 {id:'reset',emoji:'🔁',name:'The Reset-Ready Returner',axis:'restart',mode:'high',subtitle:'A gap is a detour, not a verdict.',text:'You described a relatively flexible relationship with interruptions. When life gets messy, you may be able to resume without waiting for a perfect Monday or treating one missed moment as the end of the plan.',experiment:'Choose a tiny “next opportunity” rule: after any gap, do the smallest useful version at the next available chance.'},
 {id:'steady',emoji:'🌦️',name:'The Steady-Weather Builder',axis:'demand',mode:'low',subtitle:'Your plan has room for real life.',text:'Your answers suggest that difficult days do not always knock habits completely off course. You may already have a useful ability to adjust expectations, protect essentials, or return without turning a rough day into a verdict.',experiment:'Name your “rainy-day version” of one habit — the version that counts when energy is low.'},
 {id:'curious',emoji:'🧪',name:'The Curious Experimenter',axis:null,subtitle:'You are still discovering what actually helps.',text:'Your answers are mixed rather than pointing strongly in one direction — which is a perfectly good result. Your next advantage is curiosity: notice what makes a habit easier, more enjoyable, or more likely to survive a busy week.',experiment:'Run one tiny experiment for seven days and ask only: “Did this make repeating the habit more likely?”'}
];
function profileFor(axes){
 const picks=PROFILES.filter(p=>p.axis).map(p=>{const a=axes.find(x=>x.id===p.axis);return {...p,strength:!a||a.mean===null?-Infinity:(p.mode==='low'?6-a.mean:a.mean)}}).filter(p=>p.strength>=3.35);
 return picks.sort((a,b)=>b.strength-a.strength)[0]||PROFILES.find(p=>p.id==='curious');
}
export function report(answers) {
  const axes=score(answers);
  const profile=profileFor(axes);
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
  return {version:DATA.version,profile,axes,suggestions,notes,context:DATA.contexts.map(q=>({id:q.id,question:q.text,answers:context(answers,q.id)})),answered:Array.from({length:48},(_,i)=>i+1).filter(i=>validAnswer(i,answers[i])).length};
}
