# Busca Híbrida e Reciprocal Rank Fusion (RRF)

## O Problema Atual

A atual estratégia do `memory-api` repousa exclusivamente na similaridade de vetores (`$vectorSearch`). O RAG puramente vetorial falha criticamente quando a busca exige:

- Correspondência exata de termos corporativos.
- Busca por IDs específicos (ex: `TS-492`, UUIDs).
- Nomes de funções ou variáveis precisas (ex: `useMemoryStore`).

## Solução Enterprise: Hybrid Search

A busca híbrida combina a compreensão semântica (vetores) com a precisão do BM25 ou TF-IDF (busca por palavra-chave). O algoritmo **Reciprocal Rank Fusion (RRF)** normaliza os resultados de ambos e os mescla em um ranking superior.

### Modificações no `memory-api` (MongoDB)

1. **Configuração de Índices:**
   Além do índice vetorial (Vector Search Index) na coleção `entities`, será necessário criar um índice de texto (`$text` ou Atlas Search Index) nos campos `content` e `name`.

2. **Pipeline de Agregação MongoDB:**
   A rota `/api/memory/search` passará a executar múltiplas requisições em paralelo (ou um pipeline duplo se suportado na versão self-hosted) e combinar no backend da API:

   ```typescript
   // Exemplo conceitual da lógica a ser aplicada na camada de serviço
   const vectorResults = await EntityModel.aggregate([
     {
       $vectorSearch: {
         index: 'vector_index',
         queryVector: embeddedQuery,
         path: 'embedding',
         numCandidates: limit * 10,
         limit: limit,
       },
     },
   ]);

   const textResults = await EntityModel.find(
     { $text: { $search: query } },
     { score: { $meta: 'textScore' } },
   )
     .sort({ score: -1 })
     .limit(limit);

   // O Motor RRF Rre-ranqueia as entidades:
   const rrfScore = (rank: number) => 1 / (60 + rank);
   // Combinar e ordenar.
   ```

### Benefício para o Agente IA

Quando o agente utilizar a ferramenta MCP `search_knowledge`, a busca suportará tanto perguntas semânticas ("Como funciona a injeção de dependência?") quanto termos exatos ("Configuração nginx.conf da tela branca"), eliminando falhas de alucinação contextuais.
