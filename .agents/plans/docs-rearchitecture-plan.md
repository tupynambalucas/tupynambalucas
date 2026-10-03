# Arquitetura Avançada: SDK Crowdin + Preset Plugin Unificado

## 1. A Nova Estrutura de Diretórios (Nível Collections)

Isolaremos o conteúdo dentro de `domains/` para proteger o domínio de conteúdo FSD.

```text
knowledge-base/
├── collections/
│   ├── package.json
│   ├── src/
│   │   └── crowdin.ts                   <-- (Onde implementaremos o SDK)
│   └── domains/
│       └── portal/
│           ├── crowdin.config.ts
│           ├── translations/
│           └── content/
```

## 2. Implementação da API do Crowdin (`crowdin.ts`)

A função principal será o coração da nossa automação. Ela utiliza o `@crowdin/crowdin-api-client` para conversar com a nuvem, compilar a última versão traduzida de um idioma, monitorar a compilação e descompactar o ZIP localmente.

```typescript
// knowledge-base/collections/src/crowdin.ts
import fs from 'node:fs';
import path from 'node:path';
import fetch from 'node-fetch';
import extractZip from 'extract-zip';
import { Client } from '@crowdin/crowdin-api-client';

// Carrega as configurações de ID do Projeto do respectivo domínio
function getDomainConfig(domainName: string) {
  // No futuro, isso pode importar o `crowdin.config.ts` dinamicamente
  return {
    projectId: Number(process.env.CROWDIN_PROJECT_ID),
    outputDir: path.resolve(__dirname, `../domains/${domainName}/translations`),
  };
}

export async function downloadDomainTranslations(domainName: string) {
  const token = process.env.CROWDIN_PERSONAL_TOKEN;
  if (!token) throw new Error('Token do Crowdin não encontrado.');

  const client = new Client({ token });
  const { projectId, outputDir } = getDomainConfig(domainName);

  console.log(`[Crowdin SDK] Solicitando build de traduções para o domínio '${domainName}'...`);

  try {
    // 1. Inicia o Job de Compilação na Nuvem do Crowdin
    const build = await client.translationsApi.buildProjectTranslation(projectId, {
      skipUntranslatedStrings: false,
      skipUntranslatedFiles: false,
      exportApprovedOnly: false,
    });

    const buildId = build.data.id;
    console.log(`[Crowdin SDK] Build iniciado. ID: ${buildId}. Aguardando conclusão...`);

    // 2. Poll: Aguarda a conclusão do Job
    let status = 'inProgress';
    while (status === 'inProgress') {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const check = await client.translationsApi.projectBuildStatus(projectId, buildId);
      status = check.data.status;
      if (status === 'failed') throw new Error('Falha no build do Crowdin.');
    }

    // 3. Resgata a URL Segura de Download do ZIP gerado
    const downloadLink = await client.translationsApi.downloadProjectTranslations(
      projectId,
      buildId,
    );

    // 4. Download do Arquivo
    const zipPath = path.join(__dirname, 'temp_translations.zip');
    console.log('[Crowdin SDK] Fazendo download do ZIP...');
    const response = await fetch(downloadLink.data.url);
    const buffer = await response.buffer();
    fs.writeFileSync(zipPath, buffer);

    // 5. Descompactação na pasta do domínio (ex: domains/portal/translations)
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
    console.log(`[Crowdin SDK] Descompactando para ${outputDir}...`);

    await extractZip(zipPath, { dir: outputDir });
    fs.unlinkSync(zipPath); // Limpa o ZIP temporário

    console.log('[Crowdin SDK] Sincronização concluída com sucesso!');
  } catch (error) {
    console.error(`[Crowdin SDK] Erro na sincronização: ${error.message}`);
    throw error;
  }
}

// Retorna o diretório resolvido para que o Plugin do Docusaurus saiba o que copiar
export function getDomainTranslationsPath(domainName: string): string {
  return path.resolve(__dirname, `../domains/${domainName}/translations`);
}
```

## 3. A Injeção Inteligente pelo Padrão FSD (Reutilizável)

### 3.1. Exemplo do Refator de `plugins/content-docs/instances.ts`

```typescript
import { createRequire } from 'node:module';
import type { PluginConfig } from '@docusaurus/types';
import type { MonorepoPresetOptions } from '../../options';

const require = createRequire(import.meta.url);

export function createDocsInstances(options: Pick<MonorepoPresetOptions, 'docs'>): PluginConfig[] {
  const plugins: PluginConfig[] = [];
  const { docs } = options;

  if (Array.isArray(docs)) {
    docs.forEach((docOpt) => plugins.push([require.resolve('./index.js'), docOpt]));
  } else if (docs) {
    plugins.push([require.resolve('./index.js'), docs]);
  }

  return plugins;
}
```

