import type React from "react";

export type MetricKind =
  | "render"
  | "performance"
  | "interaction"
  | "lifecycle"
  | "custom";

export interface Metric<TPayload extends Record<string, unknown> = Record<string, unknown>> {
  kind: MetricKind;
  timestamp: number;
  componentId?: string;
  phase?: "mount" | "update" | "nested-update" | "unmount";
  duration?: number;
  tags?: Record<string, string>;
  payload?: TPayload;
}

export type MetricTransport = (batch: Metric[]) => Promise<void> | void;

export interface AnalyticsProviderProps {
  children: React.ReactNode;
  transport?: MetricTransport | "console" | "fetch";
  endpoint?: string;
  headers?: Record<string, string>;
  flushIntervalMs?: number;
  maxBatchSize?: number;
  sampleRate?: number;
  tags?: Record<string, string>;
}

export interface AnalyticsContextValue {
  track: (metric: Metric) => void;
  tags: Record<string, string>;
}

