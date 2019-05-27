/*
  Component wrapper for Algolia places search with additional input debounce.
  Uses 2 input components, the first to take raw user input, and debounce before
  updating the second which is bound to algolia's search autocomplete implementation
*/
import React from 'react'
import AlgoliaPlaces from 'places.js'
import { ALGOLIA_PLACES_CONFIG } from 'src/config/config'
import { Input } from '../Form/elements'
import { Observable, fromEvent, Subscription } from 'rxjs'
import { debounceTime, map } from 'rxjs/operators'
import './LocationSearch.css'

interface IProps {
  placeholder: string
  debounceTime: number
  onChange: (selected: ILocation) => void
}
interface IState {
  debouncedInputValue: string
}

export class LocationSearch extends React.Component<IProps, IState> {
  public static defaultProps: Partial<IProps>
  private userInputRef: React.RefObject<any> = React.createRef()
  private placesInputRef: React.RefObject<any> = React.createRef()
  // create an observable that will be used to track changes to the user input and emit with debounce
  private inputValue$: Subscription
  // algolia places doesn't provide typings so for now leave as 'any'
  private places: any
  constructor(props: IProps) {
    super(props)
    this.state = { debouncedInputValue: '' }
  }

  componentDidMount() {
    // initialise algolia places and bind to inputContainerRef
    this.places = AlgoliaPlaces({
      appId: ALGOLIA_PLACES_CONFIG.applicationID,
      apiKey: ALGOLIA_PLACES_CONFIG.searchOnlyAPIKey,
      container: this.placesInputRef.current,
    }).configure({ style: false, useDeviceLocation: false })
    // add custom handler when place selected from list
    this.places.on('change', (selected: IAlgoliaResponse) =>
      this.handlePlaceSelectChange(selected),
    )
    this.subscribeToInputChanges()
  }

  componentWillUnmount() {
    // unsubscribe to prevent memory leaks
    this.inputValue$.unsubscribe()
  }

  // when user changes input want to debounce and pass to places input
  subscribeToInputChanges() {
    const observable: Observable<
      React.ChangeEvent<HTMLInputElement>
    > = fromEvent(this.userInputRef.current, 'keyup')
    this.inputValue$ = observable
      .pipe(
        map(e => e.currentTarget.value),
        debounceTime(this.props.debounceTime),
      )

      .subscribe((v: string) => this.handleInputChange(v))
  }

  // handle changes to debounced input change
  handleInputChange(value: string) {
    this.setState({
      debouncedInputValue: value,
    })
    // need to manually trigger an input event as this is what algolia places uses to pick up change
    const event = new Event('input', { bubbles: true })
    this.placesInputRef.current.dispatchEvent(event)
  }

  // this time we need to pass back changes from the algolia dropdown to the initial input box
  // and emit the value to callback
  handlePlaceSelectChange(selected: IAlgoliaResponse) {
    this.userInputRef.current.value = selected.suggestion.value
    this.props.onChange(_resultToLocation(selected))
  }

  render() {
    return (
      <>
        {/* the first input uses our styled input component and has ref to subscribe to value changes */}
        <Input
          placeholder={this.props.placeholder}
          style={{ marginBottom: 0 }}
          ref={this.userInputRef}
        />
        {/* the second input takes debounced value from the first input and binds to algolia search  */}
        <input
          type="search"
          id="address-input"
          value={this.state.debouncedInputValue}
          ref={this.placesInputRef}
          readOnly
          style={{ display: 'none' }}
        />
      </>
    )
  }
}
LocationSearch.defaultProps = {
  placeholder: 'Search for a location',
  debounceTime: 500,
  onChange: () => null,
}

/*****************************************************************
 *            Helpers
 ****************************************************************/

function _resultToLocation(result: IAlgoliaResponse) {
  const l = result.suggestion
  const location: ILocation = {
    administrative: l.administrative,
    country: l.country,
    countryCode: l.countryCode,
    latlng: l.latlng,
    name: l.name,
    postcode: l.postcode,
    value: l.value,
  }
  // some fields may be undefined, so convert to null so can store in db
  Object.keys(location).forEach(key => {
    if (location[key] === undefined) {
      location[key] = null
    }
  })
  return location
}

/*****************************************************************
 *            Interfaces
 ****************************************************************/
// algolia doesn't provide typings so taken from
// https://community.algolia.com/places/documentation.html
// implementation contains more fields but assumed not relevant

interface IAlgoliaResponse {
  query: string
  rawAnswer: any
  suggestion: IAlgoliaSuggestion
  suggestionIndex: number
}
interface IAlgoliaSuggestion extends ILocation {
  higlight: Partial<IAlgoliaSuggestion>
  type:
    | 'country'
    | 'city'
    | 'address'
    | 'busStop'
    | 'trainStation'
    | 'townhall'
    | 'airport'
}
interface ILocation {
  name: string
  country: string
  countryCode: string
  administrative: string
  latlng: ILatLng
  postcode: string
  value: string
}
interface ILatLng {
  lat: number
  lng: number
}
