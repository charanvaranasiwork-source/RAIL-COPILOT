'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { similarCases } from '@/lib/rca-data';
import { History, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SimilarCases() {
  return (
    <Card>
      <CardHeader className="border-b bg-muted/30">
        <CardTitle className="text-base flex items-center gap-2">
          <History className="h-4 w-4 text-muted-foreground" />
          Similar Historical Cases
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {similarCases.map((c, i) => (
            <div
              key={c.id}
              className="flex items-center gap-4 p-4 hover:bg-accent/30 transition-colors cursor-pointer group"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-sm font-bold text-muted-foreground">
                #{i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs text-primary font-medium">{c.id}</span>
                  <Badge variant="outline" className="text-[10px]">{c.subsystem}</Badge>
                </div>
                <p className="text-sm font-medium mt-0.5 truncate">{c.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {c.date} — {c.resolution}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <div className={cn(
                  'text-lg font-bold',
                  c.similarity >= 80 ? 'text-destructive' : c.similarity >= 70 ? 'text-warning-foreground' : 'text-muted-foreground',
                )}>
                  {c.similarity}%
                </div>
                <div className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                  match
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
