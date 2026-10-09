import type { TFunction } from 'i18next';
import type { AuthFormRefs, AuthFormData, ErrorUIMapping } from '../types';

interface ErrorConfig {
  field: keyof AuthFormData;
  getRef: (r: AuthFormRefs) => React.RefObject<HTMLInputElement | null>;
}

export const mapBackendErrorToUI = (
  code: string,
  refs: AuthFormRefs,
  t: TFunction,
  isLogin: boolean,
): ErrorUIMapping | null => {
  const errorMap: Record<string, ErrorConfig | undefined> = {
    USER_NOT_FOUND: { field: 'identifier', getRef: (r) => r.identifier },
    INVALID_CREDENTIALS: { field: 'identifier', getRef: (r) => r.identifier },
    ACCOUNT_LOCKED: { field: 'identifier', getRef: (r) => r.identifier },
    BOT_DETECTION_FAILED: { field: 'identifier', getRef: (r) => r.identifier },
    INVALID_PASSWORD: {
      field: 'password',
      getRef: (r) => (isLogin ? r.passwordLogin : r.passwordRegister),
    },
    EMAIL_ALREADY_EXISTS: { field: 'email', getRef: (r) => r.email },
    USERNAME_ALREADY_EXISTS: { field: 'username', getRef: (r) => r.username },
  };

  const config = errorMap[code];
  if (config === undefined) return null;

  return {
    errors: { [config.field]: t(`auth.errors.${code}`) },
    ref: config.getRef(refs),
  };
};
