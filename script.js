const state = {
  theme: localStorage.getItem('socca-theme') || 'dark',
  activePage: 'dashboard',
  ticketFilter: 'all',
  ticketSearch: '',
  intentSearch: '',
};

const intents = [
  {name:'Admissions', keywords:['admission','admissions','apply for admission','application'], q1:'How can I apply for admission?', q2:'What documents are needed for admission?', response:'The Admissions Agent provides the current application steps and required documents from verified institutional guidance.', conf:'96%', entities:'course, intake, documents'},
  {name:'Examination', keywords:['exam','examination','semester exam','exam timetable'], q1:'When will Semester 7 examinations begin?', q2:'Where can I find the exam timetable?', response:'The Examination Agent retrieves the official examination schedule and timetable from the knowledge base.', conf:'97%', entities:'semester, date, exam'},
  {name:'Fees', keywords:['fee','fees','payment','tuition','semester fee'], q1:'What is the fee payment procedure?', q2:'When is the semester fee deadline?', response:'The Fees Agent provides the verified payment method, deadline and related instructions.', conf:'95%', entities:'semester, fee type, deadline'},
  {name:'Placement', keywords:['placement','placements','company','campus drive','recruitment'], q1:'How do I register for placements?', q2:'Which companies are visiting campus?', response:'The Placement Agent returns verified placement registration steps and published company information.', conf:'90%', entities:'placement, company, drive'},
  {name:'Library', keywords:['library','book','books','renew'], q1:'How can I renew a library book?', q2:'What are the library timings?', response:'The Library Agent retrieves borrowing, renewal and library-hour information.', conf:'93%', entities:'book, date, timing'},
  {name:'Hostel', keywords:['hostel','accommodation','room'], q1:'How can I apply for hostel accommodation?', q2:'What is the hostel fee?', response:'The Hostel Agent provides application steps, availability guidance and published fee information.', conf:'88%', entities:'hostel, room, fee'},
  {name:'Scholarship', keywords:['scholarship','financial aid','stipend'], q1:'What documents are required for scholarship?', q2:'How do I check my scholarship status?', response:'The Scholarship Agent explains verified document requirements and status-check procedures.', conf:'91%', entities:'scheme, status, documents'},
  {name:'Academic Office', keywords:['academic office','academic request','academic procedure'], q1:'Where do I submit an academic request?', q2:'Who handles academic procedure questions?', response:'The Academic Office Agent routes academic procedure requests to the appropriate office.', conf:'89%', entities:'department, request type'},
  {name:'Certificates', keywords:['certificate','certificates','transcript'], q1:'How can I apply for a certificate?', q2:'What is the process for a transcript request?', response:'The Certificates Agent provides the verified request process, documents and office route.', conf:'94%', entities:'certificate, transcript, documents'},
  {name:'Timetable', keywords:['timetable','class schedule','class timetable','schedule changed'], q1:'Where can I view my class timetable?', q2:'Has the timetable changed this week?', response:'The Timetable Agent retrieves the latest published class schedule.', conf:'92%', entities:'semester, division, date'},
  {name:'Attendance', keywords:['attendance','attendance requirement','absent'], q1:'How can I check my attendance?', q2:'What is the attendance requirement?', response:'The Attendance Agent explains where to view attendance and the applicable published requirement.', conf:'90%', entities:'semester, percentage'},
  {name:'Results', keywords:['result','results','marksheet','marks'], q1:'When will semester results be published?', q2:'Where can I download my marksheet?', response:'The Results Agent provides the published result-release and marksheet-access procedure.', conf:'93%', entities:'semester, exam, result'},
  {name:'ID Card', keywords:['id card','identity card','duplicate id','student id'], q1:'How do I get a duplicate ID card?', q2:'My ID card has an error; how can I correct it?', response:'The ID Card Agent guides replacement or correction requests and the relevant office.', conf:'87%', entities:'student ID, issue type'},
  {name:'Bonafide', keywords:['bonafide','bonafide certificate'], q1:'How can I apply for a bonafide certificate?', q2:'How long does a bonafide request take?', response:'The Student Services Agent explains the bonafide request process and expected handling steps.', conf:'95%', entities:'certificate, student ID'},
  {name:'General Student Services', keywords:['student support','student services','general query','contact support'], q1:'How do I contact student support?', q2:'Where can I raise a general college query?', response:'The Student Services Agent provides the correct support route; low-confidence questions are escalated.', conf:'86%', entities:'department, issue type'}
];

