# Docusaurus UI Translation Architecture & GitOps Pipeline

Este documento detalha a arquitetura de internacionalização (i18n) para **UI Strings** e **Componentes React** no monorepo, especificamente focado no namespace `portal`.

---

## 1. A Estrutura de `content/messages` (O Que É e Para Que Serve)

No Docusaurus, o conteúdo puro (guias, documentações, blogs) é escrito em Markdown (MDX). No entanto, o "esqueleto" do site (menus, botões, rodapés e páginas construídas diretamente em React na pasta `src/pages`) não pode ser traduzido via Markdown.

Para resolver isso, o Docusaurus varre o código em busca de tags `<Translate>` e extrai todos os textos literais para arquivos **JSON**. Nós interceptamos esses arquivos e os armazenamos no nosso padrão de _Bounded Contexts_ em `collections/namespaces/portal/content/messages`.

### Mapa e Significado dos Arquivos

Abaixo está o detalhamento de cada arquivo gerado automaticamente pelo comando `pnpm exec docusaurus write-translations`:

- **`messages/code.json`**
  - **O que é:** O catálogo principal de strings extraídas do código-fonte nativo do portal.
  - **Para que serve:** Contém todas as traduções das páginas estáticas do React (como a `src/pages/index.tsx`) e qualquer outro componente customizado do projeto.
- **`messages/docusaurus-theme-classic/navbar.json`**
  - **O que é:** Configurações literais da barra de navegação superior.
  - **Para que serve:** Traduz os labels dos links estruturais (Ex: "Docs", "Blog", "Community") definidos no arquivo `docusaurus.config.ts`.
- **`messages/docusaurus-theme-classic/footer.json`**
  - **O que é:** Configurações literais do rodapé do site.
  - **Para que serve:** Traduz os títulos das colunas e links fixos do footer definidos no `docusaurus.config.ts`.
- **`messages/docusaurus-plugin-content-docs/current.json`**
  - **O que é:** Metadados estruturais do plugin principal de documentação (`docs`).
  - **Para que serve:** Traduz os nomes das categorias da barra lateral (Sidebars) que são definidos em arquivos `_category_.json` ou auto-gerados.
- **`messages/docusaurus-plugin-content-docs-community/current.json`**
  - **O que é:** Metadados estruturais do plugin secundário de documentação (`community`).
  - **Para que serve:** Mesma função do arquivo acima, mas restrito ao escopo do roteamento `/community`.
- **`messages/docusaurus-plugin-content-blog/options.json`**
  - **O que é:** Textos de cabeçalho do plugin de Blog.
  - **Para que serve:** Traduz as strings globais como "Postagens Recentes" ou o título "Blog".
- **`messages/changelog-plugin/options.json`**
  - **O que é:** Textos de cabeçalho do nosso plugin de Changelog customizado.
  - **Para que serve:** Traduz as descrições globais da rota `/changelog`.

---

## 2. A Lógica do Crowdin Plugin e do Pipeline

A arquitetura que montamos conecta o Crowdin ao Docusaurus de forma unilateral (_Unidirectional GitOps_), garantindo que as ferramentas fiquem isoladas.

### A. Extração (Origem)

Ao rodarmos `write-translations`, os arquivos JSON nascem originais em inglês. Nós os colocamos no GitHub dentro de `content/messages`.

### B. Mapeamento no `crowdin.yml`

O Crowdin escuta a pasta através desta regra:

```yaml
- source: /knowledge-base/collections/namespaces/portal/content/messages/**/*.json
  translation: /knowledge-base/collections/namespaces/portal/locales/%locale%/messages/**/%original_file_name%
  type: chrome
```

**O Pulo do Gato (`type: chrome`):** O Docusaurus usa o padrão **Chrome i18n JSON**, onde cada string tem um `"message"` e uma `"description"`. Se o Crowdin tratasse o arquivo como um JSON normal, ele faria o tradutor traduzir a descrição. A tag `type: chrome` avisa o Crowdin para isolar a `"description"` apenas como contexto de UI para o tradutor, protegendo a chave e extraindo apenas o `"message"`.

