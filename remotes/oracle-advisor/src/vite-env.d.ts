/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_KEY: string
  readonly VITE_ENABLE_ORACLE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