const agents = [
  ['01','Intent Recognition Agent','Identifies what the student is asking and selects the most relevant intent.','Core NLP'],
  ['02','Entity Extraction Agent','Extracts semester, dates, departments, documents and other useful entities.','Core NLP'],
  ['03','Knowledge Retrieval Agent','Searches verified institutional content for grounded responses.','RAG'],
  ['04','Decision Agent','Checks confidence and decides whether to answer or escalate.','Orchestration'],
  ['05','Ticket Management Agent','Generates and tracks Ticket IDs for unanswered queries.','Support'],
  ['06','Faculty Routing Agent','Maps tickets to the appropriate faculty or department.','Support'],
  ['07','Email Notification Agent','Triggers student/faculty notification workflows in production.','Integration'],
  ['08','Learning Agent','Prepares verified faculty replies for knowledge-base updates after admin approval.','Human Oversight']
];

const tickets = [
  {id:'#SOC-1024', subject:'Scholarship document issue', dept:'Student Services', priority:'High', updated:'18 min ago', status:'open', statusLabel:'Open', detail:'Scholarship document verification is pending faculty review.'},
  {id:'#SOC-1021', subject:'Exam form correction', dept:'Examination Cell', priority:'Medium', updated:'Yesterday', status:'review', statusLabel:'Faculty Review', detail:'Faculty response is being prepared for the correction request.'},
  {id:'#SOC-1017', subject:'Library renewal', dept:'Library', priority:'Low', updated:'Sep 27', status:'resolved', statusLabel:'Resolved', detail:'Renewal procedure was provided from the verified knowledge base.'},
  {id:'#SOC-1015', subject:'Hostel application', dept:'Hostel Office', priority:'Medium', updated:'Sep 26', status:'review', statusLabel:'Faculty Review', detail:'Availability and application timing need confirmation.'},
  {id:'#SOC-1012', subject:'Bonafide certificate', dept:'Student Services', priority:'Low', updated:'Sep 25', status:'resolved', statusLabel:'Resolved', detail:'Request process was explained successfully.'}
];

const approvals = [
  ['#KB-501','Scholarship document checklist','Faculty: Student Services','Awaiting admin approval'],
  ['#KB-498','Exam form correction steps','Faculty: Examination Cell','Awaiting admin approval'],
  ['#KB-493','Hostel application documents','Faculty: Hostel Office','Awaiting admin approval'],
  ['#KB-489','Duplicate ID card process','Faculty: Student Services','Awaiting admin approval'],
  ['#KB-482','Library renewal procedure','Faculty: Library','Awaiting admin approval']
];

const ethics = [
  ['▣','Data Privacy','Store only necessary student data; protect chat history and ticket information with controlled access and secure storage.','Minimize collection'],
  ['◌','AI Bias','Test intent classification and responses across different wording styles; track systematic errors and review them.','Monitor error patterns'],
  ['◈','Transparency','Show users that responses are generated from verified knowledge and surface confidence/escalation status.','Explain the workflow'],
  ['⌁','Security','Use role-based access, least-privilege permissions, secure authentication and audit logging.','IAM + application controls'],
  ['◎','Human Oversight','Keep faculty/admin approval in the escalation and knowledge-update loop.','Human approval required'],
  ['✓','Responsible AI','Prefer grounded institutional content and avoid unsupported claims when the knowledge base has no answer.','Do not invent answers'],
  ['◉','User Consent','Tell students what data is stored and why; provide clear consent and privacy messaging in production.','Consent + notice']
];

