import { getCollection, setDoc } from '../Firebase/firestoreDB'
import { ALL_MIGRATIONS } from './migration'
import { IMigration } from './models'

/** Trigger up method of all unprocessed migrations */
export const up = async () => {
  console.log('[Migrations] Up')
  const dbMigrations = await getCollection<IMigration>('migrations' as any)
  const migratedIds = dbMigrations
    .filter((m) => !m._processed)
    .map((m) => m._id)
  for (const m of ALL_MIGRATIONS) {
    // avoid re-processing migrations
    if (migratedIds.includes(m._id)) {
      console.log('[SKIP]', m._id)
    } else {
      console.log('[PROCESS]', m._id)
      await processMigration(m)
    }
  }
}

/** Trigger down method of a specific migration */
export const down = async (id: string) => {
  console.log('[Migrations] Down')
  const latestMigration = ALL_MIGRATIONS[ALL_MIGRATIONS.length - 1]
  if (latestMigration._id !== id) {
    throw new Error('Only the latest migration can be rolled back')
  }
  await processRollback(latestMigration)
}

const processMigration = async (m: IMigration) => {
  const { up, down, ...meta } = m
  if (!meta._id) {
    throw new Error('No _id provided for migration')
  }
  await m.up()
  meta._processed = true
  meta._rollback = false
  await setDoc('migrations' as any, m._id, meta)
}

const processRollback = async (m: IMigration) => {
  const { up, down, ...meta } = m
  if (!meta._id) {
    throw new Error('No _id provided for migration')
  }
  await m.down()
  meta._processed = false
  meta._rollback = true
  await setDoc('migrations' as any, m._id, meta)
}
