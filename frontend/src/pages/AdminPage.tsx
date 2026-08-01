import React, { useState, useCallback } from 'react';
import { CompiledContract } from '@midnight-ntwrk/compact-js';
import { createUnprovenDeployTx, submitTxAsync } from '@midnight-ntwrk/midnight-js-contracts';
import { sampleSigningKey } from '@midnight-ntwrk/compact-runtime';
import { Contract } from '../managed/contract/index.js';
import { useWallet } from '../contexts/WalletContext';
import { Settings, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { MIN_GPA_THRESHOLD, MAX_INCOME_THRESHOLD } from '../config';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

function getCompiledContract() {
  return CompiledContract.make('ScholarshipContract', Contract).pipe(
    CompiledContract.withVacantWitnesses,
    CompiledContract.withCompiledFileAssets(new URL('/managed', window.location.origin).toString()),
  ) as any;
}

export default function AdminPage() {
  const { session, isConnected } = useWallet();
  const [status, setStatus] = useState<'idle' | 'deploying' | 'deployed' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [deployedAddress, setDeployedAddress] = useState<string | null>(null);

  const handleDeploy = useCallback(async () => {
    if (!session || !isConnected) return;
    setStatus('deploying');
    setErrorMsg(null);

    try {
      const compiledContract = getCompiledContract();
      const initialPrivateState = {};

      const deployTxData = await createUnprovenDeployTx(session.providers as any, {
        compiledContract,
        args: [BigInt(MIN_GPA_THRESHOLD), BigInt(MAX_INCOME_THRESHOLD)],
        privateStateId: 'DeployerState',
        initialPrivateState,
        signingKey: sampleSigningKey(),
      });

      const contractAddress = deployTxData.public.contractAddress;
      
      await submitTxAsync(session.providers as any, {
        unprovenTx: deployTxData.private.unprovenTx,
      });

      setDeployedAddress(contractAddress);
      localStorage.setItem('PREVIEW_CONTRACT_ADDRESS', contractAddress);
      
      // Post to Backend Cache
      try {
        await fetch('/api/config', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address: contractAddress })
        });
      } catch (e) {
        console.error('Failed to cache address in backend', e);
      }

      setStatus('deployed');
      
      setTimeout(() => {
        window.location.reload();
      }, 3000);
      
    } catch (e: any) {
      setStatus('error');
      setErrorMsg(e?.message ?? String(e));
    }
  }, [session, isConnected]);

  if (!isConnected) {
    return (
      <div className="container px-4 py-24 flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md text-center py-12">
          <CardHeader>
            <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <CardTitle className="text-2xl">Admin Portal</CardTitle>
            <CardDescription>
              Please connect your wallet to access the deployer interface.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container px-4 py-12 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Admin Settings</h1>
        <p className="text-muted-foreground">Deploy the ProofScholar contract to the Midnight network.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" /> Deploy Contract
          </CardTitle>
          <CardDescription>
            Deploy the scholarship contract to the Preview network. The contract will be initialized with the criteria defined in the application config.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 p-4 bg-secondary/50 rounded-lg border">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Initial GPA Threshold</div>
              <div className="text-xl font-bold">8.00</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Initial Income Threshold</div>
              <div className="text-xl font-bold">₹2,50,000</div>
            </div>
          </div>

          {status === 'idle' || status === 'error' ? (
            <Button className="w-full" onClick={handleDeploy}>
              Deploy Contract to Preview
            </Button>
          ) : status === 'deploying' ? (
            <div className="text-center py-8">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">Deployment in Progress</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Please check your wallet extension to sign the transaction. 
                <br />This process may take a few minutes as it compiles the circuit and awaits block confirmation.
              </p>
            </div>
          ) : (
            <div className="text-center p-6 bg-green-500/10 border border-green-500/20 rounded-lg">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-2">Successfully Deployed!</h3>
              <div className="font-mono text-xs mb-4 p-2 bg-background rounded border break-all">
                {deployedAddress}
              </div>
              <a 
                href={`https://explorer.1am.xyz/contract/${deployedAddress}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-primary hover:underline text-sm inline-block mb-4"
              >
                View on 1AM Explorer ↗
              </a>
              <div className="text-xs text-muted-foreground">Reloading application...</div>
            </div>
          )}

          {status === 'error' && errorMsg && (
            <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2 text-destructive font-bold">
                <AlertCircle className="h-5 w-5" /> Deployment Failed
              </div>
              <p className="text-sm text-destructive/90 break-words">{errorMsg}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
