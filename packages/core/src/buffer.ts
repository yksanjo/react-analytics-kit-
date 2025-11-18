import type { Metric, MetricTransport } from "./types";

export interface MetricBufferOptions {
  transport: MetricTransport;
  flushIntervalMs: number;
  maxBatchSize: number;
  sampleRate: number;
  tags: Record<string, string>;
}

export class MetricBuffer {
  private readonly queue: Metric[] = [];
  private timer: ReturnType<typeof setInterval> | null = null;

  constructor(private readonly options: MetricBufferOptions) {}

  start() {
    if (this.timer) {
      return;
    }
    this.timer = setInterval(() => {
      void this.flush();
    }, this.options.flushIntervalMs);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    void this.flush();
  }

  enqueue(metric: Metric) {
    if (Math.random() > this.options.sampleRate) {
      return;
    }

    this.queue.push({
      ...metric,
      tags: {
        ...this.options.tags,
        ...metric.tags
      }
    });

    if (this.queue.length >= this.options.maxBatchSize) {
      void this.flush();
    }
  }

  async flush() {
    if (!this.queue.length) {
      return;
    }
    const batch = this.queue.splice(0, this.queue.length);
    try {
      await this.options.transport(batch);
    } catch (error) {
      console.error("[react-analytics-kit] transport failed", error);
      this.queue.unshift(...batch.slice(-this.options.maxBatchSize));
    }
  }
}

