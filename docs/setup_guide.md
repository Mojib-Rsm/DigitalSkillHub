# Setup Guide: API Keys for TotthoAi SERP Tool

Follow these steps to get the necessary credentials for the "SERP Article" tool to function correctly. This tool can use multiple APIs for the best results.

## Part 1: Google Custom Search API (Required)

This is the primary API for fetching basic search engine results.

### Step 1: Get your GOOGLE_API_KEY

The API key authenticates your requests to Google's services.

1.  **Go to Google Cloud Console:** Navigate to the [Google Cloud Console](https://console.cloud.google.com/).

2.  **Create or Select a Project:**
    *   If you don't have a project, create one by clicking the project selector at the top of the page and then "NEW PROJECT".
    *   Give your project a name (e.g., "TotthoAi Project") and click "CREATE".

3.  **Enable the Custom Search API:**
    *   In the search bar at the top, search for "**Custom Search API**" and select it from the results.
    *   Click the "**ENABLE**" button. Wait for it to finish.
    *   Also, enable the **"Generative Language API"** for the AI features to work.

4.  **Create an API Key:**
    *   Navigate to the credentials page. You can do this by searching for "APIs & Services > Credentials" in the search bar or using the navigation menu.
    *   Click "**+ CREATE CREDENTIALS**" at the top of the page and select "**API key**".
    *   A new API key will be created. **Copy this key immediately.**

5.  **Add the key to your `.env` file:**
    *   Open your project's `.env` file.
    *   Paste the key you just copied as the value for `GOOGLE_API_KEY`.
    ```env
    GOOGLE_API_KEY=YOUR_API_KEY_HERE
    ```

> **Security Warning:** It is highly recommended to restrict your API key. In the Cloud Console, find your new API key, click the three dots menu, select "Edit API key", and under "API restrictions", select "Restrict key" and choose the "Custom Search API" and "Generative Language API".

### Step 2: Get your GOOGLE_CSE_ID (Programmable Search Engine ID)

The CSE ID (or Search Engine ID) tells Google *which* search engine to use for your query.

1.  **Go to the Programmable Search Engine page:** Navigate to the [Programmable Search Engine control panel](https://programmablesearchengine.google.com/).

2.  **Create a New Search Engine:**
    *   Click the "**Add**" button.
    *   In the "**What to search?**" section, enter any valid website (e.g., `www.google.com`). We need to specify at least one site, but we will configure it to search the entire web next.
    *   Give your search engine a name (e.g., "TotthoAi SERP").
    *   Click "**CREATE**".

3.  **Configure the Search Engine:**
    *   After creating, click "**Edit search engine**".
    *   Select your newly created search engine.
    *   Under "**Basics**" > "**Search settings**", find the "**Search the entire web**" option and turn it **ON**.
    *   Make sure "**Image search**" and "**SafeSearch**" are also turned **ON**.

4.  **Get the Search Engine ID:**
    *   On the same "Basics" tab, find the "**Search engine ID**" field.
    *   Click the "**Copy to clipboard**" button to copy your CSE ID.

5.  **Add the ID to your `.env` file:**
    *   Open your project's `.env` file again.
    *   Paste the ID you just copied as the value for `GOOGLE_CSE_ID`.
    ```env
    GOOGLE_CSE_ID=YOUR_SEARCH_ENGINE_ID_HERE
    ```

---

## Important: Checking API Quotas

If you encounter "Quota Exceeded" errors, it means you've hit the free usage limits for one of the Google APIs.

1.  **Go to the Google Cloud Console** for your project.
2.  Use the search bar to find the API you need to check (e.g., "Custom Search API" or "Generative Language API").
3.  Select the API from the search results.
4.  In the left sidebar for that API, click on **"Quotas"**.
5.  Here you can see your usage for different time periods. If you are consistently hitting the limits, you may need to **enable billing** on your Google Cloud project to increase the quotas.

---

## Part 2: SerpApi (Optional, for Related Questions)

This service is used to fetch "People Also Ask" data, which enriches the content outline.

1.  **Create an Account:** Go to [SerpApi](https://serpapi.com/) and sign up for an account. They have a free plan with a limited number of searches.
2.  **Get Your API Key:** Once logged in, navigate to your dashboard. Your private API key will be displayed there.
3.  **Add to `.env` file:**
    ```env
    SERPAPI_KEY=YOUR_SERPAPI_KEY_HERE
    ```

---

## Part 3: DataForSEO (Optional, for Keyword Data)

This service provides keyword search volume and CPC data.

1.  **Create an Account:** Go to [DataForSEO](https://dataforseo.com/) and register. They provide some free credits upon signing up.
2.  **Get Your Credentials:** Unlike other services, DataForSEO uses your account login (email) and password for API authentication.
3.  **Add to `.env` file:**
    *   Use the email you registered with as your `DATAFORSEO_LOGIN`.
    *   Use your account password as your `DATAFORSEO_PASSWORD`.
    ```env
    DATAFORSEO_LOGIN=your_email@example.com
    DATAFORSEO_PASSWORD=your_dataforseo_password
    ```

After adding all the desired keys to your `.env` file, restart the application. The "SERP Article" tool will automatically use the APIs for which keys have been provided.
