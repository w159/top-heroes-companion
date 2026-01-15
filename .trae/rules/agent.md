---
alwaysApply: false
description:
---
# AGENTS.md

## ExecPlans

When writing complex features or significant refactors, use an ExecPlan (as described in PLANS.md) from design to implementation.

## Purpose

This framework defines a multi-agent execution architecture that supports any codebase, tech stack, or workflow. It ensures that every task is planned, documented, implemented, tested, validated, and recorded with consistent quality and context efficiency. Use the guardrails below in tandem with the detailed optimization standards that follow.

---

## Agent Roles

### Implementer

- Decomposes tasks using Sequential Thinking.
- Conducts documentation research through Context7, Microsoft Docs, and DeepWiki.
- Performs code navigation, edits, refactors, and transformations with Serena.
- Executes automation or tooling steps through MCP tools.
- Maintains incremental progress notes for downstream roles.

### Reviewer

- Audits code for correctness, architecture alignment, and maintainability.
- Confirms adherence to documentation and standards.
- Flags inconsistencies, risks, or missing test coverage.
- Validates tool usage patterns for efficiency.

### Tester

- Runs unit, integration, security, performance, or environment-specific tests.
- Confirms behavior aligns with documented expectations.
- Provides concise test reports and failure analyses.
- Ensures regression safety before handoff.

### Validator (Secondary Expert)

- Performs deep verification of edge cases, risk points, and performance behavior.
- Uses Serena thinking tools to reassess assumptions and confirm completion.
- Approves or rejects final delivery based on residual risks.

---

## Lifecycle Model

1. **Plan**
   - Use Sequential Thinking to define objectives, risks, dependencies, and success criteria.
   - Generate a task list and assign each item to Implementer, Reviewer, and Tester roles.
2. **Research**
   - Resolve documentation via Context7, Microsoft Docs, and DeepWiki.
   - Extract only actionable guidance, constraints, APIs, and gotchas.
   - Store distilled notes in memory for reuse.
3. **Implement**
   - Explore code with Serena overview/search tools.
   - Make precise modifications with symbol-level operations.
   - Use Filesystem, Playwright, Azure, or other MCP tools as needed.
   - Prefer code-execution pipelines for multi-step transformations.
4. **Test**
   - Execute the smallest relevant test set.
   - Validate behavior, edge cases, and expected outputs.
   - Capture concise summaries only.
5. **Validate**
   - Run Serena adherence and completion checks.
   - Perform secondary expert review for risk, security, and edge-case validation.
6. **Record**
   - Compress decisions, patterns, fixes, and constraints into memory.
   - Ensure reusable insights persist across sessions.

---

## Cross-Agent Protocol

### Handoff Requirements

Each handoff must include:

- Key decisions.
- Relevant file paths or symbols.
- Test results or blockers.
- Next required steps.
- Any assumptions requiring validation.

### Context Hygiene

- Never store raw logs or large files in memory.
- Always compress results before sharing.
- Keep only high-signal information for future agents.

---

## Tool-Usage Expectations

- **Serena**: Primary environment for code editing, navigation, testing, and validation.
- **Sequential Thinking**: Mandatory for planning, replanning, scope changes, and completion checks.
- **Context7 / Microsoft Docs / DeepWiki**: Authoritative documentation layer for APIs, platforms, and dependencies.
- **Filesystem / Playwright / Azure / Asana**: Engage when interacting with files, automation, infrastructure, or task operations.
- **Memory**: Stores decisions, outcomes, reusable patterns, and next-step context.

---

## Completion Criteria

A task is considered complete only when:

- Documentation has been consulted.
- Implementation is validated.
- Tests pass.
- Serena confirms task adherence.
- Memory is updated with results.

## MCP Tool Optimization & Context Efficiency

### The Progressive Tool Loading Pattern

Traditional MCP usage loads all tool definitions upfront into the model's context window, creating two critical inefficiencies:

1. **Tool Definition Overhead**: Processing hundreds of thousands of tokens before reading a request when connecting to extensive tool catalogs
2. **Intermediate Result Duplication**: Every tool output flows through the model context, duplicating large data (e.g., a 2-hour transcript consuming 50,000+ tokens per pass)

**Optimal MCP Pattern**: Treat MCP servers as API libraries that agents interact with programmatically rather than through sequential tool calls.

#### Progressive Discovery Strategy

- **Lazy Loading**: Load only tool definitions needed for the current task phase
- **Exploration First**: Use symbol/search tools to map the landscape before loading detailed definitions
- **Hierarchical Access**: Navigate tool hierarchies (filesystem-style) to discover capabilities on-demand
- **In-Environment Filtering**: Process and transform data within the execution environment before returning filtered results to the model

#### Token Efficiency Metrics

Track these indicators to validate optimal MCP usage:

