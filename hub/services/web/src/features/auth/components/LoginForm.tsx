import { useState } from 'react';
import { Icon, faEye, faEyeSlash } from '@tupynambalucas-studio/assets/icons';
import type { AuthFormData, AuthFieldErrors, AuthFormRefs } from '../types';
import styles from '../styles.module.css';

interface LoginFormProps {
  data: Pick<AuthFormData, 'identifier' | 'password'>;
  errors: AuthFieldErrors;
  onChange: (field: keyof AuthFormData, value: string) => void;
  inputRefs: Pick<AuthFormRefs, 'identifier' | 'passwordLogin'>;
  disabled: boolean;
}

export const LoginForm = ({ data, errors, onChange, inputRefs, disabled }: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const { identifier, passwordLogin } = inputRefs;

  return (
    <div className={styles.inputGroup}>
      <div className={styles.inputWrapper}>
        <input
          ref={identifier}
          type="text"
          placeholder="Usuário ou E-mail"
          value={data.identifier}
          onChange={(e) => onChange('identifier', e.target.value)}
          className={
            errors.identifier !== undefined && errors.identifier !== '' ? styles.inputError : ''
          }
          disabled={disabled}
          required
        />
        {errors.identifier !== undefined && errors.identifier !== '' && (
          <span className={styles.fieldErrorMessage}>{errors.identifier}</span>
        )}
      </div>

      <div className={styles.inputWrapper}>
        <div className={styles.passwordWrapper}>
          <input
            ref={passwordLogin}
            type={showPassword ? 'text' : 'password'}
            placeholder="Senha"
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
        {errors.password !== undefined && errors.password !== '' && (
          <span className={styles.fieldErrorMessage}>{errors.password}</span>
        )}
      </div>
    </div>
  );
};
