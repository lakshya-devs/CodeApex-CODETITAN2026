// VerityBrand AI compliance function — Groq API.
// Required Netlify environment variables: GROQ_API_KEY, SUPABASE_URL, SUPABASE_ANON_KEY, YOUTUBE_API_KEY, META_OEMBED_TOKEN.
// The Groq key is server-side only. Never place it in index.html or source control.

const GROQ_BASE = 'https://api.groq.com/openai/v1';
const SYNC_BUDGET_MS = 54000;
const env = (k, d = '') => {
  try { const v = globalThis.Netlify?.env?.get?.(k); if (v) return v; } catch { /* local runtime */ }
  return process.env[k] || d;
};
const cfg = () => ({ key: env('GROQ_API_KEY'), model: env('GROQ_MODEL', 'qwen/qwen3.8-27b') });
const json = (status, body) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
class AIError extends Error { constructor(status, code, message) { super(message); this.status = status; this.code = code; } }
const str = (v, n) => (v == null ? '' : String(v)).slice(0, n);
const clamp01 = v => { v = Number(v); return Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : 0; };

export default async (req) => {
  if (req.method === 'GET') return health();
  if (req.method !== 'POST') return json(405, { error: 'Method not allowed.' });
  const c = cfg();
  if (!c.key) return json(503, { error: 'GROQ_API_KEY is not set. Add it in Netlify environment variables, then redeploy.', code: 'no_key' });
  const auth = await verifyUser(req);
  if (auth.error) return json(auth.status, { error: auth.error, code: 'auth' });
  let body;
  try {
    const raw = await req.text();
    if (raw.length > 5.5 * 1024 * 1024) return json(413, { error: 'Request too large (about 5 MB limit). Send fewer or smaller images.', code: 'too_large' });
    body = JSON.parse(raw);
  } catch { return json(400, { error: 'Invalid JSON request.', code: 'bad_request' }); }
  try { return json(200, await analyze(body, c)); }
  catch (e) { return json(e instanceof AIError ? e.status : 500, { error: e.message || 'Unexpected error.', code: e.code || 'internal' }); }
};

async function health() {
  const c = cfg();
  if (!c.key) return json(503, { ok: false, error: 'GROQ_API_KEY is not set in Netlify environment variables.', code: 'no_key' });
  return json(200, { ok: true, model: c.model, status: 'Groq configured · server-side API key detected' });
}

async function verifyUser(req) {
  const token = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '').trim();
  if (!token) return { error: 'Sign in to use AI analysis.', status: 401 };
  const url = env('SUPABASE_URL'), anon = env('SUPABASE_ANON_KEY');
  if (!url || !anon) return { error: 'SUPABASE_URL and SUPABASE_ANON_KEY must be set in Netlify environment variables.', status: 500 };
  try {
    const r = await fetch(url.replace(/\/$/, '') + '/auth/v1/user', { headers: { apikey: anon, Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(8000) });
    if (!r.ok) return { error: 'Your session is invalid or expired. Sign in again.', status: 401 };
    return { user: await r.json() };
  } catch { return { error: 'Could not verify your sign-in with Supabase.', status: 502 }; }
}

const KINDS = ['text', 'document', 'image', 'visual', 'video', 'link'];
const IMG_RE = /^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/;
const MAX_TEXT = 12000;

