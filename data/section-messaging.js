AZ305.registerSection({
  id: "messaging",
  title: "Messaging",
  domain: "Data Storage Solutions",
  weight: "20–25%",
  icon: "📨",
  order: 5,
  summary: "Messaging questions are service-selection questions: choose **Service Bus** for enterprise messages, **Queue Storage** for simple cheap queues, **Event Grid** for reactive push events, and **Event Hubs** for high-volume telemetry streams. Focus on events vs messages, ordering, dead-lettering, pub/sub, replay, and throughput.",

  notes: [
    {
      heading: "Messaging Service Selection Framework",
      intro: "Start by deciding whether the workload is command/message handling, simple queue decoupling, reactive event routing, or high-volume stream ingestion.",
      table: {
        headers: ["Requirement", "Best service", "Why"],
        rows: [
          ["High-volume telemetry, logs, clickstreams, replay", "Event Hubs", "Partitioned event log with consumer groups and massive throughput"],
          ["Enterprise commands, workflows, guaranteed delivery", "Service Bus", "Locks, sessions, duplicate detection, transactions, and dead-lettering"],
          ["Simple async queue with low cost and huge backlog", "Azure Queue Storage", "Storage-backed HTTP queue with up to 500 TB total queue size"],
          ["React to Azure resource events or route events to handlers", "Event Grid", "Push-based event routing with filters and serverless integrations"],
          ["Notify multiple systems about each business event", "Service Bus Topic", "Publish-subscribe fan-out with subscriptions" ]
        ]
      },
      points: [
        "**Messages** usually represent commands or work items that one consumer must process and complete.",
        "**Events** usually describe something that happened; multiple subscribers may react independently.",
        "**Streams** are ordered event logs optimized for many events per second and replay by offset."
      ],
      tip: "Commands and workflows = Service Bus. Telemetry and replay = Event Hubs. Azure resource notification = Event Grid. Basic cheap queue = Queue Storage."
    },
    {
      heading: "Event Hubs for Streaming and Telemetry",
      table: {
        headers: ["Concept", "Description", "Exam clue"],
        rows: [
          ["Event Hub", "A stream inside a namespace", "Telemetry ingestion endpoint"],
          ["Partition", "Ordered lane in the stream", "Use partition key to keep related events ordered"],
          ["Consumer Group", "Independent view of the event stream", "Multiple teams/apps replay the same data independently"],
          ["Offset", "Consumer's position in a partition", "Replay or resume from a known point"],
          ["Retention", "Time-based event availability", "Standard up to 7 days; Premium/Dedicated up to 90 days"],
          ["Capture", "Automatic Avro archive to Blob or ADLS Gen2", "Need real-time processing plus durable long-term storage" ]
        ]
      },
      points: [
        "Event Hubs is a big data streaming platform and Kafka-compatible ingestion service, not a traditional destructive queue.",
        "Ordering is guaranteed only within a partition. Across partitions there is no global ordering.",
        "Standard uses Throughput Units with auto-inflate; Premium uses Processing Units for more predictable isolated performance; Dedicated is single-tenant at the highest scale."
      ],
      tip: "Millions of events/sec, telemetry, Kafka compatibility, replay, offsets, or consumer groups all point to Event Hubs."
    },
    {
      heading: "Service Bus Queues, Topics, and Enterprise Features",
      table: {
        headers: ["Feature", "What it does", "Choose when"],
        rows: [
          ["Queue", "Point-to-point destructive dequeue with competing consumers", "One consumer should process each work item"],
          ["Topic + Subscriptions", "Publish-subscribe fan-out; each subscription gets a copy", "Multiple systems must react to the same event"],
          ["Dead-letter queue", "Stores messages that cannot be processed", "You need inspection and recovery for poison messages"],
          ["Sessions", "Groups related messages and preserves FIFO per session", "Order processing per customer/order ID"],
          ["Duplicate detection", "Discards re-sent messages in a configured window", "Producer retries could create duplicates"],
          ["Transactions", "Atomic operations across multiple messages", "Workflow steps must commit together" ]
        ]
      },
      points: [
        "Service Bus uses message locks: a consumer locks a message, processes it, and completes it; if the lock expires, another consumer can receive it.",
        "Use **Premium** for 100 MB messages, dedicated compute, VNet integration, Private Endpoint, and zone redundancy.",
        "Basic supports queues only; Standard adds topics; Premium adds isolation and advanced networking."
      ],
      tip: "FIFO per business key requires Service Bus sessions. DLQ, duplicate detection, transactions, and Private Endpoint are Service Bus clues, often Premium for networking or large messages."
    },
    {
      heading: "Service Bus vs Event Hubs",
      table: {
        headers: ["Feature", "Service Bus", "Event Hubs"],
        rows: [
          ["Pattern", "Enterprise messaging", "Event streaming"],
          ["Message model", "Destructive dequeue: lock, process, complete", "Non-destructive log with offset tracking"],
          ["Ordering", "Per-session FIFO", "Per-partition ordering"],
          ["Dead-lettering", "Yes", "No"],
          ["Max message size", "256 KB Standard; 100 MB Premium", "1 MB Standard; 1 MB–20 MB Premium"],
          ["Retention", "Until consumed, up to 14 days", "Time-based, up to 90 days"],
          ["Throughput", "Thousands/sec", "Millions/sec"],
          ["Use for", "Orders, commands, workflows", "Telemetry, logs, event streams" ]
        ]
      },
      points: [
        "Service Bus is about reliable handling of individual messages with acknowledgments and business workflow semantics.",
        "Event Hubs is about ingesting and replaying a high-volume event log by partition and offset.",
        "Do not choose Event Hubs just because it scales if the scenario requires DLQ, duplicate detection, sessions, or transactions."
      ],
      tip: "Ask whether consumers complete messages or read an event log. Complete/acknowledge = Service Bus; offset/replay = Event Hubs."
    },
    {
      heading: "Queue Storage vs Service Bus Queues",
      table: {
        headers: ["Feature", "Queue Storage", "Service Bus Queue"],
        rows: [
          ["Max message size", "64 KB", "256 KB Standard; 100 MB Premium"],
          ["Max queue size", "Up to 500 TB", "1–80 GB depending on SKU"],
          ["Ordering", "Best-effort, FIFO not guaranteed", "FIFO with sessions"],
          ["Dead-lettering", "No", "Yes"],
          ["Duplicate detection", "No", "Yes"],
          ["Transactions", "No", "Yes"],
          ["Cost", "Very low", "Higher"],
          ["Choose when", "Simple decoupling, massive backlog, audit logs", "Reliable enterprise delivery and ordering" ]
        ]
      },
      points: [
        "Queue Storage is an HTTP-based queue built into a Storage Account with visibility timeout and message TTL up to 7 days.",
        "It is excellent for simple, cheap asynchronous work where advanced broker semantics are unnecessary.",
        "If the scenario mentions poison-message handling, ordering, duplicate detection, or transactions, Queue Storage is usually the distractor."
      ],
      tip: "Cheap and simple with tiny messages = Queue Storage. Enterprise reliability features = Service Bus Queue."
    },
    {
      heading: "Event Grid for Reactive Event Routing",
      table: {
        headers: ["Capability", "Event Grid behavior", "Exam clue"],
        rows: [
          ["Pattern", "Push-based reactive events", "Subscribers are invoked when something happens"],
          ["Sources", "Blob Storage, Resource Groups, Subscriptions, ACR, custom topics", "Azure resource event or custom app event"],
          ["Handlers", "Webhooks, Functions, Service Bus, Event Hubs, Queue Storage", "Serverless trigger or event fan-out"],
          ["Filtering", "Route by event type, subject, or advanced filters", "Different handlers by event type"],
          ["Retry/retention", "Retries for up to 24 hours", "Short-lived notification, not long queue backlog"],
          ["Ordering", "No guaranteed ordering", "Do not choose for ordered workflows" ]
        ]
      },
      points: [
        "Event Grid is ideal for reacting to Blob created/deleted, image pushed to ACR, resource created/deleted, subscription events, and custom app events.",
        "It is not a durable work queue and not a telemetry stream store.",
        "Event Grid can route to Service Bus or Event Hubs when downstream systems need queueing or streaming after the initial event notification."
      ],
      tip: "If Azure should push a notification to a Function or webhook when a resource changes, choose Event Grid. If work must wait durably for a worker, choose a queue."
    },
    {
      heading: "Event Grid vs Event Hubs vs Service Bus",
      table: {
        headers: ["Feature", "Event Grid", "Event Hubs", "Service Bus"],
        rows: [
          ["Pattern", "Push event routing", "Pull stream processing", "Pull queue/topic messaging"],
          ["Volume", "Millions of events/sec", "Millions of events/sec", "Thousands of messages/sec"],
          ["Message size", "1 MB", "1 MB+", "256 KB–100 MB"],
          ["Retention", "24-hour retry", "Days–90 days", "Until consumed, up to 14 days"],
          ["Ordering", "No guarantee", "Per partition", "Per session"],
          ["Best for", "Reactive Azure/app events", "Telemetry and logs", "Reliable commands and workflow steps" ]
        ]
      },
      points: [
        "Event Grid and Event Hubs both handle high event volume, but Event Grid pushes discrete notifications while Event Hubs stores a pull-based replayable stream.",
        "Service Bus topics provide pub/sub with brokered delivery, filters, subscriptions, DLQ, and per-message completion.",
        "Event Grid's 24-hour retry window is not the same as a queue that retains messages until consumed."
      ],
      tip: "Push notification = Event Grid. Replayable stream = Event Hubs. Durable command with completion = Service Bus."
    },
    {
      heading: "Limits, SKUs, and Exam Traps",
      table: {
        headers: ["Requirement or limit", "Correct choice"],
        rows: [
          ["Service Bus Private Endpoint or VNet integration", "Service Bus Premium"],
          ["Service Bus message up to 100 MB", "Service Bus Premium"],
          ["Queue Storage message size", "64 KB maximum"],
          ["Queue Storage message TTL", "Up to 7 days"],
          ["Event Hubs Standard retention", "Up to 7 days"],
          ["Event Hubs Premium/Dedicated retention", "Up to 90 days"],
          ["Event Grid retry period", "24 hours"],
          ["Event Hubs Standard max partitions", "32" ]
        ]
      },
      points: [
        "Do not choose Service Bus for massive telemetry ingestion just because it has reliability features; Event Hubs is built for streaming throughput.",
        "Do not choose Queue Storage when FIFO, DLQ, transactions, or duplicate detection are mandatory.",
        "Do not choose Event Grid for queued work processing; it is a reactive router, not a durable broker."
      ],
      tip: "Hard limits often eliminate answers: 64 KB Queue Storage, 100 MB Service Bus Premium, 24-hour Event Grid retry, and Event Hubs retention by SKU."
    },
    {
      heading: "Exam skills mapping",
      points: [
        "Recommend a messaging architecture: Service Bus queues/topics/subscriptions vs Storage Queues; sessions, ordering/FIFO, dead-letter, duplicate detection, and transactions.",
        "Recommend an event-driven architecture: Event Grid vs Event Hubs; events vs messages; telemetry ingestion, partitions, consumer groups, capture, Event Grid topics/subscriptions, and reactive delivery.",
        "Recommend a solution for API integration: where messaging meets APIM and Logic Apps for integration patterns."
      ],
      tip: "For API integration, APIM governs and publishes APIs, Logic Apps orchestrates connector-heavy workflows, and messaging services decouple asynchronous work behind those APIs."
    }
  ],

  flashcards: [
    { front: "Service Bus vs Event Hubs — one-line rule", back: "Service Bus = enterprise commands/workflows with locks, sessions, DLQ, and completion. Event Hubs = high-volume telemetry/log streams with partitions, offsets, replay, and consumer groups." },
    { front: "Queue vs Topic in Service Bus", back: "Queue = point-to-point; one consumer processes each message. Topic + subscriptions = pub/sub fan-out; each subscription receives a copy." },
    { front: "When do you need Service Bus sessions?", back: "When related messages must be processed in FIFO order per business key, such as per customer, order ID, or workflow instance." },
    { front: "What is a dead-letter queue?", back: "A holding area for messages that cannot be delivered or processed, enabling inspection, repair, replay, or manual handling of poison messages." },
    { front: "When is Service Bus Premium required?", back: "For 100 MB messages, dedicated isolated compute, VNet integration, Private Endpoint, and zone redundancy." },
    { front: "Queue Storage vs Service Bus Queue", back: "Queue Storage = cheap/simple, 64 KB messages, huge backlog, no DLQ/FIFO/transactions. Service Bus Queue = enterprise reliability, sessions, DLQ, duplicate detection, transactions." },
    { front: "Event Grid vs Event Hubs", back: "Event Grid pushes discrete notifications to handlers and retries for 24 hours. Event Hubs is a pull-based, replayable partitioned stream for telemetry and logs." },
    { front: "What is an Event Hubs consumer group?", back: "An independent view of the event stream. Multiple applications can read and replay the same stream independently using their own offsets." },
    { front: "How does Event Hubs ordering work?", back: "Events are ordered within a partition only. Use a partition key to route related events to the same partition when subset ordering matters." },
    { front: "What does Event Hubs Capture do?", back: "Automatically archives the stream to Blob Storage or ADLS Gen2 in Avro format for long-term storage, replay, and batch analytics." },
    { front: "What does Event Hubs Kafka compatibility enable?", back: "Kafka applications can use the Event Hubs Kafka endpoint, often enabling migration to Azure with minimal code changes." },
    { front: "When is Event Grid the best answer?", back: "Reacting to Azure resource or custom app events, such as blob created, image pushed, resource changed, or routing events to Functions/webhooks by filters." },
    { front: "What is a Service Bus message lock?", back: "A consumer locks a message while processing it. If completed, it is removed; if the lock expires or processing fails, another consumer can receive it." },
    { front: "What does duplicate detection solve in Service Bus?", back: "It discards re-sent messages within a detection window, protecting workflows from producer retry duplicates." },
    { front: "Queue Storage visibility timeout", back: "After a consumer receives a message, it becomes invisible temporarily. If not deleted before the timeout expires, it becomes visible for another consumer." },
    { front: "Which service has 24-hour retry retention?", back: "Event Grid. It retries event delivery for up to 24 hours, which is not the same as durable queue retention until consumed." },
    { front: "Telemetry dashboard plus long-term archive — which services?", back: "Event Hubs for ingestion, Stream Analytics or consumers for real-time processing, and Event Hubs Capture to ADLS Gen2 or Blob for archive." },
    { front: "Pub/sub with enterprise delivery and per-subscriber filtering", back: "Use a Service Bus Topic with subscriptions and filters, not Queue Storage and not a single Service Bus Queue." },
    { front: "APIM vs Logic Apps in integration designs", back: "APIM publishes, secures, throttles, and versions APIs. Logic Apps orchestrates workflows across connectors, APIs, and messaging services with low-code integration." },
    { front: "Where does Service Bus fit behind an API?", back: "Use Service Bus behind an API for asynchronous commands: accept the request quickly, enqueue work durably, then let back-end workers process with retries and DLQ." },
    { front: "Event Grid topic vs subscription", back: "A topic is where events are published. A subscription defines which events are delivered to which handler and can include filters." },
    { front: "Event Hubs partition key exam rule", back: "Use a partition key when related telemetry must stay in the same partition for ordered processing. Do not expect global ordering across all partitions." },
    { front: "Service Bus auto-forward", back: "Auto-forward can chain queues or topic subscriptions to another Service Bus entity for routing patterns without custom relay code." },
    { front: "API request needs immediate response but slow processing", back: "Front the API with APIM if needed, enqueue the work in Service Bus, return an accepted response, and process asynchronously with workers or Logic Apps." },
    { front: "Logic Apps messaging integration clue", back: "Choose Logic Apps when the scenario emphasizes SaaS connectors, B2B/system integration, approvals, scheduled workflows, and sending or receiving messages through connectors." }
  ],

  questions: [
    {
      id: "msg-q1", type: "single",
      question: "An IoT platform must ingest one million sensor readings per second and allow multiple analytics teams to replay the same stream independently. Which service should you choose?",
      options: ["Azure Service Bus Queue", "Azure Event Hubs", "Azure Queue Storage", "Azure Event Grid"],
      correct: [1],
      explanation: "Event Hubs is designed for massive telemetry ingestion and uses consumer groups so multiple applications can read the same stream independently by offset. Service Bus and Queue Storage are message queues, and Event Grid is push-based event routing rather than a replayable stream log.",
      tip: "Millions of telemetry events plus replay or consumer groups = Event Hubs."
    },
    {
      id: "msg-q2", type: "single",
      question: "An order-processing workflow requires guaranteed delivery, dead-lettering, duplicate detection, and ordered processing per OrderId. Which service is the best fit?",
      options: ["Event Hubs with partitions", "Service Bus Queue with sessions", "Queue Storage", "Event Grid custom topic"],
      correct: [1],
      explanation: "Service Bus provides enterprise messaging features including DLQ, duplicate detection, message locks, and sessions for FIFO ordering per OrderId. Event Hubs partitions order stream events but do not provide DLQ or command completion semantics; Queue Storage and Event Grid lack the required broker features.",
      tip: "DLQ + duplicate detection + FIFO per business key = Service Bus sessions."
    },
    {
      id: "msg-q3", type: "single",
      question: "A web app needs a very low-cost queue for background image resizing. Messages are under 64 KB and no strict ordering, duplicate detection, or dead-lettering is required. What should you use?",
      options: ["Azure Queue Storage", "Service Bus Premium Topic", "Event Hubs Premium", "Event Grid Domain"],
      correct: [0],
      explanation: "Queue Storage is ideal for simple, low-cost asynchronous decoupling with small messages and no advanced broker semantics. Service Bus Premium is overkill, Event Hubs is for streaming, and Event Grid is for push event routing.",
      tip: "Simple + cheap + under 64 KB + no advanced semantics = Queue Storage."
    },
    {
      id: "msg-q4", type: "single",
      question: "A function must run whenever a blob is uploaded to a storage account. You want Azure to push the notification to the function. Which service is most appropriate?",
      options: ["Azure Event Grid", "Azure Service Bus Queue", "Azure Event Hubs", "Azure Queue Storage visibility timeout"],
      correct: [0],
      explanation: "Event Grid is the reactive push-based event routing service for Azure resource events such as Blob created. Service Bus and Queue Storage are pull-based queues, and Event Hubs is a streaming ingestion service.",
      tip: "Blob created event that triggers a Function = Event Grid."
    },
    {
      id: "msg-q5", type: "single",
      question: "A sales application publishes a new-order event. Inventory, billing, shipping, and email systems must each receive their own copy for independent processing. Which Service Bus entity should you use?",
      options: ["A single Service Bus Queue", "A Service Bus Topic with subscriptions", "One Event Hubs partition per system", "A Queue Storage poison queue"],
      correct: [1],
      explanation: "A Service Bus Topic with subscriptions implements pub/sub fan-out so each subscriber receives a copy of the message. A single queue uses competing consumers where only one consumer processes each message, and Event Hubs partitions are not a replacement for enterprise pub/sub workflow delivery.",
      tip: "Multiple systems each need a copy = topic and subscriptions, not a queue."
    },
    {
      id: "msg-q6", type: "multi",
      question: "Which capabilities are provided by Service Bus but not by Azure Queue Storage? (Select all that apply.)",
      options: ["Dead-letter queues", "Duplicate detection", "Transactions", "Basic storage-account queueing with 500 TB total capacity"],
      correct: [0, 1, 2],
      explanation: "Service Bus provides DLQ, duplicate detection, and transactions for enterprise messaging. Queue Storage provides simple storage-backed queueing and very large total capacity, but not those advanced broker features.",
      tip: "For multi-select, separate broker semantics from cheap storage-backed queue capacity."
    },
    {
      id: "msg-q7", type: "multi",
      question: "Which statements about Event Hubs ordering and replay are TRUE? (Select all that apply.)",
      options: ["Events are ordered within a single partition", "Events are globally ordered across all partitions", "Consumers track their own offsets", "Consumer groups provide independent views of the stream"],
      correct: [0, 2, 3],
      explanation: "Event Hubs preserves order only within a partition. Consumers track offsets, and consumer groups provide independent views so multiple applications can read the stream separately. There is no global ordering across partitions.",
      tip: "Ordering in Event Hubs is partition-scoped. Any 'global ordering across partitions' option is usually false."
    },
    {
      id: "msg-q8", type: "single",
      question: "A Kafka-based application needs to move to Azure with minimal code changes while preserving a streaming ingestion pattern. Which service should be evaluated first?",
      options: ["Event Hubs with Kafka endpoint", "Service Bus Basic", "Queue Storage", "Event Grid system topic"],
      correct: [0],
      explanation: "Event Hubs provides Kafka protocol compatibility in Standard, Premium, and Dedicated tiers, making it the natural Azure target for Kafka streaming apps. The other services do not provide a Kafka-compatible event streaming endpoint.",
      tip: "Kafka compatibility is an Event Hubs clue."
    },
    {
      id: "msg-q9", type: "single",
      question: "A workload needs Service Bus messaging over Private Endpoint and messages up to 100 MB. Which SKU is required?",
      options: ["Service Bus Basic", "Service Bus Standard", "Service Bus Premium", "Queue Storage"],
      correct: [2],
      explanation: "Service Bus Premium provides 100 MB message support, dedicated compute, VNet integration, and Private Endpoint. Basic and Standard are shared tiers with 256 KB max messages, and Queue Storage has a 64 KB limit.",
      tip: "Private Endpoint or 100 MB messages in Service Bus = Premium."
    },
    {
      id: "msg-q10", type: "single",
      question: "A telemetry stream must be processed in real time and also archived automatically to ADLS Gen2 for long-term batch analytics. What Event Hubs feature should you enable?",
      options: ["Event Hubs Capture", "Service Bus duplicate detection", "Queue Storage visibility timeout", "Event Grid advanced filters"],
      correct: [0],
      explanation: "Event Hubs Capture automatically writes event streams to Blob Storage or ADLS Gen2, commonly in Avro format, while the stream remains available for real-time consumers. The other options do not archive an Event Hubs stream.",
      tip: "Event Hubs plus durable archive to Blob/ADLS = Capture."
    },
    {
      id: "msg-q11", type: "single",
      question: "A developer needs to route custom application events to different webhook handlers based on event type, with push delivery and filtering. Which service should be used?",
      options: ["Event Grid custom topic", "Service Bus Queue", "Event Hubs consumer group", "Queue Storage"],
      correct: [0],
      explanation: "Event Grid custom topics support push delivery of custom events to subscribers and can filter by event type, subject, or advanced filters. Queues and Event Hubs use pull patterns and are not primarily push-based event routers.",
      tip: "Push delivery plus event filters to handlers = Event Grid."
    },
    {
      id: "msg-q12", type: "single",
      question: "A worker receives a queue message, starts processing, and then crashes before deleting it. After a timeout, another worker should be able to process it. Which Queue Storage concept enables this?",
      options: ["Visibility timeout", "Consumer group offset", "Service Bus session state", "Event Grid retry period"],
      correct: [0],
      explanation: "Queue Storage uses a visibility timeout: after a message is received, it becomes invisible temporarily. If the worker does not delete it before the timeout expires, the message becomes visible for another worker.",
      tip: "Queue Storage retry after worker crash = visibility timeout."
    },
    {
      id: "msg-q13", type: "multi",
      question: "Which scenarios are best matched to Event Grid? (Select all that apply.)",
      options: ["Trigger a Function when a blob is created", "Route custom app events to different handlers by event type", "Store a replayable telemetry log for 90 days", "React when an Azure resource is created or deleted"],
      correct: [0, 1, 3],
      explanation: "Event Grid is ideal for reactive push notifications from Azure services or custom topics and supports routing/filtering to handlers. A replayable telemetry log with long retention is an Event Hubs scenario, not Event Grid.",
      tip: "Event Grid reacts; Event Hubs replays."
    },
    {
      id: "msg-q14", type: "single",
      question: "A financial workflow sends the same command twice because the producer retries after a timeout. The broker should discard duplicate messages within a configured window. Which feature is needed?",
      options: ["Service Bus duplicate detection", "Event Hubs Capture", "Queue Storage TTL", "Event Grid retry"],
      correct: [0],
      explanation: "Service Bus duplicate detection identifies messages with the same message ID within a configured detection window and discards duplicates. Capture archives Event Hubs data, Queue Storage TTL controls expiration, and Event Grid retry handles event delivery attempts.",
      tip: "Producer retries causing duplicate commands = Service Bus duplicate detection."
    },
    {
      id: "msg-q15", type: "single",
      question: "An architecture requires each message to be processed by exactly one worker from a pool of competing consumers. Which entity fits this pattern?",
      options: ["Service Bus Queue", "Service Bus Topic with five subscriptions", "Event Grid Topic", "Event Hubs consumer group for each worker"],
      correct: [0],
      explanation: "A queue implements point-to-point competing consumers where each message is processed by one consumer. A Service Bus topic fans out to subscriptions, Event Grid pushes events to handlers, and separate Event Hubs consumer groups would each receive the stream independently rather than competing for messages.",
      tip: "One of many workers handles each message = queue. Every subscriber gets a copy = topic/subscriptions."
    },
    {
      id: "msg-q16", type: "single",
      question: "A team needs multiple independent applications to read all telemetry events at their own pace without removing events for the others. Which Event Hubs concept supports this?",
      options: ["Consumer groups", "Dead-letter queues", "Service Bus sessions", "Queue Storage pop receipts"],
      correct: [0],
      explanation: "Consumer groups give each application an independent view of the Event Hubs stream and allow each to track its own offsets. Queue and Service Bus consumers remove or complete messages rather than reading a shared log independently.",
      tip: "Independent readers of the same stream = Event Hubs consumer groups."
    },
    {
      id: "msg-q17", type: "multi",
      question: "Which requirements should make you choose Service Bus instead of Event Hubs? (Select all that apply.)",
      options: ["Dead-letter handling for poison messages", "FIFO processing per customer using sessions", "Transactions across message operations", "Millions of telemetry events per second with replay by offset"],
      correct: [0, 1, 2],
      explanation: "Service Bus provides DLQ, sessions for FIFO per business key, and transactions for enterprise workflows. Millions of telemetry events per second with offset replay is the core Event Hubs pattern.",
      tip: "DLQ/sessions/transactions are Service Bus clues; offset replay at massive telemetry scale is Event Hubs."
    },
    {
      id: "msg-q18", type: "single",
      question: "A solution needs a queue that can hold an extremely large backlog at low cost, but messages are tiny and advanced messaging features are unnecessary. Which limit supports choosing Queue Storage?",
      options: ["Up to 500 TB total queue size", "100 MB per message", "Per-session FIFO", "24-hour Event Grid retry"],
      correct: [0],
      explanation: "Queue Storage supports a very large storage-backed queue capacity, up to 500 TB, making it attractive for cheap massive backlog scenarios. It does not support 100 MB messages or per-session FIFO, and Event Grid retry is unrelated.",
      tip: "Massive cheap backlog is one of the few times Queue Storage beats Service Bus."
    },
    {
      id: "msg-q19", type: "single",
      question: "An architect proposes Event Grid for long-running queued work where messages must wait until a worker is available and failures must be inspected later. What is the better service?",
      options: ["Service Bus Queue", "Event Grid system topic", "Traffic Manager", "Event Hubs Capture only"],
      correct: [0],
      explanation: "Service Bus Queue is designed for durable queued work, locks, completion, retries, and dead-letter inspection. Event Grid is a reactive event router with a 24-hour retry period, not a durable work queue for long-running processing.",
      tip: "If work must wait for a worker and failures need DLQ inspection, choose Service Bus, not Event Grid."
    },
    {
      id: "msg-q20", type: "multi",
      question: "Which service-to-pattern mappings are correct? (Select all that apply.)",
      options: ["Event Hubs: partitioned telemetry stream with offset replay", "Event Grid: push-based routing for discrete events", "Service Bus Topic: enterprise pub/sub with subscriptions", "Queue Storage: ordered FIFO workflows with duplicate detection"],
      correct: [0, 1, 2],
      explanation: "Event Hubs is the partitioned replayable stream, Event Grid is push event routing, and Service Bus Topics provide enterprise pub/sub. Queue Storage does not guarantee FIFO workflows and does not provide duplicate detection.",
      tip: "The Queue Storage option usually becomes wrong when it claims enterprise semantics like FIFO or duplicate detection."
    },
    {
      id: "msg-q21", type: "single",
      question: "A purchase workflow must publish an order-created notification to tax, fulfillment, and loyalty systems. Each system needs independent retries and poison-message handling. Which architecture fits best?",
      options: ["One Service Bus Queue with three competing consumers", "Service Bus Topic with one subscription per system", "One Event Hubs partition per system", "Queue Storage with three workers"],
      correct: [1],
      explanation: "A Service Bus Topic with separate subscriptions gives each system its own copy, retry behavior, and DLQ. A single queue would allow only one competing consumer to receive each message; Event Hubs is stream ingestion, and Queue Storage lacks DLQ and subscription fan-out.",
      tip: "Independent enterprise subscribers each needing a copy = Service Bus Topic with subscriptions."
    },
    {
      id: "msg-q22", type: "single",
      question: "A banking workflow must atomically receive one message, send two follow-up messages, and complete the original only if all operations succeed. Which messaging capability is required?",
      options: ["Service Bus transactions", "Event Grid retry", "Queue Storage visibility timeout", "Event Hubs consumer offsets"],
      correct: [0],
      explanation: "Service Bus transactions allow atomic operations across multiple messages and entities within supported scopes, which fits a workflow that must commit message operations together. Event Grid, Queue Storage, and Event Hubs do not provide this enterprise broker transaction pattern.",
      tip: "Atomic broker operations across messages = Service Bus transactions."
    },
    {
      id: "msg-q23", type: "multi",
      question: "Which requirements point to Service Bus sessions rather than Event Hubs partitions or Queue Storage? (Select all that apply.)",
      options: ["FIFO processing per customer ID for commands", "A worker should lock and complete each message", "Telemetry should be replayed by offset for several days", "Related workflow messages should be handled by one session-aware consumer"],
      correct: [0, 1, 3],
      explanation: "Service Bus sessions group related messages and support FIFO command processing with lock/complete broker semantics. Event Hubs offset replay is a stream processing feature, not a Service Bus session requirement.",
      tip: "Sessions are for ordered business messages; partitions are for ordered lanes in telemetry streams."
    },
    {
      id: "msg-q24", type: "single",
      question: "A storage account should notify several serverless handlers when blobs are created, with handlers selected by event type and subject filters. Which event-driven service should you use?",
      options: ["Event Grid system topic and event subscriptions", "Event Hubs Capture", "Service Bus Basic Queue", "Queue Storage"],
      correct: [0],
      explanation: "Event Grid integrates with Azure Storage events through system topics and event subscriptions, supports filtering, and pushes events to serverless handlers. Event Hubs Capture archives streams; queues are pull-based message stores and do not provide native Azure resource event routing.",
      tip: "Azure resource event + push + filters = Event Grid topic/subscriptions."
    },
    {
      id: "msg-q25", type: "multi",
      question: "A global telemetry platform uses Event Hubs. Which design choices support scalable independent stream processing? (Select all that apply.)",
      options: ["Use partitions to scale ingestion and consumers", "Use consumer groups for independent applications", "Enable Capture to archive to ADLS Gen2", "Use a dead-letter queue for failed Event Hubs events"],
      correct: [0, 1, 2],
      explanation: "Event Hubs scales with partitions, lets independent applications read through consumer groups, and can archive streams to ADLS Gen2 with Capture. Event Hubs does not provide a Service Bus-style dead-letter queue for failed events.",
      tip: "Event Hubs scale words are partitions, consumer groups, offsets, and Capture — not DLQ."
    },
    {
      id: "msg-q26", type: "single",
      question: "An application emits discrete business events that should push to webhooks within minutes, but events do not need to be stored for replay after days. Which service is the simplest fit?",
      options: ["Azure Event Grid", "Azure Event Hubs Premium", "Service Bus Premium Queue", "Synapse Serverless SQL Pool"],
      correct: [0],
      explanation: "Event Grid is built for push-based routing of discrete events to webhooks or Azure handlers with retry for up to 24 hours. Event Hubs is for replayable streams, Service Bus is for durable commands/work items, and Synapse is analytics.",
      tip: "Discrete push notification without long replay = Event Grid."
    },
    {
      id: "msg-q27", type: "single",
      question: "A public order API must be secured, rate-limited, versioned, and then place accepted requests onto a durable queue for asynchronous processing. Which combination best matches the integration pattern?",
      options: ["API Management in front of the API plus Service Bus Queue behind it", "Event Hubs alone", "Queue Storage alone", "Event Grid alone"],
      correct: [0],
      explanation: "API Management handles API gateway concerns such as security, throttling, policies, and versioning. Service Bus Queue provides durable asynchronous command processing behind the API. Event Hubs and Event Grid do not provide API governance, and Queue Storage alone lacks APIM features and enterprise broker semantics.",
      tip: "APIM governs synchronous API access; Service Bus decouples slow or reliable back-end work asynchronously."
    },
    {
      id: "msg-q28", type: "single",
      question: "A company must integrate SaaS applications, call HTTP APIs, transform payloads, wait for approvals, and post messages to Service Bus without writing much code. Which Azure service is the best orchestrator?",
      options: ["Azure Logic Apps", "Event Hubs Dedicated", "Azure Load Balancer", "Synapse Dedicated SQL Pool"],
      correct: [0],
      explanation: "Logic Apps is designed for low-code integration workflows across SaaS connectors, HTTP APIs, approvals, transformations, and messaging connectors such as Service Bus. Event Hubs is telemetry streaming, Load Balancer is networking, and Synapse Dedicated SQL Pool is analytics warehousing.",
      tip: "Connector-heavy API and messaging workflow with approvals = Logic Apps. Use APIM when the main need is API gateway management."
    }
  ]
});
