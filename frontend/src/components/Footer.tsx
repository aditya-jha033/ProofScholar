import React from 'react';
import { Link } from 'react-router-dom';
import { Code, Globe, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t bg-background mt-16 py-12">
      <div className="container px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand Column */}
        <div className="flex flex-col gap-4">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="ProofScholar Logo" className="h-6 w-6 object-contain" />
            <span className="font-bold text-lg">ProofScholar</span>
          </Link>
          <p className="text-muted-foreground text-sm">
            Privacy-preserving eligibility verification built on the Midnight Network using Zero-Knowledge proofs.
          </p>
          <div className="flex gap-4 mt-2">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><Code className="h-5 w-5" /></a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><Globe className="h-5 w-5" /></a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors"><Mail className="h-5 w-5" /></a>
          </div>
        </div>

        {/* Links Column */}
        <div className="flex flex-col gap-3">
          <h4 className="font-semibold text-foreground">Application</h4>
          <Link to="/" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Home</Link>
          <Link to="/verify" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Verify Eligibility</Link>
          <Link to="/about" className="text-muted-foreground hover:text-foreground text-sm transition-colors">How it Works</Link>
          <Link to="/admin" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Admin Portal</Link>
        </div>

        {/* Resources Column */}
        <div className="flex flex-col gap-3">
          <h4 className="font-semibold text-foreground">Resources</h4>
          <a href="https://midnight.network/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Midnight Network</a>
          <a href="https://docs.midnight.network/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Documentation</a>
          <a href="https://github.com/midnight-ntwrk" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground text-sm transition-colors">GitHub</a>
        </div>

        {/* Status Column */}
        <div className="flex flex-col gap-3">
          <h4 className="font-semibold text-foreground">Network Status</h4>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-muted-foreground text-sm">Preview Live</span>
          </div>
          <div className="mt-2">
            <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-xs border">
              v1.0.0
            </span>
          </div>
        </div>

      </div>

      <div className="border-t mt-12 pt-8 text-center">
        <p className="text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} ProofScholar. Built for the New Moon to Full Hackathon.
        </p>
      </div>
    </footer>
  );
}
