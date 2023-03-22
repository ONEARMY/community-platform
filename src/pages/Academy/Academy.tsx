import { Route } from 'react-router'
import { useCommonStores } from 'src/index'
import ExternalEmbed from 'src/pages/Academy/ExternalEmbed/ExternalEmbed'

export const getFrameSrc = (base, path): string =>
  `${base}${path
    .split('/')
    .filter((str) => str !== 'academy' && Boolean(str))
    .join('/')}`

const Academy = () => {
  const { stores } = useCommonStores()
  const src = stores.themeStore.currentTheme.academyResource

  return (
    <Route
      render={(props) => (
        // NOTE - for embed to work github.io site also must host at same path, i.e. /academy
        <ExternalEmbed
          src={getFrameSrc(src, props.location.pathname)}
          {...props}
        />
      )}
    />
  )
}

export default Academy
