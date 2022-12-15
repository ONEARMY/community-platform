export interface IMigration {
  /**
   * All migrations will be performed alphabetically by id
   * It is recommended to stick to a format that preservices order in a safe way, e.g.
   * `001-first-migration`, `002-second-migration`
   */
  _id: string

  /** Field populated after successful migration run */
  _processed?: boolean

  /**
   * Indicate firebase should rollback the migration
   * NOTE - will only perform rollback if all successive migrations are also rolledback
   */
  _rollback?: boolean

  /** Method called when calling migration */
  up: () => Promise<any>

  /** Method called when rolling back migration, should return db to its previous state */
  down: () => Promise<any>
}

// TODO - additional properties and methods it would be nice to include
interface IMigrationTODO {
  /**
   * If set to true migration will only simulate. Can later be toggled to run fully
   */
  dryRun?: boolean

  /**
   * Specify collections to create backup of (alternatively could offer full backup option)
   * This will be populated as a subcollection of the backup document
   **/
  backupCollections?: string[]

  /** Create a full db backup before migration (Note, this will still need to be manually restored in case of error) */
  backupDB?: boolean

  /**
   * TODO - decide best syntax for running migrations only on particular instance of for other reasons
   * Alternatively can just include in up/down code (but could be more error prone)
   */
  skipCondition?: () => Promise<boolean>
}
