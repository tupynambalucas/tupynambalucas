# Docusaurus Frontmatter Enriquecido & Filtragem Dinâmica (Dynamic Meta-Filtering)

## A Importância do Metadado para RAG IA

Um agente RAG funciona excepcionalmente melhor se ele puder **filtrar** e focar sua busca antes de depender unicamente da semântica espacial. Para isso, os documentos originais precisam conter uma taxonomia rigorosa.

## O Padrão Docusaurus (SEO-IA)

No diretório `docs/workspaces/`, cada arquivo `.mdx` deve receber um bloco YAML enriquecido (Frontmatter).

```yaml
---
title: Ingress Gateway
sidebar_label: Ingress
sidebar_position: 1
tags: ['cortex', 'network', 'ingress', 'traefik', 'agentgateway']
keywords: ['proxy', 'roteamento', 'mcp']
diataxis_type: 'explanation'
workspace: 'cortex'
---
```

## Extração via `gray-matter`

A ferramenta de ingestão (`memory-api` IngestionService) deve ser atualizada para parsear nativamente o frontmatter YAML (usando `gray-matter` ou utilitário equivalente) antes de "chunkificar" o documento.

- Os metadados (`tags`, `workspace`, `diataxis_type`) tornam-se atributos JSON em nível raiz do documento `EntityModel` no MongoDB.

## Dynamic Meta-Filtering no `$vectorSearch`

O MongoDB suporta campos `filter` nativos em queries vetorizadas. A ferramenta `search_knowledge` do MCP deve ser estendida para aceitar filtros.

```typescript
// MCP Tool Schema Update:
export const searchToolSchema = z.object({
  query: z.string(),
  limit: z.number().optional().default(5),
  filter: z
    .object({
      workspace: z.string().optional(),
      diataxis_type: z.string().optional(),
    })
    .optional(),
});
```

**Comportamento Autônomo:** Se o agente falhar em entender "como usar o Nginx" porque recebeu muito conteúdo de tutoriais, ele pode intencionalmente rodar um novo search definindo `filter: { diataxis_type: 'reference' }` para conseguir especificações de arquivos.