async function analyze(body, c) {
  const ctx = { sector: str(body.sector, 60) || 'general', organisation: str(body.organisation, 120), campaign: str(body.campaign, 160), rules: str(JSON.stringify(body.rules || {}), 3000) };
  let unit;
  if (body.task === 'text') unit = { name: 'Pasted text', kind: 'text', text: String(body.content || ''), images: [], url: '' };
  else if (body.task === 'unit' && body.unit && typeof body.unit === 'object') {
    const u = body.unit;
    unit = { name: str(u.name, 200) || 'asset', kind: KINDS.includes(u.kind) ? u.kind : 'document', text: String(u.text || ''), images: Array.isArray(u.images) ? u.images : [], url: str(u.url, 500) };
  } else throw new AIError(400, 'bad_request', 'Unknown request type.');

  const limitations = [];
  if (unit.kind === 'link') { const r = await resolveLink(unit.url); unit.text = r.text; unit.images = r.images; limitations.push(...r.limitations); }
  unit.images = unit.images.filter(i => typeof i === 'string' && i.length < 2_800_000 && IMG_RE.test(i));
  if (unit.images.length > 3) { unit.images = unit.images.slice(0, 3); limitations.push('Groq vision accepts up to three images per request; only the first three images were reviewed.'); }
  if (unit.text.length > MAX_TEXT) { unit.text = unit.text.slice(0, MAX_TEXT); limitations.push(`Text was cut at ${MAX_TEXT.toLocaleString('en-IN')} characters; the remainder was not reviewed.`); }
  if (!unit.text.trim() && !unit.images.length) throw new AIError(422, 'no_content', limitations.join(' ') || 'There was nothing readable to analyse.');

  const prompt = buildPrompt(unit, ctx);
  const parts = [];
  for (const dataUrl of unit.images) {
    const m = dataUrl.match(IMG_RE);
    if (m) parts.push({ inlineData: { mimeType: `image/${m[1]}`, data: m[2] } });
  }
  parts.push({ text: prompt });
  const result = await groqGenerate({ model: c.model, key: c.key, prompt, images: unit.images, deadline: Date.now() + SYNC_BUDGET_MS });
  const parsed = extractJson(result.text);
  if (!parsed) throw new AIError(502, 'bad_output', 'Groq returned a reply that could not be read as JSON. Try again.');
  const extracted = str(parsed.extracted_text, 20000) || (['text', 'document', 'link'].includes(unit.kind) ? unit.text.slice(0, 20000) : '');
  return { findings: cleanFindings(parsed.findings), limitations: [...limitations, ...(Array.isArray(parsed.limitations) ? parsed.limitations.map(x => str(x, 300)).filter(Boolean) : [])].slice(0, 12), extracted_text: extracted, model: result.model, status: 'Groq · AI screening' };
}

