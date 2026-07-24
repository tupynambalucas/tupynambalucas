import React from 'react';
import { useMemoryStore } from '../../../../domains/memory/memory.store.js';
import { X, FileText, Layers, Hash, Calendar, Box } from 'lucide-react';
import styles from './styles.module.css';

export const NodeDetailDrawer: React.FC = () => {
  const { selectedNode, setSelectedNode } = useMemoryStore();

  if (!selectedNode) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.drawer}>
        <div className={styles.drawerBody}>
          {/* Header */}
          <div className={styles.drawerHeader}>
            <div className={styles.headerTitle}>
              <FileText className={styles.fileIcon} />
              <span>Node Inspector</span>
            </div>
            <button onClick={() => setSelectedNode(null)} className={styles.closeBtn}>
              <X className={styles.closeIcon} />
            </button>
          </div>

          {/* Node Badge & Name */}
          <div>
            <span className={styles.typeBadge}>{selectedNode.type}</span>
            <h4 className={styles.nodeTitle}>{selectedNode.label}</h4>
          </div>

          {/* Metadata Grid */}
          <div className={styles.metaGrid}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>
                <Box className={styles.metaIconIndigo} /> Entity ID
              </span>
              <span className={styles.metaValue}>{selectedNode.id}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>
                <Layers className={styles.metaIconEmerald} /> Dimensions
              </span>
              <span className={styles.metaValue}>128d Vector</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>
                <Hash className={styles.metaIconAmber} /> Hash Check
              </span>
              <span className={styles.metaValue}>SHA-256 Verified</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>
                <Calendar className={styles.metaIconPurple} /> Database
              </span>
              <span className={styles.metaValue}>MongoDB 7.0</span>
            </div>
          </div>
        </div>

        <button onClick={() => setSelectedNode(null)} className={styles.closeBtnFull}>
          Close Inspector
        </button>
      </div>
    </div>
  );
};

export default NodeDetailDrawer;
