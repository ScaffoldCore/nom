import type { ICommandOptions } from '@/types/options'
import { readFile } from 'node:fs/promises'
import { findUp } from 'find-up'
import { construct, crush } from 'radash'
import { x } from 'tinyexec'
import { parseDocument } from 'yaml'
import options from '@/options.ts'
import {
    getPackageJsonPaths,
    replaceDepsWithCatalogReference,
    ROOT_PATH,
    workSpaceYamlSpacing,
    writePnpmWorkSpaceYaml,
} from '@/utils'
import { getPnpmParams } from '@/utils/params.ts'
import { getPnpmWorkSpacePath, header } from '@/utils/utils.ts'

export default {
    command: {
        rawName: 'update [...pkgs]',
        description: 'Updates packages to their latest version based on the specified range',
    },
    options,
    action: async (pkgs: string[], options: ICommandOptions) => {
        header()

        const pnpmParams = getPnpmParams('update', pkgs, options)
        // await run(pnpmParams)
        console.log(pnpmParams)
        await x('pnpm', pnpmParams, {
            nodeOptions: {
                stdio: 'inherit',
                cwd: ROOT_PATH,
            },
        })

        const pnpmWorkspaceYamlPath = await getPnpmWorkSpacePath()

        const pnpmWorkspaceYaml = parseDocument(await readFile(pnpmWorkspaceYamlPath, 'utf-8'))
        const workspaceJson = pnpmWorkspaceYaml.toJSON()

        const pnpmLockPath = await findUp('pnpm-lock.yaml', {
            cwd: ROOT_PATH,
        }) as string

        const pnpmLockYaml = parseDocument(await readFile(pnpmLockPath, 'utf-8'))
        const pnpmLockJson = pnpmLockYaml.toJSON()

        // console.log(workspaceJson.catalogs)
        const lockImporters = pnpmLockJson.importers
        // console.log(lockImporters)
        const updatedCatalog = workspaceJson.catalogs
        for (const project in lockImporters) {
            const projects = lockImporters[project]
            for (const dependency in projects) {
                // console.log(project, dependency)
                for (const pkg in projects[dependency]) {
                    if (!(projects[dependency][pkg]?.specifier).includes('catalog:')) {
                        const lastVersion = projects[dependency][pkg]?.specifier as string
                        const catalogKey = project === '.' ? (dependency === 'dependencies' ? 'prod' : 'dev') : project.replace('packages/', '')
                        // console.log(project, dependency, pkg)
                        // console.log({
                        //     catalogKey,
                        //     lastVersion,
                        // })
                        updatedCatalog[catalogKey][pkg] = lastVersion
                    }
                }
            }
        }

        // console.log('updatedCatalog', updatedCatalog)
        const workspaceYaml = {
            ...workspaceJson,
            catalogs: updatedCatalog,
        }

        await writePnpmWorkSpaceYaml(pnpmWorkspaceYamlPath, workSpaceYamlSpacing(workspaceYaml))

        const pkgJsonPaths = getPackageJsonPaths(workspaceJson.packages || [])
        const packagePaths = construct(crush(pkgJsonPaths)) as Record<string, string>
        packagePaths[Object.keys(packagePaths).length.toString()] = await findUp('package.json', { cwd: ROOT_PATH }) as string

        await replaceDepsWithCatalogReference(Object.values(packagePaths), workspaceYaml.catalogs)
    },
}