const demoAnswers = {
  exam:{intent:'Examination', conf:'97%', entities:'semester 7, examination date', route:'Examination Agent', response:'I found a matching examination topic. In production, the Examination Agent would retrieve the official schedule from verified institutional documents. This prototype demonstrates the routing and confidence decision.'},
  fee:{intent:'Fees', conf:'95%', entities:'fee, semester', route:'Fees Agent', response:'The Fees Agent matches this query and would retrieve the official payment procedure and deadline from the institutional knowledge base.'},
  bonafide:{intent:'Bonafide', conf:'95%', entities:'bonafide certificate', route:'Student Services Agent', response:'The Student Services Agent matches this request and would show the verified bonafide application steps and required documents.'},
  unknown:{intent:'General Student Services', conf:'62%', entities:'issue type not confidently detected', route:'Decision → Ticket → Faculty Routing', response:'I cannot confidently answer this from the demo knowledge base. The designed workflow creates a Ticket ID, stores the query, routes it to the relevant faculty/department, sends notifications, and updates the knowledge base only after admin approval.'}
};

function $(s){return document.querySelector(s)}
function $all(s){return [...document.querySelectorAll(s)]}
function showToast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(showToast.t);showToast.t=setTimeout(()=>t.classList.remove('show'),2200)}
function escapeHtml(s){return s.replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]))}

function go(page){
  state.activePage=page;
  $all('.page').forEach(p=>p.classList.remove('active'));
  const target=$(`#page-${page}`); if(target) target.classList.add('active');
  $all('.nav-item').forEach(n=>n.classList.toggle('active',n.dataset.page===page));
  window.scrollTo({top:0,behavior:'smooth'});
  if(window.innerWidth<850) $('#sidebar').classList.remove('open');
}

function renderCoverage(){
  $('#coverageGrid').innerHTML=intents.map((x,i)=>`<div class="coverage-item"><span>${String(i+1).padStart(2,'0')} • ${escapeHtml(x.name)}</span><b>2 sample queries</b><small>Confidence ${x.conf}</small></div>`).join('');
}
function renderSuggestions(){
  const picks=[intents[1],intents[2],intents[8],intents[0],intents[6],intents[13]];
  $('#suggestionGrid').innerHTML=picks.map(x=>`<button class="suggestion-card" data-question="${escapeHtml(x.q1)}"><span>${escapeHtml(x.name)}</span><b>${escapeHtml(x.q1)}</b><small>${x.conf} demo confidence</small></button>`).join('');
}
function renderTickets(){
  const filtered=tickets.filter(t=>{
    const f=state.ticketFilter==='all'||t.status===state.ticketFilter;
    const q=state.ticketSearch.toLowerCase();
    return f && (!q || `${t.id} ${t.subject} ${t.dept}`.toLowerCase().includes(q));
  });
  $('#ticketBody').innerHTML=filtered.map(t=>`<tr><td><b>${t.id}</b></td><td><b>${escapeHtml(t.subject)}</b><small>${escapeHtml(t.detail)}</small></td><td>${escapeHtml(t.dept)}</td><td><span class="priority ${t.priority.toLowerCase()}">${t.priority}</span></td><td>${t.updated}</td><td><span class="status ${t.status==='resolved'?'success':t.status==='review'?'info':'warning'}">${t.statusLabel}</span></td><td><button class="row-action" data-ticket="${t.id}">View</button></td></tr>`).join('') || `<tr><td colspan="7">No tickets found.</td></tr>`;
}
function renderFaculty(){
  const rows=tickets.filter(t=>t.status!=='resolved').slice(0,4);
  $('#facultyBody').innerHTML=rows.map(t=>`<tr><td><b>${t.id}</b></td><td>${escapeHtml(t.subject)}<small>${escapeHtml(t.detail)}</small></td><td>${escapeHtml(t.dept)}</td><td><span class="priority ${t.priority.toLowerCase()}">${t.priority}</span></td><td><button class="row-action" data-faculty="${t.id}">Respond</button></td></tr>`).join('');
}
function renderApprovals(){
  $('#approvalList').innerHTML=approvals.map(a=>`<div class="approval-item"><div><b>${a[0]} • ${escapeHtml(a[1])}</b><small>${escapeHtml(a[2])} • ${escapeHtml(a[3])}</small></div><div class="approval-actions"><button class="mini-btn" data-approve="${a[0]}">Approve</button><button class="mini-btn" data-reject="${a[0]}">Reject</button></div></div>`).join('');
}
function renderAgents(){
  $('#agentGrid').innerHTML=agents.map(a=>`<article class="agent-card"><span class="agent-num">${a[0]}</span><h3>${escapeHtml(a[1])}</h3><p>${escapeHtml(a[2])}</p><footer><span>${escapeHtml(a[3])}</span><b>● Active</b></footer></article>`).join('');
}
function renderIntents(){
  const q=state.intentSearch.toLowerCase();
  const rows=intents.filter(x=>`${x.name} ${x.q1} ${x.q2} ${x.entities}`.toLowerCase().includes(q));
  $('#intentBody').innerHTML=rows.map((x,i)=>`<tr><td><b>${String(intents.indexOf(x)+1).padStart(2,'0')}. ${escapeHtml(x.name)}</b></td><td>${escapeHtml(x.q1)}<br><small>${escapeHtml(x.q2)}</small></td><td>${escapeHtml(x.response)}</td><td><span class="status success">${x.conf}</span></td><td>${escapeHtml(x.entities)}</td></tr>`).join('');
}
function renderEthics(){
  $('#ethicsGrid').innerHTML=ethics.map(x=>`<article class="ethic-card"><div class="ethic-icon">${x[0]}</div><h3>${x[1]}</h3><p>${x[2]}</p><div class="control"><span>${x[3]}</span><span class="switch"></span></div></article>`).join('');
}
function renderCharts(){
  const vals=[92,120,108,156,182,204,218],days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  $('#queryChart').innerHTML=vals.map((v,i)=>`<div class="bar" style="height:${Math.round(v/218*100)}%"><span>${v}</span><small>${days[i]}</small></div>`).join('');
  const loads=[['Intent Recognition',86],['Retrieval',78],['Ticket Management',64],['Faculty Routing',55],['Notifications',42],['Learning',29]];
  $('#workload').innerHTML=loads.map(x=>`<div class="load-row"><label>${x[0]}</label><div class="load-track"><span style="width:${x[1]}%"></span></div><b>${x[1]}%</b></div>`).join('');
}

