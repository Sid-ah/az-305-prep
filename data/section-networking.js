AZ305.registerSection({
  id: "networking",
  title: "Networking",
  domain: "Infrastructure Solutions",
  weight: "30–35%",
  icon: "🌐",
  order: 1,
  summary: "Networking is embedded in almost every AZ-305 scenario. Master **hub-spoke topology**, the **connectivity options** (VPN vs ExpressRoute vs peering), **firewall/NSG** layering, the **load-balancing decision tree** (Load Balancer, App Gateway, Front Door, Traffic Manager), and **private connectivity** for PaaS.",

  notes: [
    {
      heading: "Virtual Networks, NSGs & ASGs",
      points: [
        "**VNet** is region-bound and subscription-bound. Connect across regions via peering or VPN; can peer across subscriptions.",
        "**Reserved subnet names** (exact spelling required): `GatewaySubnet` (VPN/ER GW), `AzureFirewallSubnet` (/26), `AzureBastionSubnet` (/26 min).",
        "**NSG** = stateful L4 (TCP/UDP/ICMP) filtering on subnet or NIC. Priority 100–4096, lower number wins. Cannot filter by FQDN.",
        "**ASG (Application Security Group)** lets you write NSG rules against role names (e.g. web-servers) instead of IP lists — ideal for dynamic VM membership."
      ],
      tip: "NSGs for subnet-level segmentation; Azure Firewall for centralized, policy-based control with FQDN rules."
    },
    {
      heading: "Azure Firewall vs NSG",
      table: {
        headers: ["Feature", "NSG", "Azure Firewall"],
        rows: [
          ["Layer", "L4 (port/IP)", "L4 + L7 (FQDN, URL, TLS inspection)"],
          ["Scope", "Subnet / NIC", "Centralized hub"],
          ["FQDN filtering", "No", "Yes"],
          ["Threat intelligence", "No", "Yes"],
          ["Cost", "Free", "~$1.25/hr + data"]
        ]
      },
      points: [
        "**Firewall SKUs:** Standard (FQDN, NAT, threat intel) · Premium (+TLS inspection, IDPS, URL/web categories) · Basic (SMB/dev).",
        "**DNAT rules** translate inbound internet traffic to an internal IP. **Forced tunneling** routes egress through on-prem.",
        "Prefer **Firewall Policy** (hierarchical, reusable across firewalls) over legacy classic rules."
      ]
    },
    {
      heading: "Connectivity: Peering, VPN, ExpressRoute",
      points: [
        "**VNet Peering** is non-transitive (A→B, B→C does NOT give A→C) and needs no gateway. Enable transit via a hub firewall/NVA + `Allow Gateway Transit` / `Use Remote Gateways`. No overlapping address spaces.",
        "**VPN Gateway** runs over the encrypted public internet. Use **route-based** (IKEv2, dynamic, P2S) for new deployments; policy-based is legacy IKEv1. Active-active (2 IPs/tunnels) for production HA.",
        "**ExpressRoute** is private (MPLS/colocation), higher bandwidth (up to 100 Gbps Direct), 99.95% SLA, but takes weeks to provision. Circuit SKUs: Local (metro), Standard (one geo), Premium (global + M365).",
        "**Coexistence:** Use VPN as automatic failover for ExpressRoute (both gateways share the GatewaySubnet). **FastPath** bypasses the gateway data plane for ultra-low latency."
      ],
      tip: "VPN = dev/test, backup, lower traffic. ExpressRoute = production, regulated, high throughput, private path."
    },
    {
      heading: "Hub-Spoke Topology (exam favorite)",
      points: [
        "**Hub** holds shared services: Azure Firewall, VPN/ExpressRoute gateway, Bastion, and private DNS zones.",
        "**Spokes** hold workloads and peer to the hub; spoke-to-spoke traffic transits the hub firewall.",
        "Choose hub-spoke for centralized security, shared services, and multiple workload teams."
      ]
    },
    {
      heading: "Load Balancing Decision Framework",
      intro: "Microsoft groups load balancers on two axes: **global vs regional** and **HTTP(S) vs non-HTTP(S)**.",
      table: {
        headers: ["Service", "Layer", "Scope", "Key use"],
        rows: [
          ["Load Balancer", "L4 (TCP/UDP)", "Regional", "VM/VMSS passthrough, ultra-low latency, internal LB"],
          ["Application Gateway", "L7 (HTTP/S)", "Regional", "URL/host routing, TLS offload, WAF v2"],
          ["Front Door", "L7 (HTTP/S)", "Global", "Edge acceleration, CDN, global failover, WAF at edge"],
          ["Traffic Manager", "DNS", "Global", "DNS routing for any endpoint (Azure/on-prem/other cloud)"]
        ]
      },
      points: [
        "**Passthrough** (Load Balancer): client connects directly to backend. **Terminating** (App Gateway, Front Door): LB opens a new backend connection.",
        "Fast rules: Regional VM/TCP→**Load Balancer**; Regional web+WAF/TLS/URL→**App Gateway**; Global web acceleration/failover→**Front Door**; Global DNS routing for any endpoint→**Traffic Manager**.",
        "**Layered architectures are common:** Front Door (global) + App Gateway/Load Balancer (regional). Evaluate each traffic hop separately."
      ],
      tip: "Standard Load Balancer (Basic is retired) and App Gateway v2 / Front Door are the modern choices. Traffic Manager is a frequent distractor when the requirement actually needs WAF, TLS offload, or fast app failover — then choose Front Door."
    },
    {
      heading: "Traffic Manager Routing Methods",
      table: {
        headers: ["Method", "Use case"],
        rows: [
          ["Priority", "Active-passive disaster recovery"],
          ["Weighted", "Gradual rollout, A/B testing, canary"],
          ["Performance", "Lowest latency for global users"],
          ["Geographic", "Data sovereignty / GDPR (EU users → EU endpoint)"],
          ["Multivalue", "Return all healthy endpoints (client-side LB)"],
          ["Subnet", "Map IP ranges to specific endpoints"]
        ]
      },
      tip: "Geographic = compliance/residency (always EU→EU). Performance = lowest latency. Don't confuse the two."
    },
    {
      heading: "Private Connectivity & DNS",
      table: {
        headers: ["", "Service Endpoint", "Private Endpoint"],
        rows: [
          ["Private IP in VNet", "No", "Yes"],
          ["Public IP removed", "No", "Yes (optional)"],
          ["DNS change needed", "No", "Yes (private DNS zone)"],
          ["Cross-region", "No", "Yes"],
          ["Cost", "Free", "Per hour + data"]
        ]
      },
      points: [
        "**Service Endpoint** keeps traffic on the Microsoft backbone but the PaaS service keeps its public IP.",
        "**Private Endpoint** injects the PaaS service into the VNet with a private IP and requires a matching **private DNS zone** (e.g. `privatelink.blob.core.windows.net`, `privatelink.database.windows.net`, `privatelink.vaultcore.azure.net`).",
        "In hub-spoke, host the private DNS zones in the **hub** and link all spoke VNets."
      ],
      tip: "Private Endpoint = zero-trust / fully private PaaS. If a question stresses 'no public access' or compliance, pick Private Endpoint, not Service Endpoint."
    },
    {
      heading: "Bastion, Network Watcher & DDoS",
      points: [
        "**Azure Bastion** gives RDP/SSH in the browser over TLS 443 with no public IP on VMs. Needs `AzureBastionSubnet` (/26 min). Standard adds native client/tunneling; Premium adds private-only + session recording.",
        "**Network Watcher:** IP Flow Verify (does NSG allow this?), Next Hop (trace routing), Connection Monitor, NSG Flow Logs + Traffic Analytics, Packet Capture.",
        "**DDoS Network Protection** (paid) protects all public IPs in a VNet with cost protection + rapid-response support; basic platform protection is free but not configurable."
      ]
    },
    {
      heading: "Connectivity, Egress & Performance",
      points: [
        "**NAT Gateway:** scalable, outbound-only SNAT for a subnet — the modern fix for SNAT port exhaustion. Keeps VMs free of public IPs and inbound exposure.",
        "**Azure Virtual WAN:** Microsoft-managed global hub-and-spoke connecting VNets, branch VPNs, ExpressRoute, and remote users with automated any-to-any transit — choose at scale over hand-built hubs.",
        "**Accelerated Networking:** SR-IOV on the VM NIC for lower latency/jitter and higher throughput (a performance feature, not security).",
        "**ExpressRoute Global Reach:** links two on-prem sites branch-to-branch through the Microsoft backbone via their circuits.",
        "**User-Defined Routes (UDR):** override system routes (e.g. `0.0.0.0/0` → hub firewall) to force inspection or forced tunneling; NSGs filter but never change the next hop.",
        "**Standard SKU everywhere:** public IPs and Load Balancer must be Standard for availability zones and the 99.99% SLA — Basic is retired."
      ],
      tip: "Match the goal to the tool: egress scale → NAT Gateway; many sites → Virtual WAN; VM speed → Accelerated Networking; path control → UDR; on-prem↔on-prem → Global Reach."
    },
    {
      heading: "Exam skills mapping",
      intro: "This section maps to the official **Design network solutions** objectives:",
      points: [
        "Recommend a connectivity solution that connects Azure resources to the **internet** (public IP SKUs, NAT Gateway, Front Door/App Gateway ingress).",
        "Recommend a connectivity solution that connects Azure resources to **on-premises** networks (VPN, ExpressRoute, Virtual WAN, Global Reach).",
        "Recommend a solution to **optimize network performance** (Accelerated Networking, FastPath, Proximity Placement Groups, Front Door/CDN).",
        "Recommend a solution to **optimize network security** (NSG/ASG, Azure Firewall, DDoS, Private Endpoints, Bastion, WAF).",
        "Recommend a **load-balancing and routing** solution (Load Balancer, Application Gateway, Front Door, Traffic Manager, UDRs)."
      ]
    }
  ],

  flashcards: [
    { front: "Which three subnets require an exact reserved name?", back: "`GatewaySubnet` (VPN/ExpressRoute gateway), `AzureFirewallSubnet` (/26), and `AzureBastionSubnet` (/26 minimum). Azure rejects other names for these services." },
    { front: "NSG vs Azure Firewall — the one-line rule", back: "NSG = free, stateful **L4** subnet/NIC segmentation. Azure Firewall = centralized **L4+L7** with FQDN filtering, threat intel, and policy — for enterprise perimeter control." },
    { front: "What does it mean that VNet peering is 'non-transitive'?", back: "If A peers B and B peers C, A still cannot reach C. You must route spoke-to-spoke traffic through a hub firewall/NVA and enable gateway transit." },
    { front: "VPN Gateway vs ExpressRoute — when to choose each", back: "VPN = encrypted over public internet, cheap, minutes to set up, dev/test/backup. ExpressRoute = private MPLS/colocation, up to 100 Gbps, 99.95% SLA, weeks to provision, for production/regulated/high-throughput." },
    { front: "Route-based vs policy-based VPN", back: "Route-based: IKEv2, dynamic routing, supports P2S — use for all new deployments. Policy-based: IKEv1, static routing only — legacy compatibility." },
    { front: "How do you make ExpressRoute highly available cheaply?", back: "Add a VPN Gateway as automatic failover for the ExpressRoute circuit (coexistence). Both gateways share the GatewaySubnet." },
    { front: "Load Balancer vs Application Gateway", back: "Load Balancer = L4 (TCP/UDP), regional, passthrough, no TLS/URL routing. Application Gateway = L7 (HTTP/S), regional, TLS offload, URL/host routing, WAF v2." },
    { front: "Front Door vs Traffic Manager", back: "Front Door = global **L7** proxy with CDN, WAF, TLS offload, seconds failover. Traffic Manager = global **DNS** routing (no proxy) for any endpoint, minutes failover (DNS TTL)." },
    { front: "Which Traffic Manager method is for data residency/GDPR?", back: "**Geographic** routing — EU users always go to the EU endpoint regardless of latency. (Performance routing = lowest latency, not compliance.)" },
    { front: "Passthrough vs terminating load balancer", back: "Passthrough (Load Balancer): client connects directly to the chosen backend. Terminating (App Gateway, Front Door): the LB terminates the connection and opens a new one to the backend, enabling L7 inspection/TLS offload." },
    { front: "Service Endpoint vs Private Endpoint", back: "Service Endpoint: traffic on MS backbone but PaaS keeps a public IP, free, same-region, no DNS change. Private Endpoint: PaaS gets a private VNet IP, public access removed, cross-region, requires a private DNS zone." },
    { front: "Where do you host private DNS zones in hub-spoke?", back: "In the **hub** VNet, with all spoke VNets linked to them — so private endpoint name resolution works consistently across spokes." },
    { front: "What is an ASG and why use it?", back: "Application Security Group: group VMs by role (web-servers, db-servers) and reference the group name in NSG rules instead of IP lists. Ideal for dynamic VM membership." },
    { front: "When do you need Azure Firewall Premium over Standard?", back: "When you need **TLS inspection, IDPS, and URL/web category filtering** — i.e., zero-trust or compliance-heavy workloads. Standard covers FQDN filtering, NAT, and threat intel." },
    { front: "What does Azure Bastion eliminate?", back: "Public IPs on VMs and exposed management ports (22/3389). It provides RDP/SSH in the browser over TLS 443 from `AzureBastionSubnet`." },
    { front: "Front Door + App Gateway — why both?", back: "Front Door is the global edge entry (acceleration, global failover, edge WAF); App Gateway provides regional L7 routing/WAF behind it. AZ-305 often expects a layered, multi-hop design." },
    { front: "What is Azure NAT Gateway used for?", back: "Scalable, reliable **outbound-only** SNAT for a subnet — avoids SNAT port exhaustion. Preferred over assigning public IPs to VMs or using LB outbound rules for egress to the internet." },
    { front: "What does Azure Virtual WAN provide?", back: "A Microsoft-managed hub-and-spoke **at global scale**: connects VNets, branches (VPN), ExpressRoute, and remote users through managed hubs with any-to-any transit. Choose it over hand-built hub-spoke for many sites/regions." },
    { front: "What does Accelerated Networking do?", back: "Enables **SR-IOV** on the VM NIC, bypassing the host virtual switch for lower latency, lower jitter, and higher throughput. Choose it for network-intensive VMs (it's a performance, not security, feature)." },
    { front: "Standard vs Basic public IP / Load Balancer", back: "Standard is zone-redundant, secure-by-default (closed until an NSG allows), and required for AZs and the 99.99% LB SLA. Basic is retired — use **Standard** for all new designs." },
    { front: "What is a User-Defined Route (UDR) used for?", back: "Override Azure's default system routes to force traffic to a next hop — typically a hub **Azure Firewall/NVA** (0.0.0.0/0 → firewall) for inspection or forced tunneling to on-prem." },
    { front: "Where does WAF run, and on which services?", back: "Web Application Firewall (OWASP rules, bot protection) runs on **Application Gateway** (regional) and **Front Door** (global edge). Place it at the ingress tier that first receives internet HTTP traffic." },
    { front: "Private Link vs Private Endpoint", back: "Private Endpoint is the **consumer-side** NIC with a private IP into your VNet; Private Link Service is the **provider-side** way to expose your own service behind a Standard LB privately to other tenants." },
    { front: "How do you provide secure outbound internet for a subnet of VMs with no inbound exposure?", back: "Attach a **NAT Gateway** to the subnet for outbound SNAT, and keep NSGs denying inbound. No public IPs on the VMs are required." },
    { front: "ExpressRoute Global Reach — what is it?", back: "Connects two on-premises sites to each other **through the Microsoft backbone** via their ExpressRoute circuits — branch-to-branch connectivity without routing over the public internet." }
  ],

  questions: [
    {
      id: "net-q1", type: "single",
      question: "A company uses a hub-spoke topology. Spoke A must communicate with Spoke B, and all traffic must be inspected by a central firewall. What enables this?",
      options: [
        "Direct VNet peering between Spoke A and Spoke B",
        "Route traffic through an Azure Firewall in the hub using user-defined routes and gateway transit",
        "A Service Endpoint on each spoke",
        "Global VNet peering between the spokes"
      ],
      correct: [1],
      explanation: "VNet peering is non-transitive, so spoke-to-spoke traffic must be routed through the hub. Placing Azure Firewall in the hub with user-defined routes (and gateway transit settings) forces inspection of all cross-spoke traffic. Direct or global peering between spokes would bypass the firewall.",
      tip: "When you see 'central inspection' + hub-spoke, the answer is almost always routing through a hub NVA/firewall — never direct spoke-to-spoke peering, which defeats the inspection requirement."
    },
    {
      id: "net-q2", type: "single",
      question: "A regional web app needs TLS termination, URL path-based routing (/api → API pool), and OWASP protection. Which service?",
      options: ["Azure Load Balancer (Standard)", "Application Gateway WAF v2", "Traffic Manager", "Azure Front Door Standard"],
      correct: [1],
      explanation: "TLS offload + URL path-based routing are Layer-7 features, and OWASP protection requires WAF. Application Gateway WAF v2 is the regional L7 load balancer with an integrated OWASP 3.2 WAF. Load Balancer is L4 only; Traffic Manager is DNS only.",
      tip: "Keywords 'URL/path routing', 'TLS offload', and 'WAF' in a single region point to Application Gateway WAF v2. If it were global, you'd add Front Door in front."
    },
    {
      id: "net-q3", type: "single",
      question: "Users worldwide access a multi-region HTTP app. You need edge acceleration, caching, and automatic failover within seconds. Which service is the global entry point?",
      options: ["Traffic Manager (Performance routing)", "Application Gateway", "Azure Front Door", "Azure Load Balancer"],
      correct: [2],
      explanation: "Front Door is a global L7 service on Microsoft's edge with anycast routing, CDN/caching, WAF, and second-level failover. Traffic Manager is DNS-based and fails over only after DNS TTL expires (minutes) and offers no caching or TLS offload.",
      tip: "'Edge', 'caching/CDN', and 'fast failover' for an HTTP app = Front Door. Traffic Manager is a distractor whenever caching, TLS offload, or sub-minute failover is required."
    },
    {
      id: "net-q4", type: "single",
      question: "An EU regulation requires that European users' requests are always served from the EU region for data residency. Which Traffic Manager routing method?",
      options: ["Performance", "Geographic", "Weighted", "Priority"],
      correct: [1],
      explanation: "Geographic routing maps the client's DNS-source geography to a specific endpoint, guaranteeing EU users reach the EU endpoint regardless of latency — exactly what data sovereignty/GDPR scenarios require. Performance optimizes latency, not residency.",
      tip: "Compliance/residency = Geographic. Lowest latency = Performance. The exam deliberately pairs these two as distractors."
    },
    {
      id: "net-q5", type: "single",
      question: "You must make an Azure Storage account reachable only via a private IP inside a VNet, with no public internet access. What do you deploy?",
      options: [
        "A Service Endpoint for Microsoft.Storage",
        "A Private Endpoint with a privatelink.blob.core.windows.net private DNS zone",
        "An NSG rule denying internet inbound",
        "Azure Firewall application rules"
      ],
      correct: [1],
      explanation: "A Private Endpoint injects the storage service into the VNet with a private IP and can disable public access; it requires the matching private DNS zone (privatelink.blob.core.windows.net) so names resolve to the private IP. A Service Endpoint keeps the storage account's public IP.",
      tip: "'No public access' / 'private IP for PaaS' = Private Endpoint (plus its private DNS zone). Service Endpoint is the wrong answer whenever the public endpoint must be removed."
    },
    {
      id: "net-q6", type: "single",
      question: "A production workload needs a private, high-throughput (10 Gbps+), low-latency connection from on-premises to Azure with a 99.95% SLA. Which option?",
      options: ["Site-to-Site VPN (VpnGw3)", "Point-to-Site VPN", "ExpressRoute", "Global VNet peering"],
      correct: [2],
      explanation: "ExpressRoute provides a private (non-internet) connection up to 100 Gbps with a 99.95% SLA — the right fit for high-throughput, regulated production traffic. VPN gateways top out around 10 Gbps over the public internet with a 99.9% SLA.",
      tip: "Private + high bandwidth + higher SLA + 'production/regulated' = ExpressRoute. VPN appears when the scenario stresses low cost, quick setup, or backup connectivity."
    },
    {
      id: "net-q7", type: "multi",
      question: "Which statements about VNet peering are TRUE? (Select all that apply.)",
      options: [
        "Peering is non-transitive by default",
        "Overlapping address spaces are allowed if subnets differ",
        "Global VNet peering connects VNets across regions",
        "Each direction of the peering is configured independently"
      ],
      correct: [0, 2, 3],
      explanation: "Peering is non-transitive (A↔B and B↔C does not give A↔C), global peering links cross-region VNets, and each direction is configured independently (it is bidirectional but set up per side). Overlapping address spaces are NOT allowed.",
      tip: "On multi-select, eliminate any option that violates a hard rule. 'Overlapping address spaces allowed' is a flat contradiction of a VNet fundamental, so drop it immediately."
    },
    {
      id: "net-q8", type: "single",
      question: "You need to allow VMs to reach only specific external FQDNs (e.g. *.windowsupdate.com) and block all other egress. Which service?",
      options: ["NSG outbound rules", "Application Security Groups", "Azure Firewall application rules", "Service Endpoints"],
      correct: [2],
      explanation: "FQDN-based filtering of outbound HTTP/HTTPS is a Layer-7 capability that NSGs cannot do (they filter by IP/port only). Azure Firewall application rules allow/deny by FQDN, making it the correct egress-control service.",
      tip: "Any requirement mentioning FQDN/URL filtering rules out NSGs immediately — only Azure Firewall (or a third-party NVA) operates at L7 for this."
    },
    {
      id: "net-q9", type: "single",
      question: "An internal 3-tier app needs Layer-4 load balancing of TCP traffic to a SQL tier that must NOT be exposed to the internet. Which service and type?",
      options: [
        "Public Standard Load Balancer",
        "Internal (private) Standard Load Balancer",
        "Application Gateway",
        "Azure Front Door"
      ],
      correct: [1],
      explanation: "An internal Load Balancer uses a private VNet IP to distribute L4 (TCP) traffic among backend instances without internet exposure — ideal for a data tier. App Gateway and Front Door are L7/HTTP services, and a public LB would expose the tier.",
      tip: "'Internal/private' + 'TCP' + 'not internet-facing' = Internal Standard Load Balancer. L7 services are wrong when the protocol is generic TCP and there's no HTTP routing requirement."
    },
    {
      id: "net-q10", type: "single",
      question: "Administrators must RDP/SSH to VMs without assigning public IPs or opening ports 22/3389 to the internet. What do you deploy?",
      options: ["A jump-box VM with a public IP", "Azure Bastion in AzureBastionSubnet", "A Site-to-Site VPN for each admin", "NSG rules allowing 3389 from admin IPs"],
      correct: [1],
      explanation: "Azure Bastion provides browser-based RDP/SSH over TLS 443 from the dedicated AzureBastionSubnet (/26 minimum), so VMs need no public IP and management ports stay closed to the internet. A public jump box or open NSG ports reintroduce exposure.",
      tip: "'No public IP on VMs' + 'no exposed 22/3389' = Azure Bastion. Any answer that keeps a public IP or opens management ports contradicts the requirement."
    },
    {
      id: "net-q11", type: "single",
      question: "A global e-commerce site needs both edge web acceleration with WAF AND regional Layer-7 routing with WAF inside each region. What architecture is appropriate?",
      options: [
        "Front Door only",
        "Application Gateway only",
        "Front Door (global) in front of Application Gateway WAF v2 (regional)",
        "Traffic Manager in front of Load Balancer"
      ],
      correct: [2],
      explanation: "AZ-305 often expects layered designs: Front Door handles global acceleration, edge WAF, and cross-region failover, while Application Gateway WAF v2 provides regional L7 routing/WAF behind it. Each traffic hop is evaluated separately.",
      tip: "When a scenario describes BOTH a global concern AND a regional concern, the answer usually combines a global service with a regional one — don't force a single product."
    },
    {
      id: "net-q12", type: "single",
      question: "Which subnet size is the minimum required for Azure Bastion?",
      options: ["/29", "/27", "/26", "/24"],
      correct: [2],
      explanation: "AzureBastionSubnet requires a minimum of /26. This is a commonly tested hard requirement, alongside the reserved subnet name.",
      tip: "Memorize the subnet specifics: AzureBastionSubnet and AzureFirewallSubnet are /26; GatewaySubnet is commonly /27 or larger. Sizing/naming questions reward rote memory."
    },
    {
      id: "net-q13", type: "single",
      question: "You need DNS-based failover routing across an Azure region AND an on-premises datacenter (non-HTTP endpoints). Which service?",
      options: ["Azure Front Door", "Application Gateway", "Traffic Manager with Priority routing", "Standard Load Balancer"],
      correct: [2],
      explanation: "Traffic Manager works at DNS level with ANY internet-facing endpoint (Azure, on-prem, other clouds) and Priority routing gives active-passive failover. Front Door and App Gateway are HTTP/S only; Load Balancer is regional.",
      tip: "Endpoints include on-premises or non-HTTP targets → Traffic Manager (DNS) is the only global option that qualifies. Front Door is HTTP/S-only and can't route arbitrary protocols."
    },
    {
      id: "net-q14", type: "single",
      question: "What is the effect of choosing a Service Endpoint instead of a Private Endpoint for an Azure SQL Database?",
      options: [
        "SQL gets a private IP in the VNet and loses its public endpoint",
        "Traffic stays on the Microsoft backbone, but SQL keeps its public IP and needs no DNS change",
        "It enables cross-region private access automatically",
        "It requires a privatelink.database.windows.net DNS zone"
      ],
      correct: [1],
      explanation: "A Service Endpoint extends the VNet identity so traffic stays on the Microsoft backbone, but the PaaS resource retains its public IP and no private DNS zone is needed. Only a Private Endpoint provides a private IP, removes public access, supports cross-region, and requires the privatelink DNS zone.",
      tip: "If the answer mentions a privatelink DNS zone or a private IP, it's describing a Private Endpoint, not a Service Endpoint. Match the DNS-zone clue to the right feature."
    },
    {
      id: "net-q15", type: "single",
      question: "A workload requires ultra-low latency over ExpressRoute, bypassing the virtual network gateway for the data path. What do you enable?",
      options: ["FastPath", "Active-active VPN", "Accelerated Networking", "Gateway transit"],
      correct: [0],
      explanation: "ExpressRoute FastPath sends data-plane traffic directly to VMs, bypassing the gateway (the gateway is still used for the control plane). This minimizes latency for demanding workloads like databases or real-time traffic.",
      tip: "Don't confuse features: FastPath = bypass the ExpressRoute gateway data path; Accelerated Networking = SR-IOV on the VM NIC. The phrase 'bypass the gateway' points to FastPath."
    },
    {
      id: "net-q16", type: "single",
      question: "Which DDoS option provides configurable mitigation, telemetry, and cost protection for all public IPs in a VNet?",
      options: ["DDoS Basic (platform default)", "DDoS Network Protection (Standard)", "Azure Firewall threat intelligence", "NSG rate limiting"],
      correct: [1],
      explanation: "DDoS Network Protection (Standard) is the paid tier that protects all public IPs in a VNet with tunable policies, attack telemetry/alerting, rapid-response support, and cost protection. Basic is always-on platform protection but isn't configurable. NSGs don't do volumetric DDoS mitigation.",
      tip: "If the scenario asks for configurability, alerting, SLA, or cost protection, it's the paid DDoS Network Protection tier — Basic is free but offers none of those."
    },
    {
      id: "net-q17", type: "multi",
      question: "You are designing private connectivity to PaaS using Private Endpoints in a hub-spoke network. Which actions are required for name resolution to work across all spokes? (Select all that apply.)",
      options: [
        "Create the appropriate privatelink private DNS zone (e.g. privatelink.blob.core.windows.net)",
        "Link the private DNS zone to the VNets that need to resolve the endpoint",
        "Assign a public IP to each Private Endpoint",
        "Host the private DNS zones centrally (typically in the hub) and link the spokes"
      ],
      correct: [0, 1, 3],
      explanation: "Private Endpoints rely on a matching privatelink DNS zone; the zone must be linked to every VNet that needs to resolve the private name, and in hub-spoke you centralize the zones in the hub and link the spokes. Private Endpoints use a private IP — they do not get a public IP.",
      tip: "On multi-select DNS questions, the 'assign a public IP' style option is a trap — Private Endpoints are about removing public exposure, so any public-IP option is almost always wrong."
    },
    {
      id: "net-q18", type: "multi",
      question: "Which capabilities require Azure Firewall rather than an NSG? (Select all that apply.)",
      options: [
        "FQDN-based outbound filtering",
        "Threat intelligence-based deny of known malicious IPs",
        "Stateful Layer-4 allow/deny by IP, port, and protocol",
        "IDPS and TLS inspection (Premium)"
      ],
      correct: [0, 1, 3],
      explanation: "FQDN filtering, threat intelligence, and IDPS/TLS inspection are Layer-7/advanced features only Azure Firewall provides. Basic stateful L4 IP/port/protocol filtering is exactly what an NSG does, so that option does NOT require a firewall.",
      tip: "Separate L4 from L7: if a capability is plain IP/port filtering, an NSG suffices. Anything involving FQDN, URL, threat intel, or inspection forces Azure Firewall."
    },
    {
      id: "net-q19", type: "single",
      question: "A subnet of VMs must initiate outbound connections to many internet endpoints at high volume, with no inbound access. Connections intermittently fail with SNAT port exhaustion. What is the recommended fix?",
      options: [
        "Assign a public IP to each VM",
        "Attach a NAT Gateway to the subnet",
        "Add a second Standard Load Balancer",
        "Enable Accelerated Networking"
      ],
      correct: [1],
      explanation: "NAT Gateway provides scalable, managed outbound SNAT with a large pool of ports, eliminating SNAT exhaustion while keeping the subnet free of inbound exposure. Per-VM public IPs are an anti-pattern, and Accelerated Networking is a performance feature unrelated to SNAT.",
      tip: "Keyword 'SNAT port exhaustion' or 'scalable outbound-only internet' → NAT Gateway. It's the modern default for subnet egress; avoid answers that attach public IPs to each VM."
    },
    {
      id: "net-q20", type: "single",
      question: "An enterprise has 30 branch offices and 6 Azure regions and wants Microsoft-managed any-to-any connectivity between branches, VNets, and ExpressRoute without building and maintaining its own hub VNets. What should you recommend?",
      options: [
        "A manually built hub-spoke topology per region",
        "Azure Virtual WAN",
        "Global VNet peering between every VNet",
        "A full mesh of Site-to-Site VPNs"
      ],
      correct: [1],
      explanation: "Azure Virtual WAN is the Microsoft-managed global transit network connecting branches (VPN), VNets, ExpressRoute, and remote users through managed hubs with automated any-to-any routing — ideal at this scale. Hand-built hub-spoke or full-mesh peering/VPN becomes unmanageable across many sites and regions.",
      tip: "Many branches + multiple regions + 'managed' transit = Virtual WAN. Hand-built hub-spoke is the answer only for a small number of VNets/regions."
    },
    {
      id: "net-q21", type: "single",
      question: "A latency-sensitive VM-based application needs the highest possible network throughput and lowest jitter between VMs. Which feature should you enable?",
      options: ["Accelerated Networking", "Azure Firewall Premium", "Proximity Placement Group only", "DDoS Network Protection"],
      correct: [0],
      explanation: "Accelerated Networking enables SR-IOV, bypassing the host virtual switch to deliver lower latency, less jitter, and higher throughput on supported VM sizes. Firewall and DDoS are security features; a Proximity Placement Group reduces inter-VM distance but does not provide SR-IOV acceleration.",
      tip: "'Throughput/latency/jitter for the VM NIC' = Accelerated Networking (SR-IOV). Pair it with a Proximity Placement Group when the question also stresses physical co-location."
    },
    {
      id: "net-q22", type: "single",
      question: "In a hub-spoke design, you must force all spoke internet-bound traffic through the hub Azure Firewall for inspection. What do you configure on the spoke subnets?",
      options: [
        "A Service Endpoint for all services",
        "A User-Defined Route sending 0.0.0.0/0 to the firewall's private IP",
        "Global VNet peering to the internet",
        "An NSG rule allowing all outbound"
      ],
      correct: [1],
      explanation: "A User-Defined Route with destination 0.0.0.0/0 and next hop = the hub firewall's private IP overrides the default internet system route, forcing egress through the firewall for inspection. NSGs only allow/deny; they don't redirect the next hop.",
      tip: "'Force traffic through the firewall/NVA' = UDR (0.0.0.0/0 → firewall). NSGs filter but never change routing; if the question is about the path, think route tables."
    },
    {
      id: "net-q23", type: "single",
      question: "Two on-premises datacenters in different cities must exchange traffic with each other over the Microsoft backbone using their existing ExpressRoute circuits, avoiding the public internet. What do you enable?",
      options: ["ExpressRoute Global Reach", "ExpressRoute FastPath", "VPN coexistence", "Virtual WAN VPN"],
      correct: [0],
      explanation: "ExpressRoute Global Reach links two ExpressRoute circuits so on-premises sites communicate branch-to-branch through the Microsoft backbone, bypassing the public internet. FastPath optimizes the Azure data path, not site-to-site on-prem connectivity.",
      tip: "'Site-to-site over the Microsoft backbone via ExpressRoute' = Global Reach. FastPath is about bypassing the gateway into Azure, a different concern."
    },
    {
      id: "net-q24", type: "single",
      question: "You must securely publish your own VNet-hosted service so other Azure tenants can reach it over a private IP without VNet peering or public exposure. What do you use?",
      options: [
        "Private Endpoint in your VNet",
        "Private Link Service behind a Standard Load Balancer",
        "Service Endpoint",
        "Global VNet peering"
      ],
      correct: [1],
      explanation: "Private Link Service is the provider-side mechanism: you front your service with a Standard Load Balancer and expose it via Private Link so consumers create Private Endpoints into it — private, cross-tenant, no peering. A Private Endpoint is the consumer side of the connection, not the publishing side.",
      tip: "Provider exposing a service privately = Private Link Service (behind Standard LB). Consumer connecting privately = Private Endpoint. Match the side of the connection to the right object."
    },
    {
      id: "net-q25", type: "single",
      question: "A new production deployment needs zone-redundant public ingress and a 99.99% load balancer SLA. Which public IP and load balancer SKU must you choose?",
      options: ["Basic public IP + Basic Load Balancer", "Standard public IP + Standard Load Balancer", "Dynamic public IP + Application Gateway v1", "Basic public IP + Standard Load Balancer"],
      correct: [1],
      explanation: "Zone redundancy and the 99.99% SLA require Standard SKU for both the public IP and the Load Balancer; Basic is retired and not zone-aware. Mixing Basic and Standard SKUs is also unsupported.",
      tip: "Any requirement for availability zones or an SLA on L4 load balancing forces Standard SKU end-to-end. Treat 'Basic' as a wrong answer for new designs."
    },
    {
      id: "net-q26", type: "single",
      question: "An internet-facing web app spanning three regions needs OWASP protection applied as early as possible at the edge. Where should the WAF be enabled?",
      options: [
        "On the regional Azure Load Balancer",
        "On Azure Front Door (Premium) at the edge",
        "Using NSGs on each subnet",
        "On the VM operating system firewall"
      ],
      correct: [1],
      explanation: "Front Door provides a WAF at Microsoft's global edge, blocking malicious HTTP traffic before it reaches any region — the right place for early, global OWASP protection. Load Balancer is L4 and has no WAF; NSGs and host firewalls don't do L7 OWASP inspection.",
      tip: "'Earliest/edge' + 'global' + 'OWASP/WAF' = Front Door WAF. For a single region, the WAF lives on Application Gateway instead."
    },
    {
      id: "net-q27", type: "multi",
      question: "Which are valid ways to optimize NETWORK SECURITY for a hub-spoke workload? (Select all that apply.)",
      options: [
        "Centralize egress filtering with Azure Firewall in the hub",
        "Replace PaaS public endpoints with Private Endpoints",
        "Use NAT Gateway to increase outbound throughput for performance",
        "Enable DDoS Network Protection on public-facing VNets"
      ],
      correct: [0, 1, 3],
      explanation: "Centralized firewall egress control, Private Endpoints to remove public PaaS exposure, and DDoS Network Protection are all security optimizations. NAT Gateway is primarily an outbound connectivity/scale feature, not a security control, so it doesn't belong in a 'security' answer.",
      tip: "Watch the category the question asks for. A correct-sounding feature in the wrong category (NAT Gateway under 'security') is a classic distractor — match each option to the asked-for goal."
    },
    {
      id: "net-q28", type: "multi",
      question: "Which statements about connecting Azure to on-premises networks are TRUE? (Select all that apply.)",
      options: [
        "Site-to-Site VPN runs encrypted over the public internet",
        "ExpressRoute provides a private connection that bypasses the public internet",
        "ExpressRoute Global Reach links two on-prem sites via their ExpressRoute circuits",
        "Point-to-Site VPN is the recommended way to connect an entire datacenter"
      ],
      correct: [0, 1, 2],
      explanation: "S2S VPN is encrypted over the internet, ExpressRoute is a private (non-internet) link, and Global Reach connects on-prem sites through their circuits. Point-to-Site connects individual devices/clients — not an entire datacenter, which uses S2S or ExpressRoute.",
      tip: "Remember the scope of each VPN type: P2S = single device, S2S = whole network/site, ExpressRoute = private dedicated. Any option assigning P2S to a full site is wrong."
    }
  ]
});
