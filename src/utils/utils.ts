import type { CatalogMap, IPackage } from '@/types/package'
import { readFile, writeFile } from 'node:fs/promises'
import path, { join } from 'node:path'
import { findUp } from 'find-up'
import { glob } from 'glob'
import { dim, yellow } from 'kleur/colors'
import { gt, minVersion, validRange } from 'semver'
import { Document, stringify } from 'yaml'
import { ROOT_PATH } from '@/utils/alias.ts'
import { version } from '../../package.json'

export function header() {
    console.log(`${yellow('nom')} ${dim(`v${version}`)}`)
}

/**
 * Get the path to the pnpm-workspace.yaml file
 */
export async function getPnpmWorkSpacePath(): Promise<string> {
    let pnpmWorkspaceYamlPath = await findUp('pnpm-workspace.yaml', {
        cwd: ROOT_PATH,
    })

    if (!pnpmWorkspaceYamlPath) {
        pnpmWorkspaceYamlPath = join(ROOT_PATH, 'pnpm-workspace.yaml')

        await writeFile(pnpmWorkspaceYamlPath, stringify({
            packages: ['packages/*'],
        }))
    }

    return pnpmWorkspaceYamlPath
}

/**
 * Write the pnpm-workspace.yaml file
 * @param workSpaceYamlPath
 * @param content
 */
export async function writePnpmWorkSpaceYaml(workSpaceYamlPath: string, content: string) {
    await writeFile(workSpaceYamlPath, content)
}

/**
 * Read the content of the file
 * @param path
 */
export async function readFileContent(path: string): Promise<IPackage> {
    return JSON.parse(await readFile(path, 'utf-8')) as IPackage
}

/**
 * Filter out empty objects and null values
 * @param obj
 */
export function filterArray<T extends object>(obj: T): Partial<T> {
    return Object.fromEntries(
        Object.entries(obj).filter(([_, value]) => {
            // 过滤空对象和空值（null/undefined）
            return (
                typeof value === 'object'
                    ? value !== null && Object.keys(value as object).length > 0
                    : value != null
            )
        }),
    ) as Partial<T>
}

/**
 * Get the paths of all package.json files
 * @param patterns
 */
export function getPackageJsonPaths(patterns: string[]): string[] {
    const allPaths = new Set<string>()

    for (const pattern of patterns) {
        const matches = glob.sync(`${pattern}/package.json`, {
            cwd: ROOT_PATH,
            absolute: true,
        })

        matches.forEach((pkgPath: string) => allPaths.add(pkgPath))
    }

    return Array.from(allPaths)
}

/**
 * Generate the content of the pnpm-workspace.yaml file
 * @param obj
 */
export function workSpaceYamlSpacing(obj: Record<string, any>) {
    const parts: string[] = []

    for (const [key, value] of Object.entries(obj)) {
        const doc = new Document()
        doc.set(key, value)
        parts.push(doc.toString().trim())
    }

    return `${parts.join('\n\n')}\n`
}

/**
 * Replacing dependency packages with directory references
 * @param pkgPaths
 * @param catalog
 */
export async function replaceDepsWithCatalogReference(pkgPaths: string[], catalog: CatalogMap) {
    for (const pkgPath of pkgPaths) {
        const pkg = JSON.parse(await readFile(pkgPath, 'utf8'))
        const subPackageName = path.basename(path.dirname(pkgPath))
        const replaceSection = (section: 'dependencies' | 'devDependencies') => {
            if (!pkg[section])
                return

            for (const [dep, version] of Object.entries(pkg[section])) {
                if (catalog.prod?.[dep] === version) {
                    pkg[section][dep] = 'catalog:prod'
                }
                else if (catalog.dev?.[dep] === version) {
                    pkg[section][dep] = 'catalog:dev'
                }
                else if (
                    subPackageName
                    && catalog[subPackageName]?.[dep] === version
                ) {
                    pkg[section][dep] = `catalog:${subPackageName}`
                }
            }
        }

        replaceSection('dependencies')
        replaceSection('devDependencies')

        await writeFile(pkgPath, JSON.stringify(pkg, null, 2))
    }
}

type PlainObject = Record<string, any>

/**
 * Deep merge two objects
 * @param target
 * @param source
 */
export function deepMergeVersion<T extends PlainObject, U extends PlainObject>(target: T, source: U): T & U {
    const result: any = { ...target }

    for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            const sourceValue = source[key]
            const targetValue = target[key]

            if (isObject(sourceValue) && isObject(targetValue)) {
                result[key] = deepMergeVersion(targetValue, sourceValue)
            }
            else if (isSemverLike(targetValue) && isSemverLike(sourceValue)) {
                const targetVersion = minVersion(targetValue)
                const sourceVersion = minVersion(sourceValue)

                if (targetVersion && sourceVersion) {
                    result[key] = gt(targetVersion, sourceVersion) ? targetValue : sourceValue
                }
                else {
                    result[key] = sourceValue
                }
            }
            else {
                result[key] = sourceValue
            }
        }
    }

    return result as T & U
}

/**
 * check if a value is an object
 * @param value
 */
export function isObject(value: unknown): value is PlainObject {
    return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/**
 * check if a value is a semver range
 * @param value
 */
export function isSemverLike(value: any): value is string {
    return typeof value === 'string'
        && !value.includes(':') // 排除 catalog:dev 这类
        && !!validRange(value) // 只允许合法 semver range
}
