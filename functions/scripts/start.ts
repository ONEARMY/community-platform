import { spawn, } from 'child_process'
import webpack from 'webpack'
import webpackConfig from '../webpack.config'


/**
 * Start the functions emulator and functions source code in parallel
 * 
 * NOTE - whilst similar functionality can be achieved with packages like 'concurrently',
 * SIGTERM signals don't seem to always be handled correctly and the emulator doesn't complete
 * export operations. Similarly webpack watch cli respawns even after SIGINT so better to run programatically
 */
function main() {
    // CLI: concurrently --kill-others-on-fail --names \"emulator,functions\" -c \"blue,magenta\" \"yarn serve:emulated\" \"yarn watch\"
    checkSeedData()
    const webpackWatcher = compileAndWatchFunctions()
    if (webpackWatcher) {
        // start emulator only after compiler running (to pass close callback)
        startEmulator(webpackWatcher)

    }
}
main()


function checkSeedData() {

}

/** Programatically run webpack in watch mode */
function compileAndWatchFunctions() {
    // CLI: webpack --watch
    const compiler = webpack(webpackConfig)
    return compiler.watch({
        aggregateTimeout: 300,
        poll: undefined
    }, (err, stats) => {
        if (stats.hasErrors()) {
            const info = stats.toJson()
            console.log('[Compile Error]', info.errors)
        }
        if (err) {
            console.log('[Compiler Error]', err)
        }
    }
    );
}


function startEmulator(functionsCompiler: webpack.Compiler.Watching) {
    const cmd = 'yarn serve:emulated'
    const child = spawn(cmd, { shell: true, stdio: ['inherit', 'inherit', 'inherit'] })
    child.on('close', (code) => {
        if (code === 1) {
            console.error('[Emulator Error]',)
            // kill functions compiler
            functionsCompiler.close(() => console.log('Functions compiler terminated'))
        }
    })
}

