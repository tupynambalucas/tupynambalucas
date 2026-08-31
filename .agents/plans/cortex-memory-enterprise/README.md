# Cortex Memory Enterprise Architecture Plan

Este plano detalha a evolução do subsistema Cortex Memory para atingir um nível de maturidade corporativa (Enterprise RAG). A estrutura atual, que já consolida a busca vetorial via MongoDB 7.0 e indexação básica de grafos, será expandida para utilizar Busca Híbrida (Hybrid Search), Grafos de Propriedades (Property Graphs) e Metadados Semânticos Avançados através do Docusaurus.

## 🗂️ Estrutura do Plano

A análise e o plano de implementação estão divididos nos seguintes documentos técnicos:

1. **[HYBRID-SEARCH-AND-RRF.md](./HYBRID-SEARCH-AND-RRF.md)**  
   Detalha a implementação de Busca Híbrida utilizando `$vectorSearch` em conjunto com `$text` (Atlas Search) e a fusão de resultados através do algoritmo Reciprocal Rank Fusion (RRF).

2. **[PROPERTY-GRAPH.md](./PROPERTY-GRAPH.md)**  
   Mapeia a transição de arestas simples para Grafos de Propriedades no MongoDB. Explica como modelar relações (Parent-Child, Siblings) e utilizar `$graphLookup` para recuperar Contextos em Janelas Deslizantes.

3. **[DOCUSAURUS-METADATA.md](./DOCUSAURUS-METADATA.md)**  
   Define o padrão rigoroso de SEO-IA para o Docusaurus: enriquecimento de _Frontmatter_ (tags, keywords, diataxis_type) e ingestão dinâmica com filtragem meta-dinâmica (Dynamic Meta-Filtering).

4. **[AGENTS-INTEGRATION.md](./AGENTS-INTEGRATION.md)**  
   Especifica as melhorias necessárias no plugin MCP (`@tupynambalucas/cortex-mcp`) e as **Regras de Gatilho (Trigger Rules)** para treinar os agentes autônomos por meio do arquivo `AGENTS.md`.

---

## 🎯 Objetivo Arquitetural

Garantir que a memória dos agentes não apenas responda a similaridades semânticas (RAG tradicional), mas seja capaz de raciocinar sobre a _estrutura_ do projeto, encontrar IDs e termos exatos com precisão, e recuperar o contexto hierárquico dos documentos. O agente deverá consultar o banco de forma iterativa e natural.
