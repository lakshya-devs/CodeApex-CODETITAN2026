# VerityBrand
### AI-Powered Brand Governance & Advertising Compliance Platform

<p align="center">
  <strong>Review smarter. Protect your brand. Publish with confidence.</strong>
</p>

<p align="center">
  <a href="https://veritybrand.netlify.app"><strong>Live Project</strong></a>
  ·
  <a href="#getting-started">Getting Started</a>
  ·
  <a href="#architecture">Architecture</a>
</p>
## 📢 IMPORTANT NOTE FOR HACKATHON JUDGES

> **📢 IMPORTANT NOTE FOR HACKATHON JUDGES**
>
> For the best experience, we encourage judges to log in to VerityBrand using their email address through the [Live Project](https://veritybrand.netlify.app) to explore the full range of features. Demo Mode is also available for a quick preview.
>
> If the verification email does not appear in your inbox, please check your Spam/Junk folder.
>
> After logging in, explore AI-powered verification, organisation management, team collaboration, campaign workflows and more.

---

---

## 1. Overview

**VerityBrand** is an AI-powered brand governance and advertising-compliance platform designed to help organisations review marketing content before it reaches the public.

Modern campaigns are distributed across social media, websites, videos, presentations, documents, and advertisements. Reviewing every asset manually can be slow and inconsistent. VerityBrand brings these review activities into one workspace, combining AI-assisted content analysis, organisation-specific brand rules, evidence-based findings, and a human approval workflow.

The platform screens submitted content for potential advertising and brand-compliance concerns, highlights supporting evidence, explains why an issue may matter, and recommends practical corrections. It is designed to support reviewers—not replace legal, regulatory, or editorial judgement.

**Live application:** https://veritybrand.netlify.app

---

## 2. The Problem We Address

Organisations often face several connected challenges when managing brand and advertising compliance:

- **Fragmented reviews:** Campaign assets are spread across text, images, documents, videos, and social platforms.
- **Inconsistent brand communication:** Different teams may use prohibited phrases, omit required disclaimers, or depart from approved brand guidelines.
- **Risky advertising claims:** Absolute claims, misleading promises, unclear offers, and missing disclosures can go unnoticed.
- **Manual review overhead:** Repeated checks across multiple campaign assets consume time and reviewer effort.
- **Limited traceability:** Teams need clear findings, evidence, suggested corrections, and a record of review decisions.

VerityBrand addresses these challenges through a unified, AI-assisted review and governance workflow.

---

## 3. What VerityBrand Does

VerityBrand brings content inspection and brand governance together in a single workspace.

### Core capabilities

| Capability | What it does |
|---|---|
| **Intelligent Content Analyzer** | Reviews submitted text and content for potential advertising, accessibility, and brand-rule concerns. |
| **File, Visual & Document Upload** | Extracts readable content from supported files and prepares visual material for AI-assisted inspection. |
| **Dedicated Video Review** | Uses NVIDIA-powered analysis of sampled video frames to identify visible claims and creative risks. |
| **Campaign Pre-Flight Check** | Reviews multiple campaign assets together and highlights cross-asset inconsistencies such as conflicting prices, dates, offers, and claims. |
| **Live Content Audit** | Checks supplied published-page content or pasted source material for potential compliance issues. |
| **Brand Knowledge Hub** | Lets organisations configure prohibited terms, required phrases, and brand-specific inspection rules. |
| **Human Review & Approval Gate** | Keeps human review and approval as part of the content governance process. |
| **Monitor & Auto Re-scan** | Tracks approved content and rechecks it when monitoring rules or evidence change. |
| **Risk Heatmap** | Visualises findings from recorded scans over time and by compliance category. |
| **Claim Evidence Register** | Provides a workspace for recording and reviewing advertising claims and their supporting evidence. |
| **Multilingual Interface** | Offers page translation in English, Hindi, Tamil, Gujarati, Marathi, and Bengali. |

---

## 4. How It Works

A typical VerityBrand review follows this workflow:

1. **Submit content** — Enter marketing copy, provide a supported public social link, or upload campaign assets.
2. **Extract content** — Browser-side tools extract text from supported documents and prepare images or sampled video frames.
3. **Run AI-assisted screening** — The relevant Netlify Function sends the prepared content to the configured AI provider.
4. **Evaluate findings** — Results identify potential risks, severity, evidence, location, confidence, applicable guideline context, and suggested corrections where available.
5. **Apply brand rules** — Organisation-specific prohibited terms and required wording are checked alongside the configured screening rules.
6. **Review and approve** — A human reviewer evaluates the findings and decides whether content should be approved.
7. **Monitor approved content** — Approved items can be monitored against subsequently added guideline updates and re-scanned.
8. **Review risk trends** — Recorded scan findings can be explored in the Risk Heatmap.

> **Important:** AI findings are advisory screening results. A clean result does not certify that an advertisement is legally compliant. Final publication decisions should include qualified human review.

---

## 5. Key Features in Detail

### 5.1 Intelligent Content Analysis

The analyzer supports text-based and multimodal review. It can assess supplied marketing copy and extracted content for potential concerns such as:

- Unsupported or absolute advertising claims.
- Potentially misleading promotional language.
- Missing required disclaimers or organisation-specific wording.
- Prohibited brand terminology.
- Accessibility-related concerns in supplied material.
- Potential discrepancies against the configured review context.

Findings are returned in a structured format, including severity, verdict, category, explanation, evidence, location, confidence, suggested correction, and guideline context.

### 5.2 Multi-Format File & Visual Review

The browser prepares supported files for analysis before sending extracted text and selected images to the AI service.

The current implementation includes support paths for:

- Images: PNG, JPG/JPEG, WebP, and GIF.
- PDF documents.
- DOCX documents.
- PPTX presentations.
- Text and data formats such as TXT, Markdown, CSV, TSV, and JSON.
- HTML content.
- Video files: MP4, MOV, M4V, and WebM, through sampled-frame review.

Extraction quality depends on file structure, readability, and browser processing. Unsupported formats and extraction limitations are surfaced rather than being treated as successfully reviewed.

### 5.3 Campaign Pre-Flight Check

The Campaign Pre-Flight workspace is designed to review a group of campaign assets together. It can identify potential inconsistencies across extracted material, including repeated offer values, prices, dates, campaign periods, and promotional claims.

The workspace provides a consolidated readiness report and an asset register to help reviewers identify what was processed and what needs attention.

### 5.4 Social Link Review

The AI compliance service supports best-effort public link retrieval for:

- YouTube videos and Shorts.
- Instagram posts and Reels.
- Public X posts.

The service retrieves public metadata or embed information where available and passes the retrieved text and permitted preview imagery for screening.

**A public social link review is not a full video review.** Private content, login-restricted pages, deleted posts, platform access restrictions, and unavailable metadata may prevent extraction. For video frame-level review, upload the video file through the dedicated video-review workflow.

### 5.5 NVIDIA-Powered Video Review

The dedicated NVIDIA video endpoint analyses sampled visual frames from an uploaded video. It is intended to identify visible advertising claims, offer disclosures, brand presentation, legibility, and other visual concerns.

The endpoint includes explicit handling for rate limits and exhausted usage quotas, returning a retry interval where available.

**Current limitation:** This workflow reviews sampled visual frames. It does not transcribe audio or speech, and it does not inspect every frame of the original video.

### 5.6 Brand Knowledge Hub & Guideline Knowledge Base

Organisations can configure their own brand requirements, including:

- Prohibited words and phrases.
- Required disclaimers and phrases.
- Visual and text inspection settings.
- Organisation-approved brand guidelines.

The Campaign Pre-Flight workspace also includes a guideline knowledge-base area for indexing supplied ASCI/WCAG reference material and organisation-specific guidelines. The availability and usefulness of checks depend on the reference material configured by the organisation.

### 5.7 Human Review, Monitoring & Risk Visibility

VerityBrand keeps human judgement in the workflow. Reviewers can approve content for monitoring, apply guideline updates, and re-scan approved items.

The Monitor workspace is designed to use actual approved content rather than pre-populated sample entries. Monitoring information and scan history are stored locally in the browser; scan-history synchronisation can be configured with Supabase.

The Risk Heatmap is built from recorded scans and supports date-range and sector filtering. When no scan history is available, the interface can show an empty state instead of fabricated risk metrics.

### 5.8 Multilingual Access

The interface includes a language selector for:

- English
- Hindi
- Tamil
- Gujarati
- Marathi
- Bengali

The current language-switching implementation uses the Google Translate browser widget and remembers the selected language in browser storage.

---

## 6. Technology Stack

The project uses a lightweight frontend with serverless AI integrations.

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | HTML5, CSS3, JavaScript | Responsive single-page application and interactive workspaces. |
| Authentication | Supabase Auth | Email OTP authentication and session management. |
| Backend | Netlify Functions (Node.js) | Server-side API orchestration and protected AI endpoints. |
| Text & image AI | Groq API | AI-assisted compliance analysis using the configured vision-capable model. |
| Video AI | NVIDIA API | Visual reasoning over sampled video frames. |
| Database integration | Supabase | User/session validation and optional scan-history synchronisation. |
| Browser persistence | LocalStorage / SessionStorage | Stores selected preferences, brand rules, approved monitoring items, and local scan history. |
| OCR | Tesseract.js | Text extraction from image-based content. |
| PDF processing | PDF.js | Browser-side PDF text extraction and page rendering for OCR when needed. |
| DOCX processing | Mammoth.js | Browser-side Word document text extraction. |
| PPTX processing | JSZip and browser XML parsing | Extraction of presentation text and embedded images. |
| Hosting & deployment | Netlify | Static-site hosting, serverless functions, and deployment workflow. |
| Language translation | Google Translate browser widget | Optional page translation into supported languages. |

---

## 7. Architecture

VerityBrand separates browser-side preparation and interaction from server-side AI calls.

```text
                       ┌──────────────────────────┐
                       │       User / Reviewer    │
                       └────────────┬─────────────┘
                                    │
                                    ▼
                       ┌──────────────────────────┐
                       │    VerityBrand Frontend  │
                       │       index.html         │
                       └────────────┬─────────────┘
                                    │
                 ┌──────────────────┼───────────────────┐
                 │                  │                   │
                 ▼                  ▼                   ▼
        ┌────────────────┐  ┌────────────────┐  ┌─────────────────┐
        │ Content & File │  │ Brand Rules &  │  │ Supabase Auth   │
        │ Extraction     │  │ Review Workflow│  │ Session         │
        └───────┬────────┘  └────────────────┘  └────────┬────────┘
                │                                        │
                └──────────────────┬─────────────────────┘
                                   │ Authenticated request
                                   ▼
                       ┌──────────────────────────┐
                       │      Netlify Functions   │
                       │                          │
                       │  ai-compliance.mjs       │
                       │  nvidia-video.mjs        │
                       └────────────┬─────────────┘
                                    │
                    ┌───────────────┴────────────────┐
                    │                                │
                    ▼                                ▼
          ┌──────────────────┐            ┌──────────────────┐
          │     Groq API     │            │    NVIDIA API    │
          │ Text + Vision AI │            │  Video-frame AI  │
          └──────────────────┘            └──────────────────┘

                  Supabase can also be used for
                    configured scan-history sync.
```

### Request flow

1. The browser collects user-provided content and extracts text or prepares images/frames.
2. The frontend obtains the current Supabase session.
3. It sends an authenticated request to the relevant Netlify Function.
4. The function validates the Supabase access token.
5. The function reads its provider API key from server-side environment variables.
6. The request is sent to Groq or NVIDIA.
7. The function returns structured analysis to the frontend.
8. The frontend presents findings for human review and records scan information according to the configured storage workflow.

**Security design:** Groq and NVIDIA API keys are read by server-side functions. They should never be embedded in frontend code or committed to source control.

---

## 8. Repository Structure

The deployed project is configured for a static frontend and Netlify Functions.

```text
veritybrand/
├── index.html
├── netlify.toml
├── README.md
└── netlify/
    └── functions/
        ├── ai-compliance.mjs
        └── nvidia-video.mjs
```

The supplied function files should be placed in `netlify/functions/` as shown above. Netlify is configured to publish the project root and use `netlify/functions` as the serverless-function directory.

---

## 9. Getting Started

### Prerequisites

- A GitHub account and repository.
- A Netlify account.
- A Supabase project.
- A Groq API key.
- An NVIDIA API key if video review is required.
- Optional: YouTube Data API v3 and Meta oEmbed credentials for improved public social-link metadata retrieval.
- Node.js and Netlify CLI for local function development.

### Step 1 — Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd veritybrand
```

Place the supplied files into the repository structure shown above.

### Step 2 — Configure Supabase

1. Create or open your Supabase project.
2. Enable Email OTP authentication.
3. In **Authentication → URL Configuration**, add your deployed Netlify URL to the allowed Site URL and Redirect URLs.
4. Configure the Supabase URL and publishable/anon key in the frontend as required by the existing application.
5. Add the same URL and publishable/anon key as Netlify environment variables for server-side session validation.
6. Keep Row Level Security enabled for tables containing user or organisation data.

Never expose a Supabase `service_role` key in browser code.

### Step 3 — Configure Netlify environment variables

Open **Netlify → Site configuration → Environment variables** and configure:

| Variable | Required | Description |
|---|---:|---|
| `GROQ_API_KEY` | Yes, for AI content analysis | Server-side Groq API key. |
| `SUPABASE_URL` | Yes | Supabase project URL used to validate user sessions. |
| `SUPABASE_ANON_KEY` | Yes | Supabase publishable/anon key used for session validation. |
| `NVIDIA_API_KEY` | For video review | Server-side NVIDIA API key. |
| `GROQ_MODEL` | Optional | Groq model override. The current function default is `qwen/qwen3.8-27b`. |
| `NVIDIA_VIDEO_MODEL` | Optional | NVIDIA video model override. The current function default is `nvidia/cosmos3-nano-reasoner`. |
| `YOUTUBE_API_KEY` | Optional | YouTube Data API v3 key for public video snippet and description metadata. |
| `META_OEMBED_TOKEN` | Optional | Meta oEmbed token for improved public Instagram metadata retrieval. |

**Important:** Keep all provider secrets in Netlify environment variables. Do not put them in `index.html`, commit them to GitHub, or expose them in a public `.env` file. Redeploy after changing environment variables.

### Step 4 — Deploy to Netlify

**Option A: Git-based deployment**

1. Push the repository to GitHub.
2. In Netlify, select **Add new site → Import an existing project**.
3. Connect the repository.
4. Confirm the publish directory is `.` and the functions directory is `netlify/functions`.
5. Add the environment variables from Step 3.
6. Deploy the site.

**Option B: Netlify CLI**

Install the CLI:

```bash
npm install -g netlify-cli
```

Run the local development server:

```bash
netlify dev
```

Deploy to production after linking the correct Netlify site:

```bash
netlify deploy --prod
```

### Step 5 — Verify the serverless endpoints

After deployment, open:

```text
https://YOUR-SITE.netlify.app/.netlify/functions/ai-compliance
```

When the Groq key is configured, the health endpoint should return a response similar to:

```json
{
  "ok": true,
  "model": "qwen/qwen3.8-27b",
  "status": "Groq configured · server-side API key detected"
}
```

For the video endpoint, open:

```text
https://YOUR-SITE.netlify.app/.netlify/functions/nvidia-video
```

A successful health response indicates that the NVIDIA key is configured. These GET checks verify configuration; they do not run a paid or live AI inference request. POST analysis requests require a valid signed-in Supabase session.

---

## 10. Configure Organisation-Specific Brand Rules

After signing in:

1. Open **Brand Knowledge Hub** from the dashboard.
2. Add prohibited words or phrases.
3. Add required disclaimers or phrases.
4. Configure the available visual and text inspection rules.
5. Save the rules.
6. Run a new analysis to evaluate content against the configured requirements.

The current browser-side brand-rule settings are saved in browser storage. Configure them separately in each browser environment where they are needed.

---

## 11. Data, Privacy & Security Considerations

VerityBrand is designed to keep provider secrets on the server side and validate authenticated requests before AI analysis.

- **Provider secrets:** Groq and NVIDIA keys belong in Netlify environment variables only.
- **Authentication:** AI function requests require a Supabase access token that the function validates.
- **Browser storage:** Some application state—including language preference, custom brand rules, approved monitoring items, and local scan history—is stored in browser storage.
- **Optional scan synchronisation:** The Risk Heatmap can synchronise scan history with a configured Supabase `scan_results` table using Row Level Security.
- **Third-party processing:** Content submitted for AI analysis is sent to the configured AI provider. Do not submit confidential or personal information unless the organisation has approved that processing.
- **Social platforms:** Link extraction is best-effort and respects public availability and platform access restrictions.

### Optional Supabase scan-history table

The application includes an optional Supabase sync path for scan history. The following SQL is provided by the project as a starting point; review it against your database design and security requirements before running it:

```sql
create table if not exists public.scan_results (
  id uuid primary key default gen_random_uuid(),
  client_id text unique,
  user_id uuid references auth.users not null default auth.uid(),
  scanned_at timestamptz not null,
  source text,
  sector text,
  score int,
  items jsonb not null default '[]',
  content text
);

alter table public.scan_results enable row level security;

create policy "Users can access their own scans"
on public.scan_results
for all
using (user_id = auth.uid())
with check (user_id = auth.uid());
```

---

## 12. Current Limitations & Responsible Use

Transparency is important for a compliance product. The current implementation has the following limitations:

- **AI is not legal certification.** Findings can be incomplete or incorrect. Human review remains necessary.
- **Document extraction is browser-side.** PDF and Office files are parsed or rendered in the browser; they are not sent as native document files to the AI model.
- **Image limit:** The Groq vision request reviews up to three images per request. Additional images are not included in that request.
- **Text limit:** The Groq function limits the analysed text to 12,000 characters per unit and reports truncation as a limitation.
- **Video sampling:** NVIDIA video analysis reviews sampled frames, not every frame. Audio and speech are not transcribed.
- **Social links:** YouTube, Instagram, and X reviews rely on publicly retrievable metadata, embed information, or preview imagery. They do not constitute full media review.
- **Platform restrictions:** Private posts, login walls, deleted content, unavailable metadata, rate limits, and access controls can prevent link extraction.
- **Browser-local state:** Monitoring items and some settings are stored in the current browser. They are not automatically a shared, organisation-wide database unless the relevant synchronisation and backend setup is implemented.
- **External service limits:** Groq, NVIDIA, Supabase, Google Translate, and social-platform services may impose rate limits, quotas, availability constraints, or changes to their APIs.
- **Translation:** The language selector relies on a third-party browser translation widget; translation quality and coverage may vary.

VerityBrand should be treated as a decision-support and pre-publication screening tool, not as a substitute for legal advice, regulatory approval, source verification, or a qualified compliance reviewer.

---

## 13. Hackathon Project

**Event:** WeCodeCoders — CodeTitan National Hackathon

VerityBrand demonstrates how AI-assisted analysis can be combined with brand-specific rules and a human approval process to make advertising review more consistent and operationally manageable.

The project focuses on three practical ideas:

1. **Prevention before publication** — Identify potential issues before campaign content goes live.
2. **Consistency across channels** — Bring text, images, documents, videos, and public social content into a common review workflow.
3. **Human-centred governance** — Make AI findings explainable and actionable while keeping final approval with people.

---

## 14. Roadmap & Future Scope

Potential future improvements include:

- Shared, organisation-wide persistence for monitoring rules, approvals, and scan history.
- More comprehensive role-based access and reviewer collaboration.
- Expanded social-platform integrations and resilient content extraction.
- Audio transcription and full-video timeline analysis.
- Richer evidence provenance and guideline citation in each finding.
- Automated policy updates with version history and impact tracking.
- More language coverage and improved localisation.
- Evaluation datasets and reviewer feedback loops to measure precision and reduce false positives.

These are future directions, not claims that every capability is already implemented.

---

## 15. Acknowledgements

VerityBrand brings together open-source browser technologies and external AI and cloud services, including Supabase, Netlify, Groq, NVIDIA, Tesseract.js, PDF.js, Mammoth.js, and JSZip.

We thank **WeCodeCoders and the CodeTitan National Hackathon** for the opportunity to build and present this project.

---

<p align="center">
  <strong>VerityBrand — Your Brand. Your Voice. Always Verified.</strong>
</p>

<p align="center">
  <a href="https://veritybrand.netlify.app">Explore the live application</a>
</p>
