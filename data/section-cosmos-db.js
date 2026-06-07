AZ305.registerSection({
  id: "cosmos-db",
  title: "Cosmos DB",
  domain: "Data Storage Solutions",
  weight: "20–25%",
  icon: "🌌",
  order: 3,
  summary: "Cosmos DB questions test design choices for **API selection**, **consistency**, **partition keys**, **RU/s throughput**, and **global distribution**. The exam rewards choosing the weakest consistency and simplest scale model that still satisfies the scenario.",

  notes: [
    {
      heading: "Cosmos DB Overview & Exam Role",
      points: [
        "Azure Cosmos DB is a **fully managed, globally distributed, multi-model NoSQL database** with turnkey regional replication.",
        "It provides SLA-backed availability, throughput, consistency, and low-latency reads/writes for globally distributed applications.",
        "Cosmos DB is schema-agnostic and auto-indexed by default, making it a strong fit for JSON documents and rapidly evolving application data.",
        "Avoid choosing Cosmos DB when the dominant requirements are relational joins, stored procedures, SQL Server compatibility, or complex multi-row transactions."
      ],
      tip: "Cosmos DB is not the automatic answer for every global database. First decide whether the data model is NoSQL/document/key-value/graph or relational."
    },
    {
      heading: "API Selection: Choose the Correct Surface",
      table: {
        headers: ["API", "Best for", "Protocol / model"],
        rows: [
          ["NoSQL (Core)", "New cloud-native JSON apps and full Cosmos feature access", "Native SDK, SQL-like queries"],
          ["MongoDB", "Migrating existing MongoDB apps with minimal code changes", "MongoDB wire protocol"],
          ["Cassandra", "Migrating Apache Cassandra apps", "Cassandra Query Language"],
          ["Gremlin", "Graph data such as social networks, recommendations, fraud detection", "Apache TinkerPop Gremlin"],
          ["Table", "Migrating Azure Table Storage apps needing global distribution", "OData/REST, Azure Table SDK compatible"],
          ["PostgreSQL", "Distributed PostgreSQL with Citus-style scale", "PostgreSQL wire protocol"]
        ]
      },
      points: [
        "You **cannot change the API after account creation**, so API selection is an architecture-time decision.",
        "The **API for NoSQL** provides access to the richest set of Cosmos-native features, including change feed and advanced multi-region write behavior.",
        "Existing protocol compatibility usually beats a generic NoSQL answer on the exam."
      ],
      tip: "Existing MongoDB/Cassandra/Table app = matching API. New app with maximum Cosmos capabilities = API for NoSQL. Graph relationships = Gremlin."
    },
    {
      heading: "Consistency Levels (strongest to weakest)",
      table: {
        headers: ["Level", "Guarantee", "Use case"],
        rows: [
          ["Strong", "Linearizable reads; always latest committed write", "Financial transactions, inventory control, no stale reads"],
          ["Bounded Staleness", "Reads lag by at most K versions or T seconds", "Global reads where small controlled staleness is acceptable"],
          ["Session", "Read-your-own-writes within a session", "Default; shopping carts, user profiles, user-specific data"],
          ["Consistent Prefix", "Reads never see writes out of order", "Feeds and event streams where order matters more than immediacy"],
          ["Eventual", "No ordering guarantee; converges eventually", "Counters, likes, approximate aggregations"]
        ]
      },
      points: [
        "**Session** is the default consistency level and is the most common choice for user-centric applications.",
        "**Strong consistency** has the lowest read throughput and highest write latency in multi-region accounts, and it is not available with multi-region writes.",
        "Relaxed consistency levels such as Session, Consistent Prefix, and Eventual can provide much higher read throughput than Strong.",
        "Consistency is set at the account level and can be overridden per request within allowed bounds."
      ],
      tip: "Use the weakest level that satisfies the business requirement. Do not choose Strong just because it sounds safest."
    },
    {
      heading: "Throughput Models: Provisioned, Autoscale, Serverless",
      table: {
        headers: ["Model", "Billing", "Multi-region", "Choose when"],
        rows: [
          ["Provisioned manual", "Fixed RU/s billed hourly", "Yes", "Predictable, steady, high-throughput workloads"],
          ["Autoscale", "Set max RU/s; scales from 10% to 100%", "Yes", "Variable workloads with unpredictable spikes"],
          ["Serverless", "Pay per RU consumed per request", "No; single region", "Dev/test, prototypes, sporadic low traffic"]
        ]
      },
      points: [
        "Provisioned throughput can be set at the **database level** for shared throughput or the **container level** for dedicated throughput.",
        "The minimum provisioned throughput is commonly **400 RU/s** per container.",
        "Autoscale minimum max is **1,000 RU/s**, which can scale down to 100 RU/s when idle.",
        "A 1 KB point read is roughly 1 RU; writes and complex queries cost more based on item size, indexing, and query pattern."
      ],
      tip: "Sustained production traffic should not be serverless. Spiky but important workloads are autoscale; steady workloads are provisioned."
    },
    {
      heading: "Partitioning & Partition Key Design",
      table: {
        headers: ["Good partition keys", "Bad partition keys"],
        rows: [
          ["`userId`, `deviceId`, `customerId`", "`status` with only a few values"],
          ["`tenantId` for tenant-isolated SaaS when distribution is balanced", "Boolean fields"],
          ["Composite-style values such as tenant plus date for time-based spread", "Skewed values such as country if one country dominates"],
          ["Keys included in common queries", "Keys rarely used in filters, causing fan-out queries"]
        ]
      },
      points: [
        "A **logical partition** contains items with the same partition key value and has a maximum size of **20 GB**.",
        "A **physical partition** can provide up to **10,000 RU/s** and **50 GB** of storage; Cosmos DB splits physical partitions automatically.",
        "Good keys have high cardinality, distribute reads/writes evenly, and appear in common query filters.",
        "Cross-partition queries fan out to all partitions, cost more RUs, and are slower."
      ],
      tip: "Low-cardinality keys such as status or Boolean fields create hot partitions. High cardinality plus query alignment is the exam answer."
    },
    {
      heading: "Global Distribution & Multi-Region Writes",
      table: {
        headers: ["Capability", "Single-region writes", "Multi-region writes"],
        rows: [
          ["Write latency", "Lowest only near write region", "Low in all write regions"],
          ["Read latency", "Low in all replicated regions", "Low in all replicated regions"],
          ["Strong consistency", "Supported with constraints", "Not supported"],
          ["Conflict resolution", "Not needed", "Required; Last-Write-Wins or custom"],
          ["Cost", "Lower", "Higher"]
        ]
      },
      points: [
        "Regions can be added or removed without downtime, and all configured regions receive replicated data.",
        "Total provisioned RU cost multiplies by regions: provisioned RU/s per region times number of regions.",
        "**Service-managed failover** automatically promotes the next region in the failover priority list; manual failover supports DR drills.",
        "Multi-region writes require conflict resolution; Last-Write-Wins is the default, while custom resolution uses application logic."
      ],
      tip: "Global low write latency or active-active writes = multi-region writes, but remember it rules out Strong consistency and increases cost."
    },
    {
      heading: "Data Protection, Backup & Network Security",
      table: {
        headers: ["Feature", "Purpose", "Exam clue"],
        rows: [
          ["Encryption", "AES-256 at rest and TLS in transit", "Default; CMK via Key Vault/Managed HSM for key-control compliance"],
          ["Continuous backup", "Point-in-time restore within 7–30 days", "Self-service restore to a recent point"],
          ["Periodic backup", "Legacy full backups on an interval", "Custom interval/retention legacy backup pattern"],
          ["Private Endpoint", "Private IP access from a VNet", "No public access or private connectivity requirement"],
          ["Defender for Cosmos DB", "Threat detection and anomaly alerts", "Detect suspicious access or database attacks"]
        ]
      },
      points: [
        "Continuous backup is the default and supports restore to any point within the configured retention window up to 30 days.",
        "Periodic backup retains copies based on interval and retention settings and is considered the legacy mode.",
        "Cosmos DB also supports IP firewall rules, VNet service endpoints, and Private Endpoints."
      ],
      tip: "Point-in-time restore asks for continuous backup. Private IP/no public endpoint asks for Private Endpoint."
    },
    {
      heading: "Change Feed, TTL & Table Storage Comparison",
      table: {
        headers: ["Capability", "Use when", "Important limitation"],
        rows: [
          ["Change Feed", "Event-driven processing, real-time analytics, CDC, downstream sync", "Captures inserts and updates; deletes need soft-delete/TTL workaround"],
          ["TTL", "Automatically delete session, cache, or temporary event data", "Set in seconds at container or item level; `-1` means never expire"],
          ["Cosmos DB Table API", "Azure Table apps need global distribution, SLAs, stronger consistency", "Higher cost than Table Storage"],
          ["Azure Table Storage", "Simple, cheap key-value storage", "No global distribution, no dedicated throughput SLA, eventual consistency only"]
        ]
      },
      points: [
        "Change Feed can be consumed with Azure Functions triggers, Change Feed Processor SDK, or Azure Stream Analytics.",
        "TTL is the direct answer when data must expire automatically after a fixed time, such as 24 hours.",
        "Cosmos DB Table API is wire-compatible for Table workloads but adds global distribution and richer SLAs."
      ],
      tip: "React to data changes = Change Feed. Automatic expiry = TTL. Table Storage migration with global distribution = Cosmos DB Table API."
    },
    {
      heading: "Exam skills mapping",
      points: [
        "Storing semi-structured data: select the right Cosmos DB API for JSON documents, MongoDB, Cassandra, Gremlin graph, Table, or PostgreSQL compatibility.",
        "Consistency levels: compare **Strong**, **Bounded Staleness**, **Session**, **Consistent Prefix**, and **Eventual**, including throughput, latency, and multi-region write constraints.",
        "Partitioning and throughput: design partition keys to avoid hot partitions, estimate RU/s, and choose manual provisioned, autoscale, or serverless capacity.",
        "Global distribution, protection, and durability: use multiple regions, single vs multi-region writes, conflict resolution, continuous backup/PITR, encryption, Private Endpoints, and failover."
      ],
      tip: "Cosmos DB exam scenarios usually combine at least two axes: API plus consistency, or partition key plus throughput, or global distribution plus conflict/backup design."
    }
  ],

  flashcards: [
    { front: "What is Azure Cosmos DB?", back: "A fully managed, globally distributed, multi-model NoSQL database with turnkey replication, low-latency access, elastic throughput, and multiple APIs." },
    { front: "Which Cosmos API should a new JSON document app use?", back: "**API for NoSQL (Core)** because it provides the richest Cosmos-native feature set and best fit for new cloud-native document workloads." },
    { front: "Existing MongoDB app migration with minimal code changes", back: "Choose **Cosmos DB API for MongoDB** because it supports the MongoDB wire protocol." },
    { front: "Which API is for graph workloads?", back: "**Gremlin API** for graph relationships such as social networks, fraud detection, knowledge graphs, and recommendations." },
    { front: "Can you change the Cosmos DB API after account creation?", back: "No. The API is chosen at account creation and cannot be changed later, so exam questions often test API selection carefully." },
    { front: "What is the default Cosmos DB consistency level?", back: "**Session** consistency. It provides read-your-own-writes within a session and is the common default for user-specific data." },
    { front: "Strong consistency exam trade-off", back: "Always reads the latest committed write, but has lower read throughput, higher write latency in multi-region accounts, and is not available with multi-region writes." },
    { front: "Bounded Staleness vs Session", back: "Bounded Staleness limits lag by versions or time. Session guarantees read-your-own-writes within a client session and fits most user-centric apps." },
    { front: "Consistent Prefix vs Eventual", back: "Consistent Prefix preserves write order but may be stale. Eventual has no ordering guarantee and simply converges over time." },
    { front: "Provisioned vs autoscale throughput", back: "Provisioned manual = fixed RU/s for steady workloads. Autoscale = set max RU/s and scale 10%–100% automatically for unpredictable spikes." },
    { front: "When should you choose serverless Cosmos DB?", back: "Small apps, prototypes, dev/test, or sporadic low-traffic workloads. It is single-region and pay-per-RU consumed, not for sustained global production throughput." },
    { front: "What affects RU cost?", back: "Item size, item complexity, indexing policy, and query pattern. A 1 KB point read is roughly 1 RU; writes and cross-partition queries cost more." },
    { front: "Good Cosmos partition key characteristics", back: "High cardinality, even distribution of reads/writes, and present in common queries to avoid expensive cross-partition fan-out." },
    { front: "Logical partition and physical partition limits", back: "A logical partition is all items with one partition key value and can grow to 20 GB. A physical partition provides up to 10,000 RU/s and 50 GB." },
    { front: "Single-region writes vs multi-region writes", back: "Single-region writes are cheaper and can support Strong consistency. Multi-region writes give low write latency everywhere but require conflict resolution and do not support Strong consistency." },
    { front: "Cosmos DB conflict resolution options", back: "Last-Write-Wins is the default; custom conflict resolution uses application-defined logic and conflicts feed processing." },
    { front: "Change Feed limitation", back: "It captures inserts and updates, not physical deletes. Use soft delete with TTL when delete events need downstream processing." },
    { front: "TTL in Cosmos DB", back: "Time to Live automatically deletes items after a number of seconds. Configure it at container level or per item; `-1` means the item never expires." },
    { front: "When do you choose Cosmos DB API for Cassandra?", back: "For existing Apache Cassandra workloads that need CQL compatibility and minimal application changes while moving to Azure Cosmos DB." },
    { front: "What does Bounded Staleness guarantee?", back: "Reads can lag behind writes by at most a configured number of versions (`K`) or time interval (`T`), giving controlled staleness for global apps." },
    { front: "Autoscale minimum max RU/s from the guide", back: "Autoscale has a minimum maximum setting of **1,000 RU/s** and can scale down to about 10% of max, such as 100 RU/s when idle." },
    { front: "Cosmos DB continuous backup retention", back: "Continuous backup supports self-service point-in-time restore within a configurable retention window up to **30 days** in the source guide." },
    { front: "Cosmos DB high availability SLA clues", back: "The guide highlights **99.999%** availability with multi-region writes and **99.99%** with single-region writes plus a secondary, with zone redundancy available per region." },
    { front: "What is Last-Write-Wins conflict resolution?", back: "The default multi-region write conflict policy that resolves conflicts by timestamp or a configured property; custom resolution is used when business-specific merge logic is required." },
    { front: "Maximum item size in Cosmos DB from the guide", back: "The key limits table lists a maximum item size of **2 MB**, useful for eliminating designs that store very large objects directly in Cosmos DB." }
  ],

  questions: [
    {
      id: "cos-q1", type: "single",
      question: "A team is building a new cloud-native JSON document application and wants the richest Cosmos DB feature support, including change feed and multi-region capabilities. Which API should they choose?",
      options: ["API for NoSQL", "API for MongoDB", "API for Cassandra", "API for Table"],
      correct: [0],
      explanation: "The API for NoSQL is the native Cosmos DB API and is the default choice for new cloud-native JSON document workloads. It exposes the broadest Cosmos-specific feature set. MongoDB, Cassandra, and Table APIs are mainly for protocol compatibility or migration scenarios.",
      tip: "New app plus maximum Cosmos features = API for NoSQL. Existing protocol app = matching compatibility API."
    },
    {
      id: "cos-q2", type: "single",
      question: "An existing MongoDB application must move to Azure with minimal code changes and continue using MongoDB drivers. Which Cosmos DB API should you select?",
      options: ["API for NoSQL", "API for MongoDB", "API for Gremlin", "API for PostgreSQL"],
      correct: [1],
      explanation: "Cosmos DB API for MongoDB supports the MongoDB wire protocol, allowing existing MongoDB applications and drivers to migrate with fewer code changes. API for NoSQL would require rewriting data access to Cosmos-native SDKs and query patterns.",
      tip: "When the question says existing MongoDB with minimal changes, do not pick the generic NoSQL answer."
    },
    {
      id: "cos-q3", type: "single",
      question: "A fraud detection system models relationships between accounts, devices, addresses, and transactions. Queries traverse connections to find suspicious patterns. Which API fits best?",
      options: ["API for Table", "API for Gremlin", "API for Cassandra", "API for NoSQL"],
      correct: [1],
      explanation: "Graph traversal and relationship-heavy use cases map to the Gremlin API, which uses the Apache TinkerPop graph model. Table and Cassandra APIs are not designed for graph traversal, and API for NoSQL is a document model rather than a graph API.",
      tip: "Social network, recommendation, fraud ring, or graph traversal = Gremlin."
    },
    {
      id: "cos-q4", type: "single",
      question: "A shopping cart application must guarantee that each user immediately reads their own writes, but global strong ordering is not required. Which consistency level is the best fit?",
      options: ["Strong", "Bounded Staleness", "Session", "Eventual"],
      correct: [2],
      explanation: "Session consistency guarantees read-your-own-writes within a client session and is the default choice for user-specific data such as shopping carts and profiles. Strong would provide more than needed at higher latency/cost. Eventual does not guarantee read-your-own-writes.",
      tip: "User-specific state plus read-your-own-writes almost always means Session."
    },
    {
      id: "cos-q5", type: "single",
      question: "A financial ledger requires every read to return the latest committed write. The account uses a single write region. Which consistency level should you choose?",
      options: ["Strong", "Consistent Prefix", "Session", "Eventual"],
      correct: [0],
      explanation: "Strong consistency provides linearizable reads that always see the latest committed write, which is appropriate for financial ledgers and strict inventory control. The weaker levels can return stale data or lack global latest-write guarantees.",
      tip: "No stale reads or latest committed write is the exact Strong consistency clue."
    },
    {
      id: "cos-q6", type: "single",
      question: "A global feed must never show events out of order, but it can show slightly stale data. Which consistency level matches this requirement?",
      options: ["Eventual", "Consistent Prefix", "Strong", "Session"],
      correct: [1],
      explanation: "Consistent Prefix guarantees that reads never observe writes out of order, while still allowing staleness. Eventual consistency can show values without ordering guarantees. Strong is more restrictive than needed.",
      tip: "Order matters but freshness does not = Consistent Prefix."
    },
    {
      id: "cos-q7", type: "single",
      question: "A social media likes counter can tolerate approximate, temporarily stale values and needs the highest read throughput at the lowest latency. Which consistency level should you choose?",
      options: ["Strong", "Bounded Staleness", "Session", "Eventual"],
      correct: [3],
      explanation: "Eventual consistency provides the weakest guarantees but the highest read throughput and lowest latency, making it suitable for non-critical aggregates such as likes counters. Strong or Bounded Staleness would provide unnecessary guarantees at higher cost.",
      tip: "Approximate counters, likes, and non-critical aggregates usually map to Eventual."
    },
    {
      id: "cos-q8", type: "single",
      question: "A production workload has steady predictable traffic at high volume. The team wants reserved RU/s capacity and global distribution. Which throughput model is best?",
      options: ["Provisioned manual throughput", "Autoscale throughput", "Serverless", "Storage account queue throughput"],
      correct: [0],
      explanation: "Manual provisioned throughput is appropriate for steady predictable RU/s demand and supports multi-region accounts. Autoscale is better for unpredictable spikes, and serverless is single-region and intended for sporadic low-traffic workloads.",
      tip: "Steady high traffic = provisioned RU/s. Unpredictable spikes = autoscale. Sporadic low use = serverless."
    },
    {
      id: "cos-q9", type: "single",
      question: "A new application has unpredictable traffic spikes throughout the day. The team wants Cosmos DB to scale RU/s automatically without manual changes. Which throughput model should they choose?",
      options: ["Manual provisioned throughput", "Autoscale throughput", "Serverless", "Strong consistency"],
      correct: [1],
      explanation: "Autoscale throughput lets you set a maximum RU/s and automatically scales between 10% and 100% of that value based on demand. It is designed for variable workloads with spikes. Serverless is better for small sporadic workloads and does not support global distribution.",
      tip: "Spiky production traffic with hands-off scaling = autoscale."
    },
    {
      id: "cos-q10", type: "single",
      question: "A prototype has very low, sporadic traffic and must minimize cost. It will run in one Azure region only. Which Cosmos DB capacity mode is best?",
      options: ["Serverless", "Autoscale with 100,000 max RU/s", "Manual provisioned 10,000 RU/s", "Multi-region writes"],
      correct: [0],
      explanation: "Serverless bills per RU consumed and is best for prototypes, dev/test, and sporadic low-traffic workloads. It is single-region, which matches the requirement. Provisioned and autoscale reserve capacity and are better for production workloads.",
      tip: "Prototype, sporadic, single region, cost-sensitive = serverless."
    },
    {
      id: "cos-q11", type: "single",
      question: "A container receives writes for millions of devices. You need a partition key that spreads load evenly and is included in most device queries. Which key is best?",
      options: ["status", "isActive", "deviceId", "country"],
      correct: [2],
      explanation: "`deviceId` has high cardinality, spreads writes across many logical partitions, and aligns with common per-device queries. `status` and `isActive` have few values and create hot partitions. `country` may be skewed if most devices are in one country.",
      tip: "Good partition keys are high-cardinality and query-aligned; low-cardinality flags are traps."
    },
    {
      id: "cos-q12", type: "single",
      question: "A query frequently filters by `tenantId`, but the container is partitioned by `status`. What is the likely result?",
      options: ["The query is always free", "The query fans out across partitions and costs more RUs", "The query becomes strongly consistent automatically", "The logical partition size limit is removed"],
      correct: [1],
      explanation: "Queries that do not include the partition key must fan out across physical partitions, which increases RU cost and latency. Partition key choice should align with common query filters. Consistency and partition size limits are not changed by the query filter.",
      tip: "If common queries omit the partition key, expect cross-partition fan-out and higher RU cost."
    },
    {
      id: "cos-q13", type: "single",
      question: "A globally distributed app requires low write latency for users in every region and can tolerate conflict resolution. Which write configuration should you use?",
      options: ["Single-region writes", "Multi-region writes", "Serverless account", "Strong consistency"],
      correct: [1],
      explanation: "Multi-region writes allow applications to write locally in multiple regions, reducing write latency for global users. They require conflict resolution and do not support Strong consistency. Single-region writes keep writes centralized, which increases write latency for distant users.",
      tip: "Global low write latency = multi-region writes; remember the conflict and no-Strong-consistency trade-off."
    },
    {
      id: "cos-q14", type: "single",
      question: "A Cosmos DB account uses multi-region writes. Which consistency level should you eliminate immediately?",
      options: ["Strong", "Session", "Consistent Prefix", "Eventual"],
      correct: [0],
      explanation: "Strong consistency is not available for multi-region write accounts. Session, Consistent Prefix, and Eventual are relaxed consistency levels that can be used with multi-region write designs depending on application requirements.",
      tip: "Multi-region writes and Strong consistency are mutually incompatible in exam scenarios."
    },
    {
      id: "cos-q15", type: "single",
      question: "An application must react to inserts and updates in a container by triggering downstream processing in Azure Functions. Which Cosmos DB feature should you use?",
      options: ["Change Feed", "TTL", "Bounded Staleness", "Last-Write-Wins"],
      correct: [0],
      explanation: "Change Feed is an ordered append-only stream of inserts and updates that can be consumed by Azure Functions triggers, the Change Feed Processor SDK, or Stream Analytics. TTL deletes items after a period, and consistency/conflict settings do not trigger downstream processing.",
      tip: "React to data changes or CDC from Cosmos DB = Change Feed."
    },
    {
      id: "cos-q16", type: "single",
      question: "Session documents must be deleted automatically 24 hours after creation without a scheduled cleanup job. What should you configure?",
      options: ["Time to Live set to 86400 seconds", "Change Feed", "Continuous backup", "Manual failover"],
      correct: [0],
      explanation: "TTL automatically deletes items after the configured number of seconds. For 24 hours, set TTL to 86,400 seconds at the container or item level. Change Feed reacts to changes but does not automatically expire data.",
      tip: "Automatic expiry after a time interval = TTL. Convert days to seconds when needed."
    },
    {
      id: "cos-q17", type: "single",
      question: "An Azure Table Storage application needs global distribution, low-latency SLAs, and stronger consistency options while preserving the Table data model. What should you choose?",
      options: ["Azure Table Storage with RA-GRS", "Cosmos DB API for Table", "Cosmos DB API for Gremlin", "Azure SQL Database"],
      correct: [1],
      explanation: "Cosmos DB API for Table is compatible with Azure Table SDK/data model but adds global distribution, throughput and latency SLAs, and multiple consistency choices. Azure Table Storage remains cheaper but lacks those Cosmos capabilities.",
      tip: "Existing Table Storage plus global distribution or SLAs = Cosmos DB Table API."
    },
    {
      id: "cos-q18", type: "multi",
      question: "Which statements about Cosmos DB APIs are TRUE? (Select all that apply.)",
      options: [
        "The API is chosen at account creation and cannot be changed later",
        "The MongoDB API is for existing MongoDB apps that need wire protocol compatibility",
        "The Gremlin API is for graph traversal workloads",
        "The Table API is the best choice for new JSON document apps needing all Cosmos-native features"
      ],
      correct: [0, 1, 2],
      explanation: "Cosmos DB API selection is fixed at account creation; MongoDB supports MongoDB-compatible migrations; Gremlin supports graph workloads. New JSON document apps needing all Cosmos-native features should generally use API for NoSQL, not Table API.",
      tip: "Match protocol or data model precisely. Table is for Table compatibility; NoSQL is for new document apps."
    },
    {
      id: "cos-q19", type: "multi",
      question: "Which partition key characteristics are desirable? (Select all that apply.)",
      options: [
        "High cardinality",
        "Even distribution of reads and writes",
        "Included in most common queries",
        "Only a few possible values so data is grouped tightly"
      ],
      correct: [0, 1, 2],
      explanation: "A good partition key has many unique values, distributes workload evenly, and appears in common query filters. A key with only a few possible values creates large hot logical partitions and uneven RU consumption.",
      tip: "High cardinality good; low cardinality bad. Add query alignment for the complete answer."
    },
    {
      id: "cos-q20", type: "multi",
      question: "Which statements about throughput models are TRUE? (Select all that apply.)",
      options: [
        "Autoscale scales from 10% to 100% of the configured maximum RU/s",
        "Serverless is best for globally distributed, sustained high-throughput production workloads",
        "Manual provisioned throughput fits predictable steady workloads",
        "Serverless bills per RU consumed and is best for sporadic low-traffic workloads"
      ],
      correct: [0, 2, 3],
      explanation: "Autoscale varies between 10% and 100% of the max RU/s, manual provisioned throughput fits steady workloads, and serverless bills per request for sporadic low-traffic use. Serverless is single-region and not appropriate for sustained global production throughput.",
      tip: "Serverless is a cost tool for low sporadic use, not a universal production scaling answer."
    },
    {
      id: "cos-q21", type: "multi",
      question: "Which features help with global availability and disaster recovery in Cosmos DB? (Select all that apply.)",
      options: [
        "Add multiple regions to the account",
        "Enable service-managed failover with a priority list",
        "Use multi-region writes when low write latency is required in multiple regions",
        "Choose a low-cardinality partition key such as `status`"
      ],
      correct: [0, 1, 2],
      explanation: "Multiple regions replicate data globally, service-managed failover automates regional promotion, and multi-region writes can improve global write availability and latency. A low-cardinality partition key hurts scale and does not provide DR.",
      tip: "Global availability features are regional replication/failover/write topology, not partition-key shortcuts."
    },
    {
      id: "cos-q22", type: "multi",
      question: "Which Cosmos DB features map to the listed operational requirements? (Select all that apply.)",
      options: [
        "Continuous backup for point-in-time restore within the configured retention window",
        "Private Endpoint for private IP access from a VNet",
        "Defender for Cosmos DB for threat detection and anomaly alerts",
        "Eventual consistency to guarantee latest committed reads"
      ],
      correct: [0, 1, 2],
      explanation: "Continuous backup supports point-in-time restore, Private Endpoint provides private network access, and Defender adds threat detection. Eventual consistency does not guarantee latest committed reads; Strong consistency does.",
      tip: "Be strict with wording: latest committed reads is Strong, not Eventual."
    },
    {
      id: "cos-q23", type: "single",
      question: "An Apache Cassandra application must migrate to Azure with minimal changes and continue using CQL-based access patterns. Which Cosmos DB API should you choose?",
      options: ["API for NoSQL", "API for Cassandra", "API for Table", "API for Gremlin"],
      correct: [1],
      explanation: "Cosmos DB API for Cassandra supports Cassandra Query Language and is designed for Cassandra-compatible migrations. API for NoSQL would require a more significant rewrite to Cosmos-native document APIs. Table and Gremlin target different data models.",
      tip: "Existing Cassandra plus CQL is the direct clue for API for Cassandra."
    },
    {
      id: "cos-q24", type: "single",
      question: "A distributed application needs PostgreSQL wire-protocol compatibility but wants Cosmos-style distributed scale for analytical and transactional workloads. Which API is most aligned?",
      options: ["API for PostgreSQL", "API for Gremlin", "API for Table", "API for MongoDB"],
      correct: [0],
      explanation: "The Cosmos DB API for PostgreSQL targets distributed PostgreSQL workloads using the PostgreSQL wire protocol. Gremlin is for graph traversal, Table is for Table Storage compatibility, and MongoDB is for MongoDB protocol compatibility.",
      tip: "Protocol compatibility words usually name the API. PostgreSQL wire protocol maps to API for PostgreSQL."
    },
    {
      id: "cos-q25", type: "single",
      question: "A global application can tolerate stale reads, but reads must be no more than five versions or 30 seconds behind writes. Which consistency level should you use?",
      options: ["Strong", "Bounded Staleness", "Session", "Eventual"],
      correct: [1],
      explanation: "Bounded Staleness is defined by a maximum lag in versions or time, often expressed as K versions or T seconds. It gives a predictable staleness bound without the full latency and throughput cost of Strong consistency. Eventual provides no such bound.",
      tip: "If the question gives a maximum staleness window, choose Bounded Staleness."
    },
    {
      id: "cos-q26", type: "single",
      question: "A Cosmos DB account is configured with Strong consistency by default. A read request wants weaker Eventual consistency to reduce latency. Based on the study guide rule, what should you conclude?",
      options: ["The request can relax below the account default", "The request cannot relax below the account default", "The account automatically switches to multi-region writes", "The query becomes cross-partition"],
      correct: [1],
      explanation: "The guide states that consistency is set at the account level and that a request can tighten consistency but cannot relax below the account default. Therefore a request cannot simply downgrade Strong to Eventual. Multi-region writes and partitioning are separate concerns.",
      tip: "For exam purposes, treat the account default as the floor in the direction described by the guide: do not assume per-request relaxation is allowed."
    },
    {
      id: "cos-q27", type: "multi",
      question: "A Cosmos DB container is experiencing hot partitions and high RU throttling. Which changes could help? (Select all that apply.)",
      options: [
        "Choose a higher-cardinality partition key aligned to common queries",
        "Avoid Boolean or low-cardinality partition keys such as `status`",
        "Use autoscale if spikes are unpredictable and the partition design is otherwise sound",
        "Force all tenant writes into one logical partition to simplify queries"
      ],
      correct: [0, 1, 2],
      explanation: "High-cardinality query-aligned keys distribute workload, avoiding low-cardinality keys reduces hot partitions, and autoscale can help with unpredictable RU spikes. Forcing all writes into one logical partition makes the hot partition problem worse and can hit logical partition limits.",
      tip: "Throughput scaling cannot fully fix a bad partition key; solve distribution first, then size RU/s."
    },
    {
      id: "cos-q28", type: "multi",
      question: "Which choices correctly support global distribution, protection, and durability in Cosmos DB? (Select all that apply.)",
      options: [
        "Use service-managed failover with a region priority list for automatic regional failover",
        "Use Last-Write-Wins or custom conflict resolution for multi-region write conflicts",
        "Use continuous backup for point-in-time restore within the retention window",
        "Use Strong consistency with multi-region writes for active-active global writes"
      ],
      correct: [0, 1, 2],
      explanation: "Service-managed failover, conflict resolution, and continuous backup are all Cosmos DB global availability/protection features. Strong consistency is not available with multi-region writes, so it is not a valid active-active write design choice.",
      tip: "Active-active writes require conflict resolution and eliminate Strong consistency from the answer set."
    }
  ]
});
