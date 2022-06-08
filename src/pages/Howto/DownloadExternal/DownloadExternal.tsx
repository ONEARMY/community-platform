import { Icon } from 'oa-components'
import { Flex, Text, Link as ExternalLink } from 'theme-ui'
import styled from '@emotion/styled'
import theme from 'src/themes/styled.theme'

interface IProps {
  link: string
}

const FileFlex = styled(Flex)`
  border: 2px solid black;
  border-radius: 5px;
  background-color: ${theme.colors.yellow.base};
  color: black;
`

export const DownloadExternal = (props: IProps) => (
  <ExternalLink href={props.link} target="_blank" rel="noopener noreferrer">
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
