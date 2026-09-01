'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { graphNodes, graphEdges, type GraphNode } from '@/lib/rca-data';

const typeConfig: Record<
  GraphNode['type'],
  { color: string; bg: string; border: string; label: string; icon: string }
> = {
  requirement: { color: 'text-chart-2', bg: 'bg-chart-2/10', border: 'border-chart-2/40', label: 'Requirement', icon: '📋' },
  component: { color: 'text-chart-1', bg: 'bg-chart-1/10', border: 'border-chart-1/40', label: 'Component', icon: '⚙' },
  testcase: { color: 'text-chart-3', bg: 'bg-chart-3/10', border: 'border-chart-3/40', label: 'Test Case', icon: '✓' },
  defect: { color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/40', label: 'Defect', icon: '!' },
  workitem: { color: 'text-chart-5', bg: 'bg-chart-5/10', border: 'border-chart-5/40', label: 'Work Item', icon: '◆' },
  log: { color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/40', label: 'Log Anomaly', icon: '≡' },
  rootcause: { color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/50', label: 'Root Cause', icon: '◎' },
};

// Layout positions for the graph (normalized 0-1)
const positions: Record<string, { x: number; y: number }> = {
  req: { x: 0.12, y: 0.15 },
  comp: { x: 0.42, y: 0.15 },
  tc: { x: 0.72, y: 0.12 },
  defect: { x: 0.72, y: 0.42 },
  wi: { x: 0.12, y: 0.5 },
  log: { x: 0.12, y: 0.82 },
  hist: { x: 0.42, y: 0.82 },
  rc: { x: 0.42, y: 0.5 },
};

const W = 760;
const H = 440;
const NODE_W = 150;
const NODE_H = 56;

export function KnowledgeGraph() {
  const [selected, setSelected] = useState<string | null>('rc');
  const [hovered, setHovered] = useState<string | null>(null);

  const activeNode = selected ? graphNodes.find((n) => n.id === selected) : null;

  const connectedEdges = activeNode
    ? graphEdges.filter((e) => e.from === activeNode.id || e.to === activeNode.id)
    : [];
  const connectedIds = new Set<string>();
  connectedEdges.forEach((e) => connectedIds.add(e.from).add(e.to));

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b bg-muted/30">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <CardTitle className="text-lg">Interactive Railway Knowledge Graph</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Traceability chain — click any node to explore connections
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(typeConfig).map(([key, cfg]) => (
              <span key={key} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className={cn('h-2.5 w-2.5 rounded-sm border', cfg.border, cfg.bg)} />
                {cfg.label}
              </span>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="grid lg:grid-cols-[1fr_280px]">
          {/* Graph canvas */}
          <div className="relative grid-bg overflow-hidden border-b lg:border-b-0 lg:border-r border-border">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="w-full h-auto"
              style={{ minHeight: 380 }}
            >
              {/* Edges */}
              {graphEdges.map((edge, i) => {
                const from = positions[edge.from];
                const to = positions[edge.to];
                if (!from || !to) return null;

                const x1 = from.x * W + NODE_W / 2;
                const y1 = from.y * H + NODE_H / 2;
                const x2 = to.x * W + NODE_W / 2;
                const y2 = to.y * H + NODE_H / 2;

                const isActive = activeNode && connectedIds.has(edge.from) && connectedIds.has(edge.to);
                const midX = (x1 + x2) / 2;
                const midY = (y1 + y2) / 2;

                return (
                  <g key={i}>
                    <path
                      d={`M ${x1} ${y1} L ${x2} ${y2}`}
                      className={cn(
                        'transition-all',
                        edge.dashed ? 'stroke-dashed' : '',
                        isActive ? 'stroke-primary' : 'stroke-border',
                      )}
                      strokeWidth={isActive ? 2 : 1.5}
                      strokeDasharray={edge.dashed ? '6 4' : undefined}
                      fill="none"
                    />
                    {isActive && edge.label && (
                      <g>
                        <rect
                          x={midX - edge.label.length * 3.2 - 4}
                          y={midY - 8}
                          width={edge.label.length * 6.4 + 8}
                          height={16}
                          rx={4}
                          className="fill-background stroke-border"
                          strokeWidth={0.5}
                        />
                        <text
                          x={midX}
                          y={midY + 3}
                          textAnchor="middle"
                          className="fill-primary text-[8px] font-medium"
                        >
                          {edge.label}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* Nodes */}
              {graphNodes.map((node) => {
                const pos = positions[node.id];
                if (!pos) return null;
                const cfg = typeConfig[node.type];
                const x = pos.x * W;
                const y = pos.y * H;
                const isSelected = selected === node.id;
                const isHovered = hovered === node.id;
                const isConnected = activeNode ? connectedIds.has(node.id) : true;
                const dimmed = activeNode && !isConnected && !isSelected;

                return (
                  <g
                    key={node.id}
                    transform={`translate(${x} ${y})`}
                    className="cursor-pointer"
                    onClick={() => setSelected(node.id)}
                    onMouseEnter={() => setHovered(node.id)}
                    onMouseLeave={() => setHovered(null)}
                    style={{ opacity: dimmed ? 0.35 : 1, transition: 'opacity 0.2s' }}
                  >
                    <rect
                      width={NODE_W}
                      height={NODE_H}
                      rx={8}
                      className={cn(
                        'transition-all',
                        isSelected
                          ? `${cfg.border} ${cfg.bg} stroke-2`
                          : isHovered
                          ? 'border-border bg-card stroke-1.5'
                          : 'border-border bg-card stroke-1',
                      )}
                      stroke={
                        isSelected
                          ? 'currentColor'
                          : 'hsl(var(--border))'
                      }
                      strokeWidth={isSelected ? 2 : 1}
                      fill={isSelected ? `hsl(var(--${node.type === 'rootcause' ? 'primary' : 'chart-2'}) / 0.08)` : 'hsl(var(--card))'}
                    />
                    <circle
                      cx={14}
                      cy={NODE_H / 2}
                      r={5}
                      className={cn(
                        node.status === 'fail' && 'fill-destructive',
                        node.status === 'pass' && 'fill-success',
                        node.status === 'neutral' && 'fill-muted-foreground',
                      )}
                    />
                    <text
                      x={28}
                      y={NODE_H / 2 - 3}
                      className={cn('text-[10px] font-bold', cfg.color)}
                      fill="currentColor"
                    >
                      {node.label}
                    </text>
                    {node.sublabel && (
                      <text
                        x={28}
                        y={NODE_H / 2 + 10}
                        className="text-[7.5px] fill-muted-foreground"
                      >
                        {node.sublabel.length > 22 ? node.sublabel.slice(0, 21) + '…' : node.sublabel}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Detail panel */}
          <div className="p-4 bg-muted/20">
            {activeNode ? (
              <div className="animate-fade-in-up">
                <div className="flex items-center gap-2 mb-3">
                  <span className={cn('h-3 w-3 rounded-sm border', typeConfig[activeNode.type].border, typeConfig[activeNode.type].bg)} />
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {typeConfig[activeNode.type].label}
                  </span>
                  {activeNode.status === 'fail' && (
                    <Badge variant="destructive" className="text-[10px]">FAIL</Badge>
                  )}
                </div>
                <h3 className="font-bold text-base mb-1">{activeNode.label}</h3>
                {activeNode.sublabel && (
                  <p className="text-sm text-muted-foreground mb-3">{activeNode.sublabel}</p>
                )}

                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Connections
                  </p>
                  <div className="space-y-1.5">
                    {connectedEdges.map((e, i) => {
                      const otherId = e.from === activeNode.id ? e.to : e.from;
                      const other = graphNodes.find((n) => n.id === otherId);
                      if (!other) return null;
                      const dir = e.from === activeNode.id ? '→' : '←';
                      return (
                        <button
                          key={i}
                          onClick={() => setSelected(otherId)}
                          className="flex w-full items-center gap-2 rounded-md border border-border bg-card px-2.5 py-1.5 text-left text-xs hover:border-primary/40 hover:bg-accent/50 transition-colors"
                        >
                          <span className="text-muted-foreground font-mono">{dir}</span>
                          <span className={cn('font-semibold', typeConfig[other.type].color)}>
                            {other.label}
                          </span>
                          {e.label && (
                            <span className="ml-auto text-muted-foreground text-[10px]">{e.label}</span>
                          )}
                        </button>
                      );
                    })}
                    {connectedEdges.length === 0 && (
                      <p className="text-xs text-muted-foreground">No connections.</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Select a node to see details.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
