# How to Deploy TripPlanner

This project is a static React application built with Vite. You can host it on any service that serves static files.

## Prerequisite: Build the App

Before deploying, you must build the project to generate the production-ready files.

```bash
npm run build
```

This will create a `dist` folder containing your optimized HTML, CSS, and JavaScript.

---

## Option 1: Vercel (Recommended)

Vercel is optimized for frontend frameworks and is the easiest way to deploy.

1.  **Install Vercel CLI** (optional, or use the web dashboard):
    ```bash
    npm i -g vercel
    ```
2.  **Deploy**:
    ```bash
    vercel
    ```
3.  Follow the prompts. It will automatically detect Vite and configure the settings.

**Alternatively (via Web):**
1.  Push your code to a GitHub repository.
2.  Go to [Vercel.com](https://vercel.com) and sign up/login.
3.  Click "Add New Project" and import your repository.
4.  Vercel will detect Vite. Click "Deploy".

---

## Option 2: Netlify

1.  **Install Netlify CLI**:
    ```bash
    npm install netlify-cli -g
    ```
2.  **Deploy**:
    ```bash
    netlify deploy
    ```
3.  Follow the prompts.
    - **Publish directory**: `dist`

---

## Option 3: GitHub Pages

To deploy to GitHub Pages, you need a slightly different configuration.

1.  **Update `vite.config.js`**:
    Add your repository name as the base URL.
    ```javascript
    export default defineConfig({
      base: '/your-repo-name/',
      plugins: [react()],
    })
    ```

2.  **Install `gh-pages`**:
    ```bash
    npm install gh-pages --save-dev
    ```

3.  **Update `package.json`**:
    Add these scripts:
    ```json
    "scripts": {
      "predeploy": "npm run build",
      "deploy": "gh-pages -d dist",
      ...
    }
    ```

4.  **Deploy**:
    ```bash
    npm run deploy
    ```
