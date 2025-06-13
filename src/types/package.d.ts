
export interface IPackage {
    name:string
    version:string
    dependencies:{
        [key:string]:string
    }
    devDependencies:{
        [key:string]:string
    }
}

export type CatalogMap = Record<string, Record<string, string>>