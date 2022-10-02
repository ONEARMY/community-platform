import { inject, observer } from 'mobx-react'
import { Component } from 'react'
import { Select } from 'oa-components'
import type { HowtoStore } from 'src/stores/Howto/howto.store'
import { FieldContainer } from 'src/components/Form/FieldContainer'

interface ISortOption {
  value: string
  label: string
}

interface IProps {
  usefulCounts: { [key: string]: number }
}

interface InjectedProps extends IProps {
  howtoStore: HowtoStore
}

interface IState {
  value: ISortOption | null
}

const sortingOptions: ISortOption[] = ['Latest', 'Most useful'].map(
  (label) => ({
    label,
    value: label.toLowerCase(),
  }),
)

@inject('howtoStore')
@observer
class SortSelect extends Component<IProps, IState> {
  constructor(props: any) {
    super(props)
    this.state = { value: null }
  }

  get injected() {
    return this.props as InjectedProps
  }

  get store() {
    return this.injected.howtoStore
  }

  onSortValueChange(value: ISortOption) {
    this.setState({ value })
    if (value.value === 'most useful') {
      this.injected.howtoStore.sortHowtosByUsefulCount(this.props.usefulCounts)
    } else {
      this.injected.howtoStore.sortHowtosByLatest()
    }
  }

  render() {
    return (
      <FieldContainer>
        <Select
          options={sortingOptions}
          placeholder="Sort by"
          value={this.state.value}
          onChange={(value) => this.onSortValueChange(value as ISortOption)}
        />
      </FieldContainer>
    )
  }
}

export default SortSelect
