/// <reference types="vite/client" />

interface importMetaEnv {
    readonly VITE_APP_URL: string;
    readonly VITE_LOCALSTORAGE_KEY: string;
}

interface ImportMeta {
    readonly env: importMetaEnv;
}
