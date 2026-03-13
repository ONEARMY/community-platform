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
    throw new Error(`Error saving news: ${response.statusText}`, { cause: 500 });
  }

  const data: { news: DBNews } = await response.json();
  const news = News.fromDB(data.news, []);

  return news;
};

export const newsService = {
  upsert,
};
