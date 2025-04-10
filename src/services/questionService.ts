import { DBQuestion, Question } from 'oa-shared'

import type { QuestionFormData } from 'oa-shared'

const upsert = async (id: number | null, question: QuestionFormData) => {
  const data = new FormData()
  data.append('title', question.title)
  data.append('description', question.description)

  if (question.tags && question.tags.length > 0) {
    for (const tag of question.tags) {
      data.append('tags', tag.toString())
    }
  }

  if (question.category) {
    data.append('category', question.category?.value.toString())
  }

  if (question.images && question.images.length > 0) {
    for (const image of question.images) {
      data.append('images', image.photoData, image.name)
    }
  }

  if (question.existingImages && question.existingImages.length > 0) {
    for (const image of question.existingImages) {
      data.append('existingImages', image.id)
    }
  }

  const response =
    id === null
      ? await fetch(`/api/questions`, {
          method: 'POST',
          body: data,
        })
      : await fetch(`/api/questions/${id}`, {
          method: 'PUT',
          body: data,
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
