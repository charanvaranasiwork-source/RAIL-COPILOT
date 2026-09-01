'use client';

import { KnowledgeGraph } from '@/components/knowledge-graph';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { graphNodes } from '@/lib/rca-data';
import { Info } from 'lucide-react';

export default function GraphPage() {
  const typeCounts = graphNodes.reduce<Record<string, number>>((acc, n) => {
    acc[n.type] = (acc[n.type] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-[1600px] px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Railway Knowledge Graph</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Interactive traceability — requirement → component → test → defect → root cause
        </p>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex items-start gap-3 p-4">
          <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            Click any node to highlight its connections and view details. Dashed lines indicate
            violation or similarity relationships. Red dots mark nodes with a failure status.
          </p>
        </CardContent>
      </Card>

      <KnowledgeGraph />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Nodes</p>
            <p className="text-2xl font-bold mt-1">{graphNodes.length}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {Object.entries(typeCounts).map(([type, count]) => (
                <span key={type} className="inline-flex items-center rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                  {type}: {count}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Edges (relationships)</p>
            <p className="text-2xl font-bold mt-1">9</p>
            <p className="text-xs text-muted-foreground mt-1">7 direct + 2 semantic</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Failed nodes</p>
            <p className="text-2xl font-bold mt-1 text-destructive">
              {graphNodes.filter((n) => n.status === 'fail').length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">in the traceability chain</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
