AZ305.registerSection({
  id: "migrations",
  title: "Migrations",
  domain: "Infrastructure Solutions",
  weight: "30–35%",
  icon: "📦",
  order: 4,
  summary: "Migration design questions test whether you can choose the right **rationalization strategy**, assess dependencies and sizing, and pick the correct tool for servers, databases, web apps, and data transfer. Remember that assessment comes before cutover, and **minimal downtime** usually changes the tool or migration mode.",

  notes: [
    {
      heading: "CAF Migration Methodology and the 6 R's",
      intro: "In the Cloud Adoption Framework, migration is part of the Adopt phase and follows assess, deploy, and release activities.",
      table: {
        headers: ["Strategy", "Meaning", "Choose when", "Example"],
        rows: [
          ["Rehost", "Lift-and-shift", "Minimal change and fastest move to IaaS", "Move SQL Server VM to an Azure VM"],
          ["Refactor", "Move to PaaS with minor changes", "Use managed services without major rewrite", "ASP.NET app to App Service"],
          ["Rearchitect", "Modify architecture significantly", "Cloud-native scale, resilience, or microservices", "Monolith to microservices"],
          ["Rebuild", "Rewrite from scratch", "Existing app no longer meets needs", "Legacy app rebuilt on Functions"],
          ["Replace", "Use SaaS", "Commodity capability exists as SaaS", "CRM to Dynamics 365"],
          ["Retire", "Decommission", "App is unused or redundant", "Remove unused legacy system" ]
        ]
      },
      points: [
        "**Assess** discovers workloads, analyzes dependencies, right-sizes targets, and estimates TCO.",
        "**Deploy** replicates workloads and tests them in Azure.",
        "**Release** cuts over traffic and decommissions the old environment."
      ],
      tip: "Minimal effort equals Rehost; minor PaaS changes equals Refactor; major code or architecture change equals Rearchitect; SaaS replacement equals Replace."
    },
    {
      heading: "Azure Migrate Hub and Assessments",
      table: {
        headers: ["Tool or assessment", "Purpose"],
        rows: [
          ["Discovery and Assessment", "Agentless discovery of VMs, dependencies, performance data, readiness, and cost"],
          ["Server Migration", "Replicate and migrate on-premises VMs to Azure"],
          ["Database assessment", "Assess SQL Server databases for Azure SQL readiness"],
          ["Web App Assessment", "Assess IIS web apps for App Service migration"],
          ["AVS assessment", "Assess VMware VMs for Azure VMware Solution" ]
        ]
      },
      points: [
        "The **Azure Migrate appliance** is deployed on-premises and supports VMware, Hyper-V, and physical server discovery.",
        "**As on-premises sizing** matches existing configuration; **performance-based sizing** right-sizes from actual CPU and memory utilization.",
        "Dependency analysis should be used before grouping and sequencing migrations."
      ],
      tip: "When a question asks to discover, assess, right-size, or calculate costs for servers, start with Azure Migrate Discovery and Assessment — not DMS."
    },
    {
      heading: "Dependency Analysis and Server Migration Paths",
      table: {
        headers: ["Source", "Migration mechanism", "Exam clue"],
        rows: [
          ["VMware VMs", "Agentless replication via vCenter snapshots or agent-based Mobility Service", "Agentless supports large VMware assessments and migrations"],
          ["Hyper-V VMs", "Hyper-V Replication Provider on the host", "Replicates to Azure Recovery Services vault"],
          ["Physical servers", "Mobility Service agent on each server", "Also covers Xen, KVM, and other cloud VMs"],
          ["Dependency analysis agentless", "Uses vCenter APIs", "Quick setup, no agents, less process detail"],
          ["Dependency analysis agent-based", "MMA plus Dependency agent", "Detailed process-level mapping and ports" ]
        ]
      },
      points: [
        "A typical server migration sequence is **Discover**, **Assess**, **Replicate**, **Test Migration**, then **Migrate**.",
        "Test migration validates the workload in Azure without committing the final cutover and is strongly recommended.",
        "After cutover, stop replication and decommission the old source only when validation is complete."
      ],
      tip: "Agentless dependency analysis is quick and uses hypervisor data. If the exam asks for process names or ports, agent-based analysis is the better fit."
    },
    {
      heading: "Database Migration Service and Database Targets",
      table: {
        headers: ["Decision", "Choose"],
        rows: [
          ["Minimal downtime database migration", "DMS online migration with continuous sync and cutover"],
          ["Downtime window acceptable", "DMS offline migration, backup/restore, or export/import"],
          ["SQL Server needs SQL Agent, linked servers, CLR, cross-database queries", "Azure SQL Managed Instance"],
          ["SQL Server app can refactor away instance-level dependencies", "Azure SQL Database"],
          ["MongoDB migration to Azure", "DMS to Azure Cosmos DB API for MongoDB"],
          ["Non-SQL source schema conversion", "SQL Server Migration Assistant where applicable" ]
        ]
      },
      points: [
        "**Online migration** keeps the source live during continuous sync and only needs downtime for final cutover.",
        "**Offline migration** is simpler but requires downtime for the migration window.",
        "DMS targets include Azure SQL Database, Azure SQL Managed Instance, Azure Database for MySQL, Azure Database for PostgreSQL, and Cosmos DB API for MongoDB."
      ],
      tip: "DMS is for databases, not VMs, files, or generic app migration. Minimal downtime is the keyword for online migration."
    },
    {
      heading: "Unstructured Data Transfer Tools",
      table: {
        headers: ["Tool", "Best for", "Decision clue"],
        rows: [
          ["Azure Storage Mover", "Managed file and blob migration", "NFS/SMB shares to Azure Storage with agents and job tracking"],
          ["AzCopy", "Scripted online copy", "Blob, Files, Data Lake Gen2, incremental sync, good network"],
          ["Data Box Disk", "Offline transfer up to 35 TB", "Small-medium offline shipment"],
          ["Data Box", "80 TB usable offline appliance", "Medium-large offline transfer"],
          ["Data Box Heavy", "770 TB usable", "Hundreds of TB to PB-scale offline transfer" ]
        ]
      },
      points: [
        "Use Data Box when uploading would take more than **7–14 days** or connectivity is unreliable or unavailable.",
        "For data under about 40 TB with good internet, prefer AzCopy or Storage Mover for files and blobs.",
        "Databases should use DMS or database-native backup/restore rather than file copy tools."
      ],
      tip: "Poor connectivity or hundreds of TB eliminates internet-only transfer. Good connectivity and manageable volume usually eliminates Data Box."
    },
    {
      heading: "Web App Migration and Containerization",
      table: {
        headers: ["Scenario", "Tool or strategy"],
        rows: [
          ["Assess IIS app compatibility for App Service", "App Service Migration Assistant or Web App Assessment"],
          ["Migrate ASP.NET app to App Service with minor changes", "Refactor"],
          ["Containerize Java or ASP.NET app without code changes", "Azure Migrate App Containerization"],
          ["Deploy containerized app to a managed platform", "App Service for Containers or AKS depending on orchestration needs"],
          ["Monolith becomes microservices", "Rearchitect" ]
        ]
      },
      points: [
        "App Service Migration Assistant analyzes compatibility, generates deployment artifacts, and can remediate common issues.",
        "Azure Migrate App Containerization can create Docker images for Java or ASP.NET apps and deploy them to App Service for Containers or AKS.",
        "Containerization can avoid code changes, but choosing AKS still requires a valid orchestration requirement."
      ],
      tip: "IIS to App Service is usually refactor with Migration Assistant. Containerize to AKS only when the scenario asks for containers or Kubernetes-style deployment."
    },
    {
      heading: "Common Migration Patterns",
      table: {
        headers: ["Pattern", "Target", "Reason"],
        rows: [
          ["SQL Server lift-and-shift", "Azure SQL Managed Instance", "Near-full compatibility with SQL Agent, linked servers, CLR, cross-database queries"],
          ["SQL Server modernization", "Azure SQL Database", "Automatic tuning, built-in HA, elastic pools, serverless options"],
          ["VMware VMs with minimal change", "Azure VMs through Azure Migrate Server Migration", "Agentless replication and IaaS target"],
          ["On-prem app to AKS", "Containerize then deploy to AKS", "Rearchitect to containers and migrate databases separately"],
          ["Legacy CRM to SaaS", "Dynamics 365 or other SaaS", "Replace strategy" ]
        ]
      },
      points: [
        "For SQL MI, migration can be DMS online or backup to Azure Blob followed by restore.",
        "For Azure SQL Database, remove unsupported SQL Server instance dependencies and use DMS or BACPAC export/import.",
        "Database migration is usually planned separately from app or VM migration because cutover timing and data consistency drive the risk."
      ],
      tip: "SQL Agent, linked servers, and near-full SQL Server compatibility are SQL MI clues. If the app can modernize and shed instance features, SQL Database becomes viable."
    },
    {
      heading: "Migration Exam Traps and Rapid Elimination",
      table: {
        headers: ["Requirement", "Eliminate first", "Likely direction"],
        rows: [
          ["Discover and assess servers", "DMS-only answers", "Azure Migrate"],
          ["Existing SQL Agent or linked servers", "Azure SQL Database-first answers", "Azure SQL Managed Instance"],
          ["200 TB with poor connectivity", "Internet transfer-only answers", "Data Box or Data Box Heavy"],
          ["Near-zero downtime database migration", "Offline-only answers", "DMS online migration"],
          ["File migration, not database migration", "DMS-first answers", "Storage Mover, AzCopy, or Data Box"],
          ["Managed services and elasticity required", "Rehost-only answer", "Refactor or rearchitect" ]
        ]
      },
      points: [
        "Do not skip assessment and dependency analysis when the scenario asks for readiness, cost, or grouping decisions.",
        "Do not choose Rehost just because it is safest if the stated goal is modernization, elasticity, or managed platform services.",
        "Do not choose offline transfer when the network and volume make online tools practical."
      ],
      tip: "Separate migration object types: servers use Azure Migrate; databases use DMS; files and blobs use Storage Mover, AzCopy, or Data Box; web apps use Migration Assistant or containerization."
    },

    {
      heading: "Exam skills mapping",
      points: [
        "Evaluate a migration with the **Cloud Adoption Framework**: Strategy, Plan, Ready, Adopt, Govern, Manage; migration assess, deploy, release; 6 R rationalization including rehost, refactor, rearchitect, rebuild, replace, retain, and retire.",
        "Evaluate on-premises **servers, data, and apps**: Azure Migrate appliance, Discovery and Assessment, dependency analysis, performance-based sizing, web app and database assessments.",
        "Migrate workloads to **IaaS and PaaS**: Azure Migrate Server Migration for VMs, App Service Migration Assistant for IIS apps, and App Containerization for Java or ASP.NET containers.",
        "Migrate **databases**: Database Migration Service online vs offline, Data Migration Assistant for SQL Server assessment, SSMA for non-SQL sources, and target choice between SQL Database and SQL MI.",
        "Migrate **unstructured data**: AzCopy, Azure Storage Mover, Azure Data Box family, and Azure File Sync when ongoing server-to-Azure file synchronization is required."
      ],
      tip: "Choose the migration tool by workload type first: server, database, web app, containerized app, file share, or offline bulk data."
    }
  ],

  flashcards: [
    { front: "CAF migration phases", back: "**Assess** discover and right-size, **Deploy** replicate and test, **Release** cut over and decommission." },
    { front: "6 R's quick rule", back: "Rehost = lift-and-shift, Refactor = minor PaaS changes, Rearchitect = major architecture change, Rebuild = rewrite, Replace = SaaS, Retire = decommission." },
    { front: "Azure Migrate purpose", back: "Central hub for discovery, assessment, dependency analysis, right-sizing, and migration of servers, databases, web apps, and virtual desktops." },
    { front: "As on-premises vs performance-based sizing", back: "As on-premises matches current VM specs. Performance-based uses actual CPU and memory utilization to right-size and reduce cost." },
    { front: "Agentless vs agent-based dependency analysis", back: "Agentless uses vCenter APIs and needs no agents. Agent-based uses MMA plus Dependency agent for process-level and port-level detail." },
    { front: "Azure Migrate appliance", back: "A lightweight on-premises virtual appliance for continuous discovery and assessment of VMware, Hyper-V, and physical servers." },
    { front: "Server migration sequence", back: "Discover, Assess, Replicate, Test Migration, Migrate. Test migration validates in Azure before final cutover." },
    { front: "VMware migration with minimal change", back: "Use Azure Migrate Server Migration, often with agentless vCenter snapshot-based replication to Azure VMs." },
    { front: "Physical server migration mechanism", back: "Install the Mobility Service agent on each physical server; also applies to other hypervisors and cloud VMs." },
    { front: "DMS online vs offline", back: "Online migration continuously syncs while the source stays live and has minimal cutover downtime. Offline is a one-time migration with downtime during the move." },
    { front: "DMS is for what?", back: "Database migrations to Azure data targets such as Azure SQL Database, SQL MI, MySQL, PostgreSQL, and Cosmos DB API for MongoDB — not VM or file migration." },
    { front: "SQL MI migration clue", back: "Choose Azure SQL Managed Instance when SQL Server compatibility is critical: SQL Agent, linked servers, CLR, or cross-database queries." },
    { front: "Azure SQL Database migration clue", back: "Choose Azure SQL Database when the app can refactor away instance-level dependencies and wants PaaS benefits like automatic tuning and built-in HA." },
    { front: "Storage Mover vs AzCopy", back: "Storage Mover is a managed agent-based service for files/blobs with job tracking. AzCopy is a command-line tool for scripted online copy and incremental sync." },
    { front: "When to use Data Box", back: "Use Data Box when upload would take more than 7–14 days, connectivity is unreliable, or the data volume is too large for online transfer." },
    { front: "Data Box capacities", back: "Data Box Disk up to 35 TB, Data Box 80 TB usable, Data Box Heavy 770 TB usable." },
    { front: "IIS app to App Service", back: "Use App Service Migration Assistant or Azure Migrate Web App Assessment; this is usually a Refactor strategy." },
    { front: "App Containerization tool", back: "Azure Migrate App Containerization containerizes Java or ASP.NET apps into Docker images and deploys to App Service for Containers or AKS." },
    { front: "Migration object-to-tool mapping", back: "Servers = Azure Migrate; databases = DMS; files/blobs = Storage Mover, AzCopy, or Data Box; IIS web apps = Migration Assistant; SaaS replacement = Replace." },
    { front: "Most common SQL migration trap", back: "Do not pick Azure SQL Database when the workload needs SQL Agent, linked servers, CLR, or near-full SQL Server compatibility; pick SQL Managed Instance." },

    { front: "Retain vs retire", back: "Retain means keep the workload in place for now due to dependency, timing, or business reasons. Retire means decommission it because it is unused or redundant." },
    { front: "Data Migration Assistant vs DMS", back: "Data Migration Assistant assesses SQL Server compatibility and blockers before migration. DMS performs the actual online or offline database migration to Azure targets." },
    { front: "Azure File Sync migration clue", back: "Use Azure File Sync when on-premises Windows file servers must continue syncing or caching Azure Files, especially for phased file-server migration or hybrid access." },
    { front: "Database target compatibility rule", back: "SQL MI preserves SQL Server instance features. Azure SQL Database is best when the app can modernize away from instance-level features." },
    { front: "AVS assessment", back: "Azure VMware Solution assessment evaluates VMware VMs for running as-is on AVS when the business wants VMware operational consistency rather than immediate replatforming." }
  ],

  questions: [
    {
      id: "mig-q1", type: "single",
      question: "A company wants to move a legacy VM to Azure as quickly as possible with no code changes and keep full OS control. Which migration strategy is this?",
      options: ["Rehost", "Refactor", "Rearchitect", "Replace"],
      correct: [0],
      explanation: "Rehost is lift-and-shift: moving the workload as-is to IaaS with minimal or no code changes. Refactor would involve minor changes to use PaaS, rearchitect would significantly change the design, and replace would move to SaaS.",
      tip: "No code changes plus IaaS VM equals Rehost. The exam often describes this as lift-and-shift."
    },
    {
      id: "mig-q2", type: "single",
      question: "An ASP.NET web app can move to App Service after minor configuration changes and without a major redesign. Which 6 R strategy applies?",
      options: ["Rehost", "Refactor", "Rebuild", "Retire"],
      correct: [1],
      explanation: "Refactor means making minor changes to use a managed PaaS platform such as App Service. Rehost would keep the app on VMs. Rebuild means rewriting from scratch, and retire means decommissioning the app.",
      tip: "Minor changes to use PaaS equals Refactor; major redesign equals Rearchitect."
    },
    {
      id: "mig-q3", type: "single",
      question: "A CRM application is being replaced entirely by Dynamics 365. Which rationalization strategy is this?",
      options: ["Replace", "Rebuild", "Refactor", "Rehost"],
      correct: [0],
      explanation: "Replacing a custom or legacy capability with a SaaS product is the Replace strategy. Rebuild would create a new custom application, while refactor and rehost keep the existing application in some form.",
      tip: "If a SaaS product takes over the function, choose Replace."
    },
    {
      id: "mig-q4", type: "multi",
      question: "Which activities belong in the assessment phase before migration? (Select all that apply.)",
      options: [
        "Discover workloads and dependencies",
        "Right-size Azure targets using performance data",
        "Estimate migration cost or TCO",
        "Decommission the on-premises source immediately"
      ],
      correct: [0, 1, 2],
      explanation: "Assessment includes discovery, dependency analysis, right-sizing, readiness, and cost/TCO estimation. Decommissioning happens after successful cutover and validation during release, not before migration begins.",
      tip: "Assessment is about learning and planning. Anything that cuts over or decommissions belongs later."
    },
    {
      id: "mig-q5", type: "single",
      question: "A company must discover and assess 500 on-premises VMware VMs, analyze dependencies, and estimate Azure VM costs before choosing migration waves. Which tool should be used first?",
      options: ["Azure Database Migration Service", "Azure Migrate Discovery and Assessment", "AzCopy", "App Service Deployment Center"],
      correct: [1],
      explanation: "Azure Migrate Discovery and Assessment is the central tool for server discovery, dependency analysis, right-sizing, readiness, and cost estimation. DMS is for databases, AzCopy is for storage data transfer, and Deployment Center is for app deployment setup.",
      tip: "Discover/assess/right-size servers equals Azure Migrate, not DMS."
    },
    {
      id: "mig-q6", type: "single",
      question: "An architect wants Azure Migrate to size target VMs based on actual CPU and memory utilization instead of matching current VM sizes. Which sizing approach should be selected?",
      options: ["As on-premises", "Performance-based", "Data Box Heavy", "Offline migration"],
      correct: [1],
      explanation: "Performance-based sizing uses collected utilization data to right-size Azure VM recommendations and can reduce cost. As on-premises sizing maps current configuration directly. Data Box and offline migration are unrelated to assessment sizing.",
      tip: "Actual utilization and right-sizing are the words that identify performance-based assessment."
    },
    {
      id: "mig-q7", type: "single",
      question: "A VMware environment needs quick dependency mapping without installing agents on each VM. Which dependency analysis type should you use?",
      options: ["Agentless dependency analysis", "Agent-based dependency analysis", "DMS online migration", "SQL Server Migration Assistant"],
      correct: [0],
      explanation: "Agentless dependency analysis uses vCenter APIs and does not require agents, making it fast and low-touch. Agent-based analysis provides deeper process and port details but requires installing agents. DMS and SSMA are database tools.",
      tip: "No agents and VMware/vCenter means agentless. Process-level details or ports point to agent-based."
    },
    {
      id: "mig-q8", type: "single",
      question: "A physical server running on bare metal must be migrated to Azure. Which replication approach is required?",
      options: ["Agentless vCenter snapshots", "Mobility Service agent installed on the server", "Hyper-V Replication Provider only", "App Service Migration Assistant"],
      correct: [1],
      explanation: "Physical servers require the Mobility Service agent installed on each source server for replication. Agentless vCenter snapshot replication applies to VMware VMs, and the Hyper-V Replication Provider applies to Hyper-V hosts. App Service Migration Assistant is for IIS web apps.",
      tip: "Physical, Xen, KVM, or other-cloud VM migration generally means Mobility Service agent."
    },
    {
      id: "mig-q9", type: "single",
      question: "A SQL Server database must move to Azure with minimal downtime while the source remains online until final cutover. Which migration mode should be used?",
      options: ["DMS online migration", "DMS offline migration", "AzCopy sync", "Data Box Disk"],
      correct: [0],
      explanation: "DMS online migration continuously synchronizes changes while the source stays live and requires only cutover downtime. Offline migration is simpler but requires downtime during the migration. AzCopy and Data Box are for storage data, not live database migration.",
      tip: "Minimal downtime database migration equals DMS online. If downtime window is acceptable, offline may be sufficient."
    },
    {
      id: "mig-q10", type: "single",
      question: "An on-premises SQL Server workload uses SQL Agent jobs, linked servers, CLR, and cross-database queries. Which Azure database target best preserves compatibility?",
      options: ["Azure SQL Database", "Azure SQL Managed Instance", "Azure Table Storage", "Azure Cosmos DB for NoSQL"],
      correct: [1],
      explanation: "Azure SQL Managed Instance provides near-full SQL Server compatibility, including features such as SQL Agent, linked servers, CLR, and cross-database queries. Azure SQL Database is more PaaS-native but lacks several instance-level features. Table Storage and Cosmos DB are not SQL Server compatibility targets.",
      tip: "SQL Agent or linked servers are high-signal SQL Managed Instance clues."
    },
    {
      id: "mig-q11", type: "single",
      question: "A SQL Server app can remove instance-level dependencies and wants automatic tuning, built-in HA, and elastic pools. Which target is most appropriate?",
      options: ["Azure SQL Database", "Azure SQL Managed Instance", "SQL Server on Azure VM", "Azure Files"],
      correct: [0],
      explanation: "Azure SQL Database is the right modernization target when the app can refactor away instance-level SQL Server dependencies and wants PaaS features such as automatic tuning, built-in HA, serverless options, and elastic pools. SQL MI is preferred for compatibility, and SQL Server on VM retains more management overhead.",
      tip: "PaaS modernization benefits plus no instance dependency equals Azure SQL Database."
    },
    {
      id: "mig-q12", type: "multi",
      question: "Which migration tool mappings are correct? (Select all that apply.)",
      options: [
        "Azure Migrate Server Migration for VMware VMs moving to Azure VMs",
        "DMS for database migrations to Azure SQL or Azure Database for MySQL/PostgreSQL",
        "AzCopy for scripted online copy to Azure Storage",
        "DMS for large SMB file share migration to Azure Files"
      ],
      correct: [0, 1, 2],
      explanation: "Azure Migrate handles server migration, DMS handles database migrations, and AzCopy handles scripted storage transfers. DMS is not the tool for SMB file share migration; Storage Mover, AzCopy, Azure File Sync, or Data Box-style tools fit file scenarios depending on volume and connectivity.",
      tip: "Map the object type first: server, database, or file/blob. That eliminates many distractors."
    },
    {
      id: "mig-q13", type: "single",
      question: "A company needs to move 200 TB of file data to Azure, but the internet connection is unreliable and upload would take weeks. Which transfer option should you recommend?",
      options: ["AzCopy over the internet", "Azure Data Box", "DMS online migration", "App Service Migration Assistant"],
      correct: [1],
      explanation: "Data Box is appropriate when data volume and connectivity make online transfer impractical, especially when upload would take more than 7–14 days. AzCopy is better with good connectivity and manageable volume. DMS is for databases, and App Service Migration Assistant is for web apps.",
      tip: "Huge data plus poor connectivity equals offline Data Box."
    },
    {
      id: "mig-q14", type: "single",
      question: "A team needs to transfer 20 TB of blobs to Azure over a reliable high-bandwidth connection and wants a scriptable command-line tool with incremental sync. Which option fits?",
      options: ["AzCopy", "Data Box Heavy", "Azure Database Migration Service", "Azure VMware Solution assessment"],
      correct: [0],
      explanation: "AzCopy supports command-line scripted copy and sync for Blob, Files, and Data Lake Gen2 and is appropriate when connectivity is good and data volume is manageable. Data Box Heavy is excessive and intended for very large offline transfer. DMS and AVS assessment are unrelated.",
      tip: "Good network plus scriptable storage transfer equals AzCopy; poor network or massive volume pushes to Data Box."
    },
    {
      id: "mig-q15", type: "single",
      question: "A migration project must move NFS and SMB shares into Azure Storage with managed jobs, on-premises agents, and progress tracking. Which service best fits?",
      options: ["Azure Storage Mover", "SQL Server Migration Assistant", "Azure Migrate Server Migration", "APIM self-hosted gateway"],
      correct: [0],
      explanation: "Azure Storage Mover is designed for managed migration of files and blobs, including NFS and SMB shares, using agents and job tracking. SSMA is for database schema and data migration, Azure Migrate Server Migration moves VMs, and APIM self-hosted gateway is for API traffic.",
      tip: "NFS/SMB file migration with agents and job tracking is a Storage Mover clue."
    },
    {
      id: "mig-q16", type: "multi",
      question: "Which Data Box capacity matches are correct? (Select all that apply.)",
      options: [
        "Data Box Disk supports up to 35 TB",
        "Data Box provides about 80 TB usable capacity",
        "Data Box Heavy provides about 770 TB usable capacity",
        "Data Box Disk is the preferred device for 500 TB transfers"
      ],
      correct: [0, 1, 2],
      explanation: "Data Box Disk supports up to 35 TB, Data Box provides 80 TB usable, and Data Box Heavy provides 770 TB usable. A 500 TB transfer is far beyond Data Box Disk and would point toward Data Box Heavy or multiple appliances.",
      tip: "Memorize the capacity ladder: 35 TB Disk, 80 TB Box, 770 TB Heavy."
    },
    {
      id: "mig-q17", type: "single",
      question: "An IIS web app should be assessed for compatibility and migrated to Azure App Service with minor remediation. Which tool should be used?",
      options: ["App Service Migration Assistant", "Data Box Disk", "DMS online migration", "Azure Arc-enabled Servers"],
      correct: [0],
      explanation: "App Service Migration Assistant assesses IIS web app compatibility, can generate deployment artifacts, and supports migration to App Service. Data Box is for offline storage transfer, DMS is for databases, and Azure Arc manages non-Azure resources rather than migrating IIS to App Service.",
      tip: "IIS to App Service equals App Service Migration Assistant or Web App Assessment."
    },
    {
      id: "mig-q18", type: "single",
      question: "A Java web app should be containerized without code changes and deployed as a Docker image to App Service for Containers or AKS. Which Azure Migrate tool applies?",
      options: ["Azure Migrate App Containerization", "Azure Migrate Discovery only", "SQL Server Migration Assistant", "Traffic Manager"],
      correct: [0],
      explanation: "Azure Migrate App Containerization can containerize Java or ASP.NET apps into Docker images and deploy them to App Service for Containers or AKS. Discovery alone does not create container images. SSMA is for databases, and Traffic Manager is DNS routing.",
      tip: "Containerize Java or ASP.NET with minimal/no code changes equals Azure Migrate App Containerization."
    },
    {
      id: "mig-q19", type: "multi",
      question: "Which statements about migration process and tooling are TRUE? (Select all that apply.)",
      options: [
        "Test migration validates the workload in Azure before final cutover",
        "DMS should be used for VM replication from VMware to Azure VMs",
        "Hyper-V VM migration uses a Hyper-V Replication Provider on the host",
        "After successful cutover and validation, old on-premises workloads can be decommissioned"
      ],
      correct: [0, 2, 3],
      explanation: "Test migration is a recommended validation step, Hyper-V migration uses the Hyper-V Replication Provider, and decommissioning happens after cutover validation. DMS is not for VM replication; Azure Migrate Server Migration handles VM migration.",
      tip: "DMS is database-only. Any option making it a VM replication tool is a trap."
    },
    {
      id: "mig-q20", type: "single",
      question: "A workload currently runs on VMware and the business wants minimal application changes while moving it to Azure VMs. Which Azure Migrate tool should execute the move?",
      options: ["Azure Migrate Server Migration", "Azure Migrate App Containerization", "Azure Storage Mover", "Azure API Management"],
      correct: [0],
      explanation: "Azure Migrate Server Migration replicates and migrates VMware VMs to Azure VMs, including agentless replication in many VMware scenarios. App Containerization is for changing apps into containers, Storage Mover handles file/blob migration, and APIM manages APIs.",
      tip: "VMware to Azure VMs with minimal changes means Server Migration, not containerization."
    },

    {
      id: "mig-q21", type: "single",
      question: "A workload has a dependency on a datacenter system that will not be migrated this year. The team decides to keep the workload where it is and revisit later. Which rationalization choice is this?",
      options: ["Retain", "Retire", "Rebuild", "Replace"],
      correct: [0],
      explanation: "Retain means keeping a workload in its current location for now, often because of dependencies, timing, or business constraints. Retire would decommission an unused workload. Rebuild and Replace would create a new cloud-native app or use SaaS instead.",
      tip: "Keep for now equals Retain. Remove because it is unused equals Retire."
    },
    {
      id: "mig-q22", type: "single",
      question: "A cloud adoption program is defining business outcomes, creating a migration plan, preparing landing zones, then migrating workloads during the Adopt phase. Which framework is being applied?",
      options: ["Cloud Adoption Framework", "Well-Architected reliability review only", "Azure Migrate Server Migration only", "Data Box import process"],
      correct: [0],
      explanation: "The Cloud Adoption Framework organizes adoption through Strategy, Plan, Ready, Adopt, Govern, and Manage, with migration as part of the Adopt phase. Azure Migrate and Data Box are tools used inside a broader plan, not the governance methodology itself. A Well-Architected review is valuable but does not define the full adoption lifecycle described.",
      tip: "Strategy, Plan, Ready, Adopt, Govern, Manage is the CAF lifecycle."
    },
    {
      id: "mig-q23", type: "single",
      question: "An IIS application is suitable for Azure App Service after minor remediation. The team wants assessment output and generated deployment artifacts. Which tool should be used?",
      options: ["App Service Migration Assistant", "Azure Migrate Server Migration", "Data Migration Assistant", "Data Box Disk"],
      correct: [0],
      explanation: "App Service Migration Assistant assesses IIS web app compatibility, can perform common remediation, and helps migrate to Azure App Service. Server Migration moves VMs to IaaS, Data Migration Assistant assesses SQL Server, and Data Box Disk transfers offline data.",
      tip: "IIS web app to App Service is App Service Migration Assistant, not VM Server Migration unless the requirement is lift-and-shift."
    },
    {
      id: "mig-q24", type: "single",
      question: "Before migrating SQL Server databases, an architect needs to identify compatibility issues and feature blockers for Azure SQL Database and Azure SQL Managed Instance. Which tool is most appropriate?",
      options: ["Data Migration Assistant", "AzCopy", "Azure Storage Mover", "Traffic Manager"],
      correct: [0],
      explanation: "Data Migration Assistant assesses SQL Server databases for compatibility issues, breaking changes, and target recommendations before migration. AzCopy and Storage Mover are file/blob transfer tools. Traffic Manager is a DNS routing service and has no database assessment role.",
      tip: "SQL Server assessment before database migration is Data Migration Assistant; actual migration is commonly DMS."
    },
    {
      id: "mig-q25", type: "multi",
      question: "Which assessment choices are appropriate before migration? (Select all that apply.)",
      options: [
        "Use Azure Migrate performance-based assessment to right-size Azure VMs",
        "Use Data Migration Assistant to check SQL Server compatibility issues",
        "Use Web App Assessment or App Service Migration Assistant for IIS apps",
        "Use Data Box Heavy to discover process-level VM dependencies"
      ],
      correct: [0, 1, 2],
      explanation: "Azure Migrate performance-based assessments right-size VMs, Data Migration Assistant evaluates SQL Server compatibility, and web app assessment tools evaluate IIS apps for App Service. Data Box Heavy is an offline transfer appliance and does not discover VM dependencies.",
      tip: "Assessment tools analyze readiness; Data Box appliances move data. Do not mix the tool categories."
    },
    {
      id: "mig-q26", type: "single",
      question: "A branch office file server must continue to provide local low-latency access while synchronizing shares with Azure Files during a phased migration. Which service should be considered?",
      options: ["Azure File Sync", "Azure Database Migration Service", "Azure Migrate App Containerization", "Event Grid"],
      correct: [0],
      explanation: "Azure File Sync can synchronize on-premises Windows Server file shares with Azure Files, allowing local caching and phased migration or hybrid access. DMS handles databases, App Containerization handles Java or ASP.NET apps, and Event Grid routes events.",
      tip: "Ongoing Windows file server sync or cloud tiering with Azure Files points to Azure File Sync, not one-time copy tools."
    },
    {
      id: "mig-q27", type: "single",
      question: "A VMware estate must remain on VMware operational tooling after migration because the operations team is not ready to manage native Azure VMs. Which assessment target should be evaluated?",
      options: ["Azure VMware Solution assessment", "Azure SQL Database assessment", "App Service Migration Assistant", "Queue Storage"],
      correct: [0],
      explanation: "Azure VMware Solution lets organizations run VMware workloads on Azure while retaining VMware operational models, so an AVS assessment is appropriate. Azure SQL Database assessment is for databases, App Service Migration Assistant is for IIS apps, and Queue Storage is unrelated.",
      tip: "VMware consistency after moving to Azure is an AVS clue; native Azure VM migration is Azure Migrate Server Migration."
    },
    {
      id: "mig-q28", type: "single",
      question: "A database migration has an approved 12-hour outage window and the database is small enough for a backup/restore approach. The team wants the simplest process. Which migration mode is acceptable?",
      options: ["Offline migration", "Online migration only", "Event Hubs Capture", "Storage Queue visibility timeout"],
      correct: [0],
      explanation: "Offline migration is acceptable when a downtime window exists and the team wants a simpler one-time snapshot, backup/restore, or export/import process. Online migration is used when minimal downtime is required and continuous synchronization is needed. Event Hubs and Storage Queue options are unrelated to database migration modes.",
      tip: "Downtime window acceptable means offline can be enough; near-zero downtime forces online."
    }
  ]
});
