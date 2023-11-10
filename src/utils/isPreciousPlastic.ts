export const isPreciousPlastic = (): boolean => {
  return (
    (process.env.REACT_APP_PLATFORM_THEME ||
      localStorage.getItem('platformTheme')) === 'precious-plastic'
  )
}
