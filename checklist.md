# SOCCA V2 — Assignment-2 Coverage Checklist

| Task | Requirement | Prototype coverage |
|---|---|---|
| 1 | Requirement analysis | Dashboard + coverage and support domain |
| 2 | System architecture | Architecture page: portal, chatbot, multi-agent, DB, cloud, faculty, email, admin, KB |
| 3 | At least 6 AI agents | 8 agents: Intent, Entity, Retrieval, Decision, Ticket, Routing, Notification, Learning |
| 4 | NLP design | Assistant pipeline: preprocessing, intent, entities, semantic retrieval, RAG, confidence |
| 5 | Database + ER | Architecture page shows Students, Faculty, Departments, Tickets, Chat_History, Knowledge_Base, Notifications |
| 6 | AWS cloud | EC2, S3, RDS, Cognito, IAM, CloudWatch with production mapping note |
| 7 | 15 intents + 30 queries | Knowledge page: 15 intents × 2 sample queries |
| 8 | Chatbot flow | Ticket journey + assistant confidence/escalation path |
| 9 | UI prototype | Login role reference + Login, Dashboard, Chat, Tickets, Faculty, Admin, plus Agents/Knowledge/Architecture/Analytics/Ethics |
| 10 | Ethical AI | 7 dedicated cards: privacy, bias, transparency, security, oversight, responsible AI, consent |

## Important distinction
GitHub Pages hosts the frontend prototype. Production deployment would connect the UI to an API/backend, model service, RAG/semantic retrieval layer, database, authentication, notifications and monitoring.
