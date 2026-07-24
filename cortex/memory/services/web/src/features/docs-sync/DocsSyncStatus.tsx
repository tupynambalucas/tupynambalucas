import React from 'react';
import { useMemoryStore } from '../../domains/memory/memory.store';
import { Card } from '../../shared/ui/Card';
import { Button } from '../../shared/ui/Button';
import { BookOpen, RefreshCw } from 'lucide-react';

export const DocsSyncStatus: React.FC = () => {
  const { isSyncingDocs, syncStatus, triggerDocsSync } = useMemoryStore();

  const displayStatus =
    syncStatus ?? 'Ready for incremental synchronization (SHA-256 hash verified)';

  return (
    <Card
      title="Docs Ingestion & RAG Sync Control"
      subtitle="Incremental Markdown chunking & vector embedding pipeline for docs/"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-950 border border-slate-800 p-4 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-200">
              Documentation RAG Pipeline (docs/)
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">{displayStatus}</p>
          </div>
        </div>

        <Button
          onClick={() => void triggerDocsSync()}
          disabled={isSyncingDocs}
          variant="secondary"
          size="sm"
          className="w-full sm:w-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-2 ${isSyncingDocs ? 'animate-spin' : ''}`} />
          {isSyncingDocs ? 'Syncing...' : 'Sync Docs Now'}
        </Button>
      </div>
    </Card>
  );
};
