'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  ShieldCheck, 
  Dna, 
  TrendingUp, 
  Users, 
  Award,
  Lock
} from 'lucide-react';

export const ContinuityDashboard = () => {
  const genomeLayers = [
    { name: 'Foundation', icon: ShieldCheck, score: 100, status: 'Verified', color: 'text-green-500' },
    { name: 'Behavioral', icon: Dna, score: 85, status: 'Evolving', color: 'text-blue-500' },
    { name: 'Trust', icon: Users, score: 92, status: 'Strong', color: 'text-purple-500' },
    { name: 'Evolution', icon: TrendingUp, score: 78, status: 'Growing', color: 'text-orange-500' },
    { name: 'Contribution', icon: Award, score: 65, status: 'Active', color: 'text-yellow-500' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Human Continuity Layer</h2>
          <p className="text-muted-foreground">Verification of existence, continuity, and evolution.</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="px-4 py-1">
            <Lock className="w-3 h-3 mr-2" /> Encrypted Vault Active
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {genomeLayers.map((layer) => (
          <Card key={layer.name} className="p-4 flex flex-col items-center text-center space-y-3 bg-card/50">
            <layer.icon className={`w-8 h-8 ${layer.color}`} />
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{layer.name}</p>
              <p className="text-lg font-bold">{layer.score}%</p>
            </div>
            <Progress value={layer.score} className="h-1" />
            <Badge variant="outline" className="text-[10px] uppercase">{layer.status}</Badge>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 space-y-6">
          <h3 className="text-xl font-semibold">Human Continuity Asset (HCA) Evolution</h3>
          <div className="h-[200px] flex items-end justify-between gap-2 px-4">
            {[40, 45, 55, 52, 60, 75, 85, 82, 90, 95].map((h, i) => (
              <div 
                key={i} 
                className="w-full bg-primary/20 hover:bg-primary/40 transition-colors rounded-t-sm relative group"
                style={{ height: `${h}%` }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  HCA: {h * 10}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground uppercase tracking-widest px-2">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
          </div>
        </Card>

        <Card className="p-6 space-y-6 bg-primary/5 border-primary/20">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Continuity Proof</h3>
            <p className="text-xs text-muted-foreground">
              Your identity today is cryptographically linked to your historical self.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Persistence Age</span>
              <span className="font-mono">542 Days</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Authenticity Rank</span>
              <span className="font-mono text-green-500">Top 1%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Sybil Resistance</span>
              <span className="font-mono text-blue-500">Maximum</span>
            </div>
          </div>

          <div className="pt-4 border-t border-primary/10">
            <p className="text-[10px] text-muted-foreground italic">
              "Identity is not a document, it is a continuously evolving cryptographic field."
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
