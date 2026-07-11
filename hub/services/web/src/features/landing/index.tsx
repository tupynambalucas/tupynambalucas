import { lazy, Suspense, useRef } from 'react';
import { useIsAuthenticated } from '@/domains/auth';
import { useActiveCycle, useCycleLoading } from '@/domains/cycle';
import { useGSAP } from '@gsap/react';
import { LogoHorizontalNegative } from '@tupynambalucas-studio/design/logos';
import { animateLandingIntro } from './animations';
import styles from './styles.module.css';

const AuthForm = lazy(() => import('@/features/auth'));
const CycleTimer = lazy(() => import('@/features/landing/components/CycleTimer'));

const LandingLayout = () => {
  const isAuthenticated = useIsAuthenticated();
  const activeCycle = useActiveCycle();
  const isCycleLoading = useCycleLoading();

  const containerRef = useRef<HTMLDivElement>(null);
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const logoWrapperRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (
        leftPanelRef.current === null ||
        logoWrapperRef.current === null ||
        rightPanelRef.current === null
      ) {
        return;
      }

      animateLandingIntro(leftPanelRef.current, logoWrapperRef.current, rightPanelRef.current);
    },
    { scope: containerRef },
  );

  const renderContent = () => {
    if (isAuthenticated === false) {
      return <AuthForm />;
    }
    if (isCycleLoading === true) {
      return null;
    }
    if (activeCycle?.status !== 'OPEN') {
      return <CycleTimer />;
    }
    return null;
  };

  return (
    <div ref={containerRef} className={styles.container}>
      <div ref={leftPanelRef} className={styles.leftPanel}>
        <div className={styles.bannerContainer}>
          <div
            ref={logoWrapperRef}
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <LogoHorizontalNegative />
          </div>
        </div>
      </div>

      <div ref={rightPanelRef} className={styles.rightPanel}>
        <div className={styles.contentWrapper}>
          <Suspense fallback={null}>{renderContent()}</Suspense>
        </div>
      </div>
    </div>
  );
};

export default LandingLayout;
