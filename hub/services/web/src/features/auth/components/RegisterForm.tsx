import { useState } from 'react';
import { Icon, faEye, faEyeSlash } from '@tupynambalucas-studio/design/icons';
import { AUTH_RULES } from '@tupynambalucas-hub/core';
import { IconSelector } from '@/shared/ui/UserIcon';
import type { AuthFormData, AuthFieldErrors, AuthFormRefs } from '../types';
import styles from '../styles.module.css';

interface RegisterFormProps {
  data: Omit<AuthFormData, 'identifier'>;
  errors: AuthFieldErrors;
  onChange: (field: keyof AuthFormData, value: string) => void;
  inputRefs: Omit<AuthFormRefs, 'identifier' | 'passwordLogin'>;
  disabled: boolean;
}

const ErrorBox = ({ message }: { message?: string | null }) => {
  if (message === null || message === undefined || message === '') return null;
  return (
    <div className={styles.localErrorBox} role="alert">
      <p>{message}</p>
    </div>
  );
};

export const RegisterForm = ({
  data,
  errors,
  onChange,
  inputRefs,
  disabled,
}: RegisterFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { username, email, passwordRegister, confirmPassword } = inputRefs;

  return (
    <div className={styles.inputGroup}>
      <div className={styles.inputWrapper}>
        <input
          ref={username}
          type="text"
          placeholder="Nome de usuário"
          value={data.username}
          onChange={(e) => onChange('username', e.target.value)}
          className={
            errors.username !== undefined && errors.username !== '' ? styles.inputError : ''
          }
          disabled={disabled}
          required
        />
        <ErrorBox message={errors.username} />
      </div>

      <div className={styles.inputWrapper}>
        <input
          ref={email}
          type="email"
          placeholder="E-mail"
          value={data.email}
          onChange={(e) => onChange('email', e.target.value)}
          className={errors.email !== undefined && errors.email !== '' ? styles.inputError : ''}
          disabled={disabled}
          required
        />
        <ErrorBox message={errors.email} />
      </div>

      <div className={styles.inputWrapper}>
        <IconSelector
          selectedIcon={data.icon}
          onSelect={(icon) => onChange('icon', icon)}
          disabled={disabled}
        />
      </div>

      <div className={styles.inputWrapper}>
        <div className={styles.passwordWrapper}>
          <input
            ref={passwordRegister}
            type={showPassword ? 'text' : 'password'}
            placeholder={`Crie uma senha (mín. ${AUTH_RULES.PASSWORD.MIN} carac.)`}
            value={data.password}
            onChange={(e) => onChange('password', e.target.value)}
            className={
              errors.password !== undefined && errors.password !== '' ? styles.inputError : ''
            }
            disabled={disabled}
            required
          />
          <button
            type="button"
            className={styles.eyeIcon}
            onClick={() => setShowPassword(showPassword === false)}
            tabIndex={-1}
          >
            <Icon icon={showPassword ? faEyeSlash : faEye} />
          </button>
        </div>
        <ErrorBox message={errors.password} />
      </div>

      <div className={styles.inputWrapper}>
        <div className={styles.passwordWrapper}>
          <input
            ref={confirmPassword}
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Digite a senha novamente para confirmar"
            value={data.confirmPassword}
            onChange={(e) => onChange('confirmPassword', e.target.value)}
            className={
              errors.confirmPassword !== undefined && errors.confirmPassword !== ''
                ? styles.inputError
                : ''
            }
            disabled={disabled}
            required
          />
          <button
            type="button"
            className={styles.eyeIcon}
            onClick={() => setShowConfirmPassword(showConfirmPassword === false)}
            tabIndex={-1}
          >
            <Icon icon={showConfirmPassword ? faEyeSlash : faEye} />
          </button>
        </div>
        <ErrorBox message={errors.confirmPassword} />
      </div>
    </div>
  );
};
