import { action, makeAutoObservable } from 'mobx'
import type { PlatformTheme } from 'src/themes/types'
import preciousPlasticTheme from 'src/themes/precious-plastic'
import projectKampTheme from 'src/themes/project-kamp'
import { getConfigirationOption } from 'src/config/config'

const themeMap = {
  'precious-plastic': preciousPlasticTheme,
  'project-kamp': projectKampTheme,
}

export class ThemeStore {
  currentTheme: PlatformTheme = themeMap[ localStorage.getItem('platformTheme')|| getConfigirationOption('REACT_APP_PLATFORM_THEME', 'precious-plastic')];

  constructor() {
    makeAutoObservable(this)

    console.log(`Current theme:`, this.currentTheme);
  }

  @action
  public setActiveTheme(themeId: string) {
    if (themeMap[themeId]) {
      this.currentTheme = themeMap[themeId]
    }
  }

  public getExternalNavigationItems():{
    label: string
    url: string
  }[] {
    return this.currentTheme.externalLinks || [];
  }
}
