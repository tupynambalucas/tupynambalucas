import React, { useEffect } from 'react';
import { useMemoryStore } from './domains/memory/memory.store.js';
import { Sidebar } from './components/index.js';
import { GraphExplorer, NodeDetailDrawer } from './features/graph-explorer/index.js';
import { VectorPlayground } from './features/vector-playground/index.js';
import { ChatMemoryView } from './features/chat-memory/index.js';

export const App: React.FC = () => {
  const { activeTab, checkHealth } = useMemoryStore();

  useEffect(() => {
    void checkHealth();
  }, [checkHealth]);

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="right-viewport">
        <div className="panel-container">
          {activeTab === 'graph' && <GraphExplorer />}
          {activeTab === 'vector' && <VectorPlayground />}
          {activeTab === 'chat' && <ChatMemoryView />}
        </div>
      </main>
      <NodeDetailDrawer />
    </div>
  );
};

export default App;
