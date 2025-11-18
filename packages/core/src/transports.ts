import type { Metric, MetricTransport } from "./types";

export const createConsoleTransport = (): MetricTransport => {
  return (batch: Metric[]) => {
    // eslint-disable-next-line no-console
    console.table(
      batch.map((metric) => ({
        kind: metric.kind,
        component: metric.componentId ?? "n/a",
        duration: metric.duration ?? "n/a",
        timestamp: new Date(metric.timestamp).toISOString(),
        payload: metric.payload ?? {}
      }))
    );
  };
};

export interface FetchTransportOptions {
  endpoint: string;
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
}

export const createFetchTransport = (options: FetchTransportOptions): MetricTransport => {
  return async (batch) => {
    await fetch(options.endpoint, {
      method: "POST",
      credentials: options.credentials ?? "same-origin",
      headers: {
        "Content-Type": "application/json",
        ...options.headers
      },
      body: JSON.stringify({ metrics: batch })
    });
  };
};

export function resolveTransport(
  transport: MetricTransport | "console" | "fetch" | undefined,
  config: { endpoint?: string; headers?: Record<string, string> }
): MetricTransport {
  if (typeof transport === "function") {
    return transport;
  }
  if (transport === "fetch" || (!transport && config.endpoint)) {
    if (!config.endpoint) {
      throw new Error("Fetch transport requires an endpoint");
    }
    return createFetchTransport({ endpoint: config.endpoint, headers: config.headers });
  }
  return createConsoleTransport();
}

