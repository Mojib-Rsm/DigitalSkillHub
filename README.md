# TotthoAi

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
