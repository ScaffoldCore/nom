import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { findUp } from 'find-up'
import { construct, crush } from 'radash'
import { parseDocument } from 'yaml'
import {
    deepMerge,
    filterArray,
    getPackageJsonPaths,
    getPnpmWorkSpacePath,
    readFileContent,
    replaceDepsWithCatalogReference,
    ROOT_PATH,
    workSpaceYamlSpacing,
    writePnpmWorkSpaceYaml,
} from '@/utils'

export async function updatePnpmWorkSpaceYaml() {
    const pnpmWorkspaceYamlPath = await getPnpmWorkSpacePath()

    const pnpmWorkspaceYaml = parseDocument(await readFile(pnpmWorkspaceYamlPath, 'utf-8'))
    const workspaceJson = pnpmWorkspaceYaml.toJSON()

    const packagePath = await findUp('package.json', { cwd: ROOT_PATH })
    if (!packagePath) {
        console.error('no package.json found, aborting')
        process.exit(1)
    }
    const pkg = JSON.parse(await readFile(packagePath, 'utf-8'))

    const dependencies = pkg.dependencies || {}
    const devDependencies = pkg.devDependencies || {}
    const globalAll = { ...dependencies, ...devDependencies }
    const catalogs: {
        prod: Record<string, string>
        dev: Record<string, string>
        [key: string]: Record<string, string>
    } = {
        prod: { ...dependencies },
        dev: { ...devDependencies },
    }

    // console.log('install', pkg, pkgs, options)

    const packagePatterns = workspaceJson.packages || []
    const pkgJsonPaths = getPackageJsonPaths(packagePatterns)

    if (pkgJsonPaths.length > 0) {
        for (const pkgPath of pkgJsonPaths) {
            const pkg = await readFileContent(pkgPath)
            const pkgName = pkg.name || path.basename(path.dirname(pkgPath))

            const allDeps = { ...pkg.dependencies || {}, ...pkg.devDependencies || {} }

            const uniqueDeps: Record<string, string> = {}

            for (const [dep, version] of Object.entries(allDeps)) {
                const globalVersion = globalAll[dep]
                if (!globalVersion || globalVersion !== version) {
                    uniqueDeps[dep] = version
                }
            }

            if (Object.keys(uniqueDeps).length > 0) {
                catalogs[pkgName] = uniqueDeps
            }
        }
    }

    const workspaceYaml = {
        ...workspaceJson,
        catalogs: filterArray(deepMerge(catalogs, workspaceJson.catalogs)),
    }

    await writePnpmWorkSpaceYaml(pnpmWorkspaceYamlPath, workSpaceYamlSpacing(workspaceYaml))

    const packagePaths = construct(crush(pkgJsonPaths)) as Record<string, string>
    packagePaths[Object.keys(packagePaths).length.toString()] = packagePath

    await replaceDepsWithCatalogReference(Object.values(packagePaths), workspaceYaml.catalogs)
}
