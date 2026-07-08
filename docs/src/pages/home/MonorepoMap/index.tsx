import React, { useState } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Translate from '@docusaurus/Translate';
import ArchitectureDiagram from '../ArchitectureDiagram';
import { WORKSPACES, MONOREPO_OVERVIEW, type WorkspaceInfo } from './data';
import styles from './styles.module.css';

export default function MonorepoMap() {
  const { i18n } = useDocusaurusContext();
  const isPtBR = i18n.currentLocale === 'pt-BR';
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const getLocalizedWorkspace = (ws: WorkspaceInfo): WorkspaceInfo => {
    if (!isPtBR || !ws.ptBR) return ws;
    return { ...ws, ...ws.ptBR };
  };

  const selectedWorkspace = getLocalizedWorkspace(
    selectedId ? WORKSPACES[selectedId] : MONOREPO_OVERVIEW,
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
              Interactive visualization of the tupynambalucas.dev bounded contexts. Click on a
              context to explore.
            </Translate>
          </p>
        </div>

        <div className={styles.interactiveContent}>
          {/* Details Panel */}
          <div className={styles.detailsPanel}>
            <div className={styles.detailsContent}>
              <span className={styles.pathTag}>{selectedWorkspace.path}</span>
              <h3>{selectedWorkspace.name}</h3>
              <p>{selectedWorkspace.description}</p>

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
                  <Translate id="homepage.monorepo.responsibilities">
                    Core Responsibilities
                  </Translate>
                </h4>
                <ul className={styles.responsibilityList}>
                  {selectedWorkspace.responsibilities.map((resp) => (
                    <li key={resp}>{resp}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Diagram Wrapper */}
          <div className={styles.diagramWrapper}>
            <ArchitectureDiagram onSelect={setSelectedId} activeId={selectedId} />
          </div>
        </div>
      </div>
    </section>
  );
}
