'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Fingerprint, Activity, Heart, Brain } from 'lucide-react';

export const AxiomIDDashboard = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [identityData, setIdentityData] = useState<any>(null);

  const startScan = () => {
    setIsScanning(true);
    // Mock scanning process
    setTimeout(() => {
      setIdentityData({
        formula: '0x7f3a...9e21',
        value: 0.842,
        mood: 'Analytical',
        heartRate: 72,
      });
      setIsScanning(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Fingerprint className="text-primary" /> AxiomID Dashboard
        </h2>
        <Badge variant="outline" className="text-green-500 border-green-500">Active</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 flex flex-col items-center justify-center space-y-2 bg-secondary/20">
          <Heart className="text-red-500 w-8 h-8" />
          <span className="text-sm text-muted-foreground">Heart Rate</span>
          <span className="text-xl font-bold">{identityData?.heartRate || '--'} BPM</span>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center space-y-2 bg-secondary/20">
          <Brain className="text-purple-500 w-8 h-8" />
          <span className="text-sm text-muted-foreground">Emotional State</span>
          <span className="text-xl font-bold">{identityData?.mood || '--'}</span>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center space-y-2 bg-secondary/20">
          <Activity className="text-blue-500 w-8 h-8" />
          <span className="text-sm text-muted-foreground">Identity Value</span>
          <span className="text-xl font-bold">{identityData?.value || '0.00'} AXID</span>
        </Card>
      </div>

      <Card className="p-6 border-dashed border-2 flex flex-col items-center justify-center space-y-4">
        <div className={`p-8 rounded-full bg-primary/10 ${isScanning ? 'animate-pulse' : ''}`}>
          <Fingerprint className={`w-16 h-16 ${isScanning ? 'text-primary' : 'text-muted-foreground'}`} />
        </div>
        <div className="text-center">
          <h3 className="font-medium">Mathematical Identity Formula</h3>
          <p className="text-xs text-muted-foreground font-mono mt-1">
            {identityData?.formula || 'Awaiting biometric verification...'}
          </p>
        </div>
        <Button onClick={startScan} disabled={isScanning}>
          {isScanning ? 'Syncing Biometrics...' : 'Sync AxiomID'}
        </Button>
      </Card>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <p className="text-sm text-blue-400">
          <strong>Tip:</strong> Your identity value is calculated based on your unique biometric signature and emotional state. Maintaining a balanced state can optimize your formula's market value.
        </p>
      </div>
    </div>
  );
};
