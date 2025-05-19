import { createContext, useEffect, useState } from 'react'
import { commentService } from 'src/services/commentService'

export const MultipleCommentSectionContext = createContext<{
  expandId: number
} | null>(null)

export const MultipleCommentSectionWrapper = ({ children }) => {
  const [sourceId, setSourceId] = useState<number | null>(null)

  useEffect(() => {
    const getSourceId = async () => {
      const sourceId = await commentService.getCommentSourceId(id)

      if (sourceId) {
        setSourceId(sourceId)
      }
    }
    const id = Number(location.hash.replace('#comment:', ''))
    if (id) {
      getSourceId()
    }
  }, [])

  return (
    <MultipleCommentSectionContext.Provider
      value={sourceId ? { expandId: sourceId } : null}
    >
      {children}
    </MultipleCommentSectionContext.Provider>
  )
}
