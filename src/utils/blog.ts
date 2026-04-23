import type { CollectionEntry } from 'astro:content';

export type BlogEntry = CollectionEntry<'blog'>;

export function sortBlogPosts(posts: BlogEntry[]): BlogEntry[] {
  return [...posts].sort(
    (left, right) => right.data.date.getTime() - left.data.date.getTime(),
  );
}

export function formatBlogDate(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}.${month}.${day}`;
}

export function getAdjacentPosts(posts: BlogEntry[], slug: string) {
  const index = posts.findIndex((post) => post.id === slug);

  if (index === -1) {
    return {
      previous: undefined,
      next: undefined,
    };
  }

  return {
    previous: posts[index + 1],
    next: posts[index - 1],
  };
}
