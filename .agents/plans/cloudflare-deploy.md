# Plano de Ação: Deploy de Nível Sênior (Docusaurus + Cloudflare Pages)

## Cenário Atual

Atualmente, o projeto faz o deploy do Docusaurus para o Cloudflare Pages através do GitHub Actions usando o `wrangler-action`. No entanto, a documentação está acessível por dois domínios (duplicate content):

- `docs.tupynambalucas.dev` (Domínio customizado e oficial)
- `tupynambalucas-docs.pages.dev` (Domínio gerado automaticamente pelo Cloudflare)

## Análise Arquitetural (Cloudflare Pages vs Workers vs Actions)

Para sites estáticos gerados por SSR como o Docusaurus, o **Cloudflare Pages** (com Direct Upload via CI/CD) já é a abordagem mais recomendada, profissional e madura da indústria.

- Usar **Workers** puros exigiria roteamento de _assets_ estáticos manualmente, o que é ineficiente (o Pages usa Workers por debaixo dos panos com o `Pages Asset Server` ultra-otimizado).
- Manter o deploy no **GitHub Actions** (Workflow `deploy-docs.yaml`) é a prática mais sênior, pois permite rodar scripts arbitrários (como seu `pnpm docs:generate:*`), garantir versão do Node e controle de caching antes de fazer o _upload_ dos estáticos via Wrangler.

## Abordagem Recomendada (Plano de Execução)

### 1. Resolução do Duplicate Content (SEO) via Bulk Redirects

Como o subdomínio `*.pages.dev` é estrutural no Cloudflare e não pode ser completamente deletado, a engenharia de ponta recomenda o uso de **Bulk Redirects** (Redirecionamentos em Massa executados na Edge Network, com latência zero).

- **Ação:** Criar uma regra de _Bulk Redirects_ no painel global da conta (Account Home > Bulk Redirects).
- **Configuração:**
  - **Source:** `tupynambalucas-docs.pages.dev/*`
  - **Target:** `https://docs.tupynambalucas.dev/*`
  - **Status:** `301 Permanent Redirect`
- **Por que não usar `_middleware.ts` (Pages Functions)?**
  Rodar código no middleware para checar o domínio adiciona latência (computação extra e invocation de function) em _todas_ as requisições. Redirecionamentos de Host devem sempre ocorrer nativamente na borda da rede.

### 2. Otimização do Docusaurus (`docs/docusaurus.config.ts`)

- Configurar explicitamente a propriedade `url: 'https://docs.tupynambalucas.dev'`.
- Configurar `trailingSlash: false` no `docusaurus.config.ts`. O Cloudflare Pages possui regras estritas sobre roteamento de `/path` vs `/path/`. Adicionar essa flag garante que o Docusaurus exporte páginas no formato `/path.html`, evitando _flashes_ de erros 404 em _hard reloads_.

### 3. Ajustes no Workflow (`deploy-docs.yaml`)

- A configuração atual já está excelente e aderente aos padrões empresariais, rodando passos modulares.
- Garantir que a step de deploy usando `cloudflare/wrangler-action@v3` inclua a variável correta `--project-name`.
