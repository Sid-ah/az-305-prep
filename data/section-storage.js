AZ305.registerSection({
  id: "storage",
  title: "Storage",
  domain: "Data Storage Solutions",
  weight: "20–25%",
  icon: "💾",
  order: 1,
  summary: "Storage questions are decision-tree questions: match the **data shape**, **access pattern**, **performance target**, **redundancy requirement**, and **cost constraint** to the right service, account type, tier, and SKU.",

  notes: [
    {
      heading: "Storage Account Types",
      intro: "For AZ-305, start with GPv2 unless the scenario clearly demands a premium specialty account.",
      table: {
        headers: ["Account type", "Supports", "Choose when"],
        rows: [
          ["General Purpose v2", "Blob, File, Queue, Table, ADLS Gen2", "Default for most workloads; supports Hot/Cool/Cold/Archive and modern redundancy"],
          ["General Purpose v1", "Legacy general services", "Avoid for new designs; lacks modern tiering features"],
          ["BlockBlobStorage (Premium)", "Block and append blobs", "Very high transaction rate with small blobs, IoT telemetry, log/event pipelines"],
          ["FileStorage (Premium)", "Azure Files only", "SSD-backed SMB/NFS shares for SAP, Oracle, databases, high IOPS apps"],
          ["BlobStorage", "Legacy blobs only", "Avoid for new designs; GPv2 replaced it"]
        ]
      },
      tip: "If a question does not mention low-latency premium blob ingestion or premium file shares, choose **GPv2**. Specialty accounts are for explicit performance/protocol requirements."
    },
    {
      heading: "Blob Storage: Types, Tiers & Lifecycle",
      table: {
        headers: ["Blob type", "Best for", "Exam clue"],
        rows: [
          ["Block Blob", "Documents, images, video, backups, object data", "Most blob scenarios"],
          ["Append Blob", "Append-only logs and audit streams", "Millions of log entries, no updates"],
          ["Page Blob", "Random read/write disks", "VM OS/data disk backing store"]
        ]
      },
      points: [
        "**Hot** has highest storage cost and lowest access cost for frequently accessed data.",
        "**Cool** keeps millisecond access but has lower storage cost, higher access cost, and a 30-day minimum duration.",
        "**Cold** keeps millisecond access with lower storage cost than Cool, higher access cost, and a 90-day minimum duration.",
        "**Archive** is offline, lowest storage cost, highest retrieval cost, and requires rehydration before reads; minimum duration is 180 days.",
        "Use **lifecycle management** to transition or delete blobs automatically based on age or last-modified time."
      ],
      tip: "If retrieval must be immediate, Archive is wrong even when it is cheapest. Archive means hours of rehydration before access."
    },
    {
      heading: "Blob Access Tier Comparison",
      table: {
        headers: ["Tier", "Latency", "Storage cost", "Access cost", "Minimum duration"],
        rows: [
          ["Hot", "Milliseconds", "Highest", "Lowest", "None"],
          ["Cool", "Milliseconds", "Lower", "Higher", "30 days"],
          ["Cold", "Milliseconds", "Lower than Cool", "Higher than Cool", "90 days"],
          ["Archive", "Hours after rehydration", "Lowest", "Highest", "180 days"]
        ]
      },
      points: [
        "Backups retained for 30–90 days usually map to **Cool** or **Cold** depending on expected access.",
        "Long-term compliance records that are rarely read map to **Archive**, often with lifecycle policies.",
        "Deleting or moving data before the minimum duration creates early deletion charges."
      ]
    },
    {
      heading: "Azure Files & Azure File Sync",
      table: {
        headers: ["Capability", "Standard Azure Files", "Premium Azure Files"],
        rows: [
          ["Account", "GPv2", "FileStorage"],
          ["Protocols", "SMB 3.x, REST", "SMB 3.x, NFS 4.1, REST"],
          ["Performance", "Up to 10k IOPS, 300 MB/s", "100k+ IOPS, scales with provisioned GiB"],
          ["Best for", "General file shares, moderate I/O", "SAP, Oracle, databases, low-latency enterprise file shares"]
        ]
      },
      points: [
        "**SMB 3.x** is the common Windows/hybrid file-share protocol and also works for Linux scenarios with the right authentication.",
        "**NFS 4.1** is Linux-focused, premium-tier only, and uses IP-level access rather than SMB-style authentication.",
        "**Azure File Sync** keeps hot files cached on-premises and tiers cold files to Azure — ideal for branch office consolidation or file server replacement."
      ],
      tip: "When the requirement says lift-and-shift a Windows file server or keep on-premises cache, think **Azure Files + Azure File Sync**, not Blob Storage."
    },
    {
      heading: "Managed Disks: Performance SKU Selection",
      table: {
        headers: ["Disk type", "Max IOPS", "Max throughput", "Max size", "Choose when"],
        rows: [
          ["Ultra Disk", "160,000", "2,000 MB/s", "65,536 GiB", "SAP HANA, top-tier SQL, real-time analytics"],
          ["Premium SSD v2", "80,000", "1,200 MB/s", "65,536 GiB", "Business-critical apps needing adjustable IOPS/throughput"],
          ["Premium SSD v1", "20,000", "900 MB/s", "32,767 GiB", "SQL Server, enterprise apps, common OS disks"],
          ["Standard SSD", "6,000", "750 MB/s", "32,767 GiB", "Web servers, dev/test, lightly used production"],
          ["Standard HDD", "2,000", "500 MB/s", "32,767 GiB", "Backup, archive, non-critical high-latency workloads"]
        ]
      },
      points: [
        "**Ultra Disk** and **Premium SSD v2** provide sub-millisecond latency and let you configure performance without resizing the disk.",
        "**Premium SSD v1** is the safe enterprise default with broad VM compatibility.",
        "**Shared disks** on Premium SSD and Ultra support clustered workloads such as Windows Server Failover Clustering."
      ],
      tip: "Extreme IOPS and independently adjustable performance point to Ultra or Premium SSD v2; ordinary enterprise SQL often fits Premium SSD v1."
    },
    {
      heading: "Redundancy SKUs (exam favorite)",
      table: {
        headers: ["SKU", "Copies", "Primary zone protection", "Geo copy", "Read from secondary"],
        rows: [
          ["LRS", "3", "No; one datacenter", "No", "No"],
          ["ZRS", "3", "Yes; three availability zones", "No", "No"],
          ["GRS", "6", "No; LRS in primary", "Yes; LRS secondary", "No"],
          ["GZRS", "6", "Yes; ZRS in primary", "Yes; LRS secondary", "No"],
          ["RA-GRS", "6", "No; LRS in primary", "Yes", "Yes"],
          ["RA-GZRS", "6", "Yes; ZRS in primary", "Yes", "Yes"]
        ]
      },
      points: [
        "Choose **LRS** for lowest cost or when data must stay in one datacenter/region and zone failure is acceptable.",
        "Choose **ZRS** when the data must remain in one region but survive an availability zone failure.",
        "Choose **GRS/GZRS** to survive a regional outage; choose the RA variants when applications must read from the secondary during an outage.",
        "Choose **GZRS/RA-GZRS** for the strongest mix: zone protection in the primary plus a geo-replicated secondary."
      ],
      tip: "Data residency forbids GRS/GZRS if the secondary is outside the allowed geography. Single-region compliance usually means LRS or ZRS."
    },
    {
      heading: "Security, SAS & Immutable Storage",
      table: {
        headers: ["Access method", "Best for", "Exam warning"],
        rows: [
          ["Azure RBAC", "Identity-based, auditable access", "Preferred for users/apps with Entra identities"],
          ["User Delegation SAS", "Temporary blob access backed by Entra ID", "Best SAS choice when possible"],
          ["Service SAS", "Scoped access to one storage service", "Use carefully with tight permissions and expiry"],
          ["Account SAS", "Multiple storage services", "Broader blast radius"],
          ["Storage account keys", "Emergency/admin operations", "Full access; avoid sharing in production"]
        ]
      },
      points: [
        "Storage encrypts data at rest with AES-256 by default and supports customer-managed keys in Key Vault for compliance.",
        "**Infrastructure encryption** adds a second hardware-layer encryption pass.",
        "**Immutable Storage** provides WORM with time-based retention or legal hold for SEC, HIPAA, and litigation scenarios.",
        "**Private Endpoint** gives storage a private IP in a VNet; Service Endpoint secures the public endpoint but does not remove it."
      ],
      tip: "External temporary blob access should be a tightly scoped SAS, preferably User Delegation SAS. Never pick account key sharing for partners."
    },
    {
      heading: "Queues, Tables & Data Lake Gen2",
      table: {
        headers: ["Service", "Use when", "Avoid when"],
        rows: [
          ["Queue Storage", "Simple decoupling, 64 KB messages, low-cost buffering", "Need ordering, sessions, topics, dead-lettering"],
          ["Table Storage", "Cheap schemaless key-value lookups with PartitionKey/RowKey", "Need global distribution, SLAs, richer indexing"],
          ["Data Lake Storage Gen2", "Big data analytics with Hadoop/Spark/Synapse/Databricks", "Need simple SMB/NFS file shares"]
        ]
      },
      points: [
        "Queue messages are up to **64 KB** and can live up to **7 days**.",
        "Table Storage has no secondary indexes or stored procedures; Cosmos DB Table API adds global distribution, consistency options, and SLAs.",
        "ADLS Gen2 is Blob Storage with **hierarchical namespace** enabled, POSIX-style ACLs, true directory semantics, and atomic rename."
      ],
      tip: "Spark, Databricks, Synapse, lakehouse, POSIX ACLs, or atomic rename are ADLS Gen2 clues — not Azure Files."
    },
    {
      heading: "Exam skills mapping",
      points: [
        "Recommend a solution for storing semi-structured data: **Table Storage** for low-cost key-value, **Cosmos DB Table API** for global distribution/SLAs, **ADLS Gen2** for analytics-oriented semi-structured files.",
        "Recommend a solution for storing unstructured data: **Blob Storage** for objects, **Azure Files** for SMB/NFS shares, and **Azure NetApp Files** for demanding enterprise file workloads needing very high performance/protocol compatibility.",
        "Balance features, performance, and cost: choose access tiers, standard vs premium accounts, managed disk SKUs, and lifecycle management based on access frequency, latency, and IOPS.",
        "Data protection and durability: choose **LRS/ZRS/GRS/RA-GRS/GZRS/RA-GZRS**, soft delete, versioning, object replication, immutable storage, and customer-managed keys as required.",
        "HA for unstructured/semi-structured data: combine zone redundancy, geo redundancy, read-access secondary endpoints, and failover planning for the required RPO/RTO."
      ],
      tip: "Map every storage question to data shape first, then apply performance, durability, compliance, and cost constraints in that order."
    }
  ],

  flashcards: [
    { front: "What is the default storage account type for new designs?", back: "**General Purpose v2**. It supports Blob, Files, Queues, Tables, ADLS Gen2, modern access tiers, and zone/geo redundancy options." },
    { front: "When do you choose BlockBlobStorage Premium?", back: "For very high transaction rates and low latency with small block/append blobs — IoT telemetry, log ingestion, and event streams. It does not support Cool or Archive tiering." },
    { front: "Block blob vs append blob vs page blob", back: "Block blob = documents/images/video/backups. Append blob = append-only logs/audit streams. Page blob = random read/write backing for VM disks." },
    { front: "Hot vs Cool vs Cold vs Archive", back: "Hot = frequent access. Cool = infrequent but online, 30-day minimum. Cold = rarer online access, 90-day minimum. Archive = offline, lowest storage cost, rehydrate before use, 180-day minimum." },
    { front: "What does lifecycle management do?", back: "It automatically transitions blobs between tiers or deletes them based on rules such as age or last-modified time — the exam answer for hands-off cost optimization." },
    { front: "What are the two immutable storage modes?", back: "**Time-based retention** locks blobs for a defined period; **legal hold** locks indefinitely for litigation or investigation. Both implement WORM behavior." },
    { front: "Azure Files Standard vs Premium", back: "Standard uses GPv2 and fits general SMB shares. Premium uses FileStorage, SSD-backed performance, SMB/NFS, and high IOPS for SAP, Oracle, databases, or latency-sensitive file shares." },
    { front: "What does Azure File Sync solve?", back: "Hybrid file server replacement: keep hot files cached on-premises while cold files tier to Azure Files. Great for branch offices and lift-and-shift file shares." },
    { front: "Ultra Disk vs Premium SSD v2", back: "Ultra reaches the highest IOPS/throughput for top-tier workloads. Premium SSD v2 is cheaper, still high performance, and lets you adjust IOPS/throughput independently without resizing." },
    { front: "Which redundancy keeps data in one region but protects against zone failure?", back: "**ZRS**. It stores three copies across availability zones in the primary region and avoids cross-region replication." },
    { front: "GRS vs GZRS", back: "Both create six copies across primary and secondary regions. GRS uses LRS in the primary; GZRS uses ZRS in the primary, so it also survives a primary-region zone failure." },
    { front: "What does RA mean in RA-GRS and RA-GZRS?", back: "Read-access: applications can read from the geo-secondary endpoint during outages or DR events without waiting for account failover." },
    { front: "Best temporary access method for an external partner?", back: "A tightly scoped **User Delegation SAS** when possible. It is backed by Entra ID and avoids sharing account keys." },
    { front: "Dynamic data residency trap for storage redundancy", back: "If data must remain in a single region/country, eliminate geo-redundant options such as GRS, RA-GRS, GZRS, and RA-GZRS unless the secondary is explicitly allowed." },
    { front: "Queue Storage vs Service Bus", back: "Queue Storage = simple low-cost decoupling. Service Bus = enterprise messaging with ordering, sessions, topics/subscriptions, dead-lettering, and richer broker features." },
    { front: "Azure Table Storage vs Cosmos DB Table API", back: "Table Storage is cheap key-value storage. Cosmos DB Table API adds global distribution, SLAs, multiple consistency levels, and more advanced indexing at higher cost." },
    { front: "What does hierarchical namespace enable in ADLS Gen2?", back: "POSIX-style ACLs, true directories, and atomic rename — essential for big data analytics engines like Spark, Synapse, and Databricks." },
    { front: "Service Endpoint vs Private Endpoint for storage", back: "Service Endpoint secures access to the storage public endpoint from a VNet. Private Endpoint gives the storage account a private IP and supports disabling public network access." },
    { front: "When do you choose Azure NetApp Files over Azure Files?", back: "Choose **Azure NetApp Files** for very high-performance enterprise SMB/NFS workloads that need advanced file-service capabilities, low latency, snapshots, and protocol compatibility beyond standard Azure Files patterns." },
    { front: "Blob soft delete vs blob versioning", back: "Soft delete protects deleted blobs or snapshots for a retention window. Versioning automatically keeps previous blob versions so you can recover from overwrite or corruption." },
    { front: "What does object replication do?", back: "Object replication asynchronously copies block blobs from a source storage account/container to a destination account/container, often across regions for distribution or DR." },
    { front: "When is Cosmos DB Table API preferred over Azure Table Storage?", back: "When the Table data model must gain global distribution, low-latency/throughput SLAs, multiple consistency choices, or richer indexing — and the higher cost is justified." },
    { front: "When is ADLS Gen2 better than Table Storage for semi-structured data?", back: "When semi-structured files such as JSON/CSV/Parquet are used for analytics with Spark, Synapse, Databricks, POSIX ACLs, and hierarchical namespace." },
    { front: "Storage durability vs availability", back: "Durability protects data from loss through copies, versioning, soft delete, immutability, and replication. Availability focuses on continued read/write access through zone/geo redundancy and failover design." },
    { front: "RA-GRS failover exam caution", back: "RA-GRS lets you read from the secondary before failover, but writes still go to the primary until account failover. Use RA-GZRS if primary-region zone protection is also required." }
  ],

  questions: [
    {
      id: "stor-q1", type: "single",
      question: "A new application must store documents, images, queues, and table entities. It also needs lifecycle tiering to Cool and Archive. Which account type should you choose?",
      options: ["General Purpose v1", "General Purpose v2", "BlockBlobStorage Premium", "FileStorage Premium"],
      correct: [1],
      explanation: "General Purpose v2 is the default modern account type and supports Blob, File, Queue, Table, ADLS Gen2, and access tiers including Cool and Archive. GPv1 and legacy BlobStorage lack modern tiering features, while premium specialty accounts are narrower.",
      tip: "When many storage services plus tiering appear together, pick GPv2 unless a premium-only requirement is explicit."
    },
    {
      id: "stor-q2", type: "single",
      question: "An IoT platform writes millions of small append-only telemetry records with very low latency. The data is not intended for Cool or Archive tiers. Which account and blob pattern fits best?",
      options: ["GPv2 with page blobs", "BlockBlobStorage Premium with append blobs", "FileStorage Premium with SMB", "GPv1 with table entities"],
      correct: [1],
      explanation: "BlockBlobStorage Premium is optimized for high transaction rates and low-latency small blob workloads. Append blobs fit append-only log or telemetry streams. Page blobs are for random disk I/O, and Azure Files is a file-share service.",
      tip: "High-rate logs or telemetry plus premium low latency usually means Premium BlockBlobStorage and append blobs."
    },
    {
      id: "stor-q3", type: "single",
      question: "A compliance archive must retain records for seven years at the lowest storage cost. Retrieval can take hours, and records must not be modified or deleted during retention. What should you configure?",
      options: ["Hot tier with account keys", "Archive tier with lifecycle management and immutable storage", "Cool tier with Azure File Sync", "Premium BlockBlobStorage with RA-GRS"],
      correct: [1],
      explanation: "Archive provides the lowest storage cost for rarely accessed data when rehydration time is acceptable. Lifecycle policies automate movement into Archive, and immutable storage provides WORM retention for compliance. Hot and premium options cost more and do not address WORM by themselves.",
      tip: "Lowest cost plus hours of retrieval = Archive; add immutable storage whenever the words WORM, retention, SEC, or legal hold appear."
    },
    {
      id: "stor-q4", type: "single",
      question: "A backup set is accessed rarely but must be restored immediately if needed. The data will be kept for 60 days. Which blob tier is the best fit?",
      options: ["Hot", "Cool", "Cold", "Archive"],
      correct: [1],
      explanation: "Cool is designed for infrequently accessed data that still needs millisecond retrieval and has a 30-day minimum duration. Archive would be cheaper but requires rehydration, violating immediate restore. Cold has a 90-day minimum, which is a poor match for 60-day retention.",
      tip: "Immediate access rules out Archive. Match the retention window to the minimum duration: 60 days fits Cool better than Cold."
    },
    {
      id: "stor-q5", type: "single",
      question: "A Linux application needs an NFS file share with low latency and high IOPS. Which storage option should you select?",
      options: ["Azure Files Premium in a FileStorage account", "Azure Blob Storage with hierarchical namespace", "Azure Queue Storage", "Azure Files Cool tier in GPv2"],
      correct: [0],
      explanation: "NFS 4.1 for Azure Files requires premium file shares in a FileStorage account. Premium also provides the low-latency, high-IOPS profile required by the workload. Blob Storage is object storage, not a mounted NFS file-share replacement in this context.",
      tip: "NFS share plus low latency is a premium Azure Files clue; do not choose Blob unless the scenario says object/lake analytics."
    },
    {
      id: "stor-q6", type: "single",
      question: "A company wants to replace branch office file servers while keeping frequently used files cached locally and tiering cold files to Azure. What should you implement?",
      options: ["Azure Blob lifecycle management", "Azure File Sync with Azure Files", "Data Lake Storage Gen2", "RA-GRS on a storage account"],
      correct: [1],
      explanation: "Azure File Sync extends on-premises Windows file servers to Azure Files and supports cloud tiering, keeping hot files local and cold files in Azure. Blob lifecycle management tiers objects, not file server shares, and redundancy does not provide local caching.",
      tip: "Branch office, local cache, and file server replacement are direct signals for Azure File Sync."
    },
    {
      id: "stor-q7", type: "single",
      question: "A SQL Server VM needs predictable enterprise disk performance but not the extreme cost or VM restrictions of Ultra Disk. Which disk is the normal starting choice?",
      options: ["Standard HDD", "Standard SSD", "Premium SSD v1", "Archive Blob tier"],
      correct: [2],
      explanation: "Premium SSD v1 is the common enterprise disk choice for SQL Server and production VM OS/data disks because it provides predictable performance and broad compatibility. Standard HDD/SSD are lower-performance options, and Archive Blob is not managed disk storage.",
      tip: "For ordinary production SQL on VMs, Premium SSD is the safe default. Reserve Ultra or Premium SSD v2 for explicit extreme or adjustable performance requirements."
    },
    {
      id: "stor-q8", type: "single",
      question: "A SAP HANA workload requires up to 160,000 IOPS and sub-millisecond latency on supported VM sizes. Which disk SKU should you choose?",
      options: ["Ultra Disk", "Premium SSD v2", "Premium SSD v1", "Standard SSD"],
      correct: [0],
      explanation: "Ultra Disk provides the highest Azure managed disk performance, up to 160,000 IOPS and 2,000 MB/s, for workloads such as SAP HANA and top-tier databases. Premium SSD v2 is also high performance but has lower maximum IOPS than Ultra.",
      tip: "The highest IOPS numbers and SAP HANA usually point to Ultra Disk."
    },
    {
      id: "stor-q9", type: "single",
      question: "Regulations require all copies of storage data to remain within one Azure region, but the data must survive an availability zone failure. Which redundancy option should you use?",
      options: ["LRS", "ZRS", "GRS", "RA-GZRS"],
      correct: [1],
      explanation: "ZRS keeps three copies across availability zones within a single region. It satisfies zone-failure protection without creating a cross-region replica. GRS and RA-GZRS create geo-replicated copies, which can violate residency requirements.",
      tip: "Single-region compliance plus zone resiliency = ZRS. Eliminate any geo-redundant answer."
    },
    {
      id: "stor-q10", type: "single",
      question: "A workload must survive both primary-region zone failures and a full regional outage. During a regional outage, read access to the secondary is required. Which redundancy SKU is best?",
      options: ["ZRS", "GRS", "RA-GRS", "RA-GZRS"],
      correct: [3],
      explanation: "RA-GZRS combines ZRS in the primary region, geo-replication to a secondary region, and read access to the secondary. GRS lacks primary-region zone redundancy, and GZRS without RA would not allow reads from the secondary.",
      tip: "Decode the letters: GZRS gives zone plus geo; RA adds read access to the secondary."
    },
    {
      id: "stor-q11", type: "multi",
      question: "Which redundancy options allow read access from the secondary region? (Select all that apply.)",
      options: ["GRS", "RA-GRS", "GZRS", "RA-GZRS"],
      correct: [1, 3],
      explanation: "Only the RA variants expose the secondary endpoint for read access. GRS and GZRS replicate data to a secondary region, but the secondary is not readable unless read-access is enabled.",
      tip: "In storage redundancy names, `RA` is the only read-from-secondary clue."
    },
    {
      id: "stor-q12", type: "single",
      question: "An external partner needs write access to one blob container for 24 hours. You want the most secure delegated option without sharing account keys. What should you issue?",
      options: ["Storage account key", "Anonymous public access", "User Delegation SAS with limited permissions and expiry", "GRS secondary access key"],
      correct: [2],
      explanation: "A User Delegation SAS is backed by Entra ID and can be scoped to specific resources, permissions, and time windows. Sharing account keys grants broad account-level access and is not appropriate for partners. Anonymous access is not controlled delegation.",
      tip: "Temporary external access = SAS. Most secure SAS for blobs = User Delegation SAS."
    },
    {
      id: "stor-q13", type: "single",
      question: "A storage account must be reachable only through a private IP in a VNet, and public network access must be disabled. Which feature is required?",
      options: ["Service Endpoint for Microsoft.Storage", "Private Endpoint plus private DNS", "Account SAS", "ZRS"],
      correct: [1],
      explanation: "A Private Endpoint creates a private IP for the storage service in the VNet and works with private DNS so clients resolve the storage name privately. Service Endpoints secure traffic to the public endpoint but do not remove the public endpoint.",
      tip: "Private IP for PaaS or no public endpoint always points to Private Endpoint, not Service Endpoint."
    },
    {
      id: "stor-q14", type: "single",
      question: "A Spark and Databricks analytics platform needs object storage with POSIX-style ACLs, true directories, and atomic rename. Which option should you choose?",
      options: ["Azure Files Premium", "Data Lake Storage Gen2", "Azure Queue Storage", "Azure Table Storage"],
      correct: [1],
      explanation: "Data Lake Storage Gen2 is Blob Storage with hierarchical namespace enabled, giving analytics engines POSIX-style ACLs, directory semantics, and atomic rename. Azure Files provides file shares, not the lake architecture expected by Spark and Databricks.",
      tip: "Analytics lakehouse keywords plus ACLs or hierarchical namespace = ADLS Gen2."
    },
    {
      id: "stor-q15", type: "single",
      question: "A simple application needs low-cost message buffering. Messages are small, ordering is not required, and no dead-letter queue is needed. Which service is sufficient?",
      options: ["Azure Queue Storage", "Azure Service Bus Topics", "Event Hubs", "Azure Table Storage"],
      correct: [0],
      explanation: "Queue Storage provides simple low-cost queues for decoupling components when advanced broker features are not needed. Service Bus is preferred for ordering, sessions, dead-lettering, and publish/subscribe topics. Event Hubs is for streaming ingestion, not simple work queues.",
      tip: "Simple queue with no ordering/dead-letter/session requirement = Queue Storage. Enterprise messaging features = Service Bus."
    },
    {
      id: "stor-q16", type: "single",
      question: "A key-value metadata store needs very low cost and simple PartitionKey plus RowKey lookups. There is no need for global distribution or multiple consistency levels. Which service fits?",
      options: ["Azure Table Storage", "Cosmos DB Table API", "Azure SQL Database", "Azure Files"],
      correct: [0],
      explanation: "Azure Table Storage is a cheap schemaless key-value store using PartitionKey and RowKey. Cosmos DB Table API is better when global distribution, SLAs, or stronger consistency choices are required, but it costs more. SQL and Files do not match the key-value requirement.",
      tip: "If the scenario is simple and cost-sensitive, choose Table Storage; if it adds global distribution or SLAs, switch to Cosmos DB Table API."
    },
    {
      id: "stor-q17", type: "multi",
      question: "Which statements about blob access tiers are TRUE? (Select all that apply.)",
      options: [
        "Archive has the lowest storage cost but requires rehydration before reads",
        "Cool has a 30-day minimum duration and millisecond access",
        "Hot has the lowest access cost for frequently read data",
        "Archive is the best tier when data must be restored immediately"
      ],
      correct: [0, 1, 2],
      explanation: "Archive is offline and cheapest to store, but it must be rehydrated before reads. Cool remains online with a 30-day minimum duration. Hot is expensive to store but cheapest to access, so it fits frequent reads; immediate restore rules out Archive.",
      tip: "For multi-select tier questions, check both latency and cost. Archive is wrong whenever immediacy is required."
    },
    {
      id: "stor-q18", type: "multi",
      question: "Which features are associated with immutable storage for blobs? (Select all that apply.)",
      options: ["Time-based retention", "Legal hold", "WORM compliance", "Automatic read replicas in another region"],
      correct: [0, 1, 2],
      explanation: "Immutable storage locks blobs using time-based retention or legal hold and implements write-once, read-many behavior for compliance. Geo-replication and read replicas are redundancy features, not immutable storage features.",
      tip: "Immutability is about preventing modification/deletion; redundancy is about where copies live."
    },
    {
      id: "stor-q19", type: "multi",
      question: "Which requirements point to Data Lake Storage Gen2 rather than ordinary Azure Files? (Select all that apply.)",
      options: ["Spark analytics over large datasets", "Hierarchical namespace with POSIX-style ACLs", "Atomic directory rename", "SMB drive mapping for Windows users"],
      correct: [0, 1, 2],
      explanation: "ADLS Gen2 is built for big data analytics and provides hierarchical namespace, POSIX-style ACLs, directory semantics, and atomic rename. SMB drive mapping for Windows users is an Azure Files requirement, not a data lake requirement.",
      tip: "Spark, Synapse, Databricks, HNS, and POSIX ACLs all point to ADLS Gen2. SMB/NFS shares point to Azure Files."
    },
    {
      id: "stor-q20", type: "multi",
      question: "Which actions improve secure delegated access to Azure Storage? (Select all that apply.)",
      options: [
        "Prefer Azure RBAC or managed identities for application access",
        "Issue tightly scoped SAS tokens with short expiry for temporary access",
        "Share storage account keys with partners so they can create their own SAS tokens",
        "Use customer-managed keys when compliance requires control of encryption keys"
      ],
      correct: [0, 1, 3],
      explanation: "Azure RBAC and managed identities provide auditable identity-based access. SAS tokens should be tightly scoped and time-limited for delegation. Customer-managed keys satisfy encryption key control requirements. Sharing account keys gives broad access and is specifically discouraged.",
      tip: "Any answer that shares account keys with third parties is almost always the security trap."
    },
    {
      id: "stor-q21", type: "single",
      question: "A telemetry metadata service needs a very low-cost schemaless store with `PartitionKey` and `RowKey` lookups. It does not need global distribution, secondary indexes, or multiple consistency levels. Which service should you recommend?",
      options: ["Azure Table Storage", "Cosmos DB API for Table", "Data Lake Storage Gen2", "Azure SQL Database"],
      correct: [0],
      explanation: "Azure Table Storage is the low-cost key-value service for simple semi-structured data using `PartitionKey` and `RowKey`. Cosmos DB Table API adds global distribution, SLAs, and consistency choices at higher cost. ADLS Gen2 is for analytics files, not point key-value lookups.",
      tip: "For semi-structured data, distinguish cheap key-value lookups from globally distributed NoSQL and analytics lake storage."
    },
    {
      id: "stor-q22", type: "single",
      question: "An existing Azure Table Storage application must keep the same Table programming model but add multi-region distribution, low-latency SLAs, and tunable consistency. What should you recommend?",
      options: ["Azure Table Storage with LRS", "Cosmos DB API for Table", "Azure Files Premium", "Blob Storage with Archive tier"],
      correct: [1],
      explanation: "Cosmos DB API for Table preserves the Table model while adding global distribution, SLAs, throughput provisioning, and multiple consistency levels. LRS Table Storage remains cheaper but does not provide the required global and SLA features. Files and Blob Archive are different storage models.",
      tip: "Table model plus global distribution or consistency options is the Cosmos DB Table API clue."
    },
    {
      id: "stor-q23", type: "single",
      question: "A media platform stores large videos, images, and backup files as unstructured objects. Users access recent objects frequently, while older objects should transition automatically to lower-cost tiers. Which design fits best?",
      options: ["Azure Blob Storage in a GPv2 account with lifecycle management", "Azure Table Storage with secondary indexes", "Azure Queue Storage with 64 KB messages", "SQL Managed Instance with FILESTREAM"],
      correct: [0],
      explanation: "Blob Storage is the object store for unstructured files such as images, video, and backups. GPv2 supports Hot/Cool/Cold/Archive tiers, and lifecycle management automates cost optimization as objects age. Table, Queue, and SQL MI do not match the unstructured object requirement.",
      tip: "Documents, images, video, and backups usually mean Blob Storage; add lifecycle when the access pattern changes over time."
    },
    {
      id: "stor-q24", type: "single",
      question: "A legacy enterprise application requires a highly performant managed NFS/SMB file service with low latency and enterprise file capabilities beyond ordinary Azure Files. Which service should be considered?",
      options: ["Azure NetApp Files", "Azure Blob Archive", "Azure Queue Storage", "Azure Table Storage"],
      correct: [0],
      explanation: "Azure NetApp Files is designed for demanding enterprise file workloads that require very high performance, low latency, and NFS/SMB protocol support. Blob Archive is offline object storage, Queue Storage is messaging, and Table Storage is key-value data.",
      tip: "If the scenario sounds like high-end enterprise NAS in Azure, Azure NetApp Files is often the intended file-service answer."
    },
    {
      id: "stor-q25", type: "single",
      question: "A storage account contains logs that are queried heavily for seven days, rarely for the next 60 days, and then retained for seven years only for compliance. The team wants minimum manual work. What should you configure?",
      options: ["Keep all data in Hot tier", "A lifecycle policy that moves blobs from Hot to Cool/Cold and then Archive", "A premium FileStorage account", "Manual monthly export to a VM disk"],
      correct: [1],
      explanation: "Lifecycle management is built for automatic tier transitions based on age or last-modified time. Hot fits the first week, Cool or Cold fits infrequent online access, and Archive fits long-term compliance retention. Keeping everything Hot wastes money, while manual movement increases operations.",
      tip: "Changing access pattern over time plus cost optimization equals lifecycle management."
    },
    {
      id: "stor-q26", type: "multi",
      question: "Which choices correctly balance features, performance, and cost for storage scenarios? (Select all that apply.)",
      options: [
        "Use Premium FileStorage for high-IOPS enterprise SMB/NFS shares",
        "Use Archive tier for data that must be restored within milliseconds",
        "Use Standard HDD for non-critical backup data that tolerates higher latency",
        "Use BlockBlobStorage Premium for low-latency high-rate small blob ingestion"
      ],
      correct: [0, 2, 3],
      explanation: "Premium FileStorage fits high-performance file shares, Standard HDD fits low-cost non-critical disk data, and Premium BlockBlobStorage fits high-rate low-latency blob ingestion. Archive is not suitable for millisecond restore because objects must be rehydrated before access.",
      tip: "Cost answers must still satisfy latency. Archive is cheap but fails immediate-access requirements."
    },
    {
      id: "stor-q27", type: "multi",
      question: "A blob workload must recover from accidental deletes and overwrites and keep regulated records tamper-resistant. Which features should you combine? (Select all that apply.)",
      options: ["Blob soft delete", "Blob versioning", "Immutable storage with time-based retention or legal hold", "Queue message TTL"],
      correct: [0, 1, 2],
      explanation: "Soft delete helps recover deleted blobs, versioning preserves prior versions after overwrites, and immutable storage enforces WORM-style retention. Queue message TTL applies to Queue Storage messages, not blob protection or compliance retention.",
      tip: "Deletes, overwrites, and tampering are separate failure modes; match soft delete, versioning, and immutability respectively."
    },
    {
      id: "stor-q28", type: "single",
      question: "A document repository must remain readable during a regional outage, and it must also survive an availability zone failure in the primary region. Which redundancy option best matches the HA requirement?",
      options: ["LRS", "ZRS", "RA-GRS", "RA-GZRS"],
      correct: [3],
      explanation: "RA-GZRS provides zone redundancy in the primary region, geo-replication to a secondary region, and read access to the secondary endpoint. RA-GRS provides read access to a secondary but lacks primary-region zone redundancy. LRS and ZRS do not provide cross-region read availability.",
      tip: "Need primary zone protection plus readable secondary: choose the option containing both `GZRS` and `RA`."
    }
  ]
});
