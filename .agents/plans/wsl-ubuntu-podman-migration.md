# Plano de Arquitetura: Migração para Workspace Nativo Linux (WSL2 + Podman)

## 1. Contexto e Justificativa (O "Por Quê?")

### Qual o papel do Podman se o Ubuntu vai rodar tudo?

É muito comum confundir "Linux" com "Container Engine".

- **O Ubuntu (WSL2)** é apenas o Sistema Operacional de base. Ele substitui o seu Windows para guardar os arquivos (`ext4`) e processar o Terminal (Bash/Zsh), resolvendo os gargalos de rede e I/O que vimos. Mas ele **não** roda containers nativamente.
- **O Podman** é o Motor de Containers (Container Engine). O Minikube **não é** um cluster autossuficiente; ele é um orquestrador leve que exige um "driver" base para simular e hospedar o cluster inteiro. No seu `package.json`, o script do cluster invoca isso explicitamente:
  `minikube start --driver=podman`
  O seu cluster inteiro vai rodar isolado dentro de um container do Podman.

Portanto, o Ubuntu é a **oficina** (onde o código e ferramentas como `pnpm` moram) e o Podman é o **motor** bruto isolado (que executa a imagem do K8s). A _WSL Integration_ faz a oficina enviar as ordens diretamente para o motor, de forma nativa e ultrarrápida!

**As vantagens da nova arquitetura:**

- **I/O Nativo (Sem Ponte Windows):** O código, o Skaffold e o `pnpm` rodarão dentro do Linux. O erro de exaustão de rede do proxy do Skaffold (`connectex: No connection could be made...`) que derrubou o Minikube desaparece para sempre.
- **Velocidade Bruta:** `pnpm install`, builds do TurboRepo e lintings serão de **5x a 10x mais rápidos**, operando sobre partições EXT4.
- **Hot-Reload Perfeito:** O File Watcher (Chokidar/Skaffold) usará a API nativa `inotify` do kernel Linux, que é instantânea e suporta infinitos eventos simultâneos sem engasgar.

---

## 2. Etapa a Etapa: Execução da Nova Arquitetura

### Etapa 1: Subir o Ubuntu e Recriar a Engine do Podman

1. **Escolher e Instalar o Ubuntu:** O ambiente ideal para o nosso cenário é sempre uma versão **LTS (Long Term Support)**, que garante estabilidade no kernel e bibliotecas compatíveis com o Node.js e ferramentas K8s. Consultando o catálogo oficial (`wsl -l -o`), a versão mais moderna e segura atualmente é a `Ubuntu-26.04`.
   No PowerShell do Windows (Administrador), rode:

   ```bash
   wsl --install -d Ubuntu-26.04
   ```

   _Aguarde a instalação finalizar e crie seu usuário e senha unix._

2. **Reconfigurar a Engine do Podman:** No PowerShell, apague a máquina com gargalo de memória e recrie a principal com os **8GB reais** necessários para aguentar o Minikube Kubernetes:
   ```bash
   podman machine stop tupynambalucas
   podman machine rm tupynambalucas
   podman machine init --name tupynambalucas --cpus=6 --memory=8192 --rootful
   podman machine start tupynambalucas
   ```

### Etapa 2: A Ponte Mágica (WSL Integration)

Essa etapa injeta o cliente CLI do Podman dentro do seu novo Ubuntu, conectando-o ao daemon engine `tupynambalucas`.

1. Abra o **Podman Desktop** no seu Windows.
2. Acesse **Settings** (Engrenagem) > **Resources** > **Podman**.
3. Procure pela seção **WSL Integration**.
4. Ative o toggle `(✔)` ao lado de **Ubuntu**.

### Etapa 3: Instalação do Tooling do Projeto no Ubuntu

Abra o terminal do seu **Ubuntu** e prepare a esteira DevOps principal:

1. **Instalar Dependências Base:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   sudo apt install -y curl git build-essential
   ```
2. **Instalar Node.js e PNPM:**
   ```bash
   curl -fsSL https://fnm.vercel.app/install | bash
   # Reinicie o terminal ou recarregue o bashrc executando 'source ~/.bashrc'
   fnm env --use-on-cd | source
   fnm install 20 # Ou a versão exata que você utiliza
   npm install -g pnpm
   ```
3. **Instalar o Minikube (Binário nativo Linux):**
   ```bash
   curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
   sudo install minikube-linux-amd64 /usr/local/bin/minikube
   ```
4. **Instalar Skaffold e kubectl:**
   ```bash
   curl -Lo skaffold https://storage.googleapis.com/skaffold/releases/latest/skaffold-linux-amd64 && \
   sudo install skaffold /usr/local/bin/
   # kubectl nativo do linux para o skaffold conversar com o minikube sem proxy do windows
   curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
   sudo install kubectl /usr/local/bin/
   ```

### Etapa 4: Clonagem e Migração do Código

Dentro do Ubuntu, crie sua pasta de projetos isolada do filesystem do Windows (ou seja, NÃO use a partição /mnt/c):

```bash
mkdir -p ~/projects
cd ~/projects
# Clone direto pelo Ubuntu:
git clone https://github.com/SeuUsuario/tupynambalucas.git
cd tupynambalucas
```

### Etapa 5: VSCode e Ponto de Partida

Estando no Ubuntu, inicie o VSCode na pasta atual (isso exige que a extensão oficial "WSL" esteja instalada no VSCode do Windows, o que cria a conexão Client-Server):

```bash
code .
```

- **Testando o Voo:** Agora, o terminal que você abrir no VSCode será `bash` do Ubuntu. Execute a trindade da infraestrutura:
  ```bash
  # 1. Instalação veloz com symlinks nativos do Linux:
  pnpm install

  # 2. Levantar o Minikube (usando o driver nativo do podman bridge)
  pnpm minikube:up

  # 3. Liberar as portas de Rede para o Navegador do Windows
  # (Abra um terminal separado no VSCode apenas para deixar esse túnel rodando)
  pnpm minikube:tunnel

  # 4. Subir o Kubernetes Skaffold (agora com File Sync via inotify nativo)
  pnpm infra:dev
  ```

A migração está 100% pronta. Você agora tem velocidade e I/O de bare-metal para rodar as pipelines locais mais complexas!