- **Pre-request token load**: Should remain under 10,000 tokens for typical tasks
- **Inter-operation overhead**: Minimize data passing through model context between tool calls
- **Result compression ratio**: Filter/transform large outputs before context injection

#### When to Use Code Execution vs Direct Tool Calls

| Pattern | Use When | Token Impact |
| --- | --- | --- |
| **Code Execution** | Multi-step data pipelines, large file operations, repetitive transformations | 95-99% reduction |
| **Direct Tool Calls** | Single atomic operations, small result sets, exploratory queries | Standard |
| **Hybrid Approach** | Initial exploration via tools → bulk operations via code | 70-90% reduction |

**Example**: Rather than calling `read_file` → process in model → `write_file`, write code that reads, transforms, and writes in a single execution context, returning only summary statistics to the model.

### Context Management Architecture

#### Type-Safe Context Pattern

Use strongly-typed context objects to share state across agent operations without bloating LLM context:

```python
@dataclass
class TaskContext:
    project_root: Path
    active_memories: list[str]
    tool_usage_log: dict[str, int]
    current_phase: Literal["plan", "research", "implement", "test", "validate"]
```

**Key Principles**:

- Context objects are **never sent to the LLM** - they're purely local state
- All agents, tools, and lifecycle hooks in a run must share the same context type
- Use context for dependency injection (loggers, database connections, API clients)
- Store frequently-accessed data (project paths, credentials) to avoid redundant tool calls

#### The Four Context Injection Layers

Expose data to the LLM through these prioritized layers:

1. **System Instructions** (static/computed strings)
   - Use for: Persistent behavioral guidelines, role definitions, quality standards
   - Token cost: Fixed per run, included in every LLM call
   - Update strategy: Rarely; treat as agent "personality"

2. **Input Messages** (lower-priority runtime data)
   - Use for: Task descriptions, user requests, session-specific context
   - Token cost: Per-run injection, cleared between sessions
   - Update strategy: Each new task or conversation turn

3. **Function Tools** (on-demand data fetching)
   - Use for: Conditional information, large datasets, external APIs
   - Token cost: Only when invoked, results included in subsequent calls
   - Update strategy: Let LLM decide when data is needed

4. **Retrieval/Search Tools** (grounding in external knowledge)
   - Use for: Documentation, knowledge bases, historical decisions
   - Token cost: Query + filtered results only
   - Update strategy: Query-driven, cache frequently-accessed results

#### Context Bloat Prevention Checklist

- [ ] System instructions contain only essential, high-signal information
- [ ] Tool results are filtered/summarized before returning to model
- [ ] Large data structures live in local context, not LLM messages
- [ ] Memories capture decisions/outcomes, not raw data dumps
- [ ] Parallel tool calls used to gather data in one round-trip
- [ ] Tool definitions loaded progressively, not all-at-once

## Collaboration Charter

- Maintain a living to-do list for every task. Assign each item to a primary implementer, a reviewer, and a tester.
- Favor small, incremental changes with immediate tests after each change to avoid regressions.
- After each coder/Python expert delivers work, schedule a secondary expert pass (analysis/debugging/validation) before considering the task complete.
- Keep progress lightweight but persistent by updating memories with key decisions, patterns, and outcomes.

## Core Execution Loop (Mandatory)

1. **Plan** - Use `mcp_sequential-thinking_sequentialthinking` to decompose the task, surface risks, and define success criteria.
2. **Research** - Progressively load documentation: start with resolve calls, then focused topic fetches. When work touches Microsoft platforms/services, run Microsoft Docs search/fetch before writing code. Capture actionable takeaways in memory.
3. **Implement** - Apply Serena tools for code navigation and edits while enforcing DRY/SOLID/clean-code principles. Prefer code execution for multi-step operations.
4. **Test** - Run validations via `mcp_serena_execute_shell_command` (unit, integration, performance, security as appropriate).
5. **Validate** - Use `mcp_serena_think_about_task_adherence` mid-task; finish with `mcp_serena_think_about_whether_you_are_done`.
6. **Record** - Capture decisions, reusable patterns, and results with `mcp_serena_write_memory` for future sessions. Compress verbose outputs before storing.

Before entering the loop, instantiate the Implementer/Reviewer/Tester subagents (even if one person fills multiple roles) so each stage can maintain its own plan, execution notes, and validation state.

## Agent Orchestration Strategies

### Two Orchestration Modes

#### LLM-Driven Orchestration

Let agents autonomously plan workflows through intelligent decision-making.

**Best for**:

- Exploratory tasks with unknown solution paths
- Natural language task decomposition
- Dynamic priority adjustment based on discoveries

**Tactics**:

- Craft clear, detailed prompts specifying available tools and operational parameters
- Continuous monitoring and iterative prompt refinement based on failure patterns
- Enable agent self-critique and improvement loops
- Deploy specialized agents focused on specific competencies rather than generalist approaches
- Implement evaluation frameworks to drive ongoing agent improvement

