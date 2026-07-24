import React from 'react';
import { GraphExplorer } from './features/graph-explorer/GraphExplorer';
import { VectorPlayground } from './features/vector-playground/VectorPlayground';
import { DocsSyncStatus } from './features/docs-sync/DocsSyncStatus';
import { Cpu, Database } from 'lucide-react';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8">
      <header className="max-w-7xl mx-auto mb-8 flex items-center justify-between border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-100 tracking-tight">
              Cortex Memory Subsystem
            </h1>
            <p className="text-xs text-slate-400">
              MongoDB 7.0 Vector RAG • Episodic Chat Memory • Docs Knowledge Graph
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
          <Database className="w-4 h-4 text-emerald-400" />
          <span>MongoDB Vector Engine</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto space-y-6">
        <DocsSyncStatus />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GraphExplorer />
          <VectorPlayground />
        </div>
      </main>
    </div>
  );
};

export default App;
