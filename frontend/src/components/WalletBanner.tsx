import React from 'react';
import { useWallet } from '../contexts/WalletContext';
import { Button } from '@/components/ui/button';
import { Loader2, X } from 'lucide-react';

export default function WalletBanner() {
  const { address, isConnected, walletType, walletStatus, isConnecting, connect, disconnect } = useWallet();

  if (walletStatus === 'checking') {
    return (
      <Button variant="outline" disabled className="gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        Detecting wallet...
      </Button>
    );
  }

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-2 border rounded-md p-1 pr-2 bg-secondary/50">
        <div className="h-2 w-2 rounded-full bg-green-500 ml-2"></div>
        <div className="flex flex-col text-xs leading-tight ml-1 mr-2">
          <span className="font-semibold text-foreground/80">{walletType === '1am' ? '1AM' : 'Lace'}</span>
          <span className="text-muted-foreground">{address.slice(0, 8)}…{address.slice(-6)}</span>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full hover:bg-destructive/10 hover:text-destructive" onClick={disconnect} title="Disconnect Wallet">
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={() => connect('preview')}
      disabled={isConnecting || walletStatus === 'not-found'}
      className="gap-2"
    >
      {isConnecting && <Loader2 className="h-4 w-4 animate-spin" />}
      {isConnecting ? 'Connecting' : 'Connect Wallet'}
    </Button>
  );
}
