'use client';

import { IncidentSummary } from '@/components/incident-summary';
import { AgentOrchestration } from '@/components/agent-orchestration';
import { LogViewer } from '@/components/log-viewer';
import { RootCauseReport } from '@/components/root-cause-report';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, ScrollText, BookOpen, Code2, GitBranch, Database } from 'lucide-react';

const evidenceSources = [
  { icon: FileText, label: 'Incident Ticket', file: 'INC-2026-0417.json', status: 'loaded' },
  { icon: ScrollText, label: 'Test Execution Logs', file: 'TGV-A-245_S-ATP-014.log', status: 'loaded' },
  { icon: BookOpen, label: 'Requirements PDF', file: 'ATP_Requirements_v3.2.pdf', status: 'loaded' },
  { icon: BookOpen, label: 'Architecture Docs', file: 'A-ATB-002_architecture.pdf', status: 'loaded' },
  { icon: GitBranch, label: 'Historical Defects', file: 'defect_db_export.csv', status: 'loaded' },
  { icon: Code2, label: 'Work Items (EWM)', file: 'WI-4821_export.json', status: 'loaded' },
  { icon: Database, label: 'Source Code Refs', file: 'BrakeProfiler.cpp@a8f3c21', status: 'loaded' },
];

export default function AnalysisPage() {
  return (
    <div className="mx-auto max-w-[1600px] px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Root Cause Analysis</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Incident INC-2026-0417 — full multi-agent pipeline
        </p>
      </div>

      {/* Evidence sources */}
      <Card>
        <CardHeader className="border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Evidence Sources</CardTitle>
            <Badge variant="secondary" className="gap-1.5 text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-success" /> 7 sources loaded
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {evidenceSources.map((src, i) => {
              const Icon = src.icon;
              return (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-lg border border-border bg-muted/20 p-3"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-card text-primary border border-border">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold">{src.label}</p>
                    <p className="text-[10px] text-muted-foreground truncate font-mono">{src.file}</p>
                  </div>
                  <span className="h-2 w-2 rounded-full bg-success shrink-0" />
                </div>
              );
            })}
            <button className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-border p-3 text-sm text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors">
              <Upload className="h-4 w-4" /> Upload more
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Incident summary */}
      <IncidentSummary />

      {/* Agent pipeline + logs */}
      <div className="grid gap-6 lg:grid-cols-2">
        <AgentOrchestration />
        <LogViewer />
      </div>

      {/* Root cause report */}
      <RootCauseReport />
    </div>
  );
}
