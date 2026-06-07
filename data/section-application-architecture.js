AZ305.registerSection({
  id: "application-architecture",
  title: "Application Architecture",
  domain: "Infrastructure Solutions",
  weight: "30–35%",
  icon: "🏗️",
  order: 3,
  summary: "Application architecture questions focus on **service selection** for API gateways, caching, configuration, deployment automation, microservices platforms, and integration workflows. Prefer managed, policy-driven, and low-ops services when they meet the scenario requirements.",

  notes: [
    {
      heading: "API Management Architecture and Tiers",
      intro: "Azure API Management is a gateway, developer portal, and management layer that secures, publishes, transforms, and monitors APIs in front of backend services.",
      table: {
        headers: ["APIM tier", "Scale / features", "Use case"],
        rows: [
          ["Consumption", "Serverless, auto-scale, no VNet, no dedicated capacity", "Low traffic, sporadic, cost-sensitive APIs"],
          ["Developer", "Full features, 1 unit, no SLA", "Development and testing only"],
          ["Basic", "Basic production features, up to 2 units", "Low-traffic production"],
          ["Standard", "User groups and caching, up to 4 units", "Mid-traffic production"],
          ["Premium", "VNet integration, multi-region, up to 31 units", "Enterprise, high scale, private or global APIs" ]
        ]
      },
      points: [
        "Use APIM when you need **gateway policies**, subscriptions, developer onboarding, auth validation, throttling, transformations, or API product management.",
        "**Premium** is required for production VNet integration, multi-region APIM, and self-hosted gateway production scenarios.",
        "The **self-hosted gateway** runs near on-premises or other-cloud APIs while the Azure APIM service remains the control plane."
      ],
      tip: "APIM is not just a load balancer. If the requirement is JWT validation, throttling, transformations, subscriptions, or partner onboarding, APIM becomes the API front door."
    },
    {
      heading: "APIM Policies and Inheritance",
      table: {
        headers: ["Policy area", "Applied when", "Common exam examples"],
        rows: [
          ["Inbound", "Before forwarding to backend", "`validate-jwt`, `rate-limit-by-key`, request transformation, `ip-filter`"],
          ["Backend", "Before backend call", "URL rewrite, retry, cache lookup"],
          ["Outbound", "After backend response", "Response transformation, delete headers, cache store"],
          ["On-error", "When an exception occurs", "Custom error response formatting" ]
        ]
      },
      points: [
        "`rate-limit-by-key` throttles by subscription, user, or caller IP and returns HTTP 429 when exceeded.",
        "`validate-jwt` validates OAuth 2.0 or JWT bearer tokens, including required claims such as audience.",
        "`cache-lookup` and `cache-store` cache GET responses; `mock-response` can return a static response without calling the backend.",
        "The `base` policy element preserves inherited parent policies from global, product, API, or operation scope. Omitting it skips parent policies at that point."
      ],
      tip: "If a scenario asks why inherited global security is not running at an API or operation scope, look for a missing `base` policy element."
    },
    {
      heading: "Azure Cache for Redis",
      table: {
        headers: ["Tier", "HA / scale capabilities", "Use case"],
        rows: [
          ["Basic C0–C6", "Single node; no HA, clustering, geo-replication, or zone redundancy", "Dev/test only"],
          ["Standard C0–C6", "Primary plus replica", "Production cache and session state requiring HA"],
          ["Premium P1–P5", "Clustering, persistence, geo-replication, zone redundancy", "Enterprise scale, large datasets, data durability"],
          ["Enterprise", "Large memory, clustering, geo-replication, Redis modules", "Highest performance and advanced modules"],
          ["Enterprise Flash", "Large NVMe-backed memory with clustering", "Cost-effective very large datasets" ]
        ]
      },
      points: [
        "**Cache-aside** means the app checks Redis first, loads from the database on a miss, then stores the value with a TTL.",
        "**RDB persistence** snapshots at intervals with lower overhead; **AOF persistence** logs every write for near-zero data loss with higher disk I/O.",
        "Redis pub/sub is lightweight but not durable; use Service Bus for reliable messaging and Event Hubs for massive telemetry streaming."
      ],
      tip: "Premium or Enterprise is the threshold for clustering, geo-replication, and persistence. Standard is the minimum production HA tier."
    },
    {
      heading: "App Configuration vs Key Vault",
      table: {
        headers: ["Capability", "App Configuration", "Key Vault"],
        rows: [
          ["Stores", "Non-secret settings and feature flags", "Secrets, keys, and certificates"],
          ["Versioning", "Labels and immutable snapshots", "Secret versions and certificate versions"],
          ["Runtime change", "Automatic refresh and feature toggles", "Secret retrieval by app or managed identity"],
          ["Use together", "Can reference Key Vault secrets", "Stores the sensitive values referenced by config"],
          ["Exam clue", "Toggle without redeploy; environment-specific settings", "Password, connection string, certificate, encryption key" ]
        ]
      },
      points: [
        "App Configuration provides hierarchical key-value settings, labels such as `prod` or `dev`, feature flags, snapshots, and automatic refresh.",
        "Key Vault is HSM-backed for keys and stores sensitive secrets and certificates; do not put passwords directly into App Configuration.",
        "Applications can combine both by using App Configuration for non-secret settings and Key Vault references for secrets."
      ],
      tip: "Feature flag or non-secret dynamic config equals App Configuration. Any secret, key, certificate, password, or connection string equals Key Vault."
    },
    {
      heading: "Deployment Automation and Release Strategies",
      table: {
        headers: ["Choice", "Best for", "Decision clue"],
        rows: [
          ["Azure DevOps Pipelines", "Enterprise CI/CD, multi-stage releases", "Complex approvals and Azure DevOps organization"],
          ["GitHub Actions", "GitHub repositories and event-driven workflows", "Modern teams already on GitHub"],
          ["Deployment Center", "Quick portal-based setup", "Fast setup for App Service or AKS"],
          ["Bicep", "Azure-native declarative IaC", "Recommended Azure-native IaC; compiles to ARM"],
          ["Terraform", "Multi-cloud IaC", "State file and providers across clouds" ]
        ]
      },
      points: [
        "**Deployment slots** provide zero-downtime swaps and instant rollback for App Service; slot-specific settings remain sticky.",
        "**Blue-green** uses two complete environments and switches traffic; **canary** gradually routes traffic to validate with a subset of users.",
        "**Rolling** updates instances one at a time and avoids extra infrastructure, but rollback can be slower than a slot swap."
      ],
      tip: "For Azure-native IaC, pick Bicep. For multi-cloud, pick Terraform. For App Service zero-downtime, deployment slots are the exam favorite."
    },
    {
      heading: "Microservices and Container Platform Selection",
      table: {
        headers: ["Service", "Control level", "Use when"],
        rows: [
          ["AKS", "Full Kubernetes control", "Complex microservices, service mesh, custom networking, ML, team knows Kubernetes"],
          ["Container Apps", "Simplified containers on managed Kubernetes", "Event-driven microservices, KEDA, Dapr, no cluster operations"],
          ["App Service", "Minimal", "Traditional web apps and APIs with simple scaling"],
          ["ACI", "None", "Single container, container group, dev/test, short batch task"],
          ["Functions", "None", "Event-driven serverless code" ]
        ]
      },
      points: [
        "Container Apps provides built-in KEDA autoscaling and Dapr sidecar support without requiring Kubernetes expertise.",
        "AKS is the right answer when the scenario requires full control of networking, ingress, node pools, Kubernetes APIs, or service mesh.",
        "If two platforms meet requirements, AZ-305 often favors the one with lower operational complexity."
      ],
      tip: "Do not choose AKS just because containers are mentioned. Look for explicit Kubernetes control needs; otherwise consider Container Apps, App Service, or ACI."
    },
    {
      heading: "API and Integration Patterns",
      table: {
        headers: ["Pattern", "Use when", "Azure fit"],
        rows: [
          ["API Gateway", "Single entry point with auth, throttling, logging, transformation", "APIM"],
          ["Backends for Frontends", "Different client types need tailored API shapes", "APIM APIs and products per client"],
          ["Event-driven architecture", "Loose coupling through events", "Event Grid, Event Hubs, Service Bus"],
          ["Cache-aside", "Reduce database reads and improve latency", "Azure Cache for Redis"],
          ["Feature flags", "Toggle behavior without redeployment", "Azure App Configuration" ]
        ]
      },
      points: [
        "**Event Grid** is reactive pub/sub for events; **Event Hubs** is streaming telemetry; **Service Bus** is reliable enterprise messaging.",
        "BFF is useful when mobile, web, and partner clients each need different payloads or interaction patterns.",
        "APIM can publish multiple APIs and products while applying shared global policies and client-specific rules."
      ],
      tip: "If the architecture problem is client/API management, start with APIM. If it is async decoupling, identify whether the clue is events, telemetry streams, or reliable queues."
    },
    {
      heading: "Logic Apps Plans, Connectors, and Service Tradeoffs",
      table: {
        headers: ["Service", "Primary use", "Choose when"],
        rows: [
          ["Logic Apps", "Workflow orchestration and B2B integration", "Low-code, approvals, SaaS connectors, EDI, business process automation"],
          ["Azure Functions", "Event-driven custom code", "Compute-intensive or code-first logic"],
          ["Azure Data Factory", "Data movement and ETL/ELT", "Bulk movement between data stores or data lake ingestion"],
          ["Logic Apps Consumption", "Serverless per-execution workflows", "Simple sporadic integrations with no VNet requirement"],
          ["Logic Apps Standard", "Single-tenant dedicated workflow runtime", "VNet integration, private endpoints, on-prem connectivity" ]
        ]
      },
      points: [
        "Logic Apps includes triggers, actions, managed identity, and more than 400 connectors for SaaS and enterprise systems.",
        "Built-in connectors run in the runtime and are often faster and cheaper; managed and enterprise connectors cover services such as Office 365, Salesforce, SAP, and IBM MQ.",
        "On-premises connectors require the On-Premises Data Gateway; B2B EDI uses Integration Account with AS2, X12, or EDIFACT."
      ],
      tip: "Salesforce-to-SAP workflow, approvals, connectors, or B2B EDI means Logic Apps. Add VNet/private connectivity and the plan becomes Standard."
    },

    {
      heading: "Exam skills mapping",
      points: [
        "Recommend a **messaging architecture**: choose Service Bus for reliable commands, sessions, dead-lettering, and transactions; Storage Queue for simple low-cost queueing and huge backlog.",
        "Recommend an **event-driven architecture**: choose Event Grid for reactive push events and Event Hubs for high-volume telemetry streams, replay, partitions, and consumer groups.",
        "Recommend a solution for **API integration**: API Management gateway, products, subscriptions, policies, throttling, JWT validation, transformations, and self-hosted gateway.",
        "Recommend a **caching solution**: Azure Cache for Redis tiers and cache-aside, APIM response caching, and edge caching with CDN or Front Door.",
        "Recommend an **application configuration management** solution: App Configuration, labels, snapshots, feature flags, and Key Vault references for secrets.",
        "Recommend an **automated deployment** solution: ARM/Bicep, Terraform, Azure DevOps, GitHub Actions, deployment slots, blue-green, canary, and rolling releases."
      ],
      tip: "Architecture questions often differ by message semantics: command vs event vs telemetry. Identify durability, ordering, replay, and fan-out before choosing a service."
    }
  ],

  flashcards: [
    { front: "What is Azure API Management?", back: "A gateway, developer portal, and management layer for publishing, securing, transforming, throttling, and monitoring APIs in front of backend services." },
    { front: "APIM tier for VNet integration and multi-region", back: "**Premium** is required for production VNet integration, multi-region deployment, and production self-hosted gateway scenarios. Developer has VNet but no SLA." },
    { front: "When is APIM Consumption a good fit?", back: "Cost-sensitive, low or sporadic traffic APIs that do not need VNet integration or dedicated capacity." },
    { front: "What does `base` do in APIM policies?", back: "It runs inherited parent-scope policies. Omitting `base` at a scope skips inherited policies there, a common exam trap." },
    { front: "APIM policy for JWT validation", back: "Use `validate-jwt` to validate bearer tokens and required claims such as audience or issuer." },
    { front: "APIM policy for throttling per subscription or IP", back: "Use `rate-limit-by-key`; set the counter key to subscription ID, user ID, or request IP. Exceeding the limit returns HTTP 429." },
    { front: "Redis tier for production HA", back: "**Standard** is the minimum production HA tier because it has primary plus replica. Basic is single node for dev/test only." },
    { front: "Redis tier for clustering, persistence, and geo-replication", back: "**Premium** or Enterprise. Premium adds clustering, persistence, geo-replication, and zone redundancy; Enterprise adds higher performance/modules." },
    { front: "RDB vs AOF persistence", back: "RDB snapshots periodically with lower overhead and possible data loss. AOF logs every write for near-zero data loss but higher disk I/O." },
    { front: "Redis Pub/Sub vs Service Bus", back: "Redis Pub/Sub is lightweight and non-durable. Service Bus is durable, reliable enterprise messaging with queues, topics, and sessions." },
    { front: "App Configuration vs Key Vault", back: "App Configuration stores non-secret settings and feature flags. Key Vault stores secrets, keys, certificates, passwords, and sensitive connection strings." },
    { front: "What are App Configuration labels?", back: "Labels version or scope key-values by environment or release, such as `dev`, `test`, or `prod`." },
    { front: "Azure-native IaC recommendation", back: "**Bicep** is the recommended Azure-native IaC language and compiles to ARM templates. Terraform is the multi-cloud IaC choice." },
    { front: "Deployment slots exam rule", back: "Slots are available in Standard, Premium, and Isolated App Service tiers. Swap warms production and allows instant rollback; sticky settings do not swap." },
    { front: "AKS vs Container Apps", back: "AKS gives full Kubernetes control. Container Apps gives event-driven containers with KEDA and Dapr while hiding Kubernetes operations." },
    { front: "ACI vs Container Apps", back: "ACI runs simple single containers or container groups with no orchestration. Container Apps is for microservices/APIs with ingress, revisions, KEDA, and Dapr." },
    { front: "API Gateway pattern", back: "Put APIM in front of backends as a single entry point for authentication, throttling, logging, transformation, and client decoupling." },
    { front: "Backends for Frontends pattern", back: "Use separate API surfaces for mobile, web, or partner clients so each client gets payloads and workflows optimized for it." },
    { front: "Logic Apps Consumption vs Standard", back: "Consumption is serverless and per-execution for simple integrations. Standard is single-tenant with VNet integration, private endpoints, and on-premises connectivity." },
    { front: "Logic Apps vs Functions vs Data Factory", back: "Logic Apps = low-code workflow, SaaS connectors, B2B/EDI. Functions = custom code and compute. Data Factory = data movement and ETL/ELT pipelines." },

    { front: "Service Bus vs Storage Queue", back: "Service Bus = enterprise messaging with sessions, dead-lettering, duplicate detection, transactions, and larger messages. Storage Queue = simple cheap queue with 64 KB messages and massive backlog." },
    { front: "Event Grid vs Event Hubs", back: "Event Grid = push-based reactive events such as blob created. Event Hubs = pull-based high-volume telemetry stream with partitions, offsets, retention, replay, and consumer groups." },
    { front: "Event Hubs Capture", back: "Capture automatically writes Event Hubs streams to Blob Storage or Data Lake Storage Gen2 in Avro format for long-term archive and replay." },
    { front: "Edge cache vs application cache", back: "CDN or Front Door caches static HTTP content at the edge. Azure Cache for Redis caches application data, sessions, rate-limit counters, and computed results near the app." },
    { front: "Blue-green vs canary", back: "Blue-green switches traffic between two complete environments for fast rollback. Canary gradually routes a small percentage to the new version to reduce rollout risk." }
  ],

  questions: [
    {
      id: "app-q1", type: "single",
      question: "A partner-facing API must validate JWTs, throttle callers by subscription, transform headers, and provide a developer onboarding portal. Which service should front the API?",
      options: ["Azure Front Door only", "Azure API Management", "Azure Load Balancer", "Azure App Configuration"],
      correct: [1],
      explanation: "APIM provides an API gateway, policies such as JWT validation and throttling, transformations, subscriptions, and a developer portal. Front Door is a global HTTP entry and WAF/CDN service but does not provide the API product and policy management depth. Load Balancer is L4, and App Configuration stores settings.",
      tip: "JWT validation plus throttling plus developer portal is the APIM trifecta. Do not confuse API gateway policy needs with generic load balancing."
    },
    {
      id: "app-q2", type: "single",
      question: "An enterprise requires APIM gateways in two Azure regions and private connectivity to backend APIs in VNets. Which APIM tier is required?",
      options: ["Consumption", "Developer", "Standard", "Premium"],
      correct: [3],
      explanation: "APIM Premium is required for production VNet integration and multi-region deployments. Developer has full features but no SLA and is not for production. Consumption and Standard do not meet the VNet and multi-region requirements.",
      tip: "Multi-region APIM is Premium only. VNet for production APIM also points to Premium."
    },
    {
      id: "app-q3", type: "single",
      question: "A team configured an APIM operation policy and now inherited global JWT validation is not running for that operation. What is the most likely cause?",
      options: ["The operation policy omitted the `base` element", "The backend URL was rewritten", "The API is in the Basic tier", "The cache duration is too short"],
      correct: [0],
      explanation: "The `base` policy element runs inherited parent policies from scopes such as global, product, API, or operation. Omitting it at a scope causes inherited policies at that point to be skipped. The backend rewrite, tier, or cache duration would not specifically disable inherited global validation.",
      tip: "Inherited APIM policy missing? Look immediately for `base` omission."
    },
    {
      id: "app-q4", type: "multi",
      question: "Which APIM policy choices match the stated requirement? (Select all that apply.)",
      options: [
        "Use `rate-limit-by-key` to throttle calls per subscription or caller IP",
        "Use `validate-jwt` to validate bearer tokens and claims",
        "Use `mock-response` to return a static response without calling the backend",
        "Use `cache-store` inbound before a backend response exists"
      ],
      correct: [0, 1, 2],
      explanation: "`rate-limit-by-key`, `validate-jwt`, and `mock-response` match throttling, token validation, and static mocked responses. `cache-store` stores a response after the backend returns it, so placing it inbound before a response exists is not the right match.",
      tip: "APIM cache has two halves: lookup before backend, store after backend. The direction often exposes the wrong option."
    },
    {
      id: "app-q5", type: "single",
      question: "A low-traffic internal API is called only a few times per hour and does not need VNet integration. The company wants APIM features with minimal cost. Which APIM tier fits best?",
      options: ["Consumption", "Developer", "Premium", "Isolated"],
      correct: [0],
      explanation: "Consumption APIM is serverless and cost-effective for sporadic, low-traffic APIs without VNet or dedicated capacity needs. Developer is not for production. Premium is designed for VNet, multi-region, and high-scale enterprise workloads, making it unnecessarily expensive here.",
      tip: "Sporadic API traffic and no VNet equals APIM Consumption unless the scenario says production dedicated capacity or multi-region."
    },
    {
      id: "app-q6", type: "single",
      question: "A web app needs low-latency session state with high availability. It does not need clustering, persistence, or geo-replication. Which Redis tier is the minimum appropriate production tier?",
      options: ["Basic", "Standard", "Premium", "Enterprise Flash"],
      correct: [1],
      explanation: "Standard provides primary plus replica and is the minimum production tier for high availability. Basic is a single node and is for dev/test. Premium and Enterprise tiers add clustering, persistence, geo-replication, and other advanced capabilities not required here.",
      tip: "Basic has no HA. For production session state, start at Standard unless advanced Redis features are needed."
    },
    {
      id: "app-q7", type: "single",
      question: "A Redis cache must shard a 100 GB dataset and survive regional failure using geo-replication. Which tier family should you select?",
      options: ["Basic C0", "Standard C6", "Premium or Enterprise", "APIM Standard cache"],
      correct: [2],
      explanation: "Clustering for sharding and geo-replication require Premium or Enterprise tiers. Basic and Standard do not provide those capabilities. APIM response caching is not a replacement for an application Redis cache with a large sharded dataset.",
      tip: "Clustering, geo-replication, and persistence are Premium-or-above Redis keywords."
    },
    {
      id: "app-q8", type: "single",
      question: "An application needs to store feature flags and environment-specific non-secret settings that can refresh without redeployment. Where should these values go?",
      options: ["Azure Key Vault only", "Azure App Configuration", "Azure Data Factory", "Azure Service Bus"],
      correct: [1],
      explanation: "Azure App Configuration is designed for centralized key-value configuration, feature flags, labels, snapshots, and refresh. Key Vault stores secrets, keys, and certificates, not general non-secret configuration. Data Factory and Service Bus solve unrelated data movement and messaging problems.",
      tip: "Feature flags and dynamic non-secret config are App Configuration clues. Secret words move the answer to Key Vault."
    },
    {
      id: "app-q9", type: "single",
      question: "A connection string contains a database password and must be protected with managed identity access. Which service should store the sensitive value?",
      options: ["Azure App Configuration as a plain key-value", "Azure Key Vault", "Azure Cache for Redis", "GitHub Actions variables only"],
      correct: [1],
      explanation: "Key Vault stores secrets such as passwords and connection strings and can be accessed with managed identity. App Configuration can reference Key Vault but should not store the secret value in plain configuration. Redis is a cache, and pipeline variables alone are not the right runtime secret store.",
      tip: "Passwords, keys, certificates, and sensitive connection strings always point to Key Vault."
    },
    {
      id: "app-q10", type: "multi",
      question: "Which statements about deployment and IaC are TRUE? (Select all that apply.)",
      options: [
        "Bicep is the recommended Azure-native IaC language and compiles to ARM templates",
        "Terraform is commonly chosen for multi-cloud IaC and uses state management",
        "Deployment slots can warm a staging version before swapping to production",
        "App Service Basic is the minimum tier that supports deployment slots"
      ],
      correct: [0, 1, 2],
      explanation: "Bicep is Azure-native and compiles to ARM, Terraform is common for multi-cloud IaC with state, and App Service deployment slots support pre-warm and swap. Basic does not support deployment slots; Standard is the minimum slot tier.",
      tip: "Remember two minimums: Bicep for Azure-native IaC, and App Service Standard for slots."
    },
    {
      id: "app-q11", type: "single",
      question: "A team wants zero-downtime App Service deployment with instant rollback and warm-up before production traffic. Which strategy should they use?",
      options: ["Direct publish to production", "Deployment slots with swap", "Manual VM replacement", "Delete and recreate the app"],
      correct: [1],
      explanation: "Deployment slots allow a staging slot to warm up before swapping into production, and the previous production slot can be swapped back for rollback. Direct publish can cause downtime or partial deployment issues. VM replacement and deleting the app are not App Service release strategies.",
      tip: "For App Service zero-downtime plus rollback, deployment slots are the highest-signal answer."
    },
    {
      id: "app-q12", type: "single",
      question: "A containerized microservices app needs HTTP ingress, KEDA autoscaling, Dapr sidecars, and minimal Kubernetes operations. Which platform is the best fit?",
      options: ["AKS", "Azure Container Apps", "Azure Container Instances", "Azure Batch"],
      correct: [1],
      explanation: "Container Apps provides managed containerized microservices with built-in KEDA, Dapr, and managed ingress while hiding most Kubernetes operations. AKS is appropriate when full Kubernetes control is required, but this scenario emphasizes minimal operations. ACI is too simple for microservices ingress and revisions, and Batch is for parallel jobs.",
      tip: "KEDA plus Dapr plus no Kubernetes expertise is Container Apps. Full control and custom cluster features would change the answer to AKS."
    },
    {
      id: "app-q13", type: "single",
      question: "A platform team needs full Kubernetes API access, custom ingress controllers, service mesh configuration, and multiple specialized node pools. Which platform should they choose?",
      options: ["Azure Container Apps", "AKS", "ACI", "Logic Apps"],
      correct: [1],
      explanation: "AKS provides full Kubernetes control, custom networking and ingress, service mesh options, and multiple node pools. Container Apps abstracts Kubernetes and is better for simplified operations. ACI is for simple containers, and Logic Apps is workflow automation.",
      tip: "Full Kubernetes control words such as custom ingress, service mesh, and node pools point to AKS."
    },
    {
      id: "app-q14", type: "single",
      question: "A company has mobile, web, and partner clients that each need different API payload shapes and workflows while sharing backend microservices. Which pattern should you recommend?",
      options: ["Backends for Frontends", "Single database per client", "Redis Pub/Sub", "Availability Sets"],
      correct: [0],
      explanation: "Backends for Frontends creates tailored API surfaces for each client type while hiding backend complexity and optimizing payloads. Separate databases per client is not the pattern described. Redis Pub/Sub is messaging, and Availability Sets are VM HA placement.",
      tip: "Different client types needing tailored APIs equals BFF. If the clue is shared auth/throttling for APIs, APIM may implement it."
    },
    {
      id: "app-q15", type: "single",
      question: "A workflow must integrate Salesforce and SAP, send approval emails, and use mostly prebuilt connectors with little custom code. Which Azure service is best?",
      options: ["Azure Logic Apps", "Azure Functions", "Azure Batch", "Azure Load Balancer"],
      correct: [0],
      explanation: "Logic Apps is a low-code workflow and integration platform with hundreds of SaaS and enterprise connectors, including common systems like Salesforce and SAP, plus approval and business process patterns. Functions is better for custom code, Batch for HPC jobs, and Load Balancer for L4 traffic.",
      tip: "Connector-heavy SaaS workflow or approval process equals Logic Apps, not Functions by default."
    },
    {
      id: "app-q16", type: "single",
      question: "A Logic App must access private endpoints in a VNet and connect to on-premises systems. Which hosting plan should you choose?",
      options: ["Consumption", "Standard", "Basic", "Premium APIM"],
      correct: [1],
      explanation: "Logic Apps Standard is single-tenant and supports full VNet integration, private endpoints, and on-premises connectivity. Consumption is serverless but lacks the required private networking capabilities. Basic is not a Logic Apps plan, and APIM Premium is a different service.",
      tip: "Logic Apps plus VNet/private endpoints/on-premises means Standard plan. Consumption is the distractor for simple public integrations."
    },
    {
      id: "app-q17", type: "multi",
      question: "Which service selections are appropriate? (Select all that apply.)",
      options: [
        "Use Logic Apps plus Integration Account for B2B EDI with trading partners",
        "Use Azure Functions for custom compute-intensive event processing",
        "Use Azure Data Factory for bulk data movement and ETL pipelines",
        "Use Logic Apps for high-performance numerical simulation across thousands of nodes"
      ],
      correct: [0, 1, 2],
      explanation: "Logic Apps with Integration Account fits B2B EDI; Functions fits custom code and event processing; Data Factory fits data movement and ETL/ELT. High-performance numerical simulation across many nodes is a Batch/HPC scenario, not Logic Apps.",
      tip: "Match the work shape: workflow connectors to Logic Apps, custom code to Functions, data pipelines to ADF, HPC to Batch."
    },
    {
      id: "app-q18", type: "single",
      question: "An API needs to cache successful GET responses for five minutes at the gateway to reduce backend load. Which APIM policy combination is appropriate?",
      options: ["`validate-jwt` only", "`cache-lookup` and `cache-store`", "`ip-filter` only", "`mock-response` for all calls"],
      correct: [1],
      explanation: "APIM response caching uses `cache-lookup` to check for a cached response and `cache-store` to store a response with a duration such as 300 seconds. `validate-jwt` and `ip-filter` are security policies. `mock-response` bypasses the backend and is for testing or static responses, not normal caching.",
      tip: "Gateway response cache requires both lookup and store; duration 300 means five minutes."
    },
    {
      id: "app-q19", type: "single",
      question: "A system needs durable reliable messages with competing consumers and optional ordered sessions. Redis Pub/Sub is being considered. What should you recommend instead?",
      options: ["Azure Cache for Redis Pub/Sub", "Azure Service Bus", "Azure App Configuration", "Deployment slots"],
      correct: [1],
      explanation: "Service Bus provides durable enterprise messaging with queues, topics, subscriptions, and sessions for ordering. Redis Pub/Sub is lightweight and non-durable, so it can lose messages if consumers are offline. App Configuration and deployment slots do not solve messaging durability.",
      tip: "Durable queue or ordered sessions eliminates Redis Pub/Sub; pick Service Bus."
    },
    {
      id: "app-q20", type: "single",
      question: "An organization wants to standardize Azure-native infrastructure definitions and avoid JSON ARM templates where possible. Which IaC language should be recommended?",
      options: ["Bicep", "Terraform", "Pulumi", "APIM policies"],
      correct: [0],
      explanation: "Bicep is the recommended Azure-native declarative IaC language and compiles to ARM templates while providing cleaner syntax than raw JSON. Terraform and Pulumi are valid multi-cloud IaC options but are not Azure-native in the same way. APIM policies configure APIs, not infrastructure broadly.",
      tip: "Azure-native and avoid ARM JSON equals Bicep. Multi-cloud pushes toward Terraform."
    },

    {
      id: "app-q21", type: "single",
      question: "An order-processing system must guarantee that messages are not lost, support a dead-letter queue, and process commands in FIFO order per customer. Which messaging service should you choose?",
      options: ["Azure Queue Storage", "Azure Service Bus Queue with sessions", "Azure Event Grid", "Azure Event Hubs"],
      correct: [1],
      explanation: "Service Bus provides enterprise messaging features such as dead-letter queues, message locks, duplicate detection, and sessions for FIFO ordering per customer or workflow. Queue Storage is cheaper and simple but lacks dead-lettering, duplicate detection, and guaranteed FIFO sessions. Event Grid and Event Hubs are eventing and streaming services, not command queues.",
      tip: "Commands, workflows, dead-lettering, and FIFO sessions are Service Bus clues. Simple cheap backlog is Queue Storage."
    },
    {
      id: "app-q22", type: "multi",
      question: "Which statements correctly compare Azure Queue Storage and Service Bus? (Select all that apply.)",
      options: [
        "Queue Storage is a simple low-cost queue with up to 64 KB messages",
        "Service Bus supports dead-letter queues, duplicate detection, and transactions",
        "Queue Storage guarantees FIFO ordering with sessions",
        "Service Bus Premium supports larger messages and private networking features"
      ],
      correct: [0, 1, 3],
      explanation: "Queue Storage is simple and low cost with small messages, while Service Bus adds enterprise features such as DLQ, duplicate detection, transactions, sessions, and Premium private networking or larger messages. Queue Storage does not provide Service Bus-style sessions or guaranteed FIFO ordering.",
      tip: "If an option gives Queue Storage enterprise semantics, it is probably wrong. Those belong to Service Bus."
    },
    {
      id: "app-q23", type: "single",
      question: "A serverless app must react within seconds when a blob is created and push the event to an Azure Function. It does not need stream replay. Which service should route the event?",
      options: ["Event Grid", "Event Hubs", "Service Bus Queue", "Azure Cache for Redis"],
      correct: [0],
      explanation: "Event Grid is the reactive, push-based event routing service for Azure resource events such as Blob Storage create or delete. Event Hubs is for high-volume telemetry streams and replay. Service Bus is for durable command messaging, and Redis is a cache/pub-sub store.",
      tip: "React to an Azure resource event, especially blob created, is Event Grid. Replayable telemetry stream is Event Hubs."
    },
    {
      id: "app-q24", type: "single",
      question: "An IoT platform ingests millions of sensor readings per second. Multiple analytics teams must independently read the stream and replay from their own offsets. What should you recommend?",
      options: ["Event Hubs with consumer groups", "Event Grid custom topic", "Service Bus Topic", "Queue Storage"],
      correct: [0],
      explanation: "Event Hubs is built for high-volume streaming telemetry with partitions, offsets, retention, and consumer groups so multiple consumers can read independently. Event Grid is reactive push eventing with short retry retention. Service Bus Topics fan out messages but are not designed for millions of telemetry events per second or stream replay semantics.",
      tip: "Millions of telemetry events plus replay and consumer groups equals Event Hubs."
    },
    {
      id: "app-q25", type: "single",
      question: "A global web app serves static images and scripts to users worldwide. The goal is to reduce latency and offload origin traffic at the edge. Which caching approach is best?",
      options: ["Azure Cache for Redis", "Azure Front Door or Azure CDN caching", "Service Bus Premium", "App Configuration snapshots"],
      correct: [1],
      explanation: "Front Door or Azure CDN caches HTTP content at edge locations close to users, reducing latency and origin load. Redis is an application data cache used by backend code, not an edge cache for static web assets. Service Bus and App Configuration do not cache web content.",
      tip: "Static content near users equals edge cache with CDN or Front Door. App data/session cache equals Redis."
    },
    {
      id: "app-q26", type: "multi",
      question: "A microservice needs central configuration with feature flags, environment labels, and secrets stored securely. Which design choices are appropriate? (Select all that apply.)",
      options: [
        "Store non-secret settings and feature flags in App Configuration",
        "Use labels such as `dev` and `prod` for environment-specific values",
        "Store passwords directly as plain App Configuration values",
        "Reference secrets stored in Key Vault from App Configuration"
      ],
      correct: [0, 1, 3],
      explanation: "App Configuration is correct for non-secret settings, labels, and feature flags, and it can reference secrets stored in Key Vault. Passwords and sensitive connection strings should not be stored directly as plain configuration values. Key Vault remains the system of record for secrets, keys, and certificates.",
      tip: "Use App Configuration for toggles and labels, but move any secret material to Key Vault."
    },
    {
      id: "app-q27", type: "single",
      question: "A release team wants to expose 5% of users to a new version, monitor errors, then gradually increase traffic if health is good. Which deployment strategy is this?",
      options: ["Canary", "Blue-green", "Big bang", "Backup/restore"],
      correct: [0],
      explanation: "Canary deployment gradually shifts a small percentage of traffic to a new version to validate it before broader rollout. Blue-green uses two complete environments and switches traffic more directly. Big bang deployment increases risk, and backup/restore is not a release strategy.",
      tip: "Small percentage and gradual traffic ramp equals canary. Two complete environments with switch/rollback equals blue-green."
    },
    {
      id: "app-q28", type: "single",
      question: "A repository is hosted in GitHub and the team wants CI/CD workflows triggered by pull requests and pushes with minimal integration work. Which automation platform is the natural fit?",
      options: ["GitHub Actions", "Azure DevOps classic release only", "Azure Storage Mover", "Event Hubs Capture"],
      correct: [0],
      explanation: "GitHub Actions is integrated with GitHub repositories and provides event-driven workflows for pull requests, pushes, and releases. Azure DevOps can also implement CI/CD, but the natural low-friction fit for GitHub-hosted repositories is GitHub Actions. Storage Mover and Event Hubs Capture solve unrelated data movement and streaming archive needs.",
      tip: "If the repo and workflow events are in GitHub, GitHub Actions is usually the simplest CI/CD answer unless enterprise Azure DevOps requirements are stated."
    }
  ]
});
