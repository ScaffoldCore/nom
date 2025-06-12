import type { ICommand } from '@/types/command'
import add from './add'
import install from './install'
import remove from './remove'
import update from './update'

export default [
    add,
    remove,
    update,
    install,
] as ICommand[]
