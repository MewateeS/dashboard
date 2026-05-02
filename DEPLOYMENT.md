# Deployment Flow for Mission Control

## Local Development
- The system uses local JSON files in `mission-control/data/`.
- `VERCEL_ENV` is not set to `production`, so `dataStore` defaults to `fs`.

## Production Deployment
1. **Vercel KV Setup**:
   - Ensure a Vercel KV database is linked to the project in the Vercel Dashboard.
   - This automatically provides `KV_URL`, `KV_REST_API_URL`, `KV_REST_API_TOKEN`, and `KV_REST_API_READ_ONLY_TOKEN`.

2. **Environment Variables**:
   - Set `VERCEL_ENV=production` in Vercel project settings to enable the KV wrapper.

3. **Deployment Command**:
   - Use the Vercel CLI:
     ```bash
     vercel --prod
     ```
   - Or push to the linked GitHub branch.

## Data Migration (Local -> KV)
To seed the production KV store with current local data:
- Create a script that iterates through `mission-control/data/*.json` and calls `dataStore.set(key, value)` while `VERCEL_ENV=production`.
