# Tibia Trader + Zephyr Cloud

A sophisticated market analysis tool for Tibia, now re-architected with Micro-Frontends and deployed via Zephyr Cloud.

## 🚀 Features

*   **Micro-Frontend Architecture**:
    *   **Host Application**: The main trading dashboard and market interface.
    *   **Remote Oracle**: An isolated, federated module for AI-driven advice ("Oracle Advisor").
*   **Performance**: Built with **Rspack** and **Vite** for blazing fast HMR and builds.
*   **Cloud Orchestration**: Managed by **Zephyr Cloud** for dynamic version resolution and atomic deployments.
*   **Environment Management**: Feature flags controlled via Zephyr Dashboard (Staging vs. Production).

## 🛠 Tech Stack

*   **Framework**: React 18 + TypeScript
*   **Build System**: Vite (Host) / Rspack (Remote)
*   **Styling**: TailwindCSS
*   **State Management**: React Context + Hooks
*   **Orchestration**: Zephyr Cloud (Module Federation)

## 📦 Project Structure

```bash
tibia-trader/
├── src/                # Host Application (Dashboard, Market, Auth)
├── remotes/
│   └── oracle-advisor/ # Remote Application (Federated Component)
├── zephyr/             # Zephyr configuration artifacts
└── vite.config.ts      # Federation configuration
```

## 🚦 Getting Started

### Prerequisites
*   Node.js 16+
*   NPM or Yarn

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

## 🧪 Testing

The project includes E2E tests to validate the federation integration.

```bash
# Run tests
npm run test
```
