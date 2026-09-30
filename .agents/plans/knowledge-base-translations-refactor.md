# Plano de Refatoração e Análise do fluxo de Traduções (Crowdin / Knowledge Base)

Este documento analisa os problemas reportados no fluxo de tradução do Docusaurus com o Crowdin, propõe a lógica otimizada de cópia de arquivos e esclarece dúvidas sobre o licenciamento do Crowdin e estratégias de Storage.

## 1. Por que os arquivos de tradução não foram gerados?

Você mencionou que deletou as pastas de tradução em `collections` e `services/portal`, mas ao rodar o build, elas não foram recriadas.

Analisando o código do plugin (`knowledge-base/docusaurus/packages/preset/src/plugins/crowdin/index.ts`) e do SDK interno (`knowledge-base/collections/src/crowdin.ts`):

- O plugin possui a condição: `if (!hasTranslationsLocally) { await downloadDomainTranslations(...) }`.
- **A causa do bloqueio:** Dentro de `downloadDomainTranslations`, existe a seguinte lógica:
  ```typescript
  const token = process.env.CROWDIN_PERSONAL_TOKEN;
  if (!token) {
    console.warn(`[Crowdin SDK] CROWDIN_PERSONAL_TOKEN não encontrado. Sincronização ignorada.`);
    return;
  }
  ```
- **Conclusão:** O SDK está ignorando silenciosamente o download porque o `.env` do ambiente não possui a variável `CROWDIN_PERSONAL_TOKEN` configurada. Como ele retorna vazio e não lança erro, o Docusaurus continua o processo de build, mas os arquivos nunca chegam à pasta.

## 2. Refatoração da Lógica de Cópia (Apenas arquivos modificados)

Atualmente, o script finaliza copiando os arquivos diretamente com `fs.cpSync(source, dest, { recursive: true })`. Isso sobreescreve tudo, atualizando a "Data de Modificação" (`mtime`) de todos os arquivos, o que invalida o cache do Docusaurus/Webpack e causa processamentos redundantes.

**Nova Lógica Proposta:**
Criaremos uma rotina iterativa que analisa arquivo por arquivo. Se o arquivo destino já existir, seu conteúdo será lido e comparado em memória. Só se reescreve o arquivo no destino se as strings forem diferentes. Isso preserva metadados (timestamp) dos arquivos que não mudaram.

```typescript
import fs from 'node:fs';
import path from 'node:path';

function syncFilesOptimized(src: string, dest: string) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      syncFilesOptimized(srcPath, destPath);
    } else {
      let shouldWrite = true;
      if (fs.existsSync(destPath)) {
        const srcContent = fs.readFileSync(srcPath);
        const destContent = fs.readFileSync(destPath);
        // Compara byte a byte para ver se o conteúdo é exatamente igual
        if (srcContent.equals(destContent)) {
          shouldWrite = false; // Não mudou, não sobrescrevemos
        }
      }

      if (shouldWrite) {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
}
```

_Iremos substituir o `fs.cpSync` do `index.ts` do plugin por esta lógica._

## 3. Armazenamento na Nuvem (Cloudflare R2 / Crowdin Storage) vs Diretório Local

**A Dúvida:** _É possível não gerar os arquivos localmente e usarmos a storage do Cloudflare ou do Crowdin?_

**Resposta:** **Não para o fluxo de build do Docusaurus.**

O Docusaurus é um framework SSG (Static Site Generator). Ele precisa que os arquivos físicos (arquivos Markdown `.md` e JSON de i18n) estejam presentes em disco, nas pastas específicas (`i18n/pt-BR/docusaurus-plugin-content-docs/current/...`), **durante o tempo de compilação (`pnpm build`)**, para que ele os leia e gere o HTML final.

**O que é possível fazer (e que já fazemos em parte):**

- **Sincronização Pre-Build (O fluxo atual):** Os arquivos são hospedados na nuvem do Crowdin. Ao rodar o processo de build do projeto, fazemos o download automatizado do `.zip` contendo os MDs traduzidos, descompactamos para uma pasta local temporária, injetamos no Docusaurus e descartamos o zip.
- **Cache no Cloudflare R2:** Se a chamada para a API do Crowdin fosse muito lenta, poderíamos agendar um webhook do Crowdin para salvar o ZIP mais recente no Cloudflare R2 e o seu build em dev/prod baixaria do Cloudflare R2. Porém, no final, os arquivos **ainda teriam que ser descompactados localmente antes de rodar o comando `docusaurus build`**. O download direto do Crowdin já funciona perfeitamente para essa finalidade.

## 4. Custos e Limitações do Crowdin (Fim do Free Trial & Open Source)