#### Code-Based Orchestration

Prioritize predictability across speed, cost, and performance metrics.

**Best for**:

- Repeatable workflows with known steps
- Performance-critical operations
- Complex conditional logic

**Patterns**:

- **Structured output parsing**: Leverage typed responses to classify tasks and route to appropriate agents
- **Sequential chaining**: Decompose complex tasks into ordered steps with output-to-input transformations
- **Iterative refinement loops**: Run task-execution agents within evaluation loops until quality criteria are satisfied
- **Parallel execution**: Utilize async primitives for non-dependent concurrent tasks

### Orchestration Decision Framework

| Characteristic | LLM-Driven | Code-Based |
| --- | --- | --- |
| Task predictability | Low/exploratory | High/repeatable |
| Performance requirements | Flexible | Critical |
| Cost sensitivity | Moderate | High |
| Error handling needs | Graceful degradation | Precise control |
| Development time | Faster iteration | Upfront investment |

**Hybrid Approach**: Use LLM orchestration for planning/exploration phases, then code-based execution for implementation.

### Multi-Agent Architecture Patterns

#### Manager Pattern (Agents as Tools)

A central orchestrator invokes specialized sub-agents while maintaining conversation control.

**Structure**:

```markdown
Manager Agent
├── Research Agent (tool)
├── Implementation Agent (tool)
├── Testing Agent (tool)
└── Validation Agent (tool)
```

**Use when**:

- Clear task hierarchy exists
- Central coordination needed for context synthesis
- Sub-tasks are independently scoped

#### Handoff Pattern (Peer Delegation)

Peer agents delegate to specialized agents that assume conversation leadership.

**Structure**:

```markdown
Entry Agent → Specialized Agent A → Specialized Agent B → Completion
```

**Use when**:

- Linear workflow progression
- Each phase requires deep specialization
- Minimal context needs to transfer between phases

#### Parallel Execution Pattern

Multiple agents operate concurrently on independent sub-tasks.

**Structure**:

```markdown
Orchestrator
├── Agent 1 (parallel)
├── Agent 2 (parallel)
├── Agent 3 (parallel)
└── Aggregator
```

**Use when**:

- Sub-tasks have no interdependencies
- Results can be independently validated
- Speed is critical

## Role & Handoff Protocol

- **Implementer**: Plans, researches, executes code edits, and runs preliminary tests.
- **Reviewer**: Audits code quality, architecture alignment, and verifies documentation adherence.
- **Tester**: Runs automated/manual tests, validates outputs, and confirms requirements.
- **Secondary Expert**: Performs an additional validation cycle focused on debugging, edge cases, and performance/security checks.

### Handoff Context Transfer

When transferring between agents, capture in memory:

- **Decisions made**: What options were considered, why current approach was chosen
- **Artifacts created**: File paths, symbols modified, test results
- **Open questions**: Ambiguities or assumptions requiring validation
- **Next agent prerequisites**: Required context, expected inputs

**Anti-pattern**: Passing verbose raw data between agents. Instead, distill insights and reference locations.

## Subagent Coordination Framework

- Stand up a shared to-do list before work starts; tag each entry with: objective, success metric, primary implementer, reviewer, tester, and target MCP tools.
- Auto-spawn the Implementer/Reviewer/Tester subagents as soon as their ticket appears (even if you will fill multiple roles) so each can maintain its own plan, memory notes, and validation artifacts.
- Keep tickets small (single responsibility). If scope grows, split the ticket and re-run planning for each shard.
- Track state transitions explicitly: **Backlog → In Progress → Review → Testing → Secondary Validation → Done**. Update the ticket after every hand-off.
- Capture context snapshots in memory when ownership changes so the next subagent can resume without re-discovery.
- Reviewers and testers should record findings (pass/fail, defects, open questions) in memory and attach them to the ticket before handing it back.

### Subagent Lifecycle Management

Each agent should implement these lifecycle hooks for observability:

- **on_agent_start**: Initialize context, load relevant memories, log agent activation
- **on_tool_call**: Track tool usage patterns, detect inefficiencies (e.g., redundant calls)
- **on_agent_end**: Persist outcomes to memory, compress verbose logs, prepare handoff context
- **on_error**: Capture failure context, classify error type, determine recovery strategy

### Subagent Workflow Checklist

If a role-specific subagent is not active, instantiate it (e.g., via Task tool with appropriate subagent_type) before executing the checklist so plans, notes, and memories remain partitioned by responsibility.

