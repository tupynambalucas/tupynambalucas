export const translations = {
  system: {
    errors: {
      INTERNAL_SERVER_ERROR: 'Erro interno do servidor.',
      UNKNOWN_ERROR: 'Ocorreu um erro inesperado.',
      NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
      VALIDATION_ERROR: 'Verifique os dados informados.',
    },
  },
  auth: {
    errors: {
      USER_NOT_FOUND: 'Usuário incorreto.',
      INVALID_CREDENTIALS: 'Usuário ou senha inválidos.',
      ACCOUNT_LOCKED:
        'Conta temporariamente bloqueada por excesso de tentativas. Tente novamente mais tarde.',
      BOT_DETECTION_FAILED: 'Falha na verificação de bot. Tente novamente.',
      BOT_DETECTION_ERROR: 'Erro ao verificar bot. Tente novamente mais tarde.',
      INVALID_PASSWORD: 'Senha incorreta.',
      EMAIL_ALREADY_EXISTS: 'E-mail já cadastrado.',
      USERNAME_ALREADY_EXISTS: 'Nome de usuário já existe.',
      NOT_AUTHENTICATED: 'Você precisa estar logado.',
      SESSION_EXPIRED: 'Sessão expirada. Faça login novamente.',
      PASSWORDS_MISMATCH: 'As senhas não são iguais. Digite novamente com calma.',
      required: 'Este campo é obrigatório.',
      identifier_invalid_string: 'Insira um usuário ou e-mail válido.',
      email_invalid_string: 'Formato de e-mail inválido.',
      username_too_small: 'O nome deve ter pelo menos {{min}} caracteres.',
      password_too_small: 'A senha deve ter pelo menos {{min}} caracteres.',
    },
    success: {
      USER_CREATED_SUCCESSFULLY: 'Conta criada com sucesso! Faça seu login.',
      LOGOUT_SUCCESSFUL: 'Sessão encerrada com sucesso.',
    },
  },
  cycle: {
    errors: {
      ACTIVE_CYCLE_ALREADY_EXISTS: 'Já existe um ciclo ativo.',
      CYCLE_NOT_FOUND: 'Ciclo não encontrado.',
      CYCLE_CREATION_FAILED: 'Falha ao criar o ciclo.',
      CYCLE_UPDATE_FAILED: 'Falha ao atualizar o ciclo.',
      CYCLE_NOT_FOUND_FOR_UPDATE: 'Ciclo não localizado para atualização.',
    },
    success: {
      CYCLE_CREATED: 'Ciclo iniciado com sucesso!',
      CYCLE_UPDATED: 'Ciclo atualizado com sucesso!',
    },
  },
};
