import { z } from 'zod'

export const nameSearchSchema = z.object({
  query: z.string().min(2, 'Name must be at least 2 characters').max(100),
  location: z.string().optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().min(1).max(50).default(20),
})

export const keywordSearchSchema = z.object({
  query: z.string().min(3, 'Keyword must be at least 3 characters').max(200),
  location: z.string().optional(),
  cursor: z.string().optional(),
  limit: z.coerce.number().min(1).max(50).default(20),
})

export const imageSearchSchema = z.object({
  imageData: z.string().min(1, 'Image data required'),
  location: z.string().optional(),
  limit: z.coerce.number().min(1).max(20).default(10),
})

export type NameSearchInput = z.infer<typeof nameSearchSchema>
export type KeywordSearchInput = z.infer<typeof keywordSearchSchema>
export type ImageSearchInput = z.infer<typeof imageSearchSchema>
