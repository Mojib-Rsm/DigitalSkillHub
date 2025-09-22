17:56:49.230 Running build in Washington, D.C., USA (East) – iad1
17:56:49.232 Build machine configuration: 2 cores, 8 GB
17:56:49.302 Cloning github.com/Mojib-Rsm/DigitalSkillHub (Branch: main, Commit: 809aed0)
17:56:50.518 Cloning completed: 1.216s
17:56:52.782 Restored build cache from previous deployment (Af1TM53m6nvd2tbkoFVLdgUD5EyD)
17:56:53.636 Running "vercel build"
17:56:54.005 Vercel CLI 48.0.3
17:56:54.339 Installing dependencies...
17:57:07.334 
17:57:07.335 added 72 packages, removed 167 packages, and changed 140 packages in 13s
17:57:07.335 
17:57:07.336 180 packages are looking for funding
17:57:07.336   run `npm fund` for details
17:57:07.371 Detected Next.js version: 15.5.3
17:57:07.377 Running "npm run build"
17:57:07.481 
17:57:07.482 > nextn@0.1.0 build
17:57:07.482 > next build
17:57:07.485 
17:57:08.070  ⚠ Invalid next.config.mjs options detected: 
17:57:08.071  ⚠     Unrecognized key(s) in object: 'serverActions'
17:57:08.071  ⚠ See more info here: https://nextjs.org/docs/messages/invalid-next-config
17:57:08.126    ▲ Next.js 15.5.3
17:57:08.127 
17:57:08.221    Creating an optimized production build ...
17:57:50.598 <w> [webpack.cache.PackFileCacheStrategy] Serializing big strings (128kiB) impacts deserialization performance (consider using Buffer instead and decode when needed)
17:57:51.189 Failed to compile.
17:57:51.190 
17:57:51.190 ./node_modules/dotprompt/dist/index.js
17:57:51.190 Module not found: Can't resolve 'handlebars/dist/cjs/handlebars.js'
17:57:51.191 
17:57:51.191 https://nextjs.org/docs/messages/module-not-found
17:57:51.191 
17:57:51.191 Import trace for requested module:
17:57:51.192 ./node_modules/@genkit-ai/core/lib/registry.js
17:57:51.193 ./node_modules/genkit/lib/registry.js
17:57:51.193 ./node_modules/genkit/lib/genkit.js
17:57:51.194 ./node_modules/genkit/lib/index.mjs
17:57:51.194 ./src/ai/flows/bengali-translator.ts
17:57:51.194 ./node_modules/next/dist/build/webpack/loaders/next-flight-action-entry-loader.js?actions=%5B%5B%22%2Fvercel%2Fpath0%2Fsrc%2Fservices%2Femail-service.ts%22%2C%5B%7B%22id%22%3A%2240dbb809327a592e56bbe4e7a5b3ce14e4c09c08c2%22%2C%22exportedName%22%3A%22sendErrorNotification%22%2C%22filename%22%3A%22services%2Femail-service.ts%22%7D%5D%5D%2C%5B%22%2Fvercel%2Fpath0%2Fsrc%2Fapp%2Factions%2Fchatbot.ts%22%2C%5B%7B%22id%22%3A%224068aa2a03673aeadad09df8da8bfcea9b671b55af%22%2C%22exportedName%22%3A%22chatbotAction%22%2C%22filename%22%3A%22app%2Factions%2Fchatbot.ts%22%7D%5D%5D%2C%5B%22%2Fvercel%2Fpath0%2Fsrc%2Fai%2Fflows%2Fbengali-translator.ts%22%2C%5B%7B%22id%22%3A%224052f47bf2db5e4ec2a4d9e2bd336d1a2e7a1727b8%22%2C%22exportedName%22%3A%22bengaliTranslator%22%2C%22filename%22%3A%22ai%2Fflows%2Fbengali-translator.ts%22%7D%5D%5D%5D&__client_imported__=true!
17:57:51.195 
17:57:51.196 
17:57:51.196 > Build failed because of webpack errors
17:57:51.282 Error: Command "npm run build" exited with 1
Legacy JavaScript Potential savings of 11 KiB
Forced reflow
Network dependency tree
Use efficient cache lifetimes Potential savings of 80 KiB# TotthoAi

Welcome to TotthoAi, your all-in-one AI-powered toolkit for content creation, image generation, business solutions, and more.

## Getting Started

To get the application up and running, you'll need to configure your environment variables.

1.  **Copy the `.env.example` file to a new file named `.env`:**
    ```bash
    cp .env.example .env
    ```

2.  **Set up Firebase:**
    *   Create a new Firebase project at [console.firebase.google.com](https://console.firebase.google.com/).
    *   Go to **Project settings** > **General** and find your **Web App** configuration.
    *   Copy the configuration values and paste them into your `.env` file for the `NEXT_PUBLIC_FIREBASE_*` variables.
    *   Enable Firestore in your project.

3.  **Set up Google APIs for SERP Tool:**
    *   Follow the detailed instructions in `docs/setup_guide.md` to get your `GOOGLE_API_KEY` and `GOOGLE_CSE_ID`.
    *   Add these keys to your `.env` file.

4.  **Set up Optional APIs (SerpApi, DataForSEO):**
    *   For enhanced features, follow the optional steps in `docs/setup_guide.md` to get API keys for SerpApi and DataForSEO.
    *   Add these to your `.env` file.

5.  **Install dependencies and run the development server:**
    ```bash
    npm install
    npm run dev
    ```

## Troubleshooting

### Error: "Quota exceeded"

If you encounter an error message like "Quota exceeded" or "API limit reached", it means that one of the external services (like Google Custom Search, Firebase, or Gemini) has reached its usage limit for the day or billing period.

**How to Fix:**

1.  **Identify the API:** Check the server logs to see which API call is failing.
2.  **Check Your Quotas:** Go to the [Google Cloud Console](https://console.cloud.google.com/) for your project.
3.  Navigate to **"APIs & Services" > "Enabled APIs & services"**.
4.  Click on the API that is causing the issue (e.g., "Custom Search API", "Generative Language API").
5.  Go to the **"Quotas"** tab to see your usage.
6.  **Enable Billing:** Many Google Cloud services have very low limits on the free tier. To increase these limits, you may need to [enable billing](https://cloud.google.com/billing/docs/how-to/modify-project) for your Google Cloud project.

For more detailed instructions, please see the **"Important: Checking API Quotas"** section in `docs/setup_guide.md`.
