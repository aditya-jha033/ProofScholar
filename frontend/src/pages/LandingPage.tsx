import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, LockKeyhole, Zap, ChevronRight, User, Cpu, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="container px-4 py-24 mx-auto text-center md:py-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto flex flex-col items-center gap-6"
        >
          <img src="/logo.png" alt="ProofScholar Logo" className="w-32 h-32 md:w-48 md:h-48 object-contain mb-4 drop-shadow-xl" />
          
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-secondary text-secondary-foreground">
            Powered by Midnight Network
          </div>
          
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl text-foreground">
            Verify Eligibility with <br className="hidden sm:block" /> 
            <span className="text-muted-foreground">Zero-Knowledge</span>
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl">
            Prove your scholarship qualifications without revealing your actual GPA or Family Income. True privacy, fully on-chain.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
            <Link to="/verify" className="w-full sm:w-auto">
              <Button size="lg" className="w-full gap-2">
                Start Verification <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/about" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full">
                How it works
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Ecosystem Stats */}
      <section className="bg-secondary/30 py-16">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-4xl mx-auto">
            <div className="flex flex-col gap-2">
              <div className="text-4xl font-bold text-foreground">5,000+</div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Proofs Verified</div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-4xl font-bold text-foreground">$1.2M</div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Scholarships Awarded</div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-4xl font-bold text-foreground">100%</div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Data Privacy</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container px-4 py-24 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-background">
            <CardHeader>
              <LockKeyhole className="h-10 w-10 mb-4 text-primary" />
              <CardTitle>Absolute Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Your data stays on your device. Only a cryptographic proof is sent to the network.</p>
            </CardContent>
          </Card>

          <Card className="bg-background">
            <CardHeader>
              <ShieldCheck className="h-10 w-10 mb-4 text-primary" />
              <CardTitle>On-Chain Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">The Midnight blockchain verifies the ZK proof transparently and immutably.</p>
            </CardContent>
          </Card>

          <Card className="bg-background">
            <CardHeader>
              <Zap className="h-10 w-10 mb-4 text-primary" />
              <CardTitle>Instant Decisions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Get an immediate, verifiable decision on your scholarship application.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-secondary/20 py-24">
        <div className="container px-4 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">How ProofScholar Works</h2>
          
          <div className="flex flex-col gap-8">
            <Card className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6">
              <div className="bg-primary text-primary-foreground p-4 rounded-full shrink-0">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">1. Enter Credentials Locally</h3>
                <p className="text-muted-foreground">Input your sensitive data (GPA and Income) into the app. It never leaves your browser.</p>
              </div>
            </Card>

            <Card className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6">
              <div className="bg-primary text-primary-foreground p-4 rounded-full shrink-0">
                <Cpu className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">2. ZK Proof Generation</h3>
                <p className="text-muted-foreground">A WASM circuit compiles your inputs into a zero-knowledge proof, asserting you meet the criteria without exposing the actual numbers.</p>
              </div>
            </Card>

            <Card className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6">
              <div className="bg-primary text-primary-foreground p-4 rounded-full shrink-0">
                <Database className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">3. Blockchain Verification</h3>
                <p className="text-muted-foreground">The proof is submitted to the Midnight Preview Network. If valid, the contract marks your address as 'eligible'.</p>
              </div>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Final CTA */}
      <section className="container px-4 py-24 mx-auto text-center border-t">
        <h2 className="text-3xl font-bold mb-8">Ready to prove your eligibility?</h2>
        <Link to="/verify">
          <Button size="lg" className="px-8">
            Launch App
          </Button>
        </Link>
      </section>
    </div>
  );
}
