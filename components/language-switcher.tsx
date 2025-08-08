"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Globe } from "lucide-react"
import { Language, languages, getCurrentLanguage, setLanguage } from "@/lib/i18n"

export function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState<Language>('en')

  useEffect(() => {
    setCurrentLang(getCurrentLanguage())
  }, [])

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang)
    setCurrentLang(lang)
    // Reload the page to apply language changes
    window.location.reload()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Globe className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(languages).map(([code, name]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => handleLanguageChange(code as Language)}
            className={currentLang === code ? "bg-accent" : ""}
          >
            {name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
