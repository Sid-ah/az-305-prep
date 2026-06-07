AZ305.registerSection({
  id: "bcdr",
  title: "Business Continuity & DR",
  domain: "Business Continuity Solutions",
  weight: "15–20%",
  icon: "🛟",
  order: 1,
  summary: "BCDR questions test whether you can map **RTO** and **RPO** to the right Azure pattern. Separate **backup** (data recovery), **high availability** (local uptime), and **disaster recovery** (regional recovery), then choose services like Azure Backup, Azure Site Recovery, geo-replication, zones, and global routing.",

  notes: [
    {
      heading: "RTO, RPO, HA, DR & Backup",
      intro: "Start every BCDR design by identifying what can be lost and how long the workload can be down.",
      table: {
        headers: ["Concept", "Exam meaning", "Design impact"],
        rows: [
          ["RPO", "Maximum acceptable **data loss** measured in time", "Determines backup frequency or replication method"],
          ["RTO", "Maximum acceptable **downtime**", "Determines restore, failover, standby, or active-active pattern"],
          ["High availability", "Keep the app running through local failures", "Availability sets, zones, load balancing, redundancy"],
          ["Disaster recovery", "Recover service in another location after a major outage", "ASR, geo-replication, failover plans, region pairs"],
          ["Backup", "Recover deleted, corrupted, or old data", "Azure Backup, PITR, LTR, soft delete, immutable vaults"]
        ]
      },
      points: [
        "Low **RPO** means frequent backups or continuous replication; low **RTO** means hot standby, automated failover, or active-active.",
        "Availability Zones protect against datacenter failure inside one region; they do **not** replace cross-region DR.",
        "Geo-replication protects availability, but backup is still required for accidental deletion, corruption, and point-in-time restore."
      ],
      tip: "If the question asks for deleted/corrupted data, choose backup/PITR. If it asks for regional outage recovery, choose DR/replication. If it asks to keep running during local failure, choose HA."
    },
    {
      heading: "Azure Backup Vaults, Policies & Protection",
      table: {
        headers: ["Vault", "Supports", "Choose when"],
        rows: [
          ["Recovery Services Vault", "Azure Backup plus Azure Site Recovery", "The scenario includes ASR, Azure VMs, Azure Files, SQL/SAP HANA on VMs, or on-premises backup"],
          ["Backup Vault", "Newer backup datasources", "The scenario uses Azure Disks, Azure Blobs, or Azure Database for PostgreSQL backups and does not require ASR"]
        ]
      },
      points: [
        "**Backup policies** define backup frequency and retention across daily, weekly, monthly, and yearly points.",
        "**Soft delete** keeps deleted backup data for 14 days to protect against accidental deletion and ransomware-style cleanup.",
        "**Immutable vaults** prevent modification or deletion of backup data; **multi-user authorization (MUA)** requires secondary approval for critical operations.",
        "**Cross-region restore** can restore VM backups to the paired region for DR testing or compliance, when supported by the vault configuration.",
        "Azure VM Backup uses snapshot tier for instant restore, vault-standard tier for normal retention, and archive tier for long-term cold retention."
      ],
      tip: "ASR always points to a Recovery Services Vault. Backup Vault is a common distractor because it does not support Site Recovery."
    },
    {
      heading: "Azure Backup Workload Coverage",
      table: {
        headers: ["Workload", "Vault", "Method"],
        rows: [
          ["Azure VMs", "Recovery Services Vault or Backup Vault", "Azure Backup extension; no manual in-guest backup agent for normal VM backup"],
          ["SQL Server on Azure VMs", "Recovery Services Vault", "SQL workload extension for application-aware backup"],
          ["SAP HANA on Azure VMs", "Recovery Services Vault", "HANA backup extension"],
          ["Azure Files", "Recovery Services Vault", "Snapshot-based backup"],
          ["On-premises Windows files/folders", "Recovery Services Vault", "MARS agent"],
          ["On-premises VMware/Hyper-V VMs", "Recovery Services Vault", "MABS or DPM"],
          ["Azure Blobs", "Backup Vault", "Operational backup based on soft-delete capabilities"],
          ["Azure Disks", "Backup Vault", "Snapshot-based backup"],
          ["Azure Database for PostgreSQL", "Backup Vault", "Long-term retention backups"]
        ]
      },
      callout: "Azure Backup Center is a management layer, not a replacement vault. Use it for cross-subscription inventory, compliance, monitoring, alerts, reports, and at-scale operations.",
      tip: "Centralized backup governance across many subscriptions or vaults = Azure Backup Center; configuring protection for a workload still uses the correct vault and policy."
    },
    {
      heading: "Azure Site Recovery (ASR)",
      intro: "ASR continuously replicates workloads to a secondary location so you can fail over operations in minutes to hours instead of restoring everything from backup.",
      table: {
        headers: ["Source", "Target", "Agent / component"],
        rows: [
          ["Azure VM in Region A", "Azure VM in Region B", "ASR mobility extension installed automatically"],
          ["VMware VM on-premises", "Azure VM", "Mobility service plus Configuration/Process server"],
          ["Hyper-V VM on-premises", "Azure VM", "Azure Site Recovery Provider on Hyper-V host"],
          ["Physical Windows/Linux server", "Azure VM", "Mobility service agent"]
        ]
      },
      points: [
        "Azure-to-Azure ASR can provide **RPO** as low as 30 seconds; practical **RTO** depends on recovery plan complexity and is commonly 1-2 hours.",
        "**Recovery plans** define ordered failover groups, manual actions, and Azure Automation runbooks so multi-tier apps fail over in the correct sequence.",
        "**Test failover** validates DR in an isolated VNet without disrupting production replication.",
        "**Planned failover** synchronizes before cutover for zero data loss; **unplanned failover** uses the latest available recovery point after an outage.",
        "Replication policies control recovery point retention, app-consistent snapshot frequency, and crash-consistent versus app-consistent recovery points."
      ],
      tip: "VM-level regional DR with orchestration = ASR. Backup-only answers are wrong when the requirement is to resume the application after a regional outage."
    },
    {
      heading: "Availability Sets, Zones, Region Pairs & DR Patterns",
      table: {
        headers: ["Pattern", "RTO", "RPO", "Cost", "Best fit"],
        rows: [
          ["Availability Sets", "Minutes", "Seconds", "Low", "VM HA inside one datacenter cluster using fault/update domains"],
          ["Availability Zones", "Seconds", "Near-zero", "Medium", "Datacenter failure inside one Azure region"],
          ["Active-Active multi-region", "Seconds", "Near-zero", "High", "Mission-critical workloads that must keep serving traffic"],
          ["Active-Passive with ASR", "Minutes-Hours", "Minutes", "Medium", "VM DR without paying for a full second production stack"],
          ["Backup & Restore", "Hours", "Hours", "Low", "Non-critical or cost-sensitive workloads"]
        ]
      },
      points: [
        "Region pairs are used by many Azure geo-redundant services to place secondary copies in a paired region within the same geography when possible.",
        "Paired regions support coordinated platform updates and disaster recovery priority, but your app still needs a tested failover design.",
        "Use global routing such as Front Door or Traffic Manager when clients need to move between regional deployments after failover."
      ],
      tip: "Zones solve a regional datacenter problem; region pairs and multi-region deployments solve a regional outage problem. Do not confuse the blast radius."
    },
    {
      heading: "Azure SQL BCDR",
      table: {
        headers: ["Feature", "RPO", "RTO", "Choose when"],
        rows: [
          ["Active Geo-Replication", "About 5 seconds", "Manual failover", "Need up to four readable secondaries or reporting copies; can handle manual failover and endpoint updates"],
          ["Auto-Failover Groups", "About 5 seconds", "Automatic in minutes", "Need automatic failover and a stable listener endpoint for one or more databases"],
          ["Point-in-time restore (PITR)", "Varies by backup schedule", "Minutes-Hours", "Restore to a point within 7-35 days; creates a new database"],
          ["Long-term retention (LTR)", "Not an HA feature", "Minutes-Hours", "Keep weekly/monthly/yearly backups for compliance, up to 10 years"],
          ["Geo-restore", "Up to 1 hour", "Minutes-Hours", "Restore from geo-redundant backup to any region after regional disaster"]
        ]
      },
      points: [
        "Auto-failover groups are preferred when the application needs a consistent connection string after failover.",
        "Active geo-replication secondaries are readable, but failover is manual and applications may need connection string changes.",
        "PITR creates a **new database**; it does not overwrite the original database."
      ],
      tip: "Same SQL endpoint after regional failover = auto-failover group. Readable reporting secondary = active geo-replication. Deleted/corrupted data = PITR or LTR."
    },
    {
      heading: "Cosmos DB and Storage BCDR",
      table: {
        headers: ["Service / option", "RPO", "RTO", "Key behavior"],
        rows: [
          ["Cosmos DB single region", "Up to hours", "Manual restore", "No regional replica; vulnerable to regional outage"],
          ["Cosmos DB multi-region reads", "About 15 minutes", "About 15 minutes", "Single write region with failover by priority list"],
          ["Cosmos DB multi-region writes", "Near-zero", "Near-zero", "Writes accepted in any region; conflict resolution required"],
          ["Storage LRS", "N/A", "N/A", "Three copies in one datacenter; no regional or zone failover"],
          ["Storage ZRS", "N/A", "N/A", "Three copies across availability zones in one region"],
          ["Storage GRS", "Lag-based", "Microsoft-managed", "Six copies across primary and paired secondary; secondary not normally readable"],
          ["Storage GZRS", "Lag-based", "Microsoft-managed", "ZRS in primary plus geo-replicated secondary"],
          ["Storage RA-GRS / RA-GZRS", "Lag-based", "App can read secondary", "Read access to secondary endpoint is available at all times"]
        ]
      },
      points: [
        "Cosmos DB automatic failover uses the configured priority list; manual failover is available for planned maintenance.",
        "Cosmos DB consistency affects the data-loss and latency tradeoff: strong consistency increases latency, while eventual consistency can allow more divergence.",
        "Storage customer-managed failover can cause data loss based on replication lag; after failover the account becomes LRS in the new region and geo-replication must be re-enabled.",
        "RA-GRS and RA-GZRS do not require failover to read the secondary endpoint; they are useful when the app can route read traffic during primary degradation."
      ],
      tip: "Write availability during regional failure in Cosmos DB = multi-region writes. Readable Azure Storage secondary = RA-GRS or RA-GZRS, not plain GRS/GZRS."
    },
    {
      heading: "DR Strategy Patterns and Azure Implementations",
      table: {
        headers: ["Pattern", "Description", "Typical Azure implementation", "When to use"],
        rows: [
          ["Backup & Restore", "Restore from backup after failure", "Azure Backup plus geo-restore", "Non-critical workloads with hours of acceptable downtime/data loss"],
          ["Pilot Light", "Core DR infrastructure exists but most resources are off or minimal", "ASR replication plus minimal secondary infrastructure", "Lower-cost DR for systems that need more than backup"],
          ["Warm Standby", "Scaled-down replica runs in DR region", "ASR plus scaled-down App Service or VM capacity", "Important workloads with minutes of acceptable downtime"],
          ["Active-Active", "Full deployments serve users in multiple regions", "Front Door or Traffic Manager across complete regional stacks", "Mission-critical, near-zero downtime requirements"],
          ["Active-Passive", "Secondary becomes active only after failover", "ASR recovery plans or Azure SQL auto-failover groups", "Moderate cost with orchestrated failover"]
        ]
      },
      tip: "Higher availability usually costs more. Match the business requirement, not the fanciest pattern."
    },
    {
      heading: "High-Yield Exam Traps",
      table: {
        headers: ["Requirement", "Preferred direction", "Eliminate first"],
        rows: [
          ["Recover deleted or corrupted data", "Backup, PITR, LTR, soft delete", "Geo-replication-only answers"],
          ["Regional outage protection", "Cross-region DR design", "Availability Zones-only answers"],
          ["VM-level recovery in another region", "Azure Site Recovery", "Backup-only answers"],
          ["Safely validate DR", "ASR test failover or service-specific test process", "Designs with no isolated test path"],
          ["Same SQL connection string after failover", "Auto-failover groups", "Active geo-replication-only answers"],
          ["Centralized backup monitoring across subscriptions", "Azure Backup Center", "Opening each Recovery Services Vault individually"]
        ]
      },
      points: [
        "Always design both the data layer and the application endpoint. Surviving data is not enough if users cannot reach the recovered app.",
        "DR plans should include failover and failback. After failover, verify replication direction, DNS or endpoint behavior, and how service is returned to the original region.",
        "Testing is part of the design: ASR test failover exists specifically to validate without affecting production."
      ],
      tip: "On AZ-305, the best answer usually addresses the operational process, not just storage of another copy."
    },
    {
      heading: "Exam skills mapping",
      intro: "Use this as the official AZ-305 checklist for the BCDR domain, then translate each bullet into RTO/RPO, data protection, and endpoint behavior decisions.",
      points: [
        "Recommend a recovery solution for Azure and hybrid workloads that meets recovery objectives: map **RTO/RPO** to backup, ASR, warm standby, active-active, and region-pair designs.",
        "Recommend a backup and recovery solution for compute: Azure Backup for VMs, Recovery Services vaults, backup policies, soft delete, instant restore, and cross-region restore.",
        "Recommend a backup and recovery solution for databases: SQL automated backups/PITR, LTR, geo-restore, failover groups, Cosmos DB continuous/periodic backup, and Azure Backup for SQL in VM.",
        "Recommend a backup and recovery solution for unstructured data: blob point-in-time restore, soft delete, versioning, object replication, Azure Backup for Files, and GRS/RA-GRS.",
        "Recommend a HA solution for compute: availability sets vs zones vs region pairs, VM Scale Sets, zone-aware load balancing, and VM SLAs.",
        "Recommend a HA solution for relational data: zone-redundant SQL, Business Critical, auto-failover groups, and readable replicas.",
        "Recommend a HA solution for semi-structured and unstructured data: ZRS/GZRS, Cosmos DB multi-region, and storage account failover."
      ],
      table: {
        headers: ["RTO/RPO target", "Preferred pattern", "Azure examples"],
        rows: [
          ["Hours RTO / hours RPO", "Backup and restore", "Azure Backup, SQL geo-restore, blob/File restore"],
          ["Minutes-hours RTO / minutes RPO", "Active-passive DR", "ASR recovery plans, SQL failover groups, Cosmos single-write failover"],
          ["Minutes RTO / seconds-minutes RPO", "Warm standby", "Scaled-down DR region, pre-provisioned network and app tier, replicated data"],
          ["Seconds RTO / near-zero RPO", "Active-active or zone redundant HA", "Front Door across regions, Cosmos multi-region writes, zone-redundant SQL"],
          ["Recover deleted/corrupt data", "Backup or PITR, not replication alone", "SQL PITR/LTR, blob PITR/versioning/soft delete, Azure Backup"],
          ["Keep running through local failure", "High availability", "Availability Zones, VMSS across zones, ZRS, zone-redundant SQL"]
        ]
      },
      callout: "**HA** keeps service running through local failures. **DR** restores operations after a major outage, often cross-region. **Backup** restores data after deletion, corruption, or retention events."
    }
  ],

  flashcards: [
    { front: "RPO vs RTO — what is the difference?", back: "**RPO** is maximum acceptable data loss, measured in time. **RTO** is maximum acceptable downtime. Low RPO drives replication/backup frequency; low RTO drives failover/standby design." },
    { front: "What is the one-line difference between HA, DR, and backup?", back: "HA keeps a workload running through local failures; DR restores operations after a major outage, often cross-region; backup restores data after deletion, corruption, or retention needs." },
    { front: "Which vault is required when Azure Site Recovery is mentioned?", back: "A **Recovery Services Vault**. Backup Vault supports newer backup datasources but does not support ASR." },
    { front: "What does Azure Backup soft delete protect against?", back: "Accidental or malicious deletion of backup data. Deleted backup items are retained for 14 days so they can be recovered." },
    { front: "Immutable vault vs MUA", back: "Immutable vault prevents backup data from being modified or deleted. **MUA** adds a secondary approval requirement for critical backup operations." },
    { front: "Azure Backup Center — when is it the answer?", back: "When the scenario asks for centralized backup monitoring, compliance, inventory, reports, or governance across subscriptions, regions, vaults, or resource groups." },
    { front: "ASR test failover vs planned failover vs unplanned failover", back: "Test failover validates in an isolated VNet. Planned failover synchronizes before cutover for zero data loss. Unplanned failover uses the latest recovery point after an outage." },
    { front: "What do ASR recovery plans provide?", back: "Ordered failover groups, manual actions, and Azure Automation runbooks so multi-tier applications fail over in the right sequence." },
    { front: "Availability Zones vs region pairs", back: "Availability Zones protect against datacenter failure inside one region. Region pairs support cross-region redundancy and DR for regional outages." },
    { front: "Azure SQL auto-failover groups vs active geo-replication", back: "Auto-failover groups provide automatic failover and a stable listener endpoint. Active geo-replication provides up to four readable secondaries but failover is manual." },
    { front: "What does SQL PITR do?", back: "Point-in-time restore creates a **new database** at a selected time within the retention window, commonly 7-35 days. It does not overwrite the original database." },
    { front: "When do you choose SQL LTR?", back: "When compliance requires weekly, monthly, or yearly backups for long periods, up to 10 years. LTR is retention, not an HA failover mechanism." },
    { front: "Cosmos DB multi-region writes — why choose it?", back: "It provides near-zero RPO/RTO and write availability in any region during regional failure, but it requires conflict resolution." },
    { front: "GRS vs RA-GRS for Azure Storage", back: "Both replicate to a paired secondary region, but **RA-GRS** exposes a read-only secondary endpoint at all times. Plain GRS does not provide normal read access to the secondary." },
    { front: "What happens after Azure Storage account failover?", back: "The account becomes LRS in the new primary region. You must re-enable geo-replication, and customer-managed failover can lose data because of replication lag." },
    { front: "Backup & Restore vs Active-Active", back: "Backup & Restore is low cost with hours of RTO/RPO. Active-Active is high cost with seconds or near-zero RTO/RPO using full deployments in multiple regions." },
    { front: "The exam asks to validate DR without affecting production — what is the answer?", back: "Use **ASR test failover** into an isolated VNet, or the equivalent service-specific DR test process." },
    { front: "Which answer should you eliminate for regional disaster protection?", back: "Availability Zones-only answers. Zones protect against datacenter failure inside a region, not the loss of the entire region." },
    { front: "Azure-to-Azure ASR vs on-prem-to-Azure ASR", back: "Azure VMs replicate to another Azure region with the mobility extension installed automatically. VMware/physical machines use the Mobility service; Hyper-V uses the ASR Provider on the host." },
    { front: "RTO/RPO decision shortcut", back: "Hours = backup and restore. Minutes-hours = ASR or active-passive. Seconds/near-zero = active-active, zone redundancy, Cosmos multi-region writes, or service-native automatic failover." },
    { front: "Azure VM Backup instant restore", back: "Instant restore uses the snapshot tier so a VM or files can be restored quickly before data is moved only from the vault-standard tier." },
    { front: "SQL Server on Azure VM backup choice", back: "Use Azure Backup for SQL in Azure VMs with a Recovery Services Vault and SQL workload extension for application-aware database backups." },
    { front: "Cosmos DB continuous vs periodic backup", back: "Continuous backup supports point-in-time restore for accidental writes/deletes. Periodic backup restores from scheduled backups, so RPO depends on the backup interval." },
    { front: "Blob recovery safety net", back: "Use blob soft delete, versioning, and point-in-time restore for accidental delete/overwrite. Object replication is for copying objects to another account or region, not historical rollback by itself." },
    { front: "VMSS high availability pattern", back: "Deploy VM Scale Sets across Availability Zones behind a zone-redundant Standard Load Balancer or Application Gateway to survive zone failure and keep compute horizontally scalable." }
  ],

  questions: [
    {
      id: "bcdr-q1", type: "single",
      question: "A payment system can lose at most 30 seconds of committed data and must resume service in less than 5 minutes after a regional outage. Which requirement maps to the 30-second limit?",
      options: ["RTO", "RPO", "SLA", "MTTR"],
      correct: [1],
      explanation: "RPO defines the maximum acceptable data loss measured in time, so a 30-second data-loss limit is an RPO requirement. RTO is the downtime limit, which is the separate 5-minute service recovery requirement.",
      tip: "If the phrase is about data loss, choose RPO. If it is about downtime or service restoration, choose RTO."
    },
    {
      id: "bcdr-q2", type: "single",
      question: "A workload must recover from accidental table deletion and data corruption from yesterday. It already uses geo-replication. What should you add?",
      options: ["Availability Zones", "Point-in-time restore or backup", "Traffic Manager Priority routing", "An availability set"],
      correct: [1],
      explanation: "Geo-replication can replicate corruption or deletion and is primarily for availability. Recovering data from a previous point requires backup or PITR. Zones and availability sets improve local availability but do not restore old data.",
      tip: "Deleted or corrupted data is always a backup/PITR scenario, even when replicas exist."
    },
    {
      id: "bcdr-q3", type: "single",
      question: "You need to protect Azure VMs with cross-region disaster recovery and orchestrated failover plans. Which vault type is required?",
      options: ["Backup Vault", "Recovery Services Vault", "Key Vault", "Storage account with RA-GRS"],
      correct: [1],
      explanation: "Azure Site Recovery uses a Recovery Services Vault. Backup Vault supports newer backup-only datasources such as disks, blobs, and PostgreSQL, but it does not support ASR or recovery plans.",
      tip: "When ASR appears, eliminate Backup Vault immediately."
    },
    {
      id: "bcdr-q4", type: "single",
      question: "A security team wants backup data protected from ransomware operators who try to delete backup items after compromising an admin account. Which combination best addresses this?",
      options: ["LRS plus daily backup", "Immutable vault and multi-user authorization", "Availability Zones and a load balancer", "Active geo-replication"],
      correct: [1],
      explanation: "Immutable vaults prevent backup data from being modified or deleted, and MUA requires secondary approval for critical operations. Replication and zones help availability, but they do not specifically protect backup data from deletion or tampering.",
      tip: "Ransomware or insider deletion against backups points to immutable vault plus MUA, with soft delete as another protection layer."
    },
    {
      id: "bcdr-q5", type: "single",
      question: "An enterprise has dozens of vaults across several subscriptions and wants one place to view backup compliance, unprotected workloads, jobs, alerts, and reports. What should you use?",
      options: ["Azure Backup Center", "A new Recovery Services Vault", "Azure Site Recovery Provider", "Traffic Manager"],
      correct: [0],
      explanation: "Azure Backup Center provides unified inventory, governance, monitoring, alerts, backup reports, and at-scale operations across vaults and subscriptions. A single Recovery Services Vault only manages its own protected items.",
      tip: "Cross-subscription backup governance = Backup Center. Configuring ASR or backup for a specific workload still uses the appropriate vault."
    },
    {
      id: "bcdr-q6", type: "single",
      question: "A team must test VM disaster recovery without disrupting production replication or affecting the production network. Which ASR operation should they run?",
      options: ["Planned failover", "Unplanned failover", "Test failover to an isolated VNet", "Customer-managed storage failover"],
      correct: [2],
      explanation: "ASR test failover validates the recovery plan in an isolated VNet without impacting production or ongoing replication. Planned failover is for controlled cutover, and unplanned failover is for an outage.",
      tip: "The words 'test' and 'without impacting production' point directly to ASR test failover."
    },
    {
      id: "bcdr-q7", type: "single",
      question: "A maintenance window allows a controlled migration of protected VMs to the DR region, and the business requires zero data loss. Which ASR failover type should be used?",
      options: ["Unplanned failover", "Planned failover", "Test failover", "Backup archive restore"],
      correct: [1],
      explanation: "Planned failover synchronizes changes before cutting over, so it is used for maintenance or migration scenarios that require zero data loss. Unplanned failover is immediate and uses the latest recovery point, which can lose recent data.",
      tip: "Controlled event + zero data loss = planned failover. Actual disaster with no time to sync = unplanned failover."
    },
    {
      id: "bcdr-q8", type: "single",
      question: "A three-tier application has domain controllers, databases, and web servers. During DR, databases must start before web servers, and a DNS update must occur between tiers. Which ASR feature provides this orchestration?",
      options: ["Recovery plan", "Backup policy", "Availability set", "Storage lifecycle policy"],
      correct: [0],
      explanation: "ASR recovery plans define ordered failover groups and can include manual actions or Azure Automation runbooks between steps. Backup policies control backup frequency/retention, not application startup sequence.",
      tip: "Ordered waves, runbooks, and manual DR actions are recovery plan clues."
    },
    {
      id: "bcdr-q9", type: "single",
      question: "A VM workload only needs protection from rack or host maintenance failures inside one datacenter cluster. The company wants the lowest-cost HA option. What should you use?",
      options: ["Availability set", "Availability Zone", "ASR to another region", "Active-active multi-region"],
      correct: [0],
      explanation: "Availability sets distribute VMs across fault and update domains in the same datacenter cluster and are the low-cost HA option. Availability Zones protect against datacenter failure within a region, while ASR and active-active address regional DR with higher cost.",
      tip: "Host/rack/update-domain failure = availability set. Datacenter failure in a region = availability zone. Region failure = multi-region DR."
    },
    {
      id: "bcdr-q10", type: "single",
      question: "An application must continue running if an entire Azure datacenter in a region fails, but it does not need protection from loss of the whole region. Which design is most appropriate?",
      options: ["Availability Zones", "Availability Sets only", "Azure Backup archive tier", "SQL long-term retention"],
      correct: [0],
      explanation: "Availability Zones place resources across physically separate datacenters in the same region, protecting against a datacenter-level failure. Availability sets are within a datacenter cluster; backup and LTR do not keep the app online.",
      tip: "Inside one region but across datacenters = zones. Across regions = DR."
    },
    {
      id: "bcdr-q11", type: "single",
      question: "A regional outage must not require application connection string changes for Azure SQL Database. Automatic failover is required for a group of databases. Which feature should you choose?",
      options: ["Active geo-replication", "Auto-failover group", "Point-in-time restore", "Long-term retention"],
      correct: [1],
      explanation: "Auto-failover groups provide automatic failover and listener endpoints that keep the application connection string stable across failover. Active geo-replication has readable secondaries but failover is manual and endpoint handling is less seamless.",
      tip: "Same SQL endpoint or listener after failover = auto-failover group."
    },
    {
      id: "bcdr-q12", type: "single",
      question: "A reporting workload needs readable secondary copies of an Azure SQL database in several regions, and the operations team accepts manual failover. Which option fits best?",
      options: ["Active geo-replication", "PITR", "LTR", "Availability set"],
      correct: [0],
      explanation: "Active geo-replication supports up to four readable secondary databases and manual failover, making it useful for reporting and DR copies. PITR and LTR are restore/retention features, not readable replicas.",
      tip: "Readable SQL secondary is the clue for active geo-replication unless the scenario demands automatic failover and a listener."
    },
    {
      id: "bcdr-q13", type: "single",
      question: "A database administrator must restore an Azure SQL database to exactly 10 days ago after a bad deployment. What should they use?",
      options: ["Point-in-time restore", "Auto-failover group", "Availability Zone", "ASR recovery plan"],
      correct: [0],
      explanation: "Point-in-time restore creates a new database at a selected point within the backup retention window, commonly up to 35 days. Auto-failover groups and zones do not restore a historical copy after logical corruption.",
      tip: "Specific time in the recent past = PITR. Years of compliance retention = LTR."
    },
    {
      id: "bcdr-q14", type: "single",
      question: "A finance workload must keep monthly and yearly Azure SQL backups for 7 years for audit requirements. Which feature should be configured?",
      options: ["Long-term retention", "Active geo-replication", "Traffic Manager Weighted routing", "ASR test failover"],
      correct: [0],
      explanation: "Long-term retention stores weekly, monthly, and yearly SQL backups for compliance scenarios, up to 10 years. Geo-replication and routing help availability but do not satisfy long-term backup retention.",
      tip: "Compliance retention measured in years = LTR."
    },
    {
      id: "bcdr-q15", type: "single",
      question: "A globally distributed Cosmos DB application must accept writes even if any one Azure region is unavailable, with near-zero RTO and RPO. Which configuration is required?",
      options: ["Single-region account with backups", "Multi-region reads with manual failover", "Multi-region writes with conflict resolution", "LRS storage"],
      correct: [2],
      explanation: "Cosmos DB multi-region writes allows writes in any configured region and can achieve near-zero RTO/RPO, but it requires a conflict resolution policy. Multi-region reads still has a single write region.",
      tip: "Write availability during regional failure = Cosmos DB multi-region writes, also called multi-master."
    },
    {
      id: "bcdr-q16", type: "single",
      question: "An Azure Storage account must provide read access to a secondary region at all times, even before Microsoft initiates any failover. Which redundancy option should you select?",
      options: ["LRS", "ZRS", "GRS", "RA-GRS"],
      correct: [3],
      explanation: "RA-GRS provides a read-only secondary endpoint that applications can use at all times. GRS replicates to a secondary paired region but does not normally expose read access. LRS and ZRS do not provide geo-read access.",
      tip: "The `RA` prefix means read-access to the secondary endpoint."
    },
    {
      id: "bcdr-q17", type: "single",
      question: "After a customer-managed Azure Storage account failover to the secondary region, what must the architect plan for?",
      options: ["The account remains GRS automatically", "The account becomes LRS in the new region and geo-replication must be re-enabled", "All writes are blocked forever", "The old primary remains the write endpoint"],
      correct: [1],
      explanation: "After storage account failover, the secondary becomes the new primary and the account is configured as LRS. Geo-redundancy must be re-enabled if continued cross-region protection is required. Customer-managed failover can also lose data because of replication lag.",
      tip: "Storage failover is not the end of DR; remember the post-failover state and re-protection step."
    },
    {
      id: "bcdr-q18", type: "single",
      question: "A non-critical internal app can tolerate several hours of downtime and several hours of data loss. The main requirement is lowest cost. Which DR pattern fits best?",
      options: ["Active-active", "Warm standby", "Backup and restore", "Full multi-region deployment behind Front Door"],
      correct: [2],
      explanation: "Backup and restore is the lowest-cost DR pattern and fits workloads with hours of acceptable RTO and RPO. Warm standby and active-active reduce downtime/data loss but cost more because secondary resources are running.",
      tip: "Hours of RTO/RPO plus lowest cost = backup and restore. Seconds or near-zero requirements push toward active-active."
    },
    {
      id: "bcdr-q19", type: "multi",
      question: "Which statements correctly distinguish backup, HA, and DR? (Select all that apply.)",
      options: [
        "Backup is the primary solution for recovering deleted or corrupted data",
        "High availability usually focuses on keeping service running through local failures",
        "Availability Zones alone protect against complete regional outages",
        "Disaster recovery focuses on restoring operations after a major outage, often in another region"
      ],
      correct: [0, 1, 3],
      explanation: "Backup is for data recovery, HA is for local uptime, and DR is for restoring operations after major outages such as regional failure. Availability Zones protect against datacenter failure within a region, not loss of the entire region.",
      tip: "On multi-select, reject any option that expands zones into full regional DR."
    },
    {
      id: "bcdr-q20", type: "multi",
      question: "Which Azure Backup features help protect backup data from accidental deletion, ransomware, or unauthorized destructive operations? (Select all that apply.)",
      options: [
        "Soft delete",
        "Immutable vault",
        "Multi-user authorization",
        "Availability set"
      ],
      correct: [0, 1, 2],
      explanation: "Soft delete retains deleted backup data for 14 days, immutable vaults block modification/deletion of backup data, and MUA requires another approver for critical actions. Availability sets are a VM HA construct and do not protect backup data.",
      tip: "If the option is about VM placement, it is not a backup security feature."
    },
    {
      id: "bcdr-q21", type: "multi",
      question: "Which statements about ASR failover operations are TRUE? (Select all that apply.)",
      options: [
        "Test failover can validate recovery in an isolated VNet without production impact",
        "Planned failover synchronizes before cutover and is used for controlled events",
        "Unplanned failover waits for a perfect final synchronization before starting",
        "Recovery plans can include manual steps and Azure Automation runbooks"
      ],
      correct: [0, 1, 3],
      explanation: "Test failover is isolated, planned failover is synchronized for controlled cutover, and recovery plans can orchestrate groups, manual actions, and runbooks. Unplanned failover is used during outages and uses the latest available recovery point rather than waiting for final sync.",
      tip: "Unplanned failover trades perfection for speed; eliminate answers that claim it guarantees final synchronization."
    },
    {
      id: "bcdr-q22", type: "multi",
      question: "A storage architect is comparing redundancy options for production BCDR. Which statements are correct? (Select all that apply.)",
      options: [
        "ZRS stores copies across availability zones in a single region",
        "RA-GZRS combines zone redundancy in the primary region with read access to a geo-secondary",
        "LRS protects against a full regional outage by itself",
        "GRS and GZRS use a secondary paired region"
      ],
      correct: [0, 1, 3],
      explanation: "ZRS spreads data across zones in one region, RA-GZRS combines ZRS in the primary with a readable geo-secondary, and GRS/GZRS replicate to a paired secondary region. LRS keeps copies in one datacenter and does not protect against regional outage.",
      tip: "Look at the letters: Z = zones, G = geo, RA = readable secondary. LRS is local only."
    },
    {
      id: "bcdr-q23", type: "single",
      question: "A company runs VMware VMs on-premises and wants to recover them as Azure VMs after a datacenter outage. The target RTO is hours, RPO is minutes, and failover steps must be orchestrated. What should you recommend?",
      options: ["Azure Site Recovery to Azure with mobility service and recovery plans", "Azure Backup with archive tier only", "Availability Zones in the on-premises datacenter", "Storage account GRS"],
      correct: [0],
      explanation: "ASR supports VMware-to-Azure replication using the Mobility service and Configuration/Process server, and recovery plans orchestrate ordered failover. Backup-only restore is slower and does not provide VM-level orchestration; zones and storage redundancy do not protect on-prem VMs.",
      tip: "Hybrid VM DR to Azure with ordered failover is an ASR scenario, not a backup-only scenario."
    },
    {
      id: "bcdr-q24", type: "single",
      question: "An architect must choose a DR region for Azure resources. The company wants Microsoft-recommended regional pairing behavior within the same geography when possible and service support for geo-redundant recovery. What should guide the selection?",
      options: ["Choose the paired Azure region for the primary region", "Choose any region with the lowest VM price only", "Use Availability Zones instead of a second region", "Use an availability set in the primary region"],
      correct: [0],
      explanation: "Azure region pairs are designed for geo-redundant service placement, coordinated platform updates, and disaster recovery priority within a geography where possible. Availability Zones and availability sets improve in-region availability but do not provide a separate regional recovery location.",
      tip: "If the failure scope is a whole region, the answer must include another region; zones and availability sets are not enough."
    },
    {
      id: "bcdr-q25", type: "single",
      question: "A team needs daily backups of Azure VMs, 30-day retention, quick file-level restore from recent backups, and protection if a backup item is accidentally deleted. Which design fits?",
      options: ["Recovery Services Vault with an Azure VM backup policy, instant restore, and soft delete", "Traffic Manager Priority routing", "Azure SQL active geo-replication", "A VM availability set only"],
      correct: [0],
      explanation: "Azure VM Backup uses a vault and backup policy for schedule and retention, snapshot-tier instant restore for quick recovery, and soft delete for deleted backup items. Traffic routing and VM placement do not provide backup recovery.",
      tip: "Schedule plus retention plus restore of VM data = Azure Backup policy in a vault."
    },
    {
      id: "bcdr-q26", type: "single",
      question: "An administrator deleted a protected Azure VM backup item yesterday. The organization did not intend to stop protection. What Azure Backup feature allows recovery of the deleted backup data?",
      options: ["Soft delete", "Availability Zone", "Object replication", "Cosmos DB failover priority"],
      correct: [0],
      explanation: "Azure Backup soft delete retains deleted backup data for 14 days, allowing recovery after accidental or malicious deletion. Availability Zones, object replication, and Cosmos failover priority do not recover deleted VM backup items.",
      tip: "Deleted backup item within 14 days = soft delete."
    },
    {
      id: "bcdr-q27", type: "single",
      question: "A SQL Server database runs inside an Azure VM. The business requires application-consistent database backups managed by Azure, not just crash-consistent VM disk snapshots. What should you configure?",
      options: ["Azure Backup for SQL Server in Azure VMs using a Recovery Services Vault", "Blob versioning on the VM disks", "Traffic Manager Weighted routing", "Storage account customer-managed failover"],
      correct: [0],
      explanation: "Azure Backup for SQL Server in Azure VMs uses the SQL workload extension and a Recovery Services Vault to provide application-aware SQL backups. VM disk snapshots alone are not the database-specific backup solution.",
      tip: "SQL inside a VM is still a database workload; choose Azure Backup for SQL in VM when app-consistent SQL backup is required."
    },
    {
      id: "bcdr-q28", type: "single",
      question: "A Cosmos DB workload must recover from an accidental container delete to a specific time shortly before the incident. Which backup mode best fits this recovery requirement?",
      options: ["Continuous backup with point-in-time restore", "Periodic backup with the longest possible interval", "Availability set", "Storage account RA-GRS"],
      correct: [0],
      explanation: "Cosmos DB continuous backup supports point-in-time restore for accidental writes or deletes. Periodic backup restores from scheduled points, so the recovery point is limited by the backup interval and may not meet precise restore requirements.",
      tip: "Precise Cosmos rollback after accidental change = continuous backup and PITR."
    },
    {
      id: "bcdr-q29", type: "multi",
      question: "A storage account holds critical blobs. Users frequently overwrite files by mistake, and auditors require the ability to roll back blob data to an earlier time. Which capabilities should be part of the design? (Select all that apply.)",
      options: [
        "Blob versioning",
        "Blob soft delete",
        "Blob point-in-time restore",
        "Availability set"
      ],
      correct: [0, 1, 2],
      explanation: "Versioning, soft delete, and blob point-in-time restore work together to recover from accidental deletes or overwrites and roll data back. Availability sets apply to VM placement and do not protect blob data versions.",
      tip: "For unstructured data recovery, look for blob-native data protection features; VM HA terms are distractors."
    },
    {
      id: "bcdr-q30", type: "single",
      question: "A file share used by branch offices is hosted in Azure Files. The company needs scheduled backups and the ability to restore individual files from snapshots. What should you recommend?",
      options: ["Azure Backup for Azure Files using a Recovery Services Vault", "Azure Site Recovery recovery plan", "Cosmos DB continuous backup", "VM Scale Sets across zones"],
      correct: [0],
      explanation: "Azure Backup protects Azure Files with snapshot-based backups configured through a Recovery Services Vault, enabling item-level file restore. ASR is for workload replication, not file-share backup.",
      tip: "Azure Files backup = Azure Backup with snapshot-based protection, not ASR."
    },
    {
      id: "bcdr-q31", type: "single",
      question: "A stateless web tier runs on VMs and must remain available if one availability zone fails. It also needs automatic scale-out under load. Which compute HA design should you choose?",
      options: ["VM Scale Set deployed across Availability Zones behind a zone-redundant Standard Load Balancer", "Single VM with LRS disks", "Availability set in one datacenter only", "Azure Backup archive tier"],
      correct: [0],
      explanation: "A VM Scale Set can distribute instances across Availability Zones and scale out automatically. A zone-redundant Standard Load Balancer spreads traffic across healthy instances. Availability sets do not survive a zone failure, and backup is not an HA mechanism.",
      tip: "Stateless compute + scale-out + zone failure = VMSS across zones with a zone-aware load balancer."
    },
    {
      id: "bcdr-q32", type: "multi",
      question: "A relational data tier requires high availability inside a region and a clean cross-region failover path with minimal application changes. Which choices help meet those goals? (Select all that apply.)",
      options: [
        "Zone-redundant Azure SQL configuration where supported",
        "Azure SQL auto-failover group with listener endpoint",
        "Business Critical tier for low-latency replicas and fast failover characteristics",
        "Blob soft delete as the primary SQL HA mechanism"
      ],
      correct: [0, 1, 2],
      explanation: "Zone-redundant SQL improves in-region resilience, auto-failover groups provide cross-region failover with a stable listener endpoint, and Business Critical provides high-availability characteristics through local replicas. Blob soft delete protects blobs, not relational SQL availability.",
      tip: "For relational HA, choose database-native HA and failover features; blob data protection features are unrelated distractors."
    }
  ]
});