O Crowdin possui um plano "Free" com limitações estritas (1 projeto, 60.000 strings e bloqueios para algumas integrações de API). O teste de 14 dias coloca você nos planos "Pro" ou "Team". Após isso, recursos Premium de automação e de tradução via máquina são desativados ou estrangulados.

**Boas notícias:** Como seu projeto é **Open Source** e tem código aberto no GitHub, você pode **solicitar uma licença gratuita e permanente do Crowdin para Open Source**.

### Como obter o Crowdin gratuitamente para sempre:

1. Você ganha uma conta premium quase ilimitada se qualificar para licença de código aberto.
2. Acesse a página: [Crowdin Open Source License](https://crowdin.com/page/open-source-project-setup-request)
3. Preencha o formulário enviando o link do seu repositório GitHub.
4. **Requisitos Mínimos:**
   - Repositório público no GitHub.
   - Ter uma licença oficial Open Source no repositrio (como MIT, Apache, etc) — o seu projeto já tem o arquivo `LICENSE`.
   - Não ter vínculo explícito com modelos comerciais estritos.

Após a aprovação (geralmente rápida), sua conta perde as restrições do Trial e a API fica liberada integralmente para o fluxo automatizado do seu portal.

---

### Próximos Passos Recomendados

1. Requisitar a licença Open Source do Crowdin no link oficial acima.
2. Autorizar o agente a refatorar o arquivo de plugin (`docusaurus-plugin-translations-sync.ts` / `index.ts` do crowdin) para aplicar a nova lógica de diff de arquivos `syncFilesOptimized`.
3. Validar se você tem a key `CROWDIN_PERSONAL_TOKEN` e `CROWDIN_PROJECT_ID` configuradas no arquivo `.env` para que o download não passe direto.

## 5. Refatoração Arquitetural de `@monorepo/kb-collections`

Para adequar o workspace aos princípios DDD/FSD do monorepo (como documentado em `ddd-fsd.mdx`) e espelhar a estrutura já utilizada na API (`hub/services/api`), faremos as seguintes alterações estruturais:

### A. Remoção de Arquivos Desnecessários (`cli.ts`)

Conforme analisado, o arquivo `knowledge-base/collections/src/cli.ts` funciona apenas como um script auxiliar de trigger manual e acopla a biblioteca ao uso de linha de comando direta.

- **Ação:** O arquivo `cli.ts` será **deletado**.
- **Ação:** O script `"sync-translations"` será removido do `package.json`. O download já é garantido de forma autônoma pelo plugin interno do Docusaurus durante a compilação.

### B. Adequação ao FSD e Gerenciamento de Variáveis (`dotenv`)

Bibliotecas (pacotes internos do monorepo) não devem carregar o `dotenv` com caminhos `hardcoded` relativos a si mesmas. A responsabilidade de prover as variáveis de ambiente é do consumidor final (o portal).

- **Ação:** Remover `import dotenv from 'dotenv'` e `dotenv.config(...)` do arquivo interno do SDK (`crowdin.ts`).
- **Ação:** Reestruturar a pasta `src/` para separar regras de configuração, serviços isolados e utilitários, seguindo a semântica da API (`config`, `services`, `utils`).

### C. Renomeação do Diretório de Conteúdo (`domains` -> `namespaces`)

Atualmente, o projeto usa a pasta `domains/` para guardar os artefatos de conteúdo (`portal`, `github`). Contudo, o termo `domains` é uma palavra reservada pela arquitetura Feature-Sliced Design (FSD) para designar "Domínios de Negócio" no código-fonte (`src/domains`). Manter o diretório de conteúdo com o nome `domains` cria redundância semântica e gera confusão arquitetural.

Após análise de padrões da indústria para repositórios de documentação e base de conhecimento, o termo corporativo ideal para agrupar múltiplos contextos documentais (multi-tenant/multi-project) é **`namespaces`** (ou `catalogs` / `workspaces`).

- **Ação:** Renomear `knowledge-base/collections/domains` para **`knowledge-base/collections/namespaces`**.
- O termo **Namespace** estabelece fronteiras claras e evita colisões lógicas, separando estritamente as documentações (ex: `namespaces/portal`, `namespaces/github`), aderindo perfeitamente às convenções de documentação-as-code nível sênior.

---

### Resumo das Próximas Ações de Refatoração:

1. Deletar `src/cli.ts` e limpar `package.json`.
2. Remover chumbamento do `dotenv` do código da biblioteca.
3. Renomear `collections/domains` para `collections/namespaces`.
4. Reorganizar `src/` em `services/crowdin.service.ts` e `utils/`.
5. Atualizar todas as importações e referências nos plugins (`docusaurus-plugin-crowdin-unified`).
