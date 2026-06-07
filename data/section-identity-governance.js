AZ305.registerSection({
  id: "identity-governance",
  title: "Identity & Governance",
  domain: "Identity, Governance & Monitoring",
  weight: "25–30%",
  icon: "🔐",
  order: 1,
  summary: "Identity and governance questions reward least privilege, correct scope, and policy-driven enforcement. Master **Microsoft Entra ID**, **RBAC vs Azure Policy**, **managed identities**, **PIM**, **Key Vault**, and the management group → subscription → resource group hierarchy.",

  notes: [
    {
      heading: "Microsoft Entra ID Core Concepts",
      intro: "An Entra tenant is the identity boundary that subscriptions trust for authentication and authorization.",
      table: {
        headers: ["Identity type", "Description", "Use case"],
        rows: [
          ["User", "Human identity stored in the directory", "Employees and administrators"],
          ["Service principal", "Application identity created from an app registration", "Automation or non-Azure apps"],
          ["Managed identity", "Azure-managed service principal for an Azure resource", "Secretless Azure-to-Azure access"],
          ["Guest user (B2B)", "External user invited into your tenant", "Partner collaboration"]
        ]
      },
      points: [
        "A **subscription trusts exactly one tenant** at a time; one tenant can manage many subscriptions.",
        "The directory stores users, groups, applications, service principals, devices, and guest users.",
        "For Azure resources accessing Azure services, prefer **managed identity** over stored credentials or service principal secrets."
      ],
      tip: "If the workload is an Azure resource and the requirement says no credentials in code, choose managed identity."
    },
    {
      heading: "External Identities: B2B vs B2C",
      table: {
        headers: ["", "Azure AD B2B", "Azure AD B2C"],
        rows: [
          ["Purpose", "Partner/vendor collaboration", "Customer identity for external users"],
          ["Identity source", "Guest users from any IdP", "Local accounts plus social IdPs such as Google or Facebook"],
          ["Tenant model", "Guests are invited into your tenant", "Usually a separate B2C tenant"],
          ["Use case", "Share internal apps with partners", "Consumer-facing app sign-in"]
        ]
      },
      points: [
        "**B2B** is for collaboration with external organizations while keeping governance in your tenant.",
        "**B2C** is for applications where customers create accounts or use social identity providers.",
        "Entitlement management can govern partner access packages for B2B users."
      ],
      tip: "Partner access to internal resources = B2B. Public customer sign-in with social providers = B2C."
    },
    {
      heading: "Conditional Access, MFA & Identity Protection",
      intro: "Conditional Access evaluates signals and then enforces controls such as MFA, compliant device, or block.",
      table: {
        headers: ["Signal", "Examples"],
        rows: [
          ["User or group", "Specific users, administrators, guests, roles"],
          ["Device", "Compliant device, hybrid Entra ID joined device"],
          ["Location", "Named locations, IP ranges, countries"],
          ["Cloud app", "Specific SaaS or enterprise application"],
          ["Risk", "User risk or sign-in risk from Identity Protection"]
        ]
      },
      points: [
        "Common policies require **MFA** for sensitive apps, block legacy authentication, or require compliant Intune-managed devices.",
        "**User risk** means the identity may be compromised; **sign-in risk** means a specific sign-in may not be legitimate.",
        "Risk-based Conditional Access and PIM both require **Microsoft Entra ID P2**."
      ],
      tip: "When the scenario includes location, device compliance, app sensitivity, or risk-based MFA, think Conditional Access."
    },
    {
      heading: "Hybrid Identity Decision Framework",
      table: {
        headers: ["Method", "Description", "When to use"],
        rows: [
          ["Password Hash Sync (PHS)", "Hash of the password hash is synced to Entra ID", "Default choice: simplest and resilient if on-premises is down"],
          ["Pass-Through Authentication (PTA)", "Entra forwards authentication to on-premises agents", "Password validation must stay on-premises without hash sync"],
          ["AD FS federation", "Federated trust with on-premises AD FS", "Complex claims, third-party MFA, or legacy federation needs"]
        ]
      },
      points: [
        "Azure AD Connect synchronizes on-premises AD objects and supports PHS, PTA, and AD FS.",
        "Azure AD Connect Cloud Sync is a lighter agent-based option for disconnected forests or minimal on-premises footprint.",
        "Entra Application Proxy publishes on-premises web apps through Entra ID with SSO and no VPN. Entra Private Access provides identity-based ZTNA for private resources."
      ],
      tip: "No special requirement = PHS. Must validate on-premises = PTA. Complex claims/federation = AD FS."
    },
    {
      heading: "Azure RBAC: Roles, Scope & Planes",
      table: {
        headers: ["Requirement", "Best fit", "Common wrong answer"],
        rows: [
          ["Full control including assigning roles", "Owner", "Contributor"],
          ["Manage resources but not grant access", "Contributor", "Owner"],
          ["Assign roles without changing resources", "User Access Administrator", "Contributor"],
          ["View resources only", "Reader", "Contributor"],
          ["Read blob contents", "Storage Blob Data Reader", "Reader on storage account"]
        ]
      },
      points: [
        "Scope inheritance flows **management group → subscription → resource group → resource**. Assign the smallest scope that satisfies the requirement.",
        "RBAC has three building blocks: security principal, role definition, and scope.",
        "Management-plane roles manage Azure resources; data-plane roles access data inside a resource such as blobs or Key Vault secrets.",
        "Deny assignments override allow assignments and inherit downward."
      ],
      tip: "`Contributor` cannot grant access. If the requirement includes role assignments, choose `Owner` or `User Access Administrator`."
    },
    {
      heading: "Managed Identities & Data-Plane Access",
      table: {
        headers: ["", "System-assigned", "User-assigned"],
        rows: [
          ["Lifecycle", "Tied to one Azure resource and deleted with it", "Independent Azure resource"],
          ["Sharing", "One resource only", "Can be shared by multiple resources"],
          ["Best use", "Single app or VM needs an identity", "Many resources need the same permissions"],
          ["Operational effect", "Simplest per-resource setup", "Stable identity across resource rebuilds"]
        ]
      },
      points: [
        "Assign the managed identity a **data-plane role** when it must read secrets or blobs, not a broad management role.",
        "For Key Vault with RBAC, use roles such as Key Vault Secrets User or Key Vault Crypto User depending on the data operation.",
        "For Storage data, use Storage Blob Data Reader/Contributor rather than Contributor on the storage account."
      ],
      tip: "Several VMs or apps needing identical access usually points to a user-assigned managed identity."
    },
    {
      heading: "PIM and Identity Governance",
      table: {
        headers: ["Capability", "What it does", "Use case"],
        rows: [
          ["PIM eligible assignment", "User can activate a privileged role just in time", "Admin rights require MFA, approval, and time limit"],
          ["Access reviews", "Periodic certification of users or role assignments", "Quarterly review of Owner or guest access"],
          ["Entitlement management", "Access packages for groups, apps, and SharePoint", "Governed external partner onboarding"],
          ["Lifecycle workflows", "Automate joiner/mover/leaver tasks", "Disable access after HR termination event"],
          ["Permissions Management (CIEM)", "Find unused/excessive cloud permissions across Azure, AWS, GCP", "Reduce over-permissioned identities"]
        ]
      },
      points: [
        "**Active assignment** means the role is always active; **eligible assignment** requires activation when needed.",
        "PIM activation can require MFA, approval, justification, and a maximum activation duration.",
        "Access packages can include expiration policies and approval workflows for external users."
      ],
      tip: "Standing admin access is a red flag. Replace it with PIM eligible access plus access reviews."
    },
    {
      heading: "Azure Policy, Management Groups & Landing Zones",
      intro: "RBAC answers who can do something; Azure Policy enforces what can be deployed or remediated at scale.",
      table: {
        headers: ["Policy effect", "Description", "Use case"],
        rows: [
          ["Deny", "Block non-compliant create/update", "Prevent public IPs in production"],
          ["Audit", "Log non-compliance but allow", "Assessment before enforcement"],
          ["Append", "Add fields to a request", "Add default settings"],
          ["Modify", "Add or change resource properties", "Enforce or inherit tags"],
          ["AuditIfNotExists", "Audit when a related resource is missing", "Detect missing diagnostics"],
          ["DeployIfNotExists", "Deploy related resource when missing", "Auto-enable agents or diagnostics"],
          ["Disabled", "Turn policy off", "Pause enforcement"]
        ]
      },
      points: [
        "The root management group is one per tenant and cannot be moved or deleted; management groups can be nested up to six levels below root.",
        "Assign policy initiatives and RBAC at management group scope to inherit across subscriptions.",
        "Azure landing zones use management groups, subscriptions, policies, RBAC, networking, and logging as a repeatable enterprise foundation.",
        "Azure Blueprints packaged policies, RBAC, ARM templates, and resource groups, but prefer Deployment Stacks plus Azure Policy and RBAC for modern designs."
      ],
      tip: "Enforce standards = Azure Policy. Grant permissions = RBAC. Auto-remediate missing configuration = `DeployIfNotExists`."
    },
    {
      heading: "Azure Key Vault Security",
      table: {
        headers: ["Area", "Key facts"],
        rows: [
          ["Object types", "Secrets, keys, and certificates"],
          ["Access model", "Azure RBAC is preferred; vault access policies are legacy"],
          ["Soft delete", "Deleted objects retained 7–90 days; default 90 for new vaults"],
          ["Purge protection", "Prevents permanent deletion during retention period; required for many compliance scenarios"],
          ["Backup/restore", "Back up individual objects only; restore to same subscription and same Azure geography"],
          ["CMK", "Services use keys in Key Vault or Managed HSM for customer-managed encryption"]
        ]
      },
      points: [
        "Key Vault backup output is encrypted and cannot be decrypted outside Azure.",
        "A backup is a point-in-time snapshot and does not stay synchronized automatically.",
        "Managed HSM is the highest-security option when FIPS 140-2 Level 3 is required."
      ],
      tip: "If the requirement says secrets recoverable after deletion, include soft delete and purge protection."
    },
    {
      heading: "Exam skills mapping",
      points: [
        "Recommend an authentication solution: Entra Password Hash Sync, seamless SSO, pass-through authentication, AD FS federation, FIDO2/passwordless, and certificate-based authentication.",
        "Recommend an identity management solution: Entra tenants, B2B external collaboration, B2C/External ID, Entra Domain Services, and system-assigned vs user-assigned managed identities.",
        "Recommend a solution for authorizing access to Azure resources: RBAC roles and scopes, custom roles, ABAC conditions, PIM JIT activation, and Conditional Access.",
        "Recommend a solution for authorizing access to on-premises resources: Entra Application Proxy, Entra Domain Services, hybrid identity, and identity-based private access.",
        "Recommend a solution to manage secrets, certificates, and keys: Key Vault tiers, Managed HSM, RBAC vs access policies, soft delete, purge protection, and rotation.",
        "Recommend a management group, subscription, resource group, and tagging strategy for enterprise-scale governance.",
        "Recommend a compliance management solution using Azure Policy, initiatives, Defender for Cloud regulatory compliance, landing zones, and modern blueprint replacements.",
        "Recommend an identity governance solution using PIM, access reviews, entitlement management, lifecycle workflows, and Entra Permissions Management (CIEM)."
      ],
      tip: "Read each identity question as one of these skills first; the keywords usually point to the service family before they point to the exact configuration."
    }
  ],

  flashcards: [
    { front: "What is the relationship between an Azure subscription and an Entra tenant?", back: "A subscription trusts exactly one tenant for identity, but a single tenant can manage multiple subscriptions." },
    { front: "Managed identity vs service principal secret — exam default", back: "For an Azure resource accessing another Azure service, use **managed identity** so Azure manages credentials and no secrets are stored in code." },
    { front: "System-assigned vs user-assigned managed identity", back: "System-assigned is tied to one resource and deleted with it. User-assigned is an independent identity that multiple resources can share." },
    { front: "B2B vs B2C", back: "B2B = partner/vendor guests invited into your tenant. B2C = customer-facing identity with local or social sign-ins, usually in a separate B2C tenant." },
    { front: "Conditional Access signals", back: "User/group, device compliance, location, cloud app, and risk. Controls include MFA, block, and require compliant device." },
    { front: "User risk vs sign-in risk", back: "User risk estimates whether the identity is compromised; sign-in risk estimates whether a specific sign-in is suspicious." },
    { front: "PHS vs PTA vs AD FS", back: "PHS is simplest/resilient. PTA validates passwords on-premises. AD FS is for complex claims, third-party MFA, or legacy federation." },
    { front: "What does Entra Application Proxy do?", back: "Publishes on-premises web apps through Entra ID with SSO and MFA support, without requiring a VPN." },
    { front: "Azure RBAC building blocks", back: "Security principal, role definition, and scope. Pick the least-privileged role at the smallest workable scope." },
    { front: "Owner vs Contributor vs User Access Administrator", back: "Owner manages everything including access. Contributor manages resources but cannot assign roles. User Access Administrator manages access only." },
    { front: "Management plane vs data plane", back: "Management plane manages Azure resources; data plane accesses data inside resources, such as Key Vault secrets or blob contents." },
    { front: "What is PIM eligible access?", back: "A user can activate a privileged role just in time, often requiring MFA, approval, justification, and time-bound duration." },
    { front: "Entitlement management use case", back: "Access packages govern access to groups, apps, and SharePoint sites, often for external partners with approval and expiration." },
    { front: "RBAC vs Azure Policy", back: "RBAC controls **who** can act. Azure Policy controls **what** can be deployed or remediated for compliance." },
    { front: "Which Azure Policy effect auto-remediates missing resources?", back: "`DeployIfNotExists` deploys a related resource or configuration when it is missing, such as an agent or diagnostic setting." },
    { front: "Management group hierarchy", back: "Root management group → management groups → subscriptions → resource groups → resources. Higher-scope assignments inherit downward." },
    { front: "Key Vault recovery essentials", back: "Use soft delete plus purge protection when deleted secrets, keys, or certificates must be recoverable and protected from permanent deletion." },
    { front: "Key Vault backup restore scope", back: "Back up individual objects only. Restore requires the same subscription and same Azure geography, not necessarily the exact same region." },
    { front: "PHS with seamless SSO vs pass-through authentication", back: "PHS with seamless SSO gives cloud authentication plus a quiet domain-joined user experience. PTA is only needed when password validation must occur on-premises." },
    { front: "When do FIDO2 and certificate-based authentication show up?", back: "FIDO2/security keys are passwordless phishing-resistant sign-in. Certificate-based authentication is used when organizations require X.509 certificate sign-in, often from managed devices or smart cards." },
    { front: "What is Microsoft Entra Domain Services?", back: "A managed domain that provides LDAP, Kerberos/NTLM, and domain join without running domain controllers. Use it for legacy apps needing domain services in Azure." },
    { front: "Custom RBAC role vs ABAC condition", back: "Custom role changes **which actions** are allowed. ABAC conditions restrict **when or on which resources/data** an assignment applies, such as blob tag conditions." },
    { front: "Key Vault Standard vs Premium vs Managed HSM", back: "Standard uses software-protected keys. Premium adds HSM-backed keys. Managed HSM is a dedicated HSM service for highest isolation, FIPS 140-2 Level 3, and key-heavy workloads." },
    { front: "Key and secret rotation design", back: "Store secrets, keys, and certificates in Key Vault; use expiration, rotation policies where supported, Event Grid notifications, and app references so rotation does not require code redeploys." },
    { front: "Management group and subscription design rule", back: "Use management groups for inherited policy/RBAC, subscriptions for workload or environment isolation and billing, resource groups for lifecycle boundaries, and tags for cost/ownership metadata." },
    { front: "Defender for Cloud regulatory compliance", back: "Use Defender for Cloud to track secure score, recommendations, and regulatory compliance standards. Use Azure Policy initiatives for enforceable compliance controls." }
  ],

  questions: [
    {
      id: "idg-q1", type: "single",
      question: "An App Service must read secrets from Key Vault. Security policy forbids client secrets, certificates, or credentials in application settings. What should you design?",
      options: [
        "Create an app registration and store its client secret in App Service settings",
        "Enable a system-assigned managed identity and grant it a Key Vault data-plane role",
        "Assign Contributor on the Key Vault to the development team",
        "Export the Key Vault secrets to encrypted app configuration files"
      ],
      correct: [1],
      explanation: "A managed identity gives the App Service an Azure-managed service principal without stored credentials. It still needs a Key Vault data-plane role to read secrets. Storing a client secret violates the requirement, and Contributor is a management-plane role that is broader than needed.",
      tip: "No credentials in code or configuration for an Azure resource = managed identity plus the narrow data role."
    },
    {
      id: "idg-q2", type: "single",
      question: "Several VM scale set instances and two App Services need the same permissions to Storage and Key Vault. The identity should survive individual resource rebuilds. Which identity type is best?",
      options: ["System-assigned managed identity", "User-assigned managed identity", "Local administrator account", "Shared service principal secret"],
      correct: [1],
      explanation: "A user-assigned managed identity is an independent resource that can be attached to multiple Azure resources and persists even if a VM or app is rebuilt. System-assigned identities are tied to one resource and are deleted with it.",
      tip: "One resource = system-assigned. Multiple resources sharing the same permissions or needing identity persistence = user-assigned."
    },
    {
      id: "idg-q3", type: "single",
      question: "A company wants partner employees to access an internal SharePoint site while keeping those users governed as guests in the corporate tenant. Which identity feature should be used?",
      options: ["Azure AD B2C", "Azure AD B2B collaboration", "Azure AD Connect Cloud Sync", "Entra Private Access"],
      correct: [1],
      explanation: "B2B collaboration invites partner users as guest users into the company's tenant so they can access internal apps and be governed by tenant policies. B2C is for customer-facing applications, not partner collaboration inside the workforce tenant.",
      tip: "Partners and vendors accessing internal resources are B2B guests. Consumers signing into public apps are B2C users."
    },
    {
      id: "idg-q4", type: "single",
      question: "A retail company is building a public loyalty app. Customers must create accounts or sign in with social providers such as Google and Facebook. What should host the identities?",
      options: ["Azure AD B2B in the workforce tenant", "Azure AD B2C in a customer identity tenant", "PIM access packages", "Azure AD Connect"],
      correct: [1],
      explanation: "Azure AD B2C is designed for consumer-facing apps and supports local accounts and social identity providers. B2B is for collaboration with partners and would incorrectly invite customers into the workforce tenant.",
      tip: "Social login plus customer app is the B2C pattern."
    },
    {
      id: "idg-q5", type: "single",
      question: "Administrators must use MFA when accessing Azure from outside the corporate network, but they should not be prompted from trusted office IP ranges. Which solution fits?",
      options: ["Conditional Access policy using named locations", "Azure Policy assignment at subscription scope", "Network security group rule", "PIM access review"],
      correct: [0],
      explanation: "Conditional Access can evaluate location signals such as named trusted IP ranges and require MFA only when the sign-in is outside those locations. Azure Policy and NSGs do not enforce identity sign-in controls.",
      tip: "MFA decisions based on user, app, device, location, or risk are Conditional Access questions."
    },
    {
      id: "idg-q6", type: "single",
      question: "A company wants to synchronize on-premises AD users to Entra ID. There are no complex claims requirements, and sign-ins must continue if the on-premises environment is unavailable. Which authentication method is preferred?",
      options: ["AD FS federation", "Pass-through authentication", "Password hash synchronization", "Entra Application Proxy"],
      correct: [2],
      explanation: "Password hash synchronization is the simplest and most resilient option because Entra ID can authenticate users even if on-premises AD is unavailable. PTA depends on on-premises agents, and AD FS adds complexity for special federation requirements.",
      tip: "When the scenario says no special requirements, pick PHS."
    },
    {
      id: "idg-q7", type: "multi",
      question: "Which statements about Azure RBAC scope and role assignments are TRUE? (Select all that apply.)",
      options: [
        "Assignments at a management group can be inherited by subscriptions below it",
        "The smallest scope that satisfies the requirement is preferred",
        "Contributor can create role assignments for other users",
        "Deny assignments override allow assignments"
      ],
      correct: [0, 1, 3],
      explanation: "Management group assignments inherit downward, least privilege favors the smallest workable scope, and deny assignments override allows. Contributor can manage resources but cannot grant access; Owner or User Access Administrator is required for role assignments.",
      tip: "On RBAC multi-select, reject any option saying Contributor can assign roles."
    },
    {
      id: "idg-q8", type: "single",
      question: "An operations lead must restart and resize VMs in one resource group but must not be able to assign Azure roles. Which role and scope are best?",
      options: ["Owner at subscription scope", "Contributor at resource group scope", "User Access Administrator at subscription scope", "Reader at resource group scope"],
      correct: [1],
      explanation: "Contributor at the resource group scope allows VM management actions such as restart and resize while preventing role assignment. Owner and subscription scope are too broad; Reader cannot change VMs; User Access Administrator manages access only.",
      tip: "Manage resources but not access = Contributor. Limit scope to the resource group if that is all the team needs."
    },
    {
      id: "idg-q9", type: "single",
      question: "A security team must assign and remove Azure roles for users but must not be able to modify resources. Which built-in role should you assign?",
      options: ["Owner", "Contributor", "User Access Administrator", "Security Reader"],
      correct: [2],
      explanation: "User Access Administrator can manage role assignments without granting general resource management permissions. Owner would also work technically but grants unnecessary full control, violating least privilege.",
      tip: "Access management only = User Access Administrator."
    },
    {
      id: "idg-q10", type: "single",
      question: "A data analyst needs to read blob contents in a storage account but must not manage the storage account configuration. Which role is most appropriate?",
      options: ["Reader", "Contributor", "Storage Blob Data Reader", "Storage Account Contributor"],
      correct: [2],
      explanation: "Reading blob contents is a data-plane operation, so a Storage data-plane role is required. Reader can view the storage account resource but does not grant access to blob data, and Contributor roles are broader than required.",
      tip: "If the requirement says contents of blobs, queues, or secrets, look for a data-plane role."
    },
    {
      id: "idg-q11", type: "single",
      question: "A developer should be able to create VMs in a resource group, but production policy must block any VM creation that lacks required cost-center tags. What should enforce the tagging requirement?",
      options: ["Azure RBAC custom role", "Azure Policy with Deny or Modify effect", "PIM access review", "Management lock"],
      correct: [1],
      explanation: "Azure Policy enforces resource compliance such as required tags. Deny can block untagged resources, and Modify can add or change tags. RBAC controls who can create VMs but does not inspect resource properties for compliance.",
      tip: "Standards for resource configuration are Policy, not RBAC."
    },
    {
      id: "idg-q12", type: "multi",
      question: "Which Azure Policy effects are appropriate for the stated governance outcomes? (Select all that apply.)",
      options: [
        "Use Deny to block creation of public IP addresses in production",
        "Use DeployIfNotExists to automatically enable a missing monitoring agent or diagnostic setting",
        "Use Reader to audit resources for missing tags",
        "Use Modify to add or update required tags on resources"
      ],
      correct: [0, 1, 3],
      explanation: "Deny blocks non-compliant deployments, DeployIfNotExists can remediate missing related resources, and Modify can add or update properties such as tags. Reader is an RBAC role, not a policy effect.",
      tip: "If an option is an RBAC role inside a policy-effect question, it is usually a distractor."
    },
    {
      id: "idg-q13", type: "single",
      question: "A new enterprise wants policies and RBAC assignments to apply consistently across all current and future production subscriptions. Where should the assignments be placed?",
      options: ["On each resource group", "On each individual resource", "At the appropriate management group", "In each Key Vault access policy"],
      correct: [2],
      explanation: "Management groups are designed to organize subscriptions and apply inherited RBAC and policy assignments across them, including future subscriptions moved under that management group. Resource-level assignments would not scale.",
      tip: "Cross-subscription governance at scale points to management groups."
    },
    {
      id: "idg-q14", type: "single",
      question: "An admin needs Global Administrator rights only during emergency changes. Activation must require MFA, approval, and expire after two hours. What should be configured?",
      options: ["Permanent active assignment", "PIM eligible assignment", "Azure Policy initiative", "Conditional Access named location"],
      correct: [1],
      explanation: "Privileged Identity Management eligible assignments provide just-in-time activation with controls such as MFA, approval, justification, and time-bound access. A permanent active assignment creates standing privilege.",
      tip: "Just-in-time admin access with approval is PIM."
    },
    {
      id: "idg-q15", type: "single",
      question: "External contractors need access to a specific app and group for 90 days. Managers must approve requests, and access should expire automatically. Which feature is best?",
      options: ["Entitlement management access package", "User Access Administrator role", "Azure AD Connect Cloud Sync", "Storage SAS token"],
      correct: [0],
      explanation: "Entitlement management access packages bundle access to groups, apps, and SharePoint sites with approval workflows and expiration. It is designed for governed onboarding of external users and time-limited access.",
      tip: "Time-bound governed access to multiple identity resources = access package."
    },
    {
      id: "idg-q16", type: "single",
      question: "An on-premises web application must be available to remote employees with Entra ID SSO and MFA. The company does not want to expose the app directly or require a VPN. What should be used?",
      options: ["Entra Application Proxy", "Azure AD B2C", "Site-to-Site VPN", "Azure Policy"],
      correct: [0],
      explanation: "Entra Application Proxy publishes on-premises web apps through outbound connectors and lets users authenticate with Entra ID, including MFA, without a VPN. B2C is for customer identity, not internal app publishing.",
      tip: "On-premises web app + SSO + no VPN = Application Proxy."
    },
    {
      id: "idg-q17", type: "single",
      question: "A Key Vault must protect secrets from accidental deletion and prevent a malicious admin from permanently deleting them during the retention period. What settings are required?",
      options: ["Soft delete only", "Purge protection only", "Soft delete and purge protection", "A management lock only"],
      correct: [2],
      explanation: "Soft delete retains deleted objects for the retention window, and purge protection prevents permanent deletion before that window expires. Both are needed for recoverability and protection against purge during retention.",
      tip: "Recoverable after delete = soft delete. Cannot permanently delete during retention = purge protection."
    },
    {
      id: "idg-q18", type: "multi",
      question: "Which Key Vault statements are TRUE? (Select all that apply.)",
      options: [
        "Azure RBAC is the preferred modern access model for Key Vault data access",
        "Key Vault backs up an entire vault in one operation",
        "Object backup can be restored only within the same subscription and same Azure geography",
        "Secrets, keys, and certificates are distinct Key Vault object types"
      ],
      correct: [0, 2, 3],
      explanation: "Azure RBAC is the recommended access model, Key Vault has separate object types, and backup/restore is constrained to the same subscription and Azure geography. Backups are for individual keys, secrets, or certificates, not an entire vault in one operation.",
      tip: "Be precise: Key Vault backup is per object and geography-bound, not vault-wide or exact-region-only."
    },
    {
      id: "idg-q19", type: "multi",
      question: "Which scenarios are better solved by Microsoft Sentinel rather than Defender for Cloud? (Select all that apply.)",
      options: [
        "Correlate security events from Azure, AWS, Microsoft 365, and on-premises firewalls",
        "Run KQL threat-hunting queries across raw security logs",
        "Improve Azure secure score with posture recommendations",
        "Trigger Logic Apps playbooks from security incidents"
      ],
      correct: [0, 1, 3],
      explanation: "Sentinel is a SIEM/SOAR platform for cross-source correlation, threat hunting, incidents, and playbooks. Defender for Cloud focuses on CSPM/CWPP posture, recommendations, secure score, and workload protections.",
      tip: "Cross-platform SOC and SOAR = Sentinel. Secure score and Azure workload posture = Defender for Cloud."
    },
    {
      id: "idg-q20", type: "single",
      question: "An organization wants to find identities with permissions granted across Azure, AWS, and GCP that have not been used recently. Which Entra capability targets this?",
      options: ["Microsoft Entra Permissions Management", "Azure AD B2C", "Azure Service Health", "Key Vault Managed HSM"],
      correct: [0],
      explanation: "Microsoft Entra Permissions Management is a CIEM solution that discovers, monitors, and remediates excessive or unused permissions across multiple clouds including Azure, AWS, and GCP.",
      tip: "Unused or excessive multi-cloud permissions is CIEM, so choose Entra Permissions Management."
    },
    {
      id: "idg-q21", type: "single",
      question: "A company uses on-premises AD and wants cloud authentication for Microsoft 365 and Azure. Users on domain-joined corporate devices should get SSO, and sign-in must keep working during an on-premises outage. Which authentication design is best?",
      options: ["Password Hash Sync with seamless SSO", "Pass-through authentication only", "AD FS federation only", "Entra Application Proxy"],
      correct: [0],
      explanation: "Password Hash Sync is the simplest and most resilient because Entra ID can authenticate users even if on-premises AD is unavailable. Seamless SSO improves the user experience on domain-joined corporate devices. PTA and AD FS depend on on-premises availability.",
      tip: "Resilience during on-premises outage points away from PTA/AD FS and toward PHS. Add seamless SSO for domain-joined convenience."
    },
    {
      id: "idg-q22", type: "single",
      question: "Executives require phishing-resistant passwordless sign-in to Azure and Microsoft 365 without using SMS or app passwords. Which authentication method should you recommend first?",
      options: ["FIDO2 security keys", "Security questions", "Stored service principal secrets", "Azure AD B2C local accounts"],
      correct: [0],
      explanation: "FIDO2 security keys provide standards-based, phishing-resistant passwordless authentication for Entra ID users. Security questions and SMS-style factors are weaker and not passwordless phishing-resistant controls, while B2C local accounts solve a different customer identity problem.",
      tip: "Passwordless plus phishing-resistant is a strong clue for FIDO2/security keys or passkeys."
    },
    {
      id: "idg-q23", type: "single",
      question: "A legacy line-of-business app is being moved to Azure VMs. It requires LDAP binds and Kerberos/NTLM domain join, but the team does not want to deploy or patch domain controllers. Which identity service fits?",
      options: ["Microsoft Entra Domain Services", "Azure AD B2C", "PIM", "Conditional Access only"],
      correct: [0],
      explanation: "Microsoft Entra Domain Services provides managed domain services such as LDAP, Kerberos/NTLM, and domain join without customer-managed domain controllers. B2C is for customer identities, and PIM/Conditional Access do not provide legacy domain protocols.",
      tip: "LDAP/Kerberos/NTLM in Azure without running DCs = Entra Domain Services."
    },
    {
      id: "idg-q24", type: "multi",
      question: "A storage security design must let analysts read only blobs tagged `Project=Finance`, while also preventing them from managing the storage account. Which design elements are appropriate? (Select all that apply.)",
      options: [
        "Assign a Storage Blob Data Reader role rather than Contributor on the storage account",
        "Use an ABAC condition on the role assignment based on blob tags",
        "Assign Owner at the subscription so analysts can filter manually",
        "Scope the assignment as narrowly as practical"
      ],
      correct: [0, 1, 3],
      explanation: "Blob contents require a data-plane Storage role, and an ABAC condition can constrain access based on blob attributes such as tags. Least privilege also requires the narrowest practical scope. Owner is vastly overprivileged and includes management access.",
      tip: "Custom role or ABAC questions still obey least privilege: data-plane role, narrow scope, and conditions for attribute-based limits."
    },
    {
      id: "idg-q25", type: "single",
      question: "Remote employees need SSO to an internal on-premises web app. The app should not be published directly to the internet, and users should not need network-level VPN access. Which solution should you recommend?",
      options: ["Entra Application Proxy", "Microsoft Entra Domain Services", "Azure Bastion", "Azure AD B2C"],
      correct: [0],
      explanation: "Entra Application Proxy uses on-premises connectors to publish internal web apps through Entra ID with SSO and MFA support, without requiring a VPN or direct internet exposure. Entra Domain Services provides domain protocols but does not publish the web app to remote users.",
      tip: "On-prem web app + SSO + no VPN = Application Proxy, even if other identity services are present."
    },
    {
      id: "idg-q26", type: "single",
      question: "A payment platform requires FIPS 140-2 Level 3 isolation for customer-managed encryption keys and expects high-volume cryptographic operations. Which key management option is most appropriate?",
      options: ["Key Vault Standard", "Key Vault Premium HSM-backed keys", "Azure Key Vault Managed HSM", "Storage account access keys"],
      correct: [2],
      explanation: "Managed HSM provides a dedicated HSM service for the strongest isolation and FIPS 140-2 Level 3 requirements. Key Vault Premium offers HSM-backed keys but is not the same dedicated HSM control plane; Standard uses software-protected keys.",
      tip: "Highest security, dedicated HSM, or FIPS 140-2 Level 3 points to Managed HSM."
    },
    {
      id: "idg-q27", type: "single",
      question: "An application uses a TLS certificate stored in Key Vault. Security requires certificate renewal without redeploying application code and notifications before expiration. What should the design include?",
      options: ["Store the certificate in Key Vault with lifecycle/expiration management and integrate the app with Key Vault", "Embed the certificate in the container image", "Email the certificate password to operators", "Use Azure Policy instead of Key Vault"],
      correct: [0],
      explanation: "Key Vault supports certificate lifecycle management and integrates with applications so certificates can be renewed or updated without code redeployment. Expiration notifications and references avoid embedding secrets in deployable artifacts.",
      tip: "Certificate or secret rotation should centralize in Key Vault and remove secrets from code or images."
    },
    {
      id: "idg-q28", type: "multi",
      question: "An enterprise landing zone needs clean governance for production and non-production workloads across multiple business units. Which recommendations are sound? (Select all that apply.)",
      options: [
        "Use management groups to apply inherited policy and RBAC across subscriptions",
        "Use separate subscriptions when isolation, quotas, billing, or environment boundaries require it",
        "Use tags such as owner, cost center, environment, and data classification for reporting",
        "Place all resources from every app in one resource group to simplify RBAC"
      ],
      correct: [0, 1, 2],
      explanation: "Management groups provide inherited governance, subscriptions are common boundaries for isolation and billing, and tags support cost allocation and ownership. A single resource group for all apps breaks lifecycle isolation and usually increases operational risk.",
      tip: "Management group = governance inheritance; subscription = isolation/billing boundary; resource group = lifecycle boundary; tag = metadata/reporting."
    },
    {
      id: "idg-q29", type: "single",
      question: "A regulated company wants to track compliance against CIS and PCI controls, see secure score, and receive prioritized remediation recommendations for Azure workloads. Which service should lead?",
      options: ["Microsoft Defender for Cloud", "Azure AD B2C", "Azure Cost Management only", "Entra Application Proxy"],
      correct: [0],
      explanation: "Defender for Cloud provides secure score, regulatory compliance dashboards, recommendations, and workload protection plans. Azure Policy initiatives enforce many controls, but Defender for Cloud is the posture and compliance visibility service described.",
      tip: "Secure score or regulatory compliance dashboard = Defender for Cloud; enforce a specific deployment rule = Azure Policy."
    },
    {
      id: "idg-q30", type: "single",
      question: "A company must certify every quarter that guest users and privileged role holders still need access. Reviewers should be resource owners, and no-response decisions should be automated. What should you configure?",
      options: ["Access reviews", "Pass-through authentication", "Key Vault purge protection", "Network security groups"],
      correct: [0],
      explanation: "Access reviews periodically certify whether users, guests, or role holders still need access. They can assign reviewers such as resource owners and automate what happens when reviewers do not respond.",
      tip: "Quarterly certification of access = access reviews, often paired with PIM or entitlement management."
    },
    {
      id: "idg-q31", type: "multi",
      question: "A privileged administration model must minimize standing access to Azure resources. Which controls should be included? (Select all that apply.)",
      options: [
        "PIM eligible assignments with time-bound activation",
        "MFA and approval on role activation",
        "Access reviews for privileged roles",
        "Permanent Owner assignments for all administrators"
      ],
      correct: [0, 1, 2],
      explanation: "PIM eligible assignments, MFA/approval on activation, and access reviews reduce standing privilege and improve governance. Permanent Owner assignments create standing high privilege and contradict the requirement.",
      tip: "Minimize standing admin access = PIM eligible, activation controls, and reviews."
    },
    {
      id: "idg-q32", type: "single",
      question: "A government agency requires users on managed workstations to authenticate to Entra ID using issued smart-card certificates rather than passwords. Which method best matches the requirement?",
      options: ["Microsoft Entra certificate-based authentication", "Azure AD B2C social login", "Storage SAS tokens", "Managed identity"],
      correct: [0],
      explanation: "Microsoft Entra certificate-based authentication lets users authenticate with X.509 certificates, including smart-card style scenarios. Managed identities are for Azure resources, SAS tokens are for Storage access, and B2C social login is for customer identity.",
      tip: "User sign-in with X.509 or smart cards = certificate-based authentication, not managed identity."
    }
  ]
});
