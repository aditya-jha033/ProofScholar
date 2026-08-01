import React from 'react';
import { Shield, BookOpen, Code, Terminal } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  return (
    <div className="container px-4 py-16 max-w-3xl mx-auto">
      <div className="text-center mb-16">
        <Shield className="h-16 w-16 text-primary mx-auto mb-6" />
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">About ProofScholar</h1>
        <p className="text-xl text-muted-foreground">
          Privacy-preserving eligibility verification built on the Midnight Network.
        </p>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <BookOpen className="h-6 w-6 text-primary" /> The Problem
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              Traditional scholarship applications require students to submit highly sensitive 
              personal information, such as their family's annual income and their academic transcripts. 
              This data is often stored on centralized servers, creating significant privacy risks and 
              potential for data breaches.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Code className="h-6 w-6 text-primary" /> The ZK Solution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed mb-4">
              ProofScholar utilizes Midnight's Zero-Knowledge (ZK) capabilities to invert this model. 
              Instead of sending your data to an authority, the authority's rules (the smart contract) 
              are sent to your device.
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Your GPA and Income act as <strong className="text-foreground">private witnesses</strong>.</li>
              <li>A local WASM circuit computes whether you meet the criteria.</li>
              <li>Only a cryptographic proof (a True/False assertion) is submitted to the blockchain.</li>
              <li>Your private data never leaves your browser.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Terminal className="h-6 w-6 text-primary" /> Open Source
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed mb-6">
              This project was built for the <strong className="text-foreground">Midnight New Moon to Full Hackathon</strong>. 
              The smart contract is written in Compact, and the frontend uses React and the Midnight.js SDK.
            </p>
            <Button variant="secondary" asChild>
              <a 
                href="https://github.com/DeepSaha25/ProofScholar" 
                target="_blank" 
                rel="noreferrer" 
              >
                View Source Code on GitHub
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