async function groqGenerate({ model, key, prompt, images, deadline }) {
  const remaining = deadline - Date.now();
  if (remaining < 4000) throw new AIError(504, 'timeout', 'The analysis ran out of time. Try fewer or smaller items.');
  const content = [{ type: 'text', text: prompt }];
  for (const dataUrl of images) content.push({ type: 'image_url', image_url: { url: dataUrl } });
  let r;
  try {
    r = await fetch(`${GROQ_BASE}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({ model, messages: [{ role: 'user', content }], temperature: 0.1, max_tokens: 4096, response_format: { type: 'json_object' } }),
      signal: AbortSignal.timeout(Math.min(remaining - 1000, 52000))
    });
  } catch (e) {
    throw new AIError(502, 'network', 'Could not reach Groq: ' + (e.message || e));
  }
  const raw = await r.text();
  let d = {}; try { d = JSON.parse(raw); } catch { /* handled below */ }
  if (!r.ok) {
    const msg = str(d?.error?.message || raw, 500);
    if (r.status === 400) throw new AIError(400, 'groq_bad_request', `Groq rejected the request: ${msg}`);
    if (r.status === 401 || r.status === 403) throw new AIError(502, 'bad_key', 'Groq rejected the API key. Check GROQ_API_KEY in Netlify and confirm the key is active.');
    if (r.status === 404) throw new AIError(502, 'model_unavailable', `Groq model ${model} is unavailable to this account. Check the model ID in GROQ_MODEL. ${msg}`);
    if (r.status === 413) throw new AIError(413, 'too_large', 'The request is too large for Groq. Try a smaller file or fewer pages/images.');
    if (r.status === 429) throw new AIError(429, 'rate_limited', 'Groq rate limit reached. Wait briefly or check your Groq Console limits.');
    if (r.status === 502 || r.status === 503) throw new AIError(503, 'upstream_unavailable', `Groq is temporarily unavailable (HTTP ${r.status}). Please retry shortly.`);
    throw new AIError(502, 'upstream', `Groq returned HTTP ${r.status}. ${msg}`);
  }
  const text = d.choices?.[0]?.message?.content;
  if (!text || typeof text !== 'string') throw new AIError(502, 'empty', 'Groq returned an empty reply. Try again.');
  return { text, model };
}

function cleanFindings(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.filter(f => f && typeof f === 'object').slice(0, 25).map(f => {
    const verdict = ['likely_violation', 'needs_review', 'no_issue_found'].includes(f.verdict) ? f.verdict : 'needs_review';
    let severity = ['high', 'warning', 'info'].includes(f.severity) ? f.severity : 'info';
    if (verdict === 'no_issue_found') severity = 'info';
    return { 
      severity, 
      verdict, 
      category: str(f.category, 80) || 'Compliance & Extraction', 
      title: str(f.title, 160) || 'AI Finding', 
      why: str(f.why, 700), 
      evidence: str(f.evidence, 500) || 'AI visual assessment', 
      location: str(f.location, 160) || 'Asset wide', 
      confidence: clamp01(f.confidence || 0.85), 
      suggested_correction: str(f.suggested_correction, 700), 
      guideline: str(f.guideline, 200) || 'Brand / ASCI Guidelines'
    };
  });
}

function buildPrompt(unit, ctx) {
  const kindNote = { 
    text: 'The content below is pasted marketing copy.', 
    document: 'The content below was extracted via OCR and document parsers. Pay close attention to promotional text, fine print, and disclaimers.', 
    image: 'The attached image is an advertising creative. Extract promotional text and review visuals against brand rules.', 
    visual: 'The attached image is a page, slide or embedded picture. Assess graphics, fine-print legibility, contrast, imagery and claims.', 
    video: 'The attached image is a contact sheet of sampled video frames. Assess visual transitions, on-screen text, and claims.', 
    link: 'The content below is public metadata extracted from a social URL.' 
  }[unit.kind] || 'Review the supplied material.';

  return [
    'You are an expert AI advertising compliance reviewer and Brand Guardian.',
    'MANDATE 1: Assess content against ASCI (Advertising Standards Council of India) guidelines, CCPA regulations on misleading ads, and WCAG accessibility standards.',
    'MANDATE 2 (BRAND RULES): Strictly enforce the provided Organisation-Specific Brand Rules JSON. If a term is prohibited, flag it. If a disclaimer is required but missing, flag it.',
    'REPORTING REQUIREMENTS:',
    '- Quote EXACT extracted text as evidence.',
    '- Provide a confidence score (0.0 to 1.0) for every finding.',
    '- Specify the exact location (e.g., "Frame 2", "Video Description", "Paragraph 3").',
    '- Note any extraction limitations (e.g., blurry text, audio missing).',
    `Context: Sector=${ctx.sector}; Organisation=${ctx.organisation}; Campaign=${ctx.campaign}; Asset Name=${unit.name}`,
    `Brand Rules JSON (ENFORCE THESE): ${ctx.rules && ctx.rules !== '{}' ? ctx.rules : 'No custom rules provided. Use standard ASCI guidelines.'}`, 
    kindNote,
    'Return ONE JSON object containing: { "extracted_text": "string of all readable promotional text/captions", "findings": [ { "severity": "high|warning|info", "verdict": "likely_violation|needs_review|no_issue_found", "category": "string", "title": "string", "why": "string (explain precisely)", "evidence": "exact quote or visual description", "location": "string", "confidence": number, "suggested_correction": "string", "guideline": "string" } ], "limitations": ["string"] }',
    'Material follows:', '<<<MATERIAL START>>>', unit.text || '(No extracted text; assess attached images/frames.)', '<<<MATERIAL END>>>'
  ].join('\n\n');
}

function extractJson(text) {
  if (!text) return null;
  const t = text.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');
  try { const v = JSON.parse(t); return v && typeof v === 'object' ? v : null; } catch { /* scan object */ }
  const start = t.indexOf('{'); if (start < 0) return null;
  let depth = 0, inStr = false, esc = false;
  for (let i = start; i < t.length; i++) { const ch = t[i]; if (inStr) { if (esc) esc = false; else if (ch === '\\') esc = true; else if (ch === '"') inStr = false; continue; } if (ch === '"') inStr = true; else if (ch === '{') depth++; else if (ch === '}') { depth--; if (depth === 0) { try { return JSON.parse(t.slice(start, i + 1)); } catch { return null; } } } }
  return null;
}

const UA = { 'User-Agent': 'Mozilla/5.0 (compatible; VerityBrandBot/1.0)' };
const YT_HOSTS = new Set(['youtube.com', 'www.youtube.com', 'm.youtube.com', 'music.youtube.com', 'youtu.be']);
const IG_HOSTS = new Set(['instagram.com', 'www.instagram.com', 'm.instagram.com']);
const X_HOSTS = new Set(['x.com', 'www.x.com', 'twitter.com', 'www.twitter.com', 'mobile.twitter.com']);
const IMG_CDN = [/(^|\.)ytimg\.com$/, /(^|\.)cdninstagram\.com$/, /(^|\.)fbcdn\.net$/];

async function resolveLink(raw) {
  let x; try { x = new URL(raw); } catch { throw new AIError(400, 'bad_link', 'Enter a valid public Instagram, YouTube or X link.'); }
  if (x.protocol !== 'https:' || x.username || x.password) throw new AIError(400, 'bad_link', 'Use a full public https:// link without embedded credentials.');
  if (YT_HOSTS.has(x.hostname)) return resolveYouTube(x);
  if (IG_HOSTS.has(x.hostname)) return resolveInstagram(x);
  if (X_HOSTS.has(x.hostname)) return resolveX(x);
  throw new AIError(400, 'bad_link', 'Supported platforms: public Instagram posts/Reels, YouTube videos/Shorts, and X posts.');
}

function decodeHtml(s) {
  return String(s || '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([\da-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));
}
function htmlText(s) {
  return decodeHtml(String(s || '').replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}
async function fetchPublicPage(url) {
  const r = await fetch(url, { headers: { ...UA, Accept: 'text/html,application/xhtml+xml' }, redirect: 'follow', signal: AbortSignal.timeout(9000) });
  if (!r.ok) return { html: '', status: r.status };
  const final = new URL(r.url);
  if (final.protocol !== 'https:') return { html: '', status: 0 };
  return { html: (await r.text()).slice(0, 1_200_000), status: r.status };
}
function metaContent(html, key) {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const patterns = [new RegExp(`<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']*)["'][^>]*>`, 'i'), new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["']${escaped}["'][^>]*>`, 'i')];
  for (const re of patterns) { const m = html.match(re); if (m) return decodeHtml(m[1]); }
  return '';
}

