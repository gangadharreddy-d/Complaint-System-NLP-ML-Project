# Vercel Deployment Guide

This guide will walk you through deploying your Supabase-backed Next.js and Express application cleanly and without errors on Vercel. 
To avoid complex Vercel monorepo routing issues, **we will deploy the Backend and Frontend as two separate Vercel projects.**

## Prerequisites
1. Push your entire project folder to a GitHub repository.
2. Ensure you have an account on [Vercel](https://vercel.com/) linked to your GitHub.
3. Check that your Supabase Database is live and you have your `SUPABASE_URL` and `SUPABASE_KEY`.

---

## Step 1: Deploy the Backend
1. Go to your Vercel Dashboard and click **Add New...** -> **Project**.
2. Select your GitHub repository.
3. In the **Configure Project** screen:
   - **Project Name**: `complaint-system-backend` (or similar)
   - **Framework Preset**: `Other` (or Node.js)
   - **Root Directory**: Click `Edit` and explicitly select the **`backend`** folder.
4. **Environment Variables**: Add all the variables from your local `backend/.env` file:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `JWT_SECRET`
   - `FRONTEND_URL` (Set this to `*` for now; you can update it later).
5. Click **Deploy**.
6. Once deployed, copy the **Domains** URL provided by Vercel (e.g., `https://complaint-system-backend.vercel.app`). 
   - Note: Your API endpoints will be served directly from the root of this domain via the `/api/` path (e.g., `https://your-domain.vercel.app/api/health`).

---

## Step 2: Deploy the Frontend
1. Go back to your Vercel Dashboard and click **Add New...** -> **Project**.
2. Select the *same* GitHub repository.
3. In the **Configure Project** screen:
   - **Project Name**: `complaint-system-frontend` (or similar)
   - **Framework Preset**: Vercel should automatically detect **Next.js**.
   - **Root Directory**: Click `Edit` and explicitly select the **`frontend`** folder.
4. **Environment Variables**: Add your frontend environment variables:
   - `NEXT_PUBLIC_API_URL`: Set this to the backend domain you copied in Step 1, plus `/api`. 
     *(Example: `https://complaint-system-backend.vercel.app/api`)*
5. Click **Deploy**.

---

## Step 3: Final Security Touches & Verification
1. Now that your frontend is deployed, copy its live Vercel domain.
2. Go to your **Backend Project** settings on Vercel -> **Environment Variables**.
3. Update `FRONTEND_URL` to be the frontend's domain (e.g., `https://complaint-system-frontend.vercel.app`) to properly secure your CORS policy.
4. Go to **Deployments** on the backend project and hit **Redeploy** so the new CORS environment variable takes effect.
5. Visit your frontend URL and test submitting a CSV bulk upload. It will now properly process the upload via memory buffers without running into Vercel file-system errors!
