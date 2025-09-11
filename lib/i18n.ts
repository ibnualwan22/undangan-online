export const locales = ["en", "id", "ar"] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "en"

export function getDirection(locale: Locale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr"
}

export function getLocaleDisplayName(locale: Locale): string {
  const names = {
    en: "English",
    id: "Bahasa Indonesia",
    ar: "العربية",
  }
  return names[locale]
}
