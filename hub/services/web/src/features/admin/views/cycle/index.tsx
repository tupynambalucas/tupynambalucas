import { useEffect, useState } from 'react';
import styles from './styles.module.css';
import CreateCycle from './components/CycleCreate';
import {
  ActiveCycleDashboard,
  ActiveCycleFilters,
  ActiveCycleProductsList,
} from './components/ActiveCycle';
import CyclesHistory from './components/CycleHistory';
import ContainerLoader from '@/shared/ui/loaders/ContainerLoader';
import { useActiveCycle, useCycleActions, useCycleLoading } from '@/domains/cycle';
import { useAdminCycleStore } from '@/features/admin/domains/cycle';

const CyclesView = () => {
  const activeCycle = useActiveCycle();
  const { fetchActiveCycle } = useCycleActions();
  const isLoadingActive = useCycleLoading();
  const { success, resetStatus, activeCycleViewMode } = useAdminCycleStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    void fetchActiveCycle();
  }, [fetchActiveCycle]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => resetStatus(), 3000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [success, resetStatus]);

  if (activeCycleViewMode === 'products' && activeCycle) {
    return (
      <div className={styles.container}>
        <section>
          <ActiveCycleFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedType={selectedType}
            setSelectedType={setSelectedType}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </section>

        <section>
          <ActiveCycleProductsList
            searchTerm={searchTerm}
            selectedType={selectedType}
            selectedCategory={selectedCategory}
          />
        </section>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <section>
        {isLoadingActive ? (
          <ContainerLoader />
        ) : activeCycle ? (
          <ActiveCycleDashboard />
        ) : (
          <CreateCycle />
        )}
      </section>

      <section>
        <CyclesHistory />
      </section>
    </div>
  );
};

export default CyclesView;
