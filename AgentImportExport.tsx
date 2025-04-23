import React, { useState, useRef } from 'react';
import { Button } from './components/ui/button';

export default function AgentImportExport({ agentId, onAgentUpdated }: {
  agentId?: string;
  onAgentUpdated?: (agent: any) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [schemaVersion, setSchemaVersion] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch current agent version on mount or agentId change
  React.useEffect(() => {
    if (!agentId) return;
    setLoading(true);
    fetch(`/api/agents/${agentId}`)
      .then(res => res.json())
      .then(agent => {
        setSchemaVersion(agent.schema_version || agent.schemaVersion || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [agentId]);

  // Import agent (POST /api/agents/import)
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append('file', file);
      setLoading(true);
      const res = await fetch('/api/agents/import', {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error('Import failed');
      const agent = await res.json();
      onAgentUpdated?.(agent);
      setSchemaVersion(agent.schema_version || agent.schemaVersion || null);
      setLoading(false);
    } catch (err) {
      setImportError('Invalid agent file or import failed.');
      setLoading(false);
    }
  };

  // Export agent (GET /api/agents/:id/export)
  const handleExport = async () => {
    if (!agentId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/agents/${agentId}/export`);
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `agent_${agentId}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } finally {
      setLoading(false);
    }
  };

  // Increment version (POST /api/agents/:id/version)
  const handleVersion = async () => {
    if (!agentId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/agents/${agentId}/version`, { method: 'POST' });
      if (!res.ok) throw new Error('Version increment failed');
      const data = await res.json();
      setSchemaVersion(data.schema_version || data.schemaVersion || null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 items-center">
        <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={loading}>
          Import Agent
        </Button>
        <input
          type="file"
          accept="application/json"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleImport}
        />
        <Button variant="outline" onClick={handleExport} disabled={!agentId || loading}>
          Export Agent
        </Button>
        <Button variant="outline" onClick={handleVersion} disabled={!agentId || loading}>
          New Version
        </Button>
        {schemaVersion && (
          <span className="ml-4 text-sm text-gray-600">Current Version: <b>{schemaVersion}</b></span>
        )}
      </div>
      {importError && <div className="text-red-500 text-sm">{importError}</div>}
    </div>
  );
}