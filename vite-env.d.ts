/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  // more env variables...
  readonly BASE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}