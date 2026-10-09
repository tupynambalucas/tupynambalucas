# Plano de Arquitetura End-Game: Linux Nativo (Docker Engine + k3d + Headlamp)

## 1. Visão Geral

Este plano descreve a migração para a arquitetura "Raiz" (Pure Linux), o Santo Graal do desenvolvimento Cloud-Native. Ao invés de dependermos de aplicativos Desktop (Podman Desktop) e Máquinas Virtuais pesadas (Minikube), nós transformamos o WSL2 (Ubuntu) em um **Servidor Linux de Bare-metal**, onde o código, a Engine e o Kubernetes rodam perfeitamente integrados em um único ecossistema.

### A Stack de Ferramentas

- **Workspace:** WSL2 (Ubuntu 26.04 LTS).
- **Container Engine:** Docker Engine Oficial (Daemon nativo rodando via `systemd`, sem Docker Desktop).
- **Orquestrador K8s:** `k3d` (K3s in Docker - Executa o Kubernetes inteiro dentro de um container leve).
- **Painel de Controle:** Headlamp (UI do Kubernetes rodando no navegador).

---

## 2. Por que essa é a Arquitetura Definitiva? (Vantagens)

1. **Performance Absoluta (Zero Ponte Virtual):** O Docker Engine roda nativamente ao lado do seu código. Os mapeamentos de disco (Volumes) para o frontend (`hub:up`) usam o disco `ext4` diretamente, tornando as leituras de disco instantâneas.
2. **Clusters Instantâneos:** Enquanto o Minikube gasta minutos bootando uma VM inteira, o `k3d` cria um cluster novo do zero em **~5 segundos**, pois ele apenas sobe alguns containers no Docker.
3. **Multi-Cluster Leve:** Você pode criar 10 clusters isolados (ex: dev, staging, experiments) ao mesmo tempo sem fritar a memória do seu computador.
4. **Fim do `minikube:tunnel`:** O `k3d` consegue mapear as portas do Ingress (80/443) diretamente para o seu `localhost` nativo do Ubuntu no momento da criação. Você nunca mais vai precisar deixar um terminal aberto rodando um túnel.
5. **Menos Lixo no Windows:** Você pode desinstalar o Podman Desktop e o Docker Desktop do Windows. Eles gastam gigabytes de memória RAM apenas para manter a interface gráfica aberta. O Headlamp substituirá isso com maestria direto no navegador.

---

## 3. Guia de Execução e Instalação

### Etapa 1: Instalação do Ubuntu e Habilitação do SystemD

O Docker Engine precisa do gerenciador de serviços do Linux (`systemd`) ativado para gerenciar os containers no background.

1. No PowerShell (Administrador) do Windows:
   ```bash
   wsl --install -d Ubuntu-26.04
   ```
2. Após criar seu usuário/senha, acesse o Ubuntu e habilite o SystemD rodando:
   ```bash
   sudo sh -c 'echo -e "[boot]\nsystemd=true" > /etc/wsl.conf'
   ```
3. No PowerShell do Windows, reinicie o WSL para aplicar: `wsl --shutdown` e abra o Ubuntu de novo.

### Etapa 2: Instalar a Engine Pura (Docker-CE)

No Ubuntu, execute a instalação do Docker Oficial:

```bash
# Adicionar o repositório oficial do Docker
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Instalar o Docker Engine nativo
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Dar permissão para seu usuário rodar o docker sem "sudo"
sudo usermod -aG docker $USER
newgrp docker
```

### Etapa 3: Instalar as Ferramentas Modernas (k3d, pnpm, Skaffold)

Ainda no Ubuntu, instale a sua suíte de DevOps:

```bash
# 1. K3D (O Orquestrador Super Leve)
curl -s https://raw.githubusercontent.com/k3d-io/k3d/main/install.sh | bash

# 2. Kubectl e Skaffold
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install kubectl /usr/local/bin/
curl -Lo skaffold https://storage.googleapis.com/skaffold/releases/latest/skaffold-linux-amd64
sudo install skaffold /usr/local/bin/

# 3. Node, PNPM e FNM
curl -fsSL https://fnm.vercel.app/install | bash
source ~/.bashrc
fnm install 20
npm install -g pnpm
```

### Etapa 4: Clonar o Projeto e Criar o Cluster Nativo

Clone seu projeto para o Ubuntu (`~/projects/tupynambalucas`) e abra com `code .`.

A partir de agora, a criação do seu cluster será ultrarrápida e já embutida com as portas 80/443 expostas diretamente para o Ingress (Traefik).
Para criar o cluster oficial do monorepo, você rodará:

```bash
k3d cluster create tupynambalucas-cluster -p "80:80@loadbalancer" -p "443:443@loadbalancer"
```

### Etapa 5: Como fica o dia a dia?

Quando você for trabalhar na sua máquina de manhã, os passos encolhem drasticamente:

1. Abra o Ubuntu.
2. Não precisa rodar `minikube:up` nem tunelamento. Os containers do `k3d` já vão ligar sozinhos graças ao Docker Daemon (`systemd`).
3. Rode diretamente `pnpm infra:dev` (Skaffold). O Traefik será acessível imediatamente via `localhost`.
4. Acesse seu painel do **Headlamp** para gerenciar os pods.
5. Seus scripts do `package.json` de `podman compose` viram simplesmente `docker compose`.
