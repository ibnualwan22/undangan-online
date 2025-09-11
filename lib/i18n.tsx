"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "en" | "id" | "ar"

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string, params?: Record<string, string | number>) => string
  isRTL: boolean
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

const translations: Record<Language, any> = {
  en: require("./translations/en.json"),
  id: require("./translations/id.json"),
  ar: require("./translations/ar.json"),
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && ["en", "id", "ar"].includes(savedLanguage)) {
      setLanguage(savedLanguage)
    }
  }, [])

  useEffect(() => {
    // Save language to localStorage
    localStorage.setItem("language", language)

    // Set document direction for RTL languages
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr"
    document.documentElement.lang = language
  }, [language])

  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split(".")
    let value = translations[language]

    for (const k of keys) {
      value = value?.[k]
    }

    if (typeof value !== "string") {
      console.warn(`Translation key "${key}" not found for language "${language}"`)
      return key
    }

    // Replace parameters in the translation
    if (params) {
      return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
        return params[paramKey]?.toString() || match
      })
    }

    return value
  }

  const isRTL = language === "ar"

  return <I18nContext.Provider value={{ language, setLanguage, t, isRTL }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}
