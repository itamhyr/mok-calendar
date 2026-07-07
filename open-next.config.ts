import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Mok Calendar has no server-side data fetching or ISR/tag revalidation
// needs (it's a static, client-rendered calendar), so the default
// in-memory cache is sufficient. Add an incremental cache override here
// (e.g. r2-incremental-cache) only if server-rendered caching is added later.
export default defineCloudflareConfig({});
