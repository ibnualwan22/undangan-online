"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Globe } from "lucide-react"
import { useI18n } from "@/lib/i18n"

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "id", name: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
]

export function LanguageSwitcher() {
  const { language, setLanguage } = useI18n()

  return (
    <Select value={language} onValueChange={(value: "en" | "id" | "ar") => setLanguage(value)}>
      <SelectTrigger className="w-auto">
        <Globe className="h-4 w-4 mr-2" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            <span className="flex items-center gap-2">
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
