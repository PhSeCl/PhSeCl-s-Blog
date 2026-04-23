import { describe, expect, test } from 'vitest';
import { formatBlogDate, getAdjacentPosts, sortBlogPosts, type BlogEntry } from './blog';

function createPost(id: string, isoDate: string): BlogEntry {
  return {
    id,
    slug: id,
    body: '',
    collection: 'blog',
    data: {
      title: id,
      description: `${id} description`,
      date: new Date(isoDate),
      tags: [id],
      draft: false,
    },
  } as BlogEntry;
}

describe('blog utilities', () => {
  test('sorts posts by date descending', () => {
    const posts = [
      createPost('older', '2025-01-01'),
      createPost('newest', '2025-03-01'),
      createPost('middle', '2025-02-01'),
    ];

    expect(sortBlogPosts(posts).map((post) => post.id)).toEqual([
      'newest',
      'middle',
      'older',
    ]);
  });

  test('formats dates as YYYY.MM.DD', () => {
    expect(formatBlogDate(new Date('2025-04-18T00:00:00Z'))).toBe('2025.04.18');
  });

  test('finds adjacent posts in sorted order', () => {
    const posts = sortBlogPosts([
      createPost('older', '2025-01-01'),
      createPost('newest', '2025-03-01'),
      createPost('middle', '2025-02-01'),
    ]);

    const adjacent = getAdjacentPosts(posts, 'middle');

    expect(adjacent.previous?.id).toBe('older');
    expect(adjacent.next?.id).toBe('newest');
  });
});
