import fs from 'fs-extra'
import path from 'path'
import jszip from 'jszip'
import { EMULATOR_IMPORT_PATH, EMULATOR_SEED_PATH } from 'oa-shared/paths'
import { promptOptions } from '../utils'
const zip = new jszip()

// Run directly if called from ts-node
if (require.main === module) {
    emulatorSeed()
        .then(() => process.exit(0))
        .catch(err => {
            console.error(err)
            process.exit(1)
        })
}

/**
 * Populate data from a seed-data zip file to firebase functions emulator import folder
 */
export async function emulatorSeed() {
    const seedFiles = fs.readdirSync(EMULATOR_SEED_PATH).filter(filename => filename.endsWith('.zip')).reverse()
    if (seedFiles.length === 0) {
        throw new Error('No seed files found in ' + EMULATOR_SEED_PATH)
    }
    const seedFileSelected = await promptOptions(seedFiles, 'Select seed data')
    const seedFilePath = path.resolve(EMULATOR_SEED_PATH, seedFileSelected)
    fs.ensureDirSync(EMULATOR_IMPORT_PATH)
    fs.emptyDirSync(EMULATOR_IMPORT_PATH)
    const zipFile = fs.readFileSync(seedFilePath)
    const contents = await zip.loadAsync(zipFile)
    for (const file of Object.values(contents.files)) {
        if (file.dir) {
            const targetDir = path.resolve(EMULATOR_IMPORT_PATH, file.name)
            fs.ensureDirSync(targetDir)
        } else {
            const targetFilepath = path.resolve(EMULATOR_IMPORT_PATH, file.name)
            fs.ensureDirSync(path.dirname(targetFilepath))
            const buffer = await file.async('nodebuffer')
            fs.writeFileSync(targetFilepath, buffer)
        }
    }
    console.log('[Seed Data] loaded', path.basename(seedFilePath), '->', EMULATOR_IMPORT_PATH)
}
