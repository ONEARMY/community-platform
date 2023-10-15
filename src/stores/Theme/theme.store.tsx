import { action, makeAutoObservable } from 'mobx'
import type { PlatformTheme } from 'oa-themes'
import {
  preciousPlasticTheme,
  projectKampTheme,
  fixingFashionTheme,
} from 'oa-themes'
import { getConfigurationOption } from 'src/config/config'
import { logger } from '../../logger'

const themeMap = {
  'precious-plastic': preciousPlasticTheme,
  'project-kamp': projectKampTheme,
  'fixing-fashion': fixingFashionTheme,
}

export class ThemeStore {
  currentTheme: PlatformTheme =
    themeMap[
      localStorage.getItem('platformTheme') ||
        getConfigurationOption('REACT_APP_PLATFORM_THEME', 'precious-plastic')
    ]

  constructor() {
    makeAutoObservable(this)

    logger.debug(`Current theme:`, this.currentTheme.siteName)
  }

  @action
  public setActiveTheme(themeId: string) {
    if (themeMap[themeId]) {
      this.currentTheme = themeMap[themeId]
    }
  }

  public getExternalNavigationItems(): {
    label: string
    url: string
  }[] {
    return this.currentTheme.externalLinks || []
  }
}
