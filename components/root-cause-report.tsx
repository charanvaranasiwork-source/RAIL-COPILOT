'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle2, ShieldCheck, ArrowRight, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { agentOutputs, recommendedFixes } from '@/lib/rca-data';

export function RootCauseReport() {
  const rc = agentOutputs.rootcause;
  const val = agentOutputs.validation;
  const confidence = 86;

  return (
    <div className="space-y-6">
      {/* Root cause summary */}
      <Card className="border-primary/30">
        <CardHeader className="border-b bg-primary/5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Root Cause Analysis
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Fused evidence from 6 upstream agents
              </p>
            </div>
            <div className="text-right shrink-0">
              <div className="text-3xl font-bold text-primary">{confidence}%</div>
              <div className="text-xs text-muted-foreground font-medium">confidence</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-5">
          <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${confidence}%` }} />
          </div>
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <p className="text-sm font-medium leading-relaxed">{rc.summary}</p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {rc.findings.map((f, i) => (
              <div key={i} className="rounded-lg border border-border bg-muted/20 p-3">
                <p className="text-xs text-muted-foreground">{f.label}</p>
                <p className="text-sm font-semibold mt-0.5">{f.value}</p>
              </div>
            ))}
          </div>

          {/* Evidence convergence */}
          <div className="mt-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Evidence Convergence
            </p>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {[
                { src: 'Log Analysis', text: 'Timeout 3000→5000ms' },
                { src: 'Doc Intelligence', text: 'REQ-ATP-237 (3000ms max)' },
                { src: 'Traceability', text: 'Commit a8f3c21' },
                { src: 'Historical', text: 'DEF-2025-0089 (87%)' },
              ].map((e, i) => (
                <div key={i} className="flex items-center gap-2">
                  {i > 0 && <ArrowRight className="h-3 w-3 text-muted-foreground" />}
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2 py-1">
                    <span className="font-semibold text-primary">{e.src}</span>
                    <span className="text-muted-foreground">{e.text}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Validation */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-lg flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-success" />
            Validation & Safety Review
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-5">
          <div className="rounded-lg border border-success/30 bg-success/5 p-4 mb-4">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">{val.summary}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {val.findings.map((f, i) => (
              <div
                key={i}
                className={cn(
                  'flex items-start gap-2.5 rounded-lg border p-3',
                  f.severity === 'warning' ? 'border-warning/30 bg-warning/5' : 'border-border bg-muted/20',
                )}
              >
                {f.severity === 'warning' ? (
                  <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                ) : (
                  <div className="h-2 w-2 rounded-full bg-muted-foreground shrink-0 mt-1.5" />
                )}
                <div>
                  <p className="text-xs text-muted-foreground">{f.label}</p>
                  <p className="text-sm font-medium mt-0.5">{f.value}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommended fixes */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-lg">Recommended Fixes</CardTitle>
        </CardHeader>
        <CardContent className="pt-5">
          <div className="space-y-3">
            {recommendedFixes.map((fix) => (
              <div
                key={fix.priority}
                className="flex gap-4 rounded-lg border border-border p-4 hover:border-primary/30 transition-colors"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
                  {fix.priority}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-relaxed">{fix.action}</p>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{fix.rationale}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-[10px]">Owner: {fix.owner}</Badge>
                    <Badge variant="outline" className="text-[10px]">Effort: {fix.effort}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

