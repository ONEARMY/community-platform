/*
  Component wrapper for Algolia places search with additional input debounce
*/
import React from 'react'
import AlgoliaPlaces from 'places.js'
import { ALGOLIA_PLACES_CONFIG } from 'src/config/config'
import { Input } from '../Form/elements'
import { Subscription } from 'rxjs'

interface IProps {
  placeholder: string
}
interface IState {
  debouncedInputValue: string
}

export class LocationSearch extends React.Component<IProps, IState> {
  public static defaultProps: Partial<IProps>
  inputContainerRef: React.RefObject<any> = React.createRef()
  inputValue$: Subscription
  // algolia places doesn't provide typings so for now leave as 'any'
  places: any
  constructor(props: IProps) {
    super(props)
    this.state = { debouncedInputValue: '' }
  }

  componentDidMount() {
    // initialise algolia places and bind to inputContainerRef
    this.places = AlgoliaPlaces({
      appId: ALGOLIA_PLACES_CONFIG.applicationID,
      apiKey: ALGOLIA_PLACES_CONFIG.searchOnlyAPIKey,
      container: this.inputContainerRef.current,
    })
  }

  handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      debouncedInputValue: e.target.value,
    })
    // manually trigger the onchange method so places picks up the change
    const event = new Event('change', { bubbles: true })
    this.inputContainerRef.current.dispatchEvent(event)
  }
  render() {
    return (
      <>
        <Input
          placeholder={this.props.placeholder}
          onChange={v => this.handleInputChange(v)}
        />
        <input
          type="search"
          id="address-input"
          value={this.state.debouncedInputValue}
          ref={this.inputContainerRef}
          onChange={e => {
            console.log('change', e)
          }}
        />
      </>
    )
  }
}
LocationSearch.defaultProps = {
  placeholder: 'Search for a location',
}
