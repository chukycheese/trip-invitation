---
description: Deploy the application to Vercel
---

# Deploy to Vercel

This workflow guides you through deploying your Vite+React app to Vercel.

## Prerequisites
- A Vercel account (https://vercel.com/signup)
- Node.js installed

## Steps

1.  **Install Vercel CLI**
    Run this command in your terminal to install the Vercel CLI globally:
    ```bash
    npm install -g vercel
    ```

2.  **Login to Vercel**
    Authenticate your terminal with your Vercel account:
    ```bash
    vercel login
    ```
    *Follow the instructions in the browser to authorize.*

3.  **Deploy**
    Run the deploy command from the project root:
    ```bash
    vercel
    ```

4.  **Configuration Prompts**
    You will be asked a series of questions. Accept the defaults by pressing `Enter` for each:
    - Set up and deploy? **Y**
    - Which scope? **(Select your account)**
    - Link to existing project? **N**
    - What’s your project’s name? **trip-invitation**
    - In which directory is your code located? **./**
    - Want to modify these settings? **N** (Vercel automatically detects Vite)

5.  **Production Deployment**
    The previous step deploys a "Preview" version. To deploy to production (main domain):
    ```bash
    vercel --prod
    ```

## Alternative: Deploy via Git (Recommended for long term)

1.  Push your code to a GitHub repository.
2.  Go to the [Vercel Dashboard](https://vercel.com/dashboard).
3.  Click **Add New...** > **Project**.
4.  Import your GitHub repository.
5.  Click **Deploy**. Vercel handles the rest!
