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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
  
  const [minGpaInput, setMinGpaInput] = useState<string>((MIN_GPA_THRESHOLD / 100).toFixed(2));
  const [maxIncomeInput, setMaxIncomeInput] = useState<string>(MAX_INCOME_THRESHOLD.toString());

  const handleDeploy = useCallback(async () => {
    if (!session || !isConnected) return;
    setStatus('deploying');
    setErrorMsg(null);
    
    const minGpaVal = parseFloat(minGpaInput);
    const maxIncomeVal = parseInt(maxIncomeInput, 10);
    
    if (isNaN(minGpaVal) || isNaN(maxIncomeVal)) {
      setErrorMsg('Invalid input values');
      setStatus('error');
      return;
    }

    try {
      const compiledContract = getCompiledContract();
      const initialPrivateState = {};
      
      const gpaScaled = BigInt(Math.round(minGpaVal * 100));
      const incomeScaled = BigInt(maxIncomeVal);

      const deployTxData = await createUnprovenDeployTx(session.providers as any, {
        compiledContract,
        args: [gpaScaled, incomeScaled],
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
          body: JSON.stringify({ 
            address: contractAddress,
            minGpa: minGpaVal,
            maxIncome: maxIncomeVal
          })
        });
      } catch (e) {
        console.error('Failed to cache config in backend', e);
      }

      setStatus('deployed');
      
      setTimeout(() => {
        window.location.reload();
      }, 3000);
      
    } catch (e: any) {
      setStatus('error');
      setErrorMsg(e?.message ?? String(e));
    }
  }, [session, isConnected, minGpaInput, maxIncomeInput]);

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
            Deploy the scholarship contract to the Preview network. Set the minimum GPA and maximum income criteria.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="space-y-2">
              <Label htmlFor="minGpa">Minimum GPA Threshold</Label>
              <Input 
                id="minGpa" 
                type="number" 
                step="0.1" 
                value={minGpaInput} 
                onChange={(e) => setMinGpaInput(e.target.value)} 
                disabled={status !== 'idle' && status !== 'error'}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxIncome">Maximum Income (₹)</Label>
              <Input 
                id="maxIncome" 
                type="number" 
                step="1000" 
                value={maxIncomeInput} 
                onChange={(e) => setMaxIncomeInput(e.target.value)}
                disabled={status !== 'idle' && status !== 'error'}
              />
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
