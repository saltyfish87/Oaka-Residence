/**
 * Static SEO layer for a one-page project site (added 2026-09-25). Runs after `vite build`:
 *   1. dist/index.html  — real share image, hreflang, missing schema, and a readable English body
 *      inside #root (facts, highlights, FAQ, agent) that search engines and AI crawlers can read;
 *      the React app replaces it when it mounts.
 *   2. dist/zh/index.html — a standalone Simplified Chinese page (no app script) with the same facts.
 *   3. dist/sitemap.xml   — both URLs with today's date; llms.txt gets a Chinese line.
 * Everything comes from scripts/seo-static.config.mjs; no facts are invented here.
 * Run: node scripts/seo-static.mjs
 */
import fs from "node:fs";
import path from "node:path";

const cwd = process.cwd();
const cfg = (await import(path.join(cwd, "scripts", "seo-static.config.mjs"))).default;
const distPath = path.join(cwd, "dist");
const indexPath = path.join(distPath, "index.html");
if (!fs.existsSync(indexPath)) { console.error("dist/index.html missing – run vite build first"); process.exit(1); }
let html = fs.readFileSync(indexPath, "utf-8");
if (!/<div id="root"><\/div>/.test(html)) { console.error("dist/index.html has no empty #root – already processed?"); process.exit(1); }

const esc = (v) => String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const today = new Date().toISOString().slice(0, 10);
const SITE = cfg.siteUrl.replace(/\/$/, "");
const AGENT = {
  name: "Yee Woei Shyan", ren: "REN 46305", company: "IQI Realty Sdn Bhd", phone: "+60108278932", phoneDisplay: "+60 10-827 8932", email: "shyanyeews@gmail.com",
  sameAs: ["https://maps.google.com/?cid=3195643739952877602", "https://www.youtube.com/@shyanyee", "https://www.instagram.com/shyanyee/", "https://www.facebook.com/shyanyeeconsultant/", "https://www.shyanyee.com/", "https://www.propertyportal.my/"]
};
const ABOUT = {
  en: `${AGENT.name} (${AGENT.ren}) is a licensed real estate negotiator with ${AGENT.company}, marketing new launches in Kuala Lumpur, Selangor and Johor Bahru. Facts on this page come from the developer's records; prices are the developer's indicative prices and change without notice. This is an independent marketing site, not the developer's website. WhatsApp ${AGENT.phoneDisplay} or email ${AGENT.email} for the current price list, floor plans and a viewing.`,
  zh: `${AGENT.name}（${AGENT.ren}）是 ${AGENT.company} 的持牌房产经纪，负责吉隆坡、雪兰莪和新山的新楼盘销售。本页事实来自发展商记录；价格为发展商参考价，可能随时调整。这是独立的营销网站，不是发展商官网。要最新价格表、户型图或安排看房，请 WhatsApp ${AGENT.phoneDisplay} 或电邮 ${AGENT.email}。`
};
const L = (o, lang) => (o && typeof o === "object" && !Array.isArray(o) && (lang in o) ? o[lang] : o);

// FAQ: from config, else from the FAQPage already in index.html
function existingFaq() {
  const out = [];
  for (const m of html.matchAll(/<script[^>]*ld\+json[^>]*>([\s\S]*?)<\/script>/g)) {
    try { const j = JSON.parse(m[1]); const items = j["@graph"] || (Array.isArray(j) ? j : [j]);
      for (const it of items) if (it["@type"] === "FAQPage") for (const q of it.mainEntity || []) out.push({ q: q.name, a: q.acceptedAnswer?.text || "" }); } catch {}
  }
  return out;
}
const faqs = { en: cfg.faqs?.en?.length ? cfg.faqs.en : existingFaq(), zh: cfg.faqs?.zh || [] };
const existingTypes = new Set([...html.matchAll(/"@type":\s*"([A-Za-z]+)"/g)].map((m) => m[1]));