### 3.2. A Chamada Limpa no `preset/src/index.ts`

```typescript
import { createDocsInstances } from './plugins/content-docs/instances';
import { createBlogInstance } from './plugins/content-blog/instances';
import pluginCrowdin from './plugins/crowdin'; // O novo plugin

// ... no final da função preset():
plugins.push(...createDocsInstances(opts));
plugins.push(...createBlogInstance(opts));

if (opts.crowdin) {
  plugins.push([pluginCrowdin, opts.crowdin]);
}
```

## 4. O Plugin Crowdin Unificado (`plugins/crowdin/index.ts`)

```typescript
import fs from 'node:fs';
import path from 'node:path';
import { downloadDomainTranslations, getDomainTranslationsPath } from '@monorepo/kb-collections';

export default function pluginCrowdin(context, options) {
  return {
    name: 'docusaurus-plugin-crowdin-unified',
    async loadContent() {
      const { collection } = options;

      if (process.env.SYNC_TRANSLATIONS) {
        await downloadDomainTranslations(collection);
      }

      const source = getDomainTranslationsPath(collection);
      const dest = path.resolve(context.siteDir, 'i18n');
      if (fs.existsSync(source)) {
        fs.cpSync(source, dest, { recursive: true });
      }
    },
  };
}
```

## 5. O Consumidor Final (`docusaurus.config.ts`)

```typescript
presets: [
  [
    '@monorepo/kb-docusaurus-preset',
    {
      crowdin: { collection: 'portal' },
      docs: [/* Instâncias docs & community */],
      blog: [/* Instâncias blog & releases */],
    },
  ],
];
```

## 6. Próximos Passos (Ação do Agente)

1. **Pacote `collections`**: Inicializar o repositório SDK na raiz.
2. **Reestruturar Pastas em `domains`**: Criar `domains/portal/content/` e transferir o `handbook`, `workspaces`, `roadmap` e `blog`.
3. **API Crowdin**: Implementar a lógica de download via `@crowdin/crowdin-api-client` conforme Seção 2.
4. **Refatorar Preset**: Atualizar os arquivos `instances.ts` e plugar o novo `crowdin/index.ts`.
5. **Configurar Monorepo Docusaurus**: Atualizar o `docusaurus.config.ts` apontando as 4 instâncias.
6. **Integração de Catálogos (FSD/DDD)**: Migrar dependências do `collections/package.json` para usarem os catálogos centrais definidos em `pnpm-workspace.yaml` (ex: `catalog:docs-stack`).
7. **Integração de Lint e Typecheck**: Definir um `tsconfig.json` limpo no `collections/`, referenciá-lo no `knowledge-base/docusaurus/tsconfig.json` e atualizar todas as referências no `eslint.config.ts` e `pnpm-workspace.yaml` para usarem o sufixo `portal` e garantirem que tudo aponta para os novos caminhos do FSD.
8. **Renomeação para Portal**: Renomear de fato o antigo serviço `docusaurus/services/monorepo` para `docusaurus/services/portal`, atualizando o `package.json` (`@monorepo/kb-docusaurus-portal`) e todos os scripts na raiz (`kb:docusaurus:portal:*`).

## 7. Documentação do Projeto Crowdin

### Tipo de Projeto Recomendado

- **Project Type**: File-based Project
- **Motivo**: Arquivos \.mdx\ requerem o modo File-based. O String-based extrairia textos soltos, enquanto o File-based preserva a estrutura de blocos do markdown (tags HTML, imports, etc.) e sua estrutura de pastas para exportação limpa.

### Permissões do Token (Personal Access Token)

Para criar o Token (Personal Access Token) no seu perfil (Account Settings > API), selecione as permissões (Scopes) necessárias:

- **Projects (Read and Write)**: Para engatilhar o build (\uildProject\) das traduções.
- **Translations (Read and Write)**: Para baixar o ZIP (\downloadTranslations\).
- **Source files & strings (Read and Write)** (opcional): Útil se no futuro configurarmos upload via API ou verificação de status.

Essas configurações devem ser refletidas nos secrets \CROWDIN_PROJECT_ID\ e \CROWDIN_PERSONAL_TOKEN\.
