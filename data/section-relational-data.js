AZ305.registerSection({
  id: "relational-data",
  title: "Relational Data (SQL)",
  domain: "Data Storage Solutions",
  weight: "20–25%",
  icon: "🗄️",
  order: 2,
  summary: "Relational data questions test whether you can choose the right **SQL deployment option**, **purchasing model**, **service tier**, and **HA/DR pattern** based on compatibility, scale, management overhead, and recovery requirements.",

  notes: [
    {
      heading: "SQL Deployment Options: Choose the Right Service",
      table: {
        headers: ["Service", "Management model", "Best for"],
        rows: [
          ["Azure SQL Database", "Fully managed PaaS single database or elastic pool", "New cloud-native apps, SaaS apps, variable workloads, minimal administration"],
          ["Azure SQL Managed Instance", "PaaS with near SQL Server compatibility", "Lift-and-shift from on-premises SQL Server with SQL Agent, linked servers, CLR, cross-database queries"],
          ["SQL Server on Azure VM", "IaaS with OS and SQL instance control", "OS access, unsupported features, exact SQL versions, third-party agents"],
          ["Azure Database for PostgreSQL", "Managed PostgreSQL Flexible Server", "Open-source PostgreSQL workloads, Entra auth, read replicas"],
          ["Azure Database for MySQL", "Managed MySQL Flexible Server", "WordPress, Magento, LAMP stack, MySQL-dependent apps"]
        ]
      },
      points: [
        "Choose **PaaS** unless the scenario explicitly requires OS-level access or unsupported SQL Server features.",
        "Choose **SQL Managed Instance** for minimal-change SQL Server migrations with instance-level features.",
        "Choose **SQL Server on Azure VM** only when the required control cannot be satisfied by SQL Database or Managed Instance."
      ],
      tip: "SQL Agent, linked servers, CLR, or cross-database queries usually push SQL Database out and point to Managed Instance. OS access pushes to SQL on VM."
    },
    {
      heading: "DTU vs vCore Purchasing Models",
      table: {
        headers: ["Criteria", "DTU", "vCore"],
        rows: [
          ["Resource visibility", "Bundled CPU, memory, reads, writes", "Separate compute and storage control"],
          ["Hybrid Benefit", "No", "Yes; reuse SQL Server licenses"],
          ["Serverless compute", "No", "Yes"],
          ["Best for", "Legacy/simple sizing", "New deployments and transparent capacity planning"],
          ["Exam bias", "Simple/legacy scenarios", "Recommended default"]
        ]
      },
      points: [
        "**DTU** is simpler but opaque: Basic, Standard, and Premium bundle resources in fixed ratios.",
        "**vCore** lets architects size compute, storage, and hardware generation more explicitly and unlocks Azure Hybrid Benefit.",
        "Rule of thumb: 100 Standard DTUs roughly maps to 1 General Purpose vCore; 125 Premium DTUs roughly maps to 1 Business Critical vCore."
      ],
      tip: "If existing SQL Server licenses or serverless are mentioned, DTU is wrong — choose vCore."
    },
    {
      heading: "Azure SQL Database Service Tiers",
      table: {
        headers: ["Tier", "Architecture", "Read scale-out", "Choose when"],
        rows: [
          ["General Purpose", "Remote storage with log-based HA", "No", "Most business workloads, balanced price/performance"],
          ["Business Critical", "Always On AG with local SSD and multiple replicas", "Yes; one readable secondary", "High IOPS, low latency, in-memory OLTP, critical OLTP"],
          ["Hyperscale", "Distributed storage with page servers and log service", "Yes; up to 30 replicas", "Very large databases, fast backup/restore, rapid storage growth"]
        ]
      },
      points: [
        "**Business Critical** is the performance/low-latency tier and includes a readable HA replica for read scale-out.",
        "**Hyperscale** supports databases up to 100 TB and snapshot-based backup/restore in minutes rather than hours.",
        "**General Purpose** is the cost-effective default when ultra-low latency and read scale-out are not required."
      ],
      tip: "Large database or fast restore = Hyperscale. Highest IOPS or in-memory OLTP = Business Critical. Ordinary line-of-business = General Purpose."
    },
    {
      heading: "Scalability Patterns: Elastic Pools, Serverless & Read Scale-Out",
      table: {
        headers: ["Feature", "Choose when", "Avoid when"],
        rows: [
          ["Elastic Pool", "Many databases with variable, non-overlapping usage", "All databases are busy at the same time"],
          ["Serverless compute", "Intermittent or dev workloads with idle periods", "Sustained high utilization or strict cold-start avoidance"],
          ["Read scale-out", "Reporting queries should avoid the primary", "Writes dominate or tier lacks readable replicas"],
          ["Hyperscale named replicas", "Many read replicas or huge database read workloads", "Small databases where GP/BC is sufficient"]
        ]
      },
      points: [
        "**Elastic pools** share eDTU or vCore capacity across databases — a classic SaaS tenancy pattern.",
        "**Read scale-out** uses `ApplicationIntent=ReadOnly` so reads go to a replica in Business Critical or Hyperscale.",
        "**Serverless** auto-pauses after inactivity and bills compute per second, but the next connection has resume latency."
      ],
      tip: "Many small SaaS databases with spiky usage = elastic pool. One intermittent database that can pause = serverless."
    },
    {
      heading: "Azure SQL Managed Instance",
      table: {
        headers: ["Feature", "SQL Database", "SQL Managed Instance"],
        rows: [
          ["SQL Agent", "No", "Yes"],
          ["Cross-database queries", "Limited", "Yes"],
          ["Linked servers", "No", "Yes"],
          ["CLR / Service Broker", "No", "Yes"],
          ["VNet deployment", "Optional via Private Endpoint", "Required; dedicated subnet"],
          ["Migration fit", "Re-architect or simple DB migration", "Near-zero code changes for instance-dependent apps"]
        ]
      },
      points: [
        "SQL MI has **General Purpose** and **Business Critical** tiers; Business Critical uses local SSD and supports the highest IOPS and built-in read replicas.",
        "An **instance pool** pre-provisions compute for multiple small managed instances to reduce provisioning time and improve cost efficiency.",
        "Managed Instance requires a dedicated subnet in a VNet; a /27 minimum is a common planning fact."
      ],
      tip: "If the app depends on instance-level SQL Server features but you still want PaaS management, Managed Instance is the AZ-305 answer."
    },
    {
      heading: "PostgreSQL and MySQL Flexible Server",
      table: {
        headers: ["Service", "Key features", "Choose when"],
        rows: [
          ["Azure Database for PostgreSQL Flexible Server", "Burstable/GP/Memory Optimized, zone HA, up to 5 read replicas, pgBouncer, Entra auth", "PostgreSQL apps, passwordless auth, open-source workloads"],
          ["Azure Database for MySQL Flexible Server", "Zone or same-zone HA, up to 5 read replicas, ProxySQL connection pooling", "WordPress, Magento, LAMP stack, MySQL apps"],
          ["Single Server", "Legacy/retired path", "Avoid for new deployments"]
        ]
      },
      points: [
        "For new open-source relational workloads, **Flexible Server** is the modern deployment option.",
        "PostgreSQL PITR retention is 7–35 days; MySQL PITR retention is 1–35 days.",
        "Read replicas can offload read traffic and support cross-region read patterns."
      ],
      tip: "Do not force every relational question into Azure SQL. PostgreSQL or MySQL wording usually maps to the matching Flexible Server service."
    },
    {
      heading: "Data Protection & Security Features",
      table: {
        headers: ["Feature", "Protects", "Choose when"],
        rows: [
          ["Transparent Data Encryption", "Data files, logs, backups at rest", "Default encryption; use CMK when key control is required"],
          ["Dynamic Data Masking", "Query result presentation", "Support/dev users should see masked values"],
          ["Always Encrypted", "Sensitive columns from DB engine and DBAs", "DBAs must not read plaintext data"],
          ["Row-Level Security", "Rows visible to each user", "Multi-tenant SaaS or per-customer row isolation"],
          ["Microsoft Defender for SQL", "Threat detection and vulnerability assessment", "Detect SQL injection, anomalous access, misconfigurations"]
        ]
      },
      points: [
        "TDE is enabled by default on Azure SQL services and encrypts at rest; it does not hide data from queries or DBAs.",
        "Always Encrypted is client-side encryption, so the database engine never sees plaintext sensitive values.",
        "Dynamic Data Masking is not encryption; privileged users can still see unmasked data."
      ],
      tip: "Masking hides display; encryption protects stored/processed data. If DBAs must not see plaintext, pick Always Encrypted, not DDM."
    },
    {
      heading: "High Availability, Backups & Disaster Recovery",
      table: {
        headers: ["Feature", "Scope", "Use when"],
        rows: [
          ["Built-in HA", "Within a region", "Default protection against node/storage failures"],
          ["Active Geo-Replication", "SQL Database only, up to 4 readable secondaries", "Custom failover logic or multiple read replicas"],
          ["Auto-Failover Groups", "SQL Database or SQL MI, primary plus secondary", "Automatic/manual failover with stable read-write and read-only listeners"],
          ["Point-in-Time Restore", "Restore within backup retention", "Accidental deletion/corruption recovery"],
          ["Long-Term Retention", "Backups in Blob Storage up to 10 years", "Regulatory retention such as 7-year archive"]
        ]
      },
      points: [
        "General Purpose uses remote storage and log-based HA; typical RTO is around 20–30 seconds.",
        "Business Critical uses Always On availability groups with synchronous replicas and typical RTO around 5–10 seconds.",
        "Hyperscale separates compute from storage; compute failover is around 60 seconds and backup/restore is snapshot-based.",
        "PITR retention is 7 days for Basic and up to 35 days for Standard, Premium, and vCore tiers."
      ],
      tip: "Stable listener endpoint after regional failover = Auto-Failover Group. Multiple readable secondaries and manual control = Active Geo-Replication."
    },
    {
      heading: "Exam skills mapping",
      points: [
        "Recommend a solution for storing relational data: choose **Azure SQL Database**, **SQL Managed Instance**, **SQL Server on Azure VM**, **Azure Database for PostgreSQL**, or **Azure Database for MySQL** based on engine and compatibility needs.",
        "Recommend a database service tier and compute tier: compare **DTU vs vCore**, **General Purpose vs Business Critical vs Hyperscale**, and **serverless vs provisioned** compute.",
        "Recommend a solution for database scalability: use elastic pools, read replicas/read scale-out, Hyperscale, sharding, and autoscale/serverless patterns when appropriate.",
        "Recommend a solution for data protection: use TDE, Always Encrypted, backups/PITR, LTR, auditing, Defender for SQL, and failover groups for the right protection goal.",
        "HA for relational data: select zone-redundant configurations, Business Critical replicas, Hyperscale architecture, read replicas, and auto-failover groups to meet availability and failover needs."
      ],
      tip: "Relational questions usually pivot on three clues: engine compatibility, scale/tier requirements, and whether the scenario needs local HA or regional DR."
    }
  ],

  flashcards: [
    { front: "Azure SQL Database vs SQL Managed Instance", back: "SQL Database = fully managed single database/elastic pool for new apps. SQL MI = PaaS with near SQL Server compatibility for lift-and-shift apps needing SQL Agent, linked servers, CLR, or cross-database queries." },
    { front: "When do you choose SQL Server on Azure VM?", back: "Only when you need OS-level access, exact SQL Server versions, unsupported features, or third-party agents that PaaS cannot support." },
    { front: "DTU vs vCore — one-line rule", back: "DTU is bundled and simpler/legacy. vCore is transparent, recommended for new deployments, supports serverless, and enables Azure Hybrid Benefit." },
    { front: "Which purchasing model supports Azure Hybrid Benefit?", back: "**vCore**. It lets you apply existing SQL Server licenses and can reduce cost significantly." },
    { front: "General Purpose vs Business Critical", back: "General Purpose = balanced price/performance with remote storage and log-based HA. Business Critical = local SSD, Always On replicas, low latency, high IOPS, and built-in read scale-out." },
    { front: "When should you choose Hyperscale?", back: "Very large databases up to 100 TB, rapid storage growth, fast snapshot backup/restore, and many read replicas for scale-out." },
    { front: "Elastic Pool exam clue", back: "Many databases with variable, non-overlapping usage — especially SaaS tenants. Avoid if all databases are heavily used at the same time." },
    { front: "SQL Serverless compute exam clue", back: "Intermittent or dev/test workload with idle periods where auto-pause and per-second billing save cost; accept resume cold-start delay." },
    { front: "How do reads use SQL read scale-out?", back: "Use `ApplicationIntent=ReadOnly` in the connection string so read-only queries route to a readable secondary in Business Critical or Hyperscale." },
    { front: "Managed Instance VNet fact", back: "SQL Managed Instance is always deployed into a dedicated subnet in a VNet; /27 minimum subnet sizing is a common planning detail." },
    { front: "PostgreSQL/MySQL new deployment default", back: "Use **Flexible Server**. Single Server is legacy/retired and should be avoided for new workloads." },
    { front: "TDE vs Always Encrypted", back: "TDE encrypts database files/logs/backups at rest and is transparent. Always Encrypted is client-side column encryption that prevents DBAs and the engine from seeing plaintext." },
    { front: "Dynamic Data Masking vs Row-Level Security", back: "DDM masks sensitive column values in query results for non-privileged users. RLS filters rows using predicates, ideal for multi-tenant row isolation." },
    { front: "Active Geo-Replication vs Auto-Failover Group", back: "Active Geo-Replication = SQL Database only, up to 4 readable secondaries, manual/custom failover. Auto-Failover Group = stable listener endpoints and automatic/manual failover for SQL Database or SQL MI." },
    { front: "What is Long-Term Retention used for?", back: "Regulatory backup retention with weekly/monthly/yearly copies stored in Azure Blob Storage up to 10 years." },
    { front: "Business Critical HA architecture", back: "Always On availability group with multiple synchronous replicas, local SSD storage, low latency, and a readable secondary for read scale-out." },
    { front: "What does Defender for SQL provide?", back: "Threat detection for anomalous activity such as SQL injection and unusual access patterns, plus vulnerability assessment for misconfigurations." },
    { front: "PITR vs LTR", back: "PITR restores to a recent point within 7–35 days. LTR keeps regulatory backup copies for months or years, up to 10 years." },
    { front: "What is database sharding?", back: "Sharding splits data across multiple databases or partitions, often by tenant or key, so write/read load scales beyond one database. It increases application complexity." },
    { front: "SQL auditing vs Defender for SQL", back: "Auditing records database events for investigation/compliance. Defender for SQL detects threats, anomalous activity, SQL injection attempts, and misconfigurations." },
    { front: "Zone-redundant HA in relational services", back: "Zone redundancy places standby/replica capacity across availability zones to survive datacenter failure in one region. It is a local HA feature, not regional DR." },
    { front: "Provisioned vs serverless compute", back: "Provisioned = fixed compute for steady production workloads. Serverless = auto-scale/auto-pause for intermittent workloads with meaningful idle periods and acceptable resume delay." },
    { front: "When do PostgreSQL read replicas matter?", back: "Use read replicas to offload read-heavy workloads, reporting, or regional reads from the primary PostgreSQL Flexible Server; source guide limit is up to 5 replicas." },
    { front: "When is sharding a better scalability answer than read replicas?", back: "Read replicas scale reads only. Sharding distributes writes and storage across databases, useful when one write primary cannot handle tenant/key volume." },
    { front: "What does zone-redundant HA not solve?", back: "It does not provide cross-region disaster recovery. Use geo-replication or auto-failover groups for regional outage protection." }
  ],

  questions: [
    {
      id: "sql-q1", type: "single",
      question: "A team is building a new cloud-native SaaS application. Each tenant gets a small SQL database, and usage varies throughout the day. Which design is most appropriate?",
      options: ["SQL Server on Azure VMs for each tenant", "Azure SQL Database single databases in an elastic pool", "Azure SQL Managed Instance per tenant", "Azure Database for MySQL Single Server"],
      correct: [1],
      explanation: "Azure SQL Database is the preferred PaaS option for new cloud-native SQL apps. Elastic pools are ideal when many databases have variable and non-overlapping usage, letting tenants share capacity. SQL VMs and MI add unnecessary management and cost for this scenario.",
      tip: "Many small SaaS databases plus variable load is the elastic pool pattern."
    },
    {
      id: "sql-q2", type: "single",
      question: "An on-premises SQL Server application uses SQL Agent jobs, linked servers, CLR, and cross-database queries. The company wants a managed PaaS migration with minimal code changes. Which service should you choose?",
      options: ["Azure SQL Database", "Azure SQL Managed Instance", "SQL Server on Azure VM", "Azure Database for PostgreSQL Flexible Server"],
      correct: [1],
      explanation: "SQL Managed Instance provides near SQL Server compatibility and supports instance-level features such as SQL Agent, linked servers, CLR, and cross-database queries. SQL Database lacks many of these features. SQL Server on VM would work but loses much of the PaaS management benefit.",
      tip: "Instance-level SQL Server features plus PaaS equals Managed Instance."
    },
    {
      id: "sql-q3", type: "single",
      question: "A database migration requires installing OS-level agents and using an exact older SQL Server build that PaaS does not support. Which deployment option is required?",
      options: ["Azure SQL Database", "Azure SQL Managed Instance", "SQL Server on Azure VM", "Azure SQL Database Hyperscale"],
      correct: [2],
      explanation: "SQL Server on Azure VM is the IaaS option that provides OS-level access and full control over SQL Server version, patches, and agents. PaaS services intentionally remove OS control. Hyperscale changes the service tier, not the control model.",
      tip: "OS access or exact SQL build is the bright-line rule for SQL Server on VM."
    },
    {
      id: "sql-q4", type: "single",
      question: "A new Azure SQL deployment should use existing SQL Server licenses to reduce cost and allow separate sizing of compute and storage. Which purchasing model should be selected?",
      options: ["DTU Basic", "DTU Premium", "vCore", "Elastic Query"],
      correct: [2],
      explanation: "The vCore model exposes compute and storage sizing and supports Azure Hybrid Benefit for existing SQL Server licenses. DTU bundles resources and does not support license portability. Elastic Query is a feature, not a purchasing model.",
      tip: "Hybrid Benefit is always a vCore clue."
    },
    {
      id: "sql-q5", type: "single",
      question: "A SQL workload needs the lowest latency and highest IOPS PaaS tier, with in-memory OLTP and a built-in readable replica for reporting. Which tier fits?",
      options: ["General Purpose", "Business Critical", "Serverless General Purpose", "Basic DTU"],
      correct: [1],
      explanation: "Business Critical uses local SSD and Always On availability groups, giving high IOPS, low latency, in-memory OLTP support, and a readable secondary. General Purpose uses remote storage and does not provide the same latency or read scale-out capability.",
      tip: "Highest IOPS, in-memory OLTP, and readable HA replica all point to Business Critical."
    },
    {
      id: "sql-q6", type: "single",
      question: "A database is expected to grow beyond 50 TB and requires fast snapshot-based backup and restore. Which Azure SQL Database tier should you choose?",
      options: ["General Purpose", "Business Critical", "Hyperscale", "Basic"],
      correct: [2],
      explanation: "Hyperscale supports very large databases up to 100 TB and uses a distributed storage architecture with near-instant backup and fast restore. General Purpose and Business Critical have much lower maximum database sizes in typical Azure SQL Database scenarios.",
      tip: "Huge database or fast restore is a Hyperscale keyword pair."
    },
    {
      id: "sql-q7", type: "single",
      question: "A development database is used only during business hours and can tolerate a short resume delay after idle periods. Which compute option minimizes cost?",
      options: ["DTU Premium", "vCore serverless", "Business Critical provisioned", "SQL Managed Instance Business Critical"],
      correct: [1],
      explanation: "The vCore serverless compute tier auto-scales, auto-pauses after inactivity, and bills compute per second while active. It is designed for intermittent workloads with idle periods. Provisioned or Business Critical tiers bill for fixed compute regardless of usage.",
      tip: "Idle periods plus acceptable cold start = serverless. Sustained production usage = provisioned."
    },
    {
      id: "sql-q8", type: "single",
      question: "A reporting workload should run read-only queries without affecting the primary OLTP workload. The database is in Business Critical. What should the application use?",
      options: ["ApplicationIntent=ReadOnly", "Dynamic Data Masking", "Point-in-time restore", "SQL Agent"],
      correct: [0],
      explanation: "Business Critical maintains a readable secondary replica. Adding `ApplicationIntent=ReadOnly` to the connection string routes read-only queries to that replica for read scale-out. The other options do not route reporting traffic.",
      tip: "Read scale-out questions often hide the answer in the connection string setting."
    },
    {
      id: "sql-q9", type: "single",
      question: "A support team must see masked credit card numbers in query results, but the stored data should remain unchanged. Which feature should you use?",
      options: ["Transparent Data Encryption", "Dynamic Data Masking", "Always Encrypted", "Long-Term Retention"],
      correct: [1],
      explanation: "Dynamic Data Masking obfuscates sensitive values in query results for non-privileged users without changing stored data. TDE encrypts at rest, Always Encrypted protects data from the server/DBA, and LTR is for backups.",
      tip: "Masked query output for some users = DDM. Do not confuse it with encryption."
    },
    {
      id: "sql-q10", type: "single",
      question: "A compliance requirement states that database administrators must not be able to read plaintext values in sensitive columns. Which feature meets the requirement?",
      options: ["Dynamic Data Masking", "Always Encrypted", "Transparent Data Encryption", "Microsoft Defender for SQL"],
      correct: [1],
      explanation: "Always Encrypted performs client-side encryption so sensitive column values are never plaintext inside the database engine and cannot be read by DBAs. TDE protects files at rest but the engine can still read the data. DDM only masks query display for non-privileged users.",
      tip: "DBA must not see plaintext is the strongest clue for Always Encrypted."
    },
    {
      id: "sql-q11", type: "single",
      question: "A multi-tenant SaaS database stores rows for many customers in shared tables. Each customer should see only their own rows. Which feature should enforce this in the database?",
      options: ["Row-Level Security", "Dynamic Data Masking", "Long-Term Retention", "Read scale-out"],
      correct: [0],
      explanation: "Row-Level Security uses predicate functions and security policies to filter rows by user or tenant context. Dynamic Data Masking hides column values but does not restrict which rows are returned. Backup and read scale-out features do not enforce tenant isolation.",
      tip: "Tenant row isolation = Row-Level Security. Column hiding = Dynamic Data Masking."
    },
    {
      id: "sql-q12", type: "single",
      question: "An application requires transparent regional failover with the same read-write listener endpoint and no connection string changes. Which DR feature should you configure?",
      options: ["Active Geo-Replication only", "Auto-Failover Group", "Point-In-Time Restore", "Long-Term Retention"],
      correct: [1],
      explanation: "Auto-Failover Groups provide stable listener endpoints and automatic or manual failover for Azure SQL Database and SQL Managed Instance. Active Geo-Replication creates readable secondaries but failover is manual and does not provide the same listener abstraction by itself.",
      tip: "Same endpoint after failover = Auto-Failover Group."
    },
    {
      id: "sql-q13", type: "single",
      question: "A SQL Database needs four readable secondary databases in different regions and the team wants custom failover logic. Which feature is the best fit?",
      options: ["Active Geo-Replication", "Auto-Failover Group", "vCore serverless", "SQL Managed Instance link feature"],
      correct: [0],
      explanation: "Active Geo-Replication supports up to four readable secondary replicas for Azure SQL Database and manual/custom failover workflows. Auto-Failover Groups focus on one secondary region and listener-based transparent failover. Serverless is a compute tier, not a DR feature.",
      tip: "Up to four readable secondaries and custom/manual failover = Active Geo-Replication."
    },
    {
      id: "sql-q14", type: "single",
      question: "A database must retain weekly and yearly backup copies for seven years for regulatory compliance. Which capability should you configure?",
      options: ["Point-In-Time Restore", "Long-Term Retention", "Dynamic Data Masking", "Read scale-out"],
      correct: [1],
      explanation: "Long-Term Retention stores backup copies for extended periods, up to 10 years, and supports weekly, monthly, or yearly retention policies. PITR is for short-term recovery within the normal backup retention window, typically up to 35 days.",
      tip: "Years of backup retention = LTR, not PITR."
    },
    {
      id: "sql-q15", type: "single",
      question: "A WordPress application uses MySQL and the team wants a managed Azure database with zone-redundant HA and read replicas. Which service should you choose?",
      options: ["Azure SQL Database", "Azure Database for MySQL Flexible Server", "Azure SQL Managed Instance", "Azure Table Storage"],
      correct: [1],
      explanation: "WordPress and LAMP-stack workloads commonly use MySQL, and Azure Database for MySQL Flexible Server provides managed MySQL with HA and read replicas. Azure SQL Database and Managed Instance are SQL Server-compatible services, not MySQL engines.",
      tip: "Respect the database engine in the question. MySQL wording maps to MySQL Flexible Server."
    },
    {
      id: "sql-q16", type: "multi",
      question: "Which requirements point to Azure SQL Managed Instance rather than Azure SQL Database? (Select all that apply.)",
      options: ["SQL Agent jobs", "Linked servers", "Cross-database queries with minimal code changes", "A single new cloud-native database with no instance dependencies"],
      correct: [0, 1, 2],
      explanation: "SQL Managed Instance supports SQL Agent, linked servers, and cross-database scenarios that Azure SQL Database either lacks or supports only in limited patterns. A new cloud-native database without instance dependencies is a SQL Database fit.",
      tip: "For multi-select, mark the instance-level compatibility features; leave out simple new-app scenarios."
    },
    {
      id: "sql-q17", type: "multi",
      question: "Which statements about the vCore model are TRUE? (Select all that apply.)",
      options: ["It supports Azure Hybrid Benefit", "It exposes compute and storage sizing more transparently than DTU", "It is required for the serverless compute tier", "It bundles CPU, memory, reads, and writes into one opaque DTU number"],
      correct: [0, 1, 2],
      explanation: "vCore supports Azure Hybrid Benefit, transparent sizing, and the serverless compute tier. The bundled opaque metric describes DTU, not vCore. This is why vCore is generally recommended for new deployments.",
      tip: "Hybrid Benefit and serverless are vCore-only clues; bundled resource ratios are DTU clues."
    },
    {
      id: "sql-q18", type: "multi",
      question: "Which features protect or govern sensitive data in Azure SQL? (Select all that apply.)",
      options: ["Always Encrypted", "Row-Level Security", "Dynamic Data Masking", "Active Geo-Replication"],
      correct: [0, 1, 2],
      explanation: "Always Encrypted protects sensitive columns from the engine and DBAs, Row-Level Security restricts rows, and Dynamic Data Masking hides sensitive values in results. Active Geo-Replication is a DR feature, not a data protection/governance control for sensitive values.",
      tip: "Security controls change who can see data; DR controls change where copies and failover targets exist."
    },
    {
      id: "sql-q19", type: "multi",
      question: "Which scenarios are good fits for Azure SQL Database Hyperscale? (Select all that apply.)",
      options: ["A 70 TB relational database", "Need for fast snapshot-based backup and restore", "Need up to many read replicas for reporting", "Need OS-level access to install third-party agents"],
      correct: [0, 1, 2],
      explanation: "Hyperscale is designed for very large Azure SQL databases, fast backup/restore, and many read replicas. OS-level access is not available in Azure SQL Database; that requirement points to SQL Server on Azure VM.",
      tip: "Hyperscale solves size and scale; it does not change PaaS control boundaries."
    },
    {
      id: "sql-q20", type: "multi",
      question: "Which statements correctly describe SQL DR options? (Select all that apply.)",
      options: ["Auto-Failover Groups provide stable listener endpoints", "Active Geo-Replication can provide up to four readable secondaries for SQL Database", "Point-In-Time Restore is used for recent accidental corruption or deletion", "Long-Term Retention is limited to 35 days"],
      correct: [0, 1, 2],
      explanation: "Auto-Failover Groups provide listener endpoints, Active Geo-Replication supports up to four readable SQL Database secondaries, and PITR handles recent point-in-time recovery. LTR is specifically for long-term retention up to 10 years, not 35 days.",
      tip: "Listener endpoint = Failover Group; four secondaries = Geo-Replication; years = LTR."
    },
    {
      id: "sql-q21", type: "single",
      question: "A PostgreSQL application requires managed hosting, Microsoft Entra passwordless authentication, built-in connection pooling, zone-redundant HA, and read replicas. Which service should you recommend?",
      options: ["Azure SQL Database", "Azure Database for PostgreSQL Flexible Server", "Azure SQL Managed Instance", "SQL Server on Azure VM"],
      correct: [1],
      explanation: "Azure Database for PostgreSQL Flexible Server is the managed PostgreSQL option and supports features such as zone-redundant HA, read replicas, pgBouncer connection pooling, and Microsoft Entra authentication. Azure SQL options are SQL Server-compatible, not PostgreSQL-compatible.",
      tip: "First match the database engine. PostgreSQL requirements should not be forced into Azure SQL services."
    },
    {
      id: "sql-q22", type: "single",
      question: "An on-premises SQL Server database has no SQL Agent jobs, linked servers, CLR, or OS dependencies. The company wants the least operational overhead for a simple migration. Which target is preferred?",
      options: ["Azure SQL Database", "Azure SQL Managed Instance", "SQL Server on Azure VM", "Azure Database for MySQL Flexible Server"],
      correct: [0],
      explanation: "Azure SQL Database provides the lowest operational overhead for simple SQL Server-compatible database workloads that do not need instance-level features. Managed Instance is better for complex compatibility dependencies, while SQL VMs are for OS-level control or unsupported features.",
      tip: "If compatibility blockers are absent, choose the more managed service: SQL Database before MI before VM."
    },
    {
      id: "sql-q23", type: "single",
      question: "A production OLTP database runs at steady high utilization all day and cannot tolerate cold-start delays. Which compute tier is the best fit?",
      options: ["vCore serverless", "Provisioned vCore compute", "Basic DTU for all workloads", "Long-Term Retention"],
      correct: [1],
      explanation: "Provisioned compute is appropriate for steady production workloads because capacity is continuously available and billed predictably. Serverless is optimized for intermittent workloads with idle periods and can introduce resume latency after pause. LTR is a backup feature, not compute.",
      tip: "No idle time or no cold start means provisioned compute. Serverless needs meaningful idle periods."
    },
    {
      id: "sql-q24", type: "single",
      question: "A critical Azure SQL Database must survive a datacenter failure inside the primary region, with no cross-region DR requirement. Which HA capability should you prioritize?",
      options: ["Zone-redundant configuration", "Long-Term Retention", "Dynamic Data Masking", "Manual export to BACPAC"],
      correct: [0],
      explanation: "Zone-redundant configuration places database infrastructure across availability zones, protecting against a datacenter or zone failure in the same region. LTR and BACPAC are backup/export options, and DDM is a data masking feature. None of those provide local zone-level HA.",
      tip: "Datacenter or availability-zone failure inside one region is a zone-redundancy clue, not a backup clue."
    },
    {
      id: "sql-q25", type: "single",
      question: "A SaaS platform has grown so large that one write primary cannot handle the tenant write volume. Read replicas do not solve the bottleneck. What scalability pattern should be considered?",
      options: ["Sharding tenants across multiple databases", "Dynamic Data Masking", "Long-Term Retention", "Using only read-only replicas"],
      correct: [0],
      explanation: "Read replicas scale read workloads but do not increase write capacity for a single primary. Sharding tenants or keys across multiple databases distributes writes and storage, allowing the platform to scale beyond one database. DDM and LTR do not address throughput.",
      tip: "When the bottleneck is writes, read replicas are a distractor; think sharding or partitioning."
    },
    {
      id: "sql-q26", type: "single",
      question: "A regulated database must record who accessed data and which queries were executed for compliance review. Which feature should you enable?",
      options: ["SQL auditing", "Read scale-out", "Hyperscale named replicas", "Dynamic Data Masking only"],
      correct: [0],
      explanation: "SQL auditing records database events such as logins and queries for compliance, investigation, and monitoring. Read scale-out and Hyperscale replicas address performance and scale. Dynamic Data Masking changes query output for some users but does not create an audit trail.",
      tip: "Compliance evidence and activity trail means auditing; threat detection means Defender for SQL."
    },
    {
      id: "sql-q27", type: "multi",
      question: "Which options are valid relational scalability choices for the stated scenarios? (Select all that apply.)",
      options: [
        "Elastic pools for many tenant databases with variable load",
        "Read scale-out or read replicas for reporting-heavy workloads",
        "Sharding when write volume exceeds a single database primary",
        "Long-Term Retention to increase OLTP write throughput"
      ],
      correct: [0, 1, 2],
      explanation: "Elastic pools share resources across variable tenant databases, read replicas/read scale-out offload reporting reads, and sharding distributes write and storage load. Long-Term Retention is for backup compliance and does not improve database throughput.",
      tip: "Separate scale features from protection features. LTR is never a performance answer."
    },
    {
      id: "sql-q28", type: "multi",
      question: "Which statements about relational HA and DR are TRUE? (Select all that apply.)",
      options: [
        "Business Critical uses multiple replicas and can provide a readable secondary",
        "Auto-Failover Groups provide listener endpoints for transparent regional failover",
        "Zone-redundant HA protects against a regional outage by itself",
        "PostgreSQL/MySQL Flexible Server can use zone-redundant HA for local availability"
      ],
      correct: [0, 1, 3],
      explanation: "Business Critical uses replica-based HA with read scale-out, Auto-Failover Groups provide listener endpoints for regional failover, and Flexible Server offerings support zone-redundant HA patterns. Zone redundancy protects against local zone failure, not an entire regional outage by itself.",
      tip: "Local HA and regional DR are different. Zone redundancy is local; failover groups/geo-replication are regional."
    }
  ]
});
