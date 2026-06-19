# Article Outline: Building a Real-Time User Analytics Platform

## 1. Introduction: The Analytics Challenge
- Building a "DIY" PostHog/Google Analytics clone.
- Why NestJS, Kafka, and MongoDB?
- Project overview: `user-analytics-monorepo` structure.

## 2. NestJS Architecture: DDD and Modular Design
- **Core Principles**: How NestJS facilitates Domain-Driven Design (DDD) through modularity.
- **Codebase Example**:
    - Separation between `apps/analytics-api` (Gateway) and `apps/analytics-core` (Processing).
    - Use of Modules (`AnalyticsHttpModule`, `AnalyticsModule`) to encapsulate domain logic.
    - Controllers as transport adapters, Services as domain logic holders.
- **Milestone**: Tracing the architecture from the "Initial commit from create-turbo".

## 3. Communication Patterns with Kafka
- **Event-Based (Fire-and-Forget)**:
    - Capturing events without blocking the user (high throughput).
    - Implementation: `analytics.service.ts` using `this.client.emit('analytics.capture', ...)`.
    - Consumer: `CaptureEventController` with `@EventPattern('analytics.capture')`.
- **Request-Response**:
    - Synchronously querying metrics for the dashboard.
    - Implementation: `analytics.service.ts` using `this.client.send('analytics.user-engagement', ...)`.
    - Consumer: `UserEngagementController` with `@MessagePattern('analytics.user-engagement')`.
- **Evolution**: Analysis of commit `4a4106f` ("refactor: introduce AnalyticsService to handle Kafka interactions").

## 4. MongoDB: From JSON Events to Insights
- **Flexible Schema**: Storing diverse event properties in `captureEvent.schema.ts`.
- **Local Setup**: Setting up MongoDB locally (`mongodb://localhost/user-analytics-db`) for rapid development.
- **Aggregation Pipelines**:
    - **Page Views**: Grouping by `properties.pathname`.
    - **Time on Page**: Calculating duration using `differenceInSeconds` between enter and leave events.
    - Reference: `UserEngagementService.getUserEngagementStats()` in `analytics-core`.

## 5. Analytics Fundamentals: Frontend Capture
- **The Tracker**: How `tester-ui` captures data in a Next.js environment.
- **Codebase Example**: `AnalyticsProvider.tsx`.
    - Generating `trackingId` (user identity) and `pageTransitionId` (session context).
    - Handling `page-view` on route change and `pageLeave` via `beforeunload`.
- **Key Metrics**: Explaining Page Views, Unique Users, and Engagement Duration from a technical implementation standpoint.

## 6. Conclusion and Next Steps
- Summary of the full-stack event flow.
- Scaling the consumer and advanced metrics (Retention, Funnels).
