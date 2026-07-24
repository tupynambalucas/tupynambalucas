import React from 'react';
import { useMemoryStore } from '../../../../domains/memory/memory.store.js';
import { BookOpen, RefreshCw } from 'lucide-react';
import styles from './styles.module.css';

export const DocsSyncStatus: React.FC = () => {
  const { isSyncingDocs, syncStatus, triggerDocsSync } = useMemoryStore();

  const displayStatus =
    syncStatus ?? 'Ready for incremental synchronization (SHA-256 hash verified)';

  return (
    <div className={styles.cardContainer}>
      <div className={styles.syncBox}>
        <div className={styles.syncInfo}>
          <div className={styles.iconWrapper}>
            <BookOpen className={styles.bookIcon} />
          </div>
          <div>
            <h4 className={styles.title}>Documentation RAG Pipeline (docs/)</h4>
            <p className={styles.subtitle}>{displayStatus}</p>
          </div>
        </div>

        <button
          onClick={() => void triggerDocsSync()}
          disabled={isSyncingDocs}
          className={styles.syncBtn}
        >
          <RefreshCw className={`${styles.syncBtnIcon} ${isSyncingDocs ? styles.spinning : ''}`} />
          {isSyncingDocs ? 'Syncing...' : 'Sync Docs Now'}
        </button>
      </div>
    </div>
  );
};

export default DocsSyncStatus;
