import { useEffect, useState } from 'react'
import { Link } from '@remix-run/react'
import { Banner } from 'oa-components'
import { bannerService } from 'src/pages/common/banner.service'
import { Flex } from 'theme-ui'

import type { Banner as BannerModel } from 'oa-shared'

export const AlertBanner = () => {
  const [banner, setBanner] = useState<BannerModel | null>(null)

  useEffect(() => {
    const fetchBanner = async () => {
      const banner = await bannerService.getBanner()
      setBanner(banner)
    }

    fetchBanner()
  }, [])

  if (!banner?.text) {
    return null
  }

  const bannerContent = (
    <Flex>
      <Banner
        sx={{ backgroundColor: 'softblue', color: 'black', cursor: 'hand' }}
      >
        {banner.text}
      </Banner>
    </Flex>
  )

  if (banner.url) {
    return (
      <Link to={banner.url} target="_blank">
        {bannerContent}
      </Link>
    )
  }

  return bannerContent
}
