# Estratégia de Contexto e Qualidade (QA) para IA no Crowdin

Este documento consolida as diretrizes operacionais para gerenciar o contexto da Inteligência Artificial (Gemini) e os avisos de qualidade no Crowdin, otimizando o fluxo de _Continuous Localization_ para a documentação técnica do monorepo.

---

## 1. Otimização do Context Advisor

O Context Advisor alerta sobre metadados ausentes no projeto. Como utilizamos uma pipeline 100% autônoma via IA, o contexto é a única ferramenta que o LLM possui para inferir o tom correto e o vocabulário das traduções.

### Project Description (🔴 Obrigatório)

O _AI Prompt_ do Crowdin repassa o campo `Project Description` diretamente para a IA através da variável `%projectDescription%`. Se vazio, a IA traduz sem saber do que o site se trata.

- **Ação:** Acesse `Settings > General` no Crowdin e preencha o campo de descrição.
- **Template Recomendado (em Inglês):**
  > _"This project is a technical Developer Knowledge Base for a monorepo architecture. The translation tone must be senior, objective, and highly technical. Do not translate code variables, terminal commands, or React component properties."_

### File-level Context (🟢 Ignorar)

- **Status:** O alerta indicando que "0% dos arquivos possuem contexto" é um falso positivo para nosso fluxo.
- **Justificativa:** Na configuração do Auto-Translate, ativamos a flag **"AI-Generated File Context"**. A própria IA fará a pré-leitura do documento e gerará o contexto em tempo de execução.

### Style Guide (🟡 Opcional)

- **Status:** Recomendado se houver problemas frequentes de tom de voz.
- **Ação:** A criação de um _Style Guide_ permite forçar o uso da norma culta ou tratamento formal (ex: padronizar o uso de "você" no lugar de "tu", ou evitar coloquialismos). Essa regra será injetada no prompt via `%assignedStyleGuides%`.

---

## 2. Lidando com QA Checks e Spellchecker

O painel de tradução frequentemente exibirá avisos de **"Spellcheck failed"** para palavras como `href`, `label`, `scripts` ou `commands`.

### Por que isso acontece?

Os arquivos `.mdx` mesclam Markdown com componentes React (JSX). O Crowdin tenta rodar um corretor ortográfico focado no idioma alvo (Português - pt-BR) contra o código-fonte misturado com a tradução, gerando falsos positivos.

### Resoluções Recomendadas

1. **Desativar o Spellchecker (Recomendado para Dev Docs):**
   Vá em `Settings > QA Checks` e desmarque a opção "Spelling". Isso limpa todos os falsos positivos e foca os alertas apenas em erros estruturais (ex: tags HTML quebradas).
2. **Adicionar ao Dicionário:**
   Se preferir manter o corretor ativo, ao ver o aviso em propriedades de código, clique na palavra e selecione **"Add to Dictionary"**.

---

## 3. Diretrizes de Sincronização (Git)

As seguintes chaves devem permanecer rigorosamente configuradas na Integração do GitHub para garantir a estabilidade do Monorepo:

- **Allow target translation to match source:** `[X] Ativado`. Permite que a IA preserve comandos CLI e palavras técnicas em inglês no meio do texto em português sem ser rejeitada.
- **Approve added translations:** `[X] Ativado`. Permite que edições manuais feitas no GitHub pelos desenvolvedores sejam automaticamente aprovadas no Crowdin.
- **Push Sources:** `[ ] Desativado`. Impede que edições em inglês feitas por acidente no painel do Crowdin sobrescrevam o código original dos desenvolvedores no GitHub.
