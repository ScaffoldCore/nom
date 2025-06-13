import { x } from 'tinyexec'
import { ROOT_PATH } from '@/utils/alias.ts'

export async function run(args: string[]) {
    await x('pnpm', args, {
        nodeOptions: {
            stdio: 'inherit',
            cwd: ROOT_PATH,
        },
    })
}
