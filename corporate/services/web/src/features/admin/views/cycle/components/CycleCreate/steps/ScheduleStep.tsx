import React, { forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from '../styles.module.css';

// Reutilize a configuração de locale no componente pai ou aqui se necessário

const CustomDataButton = forwardRef<HTMLButtonElement, { value?: string; onClick?: () => void }>(
  ({ value, onClick }, ref) => (
    <button className={styles.dataPicker} type="button" onClick={onClick} ref={ref}>
      {value ?? 'Selecionar Data'}
    </button>
  ),
);
CustomDataButton.displayName = 'CustomDataButton';

interface ScheduleStepProps {
  description: string;
  setDescription: (val: string) => void;
  openingDate: Date | null;
  closingDate: Date | null;
  isSubmitting: boolean;
  onOpeningDateChange: (date: Date | null) => void;
  onClosingDateChange: (date: Date | null) => void;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ScheduleStep: React.FC<ScheduleStepProps> = ({
  description,
  setDescription,
  openingDate,
  closingDate,
  isSubmitting,
  onOpeningDateChange,
  onClosingDateChange,
  onBack,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className={styles.stepContainer}>
      <h3>Configurações do Ciclo</h3>

      <div className={styles.formGroup}>
        <label>Descrição (Opcional)</label>
        <input
          type="text"
          className={styles.descriptionInput}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ex: Ciclo Semanal #42"
        />
      </div>

      <div className={styles.formGroup}>
        <label>Período de Vendas</label>
        <div className={styles.dateGrid}>
          <div className={styles.field}>
            <label>Abertura</label>
            <DatePicker
              selected={openingDate}
              onChange={onOpeningDateChange}
              locale="pt-BR"
              showTimeSelect
              dateFormat="dd/MM/yyyy HH:mm"
              customInput={<CustomDataButton />}
            />
          </div>
          <div className={styles.field}>
            <label>Fechamento</label>
            <DatePicker
              selected={closingDate}
              onChange={onClosingDateChange}
              locale="pt-BR"
              showTimeSelect
              dateFormat="dd/MM/yyyy HH:mm"
              customInput={<CustomDataButton />}
            />
          </div>
        </div>
      </div>

      <footer className={styles.actions}>
        <button type="button" className={styles.secondaryBtn} onClick={onBack}>
          Voltar
        </button>
        <button
          type="submit"
          className={styles.primaryBtn}
          disabled={isSubmitting || !openingDate || !closingDate}
        >
          {isSubmitting ? 'Criando...' : 'Criar Ciclo'}
        </button>
      </footer>
    </form>
  );
};
