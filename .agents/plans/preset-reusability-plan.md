# Plano de Ação: Reusabilidade do Preset do Docusaurus (`@monorepo/kb-docusaurus-preset`)

## 1. Objetivo

Transformar o preset atualmente acoplado aos caminhos específicos do `knowledge-base/docusaurus/services/monorepo` em um preset genérico, modular e totalmente reutilizável por qualquer outro serviço de documentação dentro do ecossistema.

## 2. O Problema Atual

Após analisar o código e a [documentação do Docusaurus (Advanced Plugins)](https://docusaurus.io/docs/advanced/plugins), identificamos os seguintes gargalos:

1. **Acoplamento no Plugin Customizado (`sync-i18n.ts`)**: O caminho do diretório fonte das traduções (`../../../docs/monorepo/i18n`) está hardcoded (escrito diretamente no código) dentro do plugin. Isso quebra se outro projeto tentar usar o preset.
2. **Instâncias Rígidas de Docs (`content-docs/instances.ts`)**: A tipagem e a implementação atuais (`MonorepoPresetOptions`) aceitam apenas exatamente três chaves específicas: `docs`, `roadmap` e `workspaces`. Um outro serviço de documentação pode precisar de instâncias diferentes (ex: `api`, `guidelines`, `design-system`).
3. **Ponto Único de Injeção**: O `index.ts` empurra (`plugins.push`) o `pluginSyncI18n` compulsoriamente e sem configurações dinâmicas para todos os consumidores.

## 3. A Nova Arquitetura Proposta

### 3.1. Reestruturando a Tipagem (`options.ts`)

Vamos refatorar o `MonorepoPresetOptions` para aceitar um registro dinâmico de instâncias e uma opção nativa para gerenciar sincronização de arquivos i18n, além das opções padrão.

```typescript
export type MonorepoPresetOptions = {
  // ... outras opções
  // Em vez de campos fixos, permitimos um objeto de instâncias (chave = id da instância):
  docs?: Record<string, DocsPluginOptions> | false;
  blog?: Record<string, BlogPluginOptions> | false;

  // Configuração customizada pro nosso plugin injetado:
  syncI18n?: string[] | false; // Lista de caminhos para sincronizar com a pasta do docusaurus
};
```

### 3.2. Adaptando as Fábricas de Instâncias (`instances.ts`)

O arquivo `instances.ts` será reescrito. Ele passará a iterar sobre as chaves de `opts.docs` em vez de verificar campos explícitos e rígidos (como `opts.roadmap`), permitindo que cada serviço construa seu próprio mapa de rotas (`routeBasePath`) e caminhos (`path`) dinamicamente a partir do `docusaurus.config.ts`.

### 3.3. Refatorando o Plugin `sync-i18n.ts`

Conforme lido na documentação do Docusaurus, um plugin recebe sempre dois parâmetros: `(context, options)`.
Modificaremos o plugin para utilizar esse padrão.

```typescript
export type SyncI18nPluginOptions = {
  sourcePaths: string[]; // Recebe dinamicamente via opção do preset
};

export default function pluginSyncI18n(
  context: LoadContext,
  options: SyncI18nPluginOptions,
): Plugin {
  // A lógica itera sobre options.sourcePaths e usa context.siteDir
}
```

### 3.4. Atualizando a Montagem no `index.ts`

Em vez de simplesmente forçar o `pluginSyncI18n as any`, o preset fará a checagem:

```typescript
if (opts.syncI18n !== false && opts.syncI18n !== undefined) {
  plugins.push([pluginSyncI18n, { sourcePaths: opts.syncI18n }]);
}
```

### 3.5. Atualizando o Consumidor Original (`docusaurus.config.ts`)

Com o preset generalizado, vamos atualizar o serviço existente `services/monorepo/docusaurus.config.ts` para continuar funcionando, mas agora passando seu próprio escopo via objeto nas configurações do preset.

## 4. Próximos Passos (Ação do Agente)

1. Concordar e alinhar esse plano com o Desenvolvedor.
2. Alterar as interfaces e tipos base em `src/options.ts`.
3. Atualizar o `sync-i18n.ts` para absorver o parâmetro `options`.
4. Refatorar o `instances.ts` (tanto para `docs` quanto `blog` se necessário).
5. Modificar a montagem final do preset no `index.ts`.
6. Adequar a chamada do array de presets no `docusaurus.config.ts` do serviço `monorepo`.
7. Re-executar o build do Docusaurus para atestar compatibilidade e gerar o diff.
