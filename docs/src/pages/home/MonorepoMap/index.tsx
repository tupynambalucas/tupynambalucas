import React, { useState } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Translate from '@docusaurus/Translate';
import Link from '@docusaurus/Link';
import { WORKSPACES, type WorkspaceInfo } from './data';
import styles from './styles.module.css';

export default function MonorepoMap() {
  const { i18n } = useDocusaurusContext();
  const isPtBR = i18n.currentLocale === 'pt-BR';

  const workspaceKeys = Object.keys(WORKSPACES);
  const [selectedId, setSelectedId] = useState<string>(workspaceKeys[0] || 'cortex');

  const getLocalizedWorkspace = (ws: WorkspaceInfo): WorkspaceInfo => {
    if (!isPtBR || !ws.ptBR) return ws;
    return { ...ws, ...ws.ptBR };
  };

  const selectedWorkspace = getLocalizedWorkspace(
    WORKSPACES[selectedId] || WORKSPACES[workspaceKeys[0]],
  );

  return (
    <section className={styles.monorepoSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>
            <Translate id="homepage.monorepo.title">Monorepo Map</Translate>
          </h2>
          <p>
            <Translate id="homepage.monorepo.subtitle">
              Interactive visualization of the tupynambalucas.dev bounded contexts. Select a
              workspace to explore.
            </Translate>
          </p>
        </div>

        {/* Workspace Selector Buttons */}
        <div className={styles.workspaceSelector}>
          {workspaceKeys.map((key) => {
            const ws = WORKSPACES[key];
            const localized = getLocalizedWorkspace(ws);
            const isActive = selectedId === key;
            return (
              <button
                key={key}
                type="button"
                className={`${styles.selectorButton} ${isActive ? styles.activeButton : ''}`}
                onClick={() => setSelectedId(key)}
              >
                {localized.name}
              </button>
            );
          })}
        </div>

        {/* Dynamic Summary Panel */}
        <div className={styles.detailsPanel}>
          <div className={styles.detailsContent}>
            <div className={styles.panelHeader}>
              <span className={styles.pathTag}>{selectedWorkspace.path}</span>
              <h3>{selectedWorkspace.name}</h3>
            </div>
            <p className={styles.description}>{selectedWorkspace.description}</p>

            <div className={styles.metadataSection}>
              <h4>
                <Translate id="homepage.monorepo.techstack">Tech Stack</Translate>
              </h4>
              <div className={styles.tagGrid}>
                {selectedWorkspace.stack.map((tech) => (
                  <span key={tech} className={styles.techTag}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className={styles.metadataSection}>
              <h4>
                <Translate id="homepage.monorepo.responsibilities">Core Responsibilities</Translate>
              </h4>
              <ul className={styles.responsibilityList}>
                {selectedWorkspace.responsibilities.map((resp) => (
                  <li key={resp}>{resp}</li>
                ))}
              </ul>
            </div>

            <div className={styles.actionSection}>
              <Link to={selectedWorkspace.path} className={styles.docButton}>
                <Translate id="homepage.monorepo.viewDocs">View Workspace Documentation</Translate>
                <span className={styles.arrow}>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
