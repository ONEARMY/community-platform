// tmp fix for typescript bug importing console
// https://github.com/Microsoft/TypeScript/issues/30471
declare module 'console' {
  export = typeof import('console')
}
