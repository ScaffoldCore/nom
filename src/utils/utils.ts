import { dim, yellow } from 'kleur/colors'
import { version } from '../../package.json'

export function header() {
    console.log(`${yellow('nom')} ${dim(`v${version}`)}`)
}
