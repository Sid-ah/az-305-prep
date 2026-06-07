AZ305.registerSection({
  id: "data-integration",
  title: "Data Integration & Analytics",
  domain: "Data Storage Solutions",
  weight: "20–25%",
  icon: "🔄",
  order: 4,
  summary: "Data integration questions test whether you can pick the right service for **orchestration**, **analytics**, **Spark/ML**, or **real-time streams**. Master ADF vs Synapse vs Databricks, ETL vs ELT, integration runtimes, ADLS Gen2 lakehouse patterns, and when batch processing gives way to streaming.",

  notes: [
    {
      heading: "Azure Data Factory Fundamentals",
      intro: "Azure Data Factory (ADF) is the cloud-native ETL and data integration service for building pipelines that move and transform data across Azure, on-premises, SaaS, and file systems.",
      table: {
        headers: ["Concept", "What it means", "Exam clue"],
        rows: [
          ["Pipeline", "Container for activities that perform one unit of work", "Multi-step workflow or orchestration"],
          ["Activity", "A pipeline step such as Copy, transform, or control flow", "Copy data, call notebook, run stored procedure"],
          ["Dataset", "Named reference to data like a table, file, or folder", "Source or sink schema/location"],
          ["Linked Service", "Connection definition for a source or destination", "Connection string or managed identity target"],
          ["Trigger", "Defines when the pipeline runs", "Schedule, file arrival, tumbling window"],
          ["Integration Runtime", "Compute that executes data movement or transformation", "Cloud, on-premises, private network, or SSIS" ]
        ]
      },
      points: [
        "Use **Copy Activity** for reliable movement between 90+ supported stores, with schema mapping, type conversion, column filtering, and parallel copy.",
        "Use **Mapping Data Flows** for no-code visual transformations that run on managed Spark clusters, including joins, aggregations, window functions, and schema drift.",
        "ADF is strongest when the requirement is orchestration, scheduled movement, retries, dependencies, and managed connectors rather than custom ML or interactive analytics."
      ],
      tip: "If the scenario says 'orchestrate', 'copy from many sources', 'schedule daily load', or 'trigger when a file lands', start with ADF."
    },
    {
      heading: "Integration Runtime and Trigger Selection",
      table: {
        headers: ["Choice", "Use when", "Avoid when"],
        rows: [
          ["Azure IR", "Data moves between Azure services or public endpoints", "The source is on-premises or only reachable through a private network"],
          ["Self-Hosted IR", "ADF must reach on-premises SQL Server, file shares, or private VMs", "Everything is public Azure-to-Azure"],
          ["Azure-SSIS IR", "You need to lift-and-shift existing SSIS packages", "You are redesigning pipelines as cloud-native ADF activities"],
          ["Schedule trigger", "Run at fixed times or intervals", "Processing must align to retryable time windows"],
          ["Tumbling window trigger", "Recurring fixed-size windows with dependency and retry behavior", "Simple one-off or manual loads"],
          ["Event-based trigger", "Start a pipeline when a blob is created or deleted", "Continuous event-stream analytics is required" ]
        ]
      },
      points: [
        "**Self-Hosted IR** is the connectivity answer for on-premises and private-network sources because it runs close to the source and initiates outbound connections to Azure.",
        "**Azure-SSIS IR** is not for generic ADF transformations; it exists to run SSIS packages as-is during migration.",
        "An ADF event trigger reacts to file arrival, but it is not a streaming analytics engine."
      ],
      tip: "On-premises source = Self-Hosted IR. Existing SSIS packages = Azure-SSIS IR. File-arrival orchestration = event trigger, not Stream Analytics."
    },
    {
      heading: "ADF vs Synapse vs Databricks",
      table: {
        headers: ["Service", "Best at", "Choose when"],
        rows: [
          ["Azure Data Factory", "Pipeline orchestration, copy, triggers, no-code data flows", "The primary need is moving data and coordinating steps"],
          ["Azure Synapse Analytics", "Integrated data warehousing, SQL analytics, Spark, and pipelines", "The solution centers on an enterprise analytics workspace"],
          ["Azure Databricks", "Advanced Spark engineering, Delta Lake, ML, notebooks", "Data scientists or engineers need collaborative Spark and ML"],
          ["Stream Analytics", "Real-time SQL-like processing over event streams", "The question mentions windows, IoT streams, alerts, or sub-second/minute processing" ]
        ]
      },
      points: [
        "Synapse Pipelines are ADF-compatible and make sense when the whole analytics solution already lives in a Synapse workspace.",
        "Databricks can run production jobs, but choosing it only for basic copy/orchestration is usually overkill.",
        "AZ-305 often expects a chain of services: ADF ingests to ADLS Gen2, Databricks or Synapse transforms, and Synapse or Power BI serves analytics."
      ],
      tip: "Identify the dominant requirement first: orchestration = ADF, data warehouse/SQL analytics = Synapse, Spark/ML/lakehouse engineering = Databricks, real-time windows = Stream Analytics."
    },
    {
      heading: "Synapse Analytics Components",
      intro: "Azure Synapse combines data integration, data warehousing, big data processing, and lake querying in one enterprise analytics workspace.",
      table: {
        headers: ["Component", "Description", "Use case"],
        rows: [
          ["Dedicated SQL Pool", "MPP columnar SQL data warehouse with provisioned DWUs", "TB-scale historical reporting and complex aggregations"],
          ["Serverless SQL Pool", "SQL over ADLS Gen2 files with pay-per-TB-scanned pricing", "Ad-hoc exploration of CSV, Parquet, JSON, or Delta without loading"],
          ["Apache Spark Pools", "Managed Spark clusters inside Synapse", "Big data processing, ML, and Delta Lake transformations"],
          ["Synapse Pipelines", "ADF-compatible pipelines built into Synapse", "Integration tasks inside a Synapse-centered architecture"],
          ["Synapse Link", "Zero-ETL analytical access to Cosmos DB or SQL operational data", "HTAP analytics without affecting the transactional workload" ]
        ]
      },
      points: [
        "Dedicated SQL Pool distributes data across 60 distributions. Use **hash** for large fact tables, **round robin** for staging, and **replicated** for small dimensions.",
        "Serverless SQL Pool is always available and has no provisioned compute, but cost depends on data scanned, so file formats and partition pruning matter.",
        "Synapse Link keeps operational and analytical workloads separate by syncing to a columnar analytical store."
      ],
      tip: "No loading and occasional lake-file SQL = Serverless SQL Pool. Persistent enterprise warehouse with MPP performance = Dedicated SQL Pool."
    },
    {
      heading: "Databricks, Synapse Spark, and Delta Lake",
      table: {
        headers: ["Feature", "Azure Databricks", "Synapse Spark"],
        rows: [
          ["ML/AI", "MLflow integration, AutoML, strong data science workflows", "Basic ML inside Synapse"],
          ["Delta Lake", "Native and highly optimized", "Supported"],
          ["Collaboration", "Best-in-class notebooks for engineers and data scientists", "Good notebooks in the Synapse workspace"],
          ["Synapse integration", "Via linked services and connectors", "Native workspace integration"],
          ["Cost control", "More granular cluster and job tuning", "Simpler workspace-level experience"],
          ["Best for", "Complex ETL, ML, lakehouse engineering", "Spark work that belongs inside Synapse analytics" ]
        ]
      },
      points: [
        "**Delta Lake** adds ACID transactions, schema enforcement/evolution, time travel, and MERGE/upserts on top of Parquet in ADLS Gen2.",
        "Choose Databricks when notebooks, ML, collaborative Spark development, and advanced Delta Lake engineering are central requirements.",
        "Choose Synapse Spark when the workload is mostly analytics inside a Synapse workspace and deep Databricks-specific ML features are not required."
      ],
      tip: "ACID transactions or time travel on lake files points to Delta Lake; the compute could be Databricks or Synapse Spark, but Databricks is the stronger ML/lakehouse clue."
    },
    {
      heading: "Stream Analytics for Real-Time Processing",
      intro: "Azure Stream Analytics processes streaming data from Event Hubs, IoT Hub, or Blob/ADLS inputs using a SQL-like query language and sends results to Power BI, SQL, Cosmos DB, Event Hubs, Blob, or Functions.",
      table: {
        headers: ["Window type", "Description", "Use case"],
        rows: [
          ["Tumbling", "Fixed, non-overlapping intervals", "Count events per minute"],
          ["Hopping", "Fixed-size windows that overlap", "10-minute averages updated every 1 minute"],
          ["Sliding", "Window emits when an event occurs", "Event-triggered aggregations"],
          ["Session", "Groups activity separated by a gap", "User session or device activity analysis"],
          ["Snapshot", "Groups events with identical timestamps", "Point-in-time event views" ]
        ]
      },
      points: [
        "Scale Stream Analytics with **Streaming Units (SU)** when throughput or query complexity grows.",
        "Use it for real-time anomaly detection, dashboards, alerts, stream joins, and windowed aggregates over telemetry.",
        "Do not use ADF as a substitute for continuous stream processing; ADF orchestrates batches and events, while Stream Analytics continuously queries streams."
      ],
      tip: "Words like 'real-time', 'IoT', 'window', 'stream join', 'fraud detection', or 'alert immediately' should eliminate ADF-only answers."
    },
    {
      heading: "ETL, ELT, Batch, and Stream Patterns",
      table: {
        headers: ["Pattern", "How it works", "Azure fit"],
        rows: [
          ["ETL", "Transform before loading into the target", "ADF Mapping Data Flows or Databricks prepares curated data"],
          ["ELT", "Load raw data first, transform inside the analytics store", "ADF loads to ADLS/Synapse; Synapse SQL or Spark transforms"],
          ["Batch", "Processes data on a schedule or bounded files", "ADF pipelines, Synapse SQL, Databricks jobs"],
          ["Streaming", "Processes events continuously as they arrive", "Event Hubs or IoT Hub into Stream Analytics or Spark Structured Streaming"],
          ["Lakehouse", "Raw, processed, and curated zones on ADLS Gen2 with Delta/Parquet", "ADF + ADLS Gen2 + Databricks/Synapse + Power BI" ]
        ]
      },
      points: [
        "A common lakehouse flow is raw ingestion to **ADLS Gen2**, transform into processed/gold zones, then serve through Synapse SQL or Power BI.",
        "Lambda architecture separates a **batch layer** for historical processing, a **speed layer** for real-time streams, and a **serving layer** for queries.",
        "For high-volume telemetry, ingest with Event Hubs, process with Stream Analytics or Spark, and archive to ADLS Gen2 for replay and historical analytics."
      ],
      tip: "Batch has schedules and files; streaming has continuous events and windows. ELT usually means landing raw data in ADLS/Synapse before transformation."
    },
    {
      heading: "Choosing the Right Data Integration Tool",
      table: {
        headers: ["Scenario", "Recommended choice"],
        rows: [
          ["Move on-premises SQL Server data to Azure Data Lake daily", "ADF with Self-Hosted IR"],
          ["Lift-and-shift existing SSIS packages", "ADF with Azure-SSIS IR"],
          ["Large historical data warehouse reporting", "Synapse Dedicated SQL Pool"],
          ["Explore Parquet or CSV files in ADLS without loading", "Synapse Serverless SQL Pool"],
          ["Real-time IoT anomaly detection and alerts", "Azure Stream Analytics"],
          ["ML pipeline on very large datasets", "Azure Databricks"],
          ["ACID transactions and time travel on data lake files", "Delta Lake on Databricks or Synapse Spark"],
          ["Analyze Cosmos DB operational data without app impact", "Synapse Link"],
          ["React when a blob lands and start a workflow", "ADF Event-Based Trigger" ]
        ]
      },
      points: [
        "Do not pick Synapse Dedicated SQL Pool just because the word analytics appears; if the task is occasional lake-file exploration, serverless is cheaper and simpler.",
        "Do not pick Databricks for simple scheduled data movement unless custom Spark or ML is a real requirement.",
        "Do not treat every data platform scenario as single-service; architecture questions often require multiple services working together."
      ],
      tip: "Eliminate by mismatch: real-time windows eliminate ADF-only, existing SSIS eliminates non-SSIS answers, on-premises private sources eliminate Azure IR-only, ad-hoc lake SQL eliminates Dedicated-only."
    },
    {
      heading: "Exam skills mapping",
      points: [
        "Recommend a solution for data integration: Azure Data Factory pipelines, integration runtimes, mapping data flows, ETL vs ELT, and Synapse pipelines.",
        "Recommend a solution for data analysis: Synapse Analytics dedicated vs serverless SQL pool, Spark pools, Databricks, Stream Analytics for real-time, Data Lake Gen2, Power BI, Microsoft Fabric awareness, and batch vs streaming."
      ],
      tip: "Map every exam scenario to its dominant skill: integration questions emphasize movement/orchestration; analysis questions emphasize how data is queried, modeled, streamed, or reported."
    }
  ],

  flashcards: [
    { front: "ADF vs Synapse vs Databricks — one-line rule", back: "ADF = orchestration and data movement. Synapse = enterprise SQL analytics/data warehouse plus Spark. Databricks = advanced Spark, Delta Lake, notebooks, and ML." },
    { front: "Which Integration Runtime reaches on-premises data sources?", back: "**Self-Hosted IR**. Install it on-premises or in a private VM so ADF can securely reach private data sources." },
    { front: "When do you choose Azure-SSIS IR?", back: "When the requirement is to lift-and-shift existing SQL Server Integration Services packages and run them in Azure with minimal redesign." },
    { front: "ADF event trigger vs Stream Analytics", back: "ADF event trigger starts a pipeline when a blob is created or deleted. Stream Analytics continuously processes event streams with SQL-like queries and windows." },
    { front: "What is a tumbling window trigger in ADF?", back: "A fixed-size, recurring, retryable processing window for time-sliced data, such as hourly or daily pipeline execution with dependencies." },
    { front: "Synapse Dedicated SQL Pool vs Serverless SQL Pool", back: "Dedicated = provisioned MPP data warehouse for persistent, high-scale reporting. Serverless = pay-per-TB-scanned SQL over lake files with no loading or provisioned compute." },
    { front: "Which Synapse table distribution fits a large fact table?", back: "**Hash** distribution on a good join/filter key to reduce data movement. Round robin is for staging; replicated is for small dimensions." },
    { front: "What does Synapse Link provide?", back: "Zero-ETL analytical access to operational data such as Cosmos DB without impacting transactional performance, using an automatically synced analytical store." },
    { front: "What is Delta Lake?", back: "An ACID-compliant storage layer on Parquet files in a data lake, adding transactions, schema enforcement/evolution, time travel, and MERGE/upserts." },
    { front: "Databricks vs Synapse Spark — exam clue", back: "Pick Databricks for advanced ML, collaborative notebooks, and complex Delta/Spark engineering. Pick Synapse Spark when Spark is part of a Synapse-centered analytics workspace." },
    { front: "What inputs and outputs are common for Stream Analytics?", back: "Inputs: Event Hubs, IoT Hub, Blob/ADLS. Outputs: Power BI, SQL Database, Cosmos DB, Event Hubs, Blob, and Azure Functions." },
    { front: "Stream Analytics tumbling vs hopping windows", back: "Tumbling windows are fixed and non-overlapping. Hopping windows overlap, such as a 10-minute average updated every minute." },
    { front: "What is ADLS Gen2's role in a lakehouse?", back: "It stores raw, processed, and curated zones for analytics, typically with ADF ingestion and Databricks or Synapse transformations over Parquet/Delta files." },
    { front: "ETL vs ELT", back: "ETL transforms before loading into the destination. ELT loads raw data first, then transforms inside the lake or warehouse using Synapse, Spark, or SQL." },
    { front: "When should you choose Synapse Serverless SQL Pool?", back: "For ad-hoc SQL exploration or external tables over files in ADLS Gen2 when you do not want to provision or load a dedicated warehouse." },
    { front: "When is Stream Analytics the best answer?", back: "Real-time IoT or event-stream processing with windows, stream joins, anomaly detection, alerts, or dashboards." },
    { front: "Why not choose Databricks for simple orchestration?", back: "Databricks is powerful Spark compute, but ADF is the better default for connectors, copy activities, triggers, retries, and pipeline coordination." },
    { front: "What is a common AZ-305 data platform architecture?", back: "ADF ingests to ADLS Gen2 raw zone, Databricks or Synapse transforms into curated Delta/Parquet, Synapse SQL serves analytics, and Power BI reports." },
    { front: "ADF pipeline vs Synapse pipeline", back: "They share the same pipeline engine concepts. Choose ADF for a standalone integration platform; choose Synapse Pipelines when orchestration belongs inside a Synapse analytics workspace." },
    { front: "What does Copy Activity add beyond a simple file transfer?", back: "Connectors to many stores, schema mapping, data type conversion, column filtering, and parallel copy controls for scalable ingestion." },
    { front: "When is Mapping Data Flows the right ADF transform choice?", back: "When teams need visual no-code transformations such as joins, aggregations, window functions, or schema drift handling without writing Spark notebooks." },
    { front: "Power BI's role in the data platform", back: "Power BI is the reporting and semantic-model layer. It usually consumes curated data from Synapse, a lakehouse, SQL endpoints, or datasets rather than orchestrating ingestion itself." },
    { front: "Microsoft Fabric awareness for AZ-305", back: "Fabric is a SaaS analytics platform that unifies data engineering, warehousing, real-time analytics, OneLake, and Power BI. Know it as an integrated alternative, but still recognize core Azure PaaS services." },
    { front: "Batch vs streaming service shortcut", back: "Batch schedules and bounded files use ADF, Synapse, or Databricks jobs. Continuous events with windows use Stream Analytics or Spark Structured Streaming over Event Hubs/IoT Hub." },
    { front: "Synapse Spark Pool vs Dedicated SQL Pool", back: "Spark Pool = distributed code/notebook processing and ML over big data. Dedicated SQL Pool = provisioned MPP relational warehouse for SQL reporting." }
  ],

  questions: [
    {
      id: "di-q1", type: "single",
      question: "A company must copy data nightly from an on-premises SQL Server database into ADLS Gen2. The database is not publicly reachable. What should you use?",
      options: ["ADF with Azure Integration Runtime", "ADF with Self-Hosted Integration Runtime", "Synapse Serverless SQL Pool", "Azure Stream Analytics"],
      correct: [1],
      explanation: "ADF is the right orchestration and copy service for a nightly batch load, but private on-premises connectivity requires a Self-Hosted Integration Runtime. Azure IR cannot reach private on-premises sources by itself; Stream Analytics is for real-time streams, not nightly database copy.",
      tip: "On-premises or private source + ADF always points to Self-Hosted IR."
    },
    {
      id: "di-q2", type: "single",
      question: "An organization has hundreds of existing SSIS packages and wants to move them to Azure with minimal redesign. Which option best fits?",
      options: ["ADF Mapping Data Flows", "ADF with Azure-SSIS Integration Runtime", "Azure Databricks jobs", "Synapse Serverless SQL Pool"],
      correct: [1],
      explanation: "Azure-SSIS IR runs existing SSIS packages in Azure for lift-and-shift migrations. Mapping Data Flows would require redesigning transformations, Databricks would require Spark redevelopment, and serverless SQL is a query service rather than an SSIS runtime.",
      tip: "The exact phrase 'existing SSIS packages' is a hard clue for Azure-SSIS IR."
    },
    {
      id: "di-q3", type: "single",
      question: "A data analyst needs to run occasional SQL queries over Parquet files stored in ADLS Gen2 without loading them into a warehouse or paying for idle compute. Which service should you choose?",
      options: ["Synapse Dedicated SQL Pool", "Synapse Serverless SQL Pool", "Azure Data Factory Copy Activity", "Azure SQL Managed Instance"],
      correct: [1],
      explanation: "Synapse Serverless SQL Pool queries files directly in the lake and charges by data scanned, with no provisioned warehouse. Dedicated SQL Pool is for persistent MPP warehousing, ADF moves data rather than serving ad-hoc SQL, and SQL Managed Instance is not a lake query engine.",
      tip: "No loading + no provisioned compute + SQL over lake files = Synapse Serverless SQL Pool."
    },
    {
      id: "di-q4", type: "single",
      question: "A retailer needs a TB-scale enterprise data warehouse for historical sales reporting with complex aggregations and predictable performance. Which Synapse component is most appropriate?",
      options: ["Synapse Dedicated SQL Pool", "Synapse Serverless SQL Pool", "ADF Mapping Data Flow", "Event Hubs Capture"],
      correct: [0],
      explanation: "Dedicated SQL Pool is the MPP, provisioned data warehouse designed for large-scale historical reporting and complex SQL aggregations. Serverless is better for ad-hoc lake exploration, ADF transforms/moves data, and Event Hubs Capture archives streams.",
      tip: "Persistent TB-scale warehouse + reporting = Dedicated SQL Pool. Occasional file exploration = Serverless."
    },
    {
      id: "di-q5", type: "single",
      question: "A payment platform must detect fraudulent transaction patterns as events arrive and calculate rolling five-minute aggregates. Which service is the best fit?",
      options: ["Azure Data Factory", "Azure Stream Analytics", "Synapse Dedicated SQL Pool", "Azure-SSIS IR"],
      correct: [1],
      explanation: "Stream Analytics is built for real-time event processing with SQL-like windowed queries over streams from Event Hubs or IoT Hub. ADF and SSIS are batch/orchestration tools, and a dedicated SQL pool is not the right engine for continuous streaming windows.",
      tip: "Rolling windows, streaming events, and immediate alerts point to Stream Analytics."
    },
    {
      id: "di-q6", type: "single",
      question: "Data scientists need collaborative notebooks, MLflow tracking, AutoML, and optimized Delta Lake processing over large datasets in ADLS Gen2. What should you recommend?",
      options: ["Azure Databricks", "ADF Copy Activity", "Synapse Serverless SQL Pool", "Azure Queue Storage"],
      correct: [0],
      explanation: "Azure Databricks is optimized for collaborative Spark analytics, ML workflows, MLflow, AutoML, and Delta Lake. ADF Copy Activity moves data, serverless SQL queries lake files, and Queue Storage is unrelated to analytics processing.",
      tip: "Notebooks + MLflow/AutoML + Delta/Spark = Databricks."
    },
    {
      id: "di-q7", type: "multi",
      question: "Which requirements are strong reasons to choose Azure Data Factory? (Select all that apply.)",
      options: ["Schedule and orchestrate multi-step copy pipelines", "Run existing SSIS packages through a managed runtime", "Process millions of events per second with streaming windows", "Trigger a workflow when a blob file arrives"],
      correct: [0, 1, 3],
      explanation: "ADF handles scheduled orchestration, can run SSIS packages through Azure-SSIS IR, and supports event-based triggers for blob arrivals. Continuous high-volume streaming windows are a Stream Analytics or Spark streaming pattern, not an ADF-only pattern.",
      tip: "ADF owns orchestration and triggers, but 'streaming windows' should make you remove ADF-only choices."
    },
    {
      id: "di-q8", type: "multi",
      question: "Which statements about Synapse SQL pools are TRUE? (Select all that apply.)",
      options: ["Dedicated SQL Pool uses provisioned MPP compute for data warehousing", "Serverless SQL Pool charges by data scanned", "Serverless SQL Pool requires loading all data into a warehouse before querying", "Dedicated SQL Pool can be paused or scaled to manage cost"],
      correct: [0, 1, 3],
      explanation: "Dedicated SQL Pool is provisioned MPP warehouse compute and can be scaled or paused. Serverless SQL Pool queries files directly and charges per TB scanned, so it does not require loading data into a warehouse.",
      tip: "Serverless means no provisioned warehouse and no load step; Dedicated means managed capacity for warehouse workloads."
    },
    {
      id: "di-q9", type: "multi",
      question: "You are designing a Delta Lake architecture on ADLS Gen2. Which capabilities does Delta Lake add to lake files? (Select all that apply.)",
      options: ["ACID transactions", "Schema enforcement and evolution", "Time travel over historical snapshots", "Automatic replacement for all ADF orchestration"],
      correct: [0, 1, 2],
      explanation: "Delta Lake adds ACID transactions, schema enforcement/evolution, time travel, and MERGE/upsert behavior to Parquet-based lake storage. It does not replace ADF's orchestration, scheduling, connectors, or triggers.",
      tip: "Delta Lake is a storage/table format capability, not an orchestration service."
    },
    {
      id: "di-q10", type: "single",
      question: "A Cosmos DB application needs near-real-time analytical queries in Synapse without affecting transactional request units. What should you configure?",
      options: ["ADF daily copy into SQL Database", "Synapse Link with analytical store", "Azure-SSIS IR", "Event Grid custom topic"],
      correct: [1],
      explanation: "Synapse Link provides zero-ETL analytical access to operational data by syncing it to an analytical store, so analytics do not impact transactional Cosmos DB performance. ADF copy is batch ETL, SSIS is package migration, and Event Grid routes events rather than enabling HTAP analytics.",
      tip: "Cosmos DB analytics without transactional impact = Synapse Link."
    },
    {
      id: "di-q11", type: "single",
      question: "A pipeline should start automatically whenever a new CSV file is added to a Blob Storage container. Which trigger should you use?",
      options: ["ADF event-based trigger", "ADF manual trigger", "Stream Analytics hopping window", "Synapse Dedicated SQL Pool pause schedule"],
      correct: [0],
      explanation: "ADF event-based triggers respond to blob creation or deletion and can start a pipeline when a file arrives. Manual triggers require user action, Stream Analytics windows process continuous event streams, and a SQL pool pause schedule does not start ingestion workflows.",
      tip: "Blob created/deleted starts pipeline = ADF event-based trigger."
    },
    {
      id: "di-q12", type: "single",
      question: "A data warehouse has a very large fact table frequently joined to other large tables on CustomerId. Which distribution is usually best for the fact table in Synapse Dedicated SQL Pool?",
      options: ["Hash distribution on CustomerId", "Round robin distribution", "Replicated distribution", "No distribution because Synapse stores one copy only"],
      correct: [0],
      explanation: "Hash distribution on a common join key helps co-locate related rows and reduce data movement for large fact tables. Round robin is useful for staging when there is no good key, replicated is for small dimensions, and dedicated SQL pools distribute data across many distributions.",
      tip: "Large fact table + clear join key = hash. Small dimension = replicated. Staging = round robin."
    },
    {
      id: "di-q13", type: "single",
      question: "A team wants to transform raw JSON files into curated Parquet in ADLS Gen2 using visual no-code transformations managed by ADF. Which feature should they use?",
      options: ["ADF Mapping Data Flows", "Synapse Link", "Event Hubs Capture", "Traffic Manager"],
      correct: [0],
      explanation: "ADF Mapping Data Flows provide visually designed transformations that run on managed Spark, supporting joins, aggregations, window functions, and schema drift. Synapse Link is HTAP, Event Hubs Capture archives streams, and Traffic Manager is networking.",
      tip: "Visual no-code ETL inside ADF = Mapping Data Flows."
    },
    {
      id: "di-q14", type: "single",
      question: "A manufacturing company has devices sending telemetry to Event Hubs. They need a Power BI dashboard updated in near real time with per-minute counts. Which processing service should sit between Event Hubs and Power BI?",
      options: ["Azure Stream Analytics", "ADF Copy Activity", "Synapse Dedicated SQL Pool", "Azure-SSIS IR"],
      correct: [0],
      explanation: "Stream Analytics can read from Event Hubs, perform per-minute tumbling-window aggregations, and output directly to Power BI. ADF and SSIS are not continuous streaming processors, and Dedicated SQL Pool is not the simplest real-time dashboard engine.",
      tip: "Event Hubs input + Power BI real-time output + windows = Stream Analytics."
    },
    {
      id: "di-q15", type: "multi",
      question: "Which services or features are commonly part of a modern Azure lakehouse architecture? (Select all that apply.)",
      options: ["ADLS Gen2 for raw and curated zones", "ADF for ingestion and orchestration", "Databricks or Synapse Spark for Delta transformations", "Azure Bastion for SQL query acceleration"],
      correct: [0, 1, 2],
      explanation: "A lakehouse commonly uses ADLS Gen2 storage zones, ADF for ingestion/orchestration, and Databricks or Synapse Spark for Delta/Parquet transformations. Azure Bastion is a secure VM access service and has no role in accelerating SQL analytics.",
      tip: "Lakehouse answers combine storage, orchestration, and Spark/SQL analytics. Networking management services are distractors."
    },
    {
      id: "di-q16", type: "single",
      question: "A team must load raw files first and then use SQL transformations inside the analytics platform. Which pattern is being used?",
      options: ["ETL", "ELT", "Point-to-site VPN", "Dead-lettering"],
      correct: [1],
      explanation: "ELT means Extract, Load, Transform: raw data is loaded first, then transformed inside the target platform such as Synapse or a lakehouse. ETL transforms before loading, while the other options are unrelated infrastructure or messaging concepts.",
      tip: "If transformation happens after loading into the lake or warehouse, it is ELT."
    },
    {
      id: "di-q17", type: "single",
      question: "An architect is tempted to use Synapse Dedicated SQL Pool for occasional CSV exploration in a data lake. What is the better default?",
      options: ["Synapse Serverless SQL Pool", "Azure-SSIS IR", "ADF tumbling trigger", "Azure Service Bus Topic"],
      correct: [0],
      explanation: "Serverless SQL Pool is designed for ad-hoc querying of lake files without provisioning a data warehouse. Dedicated SQL Pool would add persistent compute and loading overhead that the occasional exploration requirement does not justify.",
      tip: "Occasional lake-file query is the serverless clue; don't over-provision Dedicated SQL Pool."
    },
    {
      id: "di-q18", type: "single",
      question: "An IoT solution uses a speed layer for real-time alerts and a batch layer for historical analytics over archived telemetry. Which architecture pattern does this describe?",
      options: ["Lambda architecture", "Hub-spoke networking", "Blue-green deployment", "Service Bus sessions"],
      correct: [0],
      explanation: "Lambda architecture combines a batch layer for historical processing, a speed layer for real-time processing, and a serving layer for queries. Hub-spoke, blue-green, and sessions belong to networking, deployment, and messaging respectively.",
      tip: "Batch layer + speed layer + serving layer = Lambda architecture."
    },
    {
      id: "di-q19", type: "single",
      question: "A company wants one analytics workspace that includes pipelines, Spark, serverless lake SQL, and a dedicated MPP warehouse. Which service best matches the workspace requirement?",
      options: ["Azure Synapse Analytics", "Azure Data Factory only", "Azure Queue Storage", "Azure Front Door"],
      correct: [0],
      explanation: "Azure Synapse Analytics unifies pipelines, Spark pools, serverless SQL, and dedicated SQL pools in a single analytics workspace. ADF only covers data integration, while Queue Storage and Front Door are unrelated to analytics workspaces.",
      tip: "One integrated analytics workspace with SQL pools + Spark + pipelines = Synapse."
    },
    {
      id: "di-q20", type: "multi",
      question: "Which pairings are correct for Stream Analytics window types? (Select all that apply.)",
      options: ["Tumbling: fixed non-overlapping intervals", "Hopping: overlapping intervals", "Session: groups events separated by inactivity gaps", "Round robin: event-time window for per-user sessions"],
      correct: [0, 1, 2],
      explanation: "Tumbling windows are fixed and non-overlapping, hopping windows overlap, and session windows group activity by gaps. Round robin is a Synapse table distribution type, not a Stream Analytics window.",
      tip: "If an option names a Synapse distribution instead of a time window, eliminate it."
    },
    {
      id: "di-q21", type: "single",
      question: "A company already uses a Synapse workspace for lake queries, Spark transformations, and warehouse reporting. New ingestion workflows should be monitored and managed in the same analytics workspace. Which orchestration option is best?",
      options: ["Standalone Azure Data Factory", "Synapse Pipelines", "Azure Stream Analytics", "Power BI dataflows only"],
      correct: [1],
      explanation: "Synapse Pipelines are ADF-compatible and are the best fit when orchestration should live inside an existing Synapse analytics workspace with the rest of the solution. Standalone ADF is valid for independent integration, but the scenario emphasizes one Synapse-centered workspace.",
      tip: "ADF engine concepts can appear in either product. If the question stresses a Synapse workspace, choose Synapse Pipelines."
    },
    {
      id: "di-q22", type: "single",
      question: "A team needs to ingest data from several SaaS systems and then apply visual joins, aggregations, and schema drift handling without writing code. Which ADF feature should you recommend?",
      options: ["Copy Activity only", "Mapping Data Flows", "Synapse Dedicated SQL Pool distributions", "Event Hubs Capture"],
      correct: [1],
      explanation: "Mapping Data Flows provide visual no-code transformations that run on managed Spark and support joins, aggregations, window functions, and schema drift. Copy Activity is primarily movement and mapping, not rich transformation; the other options solve warehousing or streaming archive problems.",
      tip: "Visual transformation in ADF = Mapping Data Flows; simple movement = Copy Activity."
    },
    {
      id: "di-q23", type: "multi",
      question: "A manufacturer is designing an ELT lakehouse: land raw data first, transform later, and report from curated data. Which components are appropriate? (Select all that apply.)",
      options: ["ADLS Gen2 raw and curated zones", "ADF or Synapse Pipelines for ingestion orchestration", "Synapse SQL or Spark/Databricks for transformations", "Azure-SSIS IR as the mandatory query engine"],
      correct: [0, 1, 2],
      explanation: "An ELT lakehouse commonly lands raw data in ADLS Gen2, orchestrates ingestion with ADF or Synapse Pipelines, and transforms with Synapse SQL, Synapse Spark, or Databricks before reporting. Azure-SSIS IR is only for running existing SSIS packages; it is not mandatory and is not the query engine.",
      tip: "ELT means land first, transform later. Look for storage zones, orchestration, and analytics compute working together."
    },
    {
      id: "di-q24", type: "single",
      question: "A batch pipeline copies daily data from ten sources, calls a Databricks notebook for complex transformations, and loads curated data into Synapse for reporting. Which service should coordinate the workflow dependencies and retries?",
      options: ["Azure Data Factory pipeline", "Synapse Serverless SQL Pool", "Power BI dashboard", "Azure Event Grid only"],
      correct: [0],
      explanation: "ADF pipelines orchestrate multi-step data workflows, including copy activities, notebook execution, dependencies, scheduling, retries, and monitoring. Serverless SQL queries files, Power BI reports data, and Event Grid can trigger events but does not coordinate the whole batch workflow.",
      tip: "When several data steps must be sequenced with retries and dependencies, choose a pipeline orchestrator such as ADF."
    },
    {
      id: "di-q25", type: "single",
      question: "A business intelligence team needs predictable high-performance SQL reporting over a curated star schema with large fact tables and small dimensions. Which Synapse option should you recommend?",
      options: ["Synapse Dedicated SQL Pool with hash and replicated distributions", "Synapse Serverless SQL Pool over raw CSV only", "Azure Stream Analytics", "ADF Self-Hosted IR"],
      correct: [0],
      explanation: "A dedicated SQL pool is the Synapse MPP warehouse for predictable relational reporting. Large facts are commonly hash distributed and small dimensions can be replicated. Serverless over raw CSV is better for exploration, Stream Analytics is real-time processing, and Self-Hosted IR is connectivity.",
      tip: "Star schema + predictable BI performance + distributions = Dedicated SQL Pool."
    },
    {
      id: "di-q26", type: "single",
      question: "A department wants Power BI reports over curated Parquet files in ADLS Gen2 but does not want to provision a warehouse for occasional analysis. Which query layer fits best?",
      options: ["Synapse Serverless SQL Pool", "Azure-SSIS IR", "Service Bus Topic", "Application Gateway"],
      correct: [0],
      explanation: "Synapse Serverless SQL Pool can expose lake files through SQL views or external tables and is suitable for occasional analysis with Power BI without provisioned warehouse compute. The other options do not provide a lake-file SQL query layer for reporting.",
      tip: "Power BI over lake files without dedicated compute often points to Serverless SQL Pool."
    },
    {
      id: "di-q27", type: "single",
      question: "An enterprise wants a SaaS analytics experience that brings data engineering, warehousing, real-time analytics, OneLake, and Power BI into a single platform with less PaaS assembly. What should the architect be aware of?",
      options: ["Microsoft Fabric", "Azure Bastion", "Service Bus Premium", "Azure Firewall Policy"],
      correct: [0],
      explanation: "Microsoft Fabric is Microsoft's SaaS analytics platform that unifies experiences such as data engineering, warehousing, real-time analytics, OneLake, and Power BI. The other options are networking or messaging services and do not provide an integrated analytics platform.",
      tip: "Fabric appears when the scenario emphasizes a unified SaaS analytics platform rather than assembling separate Azure PaaS services."
    },
    {
      id: "di-q28", type: "multi",
      question: "A connected-vehicle platform needs real-time anomaly alerts and next-day historical trend reporting from the same telemetry. Which design choices are appropriate? (Select all that apply.)",
      options: ["Ingest telemetry through Event Hubs or IoT Hub", "Use Stream Analytics for real-time windowed alerts", "Archive raw telemetry to ADLS Gen2 for batch analysis", "Use only ADF Mapping Data Flows for sub-second alerting"],
      correct: [0, 1, 2],
      explanation: "Telemetry platforms commonly ingest through Event Hubs or IoT Hub, process real-time windows with Stream Analytics, and archive to ADLS Gen2 for batch analytics in Synapse, Databricks, or Power BI. ADF Mapping Data Flows are not the right engine for sub-second continuous alerting.",
      tip: "Hybrid real-time plus historical analytics usually combines streaming ingestion, streaming processing, and lake storage."
    }
  ]
});
