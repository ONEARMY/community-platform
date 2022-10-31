import * as React from 'react'
import { inject, observer } from 'mobx-react'
import { Button } from 'oa-components'
import { Heading, Box, Text, Input, Flex } from 'theme-ui'
import type { AdminStore } from 'src/stores/Admin/admin.store'
import { AuthWrapper } from 'src/common/AuthWrapper'

// we include props from react-final-form fields so it can be used as a custom field component
interface IProps {
  adminStore?: AdminStore
}
interface IState {
  userInput?: string
  errorMsg?: string
  updating?: boolean
}

@inject('adminStore')
@observer
export class AdminBetaTesters extends React.Component<IProps, IState> {
  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      userInput: e.target.value,
    })
  }
  addBetaTester = async () => {
    const username = this.state.userInput as string
    this.setState({ errorMsg: undefined, updating: true })
    try {
      await this.props.adminStore!.addUserRole(username, 'beta-tester')
      this.setState({ updating: false, userInput: '' })
    } catch (error) {
      this.setState({ errorMsg: error.message })
    }
  }
  removeBetaTester = async (username: string) => {
    this.setState({ errorMsg: undefined, updating: true })
    try {
      await this.props.adminStore!.removeUserRole(username, 'beta-tester')
      this.setState({ updating: false })
    } catch (error) {
      this.setState({ errorMsg: error.message })
    }
  }
  constructor(props: IProps) {
    super(props)
    this.state = { userInput: '' }
  }

  public render() {
    const { betaTesters } = this.props.adminStore!
    const disabled = this.state.userInput === '' || this.state.updating
    return (
      <Box mt={4}>
        <Heading>List of Beta Testers</Heading>
        <Box mb={3} bg={'white'} p={2}>
          {betaTesters.map((u) => (
            <Flex key={u.userName}>
              <Text sx={{ flex: 1 }}>{u.userName}</Text>
              <AuthWrapper roleRequired="admin">
                <Button
                  icon="delete"
                  disabled={this.state.updating}
                  onClick={() => this.removeBetaTester(u.userName)}
                />
              </AuthWrapper>
            </Flex>
          ))}
        </Box>
        <Box mb={3} bg={'white'} p={2}>
          <Input
            type="text"
            placeholder="Username"
            value={this.state.userInput}
            onChange={this.handleInputChange}
          />
          <Button disabled={disabled} onClick={this.addBetaTester}>
            Add beta tester
          </Button>
          {this.state.errorMsg && (
            <Text color="red">{this.state.errorMsg}</Text>
          )}
        </Box>
      </Box>
    )
  }
}
