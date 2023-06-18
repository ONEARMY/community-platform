import { observer } from 'mobx-react'
import { useState } from 'react'
import { Button, Flex, Heading } from 'theme-ui'

import { functions } from 'src/utils/firebase'

const AdminDB = observer(() => {
  const [triggerMigrationState, setMigrationState] = useState<string>('')
  const [triggerUpdateState, setUpdateState] = useState<string>('')
  const [updateRecords, setUpdateRecords] = useState<Record<string, any>>({})

  const howtoList = updateRecords.howtoUpdates ? (
    updateRecords.howtoUpdates.map((howto) => (
      <li key={howto.id}>
        {howto.id}{' '}
        {howto._contentModifiedTimestamp
          ? ' - ' + howto._contentModifiedTimestamp
          : ''}
        {howto.votedUseful && (
          <ul>
            {howto.votedUseful.map((vote) => (
              <li key={howto.id + '-' + vote}>{vote}</li>
            ))}
          </ul>
        )}
      </li>
    ))
  ) : (
    <></>
  )

  const researchList = updateRecords.researchUpdates ? (
    updateRecords.researchUpdates.map((research) => (
      <li key={research.id}>
        {research.id}{' '}
        {research.__contentModifiedTimestamp
          ? ' - ' + research._contentModifiedTimestamp
          : ''}
        {research.votedUseful && (
          <ul>
            {research.votedUseful.map((vote) => (
              <li key={research.id + '-' + vote}>{vote}</li>
            ))}
          </ul>
        )}
      </li>
    ))
  ) : (
    <></>
  )
  const eventList = updateRecords.eventUpdates ? (
    updateRecords.eventUpdates.map((event) => (
      <li key={event.id}>
        {event.id}{' '}
        {event._contentModifiedTimestamp
          ? ' - ' + event._contentModifiedTimestamp
          : ''}
      </li>
    ))
  ) : (
    <></>
  )

  const migrateUsefulDryRun = async () => {
    setMigrationState('Performing migration dry run...')
    try {
      const operations = await functions.httpsCallable(
        'aggregations-migrate-userUseful',
      )(true)
      setMigrationState('Dry run successful.')
      setUpdateRecords({ ...operations?.data?.meta })
    } catch (error) {
      setMigrationState(`Error during dry run: \n ${error}`)
    }
  }
  const migrateUseful = async () => {
    setMigrationState('Migrating user useful...')
    try {
      const operations = await functions.httpsCallable(
        'aggregations-migrate-userUseful',
      )(false)
      setMigrationState('Migration successful.')
      setUpdateRecords({ ...operations?.data?.meta })
    } catch (error) {
      setMigrationState(`Error migrating useful: \n ${error}`)
    }
  }

  const updateContentModifiedDryRun = async () => {
    setUpdateState('Performing content modified timestamp dry run...')
    try {
      const operations = await functions.httpsCallable(
        'database-updates-contentModifiedTimestamp',
      )(true)
      setUpdateState('Dry run successful.')
      setUpdateRecords({ ...operations?.data?.meta })
    } catch (error) {
      setUpdateState(`Error during dry run: \n ${error}`)
    }
  }
  const updateContentModified = async () => {
    setUpdateState('Setting content modified timestamps...')
    try {
      const operations = await functions.httpsCallable(
        'database-updates-contentModifiedTimestamp',
      )(false)
      setUpdateState('Content modified timestamps set successfully.')
      setUpdateRecords({ ...operations?.data?.meta })
    } catch (error) {
      setUpdateState(`Error setting content modified timestamps: \n ${error}`)
    }
  }

  return (
    <>
      <h2>Database Operations</h2>
      <Flex mb={6} sx={{ flexDirection: 'column' }}>
        <Flex mb={4} sx={{ flexDirection: 'column' }}>
          <Heading mb={2} variant="small" color={'black'}>
            Set content modified timestamps
          </Heading>
          <Flex sx={{ flexDirection: 'row' }}>
            <Button
              sx={{ marginRight: '10px' }}
              onClick={updateContentModifiedDryRun}
            >
              Dry run setting content modified timestamps
            </Button>
            <Button
              sx={{ marginRight: '10px' }}
              onClick={updateContentModified}
            >
              Set content modified timestamps
            </Button>
            {triggerUpdateState && <p>{triggerUpdateState}</p>}
          </Flex>
        </Flex>

        <Flex sx={{ flexDirection: 'column' }}>
          <Heading mb={2} variant="small" color={'black'}>
            Migrate user useful
          </Heading>
          <Flex sx={{ flexDirection: 'row' }}>
            <Button sx={{ marginRight: '10px' }} onClick={migrateUsefulDryRun}>
              Dry run migrate user useful
            </Button>
            <Button sx={{ marginRight: '10px' }} onClick={migrateUseful}>
              Migrate user useful
            </Button>
            {triggerMigrationState && <p>{triggerMigrationState}</p>}
          </Flex>
        </Flex>
      </Flex>

      <Flex
        sx={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          wordWrap: 'break-word',
        }}
      >
        {updateRecords.howtoUpdates && (
          <Flex sx={{ flexDirection: 'column', width: '33%' }}>
            <h3>
              How-to {triggerMigrationState != '' ? 'Migrations' : 'Updates'} -{' '}
              {updateRecords.howtoUpdates.length}
            </h3>
            <ul>{howtoList}</ul>
          </Flex>
        )}
        {updateRecords.researchUpdates && (
          <Flex sx={{ flexDirection: 'column', width: '33%' }}>
            <h3>
              Research {triggerMigrationState != '' ? 'Migrations' : 'Updates'}{' '}
              - {updateRecords.researchUpdates.length}
            </h3>
            <ul>{researchList}</ul>
          </Flex>
        )}
        {updateRecords.eventUpdates && (
          <Flex sx={{ flexDirection: 'column', width: '33%' }}>
            <h3>
              Event {triggerMigrationState != '' ? 'Migrations' : 'Updates'} -{' '}
              {updateRecords.eventUpdates.length}
            </h3>
            <ul>{eventList}</ul>
          </Flex>
        )}
      </Flex>
    </>
  )
})
export default AdminDB
