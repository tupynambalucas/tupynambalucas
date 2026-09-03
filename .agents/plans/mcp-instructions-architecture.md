# Architecture Plan: MCP Instructions Injection

## 1. Current State & Problems

Atualmente, as instruções sobre como usar as ferramentas (como regras de roteamento de rede para o Firecrawl e Playwright) estão duplicadas e injetadas de forma ineficiente:

1. Elas residem em arquivos `instructions.md` dentro de `cortex/mcp/services/*`.
2. O servidor gRPC `cortex/mcp/guardrails` utiliza o `response-enricher.ts` para interceptar a resposta de `tools/list` do AgentGateway e **anexa (append) todo o conteúdo do arquivo Markdown na propriedade `description` de CADA ferramenta**.
3. Já existe um arquivo centralizado de regras de Agente (`.agents/plugins/cortex/rules/AGENTS.md`) que já provê o mesmo contexto diretamente para o LLM.

**Por que isso é um Anti-Pattern (Má prática sênior)?**

- **Bloat de Token/Contexto:** Anexar um arquivo de instruções de 20-30 linhas na `description` de _todas_ as 6 ferramentas do Firecrawl repete a mesma string 6 vezes no schema JSON enviado para o LLM. Isso consome tokens excessivamente e confunde a atenção do LLM. O campo `description` deve conter apenas a descrição puramente técnica da ferramenta.
- **Acoplamento Inadequado (Vendor Lock-in):** Arquivos da infraestrutura base (`cortex/mcp/services` e `guardrails`) não devem conter referências engessadas ao projeto (ex: portas `3002`, nomes `hub-web`). Se essa infraestrutura for copiada para outro projeto, ela quebrará. Infraestrutura deve ser agnóstica.
- **Responsabilidade:** Instruções comportamentais ("Use o tool X invés do Y", "Mapeie a porta X") são responsabilidades da camada de _Client Context_ (o Agent IDE, via `.agents/rules`), ou, no protocolo MCP, da feature nativa de `prompts/list`, não de manipulação de _Tool Schemas_.

---

## 2. A Solução Ideal (Padrão Sênior / Enterprise)

A solução correta remove a injeção via `tools/list` e purifica a infraestrutura de configurações específicas do projeto.

### Passo A: Purificação da Infraestrutura (Remover `instructions.md`)

Os arquivos `instructions.md` dentro dos containers e subpastas de `cortex/mcp/services/` devem ser **deletados completamente**.
O código do `cortex/mcp/guardrails/src/processors/response-enricher.ts` deve ser limpo para **não injetar mais nada** nas descriptions das ferramentas. Isso deixa o AgentGateway mais rápido, o payload mais limpo, e a infraestrutura pronta para ser reaproveitada em qualquer outro projeto corporativo sem vazamento de escopo.

### Passo B: Centralização no Client-Side (Onde já está perfeito)

A forma mais madura de injetar instruções para agentes sobre como usar ferramentas em um projeto específico é utilizando a camada de Contexto (Context Injection) que já temos em funcionamento: **`.agents/plugins/cortex/rules/AGENTS.md`**.
O sistema Antigravity já lê e anexa este arquivo ao `System Prompt` do Agente automaticamente. E como a pasta `.agents` pertence logicamente às configurações _deste repositório_, é o local perfeito e semanticamente correto para colocar regras como "Porta 3002 é o Docusaurus".

### Passo C: Evoluir o Guardrail de Mutação (Opcional, mas Avançado)

Atualmente, o `request-mutator.ts` intercepta apenas a ferramenta `browser_navigate` e troca `localhost` por `host.docker.internal`.
Isso é uma prática de infraestrutura sênior brilhante (Network Transparent Proxying). Para melhorar, em vez de criar regras para usar o `host.docker.internal` na documentação do agente, o `request-mutator.ts` deveria ser generalizado:
Ele pode interceptar _qualquer_ ferramenta de _qualquer_ serviço, iterar sobre os argumentos recebidos, e sempre que encontrar um argumento do tipo URL (ou string que comece com `http://localhost`), reescrever para `host.docker.internal`. Dessa forma, os Agentes IAs não precisam nem ser instruídos a fazer a conversão; a infraestrutura corrige a rede de forma totalmente transparente e genérica, independente do projeto.

---

## 3. Resumo da Refatoração Recomendada

1. Deletar todos os arquivos `cortex/mcp/services/*/instructions.md`.
2. Refatorar o `response-enricher.ts` no `mcp/guardrails` para não mutar as descriptions. (Deixar apenas o fallback de `pass: {}`).
3. Manter as regras atuais do `.agents/plugins/cortex/rules/AGENTS.md` como a única Fonte da Verdade para o Agent Context.
4. Opcional: Expandir o `request-mutator.ts` para capturar campos `url` e `urls` (arrays) globalmente, tornando a infraestrutura super flexível.
