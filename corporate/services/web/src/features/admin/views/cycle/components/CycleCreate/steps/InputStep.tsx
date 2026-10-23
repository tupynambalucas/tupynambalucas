import React from 'react';
import styles from '../styles.module.css';

interface InputStepProps {
  value: string;
  onChange: (value: string) => void;
  onParse: () => void;
}

export const InputStep: React.FC<InputStepProps> = ({ value, onChange, onParse }) => {
  return (
    <div className={styles.stepContainer}>
      <p>Cole a lista do WhatsApp enviada pelo distribuidor abaixo.</p>

      <textarea
        className={styles.listInput}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ex: Alface Americana un R$ 3,50..."
      />

      <footer className={styles.actions}>
        <button
          type="button"
          className={styles.primaryBtn}
          onClick={onParse}
          disabled={!value.trim()}
        >
          Processar Lista
        </button>
      </footer>
    </div>
  );
};
