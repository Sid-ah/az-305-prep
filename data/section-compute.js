AZ305.registerSection({
  id: "compute",
  title: "Compute",
  domain: "Infrastructure Solutions",
  weight: "30–35%",
  icon: "🖥️",
  order: 2,
  summary: "Compute questions test whether you can pick the **least operationally complex** platform that satisfies control, networking, scale, availability, and cost requirements. Master the decision tree across **VMs**, **VMSS**, **App Service**, **AKS**, **ACI**, **Functions**, **Batch**, and **Azure Arc**.",

  notes: [
    {
      heading: "VM Series, Availability, and Cost Choices",
      intro: "Virtual Machines are the answer when a workload needs full OS control, custom agents, legacy dependencies, or existing Windows and SQL licensing.",
      table: {
        headers: ["VM series", "Best for", "Exam clue"],
        rows: [
          ["**B**", "Burstable dev/test or small apps", "Low average CPU with short spikes; credits throttle to baseline when exhausted"],
          ["**D**", "General purpose", "Balanced CPU and memory for common production workloads"],
          ["**E**", "Memory optimized", "In-memory databases, SAP HANA, caching"],
          ["**F**", "Compute optimized", "Batch processing, game servers, high CPU-to-memory ratio"],
          ["**L**", "Storage optimized", "High disk throughput for Cassandra, Elasticsearch, NoSQL"],
          ["**M**", "Large memory", "Largest SAP HANA and scale-up memory workloads"],
          ["**N**", "GPU", "ML training, inference, graphics rendering" ]
        ]
      },
      points: [
        "**Availability Sets** protect against rack, power, and switch failure inside one datacenter and provide 99.95% SLA.",
        "**Availability Zones** protect against datacenter failure in a region and are the recommended choice for new production VMs with 99.99% SLA.",
        "**Proximity Placement Groups** co-locate VMs in the same datacenter for ultra-low latency between tightly coupled nodes."
      ],
      tip: "B-series is for bursty, low-average CPU. Sustained CPU pressure belongs on D, F, or another fixed-performance series, not burstable credits."
    },
    {
      heading: "VM Purchasing and Managed Disk Decisions",
      table: {
        headers: ["Option", "Savings / benefit", "Best for"],
        rows: [
          ["Pay-as-you-go", "No commitment", "Unpredictable workloads and dev/test"],
          ["Spot VMs", "Up to 90% but evictable with 30 seconds notice", "Batch, ML training, stateless fault-tolerant jobs"],
          ["Reserved Instances", "Up to 72% with 1-year or 3-year commitment", "Stable, long-running production"],
          ["Azure Hybrid Benefit", "Use existing Windows Server or SQL Server licenses", "License-cost optimization"],
          ["Dev/Test pricing", "Discounted non-production pricing", "Visual Studio subscription dev/test environments"],
          ["Dedicated Host", "Physical isolation", "Compliance scenarios needing dedicated hardware" ]
        ]
      },
      points: [
        "**Standard HDD** is for backup, cold data, and dev/test; **Standard SSD** fits lightly used web apps.",
        "**Premium SSD** supports production databases and is required for a single-VM 99.9% SLA when all disks are Premium SSD or better.",
        "**Premium SSD v2** and **Ultra Disk** are for high-throughput and extreme IOPS databases such as SQL Server and SAP HANA."
      ],
      tip: "If a single VM SLA is mentioned, check the disk tier. Standard disks disqualify the 99.9% single-VM SLA."
    },
    {
      heading: "Virtual Machine Scale Sets",
      intro: "VMSS adds autoscaling, rolling upgrades, health repair, and homogeneous or mixed VM management around a fleet of VMs.",
      table: {
        headers: ["Choice", "Description", "Use when"],
        rows: [
          ["Uniform orchestration", "All VMs use the same image and configuration", "Stateless, identical web or worker nodes"],
          ["Flexible orchestration", "Mix VM types and manage individual VMs", "Mixed workloads; preferred for many new deployments"],
          ["Metric-based scale", "Scale from Azure Monitor metrics", "CPU, memory, or custom metric thresholds"],
          ["Schedule-based scale", "Scale by time of day or week", "Known peaks such as business hours"],
          ["Predictive autoscale", "Uses historical patterns", "Pre-scale before expected demand" ]
        ]
      },
      points: [
        "**Health extension + automatic repairs** replaces unhealthy instances automatically.",
        "**Overprovisioning** creates extra VMs during scale-out and deletes the slowest ones, improving scale-out speed at no extra steady-state cost.",
        "Uniform scale sets support up to 1,000 instances; Flexible supports up to 600 instances."
      ],
      tip: "VMSS is for elastic fleets of VMs. If the app can be PaaS or serverless with less management, the exam often prefers the simpler platform."
    },
    {
      heading: "App Service and App Service Environment",
      table: {
        headers: ["Tier", "Autoscale / slots", "Networking", "Use case"],
        rows: [
          ["Free / Shared", "No autoscale, no slots", "No VNet integration", "Dev/test only; no SLA"],
          ["Basic", "No autoscale, no slots", "No VNet integration", "Simple apps that do not need scale"],
          ["Standard", "Autoscale up to 10 instances, 5 slots", "Outbound VNet Integration", "Standard production web apps and APIs"],
          ["Premium v3", "Autoscale up to 30 instances, 20 slots", "Outbound VNet Integration and zone redundancy", "High-scale production"],
          ["Isolated v2", "20 slots and dedicated scale", "Full VNet injection through ASE", "Compliance, private inbound, no shared infrastructure" ]
        ]
      },
      points: [
        "**Deployment slots** enable blue-green deployment, warm-up, swap, and rollback; sticky settings are not swapped.",
        "**Private Endpoint** gives inbound private access to an app and can remove public exposure.",
        "**Always On** keeps apps warm and is required for WebJobs; **Auto-heal** restarts on health thresholds."
      ],
      tip: "Web app plus slots and autoscale usually means Standard or Premium. Fully private, single-tenant, compliance isolation means Isolated v2 with an ASE."
    },
    {
      heading: "AKS Platform, Networking, Scaling, and Security",
      table: {
        headers: ["Area", "Choice", "Exam decision rule"],
        rows: [
          ["Tier", "Free / Standard / Premium", "Production needs Standard for API server SLA; Premium adds 99.95% and LTS Kubernetes"],
          ["Node pools", "System and user", "System pool runs critical pods and is Linux only; user pools run app workloads on Linux or Windows"],
          ["Scaling", "HPA, Cluster Autoscaler, KEDA", "HPA/KEDA scale pods; Cluster Autoscaler scales nodes when pods cannot schedule"],
          ["Networking", "Kubenet, Azure CNI, Azure CNI Overlay", "Azure CNI is for routable pod IPs and private endpoint/on-prem reachability; Overlay saves IP space"],
          ["Security", "Entra ID, Kubernetes RBAC, Azure RBAC, Workload Identity", "Use managed identity for pods instead of storing credentials" ]
        ]
      },
      points: [
        "**Private cluster** makes the API server reachable only from the VNet, removing the public API endpoint.",
        "**Azure Policy add-on** enforces pod security standards; **Defender for Containers** adds runtime threat detection and image vulnerability scanning.",
        "**Azure Disk** is single-writer storage for a pod; **Azure Files** supports multi-pod shared access."
      ],
      tip: "AKS is right for complex microservices, custom networking, service mesh, and full Kubernetes control. If Kubernetes control is not required, look for Container Apps, App Service, or ACI."
    },
    {
      heading: "ACI, Azure Functions, and Durable Functions",
      table: {
        headers: ["Service / plan", "Best for", "Key limitation or feature"],
        rows: [
          ["ACI", "Short-lived containers, CI/CD runners, event jobs", "Serverless container groups with per-second billing, not persistent orchestration"],
          ["AKS virtual nodes", "Bursting AKS workloads into ACI", "Adds capacity without adding cluster nodes"],
          ["Functions Consumption", "Short event-driven tasks and scale to zero", "Cold start; default 5-minute timeout, configurable to 10"],
          ["Functions Flex Consumption", "Serverless with VNet and concurrency control", "Faster cold start and configurable timeout"],
          ["Functions Premium", "Low latency, VNet-required, always warm", "No cold start, pre-warmed instances, unlimited timeout"],
          ["Dedicated Functions", "Run on existing App Service capacity", "Always-on if the App Service plan supports it" ]
        ]
      },
      points: [
        "**Durable Functions** adds stateful orchestration patterns: function chaining, fan-out/fan-in, async HTTP, human interaction, and monitor.",
        "Use ACI when you need a container quickly without a cluster, but not when you need full scheduling, service mesh, or long-running orchestration.",
        "Use Functions when execution is event-driven, bursty, and short; choose Premium or Durable when VNet, no cold starts, or orchestration is required."
      ],
      tip: "Serverless questions hinge on duration, state, and networking. Consumption for short scale-to-zero; Premium for VNet/no cold starts; Durable for long-running workflows."
    },
    {
      heading: "Azure Batch for Parallel and HPC Workloads",
      table: {
        headers: ["Batch concept", "Meaning"],
        rows: [
          ["Batch account", "Top-level resource, usually linked to storage for task input and output"],
          ["Pool", "Set of compute nodes configured with OS, VM size, autoscale, and networking"],
          ["Job", "Container for a collection of tasks"],
          ["Task", "Unit of work that runs a command or executable on a node"],
          ["Job Manager task", "Controls a job lifecycle and can submit child tasks dynamically" ]
        ]
      },
      points: [
        "Pools can use **Dedicated** nodes or lower-cost **Spot/low-priority** nodes for evictable work.",
        "**Start tasks** install software or mount storage when a node joins a pool; **application packages** deploy zipped apps automatically.",
        "Batch supports VNet integration and HPC VM sizes, including MPI and InfiniBand scenarios."
      ],
      tip: "Rendering, simulation, transcoding, scientific computing, and massively parallel jobs are Batch clues — especially when cost can be lowered with Spot nodes."
    },
    {
      heading: "Azure Arc and Compute Selection Rules",
      table: {
        headers: ["Scenario", "Best compute choice", "Reason"],
        rows: [
          ["Lift-and-shift Windows Server", "Azure VMs", "Full OS control and Hybrid Benefit"],
          ["Web app with blue-green deployment", "App Service Standard or Premium", "Deployment slots and autoscale"],
          ["Fully private compliance web app", "App Service Isolated v2", "ASE gives VNet injection and dedicated infrastructure"],
          ["Large microservices platform", "AKS", "Full Kubernetes control and mixed node pools"],
          ["Queue-triggered tasks under 10 minutes", "Azure Functions Consumption", "Scale to zero and pay per execution"],
          ["Render 100,000 frames", "Azure Batch with Spot nodes", "Massively parallel workload"],
          ["Manage on-prem servers with Azure Policy", "Azure Arc-enabled Servers", "Azure management without moving the workload" ]
        ]
      },
      points: [
        "Azure Arc manages non-Azure servers, Kubernetes clusters, data services, VMware, and SCVMM through Azure Resource Manager.",
        "Arc enables Azure Policy guest configuration, Defender for Cloud, Azure Monitor, Update Manager, Azure RBAC, and Kubernetes GitOps.",
        "Arc does **not** migrate workloads to Azure; it brings Azure management to workloads wherever they run."
      ],
      tip: "On-premises or multi-cloud governance, monitoring, Defender, patching, or policy equals Azure Arc — not a migration service and not native Azure compute."
    },

    {
      heading: "Exam skills mapping",
      points: [
        "Specify components of a compute solution based on workload requirements: control vs PaaS trade-offs, OS and licensing needs, scaling model, networking, and operations effort.",
        "Recommend a **VM-based solution**: VM series, availability zones vs availability sets, scale sets, Spot vs Reserved Instances, Azure Hybrid Benefit, and Dedicated Host.",
        "Recommend a **container-based solution**: choose AKS, Container Apps, ACI, App Service for Containers, or AKS virtual nodes based on orchestration and control requirements.",
        "Recommend a **serverless-based solution**: match Azure Functions Consumption, Flex Consumption, Premium, Dedicated, Durable Functions, and Logic Apps to cold start, VNet, duration, and workflow needs.",
        "Recommend a compute solution for **batch processing**: Azure Batch pools, jobs, tasks, Spot/low-priority nodes, autoscale, and HPC/MPI support."
      ],
      tip: "For exam scenarios, first identify the workload shape: full OS, web app, container, event-driven task, workflow, or parallel batch job. Then choose the least complex service that still meets the hard requirements."
    }
  ],

  flashcards: [
    { front: "When should you choose Azure VMs?", back: "Choose VMs for full OS control, custom kernel or agents, legacy dependencies, lift-and-shift, or license reuse with Azure Hybrid Benefit." },
    { front: "B-series VM decision rule", back: "Use **B-series** for low average CPU with occasional spikes. Avoid it for sustained CPU because credits drain and CPU is throttled to baseline." },
    { front: "Availability Set vs Availability Zone", back: "Availability Set protects against rack/power/switch failures within one datacenter. Availability Zone protects against datacenter failure within a region and is preferred for new production VMs." },
    { front: "What does a Proximity Placement Group do?", back: "It co-locates VMs in the same datacenter to minimize latency for tightly coupled HPC or latency-sensitive workloads." },
    { front: "Single VM 99.9% SLA disk requirement", back: "All attached disks must be **Premium SSD or better**. Standard HDD or Standard SSD disqualifies the single-VM 99.9% SLA." },
    { front: "Spot VMs vs Reserved Instances", back: "Spot VMs are cheap but evictable, best for fault-tolerant jobs. Reserved Instances require 1-year or 3-year commitment and fit stable production workloads." },
    { front: "VMSS Uniform vs Flexible", back: "Uniform uses identical image and configuration for homogeneous fleets. Flexible allows mixed VM types and per-VM management, often preferred for newer mixed workloads." },
    { front: "VMSS scaling methods", back: "Metric-based scales on metrics, schedule-based scales for known times, and predictive autoscale pre-scales using historical demand patterns." },
    { front: "App Service tier for deployment slots", back: "Deployment slots start at **Standard**. Standard has 5 slots; Premium v3 and Isolated v2 support up to 20 slots." },
    { front: "When is App Service Isolated v2 the answer?", back: "When the app needs single-tenant dedicated infrastructure, full VNet injection, private inbound networking, or compliance isolation beyond Premium." },
    { front: "AKS production tier rule", back: "Production AKS should use **Standard** for an API server SLA. Premium adds a higher SLA and Long-Term Support Kubernetes versions." },
    { front: "HPA vs Cluster Autoscaler vs KEDA", back: "HPA and KEDA scale pod replicas; Cluster Autoscaler scales node count when pods cannot schedule. KEDA reacts to external events such as queues, topics, HTTP, or cron." },
    { front: "AKS networking exam rule", back: "Use **Azure CNI** when pods need VNet-routable IPs, Private Endpoints, NSG targeting, or on-premises reachability over VPN/ExpressRoute. Use Overlay to save IP space." },
    { front: "ACI best use case", back: "ACI is serverless containers for short-lived tasks, simple container groups, CI/CD runners, or burst capacity with AKS virtual nodes." },
    { front: "Functions hosting plan decision", back: "Consumption = scale to zero and pay per execution. Premium = no cold start, VNet, pre-warmed, long-running. Dedicated = run on an existing App Service plan." },
    { front: "Durable Functions patterns", back: "Function chaining, fan-out/fan-in, async HTTP, human interaction, and monitor — all for stateful orchestration in serverless apps." },
    { front: "Azure Batch exam clue", back: "Massively parallel, embarrassingly parallel, rendering, simulation, transcoding, genome sequencing, or HPC/MPI workloads point to Azure Batch." },
    { front: "What does Azure Arc do?", back: "Azure Arc projects non-Azure servers, Kubernetes, data services, and VMware/SCVMM into Azure Resource Manager for Policy, Monitor, Defender, RBAC, Update Manager, and GitOps." },
    { front: "Arc vs migration", back: "Arc does **not** move workloads to Azure. It applies Azure management to workloads wherever they run, including on-premises and other clouds." },
    { front: "Compute elimination rule", back: "Prefer the least operationally complex option that meets requirements: App Service for web apps, Functions for event-driven tasks, Container Apps/ACI for light containers, AKS only for full Kubernetes control." },

    { front: "Container Apps vs AKS vs ACI", back: "Container Apps = managed event-driven microservices with KEDA/Dapr and minimal Kubernetes ops. AKS = full Kubernetes control. ACI = simple short-lived containers or container groups." },
    { front: "Azure Hybrid Benefit vs Reserved Instances", back: "Azure Hybrid Benefit applies existing Windows Server or SQL Server licenses. Reserved Instances discount steady VM compute with 1-year or 3-year commitment. They can be combined when eligible." },
    { front: "Dedicated Host exam clue", back: "Choose Azure Dedicated Host when the scenario requires physical server isolation for compliance, licensing, or host-level control. It is not a cost-saving option." },
    { front: "Functions Premium vs Dedicated", back: "Premium gives serverless scale with pre-warmed instances, VNet support, and no cold start. Dedicated runs Functions on an App Service plan you already manage and pay for." },
    { front: "Batch start task and application packages", back: "A start task runs when each Batch node joins the pool to install software or mount storage. Application packages distribute zipped app binaries to nodes automatically." }
  ],

  questions: [
    {
      id: "comp-q1", type: "single",
      question: "A dev/test web app has low average CPU use but short unpredictable spikes. The team wants the lowest VM cost and accepts throttling if credits are exhausted. Which VM series should you recommend?",
      options: ["D-series", "B-series", "F-series", "M-series"],
      correct: [1],
      explanation: "B-series VMs earn CPU credits when running below baseline and spend them during bursts, which matches low-average CPU with occasional spikes. D-series and F-series provide fixed general or compute-optimized capacity at higher cost. M-series is for very large memory workloads and is excessive here.",
      tip: "Spot the phrase 'low average CPU with bursts.' That is the B-series credit model; sustained high CPU would eliminate it."
    },
    {
      id: "comp-q2", type: "single",
      question: "A single production VM must meet the Azure single-VM 99.9% SLA. Which disk configuration is required?",
      options: ["All disks are Standard HDD", "OS disk is Premium SSD but data disks are Standard SSD", "All disks are Premium SSD or better", "At least one disk is Ultra Disk"],
      correct: [2],
      explanation: "A single VM qualifies for the 99.9% SLA only when all attached disks are Premium SSD or better. Standard HDD or Standard SSD on any attached disk disqualifies that SLA. Ultra Disk is not required unless the workload needs extreme IOPS.",
      tip: "For single-VM SLA questions, scan for 'all disks.' One Standard disk makes the option wrong."
    },
    {
      id: "comp-q3", type: "single",
      question: "A tightly coupled HPC workload has multiple VMs that frequently exchange latency-sensitive messages. What should you add to minimize inter-VM latency?",
      options: ["An Availability Set", "A Proximity Placement Group", "A Basic Load Balancer", "Azure Arc-enabled Servers"],
      correct: [1],
      explanation: "A Proximity Placement Group co-locates VMs in the same datacenter to reduce latency between them. Availability Sets improve fault-domain placement but do not guarantee the lowest latency. Load Balancer distributes traffic, and Azure Arc is for hybrid management.",
      tip: "Keywords like 'tightly coupled' and 'low inter-VM latency' point to Proximity Placement Groups, not general HA features."
    },
    {
      id: "comp-q4", type: "single",
      question: "A company needs 100 identical web front-end VMs to scale out when CPU stays high and replace unhealthy instances automatically. Which service best fits?",
      options: ["A single Azure VM with autoshutdown", "Virtual Machine Scale Sets", "Azure Batch", "Azure Arc-enabled Servers"],
      correct: [1],
      explanation: "VMSS manages a fleet of VMs with autoscale, health extension, automatic repairs, and rolling upgrades. Azure Batch is for jobs and tasks rather than always-on web front ends. Azure Arc manages resources outside Azure; it does not create an elastic Azure VM fleet.",
      tip: "Identical VM fleet plus autoscale and health repair means VMSS. Batch clues mention jobs, pools, and tasks."
    },
    {
      id: "comp-q5", type: "single",
      question: "A public web API needs autoscale and five deployment slots for staging, testing, and rollback. The team wants the lowest App Service tier that supports this. Which tier?",
      options: ["Basic", "Standard", "Premium v3", "Isolated v2"],
      correct: [1],
      explanation: "Standard App Service supports autoscale and five deployment slots, making it the lowest tier that meets the requirement. Basic lacks autoscale and slots. Premium v3 and Isolated v2 also work but cost more and are not the lowest sufficient tier.",
      tip: "Deployment slots start at Standard. If the question asks lowest tier, eliminate Premium and Isolated unless their extra features are required."
    },
    {
      id: "comp-q6", type: "single",
      question: "An App Service must be deployed into a dedicated, single-tenant environment with no shared infrastructure and fully private inbound access from a VNet. Which option should you choose?",
      options: ["App Service Basic", "App Service Standard with VNet Integration", "App Service Isolated v2 with an internal ASE", "Azure Functions Consumption"],
      correct: [2],
      explanation: "Isolated v2 with an App Service Environment provides dedicated single-tenant infrastructure and can be internal-only through the VNet. Standard VNet Integration is outbound only and does not make the worker environment single-tenant. Basic and Functions Consumption do not satisfy the isolation requirement.",
      tip: "Private inbound plus dedicated App Service infrastructure equals ASE/Isolated. VNet Integration alone is only outbound connectivity."
    },
    {
      id: "comp-q7", type: "multi",
      question: "Which App Service features are correctly matched to their purpose? (Select all that apply.)",
      options: [
        "Deployment slots enable warmed staging-to-production swaps and rollback",
        "Sticky slot settings are swapped to production during a slot swap",
        "Private Endpoint provides inbound private access to the app",
        "Always On keeps the app warm and is required for WebJobs"
      ],
      correct: [0, 2, 3],
      explanation: "Deployment slots support pre-warmed swaps and rollback, Private Endpoint provides inbound private access, and Always On keeps apps warm and supports WebJobs. Sticky slot settings are specifically not swapped, which is why they are useful for environment-specific values.",
      tip: "On slot questions, remember 'sticky means stays.' If an option says sticky settings swap, eliminate it."
    },
    {
      id: "comp-q8", type: "single",
      question: "A Kubernetes workload in AKS must access on-premises systems over ExpressRoute and apply NSG rules to pod traffic. Which networking model is the best fit?",
      options: ["Kubenet", "Azure CNI", "Basic networking with no VNet integration", "ACI virtual nodes only"],
      correct: [1],
      explanation: "Azure CNI assigns pods IPs from the VNet, making them directly routable and suitable for on-premises connectivity and NSG-based controls. Kubenet uses overlay pod IPs and is better for simpler or IP-constrained clusters. ACI virtual nodes provide burst capacity, not the primary networking model for this requirement.",
      tip: "Pods need to be routable in the VNet or reach on-premises? Pick Azure CNI or CNI Overlay, not Kubenet."
    },
    {
      id: "comp-q9", type: "multi",
      question: "Which AKS scaling statements are TRUE? (Select all that apply.)",
      options: [
        "Horizontal Pod Autoscaler scales pod replicas based on metrics",
        "Cluster Autoscaler adds nodes when pods cannot be scheduled",
        "KEDA can scale workloads based on external events such as queues or cron",
        "Cluster Autoscaler scales individual container CPU limits inside a pod"
      ],
      correct: [0, 1, 2],
      explanation: "HPA scales pod replicas, Cluster Autoscaler changes node count when capacity is insufficient, and KEDA scales based on external event sources. Cluster Autoscaler does not tune container CPU limits; it works at the node pool level.",
      tip: "Separate pods from nodes: HPA/KEDA are pod-level; Cluster Autoscaler is node-level."
    },
    {
      id: "comp-q10", type: "single",
      question: "A production AKS cluster needs an API server SLA and cluster autoscaler. Which AKS tier should you choose at minimum?",
      options: ["Free", "Standard", "Premium", "Developer"],
      correct: [1],
      explanation: "The Standard AKS tier provides an API server uptime SLA and production features such as cluster autoscaler. Free has no API server SLA and is suited for dev/test. Premium adds higher SLA and Long-Term Support versions but is not the minimum required here.",
      tip: "Production AKS with SLA starts at Standard. Premium is only needed when the question adds LTS or higher enterprise SLA requirements."
    },
    {
      id: "comp-q11", type: "single",
      question: "A team needs to run a single containerized build agent for a short job without creating or managing a Kubernetes cluster. Billing should be per second. Which service?",
      options: ["AKS", "Azure Container Instances", "App Service Isolated v2", "Azure Batch"],
      correct: [1],
      explanation: "ACI runs serverless containers and container groups with per-second billing and no cluster management, making it ideal for short build agents or tasks. AKS adds unnecessary cluster operations. Azure Batch is better for many parallel jobs, and App Service Isolated is for private web apps.",
      tip: "Single short-lived container plus no orchestration equals ACI. Many parallel tasks or HPC changes the answer to Batch."
    },
    {
      id: "comp-q12", type: "single",
      question: "An event-driven image-processing function must scale to zero and usually completes in less than two minutes. The app has no VNet requirement. Which Functions plan is the best cost choice?",
      options: ["Consumption", "Premium", "Dedicated App Service", "Isolated v2"],
      correct: [0],
      explanation: "Consumption is the most cost-effective plan for short event-driven tasks because it scales to zero and bills per execution. Premium avoids cold starts and supports stronger VNet scenarios but costs more. Dedicated and Isolated run on provisioned App Service capacity.",
      tip: "Short, event-driven, no VNet, cost-sensitive equals Consumption. Add no cold starts or VNet and reconsider Premium or Flex Consumption."
    },
    {
      id: "comp-q13", type: "single",
      question: "A serverless workflow must call three services in sequence, fan out to process hundreds of files in parallel, then wait for a manager approval before completion. Which feature should you use?",
      options: ["Plain Azure Functions Consumption only", "Durable Functions", "VMSS automatic repairs", "Azure Arc GitOps"],
      correct: [1],
      explanation: "Durable Functions provides stateful orchestration patterns including chaining, fan-out/fan-in, and human interaction. Plain functions are stateless and do not natively manage long-running workflow state. VMSS and Arc are unrelated to serverless orchestration.",
      tip: "When the words 'stateful', 'long-running', 'fan-out/fan-in', or 'human approval' appear with Functions, choose Durable Functions."
    },
    {
      id: "comp-q14", type: "single",
      question: "A rendering company needs to process 100,000 independent frames in parallel at minimum cost. Jobs can tolerate node eviction. Which design is best?",
      options: ["Azure Batch pool using Spot nodes", "App Service Standard with deployment slots", "Azure Functions Premium only", "Azure Arc-enabled Kubernetes"],
      correct: [0],
      explanation: "Azure Batch is designed for massively parallel workloads such as rendering, and Spot or low-priority nodes reduce cost when work can tolerate eviction. App Service and Arc are not job schedulers for HPC-style parallel rendering. Functions can process events but is not the best fit for large HPC pool scheduling.",
      tip: "Rendering many frames or scientific simulations are classic Batch clues. If eviction is acceptable, add Spot nodes for cost."
    },
    {
      id: "comp-q15", type: "multi",
      question: "Which scenarios are good fits for Azure Arc? (Select all that apply.)",
      options: [
        "Apply Azure Policy guest configuration to on-premises Linux servers",
        "Collect logs from AWS EC2 instances into Azure Monitor",
        "Move a VMware VM into Azure as an Azure VM",
        "Deploy GitOps configurations to an on-premises Kubernetes cluster"
      ],
      correct: [0, 1, 3],
      explanation: "Azure Arc brings Azure management to non-Azure servers and Kubernetes clusters, including Policy, Monitor, Defender, Update Manager, RBAC, and GitOps. It does not perform the actual migration of a VMware VM into Azure; Azure Migrate handles that scenario.",
      tip: "Arc means manage where it already runs. If the answer moves the workload to Azure, think migration instead."
    },
    {
      id: "comp-q16", type: "single",
      question: "A company wants to run Azure SQL Managed Instance inside its own datacenter while managing it with Azure tools. Which Azure Arc capability applies?",
      options: ["Arc-enabled Servers", "Arc-enabled Data Services", "Arc-enabled Kubernetes only", "VMSS Flexible orchestration"],
      correct: [1],
      explanation: "Arc-enabled Data Services can run Azure SQL Managed Instance or PostgreSQL on infrastructure outside Azure. Arc-enabled Servers manages OS instances, while Arc-enabled Kubernetes manages clusters. VMSS is an Azure VM fleet service and does not run SQL MI on-premises.",
      tip: "Azure SQL MI or PostgreSQL outside Azure maps to Arc-enabled Data Services, not Arc-enabled Servers."
    },
    {
      id: "comp-q17", type: "single",
      question: "A legacy line-of-business app requires a custom Windows service, local administrator access, and a vendor agent that is not supported on PaaS. Which compute choice is most appropriate?",
      options: ["Azure App Service", "Azure Functions", "Azure VMs", "Azure Container Instances"],
      correct: [2],
      explanation: "The workload requires full OS control and custom agents, which points to Azure VMs. App Service and Functions abstract the OS and restrict what can be installed. ACI runs containers and does not provide persistent VM-level administration.",
      tip: "Full OS control or unsupported legacy agent is a VM clue, even if PaaS would normally reduce operations."
    },
    {
      id: "comp-q18", type: "multi",
      question: "Which statements about App Service Environment are TRUE? (Select all that apply.)",
      options: [
        "It provides fully isolated, single-tenant App Service deployment into your VNet",
        "An internal ASE can avoid a public inbound endpoint",
        "It is the lowest-cost option for simple web apps",
        "It is chosen for compliance, private networking, or scale beyond Premium limits"
      ],
      correct: [0, 1, 3],
      explanation: "ASE provides isolated single-tenant App Service infrastructure deployed into a VNet, and an internal ASE can be private-only. It is expensive and intended for compliance, private networking, and high-scale scenarios, not simple low-cost web apps.",
      tip: "ASE is the heavy compliance/private-networking answer. If the scenario says simple or lowest cost, eliminate ASE."
    },
    {
      id: "comp-q19", type: "single",
      question: "An AKS workload needs extra burst capacity during seasonal spikes but the team does not want to add permanent cluster nodes. Which feature should be considered?",
      options: ["AKS virtual nodes backed by ACI", "Availability Sets", "Dedicated Hosts", "Azure Arc-enabled Servers"],
      correct: [0],
      explanation: "AKS virtual nodes let AKS burst pods into ACI during spikes without adding standard cluster nodes. Availability Sets and Dedicated Hosts are VM placement features. Azure Arc manages external resources and does not add AKS burst capacity.",
      tip: "Burst pods beyond AKS nodes equals virtual nodes with ACI. Burst CPU credits is a different B-series VM concept."
    },
    {
      id: "comp-q20", type: "single",
      question: "A company asks for the least operationally complex platform for a traditional REST API with built-in autoscale, custom domains, TLS, and deployment slots. There is no need for Kubernetes. What should you recommend?",
      options: ["AKS", "App Service", "Azure Batch", "Azure Arc-enabled Kubernetes"],
      correct: [1],
      explanation: "App Service provides managed hosting for web apps and REST APIs with autoscale, custom domains, TLS, and deployment slots while minimizing operations. AKS would add Kubernetes complexity without a stated need. Batch is for jobs, and Arc manages non-Azure Kubernetes rather than hosting a simple API.",
      tip: "If a web/API scenario does not require cluster control, avoid defaulting to AKS. App Service is usually the simpler correct answer."
    },

    {
      id: "comp-q21", type: "single",
      question: "A workload is a standard web API with no OS-level dependencies. The architecture team wants deployment slots, autoscale, custom domains, and the least infrastructure management. Which compute service should be recommended?",
      options: ["Azure VMs", "App Service", "Azure Batch", "Azure Dedicated Host"],
      correct: [1],
      explanation: "App Service is the managed PaaS platform for web apps and APIs and provides autoscale, deployment slots, custom domains, and TLS without VM administration. VMs and Dedicated Host provide OS control but add unnecessary operations. Azure Batch is for parallel jobs, not a standard web API front end.",
      tip: "When no OS control is required and the workload is web/API, eliminate VM-first answers and choose App Service."
    },
    {
      id: "comp-q22", type: "single",
      question: "A new production VM workload must tolerate the loss of an Azure datacenter in a region. Which availability option should you design for?",
      options: ["Availability Sets", "Availability Zones", "Proximity Placement Groups", "Single VM with Standard SSD"],
      correct: [1],
      explanation: "Availability Zones place resources across physically separate datacenters in a region and protect against datacenter failure. Availability Sets protect only against rack, power, or switch failure within a datacenter. Proximity Placement Groups optimize latency, not datacenter-level resiliency.",
      tip: "Datacenter failure equals Availability Zones. Rack or fault-domain wording points to Availability Sets."
    },
    {
      id: "comp-q23", type: "multi",
      question: "A company is optimizing VM cost and licensing for a stable Windows Server production workload. Which options can directly reduce cost without changing the application architecture? (Select all that apply.)",
      options: [
        "Reserved Instances for predictable compute usage",
        "Azure Hybrid Benefit for existing Windows Server licenses",
        "Spot VMs for the main stateful production database",
        "Dev/Test pricing for the production subscription"
      ],
      correct: [0, 1],
      explanation: "Reserved Instances reduce cost for stable, long-running compute, and Azure Hybrid Benefit uses existing Windows Server licenses to reduce OS licensing cost. Spot VMs are evictable and inappropriate for a main stateful production database. Dev/Test pricing is for non-production environments only.",
      tip: "Stable production cost optimization usually means Reserved Instances and Hybrid Benefit. Eliminate Spot for non-evictable production and Dev/Test for production."
    },
    {
      id: "comp-q24", type: "single",
      question: "A team wants to run containerized HTTP microservices with revisions, ingress, scale-to-zero, KEDA triggers, and Dapr, but they do not want to manage Kubernetes clusters. Which service fits best?",
      options: ["AKS", "Azure Container Apps", "ACI", "VMSS"],
      correct: [1],
      explanation: "Azure Container Apps is designed for event-driven containerized microservices with managed ingress, revisions, KEDA-based autoscaling, and Dapr while abstracting Kubernetes operations. AKS is better when full Kubernetes control is required. ACI is simpler and lacks the microservices platform features described.",
      tip: "Containers plus KEDA/Dapr plus no Kubernetes operations is Container Apps. Full cluster control changes the answer to AKS."
    },
    {
      id: "comp-q25", type: "multi",
      question: "Which container compute recommendations are appropriate? (Select all that apply.)",
      options: [
        "Use ACI for a short-lived container group with per-second billing and no orchestrator",
        "Use AKS when the platform team requires custom Kubernetes networking and service mesh control",
        "Use Container Apps for event-driven microservices when the team wants minimal Kubernetes operations",
        "Use ACI when you require complex rolling deployments, service mesh, and multiple node pools"
      ],
      correct: [0, 1, 2],
      explanation: "ACI is a good fit for simple short-lived containers, AKS is correct for full Kubernetes control, and Container Apps is correct for managed event-driven microservices. ACI does not provide advanced orchestration features such as service mesh, node pools, or complex deployment control.",
      tip: "Map container needs to control level: none = ACI, simplified microservices = Container Apps, full Kubernetes = AKS."
    },
    {
      id: "comp-q26", type: "single",
      question: "An HTTP-triggered Azure Function must avoid cold starts and access resources through VNet integration. It should still scale elastically without running on a pre-existing App Service plan. Which plan should you choose?",
      options: ["Consumption", "Premium", "Dedicated App Service", "Free App Service"],
      correct: [1],
      explanation: "Functions Premium provides pre-warmed instances to avoid cold starts, supports VNet integration, and scales elastically for serverless workloads. Consumption can have cold starts and weaker networking fit. Dedicated runs on an App Service plan and is chosen when you want to use existing provisioned capacity.",
      tip: "No cold start plus VNet support in Functions is a Premium clue unless the scenario explicitly says to reuse an existing App Service plan."
    },
    {
      id: "comp-q27", type: "single",
      question: "A business process integrates SaaS systems, waits for approvals, and uses mostly prebuilt connectors. The team wants low-code workflow design rather than custom event-processing code. Which compute/integration option is best?",
      options: ["Azure Functions only", "Azure Logic Apps", "Azure Batch", "ACI"],
      correct: [1],
      explanation: "Logic Apps is built for low-code workflow orchestration, connector-heavy integration, approvals, and business processes. Azure Functions is better for custom code-first event processing or compute-intensive logic. Batch and ACI do not provide the workflow connector model required here.",
      tip: "Approval workflow plus SaaS connectors points to Logic Apps; custom compute code points to Functions."
    },
    {
      id: "comp-q28", type: "single",
      question: "A research lab runs MPI-based simulations that need thousands of compute nodes, InfiniBand-capable VM sizes, a start task to install libraries, and autoscale based on pending work. Which service should host the workload?",
      options: ["Azure Batch", "App Service Premium", "Azure Functions Consumption", "Azure Container Apps"],
      correct: [0],
      explanation: "Azure Batch supports large-scale parallel and HPC workloads, including pools, start tasks, autoscale formulas, HPC VM sizes, and MPI/InfiniBand scenarios. App Service, Functions Consumption, and Container Apps are not designed to orchestrate thousands of HPC nodes with MPI communication.",
      tip: "MPI, InfiniBand, simulations, rendering, and thousands of parallel tasks are all Azure Batch signals."
    }
  ]
});