function classify(q){
  const s=q.toLowerCase();
  const matching=intents.find(x=>x.keywords.some(k=>s.includes(k)));
  if(matching) return {intent:matching.name,conf:matching.conf,entities:matching.entities,route:`${matching.name} Agent`,response:matching.response};
  return demoAnswers.unknown;
}
function addBubble(text,type,meta=''){
  const box=$('#messages');
  const d=document.createElement('div');d.className=`bubble ${type}`;d.innerHTML=escapeHtml(text).replace(/\n/g,'<br>')+(meta?`<div class="meta">${meta}</div>`:'');box.appendChild(d);box.scrollTop=box.scrollHeight;
}
function runPipeline(result){
  const steps=$all('.pipe-step');
  steps.forEach((x,i)=>{x.classList.remove('active');setTimeout(()=>x.classList.add('active'),i*85)});
  $('#resultBox').innerHTML=`<span class="eyebrow">LAST ANALYSIS</span><h3>${escapeHtml(result.intent)} • ${result.conf} confidence</h3><div class="result-grid"><div class="result-item"><span>ROUTE</span><b>${escapeHtml(result.route)}</b></div><div class="result-item"><span>ENTITIES</span><b>${escapeHtml(result.entities)}</b></div><div class="result-item"><span>DECISION</span><b>${result.conf==='62%'?'Create ticket':'Return answer'}</b></div><div class="result-item"><span>KNOWLEDGE</span><b>${result.conf==='62%'?'No confident match':'Verified demo source'}</b></div></div>`;
}
function sendMessage(text){
  const q=text.trim(); if(!q)return;
  addBubble(q,'user','Student query');
  $('#chatInput').value='';
  addBubble('Processing the request…','ai','Text preprocessing → intent → entities → retrieval → confidence');
  setTimeout(()=>{
    $all('.bubble.ai').at(-1)?.remove();
    const result=classify(q);
    addBubble(result.response,'ai',`Intent: ${result.intent} • Confidence: ${result.conf} • ${result.conf==='62%'?'Escalation path':'Knowledge retrieval path'}`);
    runPipeline(result);
    if(result.conf==='62%') showToast('Demo escalation: ticket workflow is ready.');
  },650);
}

