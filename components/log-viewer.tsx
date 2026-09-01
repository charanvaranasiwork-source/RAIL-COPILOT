'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { logEntries } from '@/lib/rca-data';
import { AlertTriangle, Zap } from 'lucide-react';

const levelColors: Record<string, string> = {
  INFO: 'text-muted-foreground',
  WARN: 'text-warning-foreground',
  ERROR: 'text-destructive',
  DEBUG: 'text-muted-foreground/70',
};

const levelBg: Record<string, string> = {
  INFO: 'bg-transparent',
  WARN: 'bg-warning/5',
  ERROR: 'bg-destructive/5',
  DEBUG: 'bg-transparent',
};

export function LogViewer() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Train Execution Logs</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="destructive" className="gap-1 text-[10px]">
              <AlertTriangle className="h-3 w-3" /> 3 anomalies
            </Badge>
            <Badge variant="secondary" className="text-[10px] font-mono">
              {logEntries.length} lines
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[420px] overflow-y-auto scrollbar-thin font-mono text-xs">
          {logEntries.map((entry, i) => (
            <div
              key={i}
              className={cn(
                'flex items-start gap-3 px-4 py-2 border-b border-border/30 transition-colors',
                levelBg[entry.level],
                entry.anomaly && 'border-l-2 border-l-destructive bg-destructive/5',
                'hover:bg-accent/30',
              )}
            >
              {entry.anomaly && (
                <Zap className="h-3 w-3 text-destructive shrink-0 mt-0.5 fill-destructive" />
              )}
              <span className="text-muted-foreground/80 shrink-0 w-[90px]">
                {entry.timestamp}
              </span>
              <span className={cn('shrink-0 w-12 font-bold', levelColors[entry.level])}>
                {entry.level}
              </span>
              <span className="shrink-0 w-[120px] text-primary/80 font-medium">
                {entry.component}
              </span>
              <span className={cn('flex-1', entry.anomaly && 'text-destructive font-medium')}>
                {entry.message}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
