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
import styled from 'styled-components'
import { ILocation } from 'src/models/common.models'
import searchIcon from 'src/assets/icons/icon-search.svg'

interface IProps {
  placeholder: string
  debounceTime: number
  onChange: (selected: ILocation) => void
  onClear?: () => void
  styleVariant?: 'filter' | 'field'
}
interface IState {
  debouncedInputValue: string
}

const AlgoliaResults = styled.input`
  display: none;
`

const FilterStyle = {
  background: 'white',
  border: '2px solid black',
  height: '44px',
  display: 'flex',
  marginBottom: 0,
}

const SelectorStyle = {
  marginBottom: 0,
  background: 'white',
  border: '2px solid black',
  height: '45px',
  display: 'flex',
  '::after': {
    background: `url("${searchIcon}")`,
  },
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
    this.places.on('clear', () =>
      this.props.onClear ? this.props.onClear() : false,
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

  resetInputAndClosePanel() {
    this.userInputRef.current.value = ''
    this.handleInputChange('')
    this.places.close()
  }

  render() {
    const { styleVariant } = this.props
    const closeButton: any = document.getElementsByClassName('ap-icon-clear')
    // move the 'x' close button in the DOM from the second (hidden) to the first input
    for (let btn of closeButton) {
      const locationField = btn.closest('#location-panel').firstElementChild
        .firstElementChild
      if (locationField) {
        locationField.after(btn)
      }
      btn.onclick = this.resetInputAndClosePanel.bind(this)
    }

    return (
      <div data-cy="location" id="location-panel">
        {/* the first input uses our styled input component and has ref to subscribe to value changes */}
        <span
          style={{
            position: 'relative',
            display: 'inline-block',
            width: '100%',
          }}
        >
          <Input
            placeholder={this.props.placeholder}
            style={styleVariant === 'filter' ? FilterStyle : SelectorStyle}
            ref={this.userInputRef}
            onBlur={() => this.places.close()}
          />
        </span>
        {/* the second input takes debounced value from the first input and binds to algolia search  */}
        <AlgoliaResults
          type="search"
          id="address-input"
          value={this.state.debouncedInputValue}
          ref={this.placesInputRef}
          readOnly
        />
      </div>
    )
  }
}
LocationSearch.defaultProps = {
  placeholder: 'Search for a location',
  debounceTime: 500,
  onChange: () => null,
  styleVariant: 'field',
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
