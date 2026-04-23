export interface WorkItem {
  title: string;
  description: string;
  tags: string[];
  url: string;
  cover: string;
}

export const WORKS_PER_PAGE = 10;

export function getWorksPageSlice(works: WorkItem[], page: number): WorkItem[] {
  const start = (page - 1) * WORKS_PER_PAGE;

  return works.slice(start, start + WORKS_PER_PAGE);
}

export function getWorksPaginationPath(page: number): string {
  return page <= 1 ? '/works' : `/works/page/${page}`;
}

export function buildWorksPagination(totalItems: number, currentPage: number) {
  const totalPages = Math.max(1, Math.ceil(totalItems / WORKS_PER_PAGE));
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), totalPages);

  return {
    currentPage: safeCurrentPage,
    totalPages,
    previousPage: safeCurrentPage > 1 ? safeCurrentPage - 1 : undefined,
    nextPage: safeCurrentPage < totalPages ? safeCurrentPage + 1 : undefined,
    pages: Array.from({ length: totalPages }, (_, index) => index + 1),
    lastPage: totalPages,
  };
}
