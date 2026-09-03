# Fases de Execução da Migração

A migração será realizada progressivamente em 5 fases para assegurar que nenhuma etapa quebre os ambientes de desenvolvimento.

---

## Fase 1: Criação do Workspace e Migração de Scripts

**Objetivo:** Isolar as dependências e scripts de orquestração do projeto raiz.

1. Criar o diretório `infrastructure/` na raiz do projeto.
2. Criar `infrastructure/package.json` (`name: "@tupynambalucas/infrastructure"`, privado).
3. Migrar os blocos de scripts (ex: `// Hub Context`, `// Cortex Context`, `// Kubernetes Context`) do `package.json` raiz para o novo `infrastructure/package.json`.
4. Atualizar o `package.json` da raiz para utilizar chamadas delegadas:
   `"cortex:up": "pnpm --filter @tupynambalucas/infrastructure cortex:up"`.

## Fase 2: Migração Modular dos Arquivos de Contexto

**Objetivo:** Copiar arquivos de docker e skaffold para os novos módulos, mantendo os originais como backup.

1. Criar `infrastructure/cortex`, `infrastructure/platform`, `infrastructure/studio`, `infrastructure/hub` e `infrastructure/tools/github`.
2. Consolidar TODOS os arquivos `.env` das subpastas originais (cortex, platform, studio, etc) em um **único** arquivo `infrastructure/.env` na raiz do novo workspace.
3. **Copiar** (não mover) todos os artefatos `compose*.yaml` das subpastas antigas para seus novos locais modulares.
4. **Copiar** (não mover) os orquestradores principais (ex: `cortex/skaffold.yaml`) para `infrastructure/cortex/skaffold.yaml`.
5. **Crítico - Resolução de Caminhos (Documentação Oficial Skaffold):**
   De acordo com a documentação do Skaffold, a maioria dos arquivos é resolvida relativamente ao diretório de execução atual, com duas grandes exceções que devemos aplicar:
   - **Artefatos de Build:** Caminhos de artefatos são relativos ao `context` do artefato. Portanto, ajustaremos o `context:` das imagens para apontar para o diretório raiz original do contexto (ex: `context: ../../cortex`).
   - **Dependências de Configuração (`requires:`):** Caminhos em configs importadas são resolvidos em relação ao diretório onde o arquivo importado está. Ajustaremos os blocos `requires` no `skaffold.yaml` principal e nos módulos para refletir a nova estrutura (ex: `path: ../platform/skaffold.yaml`).
   - No Docker Compose, ajustaremos o parâmetro `env_file` para apontar para o `../.env` recém unificado na raiz da infra.

## Fase 3: Desmembramento dos Manifestos Kubernetes

**Objetivo:** Aplicar o padrão `KUBERNETES-REFACTOR.md` copiando e estruturando, preservando a base legada.

1. Criar a estrutura base de K8s: `infrastructure/manifests/` e suas subpastas `deployments`, `services`, `ingresses`, etc.
2. Iterar sobre todos os arquivos `.yaml` de infraestrutura presentes nos contextos originais (`cortex/infrastructure/kubernetes`, `platform/...`).
3. **Copiar** o conteúdo e separar cada tipo de recurso salvando nas subpastas apropriadas de `manifests/`.

## Fase 4: Reconfiguração Kustomize (Overlays)

**Objetivo:** Conectar a configuração do desenvolvedor com os manifestos base.

1. Criar as pastas de ambiente `infrastructure/overlays/dev/<contexto>/`.
2. Criar os arquivos `kustomization.yaml` nesses overlays apontando para os manifestos desmembrados (via bloco `bases:` ou `resources:` relativos).
3. Atualizar os arquivos `skaffold.yaml` (na nova estrutura) para usar o caminho Kustomize atualizado: `../overlays/dev/<contexto>`.

## Fase 5: Validação de Nova Infraestrutura (Preservação de Legado)

**Objetivo:** Garantir a estabilidade da nova estrutura mantendo um backup de segurança.

1. Ajustar o `skaffold.yaml` da raiz para referenciar corretamente os arquivos `skaffold.yaml` que agora residem em `infrastructure/<contexto>/skaffold.yaml`.
2. Executar validações de deploy (`pnpm platform:up`, `skaffold dev`, etc.) a partir da nova arquitetura.
3. **Regra Absoluta:** **NÃO APAGAR** os arquivos/pastas de infraestrutura antigos (`cortex/infrastructure`, `cortex/skaffold.yaml`, etc). Eles atuarão como fallback e fonte de consulta. A exclusão será feita manualmente pelo usuário quando a nova infraestrutura provar 100% de estabilidade.
