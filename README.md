<div align="center">
  <!-- LOGO IMAGE -->
  <img src="./frontend/public/logo.png" alt="ProofScholar Logo" width="150" height="150" />

  <h1>ProofScholar 🛡️</h1>
  <p><strong>Privacy-Preserving Scholarship Verification on the Midnight Network</strong></p>

  <!-- TECH STACK BANNERS -->
  <p>
    <img src="https://img.shields.io/badge/Network-Midnight-blueviolet?style=for-the-badge" alt="Midnight Network" />
    <img src="https://img.shields.io/badge/Language-Compact-orange?style=for-the-badge" alt="Compact Language" />
    <img src="https://img.shields.io/badge/Frontend-React%20%7C%20Vite-blue?style=for-the-badge" alt="React & Vite" />
    <img src="https://img.shields.io/badge/Tested%20With-Vitest-yellow?style=for-the-badge" alt="Vitest" />
  </p>
</div>

---

## 🚀 Live Links

- **Live Application (Vercel):** [https://proofscholar-midnight.vercel.app/](https://proofscholar-midnight.vercel.app/)
- **Demo Video Presentation:** [Watch on YouTube](https://www.youtube.com/watch?v=dQw4w9WgXcQ) <!-- Update with your actual YouTube link later -->

---

## 💡 About the Product Idea

### The Problem
In legacy systems, students are forced to upload highly sensitive unencrypted documents (such as tax returns, university transcripts, and national IDs) to centralized databases. These databases are prime targets for data breaches, putting applicants at severe risk for identity theft. 

### The Solution
ProofScholar serves as a Zero-Knowledge (ZK) eligibility gate for academic scholarships. It eliminates the need for data transmission entirely. Verification is completely mathematical. Students can cryptographically prove they meet stringent academic and financial requirements (such as minimum GPA and maximum family income) without ever exposing their raw, sensitive data to centralized portals, scholarship boards, or the public blockchain ledger.

---

## ✨ Key Features

- **Zero-Knowledge Privacy:** Powered by the Midnight Network, students generate local cryptographic proofs. Sensitive PII (Personally Identifiable Information) never leaves their browser.
- **Dynamic Admin Deployments:** Scholarship administrators can deploy new smart contracts with custom Minimum GPA and Maximum Income thresholds directly from the interactive Admin Portal. No code changes required!
- **Serverless Architecture:** Built on Vercel API routes for fast, scalable, and seamless backend execution.
- **Dynamic Database & Caching:** Utilizes a **Neon Serverless Postgres Database** integrated with Prisma ORM to automatically track newly deployed contract addresses.
- **Ultra-Fast Edge Caching:** Integrated with **Upstash Redis** to cache contract configurations and verification statuses, ensuring lightning-fast load times for the frontend UI.

---

## 🔒 Privacy Model: Public State vs. Private Witness

The core value proposition of ProofScholar is absolute data privacy for applicants. We utilize a **Privacy-First Model** through Midnight's Zero-Knowledge proofs:

1. **Public State (Ledger Data):** The scholarship board publishes the eligibility thresholds (`min_gpa` and `max_income`) to the public Midnight ledger. These values are fully transparent and verifiable by any observer.
2. **Private Witness (User Data):** The student inputs their actual GPA and family income locally into their browser. These values are designated as "private witnesses" in the Compact circuit.
3. **Local Proof Generation:** The student's browser wallet runs a localized Zero-Knowledge circuit. It proves that the private witness data satisfies the public state thresholds.
4. **On-Chain Verification:** The wallet submits a cryptographic proof to the Midnight blockchain. The network validators verify the math without ever seeing the underlying private inputs.

**What observers see:** The scholarship thresholds, the user's public address, and the fact that a valid proof was submitted.  
**What remains permanently hidden:** The student's actual GPA, their family's actual income, and the margin by which they exceeded or missed the threshold.

---

## 📸 Product Screenshots

<p align="center">
  <img src="assets/PROJECT/landing-page.png" alt="Landing Page" width="800"/>
  <br/><em>Landing Page</em>
</p>
<p align="center">
  <img src="assets/PROJECT/verify-eligiblity.png" alt="Verify Eligibility" width="800"/>
  <br/><em>Verify Eligibility Portal</em>
</p>
<p align="center">
  <img src="assets/PROJECT/admin.png" alt="Admin Dashboard" width="800"/>
  <br/><em>Admin Dashboard</em>
</p>
<p align="center">
  <img src="assets/PROJECT/about page.png" alt="About Page" width="800"/>
  <br/><em>About Page</em>
</p>
<br/><br/>

---

## 📜 Smart Contracts

### Description
The Compact contract (`scholarship.compact`) is designed for maximum security and data minimization. The constructor sets the minimum GPA and maximum income requirements as public state. The `verify_eligibility` circuit acts as the gatekeeper, asserting the local private witness values against the public state without disclosing them.

### Deployment & Verification
The contract has been successfully deployed and verified on the Midnight Preview Network. Below are the on-chain records of the Zero-Knowledge proofs:

| Action Type | Address / Transaction Hash | 1AM Explorer |
| :--- | :--- | :--- |
| **Smart Contract** | `b54ec82c83b0ab08aaba7abdede0b9a8eb0e4dbff76413843cb345e4429733d5` | [Verify on Explorer](https://explorer.1am.xyz/contract/b54ec82c83b0ab08aaba7abdede0b9a8eb0e4dbff76413843cb345e4429733d5) |
| **Verification TX** | `5a312157b764deb27c21ea173652f4680babd205720aadcab0954f2108841fde` | [Verify on Explorer](https://explorer.1am.xyz/tx/5a312157b764deb27c21ea173652f4680babd205720aadcab0954f2108841fde?network=preview) |
| **Verify Student TX** | `e39aac21595316c099bd81fa0a6c4b723ab7626f169ecc1fb4cd5699c66400a7` | [Verify on Explorer](https://explorer.1am.xyz/tx/e39aac21595316c099bd81fa0a6c4b723ab7626f169ecc1fb4cd5699c66400a7?network=preview) |

<p align="center">
  <img src="assets/SMART CONTRACT/smart-contract.png" alt="Smart Contract Deployment" width="800"/>
</p>
<p align="center">
  <img src="assets/SMART CONTRACT/verify-eligibility.png" alt="Verify Eligibility Transaction" width="800"/>
</p>
<br/><br/>

---

## 🏗️ Project Architecture

```mermaid
graph TB
    classDef frontend fill:#3b82f6,stroke:#1d4ed8,stroke-width:2px,color:#fff,rx:8px
    classDef wallet fill:#8b5cf6,stroke:#6d28d9,stroke-width:2px,color:#fff,rx:8px
    classDef backend fill:#10b981,stroke:#047857,stroke-width:2px,color:#fff,rx:8px
    classDef blockchain fill:#f59e0b,stroke:#b45309,stroke-width:2px,color:#fff,rx:8px
    classDef db fill:#64748b,stroke:#334155,stroke-width:2px,color:#fff,rx:8px

    subgraph User Device ["💻 User Device (Client-Side)"]
        UI["React Frontend (Vite)"]:::frontend
        SDK["Midnight JS SDK"]:::frontend
        Wallet["Lace / 1AM Wallet Extension"]:::wallet
        WASM["Compact WebAssembly Circuit"]:::wallet
        
        UI -- "1. Inputs Private Credentials" --> SDK
        SDK -- "2. Formats Private Witness" --> Wallet
        Wallet -- "3. Executes" --> WASM
        WASM -. "4. Generates ZK Proof Locally" .-> Wallet
    end

    subgraph Cloud ["☁️ Vercel Cloud (Serverless)"]
        API["Vercel API Routes"]:::backend
        Redis[("Upstash Redis Cache")]:::db
        Neon[("Neon Postgres DB")]:::db
        
        UI -- "Fetch Config/Cache" --> API
        API -. "Reads/Writes" .-> Redis
        API -. "Reads/Writes" .-> Neon
    end

    subgraph Network ["🌐 Midnight Blockchain (Preview)"]
        Node["Midnight Validator Node"]:::blockchain
        Ledger[("Public Ledger State")]:::blockchain
        Contract{"Scholarship Smart Contract"}:::blockchain

        Wallet -- "5. Submits ZK Proof (No PII)" --> Node
        Node -- "6. Verifies Math" --> Contract
        Contract -- "7. Reads Public Thresholds" --> Ledger
        Contract -- "8. Records Success Tx" --> Ledger
    end
```

---

## 👤 User Workflow

```mermaid
sequenceDiagram
    autonumber
    actor Student
    
    box rgb(30, 41, 59) "Client Side (Zero Data Leaks)"
        participant UI as ProofScholar UI
        participant Wallet as 1AM / Lace Wallet
    end
    
    box rgb(15, 23, 42) "Backend Data"
        participant API as Vercel API
    end
    
    box rgb(67, 20, 7) "Midnight Blockchain"
        participant Node as Midnight Node
        participant Contract as Smart Contract
    end

    Student->>UI: Connects Wallet
    UI->>API: Fetch public contract address
    API-->>UI: Returns address (from Cache/DB)
    Student->>UI: Enters Private GPA & Income
    UI->>Wallet: Sends Data (Private Witness)
    
    Note over Wallet: Wallet isolates data.<br/>Generates ZK Proof locally<br/>via WASM Circuit.
    
    alt Criteria Met (Eligible)
        Wallet->>Node: Broadcasts Cryptographic Proof
        Note over Node,Contract: ZK Proof verified on-chain<br/>against public thresholds.
        Contract-->>Node: Transaction Confirmed
        Node-->>UI: TX Success Event
        UI->>API: Cache successful verification
        UI-->>Student: Displays "Eligibility Verified!" & TX Link
    else Criteria Failed (Ineligible)
        Note over Wallet: Local WASM assertion fails.<br/>Proof generation aborted.
        Wallet-->>UI: Throws Local Assertion Error
        UI-->>Student: Displays "Not Eligible" (No Gas Paid, No TX Sent)
    end
```

---

## 📂 File Structure

- **`/contracts`**: Contains the core logic. `scholarship.compact` is the main smart contract written in the Compact language.
- **`/frontend`**: The React + Vite application. It houses components like `LandingPage.tsx` and `NavBar.tsx`, integrating the Midnight dApp connector API to interface with the blockchain.
- **`/scripts`**: Automation and deployment scripts for compiling the circuits.
- **`/src`**: Test configurations and local node initialization scripts for Vitest.

---

## ✅ Test Cases

### How to Test
The project includes automated pure unit tests verifying both successful proofs (when conditions are met) and intended failure modes (when a student fails to meet the criteria).

Our test suite executes as purely mocked Zero-Knowledge circuits in-memory without the need for heavy Docker containers!

Simply run:
```bash
yarn validate
```

### Test Results
<p align="center">
  <img src="assets/TEST/test-run.png" alt="Test Run Results" width="800"/>
</p>
<br/><br/>

---

## 💻 Local Setup & Wallet Configuration

### 1. System Requirements
- Windows Subsystem for Linux 2 (WSL2), macOS, or native Linux.
- Docker Desktop (for the local Midnight node).
- Node.js (v22.0.0+) and Yarn.

### 2. Wallet Setup
To interact with the dApp, you must install the **Lace Wallet** (or Midnight's 1AM wallet) browser extension. Ensure the extension is set to the **Midnight Preview** network or **Local** network depending on your environment.

### 3. Clone and Install
```bash
git clone https://github.com/aditya-jha033/ProofScholar.git
cd ProofScholar
yarn install
```

### 4. Compile the Circuits
```bash
yarn compile
```

### 5. Start the Frontend Dev Server
```bash
cd frontend
npm install
npm run dev
```
Navigate to `http://localhost:5173` to view the application.

---

## 🔮 Future Implementation & Real-World Application

While ProofScholar currently serves as a proof-of-concept for academic scholarships, the underlying architecture has vast real-world applications:

1. **Mortgage & Loan Approval:** Proving an applicant meets income and credit score thresholds without the bank ever storing their exact financial records.
2. **Age Verification:** Allowing users to access restricted digital content by proving they are over 18 or 21 without providing a copy of their driver's license.
3. **Private Corporate Grants:** Distributing internal R&D funding anonymously, ensuring that grants are given purely based on project merit rather than identity biases. 

By eliminating the necessity to transmit and store sensitive personally identifiable information (PII), we significantly reduce the attack surface for bad actors, fostering a more secure and private web.