async function imageDataUrl(url) {
  const u = new URL(url); if (u.protocol !== 'https:' || !IMG_CDN.some(re => re.test(u.hostname))) return null;
  const r = await fetch(url, { headers: UA, signal: AbortSignal.timeout(8000) });
  const ct = (r.headers.get('content-type') || '').split(';')[0].trim(); if (!r.ok || !['image/jpeg', 'image/png'].includes(ct)) return null;
  const buf = Buffer.from(await r.arrayBuffer()); if (!buf.length || buf.length > 1_500_000) return null;
  return `data:${ct};base64,${buf.toString('base64')}`;
}

function ytId(x) { let id = ''; if (x.hostname === 'youtu.be') id = x.pathname.slice(1).split('/')[0]; else if (x.searchParams.get('v')) id = x.searchParams.get('v'); else { const m = x.pathname.match(/^\/(?:shorts|embed|live|v)\/([\w-]{6,20})/); id = m ? m[1] : ''; } return /^[\w-]{6,20}$/.test(id) ? id : ''; }

async function resolveYouTube(x) {
  const id = ytId(x);
  if (!id) throw new AIError(400, 'bad_link', 'Could not find a valid YouTube video ID in this URL.');
  const canonical = `https://www.youtube.com/watch?v=${id}`;
  const parts = [], limitations = []; let images = [];
  try {
    const r = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(canonical)}&format=json`, { headers: UA, signal: AbortSignal.timeout(8000) });
    if (r.ok) { const d = await r.json(); parts.push(`Video title: ${d.title || 'Unavailable'}`, `Channel: ${d.author_name || 'Unavailable'}`); }
    else limitations.push(`YouTube oEmbed metadata was unavailable (HTTP ${r.status}); the video may be private, restricted or removed.`);
  } catch { limitations.push('YouTube oEmbed request timed out or was blocked.'); }

  // YouTube Data API is optional; without it, attempt public Open Graph metadata.
  const yk = env('YOUTUBE_API_KEY');
  if (yk) {
    try {
      const r = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${id}&key=${encodeURIComponent(yk)}`, { signal: AbortSignal.timeout(8000) });
      if (r.ok) {
        const d = await r.json(), sn = d?.items?.[0]?.snippet;
        if (sn) { parts.push(`Description:\n${str(sn.description, 5000)}`); if (sn.tags?.length) parts.push(`Tags: ${sn.tags.slice(0, 30).join(', ')}`); }
        else limitations.push('YouTube Data API returned no public snippet for this video.');
      } else limitations.push(`YouTube Data API returned HTTP ${r.status}; check the key, API enablement and quota.`);
    } catch { limitations.push('YouTube Data API request timed out.'); }
  } else {
    try {
      const page = await fetchPublicPage(canonical);
      const desc = metaContent(page.html, 'og:description') || metaContent(page.html, 'description');
      if (desc) parts.push(`Public page description:\n${str(desc, 3500)}`);
      else limitations.push('YouTube description was not available from public page metadata. Add YOUTUBE_API_KEY for more reliable title/description metadata.');
    } catch { limitations.push('YouTube public page metadata could not be fetched.'); }
  }
  try { const img = await imageDataUrl(`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`) || await imageDataUrl(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`); if (img) images = [img]; }
  catch { limitations.push('YouTube thumbnail could not be retrieved.'); }
  limitations.push('A YouTube link provides public metadata and thumbnail only; this does not watch the full video or transcribe its audio. Upload the video file for frame-level review.');
  return { text: parts.join('\n\n'), images, limitations };
}

async function resolveInstagram(x) {
  const m = x.pathname.match(/^\/(?:[\w.]+\/)?(p|reel|reels|tv)\/([\w-]+)/);
  if (!m) throw new AIError(400, 'bad_link', 'Use a public Instagram post, Reel or TV URL. Profile links are not supported.');
  const kind = m[1] === 'reels' ? 'reel' : m[1];
  const canonical = `https://www.instagram.com/${kind}/${m[2]}/`;
  const tok = env('META_OEMBED_TOKEN');
  if (!tok) {
    // Public HTML fallback is best-effort; Instagram frequently serves a login wall.
    try {
      const page = await fetchPublicPage(canonical);
      const title = metaContent(page.html, 'og:title'), desc = metaContent(page.html, 'og:description'), image = metaContent(page.html, 'og:image');
      const images = []; if (image) { try { const data = await imageDataUrl(image); if (data) images.push(data); } catch {} }
      const text = [title ? `Public post title: ${title}` : '', desc ? `Public caption/description metadata: ${desc}` : ''].filter(Boolean).join('\n');
      return { text, images, limitations: ['Instagram public-page fallback is best-effort and may return a login page or incomplete metadata. For fuller embed metadata, configure META_OEMBED_TOKEN. Private posts and some Reels cannot be read from a link.'] };
    } catch {
      return { text: '', images: [], limitations: ['Instagram blocks unauthenticated access to this post. Configure META_OEMBED_TOKEN or provide a screenshot/caption for review.'] };
    }
  }
  try {
    const r = await fetch(`https://graph.facebook.com/instagram_oembed?url=${encodeURIComponent(canonical)}&access_token=${encodeURIComponent(tok)}&omitscript=true`, { signal: AbortSignal.timeout(9000) });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) return { text: '', images: [], limitations: [`Meta oEmbed returned HTTP ${r.status}. Check META_OEMBED_TOKEN and the Meta App's oEmbed permissions; the post may also be private or unavailable.`] };
    const caption = htmlText(d.html || ''); const images = [];
    if (d.thumbnail_url) { try { const img = await imageDataUrl(d.thumbnail_url); if (img) images.push(img); } catch {} }
    return { text: [d.author_name ? `Author: ${d.author_name}` : '', caption ? `Post embed text: ${caption}` : ''].filter(Boolean).join('\n'), images, limitations: ['Instagram oEmbed does not expose every caption, carousel item, Reel frame or audio track. Review only the public embed data returned.'] };
  } catch { return { text: '', images: [], limitations: ['Instagram oEmbed request timed out. Try again or provide a screenshot/caption.'] }; }
}

