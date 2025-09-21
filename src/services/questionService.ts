import { DBQuestion, Question } from 'oa-shared'
import { getCleanFileName } from 'src/utils/storage'

import type { QuestionFormData } from 'oa-shared'

const upsert = async (id: number | null, question: QuestionFormData) => {
  const body = new FormData()
  body.append('title', question.title)
  body.append('description', question.description)
  body.append('is_draft', question.isDraft ? 'true' : 'false')

  if (question.tags && question.tags.length > 0) {
    for (const tag of question.tags) {
      body.append('tags', tag.toString())
    }
  }

  if (question.category) {
    body.append('category', question.category?.value.toString())
  }

  if (question.images && question.images.length > 0) {
    for (const image of question.images) {
      body.append('images', image.photoData, getCleanFileName(image.name))
    }
  }

  if (question.existingImages && question.existingImages.length > 0) {
    for (const image of question.existingImages) {
      body.append('existingImages', image.id)
    }
  }

  const response =
    id === null
      ? await fetch(`/api/questions`, {
          method: 'POST',
          body,
        })
      : await fetch(`/api/questions/${id}`, {
          method: 'PUT',
          body,
        })

  if (response.status !== 200 && response.status !== 201) {
    if (response.status === 409) {
      throw new Error('That question has already been asked', { cause: 409 })
    }

    throw new Error('Error saving question', { cause: 500 })
  }

  const newQuestion = await response.json()

  return Question.fromDB(new DBQuestion(newQuestion.question), [])
}

export const questionService = {
  upsert,
}
