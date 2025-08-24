# Setup Guide: GOOGLE_API_KEY and GOOGLE_CSE_ID

Follow these steps to get the necessary credentials for the "One-Click Writer (SERP)" tool to function correctly. This tool uses the Google Custom Search JSON API.

## Step 1: Get your GOOGLE_API_KEY

The API key authenticates your requests to Google's services.

1.  **Go to Google Cloud Console:** Navigate to the [Google Cloud Console](https://console.cloud.google.com/).

2.  **Create or Select a Project:**
    *   If you don't have a project, create one by clicking the project selector at the top of the page and then "NEW PROJECT".
    *   Give your project a name (e.g., "TotthoAi Project") and click "CREATE".

3.  **Enable the Custom Search API:**
    *   In the search bar at the top, search for "**Custom Search API**" and select it from the results.
    *   Click the "**ENABLE**" button. Wait for it to finish.

4.  **Create an API Key:**
    *   Navigate to the credentials page. You can do this by searching for "APIs & Services > Credentials" in the search bar or using the navigation menu.
    *   Click "**+ CREATE CREDENTIALS**" at the top of the page and select "**API key**".
    *   A new API key will be created. **Copy this key immediately.**

5.  **Add the key to your `.env` file:**
    *   Open your project's `.env` file.
    *   Paste the key you just copied as the value for `GOOGLE_API_KEY`.
    ```env
    GOOGLE_API_KEY=# YOUR_API_KEY_HERE
    ```

> **Security Warning:** It is highly recommended to restrict your API key to prevent unauthorized use. In the Cloud Console, find your new API key, click the three dots menu, select "Edit API key", and under "API restrictions", select "Restrict key" and choose the "Custom Search API".

## Step 2: Get your GOOGLE_CSE_ID (Programmable Search Engine ID)

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
    GOOGLE_CSE_ID=# YOUR_SEARCH_ENGINE_ID_HERE
    ```

Once you have added both keys to your `.env` file, the "One-Click Writer (SERP)" tool will be fully functional.