1. **Implementer**
   - Run Sequential-Thinking to outline micro-tasks and risks
   - Check Context7 documentation for every new dependency, API, or pattern; when Microsoft tech is involved, immediately follow with Microsoft Docs search/fetch calls to confirm authoritative guidance
   - Use progressive tool loading: explore with search tools before loading heavy symbol definitions
   - Prefer code execution for multi-step transformations (file processing, data pipelines)
   - Execute Serena tooling to implement, keeping notes on assumptions or follow-ups
   - Log tool usage metrics to context for optimization review

2. **Reviewer**
   - Confirm documentation references and rationale are captured
   - Validate code style, architecture alignment, and test coverage expectations
   - Check tool usage patterns for efficiency (look for redundant calls, large context injections)
   - Log approvals or required fixes before moving the ticket to Testing

3. **Tester**
   - Execute the committed test plan via Serena shell commands
   - Compare outputs against acceptance criteria and note environment prerequisites
   - Validate error handling and edge cases
   - Capture test metrics (coverage, performance, token usage if relevant)

4. **Secondary Expert**
   - Perform targeted stress/edge-case checks, performance/security probes, or chaos tests as needed
   - Review context efficiency: were tools used optimally?
   - Validate memory hygiene: are captured artifacts useful and concise?
   - Decide on sign-off or re-open with clear remediation guidance

## MCP Tool Reference

### Tool Usage Optimization Principles

1. **Batch Compatible Operations**: Use parallel tool calls for independent queries
2. **Progressive Refinement**: Start broad (search/overview) → narrow (specific symbols/files)
3. **Filter Early**: Apply constraints in tool parameters, not post-processing in model
4. **Code for Pipelines**: Multi-step transformations should execute in code, not tool chains
5. **Cache Stable Results**: Store frequently-accessed data in local context, not repeated tool calls

### Serena MCP Server - Implementation Toolkit

| Category | Key Tools | Primary Usage | Optimization Notes |
| --- | --- | --- | --- |
| File I/O | `mcp_serena_read_file`, `mcp_serena_create_text_file`, `mcp_serena_list_dir`, `mcp_serena_find_file` | Inspect, create, and locate files | Batch file reads when exploring; use `list_dir` before loading symbols |
| Symbol Intelligence | `mcp_serena_get_symbols_overview`, `mcp_serena_find_symbol`, `mcp_serena_find_referencing_symbols` | Map code structure, locate implementations, discover call sites | Start with overview (cheap), then targeted symbol lookups |
| Code Modification | `mcp_serena_replace_symbol_body`, `mcp_serena_insert_after_symbol`, `mcp_serena_insert_before_symbol`, `mcp_serena_replace_regex` | Apply targeted edits and refactors | Symbol-based edits are precise; reserve regex for cross-cutting changes |
| Pattern Search | `mcp_serena_search_for_pattern` | Regex-driven discovery of usage patterns, config values, or anti-patterns | Use for exploration; results inform which symbols to load |
| Project Ops | `mcp_serena_activate_project`, `mcp_serena_check_onboarding_performed`, `mcp_serena_onboarding` | Initialize environment and confirm onboarding status | One-time setup; cache project metadata in context |
| Memory | `mcp_serena_write_memory`, `mcp_serena_read_memory`, `mcp_serena_list_memories`, `mcp_serena_delete_memory` | Persist task states, retrieve prior context, clean outdated notes | **Critical**: Compress before writing; list before reading to avoid irrelevant loads |
| Shell & Diagnostics | `mcp_serena_execute_shell_command`, `mcp_serena_restart_language_server` | Execute commands/tests and recover language services | Capture command output; summarize in memory, don't inject full logs |
| Meta Thinking | `mcp_serena_think_about_collected_information`, `mcp_serena_think_about_task_adherence`, `mcp_serena_think_about_whether_you_are_done`, `mcp_serena_prepare_for_new_conversation` | Validate information sufficiency, task alignment, completion | Use at phase boundaries; results guide next tool loading decisions |

#### Serena Usage Notes

- Always prefer symbol-based tools for structural edits and `search_for_pattern` for wide scans
- Keep regex replacements scoped; set `allow_multiple_occurrences` explicitly when needed
- Capture command outputs succinctly; do not duplicate large logs in the memory or response
- **Token Efficiency**: Use thinking tools to validate you have sufficient info before loading more definitions

#### Serena Operating Guidance

- **When to engage**: Any time a subagent needs direct code or filesystem interaction, project introspection, or memory coordination
- **Pre-call checklist**:
  - Confirm the correct project/workspace is active
  - Note expected file paths or symbols
  - Identify guardrails (read vs. write, scope of change)
  - Check local context for cached data before calling tools
- **Post-call actions**:
  - Summarize results, update the to-do ticket
  - Log notable findings in memory (especially diffs, failing tests, or exploratory insights)
  - Update context with reusable artifacts (paths, symbol names)
  - Track token usage if dealing with large result sets

#### Serena Subagent Delegation Patterns

