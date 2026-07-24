import React, { useState } from 'react';
import { useMemoryStore } from '../../domains/memory/memory.store';
import { Card } from '../../shared/ui/Card';
import { Button } from '../../shared/ui/Button';
import { Badge } from '../../shared/ui/Badge';
import { Search, Sparkles } from 'lucide-react';

export const VectorPlayground: React.FC = () => {
  const [query, setQuery] = useState('');
  const { searchResults, isSearching, searchVector } = useMemoryStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    void searchVector(query);
  };

  return (
    <Card
      title="Vector Search RAG Playground"
      subtitle="Test similarity search queries against MongoDB $vectorSearch indexes"
    >
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. React 19 hooks or Fastify architecture setup"
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <Button type="submit" disabled={isSearching || !query.trim()}>
          {isSearching ? 'Searching...' : 'Search'}
        </Button>
      </form>

      {searchResults.length === 0 ? (
        <div className="text-center py-8 text-xs text-slate-500 border border-dashed border-slate-800 rounded-lg">
          Type a search prompt above to test MongoDB vector similarity retrieval.
        </div>
      ) : (
        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
          {searchResults.map((item, idx) => (
            <div
              key={item.entity.id ?? idx}
              className="bg-slate-950 border border-slate-800/90 rounded-lg p-3 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-sm text-indigo-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  {item.entity.name}
                </span>
                <div className="flex items-center gap-2">
                  <Badge variant="success">score: {(item.score * 100).toFixed(1)}%</Badge>
                  <Badge variant="info">{item.entity.type}</Badge>
                </div>
              </div>
              <p className="text-xs text-slate-300 line-clamp-3 mb-2 font-mono bg-slate-900/60 p-2 rounded border border-slate-800/60">
                {item.entity.content}
              </p>
              {item.entity.metadata.filePath != null && item.entity.metadata.filePath !== '' ? (
                <span className="text-[10px] text-slate-500 font-mono">
                  Source: {item.entity.metadata.filePath}
                </span>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
