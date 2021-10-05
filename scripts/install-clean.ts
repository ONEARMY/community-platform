import { spawnSync } from 'child_process'
import globby from 'globby'
import path from 'path'
import fs from 'fs'
import rimraf from 'rimraf'

const REPO_SRC = path.resolve(__dirname, '../')


/** Delete node_modules from all workspaces and reinstall clean */
async function installClean() {
    console.log('Starting clean install. This could take a few minutes...')
    // delete existing node_modules
    const packageJsonPaths = globby.sync(['**/package.json', '!**/node_modules'], {
        cwd: REPO_SRC,
    });
    for (const packageJsonPath of packageJsonPaths) {
        const folder = path.dirname(packageJsonPath)
        const node_modules_path = path.resolve(REPO_SRC, folder, 'node_modules')
        if (fs.existsSync(node_modules_path)) {
            console.log('delete', node_modules_path)
            await deleteFolder(node_modules_path)
        }
    }
    // re-install node modules
    console.log('yarn install')
    spawnSync('yarn install', { cwd: REPO_SRC, shell: true, stdio: ['inherit', 'inherit', 'pipe'] })
}
installClean()

async function deleteFolder(folderPath: string) {
    return new Promise<void>((resolve, reject) => {
        rimraf(folderPath, { disableGlob: true }, (err) => {
            if (err) {
                reject(err)
            }
            else {
                resolve()
            }
        })
    })
}