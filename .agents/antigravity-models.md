# Antigravity Models and Effort Levels

Google Antigravity utilizes multiple AI model families, including Gemini, Claude, and GPT variants,
for agent orchestration and code generation. Model selection and thinking effort configurations
determine latency, operational cost, and reasoning capability.

## 1. Available Models

Models are categorized to address distinct operational requirements across different AI providers.

### Gemini Family

#### Gemini 3.1 Pro

- Purpose: Complex tasks, deep reasoning, large-scale refactoring, architectural planning, and
  multi-step problem resolution.
- Advantages: Maximum fidelity and analytical capacity.
- Token Usage: High.

#### Gemini Flash (3.6, 3.7, 3.8)

- Versions: Includes iterative releases such as Gemini 3.6 Flash, Gemini 3.7 Flash, and
  Gemini 3.8 Flash.
- Purpose: Daily tasks, information retrieval, file analysis, quick searches, and standard coding.
- Advantages: Optimal cost-benefit ratio. Balances high performance with low latency for
  high-volume operations.
- Token Usage: Low to Medium.

#### Gemini Flash Lite

- Purpose: Extremely simple tasks, triage, basic formatting, and highly cost/latency-sensitive
  applications.
- Advantages: Highest speed and most economical operation within the Gemini family.
- Token Usage: Very Low.

### Claude Family (Anthropic)

#### Claude Sonnet 4.6 (Thinking)

- Purpose: Balanced execution for standard development, code generation, and complex analysis.
- Advantages: Strong reasoning capabilities with optimized speed and cost. Supports internal
  thinking processes.
- Token Usage: Medium.

#### Claude Opus 4.6 (Thinking)

- Purpose: Advanced reasoning, deep architectural design, and complex multi-step systemic problems.
- Advantages: Maximum cognitive capability from Anthropic, providing highly accurate and detailed
  solutions. Supports extensive internal thinking processes.
- Token Usage: High.

### GPT Family

#### GPT-OSS 120B (Medium)

- Purpose: General-purpose development and open-source model experimentation.
- Advantages: Offers a capable open-weight alternative for standard coding tasks and balanced
  workloads.
- Token Usage: Medium.

## 2. Thinking Levels and Effort

Certain models, such as Gemini 3.1 Pro and the Claude 4.6 Thinking series, support configuring
internal reasoning depth via thinking levels. These levels balance response time, cost, and
analytical quality. Internal reasoning consumes thinking tokens during execution.

### Low

- Mechanism: Utilizes minimal internal reasoning, bypassing extended chain-of-thought analysis for
  direct responses.
- Advantages: Extremely fast response times and minimal cost.
- Use Case: Direct tasks, quick inquiries, simple refactoring, and latency-critical operations.
- Token Consumption: Typically generates between 200 and 500 thinking tokens per request.

### Medium

- Mechanism: Balanced tier providing sufficient chain-of-thought analysis for standard tasks.
- Advantages: Efficient for standard production workloads. Represents the recommended default
  configuration.
- Use Case: Daily development, moderate code analysis, and standard feature creation.
- Token Consumption: Typically generates between 1,000 and 3,000 thinking tokens per request.

### High

- Mechanism: Engages full reasoning capacity, executing extensive deliberation before generating a
  response.
- Advantages: Maximizes success rate and accuracy for highly complex and systemic problems.
- Use Case: Complex bug resolution, advanced architectures, and multi-step systemic refactoring.
- Token Consumption: Generates several thousand to tens of thousands of thinking tokens.

Thinking tokens count towards the request's output token quota. The configured maximum output limit
must accommodate both the reasoning phase and the final response output.
