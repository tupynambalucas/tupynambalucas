import React, { useEffect } from 'react';
import { useMemoryStore } from '../../domains/memory/memory.store';
import { Card } from '../../shared/ui/Card';
import { Badge } from '../../shared/ui/Badge';
import { Network, RefreshCw } from 'lucide-react';

export const GraphExplorer: React.FC = () => {
  const { graphData, isLoadingGraph, fetchGraph } = useMemoryStore();

  useEffect(() => {
    void fetchGraph();
  }, [fetchGraph]);

  return (
    <Card
      title="Graph Explorer & Topology Visualizer"
      subtitle="Associative nodes, workspaces, and chat memory edges"
      action={
        <button
          onClick={() => void fetchGraph()}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          title="Refresh Graph"
        >
          <RefreshCw className={`w-4 h-4 ${isLoadingGraph ? 'animate-spin' : ''}`} />
        </button>
      }
    >
      <div className="min-h-[280px] bg-slate-950 border border-slate-800/80 rounded-lg p-4 flex flex-col justify-between relative overflow-hidden">
        {isLoadingGraph ? (
          <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
            Loading topological memory graph...
          </div>
        ) : !graphData || graphData.nodes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-slate-500 text-sm">
            <Network className="w-8 h-8 mb-2 opacity-50" />
            No graph nodes initialized yet. Run docs sync or store chat memory to populate topology.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {graphData.nodes.map((node) => (
              <div
                key={node.id}
                className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 hover:border-indigo-500/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs text-slate-200 truncate">
                    {node.label}
                  </span>
                  <Badge variant={node.type === 'doc_chunk' ? 'info' : 'purple'}>{node.type}</Badge>
                </div>
                {node.workspace != null && node.workspace !== '' ? (
                  <span className="text-[10px] text-slate-400 font-mono">
                    workspace: {node.workspace}
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
