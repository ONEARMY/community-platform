/*
  Component wrapper for Algolia places search with additional input debounce.
  Uses 2 input components, the first to take raw user input, and debounce before
  updating the second which is bound to algolia's search autocomplete implementation
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
  rawInputValue: string
}

export class LocationSearch extends React.Component<IProps, IState> {
  public static defaultProps: Partial<IProps>
  inputContainerRef: React.RefObject<any> = React.createRef()
  inputValue$: Subscription
  // algolia places doesn't provide typings so for now leave as 'any'
  places: any
  constructor(props: IProps) {
    super(props)
    this.state = { debouncedInputValue: '', rawInputValue: '' }
  }

  componentDidMount() {
    // initialise algolia places and bind to inputContainerRef
    this.places = AlgoliaPlaces({
      appId: ALGOLIA_PLACES_CONFIG.applicationID,
      apiKey: ALGOLIA_PLACES_CONFIG.searchOnlyAPIKey,
      container: this.inputContainerRef.current,
    })
    // add custom handler when place selected from list
    this.places.on('change', selected =>
      this.handlePlaceSelectChange(selected as IAlgoliaResponse),
    )
  }

  // debounce user input to update algolia search input
  handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      debouncedInputValue: e.target.value,
      rawInputValue: e.target.value,
    })
    // manually trigger the input method so places picks up the change
    const event = new Event('input', { bubbles: true })
    this.inputContainerRef.current.dispatchEvent(event)
  }
  // this time we need to pass back changes from the algolia dropdown to the initial input box
  handlePlaceSelectChange(selected: IAlgoliaResponse) {
    this.setState({
      rawInputValue: selected.suggestion.value,
      debouncedInputValue: selected.suggestion.value,
    })
  }
  render() {
    return (
      <>
        {/* the first input uses custom component with debounced onChange function */}
        <Input
          placeholder={this.props.placeholder}
          onChange={v => this.handleInputChange(v)}
          value={this.state.rawInputValue}
          style={{ marginBottom: 0 }}
        />
        {/* the second input takes debounced value from the first input and binds to algolia search  */}
        <input
          type="search"
          id="address-input"
          value={this.state.debouncedInputValue}
          ref={this.inputContainerRef}
          style={{ display: 'none' }}
        />
      </>
    )
  }
}
LocationSearch.defaultProps = {
  placeholder: 'Search for a location',
}

/****************************************************
 *            Interfaces
 *****************************************************/
// algolia doesn't provide typings so taken from
// https://community.algolia.com/places/documentation.html
// implementation contains more fields but assumed not relevant

interface IAlgoliaResponse {
  query: string
  rawAnswer: any
  suggestion: IAlgoliaSuggestion
  suggestionIndex: number
}
interface IAlgoliaSuggestion {
  type:
    | 'country'
    | 'city'
    | 'address'
    | 'busStop'
    | 'trainStation'
    | 'townhall'
    | 'airport'
  name: string
  city: string
  country: string
  countryCode: string
  administrative: string
  county: string
  suburb: string
  latlng: ILatLng
  postcode: string
  postcodes: string[]
  value: string
  higlight: Partial<IAlgoliaSuggestion>
}
interface ILatLng {
  lat: number
  lng: number
}
