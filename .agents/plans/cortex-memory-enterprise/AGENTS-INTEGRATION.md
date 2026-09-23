# Integração MCP e Atualização do AGENTS.md (Regras de Gatilho)

Para que toda essa arquitetura complexa do MongoDB e do Docusaurus não seja desperdiçada, os agentes IA devem ser "treinados" a usar as ferramentas de forma proativa. O LLM não chama a ferramenta semântica se não julgar necessário. Para induzir o comportamento corporativo autônomo, modificaremos o `AGENTS.md`.

## Atualização das Tools do MCP `cortex-memory-mcp`

### Modificações de Schemas

1. **`search_knowledge`**:
   - Adicionar o parâmetro `filter` (objeto opcional) detalhando campos como `workspace`, `tags`, e `diataxis_type`.
   - Modificar a `description` da tool para educar o LLM. Ex: _"Utilize para realizar buscas semânticas, textuais e híbridas na base de conhecimento. Sempre invoque isso antes de supor uma implementação de código."_

2. **`resolve_graph_entity` (Nova Tool)**:
   - Tool dedicada que recebe o ID de um nó de contexto e retorna os Nós Vizinhos (`BELONGS_TO`, `NEXT_CHUNK`, `DEPENDS_ON`), habilitando "Graph Traversal" direto pelo agente.

3. **`store_episodic`**:
   - Enriquecer a descrição orientando o LLM: _"Utilize sempre que o usuário tomar uma decisão arquitetural, escolher uma linguagem, preferência de formatação ou alterar uma regra de negócios. Grave para sessões futuras."_

## Injeção de Regras de Gatilho no `AGENTS.md` (Context Router)

Em `cortex/AGENTS.md` e nos arquivos-raiz do monorepo, introduzir a subseção de **Autonomous Trigger Rules**:

```markdown
### Regras de Memória Cognitiva (Agent Behavior)

- **Search-First Policy:** Sempre use a ferramenta `search_knowledge` ANTES de gerar novos artefatos, responder sobre a estrutura de domínios (cortex, platform, studio), ou implementar configurações de infraestrutura.
- **Entity Expansion:** Se o resultado de uma busca apresentar apenas uma parte do código (um Doc Chunk) e você precisar ver o resto, chame a ferramenta de resolver o nó raiz do documento.
- **State Persistence:** A cada fim de tarefa (quando você confirmar sucesso com o usuário), faça um resumo da regra aprendida e invoque `store_episodic` com a flag `role: 'system'`.
```

Isso garante que a infraestrutura robusta seja efetivamente engajada pelo LLM de maneira natural, fechando o loop de RAG Enterprise (MongoDB) ⇄ Agente (MCP) ⇄ Humano.