- **Implementers** drive most Serena usage; reviewers rely on symbol and diff tools to audit changes
- **Testers** invoke shell commands (`pytest`, linters, custom scripts) and store outcomes with environment notes
- **Secondary experts** use Serena thinking tools to reassess risks, confirm regression coverage, and prepare sign-off memos

#### Example Serena Micro-Playbook (Optimized)

1. `mcp_serena_get_symbols_overview` (map structure - load minimal context)
2. `mcp_serena_search_for_pattern` (discover usage patterns - filter targets)
3. `mcp_serena_find_symbol` (locate specific targets - load only needed definitions)
4. `mcp_serena_replace_symbol_body`/`insert_after_symbol` (apply change - atomic operation)
5. `mcp_serena_execute_shell_command` (run tests - capture summary metrics only)
6. `mcp_serena_write_memory` (record compressed outcome with file:line references)
7. `mcp_serena_think_about_whether_you_are_done` (final check)

**Token Optimization**: Steps 1-3 load progressively; avoid loading full file contents until step 4 requires them.

### Context7 MCP Server - Documentation & Research

| Tool | Purpose | Typical Flow | Optimization Notes |
| --- | --- | --- | --- |
| `mcp_context7_resolve-library-id` | Map package/library names to Context7 IDs | Call once per library to get the canonical identifier | Cache library IDs in local context |
| `mcp_context7_get-library-docs` | Fetch authoritative docs, best practices, quickstarts, and version notes | Invoke immediately after resolve; focus on the topic relevant to the task before coding | Specify focused topics; avoid fetching entire documentation corpus |

#### Context7 Documentation Enforcement

- No implementation may begin before the relevant docs are consulted
- Confirm quickstart/setup commands, API usage, dependencies, version compatibility, and security considerations during this step
- **Progressive Loading**: Resolve library ID first (cheap), then fetch only relevant topic sections

#### Context7 Operating Guidance

- **When to engage**: At task inception, when technologies change, before schema migrations, or whenever questions arise about best practices and compatibility
- **Pre-call checklist**:
  - Capture current assumptions and questions so you can validate or refute them
  - Note required versions or platform constraints
  - Check if library ID is already cached in context
- **Post-call actions**:
  - Summarize key takeaways (commands, API signatures, edge cases) in memory - compress aggressively
  - Link them to the active to-do items
  - Cache library metadata in context for session reuse

#### Context7 Subagent Delegation Patterns

- **Implementers** initiate Context7 research and attach findings to the ticket description
- **Reviewers** verify that referenced docs match implemented behavior and call out discrepancies
- **Testers** review documentation for expected outputs, limits, or required fixtures before executing tests
- **Secondary experts** use Context7 to probe advanced topics (performance tuning, security hardening, compliance) ahead of sign-off

#### Example Context7 Micro-Playbook (Optimized)

1. Check local context for cached library ID
2. If not cached: `mcp_context7_resolve-library-id` → cache in context
3. `mcp_context7_get-library-docs` with **specific topic** (not full docs)
4. Extract: commands, API signatures, version constraints, gotchas → compress to bullet points
5. Store compressed summary in memory with library ID reference
6. Update ticket with prerequisites and checkpoints
7. Re-run Sequential-Thinking if new constraints surfaced

**Token Optimization**: Never load full documentation; use topic-focused queries and aggressive summarization.

### Microsoft Docs MCP Server - Official Microsoft Guidance

| Tool | Purpose | Typical Flow | Optimization Notes |
| --- | --- | --- | --- |
| `mcp_microsoft-docs_microsoft_docs_search` | Locate the most relevant Microsoft Learn/Docs articles | Use with product keywords plus scenario (e.g., "Azure Functions scaling") | Narrow search with version/service tier keywords |
| `mcp_microsoft-docs_microsoft_docs_fetch` | Pull the full article for deep procedures, prerequisites, and caveats | Fetch immediately after identifying a high-value article and scan for mandatory steps | Extract only action items and constraints; discard marketing content |
| `mcp_microsoft-docs_microsoft_code_sample_search` | Retrieve official Microsoft code samples for SDK usage | Call when implementing or reviewing Microsoft APIs to align with latest patterns | Load samples for specific API surface, not entire SDKs |

#### Microsoft Docs Documentation Enforcement

- Trigger Microsoft Docs queries whenever requirements touch Azure, .NET, Windows, Power Platform, or any Microsoft-hosted service even if Context7 already surfaced guidance
- Extract environment prerequisites, security permissions, CLI commands, throttling limits, and support policies into memory before coding
- **Dual-Source Strategy**: Cross-reference Context7 and Microsoft Docs; prioritize Microsoft Docs for platform-specific constraints

#### Microsoft Docs Operating Guidance

