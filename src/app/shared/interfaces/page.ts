export interface Pageable<T> {
  content: T[];
  page: Page;
}
interface Page{
    totalPages: number,
    totalElements: number,
    number: number,
    size: number
}