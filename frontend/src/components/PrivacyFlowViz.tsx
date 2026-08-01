import React from 'react';
import { Lock, Cpu, Link as LinkIcon, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type VerifyStatus = 'idle' | 'proving' | 'submitting' | 'eligible' | 'ineligible' | 'error';

export default function PrivacyFlowViz({ status }: { status: VerifyStatus }) {
  const steps = [
    { 
      id: 'local', 
      label: 'Your Private Data', 
      sublabel: 'GPA & Income stay on device', 
      icon: <Lock size={24} />, 
      active: status === 'proving' || status === 'submitting' || status === 'eligible' || status === 'ineligible' 
    },
    { 
      id: 'circuit', 
      label: 'ZK Circuit (Local)', 
      sublabel: 'Proof computed in WASM', 
      icon: <Cpu size={24} />, 
      active: status === 'proving' 
    },
    { 
      id: 'chain', 
      label: 'Midnight Blockchain', 
      sublabel: 'Cryptographic proof recorded', 
      icon: <LinkIcon size={24} />, 
      active: status === 'submitting' || status === 'eligible' || status === 'ineligible' 
    },
  ];

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-xl">Observable Privacy Behavior</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          {steps.map((step, i) => (
            <React.Fragment key={step.id}>
              <motion.div
                className={`flex flex-col items-center text-center p-4 rounded-xl flex-1 w-full border ${step.active ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-secondary/30 text-muted-foreground'}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="mb-2">{step.icon}</div>
                <div className="font-semibold text-sm">{step.label}</div>
                <div className="text-xs opacity-80 mt-1">{step.sublabel}</div>
              </motion.div>
              {i < steps.length - 1 && (
                <div className="hidden md:flex text-muted-foreground">
                  <ArrowRight size={24} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
        <div className="flex items-start gap-3 p-4 bg-secondary/50 rounded-lg text-sm text-muted-foreground">
          <Lock size={18} className="mt-0.5 shrink-0 text-primary" />
          <p>
            <strong className="text-foreground">Your actual GPA and income are never sent to the network.</strong> The Midnight blockchain only records a cryptographic proof that you satisfy the eligibility threshold — nothing more.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
