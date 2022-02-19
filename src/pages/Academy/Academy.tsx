import { Route } from 'react-router'
import { useCommonStores } from 'src/index'
import ExternalEmbed from 'src/components/ExternalEmbed/ExternalEmbed'

export function getFrameSrc(base, path): string {
  return `${base}${path
    .split('/')
    .filter(str => str !== 'academy' && Boolean(str))
    .join('/')}`
}

export default function Academy() {
  const { stores } = useCommonStores()
  const src = stores.themeStore.currentTheme.academyResource

  return (
    <Route
      render={props => (
        // NOTE - for embed to work github.io site also must host at same path, i.e. /academy
        <ExternalEmbed
          src={getFrameSrc(src, props.location.pathname)}
          {...props}
        />
      )}
    />
  )
}
