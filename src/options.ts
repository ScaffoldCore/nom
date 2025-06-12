export default [
    {
        rawName: '-D, -d, --dev',
        description: 'Install as dev dependency',
        config: { default: false },
    },
    {
        rawName: '-w, --workspace',
        description: 'Install in a workspace',
        config: { default: false },
    },
    {
        rawName: '-c, --catalog [catalog]',
        description: 'pnpm workspace catalog',
    },
]
