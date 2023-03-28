import { Icon, ExternalLink } from 'oa-components'
import { Flex, Text } from 'theme-ui'
import styled from '@emotion/styled'
// TODO: Remove direct usage of Theme
import { preciousPlasticTheme } from 'oa-themes'
const theme = preciousPlasticTheme.styles

interface IProps {
  link: string
  handleClick?: () => Promise<void>
}

const FileFlex = styled(Flex)`
  border: 2px solid black;
  border-radius: 5px;
  background-color: ${theme.colors.yellow.base};
  color: black;
`

export const DownloadExternal = (props: IProps) => (
  <ExternalLink
    href={props.link}
    onClick={() => props.handleClick && props.handleClick()}
  >
    <FileFlex
      p={2}
      mb={1}
      sx={{
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        width: '300px',
      }}
    >
      <Icon size={24} glyph={'external-url'} mr={3} />
      <Text sx={{ flex: 1, fontSize: 1 }} mr={3}>
        Download files
      </Text>
    </FileFlex>
  </ExternalLink>
)
