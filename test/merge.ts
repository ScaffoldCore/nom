import { deepMerge } from '@/utils'

console.log({
    ...{
        prod: { vue: '^3.5.16' },
        dev: {
            '@antfu/eslint-config-basic': '^0.39.3',
            '@femm/prettier': '^1.1.0',
            '@femm/verify-commit': '^1.0.1',
            'eslint': '^8.41.0',
            'eslint-config-prettier': '^8.8.0',
            'eslint-plugin-prettier': '^4.2.1',
            'husky': '^8.0.3',
            'lint-staged': '^13.2.2',
            'prettier': '^2.8.8',
        },
    },
    ...{
        prod: { axios: '^1.9.0', vue: 'catalog:prod' },
        dev: {
            '@antfu/eslint-config-basic': 'catalog:dev',
            '@femm/prettier': 'catalog:dev',
            '@femm/verify-commit': 'catalog:dev',
            'eslint': 'catalog:dev',
            'eslint-config-prettier': 'catalog:dev',
            'eslint-plugin-prettier': 'catalog:dev',
            'husky': 'catalog:dev',
            'lint-staged': 'catalog:dev',
            'prettier': 'catalog:dev',
        },
    },
})

console.log(deepMerge({
    prod: { axios: '^1.9.0', vue: 'catalog:prod' },
    dev: {
        '@antfu/eslint-config-basic': 'catalog:dev',
        '@femm/prettier': 'catalog:dev',
        '@femm/verify-commit': 'catalog:dev',
        'eslint': 'catalog:dev',
        'eslint-config-prettier': 'catalog:dev',
        'eslint-plugin-prettier': 'catalog:dev',
        'husky': 'catalog:dev',
        'lint-staged': 'catalog:dev',
        'prettier': 'catalog:dev',
    },
}, {
    prod: { vue: '^3.5.16' },
    dev: {
        '@antfu/eslint-config-basic': '^0.39.3',
        '@femm/prettier': '^1.1.0',
        '@femm/verify-commit': '^1.0.1',
        'eslint': '^8.41.0',
        'eslint-config-prettier': '^8.8.0',
        'eslint-plugin-prettier': '^4.2.1',
        'husky': '^8.0.3',
        'lint-staged': '^13.2.2',
        'prettier': '^2.8.8',
    },
}))
