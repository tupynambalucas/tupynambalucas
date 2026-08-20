Guia de Implementação: Monitoramento de CPU e Memória para Grafana e FreeLens via OTel CollectorEste documento detalha a arquitetura e os passos necessários para habilitar a visualização do uso de CPU e Memória (RAM) de Pods e Nodes de um cluster Kubernetes, garantindo compatibilidade simultânea com painéis do Grafana e a interface nativa do FreeLens (ou Lens), utilizando o OpenTelemetry (OTel) Collector como agente central.1. O Problema ArquiteturalA arquitetura de monitoramento moderna incentiva o uso do OpenTelemetry Collector para coletar métricas, logs e traces. No entanto, ao tentar coletar métricas de infraestrutura (CPU/RAM) nativamente com o OTel (usando o receiver kubeletstats), esbarramos em um problema de compatibilidade:Padrão OTel: O receiver kubeletstats converte as métricas para a convenção semântica do OpenTelemetry (ex: k8s.pod.cpu.usage).O Limite do FreeLens: O FreeLens possui consultas (PromQL) codificadas de forma fixa em seu código-fonte, projetadas para ler as métricas clássicas expostas pelo cAdvisor / Kubelet (ex: container_cpu_usage_seconds_total). Ele não entende o padrão semântico do OTel.Sintoma: O Grafana exibe os dados normalmente (se os painéis forem ajustados para o OTel), mas o FreeLens exibe "N/A" nas colunas de CPU e RAM.1.1. A Solução (Abordagem Híbrida)Para manter o OTel Collector como o agente central da infraestrutura (evitando a instalação de múltiplos agentes) e garantir que o FreeLens funcione de forma "plug and play", utilizaremos o seguinte fluxo:O OTel Collector utilizará seu receiver embutido do prometheus para realizar o scrape direto no endpoint /metrics/cadvisor dos Nós do Kubernetes.Isso garante que as métricas mantenham a nomenclatura clássica esperada pelo FreeLens.O OTel Collector utilizará o exporter prometheusremotewrite para "empurrar" (push) essas métricas para o banco de dados do Prometheus.O Prometheus precisa ser configurado para aceitar recebimento de métricas remotas (Remote Write Receiver).2. Passo a Passo da ImplementaçãoAbaixo estão os manifestos e configurações necessários para realizar essa integração no namespace platform.Passo 2.1: Habilitar Remote Write no PrometheusPor padrão, o Prometheus apenas busca (scrape) métricas e não aceita que outros sistemas enviem dados para ele. Precisamos habilitar a feature flag --web.enable-remote-write-receiver.Edite o seu arquivo de deployment do Prometheus (prometheus.yaml):# prometheus.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
name: prometheus
namespace: platform
spec:
template:
spec:
containers: - name: prometheus
image: prometheus:latest
args: - --config.file=/etc/prometheus/prometheus.yml - --storage.tsdb.path=/prometheus - --web.enable-lifecycle # FLAG NECESSÁRIA PARA O OTel COLLECTOR FAZER PUSH: - --web.enable-remote-write-receiver
ports: - containerPort: 9090
Passo 2.2: Configurar Permissões (RBAC) para o OTel CollectorO OTel Collector fará o scrape de métricas protegidas do Kubernetes (Node/Kubelet). Para não receber erro 403 Forbidden, é obrigatório atrelar um ClusterRole ao ServiceAccount do collector.Adicione este bloco de RBAC aos manifestos da sua infraestrutura:# otel-rbac.yaml
apiVersion: v1
kind: ServiceAccount
metadata:
name: otel-collector
namespace: platform

---

apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
name: otel-collector-metrics
rules:

- apiGroups: [""]
  resources: ["nodes", "nodes/metrics", "nodes/stats", "nodes/proxy"]
  verbs: ["get", "list", "watch"]

---

apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
name: otel-collector-metrics
roleRef:
apiGroup: rbac.authorization.k8s.io
kind: ClusterRole
name: otel-collector-metrics
subjects:

