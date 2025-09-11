"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Locale } from "./i18n"
import { defaultLocale } from "./i18n"

type Messages = Record<string, any>

interface TranslationContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  messages: Messages
  t: (key: string, params?: Record<string, string>) => string
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

// Import all messages statically
import enMessages from "../messages/en.json"
import idMessages from "../messages/id.json"
import arMessages from "../messages/ar.json"

const messageMap = {
  en: enMessages,
  id: idMessages,
  ar: arMessages,
}

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)
  const [messages, setMessages] = useState<Messages>(messageMap[defaultLocale])

  useEffect(() => {
    // Load locale from localStorage on mount
    const savedLocale = localStorage.getItem("locale") as Locale
    if (savedLocale && ["en", "id", "ar"].includes(savedLocale)) {
      setLocaleState(savedLocale)
    }
  }, [])

  useEffect(() => {
    // Load messages for current locale
    setMessages(messageMap[locale] || messageMap[defaultLocale])
  }, [locale])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem("locale", newLocale)

    // Update document direction and lang
    document.documentElement.lang = newLocale
    document.documentElement.dir = newLocale === "ar" ? "rtl" : "ltr"
  }

  const t = (key: string, params?: Record<string, string>): string => {
    const keys = key.split(".")
    let value: any = messages

    for (const k of keys) {
      value = value?.[k]
    }

    if (typeof value !== "string") {
      console.warn(`Translation key "${key}" not found`)
      return key
    }

    // Replace parameters
    if (params) {
      return Object.entries(params).reduce((str, [param, replacement]) => str.replace(`{${param}}`, replacement), value)
    }

    return value
  }

  return (
    <TranslationContext.Provider value={{ locale, setLocale, messages, t }}>{children}</TranslationContext.Provider>
  )
}

export function useTranslations() {
  const context = useContext(TranslationContext)
  if (!context) {
    throw new Error("useTranslations must be used within a TranslationProvider")
  }
  return context
}
