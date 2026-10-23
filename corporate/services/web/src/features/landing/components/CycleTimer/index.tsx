import { useEffect, useState, useRef, useCallback } from 'react';
import { differenceInSeconds, format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { useActiveCycle, useCycleActions } from '@/domains/cycle';
import { animateTimerEntrance, animateSecondsTick } from './animations';
import styles from './styles.module.css';

interface TimeUnitProps {
  value: number;
  label: string;
  className?: string;
}

const TimeUnit = ({ value, label, className = '' }: TimeUnitProps) => (
  <div className={styles.timeUnit}>
    <div className={`${styles.numberBox} ${className}`}>
      <span>{String(value).padStart(2, '0')}</span>
    </div>
    <span className={styles.label}>{label}</span>
  </div>
);

const CycleTimer = () => {
  const activeCycle = useActiveCycle();
  const { fetchActiveCycle } = useCycleActions();
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const calculateTime = useCallback(() => {
    if (activeCycle?.openingDate === undefined || activeCycle.status === 'CLOSED') {
      return null;
    }

    const now = new Date();
    const openDate = new Date(activeCycle.openingDate);
    const diff = differenceInSeconds(openDate, now);

    if (diff <= 0) {
      void fetchActiveCycle();
      return null;
    }

    const d = Math.floor(diff / (3600 * 24));
    const h = Math.floor((diff % (3600 * 24)) / 3600);
    const m = Math.floor((diff % 3600) / 60);
    const s = diff % 60;

    return { d, h, m, s };
  }, [activeCycle, fetchActiveCycle]);

  const [time, setTime] = useState(() => calculateTime() ?? { d: 0, h: 0, m: 0, s: 0 });
  const [prevCycle, setPrevCycle] = useState(activeCycle);

  // Sync state during render when activeCycle changes
  if (activeCycle !== prevCycle) {
    setPrevCycle(activeCycle);
    const updated = calculateTime();
    if (updated !== null) setTime(updated);
  }

  useEffect(() => {
    if (activeCycle !== null && containerRef.current !== null) {
      animateTimerEntrance(containerRef.current);
    }
  }, [activeCycle]);

  useEffect(() => {
    const timer = setInterval(() => {
      const newTime = calculateTime();
      if (newTime !== null) {
        setTime(newTime);
        animateSecondsTick(`.${styles.secondsRef}`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTime]);

  const isClosed = activeCycle?.status === 'CLOSED';
  const displayDate =
    activeCycle?.openingDate !== undefined ? new Date(activeCycle.openingDate) : new Date();
  const formattedDate = format(displayDate, "EEEE, dd 'de' MMMM", { locale: ptBR });

  return (
    <div className={styles.timerContainer}>
      <h2 className={styles.title} ref={titleRef}>
        {isClosed === true ? 'Ciclo Encerrado em ' : 'Próximo ciclo abre em '}
        <span className={styles.dateHighlight}>{formattedDate}</span>
      </h2>

      {isClosed === true ? (
        <div className={styles.closedMessage}>
          <p className={styles.subtitle}>
            Este ciclo já foi finalizado. Aguarde a divulgação das datas para a próxima feira.
          </p>
        </div>
      ) : (
        <>
          <div className={styles.timerGrid} ref={containerRef}>
            <TimeUnit value={time.d} label="Dias" />
            <div className={styles.separator}>:</div>
            <TimeUnit value={time.h} label="Horas" />
            <div className={styles.separator}>:</div>
            <TimeUnit value={time.m} label="Minutos" />
            <div className={styles.separator}>:</div>
            <TimeUnit value={time.s} label="Segundos" className={styles.secondsRef} />
          </div>
          <p className={styles.subtitle}>Prepare sua lista! A loja abrirá automaticamente.</p>
        </>
      )}
    </div>
  );
};

export default CycleTimer;