function modalTicket(){
  $('#modalPanel').innerHTML=`<button class="modal-close" data-close-modal>✕</button><h2>Create support ticket</h2><p>Prototype form matching the assignment escalation path.</p><div class="modal-form"><label>Subject<input id="mSub" value="General student query"></label><label>Department<select id="mDept"><option>Student Services</option><option>Examination Cell</option><option>Fees</option><option>Placement</option><option>Library</option><option>Hostel</option></select></label><label>Priority<select id="mPr"><option>Medium</option><option>High</option><option>Low</option></select></label><label>Query<textarea id="mQuery" rows="4">Please describe the issue.</textarea></label></div><div class="modal-actions"><button class="btn secondary" data-close-modal>Cancel</button><button class="btn primary" id="createTicket">Create Ticket</button></div>`;
  openModal();
}
function openModal(){ $('#modal').classList.remove('hidden'); $('#modal').setAttribute('aria-hidden','false') }
function closeModal(){ $('#modal').classList.add('hidden'); $('#modal').setAttribute('aria-hidden','true') }
function ticketDetails(id){
  const t=tickets.find(x=>x.id===id); if(!t)return;
  $('#modalPanel').innerHTML=`<button class="modal-close" data-close-modal>✕</button><span class="eyebrow">TICKET DETAIL</span><h2>${t.id} • ${escapeHtml(t.subject)}</h2><p>${escapeHtml(t.detail)}</p><div class="result-grid"><div class="result-item"><span>DEPARTMENT</span><b>${escapeHtml(t.dept)}</b></div><div class="result-item"><span>PRIORITY</span><b>${escapeHtml(t.priority)}</b></div><div class="result-item"><span>STATUS</span><b>${escapeHtml(t.statusLabel)}</b></div><div class="result-item"><span>LAST UPDATED</span><b>${t.updated}</b></div></div><div class="policy-card"><div class="policy-rule"><b>Escalation trace</b><span class="status ${t.status==='resolved'?'success':'warning'}">${t.status==='resolved'?'Completed':'Active'}</span></div><p>Student query → Ticket ID → Department routing → Faculty response → Student notification → Knowledge-base approval.</p></div>`;
  openModal();
}
function facultyReply(id){
  const t=tickets.find(x=>x.id===id); if(!t)return;
  $('#modalPanel').innerHTML=`<button class="modal-close" data-close-modal>✕</button><span class="eyebrow">FACULTY RESPONSE</span><h2>${id} • ${escapeHtml(t.subject)}</h2><p>Write a verified institutional response. In production this becomes a knowledge-base candidate after admin approval.</p><div class="modal-form"><label>Faculty response<textarea id="replyText" rows="5">Your verified response to the student goes here.</textarea></label></div><div class="modal-actions"><button class="btn secondary" data-close-modal>Cancel</button><button class="btn primary" id="sendReply">Send reply + suggest KB update</button></div>`; openModal();
}