### C. O Interceptador (Nosso Docusaurus Plugin)

Quando as traduções (Ex: `pt-BR`) são aprovadas, o Crowdin abre uma PR gravando os arquivos traduzidos em `locales/pt-BR/messages/`.

Durante o **build de produção**, nosso plugin customizado (`docusaurus-plugin-crowdin-unified`) entra em ação antes de qualquer renderização:

```typescript
if (contentType.name === 'messages') {
  syncFilesOptimized(path.join(localeSrcPath, 'messages'), localeDestPath);
  continue;
}
```

Essa lógica diz ao plugin: _"Pegue tudo o que está dentro da pasta `messages` e **desempacote (unpack)** seu conteúdo derramando-o diretamente na raiz da pasta `i18n/pt-BR/` do motor do Docusaurus."_
Isso transforma as traduções do Crowdin nos exatos caminhos (`i18n/pt-BR/code.json`, `i18n/pt-BR/docusaurus-theme-classic/...`) que o Docusaurus precisa para compilar o site em português sem reclamar de pastas erradas.

---

## 3. Análise de Nomenclatura: `messages` é o melhor nome?

O termo **`messages`** foi escolhido porque é o padrão-ouro de ecossistemas de internacionalização de nível corporativo (como o ICU MessageFormat, o FormatJS e o pacote `react-intl`, no qual a arquitetura do Docusaurus é baseada). Além disso, a chave interna dos arquivos JSON se chama literalmente `"message"`.

No entanto, existem nomenclaturas que podem refletir a estrutura de forma mais "Desenvolvedor-Friendly" ou "Empresarial". Abaixo estão os prós e contras:

| Nome Sugerido            | Defesa (Por que usar?)                                                                                               | Crítica (Por que evitar?)                                                                                                                                   |
| :----------------------- | :------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`messages`** _(Atual)_ | **Mais preciso tecnicamente.** É a nomenclatura global oficial da W3C e ICU para strings de catálogo externalizadas. | Pode soar vago ou genérico para novos desenvolvedores que não estão familiarizados com i18n avançado. Podem confundir com "mensagens do sistema" ou logs.   |
| **`ui-strings`**         | **Mais claro e explícito.** Define imediatamente o escopo: "Isso são os textos soltos da Interface de Usuário".      | Perde o aspecto "arquitetural" e soa como uma pasta de constantes em vez de um módulo de internacionalização isolado.                                       |
| **`interface`**          | **Altamente corporativo.** Fica paralelo à estrutura conceitual (Content = MDX, Interface = JSON estruturais da UI). | "Interface" é um termo sobrecarregado no TypeScript. Desenvolvedores podem achar que a pasta contém declarações `.d.ts`.                                    |
| **`system-locales`**     | Passa a ideia de que ali estão as engrenagens fixas do sistema, e não o conteúdo editorial das documentações.        | O termo "locales" já existe na raiz de `portal/locales/`. Usar `system-locales` no source content cria redundância linguística no cérebro do desenvolvedor. |
| **`core-strings`**       | Reflete os pilares essenciais e as bases imutáveis de texto do repositório.                                          | Semelhante ao `ui-strings`, mas não deixa claro que é puramente visual. Pode ser confundido com constantes de API.                                          |

### Conclusão e Veredito

- Se o time valoriza o **Padrão Técnico Global (Standards)**, a pasta deve continuar se chamando **`messages`**.
- Se o time prefere **Ergonomia e Clareza Imediata**, o termo **`ui-strings`** (ou apenas **`ui`**) é indiscutivelmente o mais intuitivo para novos membros onboarding.

Qualquer mudança de nome precisa ser sincronizada em 3 lugares: no nome físico da pasta, no `crowdin.yml` e no interceptador `index.ts` do Docusaurus Preset.
