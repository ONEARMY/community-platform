import { News } from 'oa-shared'

import type { DBNews, NewsFormData } from 'oa-shared'

const upsert = async (id: number | null, form: NewsFormData) => {
  const { category, profileBadge, tags, title } = form
  const body = new FormData()
  body.append('title', title)
  body.append('body', form.body)
  body.append('is_draft', form.isDraft ? 'true' : 'false')

  if (tags && tags.length > 0) {
    for (const tag of tags) {
      body.append('tags', tag.toString())
    }
  }

  if (profileBadge) {
    body.append('profileBadge', profileBadge.value.toString())
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
    throw new Error(`Error saving news: ${response.statusText}`, { cause: 500 })
  }

  const data: { news: DBNews } = await response.json()
  const news = News.fromDB(data.news, [])

  return news
}

export const newsService = {
  upsert,
}
