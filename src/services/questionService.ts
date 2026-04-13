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
    const errorData = await response.json().catch(() => ({ error: 'Error saving question' }));
    const errorMessage = errorData.error || errorData.message || 'Error saving question';
    throw new Error(errorMessage, { cause: response.status });
  }

  const newQuestion = await response.json();

  return Question.fromDB(new DBQuestion(newQuestion.question), []);
};

const deleteQuestion = async (id: number) => {
  const response = await fetch(`/api/questions/${id}`, {
    method: 'DELETE',
  });

  if (response.status !== 200 && response.status !== 201) {
    const errorData = await response.json().catch(() => ({ error: 'Error deleting question' }));
    const errorMessage = errorData.error || 'Error deleting question';
    throw new Error(errorMessage, { cause: response.status });
  }
};

export const questionService = {
  deleteQuestion,
  upsert,
};
