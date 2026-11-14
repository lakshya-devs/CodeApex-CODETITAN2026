# VerityBrand — Supabase + Groq + Netlify

This build keeps the existing VerityBrand interface and Supabase email-OTP authentication. AI requests are sent to a Netlify Function, which verifies the signed-in Supabase user and calls Groq server-side. The Groq API key is never exposed in the browser.

## Step-by-Step API & Deployment Instructions

### 1. Extract and Structure

Extract this project into your local project directory. Make sure your folder structure matches Netlify's expected layout:

```text
your-project-folder/
├── index.html
├── netlify.toml
├── README.md
└── netlify/
    └── functions/
        └── ai-compliance.mjs
```

### 2. Create a Groq API key

1. Open https://console.groq.com/keys and sign in.
2. Create an API key and copy it once.
3. Keep it private. Do not put it in `index.html`, GitHub, or a public `.env` file.

### 3. Configure Netlify Environment Variables

To unlock full YouTube metadata extraction, Instagram oEmbed captions, and Groq AI vision screening, log into your **Netlify Dashboard**, navigate to **Site configuration → Environment variables**, and add the following keys:

| Variable | Required? | Purpose |
|---|---|---|
| `GROQ_API_KEY` | **Required** | Your Groq Console API key — used server-side to run the Qwen vision/text compliance screening model. |
| `SUPABASE_URL` | **Required** | `https://ujsimpojdvptubcycizp.supabase.co` — used to validate the signed-in user's access token. |
| `SUPABASE_ANON_KEY` | **Required** | Your Supabase publishable (anon) key. |
| `GROQ_MODEL` | Optional | Defaults to `qwen/qwen3.8-27b`. |
| `YOUTUBE_API_KEY` | Optional / Recommended | Generated from the Google Cloud Console with **YouTube Data API v3** enabled. Allows deep extraction of video descriptions and tags. Without it, YouTube link review falls back to basic oEmbed title/author + thumbnail only. |
| `META_OEMBED_TOKEN` | Optional / Recommended | A Meta Developer App token with **oEmbed Read** permissions, used to extract public Instagram reel and post captions. Without it, Instagram link review cannot proceed — upload a screenshot/screen-recording instead. |

Save the variables and deploy (or redeploy) the project — environment-variable changes require a new deploy before they apply to functions.

### 4. Deploy to Netlify

- **Via Git:** Commit the extracted files to your GitHub repository and push to your connected Netlify branch. Netlify will automatically build and publish your site using the provided `netlify.toml` configuration.
- **Via Netlify CLI:** Run the following from the project folder (make sure the CLI is linked to the correct `veritybrand` site first):

  ```bash
  netlify deploy --prod
  ```

### 5. Supabase settings

The supplied Supabase URL and publishable key are already configured in `index.html` for the browser client. The same values must also be entered in Netlify environment variables (Step 3) because the serverless function uses them to validate the signed-in user's access token.

In **Supabase Dashboard → Authentication → URL Configuration**, add your deployed Netlify URL to **Site URL** and **Redirect URLs**. Confirm **Email OTP** is enabled. Keep Row Level Security enabled on tables containing user or organisation data. Never use a `service_role` key in the browser.

### 6. Configure Your Brand Rules in the UI

Once live:

1. Open your deployed VerityBrand dashboard and sign in.
2. Navigate to the **Brand Knowledge Hub** tab in the sidebar.
3. Fill out your organisation's custom **Prohibited terms / phrases** and **Required disclaimer / phrases**.
4. Click **Save visual rules** so the browser saves them to local storage, allowing the AI compliance engine to strictly enforce them on your next scan.

### 7. Verify the deployment

Open `https://YOUR-SITE.netlify.app/.netlify/functions/ai-compliance`. A successful GET response should look like:

```json
{"ok":true,"model":"qwen/qwen3.8-27b","status":"Groq configured · server-side API key detected"}
```

This checks that the server-side key is present; it does not make a paid or live inference request. The POST endpoint requires a valid signed-in Supabase session.

## Supported analysis path and limitations

The existing browser-side extractors prepare pasted text, common images, PDF pages, DOCX text and embedded pictures, PPTX text and embedded pictures, and sampled video frames. These extracted text/images are sent to Groq through the Netlify Function. Groq vision supports up to three images per request; if more are supplied, only the first three are reviewed and the response includes a limitation. The current model accepts image + text inputs; PDFs and Office documents are processed by browser extraction, not uploaded as native document files. Video review is based on sampled frames; video audio is not transcribed in this build. Public YouTube/Instagram link review is metadata/thumbnail-based and does not constitute full-video review.

## Model, limits and privacy

Default model: `qwen/qwen3.8-27b`. Model availability, rate limits and quotas depend on your Groq account and can change. Check https://console.groq.com/docs/models, https://console.groq.com/docs/vision and https://console.groq.com/docs/rate-limits. Groq is fast but does not guarantee zero waiting, unlimited free requests, or uninterrupted availability.

## Local development

Install the Netlify CLI and run `netlify dev` from this project folder. Set `GROQ_API_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and (optionally) `YOUTUBE_API_KEY` / `META_OEMBED_TOKEN` in your local Netlify environment before testing. Never commit a real `.env` file.
