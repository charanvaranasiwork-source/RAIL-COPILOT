'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IncidentSummary } from '@/components/incident-summary';
import { AgentOrchestration } from '@/components/agent-orchestration';
import { LogViewer } from '@/components/log-viewer';
import { SimilarCases } from '@/components/similar-cases';
import { agents, incident } from '@/lib/rca-data';
import { FileSearch, GitGraph, Zap, TrendingUp, Clock, CheckCircle2, ArrowRight, Train } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="mx-auto max-w-[1600px] px-6 py-8 space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card via-card to-accent/30 p-8 grid-bg">
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
              7 AI agents online · LangGraph pipeline ready
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl text-balance">
              AI Multi-Agent Root Cause Analysis for Railway Engineering
            </h1>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Upload incident evidence — logs, requirements, architecture docs — and let 7
              specialized agents collaborate to pinpoint the root cause, build the traceability
              chain, and recommend validated fixes.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/analysis">
                <Button size="lg" className="gap-2">
                  <FileSearch className="h-4 w-4" /> Start New Analysis
                </Button>
              </Link>
              <Link href="/graph">
                <Button size="lg" variant="outline" className="gap-2">
                  <GitGraph className="h-4 w-4" /> View Knowledge Graph
                </Button>
              </Link>
            </div>
          </div>

          {/* Agent orb visualization */}
          <div className="relative hidden h-48 w-48 shrink-0 lg:block">
            <div className="absolute inset-0 rounded-full border border-primary/20" />
            <div className="absolute inset-6 rounded-full border border-primary/15" />
            <div className="absolute inset-12 rounded-full border border-primary/10" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                <Train className="h-8 w-8" />
              </div>
            </div>
            {agents.slice(0, 7).map((_, i) => {
              const angle = (i / 7) * 2 * Math.PI - Math.PI / 2;
              const x = 50 + 42 * Math.cos(angle);
              const y = 50 + 42 * Math.sin(angle);
              return (
                <div
                  key={i}
                  className="absolute h-3 w-3 rounded-full bg-primary/40 animate-pulse"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: 'translate(-50%, -50%)',
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Active Incidents', value: '3', icon: Zap, color: 'text-destructive', sub: '1 critical, 2 high' },
          { label: 'Analyses Completed', value: '147', icon: CheckCircle2, color: 'text-success', sub: '+12 this week' },
          { label: 'Avg. RCA Time', value: '6.2s', icon: Clock, color: 'text-primary', sub: 'down from 4h manual' },
          { label: 'Accuracy', value: '89%', icon: TrendingUp, color: 'text-chart-2', sub: 'validated against ground truth' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{stat.sub}</p>
                  </div>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-muted ${stat.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Current incident */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold tracking-tight">Latest Incident</h2>
          <Link href="/analysis">
            <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
              Open full analysis <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
        <IncidentSummary />
      </div>

      {/* Agent pipeline + logs */}
      <div className="grid gap-6 lg:grid-cols-2">
        <AgentOrchestration />
        <LogViewer />
      </div>

      {/* Similar cases */}
      <SimilarCases />

      {/* Agent catalog */}
      <div>
        <h2 className="text-xl font-bold tracking-tight mb-3">Agent Catalog</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent, i) => (
            <Card key={agent.id} className="hover:border-primary/30 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-muted text-xs font-bold text-muted-foreground">
                    {i + 1}
                  </span>
                  <span className="font-semibold text-sm">{agent.name}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{agent.role}</p>
                <div className="mt-3 pt-3 border-t border-border">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Reads</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {agent.reads.map((r) => (
                      <span key={r} className="inline-flex items-center rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
