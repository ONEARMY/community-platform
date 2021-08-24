import * as fs from 'fs-extra'
import * as path from 'path'
import jszip from 'jszip'
import { EMULATOR_IMPORT_DIR, SEED_FOLDER_PATH } from '../paths'
const zip = new jszip()



/**
 * Populate data from a seed-data zip file to firebase functions emulator import folder
 */
async function main() {
    const seedFiles = fs.readdirSync(SEED_FOLDER_PATH).filter(filename => filename.endsWith('.zip'))
    if (seedFiles.length === 0) {
        throw new Error('No seed files found in ' + SEED_FOLDER_PATH)
    }
    if (seedFiles.length > 1) {
        // TODO - handle selection of different file
    }
    const seedFilePath = path.resolve(SEED_FOLDER_PATH, seedFiles[0])
    fs.ensureDirSync(EMULATOR_IMPORT_DIR)
    fs.emptyDirSync(EMULATOR_IMPORT_DIR)
    const zipFile = fs.readFileSync(seedFilePath)
    zip.loadAsync(zipFile)
        .then((contents) => {
            Object.values(contents.files).forEach(file => {
                if (file.dir) {
                    const targetDir = path.resolve(EMULATOR_IMPORT_DIR, file.name)
                    fs.mkdirSync(targetDir, { recursive: true })
                }
                else {
                    zip.file(file.name).async('nodebuffer').then(data => {
                        fs.writeFileSync(path.resolve(EMULATOR_IMPORT_DIR, file.name), data)
                    })

                }
            })
            console.log('[Seed Data] loaded', path.basename(seedFilePath), '->', EMULATOR_IMPORT_DIR)
        });
}
main()
