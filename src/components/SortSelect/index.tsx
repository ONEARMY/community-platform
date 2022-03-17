import { inject, observer } from 'mobx-react'
import { Component } from 'react'
import Select from 'react-select'
import { OptionsType, ValueType } from 'react-select/lib/types'
import { HowtoStore } from 'src/stores/Howto/howto.store'
import { DropdownIndicator } from '../DropdownIndicator'
import { FieldContainer } from '../Form/elements'
import { FilterStyles } from '../Form/Select.field'

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
  value: ValueType<ISortOption> | null
}

const sortingOptions: OptionsType<ISortOption> = ['Latest', 'Most useful'].map(
  label => ({
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
          components={{ DropdownIndicator }}
          styles={FilterStyles}
          options={sortingOptions}
          placeholder="Sort by"
          value={this.state.value}
          onChange={value => this.onSortValueChange(value as ISortOption)}
        />
      </FieldContainer>
    )
  }
}

export default SortSelect
