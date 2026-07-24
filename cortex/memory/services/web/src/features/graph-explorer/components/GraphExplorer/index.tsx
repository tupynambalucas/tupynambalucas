import React, { useEffect, useState, useRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { useMemoryStore } from '../../../../domains/memory/memory.store.js';
import type { GraphNode } from '@tupynambalucas-cortex-memory/core';
import { Network, RefreshCw, Filter, Eye } from 'lucide-react';
import styles from './styles.module.css';

export const GraphExplorer: React.FC = () => {
  const { graphData, isLoadingGraph, fetchGraph, setSelectedNode, selectedNode } = useMemoryStore();
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<'canvas' | 'grid'>('canvas');
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 800, height: 500 });

  useEffect(() => {
    void fetchGraph();
  }, [fetchGraph]);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setCanvasDimensions({
          width: containerRef.current.clientWidth || 800,
          height: Math.max(300, containerRef.current.clientHeight - 40),
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const rawNodes = graphData?.nodes ?? [];
  const rawEdges = graphData?.edges ?? [];

  const filteredNodes = rawNodes.filter((node) => {
    const matchesType = filterType === 'all' || node.type === filterType;
    const matchesSearch =
      node.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (node.workspace?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    return matchesType && matchesSearch;
  });

  const validNodeIds = new Set(filteredNodes.map((n) => n.id));
  const filteredEdges = rawEdges.filter(
    (e) => validNodeIds.has(e.source) && validNodeIds.has(e.target),
  );

  const forceData = {
    nodes: filteredNodes.map((n) => ({ ...n })),
    links: filteredEdges.map((e) => ({ source: e.source, target: e.target, label: e.label })),
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'workspace':
        return '#AA77A7';
      case 'doc_file':
        return '#E2A53C';
      case 'doc_chunk':
        return '#4C4D9A';
      case 'chat_message':
        return '#2E55A3';
      case 'concept':
        return '#10B981';
      default:
        return '#7E7E86';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.headerRow}>
          <div>
            <h3 className={styles.cardTitle}>Knowledge Graph & Topological Force Visualizer</h3>
            <p className={styles.cardSubtitle}>
              Interactive 2D Canvas force-directed graph in MongoDB vector memory
            </p>
          </div>
          <button
            onClick={() => void fetchGraph()}
            className={styles.refreshBtn}
            title="Refresh Graph"
          >
            <RefreshCw
              className={`${styles.refreshIcon} ${isLoadingGraph ? styles.spinning : ''}`}
            />
            <span>Refresh</span>
          </button>
        </div>

        {/* Controls Toolbar */}
        <div className={styles.toolbar}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search nodes or workspaces..."
            className={styles.searchInput}
          />

          <div className={styles.filterGroup}>
            <Filter className={styles.filterIcon} />
            {['all', 'workspace', 'doc_file', 'doc_chunk', 'chat_message'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`${styles.filterBtn} ${
                  filterType === type ? styles.filterBtnActive : ''
                }`}
              >
                {type === 'all' ? 'All Nodes' : type}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className={styles.viewModeToggle}>
            <button
              onClick={() => setViewMode('canvas')}
              className={`${styles.toggleBtn} ${
                viewMode === 'canvas' ? styles.toggleBtnActive : ''
              }`}
            >
              2D Graph
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`${styles.toggleBtn} ${viewMode === 'grid' ? styles.toggleBtnActive : ''}`}
            >
              Grid
            </button>
          </div>
        </div>

        {/* Canvas & Node Display */}
        <div className={styles.canvasWrapper} ref={containerRef}>
          <div className={styles.graphMetaBar}>
            <span>
              Showing <span className={styles.metaHighlight}>{filteredNodes.length}</span> nodes &{' '}
              <span className={styles.metaHighlight}>{filteredEdges.length}</span> connections
            </span>
            <span className={styles.metaHighlight}>Click node to inspect metadata</span>
          </div>

          {isLoadingGraph ? (
            <div className={styles.loadingBox}>
              <RefreshCw className={`${styles.loadingIcon} ${styles.spinning}`} />
              <span>Loading topological memory graph...</span>
            </div>
          ) : filteredNodes.length === 0 ? (
            <div className={styles.emptyBox}>
              <Network className={styles.emptyIcon} />
              <span>No graph nodes match the selected criteria.</span>
            </div>
          ) : viewMode === 'canvas' ? (
            <div className={styles.graphContainer}>
              <ForceGraph2D
                width={canvasDimensions.width}
                height={canvasDimensions.height}
                graphData={forceData}
                nodeLabel={(node) => `${node.label} (${node.type})`}
                nodeColor={(node) => getNodeColor(node.type)}
                nodeRelSize={6}
                linkDirectionalParticles={2}
                linkDirectionalParticleSpeed={0.006}
                linkDirectionalArrowLength={4}
                linkDirectionalArrowRelPos={1}
                linkLabel={(link) => (link as { label?: string }).label ?? ''}
                linkColor={() => '#2A2A30'}
                onNodeClick={(node) => {
                  const original = rawNodes.find((n) => n.id === node.id);
                  if (original) setSelectedNode(original);
                }}
                nodeCanvasObject={(node, ctx, globalScale) => {
                  const label = node.label;
                  const fontSize = 12 / globalScale;
                  ctx.font = `${fontSize}px Nunito, sans-serif`;
                  const isSelected = selectedNode?.id === node.id;
                  const isWorkspace = node.type === 'workspace';

                  // Node Circle Glow & Size
                  const radius = isWorkspace ? 8 : isSelected ? 7 : 5;
                  ctx.beginPath();
                  ctx.arc(node.x ?? 0, node.y ?? 0, radius, 0, 2 * Math.PI, false);
                  ctx.fillStyle = isSelected ? '#AA77A7' : getNodeColor(node.type);
                  ctx.fill();

                  if (isSelected || isWorkspace) {
                    ctx.lineWidth = 2 / globalScale;
                    ctx.strokeStyle = isWorkspace ? '#AA77A7' : '#ffffff';
                    ctx.stroke();
                  }

                  // Label Text
                  if (globalScale > 1.2 || isSelected || isWorkspace) {
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = '#f6f6f7';
                    ctx.fillText(label, node.x ?? 0, (node.y ?? 0) + 12);
                  }
                }}
              />
            </div>
          ) : (
            <div className={styles.gridContainer}>
              {filteredNodes.map((node: GraphNode) => {
                const isSelected = selectedNode?.id === node.id;
                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className={`${styles.gridNodeCard} ${
                      isSelected ? styles.gridNodeCardSelected : ''
                    }`}
                  >
                    <div className={styles.gridNodeHeader}>
                      <span className={styles.gridNodeLabel}>{node.label}</span>
                      <span className={styles.gridNodeTypeBadge}>{node.type}</span>
                    </div>
                    <div className={styles.gridNodeFooter}>
                      <span>{node.workspace ?? 'docs'}</span>
                      <Eye className={styles.eyeIcon} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GraphExplorer;
