export type SearchType = 'name' | 'image' | 'keyword'

export interface SearchRequest {
  type: SearchType
  query: string
  imageData?: string
  location?: string
  cursor?: string
  limit?: number
}

export interface SearchResult {
  postId: number
  preview: string
  subjectName?: string
  location?: string
  matchScore: number
  createdAt: string
  overlapCount: number
}

export interface SearchResponse {
  results: SearchResult[]
  totalCount: number
  hasMore: boolean
  cursor?: string
}

export interface ImageSearchResult extends SearchResult {
  matchConfidence: number
  imageUrl?: string
}

export interface ImageSearchResponse {
  results: ImageSearchResult[]
  totalCount: number
}
