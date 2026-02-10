/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_TELEGRAM_BOT_TOKEN: string
  readonly VITE_TELEGRAM_ADMIN_CHAT: string
  readonly VITE_WHATSAPP_PHONE_ID: string
  readonly VITE_WHATSAPP_ACCESS_TOKEN: string
  readonly VITE_KASPI_MERCHANT_ID: string
  readonly VITE_GA_ID: string
  readonly VITE_YM_ID: string
  readonly VITE_VAPID_PUBLIC_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
