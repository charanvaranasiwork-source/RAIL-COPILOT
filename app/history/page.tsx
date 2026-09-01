'use client';

import { SimilarCases } from '@/components/similar-cases';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { similarCases } from '@/lib/rca-data';
import { Clock, TrendingUp, CheckCircle2 } from 'lucide-react';

export default function HistoryPage() {
  return (
    <div className="mx-auto max-w-[1600px] px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Case History</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Past incidents and their resolved root causes
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Total Cases</p>
                <p className="text-2xl font-bold mt-1">147</p>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground/30" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Avg. Similarity Match</p>
                <p className="text-2xl font-bold mt-1">77%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-muted-foreground/30" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold mt-1 text-success">132</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-muted-foreground/30" />
            </div>
          </CardContent>
        </Card>
      </div>

      <SimilarCases />

      {/* Resolution timeline */}
      <Card>
        <CardHeader className="border-b bg-muted/30">
          <CardTitle className="text-base">Resolution Timeline</CardTitle>
        </CardHeader>
        <CardContent className="pt-5">
          <div className="space-y-4">
            {similarCases.map((c, i) => (
              <div key={c.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                    i === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    {i + 1}
                  </div>
                  {i < similarCases.length - 1 && <div className="w-px h-full bg-border mt-1" />}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs text-primary font-semibold">{c.id}</span>
                    <Badge variant="outline" className="text-[10px]">{c.subsystem}</Badge>
                    <Badge variant="secondary" className="text-[10px]">{c.similarity}% match</Badge>
                    <span className="text-xs text-muted-foreground">{c.date}</span>
                  </div>
                  <p className="text-sm font-medium mt-1">{c.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="font-medium text-success">Resolution:</span> {c.resolution}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
