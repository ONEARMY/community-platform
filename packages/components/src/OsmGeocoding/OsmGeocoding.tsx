import { useState, useRef, useEffect } from 'react'
import { Input } from 'theme-ui'
import { OsmGeocodingResultsList } from './OsmGeocodingResultsList'
import { useDebouncedCallback } from 'use-debounce'
import { OsmGeocodingLoader } from './OsmGeocodingLoader'
import type { Result } from './types'

export interface Props {
  placeholder?: string
  debounceMs?: number
  iconUrl?: string
  callback?: any
  city?: string
  countrycodes?: string
  acceptLanguage?: string
  viewbox?: string
  loading?: boolean
}

export const OsmGeocoding = ({
  placeholder = 'Search for an address',
  debounceMs = 800,
  callback,
  acceptLanguage = 'en',
  viewbox = '',
  loading = false,
}: Props) => {
  const [searchValue, setSearchValue] = useState('')
  const [results, setResults] = useState<Result[]>([])
  const [showResults, setShowResults] = useState(false)
  const [showLoader, setShowLoader] = useState(loading)
  const [queryLocationService, setQueryLocationService] = useState(false)
  const mainContainerRef = useRef<HTMLDivElement>(null)

  document.addEventListener('click', function (event) {
    const isClickInside = mainContainerRef?.current?.contains(
      event.target as Node,
    )
    if (!isClickInside) {
      setShowResults(false)
    }
  })

  document.onkeyup = function (event) {
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
      .then((response) => response.json())
      .then((data) => {
        setResults(data)
        setShowResults(true)
      })
      .catch(null)
      .finally(() => setShowLoader(false))
  }

  const showResultsListing = !!results.length && showResults && !showLoader
  const dcb = useDebouncedCallback(
    (search: string) => getGeocoding(search),
    debounceMs,
  )

  useEffect(() => {
    if (queryLocationService) {
      dcb(searchValue)
    }
  }, [searchValue, queryLocationService])

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
        value={searchValue}
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
        onChange={(event) => {
          setQueryLocationService(true)
          setSearchValue(event.target.value)
        }}
      />
      {showLoader && <OsmGeocodingLoader />}
      {showResultsListing && (
        <OsmGeocodingResultsList
          results={results}
          callback={(result: Result) => {
            if (result) {
              setQueryLocationService(false)
              setSearchValue(result.display_name)
            }

            callback(result)
          }}
          setShowResults={setShowResults}
        />
      )}
    </div>
  )
}
