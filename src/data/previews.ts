// Articles awaiting Investia compliance approval. They are unpublished in
// Supabase (and the anon key can't read unpublished rows), so the staging
// copy is built from the repo HTML in `blog articles/` instead.
//
// Pages render at /preview/{slug}/, listed at /preview/. vercel.json redirects /preview/* to
// /blog/ on heidiblondin.com, so they only open on hbfwebsite.vercel.app.
//
// Once compliance approves: set is_published = true in Supabase, remove the
// entry here, and redeploy.
export interface PreviewPost {
  slug: string;
  title: string;
  author: string;
  excerpt: string;
  category: string;
  cover_image: string;
  tags: string[];
  meta_desc: string;
  published_at: string;
}

export const previews: PreviewPost[] = [];
