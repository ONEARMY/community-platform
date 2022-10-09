import type { OptionProps } from 'react-select'
import { components } from 'react-select'
import { Flex, Text } from 'theme-ui'

// https://github.com/JedWatson/react-select/issues/685#issuecomment-420213835
export const Option = (props: OptionProps) => {
  const option: any = props.data
  if (option.imageElement) {
    return (
      <components.Option {...props}>
        <>
          <Flex
            sx={{ alignItems: 'center', justifyContent: 'space-between' }}
            mt="5px"
            key={option.label}
          >
            <Flex sx={{ alignItems: 'center' }}>
              {option.imageElement}
              <Text sx={{ fontSize: 2 }} ml="10px">
                {option.label}
                {option.number && ` (${option.number})`}
              </Text>
            </Flex>
          </Flex>
        </>
      </components.Option>
    )
  }

  return <components.Option {...props}>{props.label}</components.Option>
}
