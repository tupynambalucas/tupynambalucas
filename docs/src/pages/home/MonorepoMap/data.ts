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
  path: '/workspaces/intro',
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
  cortex: {
    id: 'cortex',
    name: 'Cortex Context',
    path: '/workspaces/cortex/overview',
    description:
      'Unified AI processing hub, persistent memory layers, Model Context Protocol servers, and agent runtimes.',
    stack: ['TypeScript', 'Fastify', 'MongoDB Vector', 'MCP', 'Docker'],
    responsibilities: [
      'AI Agent Ingress Gateway',
      'Vector RAG Subsystem',
      'Model Context Protocol Servers',
      'Control Plane Agents',
    ],
    ptBR: {
      name: 'Contexto do Cortex',
      description:
        'Hub unificado de processamento de IA, camadas de memória persistente, servidores MCP e runtimes de agentes.',
      responsibilities: [
        'Gateway de Ingress para Agentes de IA',
        'Subsistema Vector RAG',
        'Servidores Model Context Protocol',
        'Agentes de Control Plane',
      ],
    },
  },
  docs: {
    id: 'docs',
    name: 'Docs Hub',
    path: '/workspaces/docs/overview',
    description: 'Centralized technical documentation and engineering masterplan.',
    stack: ['Docusaurus v3', 'MDX', 'Mermaid.js', 'TypeScript'],
    responsibilities: [
      'Engineering Architecture Docs',
      'Product Roadmap & Vision',
      'Internal Developer Portal',
      'Diátaxis Framework Integration',
    ],
    ptBR: {
      name: 'Hub de Documentação',
      description: 'Documentação técnica centralizada e plano mestre de engenharia.',
      responsibilities: [
        'Docs de Arquitetura de Engenharia',
        'Roadmap e Visão do Produto',
        'Portal Interno do Desenvolvedor',
        'Integração com Framework Diátaxis',
      ],
    },
  },
  hub: {
    id: 'hub',
    name: 'Hub Context',
    path: '/workspaces/hub/overview',
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
  platform: {
    id: 'platform',
    name: 'Platform Context',
    path: '/workspaces/platform/overview',
    description:
      'Core cluster platform services orchestrating telemetry aggregation and build caching.',
    stack: ['OpenTelemetry', 'Turborepo', 'Docker'],
    responsibilities: [
      'Telemetry Collection & Tracing',
      'Distributed Build Caching',
      'Cluster Observability',
    ],
    ptBR: {
      name: 'Contexto da Plataforma',
      description:
        'Serviços core de plataforma do cluster orquestrando agregação de telemetria e cache de build.',
      responsibilities: [
        'Coleta de Telemetria e Tracing',
        'Cache de Build Distribuído',
        'Observabilidade do Cluster',
      ],
    },
  },
  renderer: {
    id: 'renderer',
    name: 'Renderer Context',
    path: '/workspaces/renderer/overview',
    description:
      'A generic dynamic asset generator and document compilation engine supporting design tokens.',
    stack: ['TypeScript', 'TailwindCSS v4', 'Node.js'],
    responsibilities: [
      'Dynamic Asset Generation',
      'README Document Compilation',
      'Token Integration & Processing',
    ],
    ptBR: {
      name: 'Contexto do Renderer',
      description:
        'Motor genérico de geração de ativos dinâmicos e compilação de documentos com suporte a design tokens.',
      responsibilities: [
        'Geração de Ativos Dinâmicos',
        'Compilação de Documentos README',
        'Processamento e Integração de Tokens',
      ],
    },
  },
  shared: {
    id: 'shared',
    name: 'Shared Context',
    path: '/workspaces/shared/overview',
    description: 'Shared utilities, constants, types, and cross-workspace specifications.',
    stack: ['TypeScript', 'Zod'],
    responsibilities: [
      'Cross-workspace Shared Types',
      'Common Utilities & Helpers',
      'Shared Data Contracts',
    ],
    ptBR: {
      name: 'Contexto Compartilhado',
      description:
        'Utilitários, constantes, tipos e especificações compartilhadas entre contextos.',
      responsibilities: [
        'Tipos Compartilhados entre Workspaces',
        'Utilitários e Helpers Comuns',
        'Contratos de Dados Compartilhados',
      ],
    },
  },
  studio: {
    id: 'studio',
    name: 'Studio Context',
    path: '/workspaces/studio/overview',
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
    path: '/workspaces/tools/overview',
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
};
