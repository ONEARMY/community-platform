import { Loader } from 'oa-components'
import { useEffect, useState } from 'react'
import { useCommonStores } from 'src'
import type { IMapPin } from 'src/models'
import { Box, Card, Heading, Input } from 'theme-ui'

export const Directory = () => {
  const { mapsStore } = useCommonStores().stores
  const [maps, setMaps] = useState<IMapPin[]>([])
  const [filterMaps, setFilterMaps] = useState<IMapPin[]>([])
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    ;(async () => {
      await mapsStore.retrieveMapPins()
      // eslint-disable-next-line no-console
      console.log(`mapsStore.mapPins`, {
        mapsStorePins: mapsStore.getAllMapPins().length,
        mapsStore,
      })
      setMaps((mapsStore as any).mapPins)
      /**
       * TODO: Remove this timeout and debug the reactive state
       */
      setTimeout(() => {
        setMaps((mapsStore as any).mapPins)
        setFilterMaps((mapsStore as any).mapPins)
        setIsLoading(false)
      }, 3000)
    })()
  }, [])

  useEffect(() => {
    if (searchQuery.length) {
      setFilterMaps(maps.filter((pin) => pin._id.includes(searchQuery)))
    }
  }, [searchQuery])

  return (
    <>
      <Heading sx={{ mt: 10 }}>Directory forever</Heading>
      <Input
        type="search"
        placeholder="🔍 Search by username"
        value={searchQuery}
        onChange={(val) => {
          // eslint-disable-next-line no-console
          console.log({ valTargetValue: val.target.value })
          setSearchQuery(val.target.value)
        }}
        onBlur={(val) => {
          // eslint-disable-next-line no-console
          console.log({ valTargetValue: val.target.value })
          setSearchQuery(val.target.value)
        }}
      />
      {searchQuery ? (
        <>
          Search results matching <em>{searchQuery}</em>
        </>
      ) : null}
      {isLoading ? (
        <Loader />
      ) : filterMaps.length ? (
        filterMaps.map((pin: any) => (
          <Card sx={{ p: 4, mb: 2 }} key={pin._id}>
            <p>Username: {pin._id}</p>
            Membership: {pin.type}
            <p>{pin?.detail?.shortDescription}</p>
            {JSON.stringify(pin)}
          </Card>
        ))
      ) : (
        <Box sx={{ p: 4 }}>No results found</Box>
      )}
    </>
  )
}
