import options from '@/options.ts'
import { header } from '@/utils/utils.ts'

export default {
    command: {
        rawName: 'add [...pkgs]',
        description: 'Install all dependencies for a project',
    },
    options,
    action: (pkgs: string[], options: {
        dev: boolean
        workspace: boolean
        catalog?: string
    }) => {
        header()
        console.log('add', pkgs, options)
    },
}
