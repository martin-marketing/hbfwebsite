import { supabase } from './supabase';

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string;
  author: string;
  category: string | null;
  tags: string[] | null;
  cover_image: string | null;
  meta_title: string | null;
  meta_desc: string | null;
  published_at: string;
  updated_at: string;
  is_published: boolean;
  noindex: boolean;
}

export async function getAllPosts(): Promise<Post[]> {
  if (!supabase) {
    if (import.meta.env.PROD) {
      throw new Error(
        'getAllPosts: Supabase client is not configured. Check that SUPABASE_URL and SUPABASE_ANON_KEY (or equivalent env vars) are set for this build.'
      );
    }
    console.warn('getAllPosts: Supabase client is not configured; returning empty list (dev mode).');
    return [];
  }
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  if (error) {
    if (import.meta.env.PROD) {
      throw new Error(`getAllPosts: failed to fetch posts from Supabase: ${error.message}`);
    }
    console.error('Error fetching posts:', error);
    return [];
  }
  return data ?? [];
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!supabase) {
    if (import.meta.env.PROD) {
      throw new Error(
        'getPostBySlug: Supabase client is not configured. Check that SUPABASE_URL and SUPABASE_ANON_KEY (or equivalent env vars) are set for this build.'
      );
    }
    console.warn('getPostBySlug: Supabase client is not configured; returning null (dev mode).');
    return null;
  }
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error) {
    if (import.meta.env.PROD) {
      throw new Error(`getPostBySlug: failed to fetch post "${slug}" from Supabase: ${error.message}`);
    }
    console.error('Error fetching post:', error);
    return null;
  }
  return data;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
