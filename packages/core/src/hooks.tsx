import { Profiler, useContext, useEffect, useMemo, useRef } from "react";
import { AnalyticsContext } from "./context";
import type { Metric } from "./types";

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error("useAnalytics must be used within <AnalyticsProvider>");
  }
  return context;
}

export function useTrackComponent(componentName: string, entityId?: string) {
  const { track } = useAnalytics();
  const mountTimeRef = useRef(performance.now());

  useEffect(() => {
    const hydrationDuration = performance.now() - mountTimeRef.current;
    track({
      kind: "lifecycle",
      componentId: componentName,
      phase: "mount",
      duration: hydrationDuration,
      timestamp: performance.timeOrigin + performance.now(),
      payload: {
        entityId
      }
    });

    return () => {
      track({
        kind: "lifecycle",
        componentId: componentName,
        phase: "unmount",
        timestamp: performance.timeOrigin + performance.now(),
        payload: { entityId }
      });
    };
  }, [componentName, entityId, track]);
}

export function useTrackInteraction(eventName: string, payload?: Record<string, unknown>) {
  const { track } = useAnalytics();
  return () => {
    track({
      kind: "interaction",
      timestamp: performance.timeOrigin + performance.now(),
      payload: {
        eventName,
        ...payload
      }
    });
  };
}

export function withAnalyticsProfiler<T extends object>(
  Component: React.ComponentType<T>,
  id: string
) {
  return function AnalyticsProfiledComponent(props: T) {
    return (
      <Profiler
        id={id}
        onRender={(profilerId, phase, actualDuration, baseDuration, startTime, commitTime) => {
          const { track } = useAnalytics();
          track({
            kind: "render",
            componentId: profilerId,
            phase,
            duration: actualDuration,
            timestamp: performance.timeOrigin + commitTime,
            payload: { baseDuration, startTime }
          });
        }}
      >
        <Component {...props} />
      </Profiler>
    );
  };
}

export function useCustomMetric<TPayload extends Record<string, unknown> = Record<string, unknown>>() {
  const { track, tags } = useAnalytics();
  return useMemo(
    () => (metric: Omit<Metric<TPayload>, "timestamp">) => {
      track({
        ...metric,
        timestamp: Date.now(),
        tags: { ...tags, ...(metric.tags ?? {}) }
      });
    },
    [tags, track]
  );
}

