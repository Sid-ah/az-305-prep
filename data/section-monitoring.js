AZ305.registerSection({
  id: "monitoring",
  title: "Monitoring",
  domain: "Identity, Governance & Monitoring",
  weight: "25–30%",
  icon: "📈",
  order: 2,
  summary: "Monitoring design questions test whether you choose the right signal, store, alert type, and response path. Know **Azure Monitor**, **Log Analytics/KQL**, **Application Insights**, **diagnostic settings**, **action groups**, **Workbooks**, **Microsoft Sentinel**, and **Defender for Cloud**.",

  notes: [
    {
      heading: "Azure Monitor Data Types",
      intro: "Azure Monitor is the central platform for collecting metrics, logs, traces, and activity events from Azure resources, operating systems, apps, and custom sources.",
      table: {
        headers: ["Data", "Description", "Typical store"],
        rows: [
          ["Metrics", "Numerical time-series data such as CPU %, DTU, requests/sec", "Azure Monitor Metrics; 93 days"],
          ["Logs", "Text and event records with rich query support", "Log Analytics workspace"],
          ["Traces", "Distributed request and dependency telemetry", "Application Insights"],
          ["Activity Log", "Subscription-level control-plane operations", "90 days by default; route for retention"]
        ]
      },
      points: [
        "Metrics are low-latency and are used for autoscale and threshold alerts.",
        "Logs are queryable with **Kusto Query Language (KQL)** and support complex correlations.",
        "Activity Log answers who changed, created, deleted, assigned, or failed at the Azure control plane."
      ],
      tip: "Numeric resource threshold = metric. Complex event query or correlation = logs. Control-plane change = Activity Log."
    },
    {
      heading: "Metrics vs Logs Decision Table",
      table: {
        headers: ["Requirement", "Choose", "Why"],
        rows: [
          ["Alert when CPU is above 90% for 5 minutes", "Metric alert", "Fast numeric threshold"],
          ["Find failed sign-ins per user over the last hour", "Log Analytics query", "Requires KQL aggregation"],
          ["Investigate request latency and dependencies", "Application Insights", "App-level telemetry and tracing"],
          ["Know who deleted a VM", "Activity Log alert or query", "Control-plane operation"],
          ["Autoscale based on queue length or CPU", "Metrics", "Autoscale consumes metric signals"]
        ]
      },
      points: [
        "KQL operators commonly seen on the exam include `where`, `summarize`, `project`, `extend`, `top`, and `join`.",
        "A query such as `where TimeGenerated > ago(1h)` filters rows to a recent time window.",
        "A query with `summarize count() by Resource` groups rows and returns counts per resource."
      ],
      tip: "If the condition needs a KQL pipeline, the alert is a log alert, not a metric alert."
    },
    {
      heading: "Log Analytics Workspace Design",
      table: {
        headers: ["Design", "Strengths", "Choose when"],
        rows: [
          ["Centralized workspace", "Simpler operations, cross-resource queries, unified alerting", "Default for most organizations"],
          ["Decentralized workspaces", "Data isolation, separate billing, regional boundaries", "Strict sovereignty, team isolation, or regulated environments"],
          ["RBAC controls", "Workspace/table/resource-context access", "Centralize data while limiting who can see which tables or resources"],
          ["Archive or long retention", "Lower-cost retention beyond hot query period", "Compliance retention where queries are rare"]
        ]
      },
      points: [
        "A Log Analytics workspace is backed by Azure Data Explorer and is the core store for Azure Monitor Logs.",
        "Default log retention is commonly 30 days; hot retention can extend up to 730 days, with archive for longer needs.",
        "Centralization reduces cost and simplifies investigations unless compliance requires separation."
      ],
      tip: "Central workspace is the exam default. Split workspaces only when isolation, sovereignty, or billing boundaries are explicit."
    },
    {
      heading: "Diagnostic Settings: Route the Right Data",
      intro: "Diagnostic settings are the primary way to send Azure resource logs and metrics to monitoring destinations.",
      table: {
        headers: ["Destination", "Use case", "Exam clue"],
        rows: [
          ["Log Analytics workspace", "Query with KQL, build alerts, dashboards, Sentinel", "Need search, correlation, or analytics"],
          ["Storage Account", "Cheap long-term archival", "Retain for years and rarely query"],
          ["Event Hubs", "Stream to external SIEM or pipeline", "Splunk, Datadog, real-time integration"],
          ["Partner solution", "Direct vendor integration", "Datadog, Elastic, or supported partner" ]
        ]
      },
      points: [
        "Sources include resource diagnostic logs, resource metrics, subscription Activity Log, and Entra sign-in/audit logs.",
        "Resource logs usually do not flow to Log Analytics automatically; configure diagnostic settings explicitly.",
        "Activity Log is subscription-level and can be routed using a subscription diagnostic setting."
      ],
      tip: "External SIEM = Diagnostic Settings to Event Hubs. Cheap audit retention = Storage Account. Query and alert = Log Analytics."
    },
    {
      heading: "Agents and Data Collection Rules",
      table: {
        headers: ["Agent", "Platform", "Status"],
        rows: [
          ["Azure Monitor Agent (AMA)", "Windows and Linux", "Current and preferred; uses Data Collection Rules"],
          ["MMA / OMS Agent", "Windows and Linux", "Legacy; retired Aug 31, 2024"],
          ["Diagnostics Extension (WAD/LAD)", "Windows and Linux", "Legacy VM diagnostics path"]
        ]
      },
      points: [
        "**Data Collection Rules (DCRs)** define what AMA collects and where data is sent.",
        "DCRs are reusable and centrally managed, which is better than per-machine legacy agent configuration.",
        "Use AMA for Azure VMs, Arc-enabled servers, and new VM monitoring designs."
      ],
      tip: "New VM or hybrid log collection design = AMA plus DCR plus Log Analytics."
    },
    {
      heading: "Alerts and Action Groups",
      table: {
        headers: ["Alert type", "Triggers on", "Use case"],
        rows: [
          ["Metric alert", "Metric threshold", "CPU > 90%, request count, DTU percentage"],
          ["Log alert", "KQL query results", "Complex condition from logs or custom columns"],
          ["Activity log alert", "Control-plane event", "VM deleted, role changed, policy assigned, service health"],
          ["Smart detection", "ML anomaly in Application Insights", "Failure-rate or performance anomaly without manual threshold"]
        ]
      },
      points: [
        "An **action group** is a reusable set of notifications and actions attached to one or many alerts.",
        "Action group actions include email/SMS/push, webhook, Logic App, Azure Automation runbook, Azure Function, and ITSM connector.",
        "Use stateful alerts to avoid repeated notifications for the same ongoing condition when appropriate."
      ],
      tip: "The alert detects the condition; the action group delivers notification or remediation. Do not stop the design at the alert."
    },
    {
      heading: "Application Insights for APM",
      table: {
        headers: ["Capability", "What it helps answer"],
        rows: [
          ["Requests", "Which operations are slow or failing"],
          ["Dependencies", "Which downstream SQL, HTTP, storage, or service calls failed"],
          ["Exceptions", "Application error details and stack traces"],
          ["Application Map", "Visual dependency topology across components"],
          ["Live Metrics", "Real-time traffic during deployments"],
          ["Availability tests", "HTTP ping tests from multiple regions"],
          ["Sampling", "Reduce telemetry volume and cost"]
        ]
      },
      points: [
        "Application Insights is part of Azure Monitor, but it is specifically for application performance monitoring and distributed tracing.",
        "Smart detection can find anomalies in failure rates or performance without a fixed threshold.",
        "Connection strings are preferred over legacy instrumentation keys for new instrumentation."
      ],
      tip: "Request duration, dependency failures, exceptions, or app topology = Application Insights, not basic platform metrics."
    },
    {
      heading: "Workbooks, Advisor, Cost, Service Health & Automation",
      table: {
        headers: ["Service", "Primary use", "Choose when"],
        rows: [
          ["Azure Workbooks", "Interactive reports combining metrics, logs, text, and parameters", "Custom operational dashboard or DR runbook view"],
          ["Azure Advisor", "Best-practice recommendations", "Cost, reliability, performance, security, operational excellence recommendations"],
          ["Cost Management Budgets", "Spending threshold alerts", "Finance wants alerts at 80% or 100% of budget"],
          ["Azure Service Health", "Personalized incidents and planned maintenance", "Outage or maintenance affecting your subscriptions/regions"],
          ["Azure Automation", "Runbooks, schedules, update management, DSC", "Scheduled start/stop, patching, or alert-triggered remediation"]
        ]
      },
      points: [
        "Azure Status is the public global status page; Service Health is personalized to your subscriptions, services, and regions.",
        "Azure Policy plus required tags is the governance answer for cost allocation at scale.",
        "Action groups can invoke Automation runbooks for remediation when an alert fires."
      ],
      tip: "Budgets alert, Advisor recommends, Policy enforces, Workbooks visualize, Automation remediates."
    },
    {
      heading: "Microsoft Sentinel vs Defender for Cloud",
      table: {
        headers: ["", "Microsoft Sentinel", "Microsoft Defender for Cloud"],
        rows: [
          ["Primary role", "Cloud-native SIEM/SOAR", "CSPM/CWPP for cloud posture and workload protection"],
          ["Scope", "Azure, AWS, GCP, M365, on-premises, third-party logs", "Azure resources plus hybrid and selected clouds"],
          ["Detection", "Analytics rules, fusion, UEBA, threat hunting", "Secure score, recommendations, resource threat alerts"],
          ["Response", "Logic Apps playbooks and incidents", "Recommendations and auto-remediation"],
          ["Cost model", "Pay per GB ingested", "Per plan/resource enabled"],
          ["Choose when", "Enterprise SOC and cross-platform correlation", "Improve Azure posture, compliance, and workload protection"]
        ]
      },
      points: [
        "Sentinel uses a Log Analytics workspace; its data is queried with KQL in tables such as SecurityEvent, SigninLogs, and AzureActivity.",
        "Sentinel playbooks are Azure Logic Apps triggered by alerts or incidents.",
        "Defender for Cloud provides secure score, regulatory compliance, recommendations, and Defender plans for workloads such as Servers, SQL, Storage, Containers, App Service, Key Vault, and DNS."
      ],
      tip: "Cross-source SOC + SOAR = Sentinel. Secure score, compliance gaps, and workload protections = Defender for Cloud."
    },
    {
      heading: "Exam skills mapping",
      points: [
        "Recommend a logging solution: Log Analytics workspace design, single vs multi-workspace, Application Insights, retention, and archive.",
        "Recommend a solution for routing logs: diagnostic settings, Data Collection Rules, and destinations such as Log Analytics, Storage, Event Hubs, partner solutions, and cross-tenant monitoring patterns.",
        "Recommend a monitoring solution: Azure Monitor metrics vs logs, alerts and action groups, Workbooks, Application Insights APM/distributed tracing, availability tests, VM insights, Container insights, Microsoft Sentinel SIEM/SOAR, and Defender for Cloud."
      ],
      tip: "Monitoring scenarios usually hinge on three decisions: what signal to collect, where to route/store it, and what alert or response should act on it."
    }
  ],

  flashcards: [
    { front: "Azure Monitor in one sentence", back: "The central platform for metrics, logs, alerts, dashboards, and telemetry from Azure resources, OS agents, applications, and custom sources." },
    { front: "Metrics vs logs", back: "Metrics are fast numeric time-series data for thresholds and autoscale. Logs are rich records stored in Log Analytics and queried with KQL." },
    { front: "What is the default metric retention in Azure Monitor?", back: "Azure Monitor platform metrics are retained for **93 days**." },
    { front: "What stores Azure Monitor Logs?", back: "A **Log Analytics workspace**, backed by Azure Data Explorer and queried with KQL." },
    { front: "Centralized vs decentralized Log Analytics", back: "Centralized is simpler and supports cross-resource queries. Decentralized is for sovereignty, billing, or strict team isolation." },
    { front: "Diagnostic settings destination rule", back: "Log Analytics for query/alerts, Storage for cheap long retention, Event Hubs for external SIEM or streaming integration." },
    { front: "Which agent should new VM monitoring use?", back: "**Azure Monitor Agent (AMA)** with **Data Collection Rules (DCRs)**. MMA/OMS and diagnostics extensions are legacy." },
    { front: "What do Data Collection Rules define?", back: "DCRs define what AMA collects from machines and where that data is sent." },
    { front: "Metric alert vs log alert", back: "Metric alert = threshold on a metric. Log alert = KQL query result, useful for complex conditions and aggregations." },
    { front: "When do you use an Activity Log alert?", back: "For Azure control-plane events such as VM deletion, role changes, policy assignments, or Service Health incidents." },
    { front: "What is an action group?", back: "A reusable set of notification and remediation actions, such as email, webhook, Logic App, Automation runbook, Function, or ITSM connector." },
    { front: "Application Insights use case", back: "APM for requests, dependencies, exceptions, traces, availability tests, Application Map, Live Metrics, and smart detection." },
    { front: "What are Workbooks best for?", back: "Interactive, parameterized reports that combine metrics, logs, text, and visualizations for operations or security dashboards." },
    { front: "Budget vs Advisor vs Policy", back: "Budgets alert on spend, Advisor recommends optimizations, and Azure Policy enforces governance such as required tags." },
    { front: "Azure Status vs Service Health vs Resource Health", back: "Azure Status is public/global. Service Health is personalized to your subscriptions and regions. Resource Health is per-resource availability." },
    { front: "Azure Automation exam clues", back: "Scheduled VM start/stop, patch deployment, configuration drift with DSC, or remediation runbooks triggered by alerts." },
    { front: "Sentinel vs Defender for Cloud", back: "Sentinel = SIEM/SOAR for cross-platform detection and response. Defender for Cloud = secure posture, compliance, and workload protection." },
    { front: "What are Sentinel playbooks?", back: "Azure Logic Apps workflows triggered by Sentinel alerts or incidents to automate response such as blocking IPs or disabling users." },
    { front: "DCR vs diagnostic settings", back: "DCRs tell AMA what machine data to collect and where to send it. Diagnostic settings route Azure resource logs/metrics and Activity Logs to destinations." },
    { front: "When do you use archive instead of hot Log Analytics retention?", back: "Use archive or Storage when retention is required for compliance but queries are rare; keep hot retention for frequently queried operational data." },
    { front: "What is cross-tenant monitoring pattern?", back: "Use Azure Lighthouse or delegated access to query and manage monitoring across customer tenants while keeping workspaces in the appropriate tenants/subscriptions." },
    { front: "Availability tests in Application Insights", back: "Synthetic HTTP tests from multiple regions that verify endpoint availability and can alert when an app is unreachable." },
    { front: "VM insights", back: "Azure Monitor experience for VM performance, dependency maps, processes, and guest OS signals using AMA and Log Analytics." },
    { front: "Container insights", back: "Azure Monitor experience for AKS/container performance, node and pod metrics, container logs, and Kubernetes health." },
    { front: "Application Insights sampling", back: "Sampling reduces telemetry volume and cost while preserving useful request, dependency, exception, and trace patterns." },
    { front: "Sentinel analytics rule vs incident", back: "Analytics rules detect threats from KQL/ML and create alerts; Sentinel groups related alerts into incidents for investigation and response." }
  ],

  questions: [
    {
      id: "mon-q1", type: "single",
      question: "A team needs to trigger an alert when VM CPU is above 90 percent for five minutes and notify the on-call engineer. What should you configure?",
      options: ["Activity Log alert with Service Health", "Metric alert with an action group", "Log Analytics workspace archive", "Application Insights availability test"],
      correct: [1],
      explanation: "CPU percentage is a numeric platform metric, so a metric alert is the right detector. The action group handles notification to the on-call engineer. Activity Log alerts are for control-plane events, not performance thresholds.",
      tip: "Numeric threshold such as CPU, memory, DTU, or request count usually means metric alert plus action group."
    },
    {
      id: "mon-q2", type: "single",
      question: "Security analysts must identify users with more than 10 failed sign-ins in the last hour and group results by user. Which monitoring capability is required?",
      options: ["Metric alert on sign-in count", "KQL query in Log Analytics", "Azure Advisor recommendation", "Service Health alert"],
      correct: [1],
      explanation: "The requirement needs filtering by time, counting failed sign-ins, and grouping by user, which is a KQL aggregation over sign-in logs. Metrics do not provide the needed log detail or query flexibility.",
      tip: "If you see `where`, `summarize`, grouping, or security log records, choose Log Analytics/KQL."
    },
    {
      id: "mon-q3", type: "single",
      question: "An Azure SQL Database must send query and audit logs to a workspace for KQL queries and alerting. What must be configured on the resource?",
      options: ["Diagnostic settings to a Log Analytics workspace", "A metric alert only", "Azure Advisor", "A Storage lifecycle rule"],
      correct: [0],
      explanation: "Diagnostic settings route resource diagnostic logs and metrics to destinations such as Log Analytics. Without diagnostic settings, most resource logs do not automatically flow to the workspace.",
      tip: "Resource logs into Log Analytics = diagnostic settings."
    },
    {
      id: "mon-q4", type: "single",
      question: "A compliance team must retain platform logs for seven years at the lowest cost. The logs are rarely queried. Which diagnostic destination should you choose?",
      options: ["Log Analytics hot retention only", "Storage Account", "Application Insights", "Azure Monitor Metrics"],
      correct: [1],
      explanation: "A Storage Account is the low-cost destination for long-term archival when logs are rarely queried. Log Analytics is better when frequent KQL query and alerting are required but is not the cheapest archive-only option.",
      tip: "Long retention plus rare query means Storage, not Log Analytics."
    },
    {
      id: "mon-q5", type: "single",
      question: "A company must stream Azure resource logs to Splunk in near real time. Which design is correct?",
      options: ["Diagnostic settings to Event Hubs", "Diagnostic settings to Storage only", "Metric alert to email", "Azure Workbooks"],
      correct: [0],
      explanation: "Event Hubs is the standard streaming destination for diagnostic settings when logs need to feed an external SIEM or real-time pipeline. Storage is for archival and Workbooks are for visualization.",
      tip: "External SIEM or streaming pipeline = Event Hubs."
    },
    {
      id: "mon-q6", type: "single",
      question: "A new design must collect Windows and Linux VM logs from Azure VMs and Arc-enabled servers using the current Microsoft agent. What should be deployed?",
      options: ["MMA/OMS agent", "Azure Monitor Agent with Data Collection Rules", "Diagnostics Extension only", "Application Insights SDK only"],
      correct: [1],
      explanation: "Azure Monitor Agent is the current preferred agent for Windows, Linux, Azure VMs, and Arc-enabled servers. Data Collection Rules define what it collects and where the data goes. MMA/OMS and diagnostics extensions are legacy.",
      tip: "New machine monitoring = AMA + DCR."
    },
    {
      id: "mon-q7", type: "multi",
      question: "Which statements about diagnostic settings are TRUE? (Select all that apply.)",
      options: [
        "They can route resource logs to Log Analytics for KQL queries",
        "They can stream logs to Event Hubs for external SIEM integration",
        "They automatically exist for every resource and require no configuration",
        "They can send logs to Storage for long-term archival"
      ],
      correct: [0, 1, 3],
      explanation: "Diagnostic settings can route to Log Analytics, Event Hubs, Storage, and partner destinations. They usually must be explicitly configured; resource logs do not simply appear in a workspace by default.",
      tip: "In multi-select questions, reject claims that monitoring data flows automatically without configuration unless the service explicitly does so."
    },
    {
      id: "mon-q8", type: "single",
      question: "Developers need to see request duration, failed dependencies, exceptions, and a visual topology of service calls for a web app. Which service is the best fit?",
      options: ["Azure Monitor Metrics only", "Application Insights", "Azure Service Health", "Cost Management"],
      correct: [1],
      explanation: "Application Insights is Azure's APM service and captures requests, dependencies, exceptions, traces, and Application Map. Platform metrics alone cannot provide end-to-end dependency tracing or exception detail.",
      tip: "Requests, dependencies, exceptions, and Application Map are Application Insights clues."
    },
    {
      id: "mon-q9", type: "single",
      question: "During a deployment, the team needs a near-real-time stream of request rates, failures, and response times without waiting for normal log ingestion latency. What should they use?",
      options: ["Application Insights Live Metrics", "Azure Advisor", "Storage Account diagnostic archive", "Activity Log"],
      correct: [0],
      explanation: "Live Metrics in Application Insights provides real-time application telemetry that is useful during deployments. Storage archive and Activity Log do not provide live app performance streams.",
      tip: "Real-time app telemetry during release = Live Metrics."
    },
    {
      id: "mon-q10", type: "single",
      question: "A support team wants one reusable notification target for five different alerts, including email, webhook, and an Automation runbook. What should be created?",
      options: ["Five separate Log Analytics workspaces", "One action group attached to all alerts", "One Azure Policy initiative", "One Azure Workbook"],
      correct: [1],
      explanation: "Action groups are reusable collections of notification and remediation actions. The same action group can be attached to many alert rules, avoiding duplicate notification configuration.",
      tip: "Multiple alerts sharing the same response path = one action group reused."
    },
    {
      id: "mon-q11", type: "single",
      question: "An administrator deletes a production VM. The operations team must be alerted whenever this control-plane operation occurs. Which alert type should be configured?",
      options: ["Metric alert", "Activity Log alert", "Application Insights smart detection", "Cost budget alert"],
      correct: [1],
      explanation: "Deleting a VM is an Azure Resource Manager control-plane event recorded in the Activity Log. Activity Log alerts are designed for these events, including deletes, role changes, policy assignments, and service health.",
      tip: "Who did what to an Azure resource = Activity Log."
    },
    {
      id: "mon-q12", type: "multi",
      question: "Which pairings are correct for Azure Monitor alerting? (Select all that apply.)",
      options: [
        "Metric alert — threshold on numeric platform metrics",
        "Log alert — KQL query results",
        "Activity Log alert — control-plane operations such as role changes",
        "Smart detection — manual fixed CPU threshold"
      ],
      correct: [0, 1, 2],
      explanation: "Metric alerts evaluate metric thresholds, log alerts evaluate KQL query results, and Activity Log alerts evaluate Azure control-plane events. Smart detection is ML-based anomaly detection in Application Insights, not a manual CPU threshold.",
      tip: "Smart detection equals anomaly detection, not a fixed threshold."
    },
    {
      id: "mon-q13", type: "single",
      question: "An enterprise SOC needs centralized security monitoring across Azure, AWS, Microsoft 365, and on-premises firewalls, with correlated incidents and automated response playbooks. Which service should lead the design?",
      options: ["Microsoft Sentinel", "Azure Advisor", "Azure Monitor Metrics", "Cost Management"],
      correct: [0],
      explanation: "Microsoft Sentinel is a cloud-native SIEM/SOAR platform that ingests cross-platform logs, correlates alerts into incidents, supports threat hunting, and triggers Logic Apps playbooks for response.",
      tip: "Cross-platform SOC plus SOAR = Sentinel."
    },
    {
      id: "mon-q14", type: "single",
      question: "A cloud security team wants secure score, regulatory compliance views, and recommendations to harden Azure workloads. Which service is the best fit?",
      options: ["Microsoft Sentinel", "Microsoft Defender for Cloud", "Azure Workbooks only", "Event Hubs"],
      correct: [1],
      explanation: "Defender for Cloud provides cloud security posture management, secure score, regulatory compliance, recommendations, and workload protection plans. Sentinel focuses on SIEM/SOAR and cross-source investigation.",
      tip: "Secure score and posture recommendations = Defender for Cloud."
    },
    {
      id: "mon-q15", type: "single",
      question: "A Sentinel incident should automatically create a ticket, post to Teams, and disable a compromised account. What implements this workflow?",
      options: ["Sentinel playbook using Azure Logic Apps", "Azure Monitor metric alert only", "Storage lifecycle management", "Azure Advisor"],
      correct: [0],
      explanation: "Sentinel playbooks are Logic Apps workflows triggered by Sentinel alerts or incidents and are used for SOAR actions such as creating tickets, notifying teams, or disabling accounts.",
      tip: "Automated response from Sentinel incidents = playbook = Logic App."
    },
    {
      id: "mon-q16", type: "single",
      question: "Operations wants an interactive dashboard that combines KQL query results, metric charts, text guidance, and parameters for different resource groups. What should they build?",
      options: ["Azure Workbook", "Azure Policy definition", "Action group", "Service Health alert"],
      correct: [0],
      explanation: "Azure Workbooks are interactive reports that combine metrics, logs, parameters, text, and visualizations. They are ideal for operational dashboards and runbook-style views.",
      tip: "Interactive report combining logs and metrics = Workbook."
    },
    {
      id: "mon-q17", type: "single",
      question: "Finance wants an alert when monthly spend reaches 80 percent of an approved amount. They do not need optimization recommendations. What should you configure?",
      options: ["Azure Advisor", "Cost Management Budget", "Azure Policy Deny", "Application Insights smart detection"],
      correct: [1],
      explanation: "Cost Management Budgets generate alerts when spending reaches configured thresholds. Advisor provides recommendations, and Policy enforces resource rules; neither is the primary budget-threshold alerting feature.",
      tip: "Spend threshold alert = Budget. Recommendations = Advisor. Enforcement = Policy."
    },
    {
      id: "mon-q18", type: "multi",
      question: "Which services or features match these operational needs? (Select all that apply.)",
      options: [
        "Azure Service Health for planned maintenance affecting your subscriptions and regions",
        "Azure Automation Update Management for centralized patch deployment",
        "Azure Advisor for personalized best-practice recommendations",
        "Azure Monitor Metrics for storing seven years of rarely queried audit logs"
      ],
      correct: [0, 1, 2],
      explanation: "Service Health is personalized for incidents and maintenance, Automation Update Management handles patch deployment, and Advisor gives best-practice recommendations. Metrics are not a seven-year audit log archive; use diagnostic settings to Storage for that scenario.",
      tip: "For long audit retention, eliminate metrics and choose a log archive destination."
    },
    {
      id: "mon-q19", type: "multi",
      question: "Which requirements point to Application Insights rather than Azure Monitor platform metrics alone? (Select all that apply.)",
      options: [
        "Track dependency failures from a web app to a SQL database",
        "Visualize a distributed application topology",
        "Detect application exception spikes",
        "Autoscale a VM scale set based on CPU percentage"
      ],
      correct: [0, 1, 2],
      explanation: "Dependencies, Application Map topology, and exceptions are Application Insights APM capabilities. Autoscale based on CPU uses platform metrics and does not require Application Insights.",
      tip: "App behavior and code-level telemetry = Application Insights; infrastructure numeric thresholds = metrics."
    },
    {
      id: "mon-q20", type: "single",
      question: "A company wants to auto-start development VMs at 8 AM, stop them at 6 PM, and run remediation scripts from alerts. Which Azure service fits best?",
      options: ["Azure Automation", "Azure Workbooks", "Azure Status", "Event Hubs"],
      correct: [0],
      explanation: "Azure Automation supports scheduled runbooks and runbooks triggered by alert action groups. It is the right service for start/stop schedules and scripted remediation. Workbooks visualize data, and Event Hubs streams logs.",
      tip: "Scheduled operational scripts or alert-triggered runbooks = Azure Automation."
    },
    {
      id: "mon-q21", type: "single",
      question: "A global company wants one place to query operational logs across most Azure resources, but EU security logs must remain isolated for data residency. Which workspace design is best?",
      options: ["One centralized workspace for everything including EU security logs", "Centralized workspace for common logs plus separate EU workspace for regulated logs", "A separate workspace for every VM", "Storage accounts only, with no Log Analytics"],
      correct: [1],
      explanation: "Centralization is the default because it simplifies query and alerting, but explicit data residency or isolation requirements justify separate workspaces. Splitting every VM creates unnecessary complexity, while Storage-only removes KQL analytics.",
      tip: "Default to centralized, then split only for sovereignty, isolation, or billing boundaries."
    },
    {
      id: "mon-q22", type: "single",
      question: "Application logs must be searchable with KQL for 90 days, then retained cheaply for seven years with rare access. Which approach best balances query performance and cost?",
      options: ["Keep all seven years in hot Log Analytics retention", "Use Log Analytics hot retention for 90 days and archive/export older logs", "Use Azure Monitor Metrics only", "Send logs only to Application Insights Live Metrics"],
      correct: [1],
      explanation: "Hot Log Analytics retention should cover the active query window, while archive or export to low-cost storage handles long-term compliance retention. Metrics and Live Metrics do not satisfy long-term searchable log retention.",
      tip: "Separate operational query windows from compliance retention windows to control cost."
    },
    {
      id: "mon-q23", type: "multi",
      question: "Which statements correctly distinguish Data Collection Rules from diagnostic settings? (Select all that apply.)",
      options: [
        "DCRs define what Azure Monitor Agent collects from machines and where it sends the data",
        "Diagnostic settings route Azure resource logs and metrics to destinations such as Log Analytics, Storage, or Event Hubs",
        "DCRs are the primary way to stream Azure SQL resource logs to Splunk",
        "Diagnostic settings can route subscription Activity Log data"
      ],
      correct: [0, 1, 3],
      explanation: "DCRs configure AMA-based machine data collection. Diagnostic settings route platform/resource logs and metrics, including Activity Log routing, to destinations. Streaming resource logs to Splunk is a diagnostic setting to Event Hubs pattern, not a DCR pattern.",
      tip: "Machine guest data = AMA/DCR. Azure resource/platform logs = diagnostic settings."
    },
    {
      id: "mon-q24", type: "single",
      question: "A managed service provider must monitor Azure resources in several customer tenants without moving all logs into the provider tenant. What should you recommend?",
      options: ["Use Azure Lighthouse delegated access with customer workspaces", "Require all customers to invite users as B2C accounts", "Export every log to a single unmanaged CSV file", "Use only public Azure Status"],
      correct: [0],
      explanation: "Azure Lighthouse enables cross-tenant delegated resource management, letting the provider view and manage monitoring across customer tenants while data remains in customer subscriptions and workspaces. B2C and Azure Status do not solve delegated monitoring.",
      tip: "Cross-tenant Azure operations and monitoring usually points to Azure Lighthouse or delegated access, not copying all data to one tenant."
    },
    {
      id: "mon-q25", type: "single",
      question: "A public web endpoint must be tested from several geographic regions every five minutes, with alerts if more than two regions fail. Which monitoring feature should you use?",
      options: ["Application Insights availability tests", "Azure Advisor", "VM insights", "Cost Management budgets"],
      correct: [0],
      explanation: "Application Insights availability tests perform synthetic HTTP checks from multiple regions and can trigger alerts based on failures. VM insights monitors VM health, and Advisor/Budgets do not perform endpoint checks.",
      tip: "Synthetic HTTP checks from multiple regions = Application Insights availability tests."
    },
    {
      id: "mon-q26", type: "multi",
      question: "A platform team needs deep operational visibility for Azure VMs and AKS clusters. Which Azure Monitor capabilities should be considered? (Select all that apply.)",
      options: [
        "VM insights for guest performance and dependency maps",
        "Container insights for AKS node, pod, and container telemetry",
        "Application Insights availability tests to domain-join VMs",
        "Log Analytics workspace to query collected VM and container data"
      ],
      correct: [0, 1, 3],
      explanation: "VM insights provides VM performance and dependency views, Container insights provides AKS/container health and telemetry, and Log Analytics stores/query collected data. Availability tests check HTTP endpoints; they do not domain-join VMs.",
      tip: "VMs = VM insights; AKS/containers = Container insights; both commonly rely on Log Analytics."
    },
    {
      id: "mon-q27", type: "single",
      question: "An operations director wants an interactive outage runbook that combines KQL queries, metric charts, Markdown instructions, and parameters for selecting a region. Which tool is best?",
      options: ["Azure Workbook", "Action group", "Event Hub", "Diagnostic setting"],
      correct: [0],
      explanation: "Azure Workbooks create interactive reports and runbook-style dashboards that combine KQL, metrics, text, and parameters. Action groups respond to alerts, Event Hubs streams data, and diagnostic settings route data.",
      tip: "Interactive dashboard plus parameters plus logs/metrics = Workbook."
    },
    {
      id: "mon-q28", type: "single",
      question: "A SOC wants KQL-based scheduled detections that create grouped investigations and can trigger Logic Apps response workflows. Which Microsoft Sentinel components are involved?",
      options: ["Analytics rules, incidents, and playbooks", "Metric alerts, budgets, and Advisor", "Resource Health, Azure Status, and tags", "DCRs, ASGs, and NSGs"],
      correct: [0],
      explanation: "Sentinel analytics rules run detections, alerts are grouped into incidents for investigation, and playbooks are Logic Apps workflows for response. The other options mix unrelated operational or networking concepts.",
      tip: "Sentinel detection-to-response chain: analytics rule → alert/incident → playbook."
    },
    {
      id: "mon-q29", type: "single",
      question: "A security manager asks for a dashboard showing regulatory compliance controls, security recommendations, and workload protection alerts for Azure resources. Which monitoring/security service is the right starting point?",
      options: ["Microsoft Defender for Cloud", "Application Insights", "Azure Monitor Metrics", "Traffic Manager"],
      correct: [0],
      explanation: "Defender for Cloud is the service for cloud security posture management, regulatory compliance, secure score, recommendations, and workload protection alerts. Application Insights focuses on app performance, and metrics alone do not provide posture management.",
      tip: "Regulatory compliance and secure score are Defender for Cloud clues."
    },
    {
      id: "mon-q30", type: "multi",
      question: "Which designs correctly pair alert conditions with response mechanisms? (Select all that apply.)",
      options: [
        "Metric alert on CPU paired with an action group that emails on-call staff",
        "Log alert from a KQL query paired with a webhook to create an incident",
        "Activity Log alert for Service Health events paired with an ITSM connector",
        "Storage archive paired with no alert rule to detect real-time outages"
      ],
      correct: [0, 1, 2],
      explanation: "Metric, log, and Activity Log alerts can all use action groups for notifications or integrations such as email, webhook, and ITSM. A storage archive is not an alert detector and will not detect outages in real time by itself.",
      tip: "Every alert design needs both a signal detector and an action path. Archive storage is neither."
    },
    {
      id: "mon-q31", type: "single",
      question: "A KQL query returns `AzureDiagnostics | where Level == 'Error' | summarize count() by Resource`. What does the query produce?",
      options: ["A count of error records grouped by resource", "A list of all resources with no filtering", "A CPU metric threshold alert", "A Service Health incident"],
      correct: [0],
      explanation: "The `where` clause filters rows to records where Level is Error, and `summarize count() by Resource` groups the remaining rows by resource and counts them. It is a log query, not a metric alert or Service Health event.",
      tip: "In KQL, `where` filters and `summarize ... by` aggregates by the specified column."
    },
    {
      id: "mon-q32", type: "single",
      question: "An application emits very high telemetry volume to Application Insights and costs are rising, but engineers still need representative request, dependency, and exception trends. What should you configure?",
      options: ["Adaptive or fixed-rate sampling", "Disable all telemetry", "Move all metrics to Azure Status", "Use an NSG flow log instead"],
      correct: [0],
      explanation: "Application Insights sampling reduces telemetry ingestion volume and cost while preserving representative patterns for requests, dependencies, exceptions, and traces. Disabling telemetry loses observability entirely, and Azure Status/NSG flow logs are unrelated.",
      tip: "High App Insights volume with need for representative trends = sampling."
    }
  ]
});
