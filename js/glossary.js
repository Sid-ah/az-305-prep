/* ============================================================
   AZ-305 Study Hub — glossary / tooltip layer
   Self-contained vanilla JS. Works from file:// (no build, no fetch).

   What it does:
   - Holds a plain-English glossary of the acronyms used across the site.
   - Automatically wraps those acronyms in the rendered content with an
     accessible tooltip so a newcomer can hover/tap any shorthand (NAT,
     NSG, ASG, …) and instantly read what it means.
   - A MutationObserver re-decorates content whenever the engine swaps a
     view (notes, flashcards, quizzes, the mock exam, results), so every
     screen is covered automatically.
   ============================================================ */
(function () {
  "use strict";

  /* ----------------------------------------------------------
     Glossary data.  Each entry: KEY -> [expansion, plain explanation, category]
     KEY is the exact token as it appears in the content (case-sensitive).
     Keep explanations short and jargon-light — they are written for someone
     meeting the term for the first time.
     ---------------------------------------------------------- */
  var G = {
    /* ---- Networking ---- */
    "VNet": ["Virtual Network", "Your own private network inside Azure where resources such as VMs live and talk to each other.", "Networking"],
    "NSG": ["Network Security Group", "A basic firewall: a list of allow/deny rules (by IP, port and protocol) attached to a subnet or a VM's network card.", "Networking"],
    "ASG": ["Application Security Group", "Lets you tag VMs by role (e.g. \u201cweb\u201d) and write NSG rules against that group instead of juggling IP addresses.", "Networking"],
    "NIC": ["Network Interface Card", "The virtual network adapter that connects a VM to a subnet.", "Networking"],
    "NAT": ["Network Address Translation", "Rewrites IP addresses so private resources can share a public IP to reach (or be reached from) the internet.", "Networking"],
    "SNAT": ["Source NAT", "Translates the private source IP of outbound traffic into a public IP so replies can find their way back.", "Networking"],
    "DNAT": ["Destination NAT", "Translates an inbound public IP/port to a private internal address \u2014 how you publish an internal service to the internet.", "Networking"],
    "VPN": ["Virtual Private Network", "An encrypted tunnel over the public internet that links your network to Azure.", "Networking"],
    "ExpressRoute": ["ExpressRoute", "A private, dedicated link to Azure through a provider (not over the internet) \u2014 more bandwidth and reliability than a VPN.", "Networking"],
    "FQDN": ["Fully Qualified Domain Name", "A complete hostname like app.contoso.com, used for name-based firewall rules.", "Networking"],
    "DNS": ["Domain Name System", "The internet's phone book \u2014 it turns names (contoso.com) into IP addresses.", "Networking"],
    "WAF": ["Web Application Firewall", "Filters web traffic to block common attacks such as SQL injection and cross-site scripting.", "Networking"],
    "LB": ["Load Balancer", "Spreads incoming traffic across several backend servers so no single one is overwhelmed.", "Networking"],
    "UDR": ["User-Defined Route", "A custom routing rule that overrides Azure's default network paths (e.g. force traffic through a firewall).", "Networking"],
    "NVA": ["Network Virtual Appliance", "A third-party firewall/router sold as a VM you run in your network.", "Networking"],
    "DDoS": ["Distributed Denial of Service", "An attack that floods a service with junk traffic; Azure DDoS Protection absorbs it.", "Networking"],
    "TLS": ["Transport Layer Security", "Encryption for data while it travels over a network \u2014 the \u201cS\u201d in HTTPS.", "Networking"],
    "IDPS": ["Intrusion Detection & Prevention System", "Inspects traffic for known attack patterns and blocks them (Azure Firewall Premium).", "Networking"],
    "MPLS": ["Multiprotocol Label Switching", "A carrier networking technology behind ExpressRoute's private circuits.", "Networking"],
    "ICMP": ["Internet Control Message Protocol", "The protocol behind ping and network diagnostics.", "Networking"],
    "TCP": ["Transmission Control Protocol", "A reliable, connection-based way to send data (used by most web traffic).", "Networking"],
    "UDP": ["User Datagram Protocol", "A fast, connectionless way to send data where occasional loss is acceptable (video, DNS, games).", "Networking"],
    "L4": ["Layer 4 (Transport)", "The network layer that deals with TCP/UDP ports \u2014 it doesn't understand the content.", "Networking"],
    "L7": ["Layer 7 (Application)", "The top network layer that understands HTTP, URLs and hostnames \u2014 enables smart routing and WAF.", "Networking"],
    "P2S": ["Point-to-Site VPN", "Connects a single device (e.g. a laptop) to an Azure network.", "Networking"],
    "S2S": ["Site-to-Site VPN", "Connects a whole on-premises network to Azure.", "Networking"],
    "IKEv2": ["Internet Key Exchange v2", "The modern, route-based VPN key-exchange protocol (preferred over the legacy IKEv1).", "Networking"],
    "IKEv1": ["Internet Key Exchange v1", "The legacy, policy-based VPN protocol; use IKEv2 for new deployments.", "Networking"],
    "CDN": ["Content Delivery Network", "Caches your content at edge locations near users so it loads faster.", "Networking"],
    "FastPath": ["ExpressRoute FastPath", "Sends traffic straight to the VM, skipping the gateway, for lower latency.", "Networking"],
    "WAN": ["Wide Area Network", "A network that spans large distances, e.g. linking offices in different cities.", "Networking"],
    "ZTNA": ["Zero Trust Network Access", "Grants access per-request based on identity and context instead of trusting the network.", "Networking"],
    "IP": ["Internet Protocol (address)", "The numeric address that identifies a device on a network.", "Networking"],
    "GatewaySubnet": ["GatewaySubnet", "A reserved subnet name Azure requires to host a VPN or ExpressRoute gateway.", "Networking"],
    "AzureFirewallSubnet": ["AzureFirewallSubnet", "A reserved subnet name (min /26) that Azure Firewall must be deployed into.", "Networking"],
    "AzureBastionSubnet": ["AzureBastionSubnet", "A reserved subnet name (min /26) required to deploy Azure Bastion.", "Networking"],

    /* ---- Compute & containers ---- */
    "VM": ["Virtual Machine", "A software computer running in Azure that you fully control (Infrastructure as a Service).", "Compute & Containers"],
    "VMSS": ["Virtual Machine Scale Set", "A group of identical VMs that automatically grows or shrinks with demand.", "Compute & Containers"],
    "AKS": ["Azure Kubernetes Service", "A managed Kubernetes platform for running containers at scale.", "Compute & Containers"],
    "ACI": ["Azure Container Instances", "Run a single container quickly without managing any servers.", "Compute & Containers"],
    "ACR": ["Azure Container Registry", "A private place to store and version your container images.", "Compute & Containers"],
    "ASP": ["App Service Plan", "The underlying compute (VM size and count) that hosts your App Service web apps.", "Compute & Containers"],
    "ASE": ["App Service Environment", "A single-tenant, network-isolated deployment of App Service for demanding/secure workloads.", "Compute & Containers"],
    "KEDA": ["Kubernetes Event-Driven Autoscaling", "Scales container workloads based on event or queue volume.", "Compute & Containers"],
    "HPA": ["Horizontal Pod Autoscaler", "Adds or removes Kubernetes pods based on metrics like CPU.", "Compute & Containers"],
    "CNI": ["Container Networking Interface", "Azure CNI gives each pod a real IP address from your VNet.", "Compute & Containers"],
    "HPC": ["High-Performance Computing", "Running huge, parallel compute jobs (simulations, modelling).", "Compute & Containers"],
    "MPI": ["Message Passing Interface", "A standard for coordinating parallel HPC jobs across many machines.", "Compute & Containers"],
    "InfiniBand": ["InfiniBand", "An ultra-fast, low-latency network used between HPC VMs.", "Compute & Containers"],
    "IIS": ["Internet Information Services", "Microsoft's web server that runs on Windows.", "Compute & Containers"],
    "WebJobs": ["WebJobs", "Background tasks that run inside an Azure App Service.", "Compute & Containers"],
    "CPU": ["Central Processing Unit", "The processor \u2014 the main \u201cbrain\u201d of a computer or VM.", "Compute & Containers"],
    "OS": ["Operating System", "The base software (Windows, Linux) a machine runs.", "Compute & Containers"],
    "VMware": ["VMware", "A popular on-premises virtualization platform; Azure VMware Solution runs it natively in Azure.", "Compute & Containers"],

    /* ---- App & integration ---- */
    "API": ["Application Programming Interface", "A defined way for two pieces of software to talk to each other.", "App & Integration"],
    "APIM": ["Azure API Management", "A gateway that publishes, secures, throttles and monitors your APIs.", "App & Integration"],
    "REST": ["Representational State Transfer", "A common style of web API built on HTTP verbs like GET and POST.", "App & Integration"],
    "SDK": ["Software Development Kit", "A set of libraries and tools for building against a service in code.", "App & Integration"],
    "BFF": ["Backend for Frontend", "A tailored backend API built specifically for one client type (web or mobile).", "App & Integration"],
    "DLQ": ["Dead-Letter Queue", "A holding area for messages that couldn't be processed, kept for later inspection.", "App & Integration"],
    "FIFO": ["First-In, First-Out", "Messages are handled in the exact order they arrived.", "App & Integration"],
    "TTL": ["Time To Live", "How long data or a message stays valid before it automatically expires.", "App & Integration"],
    "JSON": ["JavaScript Object Notation", "A simple, human-readable text format for structured data.", "App & Integration"],
    "JWT": ["JSON Web Token", "A signed token that securely carries a user's identity and permissions.", "App & Integration"],
    "EDI": ["Electronic Data Interchange", "A standard format for exchanging business documents between companies.", "App & Integration"],
    "IoT": ["Internet of Things", "Networks of connected devices and sensors that send data to the cloud.", "App & Integration"],
    "HTTP": ["HyperText Transfer Protocol", "The protocol web browsers and APIs use to request and send data.", "App & Integration"],
    "URL": ["Uniform Resource Locator", "A web address such as https://contoso.com/app.", "App & Integration"],
    "gRPC": ["gRPC", "A fast, modern way for services to call each other using compact binary messages.", "App & Integration"],

    /* ---- Storage ---- */
    "LRS": ["Locally Redundant Storage", "Keeps 3 copies of your data within a single datacenter \u2014 the cheapest, least durable option.", "Storage"],
    "ZRS": ["Zone-Redundant Storage", "Copies data across separate availability zones in one region to survive a datacenter failure.", "Storage"],
    "GRS": ["Geo-Redundant Storage", "LRS plus asynchronous copies to a paired region hundreds of miles away.", "Storage"],
    "GZRS": ["Geo-Zone-Redundant Storage", "ZRS plus copies to a paired region \u2014 the most resilient option.", "Storage"],
    "RA-GRS": ["Read-Access Geo-Redundant Storage", "GRS that also lets you read from the secondary region.", "Storage"],
    "RA-GZRS": ["Read-Access Geo-Zone-Redundant Storage", "GZRS that also lets you read from the secondary region.", "Storage"],
    "ADLS": ["Azure Data Lake Storage", "Big-data storage built on Blob with a folder-like (hierarchical) namespace.", "Storage"],
    "Blob": ["Blob (Binary Large Object)", "Azure's object storage for files and unstructured data (images, backups, logs).", "Storage"],
    "SSD": ["Solid State Drive", "Fast, flash-based storage with no moving parts.", "Storage"],
    "HDD": ["Hard Disk Drive", "Cheaper, slower spinning-disk storage.", "Storage"],
    "NVMe": ["Non-Volatile Memory Express", "A very fast interface for high-performance SSDs.", "Storage"],
    "IOPS": ["Input/Output Operations Per Second", "A measure of how many read/write operations a disk can do per second.", "Storage"],
    "NFS": ["Network File System", "A file-sharing protocol common on Linux/Unix.", "Storage"],
    "SMB": ["Server Message Block", "The file-sharing protocol used by Windows.", "Storage"],
    "POSIX": ["POSIX", "A Unix standard \u2014 here it refers to Unix-style file permissions on data lakes.", "Storage"],
    "WORM": ["Write Once, Read Many", "Immutable storage that can't be changed or deleted for a set period (compliance).", "Storage"],
    "SAS": ["Shared Access Signature", "A time-limited token that grants scoped access to storage without sharing your keys.", "Storage"],
    "HSM": ["Hardware Security Module", "Tamper-resistant hardware that safeguards encryption keys.", "Storage"],
    "CMK": ["Customer-Managed Key", "An encryption key you create and control (instead of a Microsoft-managed one).", "Storage"],
    "TDE": ["Transparent Data Encryption", "Automatically encrypts database files while they sit on disk.", "Storage"],
    "ACL": ["Access Control List", "Fine-grained permissions set on individual files or folders.", "Storage"],
    "AzCopy": ["AzCopy", "A command-line tool for copying data to and from Azure Storage.", "Storage"],
    "GiB": ["Gibibyte", "A binary gigabyte (2^30 bytes) \u2014 the unit Azure uses for many capacity figures.", "Storage"],
    "Gen2": ["Generation 2", "The second generation of a service (e.g. ADLS Gen2 or a Gen2 VM disk).", "Storage"],

    /* ---- Databases ---- */
    "SQL": ["Structured Query Language", "The standard language for storing and querying data in relational databases.", "Databases"],
    "NoSQL": ["NoSQL", "Non-relational databases (document, key-value, graph, column) that trade strict structure for scale and flexibility.", "Databases"],
    "DB": ["Database", "An organized store of data that applications read from and write to.", "Databases"],
    "OLTP": ["Online Transaction Processing", "Workloads with many small, fast transactions \u2014 typical of business apps.", "Databases"],
    "OLAP": ["Online Analytical Processing", "Workloads with complex analytical queries over large datasets \u2014 typical of reporting.", "Databases"],
    "HTAP": ["Hybrid Transactional/Analytical Processing", "Running both transactions and analytics on one system (e.g. Synapse Link).", "Databases"],
    "DTU": ["Database Transaction Unit", "A bundled measure of Azure SQL compute, memory and I/O sold as one number.", "Databases"],
    "vCore": ["Virtual Core", "A CPU-based sizing model for Azure SQL that lets you pick cores and memory separately.", "Databases"],
    "PITR": ["Point-In-Time Restore", "Roll a database back to a specific moment in the recent past.", "Databases"],
    "LTR": ["Long-Term Retention", "Keep database backups for months or years for compliance.", "Databases"],
    "RLS": ["Row-Level Security", "Database rules that limit which rows each user is allowed to see.", "Databases"],
    "DDM": ["Dynamic Data Masking", "Hides parts of sensitive fields (e.g. card numbers) from unauthorized users.", "Databases"],
    "MI": ["Managed Instance / Managed Identity", "SQL Managed Instance = a near-100% SQL Server-compatible managed database. (Elsewhere MI can mean Managed Identity, an automatic Azure AD identity for resources.)", "Databases"],
    "DBA": ["Database Administrator", "The person who manages, tunes and secures databases.", "Databases"],
    "MPP": ["Massively Parallel Processing", "Splits a query across many compute nodes at once (used by Synapse/data warehouses).", "Databases"],
    "ETL": ["Extract, Transform, Load", "Pull data from sources, reshape it, then load it into a destination.", "Databases"],
    "ELT": ["Extract, Load, Transform", "Load raw data first, then transform it inside the destination (common in modern data lakes).", "Databases"],
    "ACID": ["Atomicity, Consistency, Isolation, Durability", "The four guarantees that make database transactions reliable.", "Databases"],
    "CDC": ["Change Data Capture", "Tracks every row change so downstream systems can stay in sync.", "Databases"],
    "BACPAC": ["BACPAC", "A single portable file containing a database's schema and data.", "Databases"],
    "RU": ["Request Unit", "Cosmos DB's currency for throughput \u2014 every read/write costs a number of RUs.", "Databases"],
    "CQL": ["Cassandra Query Language", "The query language used by the Cosmos DB Cassandra API.", "Databases"],
    "PartitionKey": ["Partition Key", "The property that decides how data is spread across partitions for scale.", "Databases"],
    "RowKey": ["Row Key", "Together with the partition key, uniquely identifies a row in Table storage.", "Databases"],
    "HANA": ["SAP HANA", "SAP's in-memory database, often run on dedicated large Azure VMs.", "Databases"],
    "PostgreSQL": ["PostgreSQL", "A popular open-source relational database, offered as a managed Azure service.", "Databases"],
    "MySQL": ["MySQL", "A widely used open-source relational database, offered as a managed Azure service.", "Databases"],
    "MongoDB": ["MongoDB", "A popular document database; Cosmos DB offers a MongoDB-compatible API.", "Databases"],

    /* ---- Data integration ---- */
    "ADF": ["Azure Data Factory", "A cloud service for building data pipelines that move and transform data.", "Data Integration"],
    "IR": ["Integration Runtime", "The compute that Azure Data Factory uses to move or transform data.", "Data Integration"],
    "SSIS": ["SQL Server Integration Services", "Microsoft's classic ETL tool; its packages can be run inside Data Factory.", "Data Integration"],
    "BI": ["Business Intelligence", "Turning raw data into reports and dashboards (e.g. Power BI).", "Data Integration"],
    "ML": ["Machine Learning", "Teaching computers to find patterns and make predictions from data.", "Data Integration"],
    "AutoML": ["Automated Machine Learning", "Automatically tries many models to find the best one for your data.", "Data Integration"],
    "MLflow": ["MLflow", "An open-source tool for tracking machine-learning experiments.", "Data Integration"],
    "OneLake": ["OneLake", "Microsoft Fabric's single, unified data lake for an organization.", "Data Integration"],

    /* ---- Identity & governance ---- */
    "AD": ["Active Directory", "Microsoft's identity directory; the cloud version is Microsoft Entra ID (formerly Azure AD).", "Identity & Governance"],
    "RBAC": ["Role-Based Access Control", "Grant permissions by assigning roles (Reader, Contributor, Owner) scoped to resources.", "Identity & Governance"],
    "ABAC": ["Attribute-Based Access Control", "Grant access based on attributes/tags (e.g. only data tagged \u201cfinance\u201d).", "Identity & Governance"],
    "MFA": ["Multi-Factor Authentication", "Requires a second proof (phone or app) in addition to a password.", "Identity & Governance"],
    "PIM": ["Privileged Identity Management", "Gives admins just-in-time, time-limited elevation instead of standing access.", "Identity & Governance"],
    "SSO": ["Single Sign-On", "Sign in once and access many apps without logging in again.", "Identity & Governance"],
    "B2B": ["Business-to-Business", "Invite external partners as guest users into your directory.", "Identity & Governance"],
    "B2C": ["Business-to-Consumer", "An identity service for your customer-facing apps (sign-up/sign-in).", "Identity & Governance"],
    "JIT": ["Just-In-Time access", "Access that is granted only when needed and removed afterwards.", "Identity & Governance"],
    "PTA": ["Pass-Through Authentication", "Validates passwords directly against on-prem AD without storing them in the cloud.", "Identity & Governance"],
    "PHS": ["Password Hash Synchronization", "Syncs password hashes to Entra ID so users can sign in to the cloud.", "Identity & Governance"],
    "ADFS": ["Active Directory Federation Services", "On-prem servers that provide federated sign-in to your AD.", "Identity & Governance"],
    "LDAP": ["Lightweight Directory Access Protocol", "A standard protocol for querying directory services.", "Identity & Governance"],
    "SAML": ["Security Assertion Markup Language", "An older standard for federated single sign-on between identity systems.", "Identity & Governance"],
    "OAuth": ["OAuth", "A standard that lets apps get limited access to resources on a user's behalf.", "Identity & Governance"],
    "FIDO2": ["FIDO2", "A passwordless, phishing-resistant sign-in standard using security keys or biometrics.", "Identity & Governance"],
    "NTLM": ["NTLM", "A legacy Windows authentication protocol.", "Identity & Governance"],
    "IdP": ["Identity Provider", "A system that verifies who a user is and issues sign-in tokens.", "Identity & Governance"],
    "CAF": ["Cloud Adoption Framework", "Microsoft's official guidance for planning and running Azure adoption.", "Identity & Governance"],
    "IaC": ["Infrastructure as Code", "Defining your infrastructure in files (Bicep, ARM, Terraform) instead of clicking in the portal.", "Identity & Governance"],
    "ARM": ["Azure Resource Manager", "Azure's deployment and management layer, and its JSON template format.", "Identity & Governance"],
    "DSC": ["Desired State Configuration", "Declares the exact configuration a machine should always have, and enforces it.", "Identity & Governance"],

    /* ---- Security ---- */
    "SIEM": ["Security Information & Event Management", "Collects security logs from everywhere to detect and investigate threats (Microsoft Sentinel).", "Security"],
    "SOAR": ["Security Orchestration, Automation & Response", "Automates responses to security incidents (part of Sentinel).", "Security"],
    "SOC": ["Security Operations Center", "The team and tooling that monitors and responds to security threats.", "Security"],
    "CSPM": ["Cloud Security Posture Management", "Continuously checks your cloud config for risks and misconfigurations.", "Security"],
    "CWPP": ["Cloud Workload Protection Platform", "Protects running workloads (VMs, containers, databases) from threats.", "Security"],
    "CIEM": ["Cloud Infrastructure Entitlement Management", "Finds and right-sizes excessive permissions across your cloud.", "Security"],
    "UEBA": ["User & Entity Behavior Analytics", "Spots threats by detecting unusual user or system behavior.", "Security"],
    "MUA": ["Multi-User Authorization", "Requires a second approver before sensitive actions (like deleting backups) proceed.", "Security"],
    "DDoS_sec": ["", "", ""],
    "GDPR": ["General Data Protection Regulation", "EU law governing how personal data must be protected.", "Security"],
    "PCI": ["Payment Card Industry (DSS)", "Security standards for handling credit-card data.", "Security"],
    "FIPS": ["Federal Information Processing Standards", "US government standards, e.g. FIPS 140 for cryptography.", "Security"],
    "AES": ["Advanced Encryption Standard", "The widely used algorithm for encrypting data.", "Security"],

    /* ---- Monitoring ---- */
    "KQL": ["Kusto Query Language", "The query language for searching logs in Azure Monitor and Sentinel.", "Monitoring"],
    "AMA": ["Azure Monitor Agent", "The current agent that collects logs and metrics from machines.", "Monitoring"],
    "MMA": ["Microsoft Monitoring Agent", "The legacy log-collection agent (being replaced by AMA).", "Monitoring"],
    "OMS": ["Operations Management Suite", "The former name for the legacy Log Analytics agent/portal.", "Monitoring"],
    "DCR": ["Data Collection Rule", "Defines what telemetry the Azure Monitor Agent gathers and where it is sent.", "Monitoring"],
    "APM": ["Application Performance Monitoring", "Tracks the health, performance and errors of your applications.", "Monitoring"],
    "ITSM": ["IT Service Management", "Processes/tools for IT support and change (e.g. ServiceNow integration).", "Monitoring"],
    "MTTR": ["Mean Time To Recovery", "The average time it takes to restore service after a failure.", "Monitoring"],
    "SLA": ["Service Level Agreement", "The uptime/availability percentage the provider formally guarantees.", "Monitoring"],

    /* ---- Resilience (BCDR) ---- */
    "BCDR": ["Business Continuity & Disaster Recovery", "The overall plan to keep running, and recover, during major outages.", "Resilience"],
    "DR": ["Disaster Recovery", "Restoring service in another location after a major outage.", "Resilience"],
    "HA": ["High Availability", "Designing systems with redundancy so they rarely go down.", "Resilience"],
    "RTO": ["Recovery Time Objective", "The maximum acceptable time to get a system back online after an outage.", "Resilience"],
    "RPO": ["Recovery Point Objective", "The maximum acceptable amount of data (measured in time) you can afford to lose.", "Resilience"],
    "ASR": ["Azure Site Recovery", "Replicates VMs to another region and fails them over for disaster recovery.", "Resilience"],
    "MABS": ["Microsoft Azure Backup Server", "An on-prem server that backs workloads up to Azure.", "Resilience"],
    "MARS": ["Microsoft Azure Recovery Services agent", "An agent that backs up files and folders from a machine to Azure.", "Resilience"],

    /* ---- Migration ---- */
    "DMS": ["Database Migration Service", "An Azure service that migrates databases into Azure with minimal downtime.", "Migration"],
    "SSMA": ["SQL Server Migration Assistant", "A tool that converts other databases (Oracle, MySQL) to SQL Server/Azure SQL.", "Migration"],
    "AVS": ["Azure VMware Solution", "Run your existing VMware environment natively inside Azure.", "Migration"],
    "SCVMM": ["System Center Virtual Machine Manager", "Microsoft's on-prem tool for managing virtualized datacenters.", "Migration"],
    "TCO": ["Total Cost of Ownership", "The full cost of a solution over time, including hidden/running costs.", "Migration"],
    "DCRs_mig": ["", "", ""],

    /* ---- General / cloud ---- */
    "IaaS": ["Infrastructure as a Service", "You rent raw building blocks (VMs, networks) and manage the OS and apps yourself.", "Cloud Models"],
    "PaaS": ["Platform as a Service", "Azure runs the servers and OS; you just deploy your app and data.", "Cloud Models"],
    "SaaS": ["Software as a Service", "Ready-to-use software you simply sign in to (e.g. Microsoft 365).", "Cloud Models"],
    "SKU": ["Stock Keeping Unit", "A specific tier, size or variant of an Azure service.", "Cloud Models"],
    "SLAs": ["", "", ""],
    "DevOps": ["DevOps", "A culture and toolchain that unites development and operations to ship software faster.", "Cloud Models"],
    "CI": ["Continuous Integration", "Automatically build and test code every time it changes.", "Cloud Models"],
    "CD": ["Continuous Delivery/Deployment", "Automatically release tested code to environments.", "Cloud Models"],
    "GitOps": ["GitOps", "Managing infrastructure and deployments using Git as the single source of truth.", "Cloud Models"],
    "AWS": ["Amazon Web Services", "Amazon's cloud platform \u2014 a competitor to Azure.", "Cloud Models"],
    "GCP": ["Google Cloud Platform", "Google's cloud platform \u2014 a competitor to Azure.", "Cloud Models"],
    "SAP": ["SAP", "A major enterprise software vendor whose ERP systems are often migrated to Azure.", "Cloud Models"],
    "CRM": ["Customer Relationship Management", "Software for managing a company's customer interactions and sales.", "Cloud Models"],
    "SLA_dup": ["", "", ""]
  };

  // Remove placeholder/duplicate keys that exist only to avoid accidental matches.
  ["DDoS_sec", "DCRs_mig", "SLAs", "SLA_dup"].forEach(function (k) { delete G[k]; });

  // Expose the cleaned glossary for the engine's reference page.
  window.AZ305_GLOSSARY = G;

  /* ---------------- Decoration engine ---------------- */
  var SKIP_TAGS = { CODE: 1, A: 1, ABBR: 1, SCRIPT: 1, STYLE: 1, INPUT: 1, TEXTAREA: 1 };
  var RX = null;

  function escapeRegExp(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function buildRegex() {
    var keys = Object.keys(G).sort(function (a, b) { return b.length - a.length; });
    var alt = keys.map(escapeRegExp).join("|");
    // Capture group 1 = the base term; optional trailing "s" handles simple plurals
    // (NSGs, VNets, APIs). Case-sensitive so lowercase prose never matches.
    RX = new RegExp("(?:^|\\b)(" + alt + ")(s)?(?=\\b|$)", "g");
  }

  function allowed(textNode) {
    var p = textNode.parentNode;
    while (p && p.nodeType === 1) {
      if (SKIP_TAGS[p.nodeName]) return false;
      if (p.classList && p.classList.contains("term")) return false;
      p = p.parentNode;
    }
    return true;
  }

  function decorateTextNode(textNode) {
    var text = textNode.nodeValue;
    if (!text || text.length < 2) return;
    RX.lastIndex = 0;
    if (!RX.test(text)) return;
    RX.lastIndex = 0;

    var frag = document.createDocumentFragment();
    var last = 0, m, made = false;
    while ((m = RX.exec(text))) {
      var base = m[1];
      var def = G[base];
      if (!def) continue;
      // The match boundary is zero-width, so the base term starts at m.index.
      var matchStart = m.index;
      var matchText = base + (m[2] || "");
      if (matchStart > last) frag.appendChild(document.createTextNode(text.slice(last, matchStart)));
      var span = document.createElement("span");
      span.className = "term";
      span.setAttribute("tabindex", "0");
      span.setAttribute("role", "button");
      span.setAttribute("data-term", base);
      span.setAttribute("aria-label", base + ": " + def[0] + ". " + def[1]);
      span.textContent = matchText;
      frag.appendChild(span);
      last = matchStart + matchText.length;
      RX.lastIndex = last;
      made = true;
    }
    if (!made) return;
    if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
    if (textNode.parentNode) textNode.parentNode.replaceChild(frag, textNode);
  }

  function decorate(node) {
    if (!node || !RX) return;
    if (node.nodeType === 3) { if (allowed(node)) decorateTextNode(node); return; }
    if (node.nodeType !== 1) return;
    if (SKIP_TAGS[node.nodeName] || (node.classList && node.classList.contains("term"))) return;
    var walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, {
      acceptNode: function (tn) { return allowed(tn) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT; }
    });
    var list = [], n;
    while ((n = walker.nextNode())) list.push(n);
    list.forEach(decorateTextNode);
  }

  /* ---------------- Floating tooltip ---------------- */
  var tip = null, activeTerm = null;

  function ensureTip() {
    if (!tip) {
      tip = document.createElement("div");
      tip.className = "term-tip";
      tip.setAttribute("role", "tooltip");
      document.body.appendChild(tip);
    }
    return tip;
  }

  function showTip(elm) {
    var key = elm.getAttribute("data-term");
    var def = G[key];
    if (!def) return;
    var t = ensureTip();
    t.innerHTML =
      '<span class="term-tip-key">' + escapeHtml(key) +
      ' <span class="term-tip-full">' + escapeHtml(def[0]) + "</span></span>" +
      '<span class="term-tip-desc">' + escapeHtml(def[1]) + "</span>";
    t.classList.add("show");
    positionTip(elm, t);
  }

  function positionTip(elm, t) {
    var pad = 10;
    var r = elm.getBoundingClientRect();
    var tw = t.offsetWidth, th = t.offsetHeight;
    var left = r.left + r.width / 2 - tw / 2;
    left = Math.max(pad, Math.min(left, window.innerWidth - tw - pad));
    var top = r.top - th - 10;
    var below = false;
    if (top < pad) { top = r.bottom + 10; below = true; }
    t.style.left = Math.round(left) + "px";
    t.style.top = Math.round(top) + "px";
    var arrow = r.left + r.width / 2 - left;
    t.style.setProperty("--arrow-x", Math.round(Math.max(14, Math.min(tw - 14, arrow))) + "px");
    t.classList.toggle("below", below);
  }

  function hideTip() {
    if (tip) tip.classList.remove("show");
    activeTerm = null;
  }

  function closestTerm(node) {
    while (node && node !== document.body) {
      if (node.nodeType === 1 && node.classList && node.classList.contains("term")) return node;
      node = node.parentNode;
    }
    return null;
  }

  function bindTooltip() {
    document.addEventListener("mouseover", function (e) {
      var elm = closestTerm(e.target);
      if (elm) showTip(elm);
    });
    document.addEventListener("mouseout", function (e) {
      var from = closestTerm(e.target);
      var to = closestTerm(e.relatedTarget);
      if (from && from !== to && !activeTerm) hideTip();
    });
    document.addEventListener("focusin", function (e) {
      var elm = closestTerm(e.target);
      if (elm) showTip(elm);
    });
    document.addEventListener("focusout", function (e) {
      if (closestTerm(e.target) && !activeTerm) hideTip();
    });
    // Tap to pin/unpin (touch + click). Capture phase so we can stop the
    // event before quiz option buttons treat the tap as an answer.
    document.addEventListener("click", function (e) {
      var elm = closestTerm(e.target);
      if (elm) {
        e.preventDefault();
        e.stopPropagation();
        if (activeTerm === elm) { hideTip(); }
        else { showTip(elm); activeTerm = elm; }
      } else if (activeTerm) {
        hideTip();
      }
    }, true);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") hideTip();
      else if ((e.key === "Enter" || e.key === " ") && closestTerm(e.target)) {
        e.preventDefault();
        var elm = closestTerm(e.target);
        if (activeTerm === elm) hideTip(); else { showTip(elm); activeTerm = elm; }
      }
    });
    window.addEventListener("scroll", function () { if (!activeTerm) hideTip(); }, true);
    window.addEventListener("resize", hideTip);
  }

  /* ---------------- Boot ---------------- */
  function init() {
    buildRegex();
    bindTooltip();
    var view = document.getElementById("view");
    if (!view) return;
    decorate(view);
    var obs = new MutationObserver(function (muts) {
      obs.disconnect();
      for (var i = 0; i < muts.length; i++) {
        var added = muts[i].addedNodes;
        for (var j = 0; j < added.length; j++) decorate(added[j]);
      }
      obs.observe(view, { childList: true, subtree: true });
    });
    obs.observe(view, { childList: true, subtree: true });
  }

  window.AZ305Glossary = { decorate: decorate, data: G };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
