import { describe, expect, test } from 'vitest';
import {
  WORKS_PER_PAGE,
  buildWorksPagination,
  getWorksPageSlice,
  getWorksPaginationPath,
} from './works';

const works = Array.from({ length: 23 }, (_, index) => ({
  title: `Work ${index + 1}`,
  description: `Description ${index + 1}`,
  tags: ['Demo'],
  url: `https://example.com/${index + 1}`,
  cover: `/media/works/${index + 1}.png`,
}));

describe('works utilities', () => {
  test('limits each works page to ten items', () => {
    expect(WORKS_PER_PAGE).toBe(10);
    expect(getWorksPageSlice(works, 1)).toHaveLength(10);
    expect(getWorksPageSlice(works, 2)).toHaveLength(10);
    expect(getWorksPageSlice(works, 3)).toHaveLength(3);
  });

  test('builds first-page and numbered-page paths', () => {
    expect(getWorksPaginationPath(1)).toBe('/works');
    expect(getWorksPaginationPath(2)).toBe('/works/page/2');
    expect(getWorksPaginationPath(9)).toBe('/works/page/9');
  });

  test('builds numbered pagination metadata with last-page access', () => {
    expect(buildWorksPagination(works.length, 1)).toEqual({
      currentPage: 1,
      totalPages: 3,
      previousPage: undefined,
      nextPage: 2,
      pages: [1, 2, 3],
      lastPage: 3,
    });

    expect(buildWorksPagination(works.length, 2)).toEqual({
      currentPage: 2,
      totalPages: 3,
      previousPage: 1,
      nextPage: 3,
      pages: [1, 2, 3],
      lastPage: 3,
    });
  });
});
