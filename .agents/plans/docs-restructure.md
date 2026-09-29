# Plano de Refatoração: Estrutura de Documentação (Knowledge Base)

## 1. Objetivo
Refatorar o workspace de documentação atual (atualmente localizado em `/docs`), adotando um novo nome e uma arquitetura em camadas (layered). 

O processo será focado em uma **migração não-destrutiva**: copiaremos os arquivos (ao invés de simplesmente movê-los) mantendo a pasta `/docs` original intocada como backup. Após a validação da nova estrutura no build global do monorepo, a pasta antiga será apagada.

## 2. Nova Arquitetura (Layered)
A estrutura separa fisicamente os arquivos Markdown (Conteúdo) das configurações do Node/React (Motor do Docusaurus).

```text
knowledge-base/
├── knowledge-base/                        # Pacote agnóstico apenas com o conteúdo
│   ├── github/                  # Arquivos root (README.md, LICENSE.md, etc.)
│   ├── templates/               # Templates usados pelo workspace 'renderer'
│   └── monorepo/                # 💡 Documentação central do projeto
│       ├── handbook/            
│       ├── roadmap/             
│       ├── releases/            
│       └── workspaces/          
│
└── docusaurus/                  # Ecossistema de Configuração, Build e UI
    ├── services/                
    │   └── monorepo/            # Aplicativo principal (Docusaurus) 
    └── packages/                
        ├── preset/              
        └── theme/               
```

## 3. Plano de Ação (Migração Segura)

### Fase 1: Criação da Estrutura e Cópias
1. Criar a raiz `/knowledge-base` e as subpastas `knowledge-base/monorepo`, `docusaurus/services`, `docusaurus/packages`.
2. **Copiar** as pastas de conteúdo:
   - De `/knowledge-base/services/docusaurus/{handbook, roadmap, workspaces, releases}` para `/knowledge-base/knowledge-base/monorepo/`.
3. **Copiar** as bases do Docusaurus:
   - A aplicação base (`knowledge-base/services/docusaurus`) vai para `/knowledge-base/docusaurus/services/monorepo` (excluindo os diretórios markdown acima).
   - As pastas de pacotes (`knowledge-base/packages/*`) vão para `/knowledge-base/docusaurus/packages/`.

### Fase 2: Ajuste de Relacionamento (Paths Internos)
1. **`.../preset/src/plugins/content-knowledge-base/instances.ts`**:
   - Ajustar o caminho das instâncias para resolver a nova pasta externa: `path: '../../../knowledge-base/monorepo/handbook'`, etc.
2. **`.../services/monorepo/docusaurus.config.ts`**:
   - Ajustar as chamadas ou atalhos para se alinharem ao novo design.

### Fase 3: Desacoplamento da Antiga Pasta `docs` (Raiz do Monorepo)
1. **`pnpm-workspace.yaml`**:
   - Remover: `- 'knowledge-base/packages/*'` e `- 'knowledge-base/services/*'`
   - Adicionar: `- 'knowledge-base/docusaurus/packages/*'` e `- 'knowledge-base/docusaurus/services/*'`
2. **`tsconfig.json`**:
   - Mudar a ref de `{ "path": "./docs" }` para `{ "path": "./knowledge-base" }`.
3. **`eslint.config.ts`**:
   - Alterar filtros que usam `knowledge-base/**/*.{ts,tsx,js,jsx}` para cobrir a nova árvore: `knowledge-base/**/*.{ts...}`.
4. **`package.json`**:
   - Atualizar a seção `"// Docs Context"` para acomodar novos paths ou nomenclaturas, se necessário.

### Fase 4: Atualização da Infraestrutura (Docker, Skaffold, Memória)
1. **`.../services/monorepo/Dockerfile`**:
   - `COPY knowledge-base/ knowledge-base/` ➡️ `COPY knowledge-base/ knowledge-base/`.
   - `WORKDIR ...` atualizado.
2. **`infrastructure/skaffold.yaml`**:
   - Atualizar a imagem que compila o Docusaurus para o novo Dockerfile.
   - Atualizar as rotas do bloqueio de hot-reload (`sync/manual`).
3. **`cortex/memory/services/api/Dockerfile`**:
   - O RAG injeta a docs no boot. Trocar o COPY da pasta `knowledge-base/services/...` para `knowledge-base/knowledge-base/monorepo/...`.
4. **`cortex/memory/AGENTS.md`**:
   - Atualizar as referências técnicas de `knowledge-base/` para as novas.

### Fase 5: Documentação e Governança do Workspace (Arquivos Raiz)
Garantir o alinhamento com as regras do monorepo para workspaces "Layered".

1. **Configuração TypeScript (`tsconfig.json`)**:
   - Criar `knowledge-base/tsconfig.json` que faz o roteamento das referencias internas `{ "path": "./docs" }` e `{ "path": "./docusaurus" }`.
   - Criar `knowledge-base/knowledge-base/tsconfig.json` (se possuir sub-pacotes) e `knowledge-base/docusaurus/tsconfig.json` (mapeando internamente `packages/preset`, `packages/theme`, `services/monorepo`), mantendo o padrão do monorepo atual.
2. **Governança de Agentes (`AGENTS.md`)**:
   - *A skill `@agent-router-expert` foi devidamente analisada contra as diretrizes em `workspaces/agents/...` e encontra-se 100% atualizada (reflete hierarquia, budget de linhas e formatação sem emojis/TODOs).*
   - Invocaremos a skill `agent-router-expert` para gerar os manifestos:
     - `knowledge-base/AGENTS.md` (Bounded Context)
     - `knowledge-base/knowledge-base/AGENTS.md` (Sub-Domain)
     - `knowledge-base/docusaurus/AGENTS.md` (Sub-Domain)
3. **Páginas de Apresentação (`README.md`)**:
   - Invocaremos a skill `markdown-expert` para gerar as descrições da arquitetura nas raízes do novo formato layered:
     - `knowledge-base/README.md`
     - `knowledge-base/knowledge-base/README.md`
     - `knowledge-base/docusaurus/README.md`

### Fase 6: Validação
1. Rodar `pnpm install` e testar `skaffold` (ou o docusaurus local).
2. Deletar `/docs` antigo após total garantia operacional.
