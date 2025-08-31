import type { Banner } from 'oa-shared'

const getBanner = async () => {
  try {
    const response = await fetch('/api/banner')
    return (await response.json()) as Banner
  } catch (error) {
    console.error({ error })
    return null
  }
}

export const bannerService = {
  getBanner,
}
