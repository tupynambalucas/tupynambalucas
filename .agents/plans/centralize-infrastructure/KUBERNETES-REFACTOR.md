# Especificação: Refatoração do Kubernetes (Kustomize & Resources)

Este documento detalha como refatoraremos os manifestos atuais de Kubernetes, deixando a abordagem monolítica e migrando para uma estrutura profissional separada por recursos, utilizando a capacidade nativa de patches do `Kustomize`.

## 1. O Problema Atual

No momento, arquivos como `cortex/infrastructure/kubernetes/gateway.yaml` e `platform/infrastructure/kubernetes/traefik.yaml` declaram múltiplos recursos do Kubernetes (ex: `Deployment`, `Service`, `ConfigMap`) dentro de um mesmo arquivo separados por `---`. Isso dificulta a modularização, reuso e manutenção.

## 2. Padrão-Alvo: K8s Resource Split

Todos os manifestos base (que formam o esqueleto da aplicação independente de ambiente) devem ser desmembrados e agrupados pelo tipo de recurso em `infrastructure/manifests/`.

### Exemplo de Desmembramento do Gateway:

O arquivo monolítico atual se dividirá em:

- `infrastructure/manifests/deployments/gateway-deploy.yaml`
- `infrastructure/manifests/services/gateway-svc.yaml`

### Exemplo de Kustomization Base (`infrastructure/manifests/kustomization.yaml`):

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - deployments/gateway-deploy.yaml
  - services/gateway-svc.yaml
  - namespaces/cortex-ns.yaml
```

_(Nota: a granularidade exata de onde fica o `kustomization.yaml` base pode ser ajustada, desde que fique centralizada no `manifests/`)_

## 3. Gestão de Ambientes (Overlays)

Os arquivos `skaffold.yaml` localizados nas pastas de módulos (ex: `infrastructure/cortex/skaffold.yaml`) vão referenciar o `kustomization.yaml` contido em `infrastructure/overlays/dev/cortex/`.

```yaml
# infrastructure/overlays/dev/cortex/kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

bases:
  - ../../../../manifests/

# Aqui ficam as injeções específicas do ambiente de desenvolvimento:
# resources: (arquivos que só sobem em dev, ex: banco mock)
# patchesStrategicMerge: (escalas de CPU menores, varáveis de dev)
```

## Benefícios

- **Padrão de Indústria:** Total aderência com práticas recomendadas pelo próprio Kustomize e ecossistema CNCF.
- **Evita Duplicação:** Múltiplos ambientes podem consumir as exatas mesmas regras base definidas no `manifests/`, bastando adicionar um patch no `overlays/`.
