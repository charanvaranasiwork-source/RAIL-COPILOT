'use client';

import { useEffect, useState } from 'react';
import {
  FileText, ScrollText, BookOpen, Link2, History, Target, ShieldCheck,
  Bot, Check, Loader2,
  type LucideIcon,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { agents, runTimeline, agentOutputs } from '@/lib/rca-data';

type Status = 'pending' | 'running' | 'complete';

interface AgentState {
  status: Status;
  progress: number;
}

export function AgentOrchestration({ onComplete }: { onComplete?: () => void }) {
  const [states, setStates] = useState<Record<string, AgentState>>(
    Object.fromEntries(agents.map((a) => [a.id, { status: 'pending', progress: 0 }]))
  );
  const [done, setDone] = useState(false);

  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const totalDuration = 6200;

    const tick = (now: number) => {
      const elapsed = now - start;
      const newStates: Record<string, AgentState> = {};
      let allDone = true;

      for (const a of agents) {
        const tl = runTimeline.find((t) => t.agent === a.id)!;
        if (elapsed < tl.start) {
          newStates[a.id] = { status: 'pending', progress: 0 };
          allDone = false;
        } else if (elapsed >= tl.end) {
          newStates[a.id] = { status: 'complete', progress: 100 };
        } else {
          newStates[a.id] = {
            status: 'running',
            progress: Math.round(((elapsed - tl.start) / (tl.end - tl.start)) * 100),
          };
          allDone = false;
        }
      }

      setStates(newStates);

      if (allDone) {
        setDone(true);
        onComplete?.();
        return;
      }
      if (elapsed < totalDuration + 500) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onComplete]);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Multi-Agent Orchestration</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              7 specialized agents collaborate in a LangGraph pipeline
            </p>
          </div>
          <Badge variant={done ? 'secondary' : 'default'} className="gap-1.5">
            {done ? (
              <>
                <Check className="h-3 w-3" /> Complete
              </>
            ) : (
              <>
                <Loader2 className="h-3 w-3 animate-spin" /> Analyzing
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {agents.map((agent, idx) => {
            const state = states[agent.id];
            const iconMap: Record<string, LucideIcon> = {
              FileText, ScrollText, BookOpen, Link2, History, Target, ShieldCheck,
            };
            const Icon = iconMap[agent.icon] ?? Bot;
            const result = agentOutputs[agent.id as keyof typeof agentOutputs];

            return (
              <div
                key={agent.id}
                className={cn(
                  'flex gap-4 p-4 transition-colors',
                  state.status === 'running' && 'bg-accent/30',
                )}
              >
                {/* Status indicator */}
                <div className="flex flex-col items-center pt-1">
                  <div
                    className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-all',
                      state.status === 'pending' && 'border-border bg-muted text-muted-foreground',
                      state.status === 'running' &&
                        `border-primary/30 bg-primary/10 text-primary animate-pulse-ring`,
                      state.status === 'complete' &&
                        agent.color === 'success'
                        ? 'border-success/30 bg-success/10 text-success'
                        : state.status === 'complete'
                        ? 'border-primary/20 bg-primary/5 text-primary'
                        : '',
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  {idx < agents.length - 1 && (
                    <div
                      className={cn(
                        'w-px flex-1 mt-1 min-h-[20px] transition-colors',
                        states[agents[idx + 1].id].status !== 'pending' ? 'bg-primary/40' : 'bg-border',
                      )}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pb-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm">{agent.name}</span>
                    <span className="text-xs text-muted-foreground font-mono">#{idx + 1}</span>
                    {state.status === 'running' && (
                      <Badge variant="outline" className="text-primary border-primary/30 gap-1">
                        <Loader2 className="h-3 w-3 animate-spin" /> {state.progress}%
                      </Badge>
                    )}
                    {state.status === 'complete' && (
                      <Badge variant="outline" className="text-success border-success/30 gap-1">
                        <Check className="h-3 w-3" /> Done
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{agent.role}</p>

                  {/* Progress bar while running */}
                  {state.status === 'running' && (
                    <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-300"
                        style={{ width: `${state.progress}%` }}
                      />
                    </div>
                  )}

                  {/* Results when complete */}
                  {state.status === 'complete' && result && (
                    <div className="mt-2 animate-fade-in-up">
                      <p className="text-sm text-foreground/80 leading-relaxed">{result.summary}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {result.findings.slice(0, 3).map((f, i) => (
                          <span
                            key={i}
                            className={cn(
                              'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium',
                              f.severity === 'critical' && 'bg-destructive/10 text-destructive',
                              f.severity === 'warning' && 'bg-warning/10 text-warning-foreground',
                              (!f.severity || f.severity === 'info') && 'bg-muted text-muted-foreground',
                            )}
                          >
                            {f.label}: {f.value}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
