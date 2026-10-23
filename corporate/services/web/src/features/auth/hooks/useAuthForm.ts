import { useState, useEffect, useRef } from 'react';
import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthActions, useAuthStatus, useAuthErrorCode } from '@/domains/auth';
import { shakeElement } from '../animations';
import type { AuthFormData, AuthFieldErrors, AuthFormRefs } from '../types';
import { validateAuthForm } from '../utils/validation';
import { mapBackendErrorToUI } from '../utils/errorMapper';

export const useAuthForm = (isLogin: boolean, onSuccess: () => void) => {
  const { t } = useTranslation();
  const { login, register, clearErrors } = useAuthActions();
  const status = useAuthStatus();
  const errorCode = useAuthErrorCode();

  const identifierRef = useRef<HTMLInputElement>(null);
  const passwordLoginRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRegisterRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<AuthFormData>({
    identifier: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    icon: 'graxaim',
  });

  const [fieldErrors, setFieldErrors] = useState<AuthFieldErrors>({});
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  // Sync backend error to field errors via effect
  useEffect(() => {
    if (errorCode !== null && errorCode !== '') {
      const refs: AuthFormRefs = {
        identifier: identifierRef,
        passwordLogin: passwordLoginRef,
        username: usernameRef,
        email: emailRef,
        passwordRegister: passwordRegisterRef,
        confirmPassword: confirmPasswordRef,
      };

      const errorUI = mapBackendErrorToUI(errorCode, refs, t, isLogin);
      if (errorUI !== null) {
        setFieldErrors(errorUI.errors);
        shakeElement(errorUI.ref.current);
      }
    }
  }, [errorCode, t, isLogin]);

  const handleInputChange = (field: keyof AuthFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (
      fieldErrors[field] !== undefined &&
      fieldErrors[field] !== null &&
      fieldErrors[field] !== ''
    ) {
      setFieldErrors((prev) => ({ ...prev, [field]: null }));
    }
    if (errorCode !== null && errorCode !== '') {
      clearErrors();
    }
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (status === 'LOADING' || turnstileToken === null) {
      return;
    }

    const refs: AuthFormRefs = {
      identifier: identifierRef,
      passwordLogin: passwordLoginRef,
      username: usernameRef,
      email: emailRef,
      passwordRegister: passwordRegisterRef,
      confirmPassword: confirmPasswordRef,
    };

    const validation = validateAuthForm(isLogin, formData, turnstileToken, refs, t);
    if (validation.isValid === false) {
      setFieldErrors(validation.errors);
      shakeElement(validation.firstErrorRef?.current ?? null);
      return;
    }

    if (isLogin) {
      await login({
        identifier: formData.identifier,
        password: formData.password,
        turnstileToken,
      });
    } else {
      const success = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        icon: formData.icon,
        turnstileToken,
      });
      if (success) {
        onSuccess();
      }
    }
  };

  return {
    formData,
    fieldErrors,
    handleInputChange,
    handleSubmit,
    setTurnstileToken,
    turnstileToken,
    isLoading: status === 'LOADING',
    refs: {
      identifier: identifierRef,
      passwordLogin: passwordLoginRef,
      username: usernameRef,
      email: emailRef,
      passwordRegister: passwordRegisterRef,
      confirmPassword: confirmPasswordRef,
    },
  };
};
