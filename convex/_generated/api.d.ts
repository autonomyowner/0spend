/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 */

import type { ApiFromModules } from "convex/server";
import type * as ai_analyze from "../ai/analyze.js";
import type * as ai_analyzeHelpers from "../ai/analyzeHelpers.js";
import type * as creatives from "../creatives.js";
import type * as dashboard from "../dashboard.js";
import type * as http from "../http.js";
import type * as personas from "../personas.js";
import type * as results from "../results.js";
import type * as seed from "../seed.js";
import type * as tests from "../tests.js";
import type * as users from "../users.js";

declare const fullApi: ApiFromModules<{
  "ai/analyze": typeof ai_analyze;
  "ai/analyzeHelpers": typeof ai_analyzeHelpers;
  creatives: typeof creatives;
  dashboard: typeof dashboard;
  http: typeof http;
  personas: typeof personas;
  results: typeof results;
  seed: typeof seed;
  tests: typeof tests;
  users: typeof users;
}>;

export declare const api: typeof fullApi;
export declare const internal: typeof fullApi;
export declare const components: any;
