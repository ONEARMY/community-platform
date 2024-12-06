import { MODULE } from 'src/modules'

interface IPageNavigation {
  module: MODULE
  path: string
  title: string
}

const QuestionModule: IPageNavigation = {
  module: MODULE.QUESTION,
  path: '/questions',
  title: 'Questions',
}

const ResearchModule: IPageNavigation = {
  module: MODULE.RESEARCH,
  path: '/research',
  title: 'Research',
}

const howTo: IPageNavigation = {
  module: MODULE.HOWTO,
  path: '/how-to',
  title: 'Library',
}
const settings: IPageNavigation = {
  module: MODULE.CORE,
  path: '/settings',
  title: 'Settings',
}
const academy: IPageNavigation = {
  module: MODULE.ACADEMY,
  path: '/academy',
  title: 'Academy',
}

const maps: IPageNavigation = {
  module: MODULE.MAP,
  path: '/map',
  title: 'Map',
}

export const getAvailablePageList = (
  supportedModules: MODULE[],
): IPageNavigation[] => {
  return COMMUNITY_PAGES.filter((pageItem) =>
    supportedModules.includes(pageItem.module),
  )
}

export const COMMUNITY_PAGES: IPageNavigation[] = [
  howTo,
  maps,
  academy,
  ResearchModule,
  QuestionModule,
]

/** Additional pages to show in signed-in profile dropdown */
export const COMMUNITY_PAGES_PROFILE: IPageNavigation[] = [settings]
