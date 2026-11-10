VerityBrand — Brand Governance & Content Compliance Platform

VerityBrand is a browser-based brand governance prototype designed to help teams review marketing content, identify potential compliance risks, maintain consistent brand language, and coordinate campaign approvals from one workspace.
Built for the hackathon by Code Apex.

https://veritybrand.netlify.app

Overview

Marketing teams publish content across advertisements, websites, social media, email campaigns, and other channels. Keeping every asset accurate, accessible, and consistent with an organisation's brand guidelines can be difficult.
VerityBrand brings several parts of that review process into one interface. Users can check written content, inspect uploaded assets, record evidence for advertising claims, compare campaign materials, and document human review decisions.
The current repository version is implemented as a single HTML file with embedded CSS and JavaScript. It is a working prototype, not a production-certified compliance service.

Key Features
1. Content compliance checker
Review pasted advertising copy, website text, social captions, email copy, and HTML snippets.
Flag selected advertising claims and potentially misleading wording.
Run checks for selected Hindi and Hinglish expressions as well as English wording.
Apply sector-specific rules for general content, health and wellness, finance and investments, food and beverage, and education and coaching.
Review basic HTML accessibility indicators, such as missing image alternative text, empty buttons, and vague link wording.
Display findings with risk levels, explanations, and suggested corrective actions.
2. Brand Knowledge Hub
Configure the expected brand wordmark text.
Record approved brand colours.
Define required phrases and prohibited terms.
Apply saved brand-language settings during supported content and asset checks.
3. File and asset inspection
Upload supported image files and use OCR to extract readable text.
Extract text from PDFs and inspect it against configured brand and content rules.
Inspect text and HTML files.
Identify possible claim, wording, and brand-rule issues in extracted text.
Sample image colours and compare them with the configured brand palette. This is a supporting signal, not a complete visual identity or design audit.
4. Campaign pre-flight review
Add multiple campaign assets to a single review.
Extract text from supported image, PDF, DOCX, TXT, and HTML files.
Compare detected prices, discounts, dates, and promotional codes across assets.
Check for required and prohibited brand phrases across the campaign.
Produce a campaign readiness report that can be printed or saved as a PDF through the browser's print dialog.
5. Claim Evidence Register
Record claims such as product rankings or price comparisons.
Add a supporting reference and evidence dates.
Track whether evidence is recorded, missing, or expired.
Use registered evidence status as an input to relevant claim checks.
6. Review and approval workflow
Record reviewer comments and decisions.
Track approval, revision-request, and version-history events in the prototype workspace.
Keep final publishing decisions with a human reviewer.
7. Campaign and monitoring workspace
Create and track campaigns, owners, due dates, and status.
View scan activity in a risk heatmap.
Re-check previously approved content when configured rules or evidence change.
Review sample monitoring and dashboard information provided for demonstration.
8. Additional interface features
Responsive landing page and dashboard layouts.
Light and dark themes.
Email one-time-password (OTP) authentication through Supabase when configured.
A temporary judge-demo entry option for hackathon presentations.

Technology Stack
Technology / Library
Purpose
HTML5
Page structure and interface components
CSS3
Layout, styling, responsive design, and themes
JavaScript
Client-side interactions, rule checks, and workspace logic
Supabase JavaScript SDK v2
Optional authentication and scan-history integration
Tesseract.js
OCR for supported image and scanned-document workflows
PDF.js
PDF text extraction and page rendering
Mammoth.js
DOCX text extraction in campaign pre-flight review
Google Fonts (Inter and Manrope)
Typography
There is no separate React application or Python/FastAPI server in the current HTML file.
Getting Started

Requirements
A modern web browser.
Internet access for the externally hosted libraries and fonts used by the page.
Python installed only if you choose to run the optional local development server shown below.
Run locally
Clone or download this repository.
Keep VerityBrand_dashboard_v4_preflight.html in the project folder. You may rename it to index.html if you prefer a shorter entry-page name.
Open a terminal in that folder and start a local web server:
python -m http.server 5500
Open the following address in your browser:
http://localhost:5500/VerityBrand_dashboard_v4_preflight.html
If you renamed the file to index.html, use http://localhost:5500/ instead.
You can also open the HTML file directly in a browser for a quick preview. Running it through a local server is recommended for a more consistent browser experience.

