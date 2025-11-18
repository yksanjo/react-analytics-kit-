import { createContext } from "react";
import type { AnalyticsContextValue } from "./types";

export const AnalyticsContext = createContext<AnalyticsContextValue | null>(null);

