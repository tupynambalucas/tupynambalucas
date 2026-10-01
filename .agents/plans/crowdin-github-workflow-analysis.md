# Crowdin + GitHub App Workflow Analysis

Este documento analisa a transição do modelo atual de _Build-time Sync_ (sincronização durante o build) para o modelo de _Git-based Sync_ (sincronização via Pull Requests) utilizando a integração nativa do Crowdin com o GitHub.

## 1. Comparação de Arquiteturas

### Arquitetura Atual (Build-time Sync)

- **Fluxo:** O comando de build do Docusaurus executa `crowdin upload sources` e `crowdin download`.
- **Armazenamento:** Os arquivos baixados vão para a pasta `translations/` (que é ignorada pelo Git).
- **Problema:** A tradução da IA é assíncrona. O build atual baixa o que tiver pronto e ignora o resto, forçando a necessidade de um segundo build no futuro para pegar as traduções finalizadas. Além disso, não há revisão humana _antes_ do deploy ir ao ar.

### Arquitetura Proposta (Git-based Sync com Crowdin App)

- **Fluxo:** O GitHub avisa o app do Crowdin sobre mudanças na branch `main`. O Crowdin lê os arquivos, traduz usando a IA no background e **abre um Pull Request** devolvendo os arquivos em português para o repositório.
- **Armazenamento:** Os arquivos ficarão na pasta permanente `locales/` e farão parte do repositório (comitados no Git).
- **Vantagem:** O Docusaurus simplesmente lê a pasta `locales/` que já está no repositório. O tempo de build cai drasticamente. As traduções da IA passam por revisão em um PR antes de irem para produção.

---

## 2. Passo a Passo da Implementação

Para automatizar essa visão e implementá-la em nosso monorepo, precisaremos seguir 5 passos principais:

### Passo 1: Renomear e Des-ignorar as Pastas

1. Renomear o diretório alvo de `translations/` para `locales/` dentro do namespace (ex: `knowledge-base/collections/namespaces/portal/locales`).
2. Remover a regra que ignora a pasta de traduções no arquivo `knowledge-base/.gitignore`, permitindo que o Git rastreie os arquivos `.mdx` traduzidos permanentemente.

### Passo 2: Atualizar o Mapeamento no `crowdin.yml`

Atualizar o arquivo de configuração de rotas do Crowdin para apontar para a nova pasta `locales`:

```yaml
files:
  - source: '/content/**/*.mdx'
    translation: '/locales/%locale%/**/%original_file_name%'
```

### Passo 3: Remover a Sincronização do Docusaurus Preset

Como a sincronização será baseada em eventos do Git, o comando local do nosso preset Webpack (`crowdin upload` e `crowdin download`) torna-se obsoleto.

- **Ação:** Removeremos as chamadas síncronas do CLI de dentro de `knowledge-base/docusaurus/packages/preset/src/plugins/crowdin/index.ts`. O plugin voltará a atuar apenas modificando o Docusaurus para apontar para a pasta externa, sem executar comandos Shell.

### Passo 4: Atualizar os Caminhos no Docusaurus

Ajustar o `docusaurus.config.ts` (ou o gerador do preset) para que o `i18n` do Docusaurus busque as traduções no diretório externo recém-renomeado: `../../collections/namespaces/portal/locales`.

### Passo 5: Instalar o App do Crowdin no GitHub

1. Acesse o painel do Crowdin > **Integrations** > **GitHub**.
2. Clique em "Install" e selecione o repositório no seu GitHub.
3. No painel de configuração do Crowdin, na seção **Source and Translation Files**, escolha a branch `develop` (onde o deploy de docs é executado).
4. Em **Push Translations to GitHub**, selecione a opção para abrir Pull Requests (em vez de fazer commit direto).
5. Defina a **Destination Branch** para `develop` (o Crowdin vai gerar uma branch temporária ex: `l10n_develop` e abrir um PR dela para a `develop`).
6. Configure o **Export Schedule** para agrupar as atualizações, abrindo um PR a cada 1 hora ou apenas quando as traduções da IA atingirem 100%, reduzindo o ruído.

---

## 3. Prós e Contras

### ✅ Prós

- **Build Super Rápido:** O deploy do portal não gastará mais 3 minutos rodando comandos do Crowdin CLI.
- **Single Source of Truth:** O Git se torna a única fonte da verdade. Se o Crowdin sair do ar, o site continua buildando perfeitamente.
- **Revisão Nativa:** Você aprova traduções da IA avaliando as mudanças linha a linha (Diff) em um Pull Request padrão no GitHub, mantendo total controle de qualidade.

### ⚠️ Contras

- **Ruído de PRs:** O Crowdin abrirá Pull Requests automáticos no repositório com certa frequência. É importante configurar o App para "agrupar" atualizações e abrir PRs apenas quando as traduções da IA forem concluídas para o lote.
