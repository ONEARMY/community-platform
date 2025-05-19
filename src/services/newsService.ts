import { News } from 'oa-shared'

import type { DBNews, NewsFormData } from 'oa-shared'

const upsert = async (id: number | null, form: NewsFormData) => {
  const { category, tags, title } = form
  const body = new FormData()
  body.append('title', title)
  body.append('body', form.body)

  if (tags && tags.length > 0) {
    for (const tag of tags) {
      body.append('tags', tag.toString())
    }
  }

  if (category) {
    body.append('category', category?.value.toString())
  }

  if (form.heroImage) {
    body.append('heroImage', form.heroImage.photoData, form.heroImage.name)
  }

  if (form.existingHeroImage) {
    body.append('existingHeroImage', form.existingHeroImage.id)
  }

  const response =
    id === null
      ? await fetch(`/api/news`, {
          method: 'POST',
          body,
        })
      : await fetch(`/api/news/${id}`, {
          method: 'PUT',
          body,
        })

  if (response.status !== 200 && response.status !== 201) {
    if (response.status === 409) {
      throw new Error('This news has already been published', { cause: 409 })
    }

    throw new Error('Error saving news', { cause: 500 })
  }

  const data: { news: DBNews } = await response.json()
  const news = News.fromDB(data.news, [])

  return news
}

export const newsService = {
  upsert,
}
