# React Analytics Kit roadmap

## MVP (November 2025)

- Core package exposes:
  - `AnalyticsProvider` with Profiler boundary
  - Hook + HOC helpers (`useAnalytics`, `useTrackComponent`, `withAnalyticsProfiler`)
  - Performance observers for FCP, LCP, CLS, INP, hydration duration
  - Transport system (console + fetch implementation)
  - Batched delivery with sampling + retry
- Demo dashboard (Next.js app) visualizing recent metrics.
- Guides: “Instrumenting Next.js 15 app router” and “Shipping metrics to your data lake”.

## v0.2

- Persistent queue using IndexedDB for offline-first analytics.
- Trace correlation helpers (propagate request id + user session).
- Remix + React Native walkthroughs.
- Optional OpenTelemetry bridge (export spans).

## v0.3+

- Browser extension to inspect metrics in devtools panel.
- Prebuilt Grafana + ClickHouse dashboards.
- CLI to replay metrics locally and diff regressions.

## Looking for contributors

- Bundler expertise (tsup/rollup best practices).
- Experience with Web Vitals nuances and custom metrics.
- Designers who can build a minimal dashboard theme.

If you want to own a slice, open an issue and tag yourself!