// ---- body -----------------------------------------------------------------------------------
function body(lang) {
  const t = (en, zh) => (lang === "zh" ? zh : en);
  const rows = (cfg.facts || []).map((f) => `<tr><th style="text-align:left;padding:8px;border-bottom:1px solid #e2e8f0;white-space:nowrap">${esc(L(f.label, lang))}</th><td style="padding:8px;border-bottom:1px solid #e2e8f0">${esc(L(f.value, lang))}</td></tr>`).join("");
  const layouts = (cfg.layouts || []).length ? `<h2>${t("Unit types", "户型")}</h2><table style="border-collapse:collapse;width:100%;font-size:15px"><thead><tr><th style="text-align:left;padding:8px;border-bottom:2px solid #e2e8f0">${t("Type", "类型")}</th><th style="text-align:left;padding:8px;border-bottom:2px solid #e2e8f0">${t("Built-up", "面积")}</th><th style="text-align:left;padding:8px;border-bottom:2px solid #e2e8f0">${t("Bedrooms", "房")}</th><th style="text-align:left;padding:8px;border-bottom:2px solid #e2e8f0">${t("Bathrooms", "浴")}</th></tr></thead><tbody>${cfg.layouts.map((l) => `<tr><td style="padding:8px;border-bottom:1px solid #e2e8f0">${esc(l.type)}</td><td style="padding:8px;border-bottom:1px solid #e2e8f0">${esc(l.sqft)} sq ft</td><td style="padding:8px;border-bottom:1px solid #e2e8f0">${esc(l.beds)}</td><td style="padding:8px;border-bottom:1px solid #e2e8f0">${esc(l.baths)}</td></tr>`).join("")}</tbody></table>` : "";
  const fq = faqs[lang] || [];
  return `<main style="max-width:960px;margin:0 auto;padding:32px 20px;font-family:system-ui,-apple-system,sans-serif;color:#0f172a;line-height:1.7">
  <p style="font-size:13px;color:#64748b">${esc(L(cfg.tagline, lang) || "")}</p>
  <h1 style="font-size:32px;line-height:1.2">${esc(L(cfg.title, lang))}</h1>
  ${cfg.ogImage ? `<img src="${esc(cfg.ogImage)}" alt="${esc(L(cfg.heroAlt, lang) || L(cfg.title, lang))}" width="960" height="540" style="width:100%;height:auto;border-radius:12px;margin:12px 0" />` : ""}
  ${(L(cfg.summary, lang) || []).map((p) => `<p>${esc(p)}</p>`).join("")}
  <h2>${t("Key facts", "基本资料")}</h2><table style="border-collapse:collapse;width:100%;font-size:15px"><tbody>${rows}</tbody></table>
  <p style="font-size:13px;color:#64748b">${esc(t(`Source: developer records. Information as at ${cfg.updated || today}.`, `来源：发展商记录。资料截至 ${cfg.updatedZh || cfg.updated || today}。`))}</p>
  ${(L(cfg.highlights, lang) || []).length ? `<h2>${t("Highlights", "重点")}</h2><ul>${L(cfg.highlights, lang).map((h) => `<li>${esc(h)}</li>`).join("")}</ul>` : ""}
  ${layouts}
  ${fq.length ? `<h2>${t("Frequently asked questions", "常见问题")}</h2>${fq.map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`).join("")}` : ""}
  <h2>${t("About the agent", "关于代理")}</h2><p>${esc(ABOUT[lang])}</p>
  <p><a href="https://wa.me/60108278932" style="color:#047857;font-weight:600">WhatsApp ${AGENT.phoneDisplay}</a> · <a href="mailto:${AGENT.email}">${AGENT.email}</a></p>
  <p style="font-size:13px;color:#64748b">${cfg.portalUrl ? `${t("Also listed on", "同时刊登于")} <a href="${esc(cfg.portalUrl)}">propertyportal.my</a> · ` : ""}<a href="https://www.propertyportal.my/">${t("All Kuala Lumpur new launches", "全部吉隆坡新楼盘")}</a>${lang === "zh" ? ` · <a href="${SITE}/">English</a>` : ` · <a href="${SITE}/zh">中文</a>`}</p>
</main>`;
}

// ---- schema ---------------------------------------------------------------------------------
function graph(lang) {
  const url = lang === "zh" ? `${SITE}/zh` : `${SITE}/`;
  const g = [];
  if (!existingTypes.has("RealEstateAgent") || lang === "zh") g.push({ "@type": "RealEstateAgent", "@id": `${SITE}/#agent`, "name": AGENT.name, "identifier": AGENT.ren, "telephone": AGENT.phone, "email": AGENT.email, "url": `${SITE}/`, "parentOrganization": { "@type": "Organization", "name": AGENT.company }, "sameAs": AGENT.sameAs });
  if (!existingTypes.has("WebSite") || lang === "zh") g.push({ "@type": "WebSite", "@id": `${SITE}/#website`, "url": `${SITE}/`, "name": L(cfg.title, "en"), "inLanguage": ["en", "zh-CN"] });
  if (!existingTypes.has("BreadcrumbList") || lang === "zh") g.push({ "@type": "BreadcrumbList", "itemListElement": [{ "@type": "ListItem", "position": 1, "name": lang === "zh" ? "首页" : "Home", "item": url }] });
  if (cfg.schema && (!existingTypes.has("ApartmentComplex") || lang === "zh")) g.push({ "@type": "ApartmentComplex", "@id": `${url}#complex`, "name": L(cfg.title, lang), "url": url, "image": cfg.ogImage, "description": (L(cfg.summary, lang) || [])[0], "address": cfg.schema.address, ...(cfg.schema.geo ? { "geo": { "@type": "GeoCoordinates", ...cfg.schema.geo } } : {}), ...(cfg.schema.units ? { "numberOfAccommodationUnits": cfg.schema.units } : {}), ...(cfg.schema.floors ? { "numberOfFloors": cfg.schema.floors } : {}) });
  if (lang === "zh" && faqs.zh.length) g.push({ "@type": "FAQPage", "@id": `${url}#faq`, "mainEntity": faqs.zh.map((f) => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } })) });
  if (lang === "zh") g.push({ "@type": "WebPage", "@id": url, "url": url, "name": L(cfg.title, "zh"), "inLanguage": "zh-CN", "isPartOf": { "@id": `${SITE}/#website` }, "about": { "@id": `${url}#complex` } });
  return g;
}
const ld = (lang) => `<script id="seo-static-graph" type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@graph": graph(lang) }).replace(/<\//g, "<\\/")}</script>`;
const hreflang = `    <link rel="alternate" hreflang="en" href="${SITE}/" />\n    <link rel="alternate" hreflang="zh-CN" href="${SITE}/zh" />\n    <link rel="alternate" hreflang="x-default" href="${SITE}/" />\n`;

