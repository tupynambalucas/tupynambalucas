export interface WorkspaceInfo {
  id: string;
  name: string;
  path: string;
  description: string;
  stack: string[];
  responsibilities: string[];
  ptBR?: Partial<WorkspaceInfo>;
}

export const MONOREPO_OVERVIEW: WorkspaceInfo = {
  id: 'root',
  name: 'tupynambalucas.dev Architecture',
  path: '/',
  description:
    'A high-performance, strictly-typed monorepo built on PNPM Workspaces and Turborepo. This architecture enforces strict domain isolation while sharing critical core logic.',
  stack: ['PNPM v11', 'Turborepo', 'TypeScript 6', 'ESLint 10', 'Zig'],
  responsibilities: [
    'Single Source of Truth (SSOT) via /hub/packages/core',
    'Automated Task Orchestration',
    'Context-Driven Development isolation',
    'Shared Design Tokens & Visual Assets',
  ],
  ptBR: {
    name: 'Arquitetura tupynambalucas.dev',
    description:
      'Um monorepo de alta performance e tipagem estrita construído com PNPM Workspaces e Turborepo. Esta arquitetura impõe um isolamento rigoroso de domínios enquanto compartilha lógica core crítica.',
    responsibilities: [
      'Fonte Única de Verdade (SSOT) via /hub/packages/core',
      'Orquestração de Tarefas Automatizada',
      'Isolamento de Desenvolvimento Orientado a Contexto',
      'Tokens de Design e Ativos Visuais Compartilhados',
    ],
  },
};

export const WORKSPACES: Record<string, WorkspaceInfo> = {
  hub: {
    id: 'hub',
    name: 'Hub Context',
    path: '/workspaces/hub',
    description:
      'Manages personal portfolio frontend pages, blog operations, contact form persistence, and administrator options.',
    stack: ['React 19', 'Fastify v5', 'MongoDB', 'Zustand', 'TailwindCSS v4'],
    responsibilities: [
      'Personal Portfolio frontend',
      'REST API backend',
      'Zod validation & shared contracts',
    ],
    ptBR: {
      name: 'Contexto do Hub',
      description:
        'Gerencia páginas de portfólio pessoal, operações de blog, formulário de contato e painel administrativo.',
      responsibilities: [
        'Frontend do Portfólio',
        'Backend da API REST',
        'Validação Zod e contratos compartilhados',
      ],
    },
  },
  profile: {
    id: 'profile',
    name: 'Profile Context',
    path: '/workspaces/profile',
    description:
      'A standalone statistics compiler CLI implemented in Zig that fetches metrics from GitHub API and generates SVG charts.',
    stack: ['Zig', 'GitHub API (GraphQL)', 'GitHub Actions'],
    responsibilities: [
      'GitHub API metrics compilation',
      'SVG visual chart rendering',
      'Dynamic profile README injector',
    ],
    ptBR: {
      name: 'Contexto de Perfil',
      description:
        'Um compilador CLI de estatísticas implementado em Zig que consome dados do GitHub e gera SVG cards.',
      responsibilities: [
        'Compilação de métricas do GitHub',
        'Renderização de gráficos SVG',
        'Injeção dinâmica no README do perfil',
      ],
    },
  },
  studio: {
    id: 'studio',
    name: 'Studio Context',
    path: '/workspaces/studio',
    description:
      'The single source of truth for visual identity, shared tokens, and UI consistency.',
    stack: ['TailwindCSS v4', 'PostCSS', 'Style Dictionary'],
    responsibilities: [
      'Canonical Design Tokens',
      'Brand Asset Management',
      'Visual Consistency across contexts',
    ],
    ptBR: {
      name: 'Contexto do Studio',
      description:
        'A fonte única de verdade para identidade visual, tokens compartilhados e consistência de UI.',
      responsibilities: [
        'Tokens de Design Canônicos',
        'Gerenciamento de Ativos de Marca',
        'Consistência Visual entre contextos',
      ],
    },
  },
  tools: {
    id: 'tools',
    name: 'Tools Context',
    path: '/workspaces/tools',
    description: 'Infrastructure orchestration hub and technical automation backbone.',
    stack: ['Model Context Protocol (MCP)', 'Docker', 'Shell Scripts'],
    responsibilities: [
      'AI Agent Context Servers',
      'Dev Environment Setup',
      'CI/CD Pipeline Automation',
    ],
    ptBR: {
      name: 'Contexto de Ferramentas',
      description: 'Hub de orquestração de infraestrutura e espinha dorsal de automação técnica.',
      responsibilities: [
        'Servidores de Contexto para Agentes de IA',
        'Configuração de Ambiente de Desenvolvimento',
        'Automação de Pipelines CI/CD',
      ],
    },
  },
  knowledge: {
    id: 'knowledge',
    name: 'Docs Hub',
    path: '/workspaces/docs',
    description: 'Centralized technical documentation and engineering masterplan.',
    stack: ['Docusaurus v3', 'MDX', 'Mermaid.js'],
    responsibilities: [
      'Engineering Architecture Docs',
      'Product Roadmap & Vision',
      'Internal Developer Portal',
    ],
    ptBR: {
      name: 'Hub de Documentação',
      description: 'Documentação técnica centralizada e plano mestre de engenharia.',
      responsibilities: [
        'Docs de Arquitetura de Engenharia',
        'Roadmap e Visão do Produto',
        'Portal Interno do Desenvolvedor',
      ],
    },
  },
};
