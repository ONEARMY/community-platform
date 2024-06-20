import {action, autorun, computed, makeObservable, observable, runInAction} from 'mobx'
import {
  fixingFashionTheme,
  preciousPlasticTheme,
  projectKampTheme,
} from 'oa-themes'
import { getConfigurationOption } from 'src/config/config'

import { logger } from '../../logger'

import type { PlatformTheme } from 'oa-themes'

const themeMap = {
  'precious-plastic': preciousPlasticTheme,
  'project-kamp': projectKampTheme,
  'fixing-fashion': fixingFashionTheme,
}

export class ThemeStore {
  rootRef: HTMLElement | null = null
  screenDimensions: DOMRectReadOnly | null = null
  resizeObserver: ResizeObserver | null = null

  currentTheme: PlatformTheme =
      themeMap[
      localStorage.getItem('platformTheme') ||
      getConfigurationOption('REACT_APP_PLATFORM_THEME', 'precious-plastic')
          ]

  setRootRef = (rootRef: HTMLElement) => {
    this.rootRef = rootRef

    if (rootRef) {
      this.resizeObserver = new ResizeObserver((entries) => {
        runInAction(() => {
          const contentRect = entries?.[0]?.contentRect
          this.screenDimensions = contentRect
        })
      })

      this.resizeObserver.observe(rootRef)
    }
  }

  constructor() {
    makeObservable(this, {
      currentTheme: observable,
      setActiveTheme: action,
      rootRef: observable.ref,
      setRootRef: action,
      screenBreakpoint: computed,
      isMobile: computed,
      screenDimensions: observable.ref,
    })

    logger.debug(`Current theme:`, this.currentTheme.siteName)
  }

  get screenBreakpoint(): 's' | 'm' | 'l' | 'xl' {
    const {screenDimensions} = this

    // TOOD: Review breakpoints with team
    if (screenDimensions) {
      const {width} = screenDimensions

      switch (true) {
        case width < 512:
          return 's'
        case width < 768:
          return 'm'
        case width < 1024:
          return 'l'
        case width < 1440:
          return 'xl'
        default:
          return 'xl'
      }
    }

    return 'l'
  }

  get isMobile(): boolean {
    return this.screenBreakpoint === 's' || this.screenBreakpoint === 'm'
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
