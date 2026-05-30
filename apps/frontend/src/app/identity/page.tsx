'use client';

import { AxiomIDDashboard } from '@/components/identity/AxiomIDDashboard';

export default function IdentityPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <AxiomIDDashboard />
      
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">What is AxiomID?</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            AxiomID is a revolutionary decentralized identity system that maps your unique biometric and emotional data into a mathematical formula. This formula is private, secure, and belongs entirely to you.
          </p>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Identity Marketplace</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your unique identity formula can be tokenized. In the future, you will be able to sell or lease parts of your digital footprint to researchers or advertisers, all while maintaining absolute anonymity through Zero-Knowledge Proofs.
          </p>
        </div>
      </div>
    </div>
  );
}
