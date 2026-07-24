import React from 'react';
import { useMemoryStore } from '../../domains/memory/memory.store.js';
import { Cpu, Database, Network, Search, MessageSquare, Activity, RefreshCw } from 'lucide-react';
import styles from './styles.module.css';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    apiHealthy,
    graphData,
    isSyncingDocs,
    triggerDocsSync,
    syncStatus,
  } = useMemoryStore();

  const totalNodes = graphData?.nodes.length ?? 0;
  const isHealthy = apiHealthy === true;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <div className={styles.brandInfo}>
          <div className={styles.brandLogo}>
            <Cpu className={styles.brandLogoIcon} />
          </div>
          <div>
            <div className={styles.titleRow}>
              <h1 className={styles.appTitle}>Cortex Memory</h1>
              <span className={styles.versionBadge}>v1.0</span>
            </div>
            <p className={styles.subtitle}>MongoDB 7.0 Vector Hub</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className={styles.navMenu}>
          <span className={styles.navSectionLabel}>Panels Navigation</span>

          <button
            onClick={() => setActiveTab('graph')}
            className={`${styles.navItem} ${activeTab === 'graph' ? styles.activeNavItem : ''}`}
          >
            <Network className={styles.navItemIcon} />
            <span>Graph Topology</span>
          </button>

          <button
            onClick={() => setActiveTab('vector')}
            className={`${styles.navItem} ${activeTab === 'vector' ? styles.activeNavItem : ''}`}
          >
            <Search className={styles.navItemIcon} />
            <span>RAG Playground</span>
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`${styles.navItem} ${activeTab === 'chat' ? styles.activeNavItem : ''}`}
          >
            <MessageSquare className={styles.navItemIcon} />
            <span>Episodic Memory Chat</span>
          </button>
        </nav>

        {/* Telemetry Status Section */}
        <div className={styles.telemetrySection}>
          <span className={styles.telemetryTitle}>System Telemetry</span>

          <div className={styles.telemetryRow}>
            <div className={styles.telemetryItemInfo}>
              <Database className={styles.iconEngine} />
              <span>Engine</span>
            </div>
            <span className={styles.valueEngine}>Mongo 7.0</span>
          </div>

          <div className={styles.telemetryRow}>
            <div className={styles.telemetryItemInfo}>
              <Activity
                className={isHealthy ? styles.iconStatusHealthy : styles.iconStatusPending}
              />
              <span>API Status</span>
            </div>
            <span className={isHealthy ? styles.valueHealthy : styles.valuePending}>
              {isHealthy ? 'Connected' : 'Checking'}
            </span>
          </div>

          <div className={styles.telemetryRow}>
            <div className={styles.telemetryItemInfo}>
              <Network className={styles.iconNodes} />
              <span>Memory Nodes</span>
            </div>
            <span className={styles.valueNodes}>{totalNodes}</span>
          </div>

          <div className={styles.docsSyncBox}>
            <div className={styles.docsSyncHeader}>
              <span>Docs Ingestion</span>
              <button
                onClick={() => void triggerDocsSync()}
                disabled={isSyncingDocs}
                className={styles.syncBtnMini}
                title="Re-sync docs manually"
              >
                <RefreshCw
                  className={`${styles.syncBtnIcon} ${isSyncingDocs ? styles.spinning : ''}`}
                />
              </button>
            </div>
            <p className={styles.docsSyncText}>{syncStatus ?? 'Auto-synchronized on startup'}</p>
          </div>
        </div>
      </div>

      <div className={styles.sidebarFooter}>
        <span>workspace: cortex/memory</span>
      </div>
    </aside>
  );
};

export default Sidebar;
