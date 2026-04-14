# Pull request summary (plain English)

## What we built

This change adds a **User Directory** web app. People in your organization appear in a list with their name, job role (Admin or Member), whether they are Active or Offline, and the last time they were seen. You can **move between pages** of the list instead of loading everyone at once, and you can **search** to narrow the list.

## Why pages instead of one long list

Loading thousands of people in a single screen can slow down the browser. The **server** now sends **one page at a time** (for example, 20 people per request) and reports **how many people match** so the app can show “page 1 of …” style navigation. That keeps the interface responsive.

## How search works (and why it is on the server)

When you type in the search box and press **Search**, the app asks the API for the **current page of results that match** your text. Matching looks at **name**, **role**, and **status**.

We do search on the **server** on purpose: the full list is large, and we never download all of it to the browser. Server-side search fits **pagination**: each page reflects “everyone who matches, sliced to this page,” not “filter only the small chunk already in memory,” which would be misleading for a big directory.

## How to try it locally

1. Start the API from the `server` folder (`npm run start:dev`). It listens on **port 3002** by default.
2. Copy `client/.env.local.example` to `client/.env.local` (adjust the URL only if your API port changes).
3. Start the website from the `client` folder (`npm run dev`). It runs on **port 3001** so it does not clash with the API.

Open http://localhost:3001 in your browser.
