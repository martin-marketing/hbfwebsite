// Articles awaiting Investia compliance approval. They are unpublished in
// Supabase (and the anon key can't read unpublished rows), so the staging
// copy is built from the repo HTML in `blog articles/` instead.
//
// Pages render at /preview/{slug}/. vercel.json redirects /preview/* to
// /blog/ on heidiblondin.com, so they only open on hbfwebsite.vercel.app.
//
// Once compliance approves: set is_published = true in Supabase, remove the
// entry here, and redeploy.
export interface PreviewPost {
  slug: string;
  title: string;
  author: string;
  tags: string[];
  meta_desc: string;
  published_at: string;
}

export const previews: PreviewPost[] = [
  {
    slug: 'cpp-at-60-65-or-70',
    title: 'CPP at 60, 65 or 70: How to Decide When to Start',
    author: 'Heidi Blondin',
    tags: ['CPP', 'Retirement Planning', 'Retirement Income', 'Retirement Transition Series'],
    meta_desc: 'Should you start CPP at 60, 65 or 70? See what each start age pays, why it matters most without a pension, and what to weigh before you apply.',
    published_at: '2026-09-19T14:30:00+00:00',
  },
  {
    slug: 'replacing-your-paycheque-retirement-income',
    title: 'Replacing Your Paycheque: Where Retirement Income Comes From',
    author: 'Heidi Blondin',
    tags: ['Retirement Planning', 'Retirement Income', 'CPP', 'OAS', 'Retirement Transition Series'],
    meta_desc: 'In retirement, one paycheque becomes several deposits. See where your income will come from, what happens when it falls short, and how to close the gap.',
    published_at: '2026-11-11T21:05:22.376+00:00',
  },
];
