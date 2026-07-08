import { useEffect, useState } from 'react';
import {
  Icon,
  faTimes,
  faCalendarAlt,
  faChevronLeft,
  faChevronRight,
} from '@tupynambalucas-studio/assets/icons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { IProduct, CycleResponse } from '@tupynambalucas-hub/core';
import { useAdminCycleStore } from '../../../../domains/cycle/cycle.store';
import styles from './styles.module.css';
import { AdminContainer } from '../../../../components';

const CyclesHistory = () => {
  const {
    historyCycles,
    fetchHistory,
    isLoadingHistory,
    selectedCycle,
    fetchCycleDetails,
    clearSelectedCycle,
    isLoadingDetails,
    historyPagination,
  } = useAdminCycleStore();

  const [page, setPage] = useState(1);

  useEffect(() => {
    void fetchHistory({ page });
  }, [page, fetchHistory]);

  const handleSelectCycle = (id: string | undefined) => {
    if (id !== undefined && id !== '') {
      void fetchCycleDetails(id);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((p) => p - 1);
    }
  };

  const handleNextPage = () => {
    if (historyPagination && page < historyPagination.pages) {
      setPage((p) => p + 1);
    }
  };

  const getStatusInfo = (cycle: CycleResponse) => {
    if (cycle.status) {
      switch (cycle.status) {
        case 'OPEN':
          return { label: 'Aberto', className: styles.open };
        case 'CLOSED':
          return { label: 'Encerrado', className: styles.closed };
        case 'PENDING':
          return { label: 'Agendado', className: styles.pending };
      }
    }

    // Fallback based on dates
    const now = new Date();
    const start = new Date(cycle.openingDate);
    const end = new Date(cycle.closingDate);

    if (now < start) return { label: 'Agendado', className: styles.pending };
    if (now > end) return { label: 'Encerrado', className: styles.closed };
    return { label: 'Aberto', className: styles.open };
  };

  if (selectedCycle) {
    return (
      <AdminContainer
        title="Detalhes do Ciclo"
        level="h3"
        headerActions={
          <button type="button" onClick={clearSelectedCycle} className={styles.closeBtn}>
            <Icon icon={faTimes} />
          </button>
        }
      >
        {isLoadingDetails ? (
          <div className={styles.loading}>Carregando...</div>
        ) : (
          <div className={styles.detailContent}>
            <div className={styles.infoBlock}>
              <label htmlFor="period-display">Período</label>
              <p id="period-display">
                {format(new Date(selectedCycle.openingDate), 'dd/MM/yyyy', { locale: ptBR })}
                {' - '}
                {format(new Date(selectedCycle.closingDate), 'dd/MM/yyyy', { locale: ptBR })}
              </p>
            </div>
            <div className={styles.infoBlock}>
              <label htmlFor="products-display">Produtos Ofertados</label>
              <div id="products-display">
                {selectedCycle.products.map((p: string | IProduct, index) => {
                  const productName =
                    typeof p === 'object' && 'name' in p ? p.name : `Produto ID: ${p}`;

                  const key = typeof p === 'object' ? (p._id ?? `p-${index}`) : `s-${p}`;

                  return (
                    <div key={key} className={styles.miniProduct}>
                      {productName}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </AdminContainer>
    );
  }

  return (
    <AdminContainer title="Histórico" level="h3">
      {isLoadingHistory ? (
        <div className={styles.loading}>Carregando...</div>
      ) : historyCycles.length === 0 ? (
        <div className={styles.emptyState}>
          <Icon icon={faCalendarAlt} size="2x" />
          <p>Nenhum ciclo anterior encontrado.</p>
        </div>
      ) : (
        <>
          <div className={styles.list}>
            {historyCycles.map((cycle) => (
              <button
                type="button"
                key={cycle._id ?? `cycle-${cycle.openingDate}`}
                className={styles.card}
                onClick={() => handleSelectCycle(cycle._id)}
              >
                <div className={styles.cardDate}>
                  <strong>{format(new Date(cycle.closingDate), 'dd/MM', { locale: ptBR })}</strong>
                  <span>{format(new Date(cycle.closingDate), 'yyyy', { locale: ptBR })}</span>
                </div>
                <div className={styles.cardInfo}>
                  <span>{cycle.description}</span>
                  {(() => {
                    const info = getStatusInfo(cycle);
                    return (
                      <span className={`${styles.statusTag} ${info.className}`}>{info.label}</span>
                    );
                  })()}
                </div>
              </button>
            ))}
          </div>

          {historyPagination && historyPagination.pages > 1 && (
            <footer>
              <button type="button" onClick={handlePrevPage} disabled={page === 1}>
                <Icon icon={faChevronLeft} />
              </button>
              <span>
                {page} de {historyPagination.pages}
              </span>
              <button
                type="button"
                onClick={handleNextPage}
                disabled={page === historyPagination.pages}
              >
                <Icon icon={faChevronRight} />
              </button>
            </footer>
          )}
        </>
      )}
    </AdminContainer>
  );
};

export default CyclesHistory;
