import { observer } from 'mobx-react'
import { useState } from 'react'
import { Button, Flex } from 'theme-ui'

import { functions } from 'src/utils/firebase'

const AdminDB = observer(() => {
  const [triggerMigrationState, setMigrationState] = useState<string>('')

  const [migrationRecords, setMigrationRecords] = useState<Record<string, any>>(
    {},
  )

  const howtoList = migrationRecords.howtoUpdates ? (
    migrationRecords.howtoUpdates.map((howto) => (
      <li key={howto.id}>
        {howto.id}
        <ul>
          {howto.votedUseful.map((vote) => (
            <li key={howto.id + '-' + vote}>{vote}</li>
          ))}
        </ul>
      </li>
    ))
  ) : (
    <></>
  )

  const researchList = migrationRecords.researchUpdates ? (
    migrationRecords.researchUpdates.map((research) => (
      <li key={research.id}>
        {research.id}
        <ul>
          {research.votedUseful.map((vote) => (
            <li key={research.id + '-' + vote}>{vote}</li>
          ))}
        </ul>
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
      setMigrationRecords({ ...operations?.data?.meta })
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
      setMigrationRecords({ ...operations?.data?.meta })
    } catch (error) {
      setMigrationState(`Error migrating useful: \n ${error}`)
    }
  }

  return (
    <>
      <h2>Database Operations</h2>
      <Flex>
        <Button sx={{ marginRight: '10px' }} onClick={migrateUsefulDryRun}>
          Dry run migrate user useful
        </Button>
        <Button sx={{ marginRight: '10px' }} onClick={migrateUseful}>
          Migrate user useful
        </Button>
        {triggerMigrationState && <p>{triggerMigrationState}</p>}
      </Flex>

      <Flex
        sx={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          wordWrap: 'break-word',
        }}
      >
        {migrationRecords.howtoUpdates && (
          <Flex sx={{ flexDirection: 'column', width: '50%' }}>
            <h3>How-to Migrations - {migrationRecords.howtoUpdates.length}</h3>
            <ul>{howtoList}</ul>
          </Flex>
        )}
        {migrationRecords.researchUpdates && (
          <Flex sx={{ flexDirection: 'column', width: '50%' }}>
            <h3>
              Research Migrations - {migrationRecords.researchUpdates.length}
            </h3>
            <ul>{researchList}</ul>
          </Flex>
        )}
      </Flex>
    </>
  )
})
export default AdminDB
