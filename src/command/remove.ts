import options from '@/options.ts'
import { header } from '@/utils/utils.ts'

export default {
    command: {
        rawName: 'remove [...pkgs]',
        description: 'Removes packages from node_modules and from the project\'s package.json',
    },
    options,
    action: (pkgs: string[], options: {
        dev: boolean
        workspace: boolean
        catalog?: string
    }) => {
        header()
        console.log('remove', pkgs, options)
    },
}
