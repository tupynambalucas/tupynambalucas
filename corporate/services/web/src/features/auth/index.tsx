import { useState, useRef, useMemo } from 'react';
import { useGSAP } from '@gsap/react';
import { Turnstile } from '@marsidev/react-turnstile';
import { useAuthActions } from '@/domains/auth';
import styles from './styles.module.css';
import { animateFormEntrance } from './animations';
import { useAuthForm } from './hooks/useAuthForm';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';

const AuthFeature = () => {
  const [isLogin, setIsLogin] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const { clearErrors } = useAuthActions();

  const {
    formData,
    fieldErrors,
    handleInputChange,
    handleSubmit,
    setTurnstileToken,
    turnstileToken,
    isLoading,
    refs,
  } = useAuthForm(isLogin, () => setIsLogin(true));

  const turnstileOptions = useMemo(
    () => ({
      theme: 'light' as const,
      appearance: 'always' as const,
      size: 'flexible' as const,
    }),
    [],
  );

  useGSAP(
    () => {
      animateFormEntrance(containerRef.current);
    },
    { dependencies: [isLogin], scope: containerRef },
  );

  const toggleMode = () => {
    setIsLogin(!isLogin);
    clearErrors();
    setTurnstileToken(null);
  };

  return (
    <div ref={containerRef} className={styles.container}>
      <div className={styles.header}>
        <h1>{isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}</h1>
        <p>{isLogin ? 'Faça login para continuar' : 'Comece sua jornada sustentável'}</p>
      </div>

      <form className={styles.formContainer} onSubmit={(e) => void handleSubmit(e)}>
        {isLogin ? (
          <LoginForm
            data={formData}
            errors={fieldErrors}
            onChange={handleInputChange}
            inputRefs={refs}
            disabled={isLoading}
          />
        ) : (
          <RegisterForm
            data={formData}
            errors={fieldErrors}
            onChange={handleInputChange}
            inputRefs={refs}
            disabled={isLoading}
          />
        )}

        <div className={styles.turnstileWrapper}>
          <Turnstile
            key={isLogin ? 'login' : 'register'}
            siteKey={String(import.meta.env.VITE_TURNSTILE_SITE_KEY)}
            options={turnstileOptions}
            onSuccess={setTurnstileToken}
            onExpire={() => setTurnstileToken(null)}
            onError={() => setTurnstileToken(null)}
          />
        </div>

        <button type="submit" disabled={isLoading || turnstileToken === null}>
          {isLoading ? 'Carregando...' : isLogin ? 'Entrar' : 'Registrar'}
        </button>
      </form>

      <div className={styles.footer}>
        <button type="button" className={styles.toggleLink} onClick={toggleMode}>
          {isLogin ? 'Ainda não tem uma conta? Registre-se' : 'Já tem uma conta? Faça login'}
        </button>
      </div>
    </div>
  );
};

export default AuthFeature;
