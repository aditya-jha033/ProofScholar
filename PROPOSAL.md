# ProofScholar - Hackathon Proposal

## Project Overview
ProofScholar is a privacy-preserving eligibility verification system for academic scholarships, built on the Midnight Network. It solves the critical problem of identity theft and data breaches by allowing students to cryptographically prove their eligibility (such as minimum GPA and maximum family income) without ever exposing their raw, highly-sensitive personal data.

## Problem Statement
In legacy systems, students are forced to upload highly sensitive unencrypted documents to centralized databases. These databases are prime targets for data breaches, putting applicants at severe risk for identity theft.

## Solution
ProofScholar serves as a Zero-Knowledge (ZK) eligibility gate. It eliminates the need for data transmission entirely. Verification is completely mathematical. Students can cryptographically prove they meet stringent academic and financial requirements without exposing their raw data.

## Technology Stack
- **Network**: Midnight Network (Preview & Preprod)
- **Smart Contract Language**: Compact
- **Frontend**: React + Vite
- **Backend / Database**: Vercel API, Neon Postgres, Upstash Redis
- **Testing**: Vitest

## Key Features
- **Zero-Knowledge Privacy**: Powered by the Midnight Network, students generate local cryptographic proofs. Sensitive PII never leaves their browser.
- **Dynamic Deployments**: Scholarship administrators can deploy new smart contracts with custom thresholds from an interactive portal.
- **Serverless Architecture**: Built on Vercel API routes for fast, scalable backend execution.
