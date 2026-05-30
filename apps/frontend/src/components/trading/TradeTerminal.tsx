'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export const TradeTerminal = () => {
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');

  return (
    <Card className="p-4 bg-card border-border">
      <Tabs defaultValue="market" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="market">Market</TabsTrigger>
          <TabsTrigger value="limit">Limit</TabsTrigger>
        </TabsList>
        <TabsContent value="market" className="mt-4 space-y-4">
          <div className="flex gap-2">
            <Button 
              className={`flex-1 ${side === 'buy' ? 'bg-green-600' : 'bg-secondary'}`}
              onClick={() => setSide('buy')}
            >
              Buy
            </Button>
            <Button 
              className={`flex-1 ${side === 'sell' ? 'bg-red-600' : 'bg-secondary'}`}
              onClick={() => setSide('sell')}
            >
              Sell
            </Button>
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Amount</label>
            <Input 
              type="number" 
              placeholder="0.00" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <Button className="w-full mt-4" variant={side === 'buy' ? 'default' : 'destructive'}>
            {side === 'buy' ? 'Place Buy Order' : 'Place Sell Order'}
          </Button>
        </TabsContent>
      </Tabs>
    </Card>
  );
};
