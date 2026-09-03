# Especificação: Estrutura de Diretórios (Target State)

A árvore a seguir demonstra o estado final desejado para o workspace `infrastructure/` na raiz do projeto. Ela une as práticas do `Kustomize` (base/overlays) com o conceito de módulos de contexto (cortex, platform, studio, hub) para encapsular configurações específicas de `Docker Compose` e `Skaffold`.

```text
infrastructure/
├── package.json               # Novo workspace package (@tupynambalucas/infrastructure)
├── README.md
├── docs/                      # Guias de deploy e arquitetura da infraestrutura
├── .env                       # (ÚNICO) Arquivo centralizado contendo TODAS as variáveis de ambiente consolidadas
│
├── manifests/                 # (KUBERNETES BASE) Manifestos separados por tipo de recurso
│   ├── namespaces/            # Ex: cortex-ns.yaml, platform-ns.yaml
│   ├── deployments/           # Ex: memory-api-deploy.yaml, gateway-deploy.yaml
│   ├── services/              # Ex: memory-api-svc.yaml, grafana-svc.yaml
│   ├── ingresses/             # Ex: traefik-ingress.yaml
│   ├── configmaps/            # Ex: grafana-cm.yaml
│   ├── secrets/
│   ├── storage/
│   └── crds/
│
├── overlays/                  # (KUBERNETES ENVIRONMENTS) Configurações por ambiente
│   ├── dev/
│   │   ├── cortex/            # kustomization.yaml referenciando os recursos de manifests/
│   │   ├── platform/
│   │   └── studio/
│   ├── test/
│   └── prod/
│
├── charts/                    # Helm charts (reservado para expansões futuras)
│
├── cortex/                    # (MÓDULO DE CONTEXTO)
│   ├── skaffold.yaml          # Copiado e com caminhos relativos atualizados
│   └── compose.yaml           # Copiado de cortex/infrastructure/docker/compose.yaml
│
├── platform/                  # (MÓDULO DE CONTEXTO)
│   ├── skaffold.yaml
│   └── compose.yaml
│
├── studio/                    # (MÓDULO DE CONTEXTO)
│   ├── skaffold.yaml
│   └── compose.yaml
│
├── hub/                       # (MÓDULO DE CONTEXTO)
│   ├── compose.yaml
│   ├── compose.override.yaml
│   └── compose.prod.yaml
│
└── tools/                     # (MÓDULO DE CONTEXTO)
    └── github/
        └── compose.yaml
```

## Regras de Encapsulamento

1. **Manifestos Compartilhados:** `manifests/` e `overlays/` operam no nível do Kubernetes. Diferentes serviços podem compartilhar namespaces ou configmaps, garantindo um "Single Source of Truth" para os objetos do Cluster.
2. **Desenvolvimento Local:** As pastas de contexto (`cortex/`, `platform/`, etc) lidam inteiramente com a orquestração do loop local do desenvolvedor (`compose.yaml` e `skaffold.yaml`).
3. **Isolamento Total:** Nenhuma pasta "docker" ou "kubernetes" avulsa será criada na raiz de `infrastructure/`. O design força as configurações para dentro de seus domínios legítimos.
