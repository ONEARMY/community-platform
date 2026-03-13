import type { QuestionDTO, QuestionFormData } from 'oa-shared';
import { DBMedia, DBQuestion, Question } from 'oa-shared';
import { createFormData } from './formDataHelper';

const upsert = async (id: number | null, question: QuestionFormData) => {
  const body = createFormData<QuestionDTO>({
    title: question.title,
    description: question.description,
    category: Number(question.category?.value) || null,
    images: question.images?.length ? question.images.map(DBMedia.fromPublicMedia) : null,
    isDraft: question.isDraft,
    tags: question.tags,
  });

  const response =
    id === null
      ? await fetch(`/api/questions`, {
          method: 'POST',
          body,
        })
      : await fetch(`/api/questions/${id}`, {
          method: 'PUT',
          body,
        });

  if (response.status !== 200 && response.status !== 201) {
    if (response.status === 409) {
      throw new Error('That question has already been asked', { cause: 409 });
    }

    throw new Error('Error saving question', { cause: 500 });
  }

  const newQuestion = await response.json();

  return Question.fromDB(new DBQuestion(newQuestion.question), []);
};

export const questionService = {
  upsert,
};
