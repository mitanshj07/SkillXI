## 2024-05-14 - Parallelizing Independent Network Requests
**Learning:** Found sequential independent network requests creating a network waterfall in critical data-loading paths (e.g. `trySupabaseSelect` and `fetchUpcomingFixtures` being awaited sequentially).
**Action:** Use `Promise.all` to fetch independent data sources concurrently to minimize total latency and avoid network bottlenecks.
