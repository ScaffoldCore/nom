export interface ICommandOptions {
    rawName: string,
    description: string,
    config?: {},
}

export interface ICommander {
    rawName: string,
    description: string,
}

export interface ICommand {
    command: ICommander,
    options: ICommandOptions[],
    action: (...args: any[]) => any
}