- **When to engage**: During research, before infrastructure changes, while debugging Microsoft services, and to validate breaking changes or deprecations
- **Pre-call checklist**:
  - Note the SKU/service tier, region, authentication model, and any compliance constraints so you can filter docs effectively
  - Check if similar queries already executed this session
- **Post-call actions**:
  - Update the to-do list with required steps/approvals
  - Cross-link the article title in memory for future retrieval
  - Extract version-specific constraints into context

#### Microsoft Docs Subagent Delegation Patterns

- **Implementers** run search/fetch early and circulate distilled notes via the shared ticket
- **Reviewers** confirm the implementation adheres to the fetched doc steps and flags mismatches as defects
- **Testers** pull code samples or validation checklists from docs to construct reliable test cases
- **Secondary experts** monitor doc revisions (publish dates/change logs) and prompt revalidation when guidance changes

#### Example Microsoft Docs Micro-Playbook (Optimized)

1. `mcp_microsoft-docs_microsoft_docs_search` with narrow keywords (scope authoritative article)
2. Review search results, select high-value article
3. `mcp_microsoft-docs_microsoft_docs_fetch` (collect full context)
4. **Extract only**: prerequisites, CLI commands, configuration values, limits, deprecation warnings
5. Optionally `mcp_microsoft-docs_microsoft_code_sample_search` for specific API surface
6. Compress findings: action items, constraints, sample code references → store in memory
7. Update context with version constraints for session reuse
8. Verify implementation/tests reflect the documented guidance

**Token Optimization**: Extract structured data (limits, commands, versions) rather than prose; discard boilerplate.

### Sequential-Thinking MCP Server - Planning & Reflection

| Tool | Function | Optimization Notes |
| --- | --- | --- |
| `mcp_sequential-thinking_sequentialthinking` | Iterative planning, hypothesis testing, branching, and revision. Adjust `totalThoughts` as understanding deepens | Use at phase boundaries; results determine next tool loading strategy |

#### Planning Reminders

- Explicitly branch thoughts when exploring alternatives; mark revisions when adjusting earlier conclusions
- Use the tool to reassess when blockers appear or scope shifts
- **Context Efficiency**: Planning outputs should inform which tools to load next, not trigger exhaustive exploration

#### Sequential-Thinking Operating Guidance

- **When to engage**: At task kick-off, before major pivots, after unexpected failures, or when multiple solution paths compete
- **Pre-call checklist**:
  - List known requirements, open risks, and dependencies so the thought process addresses each explicitly
  - Reference current context state to avoid redundant exploration
- **Post-call actions**:
  - Translate the thought outcome into concrete to-do entries, update owners
  - Store distilled insights in memory (not full thought transcript)
  - Use findings to prioritize which MCP tools to engage next

#### Sequential-Thinking Subagent Delegation Patterns

- **Implementers** launch initial thought sequences; reviewers may run additional thoughts to probe architectural implications
- **Testers** can use the tool to design layered validation strategies or explore failure hypotheses
- **Secondary experts** run a final reflection to verify completeness before sign-off

#### Example Sequential-Thinking Micro-Playbook (Optimized)

1. **Thought 1**: Define objective, success criteria, and constraints
2. **Thought 2**: Enumerate sub-tasks and assign agents → output determines which doc servers to query
3. **Thought 3**: Validate documentation plan and testing approach → identifies required tool definitions
4. **Thought 4**: After implementation/testing, reassess to confirm no gaps remain
5. Compress thought outcomes to decision points and open questions → store in memory

**Token Optimization**: Store conclusions and next actions, not full reasoning chains.

## Multi-Server Orchestration Patterns

### Baseline Delivery Loop (Optimized)

1. **Sequential-Thinking** (plan) → identifies required capabilities
2. **Progressive Documentation Load**:
   - Context7 resolve (cache IDs)
   - Targeted topic fetch (not full docs)
   - Microsoft Docs search (if applicable) → extract constraints
3. **Serena Exploration** (overview/search) → map landscape
4. **Targeted Serena Implementation** (load only needed symbols)
5. **Code Execution** (for multi-step operations) OR **Direct Tool Calls** (for atomic edits)
6. **Serena Validation** (execute tests) → capture summary metrics
7. **Thinking Tools** (adherence/completion checks)
8. **Memory Updates** (compress findings before storing)

**Token Impact**: 70-95% reduction compared to load-all-tools-upfront pattern.

### Hotfix Triage (Speed-Optimized)

1. **Sequential-Thinking** to scope blast radius → identifies search scope
2. **Parallel Serena Calls**: `search_for_pattern` + `find_referencing_symbols` + error log review
3. **Minimal Documentation Check**: Context7 + Microsoft Docs only for confirmed edge cases
4. **Atomic Serena Patch** (single symbol modification preferred)
5. **Targeted Test Execution** (affected test suite only)
6. **Compressed Memory Capture** (incident summary + fix location + validation results)
7. **Retro Note** (root cause + prevention → stored separately from incident details)

