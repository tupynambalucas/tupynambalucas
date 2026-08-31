# Evolução para Grafo de Propriedades (Property Graph)

## A Limitação da Extração Plana (Flat Chunking)

Ao particionar documentos grandes para indexação vetorial, as quebras geram contextos isolados ("chunks"). Se um agente RAG recupera um chunk do meio de uma documentação (ex: "Exemplo de Código: ..."), ele perde o propósito da página (O que é o componente pai? Qual o módulo?).

## Solução Enterprise: Janela Deslizante no Grafo (Graph-Sliding Window)

Utilizar a coleção `relations` para construir um **Grafo de Propriedades** real, onde entidades herdam e compõem outras entidades.

### Topologia do Grafo

- **Nó Principal (`doc_file`):** Representa o arquivo inteiro. Possui título, URL de origem, e resumo.
- **Nós Filhos (`doc_chunk`):** Representam seções específicas. Relacionam-se ao nó principal com `relationType: 'BELONGS_TO'`.
- **Relação de Ordem (`NEXT_CHUNK` / `PREVIOUS_CHUNK`):** Liga um chunk ao seguinte para navegação contígua.

### O Poder do `$graphLookup`

Ao recuperar o chunk semântico perfeito via `search_knowledge`, a API executará um `$graphLookup` silencioso no MongoDB para anexar o contexto hierárquico antes de entregar o Markdown para o LLM.

```javascript
{
  $graphLookup: {
    from: "relations",
    startWith: "$_id",
    connectFromField: "toId",
    connectToField: "fromId",
    as: "contextEdges",
    maxDepth: 1,
    restrictSearchWithMatch: { relationType: "BELONGS_TO" }
  }
}
```

### Impacto no Memory API

1. **Ingestão Inteligente:** A rota de ingestão deve construir as relações `NEXT_CHUNK` e `BELONGS_TO` durante o processo.
2. **Entity Resolution Tool:** Criar no MCP uma tool auxiliar `resolve_graph_entity` para que o agente, ao receber um ID de documento nos resultados, consiga expandir e ler os nós conectados ("Ler o próximo parágrafo").
