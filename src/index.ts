import cac from 'cac'
import { version } from '../package.json'
import commands from './command'

const nom = cac('nom')

nom.command('')
    .action(() => {
        nom.outputHelp()
    })

commands.forEach(({ command, options, action }) => {
    let cmd = nom.command(command.rawName, command.description)

    options?.forEach((opt) => {
        cmd = cmd.option(opt.rawName, opt.description, opt.config || {})
    })

    cmd.action(action)
})

// Detect non-existent commands
nom.on('command:*', () => {
    console.error(`Unknown command: "${nom.args.join(' ')}"\n`)
    console.log('To see a list of supported nom commands, run:\n  nom --help')
    process.exit(1)
})

nom.help()
    .version(version)
    .parse()
