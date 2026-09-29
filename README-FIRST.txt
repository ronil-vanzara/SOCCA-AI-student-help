SOCCA V2 — Assignment-2 Prototype

What this package contains
- website/index.html — responsive single-page UI with required screens
- website/style.css — visual system and responsive styles
- website/script.js — demo interactions, intent catalog, ticket/faculty/admin workflows
- checklist.md — assignment task-to-prototype mapping

Accurate implementation boundary
This is a frontend prototype for Assignment-2. It demonstrates the requested portal screens, multi-agent workflow, 15 intents, 30 sample queries, ticket escalation, faculty/admin flow, database design, AWS mapping and ethical-AI controls.
It does NOT claim a live AWS backend, live LLM API, live RAG/vector database, real email service, or real database connection.

GitHub Pages
1. Upload index.html, style.css and script.js directly to the repository root.
2. Settings → Pages → Deploy from a branch → main → /(root) → Save.
3. Open the generated GitHub Pages URL.

Demo flow for viva
1. Dashboard
2. AI Assistant → ask “When will Semester 7 examinations begin?”
3. Observe intent, confidence and route
4. Ask an unknown question → show escalation/ticket workflow
5. My Tickets → open a ticket
6. Faculty Portal → Respond → suggest KB update
7. Admin Console → Approve a KB candidate
8. AI Agent Network → explain the 8 agents
9. Architecture → explain AWS production mapping + database
10. Ethical AI → cover privacy, bias, transparency, security, oversight, responsible AI and consent
