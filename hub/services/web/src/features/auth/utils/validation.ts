import type { TFunction } from 'i18next';
import { LoginDTOSchema, RegisterDTOSchema, AUTH_RULES } from '@tupynambalucas-hub/core';
import type { AuthFormData, AuthFormRefs, ValidationResult } from '../types';

export const validateAuthForm = (
  isLogin: boolean,
  data: AuthFormData,
  turnstileToken: string | null,
  refs: AuthFormRefs,
  t: TFunction,
): ValidationResult => {
  const schema = isLogin === true ? LoginDTOSchema : RegisterDTOSchema;
  const dataToValidate =
    isLogin === true
      ? {
          identifier: data.identifier,
          password: data.password,
          turnstileToken,
        }
      : {
          email: data.email,
          username: data.username,
          icon: data.icon,
          password: data.password,
          turnstileToken,
        };

  const result = schema.safeParse(dataToValidate);
  const errorRefs: Record<string, React.RefObject<HTMLInputElement | null>> = {
    identifier: refs.identifier,
    password: isLogin === true ? refs.passwordLogin : refs.passwordRegister,
    username: refs.username,
    email: refs.email,
    confirmPassword: refs.confirmPassword,
  };

  if (result.success === false) {
    const firstError = result.error.issues[0];
    const field = firstError.path[0] as keyof AuthFormData;
    const minVal = field === 'username' ? AUTH_RULES.USERNAME.MIN : AUTH_RULES.PASSWORD.MIN;

    const errorMessage = t(`auth.errors.${field}_${firstError.code}`, {
      min: minVal,
      defaultValue: firstError.message,
    });

    return {
      isValid: false,
      errors: { [field]: errorMessage },
      firstErrorRef: errorRefs[field],
    };
  }

  if (isLogin === false && data.password !== data.confirmPassword) {
    return {
      isValid: false,
      errors: { confirmPassword: t('auth.errors.passwords_dont_match') },
      firstErrorRef: refs.confirmPassword,
    };
  }

  return { isValid: true, errors: {} };
};
