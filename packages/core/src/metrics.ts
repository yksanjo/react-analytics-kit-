import type { Metric } from "./types";

type MetricCallback = (metric: Metric) => void;

interface ObserverConfig {
  entryType: PerformanceEntryList["0"]["entryType"];
  metricName: string;
}

const observerConfigs: ObserverConfig[] = [
  { entryType: "largest-contentful-paint", metricName: "LCP" },
  { entryType: "first-contentful-paint", metricName: "FCP" },
  { entryType: "layout-shift", metricName: "CLS" },
  { entryType: "event", metricName: "INP" }
];

export function observeWebVitals(callback: MetricCallback): () => void {
  if (typeof window === "undefined" || typeof PerformanceObserver === "undefined") {
    return () => undefined;
  }

  const observers: PerformanceObserver[] = [];

  for (const config of observerConfigs) {
    try {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          callback({
            kind: "performance",
            timestamp: performance.timeOrigin + entry.startTime,
            payload: {
              metric: config.metricName,
              value: (entry as PerformanceEntry & { value?: number }).value ?? entry.duration
            }
          });
        });
      });
      // @ts-expect-error entry type union is too loose
      observer.observe({ type: config.entryType, buffered: true });
      observers.push(observer);
    } catch {
      // ignored – browser may not support this entry type
    }
  }

  return () => observers.forEach((observer) => observer.disconnect());
}

export function recordHydration(callback: MetricCallback) {
  if (typeof performance === "undefined") {
    return;
  }
  const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  const domInteractive = navigation?.domInteractive ?? performance.timeOrigin;

  requestAnimationFrame(() => {
    const duration = performance.now();
    callback({
      kind: "performance",
      timestamp: performance.timeOrigin + duration,
      payload: {
        metric: "hydration",
        duration,
        domInteractive
      }
    });
  });
}

