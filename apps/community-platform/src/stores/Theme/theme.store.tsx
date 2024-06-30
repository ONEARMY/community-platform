import {
  fixingFashionTheme,
  preciousPlasticTheme,
  projectKampTheme,
} from '@onearmy.apps/themes'
import { action, makeObservable, observable } from 'mobx'

import { getConfigurationOption } from '../../config/config'
import { logger } from '../../logger'

import type { PlatformTheme } from '@onearmy.apps/themes'

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
    makeObservable(this, {
      currentTheme: observable,
      setActiveTheme: action,
    })

    logger.debug(`Current theme:`, this.currentTheme.siteName)
  }

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
