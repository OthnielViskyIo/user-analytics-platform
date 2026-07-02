# User Analytics Monorepo

A full-stack user analytics platform built as a monorepo using **pnpm workspaces** and **Turborepo**. It captures user sessions and events, processes them through a Kafka message pipeline, persists data in MongoDB, and exposes the insights through a REST API and a real-time dashboard.

## Apps & Packages

| Name | Description |
|---|---|
| `analytics-api` | NestJS backend — ingests events via Kafka, stores data in MongoDB, and exposes HTTP endpoints |
| `analytics-core` | Shared library — DTOs, utilities, and domain logic reused across apps |
| `analytics-dashboard` | Frontend dashboard — visualises session metrics and analytics over time |
| `tester-ui` | Developer UI — manually fire analytics events for testing and debugging |

## Tech Stack

- **Runtime**: Node.js ≥ 18
- **API**: NestJS
- **Message broker**: Apache Kafka (via KafkaJS)
- **Database**: MongoDB
- **Monorepo tooling**: pnpm + Turborepo
- **Language**: TypeScript

## Getting Started

### Prerequisites

Make sure the following services are running before starting the apps:

- **Kafka** — the API publishes and consumes analytics events through Kafka topics. A local broker (e.g. via Docker) must be reachable at the address configured in the environment.
- **MongoDB** — the API persists session and event data in MongoDB. A local or remote instance must be available and its connection URI set in the environment.

### Install dependencies

```bash
pnpm install
```

### Start all apps in development mode

```bash
pnpm start:dev
```

This runs every app in watch mode in parallel via Turborepo.

### Build for production

```bash
pnpm build
```

### Start in production mode

```bash
pnpm start
```