Supabase Configuration
The HTML file contains a VERITYBRAND_SUPABASE_CONFIG object for the Supabase project URL and browser publishable key. To connect the app to your own Supabase project, update that object in the HTML file:
window.VERITYBRAND_SUPABASE_CONFIG = {
  url: "YOUR_SUPABASE_PROJECT_URL",
  anonKey: "YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY" ( It's used from Mailjet primarily, as it's paid to manually send mails )
};
For real account authentication and workspace data:
Create a Supabase project.
Configure the Email OTP provider and the allowed site/redirect URLs in Supabase Authentication settings.
Create the database tables and relationships used by the application, including profiles, organisation_members, and organisations.
Configure the required Row Level Security (RLS) policies so users can access only the records they are permitted to access.
Create the optional scan_results table if you want authenticated scan history to sync with Supabase. The HTML source includes an example table definition and an owner-scoped RLS policy in a code comment.
Database setup note: This repository version does not include a complete Supabase SQL migration or setup script. In particular, the profile and organisation tables/policies must be created and tested in your Supabase project before relying on real user accounts.
Security note: A browser application may use a Supabase publishable/anon key, but it must never contain a Supabase service_role key, database password, SMTP credential, or other server secret. Enable and test RLS before storing real user or business information.
Demo Access
The current source includes a temporary Judge Demo access option to make the workspace easier to demonstrate during a hackathon. This option is enabled by the VB_JUDGE_DEMO_ENABLED setting in the JavaScript.
Demo access does not verify a real user account.
Demo workspace actions and sample records are intended for demonstration.
Do not use the demo mode to protect confidential information.
Disable the demo option before using the site as a real authenticated service.
How the Review Engine Works
The current content review engine uses JavaScript rule matching and configured checks. It looks for selected phrases, claim patterns, disclosure wording, accessibility signals in supplied HTML, and organisation-defined brand rules. It then displays matching findings and suggested actions.
Image and document workflows extract readable text in the browser using OCR or document-parsing libraries before applying supported checks. Some scan-history information can be saved in the browser, and authenticated scan records can optionally be synchronised with Supabase.
Implementation clarification: Although the product is presented as an AI-powered brand governance concept, the supplied HTML version does not currently make a call to Gemini or another generative AI model. Its current findings and recommendations are produced by predefined rules and pattern matching. A future AI service could extend this engine, but it should not be represented as part of the current implementation unless that integration is added.
Current Scope and Limitations
VerityBrand is intended to support reviewers, not replace legal, accessibility, or brand approval processes.
Not legal certification: The checks are limited rule-based indicators. They do not certify compliance with the ASCI Code, advertising laws, or sector regulations.
Limited accessibility checks: The prototype checks selected signals in supplied text or HTML. It does not perform a complete WCAG 2.2 audit, including full keyboard, screen-reader, focus, or rendered colour-contrast testing.
OCR limitations: OCR may miss small, stylised, low-resolution, or image-only text. The current OCR language configuration is English.
Document limits: Some PDF workflows inspect only a limited number of pages. Campaign pre-flight and the single-file inspection flow have different extraction limits.
Live website access: Browser security and CORS restrictions can prevent the Live Content Audit from reading a URL. Pasting the page text/HTML is the fallback. A crawl proxy is not configured by default.
Human review remains essential: Image layout, logo artwork, claim substantiation, disclaimers, offer conditions, and the final published creative must be checked by a person.
Demo data: Some dashboard, monitoring, and review views contain pre-filled example records for presentation purposes.
Local browser storage: Campaigns, custom rules, review information, and other prototype state may be stored in the current browser. Browser-local data is not automatically shared between users or devices.
Treat every finding as a prompt for review, not as a final legal or publishing decision.
Suggested Repository Structure
The current prototype can be kept as a single file. As the project grows, the code could be organised into separate files like this:
VerityBrand/
├── README.md
├── VerityBrand_dashboard_v4_preflight.html
├── assets/
│   ├── images/
│   └── screenshots/
├── docs/
│   └── architecture.md
└── supabase/
    └── migrations/
The folders shown above are a suggested future structure; they are not all included in the current prototype.
Future Enhancements
Integrate a generative AI service for context-aware explanations and rewrite suggestions.
Add complete and version-controlled Supabase schema migrations and RLS policies.
Move shared campaign, review, evidence, and brand-rule data into a structured backend.
Add a secure server-side website crawling service for URLs that block browser access.
Expand accessibility checks with automated tools and manual testing workflows.
Add more languages, OCR models, file formats, and sector-specific rule sets.
Add automated tests, error monitoring, and production deployment configuration.

Project
Live Demo: https://veritybrand.netlify.app
VerityBrand — Brand Governance and Content Compliance Platform
Hackathon Team: Code Apex
VerityBrand helps teams move from fragmented content checks to a more consistent review process—bringing brand rules, claim evidence, campaign checks, and human approval into one workspace.
