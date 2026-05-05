# Aura Weather App

A modern, clean weather app with a refreshed UI and serverless backend API for secure key handling.

## Local Development

1. Install Node.js (if not installed).
2. Create `.env` from `.env.example` and add your API key:

```
OPENWEATHER_API_KEY=YOUR_REAL_OPENWEATHER_API_KEY
```

3. Run a local server to test (e.g. VS Code Live Server).
4. The frontend calls `/api/weather` which your local setup won't have yet, so for pure local testing without Vercel, use a direct API call temporarily.

## Deployment to Vercel (Recommended)

This setup is designed for Vercel serverless functions, which keep your API key secure on the server.

### Steps

1. Delete your old GitHub repo (which had the exposed key in history).
2. Create a new public GitHub repo with this code.
3. Push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit with Vercel serverless backend"
   git remote add origin https://github.com/YOUR_USERNAME/weather-app.git
   git push -u origin main
   ```
4. Connect to Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repo
5. Add environment variable in Vercel dashboard (Project Settings -> Environment Variables):
   - **Name:** `OPENWEATHER_API_KEY`
   - **Value:** Your real OpenWeather API key
6. Redeploy to Production from the latest commit after adding the variable.
7. Vercel will detect `/api/weather.js` and run it serverless.
8. Your frontend calls `/api/weather` which now runs on the server; the key is never exposed to browsers.

## Security

- `config.js`, `.env`, and `.vercel` are gitignored so secrets stay off GitHub.
- API key is stored only in Vercel environment variables on the server.
- Frontend never has access to the key.
- Old repo with exposed key should be deleted to prevent accidental forks.

## Notes

- The app reads weather via the backend `/api/weather` endpoint.
- If you want to rotate the key, just update it in Vercel's environment variables.
- No Node tooling needed for deployment; Vercel handles it all.
