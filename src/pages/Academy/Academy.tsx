import { Route } from 'react-router'
import { useCommonStores } from 'src'
import ExternalEmbed from 'src/components/ExternalEmbed/ExternalEmbed'

export default function Academy() {
  const { stores } = useCommonStores()
  const src = stores.themeStore.currentTheme.academyResource
  return (
    <Route
      render={props => (
        // NOTE - for embed to work github.io site also must host at same path, i.e. /academy
        <ExternalEmbed
          src={`${src}${props.location.pathname
            .split('/')
            .filter(str => str !== 'academy')
            .join('/')}`}
          {...props}
        />
      )}
    />
  )
}
