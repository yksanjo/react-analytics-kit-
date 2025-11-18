import { Profiler, useEffect, useMemo } from "react";
import { AnalyticsContext } from "./context";
import type { AnalyticsProviderProps, Metric } from "./types";
import { MetricBuffer } from "./buffer";
import { observeWebVitals, recordHydration } from "./metrics";
import { resolveTransport } from "./transports";

export function AnalyticsProvider({
  children,
  transport,
  endpoint,
  headers,
  flushIntervalMs = 5000,
  maxBatchSize = 25,
  sampleRate = 1,
  tags = {}
}: AnalyticsProviderProps) {
  const resolvedTransport = useMemo(
    () => resolveTransport(transport, { endpoint, headers }),
    [endpoint, headers, transport]
  );

  const buffer = useMemo(
    () =>
      new MetricBuffer({
        transport:
          transport === "fetch"
            ? resolveTransport("fetch", { endpoint, headers })
            : resolvedTransport,
        flushIntervalMs,
        maxBatchSize,
        sampleRate,
        tags
      }),
    [endpoint, flushIntervalMs, maxBatchSize, resolvedTransport, sampleRate, tags, transport]
  );

  useEffect(() => {
    buffer.start();
    recordHydration((metric) => buffer.enqueue(metric));
    const cleanupVitals = observeWebVitals((metric) => buffer.enqueue(metric));
    return () => {
      cleanupVitals();
      buffer.stop();
    };
  }, [buffer]);

  const contextValue = useMemo(
    () => ({
      track: (metric: Metric) => buffer.enqueue(metric),
      tags
    }),
    [buffer, tags]
  );

  const profilerCallback: React.ProfilerOnRenderCallback = (
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime
  ) => {
    buffer.enqueue({
      kind: "render",
      componentId: id,
      phase,
      duration: actualDuration,
      timestamp: performance.timeOrigin + commitTime,
      payload: {
        baseDuration,
        startTime,
        commitTime
      }
    });
  };

  return (
    <AnalyticsContext.Provider value={contextValue}>
      <Profiler id="AnalyticsRoot" onRender={profilerCallback}>
        {children}
      </Profiler>
    </AnalyticsContext.Provider>
  );
}