// ---- 1. English page ------------------------------------------------------------------------
let out = html;
out = out.replace(/\s*<link rel="alternate" hreflang="[^"]*" href="[^"]*" \/>/g, "");
if (cfg.ogImage) {
  const setMeta = (re, tag) => { out = re.test(out) ? out.replace(re, tag) : out.replace("</head>", `    ${tag}\n  </head>`); };
  setMeta(/<meta property="og:image" content="[^"]*"\s*\/?>/, `<meta property="og:image" content="${esc(cfg.ogImage)}" />`);
  setMeta(/<meta (?:property|name)="twitter:image" content="[^"]*"\s*\/?>/, `<meta name="twitter:image" content="${esc(cfg.ogImage)}" />`);
  if (!/twitter:card/.test(out)) out = out.replace("</head>", `    <meta name="twitter:card" content="summary_large_image" />\n  </head>`);
}
out = out.replace(/\s*<meta name="google-site-verification" content="google-site-verification-placeholder-code"\s*\/?>/, "");
if (cfg.gsc && !out.includes(`content="${cfg.gsc}"`)) out = out.replace("</head>", `    <meta name="google-site-verification" content="${cfg.gsc}" />\n  </head>`);
out = out.replace("</head>", `${hreflang}    ${ld("en")}\n  </head>`);
out = out.replace('<div id="root"></div>', `<div id="root">${body("en")}</div>`);
fs.writeFileSync(indexPath, out, "utf-8");

// ---- 2. Chinese page (standalone) --------------------------------------------------------------
const zhTitle = L(cfg.title, "zh"); const zhDesc = L(cfg.description, "zh");
const iconTags = [...html.matchAll(/<link rel="(?:icon|alternate icon|apple-touch-icon|shortcut icon)"[^>]*>/g)].map((m) => `    ${m[0]}`).join("\n");
const zh = `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(zhTitle)}</title>
    <meta name="description" content="${esc(zhDesc)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${SITE}/zh" />
${hreflang}    <meta property="og:type" content="website" />
    <meta property="og:url" content="${SITE}/zh" />
    <meta property="og:title" content="${esc(zhTitle)}" />
    <meta property="og:description" content="${esc(zhDesc)}" />
    <meta property="og:locale" content="zh_CN" />
    ${cfg.ogImage ? `<meta property="og:image" content="${esc(cfg.ogImage)}" />\n    <meta name="twitter:card" content="summary_large_image" />\n    <meta name="twitter:image" content="${esc(cfg.ogImage)}" />` : ""}
${iconTags}
    ${ld("zh")}
    <style>body{margin:0;background:#fff}a{color:#047857}h2{margin-top:28px;font-size:22px}h3{font-size:17px;margin:18px 0 4px}nav{font-size:14px;padding:12px 20px;border-bottom:1px solid #e2e8f0}</style>
  </head>
  <body>
    <nav><a href="${SITE}/">English</a> · <strong>中文</strong> · <a href="https://wa.me/60108278932">WhatsApp ${AGENT.phoneDisplay}</a></nav>
    ${body("zh")}
  </body>
</html>`;
fs.mkdirSync(path.join(distPath, "zh"), { recursive: true });
fs.writeFileSync(path.join(distPath, "zh", "index.html"), zh, "utf-8");

// ---- 3. sitemap + llms.txt ---------------------------------------------------------------------
const extra = (cfg.extraUrls || []).map((u) => `${SITE}${u}`);
fs.writeFileSync(path.join(distPath, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
  [`${SITE}/`, `${SITE}/zh`, ...extra].map((u) => `  <url><loc>${u}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>${u.endsWith("/zh") ? "0.8" : "1.0"}</priority></url>`).join("\n") + `\n</urlset>\n`, "utf-8");
const llms = path.join(distPath, "llms.txt");
if (fs.existsSync(llms)) fs.appendFileSync(llms, `\n## 中文\n${esc(zhTitle)}：${zhDesc}\n中文版：${SITE}/zh\n`, "utf-8");
console.log(`✅ [seo-static] ${cfg.siteUrl}: English body (${(cfg.facts || []).length} facts, ${faqs.en.length} FAQ), /zh page (${faqs.zh.length} FAQ), sitemap, share image ${cfg.ogImage ? "set" : "unchanged"}`);
