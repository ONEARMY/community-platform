// import original module declarations
import 'styled-components'

// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      white: string
      black: string
      primary: string
      yellow: { base: string; hover: string }
      blue: string
      red: string
      red2: string
      softblue: string
      bluetag: string
      grey: string
      green: string
      error: string
      background: string
      silver: string
    }

    fontSizes: number[]

    space: number[]
    radii: number[]

    zIndex: {
      behind: number
      level: number
      default: number
      slickArrows: number
      modalProfile: number
      logoContainer: number
      mapFlexBar: number
      header: number
      modalBackdrop: number
      modalContent: number
    }
    breakpoints: string[]
    buttons: any
    maxContainerWidth: number
    regular: number
    bold: number
  }
}