**Token Impact**: Minimize documentation loading; rely on cached knowledge for common patterns.

### Feature Spike (Exploration-Optimized)

1. **Context7 + Microsoft Docs** to evaluate feasibility → broad search, narrow fetch
2. **Sequential-Thinking** to compare options → branches for each alternative
3. **Serena Overview** (existing architecture patterns)
4. **Code Execution Prototype** (within disposable branch, minimal tool calls)
5. **Tester Exploratory Tests** (happy path + critical edge cases only)
6. **Secondary Expert Post-Mortem** via Sequential-Thinking → distill learnings
7. **Decision Memory** (chosen approach + rationale + constraints)

**Token Impact**: Front-load exploration costs; defer detailed implementation tool loading.

### Knowledge Capture (Session Cleanup)

1. **Review Context Object**: Extract reusable artifacts (paths, IDs, constraints)
2. **Check Documentation Freshness**: Context7 + Microsoft Docs for recent updates
3. **Compress Session Findings**:
   - Decisions made (with alternatives considered)
   - Reusable patterns discovered
   - Anti-patterns avoided
   - Performance/security insights
4. **Aggressive Memory Write**: Bullet points with references, not prose
5. **Context Object Serialization**: Save stable metadata for next session

**Token Impact**: Post-session compression ensures next session starts lean.

## Development Standards & Quality Gates

### Code Quality Principles

- **DRY**: Search for existing implementations before coding (`search_for_pattern`), watch for duplication post-implementation
- **SOLID**: Review class/function scope via `get_symbols_overview`; ensure extensibility and substitution rules (check references before modifying polymorphic code)
- **Clean Code**: Keep functions focused, choose meaningful names, add comments only for non-obvious logic, and maintain consistent formatting

### Architecture & Structure

- Preserve separation of concerns; review directory organization with `list_dir` or symbol overviews before introducing new modules
- Validate dependency directions and avoid circular references using referencing tools
- Track configuration and package manifests to ensure dependency hygiene

### Testing & Validation

- Run the smallest relevant test suite after each meaningful change (unit → integration → performance/security as needed)
- Capture unexpected test failures in memory with context and remediation steps
- Confirm regression safety before closing tasks
- **Token Efficiency**: Summarize test results; store failure details and stack traces separately from success confirmations

### Documentation & Memory Hygiene

- Update README/API docs or inline comments when behavior changes
- Store new decisions, patterns, or confirmed anti-patterns using `write_memory`; remove outdated entries with `delete_memory` to avoid drift
- **Critical**: Compress memory writes - extract action items and insights, discard verbose context

## Mandatory Validation Checkpoints

1. **Before Implementation**
   - Plan (Sequential-Thinking) → identifies required tools
   - Research (progressive doc loading) → caches constraints in context
   - Verify collected info sufficiency (thinking tool)
   - **Token Check**: Have we loaded only necessary tool definitions?

2. **During Implementation**
   - Monitor adherence (`think_about_task_adherence`)
   - Ensure code quality
   - Document interim findings in compressed form
   - **Token Check**: Are we passing large data through the model unnecessarily?

3. **After Implementation**
   - Test via shell command → capture summary metrics
   - Perform reviewer/tester handoffs with compressed context
   - Finalize with completion check
   - Archive results in memory (aggressively compressed)
   - **Token Check**: Review tool usage patterns for efficiency gains

## Tool Execution Strategies

### Tool Behavior Configuration

Control agent continuation after tool execution:

| Strategy | Behavior | Use When |
| --- | --- | --- |
| `run_llm_again` (default) | LLM processes tool results and continues | Multi-step reasoning required |
| `stop_on_first_tool` | First tool output becomes final response | Single atomic operation |
| `StopAtTools` | Halt on specified tool invocation | Handoff point reached |
| `ToolsToFinalOutputFunction` | Custom logic determines continuation | Complex conditional flows |

### Structured Output Patterns

Use typed outputs (Pydantic models) to:

- Enforce response schemas for reliable parsing
- Enable type-safe agent chaining
- Reduce token waste on malformed responses
- Support programmatic validation in code-based orchestration

### Parallel vs Sequential Tool Execution

**Parallel** (use `asyncio.gather` or batch tool calls):

- Independent queries (multiple file reads, parallel searches)
- Documentation lookups for multiple libraries
- Multiple test suite executions

**Sequential** (enforce dependencies):

- Search → Filter → Load pattern
- Overview → Specific Symbol → Modify flow
- Read → Transform → Write pipelines (prefer code execution here)

## Common Failure Modes & Safeguards

