# React Analytics Kit

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://www.javascript.com/) [![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/) [![GitHub stars](https://img.shields.io/github/stars/yksanjo/react-analytics-kit-?style=social)](https://github.com/yksanjo/react-analytics-kit-/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/yksanjo/react-analytics-kit-.svg)](https://github.com/yksanjo/react-analytics-kit-/network/members) [![GitHub issues](https://img.shields.io/github/issues/yksanjo/react-analytics-kit-.svg)](https://github.com/yksanjo/react-analytics-kit-/issues) [![Last commit](https://img.shields.io/github/last-commit/yksanjo/react-analytics-kit-.svg)](https://github.com/yksanjo/react-analytics-kit-/commits/main)


Lightweight instrumentation primitives that help React teams observe hydration cost, interaction latency, and layout stability without wiring a full observability platform. Inspired by the gaps we experienced while building React apps and following the `facebook/react` community’s push toward streaming + server components.

> Status: 🚧 experimental alpha. Expect the API to evolve quickly.

## Why this exists

- Hydration metrics are scattered across Chrome DevTools, manual `performance.mark` calls, and ad-hoc dashboards.
- React’s built-in Profiler is powerful but under-surfaced in production apps.
- Frontend teams want actionable telemetry (slow components, layout shift spikes, user device context) before investing in expensive APM suites.

React Analytics Kit gives you:

1. **`<AnalyticsProvider>`** – wraps your app with a React Profiler boundary and dispatches normalized metrics.
2. **Performance observers** for FCP, LCP, CLS, hydration duration, and user interaction delay.
3. **Composable transports** – send batches to console, Fetch endpoints, or your own queue.
4. **Hooks/HOCs** (`useAnalytics`, `useTrackComponent`) to instrument hot spots with one line.

## Quick start

```bash
npm install @react-analytics-kit/core
```

```tsx
import { AnalyticsProvider, useTrackComponent } from "@react-analytics-kit/core";

export function App({ children }: { children: React.ReactNode }) {
  return (
    <AnalyticsProvider
      flushIntervalMs={3000}
      transport="fetch"
      endpoint="/api/analytics"
      tags={{ env: "staging" }}
    >
      {children}
    </AnalyticsProvider>
  );
}

function ProductCard(props) {
  useTrackComponent("ProductCard", props.id);
  // ...
}
```

See `docs/roadmap.md` for the MVP plan and contribution ideas.

## Roadmap highlights

- ✅ Capture render commit duration via React Profiler.
- ✅ Observe FCP, LCP, CLS, Interaction-to-Next-Paint.
- ✅ Pluggable transports (console + fetch).
- 🔜 Next.js demo dashboard with live stream + flame-chart view.
- 🔜 Deterministic sampling + traces stitched with server logs.

## Contributing & community

- Issues labeled `good first issue` are perfect for folks new to telemetry.
- Discussions will host design sketches and RFCs.
- Join Reactiflux `#tooling` to talk about real-world instrumentation pain points and share feedback.

### Credit

- Built with love for the [`facebook/react`](https://github.com/facebook/react) community and the learning ecosystem around it.
- Metrics research inspired by Chrome Web Vitals and the `developer-roadmap` community’s emphasis on observability.
- Original project vision and stewardship by [`@yksanjo`](https://github.com/yksanjo).

---

Need help integrating this into your stack? Open an issue and describe your environment—we will triage within 48 hours.

