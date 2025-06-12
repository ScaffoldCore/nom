import { defineConfig } from 'tsdown'

export default defineConfig({
    outDir: 'dist',
    clean: true,
    dts: true,
    shims: true,
    skipNodeModulesBundle: true,
})
