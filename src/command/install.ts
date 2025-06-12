import options from '@/options.ts'
import { header } from '@/utils/utils.ts'

export default {
    command: {
        rawName: 'install [...pkgs]',
        description: 'Installs a package and any packages that it depends on. By default, any new package is installed as a prod dependency',
    },
    options,
    action: (pkgs: string[], options: {
        dev: boolean
        workspace: boolean
        catalog?: string
    }) => {
        header()
        console.log('install', pkgs, options)
    },
}
