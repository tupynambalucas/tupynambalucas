# **Guia de Resolução: Acesso Local com Kubernetes, Traefik e Domínios .dev**

Este documento detalha as causas e as soluções para o erro ERR_CONNECTION_RESET ao tentar acessar um ambiente de desenvolvimento local utilizando um domínio .dev real apontado para 127.0.0.1 através do Cloudflare.

## **1\. Entendendo o Problema**

A sua configuração no Cloudflare (apontando \*.local para 127.0.0.1 com proxy desativado) está **correta**. O erro ERR_CONNECTION_RESET não é um erro de DNS. Ele indica que o seu navegador encontrou o seu computador (127.0.0.1), mas a conexão foi derrubada ativamente.

### **As Duas Causas Raízes:**

1. **A Armadilha do TLD .dev (HSTS Preload):** Todo domínio terminado em .dev exige, em nível de navegador (Chrome, Edge, Firefox), o uso estrito de HTTPS. Se você tentar acessar http://gateway-admin..., o navegador automaticamente altera para https:// na porta 443\. Se o seu Traefik não estiver preparado para responder com TLS (SSL) nessa porta, a conexão cai instantaneamente.
2. **Exposição de Portas do Host:** O seu cluster Kubernetes local (criado via k3d, minikube, Docker Desktop, etc.) precisa ter as portas 80 e 443 fisicamente abertas e mapeadas para a sua máquina host (localhost). Se não estiverem, o tráfego bate no seu PC e morre antes de chegar ao Traefik.

## **2\. Passo a Passo para Resolução**

### **Fase 1: Garantir a Exposição das Portas 80 e 443**

O primeiro passo é garantir que o tráfego consiga chegar ao Ingress Controller (Traefik) a partir do seu navegador.

**Opção A: Teste Rápido (Port-Forward)**

A forma mais rápida de testar se o problema é roteamento de porta é forçar o mapeamento diretamente para o serviço do Traefik.

\# Substitua "traefik" pelo nome do seu serviço Traefik e "-n" pelo namespace correto  
sudo kubectl port-forward svc/traefik 80:80 443:443 \-n kube-system

_(Nota: No Linux/macOS, expor portas baixas como 80/443 exige privilégios de administrador/sudo)._

**Opção B: Configuração Definitiva no Cluster Local**

Se você usa ferramentas como k3d ou kind, você deve mapear as portas na criação do cluster.

- **k3d:**  
  k3d cluster create meu-cluster \-p "80:80@loadbalancer" \-p "443:443@loadbalancer"

- **kind:** É necessário um arquivo de configuração (ex: kind-config.yaml) definindo os extraPortMappings para as portas 80 e 443 apontando para os _nodes_ do cluster.
- **Docker Desktop (Kubernetes embutido):** Geralmente o LoadBalancer provisionado nativamente já expõe as portas no localhost automaticamente.

### **Fase 2: Criação de Certificados TLS Locais Confiáveis**

Como o domínio .dev exige HTTPS, vamos criar um certificado válido para o seu ambiente local usando a ferramenta mkcert. Isso evitará o aviso vermelho de "Sua conexão não é particular".

1. **Instale o mkcert:**
   - **Windows:** choco install mkcert (via Chocolatey) ou baixe o binário.
   - **macOS:** brew install mkcert
   - **Linux:** sudo apt install libnss3-tools e baixe o binário.
2. **Instale a CA Local (Autoridade Certificadora):**  
   mkcert \-install

3. **Gere os certificados para o seu domínio:**  
   mkcert "\*.local.tupynambalucas.dev"

   _Isso criará dois arquivos na pasta atual: um .pem (certificado) e um \-key.pem (chave privada)._

### **Fase 3: Inserir o Certificado no Kubernetes**

O Traefik precisa desses arquivos para apresentar ao navegador.

1. **Crie uma Secret TLS no namespace onde sua aplicação vai rodar:**  
   kubectl create secret tls local-tls-secret \\  
    \--cert=\_wildcard.local.tupynambalucas.dev.pem \\  
    \--key=\_wildcard.local.tupynambalucas.dev-key.pem \\  
    \-n seu-namespace-da-aplicacao

2. **Configure o seu Ingress para usar o TLS:**  
   Modifique o manifesto YAML que expõe o seu gateway-admin. Se você estiver usando o recurso padrão Ingress, adicione a seção tls:  
   apiVersion: networking.k8s.io/v1  
   kind: Ingress  
   metadata:  
    name: gateway-admin-ingress  
    namespace: seu-namespace-da-aplicacao  
    annotations:  
    traefik.ingress.kubernetes.io/router.entrypoints: websecure  
   spec:  
    tls:  
    \- hosts:  
    \- gateway-admin.local.tupynambalucas.dev  
    secretName: local-tls-secret \# Nome da secret criada no passo anterior  
    rules:  
    \- host: gateway-admin.local.tupynambalucas.dev  
    http:  
    paths:  
    \- path: /  
    pathType: Prefix  
    backend:  
    service:  
    name: gateway-admin \# O nome do seu serviço real  
    port:  
    number: 80 \# A porta interna do seu pod/serviço

_(Se você usa o CRD IngressRoute nativo do Traefik, basta adicionar a propriedade tls: secretName: local-tls-secret na raiz da spec)._

### **Fase 4: Integrando com o Skaffold**

O Skaffold, por padrão, tenta facilitar sua vida fazendo port-forward automático de todos os serviços que ele encontra. Como agora você tem uma estrutura de Ingress madura configurada, você não quer que o Skaffold interfira no acesso principal.

No seu skaffold.yaml, você pode gerenciar o comportamento do port-forward. Se você deseja continuar acessando apenas pelas URLs limpas (via Ingress), você pode desativar o port-forward automático de serviços para evitar conflitos:

\# Trecho do skaffold.yaml  
portForward:  
 \- resourceType: service  
 resourceName: traefik  
 namespace: kube-system  
 port: 80  
 localPort: 80  
 \- resourceType: service  
 resourceName: traefik  
 namespace: kube-system  
 port: 443  
 localPort: 443

_(Você pode forçar o Skaffold a garantir que as portas do Traefik estejam mapeadas para o seu localhost durante a execução, como no exemplo acima, caso o cluster não exponha nativamente)._

## **3\. Teste Final**

1. Garanta que o Skaffold está rodando (skaffold dev).
2. Abra o navegador e digite explicitamente: **https://gateway-admin.local.tupynambalucas.dev**
3. A página deve carregar corretamente e o ícone do cadeado no navegador deve estar fechado (seguro), confirmando que o tráfego está passando localmente, com TLS válido, roteado pelo Traefik.
