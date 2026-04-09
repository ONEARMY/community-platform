import type { DBNews, NewsFormData } from 'oa-shared';
import { DBMedia, News, NewsDTO } from 'oa-shared';
import { createFormData } from './formDataHelper';

const upsert = async (id: number | null, form: NewsFormData) => {
  const body = createFormData<NewsDTO>({
    title: form.title,
    body: form.body,
    category: Number(form.category?.value) || null,
    heroImage: form.heroImage ? DBMedia.fromPublicMedia(form.heroImage) : null,
    isDraft: form.isDraft,
    profileBadge: Number(form.profileBadge?.value) || null,
    tags: form.tags || null,
    emailContentReach: Number(form.emailContentReach?.value) || null,
  });

  const response =
    id === null
      ? await fetch(`/api/news`, {
          method: 'POST',
          body,
        })
      : await fetch(`/api/news/${id}`, {
          method: 'PUT',
          body,
        });

  if (response.status !== 200 && response.status !== 201) {
    const errorData = await response.json().catch(() => ({ error: 'Error saving news' }));
    const errorMessage = errorData.error || errorData.message || 'Error saving news';
    throw new Error(errorMessage, { cause: response.status });
  }

  const data: { news: DBNews } = await response.json();
  const news = News.fromDB(data.news, []);

  return news;
};

export const newsService = {
  upsert,
};
