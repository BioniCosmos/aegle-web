export interface Pagination<T> {
  items: T[]
  currentPage: number
  pageSize: number
  totalPages: number
  hasPrevious: boolean
  hasNext: boolean
  previousPage: number
  nextPage: number
}
