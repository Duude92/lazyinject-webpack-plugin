export const resolveAndLoadModules = async (options?: IContainerOptions) => {
}

interface IContainerOptions {
    baseDir: string;
    catalogs?: string[];
    recursive?: boolean;
}