- kind: ServiceAccount
  name: otel-collector
  namespace: platform
  Certifique-se de que o deployment do OTel Collector tenha a propriedade serviceAccountName: otel-collector.Passo 2.3: Configurar o OTel Collector (Pipeline)Edite o arquivo config.yaml do OTel Collector para incluir o scrape do Kubelet e o exporter Remote Write:# config.yaml (OTel Collector)
  receivers:
  otlp:
  protocols:
  grpc:
  endpoint: 0.0.0.0:4317
  http:
  endpoint: 0.0.0.0:4318

# Emulador do Prometheus embutido no OTel

prometheus:
config:
scrape_configs: # Coleta das suas aplicações - job_name: 'agentgateway'
scrape_interval: 15s
static_configs: - targets: ['agentgateway-metrics.cortex.svc.cluster.local:15001']

        # COLETA DE CPU E RAM DO KUBERNETES (cAdvisor)
        - job_name: 'kubernetes-cadvisor'
          scheme: https
          tls_config:
            ca_file: /var/run/secrets/kubernetes.io/serviceaccount/ca.crt
            insecure_skip_verify: true
          bearer_token_file: /var/run/secrets/kubernetes.io/serviceaccount/token
          kubernetes_sd_configs:
            - role: node
          relabel_configs:
            - action: labelmap
              regex: __meta_kubernetes_node_label_(.+)
            - target_label: __address__
              replacement: kubernetes.default.svc:443
            - source_labels: [__meta_kubernetes_node_name]
              regex: (.+)
              target_label: __metrics_path__
              replacement: /api/v1/nodes/${1}/proxy/metrics/cadvisor

fluentforward:
endpoint: 0.0.0.0:24224

exporters:
otlphttp/loki:
endpoint: 'http://loki:3100/loki/api/v1/push'

otlphttp/tempo:
endpoint: 'http://tempo:4318'

# EXPORTADOR PARA O PROMETHEUS LOCAL

prometheusremotewrite:
endpoint: "http://prometheus.platform.svc.cluster.local:9090/api/v1/write"
tls:
insecure: true

debug:
verbosity: detailed

processors:
batch:
send_batch_size: 8192
timeout: 1s
resource/fluentd:
attributes: - key: service.name
value: agentgateway
action: insert

service:
pipelines:
metrics:
receivers: [otlp, prometheus]
processors: [batch]
exporters: [prometheusremotewrite, debug] # Conecta receiver -> exporter

    logs:
      receivers: [otlp, fluentforward]
      processors: [resource/fluentd, batch]
      exporters: [otlphttp/loki, debug]

    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [otlphttp/tempo, debug]

3. Configurações Finais nas Ferramentas3.1. Validando no FreeLensAbra o FreeLens e acesse as configurações do cluster atual (engrenagem ou clique com botão direito na logo do cluster).Navegue até a seção Metrics.Em Prometheus Service Address, insira platform/prometheus:9090.Em Prometheus Type, selecione Auto Detect Prometheus ou Prometheus Operator.Vá para a tela de Pods. Aguarde 1-2 minutos para que as colunas de CPU e RAM comecem a ser populadas.3.2. Validando no GrafanaComo os dados injetados pelo OTel Collector estarão preservando o esquema de nomenclatura tradicional do Kubernetes, você poderá utilizar painéis de infraestrutura amplamente conhecidos na comunidade, sem necessidade de refatorar queries.Acesse o Grafana (grafana.local.tupynambalucas.dev).Acesse Dashboards > Import.Recomenda-se importar os dashboards oficiais do Kubernetes (via ID da Grafana Labs):ID 315 (Kubernetes cluster monitoring via Prometheus)ID 15757 (Kubernetes Views / Global)Selecione o seu Datasource Prometheus (já definido no datasources.yaml) ao importar.ConclusãoCom a implementação acima, a cluster torna-se independente de múltiplos agentes instalados, centralizando a telemetria no OpenTelemetry Collector e oferecendo compatibilidade simultânea tanto para o ecossistema customizado de Dashboards (Grafana) quanto para as ferramentas de operação e debug de clusters (FreeLens).
