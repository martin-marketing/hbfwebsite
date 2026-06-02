import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const SITE_URL = "https://heidiblondin.com";

const STATIC_PAGES = [
  "/",
  "/blog/",
  "/charitable-giving/",
  "/contact/",
  "/financial-services/",
  "/financial-services/combination-insurance/",
  "/financial-services/critical-illness-insurance/",
  "/financial-services/disability-insurance/",
  "/financial-services/employee-group-benefits-plans/",
  "/financial-services/estate-planning/",
  "/financial-services/first-home-savings-account/",
  "/financial-services/group-savings-plans/",
  "/financial-services/individual-health-dental-plans/",
  "/financial-services/insurance-quote/",
  "/financial-services/insurance/",
  "/financial-services/investments/",
  "/financial-services/life-insurance/",
  "/financial-services/registered-education-savings-plans/",
  "/financial-services/registered-retirement-savings-plans/",
  "/financial-services/segregated-fund/",
  "/financial-services/tax-free-savings-accounts/",
  "/financial-services/travel-insurance/",
  "/privacy-policy/",
  "/resources/",
  "/retirement-income-planning/",
  "/testimonials/",
  "/videos/",
  "/angela/",
  "/heidi/",
  "/jack/",
  "/joanne/",
  "/website-compliance/",
];

Deno.serve(async (_req: Request) => {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: posts, error } = await supabase
      .from("posts")
      .select("slug, updated_at")
      .eq("is_published", true)
      .eq("noindex", false)
      .order("published_at", { ascending: false });

    if (error) throw error;

    const today = new Date().toISOString().split("T")[0];

    const staticUrls = STATIC_PAGES.map(
      (path) =>
        `  <url><loc>${SITE_URL}${path}</loc><lastmod>${today}</lastmod></url>`
    );

    const blogUrls = (posts ?? []).map(
      (post) =>
        `  <url><loc>${SITE_URL}/blog/${post.slug}/</loc><lastmod>${
          post.updated_at.split("T")[0]
        }</lastmod></url>`
    );

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticUrls, ...blogUrls].join("\n")}
</urlset>`;

    // Create bucket if it doesn't exist yet
    await supabase.storage
      .createBucket("sitemap", { public: true })
      .catch(() => {});

    const encoder = new TextEncoder();
    const { error: uploadError } = await supabase.storage
      .from("sitemap")
      .upload("sitemap.xml", encoder.encode(xml), {
        upsert: true,
        contentType: "application/xml; charset=utf-8",
      });

    if (uploadError) throw uploadError;

    return new Response(
      JSON.stringify({
        ok: true,
        urlCount: staticUrls.length + blogUrls.length,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