function bind(){
  $all('.nav-item').forEach(x=>x.addEventListener('click',()=>go(x.dataset.page)));
  $all('[data-go]').forEach(x=>x.addEventListener('click',()=>go(x.dataset.go)));
  $all('#roleSelect button').forEach(b=>b.addEventListener('click',()=>{ $all('#roleSelect button').forEach(x=>x.classList.remove('active'));b.classList.add('active');$('#demoLogin').textContent=`Continue as ${b.dataset.role} ↗`; }));
  $('#demoLogin').addEventListener('click',()=>{showToast('Demo sign-in successful');go('dashboard')});
  $('#mobileMenu').addEventListener('click',()=>$('#sidebar').classList.toggle('open'));
  $('#darkToggle').addEventListener('click',()=>{document.body.classList.toggle('light');localStorage.setItem('socca-theme',document.body.classList.contains('light')?'light':'dark');showToast('Theme updated');});
  $('#notifyBtn').addEventListener('click',()=>showToast('3 demo notifications: faculty reply, KB approval, ticket update.'));
  $('#newTicketBtn').addEventListener('click',modalTicket);
  $('#ticketSearch').addEventListener('input',e=>{state.ticketSearch=e.target.value;renderTickets()});
  $all('#ticketTabs button').forEach(b=>b.addEventListener('click',()=>{ $all('#ticketTabs button').forEach(x=>x.classList.remove('active')); b.classList.add('active'); state.ticketFilter=b.dataset.filter;renderTickets(); }));
  $('#ticketBody').addEventListener('click',e=>{const b=e.target.closest('[data-ticket]');if(b)ticketDetails(b.dataset.ticket)});
  $('#facultyBody').addEventListener('click',e=>{const b=e.target.closest('[data-faculty]');if(b)facultyReply(b.dataset.faculty)});
  $('#approvalList').addEventListener('click',e=>{const ap=e.target.closest('[data-approve]');const rj=e.target.closest('[data-reject]');if(ap){showToast(`${ap.dataset.approve} approved and queued for publication.`);ap.closest('.approval-item').remove()} if(rj){showToast(`${rj.dataset.reject} rejected for revision.`);rj.closest('.approval-item').remove()}});
  $('#chatInput').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMessage($('#chatInput').value)}});
  $('#sendChat').addEventListener('click',()=>sendMessage($('#chatInput').value));
  $('#clearChat').addEventListener('click',()=>{ $('#messages').innerHTML=''; addBubble('Hi Ronil! 👋 Ask about examinations, fees, admissions, placements, library, hostel, scholarship, certificates or other student services.','ai','SOCCA Assistant • Demo'); });
  $('#suggestionGrid').addEventListener('click',e=>{const b=e.target.closest('[data-question]');if(b){go('assistant');$('#chatInput').value=b.dataset.question;sendMessage(b.dataset.question)}});
  $('#suggestions').innerHTML='';
  $('#intentSearch').addEventListener('input',e=>{state.intentSearch=e.target.value;renderIntents()});
  $('#kbInfoBtn').addEventListener('click',()=>{ $('#modalPanel').innerHTML=`<button class="modal-close" data-close-modal>✕</button><h2>RAG in this prototype</h2><p><b>Production design:</b> student query → preprocessing → intent/entity extraction → semantic search → retrieve verified institutional documents → augment response → confidence decision.</p><p><b>Prototype boundary:</b> this static site demonstrates the workflow with mapped demo content. It does not claim a live vector database, model API, or AWS backend connection.</p>`;openModal();});
  document.addEventListener('click',e=>{ if(e.target.closest('[data-close-modal]'))closeModal(); const q=e.target.closest('[data-question]'); if(q && q.closest('#suggestions')){sendMessage(q.dataset.question)} const a=e.target.closest('#createTicket'); if(a){const id='#SOC-'+(1025+Math.floor(Math.random()*50));showToast(`Ticket ${id} created successfully (demo)`);closeModal();} const sr=e.target.closest('#sendReply'); if(sr){showToast('Faculty reply sent; KB update suggested for admin approval.');closeModal();}});
  $('#globalSearch').addEventListener('keydown',e=>{if(e.key==='Enter'){const q=e.target.value.trim();if(!q)return;const hit=intents.find(x=>x.name.toLowerCase().includes(q.toLowerCase())||x.q1.toLowerCase().includes(q.toLowerCase())); if(hit){go('knowledge');$('#intentSearch').value=q;state.intentSearch=q;renderIntents();}else{showToast('No direct match; try “exam”, “fees” or “certificate”.')}}});
}

function init(){
  document.body.classList.toggle('light',state.theme==='light');
  renderCoverage();renderSuggestions();renderTickets();renderFaculty();renderApprovals();renderAgents();renderIntents();renderEthics();renderCharts();
  $('#messages').innerHTML='';addBubble('Hi Ronil! 👋 I am SOCCA, your student help desk prototype. Ask me about exams, fees, certificates, admissions, placements, library, hostel, scholarship and more.','ai','SOCCA Assistant • Demo knowledge base');
  $('#suggestions').innerHTML=[intents[1],intents[2],intents[13]].map(x=>`<button data-question="${escapeHtml(x.q1)}">${escapeHtml(x.q1)}</button>`).join('');
  bind();
}
init();
