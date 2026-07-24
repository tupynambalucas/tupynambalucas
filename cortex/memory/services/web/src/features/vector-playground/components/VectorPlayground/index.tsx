import React, { useState } from 'react';
import { useMemoryStore } from '../../../../domains/memory/memory.store.js';
import { Search, Sparkles, FileCode, Tag } from 'lucide-react';
import styles from './styles.module.css';

export const VectorPlayground: React.FC = () => {
  const [query, setQuery] = useState('');
  const { searchResults, isSearching, searchVector } = useMemoryStore();

  const presets = [
    'Principles and architecture constraints',
    'Bounded Contexts monorepo rules',
    'Guardrails gRPC protocol setup',
    'Fastify and MongoDB memory core',
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    void searchVector(query);
  };

  const handlePresetClick = (preset: string) => {
    setQuery(preset);
    void searchVector(preset);
  };

  return (
    <div className={styles.card}>
      <h3 className={styles.headerTitle}>Vector Search & RAG Playground</h3>
      <p className={styles.headerSubtitle}>
        Query MongoDB 7.0 $vectorSearch index with 128-dimensional embeddings
      </p>

      <form onSubmit={handleSearch} className={styles.searchForm}>
        <div className={styles.inputWrapper}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a query (e.g. principles, bounded contexts, fastify)..."
            className={styles.searchInput}
          />
        </div>
        <button type="submit" disabled={isSearching || !query.trim()} className={styles.submitBtn}>
          {isSearching ? 'Searching...' : 'Search'}
        </button>
      </form>

      {/* Preset Pills */}
      <div className={styles.presetsBar}>
        <span className={styles.presetLabel}>
          <Tag className={styles.tagIcon} /> Presets:
        </span>
        {presets.map((preset) => (
          <button
            key={preset}
            onClick={() => handlePresetClick(preset)}
            className={styles.presetPill}
          >
            {preset}
          </button>
        ))}
      </div>

      {/* Results List */}
      {searchResults.length === 0 ? (
        <div className={styles.emptyResults}>
          <Sparkles className={styles.sparklesIcon} />
          Enter a prompt above or click a preset to query MongoDB vector index.
        </div>
      ) : (
        <div className={styles.resultsList}>
          {searchResults.map((item, idx) => {
            const matchScorePct = (item.score * 100).toFixed(1);
            return (
              <div key={item.entity.id ?? idx} className={styles.resultCard}>
                <div className={styles.cardHeader}>
                  <span className={styles.entityName}>
                    <FileCode className={styles.fileCodeIcon} />
                    {item.entity.name}
                  </span>
                  <span className={styles.scoreBadge}>Match: {matchScorePct}%</span>
                </div>

                <div className={styles.snippetBox}>{item.entity.content}</div>

                {item.entity.metadata.filePath != null && item.entity.metadata.filePath !== '' ? (
                  <div className={styles.sourceFooter}>
                    <span>Source: {item.entity.metadata.filePath}</span>
                    {item.entity.metadata.section != null && item.entity.metadata.section !== '' ? (
                      <span className={styles.sectionHash}>#{item.entity.metadata.section}</span>
                    ) : null}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VectorPlayground;
