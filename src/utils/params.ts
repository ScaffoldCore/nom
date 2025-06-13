import type { ICommandOptions } from '@/types/options'

/**
 * Get pnpm params
 * @param commandName
 * @param pkgs
 * @param options
 */
export function getPnpmParams(commandName: string, pkgs: string[], options: ICommandOptions) {
    const pnpmParams: string[] = []

    if (pkgs) {
        pnpmParams.push(commandName)

        if (options.filter) {
            pnpmParams.push(`-F`)
            pnpmParams.push(options.filter)
        }

        pkgs.map((item: string) => (pnpmParams.push(item)))
    }

    if (options.dev) {
        pnpmParams.push('-D')
    }

    if (options.workspace) {
        pnpmParams.push('-w')
    }

    return pnpmParams
}
