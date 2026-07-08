import { useEffect, Suspense, lazy } from 'react';
import { useAuthUser, useIsAuthenticated, useIsAuthLoading, useAuthActions } from '@/domains/auth';
import { useActiveCycle, useCycleActions } from '@/domains/cycle';
import { initializeCsrf } from '@/lib/axios';
import '@/i18n';

const AdminLayout = lazy(() => import('@/features/admin'));
const ShopLayout = lazy(() => import('@/features/shop'));
const LandingLayout = lazy(() => import('@/features/landing'));

function App() {
  const user = useAuthUser();
  const isAuthenticated = useIsAuthenticated();
  const isAuthLoading = useIsAuthLoading();
  const { verifyAuth } = useAuthActions();
  const activeCycle = useActiveCycle();
  const { fetchActiveCycle } = useCycleActions();

  useEffect(() => {
    const initApp = async (): Promise<void> => {
      await initializeCsrf();
      await verifyAuth();
    };
    void initApp();
  }, [verifyAuth]);

  useEffect(() => {
    if (isAuthenticated === true && user !== null && user.role !== 'admin') {
      void fetchActiveCycle();
    }
  }, [isAuthenticated, user, fetchActiveCycle]);

  if (isAuthLoading === true) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      {isAuthenticated === true && user?.role === 'admin' ? (
        <AdminLayout />
      ) : isAuthenticated === true && activeCycle?.status === 'OPEN' ? (
        <ShopLayout />
      ) : (
        <LandingLayout />
      )}
    </Suspense>
  );
}

export default App;
