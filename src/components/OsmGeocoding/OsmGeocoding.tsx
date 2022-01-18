import { useState, useRef } from 'react'
import { debounce } from 'debounce'
import { Input } from '../Form/elements'
import { OsmGeocodingResultsList } from './OsmGeocodingResultsList'
import { logger } from 'src/logger'
import OsmGeocodingLoader from './OsmGeocodingLoader'

interface Props {
  placeholder?: string
  debounceMs?: number
  iconUrl?: string
  callback?: any
  city?: string
  countrycodes?: string
  acceptLanguage?: string
  viewbox?: string
}

export interface Result {
  boundingbox: Array<string>
  display_name: string
  lat: string
  lon: string
  icon?: string
}

export const OsmGeocoding = ({
  placeholder = 'Search for an address',
  debounceMs = 600,
  callback,
  acceptLanguage = 'en',
  viewbox = '',
}: Props) => {
  const [results, setResults] = useState<Result[]>([])
  const [showResults, setShowResults] = useState(false)
  const [showLoader, setShowLoader] = useState(false)
  const mainContainerRef = useRef<HTMLDivElement>(null)

  document.addEventListener('click', function(event) {
    const isClickInside = mainContainerRef?.current?.contains(
      event.target as Node,
    )
    if (!isClickInside) {
      setShowResults(false)
    }
  })

  document.onkeyup = function(event) {
    if (event.key === 'Escape') {
      setShowResults(false)
    }
  }

  function getGeocoding(address = '') {
    if (address.length === 0) return

    setShowLoader(true)

    let url = `https://nominatim.openstreetmap.org/search?format=json&q=${address}&accept-language=${acceptLanguage}`

    if (viewbox.length) {
      url = `${url}&viewbox=${viewbox}&bounded=1`
    }

    fetch(url, {
      headers: new Headers({
        'User-Agent':
          'onearmy.earth Community Platform (https://platform.onearmy.earth)',
      }),
    })
      .then(response => response.json())
      .then(data => {
        setResults(data)
        setShowResults(true)
      })
      .catch(err => logger.error(err, 'OsmGeocoding.getGeocoding.error'))
      .finally(() => setShowLoader(false))
  }

  const showResultsListing = !!results.length && showResults && !showLoader
  const debouncedOnChange = debounce((address: string) => {
    getGeocoding(address)
  }, debounceMs)

  return (
    <div
      data-cy="osm-geocoding"
      ref={mainContainerRef}
      style={{ width: '100%' }}
    >
      <Input
        autoComplete="off"
        type="search"
        name="geocoding"
        id="geocoding"
        data-cy="osm-geocoding-input"
        placeholder={placeholder}
        style={{
          width: '100%',
          background: 'white',
          fontFamily: 'Varela Round',
          fontSize: '14px',
          border: '2px solid black',
          height: '44px',
          display: 'flex',
          borderRadius:
            showResultsListing || showLoader ? '5px 5px 0 0' : '5px',
          marginBottom: 0,
        }}
        onClick={() => setShowResults(true)}
        onChange={event => {
          debouncedOnChange(event.target.value)
        }}
      />
      {showLoader && <OsmGeocodingLoader />}
      {showResultsListing && (
        <OsmGeocodingResultsList
          results={results}
          callback={callback}
          setShowResults={setShowResults}
        />
      )}
    </div>
  )
}

export default OsmGeocoding