| Failure Mode | Prevention | Recovery | Token Impact |
| --- | --- | --- | --- |
| Skipping documentation | Enforce Context7 call prior to edits | Pause work, consult docs, reassess plan | Medium (one-time doc load) |
| Ignoring Microsoft-specific guidance | Require Microsoft Docs search/fetch whenever Azure/.NET/Windows topics arise | Run the missing doc queries, adjust implementation/tests per authoritative steps | Medium (targeted fetch) |
| Incomplete task lists | Maintain delegated to-do list; require completion check | Use Sequential-Thinking to regroup and redefine tasks | Low (planning overhead) |
| Untested code | Integrate tests into core loop | Run missing tests, capture outputs, re-validate | Low (test execution) |
| Rabbit holes | Reference plan; use thinking tools to recalibrate | Document dead ends, pivot based on validated info | **High** (wasted exploration) |
| Quality regressions | Apply DRY/SOLID/clean code reviews | Refactor with Serena tools, add tests proving compliance | Medium (refactor scope) |
| Lost context | Log key points in memory after each major step | Retrieve relevant memory, summarize, and continue | **High** (redundant tool calls) |
| **Tool Definition Bloat** | **Progressive loading, lazy discovery** | **Unload unused definitions, switch to code execution** | **Critical** (95%+ waste) |
| **Context Duplication** | **Filter results before returning to model** | **Refactor to code execution pattern** | **Critical** (50k+ tokens) |

## Memory Strategy

### Storage Principles

**Store** (in compressed form):

- Current task state (phase, blockers, next actions)
- Completed steps (outcomes only, not full transcripts)
- Doc findings (constraints, commands, API signatures - not prose)
- Test outcomes (pass/fail, failure details if applicable)
- Reusable patterns (file paths, symbol names, proven approaches)
- Notable errors (root cause + fix - not full stack traces)
- Performance insights (metrics, not raw logs)

### Retrieval Strategy

- **List first**: `list_memories` to identify relevant entries before loading
- **Targeted reads**: Load specific memories, not entire history
- **Context cache**: Store frequently-accessed data in local context object

### Curation Protocol

- **Periodic pruning**: Remove outdated or superseded entries
- **Version markers**: Tag memories with timestamps or version identifiers
- **Compression check**: Regularly audit memory sizes; rewrite verbose entries
- **Deduplication**: Consolidate redundant findings into canonical entries

### Token-Optimized Memory Format

```markdown
[Type: Decision | Pattern | Error | Constraint]
[Context: ProjectX/FeatureY | Library: foo v2.1]
[Summary: <20 words>]
[Details: <bullet points, no prose>]
[References: file:line, doc_url, related_memory_id]
```

## Worked Examples

### Feature Delivery Flow (Token-Optimized)

1. **Plan** feature with Sequential-Thinking (risks, dependencies, success metrics)
   - Store compressed plan in memory
   - Identify required documentation sources
2. **Progressive Research**:
   - Context7: resolve library IDs (cache in context) → fetch specific topics
   - Microsoft Docs: narrow search → extract constraints only
   - Store: commands, API signatures, version constraints (bullets, not docs)
3. **Explore** current code using Serena:
   - `get_symbols_overview` (map landscape)
   - `search_for_pattern` (find similar implementations)
   - Cache: relevant file paths and symbol names in context
4. **Implement** with minimal tool loading:
   - Load only needed symbol definitions
   - Use code execution for multi-step operations
   - Document decisions (compressed) as you go
5. **Test** using targeted shell commands:
   - Run affected test suites only
   - Capture: pass/fail, coverage delta, error summaries
6. **Validate** completion:
   - Thinking tools: adherence + completion checks
   - Update memory: outcomes, next steps, lessons learned (all compressed)

**Token Metrics**: Pre-request < 8k, inter-operation < 5k, total reduction ~85%

### Debugging Flow (Speed-Optimized)

1. **Diagnose** with Sequential-Thinking:
   - Hypothesize causes based on error symptoms
   - Prioritize investigation targets
2. **Locate** relevant code:
   - Parallel: `search_for_pattern` + `find_referencing_symbols` + error log grep
   - Cache: likely culprit file/symbol locations
3. **Targeted Research** (only if needed):
   - Context7: specific API behavior questions
   - Microsoft Docs: platform constraint validation
   - Extract: edge case documentation only
4. **Atomic Fix** via Serena:
   - Load single symbol definition
   - Apply minimal modification
   - Immediate test execution
5. **Verify and Log**:
   - Confirm fix resolves issue
   - Memory: root cause + fix location + test validation
   - Optional: Pattern memory for similar future issues

**Token Metrics**: Minimize documentation loading, rely on prior session knowledge, target ~90% reduction

---

Tailor every session to this enhanced blueprint so agents retain actionable memory, operate with maximum context efficiency, consistently meet professional standards, and deliver validated outcomes using optimal MCP patterns.

**Session Cleanup Mandate**: After completing tasks, before responding, always compress findings and use serena mcp tool to store compacted context for future sessions.
