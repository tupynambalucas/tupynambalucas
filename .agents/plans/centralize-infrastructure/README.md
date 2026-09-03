# Master Plan: Centralização da Infraestrutura (Workspace: infrastructure)

Este documento atua como o _Single Source of Truth_ (SSOT) para a reestruturação arquitetural da infraestrutura do monorepo `%PROJECT_DOMAIN%`. O objetivo é migrar os arquivos de Docker, Skaffold e Kubernetes – atualmente descentralizados e espalhados pelos bounded contexts (`cortex`, `platform`, `studio`, `hub`) – para um workspace unificado e modular chamado `infrastructure/` na raiz do projeto.

---

## 1. Resumo Executivo e Princípios Arquiteturais

A abordagem atual mistura código-fonte da aplicação com orquestração de infraestrutura. Isso dificulta a manutenção, polui o `package.json` principal e quebra o isolamento de responsabilidades.

Baseado nos princípios de Domain-Driven Design (DDD) e Feature-Sliced Design (FSD) documentados em `docs/handbook/explanation/principles/ddd-fsd.mdx`, aplicaremos as mesmas lógicas de limites de contexto para a infraestrutura.

Os princípios norteadores desta centralização são:

1. **Desacoplamento de K8s por Recurso:** Arquivos `.yaml` monolíticos do Kubernetes serão separados por tipo de recurso (deployments, services, ingresses) em uma pasta central `manifests/`.
2. **Contextos Modulares:** Evitar a criação de pastas genéricas como `docker` ou `kubernetes`. O novo workspace terá pastas que espelham os bounded contexts (ex: `cortex/`, `platform/`) mantendo os arquivos `.env`, `compose.yaml` e `skaffold.yaml` encapsulados e organizados.
3. **Workspace Autônomo:** Toda execução de scripts de infraestrutura (Minikube, Skaffold, Compose) será orquestrada por um `package.json` dedicado (`@tupynambalucas/infrastructure`), deixando o projeto raiz lidar apenas com roteamento via `pnpm --filter`.
4. **Overlays de Ambiente e Módulos Skaffold:** Utilização estrita do `Kustomize` nativo para estender os recursos base de `manifests/` em diferentes ambientes através de `overlays/`. Além disso, a documentação do Skaffold (analisada via Firecrawl) indica que a importação de dependências via bloco `requires` orquestrará a inicialização dos módulos (`cortex`, `platform`, etc) perfeitamente a partir do diretório unificado, mantendo suas ordens de execução corretas.

---

## 2. Mapa de Especificação (Sitemap)

Para especificações detalhadas, esquemas técnicos e passos de implementação, consulte os documentos individuais deste plano modular:

- **[Estrutura de Diretórios (DIRECTORY-STRUCTURE.md)](./DIRECTORY-STRUCTURE.md)**: A árvore de arquivos completa e detalhada do estado final (Target State).
- **[Refatoração do Kubernetes (KUBERNETES-REFACTOR.md)](./KUBERNETES-REFACTOR.md)**: Regras de separação de manifestos e estrutura de Overlays/Kustomize baseada em recursos.
- **[Fases de Execução (EXECUTION-PHASES.md)](./EXECUTION-PHASES.md)**: Guia passo-a-passo detalhando as etapas necessárias para realizar a migração sem interrupção de serviços.
