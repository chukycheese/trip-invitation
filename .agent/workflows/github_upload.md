---
description: Upload the project to GitHub
---

# Upload to GitHub

Since I cannot directly access your GitHub account to create repositories, please follow these steps to upload your code.

## 1. Create a New Repository on GitHub

1.  Go to [GitHub.com](https://github.com) and log in.
2.  Click the **+** icon in the top-right corner and select **New repository**.
3.  **Repository name**: `trip-invitation` (or any name you prefer).
4.  **Public/Private**: Choose your preference (Private recommended if you want to keep it hidden).
5.  **Initialize this repository with**: Leave all unchecked (we already have code).
6.  Click **Create repository**.

## 2. Push Your Code

Copy the commands shown on the GitHub setup page under **"…or push an existing repository from the command line"**.

It will look something like this (replace `YOUR_USERNAME` with your actual GitHub username):

```bash
git remote add origin https://github.com/YOUR_USERNAME/trip-invitation.git
git branch -M main
git push -u origin main
```

Run these commands in your terminal.

## 3. Connect Vercel to GitHub (Optional but Recommended)

For automatic deployments whenever you push code:

1.  Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2.  Select your project (`trip-invitation`).
3.  Go to **Settings** > **Git**.
4.  Click **Connect Git Repository**.
5.  Select the GitHub repository you just created.
