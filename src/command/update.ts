import options from '@/options.ts'
import { header } from '@/utils/utils.ts'

export default {
    command: {
        rawName: 'update [...pkgs]',
        description: 'Updates packages to their latest version based on the specified range',
    },
    options,
    action: (pkgs: string[], options: {
        dev: boolean
        workspace: boolean
        catalog?: string
    }) => {
        header()
        console.log('update', pkgs, options)
    },
}