async function resolveX(x) {
  const m = x.pathname.match(/^\/(?:[^/]+)\/status\/(\d+)/);
  if (!m) throw new AIError(400, 'bad_link', 'Use a direct X post URL such as https://x.com/username/status/123456789. Profile and search links are not supported.');
  const statusUrl = `https://x.com${x.pathname}`;
  const limitations = [];
  // X's public oEmbed endpoint can return the post text for public posts without a user API key.
  try {
    const endpoint = `https://publish.twitter.com/oembed?url=${encodeURIComponent(statusUrl)}&omit_script=true&dnt=true`;
    const r = await fetch(endpoint, { headers: UA, signal: AbortSignal.timeout(9000) });
    const d = await r.json().catch(() => ({}));
    if (r.ok && d.html) {
      const quote = d.html.match(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/i);
      const postText = htmlText(quote ? quote[1] : d.html);
      const author = d.author_name || '';
      return { text: [author ? `Author: ${author}` : '', postText ? `Post text: ${postText}` : ''].filter(Boolean).join('\n'), images: [], limitations: ['X oEmbed provides the public post embed text and author where available; attached media, replies and quoted-post context may be incomplete.'] };
    }
    limitations.push(`X public oEmbed could not retrieve this post (HTTP ${r.status || 'network error'}). It may be private, deleted, restricted or unavailable to embeds.`);
  } catch { limitations.push('X public oEmbed request timed out or was blocked.'); }
  // Best-effort Open Graph fallback, without claiming the full post was read.
  try {
    const page = await fetchPublicPage(statusUrl);
    const title = metaContent(page.html, 'og:title'), desc = metaContent(page.html, 'og:description');
    const text = [title ? `Post title: ${title}` : '', desc ? `Public post metadata: ${desc}` : ''].filter(Boolean).join('\n');
    if (text) return { text, images: [], limitations: [...limitations, 'X page metadata fallback may be incomplete and does not include the full conversation or all attached media.'] };
  } catch { /* preserve the oEmbed limitation */ }
  return { text: '', images: [], limitations: [...limitations, 'No readable public post text was returned. X may require login or block automated access; paste the post text or upload a screenshot for analysis.'] };
}
