import type { ContentType } from 'oa-shared'

export declare const usefulService: {
  add: (contentType: ContentType, id: number) => Promise<Response>
  remove: (contentType: ContentType, id: number) => Promise<Response>
  hasVoted: (contentType: ContentType, id: number) => Promise<boolean>
}
