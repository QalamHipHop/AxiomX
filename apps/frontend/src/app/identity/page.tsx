'use client';

import { AxiomIDDashboard } from '@/components/identity/AxiomIDDashboard';
import { ContinuityDashboard } from '@/components/identity/ContinuityDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function IdentityPage() {
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          Human Continuity Infrastructure
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Possess, control, and evolve your digital existence through the Human Digital Genome protocol.
        </p>
      </div>

      <Tabs defaultValue="continuity" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="continuity">Continuity Layer</TabsTrigger>
          <TabsTrigger value="biometrics">Biometric Sync</TabsTrigger>
        </TabsList>
        <TabsContent value="continuity" className="mt-8">
          <ContinuityDashboard />
        </TabsContent>
        <TabsContent value="biometrics" className="mt-8">
          <AxiomIDDashboard />
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Human Digital Genome</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A high-dimensional mathematical representation generated from your interactions, behavioral patterns, and trust history.
          </p>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Verification without Disclosure</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Reveal proofs of your existence and authenticity without ever exposing raw biometric or personal information.
          </p>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Self-Owned Assets</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your identity is a living asset. You own your continuity, your proofs, and your entire evolution history.
          </p>
        </div>
      </div>
    </div>
  );
}
