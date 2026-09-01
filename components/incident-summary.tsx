'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { incident } from '@/lib/rca-data';
import { Train, MapPin, User, Clock, Cpu, AlertOctagon } from 'lucide-react';

const severityConfig = {
  Critical: { variant: 'destructive' as const, label: 'CRITICAL' },
  High: { variant: 'secondary' as const, label: 'HIGH' },
  Medium: { variant: 'secondary' as const, label: 'MEDIUM' },
  Low: { variant: 'secondary' as const, label: 'LOW' },
};

export function IncidentSummary() {
  const sev = severityConfig[incident.severity];

  return (
    <Card className="overflow-hidden border-l-4 border-l-destructive">
      <CardContent className="p-5">
        <div className="flex items-start gap-4 flex-wrap">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
            <AlertOctagon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs text-muted-foreground">{incident.id}</span>
              <Badge variant={sev.variant} className="text-[10px]">{sev.label}</Badge>
              <Badge variant="outline" className="text-[10px]">{incident.status}</Badge>
            </div>
            <h2 className="text-lg font-bold leading-snug mt-1.5 text-balance">
              {incident.title}
            </h2>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              {incident.description}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { icon: Cpu, label: 'System', value: incident.system },
            { icon: Train, label: 'Train', value: incident.trainId },
            { icon: MapPin, label: 'Environment', value: incident.environment },
            { icon: User, label: 'Reported by', value: incident.reportedBy },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="rounded-lg border border-border bg-muted/20 p-3">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Icon className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">{item.label}</span>
                </div>
                <p className="text-sm font-semibold mt-1 truncate" title={item.value}>
                  {item.value}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>Reported {new Date(incident.reportedAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}</span>
          <span className="text-border">·</span>
          <span>Subsystem: {incident.subsystem}</span>
          <span className="text-border">·</span>
          <span>Route: {incident.route}</span>
        </div>
      </CardContent>
    </Card>
  );
}
