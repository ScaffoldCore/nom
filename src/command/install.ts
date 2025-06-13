import type { ICommandOptions } from '@/types/options'
import options from '@/options.ts'
import { header, run } from '@/utils'
import { getPnpmParams } from '@/utils/params.ts'
import { updatePnpmWorkSpaceYaml } from '@/workspace.ts'

export default {
    command: {
        rawName: 'install [...pkgs]',
        description: 'Installs a package and any packages that it depends on. By default, any new package is installed as a prod dependency',
    },
    options,
    action: async (pkgs: string[], options: ICommandOptions) => {
        header()

        const pnpmParams = getPnpmParams('install', pkgs, options)

        await run(pnpmParams)

        await updatePnpmWorkSpaceYaml()
    },
}
