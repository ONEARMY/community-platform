import { setDoc, deleteDoc } from '../../Firebase/firestoreDB'
import type { IMigration } from '../models'

class Migration implements IMigration {
  _id = '001-test-migration'
  async up() {
    return setDoc('migration_example_created' as any, 'some-user-id', {
      description: 'I was made in a lab 🧪',
    })
  }
  async down() {
    return deleteDoc('migration_example_created' as any, 'some-user-id')
  }
}
export default new Migration()
