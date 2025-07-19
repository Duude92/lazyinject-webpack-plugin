import path from 'path';
import fastGlob from 'fast-glob';
import VirtualModulesPlugin from 'webpack-virtual-modules';
import {Compiler, NormalModuleReplacementPlugin} from 'webpack';

interface LazyInjectPluginOptions {
    configPath: string;
    virtualModuleName?: string;
}

class LazyInjectWebpackPlugin {
    private options: LazyInjectPluginOptions;
    private virtualModules = new VirtualModulesPlugin();

    public constructor() {
        this.options = {
            virtualModuleName: '__di-auto-imports.ts',
            configPath: path.join(process.cwd(), 'lazyinject.config.js')
        };
    }

    apply(compiler: Compiler) {
        this.virtualModules.apply(compiler);
        const modulePath = path.join(__dirname, 'virtualModuleLoader.js');
        compiler.options.plugins.push(new NormalModuleReplacementPlugin(/[\\/]moduleLoader\.js$/, modulePath))

        compiler.hooks.afterEnvironment.tap('LazyInjectWebpackPlugin', () => {
            const configAbsPath = path.resolve(this.options.configPath);
            const userConfig = require(configAbsPath);
            const catalogs: { path: string }[] = userConfig.default.catalogs || [];

            const files = this.resolveCatalogFiles(catalogs.map(catalog => catalog.path));
            const importCode = files
                .map((f) => `import './${f.replace(/\\/g, '/')}';`)
                .map(f => f.replace(/(.+[^.]).ts\'\;$/g, '$1\';\n'))
                .join('\n');

            const virtualModulePath = path.resolve(process.cwd(), this.options.virtualModuleName!);
            this.virtualModules.writeModule(virtualModulePath, importCode);

            console.log(`[LazyInject] Injected ${files.length} modules into ${this.options.virtualModuleName}`);
        });

        compiler.hooks.entryOption.tap('LazyInjectWebpackPlugin', (context, entry) => {
            const injectPath = path.resolve(process.cwd(), this.options.virtualModuleName!);
            const addEntries = (currentEntry: unknown) => {


                if (typeof currentEntry === 'string') {
                    return [currentEntry, injectPath];
                }
                if (Array.isArray(currentEntry)) {
                    currentEntry.push(injectPath);
                    return currentEntry
                }
                if (typeof currentEntry === 'object') {
                    const newEntry = currentEntry as Record<string, unknown>;
                    for (const key in currentEntry) {
                        newEntry[key] = addEntries(newEntry[key]);
                    }
                    return newEntry;
                }
                return currentEntry;
            };
            addEntries(entry);
            return;
        });
    }

    private resolveCatalogFiles(catalogs: string[]) {
        const patterns = catalogs.map((p) => `${p}/**/*.{ts,js}`);
        return fastGlob.sync(patterns, {
            cwd: process.cwd(),
            onlyFiles: true,
            ignore: ['**/*.d.ts'],
        });
    }
}

export = LazyInjectWebpackPlugin