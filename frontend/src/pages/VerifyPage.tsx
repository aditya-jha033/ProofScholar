import React, { useState, useCallback } from 'react';
import { CompiledContract } from '@midnight-ntwrk/compact-js';
import { createUnprovenCallTx, submitTxAsync } from '@midnight-ntwrk/midnight-js-contracts';
import { Contract } from '../managed/contract/index.js';
import { useWallet } from '../contexts/WalletContext';
import PrivacyFlowViz from '../components/PrivacyFlowViz';
import { CheckCircle, XCircle, AlertCircle, Loader2, ExternalLink, Lock } from 'lucide-react';
import { FALLBACK_CONTRACT_ADDRESS, MIN_GPA_THRESHOLD, MAX_INCOME_THRESHOLD } from '../config';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type VerifyStatus = 'idle' | 'proving' | 'submitting' | 'eligible' | 'ineligible' | 'error';

function getCompiledContract() {
  return CompiledContract.make('ScholarshipContract', Contract).pipe(
    CompiledContract.withVacantWitnesses,
    CompiledContract.withCompiledFileAssets(new URL('/managed', window.location.origin).toString()),
  ) as any;
}

export default function VerifyPage() {
  const { session, isConnected } = useWallet();
  const [gpaRaw, setGpaRaw] = useState('');
  const [incomeRaw, setIncomeRaw] = useState('');
  const [status, setStatus] = useState<VerifyStatus>('idle');
  const [txId, setTxId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [contractAddress, setContractAddress] = useState<string | null>(null);
  const [minGpa, setMinGpa] = useState<number>(MIN_GPA_THRESHOLD / 100);
  const [maxIncome, setMaxIncome] = useState<number>(MAX_INCOME_THRESHOLD);

  // Fetch config and verification cache
  React.useEffect(() => {
    fetch('/api/config')
      .then(res => res.json())
      .then(data => {
        if (data.address) {
          setContractAddress(data.address);
          if (data.minGpa !== undefined && data.minGpa !== null) setMinGpa(data.minGpa);
          if (data.maxIncome !== undefined && data.maxIncome !== null) setMaxIncome(data.maxIncome);
        }
        else setContractAddress(FALLBACK_CONTRACT_ADDRESS);
      })
      .catch(() => setContractAddress(FALLBACK_CONTRACT_ADDRESS));

    if (session?.unshieldedAddress) {
      fetch(`/api/verification?address=${session.unshieldedAddress}`)
        .then(res => res.json())
        .then(data => {
          if (data.data?.status === 'eligible' || data.data?.status === 'ineligible') {
            setStatus(data.data.status);
            setTxId(data.data.txId);
          }
        })
        .catch(console.error);
    }
  }, [session?.unshieldedAddress]);

  const handleVerify = useCallback(async () => {
    if (!session || !isConnected) return;

    const gpaValue = parseFloat(gpaRaw);
    const incomeValue = parseInt(incomeRaw, 10);

    if (isNaN(gpaValue) || gpaValue < 0 || gpaValue > 10) {
      setErrorMsg('Please enter a valid GPA between 0.0 and 10.0');
      setStatus('error');
      return;
    }
    if (isNaN(incomeValue) || incomeValue < 0 || incomeValue > 4294967295) {
      setErrorMsg('Please enter a valid annual income in INR (Max: 4,294,967,295)');
      setStatus('error');
      return;
    }

    const gpaScaled = BigInt(Math.round(gpaValue * 100));
    const incomeBig = BigInt(incomeValue);

    setStatus('proving');
    setErrorMsg(null);
    setTxId(null);

    try {
      const compiledContract = getCompiledContract();

      const callTxData = await createUnprovenCallTx(session.providers as any, {
        compiledContract,
        contractAddress: contractAddress || FALLBACK_CONTRACT_ADDRESS,
        circuitId: 'verify_eligibility',
        args: [gpaScaled, incomeBig],
      });

      setStatus('submitting');

      const id = await submitTxAsync(session.providers as any, {
        unprovenTx: callTxData.private.unprovenTx,
        circuitId: 'verify_eligibility',
      });

      setTxId(typeof id === 'string' ? id : id?.txHash ?? 'confirmed');

      const passes = gpaScaled >= BigInt(Math.round(minGpa * 100)) && incomeBig <= BigInt(maxIncome);
      const newStatus = passes ? 'eligible' : 'ineligible';
      setStatus(newStatus);
      
      // Update Cache via API
      fetch(`/api/verification?address=${session.unshieldedAddress}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, txId: typeof id === 'string' ? id : id?.txHash ?? 'confirmed' })
      }).catch(console.error);
    } catch (e: any) {
      const msg: string = e?.message ?? String(e);
      if (msg.includes('GPA too low') || msg.includes('Income too high') || msg.toLowerCase().includes('assert')) {
        setStatus('ineligible');
      } else {
        setStatus('error');
        setErrorMsg(msg);
      }
    }
  }, [session, isConnected, gpaRaw, incomeRaw]);

  const reset = () => {
    setStatus('idle');
    setErrorMsg(null);
    setTxId(null);
    setGpaRaw('');
    setIncomeRaw('');
  };

  const isProcessing = status === 'proving' || status === 'submitting';

  if (!isConnected) {
    return (
      <div className="container px-4 py-24 flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md text-center py-12">
          <CardHeader>
            <div className="mx-auto bg-secondary p-4 rounded-full mb-4">
              <Lock className="h-8 w-8 text-muted-foreground" />
            </div>
            <CardTitle className="text-2xl">Connect Wallet</CardTitle>
            <CardDescription>
              You must connect your 1AM or Lace wallet on the Preview network to verify your eligibility.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const activeContract = contractAddress || FALLBACK_CONTRACT_ADDRESS;
  if (!activeContract || activeContract === 'UPDATE_WITH_YOUR_PREPROD_CONTRACT_ADDRESS') {
    return (
      <div className="container px-4 py-24 flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md text-center py-12 border-destructive">
          <CardHeader>
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <CardTitle className="text-2xl">Contract Not Deployed</CardTitle>
            <CardDescription>
              No contract address was found in the database. Please visit the Admin portal to deploy the contract first.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container px-4 py-12 max-w-3xl mx-auto">
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Verify Eligibility</h1>
        <p className="text-muted-foreground">Provide your private credentials below to generate a zero-knowledge proof.</p>
      </div>

      <PrivacyFlowViz status={status} />

      <Card className="mt-8">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 p-4 bg-secondary/50 rounded-lg border">
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Min GPA (Public)</div>
              <div className="text-xl font-bold">≥ {minGpa.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-muted-foreground mb-1">Max Income (Public)</div>
              <div className="text-xl font-bold">≤ ₹{maxIncome.toLocaleString()}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-2">
              <Label htmlFor="input-gpa">Your GPA</Label>
              <Input
                id="input-gpa"
                type="number"
                placeholder="e.g. 9.1"
                min="0"
                max="10"
                step="0.01"
                value={gpaRaw}
                onChange={(e) => setGpaRaw(e.target.value)}
                disabled={isProcessing || status === 'eligible' || status === 'ineligible'}
              />
              <p className="text-xs text-muted-foreground">Enter a value between 0.0 and 10.0</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="input-income">Annual Family Income (₹)</Label>
              <Input
                id="input-income"
                type="number"
                placeholder="e.g. 180000"
                min="0"
                step="1000"
                value={incomeRaw}
                onChange={(e) => setIncomeRaw(e.target.value)}
                disabled={isProcessing || status === 'eligible' || status === 'ineligible'}
              />
              <p className="text-xs text-muted-foreground">Enter total income in INR</p>
            </div>
          </div>

          {status === 'idle' || status === 'error' ? (
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="flex-1" 
                onClick={handleVerify}
                disabled={!gpaRaw || !incomeRaw || !isConnected}
              >
                Verify Eligibility
              </Button>
              <Button 
                variant="outline" 
                onClick={reset}
                disabled={!gpaRaw && !incomeRaw && !errorMsg}
              >
                Clear
              </Button>
            </div>
          ) : isProcessing ? (
            <Button className="w-full" disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {status === 'proving' ? 'Generating ZK Proof Locally…' : 'Submitting Proof to Preview…'}
            </Button>
          ) : (
            <Button variant="outline" className="w-full" onClick={reset}>
              Verify Another Application
            </Button>
          )}

          {status === 'eligible' && (
            <div className="mt-8 p-6 bg-green-500/10 border border-green-500/20 rounded-lg text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">Eligible for Scholarship!</h3>
              <p className="text-muted-foreground mb-4">Your ZK proof was verified on-chain. Your data remained private.</p>
              {txId && (
                <Button variant="outline" asChild>
                  <a href={`https://explorer.1am.xyz/tx/${txId}?network=preview`} target="_blank" rel="noopener noreferrer">
                    View on Explorer <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          )}

          {status === 'ineligible' && (
            <div className="mt-8 p-6 bg-destructive/10 border border-destructive/20 rounded-lg text-center">
              <XCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-destructive mb-2">Not Eligible</h3>
              <p className="text-muted-foreground mb-4">Your credentials do not satisfy the thresholds. Data remained private.</p>
              {txId && (
                <Button variant="outline" asChild>
                  <a href={`https://explorer.1am.xyz/tx/${txId}?network=preview`} target="_blank" rel="noopener noreferrer">
                    View on Explorer <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          )}

          {status === 'error' && errorMsg && (
            <div className="mt-8 p-6 bg-destructive/10 border border-destructive/20 rounded-lg text-center">
              <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
              <h3 className="text-lg font-bold text-destructive mb-2">Verification Error</h3>
              <p className="text-muted-foreground text-sm">{errorMsg}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
