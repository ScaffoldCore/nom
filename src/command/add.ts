import type { ICommandOptions } from '@/types/options'
import options from '@/options.ts'
import { header, run } from '@/utils'
import { getPnpmParams } from '@/utils/params.ts'
import { updatePnpmWorkSpaceYaml } from '@/workspace.ts'

export default {
    command: {
        rawName: 'add [...pkgs]',
        description: 'Install all dependencies for a project',
    },
    options,
    action: async (pkgs: string[], options: ICommandOptions) => {
        header()

        const pnpmParams = getPnpmParams('add', pkgs, options)

        await run(pnpmParams)

        await updatePnpmWorkSpaceYaml()
    },
}
